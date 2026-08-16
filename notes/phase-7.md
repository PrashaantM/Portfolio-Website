# Phase 7 — Build the About Section

Replaces the "About" placeholder from Phase 5. One file:
`src/sections/About.tsx`.

## Content — where it actually came from

Nothing here was invented. Two paragraphs on the left are close
paraphrases of `notes/phase-1.md`'s answers to "what should a
technical interviewer understand" and "what should a developer
understand" — the systems-thinking framing, and using Claude Code as
"part of a serious development workflow" while still owning every
line. The "I enjoy learning by building" line is pulled verbatim from
Phase 1's own notes and given its own visual treatment (a left accent
border, a different weight) so it reads as the actual thesis of the
section rather than one sentence among many.

The outside-of-code interests (gym, anime, drawing, deathcore) are the
same four from Phase 1's `1.1` notes — not a generic "hobbies" list.

## The identity map

The brief (`portfolio-build.md` Phase 7) shows a literal ASCII tree and
says explicitly: "this should become an interactive visual rather than
literal ASCII art." Built it as four tiers of clickable nodes:

```
Computer Science
       |
AI · Software · Systems
       |
    Building
       |
Gym · Anime · Drawing · Deathcore
```

Click a node, its description appears below (and updates via
`aria-live="polite"`, so a screen reader announces the change too).
Plain `useState` tracking which node is active — no graph/physics
library. The brief's more ambitious "interactive architecture map"
idea is real, but it's explicitly **Phase 14**'s job with real project
architecture to visualize, not a good fit for four hobby nodes right
now. Building a force-directed graph here would be solving a problem
this section doesn't actually have.

Each leaf node's description deliberately references the site's own
design brief by name rather than writing a generic hobby blurb — e.g.
clicking **Deathcore → Intensity** surfaces "Lorna Shore, Bad Omens —
restraint that suddenly breaks into intensity. That rhythm is
basically the design brief for this site's mood," which is literally
true: those are the exact bands `portfolio-build.md` names as
inspiration for the site's dark/cinematic mood. Same idea for **AI**,
whose description points at this portfolio itself as the evidence.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Screenshotted the section at desktop width, then clicked a node
      and re-screenshotted to confirm the description actually updates
      and the active node gets a visible highlighted state (not just
      that the `onClick` handler exists)
- [x] Screenshotted at mobile width (390px) - the map wraps to a
      single column per tier and stays readable
- [x] Hit what looked like a rendering bug in a full-page mobile
      screenshot (the sticky nav appearing to duplicate mid-page) -
      re-checked with a normal (non-stitched) screenshot scrolled to
      that exact position and it wasn't there. Same class of
      full-page-screenshot-plus-sticky-element artifact as Phase 5's
      footer screenshot, not a real bug - full-page captures stitch
      together multiple scrolled frames, and a sticky/fixed element can
      get captured in more than one of them.
- [x] Checked browser console for errors: none

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173** and either scroll down or click
**About** in the nav. Click through the identity map nodes (start with
Deathcore or AI - they've got the most specific payoff) and watch the
description box below update each time.
