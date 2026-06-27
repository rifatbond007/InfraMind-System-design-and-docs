export default function Hero() {
  return (
    <section id="overview">
      <div className="hero">
        <div className="hero-box">
          <h1>InfraMind</h1>
          <span className="draft-badge">DRAFT v1.1</span>
          <span className="stripe"></span>
          <p className="tagline">InfraMind: Automated Incident Detection, Root Cause Analysis &amp; Alerting System</p>
        </div>
        <div className="badges">
          <span className="badge">Kubernetes</span>
          <span className="badge">AWS / GCP / Azure</span>
          <span className="badge">Microservices</span>
          <span className="badge">Traditional VMs</span>
        </div>
        <div className="hero-stats">
          <div className="stat"><strong>&lt; 60s</strong>MTTD</div>
          <div className="stat"><strong>&gt; 80%</strong>Precision</div>
          <div className="stat"><strong>&gt; 75%</strong>Recall</div>
          <div className="stat"><strong>&gt; 70%</strong>RCA Accuracy</div>
        </div>
      </div>
      <span className="section-stripe"></span>
      <p className="section-subtitle">System Design</p>
      <h2 className="section-title">A Signal-Aware Observability Layer</h2>
      <div className="section-body">
        <p>InfraMind sits between existing observability tooling and on-call engineers. Rather than replacing Prometheus, ELK, or Datadog, it <strong>consumes their outputs</strong> — the signals those tools already generate — and applies a correlation-and-reasoning layer on top. The result is a single pane of glass that doesn't just show raw telemetry, but tells you what broke, why, and who is affected.</p>
      </div>
      <Figure src="assets/Pasted%20image.png" label="Figure 1: High-level system concept — InfraMind as the correlation and reasoning layer above existing observability stacks" />
    </section>
  )
}

function Figure({ src, label }) {
  return (
    <div className="figure">
      <img src={src} alt="" />
      <div className="label">{label}</div>
    </div>
  )
}
