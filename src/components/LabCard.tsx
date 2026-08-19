import { Lightbulb } from 'lucide-react'
import Badge from './Badge'
import type { LabIdea } from '../data/lab'

interface LabCardProps {
  idea: LabIdea
}

/**
 * Deliberately styled apart from `ProjectCard`: dashed border instead
 * of solid, an amber "CONCEPT" pill instead of green "BUILT", and a
 * "Possible visual" line treated as a sketch note rather than a
 * screenshot caption. Each idea should look like a concept rather than
 * a completed product, so the visual language has to say that before
 * anyone reads a word of copy. No entrance animation of its own:
 * `Lab.tsx` already staggers the whole grid in as a group, and
 * wrapping each card in its own `Reveal` on top of that would animate
 * every card twice.
 *
 * Unlike `LabBuildCard`, this card takes no `accent`: concepts stay
 * uncolored on purpose, all sharing one dashed red border, so color
 * alone tells the shipped ones apart from the sketches.
 */
function LabCard({ idea }: LabCardProps) {
  const Icon = idea.icon

  return (
    <div className="frame-tactical border-accent/50 bg-surface/60 hover:border-accent flex h-full flex-col rounded-(--radius-card) border border-dashed p-6 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <span className="border-warning/40 bg-warning/10 text-warning inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-1 font-mono text-[0.65rem] tracking-wide">
          <Lightbulb size={11} aria-hidden="true" />
          {idea.number} / CONCEPT
        </span>
        <Icon
          size={18}
          className={`text-text-secondary shrink-0 ${idea.funny ? 'hover-wiggle' : ''}`}
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-3 text-lg">{idea.name}</h3>
      <p className="text-text-secondary mt-2 text-sm italic">{idea.tagline}</p>
      <p className="mt-4 text-sm">{idea.concept}</p>

      <div className="border-border mt-5 border-t border-dashed pt-4">
        <p className="text-text-secondary font-mono text-xs">
          <span className="text-text-primary">Possible visual:</span> {idea.visual}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {idea.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
        {idea.funny && (
          <span className="hover-wiggle border-accent/40 text-text-primary inline-block rotate-2 rounded-(--radius-button) border border-dashed px-3 py-1 font-mono text-xs">
            not serious, promise
          </span>
        )}
      </div>
    </div>
  )
}

export default LabCard
