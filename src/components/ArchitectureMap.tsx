import { useState } from 'react'
import DrawLine from './DrawLine'
import { ARCHITECTURE_NODES } from '../data/architecture'

const DETAIL_FIELDS: { label: string; key: 'technology' | 'responsibility' | 'why' | 'detail' }[] = [
  { label: 'Technology', key: 'technology' },
  { label: 'Responsibility', key: 'responsibility' },
  { label: 'Why it exists', key: 'why' },
  { label: 'Interesting detail', key: 'detail' },
]

/**
 * Phase 14's interactive architecture map, walked through for the MCQ
 * Exam Management Platform specifically. Same click-a-node,
 * read-the-panel-below interaction as About's `IdentityMap` (Phase 7),
 * upgraded with two things that exist now and didn't then: a real
 * drawn connector (Phase 13's `DrawLine`) between each tier instead of
 * a static div, and four data fields per node instead of one
 * paragraph, matching Phase 14's exact spec (technology,
 * responsibility, why it exists, an interesting implementation
 * detail). One vertical column at every width rather than a separate
 * mobile layout: the interaction already works identically at 320px
 * and 1440px, so there is no real mobile-specific behavior to design
 * around here.
 */
function ArchitectureMap() {
  const [activeId, setActiveId] = useState(ARCHITECTURE_NODES[0].id)
  const active = ARCHITECTURE_NODES.find((node) => node.id === activeId) ?? ARCHITECTURE_NODES[0]

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start">
      <div className="flex flex-col items-center">
        {ARCHITECTURE_NODES.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center">
            {index > 0 && (
              <DrawLine
                path="M12 0 L12 32"
                viewBox="0 0 24 32"
                className="h-8 w-6"
                delay={index * 0.1}
              />
            )}
            <button
              type="button"
              onClick={() => setActiveId(node.id)}
              aria-pressed={activeId === node.id}
              className={`frame-tactical rounded-(--radius-card) w-56 border px-5 py-3 text-center text-sm transition-colors ${
                activeId === node.id
                  ? 'border-accent bg-accent/10 text-text-primary'
                  : 'border-border bg-surface text-text-secondary hover:border-accent'
              }`}
            >
              {node.label}
            </button>
          </div>
        ))}
      </div>

      <div
        aria-live="polite"
        className="border-border bg-surface rounded-(--radius-card) border p-6"
      >
        <h4 className="text-text-primary font-mono text-sm">{active.label}</h4>
        <dl className="mt-4 space-y-4">
          {DETAIL_FIELDS.map((field) => (
            <div key={field.key}>
              <dt className="text-text-primary font-mono text-xs">{field.label}</dt>
              <dd className="text-text-secondary mt-1">{active[field.key]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export default ArchitectureMap
