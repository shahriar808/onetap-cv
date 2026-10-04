import pytest
from pydantic import ValidationError

from app.schemas.resume import Contact, LinkItem


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
