import { Section, Flow, Table, Details } from './ui.jsx'

export default function Evaluation() {
  return (
    <Section
      id="evaluation"
      eyebrow="Phase P7"
      title="Evaluation"
      tags={[['changed', 'Replay only'], ['blocked', '6 scenarios blocked']]}
      summary="The test harness is built, but there are no results yet. It replays recorded signals, so every run gives the same answer."
    >
      <Flow
        caption="Live runs wait for the Chaos Mesh fix."
        w={138}
        colGap={44}
        nodes={[
          { id: 'sc', col: 0, row: 0, label: 'Scenarios', sub: '14 written', status: 'built' },
          { id: 'fx', col: 0, row: 1, label: 'Recordings', sub: '2 hand-made', status: 'partial' },
          { id: 'ch', col: 0, row: 2, label: 'Chaos Mesh', sub: 'real faults', status: 'blocked' },
          { id: 'rp', col: 1, row: 1, label: 'Replay', sub: 'working', status: 'built' },
          { id: 'lv', col: 1, row: 2, label: 'Live run', sub: 'not built', status: 'planned' },
          { id: 'm', col: 2, row: 0, label: 'Baselines', sub: '6 methods', status: 'built' },
          { id: 'ab', col: 2, row: 2, label: 'Ablations', sub: '4 switches', status: 'built' },
          { id: 's', col: 2, row: 1, label: 'Scoring', sub: 'top-1 · top-3', status: 'built' },
          { id: 'r', col: 3, row: 1, label: 'Report', sub: 'CSV', status: 'built' },
        ]}
        edges={[['sc', 'rp'], ['fx', 'rp'], ['ch', 'lv'], ['rp', 'm'], ['rp', 's'], ['rp', 'ab'], ['lv', 's'], ['s', 'r']]}
      />

      <Table head={['', 'Proposal', 'Now']} rows={[
        ['Scenarios', '≥ 10', '14 written; 8 can run, 6 blocked'],
        ['Runs each', '3', '5'],
        ['Compared against', 'Raw alerts', '6 baselines + 4 ablations'],
        ['Recorded data', '—', '2 small hand-made files'],
      ]} />

      <h3 className="h3">Numbers so far (test runs, not results)</h3>
      <Table head={['What', 'Result']} rows={[
        ['Detect a CPU burst', '21–28 s (goal 60 s)'],
        ['Resolve after it ends', '70–88 s'],
        ['Tests passing', '969'],
      ]} />

      <Details title="Baselines and known gaps">
        <p><b>Baselines:</b> raw alerts, random service, most errors, deepest error, PageRank, LLM only.</p>
        <p><b>Ablations:</b> turn off grouping, RCA, LLM, or change tracking.</p>
        <ul>
          <li>The false-alarms-per-hour run is not built yet.</li>
          <li>The "random" baseline also scores perfectly on the 2 test files — needs a look.</li>
          <li>Some scenario files use wrong service names.</li>
        </ul>
      </Details>
    </Section>
  )
}
