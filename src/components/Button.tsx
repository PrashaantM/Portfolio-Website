import type { AnchorHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

const VARIANT_CLASSES = {
  primary: 'bg-accent text-text-primary hover:bg-accent-secondary',
  secondary:
    'border-border text-text-primary hover:border-accent border bg-transparent',
}

/**
 * Always an <a>: every current use case is navigation (a section
 * anchor, an external link), not an in-page action, so there's no
 * <button type="button"> case to support yet.
 */
function Button({ children, variant = 'primary', className = '', ...anchorProps }: ButtonProps) {
  return (
    <a
      className={`btn-tech h-(--size-button-md) rounded-(--radius-button) focus-visible:outline-text-primary inline-flex items-center justify-center px-6 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-offset-2 ${VARIANT_CLASSES[variant]} ${className}`.trim()}
      {...anchorProps}
    >
      {children}
    </a>
  )
}

export default Button
