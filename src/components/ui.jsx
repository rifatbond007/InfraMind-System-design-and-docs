// Shared building blocks: every section follows the same pattern —
// summary + status tags, status-coloured diagram, Plan vs Built table, folded details.

export const STATUS = {
  built:    { label: 'Built',    cls: 'built' },
  changed:  { label: 'Changed',  cls: 'changed' },
  partial:  { label: 'Partial',  cls: 'changed' },
  planned:  { label: 'Not built yet', cls: 'planned' },
  blocked:  { label: 'Blocked',  cls: 'blocked' },
  external: { label: 'Third-party', cls: 'external' },
}

export function Pill({ status, children }) {
  const s = STATUS[status] || STATUS.planned
  return <span className={'pill ' + s.cls}>{children || s.label}</span>
}

export function Section({ id, eyebrow, title, summary, tags = [], children }) {
  return (
    <section id={id}>
      <span className="section-stripe"></span>
      {eyebrow && <p className="section-subtitle">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {(summary || tags.length > 0) && (
        <p className="summary">
          {tags.map(([status, text], i) => <Pill key={i} status={status}>{text}</Pill>)}
          {summary}
        </p>
      )}
      {children}
    </section>
  )
}

// rows: [{ name, plan, built, status, where }]
export function PlanBuilt({ rows, planLabel = 'Planned (PRD v1.1)' }) {
  return (
    <div className="table-wrap">
      <table className="pb">
        <thead>
          <tr><th>Component</th><th>{planLabel}</th><th>Built</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name}>
              <td className="name">{r.name}</td>
              <td className="plan">{r.plan}</td>
              <td>
                <Pill status={r.status} />
                <div className="built-text">{r.built}</div>
                {r.where && <code className="where">{r.where}</code>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Generic two-column key/value or multi-column table.
export function Table({ head, rows, className = '' }) {
  return (
    <div className="table-wrap">
      <table className={'tbl ' + className}>
        <thead><tr>{head.map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Details({ title = 'Details', children }) {
  return (
    <details className="details">
      <summary>{title}</summary>
      <div className="details-body">{children}</div>
    </details>
  )
}

export function OriginalFigure({ src, label }) {
  return (
    <figure className="figure original">
      <img src={src} alt={label} loading="lazy" />
      <figcaption className="label">Original design · {label}</figcaption>
    </figure>
  )
}

export function Bullets({ items }) {
  return <ul className="bullets">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
}

/*
 * Status-coloured box diagram.
 * nodes: [{ id, col, row, label, sub, status }]
 * edges: [[fromId, toId, label?]]
 * Boxes sit on a col/row grid; edges are drawn right-side → left-side curves
 * (or bottom → top when both nodes share a column).
 */
export function Flow({ nodes, edges, w = 150, h = 52, colGap = 56, rowGap = 22, caption, legend = true }) {
  const cols = Math.max(...nodes.map(n => n.col)) + 1
  const rows = Math.max(...nodes.map(n => n.row)) + 1
  const pad = 6
  const W = cols * w + (cols - 1) * colGap + pad * 2
  const H = rows * h + (rows - 1) * rowGap + pad * 2
  const pos = Object.fromEntries(nodes.map(n => [n.id, {
    x: pad + n.col * (w + colGap),
    y: pad + n.row * (h + rowGap),
  }]))

  const path = (a, b) => {
    const A = pos[a], B = pos[b]
    if (A.x === B.x) {
      const down = B.y > A.y
      const x = A.x + w / 2
      const y1 = down ? A.y + h : A.y
      const y2 = down ? B.y : B.y + h
      return `M${x},${y1} L${x},${y2 + (down ? -6 : 6)}`
    }
    if (B.x < A.x) {
      const x1 = A.x, y1 = A.y + h / 2
      const x2 = B.x + w + 6, y2 = B.y + h / 2
      const mx = (x1 + x2) / 2
      return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
    }
    const x1 = A.x + w, y1 = A.y + h / 2
    const x2 = B.x - 6, y2 = B.y + h / 2
    const mx = (x1 + x2) / 2
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
  }

  const used = [...new Set(nodes.map(n => n.status))]

  return (
    <figure className="flow">
      <div className="flow-scroll">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={caption}>
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="arrowhead" />
            </marker>
          </defs>
          {edges.map(([a, b], i) => (
            <path key={i} d={path(a, b)} className={'edge ' + (nodes.find(n => n.id === b)?.status || '')} markerEnd="url(#arr)" fill="none" />
          ))}
          {nodes.map(n => {
            const p = pos[n.id]
            return (
              <g key={n.id} className={'node ' + (STATUS[n.status]?.cls || 'planned')}>
                <rect x={p.x} y={p.y} width={w} height={h} />
                <text x={p.x + w / 2} y={p.y + (n.sub ? h / 2 - 4 : h / 2 + 4)} className="n-label" textAnchor="middle">{n.label}</text>
                {n.sub && <text x={p.x + w / 2} y={p.y + h / 2 + 12} className="n-sub" textAnchor="middle">{n.sub}</text>}
              </g>
            )
          })}
        </svg>
      </div>
      {(caption || legend) && (
        <figcaption className="flow-cap">
          {legend && <span className="legend">{used.map(s => <Pill key={s} status={s} />)}</span>}
          {caption && <span>{caption}</span>}
        </figcaption>
      )}
    </figure>
  )
}
