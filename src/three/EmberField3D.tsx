import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const EMBER_COUNT = 90

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

/**
 * Sitewide ambient ember layer: one `Points` draw call rather than N
 * meshes, drifting slowly upward with per-particle sway and looping
 * back to the bottom once off the top. Additive to, not a replacement
 * for, Lab's existing denser/audio-reactive CSS `ParticleField`
 * (`src/components/ParticleField.tsx`) — that one stays exactly as
 * tuned. The glow sprite is a radial gradient painted on an offscreen
 * canvas at runtime, the same "nothing sourced" reasoning as the
 * existing noise-background SVG in `motifs.css`.
 */
function EmberField3D() {
  const layout = useMemo(createLayout, [])
  const texture = useMemo(createGlowTexture, [])
  const pointsRef = useRef<THREE.Points>(null)

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
      const y = ((ember.baseY + t * ember.speed + 7) % 14) - 7
      const x = ember.x + Math.sin(t * ember.driftFreq + ember.phase) * ember.driftAmp
      positionAttr.setXYZ(i, x, y, ember.z)
    })
    positionAttr.needsUpdate = true
  })

  return (
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
  )
}

export default EmberField3D
