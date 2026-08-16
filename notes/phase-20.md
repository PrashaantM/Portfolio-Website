# Phase 20: Testing

New: `vitest.config.ts`, `src/test/setup.ts`, `playwright.config.ts`,
`e2e/site.spec.ts`, five `*.test.tsx`/`*.test.ts` files. New
devDependencies: `vitest`, `@testing-library/react`, `@testing-library/
jest-dom`, `@testing-library/user-event`, `jsdom`, `@playwright/test`,
`@axe-core/playwright` (the last two were actually installed back in
Phases 15/17/18 to drive real-browser verification during those phases;
this is where they become permanent, checked-in parts of the test
suite rather than ad-hoc tools). Modified: `package.json` (`test`,
`test:watch`, `test:e2e` scripts), `tsconfig.node.json` (covers the two
new root config files, matching how `vite.config.ts` was already
included).

## Two test layers, matching Phase 20's own split

**Unit/component tests** (Vitest + Testing Library + jsdom), scoped
deliberately to leaf components rather than the full `App`: `App` mounts
`Scene3D`'s WebGL probe and `sceneBus`'s machinery, neither of which
means anything under jsdom (no real `<canvas>` context, no real
`AudioContext`). Testing `Navbar`, `ProjectCard`, `MusicToggle`, and
`ArchitectureMap` directly sidesteps all of that while still covering
everything Phase 20 actually asks for: navigation, project cards,
interactive controls, the music toggle. Plus `src/data/data.test.ts`,
the "important data transformations" case: a plain assertion that every
project/skill category/lab idea/experience entry/interest has its
required fields non-empty and that every project's GitHub URL actually
looks like a real GitHub URL. Twenty-two tests total, all passing.

**One end-to-end spec** (Playwright), matching Phase 20's exact
prescribed flow: open the site, navigate via a real nav click, expand a
project's "How it works" panel, toggle music, reach Contact and verify
the real `mailto:`/GitHub `href` values render correctly, not just that
the labels do. A second spec in the same file runs `@axe-core/playwright`
against a fully-settled page (scrolled through first, same lesson
learned in `notes/phase-15-accessibility.md`) and fails on any
`critical`/`serious` violation.

## Three real setup problems, each with a concrete fix

**1. jsdom implements neither `matchMedia` nor `IntersectionObserver`.**
Both are load-bearing here: `useReducedMotion` (Motion) reads
`matchMedia` under the hood, and every scroll-triggered component
(`Reveal`, `DrawLine`, anything using `whileInView`) constructs a real
`IntersectionObserver`. Without stubs, mounting almost any section
throws instead of rendering. `src/test/setup.ts` stubs both; neither
needs to actually fire a callback for these tests; a component's DOM
output doesn't depend on the observer ever reporting a real
intersection, only on the constructor existing.

**2. No `test.globals: true`, so Testing Library's auto-cleanup never
registered.** This project explicitly imports `describe`/`it`/`expect`
everywhere rather than relying on injected globals, which is consistent
with how the rest of the codebase avoids implicit magic, but it has one
real consequence: Testing Library's automatic per-test `cleanup()` hooks
into a global `afterEach`, and without one, every `render()` after the
first in a file just kept piling more copies into the same jsdom
`document`. First symptom: `ArchitectureMap`'s second test failed with
"Found multiple elements with the role button and name 'REST API /
Auth'", two real copies of the whole component were sitting in the DOM
at once. Fixed with one explicit `afterEach(cleanup)` in the setup file,
importing `afterEach` from `vitest` and `cleanup` from `@testing-library/
react` directly, matching the project's own preference for explicit
imports over ambient globals.

**3. A hand-dispatched `change` event doesn't trigger React's
`onChange` on a controlled `<input type="range">`.** React normalizes
range/text input change handling to the native `input` event, not
`change`; a manually constructed `new Event('change')` silently did
nothing. Testing Library's own `fireEvent.change` helper is built to
handle this correctly (it goes through the input's native value setter
so React's own listener actually fires), so the volume-slider test uses
that instead of hand-rolling the event.

## Environment: same Chrome constraint as every other Phase 15-29
browser step

This sandbox can't download Playwright's own bundled Chromium for this
OS. `playwright.config.ts` runs every project against the system-
installed Google Chrome via `channel: 'chrome'` instead, the same
workaround `notes/phase-15-accessibility.md` and `notes/phase-18.md`
already used for their own verification passes. A CI environment that
can download the bundled browser can drop the `channel` line unchanged.

## One config trap: Vitest's default include pattern also matched the
Playwright spec

`npm run test` initially tried to run `e2e/site.spec.ts` as a Vitest
test too (Vitest's default file glob matches any `*.spec.ts` anywhere in
the project), and failed immediately: that file imports `test`/`expect`
from `@playwright/test`, not Vitest's own, and depends on Playwright's
`page` fixture and `webServer`, neither of which exists under Vitest.
Fixed with an explicit `exclude: ['node_modules/**', 'e2e/**']` in
`vitest.config.ts`.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] `npm run test`: 22/22 passing across 5 files
- [x] `npm run test:e2e`: 2/2 passing (the full user-journey flow and
      the accessibility scan)
- [x] Confirmed the `afterEach(cleanup)` fix by re-running the exact
      test that failed without it and watching it turn from a genuine
      "duplicate elements" failure to a pass, not just adding the fix
      and assuming

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run test          # unit/component tests
npm run test:e2e      # end-to-end + accessibility scan (starts its own dev server)
```
