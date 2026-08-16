# Phase 13: Animation Architecture

Built first, ahead of its number in the build order, because Phase 13
is explicitly the foundation Phases 11, 12, and 14 sit on. New files:
`src/lib/motion.ts`, `src/components/Reveal.tsx`,
`src/components/DrawLine.tsx`, `src/components/InkReveal.tsx`,
`src/styles/animations.css`.

## The vocabulary

`src/lib/motion.ts` holds the Motion-driven half of the vocabulary:
`fadeUp`, `fadeIn`, `scaleIn`, `slideInLeft`, `slideInRight`, and
`staggerContainer(stagger, delayChildren)` as a factory rather than a
fixed constant, since Hero's CTA stack, Lab's card grid, and
Architecture's node tiers all want the same "children reveal one
after another" behavior at different speeds. `EASE` moved here from
Hero (Phase 6), which was the only thing defining it before this
phase existed. Hero now imports `fadeUp` and `staggerContainer()`
instead of keeping its own local copy.

`src/styles/animations.css` holds the CSS-keyframe half: `glitch` and
`wiggle`, both hover-triggered rather than scroll-triggered, so a
plain `:hover` keyframe is the right tool with no
IntersectionObserver involved.

`drawLine` (`src/components/DrawLine.tsx`) draws an SVG path in via
Motion's `pathLength`, used by Architecture's connectors (Phase 14).
`parallax` is a small vertical drift on Hero's ambient glow, using
`useScroll` and `useTransform` (see below). `hoverLift` was already
in use as a plain Tailwind `hover:-translate-y-1` (ProjectCard, Phase
9) and stayed that way rather than being rewritten into a Motion
variant for no reason.

## `Reveal`, the shared scroll-entrance wrapper

Every section before this phase (About, Skills, Projects) rendered
its content with no entrance animation at all. `Reveal` wraps
`children` in a `motion.div` using `whileInView`, `viewport={{ once:
true }}`, and a default `fadeUp` variant, so a section just wraps its
content once instead of hand-rolling the same six lines of
`whileInView` config. Retrofitted onto Skills' and Projects' existing
grids as a result: both now stagger their cards in as they scroll
into view, which they did not do before this phase existed to make it
a one-line change.

Same reduced-motion handling as Hero throughout: `useReducedMotion()`
from Motion (not the CSS media query, which does not cover
JavaScript-driven animation) passes `initial={false}` and skips
straight to the end state.

## A real bug, and what it took to find it

The first version of `inkReveal` animated `clipPath` (a left-to-right
wipe, `inset(0 100% 0 0)` to fully open) through the exact same
`Reveal` + `variants` + `whileInView` pattern as everything else.
Built it, wired it into Lab's heading, and a screenshot showed the
heading missing entirely: not faded, not clipped halfway, just gone,
with the rest of the section rendering normally around it.

Confirmed with `getComputedStyle` that the element's `clip-path` was
frozen at its hidden value no matter how long it sat in view (polled
it eight times over two seconds, scrolled dead center in the
viewport, no change). That ruled out a timing/screenshot artifact
like the ones from Phase 5 and Phase 7's notes and pointed at
something in the animation itself.

Narrowed it down with a series of isolated tests, each one
eliminating a hypothesis:

1. A mismatched-units theory (`inset(0 100% 0 0)` mixing unitless `0`
   with `100%`) seemed plausible and was easy to rule out. Normalized
   both states to consistent `%` units. No change.
2. A `transition` prop merge theory (Reveal was unconditionally
   passing `transition={{ delay }}`, which could override a variant's
   own `duration`/`ease` and fall back to a spring, and springs
   cannot animate a string value like `clipPath`) was next. Removed
   the prop-level `transition` entirely. No change. (Kept the fix
   anyway, in `Reveal.tsx`'s `withDelay` helper: it is more correct
   regardless, since it stops the component-level `transition` prop
   from silently competing with a variant's own transition config.)
3. A minimal standalone page (`animate` + `inView` from the plain
   `motion` package, no React at all) animated the identical
   `clipPath` values correctly. So Motion itself can do this.
4. A minimal React component using `motion/react`'s `whileInView`
   directly (no `variants` indirection) reproduced the bug. So it was
   not about the variants system specifically.
5. Swapping `whileInView` for the `useInView` hook plus a manually
   driven `animate` prop still reproduced it. So it was not
   `whileInView` specifically either; it was viewport-detection in
   general.
6. A hand-rolled native `IntersectionObserver` (no Motion viewport
   code at all, just `setState` in the callback) driving the exact
   same `animate` prop *also* reproduced it.
7. The same `animate` prop driven by a plain `setTimeout` instead
   worked fine. Same component, same variants, same values. Only the
   trigger source changed.
8. Removing `StrictMode` (in case of a dev-only double-render
   interaction) did not change the result either.

That last comparison, step 6 against step 7, is the real finding:
in this project's installed Motion version (`motion`/`framer-motion`
13.1.0), an animation targeting `clipPath` simply does not play when
the state change that triggers it comes from an
`IntersectionObserver` callback, whether that observer is Motion's
own or a hand-written one. The identical animation plays correctly
when triggered by a click handler or a `setTimeout`. `opacity` and
transform-based values (`y`, `x`, `scaleX`) never showed this problem
under any trigger, which is exactly why nothing else on the site hit
it: everything else in the vocabulary animates opacity or a
transform, and `inkReveal` was the one variant reaching for a
non-transform "complex" value.

## The fix: stop animating `clipPath`, animate `scaleX` instead

`src/components/InkReveal.tsx` replaces the `clipPath` variant with a
small dedicated component: the heading renders at full size and
opacity immediately, and a solid `bg-background` panel sits on top of
it and slides away (`scaleX` from 1 to 0, `transformOrigin: right`),
uncovering the text left to right. Visually it reads the same as a
wipe. Mechanically it is a transform, the exact value type already
proven reliable everywhere else through `whileInView`, so it sidesteps
the bug instead of working around it. `inkReveal` was removed from
`src/lib/motion.ts` since it no longer fits the "one variant object"
shape the rest of the vocabulary shares. `Lab.tsx` is the one caller,
wrapping its `<h2>` in `<InkReveal>` instead of `<Reveal
variant={inkReveal}>`.

Worth being honest about: this is a workaround for a library
behavior that was not fully root-caused, not a fix for a mistake in
this codebase. The eight-step process above is the actual evidence
for where the boundary of the bug sits (IntersectionObserver-driven
trigger, "complex" value type), which is enough to route around it
confidently, even without reading Motion's own source to find the
exact line responsible.

## Parallax

Hero's ambient glow (Phase 6) now drifts down as the page scrolls,
via `useScroll` (tracks `window.scrollY` by default) and
`useTransform` mapping `[0, 800]` scroll pixels to `[0, 140]` output
pixels, applied as a plain numeric `y` on a `motion.div`. Centering
moved from the usual `-translate-x-1/2 -translate-y-1/2` Tailwind
classes to a flex wrapper instead, so the glow's own `style={{ y:
glowY }}` stays a single numeric transform rather than a string that
also has to carry a `-50%` centering offset. Given what the bug above
turned up about this Motion version's handling of non-numeric
animated values, that was a deliberate choice, not a style
preference. Reduced motion collapses the output range to `[0, 0]`
rather than skipping the `useTransform` call, since React's rules
require hooks to run unconditionally.

## Update: replaying entrances on scroll away and back

Every `whileInView` reveal on the site (`Reveal`, `DrawLine`,
`InkReveal`, and the raw grid containers in Skills, Projects, and
Lab) originally used `viewport={{ once: true }}`: play the entrance
once, then leave the element settled in its visible state for good.
Asked to make animations replay when scrolling away from something
and back to it, which meant flipping that to `once: false` so the
element reverts to `initial` on exit and re-plays `whileInView` on
re-entry.

Not a blanket flip, though. `once: false` under `prefers-reduced-motion`
would mean an element repeatedly fades out and back in every time it
crosses the viewport edge while scrolling, which is exactly the kind
of repeated motion that setting exists to avoid, arguably worse than
the single one-time entrance reduced-motion visitors already had.
So `once` is now `!!shouldReduceMotion` everywhere: `false` (replays)
for everyone else, `true` (plays once, then stays put) for anyone who
asked for less motion. `InkReveal` did not need this treatment since
its cover element is already skipped entirely under reduced motion,
so there is no animation there left to gate.

Hero's entrance also moved from an unconditional `animate="visible"`
(played once on mount, regardless of scroll position) to
`whileInView`, so scrolling back up to the very top now replays the
name/subtitle/CTA sequence too, consistent with every other reveal on
the site rather than being the one exception.

Confirmed the change actually works rather than trusting the `once`
flag alone: read a Skills card's `getComputedStyle(...).opacity`
while in view (1), scrolled to the top of the page and read it again
(0, correctly reverted), then scrolled back and read it a third time
(1, correctly replayed). Ran the same check under a
`reducedMotion: 'reduce'` browser context and confirmed the opacity
stayed at 1 across the same scroll-away/scroll-back sequence instead
of dropping to 0.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Screenshotted Lab's heading before the fix (missing entirely)
      and after (fully visible, wipes in on scroll) to confirm the fix
      actually changed the rendered output, not just the diagnosis
- [x] Polled `getComputedStyle(...).clipPath` and, after the fix,
      `getComputedStyle(...).transform` on the Hero glow across a real
      scroll to confirm the values were actually changing, not just
      trusting that the code looked right
- [x] Checked the browser console for errors through every step of
      the debugging process and the final state: none
- [x] Confirmed no other file in the codebase still imports the
      removed `inkReveal` export
- [x] Deleted every temporary test file (`clip-test*.html/.tsx`)
      created in the project root while isolating the bug
- [x] Confirmed a Skills card's opacity genuinely drops back to 0 on
      scroll-away and returns to 1 on scroll-back, rather than reading
      the `once: false` change as correct just because it compiled
- [x] Confirmed the same element stays at opacity 1 across an
      identical scroll-away/scroll-back sequence under
      `prefers-reduced-motion: reduce`, so reduced-motion visitors do
      not get a repeating fade

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173**. Scroll slowly past the hero and watch
the red ambient glow drift down slightly slower than the page moves,
the parallax effect. Then scroll to **Lab** and watch the
"Experimental Lab" heading uncover itself left to right as it enters
view, rather than fading in like the paragraph underneath it.
