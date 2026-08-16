import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Separate from vite.config.ts rather than merged into it: keeps the
// app's own build config free of test-only concerns, and Vitest reads
// this file directly (`vitest.config.ts` takes priority over `vite.
// config.ts` when both exist) without needing a `defineConfig` merge
// helper. Same plugins as the real app config so JSX/Tailwind-aware
// component code behaves identically under test.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // Vitest's default include pattern would otherwise also pick up
    // e2e/site.spec.ts, which imports `test`/`expect` from
    // `@playwright/test`, not this file, and needs a real browser +
    // dev server (Playwright's own `webServer`), not jsdom.
    exclude: ['node_modules/**', 'e2e/**'],
  },
})
