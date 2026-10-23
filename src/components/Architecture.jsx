import { Section, Flow, PlanBuilt, Table, Details, OriginalFigure } from './ui.jsx'

export default function Architecture() {
  return (
    <Section
      id="architecture"
      eyebrow="Architecture"
      title="Five-stage pipeline"
      tags={[['built', 'All stages wired'], ['changed', 'Not live-verified end to end']]}
      summary="Stages talk only through Redis Streams, never by direct calls. Since 23 Oct every stage is connected: the RCA worker publishes each ranking on stream:rca-results and the API process stores, explains and alerts on it. Ingestion, detection and correlation are verified live; the full path has not yet seen a live fault."
    >
      <Flow
        caption="Moving packets mark links that exist in the running code. The lower rows read right to left: the API pipeline writes Postgres first, then explains, then alerts (D20, D27-ApiPipeline)."
        w={140}
        colGap={48}
        rowGap={40}
        nodes={[
          { id: 'src', col: 0, row: 0, label: 'Prom · Loki', sub: 'Jaeger · Alertmgr', status: 'external' },
          { id: 'ing', col: 1, row: 0, label: 'Ingestion', sub: '4 collectors', status: 'built' },
          { id: 'det', col: 2, row: 0, label: 'Detection', sub: '4 detectors', status: 'built' },
          { id: 'cor', col: 3, row: 0, label: 'Correlation', sub: 'incidents', status: 'built' },
          { id: 'rca', col: 3, row: 1, label: 'RCA', sub: 'graph walk + rank', status: 'built' },
          { id: 'pipe', col: 2, row: 1, label: 'API pipeline', sub: 'rca-results consumer', status: 'built' },
          { id: 'sto', col: 1, row: 1, label: 'Postgres', sub: '1 · write first', status: 'built' },
          { id: 'llm', col: 1, row: 2, label: 'LLM explainer', sub: '2 · summary only', status: 'built' },
          { id: 'alr', col: 0, row: 2, label: 'Alerting', sub: '3 · dedup + sinks', status: 'built' },
          { id: 'api', col: 0, row: 1, label: 'API', sub: '/incidents · ack', status: 'built' },
        ]}
        edges={[['src', 'ing'], ['ing', 'det'], ['det', 'cor'], ['cor', 'rca'], ['rca', 'pipe'], ['pipe', 'sto'], ['pipe', 'llm'], ['llm', 'alr'], ['sto', 'api']]}
      />

      <PlanBuilt rows={[
        { name: 'Event bus', plan: 'Kafka or Redis Streams (open)', status: 'changed', built: 'Redis Streams with consumer groups, at-least-once, dedup keys. A generic typed consumer was added for the RCA worker.', where: 'common/bus.py' },
        { name: 'Streams', plan: 'One internal event bus', status: 'built', built: 'stream:signals, stream:incidents, stream:graph-updates and, since 23 Oct, stream:rca-results. All four have consumers.', where: 'common/stream_keys.py' },
        { name: 'Stage 1 Ingestion', plan: 'Logs, metrics, traces, alerts', status: 'built', built: 'Prometheus, Loki, Jaeger pull; Alertmanager push.', where: 'ingestion/, api/alertmanager.py' },
        { name: 'Stage 2–3 Correlate + detect', plan: 'Correlate first, then detect', status: 'changed', built: 'Order flipped: detectors score each signal, then anomalies are grouped into incidents.', where: 'detection/, correlation/' },
        { name: 'Stage 4 RCA', plan: 'Graph + change correlation + LLM', status: 'built', built: 'Worker reads incidents and graph updates, ranks candidates and publishes one RcaResult per incident revision on stream:rca-results.', where: 'rca/' },
        { name: 'Stage 5 Alerting', plan: 'Dedup, route, dispatch', status: 'built', built: 'The API process consumes stream:rca-results and runs write_incident → llm.explain → AlertRouter.dispatch → record_alert_outcome (D27-ApiPipeline). On by default; INFRAMIND_API_PIPELINE_ENABLED=false turns it off.', where: 'api/pipeline.py, alerting/' },
        { name: 'Storage', plan: 'Storage & audit', status: 'built', built: 'asyncpg schema of 5 tables. The API pipeline writes each incident before alerting; the API reads, acks and resolves.', where: 'storage/' },
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
          ['api', 'common, storage, alerting, rca, llm'],
          ['evaluation (new)', 'common, correlation, detection, rca, llm'],
        ]} />
        <p><b>Settled 23 Oct (D27-ApiPipeline):</b> D27 had placed the LLM explainer inside the RCA worker, which the rule above forbids. Now the ranking crosses a process boundary on <code>stream:rca-results</code> and the API process runs the explainer and the alert router, so <code>rca</code> still imports only <code>common</code> and the chart still ships four Deployments. The D24 hook <code>scripts/check_imports.py</code> checks the same rules in pre-commit (simulate mode).</p>
        <p>All paths are under <code>infraMind/src/inframind/</code>.</p>
        <OriginalFigure src="/assets/Pasted%20image%20(3).png" label="Five-stage pipeline with component boundaries" />
        <OriginalFigure src="/assets/Pasted%20image%20(4).png" label="Component interaction inside each stage" />
      </Details>
    </Section>
  )
}
