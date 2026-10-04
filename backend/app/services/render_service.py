from app.schemas.resume import ResumeData
from app.services.formatting import display_url, href_url


def build_context(data: ResumeData) -> dict[str, object]:
    contact = data.contact
    contact_parts = [contact.location, contact.phone, str(contact.email)]
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
        }
    }
