"""Refresh the "updated" dates in app/data/projects.json from the public GitHub API.

Run it locally before committing, not on the server, so the site never depends on GitHub
being reachable:

    python scripts/refresh_catalogue.py            # update dates in place
    python scripts/refresh_catalogue.py --check    # only report differences

It also lists public repositories that are not in the catalogue yet, so new projects are
not forgotten. Unauthenticated requests are limited to 60 per hour; set GITHUB_TOKEN in your
shell to raise that. The token is only used by this script and never reaches the website.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

OWNER = "Charanloyal"
CATALOGUE = Path(__file__).resolve().parents[1] / "app" / "data" / "projects.json"
# Repositories intentionally left out of the catalogue (notes, coursework, superseded copies).
IGNORED = {
    "portfolio", "Charanloyal", "system-design", "github-history", "volumeincreases99",
    "featurehub", "dataguard", "Complete-SQL-NOTES-", "-DBMS_Notes-", "RA2311053010129",
    "react-mastery-portal", "Advanced-Async-Data-Analytics-Portal", "fullstack-assignment-week1-2",
    "week1-personal-info-", "week2-grade-calculator-", "week3-contact-manager",
    "week4-Personal-Finance-Tracker", "Alemeno.Backend-Devops.Assignment",
}


def fetch_repos() -> list[dict]:
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "portfolio-catalogue-refresh"}
    if token := os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {token}"
    url = f"https://api.github.com/users/{OWNER}/repos?per_page=100&type=owner"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def main() -> int:
    parser = argparse.ArgumentParser(description="Refresh project dates from GitHub.")
    parser.add_argument("--check", action="store_true", help="report differences without writing")
    args = parser.parse_args()

    try:
        repos = fetch_repos()
    except urllib.error.HTTPError as exc:
        if exc.code in (403, 429):
            print("GitHub rate limit reached. Try again later or set GITHUB_TOKEN. Catalogue unchanged.")
        else:
            print(f"GitHub API error {exc.code}. Catalogue unchanged.")
        return 1
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"Could not reach GitHub ({exc}). Catalogue unchanged.")
        return 1

    pushed = {r["name"].lower(): r["pushed_at"][:10] for r in repos if not r.get("fork")}
    data = json.loads(CATALOGUE.read_text(encoding="utf-8"))
    changed = 0
    for project in data["projects"]:
        new = pushed.get(project["repo"].lower())
        if new is None:
            print(f"! {project['id']}: repository '{project['repo']}' not found on GitHub")
        elif new != project["updated"]:
            print(f"~ {project['id']}: {project['updated']} -> {new}")
            project["updated"] = new
            changed += 1

    listed = {p["repo"].lower() for p in data["projects"]}
    ignored = {name.lower() for name in IGNORED}
    for name in sorted(pushed):
        if name not in listed and name not in ignored:
            print(f"+ not in catalogue: {name} (add it to app/data/projects.json or IGNORED)")

    if changed and not args.check:
        CATALOGUE.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Updated {changed} project(s).")
    elif not changed:
        print("All dates are current.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
