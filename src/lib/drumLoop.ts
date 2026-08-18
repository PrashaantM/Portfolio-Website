export interface DrumLoop {
  start: () => void
  stop: () => void
}

// 140 BPM: measured directly off the mysterious track's own onset
// envelope (autocorrelation on its RMS energy landed on ~139.7 BPM),
// and squarely in the tempo range trap production normally sits in
// anyway, which is the best available anchor for the dark track too -
// it is too short a clip (under 8 seconds) for the same measurement to
// come back reliable. Deliberately just kick, snare/clap, and hihat -
// a plain, steady pulse reads as "a simple beat underneath" regardless
// of whether it happens to land exactly on either melody's downbeat,
// where a busier, syncopated pattern would only sound compatible if
// perfectly phase-locked to audio this code never actually analyzes
// sample-by-sample.
const BPM = 140
const STEPS_PER_BAR = 16
const STEP_DURATION = 60 / BPM / 4
const KICK_STEPS = new Set([0, 8])
const SNARE_STEPS = new Set([4, 12])
const HAT_STEPS = new Set([0, 2, 4, 6, 8, 10, 12, 14])

// How far ahead notes get scheduled, and how often the scheduler
// wakes up to top that window back up. The classic "A Tale of Two
// Clocks" pattern (Chris Wilson): a `setInterval` alone drifts and
// jitters enough to hear, so the interval's only job is to keep
// re-arming precise, sample-accurate `AudioContext`-clocked start
// times slightly ahead of playback rather than driving playback
// directly.
const LOOKAHEAD_SECONDS = 0.15
const SCHEDULER_INTERVAL_MS = 30

function playKick(ctx: AudioContext, destination: AudioNode, time: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(150, time)
  osc.frequency.exponentialRampToValueAtTime(48, time + 0.13)
  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(1, time + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32)
  osc.connect(gain).connect(destination)
  osc.start(time)
  osc.stop(time + 0.34)
}

function playSnare(ctx: AudioContext, destination: AudioNode, noiseBuffer: AudioBuffer, time: number) {
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer
  const bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 1800
  bandpass.Q.value = 0.6
  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.0001, time)
  noiseGain.gain.exponentialRampToValueAtTime(0.5, time + 0.005)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.16)
  noise.connect(bandpass).connect(noiseGain).connect(destination)
  noise.start(time)
  noise.stop(time + 0.18)

  // A short tonal body under the noise band, so the hit reads as a
  // snare/clap rather than just a burst of hiss.
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(190, time)
  oscGain.gain.setValueAtTime(0.0001, time)
  oscGain.gain.exponentialRampToValueAtTime(0.35, time + 0.005)
  oscGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.1)
  osc.connect(oscGain).connect(destination)
  osc.start(time)
  osc.stop(time + 0.12)
}

function playHat(ctx: AudioContext, destination: AudioNode, noiseBuffer: AudioBuffer, time: number) {
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer
  const highpass = ctx.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 8000
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(0.16, time + 0.003)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045)
  noise.connect(highpass).connect(gain).connect(destination)
  noise.start(time)
  noise.stop(time + 0.05)
}

/**
 * A from-scratch kick/snare/hihat loop, synthesized rather than a
 * sample: nothing licensed to clear, and it means the "suitable simple
 * drum beat" the site asked for costs zero additional network bytes.
 * Runs into whatever `destination` node the caller hands it (Phase
 * 15.2's `drumGain`, mixed alongside the melody into the same master
 * bus in `audio.ts`), independent of which of the two trap tracks is
 * currently playing - it just keeps going underneath either one.
 */
export function createDrumLoop(ctx: AudioContext, destination: AudioNode): DrumLoop {
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const noiseData = noiseBuffer.getChannelData(0)
  for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1

  let nextStepTime = 0
  let currentStep = 0
  let timerId: number | null = null

  function scheduleStep(step: number, time: number) {
    if (KICK_STEPS.has(step)) playKick(ctx, destination, time)
    if (SNARE_STEPS.has(step)) playSnare(ctx, destination, noiseBuffer, time)
    if (HAT_STEPS.has(step)) playHat(ctx, destination, noiseBuffer, time)
  }

  function scheduler() {
    while (nextStepTime < ctx.currentTime + LOOKAHEAD_SECONDS) {
      scheduleStep(currentStep, nextStepTime)
      nextStepTime += STEP_DURATION
      currentStep = (currentStep + 1) % STEPS_PER_BAR
    }
  }

  function start() {
    if (timerId !== null) return
    currentStep = 0
    nextStepTime = ctx.currentTime + 0.1
    scheduler()
    timerId = window.setInterval(scheduler, SCHEDULER_INTERVAL_MS)
  }

  function stop() {
    if (timerId !== null) {
      window.clearInterval(timerId)
      timerId = null
    }
  }

  return { start, stop }
}
