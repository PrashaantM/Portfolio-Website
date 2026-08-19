import { motion, useReducedMotion } from 'motion/react'
import Section from '../components/Section'
import DrawLine from '../components/DrawLine'
import SwordSlash from '../components/motifs/SwordSlash'
import { staggerContainer, fadeUp } from '../lib/motion'
import { usePhoneLandscape } from '../lib/usePhoneLandscape'
import { EXPERIENCE } from '../data/experience'

const listContainer = staggerContainer(0.05, 0.03)

/**
 * Replaces the "Experience" placeholder from Phase 5. A vertical,
 * always-readable list rather than the click-a-node pattern
 * `IdentityMap`/`ArchitectureMap` use elsewhere: those two are built
 * around a handful of short labels worth clicking through one at a
 * time, but a resume timeline is content someone actually wants to
 * read straight down, so hiding it behind clicks would work against
 * the section's own job. `DrawLine` (Phase 13) still connects each
 * entry to the next, the same "these are linked in sequence" idea
 * `ArchitectureMap` uses between tiers, and `.frame-tactical` (Phase 12's
 * AoT document motif) frames each entry like a service record rather
 * than a plain card.
 */
function Experience() {
  const shouldReduceMotion = useReducedMotion()
  const isPhoneLandscape = usePhoneLandscape()

  return (
    <Section id="experience">
      <SwordSlash />
      <h2>Experience</h2>
      <p className="text-text-secondary mt-3 max-w-2xl">
        What I've worked on outside of class, most recent first.
      </p>

      <motion.div
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: !!shouldReduceMotion, amount: isPhoneLandscape ? 0 : 0.1 }}
        variants={listContainer}
        className="mt-10 flex max-w-3xl flex-col"
      >
        {EXPERIENCE.map((entry, index) => {
          const Icon = entry.icon
          return (
            <motion.div key={entry.id} variants={fadeUp}>
              {index > 0 && (
                <DrawLine path="M12 0 L12 32" viewBox="0 0 24 32" className="ml-8 h-8 w-6" delay={index * 0.08} />
              )}
              <div className="frame-tactical border-border bg-surface rounded-(--radius-card) border p-6">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} className="text-accent shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="text-base">{entry.title}</h3>
                      <p className="text-text-secondary text-sm">
                        {entry.organization} · {entry.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-text-secondary font-mono text-xs whitespace-nowrap">
                    {entry.start} – {entry.end}
                  </p>
                </div>

                <ul className="mt-4 space-y-2">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet} className="text-text-secondary flex gap-2.5 text-sm">
                      <span className="text-accent mt-2 h-1 w-1 shrink-0 rounded-full" aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}

export default Experience
