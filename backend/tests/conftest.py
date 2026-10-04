import json
from pathlib import Path
from typing import Any

import pytest

from app.schemas.resume import ResumeData

FIXTURE_PATH = Path(__file__).parent / "fixtures" / "sample_resume.json"
LONG_FIXTURE_PATH = Path(__file__).parent / "fixtures" / "long_resume.json"


@pytest.fixture
def sample_data() -> dict[str, Any]:
    return json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))


@pytest.fixture
def sample_resume(sample_data: dict[str, Any]) -> ResumeData:
    return ResumeData.model_validate(sample_data)


@pytest.fixture
def long_resume() -> ResumeData:
    data = json.loads(LONG_FIXTURE_PATH.read_text(encoding="utf-8"))
    return ResumeData.model_validate(data)
