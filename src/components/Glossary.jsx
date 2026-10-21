const terms = [
  ['MTTD', 'Mean time to detect: from fault start to first alert.'],
  ['RCA', 'Root cause analysis: naming the service that caused the fault, not the ones showing symptoms.'],
  ['Signal', 'One normalised observation (metric, log, trace or alert) on stream:signals.'],
  ['Anomaly', 'A signal a detector scored as abnormal.'],
  ['Incident', 'A group of related anomalies with one fingerprint and a lifecycle.'],
  ['Fingerprint', 'A 16-hex hash of the first service and a 5-minute bucket; the dedup key.'],
  ['Baseline freeze', 'Detectors stop learning for services in an open incident (D4).'],
  ['Service graph', 'Directed caller → callee graph built from Jaeger spans.'],
  ['Blast radius', 'The services likely affected by a root cause.'],
  ['Soak run', 'A long fault-free run used to count false alarms per hour.'],
  ['Ablation', 'The full system with one part switched off, to measure what that part adds.'],
  ['Evidence bundle', 'The metrics, logs, traces and changes behind one candidate, each with an id the LLM must cite.'],
  ['Replay', 'Re-feeding a recorded signal fixture through the pipeline in signal time; gives identical results every run.'],
  ['kind', 'Kubernetes in Docker: a local cluster used as the testbed.'],
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
      <p className="note sources">Sources: <code>infraMind/</code> at branch <code>dev-rifat</code> (CLAUDE.md, docs/decision-tree.md, docs/PROGRESS.md, design specs, src/, testbed/) and the original PRD v1.1. Status as of 21 Oct 2026 (through commit 6583d9c, P8).</p>
    </section>
  )
}
