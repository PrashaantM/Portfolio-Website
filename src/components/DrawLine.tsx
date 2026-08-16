import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '../lib/motion'

interface DrawLineProps {
  /** An SVG path `d` string, in the coordinate space of `viewBox`. */
  path: string
  viewBox: string
  className?: string
  /** Line color; defaults to the CSS custom property so it tracks the theme. */
  stroke?: string
  strokeWidth?: number
  duration?: number
  delay?: number
}

/**
 * The `drawLine` item from Phase 13's vocabulary: a path that draws
 * itself on rather than simply fading in, used wherever the site needs
 * to show a *connection* rather than just an element appearing -
 * Architecture's node connectors (Phase 14) and the Naruto-style
 * energy-trail connectors in Lab (Phase 12/10). Animates
 * `pathLength` 0 -> 1 rather than a `stroke-dashoffset` hack, since
 * Motion computes that from the path's real geometry automatically.
 * Redraws every time it re-enters the viewport, locked to drawing
 * once under reduced motion, same reasoning as `Reveal`.
 */
function DrawLine({
  path,
  viewBox,
  className,
  stroke = 'var(--color-accent)',
  strokeWidth = 2,
  duration = 0.8,
  delay = 0,
}: DrawLineProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" fill="none">
      <motion.path
        d={path}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0.3 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: !!shouldReduceMotion, amount: 0.5 }}
        transition={{ duration, delay, ease: EASE }}
      />
    </svg>
  )
}

export default DrawLine
