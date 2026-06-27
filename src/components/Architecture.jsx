import Figure from './Figure.jsx'

export default function Architecture() {
  return (
    <section id="architecture">
      <span className="section-stripe"></span>
      <p className="section-subtitle">Architecture</p>
      <h2 className="section-title">Five-Stage Pipeline</h2>
      <div className="section-body">
        <p>The system is structured as a linear pipeline of five independently-deployable stages. Signals flow from left to right: raw telemetry enters the ingestion layer, passes through correlation and detection, is analyzed for root cause, and finally produces structured alerts. Each stage communicates over an internal event bus, which decouples producers from consumers and allows replay for offline evaluation.</p>
      </div>
      <div className="pipeline">
        {[
          ['⤓', 'Stage 1', 'Ingestion'],
          ['◎', 'Stage 2', 'Correlation'],
          ['⚡', 'Stage 3', 'Detection'],
          ['◉', 'Stage 4', 'Root Cause'],
          ['⊡', 'Stage 5', 'Alerting'],
        ].map(([icon, stage, label]) => (
          <div className="pipe-stage" key={label}>
            <span className="icon">{icon}</span>
            <h5>{stage}</h5>
            <p>{label}</p>
          </div>
        ))}
      </div>
      <Figure src="assets/Pasted%20image%20(3).png" label="Figure 2: Five-stage pipeline architecture showing component boundaries and data flow" />
      <div className="arch-svg">
<pre>{`┌──────────┐    ┌────────────┐    ┌───────────┐    ┌──────────┐    ┌──────────┐
│ INGESTION │───▶│ CORRELATE  │───▶│ DETECT    │───▶│ RCA      │───▶│ ALERTING │
│           │    │            │    │           │    │          │    │          │
│  Logs     │    │ Normalize  │    │ EWMA      │    │ Graph    │    │ Dedup    │
│  Metrics  │    │ TimeWindow │    │ Frequency │    │ Change   │    │ Route    │
│  Traces   │    │ Tag        │    │ Latency   │    │ Evidence │    │ Dispatch │
│  Alerts   │    │            │    │ Assemble  │    │ LLM      │    │          │
└────┬─────┘    └────────────┘    └───────────┘    └──────────┘    └──────────┘
     │                                                                         
     └── Event Bus (Kafka / Redis Streams) ────────────────────▶ Storage & Audit`}</pre>
      </div>
    </section>
  )
}
