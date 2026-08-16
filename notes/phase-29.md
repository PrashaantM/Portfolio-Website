# Phase 29: Ongoing Project Log

`portfolio-build.md`'s own Phase 29 template, filled in with real
material pulled from `notes/phase-1.md` through `notes/phase-24.md`
rather than written fresh. This file is a synthesis of everything else
in `notes/`, not new content of its own.

## Decisions

```
Date: (Phase 2)
Decision: React + TypeScript + Vite + Tailwind + Motion as the
  baseline stack; React Three Fiber deliberately deferred.
Alternatives considered: Installing the full animation/3D stack up
  front.
Why: The brief's own rule ("don't install every animation library
  immediately") plus a bet that craft/restraint on a smaller stack
  reads better than dependency count. Three.js held back for one
  earned, signature moment instead.
Tradeoffs: That moment arrived much bigger than planned (Phase 15's
  full WebGL layer: crows, embers, seals, click bursts, nav
  transitions), a ~990KB/gzip-263KB chunk. Kept lazy and deferred
  (Phase 17, this run) so it never blocks critical content, but the
  size itself is now a real, standing cost.
```

```
Date: (Phase 4)
Decision: Accent red (#c81e3a) used only as a non-text/graphical
  color (icons, borders, underlines), never as small body/link text.
Alternatives considered: Using accent red directly as link/text color
  for visual punch.
Why: Measured contrast against the background: 3.5:1, clears the 3:1
  bar for graphical elements and large text, fails the 4.5:1 bar
  normal text needs.
Tradeoffs: Requires discipline to actually follow everywhere. It
  wasn't followed everywhere; see the Mistakes section below for the
  four places this exact rule got violated anyway and had to be
  caught by an automated scan in this run's Phase 15.
```

```
Date: (Phase 9)
Decision: Seven featured projects: the resume's four, plus three more
  (BugZapper, Malware Containment Research, C.R.A.V.E) found by
  auditing the full public GitHub profile.
Alternatives considered: The resume's four only; or padding the count
  with weaker repos.
Why: Phase 9's own rule against padding weak projects, balanced
  against wanting coverage of skill areas (low-level graphics,
  research/data science, mobile) none of the resume's four touch.
Tradeoffs: A fourth candidate (DormDash-Marketplace) had a solid
  description but was shape-similar to two already-featured projects,
  so it was presented as an option and left out rather than added for
  count alone. Still sitting there as a real option if the grid ever
  needs an eighth card.
```

```
Date: (Phase 11, revised Phase 15)
Decision: Background music is real, self-composed/self-provided audio
  or generated audio, never a sourced/found track, regardless of how
  generic the genre sounds.
Alternatives considered: Using an actual Lorna Shore/Pain Remains
  track, matching the brief's own mockup label; or a royalty-free
  library track.
Why: This project has no way to verify a found track's actual license
  before shipping it publicly. Applied the same reasoning twice: once
  to justify the original generated drone/toybox tracks (Phase 11),
  again when those were replaced with real user-provided files that
  needed no such workaround at all (Phase 15).
Tradeoffs: The real replacement tracks are large (1.3MB and 5.1MB),
  and the eager autoplay-on-visit Phase 15 added meant that size
  became a real, measured performance cost this run's Phase 17 had to
  work around (deferred the fetch, didn't touch the files).
```

```
Date: (This run, Phase 19)
Decision: GitHub project data (stars, last-updated) is a committed
  build-time snapshot, not a runtime API call.
Alternatives considered: Client-side fetch to GitHub's API with a
  static fallback on failure/rate-limit.
Why: Phase 19's own rule, "the portfolio must still work if GitHub's
  API fails," is satisfied by construction with a snapshot (nothing to
  fail at runtime) rather than by handling a failure case for a call
  that didn't need to happen live in the first place. Confirmed with
  the user before building either version.
Tradeoffs: Data goes stale between runs of `npm run fetch:github`; a
  real star count change wouldn't show up until someone re-runs it.
  Acceptable for a personal site with no traffic expectation driving
  frequent stat changes.
```

```
Date: (This run, Phase 23)
Decision: Contact shows email, LinkedIn, and GitHub; the resume's
  phone number is left off the public page.
Alternatives considered: Matching the resume exactly, phone number
  included.
Why: Confirmed with the user directly. A public page anyone on the
  internet can reach is a different audience than a resume handed to a
  specific recruiter.
Tradeoffs: One extra click (opening the Resume link) for anyone who
  specifically wants the phone number.
```

## Things I Learned

```
Concept: Design tokens and why they matter beyond "less typing"
What I thought before: Design tokens just save you from retyping the
  same hex code.
What I understand now: They make a constraint checkable in one place.
  The accent-color contrast fix (Phase 4) only worked because "accent"
  was a named role, not a hardcoded value, so the fix (use it for
  underlines, not text color) could be stated as a rule about the role
  rather than a search-and-replace across every hardcoded red.
Example: theme.css's --color-accent, and base.css's `a { color:
  text-primary; text-decoration-color: accent }`.
```

```
Concept: WCAG contrast has two different thresholds, not one
What I thought before: "Good contrast" was one bar to clear.
What I understand now: 4.5:1 for normal text, 3:1 for large text and
  non-text/graphical elements (icons, borders). A color can legitimately
  pass one and fail the other, and which one applies depends on what
  you're using the color for, not just the color itself.
Example: The accent red passes 3:1 (icons, borders, the primary
  button's background under white text) and fails 4.5:1 (as small
  link/body text), confirmed by hand-computing both ratios in this
  run's Phase 15, not just trusting the Phase 4 note's own number.
```

```
Concept: A library can have an undocumented bug that only shows up
  under a specific trigger
What I thought before: If code "looks right" and the library is
  popular, it probably works.
What I understand now: Phase 13's eight-step isolation (documented in
  notes/phase-13.md) found that this project's Motion version simply
  doesn't play a clipPath animation when triggered by an
  IntersectionObserver, Motion's own or hand-rolled, while the
  identical animation works fine from a click or a timeout. Nothing in
  the docs says this. The only way to find it was building the
  smallest possible reproduction and removing one variable at a time.
Example: InkReveal.tsx switched from animating clipPath to animating
  scaleX specifically to stay inside the "transform values are
  proven safe" territory that debugging session established.
```

```
Concept: Lighthouse's "throttling" isn't one thing
What I thought before: A Lighthouse performance score is a single,
  fairly objective number.
What I understand now: The same production build scored 56 (desktop,
  default simulated throttling), 98 (desktop, real unthrottled
  timings), and 53-71 (mobile preset, simulated slow 4G + heavy CPU
  throttling) in this run's Phase 17, all real runs, all honest. Which
  one is "the" score depends entirely on which visitor profile you
  actually care about, and reporting only one of them would have
  hidden real information either way.
Example: notes/phase-17.md's numbers table, kept as three rows instead
  of one.
```

```
Concept: TypeScript's "a function can return extra stuff and still fit
  a void-returning slot" rule has limits
What I thought before: Any function returning something is always
  assignable where `() => void` is expected (TypeScript is famously
  lenient about this).
What I understand now: That leniency is a special-cased exception for
  function literals written directly in that position. Returning a
  *reference* to an already-existing function that returns non-void
  (src/three/sceneBus.ts's onEmberDoused, returning `() =>
  Set.prototype.delete(...)`, a boolean) doesn't get the same pass, and
  breaks a stricter nested type check inside React's own effect-cleanup
  types.
Example: Found and fixed at the very start of this run, while doing
  otherwise-unrelated Phase 23 content work, because `npm run build`
  simply failed before anything else could be verified.
```

## Claude Code Mistakes

```
Problem: Rendered a "crow" that was two flat red rectangles, not a
  crow.
Why it happened: An earlier fix for a real visibility bug (the crow
  material was too dark against the equally dark background) pushed
  emissiveIntensity high enough to read as a blazing red silhouette,
  and the underlying geometry (a capsule body, two flat box wings) was
  never actually shaped like a bird to begin with.
How I detected it: The user looked at the running site and said so
  directly; no automated check catches "does this look like a crow."
How it was fixed: Rasterized the actual original hand-drawn crow SVG
  (from the deleted 2D Crow.tsx) to a texture, tinted it the site's own
  text-secondary gray instead of accent red, and changed the "flapping"
  motion to a squash/stretch that actually works on a flat
  camera-facing plane.
How I can prevent it: Screenshot and actually look at generative/
  procedural visuals before calling them done, the same standard this
  project already applies to text content, don't assume a shape
  "should" read correctly just because the code that generates it
  compiles and runs.
```

```
Problem: A project card's "Traced further below" link, and three other
  spots, used accent red directly as small link/body text, failing the
  same 4.5:1 contrast rule Phase 4 established for exactly this
  case.
Why it happened: Phase 4's own rule (`<a>` tags keep text-primary,
  accent only for the underline) was followed for plain `<a>` tags but
  not generalized to every place accent color got reached for later
  (Phase 9's project card link, Phase 12's Brainrot tag, this run's
  Ember counter). Each individual addition felt like a small,
  self-contained styling choice rather than an instance of a rule that
  already existed elsewhere in the codebase.
How I detected it: An automated `@axe-core` scan in this run's Phase
  15, not a visual read-through. This is exactly the kind of thing
  that looks fine to a sighted reviewer with normal contrast
  sensitivity and only shows up when actually measured.
How it was fixed: Text color switched to text-primary at all four
  sites; accent kept only on the adjacent icon (a graphical element,
  correctly held to the 3:1 bar it already clears).
How I can prevent it: When reaching for a color that's already
  established as "usable here but not there" (theme.css and base.css
  both document the accent-contrast constraint directly in their own
  comments), check the existing rule before adding a new usage, rather
  than trusting that a small addition doesn't need to be checked
  against a project-wide rule already on record.
```

```
Problem: A fixed-position decorative widget (EmberCounter) silently
  swallowed a real click on the "How it works" button underneath it.
Why it happened: The widget was built correctly for its own purpose
  (an always-visible HUD counter) without considering that "always
  visible, fixed position" also means "always capable of sitting on
  top of whatever scrolls underneath it," and nothing gave it
  pointer-events-none since it never occurred to anyone building it
  that it had no need to intercept clicks in the first place.
How I detected it: A responsive screenshot pass at 320px in this run's
  Phase 16 showed the visual overlap; confirmed it was a functional
  bug, not just a visual one, by clicking at the exact overlapping
  coordinates and checking the underlying button's aria-expanded
  attribute before and after a fix.
How it was fixed: pointer-events-none on the widget, plus a smaller
  footprint on narrow screens to reduce how much it visually overlaps
  in the first place.
How I can prevent it: Any fixed-position, always-on-top element that
  has no click behavior of its own should default to
  pointer-events-none, the same reasoning Scene3D's WebGL overlay
  already applied to itself from the start (`notes/phase-15.md`) but
  EmberCounter, added in the same phase, didn't.
```

```
Problem: An `<h4>` sat as a direct sibling of `dt`/`dd` groups inside a
  `<dl>` (ArchitectureMap's detail panel), which isn't valid per the
  HTML spec's own content model for `<dl>`.
Why it happened: Reached for `<dl>` because the content genuinely is a
  set of label/value pairs, and added the heading inside the same
  wrapper for convenience without checking what a `<dl>` is actually
  allowed to directly contain.
How I detected it: The same automated `@axe-core` scan that caught the
  contrast issue above, in this run's Phase 15. Visually this renders
  fine in every browser; the violation is structural, not visual, so
  nothing short of an actual accessibility-tree-aware tool catches it.
How it was fixed: Moved the heading outside the `<dl>` into a plain
  wrapping `<div>` (which also now carries the `aria-live` region so
  both the heading and the list still get announced together).
How I can prevent it: Run an automated accessibility scan during
  development of any new semantic-HTML structure, not only as a
  separate later audit phase; this bug shipped and sat in the codebase
  across Phase 14 and everything after it until this run's dedicated
  accessibility pass finally caught it.
```

## Future Improvements

```
- Re-encode public/audio/trap-melody-mysterious.wav (5.1MB) to a
  compressed format at a reasonable bitrate. Flagged, not done, in
  notes/phase-17.md, since it's real user-supplied audio content, not
  a build-config change.
- Add og:url and <link rel="canonical"> to index.html once this site
  actually has a live URL (notes/phase-18.md, notes/phase-22.md).
- A real Content-Security-Policy, scoped and tested against every
  animated component (several use inline style attributes) and the
  WebGL/audio layers specifically, rather than a guess (notes/
  phase-21.md).
- Investigate reducing the WebGL layer's own bundle size (currently
  ~990KB raw / 263KB gzip), which is the single largest remaining
  factor in the mobile-preset Lighthouse LCP number (notes/
  phase-17.md).
- Reconcile the Game of Amazons agent's placement: the resume says
  "10th class-wide," the GameOfAmazons repo's own description says
  "14th." Went with the resume as this project's established source of
  truth (notes/phase-9.md), but the discrepancy itself was never
  resolved with the actual source.
- DormDash-Marketplace is a real, solid repo that was considered and
  deliberately left out of Featured Projects for being shape-similar
  to two already-featured projects (notes/phase-9.md). Worth
  revisiting if the grid ever needs an eighth card, or if one of the
  existing seven gets swapped out.
```
