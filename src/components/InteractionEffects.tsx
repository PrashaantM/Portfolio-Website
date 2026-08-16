import { useEffect } from 'react'
import { playHighTechClick, playInkSplash } from '../lib/sfx'
import { emitClick, tryEmberHit } from '../three/sceneBus'

const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [role="button"]'

/**
 * Phase 15's global click classifier: one delegated `document`
 * listener instead of editing every component that renders a button
 * or link. A click on any real interactive element gets the
 * "high-tech" feedback (sound + `ClickBurst3D`'s tech burst);
 * everywhere else gets the "ink splash" feedback, unless the click
 * actually landed on a live ember (`tryEmberHit`), in which case
 * `EmberField3D` already handled its own sound/effect and the ink
 * splash is skipped so the two don't stack. Elements inside `<header>`
 * are skipped entirely: Navbar drives its own bigger transition and
 * sound for nav-link clicks (`NavBurst3D`), and firing both here would
 * double up the sound.
 */
function InteractionEffects() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return

      const interactive = target.closest(INTERACTIVE_SELECTOR)
      if (interactive?.closest('header')) return

      if (interactive) {
        playHighTechClick()
        emitClick(event.clientX, event.clientY, 'tech')
      } else if (!tryEmberHit(event.clientX, event.clientY)) {
        playInkSplash()
        emitClick(event.clientX, event.clientY, 'ink')
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}

export default InteractionEffects
