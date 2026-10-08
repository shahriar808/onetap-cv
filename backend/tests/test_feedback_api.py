import asyncio
import logging

from fastapi.testclient import TestClient
import pytest

from app import config
from app.api import feedback
from app.limiter import limiter
from app.main import FeedbackBodySizeLimitMiddleware, app

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    limiter.reset()
    yield
    limiter.reset()


def feedback_data(**overrides: object) -> dict[str, object]:
    values: dict[str, object] = {
        "type": "idea",
        "message": "Please add more templates.",
        "name": "Taylor",
        "email": "taylor@example.com",
        "website": "",
        "elapsed_ms": 5000,
    }
    values.update(overrides)
    return values


def test_valid_feedback_is_sent_once(monkeypatch) -> None:
    calls: list[object] = []
    monkeypatch.setattr(feedback, "is_configured", lambda: True)
    monkeypatch.setattr(feedback, "send_feedback_email", calls.append)

    response = client.post("/api/feedback", json=feedback_data())

    assert response.status_code == 200
    assert response.json() == {"ok": True}
    assert len(calls) == 1


def test_honeypot_is_silently_dropped(monkeypatch) -> None:
    monkeypatch.setattr(feedback, "is_configured", lambda: True)
    monkeypatch.setattr(
        feedback,
        "send_feedback_email",
        lambda _: (_ for _ in ()).throw(AssertionError("unexpected send")),
    )

    response = client.post(
        "/api/feedback",
        json=feedback_data(website="https://spam.example"),
    )

    assert response.status_code == 200
    assert response.json() == {"ok": True}


def test_fast_submit_is_silently_dropped(monkeypatch) -> None:
    monkeypatch.setattr(feedback, "is_configured", lambda: True)
    monkeypatch.setattr(
        feedback,
        "send_feedback_email",
        lambda _: (_ for _ in ()).throw(AssertionError("unexpected send")),
    )

    response = client.post(
        "/api/feedback",
        json=feedback_data(elapsed_ms=500),
    )

    assert response.status_code == 200
    assert response.json() == {"ok": True}


def test_invalid_email_is_rejected() -> None:
    response = client.post(
        "/api/feedback",
        json=feedback_data(email="not-an-email"),
    )

    assert response.status_code == 422


def test_body_over_10_kb_is_rejected_before_validation() -> None:
    response = client.post(
        "/api/feedback",
        content=b"x" * (10 * 1024 + 1),
        headers={"content-type": "application/json"},
    )

    assert response.status_code == 413


def test_streamed_body_over_10_kb_is_rejected() -> None:
    messages = iter(
        [
            {"type": "http.request", "body": b"x" * 6000, "more_body": True},
            {"type": "http.request", "body": b"x" * 4241, "more_body": True},
        ]
    )
    sent_messages: list[dict[str, object]] = []

    async def receive() -> dict[str, object]:
        return next(messages)

    async def send(message: dict[str, object]) -> None:
        sent_messages.append(message)

    async def downstream_app(scope, receive, send) -> None:
        pytest.fail("oversized streamed body reached the application")

    async def run_middleware() -> None:
        middleware = FeedbackBodySizeLimitMiddleware(downstream_app)
        await middleware(
            {"type": "http", "path": "/api/feedback", "headers": []},
            receive,
            send,
        )

    asyncio.run(run_middleware())

    response_start = next(
        message
        for message in sent_messages
        if message["type"] == "http.response.start"
    )
    assert response_start["status"] == 413


def test_not_configured_returns_generic_unavailable(monkeypatch) -> None:
    monkeypatch.setattr(feedback, "is_configured", lambda: False)

    response = client.post("/api/feedback", json=feedback_data())

    assert response.status_code == 503
    assert response.json() == {
        "detail": "Feedback is temporarily unavailable",
    }


def test_sender_failure_returns_generic_unavailable(monkeypatch) -> None:
    monkeypatch.setattr(feedback, "is_configured", lambda: True)
    monkeypatch.setattr(
        feedback,
        "send_feedback_email",
        lambda _: (_ for _ in ()).throw(RuntimeError("private failure")),
    )

    response = client.post("/api/feedback", json=feedback_data())

    assert response.status_code == 503
    assert response.json() == {
        "detail": "Feedback is temporarily unavailable",
    }


def test_message_is_not_logged_on_sender_failure(
    monkeypatch,
    caplog,
) -> None:
    secret_message = "do not log this private feedback"
    monkeypatch.setattr(feedback, "is_configured", lambda: True)
    monkeypatch.setattr(
        feedback,
        "send_feedback_email",
        lambda _: (_ for _ in ()).throw(RuntimeError(secret_message)),
    )

    with caplog.at_level(logging.DEBUG):
        response = client.post(
            "/api/feedback",
            json=feedback_data(message=secret_message),
        )

    assert response.status_code == 503
    assert secret_message not in caplog.text


def test_feedback_endpoint_rate_limit_is_configurable(monkeypatch) -> None:
    limiter.reset()
    monkeypatch.setattr(config, "FEEDBACK_RATE_LIMIT", "3/minute")
    monkeypatch.setattr(feedback, "is_configured", lambda: True)
    monkeypatch.setattr(feedback, "send_feedback_email", lambda _: None)
    try:
        responses = [
            client.post("/api/feedback", json=feedback_data())
            for _ in range(4)
        ]
    finally:
        limiter.reset()

    assert [response.status_code for response in responses] == [
        200,
        200,
        200,
        429,
    ]
