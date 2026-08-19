#!/usr/bin/env node
// GitHub Pages only serves static files, so there's no request-time
// server to render this SPA on - a crawler or link-preview bot that
// doesn't execute JS just gets dist/index.html's empty <div id="root">.
// This runs once after `vite build`: boot a local preview server
// against the just-built dist/, let the app fully mount in a real
// headless browser (same channel: 'chrome' pattern as
// generate-og-image.mjs, needed because this sandbox can't download
// Playwright's own Chromium build), then overwrite dist/index.html
// with that rendered DOM. The client bundle itself is untouched - real
// visitors still get the exact same interactive SPA, and `createRoot`
// (src/main.tsx isn't using `hydrateRoot`) just replaces this prerendered
// markup on mount. Anyone fetching the raw HTML without running JS now
// sees the real page instead.
import { preview } from 'vite'
import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const distIndexPath = fileURLToPath(new URL('../dist/index.html', import.meta.url))

const server = await preview({ preview: { port: 4174, strictPort: true } })
const url = server.resolvedUrls.local[0]

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
// Confirms the app actually mounted and rendered rather than just
// confirming the network went quiet.
await page.waitForSelector('#hero h1')
await page.evaluate(() => document.fonts.ready)

const html = await page.content()
await writeFile(distIndexPath, html)
console.log(`Prerendered ${distIndexPath}`)

await browser.close()
await new Promise((resolve, reject) => server.httpServer.close((err) => (err ? reject(err) : resolve())))
