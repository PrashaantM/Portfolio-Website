interface CrowProps {
  size?: number
  className?: string
}

/**
 * An original crow-in-flight silhouette, plain SVG paths built from
 * scratch rather than a found image. Demon Slayer's Kasugai crows are
 * message-carriers, which is the actual reason a crow (not a generic
 * bird) fits this site: it is the same "something arrives, quietly,
 * in the corner of the screen" role in Hero. See notes/phase-12.md
 * for why every image on this site is drawn rather than sourced.
 */
function Crow({ size = 64, className = '' }: CrowProps) {
  return (
    <svg
      width={size}
      height={size * 0.42}
      viewBox="0 0 120 50"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M60 26
           C 50 10, 30 4, 4 14
           C 22 18, 38 22, 50 27
           C 38 32, 22 36, 4 40
           C 30 48, 50 40, 58 30
           C 58 34, 60 38, 64 40
           C 63 36, 62 32, 62 28
           C 70 40, 90 48, 116 40
           C 98 36, 82 32, 70 27
           C 82 22, 98 18, 116 14
           C 90 4, 70 10, 60 26 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default Crow
