import type { Variants } from 'motion/react'

/**
 * The site's animation vocabulary (Phase 13): a small, named set of
 * variants that every later phase reuses instead of hand-timing a new
 * animation per element. `EASE` moves here from Hero (Phase 6), which
 * was the only thing defining it before this phase existed.
 */
export const EASE = [0.16, 1, 0.3, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
}

/**
 * Factory rather than a fixed constant: every current use (Hero's CTA
 * stack, Lab's card grid, Architecture's node tiers) wants the same
 * "children reveal one after another" behavior but at different
 * speeds, so the timing is a parameter instead of three near-duplicate
 * variant objects.
 */
export function staggerContainer(stagger = 0.06, delayChildren = 0.05): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  }
}
