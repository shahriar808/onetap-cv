from fastapi.testclient import TestClient

from app import config
from app.config import MAX_BODY_BYTES
from app.limiter import limiter
from app.main import app

client = TestClient(app)


def test_request_body_over_configured_limit_is_rejected() -> None:
    response = client.post(
        "/api/resume/preview",
        content=b"x" * (MAX_BODY_BYTES + 1),
        headers={"content-type": "application/json"},
    )

    assert response.status_code == 413
    assert response.json() == {"detail": "Request too large"}


def test_request_within_limit_reaches_validation() -> None:
    response = client.post(
        "/api/resume/preview",
        content=b"{}",
        headers={"content-type": "application/json"},
    )

    assert response.status_code == 422


def test_resume_endpoint_rate_limit_is_configurable(
    sample_data: dict[str, object],
    monkeypatch,
) -> None:
    limiter.reset()
    monkeypatch.setattr(config, "RATE_LIMIT", "3/minute")
    try:
        responses = [
            client.post("/api/resume/preview", json=sample_data)
            for _ in range(4)
        ]
    finally:
        limiter.reset()

    assert [response.status_code for response in responses] == [200, 200, 200, 429]
