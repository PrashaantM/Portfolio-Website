#!/usr/bin/env node
// Phase 18: renders scripts/og-image.html (dark background, the same
// Seal emblem and palette Hero uses, self-hosted fonts loaded from the
// actual @fontsource-variable files already in node_modules) to
// public/og-image.png at the standard 1200x630 social-preview size.
// Same generate-with-a-real-browser approach Phase 11 already used for
// audio (`scripts/generate-toybox-tracks.mjs`): `@playwright/test` is a
// real devDependency as of Phase 20's test suite, not an ad-hoc
// --no-save install, so this just reuses it rather than installing a
// second copy.
import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const htmlPath = fileURLToPath(new URL('./og-image.html', import.meta.url))
const outPath = fileURLToPath(new URL('../public/og-image.png', import.meta.url))

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto(`file://${htmlPath}`)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: outPath })
await browser.close()

console.log(`Wrote ${outPath}`)
