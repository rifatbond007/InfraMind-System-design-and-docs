import { Section, Flow, PlanBuilt, Details, Bullets, OriginalFigure } from './ui.jsx'

export default function Alerting() {
  return (
    <Section
      id="alerting"
      eyebrow="Stage 5 · Phases P5b–P6"
      title="Explanation, alerting & storage"
      tags={[['built', 'Built'], ['partial', 'Not wired to RCA']]}
      summary="The LLM explainer, alert router, Postgres store and incident API are built and tested. The API serves incidents from Postgres, but no running process yet writes incidents there, explains them or sends alerts."
    >
      <Flow
        caption="Planned order: the structured alert goes out first; the LLM summary follows. Dashed links exist in code but are not called by the live pipeline yet."
        w={146}
        nodes={[
          { id: 'rk', col: 0, row: 1, label: 'Ranked candidates', sub: 'from RCA', status: 'built' },
          { id: 'llm', col: 1, row: 0, label: 'LLM explainer', sub: 'gpt-4o-mini / Ollama', status: 'built' },
          { id: 'al', col: 1, row: 1, label: 'Alert router', sub: '1 alert / incident', status: 'built' },
          { id: 'db', col: 1, row: 2, label: 'Postgres 16', sub: '5 tables · audit', status: 'built' },
          { id: 'sk', col: 2, row: 0, label: 'Console · webhook', sub: 'sinks', status: 'built' },
          { id: 'sl', col: 2, row: 1, label: 'Slack · email', sub: 'deferred', status: 'planned' },
          { id: 'api', col: 2, row: 2, label: 'API', sub: '/incidents · ack · resolve', status: 'built' },
        ]}
        edges={[['rk', 'llm', 'todo'], ['rk', 'al', 'todo'], ['llm', 'al', 'todo'], ['al', 'sk'], ['al', 'sl'], ['rk', 'db', 'todo'], ['db', 'api']]}
      />

      <PlanBuilt rows={[
        { name: 'LLM explainer', plan: 'Optional async LLM summary', status: 'built', built: 'JSON output where every claim must cite an evidence id; invalid → retry once → deterministic template. Temperature 0, 15 s timeout, in-memory cache. Falls back to Ollama (llama3.1 8B) when there is no OpenAI key or OpenAI fails. The openai package is not a declared dependency.', where: 'llm/pipeline.py, validator.py, client.py' },
        { name: 'Redaction', plan: '—', status: 'built', built: 'Before any LLM call: Secret blocks and data: payloads removed; pod, node and image names hashed (D9).', where: 'llm/redact.py' },
        { name: 'Dedup', plan: 'Cooldown window', status: 'built', built: 'One alert per incident within 300 s; escalation to critical alerts again. State is in process memory.', where: 'alerting/dedup.py' },
        { name: 'Routing', plan: 'Critical → PagerDuty + Slack', status: 'changed', built: 'Every alert goes to all enabled sinks. No severity routing table; PagerDuty dropped (D8).', where: 'alerting/router.py' },
        { name: 'Channels', plan: 'Slack, PagerDuty, email, webhook', status: 'changed', built: 'Console (default) and a generic HTTP webhook. Slack and email are deferred.', where: 'alerting/sinks/' },
        { name: 'Storage', plan: 'Storage & audit', status: 'partial', built: 'asyncpg. Tables: incidents, candidates, evidence, alerts, audit_log (append-only, written in the same transaction). No migrations tool; no change_events table. Nothing in the pipeline writes to it yet.', where: 'storage/' },
        { name: 'HTTP API', plan: '—', status: 'built', built: 'GET /healthz, /readyz (Redis + Postgres), /metrics, /incidents (cursor paging), /incidents/{id}; POST ack, resolve, /webhooks/alertmanager.', where: 'api/app.py, api/incidents.py' },
      ]} />

      <Details title="Latency budget, payload and API rules">
        <Bullets items={[
          'Target: alert within 60 s of the fault, RCA within 120 s. The structured alert must not wait for the LLM.',
          'Alert payload: incident id, state, severity, title, services, top candidate with evidence ids, blast radius, redacted summary, open/close times, audit id.',
          'ack and resolve need an X-Actor header shaped like a GitHub username; AI-tool names and [bot] accounts are rejected (D25). There is no other API auth.',
          'An API ack changes only the Postgres row. It does not reach the correlation tracker or the baseline freeze.',
          'D27: alerting stays in the API process and the LLM in the RCA worker, so the chart ships 4 Deployments instead of 7.',
        ]} />
        <OriginalFigure src="assets/Pasted%20image%20(11).png" label="Alerting pipeline: dedup, routing, payload, dispatch" />
        <OriginalFigure src="assets/Pasted%20image%20(12).png" label="Example alert in Slack and PagerDuty" />
      </Details>
    </Section>
  )
}
