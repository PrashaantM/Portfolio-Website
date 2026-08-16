# Phase 28: Definition of Done

`portfolio-build.md`'s own Phase 28 checklist, checked honestly against
the state of this branch at the end of Phase 24, not assumed. A few
items are explicitly not something to check off on the user's behalf,
called out separately at the bottom rather than glossed over.

## Verifiable against the actual code and a real running site

- [x] **The design is recognizably mine.** The seal/monogram, the
      hand-drawn crow/sword/ink motifs, the restrained red/black
      palette, and the specific anime/music references are threaded
      through every section, not just the hero (`notes/phase-12.md`,
      `notes/phase-23.md`'s Interests section).
- [x] **The site works without JavaScript errors.** Checked the browser
      console across every phase's own verification pass in this run
      (15 through 24) plus the Phase 20 e2e suite: zero errors in every
      one.
- [x] **Production build succeeds.** `npm run build` clean, re-confirmed
      as the final check in `notes/phase-24.md`.
- [x] **Tests pass.** `npm run test` (22/22) and `npm run test:e2e`
      (2/2), both new in `notes/phase-20.md`.
- [x] **Linting passes.** `npm run lint` clean throughout.
- [x] **It is responsive.** Verified at all 6 required widths with no
      horizontal overflow; one real bug found and fixed
      (`EmberCounter` blocking a click at narrow widths, `notes/
      phase-16.md`).
- [x] **It is keyboard accessible.** Skip link, visible focus rings, a
      full keyboard walkthrough with real screenshots, and an automated
      `@axe-core` scan at 0 violations across 6 different page states
      (`notes/phase-15-accessibility.md`).
- [x] **Reduced motion works.** Checked component-by-component across
      Phases 11-13 as each animated piece was built, and the global
      `prefers-reduced-motion` CSS override in `base.css` collapses
      every CSS animation/transition sitewide as a backstop.
- [~] **Audio is opt-in.** True as originally built (Phase 11: no
      autoplay, starts fully off), no longer true as of Phase 15's
      audio overhaul, which deliberately made autoplay best-effort on
      visit, an explicit, on-the-record departure from this exact rule
      (`notes/phase-15.md` names the override directly, it isn't an
      oversight this pass missed). What's still true post-Phase-15: a
      real `<button>` always visible and keyboard-reachable turns it
      off, and the browser's own autoplay policy still gates whether it
      actually starts audible for a first-time visitor with no prior
      interaction. Marked partial rather than checked, since the letter
      of this rule changed on purpose partway through the project.
- [~] **Performance is acceptable on mobile.** True on real hardware
      (Phase 17: 98 Performance, 1.0s LCP, unthrottled). Marginal under
      Lighthouse's default mobile preset (simulated slow 4G + heavy CPU
      throttling): 71 Performance, still a real improvement from 53
      before this run's fixes, but LCP stays far past the "good"
      threshold on that specific worst-case profile. Marked partial,
      with the honest numbers and the concrete follow-up (a compressed
      re-encode of the real audio files) recorded in `notes/phase-17.md`
      rather than rounded up to a clean checkmark.
- [x] **No secrets are exposed.** `notes/phase-21.md`: zero
      `import.meta.env`/`process.env` usage anywhere, `npm audit` clean,
      `.gitignore` now covers `.env*` defensively.
- [x] **Project information is accurate.** Every project/experience fact
      traces back to `public/PrashaantMudgala_Resume.pdf` or a verified
      `gh` lookup (`notes/phase-9.md`, `notes/phase-19.md`,
      `notes/phase-23.md`); nothing invented.
- [x] **Links work.** Verified programmatically: real `href` values
      pulled out of the rendered page and diffed against the intended
      URLs (`notes/phase-9.md`'s original pass, `notes/phase-23.md`'s
      for the new Contact/footer links, and the Phase 20 e2e spec
      re-checks the same ones on every future run).
- [x] **Resume is accessible.** `public/PrashaantMudgala_Resume.pdf`,
      linked from Hero, Contact, and the footer.
- [x] **Contact method works.** Real `mailto:`, LinkedIn, and GitHub
      links, verified in `notes/phase-23.md` and re-checked by the e2e
      spec.
- [x] **The site has meaningful engineering details.** Every project
      card's "How it works" panel (problem/solution/architecture/
      decision/result) plus a full Architecture Deep Dive for the
      flagship project (`notes/phase-9.md`, `notes/phase-14.md`).
- [x] **The visual effects support the content instead of hiding it.**
      Actively checked, not assumed: the one place a visual effect
      genuinely got in the way (`EmberCounter` overlapping a real
      button) was found and fixed in `notes/phase-16.md`, not left as a
      known issue.

## Not something to check off on the user's behalf

The build doc's own last four items are explicitly about what *the
person building this* understands, not about the code:

- [ ] I can explain the architecture.
- [ ] I can explain the major dependencies.
- [ ] I can explain the animation system.
- [ ] I can explain the deployment process.

Every phase note in this project (including this run's) was written
with exactly this in mind, plain-language explanations of *why*, a
"How to see this yourself" section, and honest accounts of real bugs
and how they were actually found, rather than a bare log of file diffs.
That's the material to check these against, but the checking itself
isn't something this note can do for you.
