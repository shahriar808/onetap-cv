from io import BytesIO

from pypdf import PdfReader

from app.schemas.resume import ResumeData
from app.services.render_service import render_html, render_pdf


def test_modern_html_contains_contact_and_resume_content(
    sample_resume: ResumeData,
) -> None:
    html = render_html(sample_resume, "modern")

    assert "MD Shahriar Hasan" in html
    assert "shasan5525@gmail.com" in html
    assert 'class="tpl-modern"' in html
    assert "github.com/shahriar808" in html
    assert html.index("Software Engineer") < html.index("Ternary Solutions")


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


def test_render_pdf_contains_selectable_text_in_reading_order(
    sample_resume: ResumeData,
) -> None:
    pdf = render_pdf(sample_resume, "modern")

    assert pdf.startswith(b"%PDF")
    text = pdf_text(pdf)
    name_position = text.index("MD Shahriar Hasan")
    email_position = text.index("shasan5525@gmail.com")
    company_position = text.index("Ternary Solutions")

    assert name_position < email_position < company_position
    assert "github.com/shahriar808" in text
    assert text.index("Programming Languages") < text.index("Frontend Frameworks")


def test_render_pdf_omits_disabled_sections(sample_resume: ResumeData) -> None:
    sample_resume.enabled_sections = ["experience"]
    sample_resume.section_order = ["experience"]

    text = pdf_text(render_pdf(sample_resume, "modern"))

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
