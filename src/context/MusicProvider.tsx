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

    attempt()
    gestureEvents.forEach((event) => window.addEventListener(event, onGesture, { once: true }))

    return cleanup
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
