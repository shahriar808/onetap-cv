from email.message import EmailMessage
from unittest.mock import MagicMock

import pytest
from pydantic import ValidationError

from app import config
from app.schemas.feedback import FeedbackIn
from app.services import email_service


def feedback_payload(**overrides: object) -> FeedbackIn:
    values: dict[str, object] = {
        "type": "idea",
        "message": "Add a print-friendly view.",
        "name": "Taylor Example",
        "email": "taylor@example.com",
        "website": "",
        "elapsed_ms": 8421,
    }
    values.update(overrides)
    return FeedbackIn.model_validate(values)


def configure_smtp(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(config, "SMTP_HOST", "smtp.example.com")
    monkeypatch.setattr(config, "SMTP_PORT", 587)
    monkeypatch.setattr(config, "SMTP_USER", "sender@example.com")
    monkeypatch.setattr(config, "SMTP_PASSWORD", "test-password")
    monkeypatch.setattr(config, "FEEDBACK_TO_EMAIL", "owner@example.com")
    monkeypatch.setattr(config, "FEEDBACK_FROM_EMAIL", "sender@example.com")


def test_feedback_schema_strips_message_and_optional_text() -> None:
    payload = feedback_payload(message="  This is useful.  ", name=" Taylor ")

    assert payload.message == "This is useful."
    assert payload.name == "Taylor"


def test_feedback_schema_rejects_short_message_and_invalid_email() -> None:
    with pytest.raises(ValidationError):
        feedback_payload(message="Too short")

    with pytest.raises(ValidationError):
        feedback_payload(message="          ")

    with pytest.raises(ValidationError):
        feedback_payload(email="not-an-email")


def test_subject_is_single_line_even_for_newline_prefixed_message(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    configure_smtp(monkeypatch)
    payload = feedback_payload(message="\r\nBcc: attacker@example.com")

    message = email_service.build_message(payload)

    assert message["Subject"] == (
        "[OneTap CV] idea: Bcc: attacker@example.com"
    )
    assert "\r" not in message["Subject"]
    assert "\n" not in message["Subject"]


def test_empty_email_does_not_set_reply_to(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    configure_smtp(monkeypatch)
    message = email_service.build_message(feedback_payload(email=""))

    assert message.get("Reply-To") is None


def test_configured_headers_have_crlf_removed(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    configure_smtp(monkeypatch)
    monkeypatch.setattr(config, "FEEDBACK_FROM_EMAIL", "sender@example.com\r\nBcc: bad")
    monkeypatch.setattr(config, "FEEDBACK_TO_EMAIL", "owner@example.com\nBcc: bad")

    message = email_service.build_message(feedback_payload())
    assert "\r" not in message["From"]
    assert "\n" not in message["From"]
    assert "\r" not in message["To"]
    assert "\n" not in message["To"]
    assert message.get("Bcc") is None


def test_message_body_is_plain_text_and_contains_type_and_message(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    configure_smtp(monkeypatch)
    message = email_service.build_message(feedback_payload())

    assert isinstance(message, EmailMessage)
    assert message.get_content_type() == "text/plain"
    assert "Type: idea" in message.get_content()
    assert "Add a print-friendly view." in message.get_content()


def test_smtp_sender_uses_tls_and_configured_timeout(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    configure_smtp(monkeypatch)
    smtp = MagicMock()
    smtp_context = MagicMock()
    smtp_context.__enter__.return_value = smtp
    smtp_context.__exit__.return_value = False
    smtp_client = MagicMock(return_value=smtp_context)
    monkeypatch.setattr(email_service.smtplib, "SMTP", smtp_client)

    email_service.send_feedback_email(feedback_payload())

    smtp_client.assert_called_once_with(
        "smtp.example.com",
        587,
        timeout=10,
    )
    smtp.starttls.assert_called_once_with()
    smtp.login.assert_called_once_with("sender@example.com", "test-password")
    smtp.send_message.assert_called_once()


def test_smtp_configuration_requires_all_delivery_settings(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    configure_smtp(monkeypatch)

    assert email_service.is_configured()

    monkeypatch.setattr(config, "SMTP_PASSWORD", "")

    assert not email_service.is_configured()


def test_local_debug_smtp_skips_tls_and_login_without_user(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    configure_smtp(monkeypatch)
    monkeypatch.setattr(config, "SMTP_HOST", "localhost")
    monkeypatch.setattr(config, "SMTP_USER", "")
    monkeypatch.setattr(config, "SMTP_PASSWORD", "")
    smtp = MagicMock()
    smtp_context = MagicMock()
    smtp_context.__enter__.return_value = smtp
    smtp_context.__exit__.return_value = False
    smtp_client = MagicMock(return_value=smtp_context)
    monkeypatch.setattr(email_service.smtplib, "SMTP", smtp_client)

    assert email_service.is_configured()

    email_service.send_feedback_email(feedback_payload())

    smtp.starttls.assert_not_called()
    smtp.login.assert_not_called()
    smtp.send_message.assert_called_once()


def test_remote_smtp_without_authentication_is_not_configured(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    configure_smtp(monkeypatch)
    monkeypatch.setattr(config, "SMTP_USER", "")
    monkeypatch.setattr(config, "SMTP_PASSWORD", "")

    assert not email_service.is_configured()
