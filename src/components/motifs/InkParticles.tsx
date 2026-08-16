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
      distance: 26 + Math.random() * 34,
      size: 3 + Math.random() * 5,
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
function InkParticles({ active, className = '', count = 10 }: InkParticlesProps) {
  const droplets = useMemo(() => createDroplets(count), [count])
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) return null

  return (
    <svg
      viewBox="-60 -60 120 120"
      width={140}
      height={140}
      className={className}
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
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
                ? { cx: x, cy: y, opacity: [0, 0.85, 0], scale: 1 }
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
