import { useEffect, useMemo, useRef, useState } from 'react'
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

// Real flap-cycle reference art (`public/images/crows.jpg`): a 5-column
// x 2-row sprite sheet, side profile, one full wingbeat across the 10
// cells, stepped through each frame to drive actual per-frame
// animation instead of faking a wingbeat with a scaled silhouette.
// `BASE_URL`, not a leading `/`: a plain runtime string, so it needs to
// resolve under GitHub Pages' project-repo subpath itself (see
// vite.config.ts's `base`), not just a domain root.
const SPRITE_URL = `${import.meta.env.BASE_URL}images/crows.jpg`
const SHEET_COLS = 5
const SHEET_ROWS = 2
const FRAME_COUNT = SHEET_COLS * SHEET_ROWS

// The 10 poses aren't evenly spaced through the wingbeat, measured as
// the summed per-pixel alpha difference between each frame and the
// next: frame7->8 barely differs (a ~5% share) while the loop seam
// frame9->0 is the single biggest jump in the whole sheet (~27%).
// Stepping through frames at a uniform rate would give that 5% pair
// the same on-screen time as the 27% pair, so the near-duplicate poses
// would sit still relatively longer while the loop seam has to cram
// its outsized change into a normal-length step, which is exactly what
// reads as "pause, then a sudden catch-up snap" once per cycle.
// Weighting each segment's on-screen time by its own share of the
// total measured change (arc-length reparameterization) instead holds
// every transition to roughly the same apparent rate of change.
const FRAME_SEGMENT_WEIGHTS = [3061, 2806, 1966, 1854, 4619, 2204, 1901, 1504, 2459, 8261]
const FRAME_SEGMENT_TOTAL = FRAME_SEGMENT_WEIGHTS.reduce((sum, w) => sum + w, 0)
const FRAME_SEGMENT_CUM = FRAME_SEGMENT_WEIGHTS.reduce<number[]>(
  (cum, w) => [...cum, cum[cum.length - 1] + w],
  [0],
)

// Source sheet is 736x574 with a ~64px VectorStock watermark bar
// across the very bottom (y 510-574) and uneven vertical padding
// between the two crow rows (row 1's crows sit in y 120-266, row 2's
// in y 281-390, measured by luminance bounding box). Cropped and
// re-stacked into two equal-height bands below, rather than sliced as
// one uniform grid, so both rows are excluded from the watermark and
// center their crow the same way.
const SHEET_SOURCE_WIDTH = 736
const ROW_SOURCE_Y = [110, 256]
const ROW_HEIGHT = 160

const SHEET_CELL_WIDTH = SHEET_SOURCE_WIDTH / SHEET_COLS
const PLANE_WIDTH = 0.95
const PLANE_HEIGHT = PLANE_WIDTH * (ROW_HEIGHT / SHEET_CELL_WIDTH)

// A medium gray, matching the site's `text-secondary` token rather
// than its red accent, reads as a natural bird silhouette against the
// dark sky on its own contrast, no artificial glow required.
const CROW_COLOR = '#8b8b93'
const CROW_OPACITY = 0.92

// Gentle glide undulation: slow enough, and wide enough, to read as
// riding air currents rather than a straight-line slide. The bank
// below is derived from this same wave's rate of change, so rotation
// and altitude stay physically tied together instead of two
// independent wobbles that can drift out of phase and look noisy.
const CROW_BOB_FREQ = 0.35
const CROW_BOB_AMPLITUDE = 0.28

// A slow forward/back surge layered on top of the base constant-speed
// crossing, at a different frequency from the bob above (0.22 vs
// 0.35) so the two don't lock into one repeating, wind-up-toy-looking
// cycle. Amplitude is capped well under the base cruise speed (~1
// unit/s) so the surge never actually reverses travel direction, it
// just keeps a perfectly straight, constant-velocity line from
// reading as mechanical.
const CROW_SURGE_FREQ = 0.22
const CROW_SURGE_AMPLITUDE = 0.4

// Samples two adjacent sprite cells and blends between them (`uMix`
// ramps 0->1 as the flap advances) instead of hard-cutting from one
// pose to the next. A straight frame-index swap, even at a much
// higher rate, still reads as a slideshow because consecutive poses
// are quite different silhouettes; crossfading is what actually
// smooths it out into a continuous-looking wingbeat.
const CROW_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const CROW_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uCellSize;
  uniform vec2 uOffsetA;
  uniform vec2 uOffsetB;
  uniform float uMix;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    float alphaA = texture2D(uMap, uOffsetA + vUv * uCellSize).a;
    float alphaB = texture2D(uMap, uOffsetB + vUv * uCellSize).a;
    float alpha = mix(alphaA, alphaB, uMix) * uOpacity;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`

function createCrowSpriteTexture(): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = ROW_HEIGHT * SHEET_ROWS
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('2D canvas context unavailable'))
        return
      }

      ROW_SOURCE_Y.forEach((sourceY, row) => {
        ctx.drawImage(img, 0, sourceY, img.width, ROW_HEIGHT, 0, row * ROW_HEIGHT, img.width, ROW_HEIGHT)
      })

      // The sheet is a flat JPG (no alpha channel) on a near-uniform
      // light-gray backdrop (~232 luminance) with dark silhouettes
      // (~110-150 luminance). Key the background out by luminance and
      // flatten every opaque pixel to white so the material's `color`
      // tint above is what determines the on-screen gray, not the
      // sheet's own photo shading.
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = image.data
      for (let i = 0; i < data.length; i += 4) {
        const luminance = (data[i] + data[i + 1] + data[i + 2]) / 3
        const alpha = THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(luminance, 140, 215, 255, 0), 0, 255)
        data[i] = 255
        data[i + 1] = 255
        data[i + 2] = 255
        data[i + 3] = alpha
      }
      ctx.putImageData(image, 0, 0)

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      resolve(texture)
    }
    img.onerror = () => reject(new Error('Failed to load crow sprite sheet'))
    img.src = SPRITE_URL
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
    // Crossing takes 3-4 seconds, brisk enough to read as purposeful
    // flight rather than a slow drift.
    duration: 3000 + Math.random() * 1000,
    spawnedAt: performance.now(),
    // Sprite frames advanced per second; 10 frames per full wingbeat,
    // so 18-28 fps reads as roughly 1.8-2.8 flaps/sec. This can run
    // faster than a plain discrete frame-step would need, since
    // crossfading (see `CROW_FRAGMENT_SHADER`) keeps it smooth instead
    // of frantic.
    flapSpeed: 18 + Math.random() * 10,
  }
}

/**
 * One crow: a single plane sampling one cell of the 5x2 flap-cycle
 * sprite sheet at a time, stepped forward each frame to play the real
 * wingbeat instead of faking it with squash/stretch. Built facing +Z
 * (the camera's direction from the scene, given `Scene.tsx`'s fixed
 * `camera={{ position: [0, 0, 10] }}`), so no per-frame billboarding is
 * needed. `side: THREE.DoubleSide` on the material is what keeps
 * leftward-flying crows visible despite the `scale.x = -1` direction
 * flip below reversing the plane's face winding.
 */
function Crow({ crow, texture }: { crow: CrowInstance; texture: THREE.Texture }) {
  const groupRef = useRef<THREE.Group>(null)
  const planeRef = useRef<THREE.Mesh>(null)

  // One shared base texture; each crow just samples a different pair
  // of cells from it via uniforms, so there's no per-instance texture
  // clone to dispose.
  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uCellSize: { value: new THREE.Vector2(1 / SHEET_COLS, 1 / SHEET_ROWS) },
      uOffsetA: { value: new THREE.Vector2() },
      uOffsetB: { value: new THREE.Vector2() },
      uMix: { value: 0 },
      uColor: { value: new THREE.Color(CROW_COLOR) },
      uOpacity: { value: CROW_OPACITY },
    }),
    [texture],
  )

  useFrame((state) => {
    const progress = Math.min(1, (performance.now() - crow.spawnedAt) / crow.duration)
    const direction = Math.sign(crow.endX - crow.startX)
    const surge = Math.sin(state.clock.elapsedTime * CROW_SURGE_FREQ + crow.id * 5) * CROW_SURGE_AMPLITUDE * direction
    const x = THREE.MathUtils.lerp(crow.startX, crow.endX, progress) + surge

    const bobPhase = state.clock.elapsedTime * CROW_BOB_FREQ + crow.id * 10
    const bob = Math.sin(bobPhase) * CROW_BOB_AMPLITUDE
    // d(bob)/dt: how fast it's currently rising or falling, which is
    // what the bank angle below is derived from.
    const bobRate = Math.cos(bobPhase) * CROW_BOB_FREQ * CROW_BOB_AMPLITUDE

    if (groupRef.current) {
      groupRef.current.position.set(x, crow.y + bob, crow.z)
      groupRef.current.scale.x = direction
    }

    if (planeRef.current) {
      planeRef.current.rotation.z = THREE.MathUtils.clamp(bobRate * 1.6, -0.16, 0.16)
    }

    // `flapSpeed` is still "frames per second" on average; dividing by
    // FRAME_COUNT gives cycles/sec, then FRAME_SEGMENT_TOTAL spreads
    // that one cycle across each segment's weighted share instead of
    // 10 equal steps.
    const cyclesPerSecond = crow.flapSpeed / FRAME_COUNT
    const rawPhase = state.clock.elapsedTime * cyclesPerSecond + crow.id * 0.37
    const cyclePhase = rawPhase - Math.floor(rawPhase)
    const pos = cyclePhase * FRAME_SEGMENT_TOTAL

    let frameA = FRAME_COUNT - 1
    for (let k = 0; k < FRAME_COUNT; k++) {
      if (pos < FRAME_SEGMENT_CUM[k + 1]) {
        frameA = k
        break
      }
    }
    const frameB = (frameA + 1) % FRAME_COUNT

    uniforms.uMix.value = (pos - FRAME_SEGMENT_CUM[frameA]) / FRAME_SEGMENT_WEIGHTS[frameA]
    uniforms.uOffsetA.value.set((frameA % SHEET_COLS) / SHEET_COLS, 1 - (Math.floor(frameA / SHEET_COLS) + 1) / SHEET_ROWS)
    uniforms.uOffsetB.value.set((frameB % SHEET_COLS) / SHEET_COLS, 1 - (Math.floor(frameB / SHEET_COLS) + 1) / SHEET_ROWS)
  })

  return (
    <group ref={groupRef}>
      <mesh ref={planeRef}>
        <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT]} />
        <shaderMaterial
          vertexShader={CROW_VERTEX_SHADER}
          fragmentShader={CROW_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/**
 * Sitewide ambient flock: 3-4 crows crossing the scene on independent
 * randomized timers. Spawn/despawn state lives entirely in this
 * component; nothing else needs to react to a given crow's lifecycle,
 * so there's no reason to route it through `sceneBus`.
 */
function CrowFlock3D() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [crows, setCrows] = useState<CrowInstance[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    let cancelled = false
    createCrowSpriteTexture()
      .then((tex) => {
        if (!cancelled) setTexture(tex)
      })
      .catch(() => {
        // No crow texture available (e.g. sprite sheet failed to
        // load); the flock just never spawns rather than erroring the
        // scene.
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
