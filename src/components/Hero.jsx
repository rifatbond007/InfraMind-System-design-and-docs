import { Pill, Table, Details, OriginalFigure } from './ui.jsx'

const phases = [
  ['P0', 'Repo & tooling', 'built'],
  ['P1', 'Testbed', 'built'],
  ['P2', 'Signal schema + bus', 'built'],
  ['P3', 'Ingestion', 'built'],
  ['P4', 'Detection', 'built'],
  ['P4b', 'Correlation', 'built'],
  ['P5', 'RCA', 'built'],
  ['P5b', 'LLM explainer', 'built'],
  ['P6', 'Alerting + storage + API', 'built'],
  ['P7', 'Evaluation (replay only)', 'changed'],
  ['P8', 'Packaging (Helm)', 'built'],
  ['P9', 'Paper', 'planned'],
]

export default function Hero() {
  return (
    <section id="overview">
      <div className="hero">
        <div className="hero-box">
          <span className="draft-badge">Build status · 23 Oct 2026</span>
          <h1>InfraMind</h1>
          <span className="stripe"></span>
          <p className="tagline">A Kubernetes-based multi-signal incident detection and graph-guided root cause analysis system.</p>
          <p className="hero-goal">When a fault hits a Kubernetes microservice app, say which service is the root cause, show the evidence, and send <strong>one</strong> deduplicated alert.</p>
        </div>
        <div className="hero-stats">
          <div className="stat"><strong>11 / 12</strong>phases coded</div>
          <div className="stat"><strong>943</strong>tests passing</div>
          <div className="stat"><strong>22 s</strong>smoke detect<br/>(target &lt; 60 s)</div>
          <div className="stat"><strong>0</strong>eval results yet</div>
        </div>
      </div>

      <h3 className="h3">Progress by phase</h3>
      <ol className="phases">
        {phases.map(([id, name, s]) => (
          <li key={id} className={'phase ' + s}>
            <span className="phase-id">{id}</span>
            <span className="phase-name">{name}</span>
          </li>
        ))}
      </ol>
      <p className="note">P0–P4b are tested and verified live on the kind cluster. P5–P8 landed on 21 Oct 2026 as tested modules. On 23 Oct a full P0–P9 audit wired RCA to the LLM, alerting and Postgres, fixed the defects it found and removed dead code. Next: a live end-to-end fault run, then the P9 paper.</p>

      <div className="callout changed">
        <b>Wired end to end, not yet verified live.</b> Since 23 Oct the RCA worker publishes every ranking on <code>stream:rca-results</code>, and the API process stores the incident in Postgres, asks the LLM for a summary and sends one alert (D27-ApiPipeline). The path is covered by unit and Postgres integration tests; it has not yet been run against a live chaos fault on the cluster.
      </div>

      <h3 className="h3">Research question</h3>
      <p className="lede">Can ingesting and correlating logs, metrics, traces and alerts <strong>(1)</strong> cut mean time to detect, <strong>(2)</strong> reduce alert noise through dedup and correlation, and <strong>(3)</strong> give automated root cause analysis that speeds up diagnosis?</p>

      <h3 className="h3">Success targets vs. current evidence</h3>
      <Table
        head={['Metric', 'Target (proposal)', 'Evidence today']}
        className="targets"
        rows={[
          ['MTTD', '< 60 s', <><Pill status="changed">Smoke only</Pill> 22–28 s on a live burst (P4 gate)</>],
          ['Alert precision', '≥ 75%', <Pill status="planned">P7</Pill>],
          ['Alert recall', '≥ 70%', <Pill status="planned">P7</Pill>],
          ['Noise reduction vs raw alerts', '≥ 40%', <><Pill status="changed">Smoke only</Pill> 6 incidents → 1 (unit test, not yet live)</>],
          ['RCA exact / top-3', '≥ 60% / ≥ 75%', <><Pill status="changed">Smoke only</Pill> top-1 1.0 on 2 hand-written replay fixtures; not a result</>],
          ['RCA latency', '< 120 s', <Pill status="planned">P7 live runs</Pill>],
          ['False positive rate', '< 25%', <Pill status="planned">Soak run in P7</Pill>],
          ['Fault scenarios', '≥ 10 (now ≥ 12)', <><Pill status="blocked">14 written, 6 blocked</Pill> 8 pod-level scenarios can run</>],
        ]}
      />
      <p className="note">Smoke-run numbers come from development gates on one machine. They are not evaluation results.</p>

      <Details title="Scope: how the plan narrowed">
        <p>The PRD v1.1 aimed at heterogeneous infrastructure: Kubernetes, AWS/GCP/Azure, microservices and VMs, fed by ELK, Datadog, PagerDuty and Kafka. The July 2026 proposal and decision D8 narrowed this to a <strong>Kubernetes-only research prototype</strong>:</p>
        <ul>
          <li>Out of scope: cloud providers, VMs, Datadog/PagerDuty, auto-remediation, production scale, deep-learning training, security-fault injection.</li>
          <li>The system under test is Google's Online Boutique (11 services) on a local kind cluster.</li>
          <li>The LLM only writes the explanation. It never chooses the root cause (D1).</li>
        </ul>
        <p>Team: Md. Rifat Hossain (testbed, chaos, evaluation, packaging), Abdullah All Moneem (ingestion, detection, correlation), Rayhan Islam Prome (RCA, LLM, alerting, storage). BSc capstone, BAIUST CSE. Supervisor: Golam Moktader Nayeem.</p>
        <OriginalFigure src="/assets/Pasted%20image.png" label="InfraMind as a correlation and reasoning layer above existing observability tools" />
      </Details>
    </section>
  )
}
