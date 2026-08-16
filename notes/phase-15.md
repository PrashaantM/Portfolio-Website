# Phase 15: Cinematic Audio + WebGL Animation Overhaul

Two changes requested together in one PR: replace the background music
with two real, user-supplied tracks and make one autoplay on visit, and
turn the site's restrained CSS/SVG animation layer into a much bigger,
"movie-like" one — explicitly overriding `portfolio-build.md`'s
original "not an anime fan site... without overwhelming" rule, which
this phase's own request is a deliberate departure from, not an
oversight. New files: `src/three/*` (nine files), `src/lib/sfx.ts`,
`src/components/InteractionEffects.tsx`, `src/components/Scene3D.tsx`.
Modified: `src/lib/audio.ts`, `src/context/MusicProvider.tsx`,
`src/components/Navbar.tsx`, `src/components/Button.tsx`,
`src/sections/Hero.tsx`, `src/styles/animations.css`,
`src/styles/motifs.css`, `src/App.tsx`, `package.json`.

## Part 1: Audio

Two uploaded files replace the four generated "Unsettling Toy-Lofi"
tracks from Phase 11 entirely — not synthesized this time, real files
the site owner provided, so (unlike every other audio decision on this
site) there's no licensing question to route around. Moved into
`public/audio/` as `trap-melody-dark.wav` and
`trap-melody-mysterious.wav`. The rename wasn't just tidiness: the dark
one's original filename had a literal `#` in it
(`..._D#_minor.wav`), and a `#` in a `src`/URL path parses as a
fragment identifier — left as-is, the browser would have requested a
silently truncated, wrong path. `src/lib/audio.ts`'s `TRACKS` now
lists these two, dark first (`MusicProvider` already defaults to
`TRACKS[0]`). The old generation pipeline that only the deleted tracks
ever used (`scripts/generate-toybox-tracks.mjs`, `scripts/gen-audio.ts`,
`scripts/gen-audio.html`, `scripts/wav.mjs`) is deleted too.

**Autoplay.** Phase 11's rule was explicit: no autoplay, start fully
off. This phase reverses that on request, within what a browser will
actually allow. `TrackPlayer.play()` (`src/lib/audio.ts`) now returns
the underlying `<audio>` element's `play()` promise instead of
swallowing it with `void`, so a caller can tell whether playback
actually started. `MusicProvider`'s new mount effect tries `play()`
immediately and only flips `isPlaying` true once that promise resolves
— the UI never claims audio is playing when the browser silently
blocked it. When the immediate attempt is rejected (the common case
for a fresh page load with no prior interaction), a one-time listener
on the very first `pointerdown`/`keydown`/`touchstart` anywhere on the
page retries it, so music starts on whatever the visitor does first
rather than requiring them to find the toggle. `MusicToggle`'s track
names were shortened ("Dark Trap" / "Mysterious Trap") so the existing
`w-56` widget doesn't overflow.

## Part 2: A real WebGL layer

Asked specifically for **real 3D via three.js**, not CSS/SVG tricks
faking depth, after being shown the tradeoff directly (bundle size and
complexity vs. this repo's own "don't add a dependency until existing
tools are proven insufficient" rule). New dependencies: `three`,
`@react-three/fiber`, `@react-three/drei` (only `Trail` is actually
used from it), `@react-three/postprocessing` + its peer `postprocessing`
(for `Bloom`). Every crow/ember/seal/burst shape is procedurally built
from primitive geometries at runtime — no external 3D model or asset
file — same "original motifs, nothing sourced" reasoning that's
governed every image on this site since Phase 12.

**Loading strategy.** `src/components/Scene3D.tsx` is the gate, kept
deliberately separate from `src/three/Scene.tsx` (the actual `<Canvas>`
content): it checks `useReducedMotion()` and a synchronous
`canvas.getContext('webgl2' || 'webgl')` probe *before* rendering
`React.lazy(() => import('../three/Scene'))`, so a visitor with
reduced motion set or no WebGL support never triggers the dynamic
`import()` at all, not just never sees it rendered. Confirmed with a
real reduced-motion browser context: 0 `<canvas>` elements in the DOM,
and the network never fetches the chunk. The chunk itself
(`dist/assets/Scene-*.js`) is ~987KB / 262KB gzipped, cleanly split
from the ~385KB/124KB main bundle by Vite's own code-splitting, so the
resume-critical content's load time is unaffected by whether the 3D
layer downloads at all.

**The state bridge.** `src/three/sceneBus.ts` is a tiny plain-module
pub/sub — no Redux/Zustand — matching the "expose a function, poll/
subscribe from a render loop" idiom `MusicContext.getAmplitude()`
already established in Phase 11. `emitClick`/`onClick` and
`emitNavTransition`/`onNavTransition` let plain DOM components
(`InteractionEffects`, `Navbar`) reach into the lazily-mounted WebGL
scene without prop-drilling or a shared provider. `getScrollVelocity()`
lazily starts its own smoothed `requestAnimationFrame` scroll tracker
on first read, so idle visitors (or anyone who never triggers the
scene) never pay for it.

**The pieces**, each in its own `src/three/*.tsx` file: `CrowFlock3D`
(3-4 procedural capsule-body/flap-wing crows on independent randomized
spawn timers, replacing Hero's old single flat `.crow-drift` SVG crow
— `Crow.tsx` and the `.crow-drift` CSS are both deleted), `EmberField3D`
(a single `Points` draw call, sitewide, additive to Lab's existing
denser `ParticleField` rather than replacing it), `SealField3D` (the
real `Seal` SVG rasterized to a canvas texture at runtime and applied
to a couple of large, slowly-rotating, fading watermark planes),
`ClickBurst3D` (ink droplets or a hex-ring "tech" burst, spawned at a
world-space point found by unprojecting the 2D click through
`screenToWorld.ts`), `NavBurst3D` (a bloomed sun-disc-and-rays flash —
an original stand-in for Demon Slayer's Hinokami Kagura, not a copy of
it — plus a brief camera punch), and `ScrollTrail3D` (two edge points
whose swing amplitude and drei `Trail` streak scale with
`getScrollVelocity()`, nearly invisible at rest since a stationary
point has no trail history to draw).

**A real bug caught by actually looking at a screenshot, not just
compiling.** The first crow material used `emissiveIntensity: 0.05` on
a near-black (`#0a0a0c`) body — against this site's equally near-black
background, that rendered as functionally invisible even though the
code was correct and the crow was genuinely there, correctly
positioned, correctly flapping. Cropping a screenshot to just the sky
band and zooming in found a barely-visible dark rectangle, not nothing
— confirming the bug was contrast, not logic. Fixed by raising
`emissiveIntensity` to 1.6 (comfortably above `Bloom`'s
`luminanceThreshold` of 0.2 in `Scene.tsx`) and setting
`toneMapped={false}` so the renderer's default tone mapping doesn't
crush the glow back down. Re-screenshotted after the fix: three crows
visible at once in one frame, each with a clear bloomed red-orange rim
against the dark sky. The same pass also caught the vertical spawn
range (`y: 2.4 + Math.random() * 2.4`) letting the nearer crows (lower
`z`, smaller camera distance, smaller frustum) clip off the top of the
screen; narrowed to `y: 1 + Math.random() * 2`, derived from the
worst-case frustum half-height at this component's closest `z`.

**Sound effects: `src/lib/sfx.ts`.** Same "no sourced audio" rule as
Phase 11's tracks, but real-time rather than offline-rendered, since
these are one-shots triggered on demand, not static loopable candidates
worth comparing ahead of time. `playInkSplash()` (filtered noise burst
+ a descending pitch blip), `playHighTechClick()` (a short sweeping
square blip + a confirm tick), `playNavSlash()` (a rising noise whoosh
+ a low sine "boom"). Every call site is inside a real click handler,
which is itself a user gesture, so constructing/resuming the
`AudioContext` here never hits the autoplay restriction Part 1 has to
work around — confirmed no autoplay-policy warnings from `sfx.ts`'s
own context in the console, only from `MusicProvider`'s (expected,
pre-first-interaction).

**Global click classification: `src/components/InteractionEffects.tsx`.**
One delegated `document` `click` listener instead of touching every
component that renders a button or link. `closest('a, button, input,
select, textarea, [role="button"]')` decides tech-burst-and-sound vs.
ink-burst-and-sound; anything inside `<header>` is skipped so Navbar's
own bigger transition doesn't double up. This one file is what makes
"buttons... everywhere" true without editing ProjectCard, LabCard,
MusicToggle, or Footer individually.

**Nav transition wiring: `src/components/Navbar.tsx`.** Both link
lists (desktop, mobile) plus the logo link share one `handleNavClick`:
`preventDefault`, emit the clicked link's own bounding-rect center as
the burst origin, play the whoosh, then `scrollIntoView({ behavior:
'smooth' })` 180ms later — partway through `NavBurst3D`'s ~700ms flash,
so the DOM jump is hidden under it rather than happening before or
after. `href` attributes stay real anchors throughout.

**Kept out of WebGL on purpose.** `Button.tsx` got a plain CSS
hover-sweep + active-press treatment (`.btn-tech` in
`animations.css`) instead of routing through the 3D layer — continuous
micro-interaction chrome doesn't need it; only the big spectacle
moments do.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Confirmed `dist/assets/Scene-*.js` is a separate chunk from the
      main bundle (Vite's own output), proving the lazy-load actually
      code-splits rather than just wrapping the import
- [x] Real browser pass via a scripted Playwright session against the
      dev server (not just reading the code): initial load shows
      "MUSIC OFF" (autoplay blocked, as any fresh automated/incognito
      session would), a real click flips it to "DARK TRAP" with moving
      level bars, confirming the first-gesture fallback actually fires
- [x] Screenshotted an ink-splash click (droplet ring at the exact
      click point) and a tech click on a real button (hex-ring burst
      centered on the button) side by side — visually distinct, both
      matching their intended shape
- [x] Screenshotted mid-nav-transition: the sun-disc-and-rays flash
      fully covering the viewport while the section underneath had
      already started changing, confirming the scroll genuinely
      happens under the flash rather than before/after it
- [x] Screenshotted the seal watermark fading in during an idle wait
- [x] Cropped/zoomed sky-band screenshots over several 3-second
      intervals until multiple crows were confirmed visible at once,
      not just present in the DOM
- [x] Reduced-motion browser context: 0 `<canvas>` elements in the DOM
      after load and after a click, confirming the WebGL layer (and
      its associated visual bursts) is skipped entirely, not just
      hidden
- [x] Checked the browser console for page errors across every pass
      above: none. The only console output was the expected
      pre-gesture autoplay-policy warnings and a benign
      `THREE.Clock` deprecation notice from `@react-three/fiber`'s
      internal clock (an upstream library concern, not this codebase's
      own code)
- [x] Confirmed `package.json`/`package-lock.json` only gained the
      four intended three.js-stack dependencies — a `playwright`
      install used solely to drive the verification browser was done
      with `--no-save` and fully removed afterward, confirmed via
      `git diff` showing no trace of it in either file

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173**. Click anywhere once (autoplay is
best-effort; most browsers need that first click) and dark trap music
starts at 25% volume, with the bottom-right widget switching to "DARK
TRAP" — and if you wait for it to loop, the last second overlaps with
the next play-through instead of cutting to silence (see the Update
below). Watch the background: embers drift upward everywhere, and
within a few seconds crows — actual gray winged silhouettes, not
placeholder shapes — start crossing the sky in the upper portion of
the screen. Every so often a large, faint, slowly-rotating seal
watermark fades in and back out somewhere on screen. Click empty space
and watch red ink droplets burst outward with a splash sound; click
any real button and watch a hexagonal tech-ring burst there instead
with a different sound. Scroll to any section past Hero and watch a
sword slash across just before its heading. Click a top-nav link and
watch a soft flickering flame flash cover the screen before it scrolls
to that section. Scroll fast and watch faint glowing trails sweep
along the left/right edges of the screen.

To regenerate the audio-swap or WebGL work from scratch, the two
uploaded tracks are the only irreplaceable input; everything else in
this phase (crows, embers, seals, bursts, sound effects) is generated
code with no external asset dependency.

## Update: five fixes from watching the real thing run

Five follow-up requests after actually using the site, not
hypothetical concerns — each one caught something the code alone
didn't reveal.

**1. Seamless music loop.** A plain `loop = true` `<audio>` element's
loop point has a small but audible gap/restart. `createTrackPlayer()`
in `src/lib/audio.ts` is now built around *two* `<audio>` elements
(`els: [HTMLAudioElement, HTMLAudioElement]`), each with its own
`GainNode`, alternating: a `timeupdate`-driven watcher
(`armCrossfadeWatcher`) detects when the currently-active element
crosses into its last `OVERLAP_SECONDS` (1s), then starts the other
element from 0 and linear-ramps both gains across that second — the
outgoing down, the incoming up — before re-arming itself on whichever
element is now active, so the alternation continues indefinitely.
Verified against the real running player, not just read as correct:
temporarily exposed the two elements/gains on `window.__debugAudio`
behind `import.meta.env.DEV` (removed again after), force-jumped the
active element to 1.3s before its (real, 7.9s) duration, and polled
every 300ms. The recorded gain values show a clean simultaneous
overlap — e.g. `gain 0.91`/`gain 0.09` at one poll, `gain 0.61`/`gain
0.39` at the next — both elements audibly playing at once through the
handoff, with the outgoing element only pausing (via its own native
`ended` event once `loop = false` playback reaches the real end) after
the new one is already at full volume. `getAmplitude()` needed no
changes: the `AnalyserNode` sits after both gains are summed into the
shared `master`, so it keeps reading whatever combination is actually
audible.

**2. Default volume 25%, not 50%.** One-line change,
`MusicProvider.tsx`'s `useState(0.5)` → `useState(0.25)`. Confirmed via
the real widget's volume slider (`input[type=range]`) reading `0.25`
after a fresh page load.

**3. The sword-slash animation, sitewide.** `SwordSlash`
(`src/components/motifs/SwordSlash.tsx`, Phase 12/13's sword +
`InkParticles` set piece) was Lab-only. Dropped as-is — no
modification needed, it already manages its own scroll trigger and
off-screen travel containment internally — right before the heading in
`About.tsx`, `Skills.tsx`, `Projects.tsx`, and `App.tsx`'s shared
`PlaceholderSection` (covering Experience/Interests/Contact in one
edit). Not added to Hero: unlike every other section, Hero is already
on screen at page load rather than scrolled *to*, so "when a user
scrolls to X" doesn't really describe it. Confirmed by screenshotting
mid-slash on both About and Skills.

**4. Crows: actual crows, not red rectangles.** The complaint was
accurate on two counts, not one. Shape: the previous version built a
capsule body plus two flat `boxGeometry` wings — literal rectangles,
exactly as described. Color: on top of that, an earlier fix for a
visibility bug had pushed the material to a blazing `emissiveIntensity
1.6` red, which is not what a crow looks like even once the shape is
right (the original 2D `Crow.tsx`, deleted in this same phase, used
`text-secondary` gray, not the accent red — this new version was a
regression from that, not just a shape problem). Fixed by rasterizing
that exact original hand-drawn SVG path (the real artwork, not a new
approximation of it) to a texture and applying it to a single flat
plane per crow, tinted `#8b8b93` (`--color-text-secondary`) with
`side: THREE.DoubleSide` so the existing direction-flip
(`scale.x = ±1`) doesn't cull half the flock. "Flapping" changed from
rotating box wings around the travel axis (which doesn't apply to a
flat plane — that would spin it edge-on to the camera and make it
disappear) to a `scale.y` squash/stretch plus a small `rotation.z`
wobble, both of which stay in the camera-facing plane. Confirmed with
cropped/zoomed sky-band screenshots: a clear gray winged silhouette
(reads as an "X" mid-flap), not a rectangle, not red.

**5. The nav-transition flame, less blocky.** The composition itself
("looks perfect") stayed; only the ray shapes changed.
`src/three/NavBurst3D.tsx`'s 10 flat `planeGeometry` rays (hard,
straight-edged rectangles — genuinely blocky, not a matter of taste)
are replaced by ~28 soft, additively-blended glow sprites
(`createFlameTexture()`, the same runtime radial-gradient-on-canvas
technique `EmberField3D`/`SealField3D` already use) scattered radially
at randomized distance/size, each interpolated between a hot
near-white and the site's accent red and given its own per-frame
flicker via a phase-offset sine. The central disc became a sprite with
the same soft texture instead of a flat-shaded `circleGeometry`.
Additive blending means overlapping licks naturally brighten toward
the center, the way a real flame cluster does. Confirmed by
screenshotting mid-burst: a soft, uneven, flickering cluster of warm
glows instead of a geometric starburst.

### Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Real browser pass (Playwright against the dev server) covering
      all five: volume slider reads `0.25`, sword mid-slash visible on
      About and Skills, crow silhouette confirmed gray/winged (not
      red/rectangular) across multiple sky-band screenshots, nav-burst
      mid-flash screenshot shows soft scattered glows instead of
      rectangles, and the audio crossfade poll (above) shows a real
      simultaneous gain overlap between both `<audio>` elements
- [x] The `window.__debugAudio` verification hook was temporary,
      confirmed removed from `src/lib/audio.ts` afterward — not part
      of the shipped code
- [x] Checked the browser console for errors across every pass: none
      (same benign pre-gesture autoplay-policy warnings and
      `THREE.Clock` deprecation notice as the base phase, nothing new)

## Update: overlap widened, flame flash reverted

Two more rounds of actually using the site.

**Overlap widened, then hand-tuned to 2s.** `OVERLAP_SECONDS` in
`src/lib/audio.ts` is the one constant driving the whole crossfade, so
changing it is a one-line edit. Set to `2.5` and re-verified with the
same `window.__debugAudio` technique as the original fix
(force-jumped the active element to 2.9s before its end, polled every
300ms): the gain values showed a clean ~2.5s overlap window (threshold
trips once `currentTime` passes `duration - 2.5`, both elements' gains
ramp smoothly across roughly `[5.4s, 7.9s]` on the 7.9s test track).
Adjusted by hand afterward to `2.0`, the value that actually shipped —
the crossfade logic itself doesn't care what `OVERLAP_SECONDS` is set
to as long as it's less than every track's duration, which both
tracks clear comfortably.

**The flame-flash redesign from the base phase, reverted.** The
"blocky" complaint that prompted swapping the flat rectangular
`planeGeometry` rays for soft additive glow sprites turned out to be
about wanting *less* blocky, not *no* geometry at all — the original
flat-ray version was "exactly what I wanted," the sprite-cluster
replacement was "completely wrong." `src/three/NavBurst3D.tsx` is back
to the original sun-disc (`circleGeometry`) + 10 rotating
`planeGeometry` rays + `sphereGeometry` sparks, confirmed by
screenshotting a live nav-transition mid-flash and comparing it
directly against the pre-redesign screenshot. Left a comment in the
file noting the softer version was tried and reverted, so a future
pass doesn't reintroduce it as an "obvious" improvement without
knowing that was already asked for and rejected once.

### Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Confirmed via the same debug-hook technique that the crossfade
      overlap window widens to match `OVERLAP_SECONDS` correctly (~2.5s
      when set to `2.5`); the shipped value was then hand-tuned to `2.0`
- [x] Screenshotted a live nav-transition mid-flash and confirmed it
      matches the original flat-ray/disc/spark composition, not the
      sprite-cluster version
- [x] Debug hook removed again afterward; confirmed absent from
      `src/lib/audio.ts`
- [x] Checked the browser console for errors: none
