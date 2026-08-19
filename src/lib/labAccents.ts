export interface LabAccent {
  icon: string
  bar: string
  hoverBorder: string
  hoverGlow: string
}

// Shades of the site's own red accent (`--color-accent` #c81e3a and
// `--color-accent-secondary` #7a1524 in theme.css), darkest to lightest,
// so the "Built" grid in Lab.tsx reads as one color-coded family rather
// than borrowing hues from elsewhere. Written as complete literal class
// strings, not built from a runtime hex variable, so Tailwind's
// build-time scanner can pick them up statically. Concepts deliberately
// get no per-card accent at all; see LabCard's fixed dashed-red styling.
export const BUILD_ACCENTS: LabAccent[] = [
  {
    icon: 'text-[#7a1524]',
    bar: 'bg-[#7a1524]',
    hoverBorder: 'hover:border-[#7a1524]',
    hoverGlow: 'hover:shadow-[0_0_28px_-10px_#7a1524]',
  },
  {
    icon: 'text-[#9c1e2e]',
    bar: 'bg-[#9c1e2e]',
    hoverBorder: 'hover:border-[#9c1e2e]',
    hoverGlow: 'hover:shadow-[0_0_28px_-10px_#9c1e2e]',
  },
  {
    icon: 'text-[#c81e3a]',
    bar: 'bg-[#c81e3a]',
    hoverBorder: 'hover:border-[#c81e3a]',
    hoverGlow: 'hover:shadow-[0_0_28px_-10px_#c81e3a]',
  },
  {
    icon: 'text-[#e14a5a]',
    bar: 'bg-[#e14a5a]',
    hoverBorder: 'hover:border-[#e14a5a]',
    hoverGlow: 'hover:shadow-[0_0_28px_-10px_#e14a5a]',
  },
  {
    icon: 'text-[#ef7a6a]',
    bar: 'bg-[#ef7a6a]',
    hoverBorder: 'hover:border-[#ef7a6a]',
    hoverGlow: 'hover:shadow-[0_0_28px_-10px_#ef7a6a]',
  },
]

export function buildAccentFor(index: number): LabAccent {
  return BUILD_ACCENTS[index % BUILD_ACCENTS.length]
}
