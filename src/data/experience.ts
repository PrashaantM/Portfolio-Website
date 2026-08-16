import type { LucideIcon } from 'lucide-react'
import { Building2, Briefcase, Megaphone, Scale, Microscope } from 'lucide-react'

export interface ExperienceEntry {
  id: string
  title: string
  organization: string
  location: string
  start: string
  end: string
  icon: LucideIcon
  bullets: string[]
}

// Source of truth: public/PrashaantMudgala_Resume.pdf, same rule as
// every other content file in src/data/. Bullets are rewritten in this
// site's own voice rather than copied resume fragments (same approach
// Phase 9 used for project descriptions), but every number, date, and
// title matches the resume exactly. Two of these five (Tythe Labs and
// the research role) are also covered narratively in About.tsx; that
// overlap is expected, the same way a resume and a LinkedIn About
// section cover some of the same ground from different angles. This
// section is the scannable, dated version.
export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'tythe-labs',
    title: 'Software Developer Intern',
    organization: 'Tythe Labs, Inc.',
    location: 'Los Angeles, CA (Remote)',
    start: 'May 2025',
    end: 'Aug 2025',
    icon: Building2,
    bullets: [
      "Built the React interfaces for Tythe Labs' on-chain credit protocol platform, including reusable components for credit-profile and dashboard features.",
      'Moved into the backend partway through the internship: wrote the Python services and REST API endpoints those same components called, and integrated the database models and external services behind them.',
    ],
  },
  {
    id: 'best-buy',
    title: 'Omnichannel Specialist',
    organization: 'Best Buy Canada',
    location: 'Kelowna, BC',
    start: 'Jun 2025',
    end: 'Present',
    icon: Briefcase,
    bullets: [
      'Drove $24,000 in Protection Plan revenue at a peak 10% attachment rate, ranking top 5 out of more than 15 associates.',
      'Named Employee of the Month twice in under a year (August 2025, June 2026).',
    ],
  },
  {
    id: 'age-link',
    title: 'Student Communications Coordinator',
    organization: 'Age-Link Society',
    location: 'Kelowna, BC',
    start: 'Jun 2025',
    end: 'Apr 2026',
    icon: Megaphone,
    bullets: [
      'Promoted twice in four months: started as a Junior Financial Advisor, moved up to Senior Financial Advisor, then to Student Communications Coordinator.',
      'Grew event participation 50%, from 70 to 105 attendees, by segmenting outreach to more than 100 students.',
      "Coordinated logistics for 3+ events every semester across 5+ executives, and built a record-keeping system so the next coordinator wouldn't start from zero.",
    ],
  },
  {
    id: 'suo-policy',
    title: 'Student-at-Large, SUO Policy Committee',
    organization: 'UBC Okanagan Students’ Union',
    location: 'Kelowna, BC',
    start: 'Jun 2025',
    end: 'Apr 2026',
    icon: Scale,
    bullets: [
      'Reviewed policy and bylaw proposals and refined motion wording before it went to the board for a vote.',
      'Awarded a Leadership Recognition Certificate in 2026 for that work.',
    ],
  },
  {
    id: 'research',
    title: 'Research Contributor',
    organization: 'University of British Columbia, Okanagan (Prof. AKM Amanat Ullah)',
    location: 'Kelowna, BC',
    start: 'Jan 2024',
    end: 'Aug 2025',
    icon: Microscope,
    bullets: [
      'Synthesized and coded more than 500 academic papers as part of a 10-member systematic literature review team.',
      'Co-defined the team-wide evaluation criteria and inclusion/exclusion framework, improving how consistently different coders applied the same rules.',
    ],
  },
]
