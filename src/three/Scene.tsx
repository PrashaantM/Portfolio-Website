import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import CrowFlock3D from './CrowFlock3D'
import EmberField3D from './EmberField3D'
import SealField3D from './SealField3D'
import ClickBurst3D from './ClickBurst3D'
import NavBurst3D from './NavBurst3D'
import ScrollTrail3D from './ScrollTrail3D'

/**
 * The WebGL scene content itself. Dynamically imported by
 * `src/components/Scene3D.tsx`, which is what actually decides
 * whether to fetch this chunk at all (reduced-motion / no-WebGL
 * visitors never trigger the import). Everything here composes into
 * one fixed, transparent, `pointer-events-none` `<Canvas>`, a
 * backdrop, never something that can block interaction with the real
 * page underneath it.
 */
function Scene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 10], fov: 50 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#c81e3a" />
        <CrowFlock3D />
        <EmberField3D />
        <SealField3D />
        <ClickBurst3D />
        <NavBurst3D />
        <ScrollTrail3D />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}

export default Scene
