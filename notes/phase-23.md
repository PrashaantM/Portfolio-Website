# Phase 23: Final Portfolio Content

Replaces the last three `PlaceholderSection` stubs from `App.tsx`
(Experience, Interests, Contact) with real content. New files:
`src/data/experience.ts`, `src/sections/Experience.tsx`,
`src/data/interests.ts`, `src/sections/Interests.tsx`,
`src/sections/Contact.tsx`. Modified: `src/App.tsx` (wires in the three
real sections, deletes the now-unused `PlaceholderSection`),
`src/components/Footer.tsx` (its own comment already said real GitHub/
LinkedIn/resume links land here).

Moved to the front of the 15-29 work instead of staying at its numeric
position: every later phase in this run (accessibility audit, responsive
check, performance pass, final visual review) is supposed to review the
*finished* site, and auditing three placeholder stubs first would just
mean re-auditing them again later.

## Experience

Five entries, straight from `public/PrashaantMudgala_Resume.pdf`: Tythe
Labs (Software Developer Intern), Best Buy Canada (Omnichannel
Specialist), Age-Link Society (Student Communications Coordinator,
promoted twice in four months), the UBC Okanagan Students' Union (Student-
at-Large, Policy Committee), and the UBC research role (Research
Contributor). Every number is copied exactly ($24,000, 10% attachment
rate, top 5 of 15+, 50% growth from 70 to 105 attendees, 500+ papers,
10-member team); the bullet sentences themselves are rewritten in the
site's own voice rather than pasted resume fragments, the same approach
Phase 9 used for project descriptions.

Two of these five (Tythe Labs, the research role) already show up
narratively in `About.tsx`. That overlap is intentional, not a mistake to
fix: About tells the story version of a couple of highlights, Experience
is the complete, dated, scannable version, the same relationship a real
resume has to a LinkedIn About section.

Built as an always-visible vertical list rather than the click-a-node
pattern `IdentityMap` (`About.tsx`) and `ArchitectureMap.tsx` both use.
Those two work because there are only a handful of short labels worth
clicking through one at a time; a resume timeline is exactly the kind of
content someone wants to read straight down, so hiding it behind clicks
would work against the section's own job. `DrawLine` (Phase 13) still
connects each entry to the next, same "these are linked in sequence" idea
`ArchitectureMap` uses between tiers, and `.frame-tactical` (Phase 12's
AoT document motif) frames each entry like a service record.

## Interests

Grounded only in what was already on record for this project, nothing
new invented: `notes/phase-1.md`'s own answer to "what makes this
portfolio different" names gym, anime, drawing, and deathcore directly,
and `portfolio-build.md`'s Design rules name the exact anime references
(Demon Slayer, Attack on Titan, Naruto, Takopi's Original Sin) and music
references (Lorna Shore, Pain Remains, Bad Omens) already threaded through
this site since Phase 11/12. Each of the four cards points at something
checkable elsewhere in this same codebase instead of a vague claim:

- **Anime** names the same four references and the specific motifs they
  produced (ink transitions, tactical framing, ember particles, the
  Brainrot card's tonal contrast).
- **Drawing** points straight at `src/components/motifs/`, the actual
  hand-built SVG paths (crow, sword, ink, seal) from Phase 12.
- **Deathcore & Music** initially said the corner music widget plays
  "generated audio," which was true of Phase 11's original drone and the
  four toybox tracks, but is no longer accurate: Phase 15 replaced those
  with two real WAV files the site owner provided directly. Caught before
  shipping and corrected to describe what's actually playing now (real,
  self-provided audio, not something pulled off the internet), not what
  used to play in an earlier phase. A good reminder that content
  describing "what this site does" needs to be re-checked against the
  current code, not just the phase that originally built the feature.
- **Gym & Calisthenics** stays intentionally general (no invented PRs,
  competitions, or specific numbers that aren't on record anywhere),
  matching Phase 1's own list without overstating it.

## Contact

Per the answer confirmed with the user before building this: email,
LinkedIn, and GitHub only, no phone number even though the resume lists
one. A public page anyone on the internet can reach is a different
audience than a resume PDF handed to a specific recruiter; the resume
(one click away via the Resume button) still has the phone number for
whoever gets that far. No contact form: there's no backend anywhere in
this project, so a form here would need its own abuse protection (Phase
21's own rule) for a feature four direct links already cover without one.

Icons: `Mail` for email, `FolderGit2` for GitHub (matches `ProjectCard.tsx`'s
existing choice), and `IdCard` for LinkedIn. Re-confirmed what Phase 9
already found: this version of `lucide-react` has no brand/logo icons at
all, not even a LinkedIn mark, so a generic professional-profile icon is
the actual right call, not a workaround.

The intro line ("looking for a Fall 2026 Software Engineering co-op")
is copied directly from the resume's own summary line. As of this phase
that's current, not aspirational.

## A real, pre-existing bug found along the way

`npm run build` failed before any of this phase's own content changes,
in `src/three/sceneBus.ts`: `onEmberDoused`'s cleanup function was
written as `() => emberDousedListeners.delete(listener)`, an
expression-bodied arrow that returns the boolean `Set.delete` gives back.
`EmberCounter.tsx` returns that function directly as its `useEffect`
cleanup, and TypeScript's `Destructor` type for effect cleanups doesn't
accept a function that returns something other than `void` when it's
passed by reference rather than written inline. `createChannel`'s own
`subscribe` function two lines above already avoided this exact trap with
a block body (`return () => { listeners.delete(listener) }`); `onEmberDoused`
just hadn't matched it. Fixed by switching to the same block-body form.
Runtime behavior was never wrong (React was always going to ignore the
boolean), only the type check was.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Scripted Playwright session (system Chrome via
      `channel: 'chrome'`, since this sandbox can't download Playwright's
      own bundled Chromium build for this OS) against the dev server:
      screenshotted Experience, Interests, and Contact at both 1440px and
      375px widths
- [x] Confirmed zero browser console errors across the whole pass
- [x] Pulled the real rendered `href` values out of the footer and
      Contact section with Playwright and diffed them against
      `mudgala.prashaant@gmail.com`, `linkedin.com/in/prashaantmudgala`,
      and `github.com/PrashaantM` to catch any copy-paste mismatch
- [x] Confirmed `PlaceholderSection` has no remaining references anywhere
      in `src/` after deleting it from `App.tsx`

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173** and scroll past Lab, or click
**Experience**, **Interests**, or **Contact** in the nav.
