/**
 * Invisible until focused. Lets a keyboard user jump past the nav
 * straight to the page content instead of tabbing through every link
 * first. This is the first focusable element on the page.
 */
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="bg-accent text-text-primary focus-visible:outline-text-primary fixed left-4 top-4 z-100 -translate-y-24 rounded-(--radius-button) px-4 py-2 font-medium transition-transform focus-visible:translate-y-0 focus-visible:outline focus-visible:outline-offset-2"
    >
      Skip to main content
    </a>
  )
}

export default SkipLink
