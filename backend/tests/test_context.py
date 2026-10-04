from app.schemas.resume import ResumeData
from app.services.render_service import build_context


def test_build_context_formats_contact_and_links(sample_resume: ResumeData) -> None:
    context = build_context(sample_resume)

    assert context["contact"] == {
        "full_name": "MD Shahriar Hasan",
        "job_title": "Software Engineer",
        "contact_line": (
            "Banasree, Rampura, Dhaka-1219, Bangladesh | "
            "+8801763785508 | shasan5525@gmail.com"
        ),
        "links": [
            {
                "label": "LinkedIn",
                "text": "linkedin.com/in/shahriarhasan808",
                "href": "https://www.linkedin.com/in/shahriarhasan808/",
            },
            {
                "label": "GitHub",
                "text": "github.com/shahriar808",
                "href": "https://github.com/shahriar808",
            },
            {
                "label": "LeetCode",
                "text": "leetcode.com/u/MD_Shahriar_Hasan",
                "href": "https://leetcode.com/u/MD_Shahriar_Hasan",
            },
        ],
    }


def test_build_context_skips_links_without_urls(sample_resume: ResumeData) -> None:
    sample_resume.contact.links[0].url = ""

    context = build_context(sample_resume)

    assert len(context["contact"]["links"]) == 2  # type: ignore[index]


def test_build_context_skips_empty_contact_parts(sample_resume: ResumeData) -> None:
    sample_resume.contact.location = ""

    context = build_context(sample_resume)

    assert context["contact"]["contact_line"] == (  # type: ignore[index]
        "+8801763785508 | shasan5525@gmail.com"
    )


def test_build_context_filters_and_orders_enabled_sections(
    sample_resume: ResumeData,
) -> None:
    sample_resume.enabled_sections = ["skills", "summary", "projects"]
    sample_resume.section_order = ["summary", "skills", "experience"]

    context = build_context(sample_resume)

    assert [section["id"] for section in context["sections"]] == [  # type: ignore[index]
        "summary",
        "skills",
        "projects",
    ]
    assert [section["label"] for section in context["sections"]] == [  # type: ignore[index]
        "Professional Summary",
        "Skills",
        "Projects",
    ]
    assert [section["kind"] for section in context["sections"]] == [  # type: ignore[index]
        "text",
        "list",
        "list",
    ]


def test_build_context_appends_enabled_sections_missing_from_order(
    sample_resume: ResumeData,
) -> None:
    sample_resume.enabled_sections = ["summary", "skills"]
    sample_resume.section_order = ["summary"]

    context = build_context(sample_resume)

    assert [section["id"] for section in context["sections"]] == [  # type: ignore[index]
        "summary",
        "skills",
    ]
