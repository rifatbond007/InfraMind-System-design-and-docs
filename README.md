# InfraMind — System Design & Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/ded5410f-f87e-43db-91e1-5a3c32134354/deploy-status)](https://app.netlify.com/projects/inframind-agent/deploys)

Design and build-status documentation for **InfraMind**, a Kubernetes-based multi-signal incident detection and graph-guided root cause analysis system (BSc capstone, BAIUST CSE).

The site shows, for every part of the system, **what was planned, what is built, and where they differ**. The implementation lives in the separate `infraMind` repository.

## Status (21 Oct 2026)

| Phase | State |
|---|---|
| P0–P4b: tooling, testbed, signal schema + Redis bus, ingestion, detection, correlation | Built and tested (509 tests pass) |
| P5 RCA, P5b LLM explainer, P6 alerting + storage + API | Designed, not built |
| P7 evaluation, P8 packaging, P9 paper | Not started |

Open blocker: Chaos Mesh only injects pod-level faults on the kind testbed (containerd runtime mismatch).

## Reading the site

- Each section opens with a one-line summary and status tags, then a status-coloured diagram, then a **Plan vs Built** table. Longer explanations and the original design figures are folded under **Details**.
- Colour key: **green** = built, **yellow** = changed from the plan or needs attention, **dashed** = planned, not built yet, **red** = blocked, **grey** = third-party tool.
- **Needs your decision** lists the changes from the proposal that wait on supervisor approval.
- The **Light / Dark** toggle in the side nav switches the theme. The choice is remembered in your browser; the first visit follows your system setting.

## Contents

- `src/` — the docs site (Vite + React 18). Start here.
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
