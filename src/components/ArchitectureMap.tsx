import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Cpu, Target, Lightbulb, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import DrawLine from './DrawLine'
import { fadeUp, staggerContainer } from '../lib/motion'
import { ARCHITECTURE_NODES } from '../data/architecture'

const DETAIL_FIELDS: {
  label: string
  key: 'technology' | 'responsibility' | 'why' | 'detail'
  icon: LucideIcon
  /** Grid placement for the snake reading order at `sm`+: row 1 runs
   *  left-to-right, row 2 doubles back right-to-left, so 1-2-3-4 traces
   *  a path that folds back on itself instead of a plain 2-column grid's
   *  top-to-bottom-per-column order. Fields without one auto-place. */
  snakeClass?: string
}[] = [
  { label: 'Technology', key: 'technology', icon: Cpu },
  { label: 'Responsibility', key: 'responsibility', icon: Target },
  { label: 'Why it exists', key: 'why', icon: Lightbulb, snakeClass: 'sm:col-start-2 sm:row-start-2' },
  { label: 'Interesting detail', key: 'detail', icon: Sparkles, snakeClass: 'sm:col-start-1 sm:row-start-2' },
]

/**
 * One field of the active node. All four stay visible at once (no more
 * hover/focus-to-reveal) with a numbered badge marking its place in the
 * snake reading order above.
 */
function DetailTile({
  index,
  label,
  Icon,
  text,
}: {
  index: number
  label: string
  Icon: LucideIcon
  text: string
}) {
  return (
    <div className="frame-tactical rounded-(--radius-card) border-border bg-surface border p-4">
      <div className="flex items-center gap-2.5">
        <span className="text-accent font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
        <Icon size={18} aria-hidden="true" className="text-accent" />
        <span className="text-text-primary font-mono text-xs">{label}</span>
      </div>
      <p className="text-text-secondary mt-3 text-sm">{text}</p>
    </div>
  )
}

/**
 * Interactive architecture map for the MCQ Exam Management Platform.
 * Same click-a-node, read-the-panel-below interaction as About's
 * `IdentityMap`, with a drawn `DrawLine` connector between each tier
 * instead of a static div, and four data fields per node (technology,
 * responsibility, why it exists, an interesting implementation
 * detail) instead of one paragraph. One vertical column at every
 * width rather than a separate mobile layout: the interaction already
 * works identically at 320px and 1440px, so there is no real
 * mobile-specific behavior to design around here.
 */
function ArchitectureMap() {
  const [activeId, setActiveId] = useState(ARCHITECTURE_NODES[0].id)
  const active = ARCHITECTURE_NODES.find((node) => node.id === activeId) ?? ARCHITECTURE_NODES[0]
  const shouldReduceMotion = useReducedMotion()

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
        <motion.div
          key={active.id}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          variants={staggerContainer(0.04, 0)}
          className="mt-4 grid gap-3 sm:grid-cols-2"
        >
          {DETAIL_FIELDS.map((field, index) => (
            <motion.div key={field.key} variants={fadeUp} className={field.snakeClass}>
              <DetailTile index={index} label={field.label} Icon={field.icon} text={active[field.key]} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default ArchitectureMap
