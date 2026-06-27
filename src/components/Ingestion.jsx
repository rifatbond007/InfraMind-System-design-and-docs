import Figure from './Figure.jsx'

export default function Ingestion() {
  return (
    <section id="ingestion">
      <span className="section-stripe"></span>
      <p className="section-subtitle">Stage 1</p>
      <h2 className="section-title">Ingestion Layer</h2>
      <div className="section-body">
        <p>Four parallel collectors — each specialized for a signal type — pull or receive data from existing observability tools. Every collector enriches its output with a common <strong>service identifier</strong>, an <strong>infrastructure layer tag</strong> (k8s / cloud / microservice / vm), and a wall-clock timestamp before publishing to the event bus. This normalized envelope is what allows downstream stages to correlate across pillars that were never designed to work together.</p>
      </div>
      <div className="card-grid">
        {[
          { icon: '⊞', title: 'Log Collector', desc: 'Pulls from ELK (Elasticsearch) and Loki via their streaming APIs. Parses every entry to extract service name, log level, error codes, trace IDs. Handles K8s pod logs, CloudWatch/GCP Logging, microservice app logs, and syslog.' },
          { icon: '◈', title: 'Metrics Collector', desc: 'Scrapes Prometheus endpoints at configurable intervals (default 30s) and polls the Datadog API. Collects K8s metrics (kube-state-metrics, cAdvisor), cloud provider metrics, and VM host-level metrics from node exporters.' },
          { icon: '◉', title: 'Trace Ingester', desc: 'Consumes distributed traces from Jaeger\'s Query API and OpenTelemetry Collector via OTLP (gRPC/HTTP). Extracts span-level data and continuously builds the service dependency graph — the backbone of RCA traversal.' },
          { icon: '⊡', title: 'Alert Consumer', desc: 'Receives webhook payloads from PagerDuty and Grafana. Normalizes every alert to a unified internal schema (service, severity, description, timestamp). Implements adaptive back-pressure for high-volume spikes.' },
        ].map(c => (
          <div className="card" key={c.title}>
            <span className="icon">{c.icon}</span>
            <h4>{c.title}</h4>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
      <Figure src="assets/Pasted%20image%20(6).png" label="Figure 5: Ingestion layer — four collector types, each feeding the shared event bus" />
    </section>
  )
}
