import { useState } from 'react'
import Section from '../components/Section'

interface IdentityNode {
  id: string
  label: string
  description: string
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
      description:
        'Full-stack development, backend systems, and software architecture. I care more about how the pieces fit together than about any single language.',
    },
  ],
  [
    {
      id: 'ai',
      label: 'AI',
      description:
        'Building with tools like Claude Code as part of a real workflow, not a shortcut. I still read, test, and understand every change before it ships.',
    },
    {
      id: 'software',
      label: 'Software',
      description:
        'Designing and building applications end to end, from a database schema to the screen someone actually uses.',
    },
    {
      id: 'systems',
      label: 'Systems',
      description:
        "APIs, databases, background workers. The parts nobody sees that decide whether something holds up under real use.",
    },
  ],
  [
    {
      id: 'building',
      label: 'Building',
      description: "The reason all of this is fun in the first place. I learn by building real things, not by reading about them.",
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
              {tier.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveId(node.id)}
                  aria-pressed={activeId === node.id}
                  className={`rounded-(--radius-button) border px-4 py-2 text-sm transition-colors ${
                    activeId === node.id
                      ? 'border-accent bg-accent/10 text-text-primary'
                      : 'border-border text-text-secondary hover:border-accent'
                  }`}
                >
                  {node.label}
                </button>
              ))}
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
            The project I'm proudest of is an exam platform I built for a
            UBC Okanagan department. Instructors can build question banks,
            generate exams with different variants, and see analytics, all
            running on a backend I load tested to hold up under 100
            concurrent users. I also build with AI tools like Claude Code
            now, but every line still gets read, tested, and understood
            before it ships. This site is the proof, not a slogan.
          </p>
          <p className="text-text-primary font-display border-accent border-l-2 pl-4 font-medium">
            I enjoy learning by building.
          </p>
        </div>

        <IdentityMap />
      </div>
    </Section>
  )
}

export default About
