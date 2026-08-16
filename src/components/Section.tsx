import type { ReactNode } from 'react'
import Container from './Container'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
}

/**
 * The wrapper every page section (Hero, About, Skills, ...) is built
 * on: consistent vertical rhythm via the `.section` token, and
 * horizontal width via Container. `id` is required since the nav
 * links to sections by anchor.
 */
function Section({ id, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`section ${className}`.trim()}>
      <Container>{children}</Container>
    </section>
  )
}

export default Section
