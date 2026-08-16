# Phase 14: Interactive Project Visualization

Extends `src/sections/Projects.tsx` from Phase 9 rather than creating
a new top-level section. New files: `src/data/architecture.ts`,
`src/components/ArchitectureMap.tsx`. Built last, once Phase 13's
`DrawLine` existed to build real connectors with instead of the plain
static divider `About`'s `IdentityMap` (Phase 7) used for its own
tiers.

## Why this lives inside Projects instead of its own section

Phase 14 asks for "at least one impressive technical visualization,"
not a new page section. `App.tsx`'s nav already covers About, Skills,
Projects, Lab, Experience, Interests, and Contact; adding an eighth
top-level anchor for one visualization would go against Phase 1.2's
own rule ("do not create ten separate pages unless there is a real
information-architecture reason"). An "Architecture Deep Dive"
subsection at the bottom of Projects, separated by the existing
`.divider-ink` motif, keeps it discoverable without a new nav entry.

## Which project, and why

The MCQ Exam Management Platform, the flagship project from Phase 9
and the one with the most detailed architecture already on record
(a frontend, an auth-checked API layer, a background worker, and a
database, each with a real reason it exists). Every fact in
`src/data/architecture.ts` traces back to that project's existing
entry in `src/data/projects.ts`, the same `architecture` and
`decision` fields written in Phase 9. Nothing new was invented; each
node just takes a fact that was already sitting in one paragraph and
gives it its own `technology` / `responsibility` / `why` /
`detail` breakdown, matching Phase 14's exact spec for what clicking
a node should reveal.

## The interaction

Same shape as `IdentityMap` (Phase 7): a column of clickable nodes,
one active at a time, its detail panel updating below with
`aria-live="polite"` so a screen reader announces the change too.
What is different: four data fields per node instead of one
paragraph, and a real drawn connector between each tier
(`DrawLine`, Phase 13's `pathLength`-based SVG animation) instead of
`IdentityMap`'s static `bg-border h-8 w-px` divider.

One column at every width rather than a separate mobile layout. The
brief's own Phase 16 example shows a desktop graph collapsing into
mobile cards, but that only makes sense for a wide, branching graph.
This map was already a single vertical column to begin with (a
straightforward pipeline: frontend to API to worker to database, not
a wide fan-out), so the same interaction already works identically at
320px and 1440px. Building a second mobile-specific layout for an
interaction that does not actually change shape between breakpoints
would have been complexity with no real payoff.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Clicked through all four nodes and screenshotted each state to
      confirm the panel's technology/responsibility/why/detail text
      actually changes per node, not just that the click handler fires
- [x] Confirmed the active node gets a visible highlighted state
      (accent border and background) distinct from the other three
- [x] Screenshotted at mobile width (390px) to confirm the column and
      connectors stay readable and the interaction is unchanged
- [x] Checked the browser console for errors: none

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173**, click **Projects** in the nav, and
scroll past the project grid to **Architecture Deep Dive**. Click
each node (Frontend, REST API / Auth, Background Worker, Database)
and watch the panel on the right update, along with the connecting
line drawing in as the section first scrolls into view.
