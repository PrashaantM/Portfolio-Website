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
      className="border-border bg-surface/95 rounded-(--radius-card) fixed right-4 bottom-4 z-40 w-56 border p-3 shadow-lg backdrop-blur sm:right-6 sm:bottom-6"
    >
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isPlaying}
        className="text-text-primary hover:text-accent inline-flex items-center gap-2 font-mono text-xs transition-colors"
      >
        {isPlaying ? (
          <Pause size={14} aria-hidden="true" />
        ) : (
          <Music size={14} aria-hidden="true" />
        )}
        {isPlaying ? activeTrack.name.toUpperCase() : 'MUSIC OFF'}
      </button>

      {isPlaying && (
        <div className="mt-3 space-y-3">
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
