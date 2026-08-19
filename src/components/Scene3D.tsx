import { lazy, Suspense, useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

const Scene = lazy(() => import('../three/Scene'))

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * The gate in front of the WebGL layer, kept separate from
 * `src/three/Scene.tsx` itself so the check happens *before* that
 * chunk is even fetched: `React.lazy`'s dynamic `import()` only fires
 * once `<Scene />` actually renders, so a visitor with
 * `prefers-reduced-motion` set or no WebGL support never downloads any
 * of `src/three/*`, not just never sees it rendered. Progressive
 * enhancement, not a hard requirement: this site must never show a
 * blank/broken page to a recruiter on an old machine.
 *
 * The mount effect defers the render check with `requestIdleCallback`
 * instead of flipping `canRender` synchronously on the first render.
 * Flipping it synchronously starts the ~990KB `Scene` chunk's
 * download-parse-execute cycle immediately, competing with Hero's own
 * entrance animation for main-thread time; measured with Lighthouse
 * against a production build, that pushed Total Blocking Time to
 * 670ms and delayed the Hero heading (the page's actual Largest
 * Contentful Paint element) from finishing paint until 3.4s, well
 * past when its own 0.5s fade-up animation should have completed.
 * `requestIdleCallback` (falling back to a short `setTimeout` on
 * Safari, which doesn't implement it) defers the same check and the
 * dynamic import it triggers until the browser has already gotten
 * through the initial paint and any higher-priority work, so the
 * heavy chunk downloads and evaluates without racing the content a
 * visitor actually came to see first.
 */
function Scene3D() {
  const shouldReduceMotion = useReducedMotion()
  const [canRender, setCanRender] = useState(false)

  useEffect(() => {
    const check = () => setCanRender(!shouldReduceMotion && supportsWebGL())

    if (typeof requestIdleCallback !== 'function') {
      const timeoutId = window.setTimeout(check, 200)
      return () => window.clearTimeout(timeoutId)
    }

    const idleId = requestIdleCallback(check)
    return () => cancelIdleCallback(idleId)
  }, [shouldReduceMotion])

  if (!canRender) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </div>
  )
}

export default Scene3D
