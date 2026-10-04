from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse, Response

from app import config
from app.limiter import limiter
from app.schemas.resume import ResumeData
from app.services.formatting import safe_filename
from app.services.render_service import render_pdf, render_preview_html
from app.templates_engine.registry import TEMPLATES

router = APIRouter(prefix="/api/resume")


@router.post("/preview", response_class=HTMLResponse)
@limiter.limit(lambda: config.RATE_LIMIT)
def preview_resume(
    request: Request,
    data: ResumeData,
    template: str = "modern",
) -> HTMLResponse:
    if template not in TEMPLATES:
        raise HTTPException(status_code=404, detail="Unknown template")
    return HTMLResponse(content=render_preview_html(data, template))


@router.post("/pdf")
@limiter.limit(lambda: config.RATE_LIMIT)
def download_resume(
    request: Request,
    data: ResumeData,
    template: str = "modern",
) -> Response:
    if template not in TEMPLATES:
        raise HTTPException(status_code=404, detail="Unknown template")
    filename = safe_filename(data.contact.full_name)
    return Response(
        content=render_pdf(data, template),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
