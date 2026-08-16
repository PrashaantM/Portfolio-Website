# Phase 11: Music System

New files: `src/lib/audio.ts`, `src/context/musicContext.ts`,
`src/context/MusicProvider.tsx`, `src/components/MusicToggle.tsx`.
Wired into `src/App.tsx`.

## No autoplay, no audio file

Phase 11's own rule is explicit: do not autoplay, and the site starts
with music fully off. Beyond that rule, browsers actively block audio
from starting before a user gesture, so `AmbientEngine`
(`src/lib/audio.ts`) does not even construct an `AudioContext` until
the first time someone clicks the toggle. `MusicProvider` only calls
`createAmbientEngine()` lazily, inside `toggle()`, not on mount.

There is also no audio file anywhere in this project. Phase 11.1
lists real influences (Lorna Shore, Pain Remains, Bad Omens,
Glennwood) and the brief's own mockup even labels a track "PAIN
REMAINS," a real Lorna Shore album. This site does not have the
rights to distribute that recording, and using its title as a label
while actually playing something else would misrepresent what is
playing. Phase 11.1 lists the safer alternative directly: original,
self-created ambient audio. So the "track" is a small ambient drone
composed and generated entirely in the browser via the Web Audio API,
never a file, and it is labeled "Signal Drift," a name that belongs
to this specific generated piece rather than borrowing a real band's
album title for something that is not that recording.

## The drone itself

`createAmbientEngine()` builds three detuned oscillators (a sine and
two triangles, tuned to low, dark notes: A1, A2, and a note a fifth
above A2) run through individual lowpass filters into a shared gain
node. Each filter's cutoff is swept by its own slow LFO (roughly a
15 to 25 second period per voice) so the sound has a "breathing"
quality instead of sitting on one static tone, matching the site's
own stated design language ("breathing/flow animations" from the
Demon Slayer reference in `portfolio-build.md`). The master gain ramps
in and out over roughly a second on start and stop
(`setTargetAtTime`) rather than switching instantly, avoiding an
audible click.

## Reading amplitude without fighting React's render loop

An `AnalyserNode` sits between the master gain and the destination.
`getAmplitude()` reads its time-domain data and computes an RMS
level, a single plain function call, not something wired into React
state. `MusicContext`'s `getAmplitude` is exposed the same way: a
function on the context value, not a number. A consumer that wants a
live amplitude reading (`MusicToggle`'s own level bars, `ParticleField`
in Phase 12) polls that function inside its own
`requestAnimationFrame` loop and writes the result straight to a DOM
node's style, sidestepping a 60-times-a-second React re-render for a
value that is purely visual and never needs to trigger layout or
touch any other component's state.

## Splitting the context from the provider

`useMusic` and the `MusicContext` object itself live in
`src/context/musicContext.ts`, a plain `.ts` file with no JSX, and
`MusicProvider` (the actual component, holding the engine ref and
React state) lives in `src/context/MusicProvider.tsx`. Started as one
combined file and `oxlint`'s `react-refresh` rule flagged it
immediately: a file that exports both a component and a non-component
value (the hook, here) breaks Fast Refresh's ability to hot-reload it
correctly. Splitting the two apart, rather than accepting the
warning, keeps the project's existing "clean build, clean lint every
phase" bar intact.

## The toggle widget

`MusicToggle` sits fixed in the bottom corner, reachable from any
scroll position, built from real `<button>` and `<input
type="range">` elements so it works from the keyboard without any
extra handling. Off state reads "MUSIC OFF" with a note icon; on
state swaps to the track name, a pause icon, five amplitude-driven
level bars, and a volume slider. The bars are five `<div>` refs whose
`transform: scaleY(...)` gets set directly inside the same
`requestAnimationFrame` loop described above, each offset slightly out
of phase with the others (`Math.sin` against the current time, keyed
by index) so the row reads as movement rather than five identical
bars pulsing in lockstep.

## Update: replacing the drone with four "Unsettling Toy-Lofi" tracks

Asked for a specific, different musical direction: "Unsettling
Toy-Lofi / Music Box Electronica," detuned and muffled piano/music-box
melodies that sound nostalgic yet wrong, with three or four candidate
pieces to compare and pick a favorite from. The single procedural drone
above did not fit that brief (it was one continuous ambient chord, not
a set of distinct melodic pieces), so it is gone: `src/lib/audio.ts`
now exposes a small file-based track player instead of
`createAmbientEngine`, and `MusicToggle` grew a track picker.

**Why generated audio again, not something found online.** The same
reasoning as the original drone applies to "toy-lofi music box"
tracks just as much as it did to a Lorna Shore record: a file found on
the web always carries a licensing question this site cannot answer,
regardless of how generic the genre sounds. So all four tracks are
synthesized, this time as actual static files rather than a live
`AudioContext` graph, since the brief specifically asked for
comparable, pickable candidates rather than one continuous ambience.

**How the files actually get made.** Node has no built-in Web Audio
implementation, so `scripts/generate-toybox-tracks.mjs` drives an
actual Chromium instance through Playwright, pointed at
`scripts/gen-audio.html` (which loads `scripts/gen-audio.ts`, a
generation-time-only file, not part of the shipped `src/` app). That
page builds each preset's audio graph inside an `OfflineAudioContext`
and renders it to a raw PCM buffer; the script pulls the samples back
into Node and writes them out as 16-bit WAV using a small hand-rolled
encoder (`scripts/wav.mjs`, about 40 lines, since a single WAV header
is simple enough not to justify a dependency for it). Mono, 22050 Hz,
17-second loops, `public/audio/toybox-{1..4}-*.wav`, roughly 730KB
each. `playwright` is not a project dependency (`npm install --no-save
playwright` before running the script); this is a one-off
asset-generation tool, not something the shipped site needs at
runtime or that CI needs to install.

**The four presets**, each aiming at a different flavor of "nostalgic
yet wrong" rather than four variations on the same idea:

- **Wound Down**: a five-note descending phrase that repeats with a
  growing gap between repetitions, like a wind-up spring running out
  of tension, small random per-note detuning, heavily muffled.
- **Off-Key Lullaby**: a simple, familiar-feeling seven-note phrase at
  a steady tempo, except the same one note lands consistently flat
  every single repetition rather than randomly, so it reads as
  something specifically broken rather than just noisy.
- **Static Bloom**: sparse, isolated bell tones from a loose
  pentatonic set at irregular intervals with no real melody, run
  through a bitcrusher (a `WaveShaperNode` quantizing the waveform)
  and a slapback delay for a hazy, haunted texture.
- **Broken Carousel**: a cheerful major-triad arpeggio at a bouncy
  tempo, undercut by a slow LFO-modulated delay time (a wow/flutter
  tape-warp effect) and periodic brief silences simulating a skipping
  mechanism.

Every preset shares one `scheduleNote` helper: a sine fundamental plus
a quiet triangle partial an octave and a hair up for the bell-like
shimmer real music boxes have, each with its own exponential-decay
envelope through a lowpass filter. The four presets differ in what
they schedule and what effects chain the notes pass through, not in
the underlying voice.

Before writing anything out, the generation script checks every
track for clipping (peak above 1.0), silence (peak below 0.02), and
`NaN` samples, and throws instead of writing a broken file if any
check fails. All four passed on the first real run: peaks between
0.28 and 0.36, comfortably under clipping, RMS between 0.05 and 0.07.

**Playback engine.** `createTrackPlayer()` in `src/lib/audio.ts`
replaces `createAmbientEngine()`: one `<audio>` element (not
literally added to the document; a `MediaElementAudioSourceNode`
works on a detached element) routed through Web Audio into the same
kind of `AnalyserNode` the drone used, so `getAmplitude()` keeps
working for the level bars and `ParticleField`'s brightness without
either of those consumers needing to change at all. Switching tracks
just changes the element's `src`; `createMediaElementSource` can only
be called once per element, which is exactly why the element, source
node, and analyser are all built once in `ensure()` and reused rather
than torn down per track.

**The track picker.** `MusicToggle` gained a `<select>` under the
existing volume slider, one option per track from `TRACKS`
(`src/lib/audio.ts`), switching live via `MusicContext`'s new
`setTrack`. Framed in the component's own comment as what it actually
is: a way to compare the four candidates against each other before
picking a favorite, not a permanent "choose your ambience" feature
promised to stay forever.

## Verification

- [x] `npm run build` and `npm run lint` clean
- [x] Confirmed no `AudioContext` is constructed until the toggle is
      actually clicked, by checking that `MusicProvider`'s engine ref
      stays `null` on mount
- [x] Clicked the toggle, watched the level bars actually move (not
      just render at a static height), and confirmed dragging the
      volume slider changes the audible level
- [x] Turned music on, scrolled to Lab, and confirmed the particle
      field's brightness genuinely tracks the amplitude reading rather
      than just toggling on
- [x] Tested with `prefers-reduced-motion: reduce`: the toggle and
      audio playback both still work (this is sound, not motion, so
      Phase 11 stays independent of Phase 15's motion rules), while
      the amplitude-driven visual bars and particle brightening
      correctly stop updating
- [x] Checked the browser console for errors through toggling on,
      adjusting volume, and toggling off: none
- [x] Validated all four generated WAV files directly with `afinfo`:
      correct format (16-bit mono PCM, 22050 Hz), correct 17-second
      duration
- [x] Confirmed the generation script's own clipping/silence/NaN
      checks passed for all four tracks before trusting the files
- [x] Read a level bar's live `transform: scaleY(...)` value at three
      different points in time while a track played and confirmed it
      actually changed between reads, proof that real audio is
      flowing through the analyser rather than the UI just rendering
      a static "on" state
- [x] Switched tracks via the picker and confirmed the toggle
      button's own label updates to the newly selected track's name

## How to see this yourself

```bash
npm install   # only if you haven't already
npm run dev
```

Open **http://localhost:5173**. Click **MUSIC OFF** in the bottom
corner. It should switch to **WOUND DOWN** with a pause icon, five
small level bars, a volume slider, and a track dropdown, and you
should hear a slow, detuned music-box phrase start playing with the
gaps between repeats gradually growing. Switch the dropdown between
the four tracks and listen for how differently "wrong" each one is.
Scroll to **Lab** while music is playing and watch the ember
particles brighten slightly in time with the sound.

To regenerate the audio files after changing a preset in
`scripts/gen-audio.ts`:

```bash
npm install --no-save playwright
npm run dev                                 # in one terminal
node scripts/generate-toybox-tracks.mjs     # in another
```
