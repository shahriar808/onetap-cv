from fastapi import APIRouter, HTTPException, Request
from starlette.concurrency import run_in_threadpool

from app import config
from app.limiter import limiter
from app.schemas.feedback import FeedbackIn
from app.services.email_service import is_configured, send_feedback_email

router = APIRouter(prefix="/api")


@router.post("/feedback")
@limiter.limit(lambda: config.FEEDBACK_RATE_LIMIT)
async def submit_feedback(request: Request, payload: FeedbackIn) -> dict[str, bool]:
    if payload.website:
        return {"ok": True}
    if payload.elapsed_ms < 2000:
        return {"ok": True}
    if not is_configured():
        raise HTTPException(
            status_code=503,
            detail="Feedback is temporarily unavailable",
        )

    try:
        await run_in_threadpool(send_feedback_email, payload)
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Feedback is temporarily unavailable",
        ) from None

    return {"ok": True}
