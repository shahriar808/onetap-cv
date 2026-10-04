from app.schemas.resume import ResumeData
from app.services.render_service import build_context


def test_build_context_formats_contact_and_links(sample_resume: ResumeData) -> None:
    context = build_context(sample_resume)

    assert context["contact"] == {
        "full_name": "MD Shahriar Hasan",
        "job_title": "Software Engineer",
        "address_line": "Banasree, Rampura, Dhaka-1219, Bangladesh",
        "contact_line": "+8801763785508 | shasan5525@gmail.com",
        "links": [
            {
                "label": "LinkedIn",
                "text": "LinkedIn",
                "href": "https://www.linkedin.com/in/shahriarhasan808/",
            },
            {
                "label": "GitHub",
                "text": "GitHub",
                "href": "https://github.com/shahriar808",
            },
            {
                "label": "LeetCode",
                "text": "LeetCode",
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

    assert context["contact"]["address_line"] == ""  # type: ignore[index]
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


def test_build_context_precomputes_section_item_fields(sample_resume: ResumeData) -> None:
    context = build_context(sample_resume)
    sections = {section["id"]: section for section in context["sections"]}

    assert sections["experience"]["items"][0]["dates"] == "Dec 2025 – Present"
    assert sections["education"]["items"][0]["gpa_text"] == "CGPA: 3.41"
    assert (
        sections["skills"]["items"][0]["text"]
        == "Java, Python, TypeScript, HTML, CSS, JavaScript"
    )
    assert sections["certifications"]["items"][0]["date_text"] == "Ongoing"


def test_build_context_drops_empty_items_bullets_and_sections(
    sample_resume: ResumeData,
) -> None:
    sample_resume.enabled_sections = [
        "experience",
        "education",
        "skills",
        "projects",
        "summary",
        "interests",
    ]
    sample_resume.section_order = sample_resume.enabled_sections.copy()
    sample_resume.experience = [sample_resume.experience[0]]
    sample_resume.experience[0].bullets = ["", "  ", "Kept bullet"]
    sample_resume.experience.append(
        type(sample_resume.experience[0])(id="empty", bullets=["", "  "])
    )
    sample_resume.skills = [
        type(sample_resume.skills[0])(id="empty", group_name=" ", items=[""])
    ]
    sample_resume.projects = []
    sample_resume.summary.text = " "
    sample_resume.interests.items = []

    context = build_context(sample_resume)
    sections = {section["id"]: section for section in context["sections"]}

    assert sections.keys() == {"experience", "education"}
    assert sections["experience"]["items"][0]["bullets"] == ["Kept bullet"]
    assert len(sections["experience"]["items"]) == 1


def test_build_context_formats_project_links_and_interests(
    sample_resume: ResumeData,
) -> None:
    sample_resume.enabled_sections = ["projects", "interests"]
    sample_resume.section_order = ["projects", "interests"]
    sample_resume.interests.items = ["  Reading ", "", "Hiking"]
    sample_resume.projects[0].links = [
        type(sample_resume.projects[0].links[0])(
            label="GitHub", url="https://github.com/example/"
        ),
        type(sample_resume.projects[0].links[0])(label="Demo", url=" "),
    ]

    context = build_context(sample_resume)
    sections = {section["id"]: section for section in context["sections"]}

    assert sections["interests"]["text"] == "Reading, Hiking"
    assert sections["projects"]["items"][0]["links"] == [
        {
            "label": "GitHub",
            "text": "GitHub",
            "href": "https://github.com/example/",
        }
    ]
