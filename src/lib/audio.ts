import { createHeartbeatLoop, type HeartbeatLoop } from './heartbeatLoop'

export interface Track {
  id: string
  name: string
  file: string
}

// Two user-supplied trap-melody / music-box tracks. These are real audio
// files the site owner provided directly rather than generated audio, so
// there is no licensing question to route around. The mysterious track is
// first and default: MusicProvider starts on TRACKS[0] and attempts to
// autoplay it on visit (see MusicProvider.tsx).
//
// `BASE_URL` rather than a leading `/`: these paths are plain runtime
// strings, not static imports, so Vite's own asset-URL rewriting never
// sees them. They need to resolve correctly under GitHub Pages' project-repo
// subpath (see vite.config.ts), not just a domain root.
const BASE = import.meta.env.BASE_URL

export const TRACKS: Track[] = [
  { id: 'trap-mysterious', name: 'Mysterious Trap', file: `${BASE}audio/trap-melody-mysterious.wav` },
  { id: 'trap-dark', name: 'Dark Trap', file: `${BASE}audio/trap-melody-dark.wav` },
]

/** How many full loops a track gets before the player advances to the
 *  other one: three loops of the mysterious track, three of the dark
 *  one, repeating indefinitely. */
const REPEATS_PER_TRACK = 3

export interface TrackPlayer {
  /**
   * Returns a play promise rather than swallowing it, so a caller
   * (MusicProvider's autoplay attempt) can tell whether playback
   * actually started or was blocked by the browser's autoplay policy.
   * `muted: true` starts the element muted (and its gain at 0) so the
   * very first, gesture-free attempt on mount can succeed under the
   * standard "muted autoplay is always allowed" policy real browsers
   * ship with, verified directly against Chromium rather than assumed:
   * a fresh, gesture-free page load resolves `play()` and brings the
   * `AudioContext` up to `running` when the element starts muted, and
   * stays rejected/suspended when it does not. See `unmute()`.
   */
  play: (trackId: string, options?: { muted?: boolean }) => Promise<void>
  /**
   * Ramps whichever element is currently active from silent up to
   * audible. Not gated behind any browser permission the way `play()`
   * is: once a muted `play()` has already succeeded, changing `.muted`
   * or a `GainNode`'s value is a plain property write, not a autoplay
   * decision, so this is safe to call the instant a muted start
   * succeeds rather than waiting for a gesture. Calling it before a
   * muted start (or more than once) is a harmless no-op.
   */
  unmute: () => void
  stop: () => void
  setVolume: (volume: number) => void
  /** Root-mean-square level of the current output, roughly 0-1. */
  getAmplitude: () => number
}

/** How long the outgoing and incoming plays overlap at a loop point. */
const OVERLAP_SECONDS = 2.0

/** The heartbeat bus's own level, mixed under the melody's gain of up to
 *  1 into the same master bus: a supporting layer, not a competing one. */
const HEARTBEAT_LEVEL = 0.4

/**
 * Two `<audio>` elements, each routed through Web Audio into its own
 * `GainNode`, alternating: while element A plays out its last second,
 * element B starts from 0 and both cross-fade through that shared
 * second, so the loop point is a blend rather than a hard cut with an
 * audible gap (a plain `loop = true` `<audio>` element's loop point
 * has a brief but noticeable pause/restart). A single `AnalyserNode`
 * sits after both elements' gains (and the heartbeat loop's own gain) are
 * summed into a shared `master` gain, so `getAmplitude()` keeps reading
 * the actual combined output regardless of what is currently audible.
 *
 * `onTrackChange` fires whenever the loop counter (below) rolls the
 * active track over from one to the other, so `MusicProvider` can keep
 * its own `trackId` state, and therefore the picker in `MusicToggle`,
 * in sync with a switch this module decided to make on its own.
 */
export function createTrackPlayer(onTrackChange?: (trackId: string) => void): TrackPlayer {
  let ctx: AudioContext | null = null
  let els: [HTMLAudioElement, HTMLAudioElement] | null = null
  let gains: [GainNode, GainNode] | null = null
  let master: GainNode | null = null
  let analyser: AnalyserNode | null = null
  let dataArray: Uint8Array<ArrayBuffer> | null = null
  let heartbeatGain: GainNode | null = null
  let heartbeatLoop: HeartbeatLoop | null = null

  let scheduledTrackId: string | null = null
  /** Which track id is currently loaded into each element, so the
   *  crossfade watcher only reassigns `.src` (and forces a rebuffer)
   *  at an actual track switch instead of on every same-track loop. */
  let loadedTrackIds: [string | null, string | null] = [null, null]
  let activeIndex: 0 | 1 = 0
  let loopCount = 0
  /** True from a muted `play()` until `unmute()` runs. While true, the
   *  crossfade watcher ramps incoming elements to 0 instead of 1, so a
   *  loop boundary crossed before the visitor's first gesture does not
   *  itself become the moment audio turns audible. */
  let isMutedStart = false
  let detachWatcher: (() => void) | null = null

  function ensure() {
    if (ctx && els && gains && master && analyser && heartbeatGain && heartbeatLoop) {
      return { ctx, els, gains, master, analyser, heartbeatGain, heartbeatLoop }
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

    const newHeartbeatGain = newCtx.createGain()
    newHeartbeatGain.gain.value = HEARTBEAT_LEVEL
    newHeartbeatGain.connect(newMaster)
    const newHeartbeatLoop = createHeartbeatLoop(newCtx, newHeartbeatGain)

    ctx = newCtx
    els = newEls
    gains = newGains
    master = newMaster
    analyser = newAnalyser
    heartbeatGain = newHeartbeatGain
    heartbeatLoop = newHeartbeatLoop
    return {
      ctx: newCtx,
      els: newEls,
      gains: newGains,
      master: newMaster,
      analyser: newAnalyser,
      heartbeatGain: newHeartbeatGain,
      heartbeatLoop: newHeartbeatLoop,
    }
  }

  function otherTrack(trackId: string): Track {
    const currentIndex = TRACKS.findIndex((candidate) => candidate.id === trackId)
    return TRACKS[(currentIndex + 1) % TRACKS.length] ?? TRACKS[0]
  }

  /**
   * Watches whichever element is currently "active" for its
   * `currentTime` crossing into the last `OVERLAP_SECONDS` of its
   * `duration`, then ramps it out while starting and ramping in the
   * other element, and re-arms itself on the new active element, so
   * this keeps alternating indefinitely. Every crossing also counts as
   * one completed loop; once that count reaches `REPEATS_PER_TRACK`,
   * the element being started next loads the *other* track instead of
   * repeating the current one, which is what turns this into "three
   * loops of one track, three of the other, forever" rather than just
   * a gapless loop of a single track. Only one `timeupdate` listener is
   * ever attached at a time; `detachWatcher` always points at whichever
   * one that currently is, for `play()` to clear when the track changes
   * out from under it.
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

      loopCount += 1
      const currentTrackId = scheduledTrackId ?? TRACKS[0].id
      const advancing = loopCount >= REPEATS_PER_TRACK
      const targetTrack = advancing
        ? otherTrack(currentTrackId)
        : (TRACKS.find((candidate) => candidate.id === currentTrackId) ?? TRACKS[0])

      if (loadedTrackIds[nextIndex] !== targetTrack.id) {
        nextEl.src = targetTrack.file
        loadedTrackIds[nextIndex] = targetTrack.id
      }

      const now = activeCtx.currentTime
      currentGain.gain.cancelScheduledValues(now)
      currentGain.gain.setValueAtTime(currentGain.gain.value, now)
      currentGain.gain.linearRampToValueAtTime(0, now + OVERLAP_SECONDS)

      nextEl.currentTime = 0
      void nextEl.play()
      nextGain.gain.cancelScheduledValues(now)
      nextGain.gain.setValueAtTime(0, now)
      nextGain.gain.linearRampToValueAtTime(isMutedStart ? 0 : 1, now + OVERLAP_SECONDS)

      activeIndex = nextIndex
      if (advancing) {
        loopCount = 0
        scheduledTrackId = targetTrack.id
        onTrackChange?.(targetTrack.id)
      }
      armCrossfadeWatcher()
    }

    currentEl.addEventListener('timeupdate', onTimeUpdate)
    detachWatcher = () => currentEl.removeEventListener('timeupdate', onTimeUpdate)
  }

  function play(trackId: string, options: { muted?: boolean } = {}) {
    const track = TRACKS.find((candidate) => candidate.id === trackId) ?? TRACKS[0]
    const {
      ctx: activeCtx,
      els: activeEls,
      gains: activeGains,
      heartbeatGain: activeHeartbeatGain,
      heartbeatLoop: activeHeartbeatLoop,
    } = ensure()
    if (activeCtx.state === 'suspended') void activeCtx.resume()
    activeHeartbeatLoop.start()

    if (scheduledTrackId !== track.id) {
      detachWatcher?.()
      scheduledTrackId = track.id
      activeIndex = 0
      loopCount = 0
      isMutedStart = !!options.muted

      const [elA, elB] = activeEls
      const [gainA, gainB] = activeGains
      elA.muted = isMutedStart
      elB.muted = isMutedStart
      elA.src = track.file
      loadedTrackIds[0] = track.id
      elB.src = track.file
      loadedTrackIds[1] = track.id
      elA.currentTime = 0

      const now = activeCtx.currentTime
      gainA.gain.cancelScheduledValues(now)
      gainB.gain.cancelScheduledValues(now)
      gainA.gain.setValueAtTime(isMutedStart ? 0 : 1, now)
      gainB.gain.setValueAtTime(0, now)
      activeHeartbeatGain.gain.setValueAtTime(isMutedStart ? 0 : HEARTBEAT_LEVEL, now)

      armCrossfadeWatcher()
      return elA.play()
    }

    // Same track already scheduled (e.g. resuming after `stop()`):
    // just resume whichever element is flagged active, from wherever
    // it paused, rather than restarting the whole loop from 0.
    return activeEls[activeIndex].play()
  }

  function unmute() {
    if (!isMutedStart || !ctx || !els || !gains || !heartbeatGain) return
    isMutedStart = false
    els.forEach((el) => {
      el.muted = false
    })
    const now = ctx.currentTime
    const activeGain = gains[activeIndex]
    activeGain.gain.cancelScheduledValues(now)
    activeGain.gain.setValueAtTime(activeGain.gain.value, now)
    activeGain.gain.linearRampToValueAtTime(1, now + 0.6)
    heartbeatGain.gain.cancelScheduledValues(now)
    heartbeatGain.gain.setValueAtTime(heartbeatGain.gain.value, now)
    heartbeatGain.gain.linearRampToValueAtTime(HEARTBEAT_LEVEL, now + 0.6)
  }

  function stop() {
    els?.forEach((el) => el.pause())
    heartbeatLoop?.stop()
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

  return { play, unmute, stop, setVolume, getAmplitude }
}
