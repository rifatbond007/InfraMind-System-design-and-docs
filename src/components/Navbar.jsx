import { useEffect, useState } from 'react'

const links = [
  { href: '#overview',     label: 'Overview',     s: 'built' },
  { href: '#decide',       label: 'Your decision', s: 'changed' },
  { href: '#architecture', label: 'Architecture', s: 'built' },
  { href: '#testbed',      label: 'Testbed',      s: 'built' },
  { href: '#ingestion',    label: 'Ingestion',    s: 'built' },
  { href: '#detection',    label: 'Detection',    s: 'built' },
  { href: '#correlation',  label: 'Correlation',  s: 'built' },
  { href: '#rca',          label: 'Root cause',   s: 'built' },
  { href: '#alerting',     label: 'Alerting',     s: 'built' },
  { href: '#evaluation',   label: 'Evaluation',   s: 'changed' },
  { href: '#packaging',    label: 'Packaging',    s: 'built' },
  { href: '#decisions',    label: 'Decisions',    s: null },
  { href: '#stack',        label: 'Stack',        s: null },
]

function initialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function ThemeToggle() {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
    >
      <span className={theme === 'light' ? 'on' : ''}>Light</span>
      <span className={theme === 'dark' ? 'on' : ''}>Dark</span>
    </button>
  )
}

export default function Navbar({ active }) {
  return (
    <nav>
      <div className="nav-inner">
        <a href="/" className="brand">InfraMind</a>
        <a href="/" className="nav-link nav-home">← Project home</a>
        {links.map(l => (
          <a
            key={l.href}
            href={l.href}
            className={'nav-link' + (active === l.href.slice(1) ? ' active' : '')}
          >
            {l.s && <span className={'dot ' + l.s} aria-hidden="true"></span>}
            {l.label}
          </a>
        ))}
        <p className="nav-key">
          <span><span className="dot built"></span>built</span>
          <span><span className="dot changed"></span>needs attention</span>
          <span><span className="dot planned"></span>planned</span>
        </p>
        <ThemeToggle />
      </div>
    </nav>
  )
}
