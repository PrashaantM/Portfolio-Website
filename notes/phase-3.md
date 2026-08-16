# Phase 3 — Initialize the Repository

Steps I'm going to run myself, in order. Checking each off as I verify it
actually worked — not just that the command didn't error.

## 3.0 Create the project

Scaffolding React + TypeScript with Vite, directly in the repo root.

- [ ] `npm create vite@latest . -- --template react-ts`
      The repo root isn't empty (README, portfolio-build.md, notes/,
      resume), so Vite will ask something like *"Current directory is not
      empty. Remove existing files and continue?"* — I need to pick the
      **Ignore files and continue** option (not "Remove"), so my existing
      files survive.
- [ ] `npm install`
      Installs everything from the generated `package.json`.

**Add Tailwind CSS** (v4's Vite plugin — no separate config file needed to
start):

- [ ] `npm install tailwindcss @tailwindcss/vite`
- [ ] In `vite.config.ts`, import the plugin and add it to `plugins: []`
      alongside the React plugin.
- [ ] In the main stylesheet Vite generated (`src/index.css`), replace the
      contents with `@import "tailwindcss";`
- [ ] Since the Tailwind ecosystem moves fast, I'll check the installed
      version's own setup docs if anything here doesn't match what I see.

**Add the rest of the baseline from Phase 2:**

- [ ] `npm install motion` (Motion/Framer Motion — the package is just
      called `motion` now)
- [ ] `npm install lucide-react` (icons)

**Prettier** (Vite's `react-ts` template already includes ESLint, Prettier
does not come by default):

- [ ] `npm install -D prettier`

## Verify Phase 3.0's checklist — don't move on until all of these pass

- [ ] `npm run dev` — dev server starts, site loads at the local URL
- [ ] `npm run build` — production build succeeds with no errors
- [ ] TypeScript works — the build step above type-checks
      (`tsc -b`) as part of `npm run build`; a broken type should fail it
- [ ] `npm run lint` — linting runs clean on the fresh scaffold
- [ ] `git status` — confirms this is still the existing repo, not a new one
- [ ] Commit the scaffold once everything above passes

## 3.1 Establish the folder architecture

Vite's template already creates `public/` and `src/` with a couple of
starter files. Adding the rest of the structure on top, and I should be able
to say *why* each directory exists before I create it:

- [ ] `public/audio/` — static audio files served as-is (music toggle,
      Phase 11), not processed by the build
- [ ] `public/images/` — static images referenced directly by URL/path
      rather than imported into components
- [ ] `public/fonts/` — self-hosted font files, if I'm not using a CDN
- [ ] `src/assets/` — images/icons/etc. that *are* imported into
      components, so Vite can process and hash them for caching
- [ ] `src/components/` — small, reusable UI pieces used across sections
      (buttons, cards, nav)
- [ ] `src/sections/` — the big page sections from Phase 1.2 (Hero, About,
      Skills, Projects, ...) — each one composed out of `components/`
- [ ] `src/data/` — the actual content: project info, skills list,
      experimental lab ideas — kept separate from UI so content changes
      don't mean touching component code
- [ ] `src/hooks/` — reusable stateful logic (e.g. a `useReducedMotion`
      hook, a scroll-position hook) shared across components
- [ ] `src/lib/` — plain utility functions/helpers with no React in them
- [ ] `src/styles/` — global styles, design tokens, anything beyond
      component-level Tailwind classes

I don't need to create empty folders I have no immediate use for — I'll add
`data/`, `hooks/`, `lib/` etc. as soon as I actually need them, not all at
once just to match the diagram.

## Notes / issues while running this

>
