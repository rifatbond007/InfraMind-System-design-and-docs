import { Section, Flow, PlanBuilt, Details, OriginalFigure } from './ui.jsx'

export default function Correlation() {
  return (
    <Section
      id="correlation"
      eyebrow="Stage 3 · Phase P4b"
      title="Correlation & incidents"
      tags={[['built', 'Built']]}
      summary="Related anomalies are grouped into one incident, so one fault gives one alert. In a test, 6 alerts became 1."
    >
      <Flow
        caption="An incident's life: resolved after 2 quiet minutes, expired after 1 hour."
        w={140}
        rowGap={18}
        nodes={[
          { id: 'o', col: 0, row: 1, label: 'open', sub: 'new problem', status: 'built' },
          { id: 'a', col: 1, row: 0, label: 'acknowledged', sub: 'a person saw it', status: 'partial' },
          { id: 'r', col: 2, row: 1, label: 'resolved', sub: '2 min quiet', status: 'built' },
          { id: 'x', col: 2, row: 2, label: 'expired', sub: '1 hour', status: 'built' },
        ]}
        edges={[['o', 'a'], ['o', 'r'], ['o', 'x'], ['a', 'r'], ['a', 'x']]}
      />

      <PlanBuilt rows={[
        { name: 'Grouping', plan: 'By service, time and dependencies', status: 'changed', built: 'By service and time (5 min). Not by dependencies yet.' },
        { name: 'Severity', plan: 'Critical / warning / info', status: 'built', built: 'Critical if 3+ services or 20+ anomalies.' },
        { name: 'Alertmanager alerts', plan: 'Open incidents', status: 'changed', built: 'Only support an incident, never open one.' },
        { name: 'Memory', plan: 'Saved', status: 'partial', built: 'Saved in Postgres, but lost from the worker on restart.' },
      ]} />

      <Details title="More">
        <ul>
          <li>Each incident gets a fingerprint so duplicates are merged.</li>
          <li>An "ack" from the API is saved, but the grouping worker does not see it yet.</li>
        </ul>
        <OriginalFigure src="/assets/Pasted%20image%20(7).png" label="Grouping by service, layer and time" />
      </Details>
    </Section>
  )
}
