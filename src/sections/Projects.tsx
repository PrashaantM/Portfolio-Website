import { Link2 } from 'lucide-react'
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import ArchitectureMap from '../components/ArchitectureMap'
import Reveal from '../components/Reveal'
import SwordSlash from '../components/motifs/SwordSlash'
import { staggerContainer, fadeUp } from '../lib/motion'
import { motion, useReducedMotion } from 'motion/react'
import { PROJECTS } from '../data/projects'

const gridContainer = staggerContainer(0.08, 0.05)

function Projects() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Section id="projects">
      <SwordSlash />
      <h2>Featured Projects</h2>

      <motion.div
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: !!shouldReduceMotion, amount: 0.1 }}
        variants={gridContainer}
        className="mt-8 grid gap-6 lg:grid-cols-2"
      >
        {PROJECTS.map((project) => (
          <motion.div key={project.id} variants={fadeUp}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>

      <div className="divider-ink mt-16" />

      <Reveal className="mt-10" id="architecture-deep-dive">
        <p className="text-text-primary inline-flex items-center gap-1.5 font-mono text-xs">
          <Link2 size={12} aria-hidden="true" className="text-accent" />
          Traced from MCQ Exam Management Platform above
        </p>
        <h3 className="mt-2">Architecture Deep Dive: MCQ Exam Management Platform</h3>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Most project descriptions stop at “built with React and FastAPI.” 
          This one goes into what I actually built, why I built it, and how everything fits together.
          Click a piece of the system below to see what it does, why it exists, and one implementation detail worth
          knowing about it.
        </p>
        <div className="mt-8">
          <ArchitectureMap />
        </div>
      </Reveal>
    </Section>
  )
}

export default Projects
