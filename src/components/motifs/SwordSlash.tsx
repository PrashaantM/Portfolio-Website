import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Sword from './Sword'
import InkParticles from './InkParticles'

interface SwordSlashProps {
  className?: string
}

/**
 * The Lab section's entrance: a sword slashes across, then ink
 * particles burst at the point it "lands", timed to land just before
 * `InkReveal` wipes the heading in next to it. Three of this round's
 * requested pieces (an original sword image, a sword-slash animation,
 * ink particles) working as one sequence rather than three
 * disconnected additions.
 *
 * Deliberately animates only plain numeric `x`/`y`/`opacity` values,
 * not percentage strings or anything like `clipPath`. `notes/
 * phase-13.md` documents a real bug in this project's Motion version
 * where a "complex" string-valued animation silently never plays when
 * triggered by an IntersectionObserver-driven state change; numeric
 * transforms never showed that problem under any trigger, so this
 * stays inside that proven-safe territory rather than risking a
 * repeat.
 */
function SwordSlash({ className = '' }: SwordSlashProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(containerRef, { once: !!shouldReduceMotion, amount: 0.4 })
  const [showImpact, setShowImpact] = useState(false)

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      setShowImpact(false)
      return
    }
    const timer = setTimeout(() => setShowImpact(true), 480)
    return () => clearTimeout(timer)
  }, [isInView, shouldReduceMotion])

  if (shouldReduceMotion) {
    return null
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none relative h-20 ${className}`}
    >
      {/* Only the sword's own off-screen-to-off-screen travel needs
          clipping (it starts and ends well past this container's
          edges). Scoped to this inner wrapper rather than the whole
          component: the ink burst below needs to render past this
          same h-20 box without being cut off by it. */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ rotate: -26 }}
          initial={{ x: -520, y: -60, opacity: 0 }}
          animate={
            isInView
              ? { x: 520, y: 60, opacity: [0, 1, 1, 0] }
              : { x: -520, y: -60, opacity: 0 }
          }
          transition={{ duration: 0.55, ease: [0.6, 0, 0.85, 0.2] }}
        >
          <Sword size={180} bladeColor="var(--color-text-primary)" />
        </motion.div>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <InkParticles active={showImpact} />
      </div>
    </div>
  )
}

export default SwordSlash
