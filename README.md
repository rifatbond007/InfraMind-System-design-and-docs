# InfraMind — System Design & Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/ded5410f-f87e-43db-91e1-5a3c32134354/deploy-status)](https://app.netlify.com/projects/inframind-agent/deploys)

Design and build-status documentation for **InfraMind**, a Kubernetes-based multi-signal incident detection and graph-guided root cause analysis system (BSc capstone, BAIUST CSE).

The site shows, for every part of the system, **what was planned, what is built, and where they differ**. The implementation lives in the separate `infraMind` repository (`inframind-core`).

## Status (10 Nov 2026)

| Phase | State |
|---|---|
| P0–P4b: tooling, testbed, signal schema + Redis bus, ingestion, detection, correlation | Built, tested and verified live |
| P5 RCA, P5b LLM explainer, P6 alerting + storage + API, P8 Helm packaging | Built, tested and wired end to end; seen live on the testbed (969 tests pass) |
| P7 evaluation | Harness built, replay only; no results yet |
| P9 paper | Not started |

Since 10 Nov (D28) the `rca` process runs `python -m inframind.main`: the RCA worker plus a hook that stores every ranked incident in Postgres, asks a hosted LLM (Groq by default) for a summary when an alert is due, sends the alert and records it with audit rows. A live traffic burst went through every stage to the API. Open items: a run with an LLM key set, a live chaos fault, supervisor review of D28; Chaos Mesh only injects pod-level faults on the kind testbed (containerd runtime mismatch), which blocks 6 of 14 scenarios.

## Reading the site

The site has two pages: a product landing page at `/` and the system design docs at `/system-design/` (the **Docs** tab; `/docs` redirects there on Netlify).


- Each section opens with a one-line summary and status tags, then an animated, status-coloured diagram (moving packets show links that carry data today; hover a box to highlight its links), then a **Plan vs Built** table. Longer explanations and the original design figures are folded under **Details**.
- Colour key: **green** = built, **yellow** = changed from the plan or needs attention, **dashed** = planned, not built yet (a dashed arrow between built boxes = code exists but is not wired), **red** = blocked, **grey** = third-party tool.
- **Needs your decision** lists the changes from the proposal that wait on supervisor approval.
- The **Light / Dark** toggle in the side nav switches the theme. The choice is remembered in your browser; the first visit follows your system setting.

## Contents

- `index.html` + `src/landing/` — the product landing page.
- `system-design/index.html` + `src/App.jsx`, `src/components/` — the system design docs.
- `docs/InfraMind_PRD_v1.1.pdf` — the original Product Requirements Document (the "Plan" column).
- `docs/index.html` — the original pre-development static site, kept for reference.
- `docs/assets/`, `public/assets/` — original design figures, shown on the site as "Original design".

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

Deployed on Netlify: build command `npm run build`, publish directory `dist/`.
