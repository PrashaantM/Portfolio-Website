# Phase 7: Build the About Section

Replaces the "About" placeholder from Phase 5. One file:
`src/sections/About.tsx`.

## Content, where it actually came from

The first draft leaned on `notes/phase-1.md`'s own wording too
directly and came out sounding generic: "I want to understand how
complete systems fit together," "think about performance, scalability,
and maintainability," that kind of clustered buzzword phrasing. It
read like a summary of a person, not like the person.

Rewrote it grounded in specific facts from
`public/PrashaantMudgala_Resume.pdf` instead: the Tythe Labs
internship (built React dashboard components over the first half,
then moved into the Python backend and wrote the REST endpoints those
components actually called), a year and a half on a 10-person research
team coding through 500+ academic papers, and the MCQ exam platform
(load tested to hold up under 100 concurrent users). Specific
companies, specific numbers, specific sentences like "a button doesn't
just need to look right, it needs something real behind it" read as an
actual person instead of a LinkedIn summary. The "I enjoy learning by
building" line is still pulled verbatim from Phase 1's own notes, kept
as its own visual treatment (a left accent border, a different weight)
so it reads as the section's thesis.

The gym/anime/drawing/deathcore interests that were originally in this
section (both in prose and as identity map nodes) got cut entirely.
They already have their own dedicated section in the site's structure
(Interests, from `notes/phase-1.md`'s `1.2`), and a one-line mention
here was just competing with the technical content for space without
saying anything specific about any of them. Better to say nothing here
and do it properly when Interests gets built, than say something thin
in two places.

## The identity map

The brief (`portfolio-build.md` Phase 7) shows a literal ASCII tree and
says explicitly: "this should become an interactive visual rather than
literal ASCII art." Built it as three tiers of clickable nodes:

```
Computer Science
       |
AI · Software · Systems
       |
    Building
```

Click a node, its description appears below (and updates via
`aria-live="polite"`, so a screen reader announces the change too).
Plain `useState` tracking which node is active. No graph or physics
library. The brief's more ambitious "interactive architecture map"
idea is real, but it's explicitly **Phase 14**'s job once there's
actual project architecture to visualize.

This originally had a fourth tier for the outside-of-code interests
(gym, anime, drawing, deathcore), each mapped to a trait like
Discipline or Intensity. Cut for the same reason as the prose above:
that content deserves its own section, not four compressed nodes
competing with the technical map for attention.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Screenshotted the section at desktop width, then clicked a node
      and re-screenshotted to confirm the description actually updates
      and the active node gets a visible highlighted state, not just
      that the onClick handler exists
- [x] Screenshotted at mobile width (390px). The map wraps to a single
      column per tier and stays readable
- [x] Hit what looked like a rendering bug in a full-page mobile
      screenshot (the sticky nav appearing to duplicate mid-page).
      Re-checked with a normal (non-stitched) screenshot scrolled to
      that exact position and it wasn't there. Same class of
      full-page-screenshot-plus-sticky-element artifact as Phase 5's
      footer screenshot, not a real bug. Full-page captures stitch
      together multiple scrolled frames, and a sticky/fixed element can
      get captured in more than one of them
- [x] Checked browser console for errors: none

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173** and either scroll down or click
**About** in the nav. Click through the identity map nodes and watch
the description box below update each time.
