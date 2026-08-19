import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// A copy of Seal.tsx's markup, with its `var(--color-*)` strokes
// resolved to literal hex values: this gets rasterized via a plain
// `Image`/canvas `drawImage`, a separate rendering context that can't
// read this page's CSS custom properties. Kept in sync with
// `src/components/Seal.tsx` by hand; #c81e3a is --color-accent,
// #ededef is --color-text-primary (theme.css).
const SEAL_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <circle cx="24" cy="24" r="22.5" stroke="#c81e3a" stroke-width="1" opacity="0.9" />
  <circle cx="24" cy="24" r="18.5" stroke="#c81e3a" stroke-width="1" opacity="0.5" />
  <path d="M14 32V16h4.5c3 0 4.8 1.6 4.8 4.2 0 2.5-1.8 4.1-4.8 4.1H16" stroke="#ededef" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M27 32V16l5 10 5-10v16" stroke="#ededef" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`.trim()

function createSealTexture(): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const blob = new Blob([SEAL_SVG], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, size, size)
      URL.revokeObjectURL(url)
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      resolve(texture)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to rasterize seal texture'))
    }
    img.src = url
  })
}

interface SealInstance {
  id: number
  x: number
  y: number
  z: number
  rotation: number
  size: number
}

const MAX_CONCURRENT = 2
const FADE_MS = 1800
const HOLD_MS = 6000
const LIFETIME_MS = FADE_MS * 2 + HOLD_MS

function randomSeal(id: number): SealInstance {
  return {
    id,
    x: (Math.random() - 0.5) * 14,
    y: (Math.random() - 0.5) * 8,
    z: -6 - Math.random() * 3,
    rotation: Math.random() * Math.PI * 2,
    size: 4 + Math.random() * 3,
  }
}

function SealPlane({ seal, texture }: { seal: SealInstance; texture: THREE.Texture }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const spawnedAt = useRef(performance.now())

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = seal.rotation + state.clock.elapsedTime * 0.02
    }
    const elapsed = performance.now() - spawnedAt.current
    let opacity: number
    if (elapsed < FADE_MS) opacity = elapsed / FADE_MS
    else if (elapsed < FADE_MS + HOLD_MS) opacity = 1
    else opacity = Math.max(0, 1 - (elapsed - FADE_MS - HOLD_MS) / FADE_MS)
    if (materialRef.current) materialRef.current.opacity = opacity * 0.12
  })

  return (
    <mesh ref={meshRef} position={[seal.x, seal.y, seal.z]}>
      <planeGeometry args={[seal.size, seal.size]} />
      <meshBasicMaterial ref={materialRef} map={texture} transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

/**
 * The site's `Seal` emblem, rasterized to a texture once and reused,
 * fading in/out as a couple of large, faint, slowly-rotating watermark
 * planes at randomized positions: ambient "seal patterns that come and
 * go" rendered sitewide in the background, separate from the
 * interactive corner emblem in `Hero.tsx`, which is untouched.
 */
function SealField3D() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [seals, setSeals] = useState<SealInstance[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    let cancelled = false
    createSealTexture()
      .then((tex) => {
        if (!cancelled) setTexture(tex)
      })
      .catch(() => {
        // No seal texture available (e.g. blob/image loading blocked);
        // the field just stays empty rather than erroring the scene.
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    function spawn() {
      setSeals((current) => {
        if (current.length >= MAX_CONCURRENT) return current
        const seal = randomSeal(nextId.current++)
        timers.push(
          setTimeout(() => {
            setSeals((s) => s.filter((existing) => existing.id !== seal.id))
          }, LIFETIME_MS),
        )
        return [...current, seal]
      })
    }

    function scheduleNext() {
      const delay = 12000 + Math.random() * 8000
      timers.push(
        setTimeout(() => {
          if (cancelled) return
          spawn()
          scheduleNext()
        }, delay),
      )
    }

    timers.push(setTimeout(spawn, 5000))
    scheduleNext()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  if (!texture) return null

  return (
    <>
      {seals.map((seal) => (
        <SealPlane key={seal.id} seal={seal} texture={texture} />
      ))}
    </>
  )
}

export default SealField3D
