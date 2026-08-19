interface SealProps {
  size?: number
  className?: string
}

/**
 * An original geometric seal/emblem standing in for the Naruto/Demon
 * Slayer "seal" motif: a double ring and an angular "PM" monogram
 * instead of any borrowed kanji or copyrighted mark (the brief's own
 * rule: "do not use copyrighted character images... prefer original
 * motifs that communicate the inspiration"). Pairs with the
 * `.hover-glitch` utility wherever it's used as an interactive accent
 * rather than pure decoration.
 */
function Seal({ size = 40, className = '' }: SealProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="24" cy="24" r="22.5" stroke="var(--color-accent)" strokeWidth="1" opacity="0.7" />
      <circle cx="24" cy="24" r="18.5" stroke="var(--color-accent)" strokeWidth="1" opacity="0.35" />
      <path
        d="M14 32V16h4.5c3 0 4.8 1.6 4.8 4.2 0 2.5-1.8 4.1-4.8 4.1H16"
        stroke="var(--color-text-primary)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 32V16l5 10 5-10v16"
        stroke="var(--color-text-primary)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Seal
