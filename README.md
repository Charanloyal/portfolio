# B. Charan Kumar Reddy · Engineering Portfolio

Software & AI/ML Engineer | Distributed Systems, LLM Architecture & Data Pipelines.

**Live site:** https://charanloyal.github.io/portfolio/

A static React + TypeScript site built with Vite and deployed to GitHub Pages by GitHub Actions. It is aimed at engineering screens for SWE / SDE, AI/ML and data engineering roles: an impact summary, an experience timeline, a role-filtered project showcase with architecture write-ups, a skills matrix, achievements and contact.

## What's on the site

- **Hero:** availability badge, primary actions (Explore Architecture, View GitHub, Contact Me) and a copy-email button with toast feedback.
- **Impact bar:** headline numbers, each with its source.
- **Experience timeline:** six internships with measured outcomes, plus education.
- **Project showcase:** filter tabs for *All*, *AI & Agents*, *Distributed Systems / SDE* and *Data & ML*. Each card follows problem → architecture → impact and opens an accessible **Architecture & system design** dialog with the data flow, key trade-offs, benchmarks (with the committed evidence file for each number), testing and known limitations. Dialogs are deep-linkable: `#projects/<id>`, for example [`#projects/lakeflow`](https://charanloyal.github.io/portfolio/#projects/lakeflow).
- **Skills matrix, achievements, certifications and contact.**
- Two in-browser demos served from this repo: the AeroTest A/B testing calculator (`/portfolio/demos/ab-testing/`) and a fraud-monitoring simulation on synthetic data (`/portfolio/demos/fraud-detector/`).

## Project structure

```
index.html                 Entry HTML: title, meta description, Open Graph/Twitter tags, JSON-LD
vite.config.ts             base: '/portfolio/' for GitHub Pages; Vitest config
src/
  main.tsx, App.tsx        Bootstrap and page layout
  components/              Header, Hero, ImpactBar, Experience, Projects, ProjectCard,
                           ArchitectureDialog, Skills, Achievements, Contact/Footer, Toast, Icons
  hooks/                   Active-section tracking, scroll state, clipboard + toast
  data/
    catalogue.json         Every public project: summary, tech, status, metrics + evidence, case studies
    projects.ts            Showcase selection and order, role tracks, path helpers
    profile.ts             Identity, impact metrics, experience, skills, hackathons, certifications
    types.ts               Content types
  styles/global.css        Design tokens and all styles (dark glassmorphism, responsive, reduced motion)
public/                    Copied as-is: avatar, favicon, og-image.png, project screenshots, demos, 404.html
tests/content.test.ts      Content integrity tests (Vitest)
.github/workflows/         deploy.yml (Pages) and ci.yml (pull requests)
```

## Editing content

All content lives in `src/data/`. Components don't need changes for content updates.

- **Profile, experience, skills, hackathons:** edit `src/data/profile.ts`. To show a hackathon placement, set `result` on that entry (for example `result: '1st Place'`); it renders as a badge.
- **Add a project to the showcase:** add or update its entry in `src/data/catalogue.json` with a `brief` (`problem`, `approach`, `outcomes`) and a `case_study` (`problem`, `architecture`, `decisions`, `testing`, `results`, `limitations`), then add `{ id, tracks, tagline }` to `SHOWCASE` in `src/data/projects.ts`. Order in that list is display order. Catalogue projects not in the showcase are listed under *More public repositories*.
- **Metrics:** every entry in `metrics` needs an `evidence` string naming the committed file (and field) the number comes from. Numbers without evidence don't belong on the site; describe the outcome in `brief.outcomes` instead.
- **Synthetic data:** set `"synthetic_data": true` for any project built or evaluated on generated or fictional data; cards and dialogs then show a *Synthetic data* label.
- **Status:** `complete`, `in-progress`, `experimental` or `learning`.
- **Images and demos:** paths without `https://` are relative to the site root (for example `projects/lakeflow.webp`, `demos/ab-testing/`) and resolve against the `/portfolio/` base path.
- **Keep notes out of the data files:** this repository is public.

## Running locally

Requires Node.js 22.12 or later.

```bash
npm ci
npm run dev        # http://localhost:5173/portfolio/
```

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks, then builds the static site into `dist/` |
| `npm run preview` | Serves `dist/` at http://localhost:4173/portfolio/ |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (TypeScript + React hooks rules) |
| `npm test` | Content integrity tests (Vitest) |
| `npm run check` | Type check, lint and tests |

The tests check that project ids are unique, every repository link points at `github.com/Charanloyal`, every metric has evidence, bundled asset paths work under the base path, every showcase project has a full case study, every role filter has projects, and the profile no longer references the retired Render deployment.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main` (and on manual dispatch): `npm ci`, lint, tests, `npm run build`, then uploads `dist/` with `actions/upload-pages-artifact` and publishes it with `actions/deploy-pages`. `ci.yml` runs the same checks on pull requests.

One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.

The site was previously a FastAPI app on Render. `public/404.html` redirects that site's old paths: `/projects/<id>` opens the matching architecture dialog, and `/ab-testing/` and `/fraud-detector/` go to the demos.

## Contact

- Email: [charan.workmaill@gmail.com](mailto:charan.workmaill@gmail.com) · [charankumarreddy2028@gmail.com](mailto:charankumarreddy2028@gmail.com)
- LinkedIn: [b-charan-kumar-reddy](https://www.linkedin.com/in/b-charan-kumar-reddy)
- GitHub: [@Charanloyal](https://github.com/Charanloyal)
