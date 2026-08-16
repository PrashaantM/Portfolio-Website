import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { onClick, type ClickEvent, type ClickKind } from './sceneBus'
import { screenToWorld } from './screenToWorld'

interface Burst {
  id: number
  kind: ClickKind
  position: [number, number, number]
}

const BURST_LIFETIME = 900
const CLICK_DEPTH = 2

function InkBurst({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const spawnedAt = useRef(performance.now())
  const droplets = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5
        return { angle, distance: 0.4 + Math.random() * 0.6, drop: Math.random() * 0.3 }
      }),
    [],
  )

  useFrame(() => {
    const progress = Math.min(1, (performance.now() - spawnedAt.current) / BURST_LIFETIME)
    groupRef.current?.children.forEach((child, i) => {
      const droplet = droplets[i]
      if (!droplet) return
      child.position.x = Math.cos(droplet.angle) * droplet.distance * progress
      child.position.y = Math.sin(droplet.angle) * droplet.distance * progress - droplet.drop * progress * progress
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      material.opacity = 0.8 * (1 - progress)
    })
    if (ringRef.current) ringRef.current.scale.setScalar(0.2 + progress * 1.6)
    if (ringMaterialRef.current) ringMaterialRef.current.opacity = 0.6 * (1 - progress)
  })

  return (
    <group position={position}>
      <group ref={groupRef}>
        {droplets.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#c81e3a" transparent opacity={0.8} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.4, 0.48, 32]} />
        <meshBasicMaterial ref={ringMaterialRef} color="#c81e3a" transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

function TechBurst({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const materialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const spawnedAt = useRef(performance.now())

  useFrame(() => {
    const progress = Math.min(1, (performance.now() - spawnedAt.current) / BURST_LIFETIME)
    if (groupRef.current) {
      groupRef.current.rotation.z = progress * Math.PI
      groupRef.current.scale.setScalar(0.2 + progress * 1.2)
    }
    materialRefs.current.forEach((material) => {
      if (material) material.opacity = 1 - progress
    })
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <ringGeometry args={[0.3, 0.34, 6]} />
        <meshBasicMaterial
          ref={(el) => {
            materialRefs.current[0] = el
          }}
          color="#ededef"
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation-z={Math.PI / 6}>
        <ringGeometry args={[0.42, 0.45, 6]} />
        <meshBasicMaterial
          ref={(el) => {
            materialRefs.current[1] = el
          }}
          color="#c81e3a"
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/**
 * Listens for global clicks emitted by `InteractionEffects`,
 * unprojects the 2D click into world space at a fixed depth in front
 * of the camera, and spawns a short-lived 3D burst there: ink droplets
 * for a click on empty space, an angular hex-ring "confirm" burst for
 * a click on a real button/link.
 */
function ClickBurst3D() {
  const { camera, size } = useThree()
  const [bursts, setBursts] = useState<Burst[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    return onClick((event: ClickEvent) => {
      const world = screenToWorld(event.x, event.y, camera, size, CLICK_DEPTH)
      const burst: Burst = { id: nextId.current++, kind: event.kind, position: [world.x, world.y, world.z] }
      setBursts((current) => [...current, burst])
      setTimeout(() => {
        setBursts((current) => current.filter((b) => b.id !== burst.id))
      }, BURST_LIFETIME)
    })
  }, [camera, size])

  return (
    <>
      {bursts.map((burst) =>
        burst.kind === 'ink' ? (
          <InkBurst key={burst.id} position={burst.position} />
        ) : (
          <TechBurst key={burst.id} position={burst.position} />
        ),
      )}
    </>
  )
}

export default ClickBurst3D
