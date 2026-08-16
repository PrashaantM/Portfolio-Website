# Phase 16: Responsive Design

Modified: `src/components/EmberCounter.tsx`.

## Method

Two passes against the live dev server with a real browser, not just
resizing a window by eye:

1. A scroll-through overflow check at all six required widths (320,
   375, 768, 1024, 1440, 1920), comparing `document.documentElement.
   scrollWidth` against `clientWidth` after scrolling the entire page.
   Any mismatch means something is forcing horizontal scroll. Result:
   **no horizontal overflow at any width**, and no console errors.
2. Full-page screenshots of every section at 320px (the tightest
   required width, where a layout is most likely to break), plus
   targeted screenshots of the grid-heavy sections (Skills, Projects,
   About) at 768px and 1024px to confirm the `sm:`/`lg:` breakpoints
   this site already uses throughout actually land where expected.

## What already worked without changes

Every grid in the site (`Skills`, `Projects`, `Lab`, `Interests`, the
new `Experience` list) already reflows correctly: single column at
320-640px, the documented `sm:`/`lg:` breakpoints picking up from
there. `About`'s two-column layout (text + sticky `IdentityMap`)
collapses to a single column below `lg`. `Navbar` switches to the
hamburger menu below `md` (768px) and stays a full horizontal link row
at and above it. Hero's `--text-hero` fluid clamp stays readable and
doesn't overflow its container even at 320px. None of this needed
changing; it was built correctly the first time.

## One real, confirmed bug: `EmberCounter` blocked a real click

Screenshotting the Projects grid at 320px showed `EmberCounter` (fixed
`top-20 right-4`) sitting directly on top of the Job Portal card's "How
it works" button. Screenshotting alone only proves a *visual* overlap,
so this got checked further: clicked at that button's exact on-screen
coordinates and read its `aria-expanded` attribute afterward. Before any
fix, `EmberCounter`'s div (no `pointer-events-none`, `z-40`, sitting
above the button in stacking order) was capturing that click instead of
the button underneath it, so the click did nothing, a real, confirmed
interaction bug, not just a cosmetic one. Not width-specific either:
the same overlap is visible at 1440px too (over the BestBytes card),
since `EmberCounter` is fixed at the same screen position regardless of
viewport width, and any grid's top-right card corner scrolling through
that zone will collide with it eventually. Narrower widths just surface
it more often, since single-column content spends more time filling
that zone as it scrolls past.

Fixed two ways:

1. **`pointer-events-none`** on the widget's root: it has no click
   handler of its own, only a live-updating count, so there's nothing
   lost by letting clicks pass straight through to whatever is actually
   underneath it. Re-tested the exact same click-at-coordinates check
   after the fix: `aria-expanded` correctly flips to `true`.
2. **Smaller footprint on narrow screens**: padding and font size drop
   one notch below the `sm` breakpoint, shrinking the area it can
   visually sit over in the first place.

What's *not* fixed, on purpose: a small amount of transient visual
overlap between this widget and whatever scrolls underneath it, since
it's a fixed, always-on-top HUD element by design (the same tradeoff
`MusicToggle` already accepts at the bottom of the page). Now that a
click always reaches the real element underneath, this is cosmetic, not
functional, and matches an accepted, common pattern for persistent
floating widgets (chat bubbles, cookie banners) rather than a defect
worth a bigger redesign for a flavor/easter-egg counter.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Scrolled the full page at all 6 required widths and confirmed
      `scrollWidth === clientWidth` at each (no horizontal overflow),
      plus 0 console errors at each width
- [x] Screenshotted all 8 sections at 320px and both grid-heavy sections
      at 768px/1024px
- [x] Reproduced the `EmberCounter` click-blocking bug with a real click
      at the exact overlapping coordinates and a before/after
      `aria-expanded` check, not just a visual before/after comparison

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Resize the browser down to 320px and scroll through the whole page, or
use DevTools' device toolbar. Scroll to **Projects** and try clicking
"How it works" on a card even while the ember counter visually overlaps
it, it now works.
