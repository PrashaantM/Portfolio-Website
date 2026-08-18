import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '../../lib/motion'

interface InkParticlesProps {
  active: boolean
  className?: string
  count?: number
}

interface Droplet {
  angle: number
  distance: number
  size: number
  delay: number
}

function createDroplets(count: number): Droplet[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6
    return {
      angle,
      distance: 34 + Math.random() * 54,
      size: 4 + Math.random() * 7,
      delay: Math.random() * 0.08,
    }
  })
}

/**
 * Ink droplets bursting outward from a center point and fading, the
 * Demon Slayer ink/water motif rendered as a scatter rather than
 * `InkReveal`'s wipe. Built to be triggered once, alongside
 * `SwordSlash`'s impact moment, not as an ambient loop. `active`
 * drives real React state upstream (in `Lab.tsx`), not Motion's own
 * viewport detection, since this needs to fire in a specific
 * sequence rather than independently on scroll.
 */
function InkParticles({ active, className = '', count = 18 }: InkParticlesProps) {
  const droplets = useMemo(() => createDroplets(count), [count])
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) return null

  return (
    <svg
      viewBox="-90 -90 180 180"
      width={180}
      height={180}
      className={className}
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      {/* A quick shockwave ring on top of the droplet scatter, so the
          landing moment reads as a real impact and not just particles
          drifting outward. */}
      <motion.circle
        cx={0}
        cy={0}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        initial={{ r: 4, opacity: 0 }}
        animate={active ? { r: 74, opacity: [0, 0.7, 0] } : { r: 4, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      {droplets.map((droplet, index) => {
        const x = Math.cos(droplet.angle) * droplet.distance
        const y = Math.sin(droplet.angle) * droplet.distance
        return (
          <motion.circle
            key={index}
            r={droplet.size}
            fill="var(--color-accent)"
            initial={{ cx: 0, cy: 0, opacity: 0, scale: 0.3 }}
            animate={
              active
                ? { cx: x, cy: y, opacity: [0, 1, 0], scale: 1 }
                : { cx: 0, cy: 0, opacity: 0, scale: 0.3 }
            }
            transition={{ duration: 0.9, delay: droplet.delay, ease: EASE }}
          />
        )
      })}
    </svg>
  )
}

export default InkParticles
