export interface DrumLoop {
  start: () => void
  stop: () => void
}

// A plain, steady 100 BPM pulse - deliberately not tied to either
// track's own tempo. The previous version tried to match the
// mysterious track's measured ~140 BPM with a syncopated
// kick/snare/hihat pattern, which needed real phase alignment with
// the song to actually sound "with" it rather than fighting it, and
// this code has no way to detect that alignment. A slow, simple kick
// with a soft off-beat hihat accent doesn't have that problem: it
// reads as ambient rhythmic texture under a track, not a competing
// drum pattern, regardless of exactly where it happens to land.
const BPM = 100
const BEAT_SECONDS = 60 / BPM
const SCHEDULE_AHEAD_SECONDS = 0.05

function playKick(ctx: AudioContext, destination: AudioNode, time: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(120, time)
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.15)
  gain.gain.setValueAtTime(0.6, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3)
  osc.connect(gain).connect(destination)
  osc.start(time)
  osc.stop(time + 0.32)
}

function playHat(ctx: AudioContext, noiseBuffer: AudioBuffer, destination: AudioNode, time: number) {
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer
  const highpass = ctx.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 7000
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.12, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05)
  noise.connect(highpass).connect(gain).connect(destination)
  noise.start(time)
  noise.stop(time + 0.06)
}

/**
 * A from-scratch kick-and-hihat pulse, synthesized rather than a
 * sample: nothing licensed to clear, and it means the "simple drum
 * beat" the site asked for costs zero additional network bytes.
 * Deliberately just two sounds and a plain on-beat/off-beat pattern -
 * simpler than a real drum loop needs to be, on purpose, so it reads
 * as a steady pulse under either trap track rather than a pattern
 * that has to line up with one to make sense. Runs into whatever
 * `destination` node the caller hands it (`audio.ts`'s `drumGain`,
 * mixed into the same master bus as the melody), independent of which
 * of the two tracks is currently playing.
 *
 * Scheduled with `setInterval` calling straight back into
 * `ctx.currentTime` on every tick, rather than a lookahead scheduler
 * accumulating its own running clock: one less place for a stuck or
 * drifting time value to silently stop scheduling anything.
 */
export function createDrumLoop(ctx: AudioContext, destination: AudioNode): DrumLoop {
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const noiseData = noiseBuffer.getChannelData(0)
  for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1

  let beatCount = 0
  let intervalId: number | null = null

  function tick() {
    const time = ctx.currentTime + SCHEDULE_AHEAD_SECONDS
    playKick(ctx, destination, time)
    if (beatCount % 2 === 1) {
      playHat(ctx, noiseBuffer, destination, time + BEAT_SECONDS / 2)
    }
    beatCount += 1
  }

  function start() {
    if (intervalId !== null) return
    beatCount = 0
    tick()
    intervalId = window.setInterval(tick, BEAT_SECONDS * 1000)
  }

  function stop() {
    if (intervalId !== null) {
      window.clearInterval(intervalId)
      intervalId = null
    }
  }

  return { start, stop }
}
