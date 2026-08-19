import type { LucideIcon } from 'lucide-react'
import { Dumbbell, Film, PenTool, AudioWaveform } from 'lucide-react'

export interface Interest {
  id: string
  name: string
  description: string
  icon: LucideIcon
}

// Feeds Interests.tsx's card grid.
export const INTERESTS: Interest[] = [
  {
    id: 'movies',
    name: 'Movies & TV Shows',
    icon: Film,
    description:
      'Movies and TV shows are a big source of inspiration for me, especially when it comes to visuals, storytelling, and the way things are presented. I’ll watch something and sometimes come away thinking, “I want to make something that cool.” I learn a lot from them, and they motivate me to keep improving and pushing myself.',
  },
  {
    id: 'gym',
    name: 'Gym & Calisthenics',
    icon: Dumbbell,
    description:
      'I like lifting and calisthenics, although Poland syndrome makes keeping things balanced a bit more interesting. My right side keeps getting stronger than my left, so apparently even my muscles have decided to compete with each other. I’m mostly just trying to get stronger, do something I genuinely enjoy, and build more confidence along the way.',
  },
  {
    id: 'art',
    name: 'Art',
    icon: PenTool,
    description:
      'Art is something I come back to every once in a while when I have some free time or feel like creating something just for fun. I’ve always enjoyed drawing and seeing an idea slowly turn into something I can actually look at. Sometimes it turns out great, and sometimes I decide it belongs in the recycling bin.',
  },
  {
    id: 'music',
    name: 'Deathcore & Music',
    icon: AudioWaveform,
    description:
      'Deathcore isn’t all I listen to, but it’s definitely my favourite genre. Lorna Shore is my favourite artist, and I’m always drawn to melancholic music too, regardless of the genre. I listen to a pretty wide mix of music depending on what I’m doing or how I’m feeling.',
  },
]
