// InfraMind product landing page. The system design docs live at /system-design/ (the "Docs" tab).
// Every fact here comes from the infraMind repo; numbers from development smoke runs are labelled.
import { useState } from 'react'
import {
  DOCS, Brand, useTheme, ThemeIconButton, ThemeSegment, DotNumber, Command,
  useReveal, useScrolled, useCycle, useReady, Words, Scramble,
} from './parts.jsx'

const STATUS_DATE = '23 Oct 2026'
const GITHUB = 'https://github.com/rifatbond007/inframind-core'

// Deterministic pseudo-random numbers so the decorative graphics render the same every time.
function rng(seed) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ───────────────────────── Nav ───────────────────────── */

const NAV = [
  ['Features', '#features'],
  ['How it works', '#pipeline'],
  ['Quickstart', '#quickstart'],
  ['Roadmap', '#roadmap'],
  ['FAQ', '#faq'],
]

function GitHubIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" /></svg>
}

function Nav({ theme, setTheme }) {
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)
  return (
    <header className={'lnav' + (scrolled ? ' scrolled' : '') + (open ? ' open' : '')}>
      <div className="lnav-inner">
        <a href="#top" className="lnav-brand" aria-label="InfraMind home"><Brand /></a>
        <nav className="lnav-links" aria-label="Sections">
          {NAV.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a href={DOCS} className="docs-tab">Docs</a>
        </nav>
        <div className="lnav-right">
          <ThemeIconButton theme={theme} setTheme={setTheme} />
          <a href={GITHUB} className="icon-btn" aria-label="InfraMind on GitHub"><GitHubIcon /></a>
          <a href="#quickstart" className="btn btn-ink btn-sm">Get started</a>
          <button type="button" className="icon-btn menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 8h16M4 16h16'} /></svg>
          </button>
        </div>
      </div>
    </header>
  )
}

/* ───────────────────────── Hero ───────────────────────── */

// A metric drawn in dots: quiet noise, then one anomaly spike. The spike columns glow in the accent.
function SignalField() {
  const cols = 64, rows = 11, s = 15
  const r = rng(7)
  const heights = Array.from({ length: cols }, (_, c) => {
    const noise = 1.5 + r() * 1.6 + Math.sin(c / 3.2) * 0.6
    const spike = 8.6 * Math.exp(-((c - 41) ** 2) / 6)
    return Math.min(rows, noise + spike)
  })
  const dots = []
  for (let c = 0; c < cols; c++) {
    for (let y = 0; y < rows; y++) {
      const filled = rows - y <= heights[c]
      const hot = filled && Math.abs(c - 41) <= 3 && rows - y > 3.4
      dots.push(
        <circle
          key={`${c}-${y}`}
          cx={c * s + s / 2} cy={y * s + s / 2} r={filled ? 2.6 : 1.6}
          className={hot ? 'f-hot' : filled ? 'f-on' : 'f-off'}
          style={hot ? { '--d': `${(c - 38) * 90 + y * 40}ms` } : undefined}
        />,
      )
    }
  }
  return (
    <svg className="signal-field" viewBox={`0 0 ${cols * s} ${rows * s}`} aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      {dots}
    </svg>
  )
}

function Console() {
  const cands = [
    { svc: 'cartservice', score: 0.82, depth: 2, ev: 'ev-3' },
    { svc: 'redis-cart', score: 0.57, depth: 3, ev: 'ev-5' },
    { svc: 'checkoutservice', score: 0.31, depth: 1, ev: 'ev-1' },
  ]
  return (
    <div className="console" data-reveal>
      <div className="console-bar">
        <span className="tl r" /><span className="tl y" /><span className="tl g" />
        <span className="console-title">inframind · api :8080 · /incidents</span>
        <span className="console-badge">example data</span>
      </div>
      <div className="console-body">
        <aside className="c-side">
          <p className="c-eyebrow">Streams</p>
          {['signals', 'incidents', 'graph-updates', 'rca-results'].map((s, i) => (
            <p key={s} className="c-stream"><span className="live" style={{ '--d': `${i * 400}ms` }} />stream:{s}</p>
          ))}
          <p className="c-eyebrow mt">Incidents</p>
          <p className="c-inc on"><span className="sq warn" />checkout path <em>open</em></p>
          <p className="c-inc"><span className="sq ok" />frontend burst <em>resolved</em></p>
        </aside>
        <div className="c-main">
          <div className="c-head">
            <h3>Incident · checkout path</h3>
            <div className="c-chips">
              <span className="chip warn">critical</span>
              <span className="chip">open</span>
              <span className="chip">3 services</span>
            </div>
          </div>
          <p className="c-eyebrow">Likely root cause</p>
          <ol className="c-cands">
            {cands.map((c, i) => (
              <li key={c.svc} className={i === 0 ? 'top' : ''}>
                <span className="rank">{i + 1}</span>
                <span className="svc">{c.svc}</span>
                <span className="bar"><span style={{ '--w': `${c.score * 100}%`, '--d': `${300 + i * 150}ms` }} /></span>
                <span className="score">{c.score.toFixed(2)}</span>
                <span className="chip mono">{c.ev}</span>
              </li>
            ))}
          </ol>
          <div className="c-walk">
            <span>frontend</span><i>→</i><span>checkoutservice</span><i>→</i><span className="hl">cartservice</span>
          </div>
        </div>
        <aside className="c-right">
          <p className="c-eyebrow">Summary</p>
          <div className="c-msg">
            cartservice errors rose first <span className="cite">ev-3</span>, then checkout calls to it failed <span className="cite">ev-5</span>.
          </div>
          <div className="c-alert">
            <span className="sq ok" /> 1 alert sent
          </div>
        </aside>
      </div>
    </div>
  )
}

function Hero() {
  const ready = useReady()
  return (
    <section className={'hero-panel' + (ready ? ' ready' : '')} id="top">
      <a href={`${DOCS}#architecture`} className="announce fx" style={{ '--fx': '0ms' }}>
        <span className="new">PREVIEW</span> Now wired end to end <span aria-hidden="true">→</span>
      </a>
      <h1 className="display"><Words lines={['One alert.', 'The real root cause.']} base={120} /></h1>
      <p className="hero-sub fx" style={{ '--fx': '650ms' }}>InfraMind turns a flood of Kubernetes signals into one incident, and tells you which service caused it, with proof.</p>
      <div className="hero-ctas fx" style={{ '--fx': '800ms' }}>
        <a href="#quickstart" className="btn btn-ink btn-lg">Get started</a>
        <Command text="git clone https://github.com/rifatbond007/inframind-core" />
      </div>
      <p className="hero-caption fx" style={{ '--fx': '950ms' }}>Open source · MIT licensed · Kubernetes-native</p>
      <SignalField />
      <Console />
    </section>
  )
}

/* ───────────────────────── Integrations marquee ───────────────────────── */

const TOOLS = ['Kubernetes', 'Prometheus', 'Alertmanager', 'Loki', 'Jaeger', 'Helm', 'Redis', 'PostgreSQL', 'OpenAI', 'Ollama']

function Integrations() {
  const row = [...TOOLS, ...TOOLS]
  return (
    <section className="integrations" data-reveal>
      <p className="eyebrow">Works with the stack you already run</p>
      <div className="marquee">
        <div className="marquee-track">
          {row.map((t, i) => <span key={i} className="tool" aria-hidden={i >= TOOLS.length}><i />{t}</span>)}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Stats ───────────────────────── */

function Stats() {
  const cells = [
    ['Signal sources', 4, 'Metrics, logs, traces, alerts'],
    ['Alert per incident', 1, 'Not a flood'],
    ['Pods to run', 4, 'One Helm chart'],
  ]
  return (
    <section className="stats" data-reveal>
      {cells.map(([k, v, d]) => (
        <div className="stat-cell" key={k}>
          <p className="eyebrow"><Scramble text={k} /></p>
          <DotNumber value={v} />
          <p className="stat-d">{d}</p>
        </div>
      ))}
      <div className="stat-cell cta">
        <p className="stat-lede">Free and open source. Read every line.</p>
        <a href={GITHUB} className="btn btn-outline">
          <span className="btn-ico"><GitHubIcon /></span>
          View on GitHub
        </a>
      </div>
    </section>
  )
}

/* ───────────────────────── Pipeline (layered) ───────────────────────── */

const STEPS = [
  ['Collect', 'metrics, logs, traces and alerts'],
  ['Detect', 'spot what looks abnormal'],
  ['Group', 'merge it into one incident'],
  ['Rank', 'find the service that caused it'],
  ['Alert', 'explain it and send one alert'],
]

const CX = 340, PW = 172, PH = 48, ROW = 100, TOP = 50

function iso(cy, u, v, n = 8) {
  return [CX + ((u - v) * PW) / n, cy + ((u + v) * PH) / n]
}

function Plane({ cy, active, fill }) {
  const d = `M${CX},${cy - PH} L${CX + PW},${cy} L${CX},${cy + PH} L${CX - PW},${cy} Z`
  return <path d={d} className={'plane' + (active ? ' active' : '') + (fill ? ' fill' : '')} />
}

function Layers({ active }) {
  const r = rng(11)
  const kinds = ['k-metric', 'k-log', 'k-trace', 'k-alert']
  const cloud = Array.from({ length: 70 }, (_, i) => {
    const a = r() * Math.PI * 2, rad = Math.sqrt(r())
    return { x: CX + Math.cos(a) * rad * 165, y: TOP + Math.sin(a) * rad * 34, s: 1.6 + r() * 3.2, k: kinds[i % 4], d: r() * 3 }
  })
  const grid = []
  for (let u = -3; u <= 3; u++) for (let v = -3; v <= 3; v++) grid.push([u, v])
  const anomalies = new Set(['1,-2', '2,-1', '1,-1', '-2,2', '2,-2'])
  const diamond = (x, y, s) => `M${x},${y - s} L${x + s},${y} L${x},${y + s} L${x - s},${y} Z`

  // Rank layer: a small service graph laid on the plane.
  const nodes = { fe: [-3, 2], co: [-1, 0], pc: [-2, -2], rc: [0, -3], ca: [1, 1], rd: [3, 2] }
  const edges = [['fe', 'co'], ['fe', 'pc'], ['pc', 'rc'], ['co', 'ca'], ['ca', 'rd'], ['co', 'pc']]
  const hot = new Set(['fe-co', 'co-ca'])

  const y = i => TOP + i * ROW
  return (
    <svg className="layers" viewBox={`0 0 600 ${TOP * 2 + ROW * 4 + 20}`} role="img" aria-label="Five pipeline stages drawn as stacked layers: signals, anomalies, incident, service graph, alert">
      <line x1={CX - PW} y1={y(0)} x2={CX - PW} y2={y(4)} className="guide" />
      <line x1={CX + PW} y1={y(0)} x2={CX + PW} y2={y(4)} className="guide" />
      {STEPS.map((_, i) => (
        <g key={i} className={'conn' + (active === i ? ' active' : '')}>
          <line x1="0" y1={y(i)} x2={CX - PW - 8} y2={y(i)} />
          <circle cx={CX - PW - 8} cy={y(i)} r="3" />
        </g>
      ))}

      {/* 01 signals */}
      <g className={'cloud' + (active === 0 ? ' active' : '')}>
        {cloud.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.s} className={p.k} style={{ '--d': `${p.d}s` }} />)}
      </g>

      {/* 02 anomalies */}
      <Plane cy={y(1)} active={active === 1} />
      {grid.map(([u, v]) => {
        const [x, yy] = iso(y(1), u, v)
        const on = anomalies.has(`${u},${v}`)
        return <path key={`a${u}${v}`} d={diamond(x, yy, on ? 5 : 3.4)} className={'cell' + (on ? ' on' : '')} />
      })}

      {/* 03 incident */}
      <Plane cy={y(2)} active={active === 2} />
      {grid.map(([u, v]) => {
        const [x, yy] = iso(y(2), u, v)
        const on = anomalies.has(`${u},${v}`) && u > 0
        return <circle key={`c${u}${v}`} cx={x} cy={yy} r={on ? 3.6 : 1.8} className={'pt' + (on ? ' on' : '')} />
      })}
      {(() => { const [x, yy] = iso(y(2), 1.5, -1.5); return (
        <g className="group-ring">
          <ellipse cx={x} cy={yy} rx="40" ry="17" />
          <text x={x + 46} y={yy - 12}>1 incident</text>
        </g>
      ) })()}

      {/* 04 graph */}
      <Plane cy={y(3)} active={active === 3} />
      {edges.map(([a, b]) => {
        const [x1, y1] = iso(y(3), ...nodes[a]); const [x2, y2] = iso(y(3), ...nodes[b])
        return <line key={a + b} x1={x1} y1={y1} x2={x2} y2={y2} className={'g-edge' + (hot.has(`${a}-${b}`) ? ' hot' : '')} />
      })}
      {Object.entries(nodes).map(([k, p]) => {
        const [x, yy] = iso(y(3), ...p)
        return <path key={k} d={diamond(x, yy, k === 'ca' ? 7 : 4.5)} className={'g-node' + (k === 'ca' ? ' root' : '')} />
      })}

      {/* 05 alert */}
      <Plane cy={y(4)} active={active === 4} fill />
      <g className="alert-mark">
        <rect x={CX - 38} y={y(4) - 11} width="76" height="22" rx="11" />
        <text x={CX} y={y(4) + 4} textAnchor="middle">1 alert</text>
      </g>
    </svg>
  )
}

function Pipeline() {
  const { ref, i, setI, setPause } = useCycle(STEPS.length)
  return (
    <section className="block" id="pipeline">
      <div className="center-head" data-reveal>
        <p className="eyebrow accent"><Scramble text="How it works" /></p>
        <h2 className="h2"><Words lines={['From noise', 'to one answer.']} /></h2>
      </div>
      <div className="layer-card" ref={ref} data-reveal onMouseLeave={() => setPause(false)}>
        <ol className="steps">
          {STEPS.map(([t, d], k) => (
            <li key={t} className={k === i ? 'active' : ''}>
              <button type="button" onMouseEnter={() => { setI(k); setPause(true) }} onFocus={() => { setI(k); setPause(true) }} onClick={() => setI(k)}>
                <span className="n">0{k + 1}</span>
                <span className="t">{t}</span>
                <span className="d">{d}</span>
              </button>
            </li>
          ))}
        </ol>
        <Layers active={i} />
      </div>
    </section>
  )
}

/* ───────────────────────── Method (2×2) ───────────────────────── */

function WeightBars() {
  const w = [['severity', 45, 'a'], ['depth', 25, 'b'], ['onset', 20, 'c'], ['change', 10, 'd']]
  return (
    <div className="viz viz-weights">
      <div className="wbar">
        {w.map(([k, v, c]) => <span key={k} className={'seg ' + c} style={{ '--w': `${v}%` }}><b>{v}</b>{k}</span>)}
      </div>
    </div>
  )
}

function MiniGraph() {
  const N = { frontend: [60, 40], checkout: [190, 40], productcatalog: [190, 120], cart: [320, 40], 'redis-cart': [440, 40], recommendation: [60, 120] }
  const E = [['frontend', 'checkout'], ['frontend', 'productcatalog'], ['recommendation', 'productcatalog'], ['checkout', 'cart'], ['cart', 'redis-cart']]
  const hot = ['frontend-checkout', 'checkout-cart']
  return (
    <div className="viz">
      <svg viewBox="0 0 500 160" className="minigraph" role="img" aria-label="Walk from frontend toward its callees reaches cartservice">
        <defs><marker id="mg-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" /></marker></defs>
        {E.map(([a, b]) => {
          const [x1, y1] = N[a], [x2, y2] = N[b]
          const on = hot.includes(`${a}-${b}`)
          const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), k = 34 / len
          return <line key={a + b} x1={x1 + dx * k} y1={y1 + dy * k} x2={x2 - dx * k} y2={y2 - dy * k} className={on ? 'hot' : ''} markerEnd="url(#mg-arr)" />
        })}
        {Object.entries(N).map(([k, [x, y]]) => (
          <g key={k} className={k === 'cart' ? 'root' : k === 'frontend' ? 'start' : ''}>
            <rect x={x - 52} y={y - 14} width="104" height="28" rx="14" />
            <text x={x} y={y + 4} textAnchor="middle">{k}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function Claims() {
  return (
    <div className="viz viz-claims">
      <div className="claim"><span className="ok-mark">✓</span>cartservice errors rose first <span className="cite">ev-3</span></div>
      <div className="claim"><span className="ok-mark">✓</span>Checkout calls to it failed <span className="cite">ev-5</span></div>
      <div className="claim bad"><span className="no-mark">✕</span>A recent deploy caused this <span className="cite missing">no id</span></div>
    </div>
  )
}

function Dedup() {
  const ticks = Array.from({ length: 14 }, (_, i) => i)
  return (
    <div className="viz viz-dedup">
      <div className="tick-row">
        <span className="row-label">raw</span>
        {ticks.map(i => <span key={i} className="tick" style={{ '--d': `${i * 70}ms` }} />)}
      </div>
      <div className="funnel" aria-hidden="true" />
      <div className="tick-row">
        <span className="row-label">sent</span>
        <span className="one-alert">1 alert</span>
      </div>
    </div>
  )
}

function Method() {
  const cards = [
    ['Same answer every time', 'A fixed scoring formula ranks the suspects. No randomness.', <WeightBars />],
    ['Follow the calls', 'Failures spread from callee to caller, so it walks the call graph.', <MiniGraph />],
    ['Proof for every claim', 'The LLM only explains. Each claim must cite evidence.', <Claims />],
    ['One alert, not a flood', 'Related problems merge into one incident and one alert.', <Dedup />],
  ]
  return (
    <section className="block" id="features">
      <div className="left-head" data-reveal>
        <p className="eyebrow accent"><Scramble text="01 — Features" /></p>
        <h2 className="h2"><Words lines={['Built for the', '3 a.m. page.']} /></h2>
      </div>
      <div className="grid-2">
        {cards.map(([t, d, viz]) => (
          <article className="fcard" key={t} data-reveal>
            {viz}
            <h3>{t}</h3>
            <p>{d}</p>
          </article>
        ))}
      </div>
    </section>
  )
}


/* ───────────────────────── Evidence bundle (hub) ───────────────────────── */

const ICONS = {
  metric: <path d="M4 18l5-6 4 3 7-9" />,
  log: <path d="M5 7h14M5 12h10M5 17h12" />,
  trace: <path d="M4 6h9M7 12h11M10 18h8" />,
  baseline: <path d="M3 14c3 0 3-5 6-5s3 7 6 7 3-4 6-4" />,
  db: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" /></>,
  text: <path d="M12 3l1.8 4.8L19 9.5l-5.2 1.7L12 16l-1.8-4.8L5 9.5l5.2-1.7z" />,
  bell: <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0" />,
  file: <><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M9 13h7M9 17h5" /></>,
}

function Ico({ name }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name]}</svg>
}

// Curved connectors between a column of boxes and the centre card. `ys` are box centres (0–100 scale).
function Wires({ ys, side }) {
  const mid = 50
  return (
    <svg className={'wires ' + side} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {ys.map((y, i) => {
        const d = side === 'in'
          ? `M0,${y} C55,${y} 45,${mid} 100,${mid}`
          : `M0,${mid} C55,${mid} 45,${y} 100,${y}`
        return (
          <g key={i}>
            <path d={d} className="wire" vectorEffect="non-scaling-stroke" />
            <path d={d} className="spark" vectorEffect="non-scaling-stroke" pathLength="100" style={{ '--d': `${i * 0.45}s` }} />
          </g>
        )
      })}
    </svg>
  )
}

function Bundle() {
  const inputs = [['metric', 'Metrics'], ['log', 'Logs'], ['trace', 'Traces'], ['baseline', 'Baselines']]
  const outputs = [['db', 'Stored'], ['text', 'Summary'], ['bell', 'Alert']]
  return (
    <section className="block" id="bundle">
      <div className="hub-head" data-reveal>
        <div>
          <p className="eyebrow accent"><Scramble text="Introducing the evidence bundle" /></p>
          <h2 className="h2"><Words lines={['One record every', 'stage can read.']} /></h2>
        </div>
        <div className="hub-side fx" style={{ '--fx': '300ms' }}>
          <p>Every suspect carries its evidence. Storage, summary and alert all read the same record.</p>
          <a href={`${DOCS}#rca`} className="btn btn-outline">
            <span className="btn-ico"><Ico name="file" /></span>
            Read the RCA docs
          </a>
        </div>
      </div>
      <div className="hub" data-reveal>
        <div className="hub-col">
          {inputs.map(([ic, t], i) => (
            <div className="hub-node fx" key={t} style={{ '--fx': `${200 + i * 90}ms` }}><Ico name={ic} /><span>{t}</span></div>
          ))}
        </div>
        <Wires side="in" ys={[10, 36.7, 63.3, 90]} />
        <div className="hub-card fx" style={{ '--fx': '150ms' }}>
          <div className="hub-card-head"><Ico name="file" /><b>evidence bundle</b></div>
          <div className="hub-field"><code># Suspects</code><small>ranked services</small></div>
          <div className="hub-field"><code># Evidence</code><small>what each one shows</small></div>
          <div className="hub-field"><code># Citations</code><small>ids the summary quotes</small></div>
        </div>
        <Wires side="out" ys={[16.7, 50, 83.3]} />
        <div className="hub-col out">
          {outputs.map(([ic, t], i) => (
            <div className="hub-node fx" key={t} style={{ '--fx': `${500 + i * 90}ms` }}><Ico name={ic} /><span>{t}</span></div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Trust ───────────────────────── */

const TRUST = [
  ['lock', 'Read-only access', 'Only get, list and watch. It never changes your cluster.'],
  ['eye', 'Redacted first', 'Secrets, tokens and emails are stripped before any LLM call.'],
  ['cpu', 'No OpenAI needed', 'Falls back to a local Ollama model, then a plain template.'],
  ['list', 'Full audit log', 'Every alert, ack and resolve is recorded.'],
  ['pulse', 'Watches itself', 'Six Prometheus metrics about its own health.'],
  ['api', 'Simple API', 'List, acknowledge and resolve incidents over HTTP.'],
]

const TRUST_ICONS = {
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><path d="M4 4l16 16" /></>,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>,
  list: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
  pulse: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  api: <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />,
}

function Trust() {
  return (
    <section className="block" id="trust">
      <div className="center-head" data-reveal>
        <p className="eyebrow accent"><Scramble text="02 — Safe by default" /></p>
        <h2 className="h2"><Words lines={['Looks at everything.', 'Touches nothing.']} /></h2>
      </div>
      <div className="trust-grid" data-reveal>
        {TRUST.map(([ic, t, d], i) => (
          <div className="trust-cell fx" key={t} style={{ '--fx': `${i * 70}ms` }}>
            <span className="trust-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{TRUST_ICONS[ic]}</svg></span>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── Alerts + API ───────────────────────── */

function J({ k, v, last, ind = 1 }) {
  const val = typeof v === 'string' ? <span className="j-s">"{v}"</span> : typeof v === 'number' ? <span className="j-n">{v}</span> : v
  return <div style={{ paddingLeft: `${ind * 1.1}em` }}><span className="j-k">"{k}"</span>: {val}{last ? '' : ','}</div>
}

function Alerts() {
  return (
    <section className="block" id="alerts">
      <div className="alerts-grid">
        <div className="alerts-copy" data-reveal>
          <p className="eyebrow accent"><Scramble text="03 — Alerts & API" /></p>
          <h2 className="h2"><Words lines={['Alerts your team', 'can act on.']} /></h2>
          <p className="lead-left fx" style={{ '--fx': '300ms' }}>Each alert names the likely cause, the services affected and the evidence behind it.</p>
          <ul className="channels fx" style={{ '--fx': '420ms' }}>
            <li><span className="sq ok" />Console<em>today</em></li>
            <li><span className="sq ok" />Webhook<em>today</em></li>
            <li><span className="sq soon" />Slack<em>soon</em></li>
            <li><span className="sq soon" />Email<em>soon</em></li>
          </ul>
          <div className="endpoints fx" style={{ '--fx': '540ms' }}>
            <code><b>GET</b> /incidents</code>
            <code><b>GET</b> /incidents/{'{id}'}</code>
            <code><b>POST</b> /incidents/{'{id}'}/ack</code>
            <code><b>POST</b> /incidents/{'{id}'}/resolve</code>
          </div>
        </div>
        <div className="code-card" data-reveal>
          <div className="console-bar">
            <span className="tl r" /><span className="tl y" /><span className="tl g" />
            <span className="console-title">alert.json</span>
            <span className="console-badge">example</span>
          </div>
          <pre className="json">
            <div>{'{'}</div>
            <J k="severity" v="critical" />
            <J k="title" v="checkout path errors" />
            <J k="services" v={<span className="j-s">["frontend", "checkoutservice", "cartservice"]</span>} />
            <div style={{ paddingLeft: '1.1em' }}><span className="j-k">"top_candidate"</span>: {'{'}</div>
            <J k="service" v="cartservice" ind={2} />
            <J k="score" v={0.82} ind={2} />
            <J k="evidence_ids" v={<span className="j-s">["ev-3", "ev-5"]</span>} ind={2} last />
            <div style={{ paddingLeft: '1.1em' }}>{'},'}</div>
            <J k="blast_radius" v={<span className="j-s">["redis-cart"]</span>} />
            <J k="summary_text" v="cartservice errors rose first…" last />
            <div>{'}'}</div>
          </pre>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Quickstart ───────────────────────── */

function Quickstart() {
  const steps = [
    ['Start a test cluster', 'make up', 'kind, a demo shop, Prometheus, Loki and Jaeger.'],
    ['Add your settings', 'make env-setup', 'Creates a private .env. An OpenAI key is optional.'],
    ['Install InfraMind', 'make up-app', 'Builds the image and installs the Helm chart.'],
  ]
  return (
    <section className="block" id="quickstart">
      <div className="left-head row" data-reveal>
        <div>
          <p className="eyebrow accent"><Scramble text="04 — Quickstart" /></p>
          <h2 className="h2"><Words lines={['Running in', 'three commands.']} /></h2>
        </div>
        <a href={`${DOCS}#packaging`} className="link-arrow">Full setup guide →</a>
      </div>
      <div className="qs-grid">
        {steps.map(([t, cmd, d], i) => (
          <div className="qs-card" key={cmd} data-reveal>
            <span className="qs-n">0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
            <Command text={cmd} />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── Roadmap ───────────────────────── */

function Roadmap() {
  const cols = [
    ['Shipped', 'built', ['Anomaly detection', 'Incident grouping', 'Root cause ranking', 'Evidence-cited summaries', 'Alerts and incident API', 'Helm chart']],
    ['In progress', 'changed', ['Live end-to-end runs', 'Benchmark results']],
    ['Next', 'planned', ['Slack and email alerts', 'Kubernetes change tracking', 'Network and stress faults']],
  ]
  return (
    <section className="block" id="roadmap">
      <div className="center-head" data-reveal>
        <p className="eyebrow accent"><Scramble text="05 — Roadmap" /></p>
        <h2 className="h2"><Words lines={['Shipping in the open.']} /></h2>
      </div>
      <div className="road-grid">
        {cols.map(([h, s, items]) => (
          <div className={'road-col ' + s} key={h} data-reveal>
            <div className="road-head"><span className={'road-dot ' + s} />{h}<em>{items.length}</em></div>
            <ul>{items.map(it => <li key={it}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── FAQ ───────────────────────── */

const FAQ = [
  ['Does the AI decide the root cause?', 'No. A fixed, repeatable ranking picks it. The LLM only writes the summary, and every claim must cite evidence.'],
  ['Do I need an OpenAI key?', 'No. Without one it uses a local Ollama model, and if that is down, a plain template.'],
  ['What access does it need?', 'Read-only access to your cluster, plus your Prometheus, Loki and Jaeger.'],
  ['Is it production-ready?', 'Not yet. It is a preview, tested on a local kind cluster running a demo shop.'],
  ['Is it free?', 'Yes. It is open source under the MIT license.'],
]

function Faq() {
  return (
    <section className="block" id="faq">
      <div className="faq-grid">
        <div className="left-head" data-reveal>
          <p className="eyebrow accent"><Scramble text="FAQ" /></p>
          <h2 className="h2"><Words lines={['Questions,', 'answered.']} /></h2>
        </div>
        <div className="faq" data-reveal>
          {FAQ.map(([q, a]) => (
            <details key={q}>
              <summary>{q}<span aria-hidden="true">+</span></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Closing + footer ───────────────────────── */

function PixelField() {
  const r = rng(3)
  const cols = 80, rows = 22, s = 18
  const cells = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const edge = Math.min(x, cols - 1 - x) / 14 + (rows - y) / 30
      // Keep the band behind the headline almost empty so the text stays readable.
      const text = x > 16 && x < cols - 17 && y > 3 && y < rows - 4
      if (r() > (text ? 0.985 : Math.min(0.92, 0.35 + edge * 0.5))) cells.push(<rect key={`${x}-${y}`} x={x * s} y={y * s} width={s - 4} height={s - 4} className={r() > 0.93 ? 'px-hot' : 'px'} />)
    }
  }
  return <svg className="pixel-field" viewBox={`0 0 ${cols * s} ${rows * s}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">{cells}</svg>
}

function Closing() {
  return (
    <section className="closing" data-reveal>
      <PixelField />
      <div className="closing-inner">
        <h2 className="display sm"><Words lines={['Try it on your', 'next incident.']} /></h2>
        <div className="hero-ctas fx" style={{ '--fx': '550ms' }}>
          <a href="#quickstart" className="btn btn-ink btn-lg">Get started</a>
          <a href={GITHUB} className="btn btn-outline btn-lg"><GitHubIcon /> View on GitHub</a>
        </div>
      </div>
    </section>
  )
}

function Footer({ theme, setTheme }) {
  const cols = [
    ['Product', [['Features', '#features'], ['How it works', '#pipeline'], ['Quickstart', '#quickstart'], ['Roadmap', '#roadmap'], ['FAQ', '#faq']]],
    ['Docs', [['Architecture', 'architecture'], ['Detection', 'detection'], ['Root cause', 'rca'], ['Alerting', 'alerting'], ['Deployment', 'packaging']]],
    ['Project', [['GitHub', GITHUB], ['System design', 'overview'], ['Evaluation', 'evaluation'], ['Decisions', 'decisions'], ['Glossary', 'glossary']]],
  ]
  return (
    <footer className="lfoot">
      <div className="lfoot-inner">
        <div className="lfoot-brand">
          <a href="#top" className="lnav-brand lg"><Brand size={30} /></a>
          <p className="lfoot-tag">Root cause first.<br />Evidence always.</p>
          <ThemeSegment theme={theme} setTheme={setTheme} />
        </div>
        <div className="lfoot-cols">
          {cols.map(([h, links]) => (
            <div key={h}>
              <p className="eyebrow">{h}</p>
              {links.map(([l, id]) => <a key={l} href={id.startsWith('#') || id.startsWith('http') ? id : `${DOCS}#${id}`}>{l}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="lfoot-legal">
        <span>InfraMind · MIT License · 2026</span>
        <span>Preview · updated {STATUS_DATE}</span>
      </div>
    </footer>
  )
}

export default function Landing() {
  const [theme, setTheme] = useTheme()
  useReveal()
  return (
    <>
      <Nav theme={theme} setTheme={setTheme} />
      <main className="landing">
        <Hero />
        <Integrations />
        <Stats />
        <Pipeline />
        <Method />
        <Bundle />
        <Trust />
        <Alerts />
        <Quickstart />
        <Roadmap />
        <Faq />
        <Closing />
      </main>
      <Footer theme={theme} setTheme={setTheme} />
    </>
  )
}
