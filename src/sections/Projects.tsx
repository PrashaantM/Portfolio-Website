import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import { PROJECTS } from '../data/projects'

function Projects() {
  return (
    <Section id="projects">
      <h2>Featured Projects</h2>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  )
}

export default Projects
