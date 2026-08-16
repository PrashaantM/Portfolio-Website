import type { LucideIcon } from 'lucide-react'
import {
  AudioWaveform,
  MicVocal,
  Workflow,
  Mail,
  Route,
  Sparkles,
  PenTool,
  SquareSplitHorizontal,
  Radar,
  Dumbbell,
} from 'lucide-react'

export interface LabIdea {
  id: string
  number: string
  name: string
  tagline: string
  concept: string
  visual: string
  tags: string[]
  icon: LucideIcon
  /** Marks the one deliberately-humorous idea (Phase 10's own
   *  "contrast between serious engineering and this idea" note) for
   *  the Takopi-style tonal-contrast treatment in LabCard. */
  funny?: boolean
}

// Source: portfolio-build.md Phase 10.1-10.10. Rewritten in the
// site's own voice rather than copied, since the brief describes each
// idea in outline form (concept bullets, "possible visual"), not
// ready-to-publish prose. Nothing invented beyond what the brief
// already specifies for each idea. See notes/phase-10.md.
export const LAB_IDEAS: LabIdea[] = [
  {
    id: 'song-mashup',
    number: '01',
    name: 'Song Mashup Generator',
    tagline: 'Pick two songs, align them by ear, let AI blend the rest.',
    concept:
      'A tool for building mashups: pull in songs from supported sources, manually line up the sections that should overlap, then let an AI-assisted pass generate the blend. The generated result stays editable afterward, with retiming for sections and eventually isolating vocals from instrumentals so a vocal line from one track can sit over the instrumental of another.',
    visual: 'An interactive waveform timeline, two tracks stacked and draggable against each other.',
    tags: ['Web Audio API', 'Audio Processing', 'AI-Assisted'],
    icon: AudioWaveform,
  },
  {
    id: 'vocal-analyzer',
    number: '02',
    name: 'Metal Vocal Analyzer',
    tagline: 'Pitch tracking works for clean vocals. Screams need a different approach entirely.',
    concept:
      'For clean singing, track the fundamental frequency, convert it to MIDI notes, and map out the melody, alongside formant and MFCC analysis to infer vowel shape. Screamed vocals break conventional pitch tracking outright, so that half needs a different toolkit: spectral flatness, zero-crossing rate, and rhythmic timing analysis to find structure in a signal that has no clean pitch to track in the first place.',
    visual: 'A live analysis dashboard: pitch, MIDI, formants, MFCCs, spectral flatness, zero-crossing rate, and rhythm, all updating together.',
    tags: ['Signal Processing', 'DSP', 'Python', 'Audio Analysis'],
    icon: MicVocal,
  },
  {
    id: 'codebase-intelligence',
    number: '03',
    name: 'Codebase Intelligence Tool',
    tagline: 'Turn a codebase into a map, not just a Claude Code instruction file.',
    concept:
      'An application that generates Claude Code instruction sets and project-specific prompts, then goes further: visually mapping a codebase\'s architecture, explaining it in plain language, and comparing it against engineering best practices to flag structural weaknesses. The goal is a tool that helps build a better development workflow, not just a prettier README.',
    visual: 'An interactive dependency graph (Frontend, API layer, Services, Database) with clickable nodes.',
    tags: ['Static Analysis', 'Graph Visualization', 'AI-Assisted'],
    icon: Workflow,
  },
  {
    id: 'email-filter',
    number: '04',
    name: 'Email Filtering Tool',
    tagline: 'Sort the newsletter from the message that actually needs a reply.',
    concept:
      'An automation experiment: categorize incoming email, detect newsletters and other low-priority noise, surface what actually needs attention, and suggest next actions, using AI classification to do the sorting instead of a pile of brittle keyword rules.',
    visual: 'An inbox triage view, incoming mail sorted into priority lanes in real time.',
    tags: ['AI Classification', 'Automation', 'Productivity'],
    icon: Mail,
  },
  {
    id: 'cs-roadmap',
    number: '05',
    name: 'CS Learning Roadmap',
    tagline: 'A GitHub-shaped map of what I actually know, and what I still need to learn.',
    concept:
      'A GitHub-like learning system where courses become roadmap nodes, projects become milestones, and notes attach directly to the topics they belong to. Progress gets tracked so past work stays revisitable, and an AI layer can answer questions, re-teach a concept that did not stick the first time, and flag actual knowledge gaps instead of assuming a completed course means a mastered topic.',
    visual: 'An interactive CS skill tree, branching from fundamentals out to specializations.',
    tags: ['Learning Systems', 'AI-Assisted', 'Data Modeling'],
    icon: Route,
  },
  {
    id: 'brainrot-sfx',
    number: '06',
    name: 'Claude Brainrot Sound Effects',
    tagline: 'Every Claude Code session, but with a laugh track.',
    concept:
      'A deliberately ridiculous developer-tool extension: sound effects for Claude Code interactions. A clean build gets one sound, a failed test gets another, a genuinely questionable AI decision gets its own cue, and a massive refactor gets something suitably dramatic. Not a serious engineering project, and that is the entire point. It sits next to the vocal analyzer and the codebase tool on purpose.',
    visual: 'A soundboard of trigger conditions mapped to sound effects, mid-trigger.',
    tags: ['Browser Extension', 'For Fun'],
    icon: Sparkles,
    funny: true,
  },
  {
    id: 'ai-drawing',
    number: '07',
    name: 'AI-Assisted Drawing Tool',
    tagline: 'Draw a rough shape, let AI interpret it, keep your own line work underneath.',
    concept:
      'A drawing app where the user\'s hand-drawn strokes stay the source of truth. Sketch a rough shape, tell it what the shape should become ("make this a sword"), and get a generated visual back that is built from that interpretation while preserving the original stroke structure underneath rather than replacing it outright.',
    visual: 'A hand-drawn stroke transforming step by step into a generated result, original linework still visible.',
    tags: ['Generative AI', 'Canvas', 'Creative Tools'],
    icon: PenTool,
  },
  {
    id: 'window-manager',
    number: '08',
    name: 'Split-Screen Window Manager',
    tagline: 'Too many tabs, too many windows, not enough layout.',
    concept:
      'A tool for organizing browser tabs, browser windows, desktop applications, and multiple workspaces into deliberate split-screen layouts, aimed squarely at reducing the chaos of managing too many open things at once rather than adding another tab-hoarding feature on top of it.',
    visual: 'A drag-and-snap layout grid, windows sliding into place as they are assigned.',
    tags: ['Desktop Tooling', 'UX', 'Productivity'],
    icon: SquareSplitHorizontal,
  },
  {
    id: 'network-analyzer',
    number: '09',
    name: 'Network Visibility Analyzer',
    tagline: 'Packet-analysis concepts, scoped to networks I actually own.',
    concept:
      'An educational network-analysis tool inspired by packet-analysis software, scoped deliberately to networks the user owns or authorized lab environments, not a tool for watching anyone else\'s traffic. It surfaces packet metadata, IP addresses, protocols, and live connections, with application identification where that is technically and legally sound, framed around learning how networks actually work rather than surveillance.',
    visual: 'A live connection map, protocols and endpoints updating as traffic flows.',
    tags: ['Networking', 'Packet Analysis', 'Education'],
    icon: Radar,
  },
  {
    id: 'workout-tracker',
    number: '10',
    name: 'Adaptive Unilateral Workout Tracker',
    tagline: 'Left and right sides do not always perform the same. Most trackers assume they do.',
    concept:
      'A workout tracker built around unilateral training: recording left and right performance separately, tracking reps per side, and estimating strength asymmetry over time instead of assuming both sides move together. Recommendations adjust to that asymmetry, aimed at supporting people who cannot train symmetrically rather than treating that as an edge case to ignore.',
    visual: 'A side-by-side left/right performance chart, the gap between them tracked over time.',
    tags: ['Fitness Tech', 'Data Tracking'],
    icon: Dumbbell,
  },
]
