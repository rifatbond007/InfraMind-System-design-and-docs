import { Section, Flow, PlanBuilt, Table, Details, OriginalFigure } from './ui.jsx'

export default function Architecture() {
  return (
    <Section
      id="architecture"
      eyebrow="Architecture"
      title="Five-stage pipeline"
      tags={[['built', 'All stages connected']]}
      summary="Data flows left to right: collect → detect → group → find the cause → save, explain and alert."
    >
      <Flow
        caption="Moving dots show links that work today."
        w={140}
        colGap={48}
        rowGap={40}
        nodes={[
          { id: 'src', col: 0, row: 0, label: 'Prom · Loki', sub: 'Jaeger · Alertmgr', status: 'external' },
          { id: 'ing', col: 1, row: 0, label: 'Ingestion', sub: 'collect', status: 'built' },
          { id: 'det', col: 2, row: 0, label: 'Detection', sub: 'spot anomalies', status: 'built' },
          { id: 'cor', col: 3, row: 0, label: 'Correlation', sub: 'group into incidents', status: 'built' },
          { id: 'rca', col: 3, row: 1, label: 'RCA', sub: 'rank causes', status: 'built' },
          { id: 'pipe', col: 2, row: 1, label: 'inframind.main', sub: 'joins the steps', status: 'built' },
          { id: 'sto', col: 1, row: 1, label: 'Postgres', sub: '1 · save', status: 'built' },
          { id: 'llm', col: 1, row: 2, label: 'LLM', sub: '2 · explain', status: 'built' },
          { id: 'alr', col: 0, row: 2, label: 'Alerting', sub: '3 · send alert', status: 'built' },
          { id: 'api', col: 0, row: 1, label: 'API', sub: 'view · ack', status: 'built' },
        ]}
        edges={[['src', 'ing'], ['ing', 'det'], ['det', 'cor'], ['cor', 'rca'], ['rca', 'pipe'], ['pipe', 'sto'], ['pipe', 'llm'], ['llm', 'alr'], ['sto', 'api']]}
      />

      <PlanBuilt rows={[
        { name: 'Message bus', plan: 'Kafka or Redis', status: 'changed', built: 'Redis Streams.' },
        { name: 'Collect', plan: 'Logs, metrics, traces, alerts', status: 'built', built: 'All four.' },
        { name: 'Detect + group', plan: 'Group first, then detect', status: 'changed', built: 'Order flipped: detect first, then group.' },
        { name: 'Find the cause', plan: 'Graph + changes + LLM', status: 'built', built: 'Graph search and scoring. LLM only explains.' },
        { name: 'Save, explain, alert', plan: 'Separate services', status: 'changed', built: 'One process does all three, in that order (D28).' },
      ]} />

      <Details title="Why one process joins the last steps (D28)">
        <p>Each module may only import a few others, so they stay testable. No module was allowed to use RCA, LLM, alerting and storage together, so nothing connected them. A small root module, <code>inframind.main</code>, now does that one job.</p>
        <Table head={['Module', 'May import']} rows={[
          ['rca', 'common'],
          ['llm', 'common, rca'],
          ['alerting', 'common, rca, llm'],
          ['storage', 'common, correlation, rca'],
          ['api', 'common, storage, alerting'],
          ['main', 'common, rca, llm, alerting, storage'],
        ]} />
        <OriginalFigure src="/assets/Pasted%20image%20(3).png" label="Five-stage pipeline" />
        <OriginalFigure src="/assets/Pasted%20image%20(4).png" label="Components inside each stage" />
      </Details>
    </Section>
  )
}
