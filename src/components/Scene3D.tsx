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
 * The gate in front of Phase 15's WebGL layer, kept separate from
 * `src/three/Scene.tsx` itself so the check happens *before* that
 * chunk is even fetched: `React.lazy`'s dynamic `import()` only fires
 * once `<Scene />` actually renders, so a visitor with
 * `prefers-reduced-motion` set or no WebGL support never downloads any
 * of `src/three/*`, not just never sees it rendered. Progressive
 * enhancement, not a hard requirement — this site must never show a
 * blank/broken page to a recruiter on an old machine.
 */
function Scene3D() {
  const shouldReduceMotion = useReducedMotion()
  const [canRender, setCanRender] = useState(false)

  useEffect(() => {
    setCanRender(!shouldReduceMotion && supportsWebGL())
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
