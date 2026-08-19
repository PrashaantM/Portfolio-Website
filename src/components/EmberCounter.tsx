import { useEffect, useState } from 'react'
import { Droplets } from 'lucide-react'
import { onEmberDoused } from '../three/sceneBus'

/**
 * A playful lifetime tally of embers clicked out in the WebGL
 * background (`EmberField3D`), pure flavor with no gameplay stakes,
 * and deliberately always visible (not gated behind first use) since
 * the whole point is to tip a visitor off that the drifting embers
 * are clickable. Lives outside the Canvas: DOM text is cheaper and
 * sharper than anything Three.js would render for a HUD number, so
 * `sceneBus` bridges the two, the same pattern `ClickBurst3D` uses
 * for `emitClick`.
 *
 * `pointer-events-none` because this is a fixed, always-on-top
 * overlay with no click handler of its own, and at narrow widths it
 * can visually sit over whatever scrolls underneath it (a project
 * card's "How it works" button, most concretely). Without this, that
 * overlap would silently swallow the click instead of passing it
 * through to the real button underneath.
 */
function EmberCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    return onEmberDoused(() => setCount((current) => current + 1))
  }, [])

  return (
    <div
      role="region"
      aria-label="Ember counter"
      // Pure flavor (see the file-level comment above), so on phones it's
      // hidden rather than repositioned: fixed at top-20/right-4, it sits
      // right where a jump-scrolled section heading lands (scroll-margin-top
      // matches the navbar height), and collides with headings that wrap to
      // two lines on a narrow screen, e.g. Projects' "Architecture Deep
      // Dive: MCQ Exam Management Platform". It also has no z-index
      // priority over the open mobile-nav dropdown, so it visibly
      // disappears/reappears as that opens and closes. Hidden below `sm`
      // (portrait) and in phone-landscape (667-932px wide, so `sm:` alone
      // wouldn't reach it) rather than chasing a new safe position for a
      // decorative badge with "no gameplay stakes" per its own author.
      className="border-border bg-surface/95 rounded-(--radius-card) pointer-events-none fixed top-20 right-4 z-40 flex items-center gap-2 border px-2 py-1.5 font-mono text-[10px] shadow-lg backdrop-blur max-sm:hidden phone-landscape:hidden sm:right-6 sm:px-3 sm:py-2 sm:text-xs"
      aria-live="polite"
    >
      <Droplets size={14} className="text-accent" aria-hidden="true" />
      <span className="text-text-primary">EMBERS DOUSED</span>
      <span className="text-text-primary tabular-nums">{count}</span>
    </div>
  )
}

export default EmberCounter
