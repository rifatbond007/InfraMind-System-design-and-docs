import { Section, Flow, PlanBuilt, Table, Details, OriginalFigure } from './ui.jsx'

export default function Architecture() {
  return (
    <Section
      id="architecture"
      eyebrow="Architecture"
      title="Five-stage pipeline"
      tags={[['built', 'All stages coded'], ['partial', 'RCA → alert not wired']]}
      summary="Stages talk only through Redis Streams, never by direct calls. Every stage now exists as tested code. Ingestion, detection, correlation and RCA run as live workers; the RCA result is logged but not yet passed to the LLM, alerting or Postgres."
    >
      <Flow
        caption="Moving packets mark links that carry data today. The bottom row reads right to left; its dashed links exist in code but are not called by the running pipeline yet."
        w={140}
        colGap={48}
        rowGap={40}
        nodes={[
          { id: 'src', col: 0, row: 0, label: 'Prom · Loki', sub: 'Jaeger · Alertmgr', status: 'external' },
          { id: 'ing', col: 1, row: 0, label: 'Ingestion', sub: '4 collectors', status: 'built' },
          { id: 'det', col: 2, row: 0, label: 'Detection', sub: '4 detectors', status: 'built' },
          { id: 'cor', col: 3, row: 0, label: 'Correlation', sub: 'incidents', status: 'built' },
          { id: 'rca', col: 3, row: 1, label: 'RCA', sub: 'graph walk + rank', status: 'built' },
          { id: 'llm', col: 2, row: 1, label: 'LLM explainer', sub: 'summary only', status: 'partial' },
          { id: 'alr', col: 1, row: 1, label: 'Alerting', sub: 'dedup + route', status: 'partial' },
          { id: 'sto', col: 0, row: 1, label: 'Postgres', sub: 'source of truth', status: 'partial' },
          { id: 'api', col: 0, row: 2, label: 'API', sub: '/incidents · ack', status: 'built' },
        ]}
        edges={[['src', 'ing'], ['ing', 'det'], ['det', 'cor'], ['cor', 'rca'], ['rca', 'llm', 'todo'], ['llm', 'alr', 'todo'], ['alr', 'sto', 'todo'], ['sto', 'api']]}
      />

      <PlanBuilt rows={[
        { name: 'Event bus', plan: 'Kafka or Redis Streams (open)', status: 'changed', built: 'Redis Streams with consumer groups, at-least-once, dedup keys. A generic typed consumer was added for the RCA worker.', where: 'common/bus.py' },
        { name: 'Streams', plan: 'One internal event bus', status: 'built', built: 'stream:signals, stream:incidents, stream:graph-updates. All three now have consumers.', where: 'common/stream_keys.py' },
        { name: 'Stage 1 Ingestion', plan: 'Logs, metrics, traces, alerts', status: 'built', built: 'Prometheus, Loki, Jaeger pull; Alertmanager push.', where: 'ingestion/, api/alertmanager.py' },
        { name: 'Stage 2–3 Correlate + detect', plan: 'Correlate first, then detect', status: 'changed', built: 'Order flipped: detectors score each signal, then anomalies are grouped into incidents.', where: 'detection/, correlation/' },
        { name: 'Stage 4 RCA', plan: 'Graph + change correlation + LLM', status: 'built', built: 'Worker reads incidents and graph updates, ranks candidates and logs them. Publishes nothing downstream yet.', where: 'rca/' },
        { name: 'Stage 5 Alerting', plan: 'Dedup, route, dispatch', status: 'partial', built: 'Router, dedup and sinks built and tested; constructed in the API process but never dispatched (D27).', where: 'alerting/' },
        { name: 'Storage', plan: 'Storage & audit', status: 'partial', built: 'asyncpg schema of 5 tables; the API reads, acks and resolves. No pipeline process writes incidents yet.', where: 'storage/' },
      ]} />

      <Details title="Module dependency rules (enforced by a test)">
        <p><code>tests/unit/test_module_dag.py</code> fails the build if a module imports something it shouldn't. RCA may import only <code>common</code>, so it can be tested in isolation. Only <code>api</code> may import FastAPI.</p>
        <Table head={['Module', 'May import']} rows={[
          ['common', '— (shared kernel)'],
          ['ingestion, detection', 'common'],
          ['correlation', 'common, detection'],
          ['rca', 'common'],
          ['llm', 'common, rca'],
          ['alerting', 'common, rca, llm'],
          ['storage', 'common, correlation, rca'],
          ['api', 'common, storage, alerting'],
          ['evaluation (new)', 'common, correlation, detection, rca, llm'],
        ]} />
        <p><b>Conflict to settle:</b> D27 says the LLM explainer runs inside the RCA worker, but the rule above forbids <code>rca</code> from importing <code>llm</code>. D27 also places alerting in the API process, while standard 06b puts it in the RCA worker. Wiring the pipeline end to end needs one of these to change.</p>
        <p>All paths are under <code>infraMind/src/inframind/</code>.</p>
        <OriginalFigure src="assets/Pasted%20image%20(3).png" label="Five-stage pipeline with component boundaries" />
        <OriginalFigure src="assets/Pasted%20image%20(4).png" label="Component interaction inside each stage" />
      </Details>
    </Section>
  )
}
