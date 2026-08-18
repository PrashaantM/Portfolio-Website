import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves a project repo (not a <user>.github.io repo)
  // from a subpath matching the repo name, not the domain root, so
  // every asset URL needs that prefix. Vite rewrites index.html's own
  // script/link/img references automatically, but anything built as a
  // plain string at runtime (audio file paths, the resume link, the
  // crow sprite texture) doesn't go through that pipeline and reads
  // `import.meta.env.BASE_URL` directly instead - see those call sites.
  base: '/Portfolio-Website/',
})
