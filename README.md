# B. Charan Kumar Reddy · Engineering Portfolio

Distributed Systems & AI Infrastructure Engineer (SDE / FDE / AI-Infra).

**Live site:** https://charan-reddy-dev.github.io/portfolio/

A static React + TypeScript site built with Vite and deployed to GitHub Pages by GitHub Actions. It is aimed at engineering screens for SWE-I / SDE-I, AI-Infra / AI/ML, Forward Deployed Engineer and data engineering roles at product companies and GCCs. The design is editorial and minimal: a dark `#07090e` canvas, frosted surfaces with hairline borders, one sky accent (`#38bdf8`) and emerald (`#10b981`) for live status and measured impact.

## What's on the site

- **Floating pill navigation:** centered glass pill with *About*, *Work*, *Projects*, *Stack* and *Contact*, active-section tracking, and GitHub/LinkedIn shortcuts. Anchors land 96px below the top (`scroll-margin-top`).
- **About (`#about`):** availability pill, headline, two-line pitch, *Explore Work*, GitHub, LinkedIn and *Copy Email* (with toast), and a four-cell KPI strip with a source under each number.
- **Work (`#work`, alias `#experience`):** an interactive split pane. The left rail is an ARIA vertical tab list of companies (monogram, role, period) with a sliding indicator; arrow keys, Home and End move between roles. The right pane shows the role, company, location, employment type, domain, impact pills, bullets (with `**bold**` metrics) and a tech stack. *Expand all roles* stacks every role for recruiters who prefer to scan. Roles live in `src/data/profile.ts` (`start`/`end` as `YYYY-MM`; period and tenure are computed).
- **Projects (`#projects`):** filters for *All*, *AI & Agents*, *Distributed Systems / SDE* and *Data & ML*; the first 8 cards per filter with *Show all*. Each card follows problem → architecture → impact and opens an **Architecture & system design** dialog (data flow, trade-offs, benchmarks with the committed evidence file for each number, testing, limitations). Escape closes it; dialogs are deep-linkable, e.g. [`#projects/lakeflow`](https://charan-reddy-dev.github.io/portfolio/#projects/lakeflow).
- **Stack (`#stack`):** skills by domain, hackathons, LeetCode and certifications.
- **Contact (`#contact`):** mailto, copy address, LinkedIn, GitHub and résumé.
- Two in-browser demos served from this repo: the AeroTest A/B testing calculator (`/portfolio/demos/ab-testing/`) and a fraud-monitoring simulation on synthetic data (`/portfolio/demos/fraud-detector/`).
- Motion is CSS-only (no animation library) and is switched off under `prefers-reduced-motion`.

## Project structure

```
index.html                 Entry HTML: title, meta description, Open Graph/Twitter tags, JSON-LD
vite.config.ts             base: '/portfolio/' for GitHub Pages; Vitest config
src/
  main.tsx, App.tsx        Bootstrap and page layout
  components/              FloatingNav, Hero, Work, Projects, ProjectCard, ArchitectureDialog,
                           Stack, Contact/Footer, Section, Toast, Icons
  hooks/                   Active-section tracking, scroll state, clipboard + toast
  data/
    catalogue.json         Every public project: summary, tech, status, metrics + evidence, case studies
    projects.ts            Showcase selection and order, role tracks, path helpers
    profile.ts             Identity, impact metrics, experience, skills, hackathons, certifications
    types.ts               Content types
  styles/global.css        Design tokens (#07090e canvas, frosted surfaces, sky and emerald accents) and all styles
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

The tests check that project ids are unique, every repository link points at the owner's GitHub account, every metric has evidence, bundled asset paths work under the base path, every showcase project has a full case study, every role filter has projects, and the profile no longer references the retired Render deployment.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main` (and on manual dispatch): `npm ci`, lint, tests, `npm run build`, then uploads `dist/` with `actions/upload-pages-artifact` and publishes it with `actions/deploy-pages`. `ci.yml` runs the same checks on pull requests.

One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**. Don't add the suggested Jekyll or static starter workflows; they publish the raw repository instead of the build.

### GitHub username

The site never hard-codes the account name. In GitHub Actions, `vite.config.ts` reads `GITHUB_REPOSITORY_OWNER` and fills in the repository links, the `<user>.github.io` URLs and the meta tags (`__GITHUB_USER__` in `index.html`). After renaming the account, update `DEFAULT_GITHUB_USER` in `vite.config.ts` for local builds (or set `PORTFOLIO_GITHUB_USER`) and push; the deployed site follows automatically.

The site was previously a FastAPI app on Render. `public/404.html` redirects that site's old paths: `/projects/<id>` opens the matching architecture dialog, and `/ab-testing/` and `/fraud-detector/` go to the demos.

## Contact

- Email: [charan.workmaill@gmail.com](mailto:charan.workmaill@gmail.com) · [charankumarreddy2028@gmail.com](mailto:charankumarreddy2028@gmail.com)
- LinkedIn: [b-charan-kumar-reddy](https://www.linkedin.com/in/b-charan-kumar-reddy)
- GitHub: [@charan-reddy-dev](https://github.com/charan-reddy-dev)
