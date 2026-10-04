from pathlib import Path

from jinja2 import Environment, FileSystemLoader

BASE_DIR = Path(__file__).parents[1] / "app" / "templates_engine" / "base"
environment = Environment(loader=FileSystemLoader(str(BASE_DIR)), autoescape=True)


def entry_head(**kwargs: str) -> str:
    return environment.get_template("sections.html.j2").module.entry_head(**kwargs)


def test_company_first_macro_preserves_dom_order() -> None:
    html = entry_head(
        layout="company_first",
        primary="Ternary Solutions",
        secondary="Software Engineer",
        meta="Dhaka",
        dates="Dec 2025 – Present",
    )

    assert html.index("Ternary Solutions") < html.index("Software Engineer")
    assert html.index("Ternary Solutions") < html.index("Dec 2025")
    assert html.index("Software Engineer") < html.index("Dhaka")


def test_inline_macro_has_no_second_line() -> None:
    html = entry_head(
        layout="inline",
        primary="Software Engineer, Ternary Solutions, Dhaka",
        secondary="",
        meta="",
        dates="2025",
    )

    assert 'class="line2"' not in html
    assert "Software Engineer, Ternary Solutions, Dhaka" in html


def test_entry_head_skips_empty_values_and_escapes_html() -> None:
    html = entry_head(
        layout="position_first",
        primary="<b>Engineer</b>",
        secondary="",
        meta="",
        dates="",
    )

    assert "&lt;b&gt;Engineer&lt;/b&gt;" in html
    assert 'class="entry-dates"' not in html
    assert 'class="line2"' not in html
    assert "<span></span>" not in html
