import { motion, useReducedMotion } from 'motion/react'
import Section from '../components/Section'
import LabCard from '../components/LabCard'
import ParticleField from '../components/ParticleField'
import Reveal from '../components/Reveal'
import InkReveal from '../components/InkReveal'
import SwordSlash from '../components/motifs/SwordSlash'
import FlameBreath from '../components/motifs/FlameBreath'
import { staggerContainer, fadeUp } from '../lib/motion'
import { LAB_IDEAS } from '../data/lab'

const gridContainer = staggerContainer(0.08, 0.1)

/**
 * Replaces the "Experimental Lab" placeholder from Phase 5. Ten ideas
 * from `notes/phase-10.md`'s brief, each styled as a concept rather
 * than a shipped feature. `ParticleField` runs behind the section as
 * the Naruto ember motif from Phase 12, and the whole card grid enters
 * as one staggered `whileInView` group instead of ten separate
 * one-off timings. `SwordSlash` and `FlameBreath` (Phase 12/13's
 * sword-slash and flame-breathing additions) sit here specifically:
 * Lab is the site's one section built to carry a bigger visual moment
 * without competing with the more resume-facing sections above it.
 */
function Lab() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Section id="lab" className="relative overflow-hidden">
      <ParticleField />
      <FlameBreath className="absolute -right-24 top-10 opacity-70" />

      <div className="relative">
        <SwordSlash />
        <InkReveal className="inline-block">
          <h2>Experimental Lab</h2>
        </InkReveal>
        <Reveal delay={0.1}>
          <p className="text-text-secondary mt-3 max-w-2xl">
            Ten ideas that have not shipped yet. Each one is a concept, not a
            product: a problem worth solving, a rough shape for the solution,
            and a sketch of what it would look like on screen.
          </p>
        </Reveal>

        <motion.div
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: !!shouldReduceMotion, amount: 0.1 }}
          variants={gridContainer}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {LAB_IDEAS.map((idea) => (
            <motion.div key={idea.id} variants={fadeUp}>
              <LabCard idea={idea} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}

export default Lab
