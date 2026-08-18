import Container from './Container'

const FOOTER_LINKS = [
  { href: 'https://github.com/PrashaantM', label: 'GitHub' },
  { href: 'https://linkedin.com/in/prashaantmudgala', label: 'LinkedIn' },
  { href: `${import.meta.env.BASE_URL}PrashaantMudgala_Resume.pdf`, label: 'Resume' },
]

/**
 * Name, tagline, copyright, real GitHub/LinkedIn/resume links (Phase
 * 23, once Contact had established these are the right three, phone
 * number deliberately excluded), and a way back to the top.
 */
function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-border border-t">
      <Container className="text-text-secondary flex flex-col items-center gap-4 py-10 text-sm sm:flex-row sm:justify-between">
        <p>&copy; {year} Prashaant Mudgala. Built by hand, one phase at a time.</p>
        <nav className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-text-secondary hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
          <a href="#hero" className="text-text-secondary hover:text-text-primary">
            Back to top
          </a>
        </nav>
      </Container>
    </footer>
  )
}

export default Footer
