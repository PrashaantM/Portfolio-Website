import Container from './Container'

/**
 * Deliberately minimal for now: name, tagline, copyright, and a way
 * back to the top. Real GitHub/LinkedIn/resume links land in Phase 23
 * once there's an actual URL to point them at, rather than shipping
 * placeholder hrefs here.
 */
function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-border border-t">
      <Container className="text-text-secondary flex flex-col items-center gap-4 py-10 text-sm sm:flex-row sm:justify-between">
        <p>&copy; {year} Prashaant Mudgala. Built by hand, one phase at a time.</p>
        <a href="#hero" className="text-text-secondary">
          Back to top
        </a>
      </Container>
    </footer>
  )
}

export default Footer
