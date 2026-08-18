# Phase 22: Deployment

Modified: `package.json` (added `engines.node`). Already in place from
earlier phases: `public/_headers` (Phase 21's security headers),
`public/robots.txt` (Phase 17).

Confirmed with the user before this phase: **Cloudflare Pages.**
**Superseded by an Update below: the user asked to switch to GitHub
Pages instead, after this section had already shipped and merged.**
Left in place rather than rewritten, since it's still the accurate
record of what was actually decided and why at the time.

## Why this needed almost no new configuration

Cloudflare Pages autodetects a Vite project and needs exactly two
settings (build command, output directory) with no config file at all
for a static-only site like this one. `wrangler.toml` is only needed for
Cloudflare Pages Functions (server-side request handling) or other
Workers-specific features, neither of which this site uses: everything
here is a static build, no backend, matching Phase 21's own "no form,
because there's no backend" reasoning. `public/_headers` is Cloudflare
Pages' own convention for response headers, already built in Phase 21,
and needs nothing further; Cloudflare reads it directly from the build
output.

`engines.node` in `package.json` is the one small addition this phase
actually made: pins the minimum Node version (20) the build expects,
which is what this environment used throughout Phases 15-29 and what
Cloudflare Pages will read to provision its build container, so a
future build doesn't silently run on an older Node version this project
was never tested against.

## What only the account owner can do

Connecting this GitHub repository to a Cloudflare account happens
through Cloudflare's own dashboard and needs the user's own login;
nothing here can do that from this environment. Exact settings to enter
when setting that up:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | (repository root, leave blank) |

Once connected, Cloudflare Pages builds automatically on every push
(satisfying `portfolio-build.md`'s own Phase 22 checklist: builds
automatically, deploys from Git, HTTPS by default on Cloudflare's own
domain, with a custom domain addable later from the same dashboard if
wanted).

## A real, honest follow-up: `og-image.png` and JSON-LD have no `og:url`

`notes/phase-18.md` already flagged this: there's no live URL to point
`og:url`/`<link rel="canonical">` at until this deployment actually
happens. Once the Cloudflare Pages URL (or a custom domain) exists,
adding those two tags to `index.html` is a two-line follow-up, not a
redesign.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Confirmed `dist/_headers` and `dist/robots.txt` both land in the
      real build output (re-verified here, not just trusted from Phase
      21/17's own checks)
- [x] Confirmed `npm run build` runs cleanly under Node 20+ (this
      environment's actual Node version), matching the new
      `engines.node` constraint

## How to see this yourself

```bash
npm run build
ls dist/          # _headers and robots.txt should both be here
```

To actually deploy: log into Cloudflare, create a new Pages project,
connect this GitHub repository, and enter the settings from the table
above.

## Update: switched to GitHub Pages

Asked to deploy on GitHub Pages instead, after this phase had already
shipped and the account-connection step was still sitting undone (a
platform the user hadn't set up yet). This is a bigger change than
swapping one config file for another: GitHub Pages and Cloudflare Pages
place a static site at genuinely different URL shapes, and that
difference is the whole story of this update.

### Subpath, not domain root, and why that broke real asset paths

Cloudflare Pages serves a project from its own domain root
(`*.pages.dev` or a custom domain). GitHub Pages, for a repository that
isn't itself named `<username>.github.io`, serves from a *subpath*
matching the repo name: `https://prashaantm.github.io/Portfolio-Website/`,
not the domain root. `vite.config.ts` now sets `base:
'/Portfolio-Website/'` to make Vite's own asset pipeline aware of that,
which it handles automatically for anything referenced through
`index.html` (confirmed by reading the actual built `dist/index.html`:
the favicon link, both script/stylesheet tags, and even the `og:image`/
`twitter:image` meta tags all got the `/Portfolio-Website/` prefix
without any manual change).

What Vite's `base` does *not* rewrite: plain runtime strings that
happen to look like paths, since nothing about `const x = '/foo.png'`
tells Vite it's an asset reference the way a static `import` would.
Five real spots needed a manual fix, all switched from a hardcoded
leading `/` to `` `${import.meta.env.BASE_URL}...` `` (a Vite-provided
constant that's always `/` by default and `/Portfolio-Website/` here,
so the same source works under either hosting shape without touching it
again if the base ever changes): the two background-music file paths
(`src/lib/audio.ts`), the crow flock's sprite-sheet texture
(`src/three/CrowFlock3D.tsx`), and the resume PDF link in three places
(`Hero.tsx`, `Contact.tsx`, `Footer.tsx`).

Verified concretely, not just reasoned about: fetched
`/Portfolio-Website/audio/trap-melody-mysterious.wav`,
`/Portfolio-Website/audio/trap-melody-dark.wav`,
`/Portfolio-Website/images/crows.jpg`, and the resume PDF directly
against a running dev server and confirmed all four return `200`, not
just that the code compiles.

### A Playwright gotcha from the same URL-shape change

`playwright.config.ts`'s `baseURL` needed the same subpath added. That
alone wasn't enough: `e2e/site.spec.ts` called `page.goto('/')`, and a
leading `/` in a URL passed to `page.goto` is a *path-absolute*
reference, which replaces the base URL's entire path rather than
resolving relative to it, landing back at the domain root instead of
`/Portfolio-Website/`. Switched to `page.goto('./')`, confirmed by
re-running the full e2e suite (both specs pass against the corrected
base path, not just that the test file was edited).

### What GitHub Pages can't do that Cloudflare Pages could

GitHub Pages has no equivalent of Cloudflare's `public/_headers`
convention: there is no way to set custom response headers on GitHub
Pages at all. The Phase 21 security headers (`X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) will not
apply on this host. `public/_headers` is left in the repo rather than
deleted, since it's inert and harmless here and would work again
immediately if this project ever moves to Cloudflare or another host
that honors it, but this is a real, honest tradeoff of the switch, not
a gap to gloss over.

### Deployment mechanics

`.github/workflows/deploy.yml`: on every push to `main`, checks out the
repo, installs with `npm ci`, runs `npm run lint` and `npm run test` as
a gate, builds, and publishes `dist/` via GitHub's own
`actions/upload-pages-artifact` + `actions/deploy-pages` actions. One
manual, one-time step only the repository owner can do: **Settings →
Pages → Source → GitHub Actions** (a repository setting, not something
achievable from a workflow file or this environment). `index.html`
gained real `og:url` and `<link rel="canonical">` tags pointing at the
now-known, deterministic GitHub Pages URL (`https://prashaantm.github.io/
Portfolio-Website/`), the exact follow-up `notes/phase-18.md` had
flagged as blocked on "once a live URL exists."

### Verification

- [x] `npm run build`, `npm run lint`, `npm run test` (22/22), and
      `npm run test:e2e` (2/2) all clean against the base-path changes
- [x] Read the actual built `dist/index.html` to confirm Vite's own
      base-path rewriting covered the favicon and OG/Twitter image tags
      automatically, rather than assuming it would
- [x] Fetched all four previously-hardcoded asset paths (two audio
      files, the crow sprite, the resume PDF) directly against a
      running dev server under the new subpath and confirmed real `200`
      responses
- [x] Re-ran the full Playwright e2e suite after the `page.goto`
      fix and confirmed both specs pass under the corrected base URL

### How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

The dev server now prints a URL that includes `/Portfolio-Website/`;
open that (not a bare `http://localhost:5173/`). Once **Settings →
Pages → Source** is set to **GitHub Actions** and a push to `main`
completes, the live site is at
https://prashaantm.github.io/Portfolio-Website/.
