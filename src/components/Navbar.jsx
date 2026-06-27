const links = [
  { href: '#overview',     label: 'Overview' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#pipeline',     label: 'Pipeline' },
  { href: '#ingestion',    label: 'Ingestion' },
  { href: '#detection',    label: 'Detection' },
  { href: '#rca',          label: 'Root Cause' },
  { href: '#alerting',     label: 'Alerting' },
  { href: '#decisions',    label: 'Decisions' },
]

export default function Navbar({ active }) {
  const id = active
  return (
    <nav>
      <div className="nav-inner">
        <a href="#overview" className="brand">InfraMind</a>
        {links.map(l => (
          <a
            key={l.href}
            href={l.href}
            className={'nav-link' + (id === l.href.slice(1) ? ' active' : '')}
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
