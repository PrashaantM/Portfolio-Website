import { defineConfig, devices } from '@playwright/test'

// This sandbox can't download Playwright's own bundled Chromium build
// for this OS (`mac13-arm64` isn't supported by the current release,
// confirmed while generating public/og-image.png in Phase 18), so every
// project here runs against the system-installed Google Chrome via
// `channel: 'chrome'` instead of the default bundled browser. A CI
// environment that *can* download the bundled build can drop the
// `channel` line and this config still works unchanged.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    // Includes the GitHub Pages base path (vite.config.ts's `base`):
    // the dev server serves the app there too, not at the domain root,
    // so a bare page.goto('/') would 404 without it.
    baseURL: 'http://localhost:5173/Portfolio-Website/',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173/Portfolio-Website/',
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
})
