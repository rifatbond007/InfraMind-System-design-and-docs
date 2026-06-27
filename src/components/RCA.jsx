import Figure from './Figure.jsx'

export default function RCA() {
  return (
    <section id="rca">
      <span className="section-stripe"></span>
      <p className="section-subtitle">Stage 4</p>
      <h2 className="section-title">Root Cause Analysis Engine</h2>
      <div className="section-body">
        <p>Once an incident is assembled, the RCA engine answers the question that monitoring tools cannot: <strong>why did this happen?</strong> It combines three complementary approaches: structural reasoning via the service dependency graph, temporal correlation with change events, and optional AI-driven synthesis using a large language model.</p>
      </div>
      <div className="two-col">
        <div className="col">
          <h4>Dependency Graph Traversal</h4>
          <p>Uses the service topology graph (built continuously from trace data) to walk upstream from the affected service. Each hop evaluates whether the dependency shows correlating symptoms, ranking candidates by probability.</p>
          <h4>Change Correlation</h4>
          <p>Cross-references incident timing against deployment events, Kubernetes rollouts, config map changes, and cloud provider incident feeds. A service that just deployed is a stronger candidate than one that hasn't changed in weeks.</p>
        </div>
        <div className="col">
          <h4>Evidence Aggregation</h4>
          <p>Collects supporting evidence from every pillar — specific log lines that show the error, metric charts with the anomaly, anomalous spans, and any triggering alerts — into a structured evidence bundle for each candidate root cause.</p>
          <h4>AI Reasoning (Optional)</h4>
          <p>LLM synthesis runs asynchronously to keep alert latency low. The structured alert fires immediately; the AI-generated natural-language summary appends within the 120-second SLA. Graceful degradation: if trace data is missing, the engine falls back to log + metric inference.</p>
        </div>
      </div>
      <Figure src="assets/Pasted%20image%20(9).png" label="Figure 8: RCA engine — dependency graph traversal with evidence aggregation and AI reasoning" />
      <Figure src="assets/Pasted%20image%20(10).png" label="Figure 9: Example RCA output — ranked root cause candidates with signal evidence and blast radius" />
    </section>
  )
}
