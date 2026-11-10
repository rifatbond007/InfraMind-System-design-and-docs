import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Decide from './components/Decide.jsx'
import Architecture from './components/Architecture.jsx'
import Testbed from './components/Testbed.jsx'
import Ingestion from './components/Ingestion.jsx'
import Detection from './components/Detection.jsx'
import Correlation from './components/Correlation.jsx'
import RCA from './components/RCA.jsx'
import Alerting from './components/Alerting.jsx'
import Evaluation from './components/Evaluation.jsx'
import Packaging from './components/Packaging.jsx'
import Decisions from './components/Decisions.jsx'
import TechStack from './components/TechStack.jsx'
import Glossary from './components/Glossary.jsx'

export default function App() {
  const [active, setActive] = useState('overview')

  // Deep links from the landing page (/system-design/#rca) arrive before React renders the target.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    let ticking = false
    const update = () => {
      let current = 'overview'
      const scrollY = window.scrollY
      const offset = window.innerWidth <= 768 ? 90 : 40
      sections.forEach(s => {
        if (scrollY >= s.getBoundingClientRect().top + scrollY - offset) current = s.id
      })
      setActive(current)
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true }
    }
    window.addEventListener('scroll', onScroll)
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="wrapper">
      <Navbar active={active} />
      <main>
        <div className="container">
          <Hero />
          <Decide />
          <Architecture />
          <Testbed />
          <Ingestion />
          <Detection />
          <Correlation />
          <RCA />
          <Alerting />
          <Evaluation />
          <Packaging />
          <Decisions />
          <TechStack />
          <Glossary />
        </div>
      </main>
    </div>
  )
}
