interface FlameBreathProps {
  size?: number
  className?: string
}

/**
 * An ambient flame-breathing accent: Demon Slayer's core motif is
 * named after breath (Flame Breathing, Water Breathing), so this
 * reads as fire with a slow inhale/exhale rhythm rather than a
 * generic glow. Pure CSS (`.flame-breathe`/`.flame-layer` in
 * motifs.css), same reasoning as `ParticleField`: the automatic
 * `prefers-reduced-motion` override in base.css already collapses
 * every animation here to one static frame, so no separate
 * reduced-motion branch is needed in this component.
 *
 * No `position` set on the root here on purpose. The `.flame-layer`
 * children need *some* positioned ancestor for their `inset: 0`, but
 * it does not have to be this exact element with one exact value:
 * baking in `relative` here once actually shipped with a real bug,
 * since `absolute` passed in via `className` (to place this as an
 * overlay) lost to the hardcoded `relative` in Tailwind's stylesheet
 * ordering, so the component sat in normal document flow (claiming
 * real height) instead of overlaying anything. The caller supplies
 * `absolute` or `relative` through `className` instead.
 */
function FlameBreath({ size = 380, className = '' }: FlameBreathProps) {
  return (
    <div
      aria-hidden="true"
      className={`flame-breathe pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="flame-layer"
        style={{
          animationDelay: '0s',
          background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
        }}
      />
      <div
        className="flame-layer"
        style={{
          animationDelay: '0.6s',
          background: 'radial-gradient(circle, #ff7a3c 0%, transparent 70%)',
        }}
      />
      <div
        className="flame-layer"
        style={{
          animationDelay: '1.1s',
          background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 65%)',
        }}
      />
    </div>
  )
}

export default FlameBreath
