import { Section, Flow, PlanBuilt, Details, OriginalFigure } from './ui.jsx'

export default function Alerting() {
  return (
    <Section
      id="alerting"
      eyebrow="Stage 5 · Phases P5b–P6"
      title="Save, explain & alert"
      tags={[['built', 'Built and working'], ['changed', 'Real LLM not tested live']]}
      summary="Each incident is saved, explained in plain words by an LLM, and sent as one alert."
    >
      <Flow
        caption="Order: 1 save, 2 explain, 3 alert. If the LLM fails, a simple template is used, so the alert still goes out."
        w={146}
        nodes={[
          { id: 'rk', col: 0, row: 1, label: 'RCA result', sub: 'ranked causes', status: 'built' },
          { id: 'db', col: 1, row: 2, label: 'Postgres', sub: '1 · save', status: 'built' },
          { id: 'llm', col: 1, row: 0, label: 'LLM', sub: '2 · explain (Groq)', status: 'built' },
          { id: 'al', col: 1, row: 1, label: 'Alert', sub: '3 · one per incident', status: 'built' },
          { id: 'sk', col: 2, row: 0, label: 'Console · webhook', sub: 'working', status: 'built' },
          { id: 'sl', col: 2, row: 1, label: 'Slack · email', sub: 'later', status: 'planned' },
          { id: 'api', col: 2, row: 2, label: 'API', sub: 'view · ack · resolve', status: 'built' },
        ]}
        edges={[['rk', 'db'], ['rk', 'llm'], ['llm', 'al'], ['al', 'sk'], ['al', 'sl'], ['al', 'db'], ['db', 'api']]}
      />

      <PlanBuilt rows={[
        { name: 'Explanation', plan: 'Optional LLM summary', status: 'built', built: 'Groq LLM. Every claim must cite evidence.' },
        { name: 'Privacy', plan: '—', status: 'built', built: 'Secrets and names hidden before the LLM call.' },
        { name: 'No duplicates', plan: 'Cooldown', status: 'built', built: 'One alert per incident per 5 minutes.' },
        { name: 'Channels', plan: 'Slack, PagerDuty, email', status: 'changed', built: 'Console and webhook. Slack and email later.' },
        { name: 'Storage', plan: 'Database + audit', status: 'built', built: 'Postgres, with a log of every action.' },
        { name: 'API', plan: '—', status: 'built', built: 'List, view, acknowledge and resolve incidents.' },
      ]} />

      <Details title="More">
        <ul>
          <li>No LLM key? The alert uses a simple template summary.</li>
          <li>Acknowledging needs a person's GitHub name; bots are rejected.</li>
          <li>Fixed on 10 Nov: the LLM key was never read, and acknowledging an incident failed.</li>
        </ul>
        <OriginalFigure src="/assets/Pasted%20image%20(11).png" label="Alerting pipeline" />
        <OriginalFigure src="/assets/Pasted%20image%20(12).png" label="Example alert" />
      </Details>
    </Section>
  )
}
