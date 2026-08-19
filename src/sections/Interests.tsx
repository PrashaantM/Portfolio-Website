import { motion, useReducedMotion } from 'motion/react'
import Section from '../components/Section'
import SwordSlash from '../components/motifs/SwordSlash'
import { staggerContainer, fadeUp } from '../lib/motion'
import { usePhoneLandscape } from '../lib/usePhoneLandscape'
import { INTERESTS } from '../data/interests'

const gridContainer = staggerContainer(0.08, 0.05)

/**
 * Replaces the "Interests" placeholder from Phase 5. Same card-grid
 * visual weight as `Skills.tsx` on purpose: the brief's own Design
 * rules say interests should "influence the visual language without
 * overwhelming" the portfolio, so this section reads as one more
 * category grid, not a tonal departure into a different kind of page.
 */
function Interests() {
  const shouldReduceMotion = useReducedMotion()
  const isPhoneLandscape = usePhoneLandscape()

  return (
    <Section id="interests">
      <SwordSlash />
      <h2>Interests</h2>
      <p className="text-text-secondary mt-3 max-w-2xl">
        A look at the things I care about outside of school, work, and building things,
        and the parts of me that don’t fit neatly on a resume.
      </p>

      <motion.div
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: !!shouldReduceMotion, amount: isPhoneLandscape ? 0 : 0.15 }}
        variants={gridContainer}
        className="mt-8 grid gap-6 sm:grid-cols-2"
      >
        {INTERESTS.map((interest) => {
          const Icon = interest.icon
          return (
            <motion.div
              key={interest.id}
              variants={fadeUp}
              className="border-border bg-surface rounded-(--radius-card) border p-6"
            >
              <div className="flex items-center gap-2.5">
                <Icon size={18} className="text-accent" aria-hidden="true" />
                <h3 className="text-base">{interest.name}</h3>
              </div>
              <p className="text-text-secondary mt-3 text-sm">{interest.description}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}

export default Interests
