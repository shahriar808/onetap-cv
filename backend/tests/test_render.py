from app.schemas.resume import ResumeData
from app.services.render_service import render_html


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
