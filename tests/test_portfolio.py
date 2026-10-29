import re
from pathlib import Path

import pytest

import app.main as main
from app.content import CATEGORIES, featured_projects, load_profile, load_projects

STATIC_DIR = Path(main.__file__).parent / "static"

# Figures the repositories do not support; they must never reappear on the site.
UNSUPPORTED_CLAIMS = ["10,000+", "10K+", "88.7", "0.6813", "0.04s", "J.P. Morgan", "trycloudflare"]


async def test_home_renders_profile_and_every_project(client):
    response = await client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    html = response.text
    profile = load_profile()
    assert profile.name in html
    assert f'mailto:{profile.email}' in html
    assert 'href="https://www.linkedin.com/in/b-charan-kumar-reddy/"' in html
    for project in load_projects():
        assert project.title in html
        assert str(project.github_url) in html
    assert html.count('class="card gallery-item"') == len(load_projects())


async def test_home_has_no_unsupported_claims_or_fake_contact_form(client):
    html = (await client.get("/")).text
    for claim in UNSUPPORTED_CLAIMS:
        assert claim not in html, claim
    assert "<form" not in html
    assert "/api/v1/contact" not in html


async def test_home_seo_metadata(client):
    html = (await client.get("/")).text
    assert re.search(r"<title>[^<]+</title>", html)
    assert '<meta name="description"' in html
    assert '<link rel="canonical" href="https://' in html
    assert 'property="og:image" content="https://' in html
    assert 'application/ld+json' in html


async def test_resume_button_hidden_without_file(client, monkeypatch, tmp_path):
    monkeypatch.setattr(main, "RESUME_FILE", tmp_path / "missing.pdf")
    monkeypatch.setattr(main, "RESUME_URL_OVERRIDE", None)
    html = (await client.get("/")).text
    assert "View resume" not in html


async def test_resume_button_shown_when_file_exists(client, monkeypatch, tmp_path):
    pdf = tmp_path / "resume.pdf"
    pdf.write_bytes(b"%PDF-1.4")
    monkeypatch.setattr(main, "RESUME_FILE", pdf)
    monkeypatch.setattr(main, "RESUME_URL_OVERRIDE", None)
    html = (await client.get("/")).text
    assert "View resume" in html
    assert 'href="/static/resume.pdf"' in html


async def test_projects_api_lists_catalogue(client):
    data = (await client.get("/api/v1/projects")).json()
    assert data["total"] == len(load_projects()) == len(data["projects"])
    for project in data["projects"]:
        assert project["github_url"].startswith("https://github.com/Charanloyal/")


def test_public_data_files_hold_no_private_notes():
    for name in ("projects.json", "profile.json"):
        text = (Path(main.__file__).parent / "data" / name).read_text(encoding="utf-8")
        assert "review_flags" not in text, name
        # Catches characters mangled by a wrong console encoding (e.g. "Jul 2026 ? Present").
        assert "\ufffd" not in text and " ? " not in text, name


@pytest.mark.parametrize("category", list(CATEGORIES))
async def test_projects_api_category_filter(client, category):
    data = (await client.get(f"/api/v1/projects?category={category}")).json()
    assert all(category == p["category"] or category in p["secondary_categories"] for p in data["projects"])


async def test_projects_api_rejects_unknown_category(client):
    response = await client.get("/api/v1/projects?category=not-a-category")
    assert response.status_code == 400


def test_catalogue_integrity():
    projects = load_projects()
    ranks = sorted(p.featured_rank for p in projects if p.featured_rank is not None)
    assert ranks == list(range(1, len(ranks) + 1)), "featured ranks must be 1..n"
    for p in projects:
        assert bool(p.demo_url) == bool(p.demo_kind), p.id
        if p.image:
            assert (STATIC_DIR / p.image.removeprefix("/static/")).is_file(), p.image
        for metric in p.metrics:
            assert metric.evidence.strip(), f"{p.id}: metric without evidence"
    for p in featured_projects():
        assert p.case_study is not None, f"featured project {p.id} needs a case study"


async def test_case_study_pages_render(client):
    studies = [p for p in load_projects() if p.case_study]
    assert studies
    for p in studies:
        response = await client.get(f"/projects/{p.id}")
        assert response.status_code == 200, p.id
        assert p.title in response.text
        assert str(p.github_url) in response.text


async def test_unknown_project_returns_html_404(client):
    response = await client.get("/projects/does-not-exist", headers={"accept": "text/html"})
    assert response.status_code == 404
    assert "text/html" in response.headers["content-type"]


async def test_unknown_api_route_returns_json_404(client):
    response = await client.get("/api/v1/does-not-exist")
    assert response.status_code == 404
    assert response.json()["detail"]


async def test_internal_demos_are_served(client):
    for p in load_projects():
        if p.demo_url and p.demo_url.startswith("/"):
            response = await client.get(p.demo_url)
            assert response.status_code == 200, p.demo_url


async def test_system_status(client):
    data = (await client.get("/api/v1/system-status")).json()
    assert data["status"] == "HEALTHY"
    assert data["developer"] == load_profile().name
    assert data["total_projects"] == len(load_projects())


async def test_robots_and_sitemap(client):
    robots = await client.get("/robots.txt")
    assert robots.status_code == 200
    assert "Sitemap: https://" in robots.text
    sitemap = await client.get("/sitemap.xml")
    assert sitemap.status_code == 200
    assert "application/xml" in sitemap.headers["content-type"]
    for p in load_projects():
        if p.case_study:
            assert f"/projects/{p.id}</loc>" in sitemap.text


async def test_security_headers(client):
    response = await client.get("/")
    assert response.headers["x-content-type-options"] == "nosniff"
    assert "referrer-policy" in response.headers


async def test_html_is_compressed(client):
    response = await client.get("/", headers={"accept-encoding": "gzip"})
    assert response.headers.get("content-encoding") == "gzip"


async def test_skill_counts_match_gallery_search(client):
    html = (await client.get("/")).text
    haystacks = re.findall(r'data-search="([^"]*)"', html)
    for skill, count in re.findall(r'data-skill="([^"]+)">[^<]*<span class="skill-count"[^>]*>(\d+)<', html):
        tokens = skill.lower().split()
        expected = sum(all(t in h for t in tokens) for h in haystacks)
        assert int(count) == expected, skill


async def test_referenced_static_assets_exist(client):
    html = (await client.get("/")).text
    for path in set(re.findall(r'(?:src|href)="(/static/[^"?]+)', html)):
        if path.endswith("resume.pdf"):
            continue
        assert (await client.get(path)).status_code == 200, path
