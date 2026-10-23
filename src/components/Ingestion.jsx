import { Section, Flow, PlanBuilt, Table, Details, OriginalFigure } from './ui.jsx'

export default function Ingestion() {
  return (
    <Section
      id="ingestion"
      eyebrow="Stage 1 · Phases P2–P3"
      title="Ingestion"
      tags={[['built', 'Built'], ['changed', 'Narrowed']]}
      summary="Four collectors turn metrics, logs, traces and alerts into one Signal format and publish it to stream:signals. Gate: make smoke-ingestion 5/5."
    >
      <Flow
        caption="Three collectors poll every 30 s over HTTP. Alertmanager pushes to a webhook."
        w={150}
        nodes={[
          { id: 'p', col: 0, row: 0, label: 'Prometheus', sub: 'query_range', status: 'external' },
          { id: 'l', col: 0, row: 1, label: 'Loki', sub: 'LogQL problem lines', status: 'external' },
          { id: 'j', col: 0, row: 2, label: 'Jaeger', sub: '/api/traces', status: 'external' },
          { id: 'a', col: 0, row: 3, label: 'Alertmanager', sub: 'webhook POST', status: 'external' },
          { id: 'cp', col: 1, row: 0, label: 'Prom collector', sub: 'cpu · mem · restarts', status: 'built' },
          { id: 'cl', col: 1, row: 1, label: 'Loki collector', sub: 'classify + redact', status: 'built' },
          { id: 'cj', col: 1, row: 2, label: 'Jaeger collector', sub: 'errors · p95 · edges', status: 'built' },
          { id: 'ca', col: 1, row: 3, label: 'Webhook API', sub: 'bearer secret', status: 'built' },
          { id: 's', col: 2, row: 1, label: 'signals', sub: 'Redis stream', status: 'built' },
          { id: 'g', col: 2, row: 3, label: 'graph-updates', sub: 'stream → RCA worker', status: 'built' },
        ]}
        edges={[['p', 'cp'], ['l', 'cl'], ['j', 'cj'], ['a', 'ca'], ['cp', 's'], ['cl', 's'], ['cj', 's'], ['ca', 's'], ['cj', 'g']]}
      />

      <PlanBuilt rows={[
        { name: 'Metrics', plan: 'Prometheus + Datadog, 30 s', status: 'changed', built: 'Prometheus only. Per-pod CPU, memory working set, restarts. Boutique is gRPC with no request metrics, so errors and latency come from Loki and Jaeger.', where: 'ingestion/prometheus.py' },
        { name: 'Logs', plan: 'ELK + Loki streaming', status: 'changed', built: 'Loki only. Pulls problem lines (error, warn, fatal, panic, traceback…), keeps a redacted 500-char message, http/gRPC codes and trace id.', where: 'ingestion/loki.py' },
        { name: 'Traces', plan: 'Jaeger + OTLP receiver', status: 'changed', built: 'Jaeger query API only, no OTLP receiver. Emits error spans, per-service p95, and caller → callee edges.', where: 'ingestion/jaeger.py' },
        { name: 'Alerts in', plan: 'PagerDuty + Grafana webhooks', status: 'changed', built: 'Alertmanager webhook. 1 MiB / 1000-alert limits; 503 on bus failure so Alertmanager retries.', where: 'api/alertmanager.py' },
        { name: 'Redaction', plan: '—', status: 'partial', built: 'JWT, bearer tokens, emails, IPv4, password/secret/token pairs. Pod, image and node name hashing (D9) is built only on the LLM path (llm/redact.py), not at ingestion.', where: 'common/redact.py' },
      ]} />

      <Details title="The Signal format">
        <Table head={['Field', 'Rule']} rows={[
          ['id', 'ULID'],
          ['ts', 'Observation time, timezone-aware UTC; epoch numbers rejected'],
          ['source', 'prometheus · loki · jaeger · otel · alertmanager'],
          ['type', 'metric · log · trace · alert'],
          ['service', 'lower-kebab; "unknown" is dropped by the bus'],
          ['severity', 'info · warning · critical'],
          ['trace_id', 'W3C 32-hex'],
          ['attrs', 'JSON-only values, includes ingested_at'],
        ]} />
        <p><b>Bus:</b> XADD with approximate MAXLEN 100,000; consumer groups; redelivery after 30 s idle; per-group dedup key with 24 h TTL written before the ACK. Malformed messages are ACKed and dropped; handler errors stay pending.</p>
        <p><b>Service names:</b> <code>service_from_pod</code> strips ReplicaSet and StatefulSet suffixes. For alerts, the service comes from <code>deployment</code>, then <code>pod</code>, then <code>service</code>, then <code>job</code>, because the Prometheus Operator puts the exporter's name in <code>service</code>.</p>
        <OriginalFigure src="/assets/Pasted%20image%20(6).png" label="Four collector types feeding a shared event bus" />
        <OriginalFigure src="/assets/Pasted%20image%20(5).png" label="Data flow from collector to bus" />
      </Details>
    </Section>
  )
}
