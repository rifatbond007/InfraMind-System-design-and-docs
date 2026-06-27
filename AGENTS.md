# AGENTS.md

## Repository type

Design-document repo (pre-development). No code, no build/test/lint tooling.

## What's here

- **`docs/`** — `index.html` (monochrome documentation site with right-side nav, open in browser), `InfraMind_PRD_v1.1.pdf`, and per-section HTML pages (`architecture.html`, `pipeline.html`, `ingestion.html`, `detection.html`, `rca.html`, `alerting.html`, `decisions.html`) with shared `style.css`
- **`docs/assets/`** — architecture diagrams and UI mockups (`Pasted image*.png`)
- **`.puku/`** — Cline project knowledge store. Do not modify (excluded via `.gitignore`)
- **`/`** — React single-page-app version of the docs (Vite + React 18):
  - `package.json` — deps (react 18, react-dom, vite 6, @vitejs/plugin-react)
  - `index.html` — Vite entry point
  - `vite.config.js` — Vite + React plugin
  - `src/main.jsx` — React entry (StrictMode + createRoot)
  - `src/App.jsx` — layout wrapper (sticky sidebar nav + scroll-to-section)
  - `src/index.css` — full brutalist stylesheet (373 lines, all breakpoints)
  - `src/components/` — 11 components: Navbar, Hero, Figure, Architecture, PipelineDetail, Ingestion, Detection, RCA, Alerting, Decisions, TechStack, Glossary
  - **`public/assets/`** — 12 PNG images (copied from `docs/assets/`)
- **React app commands**: `npm run dev` (dev server), `npm run build` (production build → `dist/`)

## React app architecture

- Brutalist design: black borders, Space Mono for headings/nav, off-white bg (#fcfcf7)
- Single-page layout: left sidebar nav (vertical tabs, scroll-active tracking via requestAnimationFrame), main content area
- All section content ported from `docs/index.html` verbatim
- Images served from `/assets/...` (public/ directory, URL-encoded spaces)
- Netlify deploy: set Publish directory to `dist/`, no special SPA config needed
