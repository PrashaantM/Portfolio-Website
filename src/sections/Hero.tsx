import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Container from '../components/Container'
import Button from '../components/Button'
import Seal from '../components/Seal'
import { fadeUp, staggerContainer } from '../lib/motion'

// Name -> subtitle -> metadata -> CTAs, one after another rather than
// all at once, per the Phase 6.1 animation plan. Whole sequence lands
// well under the 1.2s guideline from Phase 26. Built on the Phase 13
// animation vocabulary (`src/lib/motion.ts`) rather than a local
// variant pair now that one exists. Driven by `whileInView` rather
// than an unconditional `animate`, so scrolling back up to the very
// top replays the sequence instead of leaving it in its settled end
// state, same as every other scroll-triggered reveal on the site.
const container = staggerContainer()
const item = fadeUp

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

  // Phase 13's `parallax` vocabulary item: the ambient glow drifts
  // down more slowly than the page scrolls past it, reading as depth
  // rather than a flat layer. Collapsing the output range to a fixed
  // 0 under reduced motion (rather than skipping the hook) keeps the
  // hook call unconditional, as React's rules require, while still
  // pinning the glow in place for anyone who asked for less motion.
  // Centering is handled by the flex wrapper below rather than the
  // usual `-translate-x/y-1/2` classes, so this stays a plain numeric
  // `y` offset instead of a string transform Motion has to parse.
  const { scrollY } = useScroll()
  const glowY = useTransform(scrollY, [0, 800], [0, shouldReduceMotion ? 0 : 140])

  return (
    <section id="hero" className="relative flex min-h-svh items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: glowY }}
          className="animate-glow-pulse bg-accent h-[40rem] w-[40rem] rounded-full opacity-15 blur-3xl"
        />
      </div>

      <Container className="relative">
        <motion.div
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: !!shouldReduceMotion, amount: 0.3 }}
          variants={container}
        >
          {/* An original seal/emblem, not a resume detail (see
              src/components/Seal.tsx): the Naruto/Demon Slayer "seal"
              motif from Phase 12, placed on the very first screen
              since Phase 12's whole point is a visual language that
              says something about the person, not just the work. */}
          <motion.div
            variants={item}
            className="hover-glitch absolute right-0 top-0 opacity-70 transition-opacity hover:opacity-100"
          >
            <Seal size={44} />
          </motion.div>

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
              href={`${import.meta.env.BASE_URL}PrashaantMudgala_Resume.pdf`}
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
