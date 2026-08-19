import type { Variants } from 'motion/react'

/**
 * Shared animation vocabulary for the whole site: a small, named set of
 * Motion variants that components reuse instead of hand-timing a new
 * animation per element. Consumed by `Reveal`, `InkReveal`, `DrawLine`,
 * `ArchitectureMap`, and the section components (Hero, Skills, Projects,
 * Lab, Experience, Interests). `EASE` is the one easing curve used across
 * all of them, so motion feels consistent regardless of which variant a
 * given element uses.
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
 * Builds a "children reveal one after another" container variant.
 * A factory rather than a fixed constant because each caller (Hero's CTA
 * stack, Lab's card grid, Architecture's node tiers) wants the same
 * staggered-reveal behavior at a different speed, so the timing is a
 * parameter instead of several near-duplicate variant objects.
 */
export function staggerContainer(stagger = 0.06, delayChildren = 0.05): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  }
}
