# Phase 25-26: Claude Code Workflow and Rules

`portfolio-build.md` asks for a reflection on how Claude Code was
actually used across this project (Phase 25's Steps A-F) and whether the
specific-prompt discipline Phase 26 asks for actually held (`"Make the
website better"` vs. a goal/constraints/architecture/behavior/
verification prompt). Written from this project's own real history
(`notes/phase-1.md` through `notes/phase-24.md`), not as generic advice.

## Step A-F, where they actually show up in this project's own notes

**A: understand before changing.** Every phase's own note opens by
naming exactly which files exist already and what they do before
describing a single change; `notes/phase-14.md` is a clean example,
explicitly choosing to extend `Projects.tsx` rather than add a new
top-level section because it first checked what `App.tsx`'s nav already
covered and what Phase 1.2's own rule said about not adding sections
without a real information-architecture reason.

**B: plan before implementing.** `notes/phase-9.md`'s project selection
is a plan made visible: it names the four resume projects, explains why
two of the brief's own suggested examples (DormDash, Super Bug Zapper)
got set aside once they turned out not to be on the resume, and only
then moves to which three additional GitHub repos to add and why.

**C: implement only the agreed plan.** Phase 19 (this run) is a direct
example: the user picked "build-time snapshot" over "live API call" as
an explicit, confirmed decision before any code was written, not a
default assumed partway through.

**D: review as a senior engineer.** `notes/phase-13.md`'s eight-step
debugging log (isolating a Motion library bug down to
"`IntersectionObserver`-triggered animations targeting `clipPath` don't
play, transform-based ones do") is the clearest example of this in the
whole project: each step is a hypothesis stated and then actually
disproven, not assumed away.

**E: test.** Every phase note in this project ends with a `Verification`
section, and it is treated as load-bearing, not decorative:
`notes/phase-15-accessibility.md` (this run) investigated an automated
scanner result that looked wrong (a "color-contrast" violation on cards
that were still mid-animation) rather than either blindly trusting or
blindly dismissing the tool, and confirmed the real explanation by
re-running the scan with a longer settle time before writing anything
down.

**F: teach.** The recurring "How to see this yourself" section at the
end of every phase note, plus explanations like `notes/phase-2.md`'s
answer to "what does Vite actually do" (two jobs: dev server with hot
reload, production bundler/minifier), are written for exactly this: so
the concepts survive without Claude Code in the room.

## Where Phase 26's specific-prompt discipline actually mattered

The clearest example of the difference a specific prompt makes is
`notes/phase-4.md`'s color decision: not "pick nice colors" but a
concrete constraint (a restrained red/black/white system, WCAG-checked
before committing) that produced a real, useful finding, the accent red
clears 3:1 but not 4.5:1, so it's safe for icons and large text but not
small link text, encoded directly into how `<a>` tags are styled
sitewide (full-contrast text color, accent only as the underline). A
vague "make the links look good" prompt would not have produced that
constraint or the fix that came from it.

The inverse also happened at least once, worth recording honestly
rather than only citing the successes: Phase 15's original animation/
audio overhaul explicitly overrode `portfolio-build.md`'s own "not an
anime fan site... without overwhelming" rule on request, a case where
a broad, ambitious prompt was the right call, deliberately, not a
mistake, but it's also the reason that same phase's own follow-up round
needed five separate correction passes (seamless audio loop, default
volume, sword-slash placement, crow shape/color, flame-flash geometry)
once the result was actually seen running. The lesson that stuck: an
ambitious, open-ended prompt can be exactly right for a big creative
swing, but it trades away the "verify against a specific behavior"
guardrail a narrower prompt gives for free, so it needs more real
looking-at-the-running-site afterward to compensate, not less.

## How this specific 15-29 run applied the same discipline

Before any implementation this run, the plan file
(`.claude/plans/zippy-skipping-scone.md`, referenced here since it
drove this whole branch) named the exact execution order and why it
diverges from `portfolio-build.md`'s own numbering (Phase 23's content
moved first, since every later phase needed to review the *finished*
site, not placeholders), and three genuinely user-only decisions
(deployment platform, whether to show a phone number, live vs.
build-time GitHub data) were confirmed before writing any code rather
than assumed. That is Steps B and C from this same phase, applied to
itself.
