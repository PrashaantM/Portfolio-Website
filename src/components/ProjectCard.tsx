import { useState } from 'react'
import { FolderGit2, ExternalLink, ChevronDown } from 'lucide-react'
import Badge from './Badge'
import type { Project } from '../data/projects'

interface ProjectCardProps {
  project: Project
}

type DetailKey = 'problem' | 'solution' | 'architecture' | 'decision' | 'result'

const DETAIL_FIELDS: { label: string; key: DetailKey }[] = [
  { label: 'Problem', key: 'problem' },
  { label: 'Solution', key: 'solution' },
  { label: 'Architecture', key: 'architecture' },
  { label: 'Engineering decision', key: 'decision' },
  { label: 'Result', key: 'result' },
]

function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsId = `${project.id}-details`

  return (
    <div className="border-border bg-surface hover:border-accent rounded-(--radius-card) border p-6 transition-colors hover:-translate-y-1">
      <h3 className="text-lg">{project.name}</h3>
      <p className="text-text-secondary mt-2">{project.purpose}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm"
        >
          <FolderGit2 size={16} aria-hidden="true" />
          GitHub
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm"
          >
            <ExternalLink size={16} aria-hidden="true" />
            Live Demo
          </a>
        )}
        <button
          type="button"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          className="text-text-secondary hover:text-text-primary ml-auto inline-flex items-center gap-1.5 text-sm"
        >
          How it works
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isExpanded && (
        <dl id={detailsId} className="border-border mt-5 space-y-4 border-t pt-5">
          {DETAIL_FIELDS.map((field) => (
            <div key={field.key}>
              <dt className="text-text-primary font-mono text-xs">{field.label}</dt>
              <dd className="text-text-secondary mt-1">{project[field.key]}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

export default ProjectCard
