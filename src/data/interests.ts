import type { LucideIcon } from 'lucide-react'
import { Dumbbell, Film, PenTool, AudioWaveform } from 'lucide-react'

export interface Interest {
  id: string
  name: string
  description: string
  icon: LucideIcon
}

// Grounded in notes/phase-1.md's own list (gym, anime, drawing,
// deathcore) and what the rest of this codebase already proves rather
// than new claims: the hand-drawn motifs in src/components/motifs/
// (Phase 12), the music system's real influences and its switch to
// real, self-provided tracks (Phase 11, then Phase 15), and the anime
// references portfolio-build.md's own Design rules name directly.
// Nothing here is invented; each description points at something
// checkable elsewhere in this project instead of a vague claim about
// being "a fan of anime."
export const INTERESTS: Interest[] = [
  {
    id: 'gym',
    name: 'Gym & Calisthenics',
    icon: Dumbbell,
    description:
      "The part of the week that has nothing to do with a keyboard. No project, no deadline, just showing up and doing the work, which turns out to be a decent way to reset before going back to a hard bug.",
  },
  {
    id: 'anime',
    name: 'Anime',
    icon: Film,
    description:
      "Demon Slayer, Attack on Titan, Naruto, and Takopi's Original Sin aren't just references picked for a mood board. This site's ink transitions, tactical document framing, ember particles, and the deliberate tonal contrast on Lab's one joke card all trace back to those four specifically.",
  },
  {
    id: 'drawing',
    name: 'Drawing',
    icon: PenTool,
    description:
      'Every crow, sword, ink burst, and seal on this site is a hand-drawn SVG path in src/components/motifs/, not a stock asset or a generated image. This is the one interest that shows up literally in the source code, not just the mood.',
  },
  {
    id: 'music',
    name: 'Deathcore & Music',
    icon: AudioWaveform,
    description:
      "Lorna Shore, Pain Remains, and Bad Omens shaped this site's dark palette and restrained red before a line of layout code existed. The two tracks in the corner music widget are real audio I provided myself, not something pulled off the internet with a licensing question attached.",
  },
]
