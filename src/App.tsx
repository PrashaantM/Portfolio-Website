import SkipLink from './components/SkipLink'
import Background from './components/Background'
import Scene3D from './components/Scene3D'
import InteractionEffects from './components/InteractionEffects'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MusicToggle from './components/MusicToggle'
import EmberCounter from './components/EmberCounter'
import { MusicProvider } from './context/MusicProvider'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Lab from './sections/Lab'
import Experience from './sections/Experience'
import Interests from './sections/Interests'
import Contact from './sections/Contact'

function App() {
  return (
    <MusicProvider>
      <SkipLink />
      <Background />
      <Scene3D />
      <InteractionEffects />
      <Navbar />
      <EmberCounter />

      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Lab />
        <Experience />
        <Interests />
        <Contact />
      </main>

      <Footer />
      <MusicToggle />
    </MusicProvider>
  )
}

export default App
