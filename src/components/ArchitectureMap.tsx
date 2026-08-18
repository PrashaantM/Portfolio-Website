import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Cpu, Target, Lightbulb, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import DrawLine from './DrawLine'
import { EASE, fadeUp, staggerContainer } from '../lib/motion'
import { ARCHITECTURE_NODES } from '../data/architecture'

const DETAIL_FIELDS: {
  label: string
  key: 'technology' | 'responsibility' | 'why' | 'detail'
  icon: LucideIcon
}[] = [
  { label: 'Technology', key: 'technology', icon: Cpu },
  { label: 'Responsibility', key: 'responsibility', icon: Target },
  { label: 'Why it exists', key: 'why', icon: Lightbulb },
  { label: 'Interesting detail', key: 'detail', icon: Sparkles },
]

/**
 * One field of the active node, collapsed to an icon and label until
 * hovered, focused, or tapped. The answer text stays mounted at all
 * times (just visually collapsed via `height: 0` + `overflow-hidden`)
 * rather than being conditionally rendered, so it is always present in
 * the DOM for anything reading the page - screen readers included.
 */
function DetailTile({
  label,
  Icon,
  text,
}: {
  label: string
  Icon: LucideIcon
  text: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      className={`frame-tactical rounded-(--radius-card) border p-4 transition-colors ${
        isOpen ? 'border-accent bg-accent/5' : 'border-border bg-surface'
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2.5 text-left"
      >
        <motion.span
          animate={{ rotate: isOpen ? -8 : 0, scale: isOpen ? 1.1 : 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={isOpen ? 'text-accent' : 'text-text-secondary'}
        >
          <Icon size={18} aria-hidden="true" />
        </motion.span>
        <span className="text-text-primary font-mono text-xs">{label}</span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: EASE }}
        className="overflow-hidden"
      >
        <p className="text-text-secondary pt-3 text-sm">{text}</p>
      </motion.div>
    </div>
  )
}

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
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-text-primary font-mono text-sm">{active.label}</h4>
          <span className="text-text-secondary font-mono text-[0.65rem] tracking-wide uppercase">
            Hover a field
          </span>
        </div>
        <motion.div
          key={active.id}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          variants={staggerContainer(0.06, 0)}
          className="mt-4 grid gap-3 sm:grid-cols-2"
        >
          {DETAIL_FIELDS.map((field) => (
            <motion.div key={field.key} variants={fadeUp}>
              <DetailTile label={field.label} Icon={field.icon} text={active[field.key]} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default ArchitectureMap
