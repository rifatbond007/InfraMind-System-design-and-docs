import { Section, Table, Pill, Details, Bullets } from './ui.jsx'

export default function Evaluation() {
  return (
    <Section
      id="evaluation"
      eyebrow="Phase P7"
      title="Evaluation"
      tags={[['planned', 'Not built yet'], ['blocked', 'Needs chaos fix']]}
      summary="The protocol is designed; there is no runner, scenario file or result yet (evaluation/ holds a README and an empty results/ folder). make eval only prints 'not implemented'."
    >
      <Table head={['', 'Proposal (July 2026)', 'Planned now']} rows={[
        ['Scenarios', '≥ 10', '≥ 12 + one multi-fault + a 30–60 min fault-free soak'],
        ['Runs per scenario', '3', '5, reported as mean ± std with 95% CI'],
        ['Split', '—', 'Locked dev/test split: tune on dev, report on test'],
        ['Reproducibility', '—', 'Scenario YAML with a seed; rerun from scenario_id + seed'],
        ['Baselines', 'Raw alerts + ablations', '6 baselines + 4 ablations'],
      ]} />

      <div className="two-col">
        <div className="col">
          <h4>Baselines (D7)</h4>
          <Bullets items={[
            'Raw Alertmanager (stock kube-prometheus-stack rules)',
            'Random service',
            'Highest-error service',
            'Deepest erroring span',
            'Personalised PageRank (MicroRCA-style)',
            'LLM-only',
          ]} />
        </div>
        <div className="col">
          <h4>Ablations</h4>
          <Bullets items={[
            <>No correlation <Pill status="built">switch exists</Pill></>,
            'No RCA',
            'No LLM',
            'No change correlation',
          ]} />
        </div>
      </div>

      <h3 className="h3">Numbers so far (development smoke runs only)</h3>
      <Table head={['What', 'Result', 'Source']} rows={[
        ['Detect a live CPU burst', '22 s (limit 60 s); another run 28 s', 'P4 gate, PROGRESS.md'],
        ['Resolve after the burst ends', '70 s; another run 88 s', 'P4 gate'],
        ['Replay 6,244 recorded signals', '4 s', 'P4 design spec'],
        ['Quiet-cluster false fires (CPU)', '0% of 1,624 samples (was 0.8%)', 'P4 design spec'],
        ['Unit + integration tests', '509 passed, 4 skipped', 'pytest -m "", 21 Oct 2026'],
      ]} />

      <Details title="Required scenarios and metrics">
        <p><b>Scenarios:</b> pod-kill, CrashLoopBackOff, CPU stress, memory pressure, network delay, packet loss, HTTP 500 rate, slow downstream, database unavailable, bad environment variable, log error spike, trace latency increase. Most need the chaos-runtime fix first.</p>
        <p><b>Metrics:</b> MTTD, alert precision and recall, noise reduction vs. raw alerts, RCA top-1 and top-3 accuracy, RCA latency, false alarms per hour on the soak run.</p>
      </Details>
    </Section>
  )
}
