import { Section, Flow, PlanBuilt, Table, Details, OriginalFigure } from './ui.jsx'

export default function Ingestion() {
  return (
    <Section
      id="ingestion"
      eyebrow="Stage 1 · Phases P2–P3"
      title="Ingestion"
      tags={[['built', 'Built']]}
      summary="Four collectors read metrics, logs, traces and alerts and turn them into one common format, called a Signal."
    >
      <Flow
        caption="Three collectors ask every 30 s. Alertmanager pushes alerts to us."
        w={150}
        nodes={[
          { id: 'p', col: 0, row: 0, label: 'Prometheus', sub: 'metrics', status: 'external' },
          { id: 'l', col: 0, row: 1, label: 'Loki', sub: 'logs', status: 'external' },
          { id: 'j', col: 0, row: 2, label: 'Jaeger', sub: 'traces', status: 'external' },
          { id: 'a', col: 0, row: 3, label: 'Alertmanager', sub: 'alerts', status: 'external' },
          { id: 'cp', col: 1, row: 0, label: 'Metrics collector', sub: 'cpu · memory', status: 'built' },
          { id: 'cl', col: 1, row: 1, label: 'Log collector', sub: 'error lines', status: 'built' },
          { id: 'cj', col: 1, row: 2, label: 'Trace collector', sub: 'errors · latency', status: 'built' },
          { id: 'ca', col: 1, row: 3, label: 'Webhook', sub: 'receives alerts', status: 'built' },
          { id: 's', col: 2, row: 1, label: 'Signals', sub: 'to detection', status: 'built' },
          { id: 'g', col: 2, row: 3, label: 'Service map', sub: 'to RCA', status: 'built' },
        ]}
        edges={[['p', 'cp'], ['l', 'cl'], ['j', 'cj'], ['a', 'ca'], ['cp', 's'], ['cl', 's'], ['cj', 's'], ['ca', 's'], ['cj', 'g']]}
      />

      <PlanBuilt rows={[
        { name: 'Metrics', plan: 'Prometheus + Datadog', status: 'changed', built: 'Prometheus only.' },
        { name: 'Logs', plan: 'ELK + Loki', status: 'changed', built: 'Loki only, error lines only.' },
        { name: 'Traces', plan: 'Jaeger + OTLP', status: 'changed', built: 'Jaeger only.' },
        { name: 'Alerts', plan: 'PagerDuty + Grafana', status: 'changed', built: 'Alertmanager.' },
        { name: 'Hide secrets', plan: '—', status: 'partial', built: 'Tokens, emails and passwords removed.' },
      ]} />

      <Details title="What a Signal looks like">
        <Table head={['Field', 'Meaning']} rows={[
          ['ts', 'When it happened (UTC)'],
          ['source', 'prometheus, loki, jaeger or alertmanager'],
          ['type', 'metric, log, trace or alert'],
          ['service', 'Which service it is about'],
          ['severity', 'info, warning or critical'],
        ]} />
        <OriginalFigure src="/assets/Pasted%20image%20(6).png" label="Collectors feeding a shared bus" />
      </Details>
    </Section>
  )
}
