# Phase 19: GitHub Integration

New: `scripts/fetch-github-stats.mjs`, `src/data/github-stats.json`.
Modified: `src/components/ProjectCard.tsx`, `package.json` (new
`fetch:github` script).

## Build-time snapshot, not a runtime call

Confirmed with the user before building this: a build-time snapshot
rather than a live `fetch()` from the browser. Phase 19's own rule is
explicit, "do not make the portfolio dependent on GitHub's API for core
content... if the API fails, the portfolio should still work," and the
cleanest way to satisfy that isn't a try/catch and a fallback state, it's
making sure there's nothing to fail at runtime in the first place.
`scripts/fetch-github-stats.mjs` uses the same `gh` CLI Phase 9 already
used to find these seven repos, run locally (`npm run fetch:github`),
writing `src/data/github-stats.json`, which gets committed like any other
data file and read the same way `src/data/projects.ts` already is. No
token, no API call, and no network dependency ships in the actual site.

## What it pulled

Real numbers, run just now:

| Project | Stars | Last pushed |
|---|---|---|
| MCQ Exam Management Platform | 0 | Aug 2026 |
| Full-Stack Job Portal | 0 | May 2026 |
| Game of Amazons AI Agent | 0 | Jun 2026 |
| BestBytes | 0 | May 2026 |
| BugZapper | 0 | May 2026 |
| Malware Containment Research | 0 | May 2026 |
| C.R.A.V.E | 0 | May 2026 |

## Why stars aren't rendered anywhere

They're fetched and stored in the JSON (so a future re-run picks them up
automatically), but every repo currently shows 0. A row of seven identical
"☆ 0" badges is not a real signal, it's filler UI that would make the
grid look worse, not more credible. "Last updated" is the field that's
actually informative right now, so that's the one `ProjectCard.tsx`
renders (`History` icon, top-right of the card, next to the project
name). Surfacing stars later, if that ever changes, is a one-line JSX
addition, not a re-architecture.

## One data quirk worth recording, not hiding

`gh`'s `primaryLanguage` field reports **Malware Containment Research**
as HTML, not R. That's GitHub's linguist counting whatever file makes up
the largest byte count in the repo, in this case a rendered R Markdown
HTML report, not the language the actual analysis was written in
(`notes/phase-9.md` already documented the real stack as R + igraph,
pulled from that repo's own README). This is exactly why `primaryLanguage`
is stored in the snapshot but not rendered next to the hand-curated `tech`
badges already on each card: GitHub's own heuristic would contradict
information already verified to be more accurate, on the same card.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] `node scripts/fetch-github-stats.mjs` run for real against the
      live `gh` CLI (already authenticated in this environment),
      output diffed against the table above before trusting it
- [x] Screenshotted the Projects grid and confirmed all seven cards show
      an "Updated" badge with a real, correctly formatted date, not a
      placeholder
- [x] Checked the browser console for errors: none

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173**, scroll to **Projects**, and look at the
top-right corner of any card for its real "Updated" date. To refresh the
snapshot later: `npm run fetch:github` (needs `gh auth login` first if
not already authenticated).
