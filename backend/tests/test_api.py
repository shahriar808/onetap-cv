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
