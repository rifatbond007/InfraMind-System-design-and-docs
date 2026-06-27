import Figure from './Figure.jsx'

export default function Decisions() {
  return (
    <section id="decisions">
      <span className="section-stripe"></span>
      <p className="section-subtitle">Key Decisions</p>
      <h2 className="section-title">Architecture &amp; Design Choices</h2>
      <div className="section-body"><p>Every system design involves trade-offs. Below are the most significant decisions that shape InfraMind's architecture, along with the reasoning behind them and the alternatives considered.</p></div>
      {[
        {
          title: 'Event Streaming Backbone',
          context: 'Apache Kafka vs. Redis Streams',
          body: <p><strong>Decision:</strong> Open — both are viable candidates for the prototype phase. Kafka offers stronger durability, replay, and partitioning for production-grade throughput, but Redis Streams is simpler to operate and sufficient for the research prototype's scale (10K logs/s, 1K metrics/s, 5K spans/s). The adapter interface abstracts the choice so it can be swapped without pipeline changes.</p>,
        },
        {
          title: 'AI Reasoning Strategy',
          context: 'LLM-based reasoning vs. graph-based causal inference vs. hybrid',
          body: <p><strong>Decision:</strong> Hybrid — use deterministic graph traversal and change correlation for the structured, verifiable RCA pipeline, then optionally invoke an LLM for natural-language synthesis. The LLM runs asynchronously so it never blocks alert delivery. This keeps the core RCA deterministic and fast while adding AI context where it provides the most value.</p>,
        },
        {
          title: 'Service Dependency Graph',
          context: 'Static (config-seeded) vs. dynamic (trace-derived)',
          body: <p><strong>Decision:</strong> Dynamic, with static fallback. The graph is built and continuously updated from distributed trace data (span parent/child relationships). For services without trace instrumentation, operators can seed the graph via configuration. The RCA engine gracefully degrades to log + metric inference when the graph has gaps.</p>,
        },
        {
          title: 'Cross-Signal Correlation Strategy',
          context: 'Time-window only vs. dependency-constrained',
          body: <p><strong>Decision:</strong> Dependency-constrained time windows. Signals are only correlated if they share a service identifier <em>and</em> occur within the same time window — but additionally filtered by infrastructure layer and known dependency relationships. This reduces false positives from coincident-but-unrelated anomalies across different stacks.</p>,
        },
        {
          title: 'Cloud Metrics Collection Model',
          context: 'Sidecar (deploy per account) vs. central collector',
          body: <p><strong>Decision:</strong> Open — to be determined during implementation. A sidecar model (deploy InfraMind inside each cloud account) avoids cross-account networking and API rate limits, but a central collector is simpler to manage. The collector adapter interface supports either approach.</p>,
        },
      ].map(d => (
        <div className="decision" key={d.title}>
          <h4>{d.title}</h4>
          <div className="context">{d.context}</div>
          {d.body}
        </div>
      ))}
      <Figure src="assets/Pasted%20image%20(2).png" label="Figure 12: The four observability failures InfraMind is designed to solve" />
    </section>
  )
}
