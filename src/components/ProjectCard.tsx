import { useState } from 'react'
import { FolderGit2, ExternalLink, ChevronDown, Link2, History } from 'lucide-react'
import Badge from './Badge'
import type { Project } from '../data/projects'
import githubStats from '../data/github-stats.json'

interface ProjectCardProps {
  project: Project
}

interface GithubStat {
  stars: number
  primaryLanguage: string | null
  pushedAt: string
}

const STATS: Record<string, GithubStat> = githubStats

// A build-time snapshot (`scripts/fetch-github-stats.mjs`), not a
// runtime call to GitHub's API: nothing here can fail, rate limit, or
// ship a token for a visitor to find. Star counts are fetched into
// the same JSON but not rendered, since every one of these repos
// currently shows 0, and a row of identical "0 stars" badges would
// read as filler UI, not a real signal. "Last updated" is the one
// field that's actually informative right now; surfacing stars too is
// a one-line change if that ever stops being true.
function formatUpdated(pushedAt: string) {
  return new Date(pushedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

type DetailKey = 'problem' | 'solution' | 'architecture' | 'decision' | 'result'

const DETAIL_FIELDS: { label: string; key: DetailKey }[] = [
  { label: 'Problem', key: 'problem' },
  { label: 'Solution', key: 'solution' },
  { label: 'Architecture', key: 'architecture' },
  { label: 'Engineering decision', key: 'decision' },
  { label: 'Result', key: 'result' },
]

/**
 * A featured project's summary card: name, purpose, tech badges, and
 * links, with an expandable "How it works" panel for the deeper
 * problem/solution/architecture/decision/result breakdown. `LabCard`
 * and `LabBuildCard` are styled as lighter variants of this for the
 * Lab section's concepts and smaller builds.
 */
function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsId = `${project.id}-details`
  const Icon = project.icon
  const stat = STATS[project.id]

  return (
    <div className="border-border bg-surface hover:border-accent rounded-(--radius-card) border p-6 transition-colors hover:-translate-y-1">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="flex items-center gap-2.5">
          <Icon size={18} className="text-accent" aria-hidden="true" />
          <h3 className="text-lg">{project.name}</h3>
        </div>
        {stat && (
          <span className="text-text-secondary inline-flex items-center gap-1 font-mono text-xs">
            <History size={12} aria-hidden="true" />
            Updated {formatUpdated(stat.pushedAt)}
          </span>
        )}
      </div>
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

      {project.architectureAnchor && (
        <a
          href={project.architectureAnchor}
          className="border-accent/40 text-text-primary mt-4 inline-flex items-center gap-1.5 border-b border-dashed pb-0.5 text-sm"
        >
          <Link2 size={14} aria-hidden="true" className="text-accent" />
          Traced further below: full architecture breakdown
        </a>
      )}

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
