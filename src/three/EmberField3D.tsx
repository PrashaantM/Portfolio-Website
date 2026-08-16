import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { registerEmberHitTest, emitEmberDoused } from './sceneBus'
import { playNavSlash } from '../lib/sfx'

const EMBER_COUNT = 90
const HIT_RADIUS = 26
const PARKED_Y = 9999
const EXTINGUISH_LIFETIME = 1000
const RESPAWN_DELAY = 30000

function createGlowTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.35, 'rgba(200,30,58,0.9)')
    gradient.addColorStop(1, 'rgba(200,30,58,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

interface EmberLayout {
  x: number
  baseY: number
  z: number
  speed: number
  driftFreq: number
  driftAmp: number
  phase: number
}

function createLayout(): EmberLayout[] {
  return Array.from({ length: EMBER_COUNT }, () => ({
    x: (Math.random() - 0.5) * 22,
    baseY: (Math.random() - 0.5) * 14,
    z: -4 + Math.random() * 6,
    speed: 0.15 + Math.random() * 0.25,
    driftFreq: 0.2 + Math.random() * 0.4,
    driftAmp: 0.4 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2,
  }))
}

interface ExtinguishBurst {
  id: number
  position: [number, number, number]
}

/**
 * A short white/blue "doused" flash at a clicked ember's last position:
 * a shrinking white flash core, an expanding blue ring, and a handful
 * of wisps drifting outward and slightly upward like steam. Deliberate
 * color swap from the ember's own red/orange glow so a click reads as
 * "put out" rather than just another burst of fire.
 */
function EmberExtinguish({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const coreMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const spawnedAt = useRef(performance.now())
  const wisps = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        angle: (i / 6) * Math.PI * 2 + Math.random() * 0.4,
        distance: 0.3 + Math.random() * 0.35,
        color: i % 2 === 0 ? '#ffffff' : '#5ec8f2',
      })),
    [],
  )

  useFrame(() => {
    const progress = Math.min(1, (performance.now() - spawnedAt.current) / EXTINGUISH_LIFETIME)
    if (coreMaterialRef.current) coreMaterialRef.current.opacity = 1 - progress
    if (ringRef.current) ringRef.current.scale.setScalar(0.2 + progress * 1.3)
    if (ringMaterialRef.current) ringMaterialRef.current.opacity = 0.75 * (1 - progress)
    groupRef.current?.children.forEach((child, i) => {
      const wisp = wisps[i]
      if (!wisp) return
      child.position.x = Math.cos(wisp.angle) * wisp.distance * progress
      child.position.y = Math.sin(wisp.angle) * wisp.distance * progress + progress * 0.2
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      material.opacity = 0.9 * (1 - progress)
    })
  })

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial ref={coreMaterialRef} color="#ffffff" transparent opacity={1} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.18, 0.23, 24]} />
        <meshBasicMaterial
          ref={ringMaterialRef}
          color="#5ec8f2"
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <group ref={groupRef}>
        {wisps.map((wisp, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={wisp.color} transparent opacity={0.9} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/**
 * Sitewide ambient ember layer: one `Points` draw call rather than N
 * meshes, drifting slowly upward with per-particle sway and looping
 * back to the bottom once off the top. Additive to, not a replacement
 * for, Lab's existing denser/audio-reactive CSS `ParticleField`
 * (`src/components/ParticleField.tsx`) — that one stays exactly as
 * tuned. The glow sprite is a radial gradient painted on an offscreen
 * canvas at runtime, the same "nothing sourced" reasoning as the
 * existing noise-background SVG in `motifs.css`.
 *
 * Also owns click-to-extinguish: since the WebGL canvas is
 * `pointer-events-none` (it must never block the real page), there's no
 * native way to hit-test a point in this `Points` draw call from a
 * click. Instead this registers a hit tester with `sceneBus` that
 * `InteractionEffects`'s existing delegated click handler calls with
 * the raw screen coordinate; a hit projects each live ember's current
 * world position back to screen space (the inverse of `screenToWorld`)
 * and picks the nearest one inside `HIT_RADIUS`. A hit ember is parked
 * far offscreen (cheap "disappear" without a per-point size/opacity
 * shader) and a one-second white/blue `EmberExtinguish` burst plays at
 * its last position, using the same `playNavSlash` cue as a nav-link
 * click. A doused ember comes back to life `RESPAWN_DELAY` later:
 * flipping its `alive` flag back on is all that's needed, since the
 * drift formula in the frame loop is driven by absolute clock time
 * rather than a per-ember elapsed timer, so it simply resumes wherever
 * that formula already puts it rather than needing its own position
 * reset.
 */
function EmberField3D() {
  const { camera, size } = useThree()
  const layout = useMemo(createLayout, [])
  const texture = useMemo(createGlowTexture, [])
  const pointsRef = useRef<THREE.Points>(null)
  const aliveRef = useRef<boolean[]>(new Array(EMBER_COUNT).fill(true))
  const [bursts, setBursts] = useState<ExtinguishBurst[]>([])
  const nextBurstId = useRef(0)

  const positions = useMemo(() => {
    const array = new Float32Array(EMBER_COUNT * 3)
    layout.forEach((ember, i) => {
      array[i * 3] = ember.x
      array[i * 3 + 1] = ember.baseY
      array[i * 3 + 2] = ember.z
    })
    return array
  }, [layout])

  useFrame((state) => {
    const geometry = pointsRef.current?.geometry
    if (!geometry) return
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute
    const t = state.clock.elapsedTime
    layout.forEach((ember, i) => {
      if (!aliveRef.current[i]) return
      const y = ((ember.baseY + t * ember.speed + 7) % 14) - 7
      const x = ember.x + Math.sin(t * ember.driftFreq + ember.phase) * ember.driftAmp
      positionAttr.setXYZ(i, x, y, ember.z)
    })
    positionAttr.needsUpdate = true
  })

  useEffect(() => {
    const worldPosition = new THREE.Vector3()

    function testEmberHit(clientX: number, clientY: number): boolean {
      const positionAttr = pointsRef.current?.geometry.attributes.position as
        | THREE.BufferAttribute
        | undefined
      if (!positionAttr) return false

      let closestIndex = -1
      let closestDistance = HIT_RADIUS
      for (let i = 0; i < EMBER_COUNT; i++) {
        if (!aliveRef.current[i]) continue
        worldPosition.set(positionAttr.getX(i), positionAttr.getY(i), positionAttr.getZ(i))
        worldPosition.project(camera)
        const screenX = ((worldPosition.x + 1) / 2) * size.width
        const screenY = ((1 - worldPosition.y) / 2) * size.height
        const distance = Math.hypot(screenX - clientX, screenY - clientY)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      }
      if (closestIndex === -1) return false

      aliveRef.current[closestIndex] = false
      const position: [number, number, number] = [
        positionAttr.getX(closestIndex),
        positionAttr.getY(closestIndex),
        positionAttr.getZ(closestIndex),
      ]
      positionAttr.setY(closestIndex, PARKED_Y)
      positionAttr.needsUpdate = true

      playNavSlash()
      emitEmberDoused()
      const id = nextBurstId.current++
      setBursts((current) => [...current, { id, position }])
      window.setTimeout(() => {
        setBursts((current) => current.filter((burst) => burst.id !== id))
      }, EXTINGUISH_LIFETIME)
      window.setTimeout(() => {
        aliveRef.current[closestIndex] = true
      }, RESPAWN_DELAY)

      return true
    }

    registerEmberHitTest(testEmberHit)
    return () => registerEmberHitTest(null)
  }, [camera, size])

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          size={0.5}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#c81e3a"
        />
      </points>
      {bursts.map((burst) => (
        <EmberExtinguish key={burst.id} position={burst.position} />
      ))}
    </>
  )
}

export default EmberField3D
