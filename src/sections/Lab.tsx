import { motion, useReducedMotion } from 'motion/react'
import Section from '../components/Section'
import LabCard from '../components/LabCard'
import LabBuildCard from '../components/LabBuildCard'
import ParticleField from '../components/ParticleField'
import Reveal from '../components/Reveal'
import InkReveal from '../components/InkReveal'
import SwordSlash from '../components/motifs/SwordSlash'
import FlameBreath from '../components/motifs/FlameBreath'
import { staggerContainer, fadeUp } from '../lib/motion'
import { LAB_IDEAS, LAB_BUILDS } from '../data/lab'

const gridContainer = staggerContainer(0.08, 0.1)

/**
 * Replaces the "Experimental Lab" placeholder from Phase 5. Originally
 * just ten ideas from `notes/phase-10.md`'s brief, each styled as a
 * concept rather than a shipped feature; Phase 15.2 adds six real,
 * shipped side projects (`LAB_BUILDS`) into the same grid ahead of
 * them, each carrying `LabBuildCard`'s solid-border "BUILT" styling
 * rather than `LabCard`'s dashed-border "CONCEPT" one so the two kinds
 * stay visually honest about which is which. `ParticleField` runs
 * behind the section as the Naruto ember motif from Phase 12, and the
 * whole card grid enters as one staggered `whileInView` group instead
 * of sixteen separate one-off timings. `SwordSlash` and `FlameBreath`
 * (Phase 12/13's sword-slash and flame-breathing additions) sit here
 * specifically: Lab is the site's one section built to carry a bigger
 * visual moment without competing with the more resume-facing sections
 * above it.
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
            Six of these are real, shipped projects. The other ten are concepts
            that have not shipped yet: a problem worth solving, a rough shape
            for the solution, and a sketch of what it would look like on
            screen.
          </p>
        </Reveal>

        <motion.div
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: !!shouldReduceMotion, amount: 0.1 }}
          variants={gridContainer}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {LAB_BUILDS.map((build) => (
            <motion.div key={build.id} variants={fadeUp}>
              <LabBuildCard build={build} />
            </motion.div>
          ))}
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
