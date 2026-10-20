import { Section, Flow, PlanBuilt, Details, Bullets, OriginalFigure } from './ui.jsx'

export default function Alerting() {
  return (
    <Section
      id="alerting"
      eyebrow="Stage 5 · Phases P5b–P6"
      title="Explanation, alerting & storage"
      tags={[['planned', 'Not built yet'], ['partial', 'API partial']]}
      summary="None of the notification, LLM or database code exists yet. Only the API's health check and the Alertmanager webhook run today."
    >
      <Flow
        caption="Planned: the structured alert goes out first; the LLM summary follows. Postgres becomes the source of truth (D20)."
        w={146}
        nodes={[
          { id: 'rk', col: 0, row: 1, label: 'Ranked candidates', sub: 'from RCA', status: 'planned' },
          { id: 'llm', col: 1, row: 0, label: 'LLM explainer', sub: 'gpt-4o-mini / Ollama', status: 'planned' },
          { id: 'al', col: 1, row: 1, label: 'Alert router', sub: '1 alert / incident', status: 'planned' },
          { id: 'db', col: 1, row: 2, label: 'Postgres 16', sub: 'running, unused', status: 'changed' },
          { id: 'sk', col: 2, row: 1, label: 'Sinks', sub: 'Slack · email · webhook', status: 'planned' },
          { id: 'api', col: 2, row: 2, label: 'API', sub: '/incidents (planned)', status: 'partial' },
        ]}
        edges={[['rk', 'llm'], ['rk', 'al'], ['llm', 'al'], ['al', 'sk'], ['rk', 'db'], ['db', 'api']]}
      />

      <PlanBuilt rows={[
        { name: 'LLM explainer', plan: 'Optional async LLM summary', status: 'planned', built: 'Specified: JSON output where every claim cites an evidence id; invalid → retry once → deterministic template. temperature 0, cached. Redaction before any call; Ollama local fallback. No prompts or client yet.', where: 'llm/ (planned)' },
        { name: 'Dedup', plan: 'Cooldown window', status: 'planned', built: 'One alert per open incident fingerprint.', where: 'alerting/dedup.py (planned)' },
        { name: 'Routing', plan: 'Critical → PagerDuty + Slack', status: 'planned', built: 'By severity and service. PagerDuty dropped (D8).', where: 'alerting/router.py (planned)' },
        { name: 'Channels', plan: 'Slack, PagerDuty, email, webhook', status: 'planned', built: 'Docs disagree: Slack/email/webhook vs. adding Telegram.', where: 'alerting/sinks/ (planned)' },
        { name: 'Storage', plan: 'Storage & audit', status: 'planned', built: 'Tables planned: incidents, candidates, evidence, alerts, audit_log, change_events. No DB driver in dependencies.', where: 'storage/ (planned)' },
        { name: 'HTTP API', plan: '—', status: 'partial', built: 'Built: GET /healthz, POST /webhooks/alertmanager. Planned: /readyz, /metrics, GET /incidents, ack, resolve.', where: 'api/app.py' },
      ]} />

      <Details title="Latency budget">
        <Bullets items={[
          'Target: alert within 60 s of the fault, RCA within 120 s.',
          'The structured alert does not wait for the LLM. If the LLM fails or times out (20 s), the template summary is sent.',
        ]} />
        <OriginalFigure src="assets/Pasted%20image%20(11).png" label="Alerting pipeline: dedup, routing, payload, dispatch" />
        <OriginalFigure src="assets/Pasted%20image%20(12).png" label="Example alert in Slack and PagerDuty" />
      </Details>
    </Section>
  )
}
