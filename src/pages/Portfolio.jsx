import { useEffect } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Journey from '../components/Journey'
import Work from '../components/Work'
import Experience from '../components/Experience'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Portfolio() {
  useScrollReveal()

  // scroll progress bar
  useEffect(() => {
    const bar = document.getElementById('progress-bar')
    if (!bar) return
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.height = (max > 0 ? (window.scrollY / max) * 100 : 0).toFixed(2) + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div id="progress-bar" aria-hidden="true" />
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Journey />
      <Work />
      <Experience />
      <Contact />
      <Footer />
    </>
  )
}
