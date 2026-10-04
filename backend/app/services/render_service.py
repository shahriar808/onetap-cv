from typing import Any

from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup
from weasyprint import HTML

from app.schemas.resume import ResumeData
from app.services.formatting import date_range, display_url, fmt_date, href_url
from app.templates_engine.registry import BASE, get_template_dir

SECTION_LABELS = {
    "summary": "Professional Summary",
    "experience": "Work Experience",
    "education": "Education",
    "skills": "Skills",
    "projects": "Projects",
    "certifications": "Certifications",
    "achievements": "Achievements",
    "languages": "Languages",
    "publications": "Publications",
    "volunteer": "Volunteer Experience",
    "interests": "Interests",
    "references": "References",
}


def _has_content(item: dict[str, Any]) -> bool:
    return any(
        bool(value.strip()) if isinstance(value, str) else bool(value)
        for value in item.values()
    )


def _links(links: list[Any]) -> list[dict[str, str]]:
    return [
        {
            "label": link.label,
            "text": display_url(link.url),
            "href": href_url(link.url),
        }
        for link in links
        if link.url.strip()
    ]


def _bullets(bullets: list[str]) -> list[str]:
    return [bullet.strip() for bullet in bullets if bullet.strip()]


def _section_items(data: ResumeData, section_id: str) -> tuple[str, list[dict[str, Any]]]:
    if section_id == "summary":
        return data.summary.text.strip(), []

    if section_id == "interests":
        return ", ".join(item.strip() for item in data.interests.items if item.strip()), []

    items: list[dict[str, Any]]
    if section_id == "experience":
        items = [
            {
                "position": item.position.strip(),
                "company": item.company.strip(),
                "location": item.location.strip(),
                "dates": date_range(item.start, item.end, item.is_current),
                "summary": item.summary.strip(),
                "bullets": _bullets(item.bullets),
            }
            for item in data.experience
        ]
    elif section_id == "education":
        items = [
            {
                "institution": item.institution.strip(),
                "degree_line": ", ".join(
                    part for part in (item.degree.strip(), item.field.strip()) if part
                ),
                "location": item.location.strip(),
                "dates": date_range(item.start, item.end),
                "gpa_text": f"{item.gpa_label}: {item.gpa.strip()}" if item.gpa.strip() else "",
                "details": _bullets(item.details),
            }
            for item in data.education
        ]
    elif section_id == "skills":
        items = [
            {
                "group": item.group_name.strip(),
                "text": ", ".join(value.strip() for value in item.items if value.strip()),
            }
            for item in data.skills
        ]
    elif section_id == "projects":
        items = [
            {
                "name": item.name.strip(),
                "description": item.description.strip(),
                "tech_stack": item.tech_stack.strip(),
                "dates": date_range(item.start, item.end),
                "links": _links(item.links),
                "bullets": _bullets(item.bullets),
            }
            for item in data.projects
        ]
    elif section_id == "certifications":
        items = [
            {
                "name": item.name.strip(),
                "issuer": item.issuer.strip(),
                "date_text": "Ongoing" if item.is_ongoing else fmt_date(item.date),
                "link": (
                    {"text": display_url(item.link), "href": href_url(item.link)}
                    if item.link.strip()
                    else None
                ),
            }
            for item in data.certifications
        ]
    elif section_id == "achievements":
        items = [
            {
                "title": item.title.strip(),
                "description": item.description.strip(),
                "date": fmt_date(item.date),
            }
            for item in data.achievements
        ]
    elif section_id == "languages":
        items = [
            {
                "language": item.language.strip(),
                "proficiency": item.proficiency.strip(),
            }
            for item in data.languages
        ]
    elif section_id == "publications":
        items = [
            {
                "title": item.title.strip(),
                "publisher": item.publisher.strip(),
                "date": fmt_date(item.date),
                "link": (
                    {"text": display_url(item.link), "href": href_url(item.link)}
                    if item.link.strip()
                    else None
                ),
            }
            for item in data.publications
        ]
    elif section_id == "volunteer":
        items = [
            {
                "role": item.role.strip(),
                "organization": item.organization.strip(),
                "dates": date_range(item.start, item.end),
                "bullets": _bullets(item.bullets),
            }
            for item in data.volunteer
        ]
    elif section_id == "references":
        items = [
            {
                "name": item.name.strip(),
                "line": ", ".join(
                    part for part in (item.position.strip(), item.company.strip()) if part
                ),
                "email": item.email.strip(),
                "phone": item.phone.strip(),
            }
            for item in data.references
        ]
    else:
        raise ValueError(f"Unsupported section: {section_id}")

    return "", [item for item in items if _has_content(item)]


def build_context(data: ResumeData) -> dict[str, Any]:
    contact = data.contact
    contact_parts = [contact.location, contact.phone, str(contact.email)]
    enabled = set(data.enabled_sections)
    section_order = [
        section_id
        for section_id in data.section_order
        if section_id in enabled
    ]
    section_order.extend(
        section_id
        for section_id in data.enabled_sections
        if section_id not in section_order
    )

    context: dict[str, Any] = {
        "contact": {
            "full_name": contact.full_name,
            "job_title": contact.job_title,
            "contact_line": " | ".join(part for part in contact_parts if part),
            "links": [
                {
                    "label": link.type,
                    "text": display_url(link.url),
                    "href": href_url(link.url),
                }
                for link in contact.links
                if link.url.strip()
            ],
        },
        "sections": [],
    }
    for section_id in section_order:
        text, items = _section_items(data, section_id)
        if not text and not items:
            continue
        context["sections"].append(
            {
                "id": section_id,
                "label": SECTION_LABELS[section_id],
                "kind": "text" if section_id in {"summary", "interests"} else "list",
                "items": items,
                "text": text,
            }
        )
    return context


def render_html(data: ResumeData, template_id: str) -> str:
    template_dir = get_template_dir(template_id)
    environment = Environment(
        loader=FileSystemLoader([str(template_dir), str(BASE / "base")]),
        autoescape=True,
    )
    context = build_context(data)
    context["css"] = Markup(
        (BASE / "base" / "base.css").read_text(encoding="utf-8")
        + "\n"
        + (template_dir / "style.css").read_text(encoding="utf-8")
    )
    return environment.get_template("template.html.j2").render(**context)


def render_pdf(data: ResumeData, template_id: str) -> bytes:
    return HTML(string=render_html(data, template_id)).write_pdf()


def render_preview_html(data: ResumeData, template_id: str) -> str:
    html = render_html(data, template_id)
    preview_styles = (
        "<style>@media screen{body{width:794px;box-sizing:border-box;"
        "padding:0.6in;margin:0 auto;background:#fff}}</style>"
    )
    return html.replace("</head>", f"{preview_styles}</head>", 1)
