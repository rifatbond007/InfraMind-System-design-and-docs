import { Section, Flow, Table, Pill, Details, Bullets } from './ui.jsx'

export default function Evaluation() {
  return (
    <Section
      id="evaluation"
      eyebrow="Phase P7"
      title="Evaluation"
      tags={[['changed', 'Replay only'], ['blocked', '6 scenarios blocked']]}
      summary="The evaluation harness is built: 14 scenario files, 6 baselines, 4 ablations, scoring and a report writer. It runs by replaying recorded signals (D7-Replay); the live runner is a stub. No evaluation results exist yet."
    >
      <Flow
        caption="Replay feeds a fixture's signals through the real detection, correlation and ranking code in signal time, so a run is byte-identical when repeated. Live runs wait on the chaos-runtime fix."
        w={138}
        colGap={44}
        nodes={[
          { id: 'sc', col: 0, row: 0, label: 'Scenario YAML', sub: '8 dev · 6 test', status: 'built' },
          { id: 'fx', col: 0, row: 1, label: 'Fixture', sub: 'signals.ndjson', status: 'partial' },
          { id: 'ch', col: 0, row: 2, label: 'Chaos Mesh', sub: 'live injection', status: 'blocked' },
          { id: 'rp', col: 1, row: 1, label: 'Replay runner', sub: 'detect → correlate → rank', status: 'built' },
          { id: 'lv', col: 1, row: 2, label: 'Live runner', sub: 'stub', status: 'planned' },
          { id: 'm', col: 2, row: 0, label: 'Baselines', sub: '6 methods', status: 'built' },
          { id: 'ab', col: 2, row: 2, label: 'Ablations', sub: '4 switches', status: 'built' },
          { id: 's', col: 2, row: 1, label: 'Scoring', sub: 'top-1 · top-3 · MRR', status: 'built' },
          { id: 'r', col: 3, row: 1, label: 'Report', sub: 'CSV · summary.json', status: 'built' },
        ]}
        edges={[['sc', 'rp'], ['fx', 'rp'], ['ch', 'lv'], ['rp', 'm'], ['rp', 's'], ['rp', 'ab'], ['lv', 's'], ['s', 'r']]}
      />

      <Table head={['', 'Proposal (July 2026)', 'Built now']} rows={[
        ['Scenarios', '≥ 10', '14 files (8 dev, 6 test): 8 pod-level can run, 6 stress/network marked blocked (D26). No soak scenario yet.'],
        ['Runs per scenario', '3', '5 repeats in every file'],
        ['Split', '—', 'Locked dev/test split: tune on dev, report on test'],
        ['Reproducibility', '—', 'Signal-time replay from a fixture (D7-Replay)'],
        ['Baselines', 'Raw alerts + ablations', '6 baselines + 4 ablations, all implemented'],
        ['Fixtures', '—', '2, written by hand with synthetic ids; none recorded from the cluster yet'],
      ]} />

      <div className="two-col">
        <div className="col">
          <h4>Baselines (D7)</h4>
          <Bullets items={[
            <>Raw Alertmanager <Pill status="changed">frequency count</Pill></>,
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
            'No correlation',
            'No RCA',
            <>No LLM <Pill status="built">ranking unchanged</Pill></>,
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
        ['Harness smoke run', 'top-1 1.0 over 10 rows (2 hand-written fixtures × 5)', 'P7 entry, PROGRESS.md'],
        ['Unit + integration tests', '897 passed, 22 skipped', 'pytest, 21 Oct 2026'],
      ]} />
      <p className="note">The harness smoke run only shows the pipeline runs end to end on two small synthetic fixtures. It is not an RCA accuracy result.</p>

      <Details title="Scenarios, metrics and known gaps">
        <p><b>Runnable now:</b> pod-kill (cartservice, productcatalogservice, recommendationservice, checkout), container exit (shippingservice, cartservice), node cordon, config change. <b>Blocked:</b> CPU stress ×2, memory stress, latency inject, network partition, network latency.</p>
        <p><b>Metrics computed:</b> top-1, top-3, mean reciprocal rank, median detection latency, false-positive rate per row. <code>make eval</code>, <code>eval-all</code>, <code>eval-ablation</code>, <code>eval-soak</code>, <code>eval-live</code>.</p>
        <Bullets items={[
          'False alarms per hour is not computed: the --soak flag is parsed but unused.',
          'The raw Alertmanager baseline counts how often each service appears in a fixture\'s alerts, not the stock kube-prometheus-stack rules D7 describes.',
          'Some scenario files need a check before use: the names "checkout" and "payment-service" are not Online Boutique service names, a few chaos actions are non-standard, and dev-07 names cartservice but expects productcatalogservice.',
          'Blocked scenarios make the runner exit with code 3; --allow-blocked writes them as not detected.',
        ]} />
      </Details>
    </Section>
  )
}
