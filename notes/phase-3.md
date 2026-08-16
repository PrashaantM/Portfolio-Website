# Phase 3 — Initialize the Repository

Steps I'm going to run myself, in order. Checking each off as I verify it
actually worked — not just that the command didn't error.

## 3.0 Create the project

Scaffolding React + TypeScript with Vite, directly in the repo root.

- [x] `npm create vite@latest . -- --template react-ts`
      Ran into a wrinkle: the repo root already had an *empty* leftover
      `node_modules/` (directory names with zero files inside — a dead
      install from before this session, no `package.json` anywhere). To
      avoid the interactive "directory not empty" prompt entirely, I
      scaffolded into a throwaway temp folder instead
      (`npm create vite@latest scaffold -- --template react-ts`), then
      copied everything over except its generated `README.md` (kept my
      own). Same end result, no prompt to navigate.
- [x] `npm install`
      Installs everything from the generated `package.json`.

**Add Tailwind CSS** (v4's Vite plugin — no separate config file needed to
start):

- [x] `npm install tailwindcss @tailwindcss/vite`
- [x] In `vite.config.ts`, import the plugin and add it to `plugins: []`
      alongside the React plugin.
- [x] In the main stylesheet Vite generated (`src/index.css`), replace the
      contents with `@import "tailwindcss";`
- [x] Since the Tailwind ecosystem moves fast, I'll check the installed
      version's own setup docs if anything here doesn't match what I see.

**Add the rest of the baseline from Phase 2:**

- [x] `npm install motion` (Motion/Framer Motion — the package is just
      called `motion` now)
- [x] `npm install lucide-react` (icons)

**Prettier** (Vite's `react-ts` template already includes ESLint, Prettier
does not come by default):

- [x] `npm install -D prettier`
      Correction to my own note above: the `react-ts` template I actually
      got does **not** ship ESLint anymore — it ships `oxlint` (a Rust-based
      linter) wired up as `npm run lint`, plus an `.oxlintrc.json`. This is
      current upstream Vite behavior, not something I chose. Prettier still
      installed as planned for formatting; oxlint is what runs for linting
      instead of ESLint. Worth deciding later whether to add ESLint back in
      or stay on oxlint — no decision made yet, just flagging the swap.

## Verify Phase 3.0's checklist — don't move on until all of these pass

- [x] `npm run dev` — dev server starts, site loads at the local URL
      (verified by curling it, HTTP 200)
- [x] `npm run build` — production build succeeds with no errors
- [x] TypeScript works — the build step above type-checks
      (`tsc -b`) as part of `npm run build`; a broken type should fail it
- [x] `npm run lint` — linting runs clean on the fresh scaffold (via oxlint,
      see note above)
- [x] `git status` — confirms this is still the existing repo, not a new one
- [x] Commit the scaffold once everything above passes

## 3.1 Establish the folder architecture

Vite's template already creates `public/` and `src/` with a couple of
starter files. Adding the rest of the structure on top, and I should be able
to say *why* each directory exists before I create it:

- [x] `public/audio/` — static audio files served as-is (music toggle,
      Phase 11), not processed by the build
- [x] `public/images/` — static images referenced directly by URL/path
      rather than imported into components
- [x] `public/fonts/` — self-hosted font files, if I'm not using a CDN
- [x] `src/assets/` — images/icons/etc. that *are* imported into
      components, so Vite can process and hash them for caching
      (already created by the Vite scaffold itself)
- [x] `src/components/` — small, reusable UI pieces used across sections
      (buttons, cards, nav)
- [x] `src/sections/` — the big page sections from Phase 1.2 (Hero, About,
      Skills, Projects, ...) — each one composed out of `components/`
- [ ] `src/data/` — the actual content: project info, skills list,
      experimental lab ideas — kept separate from UI so content changes
      don't mean touching component code
- [ ] `src/hooks/` — reusable stateful logic (e.g. a `useReducedMotion`
      hook, a scroll-position hook) shared across components
- [ ] `src/lib/` — plain utility functions/helpers with no React in them
- [x] `src/styles/` — global styles, design tokens, anything beyond
      component-level Tailwind classes

Deliberately left `data/`, `hooks/`, `lib/` uncreated — no immediate use for
them yet, per my own rule above. The rest (`public/audio`, `public/images`,
`public/fonts`, `src/components`, `src/sections`, `src/styles`) are created
but empty, since git doesn't track empty directories they won't show up in
`git status`/commits until something real lands in them.

## Notes / issues while running this

> Found a broken leftover `node_modules/` in the repo root before starting —
> ~120 package directories but zero actual files inside them, and no
> `package.json` anywhere to explain it. Looked like a previous `npm
> install` that got interrupted or wiped mid-way. Deleted it before
> scaffolding since there was nothing real in it to lose.
>
> The Vite `react-ts` template pulled in oxlint instead of ESLint (see the
> Prettier note above) — not something this doc anticipated. Also had to
> manually fix `package.json`'s `"name"` field and `index.html`'s `<title>`,
> both of which came through as `"scaffold"` from the temp directory I
> scaffolded into (copy-and-merge trick to dodge the "directory not empty"
> prompt) — worth double-checking generated files for leftover temp names
> when using that trick again.
