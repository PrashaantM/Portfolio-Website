import type { LucideIcon } from 'lucide-react'
import { Braces, Layers, Database, Wrench, BrainCircuit } from 'lucide-react'

export interface SkillCategory {
  name: string
  icon: LucideIcon
  skills: string[]
}

// Source of truth: the Technical Skills section of
// public/PrashaantMudgala_Resume.pdf, regrouped by what each group is
// actually for rather than the resume's flat Languages/Frameworks/
// Databases/Tools split - matches Phase 8's "group by what you can
// actually do" instruction. The AI-Assisted Development category isn't
// on the resume itself, but it's the most concretely defensible one
// here: this whole site is the evidence, documented commit-by-commit
// in notes/.
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Languages',
    icon: Braces,
    skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'SQL', 'HTML/CSS'],
  },
  {
    name: 'Frameworks & Libraries',
    icon: Layers,
    skills: ['React', 'Node.js', 'Express', 'FastAPI', 'Tailwind CSS'],
  },
  {
    name: 'Systems & Data',
    icon: Database,
    skills: [
      'PostgreSQL',
      'MongoDB',
      'REST APIs',
      'Concurrency & Async Processing',
      'Data Structures & Algorithms',
    ],
  },
  {
    name: 'Engineering Practices',
    icon: Wrench,
    skills: [
      'Docker',
      'GitHub Actions',
      'CI/CD',
      'Git',
      'Swagger/OpenAPI',
      'Pytest',
      'Vitest',
      'Playwright',
      'React Testing Library',
      'Agile/Scrum',
    ],
  },
  {
    name: 'AI-Assisted Development',
    icon: BrainCircuit,
    skills: [
      'Claude Code',
      'Agentic development workflows',
      'Reviewing & validating AI-generated code',
    ],
  },
]
