import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'

// playNavSlash constructs a real AudioContext, which jsdom doesn't
// implement. sceneBus is left real: it's plain pub/sub with no
// browser API dependency, so there's nothing to mock.
vi.mock('../lib/sfx', () => ({ playNavSlash: vi.fn() }))

describe('Navbar', () => {
  it('renders every section link', () => {
    render(<Navbar />)
    for (const label of ['About', 'Skills', 'Projects', 'Lab', 'Experience', 'Interests', 'Contact']) {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0)
    }
  })

  it('opens the mobile menu on toggle and closes it after a link click', async () => {
    const user = userEvent.setup()
    const { container } = render(<Navbar />)

    const toggle = screen.getByRole('button', { name: /open menu/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(container.querySelector('#mobile-nav')).not.toBeInTheDocument()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const mobileNav = container.querySelector('#mobile-nav')
    expect(mobileNav).toBeInTheDocument()

    const mobileAboutLink = mobileNav!.querySelector('a[href="#about"]')
    await user.click(mobileAboutLink!)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(container.querySelector('#mobile-nav')).not.toBeInTheDocument()
  })
})
