import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'
import { getScrollVelocity } from './sceneBus'

const EDGE_X = 8.6
const VELOCITY_NORMALIZER = 25

/**
 * A small emissive point riding one edge of the scene. It barely moves
 * at rest, so drei's `Trail` (which renders a fading ribbon behind the
 * wrapped mesh's actual position history) has nothing to draw; once
 * scroll velocity picks up, both the point's swing amplitude/frequency
 * and its own opacity scale with it, so the trail only reads as an
 * "energy trail" during an actual fast scroll.
 */
function EdgeTrail({ side }: { side: -1 | 1 }) {
  const pointRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((state) => {
    const magnitude = Math.min(1, Math.abs(getScrollVelocity()) / VELOCITY_NORMALIZER)
    const t = state.clock.elapsedTime
    const amplitude = 0.2 + magnitude * 3.4
    const freq = 3 + magnitude * 10

    if (pointRef.current) {
      pointRef.current.position.set(side * EDGE_X, Math.sin(t * freq) * amplitude, 1)
    }
    if (materialRef.current) {
      materialRef.current.opacity = magnitude * 0.9
    }
  })

  return (
    <Trail width={3} length={5} color="#c81e3a" attenuation={(t) => t * t} decay={3}>
      <mesh ref={pointRef}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial ref={materialRef} color="#ff7a3c" transparent opacity={0} depthWrite={false} />
      </mesh>
    </Trail>
  )
}

function ScrollTrail3D() {
  return (
    <>
      <EdgeTrail side={-1} />
      <EdgeTrail side={1} />
    </>
  )
}

export default ScrollTrail3D
