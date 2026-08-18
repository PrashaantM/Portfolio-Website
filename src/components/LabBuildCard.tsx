import { FolderGit2, ExternalLink, History } from 'lucide-react'
import Badge from './Badge'
import type { LabBuild } from '../data/lab'
import githubStats from '../data/github-stats.json'

interface LabBuildCardProps {
  build: LabBuild
}

interface GithubStat {
  stars: number
  primaryLanguage: string | null
  pushedAt: string
}

const STATS: Record<string, GithubStat> = githubStats

function formatUpdated(pushedAt: string) {
  return new Date(pushedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/**
 * `LabCard`'s opposite number: a solid border and a "BUILT" label
 * instead of the dashed border and "CONCEPT" label, since these are
 * real, shipped repos rather than sketches - the same visual category
 * as `ProjectCard` above, which is why this skips `frame-tactical`
 * (reserved, per `motifs.css`, for things explicitly labeled
 * concept/spec). Lighter than `ProjectCard` on purpose: no expandable
 * problem/solution/architecture breakdown, since that level of depth
 * belongs to the four projects chosen for Featured Projects, not to
 * six smaller side builds that just need to be shown as real.
 */
function LabBuildCard({ build }: LabBuildCardProps) {
  const Icon = build.icon
  const stat = STATS[build.id]

  return (
    <div className="border-border bg-surface/60 hover:border-accent flex h-full flex-col rounded-(--radius-card) border p-6 transition-colors hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <span className="text-accent font-mono text-xs">BUILT</span>
        <Icon size={18} className="text-accent shrink-0" aria-hidden="true" />
      </div>

      <h3 className="mt-3 text-lg">{build.name}</h3>
      <p className="text-text-secondary mt-2 text-sm italic">{build.tagline}</p>
      <p className="mt-4 text-sm">{build.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {build.tech.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>

      <div className="border-border mt-5 flex flex-wrap items-center gap-4 border-t border-dashed pt-4">
        <a
          href={build.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm"
        >
          <FolderGit2 size={16} aria-hidden="true" />
          GitHub
        </a>
        {build.demo && (
          <a
            href={build.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm"
          >
            <ExternalLink size={16} aria-hidden="true" />
            Live Demo
          </a>
        )}
        {stat && (
          <span className="text-text-secondary ml-auto inline-flex items-center gap-1 font-mono text-xs">
            <History size={12} aria-hidden="true" />
            Updated {formatUpdated(stat.pushedAt)}
          </span>
        )}
      </div>
    </div>
  )
}

export default LabBuildCard
