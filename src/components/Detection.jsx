import { Section, Flow, PlanBuilt, Table, Details, Bullets, OriginalFigure } from './ui.jsx'

export default function Detection() {
  return (
    <Section
      id="detection"
      eyebrow="Stage 2 · Phase P4"
      title="Anomaly detection"
      tags={[['built', 'Built']]}
      summary="Four statistical detectors score every signal per (service, metric). No machine learning (D3). While an incident is open, its services' baselines freeze so the fault doesn't become the new normal. Gate: make smoke-detection 4/4."
    >
      <Flow
        caption="Each signal type goes to the detector built for it. All four feed the correlation tracker."
        w={150}
        nodes={[
          { id: 'm', col: 0, row: 0, label: 'Metric signals', sub: 'cpu · mem · restarts', status: 'built' },
          { id: 'e', col: 0, row: 2, label: 'Error signals', sub: 'log lines · error spans', status: 'built' },
          { id: 'lt', col: 0, row: 3, label: 'span_latency', sub: 'p95 per service', status: 'built' },
          { id: 'z', col: 1, row: 0, label: 'Z-score', sub: '60 samples, |z| ≥ 3', status: 'built' },
          { id: 'w', col: 1, row: 1, label: 'EWMA', sub: 'α 0.3, 3σ', status: 'built' },
          { id: 'es', col: 1, row: 2, label: 'Error spike', sub: '≥ max(3, 3×base)', status: 'built' },
          { id: 'lr', col: 1, row: 3, label: 'Latency regr.', sub: 'p95 > 1.5× median', status: 'built' },
          { id: 'fz', col: 2, row: 0, label: 'Baseline freeze', sub: '300 s renewable', status: 'built' },
          { id: 'an', col: 2, row: 2, label: 'Anomaly', sub: '→ correlation', status: 'built' },
        ]}
        edges={[['m', 'z'], ['m', 'w'], ['e', 'es'], ['lt', 'lr'], ['z', 'an'], ['w', 'an'], ['es', 'an'], ['lr', 'an'], ['an', 'fz']]}
      />

      <PlanBuilt rows={[
        { name: 'Metrics', plan: 'EWMA baselines', status: 'changed', built: 'EWMA plus a rolling Z-score, both up-only for CPU and memory.', where: 'detection/ewma.py, zscore.py' },
        { name: 'Logs', plan: 'Log pattern frequency analysis', status: 'changed', built: 'Error-spike count over 300 s against a 12-window baseline. Counts events, not a rate, because collectors publish only problem lines.', where: 'detection/error_spike.py' },
        { name: 'Traces', plan: 'Span latency regression', status: 'built', built: 'p95 > 1.5× rolling median and ≥ +10 ms, for 2 polls in a row.', where: 'detection/latency_regression.py' },
        { name: 'Baseline freeze', plan: '—', status: 'built', built: 'New (D4). Frozen detectors keep scoring but stop learning.', where: 'detection/freeze.py' },
        { name: 'Severity', plan: 'Critical / Warning / Info', status: 'built', built: 'Per detector, e.g. critical at |z| ≥ 4.5 or any counter jump.', where: 'detection/engine.py' },
      ]} />

      <Details title="Thresholds and the evidence behind them">
        <Table head={['Detector', 'Defaults', 'Critical when']} rows={[
          ['Z-score', 'window 60, threshold 3.0, min 10 samples', '|z| ≥ 4.5 or counter'],
          ['EWMA', 'α 0.3, k 3.0σ, min 10 samples', '≥ 4.5σ or counter'],
          ['Error spike', 'window 300 s, min 3, k 3.0, 12 baseline windows', 'count ≥ 6'],
          ['Latency regression', 'window 60, +50%, ≥ 10 ms, ≥ 10 spans, 2 consecutive', 'ratio ≥ 3'],
        ]} />
        <p>Every value can be overridden with <code>INFRAMIND_DETECTION_&lt;DETECTOR&gt;_&lt;PARAM&gt;</code>. They are starting values, to be tuned on the dev split in P7.</p>
        <p><b>Measured on 6,244 recorded real signals</b> (P4 design spec):</p>
        <Bullets items={[
          'A naive std floor of 1e-9 false-fired on 0.8% of 1,624 quiet CPU samples. Per-metric noise floors brought that to 0%.',
          'All 6 metric anomalies seen were CPU drops when traffic stopped, so CPU and memory now alert only on increases.',
          'A single-poll p95 rule fired on 16% of frontend polls; 2 consecutive polls cut it to 2%.',
          'A regression test replays 3,516 quiet-cluster samples (89 min) and must produce no anomalies.',
        ]} />
        <OriginalFigure src="assets/Pasted%20image%20(8).png" label="Per-signal-type anomaly models" />
      </Details>
    </Section>
  )
}
