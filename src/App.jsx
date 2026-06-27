import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Architecture from './components/Architecture.jsx'
import PipelineDetail from './components/PipelineDetail.jsx'
import Ingestion from './components/Ingestion.jsx'
import Detection from './components/Detection.jsx'
import RCA from './components/RCA.jsx'
import Alerting from './components/Alerting.jsx'
import Decisions from './components/Decisions.jsx'
import TechStack from './components/TechStack.jsx'
import Glossary from './components/Glossary.jsx'

export default function App() {
  const [active, setActive] = useState('overview')

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    let ticking = false
    const update = () => {
      let current = 'overview'
      const scrollY = window.scrollY
      const offset = window.innerWidth <= 768 ? 80 : 10
      sections.forEach(s => {
        if (scrollY >= s.offsetTop - offset) current = s.id
      })
      setActive(current)
      ticking = false
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true }
    })
    update()
  }, [])

  return (
    <div className="wrapper">
      <Navbar active={active} />
      <main>
        <div className="container">
          <Hero />
          <Architecture />
          <PipelineDetail />
          <Ingestion />
          <Detection />
          <RCA />
          <Alerting />
          <Decisions />
          <TechStack />
          <Glossary />
        </div>
      </main>
    </div>
  )
}
