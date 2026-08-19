import { useEffect, useState } from 'react'

const QUERY = '(max-height: 500px) and (orientation: landscape)'

/**
 * True on short phone-landscape viewports (667x375 .. 932x430 in this
 * site's own test matrix), false everywhere else including desktop.
 * Needed because several sections gate their `whileInView` entrance on
 * an `amount` (fraction of the target's own area visible) tuned for
 * tall portrait/desktop viewports; a section's card grid is often
 * taller than an entire phone-landscape viewport, so that fraction
 * never clears even once the grid has scrolled fully into view,
 * leaving it stuck at `opacity: 0`. Mirrors the CSS-side
 * `phone-landscape:` variant in theme.css so both layers agree on the
 * same breakpoint.
 */
export function usePhoneLandscape() {
  const [isPhoneLandscape, setIsPhoneLandscape] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY)
    const handleChange = () => setIsPhoneLandscape(mediaQueryList.matches)
    handleChange()
    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [])

  return isPhoneLandscape
}
