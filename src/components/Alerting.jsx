import Figure from './Figure.jsx'

export default function Alerting() {
  return (
    <section id="alerting">
      <span className="section-stripe"></span>
      <p className="section-subtitle">Stage 5</p>
      <h2 className="section-title">Alerting Pipeline</h2>
      <div className="section-body">
        <p>The final stage transforms an incident + RCA bundle into a notification that on-call engineers can act on. The pipeline enforces strict latency targets — <strong>&lt;60 seconds</strong> from signal ingestion to alert emission for Critical incidents — through a combination of deduplication, severity-based routing, and lightweight payload assembly. The RCA summary (which may take longer to generate) is delivered as a follow-up.</p>
      </div>
      <div className="card-grid">
        {[
          { icon: '◎', title: 'Deduplication', desc: 'Suppresses redundant alerts for the same underlying incident within a configurable cooldown window, preventing alert storms during cascading failures.' },
          { icon: '⊡', title: 'Severity Router', desc: 'Critical alerts → PagerDuty + Slack; Warning → Slack; Info → webhook log. Routing rules are configurable per channel and per severity level.' },
          { icon: '⊞', title: 'Payload Builder', desc: 'Assembles the final alert: title, severity, affected services, contributing signal summary, RCA result (if ready), blast radius, and runbook link.' },
          { icon: '◈', title: 'Notification Dispatchers', desc: 'Pluggable adapters for Slack, PagerDuty, email, and generic webhooks. Adding a channel means implementing a small adapter interface — no pipeline changes needed.' },
        ].map(c => (
          <div className="card" key={c.title}>
            <span className="icon">{c.icon}</span>
            <h4>{c.title}</h4>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
      <Figure src="assets/Pasted%20image%20(11).png" label="Figure 10: Alerting pipeline — incidents flow through deduplication, severity routing, payload assembly, and notification dispatch" />
      <div className="section-body">
        <p>The alerting stage is designed for <strong>low latency</strong> — the structured alert (service, severity, affected services, evidence summary) fires immediately. The AI-generated RCA narrative, which may take longer to produce, appends to the alert as a follow-up. This split ensures on-call engineers get the critical context within seconds while the richer analysis arrives within the two-minute SLA.</p>
      </div>
      <Figure src="assets/Pasted%20image%20(12).png" label="Figure 11: Alert notification example — a structured incident payload as it appears in Slack and PagerDuty, with severity, affected services, RCA summary, and runbook link" />
    </section>
  )
}
