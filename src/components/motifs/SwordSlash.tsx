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

/**
 * The Lab section's entrance: a sword slashes across, then ink
 * particles burst at the point it "lands", timed to land just before
 * `InkReveal` wipes the heading in next to it. Three of this round's
 * requested pieces (an original sword image, a sword-slash animation,
 * ink particles) working as one sequence rather than three
 * disconnected additions.
 *
 * The slashing sword itself is one of the three real, user-supplied
 * artworks in `SWORD_IMAGES` (an SVG placeholder before this), picked
 * fresh via `nextSwordImage()` at the instant each slash starts so it
 * alternates rather than always drawing the same one. The choreography
 * around it - the `motion.div`'s x/y/opacity/rotate path and timing -
 * is untouched: deliberately still only plain numeric values, not
 * percentage strings or anything like `clipPath`. `notes/phase-13.md`
 * documents a real bug in this project's Motion version where a
 * "complex" string-valued animation silently never plays when
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

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      setShowImpact(false)
      return
    }
    setSwordImage(nextSwordImage())
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
          same h-20 box without being cut off by it. Extended well
          beyond the visible h-20 band vertically (the outer container
          stays h-20 for the section's own spacing) since these are
          full sword illustrations, tall enough that the old thin SVG
          silhouette's tight band would clip them mid-swing. */}
      <div className="absolute inset-x-0 -top-32 -bottom-32 overflow-hidden">
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
