/**
 * Fixed, full-viewport background layer sitting behind all content:
 * the base color (set on `body` in base.css) plus the grid and noise
 * motifs. Both motifs are already tuned to be faint on their own (see
 * motifs.css) so they read as texture rather than decoration. Not
 * interactive, so it's hidden from screen readers and never
 * intercepts clicks.
 */
function Background() {
  return (
    <div
      aria-hidden="true"
      className="bg-grid bg-noise pointer-events-none fixed inset-0 -z-10"
    />
  )
}

export default Background
