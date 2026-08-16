# Phase 18: SEO and Metadata

Modified: `index.html`, `public/favicon.svg`. New: `public/og-image.png`,
`scripts/og-image.html`, `scripts/generate-og-image.mjs`.

## `index.html`

Added a meta description (kept to ~155 characters, the practical limit
before search engines truncate it), Open Graph tags (title/description/
image/type), Twitter card tags, a `theme-color` matching the site
background, and a `Person` JSON-LD block (name, job title, `alumniOf`
UBC Okanagan, `sameAs` linking the real GitHub and LinkedIn URLs). No
`og:url` or `<link rel="canonical">`: there is no live URL yet, Phase
22's Cloudflare Pages connection is a handoff step the user still has to
do themselves, and shipping a guessed or placeholder URL in a meta tag
that link-preview crawlers actually read would actively misdirect them,
which is worse than the tag being absent. **Follow-up for whenever the
real URL exists:** add `og:url` and the canonical link.

## The favicon was wrong

`public/favicon.svg` was a leftover purple/blue abstract mark, unrelated
to anything else on this site. This project's actual visual identity is
the dark red/black system in `theme.css`, and its actual emblem is
`Seal.tsx` (the hand-built double-ring "PM" monogram from Phase 12). The
browser tab was contradicting the site instead of matching it. Replaced
with a favicon built from the same paths as `Seal.tsx`, not a new design:
same double ring, same "PM" monogram, hardcoded hex colors instead of
`var(--color-*)` (a standalone `.svg` loaded via `<link rel="icon">`
renders in its own document, with no access to the parent page's CSS
custom properties, so the theme tokens simply don't resolve there),
thicker strokes than the source component so the shape still reads at a
16x16 browser-tab size, and a solid `#0a0a0c` background circle so it
stays legible against light-mode browser chrome instead of nearly
vanishing the way the original component's transparent, low-opacity
rings would at that size.

## The social preview image

`portfolio-build.md` asks for "a portfolio preview image that matches
the site's visual identity," not a stock template. Built as an actual
HTML page (`scripts/og-image.html`, 1200x630, the standard Open Graph
size) using the real palette, the real `Seal` SVG paths, and the actual
self-hosted variable fonts already in `node_modules` (`@font-face`
pointed at the same `.woff2` files `main.tsx` imports), then rendered to
`public/og-image.png` with a real headless browser
(`scripts/generate-og-image.mjs`), the same generate-with-a-browser
approach Phase 11 used for the original audio tracks. `@playwright/test`
is a real devDependency as of Phase 20's test suite by this point in the
build, so this reuses that install instead of a second ad-hoc one.

One environment note that affects every Playwright-driven step in this
whole 15-29 run, not just this one: this sandbox can't download
Playwright's own bundled Chromium build (`mac13-arm64` isn't supported by
the current release), so every script and verification pass uses the
system-installed Google Chrome via `channel: 'chrome'` instead of the
default bundled browser.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Rendered `favicon.svg` at 64x64 with a real browser and confirmed
      it still reads clearly as the seal/monogram at that size, not just
      that the file is valid SVG
- [x] Rendered `og-image.png` and visually confirmed the real fonts
      loaded (not a system-font fallback), the seal renders correctly,
      and no text overflows the 1200x630 canvas
- [x] Viewed `index.html`'s built output to confirm every meta tag
      actually landed in the production HTML, not just the source file

## How to see this yourself

```bash
npm run build && npm run preview
```

View source on the served page for the meta tags, or open
`public/favicon.svg` and `public/og-image.png` directly. To regenerate
the preview image after changing `scripts/og-image.html`:

```bash
node scripts/generate-og-image.mjs
```
