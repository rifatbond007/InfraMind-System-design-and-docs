export default function Glossary() {
  return (
    <section>
      <span className="section-stripe"></span>
      <p className="section-subtitle">Reference</p>
      <h2 className="section-title">Glossary</h2>
      <dl className="glossary">
        {[
          { term: 'InfraMind', def: 'Automated incident detection, RCA, and alerting system.' },
          { term: 'MTTD', def: 'Mean Time to Detect — time from incident start to first alert.' },
          { term: 'MTTR', def: 'Mean Time to Resolve — time from detection to full resolution.' },
          { term: 'RCA', def: 'Root Cause Analysis — identifying the underlying cause, not just symptoms.' },
          { term: 'Service Dependency Graph', def: 'Directed graph of service call relationships derived from distributed trace data.' },
          { term: 'OTLP', def: 'OpenTelemetry Protocol — standard wire protocol for telemetry data.' },
          { term: 'Blast Radius', def: 'Set of services and components likely impacted by a given root cause.' },
          { term: 'Signal Correlation', def: 'Linking related anomalies across different observability pillars.' },
        ].map(g => (
          <div className="glossary-item" key={g.term}>
            <dt>{g.term}</dt>
            <dd>{g.def}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
