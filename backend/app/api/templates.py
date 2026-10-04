from fastapi import APIRouter

from app.templates_engine.registry import TEMPLATES

router = APIRouter(prefix="/api")


@router.get("/templates")
def list_templates() -> list[dict[str, str]]:
    return [
        {
            "id": template.id,
            "name": template.name,
            "description": template.description,
            "best_for": template.best_for,
        }
        for template in TEMPLATES.values()
    ]
