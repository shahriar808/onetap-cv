from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse, Response

from app.schemas.resume import ResumeData
from app.services.formatting import safe_filename
from app.services.render_service import render_pdf, render_preview_html
from app.templates_engine.registry import TEMPLATES

router = APIRouter(prefix="/api/resume")


@router.post("/preview", response_class=HTMLResponse)
def preview_resume(data: ResumeData, template: str = "modern") -> HTMLResponse:
    if template not in TEMPLATES:
        raise HTTPException(status_code=404, detail="Unknown template")
    return HTMLResponse(content=render_preview_html(data, template))


@router.post("/pdf")
def download_resume(data: ResumeData, template: str = "modern") -> Response:
    if template not in TEMPLATES:
        raise HTTPException(status_code=404, detail="Unknown template")
    filename = safe_filename(data.contact.full_name)
    return Response(
        content=render_pdf(data, template),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
