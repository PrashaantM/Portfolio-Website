import { motion, useReducedMotion } from 'motion/react'
import Section from '../components/Section'
import Badge from '../components/Badge'
import SwordSlash from '../components/motifs/SwordSlash'
import { staggerContainer, fadeUp } from '../lib/motion'
import { usePhoneLandscape } from '../lib/usePhoneLandscape'
import { SKILL_CATEGORIES } from '../data/skills'

const gridContainer = staggerContainer(0.05, 0.03)

function Skills() {
  const shouldReduceMotion = useReducedMotion()
  const isPhoneLandscape = usePhoneLandscape()

  return (
    <Section id="skills">
      <SwordSlash />
      <h2>Skills</h2>

      <motion.div
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: !!shouldReduceMotion, amount: isPhoneLandscape ? 0 : 0.15 }}
        variants={gridContainer}
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SKILL_CATEGORIES.map((category) => {
          const Icon = category.icon
          return (
            <motion.div
              key={category.name}
              variants={fadeUp}
              className="border-border bg-surface rounded-(--radius-card) border p-6"
            >
              <div className="flex items-center gap-2.5">
                <Icon size={18} className="text-accent" aria-hidden="true" />
                <h3 className="text-base">{category.name}</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}

export default Skills
