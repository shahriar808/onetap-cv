from io import BytesIO

from pypdf import PdfReader
import pytest

from app.schemas.resume import ResumeData
from app.services.render_service import render_html, render_pdf


@pytest.mark.parametrize("template_id", ["modern", "classic", "compact"])
def test_template_html_contains_contact_and_resume_content(
    sample_resume: ResumeData,
    template_id: str,
) -> None:
    html = render_html(sample_resume, template_id)

    assert "Shahriar Hasan" in html
    assert "shahriar@example.com" in html
    assert f'class="tpl-{template_id}"' in html
    assert 'href="https://github.com/shahriar-hasan-example"' in html
    assert "GitHub" in html
    header = html.split("</header>", 1)[0]
    assert header.index("Shahriar Hasan") < header.index(
        "Dhaka, Bangladesh"
    )
    assert header.index("Dhaka, Bangladesh") < header.index(
        "+1 555 010 2000"
    )
    assert header.index("+1 555 010 2000") < header.index("LinkedIn")
    assert ">github.com/shahriar-hasan-example<" not in header
    experience_start = html.index("Work Experience")
    company = html.index("Example Labs", experience_start)
    position = html.index("Software Engineer", experience_start)
    if template_id == "classic":
        assert company < position
    elif template_id == "modern":
        assert position < company
    else:
        assert "Software Engineer, Example Labs" in html


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


@pytest.mark.parametrize("template_id", ["modern", "classic", "compact"])
def test_render_pdf_contains_selectable_text_in_reading_order(
    sample_resume: ResumeData,
    template_id: str,
) -> None:
    pdf = render_pdf(sample_resume, template_id)

    assert pdf.startswith(b"%PDF")
    text = pdf_text(pdf)
    name_position = text.index("Shahriar Hasan")
    email_position = text.index("shahriar@example.com")
    experience_heading = "WORK EXPERIENCE"
    experience_start = text.index(experience_heading)
    company_position = text.index("Example Labs", experience_start)
    position_position = text.index("Software Engineer", experience_start)
    if template_id == "classic":
        assert name_position < email_position < company_position < position_position
    elif template_id == "modern":
        assert name_position < email_position < position_position < company_position
    else:
        assert name_position < email_position < company_position
    assert "GitHub" in text
    assert "linkedin.com/in/shahriar-hasan-example" in text
    assert "github.com/shahriar-hasan-example" in text
    assert text.index("Programming Languages") < text.index("Frontend Frameworks")


@pytest.mark.parametrize("template_id", ["modern", "classic", "compact"])
def test_render_pdf_omits_disabled_sections(
    sample_resume: ResumeData,
    template_id: str,
) -> None:
    sample_resume.enabled_sections = ["experience"]
    sample_resume.section_order = ["experience"]

    text = pdf_text(render_pdf(sample_resume, template_id))

    assert "Example Labs" in text
    assert "Professional Summary" not in text
    assert "Programming Languages" not in text


@pytest.mark.parametrize("template_id", ["modern", "classic", "compact"])
def test_templates_use_configured_layout_and_skills_styles(
    sample_resume: ResumeData,
    template_id: str,
) -> None:
    html = render_html(sample_resume, template_id)
    experience = html.split(
        'class="resume-section section-experience"', 1
    )[1].split("</section>", 1)[0]

    if template_id == "compact":
        assert 'class="line2"' not in experience
        assert html.count('class="skills-inline"') == 1
        assert 'class="skills-line"' not in html
    else:
        assert 'class="line2"' in experience
        assert html.count('class="skills-line"') > 1
        assert 'class="skills-inline"' not in html


def test_render_pdf_omits_enabled_but_empty_sections(sample_resume: ResumeData) -> None:
    sample_resume.enabled_sections = ["summary", "projects"]
    sample_resume.section_order = ["summary", "projects"]
    sample_resume.summary.text = ""
    sample_resume.projects = []

    text = pdf_text(render_pdf(sample_resume, "modern"))

    assert "Professional Summary" not in text
    assert "Projects" not in text
