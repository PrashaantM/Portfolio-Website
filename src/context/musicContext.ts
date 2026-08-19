import { createContext, useContext } from 'react'

// Shape of the site's background-music API: current playback state
// (isPlaying, volume, trackId) plus the actions to control it (toggle,
// setVolume, setTrack) and a way to read live amplitude for
// audio-reactive visuals.
export interface MusicContextValue {
  isPlaying: boolean
  volume: number
  trackId: string
  toggle: () => void
  setVolume: (volume: number) => void
  setTrack: (trackId: string) => void
  /** Reads the engine's current amplitude directly, not through React
   *  state, so a 60fps-reading consumer (ParticleField, the toggle's
   *  own level bars) doesn't force this provider's whole subtree to
   *  re-render every frame. Callers poll it inside their own
   *  requestAnimationFrame loop. */
  getAmplitude: () => number
}

// Split into its own plain .ts module (not the .tsx file that defines
// MusicProvider) so this file exports only the context object and the
// hook, no component. oxlint's react-refresh rule flags any file that
// mixes component and non-component exports, since Fast Refresh can't
// reliably hot-reload those.
export const MusicContext = createContext<MusicContextValue | null>(null)

// Consumed via useMusic() by MusicToggle (the play/pause and track
// picker UI) and ParticleField (reads getAmplitude() for audio-reactive
// particles). MusicProvider.tsx is the provider that supplies the value.
export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}
