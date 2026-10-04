from app.schemas.resume import ResumeData
from app.services.formatting import display_url, href_url

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


def build_context(data: ResumeData) -> dict[str, object]:
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

    return {
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
        "sections": [
            {
                "id": section_id,
                "label": SECTION_LABELS[section_id],
                "kind": "text" if section_id in {"summary", "interests"} else "list",
                "items": [],
            }
            for section_id in section_order
        ],
    }
