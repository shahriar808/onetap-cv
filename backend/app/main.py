from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.types import ASGIApp, Message, Receive, Scope, Send
from starlette.middleware.base import RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.config import ALLOWED_ORIGINS, MAX_BODY_BYTES
from app.limiter import limiter
from app.api.feedback import router as feedback_router
from app.api.health import router as health_router
from app.api.resume import router as resume_router
from app.api.templates import router as templates_router

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
    allow_credentials=False,
)
app.include_router(health_router)
app.include_router(templates_router)
app.include_router(resume_router)
app.include_router(feedback_router)


@app.exception_handler(Exception)
async def handle_unexpected_error(request: Request, exception: Exception) -> JSONResponse:
    return JSONResponse(status_code=500, content={"detail": "Server error"})


@app.middleware("http")
async def limit_request_body_size(
    request: Request,
    call_next: RequestResponseEndpoint,
) -> Response:
    content_length = request.headers.get("content-length")
    if content_length is not None:
        if not content_length.isdecimal():
            return JSONResponse(
                status_code=400,
                content={"detail": "Invalid Content-Length"},
            )
        if int(content_length) > MAX_BODY_BYTES:
            return JSONResponse(
                status_code=413,
                content={"detail": "Request too large"},
            )
    return await call_next(request)


class FeedbackBodySizeLimitMiddleware:
    def __init__(self, app: ASGIApp, max_bytes: int = 10 * 1024) -> None:
        self.app = app
        self.max_bytes = max_bytes

    async def __call__(
        self,
        scope: Scope,
        receive: Receive,
        send: Send,
    ) -> None:
        if scope["type"] != "http" or scope["path"] != "/api/feedback":
            await self.app(scope, receive, send)
            return

        content_length = next(
            (
                value.decode("latin-1")
                for name, value in scope["headers"]
                if name.lower() == b"content-length"
            ),
            None,
        )
        if content_length is not None and content_length.isdecimal():
            if int(content_length) > self.max_bytes:
                response = JSONResponse(
                    status_code=413,
                    content={"detail": "Request too large"},
                )
                await response(scope, receive, send)
                return

        body = bytearray()
        more_body = True
        while more_body:
            message = await receive()
            if message["type"] == "http.disconnect":
                return
            chunk = message.get("body", b"")
            if len(body) + len(chunk) > self.max_bytes:
                response = JSONResponse(
                    status_code=413,
                    content={"detail": "Request too large"},
                )
                await response(scope, receive, send)
                return
            body.extend(chunk)
            more_body = message.get("more_body", False)

        request_body = bytes(body)
        body_sent = False

        async def replay_body() -> Message:
            nonlocal body_sent
            if not body_sent:
                body_sent = True
                return {
                    "type": "http.request",
                    "body": request_body,
                    "more_body": False,
                }
            return await receive()

        await self.app(scope, replay_body, send)


app.add_middleware(FeedbackBodySizeLimitMiddleware)
