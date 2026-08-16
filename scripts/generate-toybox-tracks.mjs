// Renders the four "Unsettling Toy-Lofi / Music Box Electronica"
// presets (defined in scripts/gen-audio.ts) to public/audio/*.wav.
// Drives an actual browser's Web Audio OfflineAudioContext through
// Playwright rather than a Node audio library, since Node has no
// native Web Audio implementation. Run once; the output WAV files
// are what actually ships, not this script. See notes/phase-11.md.
//
// Requires the `playwright` package (not a project dependency; this
// is a one-off asset-generation tool, not something the shipped app
// needs) and the Vite dev server running at http://localhost:5199.
//
// Usage:
//   npm install --no-save playwright
//   npm run dev              # in one terminal
//   node scripts/generate-toybox-tracks.mjs   # in another

import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'
import { encodeWav } from './wav.mjs'

const SAMPLE_RATE = 22050
const DEV_SERVER = 'http://localhost:5199'
const OUT_DIR = new URL('../public/audio/', import.meta.url)

// Hardcoded rather than left to Playwright's default browser
// resolution: this machine's installed `playwright` version expects
// a newer Chromium revision than `npx playwright install` could
// actually fetch (`mac13-arm64` was reported unsupported at the time
// this was written), but an older cached revision from a previous
// Playwright install works fine. If this path does not exist,
// try `chromium.launch()` with no `executablePath` first.

const TRACKS = [
  { preset: '1', file: 'toybox-1-wound-down.wav' },
  { preset: '2', file: 'toybox-2-off-key-lullaby.wav' },
  { preset: '3', file: 'toybox-3-static-bloom.wav' },
  { preset: '4', file: 'toybox-4-broken-carousel.wav' },
]

mkdirSync(OUT_DIR, { recursive: true })

const browser = await chromium.launch({
  executablePath:
    '/Users/prashaantmudgala/Library/Caches/ms-playwright/chromium-1140/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
})

for (const track of TRACKS) {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto(`${DEV_SERVER}/scripts/gen-audio.html?preset=${track.preset}`)
  await page.waitForFunction(() => window.__done === true, { timeout: 30000 })

  if (errors.length) {
    throw new Error(`preset ${track.preset} threw: ${errors.join(', ')}`)
  }

  const samples = await page.evaluate(() => Array.from(window.__result))
  let peak = 0
  let sumSquares = 0
  let hasNaN = false
  for (const s of samples) {
    if (Number.isNaN(s)) hasNaN = true
    const abs = Math.abs(s)
    if (abs > peak) peak = abs
    sumSquares += s * s
  }
  const rms = Math.sqrt(sumSquares / samples.length)

  if (hasNaN) throw new Error(`preset ${track.preset} produced NaN samples`)
  if (peak > 1) throw new Error(`preset ${track.preset} clips: peak ${peak}`)
  if (peak < 0.02) throw new Error(`preset ${track.preset} is nearly silent: peak ${peak}`)

  const wav = encodeWav(samples, SAMPLE_RATE)
  const outPath = new URL(track.file, OUT_DIR)
  writeFileSync(outPath, wav)

  console.log(
    `${track.file}: ${samples.length} samples, peak ${peak.toFixed(3)}, rms ${rms.toFixed(3)}, ${(wav.length / 1024).toFixed(0)}KB`,
  )
  await page.close()
}

await browser.close()
console.log('done')
