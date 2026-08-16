import SkipLink from './components/SkipLink'
import Background from './components/Background'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Section from './components/Section'
import Hero from './sections/Hero'

interface PlaceholderSectionProps {
  id: string
  title: string
  note: string
}

/**
 * Stand-in for a section that hasn't been built yet, so the nav has
 * somewhere real to scroll to and the layout/spacing is checkable
 * before any real content exists. Each one gets replaced in its own
 * phase.
 */
function PlaceholderSection({ id, title, note }: PlaceholderSectionProps) {
  return (
    <Section id={id}>
      <h2>{title}</h2>
      <p className="text-text-secondary mt-2">{note}</p>
    </Section>
  )
}

function App() {
  return (
    <>
      <SkipLink />
      <Background />
      <Navbar />

      <main id="main-content">
        <Hero />
        <PlaceholderSection id="about" title="About" note="Placeholder — built in Phase 7." />
        <PlaceholderSection id="skills" title="Skills" note="Placeholder — built in Phase 8." />
        <PlaceholderSection
          id="projects"
          title="Featured Projects"
          note="Placeholder — built in Phase 9."
        />
        <PlaceholderSection
          id="lab"
          title="Experimental Lab"
          note="Placeholder — built in Phase 10."
        />
        <PlaceholderSection
          id="experience"
          title="Experience"
          note="Placeholder — content arrives in a later phase."
        />
        <PlaceholderSection
          id="interests"
          title="Interests"
          note="Placeholder — content arrives in a later phase."
        />
        <PlaceholderSection
          id="contact"
          title="Contact"
          note="Placeholder — content arrives in a later phase."
        />
      </main>

      <Footer />
    </>
  )
}

export default App
