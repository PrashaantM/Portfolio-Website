# Phase 12: Anime-Inspired Visual System

Built alongside Phase 13, since most of it depends directly on the
vocabulary Phase 13 provides. New files: `src/components/Seal.tsx`,
`src/components/ParticleField.tsx`, `src/components/InkReveal.tsx`
(covered in `notes/phase-13.md`, since the interesting part of that
component is the bug it works around rather than the motif itself),
plus additions to `src/styles/motifs.css` and
`src/styles/animations.css`.

The Design rules in `portfolio-build.md` name six references and warn
against turning the site into "a collage of unrelated references."
Kept to that by tying each motif to one specific, already-necessary
piece of the site instead of sprinkling references around for their
own sake.

## Demon Slayer: ink reveal

`InkReveal` (`src/components/InkReveal.tsx`). Used once, on Lab's
heading. See `notes/phase-13.md` for the full story of why it ended
up built on a sliding `scaleX` panel instead of an animated
`clip-path`.

## Attack on Titan: tactical corner brackets

`.frame-tactical` in `src/styles/motifs.css`: four short corner
marks, drawn with `::before`/`::after` pseudo-elements, instead of a
full border. Used on Lab's idea cards (Phase 10) and Architecture's
node buttons (Phase 14), both of which are explicitly "concept, not
finished product" content. A bracket reads like a targeting reticle
or a blueprint annotation, which fits a labeled sketch better than a
plain rounded card would. `.bg-grid`, the other AoT-inspired motif,
already existed from Phase 4.

## Naruto: chakra ember particles

`ParticleField` (`src/components/ParticleField.tsx`), sitting behind
Lab's card grid. Phase 4's own notes explicitly deferred "chakra-style
particle effects" to "the Phase 12/13 animation work," so this closes
that out directly. Sixteen small blurred dots drift upward on a
single shared CSS keyframe (`ember-drift` in `motifs.css`); each
particle only varies its horizontal drift, duration, and start delay
through inline custom properties, so adding more particles costs
inline style attributes, not more CSS rules. Kept to sixteen on
purpose. The brief warns against "constant particle explosions," and
a portfolio's job is to hold attention on the content, not compete
with it.

The only JavaScript here reads Phase 11's live music amplitude each
frame (when music is playing) and brightens the whole field slightly
in time with it, the Phase 11.2 audio-reactive tie-in, skipped
entirely when music is off or reduced motion is requested. That read
happens through a plain function call inside a `requestAnimationFrame`
loop, not React state, so it does not force a re-render on every
frame; see `notes/phase-11.md` for why `getAmplitude` is built that
way.

## Takopi's Original Sin: tonal contrast

Phase 10's own brief calls out that the Brainrot Sound Effects idea
should read as a deliberate contrast against the serious engineering
ideas around it. `LabCard` gives that one idea (`funny: true` in
`src/data/lab.ts`) two small, specific tells: its icon and its "not
serious, promise" tag both get `.hover-wiggle` (a small rotation
keyframe in `src/styles/animations.css`), and the tag itself sits at
a static slight tilt (`rotate-2`) even before it is hovered. Nothing
else on the card changes; the point is a small, discoverable detail,
not a redesign of the card.

## Lorna Shore / Pain Remains / Bad Omens: dark atmospheric mood

Already the site's baseline (Phase 4's palette, Phase 4's film-grain
`.bg-noise`), extended concretely in Phase 11: the music system itself
is the atmosphere, not a visual reference bolted on separately. See
`notes/phase-11.md`.

## The seal

`Seal` (`src/components/Seal.tsx`): an original circular emblem, a
double ring around an angular "PM" monogram, placed in the top corner
of the Hero section. The brief is explicit that copyrighted character
art is off the table and that original motifs communicating the same
inspiration are the right call, so this is a hanko-style seal shape
built from scratch in plain SVG rather than a borrowed symbol. Sits at
70% opacity with `.hover-glitch` (from Phase 13's vocabulary) as a
small discoverable interaction, matching the glitch keyframe's other
use on Lab's "CONCEPT" tags.

## Update: extending the visual system past Lab

The first pass concentrated almost everything visual in Lab (icons,
`.frame-tactical`, `ParticleField`), which left About, Skills, and
Projects reading noticeably plainer by comparison, text and bordered
boxes with no icon or motif of their own. Two additions after
feedback that the site was "lacking in subtle visual references and
imagery":

**Icons everywhere a category or item already existed.** Every Skills
category (`src/data/skills.ts`), every About identity-map node
(`src/sections/About.tsx`), and every project card
(`src/data/projects.ts`) now carries a `lucide-react` icon, the same
pattern Lab's cards already used. Chosen to represent what each item
actually is rather than picked for decoration: `Braces` for
Languages, `GraduationCap` for the Computer Science node, `Swords`
for the Game of Amazons agent, and so on for the rest. Cheap to add
since `Badge` and the card-grid patterns already existed; this is
just giving each of those existing patterns the icon slot Lab's
`LabCard` had from the start.

**The red thread.** Phase 4's own notes list "a red thread line
animation connecting related elements (e.g. a future
project-constellation visual)" as a motif deliberately deferred to
this later animation work, and it never actually got built until now.
The MCQ Exam Management Platform's project card is the one project
with a deeper system breakdown further down the page (Phase 14's
Architecture Deep Dive), so it is also the one card with a small
accent-colored, dashed-underline link: "Traced further below: full
architecture breakdown." The Architecture Deep Dive section answers
back with its own small tag, "Traced from MCQ Exam Management
Platform above." Deliberately not a literal SVG line connecting two
exact pixel positions across a scrolling page; the project grid's
height changes depending on how many cards there are, which would
make a precisely positioned connector fragile and, if the layout ever
shifts, silently wrong. A pair of small linked tags carries the same
"these two things are connected" idea without depending on layout
math that could drift out of sync with the actual DOM.

Building the second tag surfaced a real, separate bug: clicking the
first tag's link scrolled the Architecture Deep Dive heading partway
under the sticky nav, since nothing on the site set `scroll-margin-top`
on anchor targets. Not new to this feature; every existing nav link
(`#about`, `#skills`, and so on) had the same gap, just never obvious
because those sections all start with generous top padding from
`.section`. Fixed site-wide with one rule in `src/styles/base.css`
(`[id] { scroll-margin-top: 5rem }`) rather than only around the new
link, since the underlying gap was never specific to this feature.

## Update: a crow, a sword, and flame breathing

Asked for three more specific pieces: original crow/sword/ink
imagery, an ink/water transition, a Demon Slayer flame-breathing
animation, and a sword-slash animation. New files, all in
`src/components/motifs/`: `Crow.tsx`, `Sword.tsx`, `InkParticles.tsx`,
`FlameBreath.tsx`, `SwordSlash.tsx`.

**Where images came from.** Nowhere but this session. The request
explicitly allowed sourcing images from the web, on the reasoning that
a crow/sword/ink splatter is generic enough to not be a copyright
concern. That reasoning covers the *subject*, not the *image*: a
specific photo or illustration of a crow is still someone's
copyrighted work regardless of how generic "a crow" is as a concept,
and this project has no way to verify a found image's actual license
before shipping it. `portfolio-build.md`'s own Phase 12 rule already
says the same thing about character art specifically ("prefer
original motifs that communicate the inspiration"), so all three are
plain hand-built SVG paths instead, the same approach already used for
the seal.

**Crow** (Hero). Demon Slayer's Kasugai crows are message-carriers,
which is the actual reason a crow fits here rather than a generic
bird: Hero is the "something arrives" moment of the page. A single
looping CSS keyframe (`crow-drift`, `motifs.css`) drifts it slowly
left to right across the very top of the hero over 42 seconds, low
opacity, meant to reward noticing rather than draw the eye
immediately.

**Sword, ink particles, and flame breathing** (Lab). Bundled into one
sequence, `SwordSlash`, rather than three disconnected additions,
since Lab already had an entrance moment (`InkReveal`'s heading wipe)
worth building toward instead of past. On scroll into view: the sword
slashes across at a fixed angle, ink particles (`InkParticles`) burst
outward from where it "lands," and the heading wipes in right after.
`FlameBreath` sits separately in Lab's background, alongside
`ParticleField`: a slow inhale/exhale scale on three overlapping
blurred, asynchronously flickering layers, named after the actual
technique names in Demon Slayer (Flame Breathing, Water Breathing)
rather than being a generic glow with fire colors.

`SwordSlash` only animates plain numeric `x`/`y`/`opacity` values, on
purpose. `notes/phase-13.md` documents a real bug in this project's
Motion version where a `clipPath` animation never plays when
triggered by an IntersectionObserver-driven state change; numeric
transforms never showed that problem under any trigger this session
tested, so this stays inside that already-proven-safe territory
instead of risking a repeat with a different "complex" value type.

**Two more real bugs, caught by screenshot rather than assumed away:**

`FlameBreath`'s root `<div>` hardcoded `relative` in its own
className, reasoning that its `.flame-layer` children (each
`position: absolute; inset: 0`) needed *some* positioned ancestor.
True, but wrong to bake in: the caller in `Lab.tsx` passed `absolute
-right-24 top-10` to place it as an overlay, and in Tailwind's
generated stylesheet order `.relative` happened to come after
`.absolute`, so the hardcoded class won. The component sat in normal
document flow claiming 380px of real height instead of overlaying
anything, which is exactly the "large unexplained gap" bug shape from
earlier phases, just a new instance of it. Fixed by not setting
`position` in the component at all; the caller supplies `absolute` or
`relative` (either works as a positioning context for the children)
through `className`.

`InkParticles`' `<svg>` had no explicit `width`/`height`, so it fell
back to the browser's default intrinsic SVG size (300x150), and it
was nested inside `SwordSlash`'s `overflow-hidden` wrapper (needed to
contain the sword's off-screen travel), which clipped the burst
before any of it could render past that wrapper's compact `h-20` box.
The particles were there; a screenshot at the moment they should have
been visible just showed nothing. Fixed both: gave the SVG an
explicit `140x140` size, and moved `overflow-hidden` onto a narrower
inner wrapper that contains only the sword's motion, leaving the ink
burst free to render past the outer container's bounds.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Screenshotted Hero to confirm the seal renders in the corner and
      does not collide with the name/CTA layout at desktop and mobile
      widths
- [x] Screenshotted Skills, About, and Projects to confirm every
      category/node/card renders its icon at desktop and mobile widths
- [x] Clicked the MCQ card's "Traced further below" link and confirmed
      it lands on the Architecture Deep Dive heading fully clear of the
      sticky nav, not partially hidden under it
- [x] Clicked an existing nav link (Skills) after the
      `scroll-margin-top` change to confirm it did not regress the
      spacing that was already working there
- [x] Screenshotted Lab's grid to confirm `.frame-tactical` brackets
      render on every card and the Brainrot card's tag reads visually
      distinct from the other nine
- [x] Confirmed the particle field brightens when music is toggled on
      by reading the amplitude-driven `filter: brightness(...)` value
      directly off the DOM before and after toggling
- [x] Checked the reduced-motion path: particles stop drifting
      (global CSS override collapses the infinite keyframe to one
      frame) and the amplitude-brightness loop does not run at all
- [x] Checked the browser console for errors: none
- [x] Scrolled to Hero and caught the crow mid-flight with a
      screenshot, confirming it actually renders and moves rather than
      trusting the keyframe declaration alone
- [x] Scrolled gradually (not an instant jump) toward Lab and
      screenshotted three points in the sequence: the sword mid-slash,
      the ink burst at impact, and the settled state, to confirm the
      whole sequence actually plays in order
- [x] Read `FlameBreath`'s computed `position`/bounding rect directly
      off the DOM before and after the positioning fix to confirm it
      is genuinely an absolutely-positioned overlay now, not just that
      the visual looked plausible in a screenshot
- [x] Confirmed the ink particles are visible past `SwordSlash`'s
      `h-20` container after the sizing/clipping fix, not just that
      the component renders without throwing
- [x] Tested the full sequence with `prefers-reduced-motion: reduce`:
      `SwordSlash` renders nothing (returns `null`) and the heading is
      visible immediately with no layout gap left behind
- [x] Checked the browser console for errors through the whole
      sequence, at both the broken and fixed states, to catch the kind
      of runtime issue an SVG sizing/clipping bug does not usually
      throw for

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173**. Look at the top-right corner of the
hero for the seal, and hover it for a brief digital-glitch flicker.
Watch the top of the hero for a few seconds and a crow should drift
slowly across it. Scroll to **Skills**, **About**, and **Projects**
and notice every category, identity-map node, and project card now
has its own icon. On the **MCQ Exam Management Platform** card
specifically, click "Traced further below: full architecture
breakdown" and watch it jump straight to the Architecture Deep Dive
section, clear of the sticky nav. Scroll toward **Lab** slowly (not a
jump straight there) and watch a sword slash diagonally across just
above the heading, ink particles burst where it lands, and the
heading itself wipe in right after. Notice the flame-colored glow
breathing in the background alongside the red embers, and the dashed
corner brackets on every card. Hover the "not serious, promise" tag on
the Brainrot Sound Effects card for a small wiggle. Turn music on
(bottom-right widget) and watch the embers brighten slightly in time
with the sound.
