import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { GraduationCap, BrainCircuit, Code2, Server, Hammer } from 'lucide-react'
import Section from '../components/Section'
import SwordSlash from '../components/motifs/SwordSlash'

interface IdentityNode {
  id: string
  label: string
  description: string
  icon: LucideIcon
}

// Three tiers, top to bottom: what I study, how I actually practice
// it, and the throughline underneath all of it. Not a rigorous tree,
// just a shape that gives each node a description worth clicking for.
// See notes/phase-7.md for why this isn't literal ASCII art or a
// graph-physics library, and why the outside-of-code interests moved
// out of this map into their own section instead of living here too.
const TIERS: IdentityNode[][] = [
  [
    {
      id: 'cs',
      label: 'Computer Science',
      icon: GraduationCap,
      description:
        'The computer is always right. Unfortunately, so is the error message 🥀.',
    },
  ],
  [
    {
      id: 'ai',
      label: 'AI',
      icon: BrainCircuit,
      description:
        'The machines are learning. Unfortunately, so am I 💀.',
    },
    {
      id: 'software',
      label: 'Software',
      icon: Code2,
      description:
        '“Let me just add a small feature” - famous last words. \n Somehow it has a roadmap and technical debt now.',
    },
    {
      id: 'systems',
      label: 'Systems',
      icon: Server,
      description:
        'There are two hard problems in computer science: naming things, cache invalidation, and distributed systems.',
    },
  ],
  [
    {
      id: 'building',
      label: 'Building',
      icon: Hammer,
      description: "Give me an idea and an unreasonable amount of time.",
    },
  ],
]

const ALL_NODES = TIERS.flat()
const DEFAULT_DESCRIPTION = 'Click a node to see how it connects.'

function IdentityMap() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = ALL_NODES.find((node) => node.id === activeId)

  return (
    <div>
      <div className="flex flex-col items-center gap-4">
        {TIERS.map((tier, tierIndex) => (
          <div key={tierIndex} className="flex flex-col items-center gap-4">
            {tierIndex > 0 && <div className="bg-border h-8 w-px" aria-hidden="true" />}
            <div className="flex flex-wrap justify-center gap-3">
              {tier.map((node) => {
                const Icon = node.icon
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveId(node.id)}
                    aria-pressed={activeId === node.id}
                    className={`rounded-(--radius-button) inline-flex items-center gap-2 border px-4 py-2 text-sm transition-colors ${
                      activeId === node.id
                        ? 'border-accent bg-accent/10 text-text-primary'
                        : 'border-border text-text-secondary hover:border-accent'
                    }`}
                  >
                    <Icon size={14} aria-hidden="true" />
                    {node.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <p
        aria-live="polite"
        className="border-border bg-surface mt-8 min-h-20 rounded-(--radius-card) border px-6 py-5 text-center"
      >
        {active?.description ?? DEFAULT_DESCRIPTION}
      </p>
    </div>
  )
}

function About() {
  return (
    <Section id="about">
      <SwordSlash />
      <h2>About</h2>

      <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:items-start">
        <div className="max-w-prose space-y-4 text-lg">
          <p>
            I'm a Computer Science student at UBC Okanagan, and most of what
            actually stuck for me came from building things outside of
            class, not from the classes themselves.
          </p>
          <p>
            Last summer I interned at Tythe Labs, a startup building an
            on-chain credit protocol. I spent the first half building React
            components for their dashboard, then moved into the backend and
            wrote the Python services and REST endpoints those components
            actually talked to. Seeing both ends of that pipeline changed how
            I think about frontend work entirely. A button doesn't just need
            to look right, it needs something real behind it.
          </p>
          <p>
            Before that, I spent a year and a half on a research team,
            reading and coding through more than 500 academic papers with
            nine other people. It's tedious work, but it taught me something
            code doesn't: how to define a rule precisely enough that ten
            different people apply it the same way.
          </p>
          <p>
            The biggest project I've worked on recently is an exam
            management platform built as part of my UBC Okanagan capstone
            for the Earth, Environmental and Geographic Sciences department.
            The platform helps instructors manage question banks, build
            exams, import questions, generate multiple exam variants and
            answer keys, and analyze exam results through a centralized
            dashboard. Generating variants does double duty: it cuts down on
            students copying answers off each other, and the result analysis
            can flag answer patterns worth a second look for possible
            cheating.
          </p>
          <p>
            I worked across the stack, building React interfaces and
            FastAPI backend services backed by PostgreSQL, while also
            designing background processing for computationally intensive
            tasks. I helped build and test the system for real usage
            scenarios, including load testing with 100+ concurrent users.
          </p>
          <p>
            I also use AI development tools like Claude Code to accelerate
            how I work. But I do not treat generated code as a black box. I
            review it, test it, understand the implementation, and take
            responsibility for what ultimately ships.
          </p>
          <p>
            This portfolio is where I want to show that work in practice:
            the systems I've built, the engineering decisions behind them,
            and what I can actually do beyond a list of technologies.
          </p>
          <p className="text-text-primary font-display border-accent border-l-2 pl-4 font-medium">
            I enjoy learning by building.
          </p>
        </div>

        <div className="lg:sticky lg:top-24">
          <IdentityMap />
        </div>
      </div>
    </Section>
  )
}

export default About
