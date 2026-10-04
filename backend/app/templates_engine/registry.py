from dataclasses import dataclass
from pathlib import Path

BASE = Path(__file__).parent


@dataclass(frozen=True)
class TemplateMeta:
    id: str
    name: str
    description: str
    best_for: str


TEMPLATES: dict[str, TemplateMeta] = {
    "modern": TemplateMeta(
        "modern",
        "Modern",
        "Left-aligned sans-serif with a dark accent bar",
        "Tech, startups, marketing, general use",
    ),
}


def get_template_dir(template_id: str) -> Path:
    if template_id not in TEMPLATES:
        raise KeyError(template_id)
    return BASE / template_id
