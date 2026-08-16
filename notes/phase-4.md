# Phase 4 — Create the Design System

Design tokens only in this phase — no actual page sections yet (that's
Phase 5+). A "design token" is just a named CSS variable (e.g.
`--color-accent`) that components reference instead of hard-coding a
raw value, so the whole site can be re-themed from one place and stays
visually consistent.

Everything lives in `src/styles/`, imported into `src/index.css`:

- `theme.css` — the actual token definitions (fonts, colors, radius,
  spacing, sizing), using Tailwind v4's `@theme` block. This is new
  Tailwind v4 syntax: instead of a `tailwind.config.js` file, you
  define tokens directly in CSS, and each one *automatically* becomes
  a utility class. Define `--color-accent` and you instantly get
  `bg-accent`, `text-accent`, `border-accent` for free — no extra
  config step.
- `base.css` — applies those tokens to raw HTML elements (`body`,
  `h1`-`h6`, links, `::selection`) so the page looks right even before
  any component uses a utility class.
- `layout.css` — the page-width container, section spacing, and
  heading size scale.
- `motifs.css` — the recurring visual-motif utility classes.

## 4.1 Typography

- [x] Picked a pairing: **Space Grotesk** for headings, **Inter** for
      body text, **JetBrains Mono** for code/technical bits.
- [x] Self-hosted via `@fontsource-variable/*` packages (npm packages
      that bundle the actual font files) instead of a Google Fonts
      `<link>` tag — no request to an external server just to render
      text, and one less third-party script per Phase 21's security
      checklist.
- [x] Used the *variable font* versions (one file per family that
      covers the whole weight range, e.g. 300-800) rather than
      separate static files per weight — smaller total download, and
      any weight in between works too.
- [x] Gotcha I ran into: the variable packages register their font
      under `'<Name> Variable'` (e.g. `'Space Grotesk Variable'`), not
      the plain family name the static packages use. Got this from
      grepping the installed package's own CSS rather than guessing —
      guessing wrong here means the font silently fails to load and
      the browser falls back to a system font with no error anywhere.

## 4.2 Colors

- [x] Named tokens by **role**, not by hue: `background`, `surface`,
      `text-primary`, `accent`, `border`, etc. A component asks for
      "the accent color," not "the red one" — if the red ever changes,
      nothing referencing `accent` needs to change.
- [x] Palette: near-black background (`#0a0a0c`), off-white text
      (`#ededef`), one restrained blood-red accent (`#c81e3a`) with a
      darker secondary variant for hover states. Matches the brief's
      "restrained red/black/white" direction instead of introducing a
      bunch of extra hues.
- [x] Checked contrast ratios (WCAG 2.1) before committing to hex
      values, since Phase 15 (Accessibility) is a stated requirement,
      not a nice-to-have. Worth understanding the two thresholds:
      - **4.5:1** — required for normal body-sized text
      - **3:1** — required for large text (~24px+) and for non-text
        UI elements like icons/borders
      `text-primary` on `background` comes out to **16.9:1** (easily
      passes). The `accent` red on `background` comes out to **3.5:1**
      — passes the 3:1 bar but *not* the 4.5:1 bar. That means the red
      is safe for a big heading or an icon, but not safe as small
      link text.
- [x] Fix: `<a>` tags keep full-contrast `text-primary` as their text
      color, and use `accent` only for the underline (a graphical
      element, so the 3:1 bar is the correct one to apply, and it
      clears it). So links stay legible for low-vision readers without
      giving up the red as a visual signal.

## 4.3 Spacing & sizing

- [x] Card radius (`0.75rem`) and button radius (`0.5rem`) — two
      sizes, restrained/technical rather than very rounded.
- [x] Page container max-width (`80rem` / 1280px) via a
      `.container-page` class, so content stops growing on huge
      monitors instead of stretching edge to edge.
- [x] Section spacing as one fluid value
      (`clamp(4rem, 8vw, 8rem)`) instead of a fixed number plus a
      separate mobile override — it scales itself down smoothly on
      small screens.
- [x] Heading sizes: `h1` uses a fluid "hero" size (since there's
      normally exactly one `h1` per page — the name in the hero),
      `h2`-`h4` use a smaller fluid/fixed scale.
- [x] Button height tokens (`sm`/`md`/`lg`) defined now; the actual
      `Button` component comes later when building real UI.
- [ ] Border thickness — decided this doesn't need its own token.
      The rule is just "always a 1px hairline using the `border`
      color," and 1px is already Tailwind's default border width, so
      adding a variable for it would just be an extra name for the
      same fixed number.

## 4.4 Visual motifs

Per the instructions ("pick a small number, don't collage every
reference"), landed on three, each tied to one specific inspiration
rather than throwing in a bit of everything:

- [x] **`.bg-grid`** — a thin technical grid line pattern (Attack on
      Titan's tactical/document feel).
- [x] **`.bg-noise`** — a very faint film-grain texture (the
      cinematic, atmospheric mood from the Lorna Shore / Bad Omens
      references). Pure CSS — an SVG noise filter as a background
      image, no image file, no JavaScript.
- [x] **`.divider-ink`** — a soft red gradient line standing in for a
      hand-drawn brush stroke (Demon Slayer's ink/water motif).

Deliberately **not** built yet, left for the Phase 12/13 animation
work since they need actual motion, not just static CSS:

- [ ] Chakra-style particle effects (Naruto)
- [ ] A "red thread" line animation connecting related elements
      (e.g. a future project-constellation visual)

## Verification

- [x] `npm run build` and `npm run lint` after every change — all
      clean.
- [x] After each token addition, checked the *compiled* CSS output
      (`dist/assets/*.css`) to confirm Tailwind actually generated the
      expected variables/utility classes, rather than just trusting
      that the `@theme` syntax was correct.
- [x] Started the dev server and screenshotted the page (still
      showing Vite's default placeholder content, since no real
      section exists yet) to confirm in a real browser — not just in
      the build output — that the background is actually dark, body
      text is actually Inter, and headings are actually Space
      Grotesk. Also checked the browser console for errors: none.

## Notes / issues while running this

> No real surprises this phase beyond the two things called out above
> (the `Variable` font-family naming gotcha, and the accent-color
> contrast fix). Everything here is tokens/CSS only — `App.tsx` is
> still the unmodified Vite starter page. Phase 5 is where an actual
> layout gets built on top of this system.
