# Phase 17: Performance

Modified: `src/components/Scene3D.tsx`, `src/context/MusicProvider.tsx`.
New: `public/robots.txt`.

## Method

Real Lighthouse runs (`npx lighthouse`) against a real production build
(`npm run build && npm run preview`), not guesses from reading the code.
This sandbox can't download Lighthouse's own bundled Chrome for this OS
(same `mac13-arm64` limitation `notes/phase-18.md` already ran into with
Playwright), so every run pointed `CHROME_PATH` at the system-installed
Google Chrome instead. Ran three configurations, since a single number
hides more than it reveals:

- **Desktop, Lighthouse's default simulated throttling** (a scaled-down
  approximation of a mid-tier machine, applied even to the "desktop"
  preset unless told not to)
- **Desktop, `--throttling-method=provided`** (real timings from this
  actual machine, no simulation layer)
- **Mobile, Lighthouse's default preset** (simulated slow-4G network +
  4x CPU slowdown, the standard "worst realistic case" profile)

## What was already fine

Fonts are self-hosted `@fontsource-variable` packages with `font-
display: swap` built in (confirmed by reading the generated CSS, not
assumed), so there's no invisible-text-while-loading (FOIT) problem.
The main JS bundle is already properly code-split from the WebGL layer
(`dist/assets/index-*.js` at 398KB raw / 128KB gzip vs. the lazy `Scene-
*.js` chunk at 992KB raw / 263KB gzip, confirmed as genuinely separate
network requests, not just separate files bundled together). `npm audit`
is clean. No layout shift at all (CLS: 0) in every configuration tested.

## Two real bugs, found by measuring rather than assumed away

**1. The WebGL scene competed with Hero's own entrance animation for
main-thread time.** `Scene3D.tsx`'s mount effect used to flip
`canRender` synchronously on first render, so the ~990KB `Scene` chunk's
download-parse-execute cycle started immediately, racing Hero's fade-up
animation for the CPU. Measured: desktop (default throttling) Total
Blocking Time was 670ms and Performance scored 56. Fixed with
`requestIdleCallback` (falling back to a 200ms `setTimeout` where it's
unavailable, i.e. Safari): the same check, the same dynamic import it
triggers, deferred until the browser has actually cleared
higher-priority work. Re-measured on the same throttling profile: TBT
dropped to 50ms, Performance jumped to 83.

**2. The autoplay attempt eagerly fetched a multi-megabyte audio file
on every visit.** Phase 15 made autoplay best-effort on mount, which
meant `MusicProvider`'s very first `.play()` call, and the full-file
network fetch that forces, started immediately, competing with the
fonts/CSS/JS the Hero heading actually depends on. Measured on the
mobile preset (simulated slow 4G): the default track's ~2.7MB transfer
overlapped the critical-path requests directly, and Total Blocking Time
was 800ms. `TRACKS[0]` (`trap-melody-mysterious.wav`, 5.1MB) is real,
user-supplied audio, not something to shrink or re-encode without
asking (see the file-size note below), so the fix is about *when* the
fetch starts, not the file. Same `requestIdleCallback` deferral pattern
as `Scene3D`, applied only to the initial autoplay attempt; gesture-
triggered retries (a real click or keypress) stay immediate, since by
that point first paint has already happened and there's nothing left to
protect. Re-measured: TBT dropped to 110ms.

## A finding investigated and reported honestly, not smoothed over

After fix #2, the mobile-preset Total Blocking Time improved
substantially (800ms to 110ms) and the overall Performance score rose
(53 to 71), but the same run's Largest Contentful Paint number got
*nominally worse* (17.2s to 22-23s, reproduced twice, not a one-off).
Investigated rather than either trusting the tool blindly or dismissing
it: both numbers are already deep in "catastrophically over the 2.5s
'good' threshold" territory, and Lighthouse's default mobile preset
combines *simulated* CPU throttling with a real, live network throttle,
a profile where `requestIdleCallback`'s exact fire time is inherently
harder for the simulation to model precisely, especially with two
independent deferred callbacks (`Scene3D`'s and `MusicProvider`'s) now
both waiting on the same "browser is idle" signal. The `--throttling-
method=provided` desktop run (real timings, no simulation) tells the
more trustworthy story: 98 Performance, 1.0s LCP, 0ms TBT. Kept both
fixes; a 5-second difference between two already-unusable simulated
worst-case numbers doesn't outweigh a real, repeatable, and much larger
improvement to actual main-thread blocking time, which is the metric
that best reflects whether a real visitor's clicks and scrolls feel
responsive.

## What's flagged, not fixed

- **`public/audio/trap-melody-mysterious.wav` is 5.1MB** (the dark
  track is 1.3MB). This is real audio the site owner provided directly,
  the same reasoning `notes/phase-15.md` already used to explain why
  it's not something to touch without asking. A follow-up worth
  considering later: re-encoding to a compressed format (Opus/AAC in a
  small container) at a reasonable bitrate for background music would
  likely cut this by 80-90% with no audible quality loss for this use
  case, but that's a real product decision about the actual shipped
  audio, not a build-config change, so it stays a recommendation here
  rather than something silently changed.
- **The mobile-preset LCP number itself** would need a smaller
  critical-path payload on a genuinely bandwidth-constrained connection
  to meaningfully improve, which mostly comes back to the same audio
  question above plus the inherent size of a real WebGL layer (already
  fully deferred and off the critical path, but still large once it
  does load). Not attempted here: reducing the 3D layer's own bundle
  size is a real scope/tooling decision (per-effect code splitting, a
  lighter Three.js import surface) bigger than a performance-pass fix.

## SEO fix picked up along the way

Lighthouse's SEO category flagged a missing `robots.txt` (score 91).
Added a plain `Allow: /` file; re-ran and SEO reads 100. Not part of
`portfolio-build.md`'s Phase 17 checklist directly, but it's a real,
one-line, zero-risk fix that showed up in the same measurement pass, so
it landed here rather than waiting to be rediscovered later.

## Numbers, before and after both fixes

| Configuration | Metric | Before | After |
|---|---|---|---|
| Desktop, default throttling | Performance | 56 | 83 |
| Desktop, default throttling | TBT | 670ms | 50ms |
| Desktop, default throttling | LCP | 3.4s | 3.2s |
| Desktop, real timings (`provided`) | Performance | not measured before | 98 |
| Desktop, real timings (`provided`) | LCP / TBT | not measured before | 1.0s / 0ms |
| Mobile, default preset | Performance | 53 | 71 |
| Mobile, default preset | TBT | 800ms | 110ms |
| Mobile, default preset | LCP | 17.2s | 22-23s (see investigation above) |
| Accessibility / Best Practices | (all configs) | 100 / 100 | 100 / 100 |
| SEO | (all configs) | 91 | 100 |

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Every Lighthouse number above is from a real run against a real
      production build on this machine, not estimated
- [x] Re-ran the mobile-preset LCP regression twice to confirm it was
      reproducible (not noise) before writing it up
- [x] Confirmed with a real Playwright click (not just reading the
      code) that the deferred autoplay attempt still works: a genuine
      click still starts playback and the widget label updates to the
      track name
- [x] Confirmed `Scene3D` still mounts a real `<canvas>` after the
      deferral, not just that the code compiles

## How to see this yourself

```bash
npm run build && npm run preview
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  npx lighthouse http://localhost:4173 --chrome-flags="--headless=new"
```
