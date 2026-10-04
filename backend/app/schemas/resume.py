from typing import Annotated, Literal

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
Bullet = Annotated[str, Field(max_length=300)]


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


class ExperienceItem(BaseModel):
    id: str
    company: str = Field(default="", max_length=120)
    position: str = Field(default="", max_length=120)
    location: str = Field(default="", max_length=100)
    start: str = Field(default="", pattern=DATE_PATTERN)
    end: str = Field(default="", pattern=DATE_PATTERN)
    is_current: bool = False
    summary: str = Field(default="", max_length=300)
    bullets: list[Bullet] = Field(default_factory=list, max_length=15)


class EducationItem(BaseModel):
    id: str
    institution: str = Field(default="", max_length=160)
    degree: str = Field(default="", max_length=120)
    field: str = Field(default="", max_length=120)
    location: str = Field(default="", max_length=100)
    start: str = Field(default="", pattern=DATE_PATTERN)
    end: str = Field(default="", pattern=DATE_PATTERN)
    gpa: str = Field(default="", max_length=20)
    gpa_label: Literal["GPA", "CGPA"] = "GPA"
    details: list[Bullet] = Field(default_factory=list, max_length=10)
