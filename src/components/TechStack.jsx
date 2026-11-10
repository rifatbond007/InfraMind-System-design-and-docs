import { Section, Table, Pill } from './ui.jsx'

export default function TechStack() {
  return (
    <Section
      id="stack"
      eyebrow="Technology"
      title="Stack & quality"
      summary="Python, Redis, Postgres and standard monitoring tools."
    >
      <Table head={['Layer', 'We use', 'Dropped']} rows={[
        ['Language', 'Python 3.11', '—'],
        ['Data', 'Redis, Postgres', '—'],
        ['Monitoring', 'Prometheus, Loki, Jaeger, Grafana', <Pill status="planned">ELK, Datadog</Pill>],
        ['LLM', 'Groq (any OpenAI-style API)', '—'],
        ['Cluster', 'kind, Helm, Chaos Mesh', <Pill status="planned">AWS, GCP, Azure</Pill>],
        ['Alerts out', 'Console, webhook', <Pill status="planned">Slack, email (later)</Pill>],
      ]} />

      <h3 className="h3">Testing</h3>
      <div className="hero-stats inline">
        <div className="stat"><strong>969</strong>tests passing</div>
        <div className="stat"><strong>6</strong>CI checks on every push</div>
      </div>
    </Section>
  )
}
