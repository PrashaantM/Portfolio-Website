interface SwordProps {
  size?: number
  className?: string
  /** Blade/guard/pommel color. The handle wrap always uses the accent. */
  bladeColor?: string
}

/**
 * An original katana silhouette, drawn in a horizontal resting pose
 * (tip left, pommel right) so a consumer can rotate it freely for a
 * slash motion without the angle being baked into the path. Used by
 * `SwordSlash` (Phase 13's `drawLine`-adjacent vocabulary, Demon
 * Slayer's core motif) rather than as standalone decoration.
 */
function Sword({ size = 160, className = '', bladeColor = 'currentColor' }: SwordProps) {
  const height = size * (30 / 220)

  return (
    <svg width={size} height={height} viewBox="0 0 220 30" fill="none" className={className}>
      {/* Blade */}
      <path
        d="M0 15 Q 60 4 140 9 L 150 15 L 140 21 Q 60 26 0 15 Z"
        fill={bladeColor}
      />
      {/* Guard (tsuba) */}
      <rect x="151" y="3" width="6" height="24" rx="2" fill={bladeColor} opacity="0.85" />
      {/* Handle (tsuka) */}
      <rect x="158" y="9.5" width="50" height="11" rx="4" fill={bladeColor} opacity="0.6" />
      {/* Wrap detail */}
      <g stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round">
        <line x1="168" y1="9.5" x2="174" y2="20.5" />
        <line x1="180" y1="9.5" x2="186" y2="20.5" />
        <line x1="192" y1="9.5" x2="198" y2="20.5" />
      </g>
      {/* Pommel */}
      <circle cx="211" cy="15" r="5" fill={bladeColor} opacity="0.85" />
    </svg>
  )
}

export default Sword
