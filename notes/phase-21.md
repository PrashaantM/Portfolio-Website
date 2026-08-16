# Phase 21: Security

Modified: `.gitignore`. New: `public/_headers`.

A checklist audit against `portfolio-build.md`'s own Phase 21 list, run
for real (grepped, not assumed) now that the site is functionally
complete.

## Checklist, item by item

- **No API keys or secrets in frontend source.** Grepped for
  `import.meta.env` and `process.env` across `src/` and `scripts/`:
  zero matches. Nothing in this codebase reads an environment variable
  at all, so there's nothing to accidentally ship. Phase 19's GitHub
  script runs entirely at build/dev time through Node, authenticating
  via the local `gh` CLI's own stored credentials, never through
  anything that ends up in a bundle a browser downloads.
- **No secrets committed.** `.gitignore` didn't list `.env`/`.env.*`
  before this phase (nothing needed it, since nothing in this project
  ever used one), added defensively so an accidental future one never
  gets picked up.
- **External links use appropriate security attributes.** Every
  `target="_blank"` in the codebase (`Hero.tsx`'s resume link,
  `ProjectCard.tsx`'s GitHub/demo links, `Contact.tsx`'s and
  `Footer.tsx`'s external links, added in Phase 23) pairs with
  `rel="noopener noreferrer"`, confirmed by reading each one directly
  rather than trusting a single grep (the literal-string version of
  that grep produces false positives on `Contact.tsx`/`Footer.tsx`,
  where `target`/`rel` are both set from the same conditional
  expression rather than a literal string, so those two got checked by
  hand instead).
- **User input is sanitized where applicable.** No form anywhere in the
  app takes user input; the only user-adjustable UI state is the music
  volume slider and track picker, neither of which touches the DOM as
  raw markup. Grepped for `dangerouslySetInnerHTML`, `eval(`, and
  `.innerHTML`: zero matches anywhere in `src/`.
- **Third-party scripts are minimized.** None. The only third-party
  code shipped to a visitor's browser is the npm dependencies bundled
  into the site itself (React, Motion, Three.js, etc.); no analytics,
  no embeds, no third-party `<script src>` tags.
- **Dependencies are reviewed.** `npm audit`: 0 vulnerabilities, re-run
  after this run's new devDependencies (`@playwright/test`, `@axe-core/
  playwright`) were added in Phases 15/17/20.
- **Forms have abuse protection if a backend is used.** No backend
  exists anywhere in this project, and Contact (Phase 23) was
  deliberately built without a contact form for exactly this reason:
  four direct links (email/LinkedIn/GitHub/resume) cover the same job a
  form would, without needing to build and maintain abuse protection
  for a feature that has a simpler alternative.

## New: response security headers

`public/_headers` is Cloudflare Pages' own convention (read directly by
the platform, no build step or Pages Function needed) for setting
response headers on every request: `X-Content-Type-Options: nosniff`,
`X-Frame-Options: DENY` (this site should never be framed by anyone
else's page), `Referrer-Policy: strict-origin-when-cross-origin`, and a
`Permissions-Policy` denying geolocation/camera/microphone/payment,
none of which this site uses or should ever be able to request on a
visitor's behalf.

## Considered and deliberately not added: a Content-Security-Policy

Grepped for inline `style={{` usage first rather than guessing: seven
components (`Hero.tsx`, `MusicToggle.tsx`, `InkReveal.tsx`, and four of
the `motifs/` components) render real inline `style="..."` attributes
as part of how their animations actually work, Motion's amplitude-
driven level bars and several of the hand-built motion sequences depend
on this. A CSP without `style-src 'unsafe-inline'` would make the
browser refuse to apply every one of those, silently breaking real,
already-shipped functionality, not a hypothetical risk. A CSP loose
enough to allow it isn't providing much real protection to begin with,
and getting a properly scoped one right (accounting for the WebGL
layer's texture data: URIs, the audio system's blob: buffers, and every
animated component individually) needs real testing against each of
those, not a guess written into a headers file and hoped correct. Left
as a flagged follow-up rather than shipped untested.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Confirmed `dist/_headers` and `dist/robots.txt` both land in the
      actual build output (Vite copies `public/` verbatim, confirmed by
      listing `dist/` after a real build, not assumed from the source
      file existing)
- [x] `npm audit`: 0 vulnerabilities
- [x] Grepped the full `src/` tree for `dangerouslySetInnerHTML`,
      `eval(`, `.innerHTML`, `import.meta.env`, and `process.env`: zero
      matches for all five
- [x] Manually verified every `target="_blank"` site-wide, including the
      two conditional-expression cases a literal grep can't catch,
      pairs with `rel="noopener noreferrer"`

## How to see this yourself

```bash
npm run build
cat dist/_headers dist/robots.txt
npm audit
```
