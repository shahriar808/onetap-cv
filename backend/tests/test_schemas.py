import pytest
from pydantic import ValidationError

from app.schemas.resume import (
    AchievementItem,
    CertificationItem,
    Contact,
    EducationItem,
    ExperienceItem,
    AchievementItem,
    InterestsSection,
    LanguageItem,
    LinkItem,
    PublicationItem,
    ProjectItem,
    ProjectLink,
    ReferenceItem,
    ResumeData,
    SkillGroup,
    SummarySection,
    VolunteerItem,
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


def test_achievement_accepts_valid_data() -> None:
    assert AchievementItem(id="a1", title="Award", date="2024").title == "Award"


def test_achievement_rejects_invalid_date() -> None:
    with pytest.raises(ValidationError):
        AchievementItem(id="a1", date="2024-13")


def test_language_accepts_valid_data() -> None:
    assert LanguageItem(id="l1", language="English", proficiency="Fluent").language == "English"


def test_publication_accepts_valid_data_and_rejects_invalid_date() -> None:
    assert PublicationItem(id="pub1", title="Paper").title == "Paper"

    with pytest.raises(ValidationError):
        PublicationItem(id="pub1", date="2024-13")


def test_volunteer_accepts_bounded_bullets() -> None:
    item = VolunteerItem(id="v1", organization="Example", bullets=["Helped"])

    assert item.bullets == ["Helped"]


def test_reference_accepts_optional_contact_fields() -> None:
    reference = ReferenceItem(id="r1", name="Taylor Example")

    assert reference.email == ""
    assert reference.phone == ""


def test_summary_limits_text_length() -> None:
    with pytest.raises(ValidationError):
        SummarySection(text="x" * 601)


def test_interests_limits_item_count() -> None:
    with pytest.raises(ValidationError):
        InterestsSection(items=["interest"] * 31)


def test_sample_resume_fixture_validates(sample_resume: ResumeData) -> None:
    assert sample_resume.contact.full_name == "Shahriar Hasan"


def test_resume_data_requires_contact_email(sample_data: dict[str, object]) -> None:
    contact = sample_data["contact"]
    assert isinstance(contact, dict)
    contact.pop("email")

    with pytest.raises(ValidationError):
        ResumeData.model_validate(sample_data)
