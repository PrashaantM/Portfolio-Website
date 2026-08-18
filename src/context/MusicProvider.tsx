import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createTrackPlayer, TRACKS, type TrackPlayer } from '../lib/audio'
import { MusicContext, type MusicContextValue } from './musicContext'

/**
 * Owns the single `TrackPlayer` instance for the site. Phase 11's rule
 * was "do not autoplay audio by default" and only ever built the
 * player lazily inside `toggle()`. Phase 15 reversed that, and Phase
 * 15.2 goes further: rather than only trying an audible `play()` and
 * accepting that a fresh visit will almost always have it rejected,
 * the mount effect's first attempt starts the track *muted*. That is
 * not a cosmetic difference - verified directly against a real
 * `AudioContext` rather than assumed, a muted, gesture-free `play()`
 * resolves and brings the context up to `running` under browsers'
 * standard autoplay policy, where an unmuted one is rejected outright.
 * `unmute()` right after is a plain property/gain change, not a second
 * autoplay decision, so in the common case music is actually audible
 * within moments of the page loading with no click required. The
 * `pointerdown`/`keydown`/`touchstart` listener from Phase 11 stays
 * armed regardless, both as the fallback for the rarer browser that
 * blocks even muted playback, and as a guaranteed-safe second call to
 * `unmute()` in case the immediate one did not actually reach the
 * speakers - a real user gesture is the one thing every browser's
 * autoplay policy unconditionally honors.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<TrackPlayer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.25)
  const [trackId, setTrackId] = useState(TRACKS[0].id)

  function getPlayer() {
    if (!playerRef.current) {
      // The player advances trackId on its own (mysterious x3, dark
      // x3, repeat - see audio.ts); this keeps React's own trackId
      // state, and therefore MusicToggle's picker, in sync with it.
      playerRef.current = createTrackPlayer((nextTrackId) => setTrackId(nextTrackId))
    }
    return playerRef.current
  }

  function toggle() {
    const player = getPlayer()
    if (isPlaying) {
      player.stop()
      setIsPlaying(false)
    } else {
      player.setVolume(volume)
      void player.play(trackId).then(() => setIsPlaying(true))
    }
  }

  // Deliberately mount-only: this is the one-time autoplay attempt,
  // not something that should re-run if `trackId`/`volume` change
  // later via the toggle's own setters.
  //
  // Phase 17: the very first `attempt()` used to run synchronously on
  // mount, which meant `.play()` (and the multi-megabyte network fetch
  // it forces the browser to start) began immediately, racing Hero's
  // own critical-path render for bandwidth. Measured directly:
  // Lighthouse's mobile preset (simulated slow 4G) showed the default
  // track's ~2.7MB transfer overlapping the JS/font/CSS requests the
  // Hero heading actually depends on, and Largest Contentful Paint
  // blew out to 17.2s. The default `TRACKS[0]` track is real,
  // user-supplied audio, not something to shrink or re-encode without
  // asking, so the fix is about *when* the fetch starts, not the file
  // itself: the same `requestIdleCallback` deferral `Scene3D.tsx`
  // already uses for the same reason, so the very first autoplay
  // attempt waits until the browser has cleared higher-priority work.
  // Gesture-triggered retries stay immediate: by the time a visitor has
  // clicked or pressed a key, first paint has already happened, so
  // there's nothing left to protect.
  useEffect(() => {
    const player = getPlayer()
    player.setVolume(volume)
    let started = false

    function attemptMuted() {
      if (started) return
      void player
        .play(trackId, { muted: true })
        .then(() => {
          started = true
          player.unmute()
          setIsPlaying(true)
          // Deliberately does not remove the gesture listeners here:
          // a muted play() resolving proves the browser allowed
          // *silent* playback, not that the unmute() right above
          // actually reached the speakers in every browser out there.
          // The first real gesture is the one thing every autoplay
          // policy unconditionally honors, so it stays armed as a
          // safety net until one actually happens.
        })
        .catch(() => {
          // Blocked outright - rare, since muted autoplay is broadly
          // allowed, but the gesture listener below is still there
          // for it.
        })
    }

    const gestureEvents = ['pointerdown', 'keydown', 'touchstart'] as const
    function onGesture() {
      // Safe (and a no-op if there is nothing to unmute) even if a
      // muted start already ran: this is the guaranteed path.
      player.unmute()
      if (started) {
        cleanup()
        return
      }
      void player.play(trackId).then(() => {
        started = true
        setIsPlaying(true)
        cleanup()
      })
    }
    function cleanup() {
      gestureEvents.forEach((event) => window.removeEventListener(event, onGesture))
    }

    let idleId: number | undefined
    let timeoutId: number | undefined
    if (typeof requestIdleCallback === 'function') {
      idleId = requestIdleCallback(attemptMuted)
    } else {
      timeoutId = window.setTimeout(attemptMuted, 200)
    }
    gestureEvents.forEach((event) => window.addEventListener(event, onGesture, { once: true }))

    return () => {
      cleanup()
      if (idleId !== undefined) cancelIdleCallback(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setVolume(nextVolume: number) {
    setVolumeState(nextVolume)
    playerRef.current?.setVolume(nextVolume)
  }

  function setTrack(nextTrackId: string) {
    setTrackId(nextTrackId)
    if (isPlaying) {
      void playerRef.current?.play(nextTrackId)
    }
  }

  // Stop cleanly if the component tree ever unmounts. It won't in
  // practice, since MusicProvider wraps the whole app, but leaving a
  // live AudioContext running past its owner is the kind of leak
  // worth closing off explicitly rather than assuming away.
  useEffect(() => {
    return () => playerRef.current?.stop()
  }, [])

  const value: MusicContextValue = {
    isPlaying,
    volume,
    trackId,
    toggle,
    setVolume,
    setTrack,
    getAmplitude: () => playerRef.current?.getAmplitude() ?? 0,
  }

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}
