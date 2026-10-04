import pytest
from pydantic import ValidationError

from app.schemas.resume import (
    CertificationItem,
    Contact,
    EducationItem,
    ExperienceItem,
    LinkItem,
    ProjectItem,
    ProjectLink,
    SkillGroup,
)


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


def test_skill_group_accepts_valid_data() -> None:
    group = SkillGroup(id="s1", group_name="Languages", items=["Python"])

    assert group.items == ["Python"]


def test_skill_group_rejects_too_many_items() -> None:
    with pytest.raises(ValidationError):
        SkillGroup(id="s1", items=["skill"] * 41)


def test_project_item_accepts_valid_data() -> None:
    project = ProjectItem(
        id="p1",
        name="Example",
        links=[ProjectLink(label="GitHub", url="https://github.com/example")],
    )

    assert project.links[0].label == "GitHub"


def test_project_item_rejects_invalid_dates_and_too_many_links() -> None:
    with pytest.raises(ValidationError):
        ProjectItem(id="p1", start="2024-13")

    with pytest.raises(ValidationError):
        ProjectItem(id="p1", links=[ProjectLink(url="example.com")] * 6)


def test_certification_accepts_valid_data() -> None:
    certification = CertificationItem(
        id="c1", name="Python Basics", issuer="Example", is_ongoing=True
    )

    assert certification.is_ongoing is True


def test_certification_rejects_invalid_date() -> None:
    with pytest.raises(ValidationError):
        CertificationItem(id="c1", date="2024-13")
