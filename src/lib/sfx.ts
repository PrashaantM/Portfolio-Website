/**
 * Phase 15's interaction sound effects: ink-splash, high-tech click,
 * and nav-transition whoosh. Same "no sourced audio" rule as the
 * background tracks (see notes/phase-11.md) applies here too, so every
 * sound is synthesized. Unlike the background tracks these are built
 * in real time on a shared `AudioContext` rather than pre-rendered
 * offline, since they're one-shots triggered on demand rather than
 * static loopable files worth comparing ahead of time.
 *
 * Every exported function here is only ever called from inside a real
 * click handler (InteractionEffects, Navbar), which is itself a user
 * gesture, so constructing/resuming the `AudioContext` here never hits
 * the autoplay restriction `MusicProvider` has to work around.
 */

let sfxCtx: AudioContext | null = null
const SFX_VOLUME = 0.28

function getCtx(): AudioContext {
  if (!sfxCtx) sfxCtx = new AudioContext()
  if (sfxCtx.state === 'suspended') void sfxCtx.resume()
  return sfxCtx
}

function noiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

/** Attack/decay envelope on a gain node, scheduled from `startTime` rather than `ctx.currentTime` so multiple layered sounds can be offset from one shared reference. */
function envelope(gain: GainNode, startTime: number, attack: number, decay: number, peak: number) {
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(peak, startTime + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + attack + decay)
}

function master(ctx: AudioContext): GainNode {
  const gain = ctx.createGain()
  gain.gain.value = SFX_VOLUME
  gain.connect(ctx.destination)
  return gain
}

/** Filtered noise "splash" body plus a descending pitch "drip" on top, for a click on empty space. */
export function playInkSplash() {
  const ctx = getCtx()
  const now = ctx.currentTime
  const out = master(ctx)

  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer(ctx, 0.35)
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 0.7
  filter.frequency.setValueAtTime(1800, now)
  filter.frequency.exponentialRampToValueAtTime(300, now + 0.3)
  const noiseGain = ctx.createGain()
  envelope(noiseGain, now, 0.005, 0.32, 0.7)
  noise.connect(filter).connect(noiseGain).connect(out)
  noise.start(now)
  noise.stop(now + 0.4)

  const drip = ctx.createOscillator()
  drip.type = 'sine'
  drip.frequency.setValueAtTime(900, now)
  drip.frequency.exponentialRampToValueAtTime(180, now + 0.25)
  const dripGain = ctx.createGain()
  envelope(dripGain, now, 0.005, 0.22, 0.5)
  drip.connect(dripGain).connect(out)
  drip.start(now)
  drip.stop(now + 0.3)
}

/** A short sweeping square blip plus a quiet confirm tick, for a click on a real button/link. */
export function playHighTechClick() {
  const ctx = getCtx()
  const now = ctx.currentTime
  const out = master(ctx)

  const sweep = ctx.createOscillator()
  sweep.type = 'square'
  sweep.frequency.setValueAtTime(1200, now)
  sweep.frequency.exponentialRampToValueAtTime(400, now + 0.07)
  const sweepFilter = ctx.createBiquadFilter()
  sweepFilter.type = 'lowpass'
  sweepFilter.frequency.value = 4000
  const sweepGain = ctx.createGain()
  envelope(sweepGain, now, 0.002, 0.08, 0.22)
  sweep.connect(sweepFilter).connect(sweepGain).connect(out)
  sweep.start(now)
  sweep.stop(now + 0.1)

  const tick = ctx.createOscillator()
  tick.type = 'square'
  tick.frequency.value = 2200
  const tickGain = ctx.createGain()
  envelope(tickGain, now + 0.08, 0.001, 0.04, 0.12)
  tick.connect(tickGain).connect(out)
  tick.start(now + 0.08)
  tick.stop(now + 0.13)
}

/** A rising noise whoosh plus a punchy low sine "boom", for the nav-bar transition burst. */
export function playNavSlash() {
  const ctx = getCtx()
  const now = ctx.currentTime
  const out = master(ctx)

  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer(ctx, 0.5)
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 0.9
  filter.frequency.setValueAtTime(200, now)
  filter.frequency.exponentialRampToValueAtTime(3000, now + 0.35)
  const noiseGain = ctx.createGain()
  envelope(noiseGain, now, 0.05, 0.4, 0.45)
  noise.connect(filter).connect(noiseGain).connect(out)
  noise.start(now)
  noise.stop(now + 0.5)

  const boom = ctx.createOscillator()
  boom.type = 'sine'
  boom.frequency.setValueAtTime(90, now + 0.05)
  boom.frequency.exponentialRampToValueAtTime(40, now + 0.35)
  const boomGain = ctx.createGain()
  envelope(boomGain, now + 0.05, 0.01, 0.35, 0.8)
  boom.connect(boomGain).connect(out)
  boom.start(now + 0.05)
  boom.stop(now + 0.45)
}
