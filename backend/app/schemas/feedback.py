from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


class FeedbackIn(BaseModel):
    type: Literal["idea", "bug", "compliment", "other"]
    message: str = Field(min_length=10, max_length=1000)
    name: str = Field(default="", max_length=80)
    email: EmailStr | Literal[""] = ""
    website: str = Field(default="", max_length=200)
    elapsed_ms: int = Field(ge=0)

    @field_validator("message", mode="before")
    @classmethod
    def strip_message(cls, value: str) -> str:
        return value.strip()

    @field_validator("name", "website", mode="before")
    @classmethod
    def strip_optional_text(cls, value: str) -> str:
        return value.strip()
