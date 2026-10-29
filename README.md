# Charan Kumar Reddy · Portfolio

Personal portfolio for data engineering, machine learning and backend roles.

**Live site:** https://personal-portfolio-hub-3z4y.onrender.com/

The site is a small FastAPI app that renders server-side HTML from two JSON files, with plain CSS and JavaScript on top. Every project card links to its GitHub repository, demo buttons appear only for demos that have been checked, and any number shown on a project traces back to a results file committed in that repository.

## What's on the site

- **Featured projects**, each with a case study covering the problem, architecture and data flow, design decisions, testing, measured results and limitations.
- **All projects**: every relevant public repository, with category filters, text search, sorting and a "show all" control. It works without JavaScript.
- **Experience, skills and credentials**, generated from `app/data/profile.json`. Each skill chip shows how many projects use or mention it and filters the gallery when selected.
- **Contact** through email, LinkedIn and GitHub. There is no contact form, because nothing would deliver its messages.
- Two in-browser demos served from this repo: an A/B testing calculator (`/ab-testing/`) and a fraud-monitoring simulation on synthetic data (`/fraud-detector/`).

## Project structure

```
app/
  main.py              FastAPI routes: pages, JSON API, sitemap, robots.txt, 404 handling
  content.py           Pydantic models and loaders for the content files
  data/
    projects.json      Project catalogue (one entry per project, plus case studies)
    profile.json       Name, intro, experience, education, certifications, skills
  templates/           base.html, index.html, project.html (case study), 404.html, partials
  static/
    css/site.css       Design tokens and all styles
    js/site.js         Navigation, gallery filtering, copy-to-clipboard (progressive enhancement)
    projects/          Project screenshots (WebP)
    og-image.png       1200×630 link-preview image
scripts/
  refresh_catalogue.py Updates project dates from the GitHub API and lists repos not yet in the catalogue
tests/                 pytest suite
```

## Editing content

Everything shown on the site lives in `app/data/`. Templates don't need changes for content updates.

- **Add a project:** add an object to `app/data/projects.json`. The required fields are validated on startup by `app/content.py`. Set `featured_rank` (1, 2, 3 …) and a `case_study` to feature it.
- **Metrics:** each entry in `metrics` needs an `evidence` string naming the committed file the number comes from. Numbers without evidence don't belong on the site.
- **Demos:** set both `demo_url` and `demo_kind` (`live-app`, `recorded-run`, `browser-simulation` or `browser-calculator`). Temporary tunnel URLs (`trycloudflare.com`) are rejected.
- **Skills:** each item in `profile.json` `skills` is either a tool name (`"FastAPI"`), which gets a project count and filters the gallery, or `{"name": "Prompt engineering", "match": false}` for concepts that shouldn't be counted.
- **Keep notes out of the data files:** this repository is public, so anything in `app/data/` can be read on GitHub even when the site doesn't show it.
- **Resume:** put a PDF at `app/static/resume.pdf`, or set the `RESUME_URL` environment variable. The resume buttons appear only when one of these is present.
- **Refresh dates:** `python scripts/refresh_catalogue.py` (or `--check` for a dry run).

## Running locally

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000. With Docker: `docker-compose up --build`.

## Tests

```bash
pytest
```

The suite renders every page and checks:
- the API, sitemap, robots.txt, 404 handling and security headers;
- that every catalogue project and GitHub link appears;
- that featured projects have case studies and every metric has evidence;
- that the public data files contain no private notes;
- that skill counts match the gallery search;
- that previously removed, unsupported claims don't reappear.

## Deployment

Render builds the `Dockerfile` (see `render.yaml`). The container runs `uvicorn app.main:app` on `$PORT`. The site needs no build step, database or secrets. Optional environment variables are documented in `.env.example`.

## Contact

- Email: [charankumarreddy2028@gmail.com](mailto:charankumarreddy2028@gmail.com)
- LinkedIn: [b-charan-kumar-reddy](https://www.linkedin.com/in/b-charan-kumar-reddy/)
- GitHub: [@Charanloyal](https://github.com/Charanloyal)
