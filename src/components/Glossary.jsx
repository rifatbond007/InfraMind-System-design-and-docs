const terms = [
  ['RCA', 'Root cause analysis: finding the service that caused a fault.'],
  ['Signal', 'One reading: a metric, log line, trace or alert.'],
  ['Anomaly', 'A signal that looks unusual.'],
  ['Incident', 'A group of related anomalies — one problem.'],
  ['Evidence', 'The data that backs up a root-cause guess.'],
  ['Baseline', 'A simple method we compare against.'],
  ['Ablation', 'The system with one part turned off, to see what that part adds.'],
  ['Replay', 'Feeding recorded data back in; gives the same result every time.'],
  ['kind', 'A small Kubernetes cluster running on a laptop.'],
]

export default function Glossary() {
  return (
    <section id="glossary">
      <span className="section-stripe"></span>
      <p className="section-subtitle">Reference</p>
      <h2 className="section-title">Glossary</h2>
      <dl className="glossary">
        {terms.map(([t, d]) => (
          <div className="glossary-item" key={t}>
            <dt>{t}</dt>
            <dd>{d}</dd>
          </div>
        ))}
      </dl>
      <p className="note sources">Sources: <code>infraMind/</code> at branch <code>dev-rifat</code> (CLAUDE.md, docs/decision-tree.md, docs/PROGRESS.md, design specs, src/, testbed/) and the original PRD v1.1. Status as of 10 Nov 2026.</p>
    </section>
  )
}
