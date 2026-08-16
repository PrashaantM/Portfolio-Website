import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// No `test.globals: true` in vitest.config.ts (explicit imports of
// `describe`/`it`/`expect` everywhere instead), so Testing Library's
// own auto-cleanup-via-global-afterEach never registers on its own.
// Without this, every `render()` after the first in a file keeps
// piling more copies into the same jsdom `document`, since nothing
// ever unmounts the previous one.
afterEach(cleanup)

// jsdom implements neither of these, and both are load-bearing across
// this codebase: `useReducedMotion` (Motion) reads `matchMedia` under
// the hood, and every scroll-triggered `whileInView`/`Reveal`/`DrawLine`
// component constructs a real `IntersectionObserver`. Without these
// stubs, mounting almost any section throws instead of rendering.
// Neither needs to actually fire a callback for component tests here:
// the DOM content a component renders doesn't depend on the observer
// ever reporting an intersection, only on the observer *existing*.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly scrollMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}
window.IntersectionObserver = MockIntersectionObserver

class MockResizeObserver implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = MockResizeObserver

// jsdom doesn't implement layout, so `scrollIntoView` (Navbar's own
// nav-click handler, every section anchor) has nothing real to do -
// stubbed to a no-op rather than left to log jsdom's "not implemented"
// warning on every test that clicks a nav link.
Element.prototype.scrollIntoView = () => {}

