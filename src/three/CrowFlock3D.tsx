import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CrowInstance {
  id: number
  startX: number
  endX: number
  y: number
  z: number
  duration: number
  spawnedAt: number
  flapSpeed: number
}

const MAX_CONCURRENT = 4
const SPAWN_MIN_DELAY = 4000
const SPAWN_MAX_DELAY = 9000

// The exact silhouette from the original hand-drawn `Crow.tsx` (Phase
// 12, deleted in Phase 15 when this component replaced it): a wide,
// wings-spread "bird crossing the sky, seen from below" shape, not a
// side-profile bird. Rasterized once to a texture rather than redrawn
// as new 3D geometry, so this stays the same artwork rather than a
// worse ad-hoc approximation of it. Filled white so the texture can be
// tinted per-material; the real color lives in `CROW_MATERIAL_PROPS`.
const CROW_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50">
  <path d="M60 26 C 50 10, 30 4, 4 14 C 22 18, 38 22, 50 27 C 38 32, 22 36, 4 40 C 30 48, 50 40, 58 30 C 58 34, 60 38, 64 40 C 63 36, 62 32, 62 28 C 70 40, 90 48, 116 40 C 98 36, 82 32, 70 27 C 82 22, 98 18, 116 14 C 90 4, 70 10, 60 26 Z" fill="#ffffff" />
</svg>
`.trim()

// A medium gray, not red: the original 2D crow used `text-secondary`
// (this exact hex), not the site's accent, and reads as a natural bird
// silhouette against the dark sky on its own contrast, no artificial
// glow required. `toneMapped: false` keeps that gray a stable,
// consistent value regardless of the renderer's tone mapping curve.
const CROW_MATERIAL_PROPS = {
  color: '#8b8b93',
  transparent: true,
  opacity: 0.92,
  side: THREE.DoubleSide,
  depthWrite: false,
  toneMapped: false,
} as const

const PLANE_WIDTH = 0.95
const PLANE_HEIGHT = PLANE_WIDTH * (50 / 120)

function createCrowTexture(): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const width = 240
    const height = 100
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const blob = new Blob([CROW_SVG], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      resolve(texture)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to rasterize crow texture'))
    }
    img.src = url
  })
}

function randomCrow(id: number): CrowInstance {
  const direction = Math.random() < 0.5 ? 1 : -1
  return {
    id,
    startX: -direction * 11,
    endX: direction * 11,
    // Capped at 3 rather than a wider range: at the camera's fov/
    // position (Scene.tsx: fov 50, z 10) and this component's closest
    // z of +2 (8 units from camera), the frustum's half-height is only
    // ~3.7, so a y much above 3 clips off the top of the screen for
    // the nearer crows instead of reading as "flying".
    y: 1 + Math.random() * 2,
    z: -3 + Math.random() * 5,
    duration: 14000 + Math.random() * 12000,
    spawnedAt: performance.now(),
    flapSpeed: 6 + Math.random() * 3,
  }
}

/**
 * One crow: the rasterized silhouette on a single flat plane, always
 * built facing +Z (the camera's direction from the scene, given
 * `Scene.tsx`'s fixed `camera={{ position: [0, 0, 10] }}`), so no
 * per-frame billboarding is needed. "Flapping" is a vertical
 * squash/stretch on the whole plane (`scale.y`, via `Math.abs(sin)`
 * for a two-beats-per-cycle down/up stroke) plus a small Z-axis
 * rotation wobble — both stay in the plane facing the camera, unlike
 * rotating a flat silhouette around its travel axis, which would spin
 * it edge-on to the camera and make it disappear. `side:
 * THREE.DoubleSide` on the material (not the geometry) is what keeps
 * leftward-flying crows visible despite the `scale.x = -1` direction
 * flip below reversing the plane's face winding.
 */
function Crow({ crow, texture }: { crow: CrowInstance; texture: THREE.Texture }) {
  const groupRef = useRef<THREE.Group>(null)
  const planeRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const progress = Math.min(1, (performance.now() - crow.spawnedAt) / crow.duration)
    const x = THREE.MathUtils.lerp(crow.startX, crow.endX, progress)
    const bob = Math.sin(state.clock.elapsedTime * 0.8 + crow.id) * 0.15

    if (groupRef.current) {
      groupRef.current.position.set(x, crow.y + bob, crow.z)
      groupRef.current.scale.x = crow.endX > crow.startX ? 1 : -1
    }

    if (planeRef.current) {
      const beat = Math.abs(Math.sin(state.clock.elapsedTime * crow.flapSpeed))
      planeRef.current.scale.y = 0.5 + beat * 0.6
      planeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * crow.flapSpeed * 0.5) * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={planeRef}>
        <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT]} />
        <meshBasicMaterial map={texture} {...CROW_MATERIAL_PROPS} />
      </mesh>
    </group>
  )
}

/**
 * 3-4 crows crossing the scene on independent randomized timers,
 * Phase 15's sitewide replacement for Hero's single flat `.crow-drift`
 * silhouette (removed from `Hero.tsx`). Spawn/despawn state lives
 * entirely in this component; nothing else needs to react to a given
 * crow's lifecycle, so there's no reason to route it through
 * `sceneBus`.
 */
function CrowFlock3D() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [crows, setCrows] = useState<CrowInstance[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    let cancelled = false
    createCrowTexture()
      .then((tex) => {
        if (!cancelled) setTexture(tex)
      })
      .catch(() => {
        // No crow texture available (e.g. blob/image loading
        // blocked); the flock just never spawns rather than erroring
        // the scene.
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    function spawn() {
      setCrows((current) => {
        if (current.length >= MAX_CONCURRENT) return current
        const crow = randomCrow(nextId.current++)
        timers.push(
          setTimeout(() => {
            setCrows((c) => c.filter((existing) => existing.id !== crow.id))
          }, crow.duration),
        )
        return [...current, crow]
      })
    }

    function scheduleNext() {
      const delay = SPAWN_MIN_DELAY + Math.random() * (SPAWN_MAX_DELAY - SPAWN_MIN_DELAY)
      timers.push(
        setTimeout(() => {
          if (cancelled) return
          spawn()
          scheduleNext()
        }, delay),
      )
    }

    // Seed one shortly after mount so the sky isn't empty for the
    // first several seconds while waiting on the randomized interval.
    timers.push(setTimeout(spawn, 1200))
    scheduleNext()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  if (!texture) return null

  return (
    <>
      {crows.map((crow) => (
        <Crow key={crow.id} crow={crow} texture={texture} />
      ))}
    </>
  )
}

export default CrowFlock3D
