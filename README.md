# Prashaant Mudgala's Portfolio

A personal software-engineering portfolio built with React, TypeScript, Vite,
and Tailwind CSS, animated with Motion and a lazy-loaded Three.js layer.
Built incrementally, phase by phase, following [`portfolio-build.md`](./portfolio-build.md);
the reasoning behind every phase's decisions lives in [`notes/`](./notes).

**Live site:** https://prashaantm.github.io/Portfolio-Website/ (live once the
first deploy from `main` finishes; see Deployment below).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Motion (Framer Motion) for scroll-driven animation
- Three.js / React Three Fiber for the WebGL background layer
- Vitest + Testing Library for unit/component tests
- Playwright for end-to-end tests

## Running locally

```bash
npm install
npm run dev
```

Open the URL the dev server prints (it includes the GitHub Pages base path,
so it won't be a bare `http://localhost:5173/`).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint |
| `npm run test` | Run unit/component tests (Vitest) |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run fetch:github` | Refresh `src/data/github-stats.json` from the GitHub API |

## Deployment

Deployed to GitHub Pages via `.github/workflows/deploy.yml`: every push to
`main` lints, tests, builds, and publishes automatically. First-time setup
(one manual step): in the repo's **Settings → Pages**, set **Source** to
**GitHub Actions**. See `notes/phase-22.md` for the full story, including the
Cloudflare Pages config this replaced.
