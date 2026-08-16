import { useState } from 'react'
import Section from '../components/Section'

interface IdentityNode {
  id: string
  label: string
  description: string
}

// Four tiers, top to bottom: what I study -> how I actually practice it
// -> the throughline -> what shapes how I think outside of code. Not a
// rigorous tree, just a shape that gives each node a description worth
// clicking for - see notes/phase-7.md for why this isn't literal ASCII
// art or a graph-physics library.
const TIERS: IdentityNode[][] = [
  [
    {
      id: 'cs',
      label: 'Computer Science',
      description:
        'Full-stack development, backend systems, and software architecture — I like understanding how the whole system fits together, not just one layer of it.',
    },
  ],
  [
    {
      id: 'ai',
      label: 'AI',
      description:
        'Using AI tools like Claude Code as part of a real development workflow — reviewing, testing, and owning every change instead of just accepting what it generates. This portfolio is built that way.',
    },
    {
      id: 'software',
      label: 'Software',
      description:
        'Designing and building applications end to end, from a database schema to the interface someone actually uses.',
    },
    {
      id: 'systems',
      label: 'Systems',
      description:
        "APIs, databases, asynchronous processing, background workers — the parts that don't show up in a demo but decide whether something actually holds up.",
    },
  ],
  [
    {
      id: 'building',
      label: 'Building',
      description:
        "The throughline. I learn by building things end to end rather than reading about them — on both sides of this map.",
    },
  ],
  [
    {
      id: 'gym',
      label: 'Gym / Calisthenics → Discipline',
      description:
        'Progress here is slow, measurable, and impossible to shortcut — the same mindset that keeps a long build honest.',
    },
    {
      id: 'anime',
      label: 'Anime → Inspiration',
      description:
        "Demon Slayer, Attack on Titan, Naruto — the visual language of this whole site borrows from what I actually watch, not a generic portfolio template.",
    },
    {
      id: 'drawing',
      label: 'Drawing → Creativity',
      description:
        'Hand-drawn strokes, not generated ones — a different kind of problem-solving than code, and a good reset from it.',
    },
    {
      id: 'deathcore',
      label: 'Deathcore → Intensity',
      description:
        "Lorna Shore, Bad Omens — restraint that suddenly breaks into intensity. That rhythm is basically the design brief for this site's mood.",
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
            I want to understand how complete systems fit together — APIs,
            databases, asynchronous processing, background workers,
            architecture, deployment — not just the individual languages and
            frameworks that make them up. I want to make real engineering
            decisions, take ownership of what I build, and think about
            performance, scalability, and maintainability instead of just
            getting something to run once.
          </p>
          <p>
            I also use AI coding tools like Claude Code as part of a serious
            development workflow, while still understanding, reviewing,
            testing, and owning every line that ships — this site is proof of
            that, not just a claim about it.
          </p>
          <p className="text-text-primary font-display border-accent border-l-2 pl-4 font-medium">
            I enjoy learning by building.
          </p>
          <p>
            Outside of code, the gym, anime, drawing, and deathcore aren't
            separate from how I think about engineering — they're where a lot
            of the same instincts (discipline, restraint before intensity,
            caring about craft) actually come from.
          </p>
        </div>

        <IdentityMap />
      </div>
    </Section>
  )
}

export default About
