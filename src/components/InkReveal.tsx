import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '../lib/motion'

interface InkRevealProps {
  children: ReactNode
  className?: string
}

/**
 * Demon Slayer ink/water motif: a solid panel the same color as the
 * page background slides away left to right to reveal the heading
 * underneath, standing in for spreading ink. Used on the "new area of
 * the site" headings (Lab) so they read as a deliberate reveal rather
 * than one more fade-up.
 *
 * Built as a sliding cover (`scaleX`, a transform) rather than an
 * animated `clipPath`. This project's Motion version (13.1.0) has a
 * real bug where a `clipPath` animation never plays when the trigger
 * is any IntersectionObserver-driven state change, whether that's
 * Motion's own `whileInView`/`useInView` or a hand-rolled
 * `IntersectionObserver`; a plain `setTimeout`-triggered `clipPath`
 * animation works fine, which narrows the bug to the
 * viewport-detection path specifically. `scaleX` sidesteps it
 * entirely and reuses the exact mechanism already proven reliable
 * everywhere else on the site (Skills, Projects, Lab's own fadeUp
 * reveals all animate via `whileInView` successfully).
 *
 * `once: false` so the wipe replays every time the heading scrolls
 * back into view. No separate reduced-motion branch needed for that:
 * the cover element above is already skipped entirely when
 * `shouldReduceMotion` is set, so this code never runs for those
 * visitors in the first place.
 */
function InkReveal({ children, className }: InkRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`.trim()}>
      {children}
      {!shouldReduceMotion && (
        <motion.span
          aria-hidden="true"
          className="bg-background absolute inset-0"
          style={{ transformOrigin: 'right' }}
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      )}
    </div>
  )
}

export default InkReveal
