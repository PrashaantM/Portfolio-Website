import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Container from './Container'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#lab', label: 'Lab' },
  { href: '#experience', label: 'Experience' },
  { href: '#interests', label: 'Interests' },
  { href: '#contact', label: 'Contact' },
]

/**
 * Sticky top nav. Below the `md` breakpoint the link list collapses
 * behind a menu button instead of shrinking to fit - a full
 * horizontal link row has no room on a phone, so it becomes a
 * different interaction rather than a smaller version of the same one.
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <a href="#hero" className="font-display text-text-primary text-lg font-semibold">
          Prashaant Mudgala
        </a>

        <ul className="hidden gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-text-secondary text-sm">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="text-text-primary md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className="sr-only">
            {isMenuOpen ? 'Close menu' : 'Open menu'}
          </span>
        </button>
      </Container>

      {isMenuOpen && (
        <ul
          id="mobile-nav"
          className="border-border flex flex-col gap-1 border-t px-6 py-4 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-text-secondary block py-2 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export default Navbar
