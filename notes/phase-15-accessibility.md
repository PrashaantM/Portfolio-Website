# Phase 15: Accessibility

Naming note: `notes/phase-15.md` already exists in this project and
documents a big animation/audio overhaul session that used "15" as a
running session count, not a `portfolio-build.md` phase number. This
file is the real Phase 15 from the build doc, Accessibility, hence the
disambiguated filename.

Modified: `src/components/ArchitectureMap.tsx`, `src/components/
MusicToggle.tsx`, `src/components/EmberCounter.tsx`, `src/components/
Navbar.tsx`, `src/components/ProjectCard.tsx`, `src/components/
LabCard.tsx`, `src/sections/Projects.tsx`. New devDependencies:
`@playwright/test`, `@axe-core/playwright` (both real, permanent test
dependencies going forward, not ad-hoc installs, since Phase 20's test
suite needs them too).

This project has been accessibility-conscious every phase already:
reduced motion checked explicitly in nearly every prior note, real
`<button>`/`<select>`/`<input>` elements throughout, `aria-live` on
dynamic panels, a working `SkipLink`, visible `focus-visible` styling on
`Button`/`SkipLink`, `Scene3D` already `aria-hidden` + `pointer-events-
none`. This phase is mostly a real audit, not a rebuild, run with an
actual automated tool (`@axe-core/playwright`) against the live dev
server rather than eyeballing the JSX, plus a manual keyboard pass. Four
real, confirmed issues turned up.

## 1. Accent-red text failed contrast in four spots

Computed the actual contrast ratios rather than assuming: `--color-
text-secondary` (#8b8b93) against `--color-background` (#0a0a0c) is
5.86:1, comfortably clears the 4.5:1 AA minimum for normal text. `base.
css`'s own comment already flagged that `--color-accent` (#c81e3a)
against that same background is only ~3.5:1 (confirmed: 3.49:1), which
is why the sitewide `a { color: text-primary; text-decoration-color:
accent }` rule keeps accent out of actual link text color and uses it
only for the underline, a non-text element that only needs 3:1.

Four spots hadn't followed that same rule and used `text-accent`
directly as real, readable text/link color, not just a decoration:

- `Projects.tsx`'s "Traced from MCQ Exam Management Platform above" line
- `ProjectCard.tsx`'s "Traced further below: full architecture
  breakdown" link
- `LabCard.tsx`'s "not serious, promise" tag
- `EmberCounter.tsx`'s live doused-count number

All four fixed the same way: the icon (where one exists) keeps
`text-accent` since icons are graphical, not text, and only need 3:1;
the actual readable text switches to `text-text-primary`, matching the
pattern already established for `<a>` tags globally. Visually this
reads as *more* emphasized, not less, since white against the dark
background stands out more than a borderline-legible red did.

## 2. A real HTML structure bug, caught by the automated scanner

`axe-core` flagged `ArchitectureMap.tsx`'s detail panel:
`definition-list` and `dlitem` violations. The actual bug: the `<dl>`
had an `<h4>` as a direct child sitting next to the `dt`/`dd` groups,
and `<h4>` isn't a permitted direct child of `<dl>` per the HTML spec
(only `dt`, `dd`, `div`, `script`, and `template` are). Fixed by moving
the heading outside the `<dl>` into a plain wrapping `<div>` (which now
carries the `aria-live="polite"` instead, so both the heading and the
detail list still get announced together as one update when a node is
clicked), leaving the `<dl>` to directly contain only the existing
`div`-wrapped `dt`/`dd` groups, which is exactly the pattern the HTML
spec calls out as valid. `ProjectCard.tsx`'s own, separate `<dl>` for
its "How it works" panel was already built this correct way from Phase
9 and didn't need a change.

## 3. Floating widgets weren't inside any landmark

`axe-core` only surfaced this once the relevant widget was actually
opened, a good reminder that a fresh-page-load scan alone isn't
enough. With the music widget's volume slider and track picker expanded
(`MusicToggle`), and separately just from `EmberCounter` existing at
all, both flagged as "content should be contained by landmarks":
neither is inside `<main>`, `<header>`, or `<footer>`, since both are
fixed-position overlays rendered as siblings of the page's main content
in `App.tsx`. Fixed by giving each its own `role="region"` with an
`aria-label` ("Music player", "Ember counter"), which is both the
correct fix and an honest one: these genuinely are self-contained,
independently-labeled regions, not part of the main reading flow.

## 4. A borderline touch target

The mobile menu toggle button (`Navbar.tsx`) wrapped only a 24x24 Lucide
icon with no padding, exactly at WCAG 2.5.8's 24x24 CSS pixel minimum
with zero margin for error. Added `-m-2 p-2` (negative margin cancels
the padding's effect on surrounding layout, a standard Tailwind pattern
for exactly this), growing the actual tap target to 40x40 without
shifting anything else in the header layout.

## A finding investigated and ruled out, not silently ignored

The first automated pass, run right after clicking "How it works" on a
project card, reported 16-27 "color-contrast" violations on cards
further down the Projects grid (Malware Containment Research,
C.R.A.V.E.), with genuinely strange reported colors (`#38383c` on
`#0f0f12`, neither of which is an actual token in `theme.css`). Rather
than trust the tool blindly or dismiss it blindly, re-ran the same scan
with a longer settle time (2 seconds instead of 300ms) before scanning:
0 violations. Conclusion, confirmed rather than assumed: those cards
were still mid-`whileInView` stagger animation (`Projects.tsx`'s grid
staggers each card in with `staggerContainer(0.08, 0.05)`, so a card
seven positions down the grid doesn't finish animating in for close to a
second), and `axe-core` was scanning a transient, partially-faded
in-between frame, not the settled, at-rest presentation the WCAG
contrast criteria actually apply to. Under `prefers-reduced-motion`
these elements skip the hidden/fading state entirely (`initial={false}`
site-wide, confirmed in `lib/motion.ts`-consuming components), so this
never affects a reduced-motion visitor at all. No code change was the
correct outcome here, but it's recorded so a future pass doesn't have to
re-investigate the same false alarm from scratch.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Computed real WCAG contrast ratios by hand for `text-secondary`
      (5.86:1, pass), `accent`-as-text (3.49:1, the actual problem), and
      white button text on the accent background (4.85:1, pass, so
      `Button`'s primary variant needed no change)
- [x] Automated `@axe-core/playwright` scan against the live dev server,
      run in six different states: fresh load (after a full scroll-
      through so every `whileInView` reveal had fired), mobile nav menu
      open, a project card expanded, the architecture map's second node
      selected, music actively playing, and the Lab section in view. All
      six: 0 violations, after the fixes above
- [x] Manual keyboard walkthrough with real screenshots (not assumed):
      skip link becomes visible on the very first Tab press, and the
      default browser focus ring is clearly visible against the dark
      background on the "How it works" button and an architecture map
      node button
- [x] Re-verified the transient color-contrast false positive resolves
      once animations settle, rather than accepting either "it's broken"
      or "it's fine" without checking

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Tab through the page from a fresh load and watch the skip link appear
first. Open **Projects**, click **How it works** on the MCQ card, and
notice "Traced further below" now reads in white with a red icon instead
of a low-contrast red line. To re-run the automated scan yourself, add a
short script using `@axe-core/playwright`'s `AxeBuilder` against
`http://localhost:5173` (this becomes a real, permanent Playwright spec
in Phase 20).
