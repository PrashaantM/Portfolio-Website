export interface HeartbeatLoop {
  start: () => void
  stop: () => void
}

// Two low thumps ("lub-dub") close together, then a long quiet gap before
// the next pair, with the gap length randomized each time rather than
// fixed. That randomized sparseness is deliberate: it reads as an
// occasional pulse under a track rather than a musical beat or drum
// pattern.
const LUB_DUB_GAP_SECONDS = 0.28
const MIN_INTERVAL_SECONDS = 2.6
const MAX_INTERVAL_SECONDS = 4.4
const SCHEDULE_AHEAD_SECONDS = 0.05

function playThump(ctx: AudioContext, destination: AudioNode, time: number, peakGain: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(72, time)
  osc.frequency.exponentialRampToValueAtTime(38, time + 0.22)
  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(peakGain, time + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.4)
  osc.connect(gain).connect(destination)
  osc.start(time)
  osc.stop(time + 0.42)
}

/**
 * A from-scratch "lub-dub" heartbeat, synthesized with oscillators rather
 * than a sample so there is no licensed audio to clear. Runs into whatever
 * `destination` node the caller hands it (`audio.ts` passes its own
 * `heartbeatGain`, mixed into the same master bus as the melody),
 * independent of which of the two tracks is currently playing.
 *
 * Re-arms itself with `setTimeout` after every beat using a freshly
 * randomized interval, rather than `setInterval` on a fixed period, since
 * the irregular gap between beats is the point.
 */
export function createHeartbeatLoop(ctx: AudioContext, destination: AudioNode): HeartbeatLoop {
  let running = false
  let timeoutId: number | null = null

  function beat() {
    if (!running) return
    const time = ctx.currentTime + SCHEDULE_AHEAD_SECONDS
    playThump(ctx, destination, time, 0.55)
    playThump(ctx, destination, time + LUB_DUB_GAP_SECONDS, 0.32)
    const interval = MIN_INTERVAL_SECONDS + Math.random() * (MAX_INTERVAL_SECONDS - MIN_INTERVAL_SECONDS)
    timeoutId = window.setTimeout(beat, interval * 1000)
  }

  function start() {
    if (running) return
    running = true
    beat()
  }

  function stop() {
    running = false
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return { start, stop }
}
