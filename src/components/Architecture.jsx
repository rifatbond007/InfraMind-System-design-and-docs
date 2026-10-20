import { Section, Flow, PlanBuilt, Table, Details, OriginalFigure } from './ui.jsx'

export default function Architecture() {
  return (
    <Section
      id="architecture"
      eyebrow="Architecture"
      title="Five-stage pipeline"
      tags={[['built', '3 built'], ['planned', '3 not built']]}
      summary="Stages talk only through Redis Streams, never by direct calls. Ingestion, detection and correlation run today; their output stream has no consumer yet."
    >
      <Flow
        caption="Top row runs today. The bottom row is planned and reads right to left. Ingestion also writes stream:graph-updates for RCA."
        w={140}
        colGap={48}
        rowGap={40}
        nodes={[
          { id: 'src', col: 0, row: 0, label: 'Prom · Loki', sub: 'Jaeger · Alertmgr', status: 'external' },
          { id: 'ing', col: 1, row: 0, label: 'Ingestion', sub: '4 collectors', status: 'built' },
          { id: 'det', col: 2, row: 0, label: 'Detection', sub: '4 detectors', status: 'built' },
          { id: 'cor', col: 3, row: 0, label: 'Correlation', sub: 'incidents', status: 'built' },
          { id: 'rca', col: 3, row: 1, label: 'RCA', sub: 'graph walk + rank', status: 'planned' },
          { id: 'llm', col: 2, row: 1, label: 'LLM explainer', sub: 'summary only', status: 'planned' },
          { id: 'alr', col: 1, row: 1, label: 'Alerting', sub: 'dedup + route', status: 'planned' },
          { id: 'sto', col: 0, row: 1, label: 'Postgres', sub: 'source of truth', status: 'planned' },
        ]}
        edges={[['src', 'ing'], ['ing', 'det'], ['det', 'cor'], ['cor', 'rca'], ['rca', 'llm'], ['llm', 'alr'], ['alr', 'sto']]}
      />

      <PlanBuilt rows={[
        { name: 'Event bus', plan: 'Kafka or Redis Streams (open)', status: 'changed', built: 'Redis Streams with consumer groups, at-least-once, dedup keys.', where: 'common/bus.py' },
        { name: 'Streams', plan: 'One internal event bus', status: 'built', built: 'stream:signals, stream:incidents, stream:graph-updates', where: 'common/stream_keys.py' },
        { name: 'Stage 1 Ingestion', plan: 'Logs, metrics, traces, alerts', status: 'built', built: 'Prometheus, Loki, Jaeger pull; Alertmanager push.', where: 'ingestion/, api/alertmanager.py' },
        { name: 'Stage 2–3 Correlate + detect', plan: 'Correlate first, then detect', status: 'changed', built: 'Order flipped: detectors score each signal, then anomalies are grouped into incidents.', where: 'detection/, correlation/' },
        { name: 'Stage 4 RCA', plan: 'Graph + change correlation + LLM', status: 'planned', built: 'Package holds a docstring and README only.', where: 'rca/' },
        { name: 'Stage 5 Alerting', plan: 'Dedup, route, dispatch', status: 'planned', built: 'Package holds a docstring and README only.', where: 'alerting/' },
        { name: 'Storage', plan: 'Storage & audit', status: 'planned', built: 'Postgres 16 runs in compose but no code uses it.', where: 'storage/' },
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
        ]} />
        <p>All paths are under <code>infraMind/src/inframind/</code>.</p>
        <OriginalFigure src="assets/Pasted%20image%20(3).png" label="Five-stage pipeline with component boundaries" />
        <OriginalFigure src="assets/Pasted%20image%20(4).png" label="Component interaction inside each stage" />
      </Details>
    </Section>
  )
}
