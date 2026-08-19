import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import InkParticles from './InkParticles'

interface SwordSlashProps {
  className?: string
}

const BASE = import.meta.env.BASE_URL
const SWORD_IMAGES = [
  `${BASE}images/swords/sword1.png`,
  `${BASE}images/swords/sword2.png`,
  `${BASE}images/swords/zangetsu.png`,
]

// Module-level, not component state: every `SwordSlash` instance on
// the page (Projects, Lab, Contact, Experience, Interests, About,
// Skills all render one) pulls from this same running counter, so the
// sword you see is a different one than the last section's, cycling
// 1-2-3-1-2-3 down the whole page rather than each instance
// independently defaulting back to the same first image.
let swordCycleIndex = 0
function nextSwordImage() {
  const image = SWORD_IMAGES[swordCycleIndex % SWORD_IMAGES.length]
  swordCycleIndex += 1
  return image
}

const SLASH_DURATION_SECONDS = 0.5
// Impact/ink-burst lands at the same fraction of the way through the
// swing as before the duration changed (0.48s into the old 0.55s total).
const IMPACT_DELAY_MS = Math.round((SLASH_DURATION_SECONDS * 1000 * 0.48) / 0.55)

/**
 * The Lab section's entrance: a sword slashes across, then ink
 * particles burst at the point it "lands", timed to land just before
 * `InkReveal` wipes the heading in next to it. An original sword
 * image, a sword-slash animation, and ink particles working as one
 * sequence rather than three disconnected pieces.
 *
 * The slashing sword itself is one of three real, user-supplied
 * artworks in `SWORD_IMAGES`, picked fresh via `nextSwordImage()` at
 * the instant each slash starts so it alternates rather than always
 * drawing the same one. The `motion.div`'s x/y/opacity/rotate path
 * stays plain numeric values (`halfViewportWidth` is a number
 * computed once, not a percentage string, and nothing here uses
 * `clipPath`), because this project's Motion version has a real bug
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
  const [swordImage, setSwordImage] = useState(SWORD_IMAGES[0])
  // Read once: how far the sword has to travel to reach the actual
  // screen edges rather than just this section's (narrower, centered)
  // container. Paired with the full-bleed wrapper below, whose own
  // `left-1/2` resolves to the viewport's center, not the container's.
  const [halfViewportWidth] = useState(() => (typeof window === 'undefined' ? 520 : window.innerWidth / 2))

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      setShowImpact(false)
      return
    }
    setSwordImage(nextSwordImage())
    const timer = setTimeout(() => setShowImpact(true), IMPACT_DELAY_MS)
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
      {/* Full-bleed: breaks out of this section's centered, max-width
          container to span the actual browser viewport edge-to-edge
          (the standard `left-1/2` + negative `50vw` margin trick),
          rather than clipping to a section that's usually narrower
          than the screen. `Container` centers every section in the
          viewport, so this wrapper's own horizontal center still lines
          up with the sword's travel and the ink burst below. Extended
          well beyond the visible h-20 band vertically (the outer
          container stays h-20 for the section's own spacing) since
          these are full sword illustrations, tall enough that the old
          thin SVG silhouette's tight band would clip them mid-swing. */}
      <div className="absolute left-1/2 -ml-[50vw] w-screen -top-32 -bottom-32 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ rotate: -26 }}
          initial={{ x: -halfViewportWidth, y: -60, opacity: 0 }}
          animate={
            isInView
              ? { x: halfViewportWidth, y: 60, opacity: [0, 1, 1, 0] }
              : { x: -halfViewportWidth, y: -60, opacity: 0 }
          }
          transition={{ duration: SLASH_DURATION_SECONDS, ease: [0.6, 0, 0.85, 0.2] }}
        >
          <img src={swordImage} alt="" draggable={false} loading="lazy" className="h-32 w-auto select-none" />
        </motion.div>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <InkParticles active={showImpact} />
      </div>
    </div>
  )
}

export default SwordSlash
