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


def test_experience_macro_renders_bullets_only_when_present() -> None:
    macro = environment.get_template("sections.html.j2").module.render_experience
    html = macro(
        [
            {
                "position": "Engineer",
                "company": "Example",
                "location": "",
                "dates": "2024",
                "summary": "Built systems",
                "bullets": ["First", "Second"],
            },
            {
                "position": "Intern",
                "company": "Other",
                "location": "",
                "dates": "",
                "summary": "",
                "bullets": [],
            },
        ],
        "position_first",
    )

    assert "<li>First</li>" in html
    assert "<li>Second</li>" in html
    assert html.count("<ul>") == 1
    assert "Built systems" in html


def test_experience_inline_macro_joins_fields_in_reading_order() -> None:
    macro = environment.get_template("sections.html.j2").module.render_experience
    html = macro(
        [
            {
                "position": "Engineer",
                "company": "Example",
                "location": "Dhaka",
                "dates": "2024",
                "summary": "",
                "bullets": [],
            }
        ],
        "inline",
    )

    assert "Engineer, Example, Dhaka" in html
    assert 'class="line2"' not in html


def test_education_macro_swaps_institution_and_degree_by_layout() -> None:
    macro = environment.get_template("sections.html.j2").module.render_education
    item = {
        "institution": "Example University",
        "degree_line": "BSc, Computing",
        "location": "Dhaka",
        "dates": "2024",
        "gpa_text": "CGPA: 3.41",
        "details": [],
    }

    classic = macro([item], "company_first")
    modern = macro([item], "position_first")

    assert classic.index("Example University") < classic.index("BSc, Computing")
    assert modern.index("BSc, Computing") < modern.index("Example University")
    assert "CGPA: 3.41" in classic


def test_skills_macro_renders_lines_and_inline_styles() -> None:
    macro = environment.get_template("sections.html.j2").module.render_skills
    items = [
        {"group": "Languages", "text": "Java, Python"},
        {"group": "Frameworks", "text": "React, FastAPI"},
    ]

    lines = macro(items, "lines")
    inline = macro(items, "inline")

    assert lines.count('class="skills-line"') == 2
    assert inline.count('class="skills-inline"') == 1
    assert "Languages:</strong> Java, Python | <strong>Frameworks:" in inline


def test_projects_macro_renders_visible_links_and_compact_layout() -> None:
    macro = environment.get_template("sections.html.j2").module.render_projects
    item = {
        "name": "Project",
        "description": "Short description",
        "tech_stack": "Python",
        "dates": "",
        "links": [{"label": "GitHub", "text": "github.com/example", "href": "https://github.com/example"}],
        "bullets": ["Built a feature"],
    }

    standard = macro([item], "position_first")
    compact = macro([item], "inline")

    assert '<a href="https://github.com/example">github.com/example</a>' in standard
    assert "<li>Built a feature</li>" in standard
    assert "Project - Python" in compact
    assert "Short description" in compact
    assert '<a href="https://github.com/example">github.com/example</a>' in compact


def test_compact_projects_omit_long_descriptions() -> None:
    macro = environment.get_template("sections.html.j2").module.render_projects
    item = {
        "name": "Project",
        "description": "x" * 91,
        "tech_stack": "",
        "dates": "",
        "links": [],
        "bullets": [],
    }

    compact = macro([item], "inline")

    assert "x" * 91 not in compact
