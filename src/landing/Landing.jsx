// InfraMind project landing page. The system design docs live at /system-design/ (the "Docs" tab).
// Every fact here comes from the infraMind repo; numbers from development smoke runs are labelled.
import { useState } from 'react'
import {
  DOCS, Brand, useTheme, ThemeIconButton, ThemeSegment, DotNumber, Command,
  useReveal, useScrolled, useCycle, useReady, Words, Scramble,
} from './parts.jsx'

const STATUS_DATE = '23 Oct 2026'

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
  ['Pipeline', '#pipeline'],
  ['Method', '#method'],
  ['Research', '#research'],
  ['Build log', '#log'],
  ['Team', '#team'],
]

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
          <a href={DOCS} className="btn btn-ink btn-sm">Read the docs</a>
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
        <span className="new">NEW</span> Pipeline wired end to end · {STATUS_DATE} <span aria-hidden="true">→</span>
      </a>
      <h1 className="display"><Words lines={['Find the root cause,', 'not the loudest symptom.']} base={120} /></h1>
      <p className="hero-sub fx" style={{ '--fx': '650ms' }}>InfraMind watches a Kubernetes cluster and tells you which service broke, with the proof.</p>
      <div className="hero-ctas fx" style={{ '--fx': '800ms' }}>
        <a href={DOCS} className="btn btn-ink btn-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M9 13h7M9 17h5" /></svg>
          Read the system design
        </a>
        <Command text="make up && make up-app" />
      </div>
      <SignalField />
      <Console />
    </section>
  )
}

/* ───────────────────────── Stats ───────────────────────── */

function Stats() {
  const cells = [
    ['Signal types', 4, 'Metrics, logs, traces, alerts'],
    ['Detectors', 4, 'Simple statistics, no training'],
    ['Alert per incident', 1, 'No alert storms'],
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
        <p className="stat-lede">See how every stage is built.</p>
        <a href={DOCS} className="btn btn-outline">
          <span className="btn-ico"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="6" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="12" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="12" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg></span>
          Open the docs
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
        <h2 className="h2"><Words lines={['Four signals. One incident.', 'One ranked answer.']} /></h2>
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
    <section className="block" id="method">
      <div className="left-head" data-reveal>
        <p className="eyebrow accent"><Scramble text="01 — How it decides" /></p>
        <h2 className="h2"><Words lines={['The graph ranks.', 'The LLM explains.']} /></h2>
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

/* ───────────────────────── Research ───────────────────────── */

const TARGETS = [
  ['Time to detect', '< 60 s', 'smoke', '22–28 s so far'],
  ['Less alert noise', '≥ 40%', 'smoke', ''],
  ['Right root cause', '≥ 60%', 'smoke', ''],
  ['Root cause time', '< 120 s', 'pending', ''],
  ['False alarms', '< 25%', 'pending', ''],
]

function Research() {
  return (
    <section className="block" id="research">
      <div className="left-head" data-reveal>
        <p className="eyebrow accent"><Scramble text="02 — Research" /></p>
        <h2 className="h2"><Words lines={['Measured, not claimed.']} /></h2>
      </div>
      <div className="research-grid">
        <div className="rq" data-reveal>
          <p className="eyebrow"><Scramble text="Research question" /></p>
          <p className="rq-text">Can combining logs, metrics, traces and alerts <b>detect faults faster</b>, <b>cut alert noise</b> and <b>find the root cause</b>?</p>
          <div className="rq-meta">
            <div><span className="eyebrow">Test app</span>11 services</div>
            <div><span className="eyebrow">Fault scenarios</span>14</div>
            <div><span className="eyebrow">Runs each</span>5</div>
            <div><span className="eyebrow">Baselines</span>6</div>
          </div>
        </div>
        <div className="targets" data-reveal>
          {TARGETS.map(([m, t, s, e]) => (
            <div className="target" key={m}>
              <div className="t-top">
                <span className="t-metric">{m}</span>
                <span className={'tag ' + s}>{s === 'smoke' ? 'Early check' : 'Not measured yet'}</span>
              </div>
              <div className="t-row"><span className="t-goal">target {t}</span>{e && <span className="t-ev">{e}</span>}</div>
            </div>
          ))}
          <p className="fine">Early checks are development runs, not final results.</p>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Stack ───────────────────────── */

function Stack() {
  const items = [
    ['Testbed', 'kind + Online Boutique', 'A full cluster on one laptop.', 'testbed'],
    ['Observability', 'Prometheus · Loki · Jaeger', 'Reads the tools you already run.', 'ingestion'],
    ['Faults', 'Chaos Mesh', 'Breaks things on purpose.', 'evaluation'],
    ['Core', 'Python · Redis · Postgres', 'Streams in, records out.', 'architecture'],
    ['Deploy', 'Helm chart', 'Four pods, read-only access.', 'packaging'],
  ]
  return (
    <section className="block" id="stack">
      <div className="center-head" data-reveal>
        <h2 className="h2"><Words lines={['Built on what a cluster', 'already runs.']} /></h2>
      </div>
      <div className="stack-grid">
        {items.map(([tag, t, d, href]) => (
          <a className="scard" key={tag} href={`${DOCS}#${href}`} data-reveal>
            <span className="eyebrow"><Scramble text={tag} /></span>
            <h3>{t}</h3>
            <p>{d}</p>
            <span className="more">→</span>
          </a>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── Build log ───────────────────────── */

const LOG = [
  ['Audit', '23 Oct', 'Pipeline connected end to end', 'built'],
  ['P8', '21 Oct', 'Helm packaging', 'built'],
  ['P7', '21 Oct', 'Evaluation harness', 'changed'],
  ['P5–P6', '21 Oct', 'Root cause, explainer, alerts', 'built'],
  ['P4', '19 Oct', 'Detection and grouping', 'built'],
  ['P2–P3', '19 Oct', 'Signal collectors', 'built'],
  ['P1', '18 Oct', 'Testbed cluster', 'built'],
  ['P9', 'Next', 'Research paper', 'planned'],
]

function BuildLog() {
  return (
    <section className="block" id="log">
      <div className="left-head row" data-reveal>
        <div>
          <p className="eyebrow accent"><Scramble text="03 — Build log" /></p>
          <h2 className="h2"><Words lines={['Small phases, often.']} /></h2>
        </div>
        <a href={`${DOCS}#overview`} className="link-arrow">Full status →</a>
      </div>
      <ul className="log">
        {LOG.map(([tag, date, text, s]) => (
          <li key={tag} data-reveal>
            <span className="log-tag">{tag}</span>
            <span className="log-text">{text}</span>
            <span className={'tag ' + s}>{s === 'built' ? 'Built' : s === 'changed' ? 'Partial' : 'Planned'}</span>
            <span className="log-date">{date}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ───────────────────────── Team ───────────────────────── */

function Team() {
  const people = [
    ['Md. Rifat Hossain', 'Testbed · Evaluation', ['Testbed', 'Evaluation', 'Packaging']],
    ['Abdullah All Moneem', 'Signals · Detection', ['Collectors', 'Detection', 'Grouping']],
    ['Rayhan Islam Prome', 'Reasoning · Delivery', ['Root cause', 'Explainer', 'Alerts']],
  ]
  return (
    <section className="block" id="team">
      <div className="center-head" data-reveal>
        <h2 className="h2"><Words lines={['Three builders.', 'One question.']} /></h2>
        <p className="lead fx" style={{ '--fx': '350ms' }}>Supervised by Golam Moktader Nayeem.</p>
      </div>
      <div className="team-grid">
        {people.map(([n, role, own]) => (
          <article className="pcard" key={n} data-reveal>
            <span className="avatar" aria-hidden="true">{n.split(' ').filter(w => !w.endsWith('.')).map(w => w[0]).slice(0, 2).join('')}</span>
            <p className="eyebrow"><Scramble text={role} /></p>
            <h3>{n}</h3>
            <ul>{own.map(o => <li key={o}>{o}</li>)}</ul>
          </article>
        ))}
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
        <h2 className="display sm"><Words lines={['Read how it is built.']} /></h2>
        <div className="hero-ctas fx" style={{ '--fx': '550ms' }}>
          <a href={DOCS} className="btn btn-ink btn-lg">Open the system design</a>
          <Command text="make up && make up-app" />
        </div>
      </div>
    </section>
  )
}

function Footer({ theme, setTheme }) {
  const cols = [
    ['System design', [['Architecture', 'architecture'], ['Ingestion', 'ingestion'], ['Detection', 'detection'], ['Correlation', 'correlation'], ['Root cause', 'rca'], ['Alerting', 'alerting']]],
    ['Research', [['Evaluation', 'evaluation'], ['Testbed', 'testbed'], ['Decisions', 'decisions'], ['Needs a decision', 'decide'], ['Glossary', 'glossary']]],
    ['Project', [['Pipeline', '#pipeline'], ['Method', '#method'], ['Build log', '#log'], ['Team', '#team']]],
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
              {links.map(([l, id]) => <a key={l} href={id.startsWith('#') ? id : `${DOCS}#${id}`}>{l}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="lfoot-legal">
        <span>InfraMind · 2026</span>
        <span>Status as of {STATUS_DATE}</span>
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
        <Stats />
        <Pipeline />
        <Method />
        <Bundle />
        <Research />
        <Stack />
        <BuildLog />
        <Team />
        <Closing />
      </main>
      <Footer theme={theme} setTheme={setTheme} />
    </>
  )
}
