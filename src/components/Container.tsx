import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

/** Constrains content to the page's max width and centers it. */
function Container({ children, className = '' }: ContainerProps) {
  return <div className={`container-page ${className}`.trim()}>{children}</div>
}

export default Container
