from io import BytesIO

import pytest
from pypdf import PdfReader

from app.services.render_service import render_pdf


@pytest.mark.parametrize("template_id", ["classic", "modern", "compact"])
def test_long_resume_renders_to_multiple_pages(long_resume, template_id: str) -> None:
    pdf = render_pdf(long_resume, template_id)
    pages = PdfReader(BytesIO(pdf)).pages

    assert pdf.startswith(b"%PDF")
    assert len(pages) >= 2
