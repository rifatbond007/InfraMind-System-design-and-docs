import { Section, Flow, PlanBuilt, Table, Details, OriginalFigure } from './ui.jsx'

export default function Detection() {
  return (
    <Section
      id="detection"
      eyebrow="Stage 2 · Phase P4"
      title="Anomaly detection"
      tags={[['built', 'Built']]}
      summary="Simple statistics spot values that are unusual for each service. No machine learning (D3)."
    >
      <Flow
        caption="Each kind of signal goes to its own detector."
        w={150}
        nodes={[
          { id: 'm', col: 0, row: 0, label: 'Metrics', sub: 'cpu · memory', status: 'built' },
          { id: 'e', col: 0, row: 2, label: 'Errors', sub: 'logs · traces', status: 'built' },
          { id: 'lt', col: 0, row: 3, label: 'Latency', sub: 'slow requests', status: 'built' },
          { id: 'z', col: 1, row: 0, label: 'Z-score', sub: 'far from average', status: 'built' },
          { id: 'w', col: 1, row: 1, label: 'EWMA', sub: 'far from trend', status: 'built' },
          { id: 'es', col: 1, row: 2, label: 'Error spike', sub: 'sudden jump', status: 'built' },
          { id: 'lr', col: 1, row: 3, label: 'Slowdown', sub: '1.5× slower', status: 'built' },
          { id: 'fz', col: 2, row: 0, label: 'Freeze', sub: 'keep normal normal', status: 'built' },
          { id: 'an', col: 2, row: 2, label: 'Anomaly', sub: 'to correlation', status: 'built' },
        ]}
        edges={[['m', 'z'], ['m', 'w'], ['e', 'es'], ['lt', 'lr'], ['z', 'an'], ['w', 'an'], ['es', 'an'], ['lr', 'an'], ['an', 'fz']]}
      />

      <PlanBuilt rows={[
        { name: 'Metrics', plan: 'EWMA', status: 'changed', built: 'EWMA + Z-score. Only rises count.' },
        { name: 'Logs', plan: 'Pattern frequency', status: 'changed', built: 'Counts error bursts.' },
        { name: 'Traces', plan: 'Latency regression', status: 'built', built: 'Fires after 2 slow checks in a row.' },
        { name: 'Freeze', plan: '—', status: 'built', built: 'New: stops learning during an incident (D4).' },
      ]} />

      <Details title="Why these rules">
        <ul>
          <li>Tested on 6,244 real recorded signals.</li>
          <li>On a quiet cluster: 0 false alarms.</li>
          <li>Requiring 2 slow checks in a row cut false alarms from 16% to 2%.</li>
          <li>All thresholds are starting values, tuned later in P7.</li>
        </ul>
        <OriginalFigure src="/assets/Pasted%20image%20(8).png" label="Anomaly models per signal type" />
      </Details>
    </Section>
  )
}
