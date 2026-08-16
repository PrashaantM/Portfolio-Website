import { useEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useMusic } from '../context/musicContext'

interface Particle {
  left: number
  size: number
  duration: number
  delay: number
  drift: number
}

const PARTICLE_COUNT = 16

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    left: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 14 + Math.random() * 12,
    delay: -Math.random() * 26,
    drift: (Math.random() - 0.5) * 60,
  }))
}

/**
 * A restrained field of chakra-style embers (Naruto motif) drifting
 * upward behind a section, generated once via `useMemo` so the random
 * layout doesn't reshuffle on every re-render. The drift itself is
 * pure CSS (`.particle-ember` in motifs.css). The only JS here reads
 * Phase 11's live music amplitude each frame and brightens the whole
 * field slightly in time with it (Phase 11.2), skipped entirely when
 * music is off or reduced motion is requested.
 */
function ParticleField() {
  const particles = useMemo(createParticles, [])
  const containerRef = useRef<HTMLDivElement>(null)
  const { isPlaying, getAmplitude } = useMusic()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isPlaying || shouldReduceMotion) return

    let frame: number
    const tick = () => {
      const amplitude = getAmplitude()
      if (containerRef.current) {
        containerRef.current.style.filter = `brightness(${1 + amplitude * 1.4})`
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isPlaying, shouldReduceMotion, getAmplitude])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {particles.map((particle, index) => (
        <span
          key={index}
          className="particle-ember"
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
            bottom: '-5%',
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            '--drift': `${particle.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

export default ParticleField
