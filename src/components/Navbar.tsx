import { useState, type MouseEvent } from 'react'
import { Menu, X } from 'lucide-react'
import Container from './Container'
import { playNavSlash } from '../lib/sfx'
import { emitNavTransition } from '../three/sceneBus'

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

  /**
   * Phase 15's "hinokami kagura"-style transition: instead of jumping
   * straight to the target, emit the burst's origin (the clicked
   * link's own position) into the WebGL scene via `sceneBus`, play the
   * whoosh, and only then scroll — 180ms in, partway through the
   * ~700ms flash `NavBurst3D` renders, so the jump is hidden under the
   * flash rather than happening before or after it. `href` stays a
   * real anchor throughout (`preventDefault` only fires once this
   * handler actually runs), so navigation still works even if
   * something here fails.
   */
  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    emitNavTransition(rect.left + rect.width / 2, rect.top + rect.height / 2)
    playNavSlash()
    setIsMenuOpen(false)
    window.setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, 180)
  }

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <a
          href="#hero"
          onClick={(event) => handleNavClick(event, '#hero')}
          className="font-display text-text-primary text-lg font-semibold"
        >
          Prashaant Mudgala
        </a>

        <ul className="hidden gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="text-text-secondary text-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="text-text-primary -m-2 p-2 md:hidden"
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
                onClick={(event) => handleNavClick(event, link.href)}
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
