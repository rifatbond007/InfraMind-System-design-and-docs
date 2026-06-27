export default function TechStack() {
  return (
    <section>
      <span className="section-stripe"></span>
      <p className="section-subtitle">Technology</p>
      <h2 className="section-title">Target Stack &amp; Integrations</h2>
      <div className="section-body"><p>InfraMind is designed to integrate with existing tooling, not replace it. Each connector is a modular adapter — adding support for a new tool means implementing a standard interface.</p></div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '0.25rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>Data Sources</h4>
      <TechList items={['ELK', 'Loki', 'Prometheus', 'Datadog', 'Jaeger', 'OpenTelemetry', 'PagerDuty', 'Grafana']} />

      <h4 style={{ marginTop: '1rem', marginBottom: '0.25rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>Infrastructure</h4>
      <TechList items={['Kubernetes', 'AWS', 'GCP', 'Azure', 'Microservices', 'VMs']} />

      <h4 style={{ marginTop: '1rem', marginBottom: '0.25rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>Channels</h4>
      <TechList items={['Slack', 'PagerDuty', 'Webhook', 'Email']} />

      <h4 style={{ marginTop: '1rem', marginBottom: '0.25rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>Evaluation</h4>
      <TechList items={['Chaos Mesh', 'AWS FIS', 'Online Boutique']} />
    </section>
  )
}

function TechList({ items }) {
  return (
    <div className="tech-list">
      {items.map(i => <span key={i}>{i}</span>)}
    </div>
  )
}
