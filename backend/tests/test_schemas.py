import pytest
from pydantic import ValidationError

from app.schemas.resume import Contact, EducationItem, ExperienceItem, LinkItem


def valid_contact(**overrides: object) -> dict[str, object]:
    contact: dict[str, object] = {
        "full_name": "Taylor Example",
        "email": "taylor@example.com",
        "phone": "+1 555 555 0100",
    }
    contact.update(overrides)
    return contact


def test_contact_accepts_valid_data() -> None:
    contact = Contact.model_validate(valid_contact())

    assert contact.email == "taylor@example.com"
    assert contact.links == []


def test_contact_requires_nonempty_name() -> None:
    with pytest.raises(ValidationError):
        Contact.model_validate(valid_contact(full_name=""))


def test_contact_requires_valid_email() -> None:
    with pytest.raises(ValidationError):
        Contact.model_validate(valid_contact(email="not-an-email"))


def test_contact_limits_links_to_six() -> None:
    links = [LinkItem(type="GitHub", url=f"github.com/{index}") for index in range(7)]

    with pytest.raises(ValidationError):
        Contact.model_validate(valid_contact(links=links))


def test_contact_requires_phone_with_at_least_five_characters() -> None:
    with pytest.raises(ValidationError):
        Contact.model_validate(valid_contact(phone="123"))


def test_link_item_rejects_unknown_type() -> None:
    with pytest.raises(ValidationError):
        LinkItem(type="Mastodon", url="example.com")


@pytest.mark.parametrize("date", ["", "2024", "2024-03"])
def test_experience_accepts_supported_dates(date: str) -> None:
    item = ExperienceItem(id="e1", start=date, end=date)

    assert item.start == date
    assert item.end == date


@pytest.mark.parametrize("date", ["2024-13", "24", "2024-00"])
def test_experience_rejects_unsupported_dates(date: str) -> None:
    with pytest.raises(ValidationError):
        ExperienceItem(id="e1", start=date)


def test_experience_rejects_more_than_fifteen_bullets() -> None:
    with pytest.raises(ValidationError):
        ExperienceItem(id="e1", bullets=["bullet"] * 16)


def test_experience_rejects_bullets_longer_than_300_characters() -> None:
    with pytest.raises(ValidationError):
        ExperienceItem(id="e1", bullets=["x" * 301])


def test_education_accepts_valid_data_and_defaults() -> None:
    item = EducationItem(id="ed1", institution="Example University")

    assert item.gpa_label == "GPA"
    assert item.details == []


def test_education_rejects_invalid_date_and_gpa_label() -> None:
    with pytest.raises(ValidationError):
        EducationItem(id="ed1", end="2024-13")

    with pytest.raises(ValidationError):
        EducationItem(id="ed1", gpa_label="Score")
