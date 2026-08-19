import type { ReactNode } from 'react'
import { motion, useReducedMotion, type TargetAndTransition, type Variants } from 'motion/react'
import { fadeUp } from '../lib/motion'
import { usePhoneLandscape } from '../lib/usePhoneLandscape'

interface RevealProps {
  children: ReactNode
  variant?: Variants
  className?: string
  delay?: number
  /** Fraction of the element that must be visible before it triggers. */
  amount?: number
  /** Passed straight through, for a section that needs to be an anchor target. */
  id?: string
}

/**
 * Folds `delay` into a copy of the variant's own `visible.transition`
 * instead of passing a separate `transition` prop to `motion.div`,
 * so a delayed Reveal still keeps the variant's own `duration`/`ease`
 * instead of depending on how Motion merges a component-level
 * `transition` prop against a variant's own transition.
 */
function withDelay(variant: Variants, delay: number): Variants {
  const visible = variant.visible
  if (!delay || typeof visible !== 'object') return variant

  return {
    ...variant,
    visible: {
      ...visible,
      transition: { ...(visible as TargetAndTransition).transition, delay },
    },
  }
}

/**
 * Scroll-triggered entrance, built on the Phase 13 vocabulary instead
 * of every section hand-rolling its own `whileInView` config. Replays
 * every time the element leaves and re-enters the viewport
 * (`viewport={{ once: false }}`), so scrolling away and back plays
 * the reveal again instead of leaving it in its already-settled end
 * state. Locked to `once: true` under reduced motion instead: cycling
 * an element between hidden and visible on every scroll is exactly
 * the repeated-motion pattern `prefers-reduced-motion` exists to
 * avoid, so those visitors get the entrance once and then a stable,
 * unchanging element from then on. Same reduced-motion detection as
 * Hero throughout: Motion doesn't read the CSS media query, so
 * `useReducedMotion` is checked directly.
 */
function Reveal({ children, variant = fadeUp, className, delay = 0, amount = 0.3, id }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()
  // On a phone-landscape viewport a tall child (e.g. Projects' whole
  // Architecture Deep Dive block, ArchitectureMap included) can be
  // taller than the entire viewport, so no scroll position ever gets
  // `amount` of its area on-screen at once and it stays invisible
  // forever. Dropping to "any pixel visible" only on those viewports
  // fixes that without changing the trigger point anywhere else.
  const isPhoneLandscape = usePhoneLandscape()

  return (
    <motion.div
      id={id}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: !!shouldReduceMotion, amount: isPhoneLandscape ? 0 : amount }}
      variants={withDelay(variant, delay)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
