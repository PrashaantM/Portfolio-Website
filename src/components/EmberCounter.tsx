import { useEffect, useState } from 'react'
import { Droplets } from 'lucide-react'
import { onEmberDoused } from '../three/sceneBus'

/**
 * A playful lifetime tally of embers clicked out in the WebGL
 * background (`EmberField3D`) — pure flavor, no gameplay stakes, and
 * deliberately always visible (not gated behind first use) since the
 * whole point is to tip a visitor off that the drifting embers are
 * clickable. Lives outside the Canvas: DOM text is cheaper and sharper
 * than anything Three.js would render for a HUD number, so `sceneBus`
 * bridges the two, the same pattern `ClickBurst3D` uses for `emitClick`.
 */
function EmberCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    return onEmberDoused(() => setCount((current) => current + 1))
  }, [])

  return (
    <div
      className="border-border bg-surface/95 rounded-(--radius-card) fixed top-20 right-4 z-40 flex items-center gap-2 border px-3 py-2 font-mono text-xs shadow-lg backdrop-blur sm:right-6"
      aria-live="polite"
    >
      <Droplets size={14} className="text-accent" aria-hidden="true" />
      <span className="text-text-primary">EMBERS DOUSED</span>
      <span className="text-accent tabular-nums">{count}</span>
    </div>
  )
}

export default EmberCounter
