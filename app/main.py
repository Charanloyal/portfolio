import hashlib
import json
import os
import time
from contextlib import asynccontextmanager
from datetime import date, datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.content import (
    CATEGORIES,
    category_counts,
    featured_projects,
    load_profile,
    load_projects,
    project_by_id,
    projects_using,
    search_text,
    status_counts,
)

APP_DIR = Path(__file__).parent
STATIC_DIR = APP_DIR / "static"
RESUME_FILE = STATIC_DIR / "resume.pdf"
START_TIME = time.time()

SITE_URL = os.getenv("SITE_URL", "https://personal-portfolio-hub-3z4y.onrender.com").rstrip("/")
# Optional: overrides profile.json resume_url and app/static/resume.pdf.
RESUME_URL_OVERRIDE = os.getenv("RESUME_URL", "").strip() or None

HERO_PROJECT_IDS = ["lakeflow", "featurehub-dataguard", "vehicle-telemetry-anomaly-detection", "neural-gateway"]
HERO_NODES = [
    {"x": 20, "y": 36, "label": "Postgres WAL", "sub": "change capture", "accent": False},
    {"x": 215, "y": 36, "label": "Kafka", "sub": "event stream", "accent": False},
    {"x": 410, "y": 36, "label": "Spark → Iceberg", "sub": "lakehouse", "accent": True},
    {"x": 410, "y": 188, "label": "Feature store", "sub": "point-in-time", "accent": False},
    {"x": 215, "y": 188, "label": "Model", "sub": "train · evaluate", "accent": True},
    {"x": 20, "y": 188, "label": "FastAPI", "sub": "serve · limit", "accent": False},
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Fail fast on malformed content instead of serving a broken page.
    load_projects()
    load_profile()
    yield


app = FastAPI(
    title="Charan Kumar Reddy - Portfolio",
    description="Portfolio of Charan Kumar Reddy: data engineering, machine learning and backend projects.",
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(GZipMiddleware, minimum_size=1024)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/fraud-detector", StaticFiles(directory=STATIC_DIR / "realtime-fraud-detector", html=True), name="fraud-detector")
app.mount("/ab-testing", StaticFiles(directory=STATIC_DIR / "ab-testing-platform", html=True), name="ab-testing")

templates = Jinja2Templates(directory=APP_DIR / "templates")


def _month_year(value: str) -> str:
    try:
        return datetime.strptime(value[:10], "%Y-%m-%d").strftime("%b %Y")
    except ValueError:
        return value


def _asset_version() -> str:
    h = hashlib.sha1()
    for rel in ("css/site.css", "js/site.js"):
        f = STATIC_DIR / rel
        if f.exists():
            h.update(f.read_bytes())
    return h.hexdigest()[:10]


templates.env.filters["month_year"] = _month_year
templates.env.filters["search_text"] = search_text
templates.env.globals["asset_version"] = _asset_version()


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
    return response


def resume_url() -> Optional[str]:
    if RESUME_URL_OVERRIDE:
        return RESUME_URL_OVERRIDE
    if load_profile().resume_url:
        return load_profile().resume_url
    return "/static/resume.pdf" if RESUME_FILE.is_file() else None


def _base_context(request: Request, **extra) -> dict:
    profile = load_profile()
    ctx = {
        "request": request,
        "profile": profile,
        "resume_url": resume_url(),
        "year": date.today().year,
        "og_image_url": f"{SITE_URL}/static/og-image.png",
        "canonical_url": f"{SITE_URL}{request.url.path}",
    }
    ctx.update(extra)
    return ctx


def _person_jsonld() -> str:
    profile = load_profile()
    data = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": profile.name,
        "url": SITE_URL,
        "email": f"mailto:{profile.email}",
        "jobTitle": profile.role_line,
        "address": {"@type": "PostalAddress", "addressLocality": profile.location},
        "alumniOf": [{"@type": "CollegeOrUniversity", "name": e.school} for e in profile.education],
        "sameAs": [link.url for link in profile.links.values()],
    }
    # Escape "</" so the JSON cannot terminate the surrounding <script> tag.
    return json.dumps(data, ensure_ascii=False).replace("</", "<\\/")


def _skill_groups() -> list[dict]:
    return [
        {"group": g.group, "skills": [{"name": s.name, "count": len(projects_using(s.name)) if s.match else 0} for s in g.items]}
        for g in load_profile().skills
    ]


def _public(project) -> dict:
    data = project.model_dump(mode="json")
    data["category_label"] = project.category_label
    data["case_study_url"] = f"/projects/{project.id}" if project.case_study else None
    return data


@app.get("/", response_class=HTMLResponse)
async def serve_portfolio(request: Request):
    profile = load_profile()
    projects = list(load_projects())
    current = next((e for e in profile.experience if e.current), None)
    hero_projects = [p for pid in HERO_PROJECT_IDS if (p := project_by_id(pid)) and p.case_study]
    ctx = _base_context(
        request,
        page_title=f"{profile.name} | {profile.role_line}",
        page_description=profile.intro,
        nav_prefix="",
        featured=featured_projects(),
        all_projects=projects,
        categories=category_counts(),
        statuses=status_counts(),
        skill_groups=_skill_groups(),
        hero_nodes=HERO_NODES,
        hero_projects=hero_projects,
        person_jsonld=_person_jsonld(),
        stats={
            "projects": len(projects),
            "live": sum(1 for p in projects if p.demo_kind == "live-app"),
            "internships": len(profile.experience),
            "graduation": next((e.period.removeprefix("Expected ") for e in profile.education if e.period), None),
            "now": f"Intern at {current.org}" if current else "Open to roles",
        },
    )
    return templates.TemplateResponse(request=request, name="index.html", context=ctx)


@app.get("/projects/{project_id}", response_class=HTMLResponse)
async def serve_case_study(request: Request, project_id: str):
    project = project_by_id(project_id)
    if not project or not project.case_study:
        raise HTTPException(status_code=404, detail="Project not found")
    studies = [p for p in featured_projects() if p.case_study]
    others = [p for p in load_projects() if p.case_study and p not in studies]
    ordered = studies + others
    idx = ordered.index(project)
    profile = load_profile()
    ctx = _base_context(
        request,
        page_title=f"{project.title} case study | {profile.name}",
        page_description=project.summary,
        og_type="article",
        nav_prefix="/",
        project=project,
        prev_project=ordered[idx - 1] if idx > 0 else None,
        next_project=ordered[idx + 1] if idx + 1 < len(ordered) else None,
    )
    return templates.TemplateResponse(request=request, name="project.html", context=ctx)


@app.get("/api/v1/projects")
async def get_projects(category: Optional[str] = None):
    projects = load_projects()
    if category and category != "all":
        if category not in CATEGORIES:
            raise HTTPException(status_code=400, detail=f"Unknown category. Use one of: {', '.join(CATEGORIES)}")
        projects = tuple(p for p in projects if category in p.all_categories)
    return {"total": len(projects), "projects": [_public(p) for p in projects]}


@app.get("/api/v1/system-status")
async def get_system_status():
    uptime = int(time.time() - START_TIME)
    projects = load_projects()
    profile = load_profile()
    return {
        "status": "HEALTHY",
        "version": app.version,
        "developer": profile.name,
        "uptime": f"{uptime // 3600}h {(uptime % 3600) // 60}m {uptime % 60}s",
        "total_projects": len(projects),
        "live_demos": sum(1 for p in projects if p.demo_kind == "live-app"),
        "resume_available": resume_url() is not None,
    }


@app.get("/robots.txt", response_class=PlainTextResponse)
async def robots():
    return f"User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: {SITE_URL}/sitemap.xml\n"


@app.get("/sitemap.xml")
async def sitemap():
    urls = [(f"{SITE_URL}/", max(p.updated for p in load_projects()))]
    urls += [(f"{SITE_URL}/projects/{p.id}", p.updated) for p in load_projects() if p.case_study]
    body = "".join(f"<url><loc>{loc}</loc><lastmod>{mod}</lastmod></url>" for loc, mod in urls)
    xml = f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{body}</urlset>'
    return Response(content=xml, media_type="application/xml")


@app.exception_handler(StarletteHTTPException)
async def http_error(request: Request, exc: StarletteHTTPException):
    wants_html = not request.url.path.startswith("/api/") and "text/html" in request.headers.get("accept", "text/html")
    if exc.status_code == 404 and wants_html:
        ctx = _base_context(
            request,
            page_title=f"Page not found | {load_profile().name}",
            page_description="This page does not exist.",
            nav_prefix="/",
        )
        return templates.TemplateResponse(request=request, name="404.html", context=ctx, status_code=404)
    return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)
