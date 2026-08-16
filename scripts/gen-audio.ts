// Generation-time only: renders one of four "Unsettling Toy-Lofi /
// Music Box Electronica" presets to raw PCM via OfflineAudioContext,
// driven by scripts/generate-toybox-tracks.mjs through Playwright.
// Not part of the shipped app.

const SAMPLE_RATE = 22050
const DURATION = 17

function noteFreq(semitonesFromA4: number): number {
  return 440 * Math.pow(2, semitonesFromA4 / 12)
}

interface NoteOptions {
  duration?: number
  detuneCents?: number
  gain?: number
  brightness?: number
}

function scheduleNote(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  freq: number,
  { duration = 1.1, detuneCents = 0, gain = 0.28, brightness = 3200 }: NoteOptions = {},
) {
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = freq
  osc.detune.value = detuneCents

  // A quiet upper partial for the bell-like "shimmer" real music boxes have.
  const shimmer = ctx.createOscillator()
  shimmer.type = 'triangle'
  shimmer.frequency.value = freq * 2.01
  shimmer.detune.value = detuneCents

  const env = ctx.createGain()
  env.gain.setValueAtTime(0, time)
  env.gain.linearRampToValueAtTime(gain, time + 0.008)
  env.gain.exponentialRampToValueAtTime(0.0001, time + duration)

  const shimmerEnv = ctx.createGain()
  shimmerEnv.gain.setValueAtTime(0, time)
  shimmerEnv.gain.linearRampToValueAtTime(gain * 0.22, time + 0.008)
  shimmerEnv.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.55)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = brightness

  osc.connect(env).connect(filter)
  shimmer.connect(shimmerEnv).connect(filter)
  filter.connect(dest)

  osc.start(time)
  osc.stop(time + duration + 0.15)
  shimmer.start(time)
  shimmer.stop(time + duration + 0.15)
}

function bitcrushCurve(steps: number): Float32Array {
  const n = 1024
  const curve = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1
    curve[i] = Math.round(x * steps) / steps
  }
  return curve
}

function fadeEnvelope(ctx: BaseAudioContext, master: GainNode) {
  master.gain.setValueAtTime(0, 0)
  master.gain.linearRampToValueAtTime(1, 0.6)
  master.gain.setValueAtTime(1, DURATION - 1.2)
  master.gain.linearRampToValueAtTime(0, DURATION - 0.05)
}

// Preset 1: "Wound Down". A five-note descending phrase that repeats
// with a growing gap between repetitions, as if a wind-up spring is
// running out of tension. Small random per-note detune. Heavily
// muffled (a low lowpass ceiling everywhere).
function buildWoundDown(ctx: BaseAudioContext, master: GainNode) {
  const phrase = [0, -4, -7, -9, -12] // A4, F4, D4, C4, A3
  let t = 0.8
  let gap = 0.42
  while (t < DURATION - 2) {
    for (const semi of phrase) {
      scheduleNote(ctx, master, t, noteFreq(semi), {
        duration: 1.0,
        detuneCents: (Math.random() - 0.5) * 22,
        brightness: 1600,
        gain: 0.3,
      })
      t += gap
    }
    gap *= 1.22 // each pass through the phrase drags a little more
    t += gap * 0.5
  }
}

// Preset 2: "Off-Key Lullaby". A simple, familiar-feeling seven-note
// phrase at a steady tempo, except the third note is consistently
// detuned flat every repetition, not randomly. A slow modulated delay
// gives it a faint, sickly wobble.
function buildOffKeyLullaby(ctx: BaseAudioContext, master: GainNode) {
  const phrase = [-3, 0, 2, 0, -3, -5, -7] // E4 G4 A4 G4 E4 D4 C4
  const wrongIndex = 2 // the "A4" lands flat every time
  const step = 0.56
  let t = 0.8
  while (t < DURATION - 2) {
    phrase.forEach((semi, i) => {
      scheduleNote(ctx, master, t, noteFreq(semi), {
        duration: 0.85,
        detuneCents: i === wrongIndex ? -55 : (Math.random() - 0.5) * 6,
        brightness: 2600,
        gain: 0.27,
      })
      t += step
    })
  }
}

// Preset 3: "Static Bloom". Sparse, isolated bell tones from a loose
// pentatonic set at irregular intervals, no real melody, run through
// a bitcrusher and a slapback delay for a hazy, haunted texture.
function buildStaticBloom(ctx: BaseAudioContext, master: GainNode) {
  const scale = [0, -3, -5, -7, -10, -12, -15]
  const shaper = ctx.createWaveShaper()
  shaper.curve = bitcrushCurve(10)
  const post = ctx.createBiquadFilter()
  post.type = 'lowpass'
  post.frequency.value = 1200

  const delay = ctx.createDelay(1)
  delay.delayTime.value = 0.29
  const feedback = ctx.createGain()
  feedback.gain.value = 0.36
  const wet = ctx.createGain()
  wet.gain.value = 0.5

  shaper.connect(post)
  post.connect(master)
  post.connect(delay)
  delay.connect(feedback).connect(delay)
  delay.connect(wet).connect(master)

  let t = 1
  while (t < DURATION - 2) {
    const semi = scale[Math.floor(Math.random() * scale.length)]
    scheduleNote(ctx, shaper, t, noteFreq(semi), {
      duration: 1.8,
      detuneCents: (Math.random() - 0.5) * 16,
      brightness: 1400,
      gain: 0.3,
    })
    t += 1.4 + Math.random() * 1.8
  }
}

// Preset 4: "Broken Carousel". A cheerful major-triad arpeggio at a
// bouncy tempo, undercut by a slow LFO-modulated delay (a wow/flutter
// tape-warp effect) and periodic brief silences that simulate a
// skipping mechanism.
function buildBrokenCarousel(ctx: BaseAudioContext, master: GainNode) {
  const arpUp = [-9, -5, -2, 3] // A3, C4/E-ish arpeggio (A minor-leaning triad + octave color)
  const arp = [...arpUp, ...arpUp.slice(0, -1).reverse()]

  const delay = ctx.createDelay(1)
  delay.delayTime.value = 0.02
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.16
  const lfoDepth = ctx.createGain()
  lfoDepth.gain.value = 0.006
  lfo.connect(lfoDepth).connect(delay.delayTime)
  lfo.start(0)

  const dry = ctx.createGain()
  dry.gain.value = 0.7
  const wet = ctx.createGain()
  wet.gain.value = 0.6

  master.connect(dry)
  master.connect(delay)
  delay.connect(wet)

  const skipGain = ctx.createGain()
  skipGain.gain.setValueAtTime(1, 0)
  let skipTime = 4.5
  while (skipTime < DURATION - 1) {
    skipGain.gain.setValueAtTime(1, skipTime - 0.02)
    skipGain.gain.linearRampToValueAtTime(0, skipTime)
    skipGain.gain.setValueAtTime(0, skipTime + 0.18)
    skipGain.gain.linearRampToValueAtTime(1, skipTime + 0.22)
    skipTime += 4.2 + Math.random() * 2
  }
  dry.connect(skipGain)
  wet.connect(skipGain)

  let t = 0.6
  const step = 0.24
  let i = 0
  while (t < DURATION - 1.5) {
    const semi = arp[i % arp.length]
    scheduleNote(ctx, master, t, noteFreq(semi), {
      duration: 0.42,
      detuneCents: (Math.random() - 0.5) * 8,
      brightness: 3600,
      gain: 0.24,
    })
    t += step
    i += 1
  }

  return skipGain
}

async function render() {
  const params = new URLSearchParams(window.location.search)
  const preset = params.get('preset')
  const ctx = new OfflineAudioContext(1, SAMPLE_RATE * DURATION, SAMPLE_RATE)
  const master = ctx.createGain()

  if (preset === '1') {
    buildWoundDown(ctx, master)
    master.connect(ctx.destination)
  } else if (preset === '2') {
    buildOffKeyLullaby(ctx, master)
    master.connect(ctx.destination)
  } else if (preset === '3') {
    buildStaticBloom(ctx, master)
    master.connect(ctx.destination)
  } else if (preset === '4') {
    const skipGain = buildBrokenCarousel(ctx, master)
    skipGain.connect(ctx.destination)
  } else {
    throw new Error(`unknown preset ${preset}`)
  }

  fadeEnvelope(ctx, master)

  const buffer = await ctx.startRendering()
  const data = buffer.getChannelData(0)
  ;(window as unknown as { __result: Float32Array }).__result = data
  ;(window as unknown as { __done: boolean }).__done = true
}

render()
