import { motion, useReducedMotion } from 'motion/react'
import Container from '../components/Container'
import Button from '../components/Button'

const EASE = [0.16, 1, 0.3, 1] as const

// Name -> subtitle -> metadata -> CTAs, one after another rather than
// all at once, per the Phase 6.1 animation plan. Whole sequence lands
// well under the 1.2s guideline from Phase 26.
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

/**
 * Deliberately not built on the shared <Section> wrapper: every other
 * section uses that for consistent vertical rhythm, but the hero needs
 * full-viewport height and an absolutely-positioned ambient background
 * layer that the plain .section padding model doesn't need to support.
 */
function Hero() {
  // Motion doesn't read the CSS prefers-reduced-motion override in
  // base.css (that only covers CSS animations/transitions) - checking
  // it explicitly here and skipping straight to the end state.
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="hero" className="relative flex min-h-svh items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="animate-glow-pulse bg-accent absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl"
      />

      <Container className="relative">
        <motion.div
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          variants={container}
        >
          <motion.h1 variants={item}>Prashaant Mudgala</motion.h1>

          <motion.p variants={item} className="text-text-secondary mt-6 max-w-2xl text-lg">
            Computer Science student and software developer who builds
            ambitious systems, understands how they work under the hood, and
            experiments with ideas outside the usual student-project box.
          </motion.p>

          <motion.p variants={item} className="font-mono text-text-secondary mt-4 text-sm">
            Full-Stack Development · Systems · AI-Assisted Engineering
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <Button href="#projects">View Projects</Button>
            <Button
              href="/PrashaantMudgala_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              Resume
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}

export default Hero
