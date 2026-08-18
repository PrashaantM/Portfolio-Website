export interface Track {
  id: string
  name: string
  file: string
}

// Two user-supplied trap-melody / music-box tracks (Phase 15), replacing
// the four generated "Unsettling Toy-Lofi" pieces from Phase 11. Not
// generated this time; these are real files the site owner provided
// directly, so there is no licensing question to route around the way
// there was for a found-online track. The mysterious one is
// first/default: MusicProvider starts on TRACKS[0] and now attempts to
// autoplay it on visit (see MusicProvider.tsx).
// `BASE_URL` rather than a leading `/`: these paths are plain runtime
// strings, not static imports, so Vite's own asset-URL rewriting never
// sees them. Needs to resolve correctly under GitHub Pages' project-repo
// subpath (see vite.config.ts), not just a domain root.
const BASE = import.meta.env.BASE_URL

export const TRACKS: Track[] = [
  { id: 'trap-mysterious', name: 'Mysterious Trap', file: `${BASE}audio/trap-melody-mysterious.wav` },
  { id: 'trap-dark', name: 'Dark Trap', file: `${BASE}audio/trap-melody-dark.wav` },
]

export interface TrackPlayer {
  /**
   * Returns a play promise rather than swallowing it, so a caller
   * (Phase 15's autoplay attempt in MusicProvider) can tell whether
   * playback actually started or was blocked by the browser's
   * autoplay policy.
   */
  play: (trackId: string) => Promise<void>
  stop: () => void
  setVolume: (volume: number) => void
  /** Root-mean-square level of the current output, roughly 0-1. */
  getAmplitude: () => number
}

/** How long the outgoing and incoming plays overlap at a loop point. */
const OVERLAP_SECONDS = 2.0

/**
 * Two `<audio>` elements, each routed through Web Audio into its own
 * `GainNode`, alternating: while element A plays out its last second,
 * element B starts from 0 and both cross-fade through that shared
 * second, so the loop point is a blend rather than a hard cut with an
 * audible gap (a plain `loop = true` `<audio>` element's loop point
 * has a brief but noticeable pause/restart). A single `AnalyserNode`
 * sits after both elements' gains are summed into a shared `master`
 * gain, so `getAmplitude()` keeps reading the actual combined output
 * regardless of which element(s) are currently audible.
 */
export function createTrackPlayer(): TrackPlayer {
  let ctx: AudioContext | null = null
  let els: [HTMLAudioElement, HTMLAudioElement] | null = null
  let gains: [GainNode, GainNode] | null = null
  let master: GainNode | null = null
  let analyser: AnalyserNode | null = null
  let dataArray: Uint8Array<ArrayBuffer> | null = null

  let scheduledTrackId: string | null = null
  let activeIndex: 0 | 1 = 0
  let detachWatcher: (() => void) | null = null

  function ensure() {
    if (ctx && els && gains && master && analyser) {
      return { ctx, els, gains, master, analyser }
    }

    const newCtx = new AudioContext()
    const newMaster = newCtx.createGain()
    newMaster.gain.value = 0.6

    const newAnalyser = newCtx.createAnalyser()
    newAnalyser.fftSize = 256
    dataArray = new Uint8Array(new ArrayBuffer(newAnalyser.frequencyBinCount))
    newMaster.connect(newAnalyser).connect(newCtx.destination)

    const newEls: [HTMLAudioElement, HTMLAudioElement] = [new Audio(), new Audio()]
    const newGains: [GainNode, GainNode] = [newCtx.createGain(), newCtx.createGain()]
    newEls.forEach((el, i) => {
      el.loop = false
      el.preload = 'auto'
      const source = newCtx.createMediaElementSource(el)
      source.connect(newGains[i]).connect(newMaster)
    })

    ctx = newCtx
    els = newEls
    gains = newGains
    master = newMaster
    analyser = newAnalyser
    return { ctx: newCtx, els: newEls, gains: newGains, master: newMaster, analyser: newAnalyser }
  }

  /**
   * Watches whichever element is currently "active" for its
   * `currentTime` crossing into the last `OVERLAP_SECONDS` of its
   * `duration`, then ramps it out while starting and ramping in the
   * other element from 0 — and re-arms itself on the new active
   * element, so this keeps alternating indefinitely. Only one
   * `timeupdate` listener is ever attached at a time; `detachWatcher`
   * always points at whichever one that currently is, for `play()` to
   * clear when the track changes out from under it.
   */
  function armCrossfadeWatcher() {
    const { ctx: activeCtx, els: activeEls, gains: activeGains } = ensure()
    const currentIndex = activeIndex
    const nextIndex: 0 | 1 = currentIndex === 0 ? 1 : 0
    const currentEl = activeEls[currentIndex]
    const nextEl = activeEls[nextIndex]
    const currentGain = activeGains[currentIndex]
    const nextGain = activeGains[nextIndex]

    function onTimeUpdate() {
      const duration = currentEl.duration
      if (!isFinite(duration) || duration <= OVERLAP_SECONDS) return
      if (currentEl.currentTime < duration - OVERLAP_SECONDS) return

      currentEl.removeEventListener('timeupdate', onTimeUpdate)

      const now = activeCtx.currentTime
      currentGain.gain.cancelScheduledValues(now)
      currentGain.gain.setValueAtTime(currentGain.gain.value, now)
      currentGain.gain.linearRampToValueAtTime(0, now + OVERLAP_SECONDS)

      nextEl.currentTime = 0
      void nextEl.play()
      nextGain.gain.cancelScheduledValues(now)
      nextGain.gain.setValueAtTime(0, now)
      nextGain.gain.linearRampToValueAtTime(1, now + OVERLAP_SECONDS)

      activeIndex = nextIndex
      armCrossfadeWatcher()
    }

    currentEl.addEventListener('timeupdate', onTimeUpdate)
    detachWatcher = () => currentEl.removeEventListener('timeupdate', onTimeUpdate)
  }

  function play(trackId: string) {
    const track = TRACKS.find((candidate) => candidate.id === trackId) ?? TRACKS[0]
    const { ctx: activeCtx, els: activeEls, gains: activeGains } = ensure()
    if (activeCtx.state === 'suspended') void activeCtx.resume()

    if (scheduledTrackId !== track.id) {
      detachWatcher?.()
      scheduledTrackId = track.id
      activeIndex = 0

      const [elA, elB] = activeEls
      const [gainA, gainB] = activeGains
      elA.src = track.file
      elB.src = track.file
      elA.currentTime = 0

      const now = activeCtx.currentTime
      gainA.gain.cancelScheduledValues(now)
      gainB.gain.cancelScheduledValues(now)
      gainA.gain.setValueAtTime(1, now)
      gainB.gain.setValueAtTime(0, now)

      armCrossfadeWatcher()
      return elA.play()
    }

    // Same track already scheduled (e.g. resuming after `stop()`):
    // just resume whichever element is flagged active, from wherever
    // it paused, rather than restarting the whole loop from 0.
    return activeEls[activeIndex].play()
  }

  function stop() {
    els?.forEach((el) => el.pause())
  }

  function setVolume(volume: number) {
    if (master) master.gain.value = volume
  }

  function getAmplitude() {
    if (!analyser || !dataArray) return 0
    analyser.getByteTimeDomainData(dataArray)
    let sumSquares = 0
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128
      sumSquares += normalized * normalized
    }
    return Math.sqrt(sumSquares / dataArray.length)
  }

  return { play, stop, setVolume, getAmplitude }
}
