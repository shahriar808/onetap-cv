from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.config import ALLOWED_ORIGINS, MAX_BODY_BYTES
from app.limiter import limiter
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
