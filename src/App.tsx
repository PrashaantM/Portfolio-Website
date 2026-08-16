import SkipLink from './components/SkipLink'
import Background from './components/Background'
import Scene3D from './components/Scene3D'
import InteractionEffects from './components/InteractionEffects'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Section from './components/Section'
import MusicToggle from './components/MusicToggle'
import SwordSlash from './components/motifs/SwordSlash'
import { MusicProvider } from './context/MusicProvider'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Lab from './sections/Lab'

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
      <SwordSlash />
      <h2>{title}</h2>
      <p className="text-text-secondary mt-2">{note}</p>
    </Section>
  )
}

function App() {
  return (
    <MusicProvider>
      <SkipLink />
      <Background />
      <Scene3D />
      <InteractionEffects />
      <Navbar />

      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Lab />
        <PlaceholderSection
          id="experience"
          title="Experience"
          note="Placeholder. Content arrives in a later phase."
        />
        <PlaceholderSection
          id="interests"
          title="Interests"
          note="Placeholder. Content arrives in a later phase."
        />
        <PlaceholderSection
          id="contact"
          title="Contact"
          note="Placeholder. Content arrives in a later phase."
        />
      </main>

      <Footer />
      <MusicToggle />
    </MusicProvider>
  )
}

export default App
