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

const gridContainer = staggerContainer(0.08, 0.1)

/**
 * Replaces the "Experimental Lab" placeholder from Phase 5. Originally
 * just ten ideas from `notes/phase-10.md`'s brief, each styled as a
 * concept rather than a shipped feature; Phase 15.2 added five real,
 * shipped side projects (`LAB_BUILDS`), and this later pass split the
 * two into their own labeled subsections instead of one merged grid -
 * Built cards color-coded in shades of the site's red accent
 * (`buildAccentFor`, see `lib/labAccents.ts`), Concept cards left
 * uncolored with a plain dashed red border, so which kind a card is
 * reads at a glance before anyone reads a word of copy. `ParticleField`
 * runs behind the section as the Naruto ember motif from Phase 12, and
 * each subsection's cards enter as their own staggered `whileInView`
 * group. `SwordSlash` and `FlameBreath` (Phase 12/13's sword-slash and
 * flame-breathing additions) sit here specifically: Lab is the site's
 * one section built to carry a bigger visual moment without competing
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
