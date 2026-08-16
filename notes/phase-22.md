# Phase 22: Deployment

Modified: `package.json` (added `engines.node`). Already in place from
earlier phases: `public/_headers` (Phase 21's security headers),
`public/robots.txt` (Phase 17).

Confirmed with the user before this phase: **Cloudflare Pages.**

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
