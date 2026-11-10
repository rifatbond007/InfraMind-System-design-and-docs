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
          <span className="draft-badge">Build status · 10 Nov 2026</span>
          <h1>InfraMind</h1>
          <span className="stripe"></span>
          <p className="tagline">Finds the root cause of faults in Kubernetes apps.</p>
          <p className="hero-goal">When something breaks, InfraMind says <strong>which service caused it</strong>, shows the evidence, and sends <strong>one</strong> alert instead of many.</p>
        </div>
        <div className="hero-stats">
          <div className="stat"><strong>11 / 12</strong>phases built</div>
          <div className="stat"><strong>969</strong>tests passing</div>
          <div className="stat"><strong>21 s</strong>to detect a fault<br/>(goal &lt; 60 s)</div>
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

      <div className="callout built">
        <b>Works end to end (10 Nov).</b> A test fault went all the way through: detected → grouped into an incident → root cause ranked → saved → explained → alerted → visible in the API.
        <br /><b>Still to do:</b> test with a real LLM key, run real chaos faults, write the paper.
      </div>

      <h3 className="h3">Goals vs. what we have today</h3>
      <Table
        head={['Goal', 'Target', 'Today']}
        className="targets"
        rows={[
          ['Time to detect', '< 60 s', <><Pill status="changed">Test run</Pill> 21–28 s</>],
          ['Alert precision / recall', '≥ 75% / ≥ 70%', <Pill status="planned">Not measured</Pill>],
          ['Fewer alerts than raw', '≥ 40% fewer', <><Pill status="changed">Unit test</Pill> 6 → 1</>],
          ['Right root cause (top-1 / top-3)', '≥ 60% / ≥ 75%', <Pill status="planned">Not measured</Pill>],
          ['Fault scenarios', '≥ 12', <><Pill status="blocked">14 written, 6 blocked</Pill></>],
        ]}
      />
      <p className="note">"Test run" numbers come from development checks, not from the evaluation.</p>

      <Details title="Scope and team">
        <ul>
          <li>Kubernetes only, on a local test cluster running Google's Online Boutique demo shop (11 services).</li>
          <li>Out of scope: cloud, VMs, Datadog/PagerDuty, auto-fixing, production scale.</li>
          <li>The LLM only writes the explanation. It never picks the root cause (D1).</li>
        </ul>
        <p>Team: Md. Rifat Hossain, Abdullah All Moneem, Rayhan Islam Prome. BSc capstone, BAIUST CSE. Supervisor: Golam Moktader Nayeem.</p>
        <OriginalFigure src="/assets/Pasted%20image.png" label="InfraMind as a layer above existing observability tools" />
      </Details>
    </section>
  )
}
