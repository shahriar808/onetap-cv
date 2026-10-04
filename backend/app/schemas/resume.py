from typing import Literal

from pydantic import BaseModel, EmailStr, Field

SectionId = Literal[
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "achievements",
    "languages",
    "publications",
    "volunteer",
    "interests",
    "references",
]

DATE_PATTERN = r"^(\d{4}(-(0[1-9]|1[0-2]))?)?$"


class LinkItem(BaseModel):
    id: str = ""
    type: Literal["LinkedIn", "GitHub", "Portfolio", "LeetCode", "Other"] = "Other"
    url: str = Field(default="", max_length=300)


class Contact(BaseModel):
    full_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=30)
    location: str = Field(default="", max_length=100)
    job_title: str = Field(default="", max_length=100)
    links: list[LinkItem] = Field(default_factory=list, max_length=6)
