import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createTrackPlayer, TRACKS, type TrackPlayer } from '../lib/audio'
import { MusicContext, type MusicContextValue } from './musicContext'

/**
 * Owns the single `TrackPlayer` instance for the site. Phase 11's rule
 * was "do not autoplay audio by default" and only ever built the
 * player lazily inside `toggle()`. Phase 15 reverses that: the site
 * should now start playing the moment someone visits. Browsers still
 * block audible playback before a user gesture, though, so this is a
 * best-effort autoplay rather than a guarantee: the mount effect below
 * tries `play()` immediately, and only flips `isPlaying` once that
 * promise actually resolves, so the UI never claims audio is playing
 * when the browser silently blocked it. If the immediate attempt is
 * rejected (the common case for a fresh visit), a one-time listener on
 * the very first `pointerdown`/`keydown`/`touchstart` anywhere on the
 * page retries playback, so music starts on whatever the visitor does
 * first rather than requiring them to find the toggle.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<TrackPlayer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.25)
  const [trackId, setTrackId] = useState(TRACKS[0].id)

  function getPlayer() {
    if (!playerRef.current) {
      playerRef.current = createTrackPlayer()
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

    function attempt() {
      if (started) return
      void player
        .play(trackId)
        .then(() => {
          started = true
          setIsPlaying(true)
          cleanup()
        })
        .catch(() => {
          // Blocked by the browser's autoplay policy; the gesture
          // listeners below will retry on the visitor's first
          // interaction.
        })
    }

    const gestureEvents = ['pointerdown', 'keydown', 'touchstart'] as const
    function onGesture() {
      attempt()
    }
    function cleanup() {
      gestureEvents.forEach((event) => window.removeEventListener(event, onGesture))
    }

    let idleId: number | undefined
    let timeoutId: number | undefined
    if (typeof requestIdleCallback === 'function') {
      idleId = requestIdleCallback(attempt)
    } else {
      timeoutId = window.setTimeout(attempt, 200)
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
