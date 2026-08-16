import Container from '../components/Container'
import Button from '../components/Button'

/**
 * Deliberately not built on the shared <Section> wrapper: every other
 * section uses that for consistent vertical rhythm, but the hero needs
 * full-viewport height and an absolutely-positioned ambient background
 * layer that the plain .section padding model doesn't need to support.
 */
function Hero() {
  return (
    <section id="hero" className="relative flex min-h-svh items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="animate-glow-pulse bg-accent absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      />

      <Container className="relative">
        <h1>Prashaant Mudgala</h1>

        <p className="text-text-secondary mt-6 max-w-2xl text-lg">
          Computer Science student and software developer who builds
          ambitious systems, understands how they work under the hood, and
          experiments with ideas outside the usual student-project box.
        </p>

        <p className="font-mono text-text-secondary mt-4 text-sm">
          Full-Stack Development · Systems · AI-Assisted Engineering
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="#projects">View Projects</Button>
          <Button
            href="/PrashaantMudgala_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            Resume
          </Button>
        </div>
      </Container>
    </section>
  )
}

export default Hero
