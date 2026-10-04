from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_templates_endpoint_returns_registered_templates() -> None:
    response = client.get("/api/templates")

    assert response.status_code == 200
    templates = response.json()
    assert any(template["id"] == "modern" for template in templates)
    assert all(
        {"id", "name", "description", "best_for"} <= template.keys()
        for template in templates
    )


def test_preview_endpoint_returns_html(sample_data: dict[str, object]) -> None:
    response = client.post("/api/resume/preview?template=modern", json=sample_data)

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/html")
    assert "MD Shahriar Hasan" in response.text
    assert "@media screen" in response.text


def test_preview_endpoint_rejects_missing_email(sample_data: dict[str, object]) -> None:
    contact = sample_data["contact"]
    assert isinstance(contact, dict)
    contact.pop("email")

    response = client.post("/api/resume/preview", json=sample_data)

    assert response.status_code == 422


def test_preview_endpoint_returns_404_for_unknown_template(
    sample_data: dict[str, object],
) -> None:
    response = client.post("/api/resume/preview?template=nope", json=sample_data)

    assert response.status_code == 404
