# AGENTS.md

## Repository type

Documentation site for InfraMind. The implementation lives in the sibling repo `../infraMind`; this repo documents its design and build status for the research supervisor. Build tooling: Vite + React 18 (`npm run dev`, `npm run build` → `dist/`), multi-page: `index.html` (landing page at `/`) and `system-design/index.html` (docs at `/system-design/`, the landing page's "Docs" tab). No tests.

## What's here

- **`src/landing/`** — product landing page (hero, integrations, features, evidence hub, trust, alerts & API, quickstart, roadmap, FAQ; `Landing.jsx` sections, `parts.jsx` shared pieces, `landing.css` tokens with light/dark). Calm warm-neutral style with one indigo accent, after puku.sh. Shares the `theme` localStorage key with the docs.
- **`public/_redirects`** — Netlify: `/docs` → `/system-design/`
- **`src/`** (outside `landing/`) — React docs site:
  - `App.jsx` — layout: sticky left nav + one reading column, scroll-tracked active link
  - `components/Navbar.jsx` — nav, colour key and Light/Dark toggle (sets `data-theme` on `<html>`, saved in localStorage; `index.html` applies the saved theme before first paint)
  - `index.css` — brutalist stylesheet: colour tokens on `:root` with dark-mode overrides, status colours (built / changed / blocked / planned / third-party), all breakpoints
  - `components/ui.jsx` — shared primitives: `Section`, `Pill`, `PlanBuilt` table, `Table`, `Details` (folded), `Flow` (status-coloured, animated SVG box diagram: draw-in on scroll, packets on live edges, hover focus; `'todo'` as an edge's third element marks a built-but-unwired link), `OriginalFigure`, `Bullets`
  - `components/` — one file per section: Hero (overview), Decide (needs supervisor decision), Architecture, Testbed, Ingestion, Detection, Correlation, RCA, Alerting (explainer + alerting + storage), Evaluation, Packaging, Decisions, TechStack, Glossary, Navbar
- **`public/assets/`** — original design PNGs (copied from `docs/assets/`), shown inside "Details" as "Original design"; referenced with absolute `/assets/...` paths so they resolve under `/system-design/`
- **`docs/`** — original PRD v1.1 PDF and the old pre-development static site (`index.html`), kept for reference
- **`.puku/`** — Cline project knowledge store. Do not modify (git-ignored)

## Writing rules

- Every section follows the same pattern: one-line summary with status pills → `Flow` diagram → `PlanBuilt` table → `Details` for depth. Keep the main view short.
- The "Plan" column is PRD v1.1 unless labelled otherwise; note where the July 2026 proposal or a decision in `infraMind/docs/decision-tree.md` changed it.
- Only state facts that are in the `infraMind` repo. Label development smoke-run numbers as such; there are no evaluation results yet.
- Use the status vocabulary consistently: `built`, `changed`, `partial`, `blocked`, `planned`, `external`.
- Colours only through CSS tokens so dark mode keeps working.
- Diagram motion is CSS only and must stay off under `prefers-reduced-motion`.
