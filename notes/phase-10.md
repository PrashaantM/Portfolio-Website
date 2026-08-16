# Phase 10: Create the Experimental Lab

Replaces the "Experimental Lab" placeholder from Phase 5. New files:
`src/data/lab.ts`, `src/components/LabCard.tsx`, `src/sections/Lab.tsx`.
Built after Phases 11, 12, and 13, since Lab is the section that
actually uses most of what those three built: `InkReveal` on its
heading, `ParticleField` behind its grid, `.frame-tactical` on every
card, and the shared `Reveal`/stagger vocabulary for the entrance.

## The ten ideas

All ten come from `portfolio-build.md` Phase 10.1 through 10.10.
Rewritten in the site's own voice rather than copied. The brief
describes each idea in outline form (a bullet list of what it would
do, plus a one-line "possible visual" note), not as ready-to-publish
copy, so each idea in `src/data/lab.ts` has a `tagline`, a `concept`
paragraph, and a `visual` line synthesized from the brief's bullets.
Nothing invented beyond what the brief already specifies for that
idea; the network-analyzer idea in particular keeps the brief's own
framing intact ("scoped deliberately to networks the user owns," not
a tool for watching anyone else's traffic) rather than softening or
dropping that constraint.

Each idea got one `lucide-react` icon chosen to represent its
concept: a waveform for the mashup generator, a vocal mic for the
metal vocal analyzer, a workflow diagram for the codebase
intelligence tool, mail for the email filter, a route icon for the CS
roadmap, sparkles for the brainrot extension, a pen for the drawing
tool, a split-screen icon for the window manager, radar for the
network analyzer, and a dumbbell for the workout tracker.

## Styled as concepts, not products

Phase 10's own instruction is explicit: each idea should look like a
concept rather than a completed product. `LabCard` is built to say
that before anyone reads a word: a dashed border instead of
`ProjectCard`'s solid one, a `01 / CONCEPT` mono label in the corner,
`.frame-tactical` corner brackets (Phase 12's Attack on Titan motif,
which reads like a blueprint annotation), and a "Possible visual"
line treated as a sketch note rather than a caption. No hover-lift,
no expandable "How it works" panel; those exist on `ProjectCard`
because those projects are real, verifiable systems with an
architecture worth digging into. Pretending a Lab idea has the same
weight would undercut the whole point of the section.

The Brainrot Sound Effects idea (`funny: true` in the data) gets one
extra small treatment, a `.hover-wiggle` icon and tag, covered in
`notes/phase-12.md` since it belongs to the Takopi tonal-contrast
motif rather than to Lab's own layout decisions.

## The grid entrance

The whole card grid enters as one staggered group
(`staggerContainer(0.08, 0.1)` from Phase 13's vocabulary) rather than
ten cards each running their own independent `whileInView` check.
Cheaper to reason about, and it reads as one coordinated reveal
instead of ten unrelated ones firing in whatever order they happen to
cross the viewport edge.

`LabCard` itself has no entrance animation of its own on purpose.
Wrapping it in a `Reveal` as well as the surrounding stagger would
have animated every card twice, since a `Reveal` inside an already-
animating stagger child does not inherit the parent's timing; it runs
its own independent `whileInView` check on top of it. Caught this
before shipping it by comparing the DOM structure against how the
stagger container's `variants` propagation actually works, not after
seeing a visible glitch.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Screenshotted the grid at desktop (three columns) and mobile
      (390px, single column) widths
- [x] Confirmed all ten cards render their icon, tagline, concept
      text, possible-visual line, and tags, not just that the JSX
      compiles
- [x] Confirmed the Brainrot card's tag reads visually distinct from
      the other nine cards' tags
- [x] Tested with `prefers-reduced-motion: reduce`: cards render at
      full opacity immediately rather than staying stuck in a hidden
      stagger state
- [x] Checked the browser console for errors: none

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173** and click **Lab** in the nav, or
scroll down past Projects. Watch the ten cards stagger in as the grid
scrolls into view, and compare their dashed, bracketed styling against
the solid-bordered project cards above them.
