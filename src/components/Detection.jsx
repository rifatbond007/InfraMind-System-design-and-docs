import Figure from './Figure.jsx'

export default function Detection() {
  return (
    <section id="detection">
      <span className="section-stripe"></span>
      <p className="section-subtitle">Stages 2 &amp; 3</p>
      <h2 className="section-title">Correlation &amp; Detection Engine</h2>
      <div className="section-body">
        <p>This is where raw signals become structured incidents. The correlation engine groups related signals across pillars using a combination of <strong>service identity</strong>, <strong>infrastructure layer</strong>, and <strong>time proximity</strong>. Once grouped, per-signal-type anomaly detectors evaluate each group for statistically significant deviations. Signals that cross a configurable threshold are assembled into an <strong>Incident</strong> — a structured object with a unique ID, severity score (Critical / Warning / Info), and a list of contributing signals.</p>
      </div>
      <div className="card-grid">
        {[
          { icon: '◎', title: 'Signal Normalizer', desc: 'Enriches every signal with a common service identifier, infrastructure layer tag, and normalized timestamp. This is what makes cross-pillar correlation possible.' },
          { icon: '◈', title: 'Time-Window Correlator', desc: 'Groups signals that share a service or fall within a configurable window (default: 5 minutes). Uses infrastructure layer tagging as a correlation constraint to reduce false positives.' },
          { icon: '⚡', title: 'Anomaly Detector', desc: 'Per-signal-type statistical models: EWMA baselines for metrics, log pattern frequency analysis for logs, span latency regression for traces. Extensible to custom models via configuration.' },
          { icon: '⊞', title: 'Incident Assembler', desc: 'Combines correlated anomalous signals into an Incident object. Deduplicates overlapping detections and assigns a severity score based on signal criticality and blast radius potential.' },
        ].map(c => (
          <div className="card" key={c.title}>
            <span className="icon">{c.icon}</span>
            <h4>{c.title}</h4>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
      <Figure src="assets/Pasted%20image%20(7).png" label="Figure 6: Cross-pillar correlation — the correlator groups signals by service identity, infrastructure layer, and time window, then passes each group to the anomaly detectors" />
      <div className="section-body">
        <p>Correlation is the key innovation that distinguishes InfraMind from single-pillar monitoring. By constraining signal grouping to services with known dependency relationships (from the trace-derived graph), the system avoids false positives from coincident-but-unrelated anomalies — a metric spike and a log flood that share no service lineage are kept separate.</p>
      </div>
      <Figure src="assets/Pasted%20image%20(8).png" label="Figure 7: Anomaly detection — different statistical models run per signal type: EWMA for metrics, frequency analysis for logs, latency regression for traces. Signals crossing configurable thresholds are flagged as anomalous." />
    </section>
  )
}
