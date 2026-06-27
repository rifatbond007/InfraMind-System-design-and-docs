import Figure from './Figure.jsx'

export default function PipelineDetail() {
  return (
    <section id="pipeline">
      <span className="section-stripe"></span>
      <p className="section-subtitle">Pipeline Design</p>
      <h2 className="section-title">How Signals Flow Through the System</h2>
      <div className="section-body">
        <p>Every signal — whether a log line, a metric datapoint, a trace span, or an incoming PagerDuty alert — follows the same path through the pipeline. The design prioritizes <strong>graceful degradation</strong>: loss of any single data source must not crash the pipeline, and the event bus provides buffering against downstream processing delays.</p>
      </div>
      <Figure src="assets/Pasted%20image%20(4).png" label="Figure 3: Component interaction within each pipeline stage — how collectors, correlators, detectors, and alerters connect internally" />
      <div className="section-body">
        <p>Each pipeline stage receives normalized signals from the event bus, processes them through a stage-specific component, and publishes results back to the bus. This decoupling means a slow RCA computation never blocks alert delivery — the alerting stage can emit immediately from the incident assembled by the detection stage while RCA runs asynchronously.</p>
      </div>
      <Figure src="assets/Pasted%20image%20(5).png" label="Figure 4: Data flow — each signal type enters through a dedicated collector, is parsed and normalized, then published to the shared event bus for downstream correlation" />
      <div className="two-col">
        <div className="col">
          <h4>Design Characteristics</h4>
          <ul>
            <li>At-least-once delivery guarantees for alerts</li>
            <li>Configurable time windows for signal correlation</li>
            <li>Modular collectors — adding a new source means implementing one interface</li>
            <li>Per-signal-type statistical anomaly models</li>
            <li>Async LLM reasoning — alert fires immediately, RCA summary follows</li>
          </ul>
        </div>
        <div className="col">
          <h4>Non-Goals (v1)</h4>
          <ul>
            <li>Automated remediation or auto-healing</li>
            <li>Custom APM agent instrumentation</li>
            <li>Full production deployment (research prototype)</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
