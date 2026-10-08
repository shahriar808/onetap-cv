import smtplib
from email.message import EmailMessage

from app import config
from app.schemas.feedback import FeedbackIn


def is_configured() -> bool:
    if not all(
        (
            config.SMTP_HOST,
            config.SMTP_PORT,
            config.FEEDBACK_TO_EMAIL,
            config.FEEDBACK_FROM_EMAIL,
        )
    ):
        return False

    if config.SMTP_USER:
        return bool(config.SMTP_PASSWORD)

    return config.SMTP_HOST.lower() in {"localhost", "127.0.0.1", "::1"}


def _header_value(value: str) -> str:
    return value.replace("\r", "").replace("\n", "").strip()


def build_message(payload: FeedbackIn) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = (
        f"[OneTap CV] {_header_value(payload.type)}: "
        f"{_header_value(payload.message)[:60]}"
    )
    message["From"] = _header_value(config.FEEDBACK_FROM_EMAIL)
    message["To"] = _header_value(config.FEEDBACK_TO_EMAIL)

    if payload.email:
        message["Reply-To"] = _header_value(str(payload.email))

    message.set_content(
        f"Type: {payload.type}\n"
        f"Message:\n{payload.message}\n\n"
        f"Name: {payload.name or '(not provided)'}\n"
        f"Email: {payload.email or '(not provided)'}\n"
    )
    return message


def send_feedback_email(payload: FeedbackIn) -> None:
    if not is_configured():
        raise RuntimeError("Feedback SMTP is not configured")

    message = build_message(payload)
    with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT, timeout=10) as smtp:
        if config.SMTP_USER:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(config.SMTP_USER, config.SMTP_PASSWORD)
        smtp.send_message(message)
