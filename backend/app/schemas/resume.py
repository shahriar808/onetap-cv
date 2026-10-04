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


class SkillGroup(BaseModel):
    id: str
    group_name: str = Field(default="", max_length=60)
    items: list[str] = Field(default_factory=list, max_length=40)


class ProjectLink(BaseModel):
    label: str = Field(default="", max_length=40)
    url: str = Field(default="", max_length=300)


class ProjectItem(BaseModel):
    id: str
    name: str = Field(default="", max_length=120)
    description: str = Field(default="", max_length=200)
    tech_stack: str = Field(default="", max_length=200)
    start: str = Field(default="", pattern=DATE_PATTERN)
    end: str = Field(default="", pattern=DATE_PATTERN)
    links: list[ProjectLink] = Field(default_factory=list, max_length=5)
    bullets: list[Bullet] = Field(default_factory=list, max_length=10)


class CertificationItem(BaseModel):
    id: str
    name: str = Field(default="", max_length=160)
    issuer: str = Field(default="", max_length=120)
    date: str = Field(default="", pattern=DATE_PATTERN)
    is_ongoing: bool = False
    link: str = Field(default="", max_length=300)


class AchievementItem(BaseModel):
    id: str
    title: str = Field(default="", max_length=160)
    description: str = Field(default="", max_length=300)
    date: str = Field(default="", pattern=DATE_PATTERN)


class LanguageItem(BaseModel):
    id: str
    language: str = Field(default="", max_length=60)
    proficiency: str = Field(default="", max_length=40)


class PublicationItem(BaseModel):
    id: str
    title: str = Field(default="", max_length=200)
    publisher: str = Field(default="", max_length=120)
    date: str = Field(default="", pattern=DATE_PATTERN)
    link: str = Field(default="", max_length=300)


class VolunteerItem(BaseModel):
    id: str
    organization: str = Field(default="", max_length=120)
    role: str = Field(default="", max_length=120)
    start: str = Field(default="", pattern=DATE_PATTERN)
    end: str = Field(default="", pattern=DATE_PATTERN)
    bullets: list[Bullet] = Field(default_factory=list, max_length=15)


class ReferenceItem(BaseModel):
    id: str
    name: str = Field(default="", max_length=100)
    position: str = Field(default="", max_length=120)
    company: str = Field(default="", max_length=120)
    email: str = Field(default="", max_length=254)
    phone: str = Field(default="", max_length=30)


class SummarySection(BaseModel):
    text: str = Field(default="", max_length=600)


class InterestsSection(BaseModel):
    items: list[str] = Field(default_factory=list, max_length=30)
