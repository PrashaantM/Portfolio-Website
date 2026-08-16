# Phase 6 — Build the Hero

The first section with real content and the first real animation in
the project. Replaces the "Hero" placeholder from Phase 5.

## What got built

- **`src/components/Button.tsx`** — reusable primary (solid accent) /
  secondary (outlined) button, built on the size/radius tokens from
  Phase 4. Always an `<a>`, since every current use (the two Hero
  CTAs) is navigation.
- **`public/PrashaantMudgala_Resume.pdf`** — moved out of the repo
  root, where Vite never served it, into `public/`, where it's
  actually reachable at `/PrashaantMudgala_Resume.pdf`.
- **`src/sections/Hero.tsx`** — the actual section: name, the
  positioning statement from `notes/phase-1.md`, a short technical
  metadata line, and the two CTAs (View Projects → `#projects`,
  Resume → the PDF, opens in a new tab).
- A `glow-pulse` animation token in `theme.css` for the ambient
  background glow behind the hero text, plus a global
  `prefers-reduced-motion` override in `base.css` that collapses every
  CSS animation/transition on the site to near-zero duration — the
  first animation in the project, so a reasonable point to add this
  foundational, site-wide safeguard rather than a one-off fix.

## Why Hero doesn't use the shared `<Section>` component

Every other section wraps its content in `<Section>` for consistent
vertical spacing. Hero can't: it needs full `min-h-svh` height and an
absolutely-positioned glow layer sitting behind the text, neither of
which the plain `.section` padding model has any reason to support for
every other section. So Hero builds its own `<section>` + `Container`
by hand instead of stretching the shared component to cover a
one-off case.

## The animation (Phase 6.1)

Sequence: name → subtitle → metadata line → CTA buttons, each one
after another rather than everything fading in at once. Built with
Motion's `variants` + `staggerChildren` (0.12s between each, 0.1s
initial delay) rather than four separate hand-timed animations — one
`container`/`item` variant pair, and every element just says "I'm an
item in this stagger."

Reduced motion is handled at two different levels, because it needs
to be — they don't cover each other:

- **CSS animations/transitions** (the glow pulse, any hover
  transition): the global override in `base.css` catches these
  automatically via the `prefers-reduced-motion` media query. Nothing
  section-specific has to opt in.
- **Motion's JS-driven animations** (the stagger reveal) don't read
  that CSS media query at all. Hero checks Motion's own
  `useReducedMotion()` hook directly and passes `initial={false}` when
  it's set, which skips straight to the final state instead of
  animating into it.

## A real bug this caught

Checking reduced motion in an actual browser (not just reading the
code) surfaced a real bug: the glow div had no opacity set outside its
`@keyframes` block. With the animation collapsed to near-zero duration
under reduced motion, the browser fell back to its default `opacity: 1`
once the (near-instant) animation finished, instead of resting at the
intended subtle `0.15` — so reduced-motion visitors would have gotten
a much more intense glow than everyone else, the opposite of what
"reduced" is supposed to mean. Fixed by giving the div an explicit
`opacity-15` outside the animation, so that's what it falls back to.
This is exactly why the verification step took a screenshot of the
reduced-motion state rather than just trusting that the `useReducedMotion`
check was correct — the bug was in a completely different property
than the one being tested.

## Content decisions

- The subtitle is the positioning statement verbatim from
  `notes/phase-1.md` — that's literally what it was written for.
- The metadata line ("Full-Stack Development · Systems · AI-Assisted
  Engineering") is pulled from Phase 1's answer to "what should a
  technical interviewer understand," not invented for the hero.
- Didn't invent anything not already established somewhere (no
  school name, GPA, location, or specific job titles that were never
  actually given).

## Scope deliberately left out of this phase

The brief's Hero concept lists a lot: animated technical diagrams, a
faint Japanese-inspired seal, code fragments appearing/disappearing,
a cursor/terminal interaction, an audio-reactive element, moving
particles/ink. Building all of that in one pass would violate the
brief's own "avoid... constant particle explosions" and "wall of
text" warnings, and most of it belongs to phases that don't exist yet
(Phase 11 Music, Phase 12 anime-inspired visual system, Phase 13
animation architecture, Phase 14 architecture visualization). What
shipped this phase — name, copy, CTAs, one ambient glow, one entrance
animation — is deliberately the restrained version; the rest gets
layered on once those phases exist to do it properly instead of
half-building it here.

## Verification

- [x] `npm run build` and `npm run lint` clean after every commit
- [x] Confirmed `/PrashaantMudgala_Resume.pdf` actually resolves
      (`curl -I`, got a 200) rather than assuming the file move worked
- [x] Screenshotted the hero at desktop and mobile widths
- [x] Screenshotted mid-animation (~250ms in) and settled, and could
      see the stagger actually happening (name partially faded in,
      everything else still queued) rather than just trusting the
      variant config
- [x] Used Playwright's `reducedMotion: 'reduce'` browser context to
      actually emulate `prefers-reduced-motion` and screenshot the
      result - this is what caught the glow-opacity bug above
- [x] Checked browser console for errors in every state above: none

One thing not yet checked: real Lighthouse/bundle-size numbers. Motion
added roughly 40KB gzipped to the JS bundle (61.8KB → 101.7KB) - worth
knowing about now, but Phase 17 (Performance) is the actual place to
decide if that's a problem, not this phase.

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173**. To see the actual things this phase
built, rather than just the finished result:

- **Watch the entrance animation**: refresh the page and watch the
  name, then the paragraph, then the small metadata line, then the
  two buttons appear in sequence, not all at once.
- **Watch the ambient glow**: look behind the text for a slow, subtle
  reddish glow that breathes in and out over about 8 seconds — easy to
  miss if you're not looking for it, which is the point.
- **Check the reduced-motion path**: in Chrome/Edge DevTools, open the
  Command Menu (Cmd+Shift+P) → "Rendering" → set "Emulate CSS media
  feature prefers-reduced-motion" to "reduce", then refresh. The name/
  subtitle/metadata/buttons should all appear immediately with no
  stagger, and the background glow should look calm rather than
  pulsing.
- **Click Resume**: should open the actual PDF in a new tab.
- **Click View Projects**: jumps to the (still-placeholder) Projects
  section below — real content there is Phase 9.
