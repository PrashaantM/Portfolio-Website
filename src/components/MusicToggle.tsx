import { useEffect, useRef } from 'react'
import { Music, Pause, Volume2 } from 'lucide-react'
import { useMusic } from '../context/musicContext'
import { TRACKS } from '../lib/audio'

const BAR_COUNT = 5

/**
 * The explicit, opt-in music control from Phase 11: starts fully off,
 * no autoplay. Fixed bottom-right so it's reachable from anywhere on
 * the page without competing with section content, and real
 * `<button>`/`<select>`/`<input type="range">` elements so it works
 * from the keyboard without any extra handling.
 *
 * The track picker exists for a concrete reason, not as a permanent
 * feature commitment: four "Unsettling Toy-Lofi" pieces were
 * generated as candidates for this widget's one background track,
 * and this is how they get compared against each other before one is
 * picked. See notes/phase-11.md.
 */
function MusicToggle() {
  const { isPlaying, toggle, volume, setVolume, trackId, setTrack, getAmplitude } = useMusic()
  const barRefs = useRef<(HTMLDivElement | null)[]>([])

  // Phase 11.2, audio-reactive visuals: reads the engine's live
  // amplitude every frame and drives the level-bar heights directly
  // via the DOM ref rather than React state, so this doesn't force a
  // re-render 60 times a second for a purely visual readout.
  useEffect(() => {
    if (!isPlaying) return

    let frame: number
    const tick = () => {
      const amplitude = getAmplitude()
      barRefs.current.forEach((bar, index) => {
        if (!bar) return
        const phase = Math.sin(Date.now() / 420 + index * 1.3) * 0.12
        const scale = Math.min(1, Math.max(0.15, amplitude * 2.6 + phase))
        bar.style.transform = `scaleY(${scale})`
      })
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isPlaying, getAmplitude])

  const activeTrack = TRACKS.find((track) => track.id === trackId) ?? TRACKS[0]

  return (
    <div
      role="region"
      aria-label="Music player"
      // At desktop widths this is untouched: fixed w-56 pill, unconditionally.
      // Below `sm` (every portrait phone in this site's test matrix, all
      // <640px wide) and in phone-landscape (667-932px wide, so `sm:`
      // alone wouldn't reach it - see the custom variant in theme.css) it
      // was covering trailing text/tags/links in whatever section happened
      // to be scrolled to, since a 224px-wide panel is a large fraction of
      // any phone screen in either orientation. Idle, it collapses to an
      // icon-only tap target on both (`w-auto` + the button's own fixed
      // size below); playing, it still needs room for the volume slider
      // and track picker, so it only narrows to `w-48`, with extra
      // vertical compaction in phone-landscape specifically since a short
      // screen's problem is height (the panel can reach up into Hero's
      // CTAs), not width.
      className={`border-border bg-surface/95 rounded-(--radius-card) fixed right-4 bottom-4 z-40 border shadow-lg backdrop-blur sm:right-6 sm:bottom-6 ${
        isPlaying
          ? 'w-56 p-3 max-sm:w-44 max-sm:p-2 phone-landscape:w-48 phone-landscape:p-2'
          : 'w-56 p-3 max-sm:w-auto max-sm:p-0 phone-landscape:w-auto phone-landscape:p-0'
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isPlaying}
        // The 44px square tap target only applies while idle, where this
        // button is the panel's *entire* visible content (a floating
        // action button). Once playing, the panel already has several
        // other controls below it, so forcing the same fixed height here
        // would only add back the vertical space the rest of this
        // component is trying to save - a plain compact row is enough.
        className={`text-text-primary hover:text-accent inline-flex items-center gap-2 font-mono text-xs transition-colors ${
          isPlaying
            ? ''
            : 'max-sm:h-11 max-sm:w-11 max-sm:justify-center phone-landscape:h-11 phone-landscape:w-11 phone-landscape:justify-center'
        }`}
      >
        {isPlaying ? (
          <Pause size={14} aria-hidden="true" />
        ) : (
          <Music size={14} aria-hidden="true" />
        )}
        <span className={isPlaying ? 'max-sm:sr-only' : 'max-sm:sr-only phone-landscape:sr-only'}>
          {isPlaying ? activeTrack.name.toUpperCase() : 'MUSIC OFF'}
        </span>
      </button>

      {isPlaying && (
        <div className="mt-3 space-y-3 max-sm:mt-2 max-sm:space-y-1.5 phone-landscape:mt-2 phone-landscape:space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="flex h-4 items-end gap-0.5" aria-hidden="true">
              {Array.from({ length: BAR_COUNT }, (_, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    barRefs.current[index] = el
                  }}
                  className="bg-accent h-full w-1 origin-bottom rounded-full"
                  style={{ transform: 'scaleY(0.3)' }}
                />
              ))}
            </div>

            <label className="flex items-center gap-1.5">
              <span className="sr-only">Volume</span>
              <Volume2 size={14} className="text-text-secondary shrink-0" aria-hidden="true" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="accent-accent h-1 w-20"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-text-secondary font-mono text-[10px]">Track</span>
            <select
              value={trackId}
              onChange={(event) => setTrack(event.target.value)}
              className="border-border bg-background text-text-primary rounded-(--radius-button) mt-1 w-full border px-2 py-1 text-xs"
            >
              {TRACKS.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  )
}

export default MusicToggle
