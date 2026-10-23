import { Section, Flow, PlanBuilt, Details, Bullets, OriginalFigure } from './ui.jsx'

export default function Alerting() {
  return (
    <Section
      id="alerting"
      eyebrow="Stage 5 · Phases P5b–P6"
      title="Explanation, alerting & storage"
      tags={[['built', 'Built and wired'], ['changed', 'Not live-verified']]}
      summary="Since 23 Oct the API process consumes stream:rca-results and, for each result, stores the incident, asks the LLM for a summary, sends one alert and records the outcome with an audit row. Covered by unit and Postgres integration tests; not yet run against a live fault."
    >
      <Flow
        caption="Order inside the API pipeline: 1 write the incident (a storage outage refuses the result rather than alerting on something it cannot record), 2 explain, 3 dispatch, 4 record the alert and audit row in one transaction. Any failure leaves the stream entry pending for redelivery."
        w={146}
        nodes={[
          { id: 'rk', col: 0, row: 1, label: 'stream:rca-results', sub: 'from the RCA worker', status: 'built' },
          { id: 'db', col: 1, row: 2, label: 'Postgres 16', sub: '1 · write · audit', status: 'built' },
          { id: 'llm', col: 1, row: 0, label: 'LLM explainer', sub: '2 · gpt-4o-mini / Ollama', status: 'built' },
          { id: 'al', col: 1, row: 1, label: 'Alert router', sub: '3 · 1 alert / incident', status: 'built' },
          { id: 'sk', col: 2, row: 0, label: 'Console · webhook', sub: 'sinks', status: 'built' },
          { id: 'sl', col: 2, row: 1, label: 'Slack · email', sub: 'deferred', status: 'planned' },
          { id: 'api', col: 2, row: 2, label: 'API', sub: '/incidents · ack · resolve', status: 'built' },
        ]}
        edges={[['rk', 'db'], ['rk', 'llm'], ['llm', 'al'], ['al', 'sk'], ['al', 'sl'], ['al', 'db'], ['db', 'api']]}
      />

      <PlanBuilt rows={[
        { name: 'LLM explainer', plan: 'Optional async LLM summary', status: 'built', built: 'JSON output where every claim must cite an evidence id; invalid → retry once → deterministic template. Temperature 0, 15 s timeout, in-memory cache of accepted summaries only. Falls back to Ollama (llama3.1 8B) when there is no OpenAI key or OpenAI fails; any provider error degrades to the template, so an incident is never stuck. The openai package is not a declared dependency.', where: 'llm/pipeline.py, validator.py, client.py' },
        { name: 'Redaction', plan: '—', status: 'built', built: 'Before any LLM call: Secret blocks and data: payloads removed; pod, node and image names hashed (D9).', where: 'llm/redact.py' },
        { name: 'Dedup', plan: 'Cooldown window', status: 'built', built: 'One alert per incident within 300 s; escalation to critical alerts again. State is in process memory.', where: 'alerting/dedup.py' },
        { name: 'Routing', plan: 'Critical → PagerDuty + Slack', status: 'changed', built: 'Every alert goes to all enabled sinks. No severity routing table; PagerDuty dropped (D8).', where: 'alerting/router.py' },
        { name: 'Channels', plan: 'Slack, PagerDuty, email, webhook', status: 'changed', built: 'Console (default) and a generic HTTP webhook. Slack and email are deferred.', where: 'alerting/sinks/' },
        { name: 'Storage', plan: 'Storage & audit', status: 'built', built: 'asyncpg. Tables: incidents, candidates, evidence, alerts, audit_log (append-only, written in the same transaction). Writes are upserts; an older redelivered revision is refused, so a resolved incident cannot roll back to open. No migrations tool; no change_events table.', where: 'storage/, api/pipeline.py' },
        { name: 'HTTP API', plan: '—', status: 'built', built: 'GET /healthz, /readyz (Redis + Postgres), /metrics, /incidents (cursor paging), /incidents/{id}; POST ack, resolve, /webhooks/alertmanager.', where: 'api/app.py, api/incidents.py' },
      ]} />

      <Details title="Latency budget, payload and API rules">
        <Bullets items={[
          'Target: alert within 60 s of the fault, RCA within 120 s. The structured alert must not wait for the LLM.',
          'Alert payload: incident id, state, severity, title, services, top candidate with evidence ids, blast radius, redacted summary, open/close times, audit id.',
          'ack and resolve need an X-Actor header shaped like a GitHub username; AI-tool names and [bot] accounts are rejected (D25). There is no other API auth.',
          'An API ack changes only the Postgres row. It does not reach the correlation tracker or the baseline freeze.',
          'D27-ApiPipeline (23 Oct): both alerting and the LLM run in the API process, fed by stream:rca-results, so the RCA module still imports only common and the chart still ships 4 Deployments instead of 7.',
          'Fixed by the 23 Oct audit and the Postgres integration run: ack/resolve audit rows were rejected by real Postgres (empty string cast to jsonb), and resolving never set closed_at, so reading the incident back returned 500.',
        ]} />
        <OriginalFigure src="/assets/Pasted%20image%20(11).png" label="Alerting pipeline: dedup, routing, payload, dispatch" />
        <OriginalFigure src="/assets/Pasted%20image%20(12).png" label="Example alert in Slack and PagerDuty" />
      </Details>
    </Section>
  )
}
