import logging

from fastapi.testclient import TestClient

from app import api
from app.main import app


def test_resume_content_is_not_written_to_logs(
    sample_data: dict[str, object],
    caplog,
) -> None:
    caplog.set_level(logging.DEBUG)

    response = TestClient(app).post("/api/resume/preview", json=sample_data)

    assert response.status_code == 200
    assert "Shahriar Hasan" not in caplog.text
    assert "shahriar@example.com" not in caplog.text


def test_unexpected_error_returns_clean_server_message(
    sample_data: dict[str, object],
    monkeypatch,
) -> None:
    def fail_render(data, template_id):
        raise RuntimeError("private user content: Shahriar Hasan")

    monkeypatch.setattr(api.resume, "render_pdf", fail_render)
    client = TestClient(app, raise_server_exceptions=False)

    response = client.post("/api/resume/pdf", json=sample_data)

    assert response.status_code == 500
    assert response.json() == {"detail": "Server error"}
    assert "Shahriar Hasan" not in response.text
