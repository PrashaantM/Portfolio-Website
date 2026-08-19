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
import { usePhoneLandscape } from '../lib/usePhoneLandscape'
import { LAB_IDEAS, LAB_BUILDS } from '../data/lab'
import { buildAccentFor } from '../lib/labAccents'

const gridContainer = staggerContainer(0.05, 0.05)

/**
 * Lab.tsx renders two subsections from src/data/lab.ts: shipped side
 * projects (`LAB_BUILDS`) under "Built", and unshipped experiments
 * (`LAB_IDEAS`) under "Concepts". They're kept as separate labeled
 * grids rather than one merged one so which kind a card is reads at a
 * glance: Built cards are color-coded in shades of the site's red
 * accent (`buildAccentFor`, see `lib/labAccents.ts`), while Concept
 * cards stay uncolored with a plain dashed red border. `ParticleField`
 * runs behind the section as an ember motif, and each subsection's
 * cards enter as their own staggered `whileInView` group. `SwordSlash`
 * and `FlameBreath` sit here specifically: Lab is the site's one
 * section built to carry a bigger visual moment without competing
 * with the more resume-facing sections above it.
 */
function Lab() {
  const shouldReduceMotion = useReducedMotion()
  const isPhoneLandscape = usePhoneLandscape()

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
            A collection of experiments, weird ideas, and projects that started with a simple &ldquo;what
            if?&rdquo;
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <h3 className="text-text-secondary mt-10 font-mono text-sm tracking-wide uppercase">Built</h3>
        </Reveal>
        <motion.div
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: !!shouldReduceMotion, amount: isPhoneLandscape ? 0 : 0.1 }}
          variants={gridContainer}
          className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {LAB_BUILDS.map((build, index) => (
            <motion.div key={build.id} variants={fadeUp}>
              <LabBuildCard build={build} accent={buildAccentFor(index)} />
            </motion.div>
          ))}
        </motion.div>

        <Reveal delay={0.15}>
          <h3 className="text-text-secondary mt-14 font-mono text-sm tracking-wide uppercase">Concepts</h3>
        </Reveal>
        <motion.div
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: !!shouldReduceMotion, amount: isPhoneLandscape ? 0 : 0.1 }}
          variants={gridContainer}
          className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
