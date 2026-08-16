# Phase 8: Build the Skills / Engineering Section

Replaces the "Skills" placeholder from Phase 5. Three new files:
`src/data/skills.ts`, `src/components/Badge.tsx`,
`src/sections/Skills.tsx`.

## Where the content came from

The resume's Technical Skills section, verbatim on the individual
skills. Nothing added that isn't already there, with one exception
(below). The resume groups things as Languages / Frameworks &
Libraries / Databases / Tools, Practices & Concepts. Phase 8 explicitly
asks for something different: "group by what you can actually do," not
by category-of-thing. Regrouped into five capability-based buckets
instead:

- **Languages**: same as the resume
- **Frameworks & Libraries**: same as the resume
- **Systems & Data**: merges the resume's Databases section with the
  REST APIs / Concurrency / DS&A items that were sitting in its
  generic "Tools, Practices & Concepts" bucket, since those are all
  really about how systems are put together
- **Engineering Practices**: the CI/CD, testing, and process items
  from that same bucket
- **AI-Assisted Development**: the one category not on the resume.
  Included anyway because it's the most concretely defensible thing
  here: "I used Claude Code as part of a serious development workflow"
  isn't a claim about a resume line, it's demonstrated by this
  literal codebase and the `notes/` directory documenting the review
  process phase by phase.

## Why data lives in `src/data/skills.ts` instead of the component

This is the first real use of the `src/data/` folder from Phase 3's
plan (deliberately left uncreated until there was actual content for
it). Keeping the skill list as a plain exported array means adding or
correcting a skill later is a one-line data change, not a JSX edit -
matches the folder's whole stated purpose ("content changes don't mean
touching component code").

## The Badge component

A small reusable label (`src/components/Badge.tsx`) for tech-stack
items: monospace, bordered, muted. Built now instead of inline
`<span>` styling in `Skills.tsx` because Phase 9's project cards need
the exact same thing for their tech-stack badges; extracting it now
means Phase 9 just imports it instead of re-deriving the same classes.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Screenshotted at desktop (three-column grid) and mobile
      (single-column stack) widths
- [x] Checked browser console for errors: none

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173** and click **Skills** in the nav, or
scroll down past About. Five cards, each with its own group of
technology badges.
