from fastapi.testclient import TestClient
from weasyprint import HTML

from app.main import app

client = TestClient(app)


def test_health_returns_ok() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_weasyprint_can_generate_pdf() -> None:
    assert HTML(string="<p>hi</p>").write_pdf()[:4] == b"%PDF"
