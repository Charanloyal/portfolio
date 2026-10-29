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
    monkeypatch.setattr(load_profile(), "resume_url", None)
    html = (await client.get("/")).text
    assert "Download resume" not in html
    assert "resume.pdf" not in html


async def test_resume_button_shown_when_file_exists(client, monkeypatch, tmp_path):
    pdf = tmp_path / "resume.pdf"
    pdf.write_bytes(b"%PDF-1.4")
    monkeypatch.setattr(main, "RESUME_FILE", pdf)
    monkeypatch.setattr(main, "RESUME_URL_OVERRIDE", None)
    monkeypatch.setattr(load_profile(), "resume_url", None)
    html = (await client.get("/")).text
    assert "Download resume" in html
    assert 'href="/static/resume.pdf" download' in html


async def test_profile_resume_url_is_used_by_default(client, monkeypatch):
    monkeypatch.setattr(main, "RESUME_URL_OVERRIDE", None)
    url = load_profile().resume_url
    assert url and url.startswith("https://"), "profile.json should set a public resume_url"
    html = (await client.get("/")).text
    assert f'href="{url}" target="_blank" rel="noopener"' in html


async def test_resume_url_override_opens_in_new_tab(client, monkeypatch, tmp_path):
    url = "https://example.com/charan-resume.pdf"
    monkeypatch.setattr(main, "RESUME_FILE", tmp_path / "missing.pdf")
    monkeypatch.setattr(main, "RESUME_URL_OVERRIDE", url)
    html = (await client.get("/")).text
    assert f'href="{url}" target="_blank" rel="noopener"' in html
    assert html.count(f'href="{url}"') >= 3  # hero, header nav and contact section
    case_study = (await client.get("/projects/lakeflow")).text
    assert f'href="{url}"' in case_study


async def test_hero_has_primary_actions(client):
    html = (await client.get("/")).text
    hero = html.split('id="about"')[0]
    assert 'href="#projects"' in hero
    assert 'href="#contact"' in hero
    for role in load_profile().target_roles:
        assert role in hero


def test_featured_projects_are_the_six_priorities():
    assert [p.id for p in featured_projects()] == [
        "lakeflow",
        "featurehub-dataguard",
        "ticketlens",
        "drivedocs",
        "neural-gateway",
        "vehicle-telemetry-anomaly-detection",
    ]
    for p in featured_projects():
        assert p.brief and p.brief.problem and p.brief.approach, p.id
        # A card shows either measured metrics or tested outcomes, never an empty results block.
        assert p.metrics or p.brief.outcomes, p.id


async def test_synthetic_data_projects_are_labelled(client):
    html = (await client.get("/")).text
    synthetic = [p for p in load_projects() if p.synthetic_data]
    assert synthetic
    for p in synthetic:
        assert "synthetic" in p.summary.lower() or "fictional" in p.summary.lower(), p.id
        card = html.split(f'data-search="{p.title.lower()}')[1].split("</article>")[0]
        assert "Synthetic data" in card, p.id
        page = await client.get(f"/projects/{p.id}")
        if page.status_code == 200:
            assert "Synthetic data" in page.text, p.id


async def test_status_filter_lists_every_status_in_use(client):
    html = (await client.get("/")).text
    assert "data-gallery-status-filter" in html
    for status in {p.status for p in load_projects()}:
        assert f'<option value="{status}">' in html, status
        assert f'data-status="{status}"' in html, status


async def test_credentials_are_grouped_by_kind(client):
    html = (await client.get("/")).text
    profile = load_profile()
    section = html.split('id="credentials"')[1].split('id="contact"')[0]
    assert "Certifications" in section
    if any(c.kind == "professional-certificate" for c in profile.certifications):
        assert "Professional certificates" in section
    if profile.simulations:
        assert "Virtual job simulations" in section and "Not employment" in section
    for c in profile.certifications:
        assert c.name in section


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
