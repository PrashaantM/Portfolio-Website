export interface LabAccent {
  icon: string
  bar: string
  hoverBorder: string
  hoverGlow: string
}

// A small set of curated hues distinct from the site's semantic colors
// (red accent, green success/BUILT, amber warning/CONCEPT), so each Lab
// card reads as its own specimen at a glance instead of all fifteen
// sharing one accent. Written as complete literal class strings (not
// built from a runtime hex variable) so Tailwind's build-time scanner
// picks them up. Five colors against a 3-column grid never repeats on
// an adjacent card: index % 5 never lands the same color twice in the
// same row or column for this section's actual card count.
export const LAB_ACCENTS: LabAccent[] = [
  {
    icon: 'text-[#3fa6a3]',
    bar: 'bg-[#3fa6a3]',
    hoverBorder: 'hover:border-[#3fa6a3]',
    hoverGlow: 'hover:shadow-[0_0_28px_-10px_#3fa6a3]',
  },
  {
    icon: 'text-[#5b8fd6]',
    bar: 'bg-[#5b8fd6]',
    hoverBorder: 'hover:border-[#5b8fd6]',
    hoverGlow: 'hover:shadow-[0_0_28px_-10px_#5b8fd6]',
  },
  {
    icon: 'text-[#9179d6]',
    bar: 'bg-[#9179d6]',
    hoverBorder: 'hover:border-[#9179d6]',
    hoverGlow: 'hover:shadow-[0_0_28px_-10px_#9179d6]',
  },
  {
    icon: 'text-[#d1699a]',
    bar: 'bg-[#d1699a]',
    hoverBorder: 'hover:border-[#d1699a]',
    hoverGlow: 'hover:shadow-[0_0_28px_-10px_#d1699a]',
  },
  {
    icon: 'text-[#c47a45]',
    bar: 'bg-[#c47a45]',
    hoverBorder: 'hover:border-[#c47a45]',
    hoverGlow: 'hover:shadow-[0_0_28px_-10px_#c47a45]',
  },
]

export function labAccentFor(index: number): LabAccent {
  return LAB_ACCENTS[index % LAB_ACCENTS.length]
}
