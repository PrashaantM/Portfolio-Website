import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createTrackPlayer, TRACKS, type TrackPlayer } from '../lib/audio'
import { MusicContext, type MusicContextValue } from './musicContext'

/**
 * Owns the single `TrackPlayer` instance for the site (Phase 11). The
 * player itself is only constructed on first `toggle()`, not on
 * mount, since creating an `AudioContext` before a user gesture
 * triggers a browser autoplay warning, and Phase 11's own rule is
 * "do not autoplay audio by default."
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<TrackPlayer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.5)
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
      player.play(trackId)
      setIsPlaying(true)
    }
  }

  function setVolume(nextVolume: number) {
    setVolumeState(nextVolume)
    playerRef.current?.setVolume(nextVolume)
  }

  function setTrack(nextTrackId: string) {
    setTrackId(nextTrackId)
    if (isPlaying) {
      playerRef.current?.play(nextTrackId)
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
