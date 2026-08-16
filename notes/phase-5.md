# Phase 5 — Build the Global Layout

The shell every page section slots into: background, nav, footer, and
the container/section primitives that give consistent spacing. No real
section content yet (Hero/About/etc. are Phase 6+) — each section is a
labeled placeholder for now, just so the nav has somewhere real to
scroll to and the spacing is checkable before any real content exists.

## What got built

New files in `src/components/`:

- **`SkipLink.tsx`** — invisible until keyboard-focused, then jumps a
  keyboard user straight to `<main>`. It's the very first focusable
  thing on the page, before the nav.
- **`Background.tsx`** — a fixed layer behind everything, applying the
  `bg-grid`/`bg-noise` motifs from Phase 4.
- **`Container.tsx`** — caps content at the page's max width and
  centers it.
- **`Section.tsx`** — the wrapper every section is built on: vertical
  spacing (the `.section` token) plus a `Container` for horizontal
  width. `Section` and `Container` are separate, composed components
  rather than one — "how wide" and "how much space above/below" are
  two different jobs, and later phases might want one without the
  other.
- **`Navbar.tsx`** — sticky top nav with links to every section.
- **`Footer.tsx`** — name, tagline, copyright, back-to-top link.

`App.tsx` now renders all of it, with one placeholder section per
entry from `notes/phase-1.md`'s structure (Hero, About, Skills,
Projects, Lab, Experience, Interests, Contact). The old Vite starter
content (`App.css`, the React/Vite demo logos, `hero.png`,
`icons.svg`) is gone — nothing was using it anymore.

## Checklist

- [x] Global background
- [x] Navigation
- [x] Main content container
- [x] Section wrapper
- [x] Footer
- [x] Global typography — inherited from Phase 4's `base.css`, nothing
      new needed here
- [x] Responsive breakpoints — used Tailwind's defaults (`sm`/`md`/
      `lg`/`xl`/`2xl`) rather than defining custom ones; they already
      cover mobile/tablet/desktop/large-desktop and there was no
      concrete reason to deviate from them

## The one real interaction decision: the mobile nav

The brief is explicit that mobile shouldn't just be a shrunk desktop
layout — some interactions should change entirely. The nav is the
clearest example here: a row of 7 links has nowhere to go on a 375px
phone screen, so below the `md` breakpoint it becomes a menu button
(`Menu`/`X` icon from `lucide-react`) that reveals a stacked list,
instead of trying to cram the same horizontal row into less space.

That's a real `useState` toggle, but no animation library — just
conditional rendering and a couple of Tailwind classes. Per Phase 5's
own instruction ("do not build complicated animations yet") and the
overall rule about not adding a dependency before it's earned, `motion`
isn't touched here even though it's already installed; Phase 6+ is
where an actual entrance/transition animation would justify pulling it
in.

## Verification

Same discipline as Phase 4, plus this phase actually has visible UI to
check, so more of it was about *looking at it* rather than trusting
the build output:

- [x] `npm run build` and `npm run lint` clean after each commit
- [x] Screenshotted the dev server at six widths (320/375/768/1024/
      1440/1920px) in a real headless browser and looked at each one —
      confirmed the container stays capped and centered on wide
      screens, sections stack correctly, and the nav actually collapses
      to a menu button below `md` and expands back above it
- [x] Clicked the mobile menu button in the browser (not just read the
      code) and screenshotted it open, to confirm the toggle actually
      works and not just that the JSX looks right
- [x] Tabbed to the skip link with a real keyboard press and confirmed
      it animates into view with a visible focus ring, then checked its
      resting (unfocused) position is fully off-screen — first attempt
      at checking this measured the element's position *before* its
      transition had finished and got a misleading half-way reading;
      re-measured after letting the transition settle
- [x] Checked the browser console for errors at every viewport: none

## How to see this yourself

```bash
npm install   # only needed if you haven't already
npm run dev
```

Then open **http://localhost:5173** (Vite's default port — pass
`-- --port 5199` to `npm run dev` if you want to match the port used
during verification above). To actually see the responsive behavior
rather than just trusting the screenshots:

- Open the browser's device toolbar (Cmd+Opt+I → the device icon in
  Chrome/Edge DevTools, or Responsive Design Mode in Firefox) and drag
  the width down past ~768px to watch the nav collapse into the menu
  button.
- Click the menu button to open/close the mobile menu.
- Press Tab once from the top of the page (click the page first so
  it has focus, then Tab) to see the "Skip to main content" link
  appear.
- Resize back up past 768px and confirm the full link row returns and
  the mobile menu button disappears.

## Notes / issues while running this

> No real surprises in the implementation itself. The one thing worth
> remembering for next time: when scripting a screenshot/measurement
> against an element with a CSS transition, wait for the transition to
> finish before reading its position — otherwise you're measuring a
> mid-animation frame and it looks like a bug that isn't one. Also hit
> a one-off Chromium headless rendering artifact (a faint ghost box
> from the sticky nav's backdrop-blur during a smooth-scroll capture)
> that disappeared once the scroll had time to settle before the
> screenshot — not a real rendering issue, just a capture-timing one.
