"""Typed content layer: every fact shown on the site lives in app/data/*.json."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Literal, Optional

from pydantic import BaseModel, Field, HttpUrl, field_validator

CONTENT_DIR = Path(__file__).parent / "data"
GITHUB_OWNER_PREFIX = "https://github.com/Charanloyal/"

CategoryId = Literal["data-engineering", "ai-ml", "data-science", "backend", "cloud-infra", "mobile", "other"]
Status = Literal["complete", "in-progress", "experimental", "learning"]
DemoKind = Literal["live-app", "recorded-run", "browser-simulation", "browser-calculator"]

CATEGORIES: dict[str, str] = {
    "data-engineering": "Data Engineering",
    "ai-ml": "AI & Machine Learning",
    "data-science": "Data Science & Analytics",
    "backend": "Backend & Software Engineering",
    "cloud-infra": "Cloud & Infrastructure",
    "mobile": "Mobile Applications",
    "other": "Other Projects",
}

STATUS_LABELS: dict[str, str] = {
    "complete": "Complete",
    "in-progress": "In progress",
    "experimental": "Experimental",
    "learning": "Learning project",
}

DEMO_LABELS: dict[str, str] = {
    "live-app": "Live demo",
    "recorded-run": "Recorded demo",
    "browser-simulation": "Simulation (synthetic data)",
    "browser-calculator": "In-browser tool",
}


class Metric(BaseModel):
    label: str
    value: str
    evidence: str = Field(..., description="Where in the repo this number comes from")


class FlowStep(BaseModel):
    label: str
    detail: str = ""


class CaseStudy(BaseModel):
    problem: str
    architecture: list[FlowStep] = []
    decisions: list[str] = []
    testing: list[str] = []
    results: list[str] = []
    limitations: list[str] = []


class Project(BaseModel):
    id: str
    title: str
    repo: str
    github_url: HttpUrl
    summary: str
    category: CategoryId
    secondary_categories: list[CategoryId] = []
    tech: list[str]
    status: Status
    featured_rank: Optional[int] = None
    demo_url: Optional[str] = None
    demo_kind: Optional[DemoKind] = None
    demo_note: Optional[str] = None
    docs_url: Optional[str] = None
    updated: str
    metrics: list[Metric] = []
    image: Optional[str] = None
    image_alt: Optional[str] = None
    case_study: Optional[CaseStudy] = None

    @field_validator("github_url")
    @classmethod
    def _owned_repo(cls, v: HttpUrl) -> HttpUrl:
        if not str(v).startswith(GITHUB_OWNER_PREFIX):
            raise ValueError(f"github_url must point to {GITHUB_OWNER_PREFIX}…")
        return v

    @field_validator("demo_url")
    @classmethod
    def _no_ephemeral_tunnels(cls, v: Optional[str]) -> Optional[str]:
        if v and "trycloudflare.com" in v:
            raise ValueError("Ephemeral trycloudflare tunnels are not stable demo URLs")
        return v

    @property
    def category_label(self) -> str:
        return CATEGORIES[self.category]

    @property
    def status_label(self) -> str:
        return STATUS_LABELS[self.status]

    @property
    def demo_label(self) -> Optional[str]:
        return DEMO_LABELS[self.demo_kind] if self.demo_url and self.demo_kind else None

    @property
    def all_categories(self) -> list[str]:
        return [self.category, *[c for c in self.secondary_categories if c != self.category]]


class Link(BaseModel):
    label: str
    url: str


class Experience(BaseModel):
    role: str
    org: str
    period: str
    location: str = ""
    current: bool = False
    bullets: list[str] = []


class Education(BaseModel):
    degree: str
    school: str
    location: str = ""
    period: str = ""
    detail: str = ""


class Credential(BaseModel):
    name: str
    issuer: str


class Achievement(BaseModel):
    title: str
    detail: str = ""
    url: Optional[str] = None


class SkillItem(BaseModel):
    name: str
    # Concepts (e.g. "RAG", "Prompt engineering") would substring-match unrelated words, so they get no project count.
    match: bool = True


class SkillGroup(BaseModel):
    group: str
    items: list[SkillItem]

    @field_validator("items", mode="before")
    @classmethod
    def _strings_to_items(cls, v):
        return [{"name": i} if isinstance(i, str) else i for i in v]


class Profile(BaseModel):
    name: str
    short_name: str
    role_line: str
    headline: str
    intro: str
    about: list[str]
    location: str
    open_to: str
    email: str
    site_url: str
    links: dict[str, Link]
    education: list[Education]
    experience: list[Experience]
    certifications: list[Credential]
    simulations: list[Credential] = []
    achievements: list[Achievement] = []
    focus: list[Achievement] = []
    skills: list[SkillGroup]


@lru_cache(maxsize=1)
def load_projects() -> tuple[Project, ...]:
    raw = json.loads((CONTENT_DIR / "projects.json").read_text(encoding="utf-8"))
    projects = tuple(Project.model_validate(p) for p in raw["projects"])
    ids = [p.id for p in projects]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate project ids in projects.json")
    return projects


@lru_cache(maxsize=1)
def load_profile() -> Profile:
    return Profile.model_validate_json((CONTENT_DIR / "profile.json").read_text(encoding="utf-8"))


def featured_projects() -> list[Project]:
    return sorted((p for p in load_projects() if p.featured_rank is not None), key=lambda p: p.featured_rank or 0)


def project_by_id(project_id: str) -> Optional[Project]:
    return next((p for p in load_projects() if p.id == project_id), None)


def category_counts() -> list[tuple[str, str, int]]:
    projects = load_projects()
    out = []
    for cid, label in CATEGORIES.items():
        n = sum(1 for p in projects if cid in p.all_categories)
        if n:
            out.append((cid, label, n))
    return out


def search_text(p: Project) -> str:
    """Must match the data-search attribute the gallery script filters on."""
    return f"{p.title} {p.summary} {' '.join(p.tech)} {p.category_label}".lower()


def projects_using(skill: str) -> list[Project]:
    tokens = skill.lower().split()
    return [p for p in load_projects() if all(t in search_text(p) for t in tokens)]
