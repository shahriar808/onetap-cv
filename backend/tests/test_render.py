from io import BytesIO

from pypdf import PdfReader
import pytest

from app.schemas.resume import ResumeData
from app.services.render_service import render_html, render_pdf


@pytest.mark.parametrize("template_id", ["modern", "classic"])
def test_template_html_contains_contact_and_resume_content(
    sample_resume: ResumeData,
    template_id: str,
) -> None:
    html = render_html(sample_resume, template_id)

    assert "MD Shahriar Hasan" in html
    assert "shasan5525@gmail.com" in html
    assert f'class="tpl-{template_id}"' in html
    assert "github.com/shahriar808" in html
    experience_start = html.index("Work Experience")
    company = html.index("Ternary Solutions", experience_start)
    position = html.index("Software Engineer", experience_start)
    if template_id == "classic":
        assert company < position
    else:
        assert position < company


def test_render_html_escapes_user_content(sample_resume: ResumeData) -> None:
    sample_resume.experience[0].company = "<script>alert(1)</script>"

    html = render_html(sample_resume, "modern")

    assert "&lt;script&gt;alert(1)&lt;/script&gt;" in html
    assert "<script>alert(1)</script>" not in html


def test_render_html_omits_disabled_sections(sample_resume: ResumeData) -> None:
    sample_resume.enabled_sections = ["experience"]
    sample_resume.section_order = ["experience"]

    html = render_html(sample_resume, "modern")

    assert "Work Experience" in html
    assert "Professional Summary" not in html
    assert "Programming Languages" not in html


def pdf_text(pdf: bytes) -> str:
    reader = PdfReader(BytesIO(pdf))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


@pytest.mark.parametrize("template_id", ["modern", "classic"])
def test_render_pdf_contains_selectable_text_in_reading_order(
    sample_resume: ResumeData,
    template_id: str,
) -> None:
    pdf = render_pdf(sample_resume, template_id)

    assert pdf.startswith(b"%PDF")
    text = pdf_text(pdf)
    name_position = text.index("MD Shahriar Hasan")
    email_position = text.index("shasan5525@gmail.com")
    experience_heading = "Work Experience" if template_id == "classic" else "WORK EXPERIENCE"
    experience_start = text.index(experience_heading)
    company_position = text.index("Ternary Solutions", experience_start)
    position_position = text.index("Software Engineer", experience_start)
    if template_id == "classic":
        assert name_position < email_position < company_position < position_position
    else:
        assert name_position < email_position < position_position < company_position
    assert "github.com/shahriar808" in text
    assert text.index("Programming Languages") < text.index("Frontend Frameworks")


@pytest.mark.parametrize("template_id", ["modern", "classic"])
def test_render_pdf_omits_disabled_sections(
    sample_resume: ResumeData,
    template_id: str,
) -> None:
    sample_resume.enabled_sections = ["experience"]
    sample_resume.section_order = ["experience"]

    text = pdf_text(render_pdf(sample_resume, template_id))

    assert "Ternary Solutions" in text
    assert "Professional Summary" not in text
    assert "Programming Languages" not in text


def test_render_pdf_omits_enabled_but_empty_sections(sample_resume: ResumeData) -> None:
    sample_resume.enabled_sections = ["summary", "projects"]
    sample_resume.section_order = ["summary", "projects"]
    sample_resume.summary.text = ""
    sample_resume.projects = []

    text = pdf_text(render_pdf(sample_resume, "modern"))

    assert "Professional Summary" not in text
    assert "Projects" not in text
