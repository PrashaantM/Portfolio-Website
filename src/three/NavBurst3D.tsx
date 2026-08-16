import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { onNavTransition } from './sceneBus'
import { screenToWorld } from './screenToWorld'

const DURATION = 700
const NAV_DEPTH = 3
const BASE_CAMERA_Z = 10
const BASE_FOV = 50
const RAY_COUNT = 10
const SPARK_COUNT = 10

interface Spark {
  angle: number
  distance: number
}

function NavBurstInstance({ position, onDone }: { position: [number, number, number]; onDone: () => void }) {
  const diskRef = useRef<THREE.Mesh>(null)
  const diskMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const raysRef = useRef<THREE.Group>(null)
  const sparksRef = useRef<THREE.Group>(null)
  const spawnedAt = useRef(performance.now())

  const sparks = useMemo<Spark[]>(
    () =>
      Array.from({ length: SPARK_COUNT }, (_, i) => ({
        angle: (i / SPARK_COUNT) * Math.PI * 2,
        distance: 1.2 + Math.random() * 1.4,
      })),
    [],
  )

  useFrame(() => {
    const elapsed = performance.now() - spawnedAt.current
    const progress = Math.min(1, elapsed / DURATION)
    const grow = 1 - Math.pow(1 - Math.min(1, progress * 2.2), 3)
    const fade = progress < 0.55 ? 1 : 1 - (progress - 0.55) / 0.45

    if (diskRef.current) diskRef.current.scale.setScalar(0.3 + grow * 9)
    if (diskMaterialRef.current) diskMaterialRef.current.opacity = 0.85 * fade

    if (raysRef.current) {
      raysRef.current.rotation.z = progress * Math.PI * 0.6
      raysRef.current.scale.setScalar(0.5 + grow * 7)
      raysRef.current.children.forEach((child) => {
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        material.opacity = 0.5 * fade
      })
    }

    if (sparksRef.current) {
      sparksRef.current.children.forEach((child, i) => {
        const spark = sparks[i]
        if (!spark) return
        child.position.x = Math.cos(spark.angle) * spark.distance * progress
        child.position.y = Math.sin(spark.angle) * spark.distance * progress
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        material.opacity = fade
      })
    }

    if (progress >= 1) onDone()
  })

  return (
    <group position={position}>
      <mesh ref={diskRef}>
        <circleGeometry args={[0.5, 48]} />
        <meshBasicMaterial ref={diskMaterialRef} color="#ff7a3c" transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={raysRef}>
        {Array.from({ length: RAY_COUNT }, (_, i) => (
          <mesh key={i} rotation-z={(i / RAY_COUNT) * Math.PI * 2}>
            <planeGeometry args={[0.06, 1.4]} />
            <meshBasicMaterial color="#c81e3a" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      <group ref={sparksRef}>
        {sparks.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshBasicMaterial color="#ffb347" transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/**
 * A sun-disc-and-rays flash (an original stand-in for Demon Slayer's
 * Hinokami Kagura, not a copy of it) that plays over the ~700ms window
 * `Navbar`'s `scrollIntoView` happens inside, hiding the DOM jump
 * under the flash so navigation never feels blocked on the animation
 * finishing. A brief camera punch-in on the whole scene (temporarily
 * pulling `camera.position.z`/`fov` back to baseline once the window
 * closes) sells extra weight without the disc/rays doing all the work
 * alone.
 *
 * A soft additive-glow-sprite version of this was tried in its place
 * and reverted: asked for specifically, this flat-geometry version
 * ("blocky" but "exactly what I wanted") is the intended look, not a
 * placeholder for something softer.
 */
function NavBurst3D() {
  const { camera, size } = useThree()
  const [active, setActive] = useState<{ id: number; position: [number, number, number] } | null>(null)
  const nextId = useRef(0)
  const punchUntil = useRef(0)

  useEffect(() => {
    return onNavTransition(({ originX, originY }) => {
      const world = screenToWorld(originX, originY, camera, size, NAV_DEPTH)
      setActive({ id: nextId.current++, position: [world.x, world.y, world.z] })
      punchUntil.current = performance.now() + DURATION
    })
  }, [camera, size])

  useFrame(() => {
    const remaining = punchUntil.current - performance.now()
    const perspectiveCamera = camera as THREE.PerspectiveCamera
    if (remaining > 0) {
      const t = 1 - Math.max(0, remaining) / DURATION
      const punch = Math.sin(Math.min(1, t * 2) * Math.PI) * 0.6
      perspectiveCamera.position.z = BASE_CAMERA_Z - punch
      perspectiveCamera.fov = BASE_FOV + punch * 4
      perspectiveCamera.updateProjectionMatrix()
    } else if (perspectiveCamera.position.z !== BASE_CAMERA_Z) {
      perspectiveCamera.position.z = BASE_CAMERA_Z
      perspectiveCamera.fov = BASE_FOV
      perspectiveCamera.updateProjectionMatrix()
    }
  })

  if (!active) return null

  return <NavBurstInstance key={active.id} position={active.position} onDone={() => setActive(null)} />
}

export default NavBurst3D
