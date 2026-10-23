import { Section, Flow, PlanBuilt, Table, Details, Bullets, OriginalFigure } from './ui.jsx'

export default function Correlation() {
  return (
    <Section
      id="correlation"
      eyebrow="Stage 3 · Phase P4b"
      title="Correlation & incidents"
      tags={[['built', 'Built'], ['changed', 'No live gate']]}
      summary="Anomalies are grouped into incidents by service and time, given a fingerprint, and moved through a small lifecycle. In the live P4 gate one frontend burst opened 6 incidents; the P4b tracker test shows the same pattern now becomes 1 incident with 6 services."
    >
      <Flow
        caption="Incident lifecycle. Resolved after 120 s with no new anomalies; expired after 1 hour open."
        w={140}
        rowGap={18}
        nodes={[
          { id: 'o', col: 0, row: 1, label: 'open', sub: 'new fingerprint', status: 'built' },
          { id: 'a', col: 1, row: 0, label: 'acknowledged', sub: 'API ack · Postgres only', status: 'partial' },
          { id: 'r', col: 2, row: 1, label: 'resolved', sub: '120 s quiet', status: 'built' },
          { id: 'x', col: 2, row: 2, label: 'expired', sub: '3600 s open', status: 'built' },
        ]}
        edges={[['o', 'a'], ['o', 'r'], ['o', 'x'], ['a', 'r'], ['a', 'x']]}
      />

      <PlanBuilt rows={[
        { name: 'Grouping', plan: 'Service + infra layer + 5-min window, dependency-constrained', status: 'changed', built: 'Same service → join; else within 300 s of the last anomaly → join; else new incident. Not yet constrained by the service graph.', where: 'correlation/window.py, tracker.py' },
        { name: 'Fingerprint / dedup', plan: 'Cooldown window', status: 'built', built: 'sha256("first service | 5-min bucket")[:16], fixed at open.', where: 'correlation/fingerprint.py' },
        { name: 'Severity', plan: 'Criticality + blast radius', status: 'built', built: 'Critical if any anomaly is critical, ≥ 3 services, or ≥ 20 anomalies.', where: 'correlation/tracker.py' },
        { name: 'Alertmanager signals', plan: 'Alert consumer feeds correlation', status: 'changed', built: 'Attached as corroboration only; never open an incident. Keeps raw Alertmanager clean as a baseline.', where: 'correlation/tracker.py' },
        { name: 'Persistence', plan: 'Storage & audit', status: 'partial', built: 'Tracker state is still in memory and lost on restart. Since 23 Oct incidents reach Postgres through RCA and the API pipeline, but an API ack still does not reach the tracker.', where: 'correlation/tracker.py, api/pipeline.py' },
      ]} />

      <Details title="Parameters and publishing rules">
        <Table head={['Parameter', 'Default']} rows={[
          ['window_s', '300'], ['cooldown_s (quiet → resolved)', '120'], ['max_age_s (→ expired)', '3600'],
          ['update_interval_s', '30'], ['critical_services', '3'], ['critical_anomalies', '20'],
          ['enabled', 'true; false is the "no correlation" ablation (one incident per anomaly)'],
        ]} />
        <Bullets items={[
          'An incident snapshot is published on open, on a severity increase, when a new service joins, on resolve/expire, and otherwise at most every 30 s.',
          'Caps: 10 anomalies per detector, 50 in total, newest 200 signal ids.',
          'The worker retries failed publishes from an outbox, and only resolves incidents while the stream is live.',
          'Gap: the P4b design\'s live "grouped" check was never added to the smoke gate.',
        ]} />
        <OriginalFigure src="/assets/Pasted%20image%20(7).png" label="Cross-pillar correlation by service, layer and time window" />
      </Details>
    </Section>
  )
}
