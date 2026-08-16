# Phase 9: Build Featured Projects

Replaces the "Featured Projects" placeholder from Phase 5. Three new
files: `src/data/projects.ts`, `src/components/ProjectCard.tsx`,
`src/sections/Projects.tsx`.

## Which projects, and why these four

Phase 9.2 lists a set of example project names, including two
(DormDash, Super Bug Zapper) that turned out not to be on the resume
at all. Went with the resume's actual four instead: MCQ Exam
Management Platform, Full-Stack Job Portal, Game of Amazons AI Agent,
and BestBytes Movie Database & Review System. That matches the
resume's own curation and Phase 9's "don't include weak projects just
to pad the count" instruction better than reaching for names from the
brief's generic example list.

## Getting the GitHub links right

The brief asks for a GitHub link per project. Rather than guess at
repo names (`github.com/PrashaantM/mcq-platform` or similar would have
been a plausible-looking wrong guess), ran `gh repo list PrashaantM`
to get the real list of repos, then matched each one to a resume
project by comparing the repo's own description against the resume's
project bullets:

- **MCQ Exam Management Platform** matched to `Generate67-capstone-team-6`
  (a GitHub Classroom repo, description references "capstone," and the
  course code COSC 499 is UBC Okanagan's capstone course)
- **Full-Stack Job Portal** matched to `job-portal` (description is
  almost word-for-word the resume bullet)
- **Game of Amazons AI Agent** matched to `GameOfAmazons`
- **BestBytes Movie Database & Review System** matched to `BestBytes`

Also checked each repo's `homepageUrl` field and found one real
deployed demo: the job portal, live on Vercel. Before using any of
these five URLs, checked that every one actually resolves
(`curl -I`, all returned 200) instead of assuming a GitHub API result
is automatically a working link.

One thing worth flagging: the resume says the Game of Amazons agent
"placed 10th class-wide," but the `GameOfAmazons` repo's own
description says "placed 14th class-wide." Went with the resume's
number since that's this project's established source of truth, but
these two numbers disagree somewhere and are worth reconciling.

## Content: problem, solution, architecture, decision, result

The resume writes in bullet points, not in this problem or solution
structure, so each project's `problem`/`solution`/`architecture`/
`decision`/`result` fields are synthesized rather than copied
verbatim. Kept every synthesized sentence traceable to something the
resume or the repo description already states (tech stack, feature
list, specific numbers like "100+ concurrent users" or "cut evaluated
branches 60%"), and kept problem statements at the level of "what
general problem does this kind of system have" rather than inventing
specific unconfirmed backstory about how things used to be done.

## ProjectCard

Shows name, one-sentence purpose, and tech badges by default. A
"How it works" toggle button reveals the rest (problem, solution,
architecture, decision, result) as a definition list, matching Phase
9.1's "expandable technical details" idea without needing a
scroll-heavy card that dumps everything at once. Hover gets a subtle
lift and an accent-colored border, plain Tailwind `transition-colors`
and `hover:-translate-y-1`, no Motion involved.

The brief's fuller 9.1 concept (animated architecture diagrams,
project-specific visuals) is left out on purpose. That's real
visualization work with actual project architecture behind it, which
is explicitly **Phase 14**'s job, not something to half-build here as
a card decoration.

## A build error worth keeping in mind

Reached for a `Github` icon from `lucide-react` since that felt like
the obvious choice for a repo link. It doesn't exist: this major
version of the library dropped brand/logo icons entirely (checked,
there's no Discord, X, or GitHub mark either, only generic icons).
`tsc` caught it immediately as a type error rather than it silently
failing at runtime. Swapped to `FolderGit2`, a generic
folder-plus-branch icon, as a reasonable stand-in.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Verified all 5 URLs (4 GitHub repos, 1 live demo) resolve with
      `curl -I` before using them
- [x] Screenshotted the grid at desktop and mobile widths
- [x] Clicked "How it works" on a card and screenshotted the expanded
      state to confirm all five fields actually render, not just that
      the JSX compiles
- [x] Pulled the actual rendered `href` values out of the page with
      Playwright and diffed them against the URLs used in the data
      file, to catch any copy-paste mismatch between the two
- [x] Checked browser console for errors: none

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173** and click **Projects** in the nav, or
scroll down past Skills. Click **How it works** on any card to expand
its technical details. Click **GitHub** to open the real repo, and
**Live Demo** on the Job Portal card to open the actual deployed app.
