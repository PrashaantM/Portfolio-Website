export interface Track {
  id: string
  name: string
  file: string
}

// Four "Unsettling Toy-Lofi / Music Box Electronica" pieces, generated
// offline (scripts/generate-toybox-tracks.mjs) rather than hand-picked
// from the web: a found audio file always carries a licensing question
// this site cannot answer, the same reasoning that ruled out a real
// recording back when this was a single generated drone. See
// notes/phase-11.md for how each one is actually built and why these
// four read as "nostalgic yet wrong" in different ways.
export const TRACKS: Track[] = [
  { id: 'wound-down', name: 'Wound Down', file: '/audio/toybox-1-wound-down.wav' },
  { id: 'off-key-lullaby', name: 'Off-Key Lullaby', file: '/audio/toybox-2-off-key-lullaby.wav' },
  { id: 'static-bloom', name: 'Static Bloom', file: '/audio/toybox-3-static-bloom.wav' },
  { id: 'broken-carousel', name: 'Broken Carousel', file: '/audio/toybox-4-broken-carousel.wav' },
]

export interface TrackPlayer {
  play: (trackId: string) => void
  stop: () => void
  setVolume: (volume: number) => void
  /** Root-mean-square level of the current output, roughly 0-1. */
  getAmplitude: () => number
}

/**
 * A single `<audio>` element routed through Web Audio (rather than
 * played directly) so an `AnalyserNode` can still read a live
 * amplitude signal for Phase 11.2's audio-reactive visuals, the same
 * capability the old procedural engine had. Swapping tracks just
 * changes the element's `src`; `createMediaElementSource` can only be
 * called once per element, so the element, source node, and analyser
 * are all built once and reused for every track rather than torn down
 * and rebuilt on each switch.
 */
export function createTrackPlayer(): TrackPlayer {
  let ctx: AudioContext | null = null
  let audioEl: HTMLAudioElement | null = null
  let master: GainNode | null = null
  let analyser: AnalyserNode | null = null
  let dataArray: Uint8Array<ArrayBuffer> | null = null

  function ensure() {
    if (ctx && audioEl && master && analyser) {
      return { ctx, audioEl, master, analyser }
    }

    const newCtx = new AudioContext()
    const newAudio = new Audio()
    newAudio.loop = true
    newAudio.preload = 'auto'

    const source = newCtx.createMediaElementSource(newAudio)
    const newMaster = newCtx.createGain()
    newMaster.gain.value = 0.6

    const newAnalyser = newCtx.createAnalyser()
    newAnalyser.fftSize = 256
    dataArray = new Uint8Array(new ArrayBuffer(newAnalyser.frequencyBinCount))

    source.connect(newMaster).connect(newAnalyser).connect(newCtx.destination)

    ctx = newCtx
    audioEl = newAudio
    master = newMaster
    analyser = newAnalyser
    return { ctx: newCtx, audioEl: newAudio, master: newMaster, analyser: newAnalyser }
  }

  function play(trackId: string) {
    const track = TRACKS.find((candidate) => candidate.id === trackId) ?? TRACKS[0]
    const { ctx: activeCtx, audioEl: el } = ensure()
    if (activeCtx.state === 'suspended') void activeCtx.resume()

    if (!el.src.endsWith(track.file)) {
      const wasPlaying = !el.paused
      el.src = track.file
      if (wasPlaying) void el.play()
    }
    void el.play()
  }

  function stop() {
    audioEl?.pause()
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
