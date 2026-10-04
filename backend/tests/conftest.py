import json
from pathlib import Path
from typing import Any

import pytest

from app.schemas.resume import ResumeData

FIXTURE_PATH = Path(__file__).parent / "fixtures" / "sample_resume.json"


@pytest.fixture
def sample_data() -> dict[str, Any]:
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


@pytest.fixture
def sample_resume(sample_data: dict[str, Any]) -> ResumeData:
    return ResumeData.model_validate(sample_data)
