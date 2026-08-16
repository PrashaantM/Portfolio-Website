import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
}

/** A small technical label - tech stack items, skill tags. Reused by Skills and Projects. */
function Badge({ children }: BadgeProps) {
  return (
    <span className="border-border text-text-secondary rounded-(--radius-button) border px-3 py-1 font-mono text-xs">
      {children}
    </span>
  )
}

export default Badge
