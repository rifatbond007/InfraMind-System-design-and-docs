import { Section, Flow, PlanBuilt, Details, OriginalFigure } from './ui.jsx'

export default function RCA() {
  return (
    <Section
      id="rca"
      eyebrow="Stage 4 · Phase P5"
      title="Root cause analysis"
      tags={[['built', 'Built'], ['changed', 'Weights not tuned yet']]}
      summary="Starting from the failing service, InfraMind follows the service map to the services it depends on and scores each one. The highest score is the likely root cause."
    >
      <Flow
        caption="Same input always gives the same ranking. The LLM never picks the cause (D1)."
        w={134}
        colGap={44}
        nodes={[
          { id: 'g', col: 0, row: 0, label: 'Service map', sub: 'from traces', status: 'built' },
          { id: 'i', col: 0, row: 1, label: 'Incident', sub: 'from correlation', status: 'built' },
          { id: 'k', col: 0, row: 2, label: 'Deploy changes', sub: 'not built', status: 'planned' },
          { id: 'sg', col: 1, row: 0, label: 'Graph', sub: 'who calls whom', status: 'built' },
          { id: 'w', col: 1, row: 1, label: 'Search', sub: 'follow callees', status: 'built' },
          { id: 'c', col: 1, row: 2, label: 'Change score', sub: 'always 0 now', status: 'partial' },
          { id: 'ev', col: 2, row: 1, label: 'Evidence', sub: 'proof per service', status: 'built' },
          { id: 'pr', col: 3, row: 0, label: 'PageRank', sub: 'cross-check', status: 'built' },
          { id: 'rk', col: 3, row: 1, label: 'Ranked list', sub: 'top 5', status: 'built' },
          { id: 'out', col: 3, row: 2, label: 'Next step', sub: 'save · explain · alert', status: 'built' },
        ]}
        edges={[['g', 'sg'], ['sg', 'w'], ['i', 'w'], ['k', 'c'], ['w', 'ev'], ['c', 'ev'], ['ev', 'rk'], ['sg', 'pr'], ['rk', 'out']]}
      />

      <PlanBuilt rows={[
        { name: 'Service map', plan: 'From traces', status: 'built', built: 'Built from traces, updated live.' },
        { name: 'Search', plan: '"Upstream"', status: 'changed', built: 'Toward the services it calls, up to 4 steps.' },
        { name: 'Recent changes', plan: 'Deploys, config changes', status: 'partial', built: 'Scoring ready; the change watcher is not built.' },
        { name: 'Ranking', plan: 'By probability', status: 'built', built: 'Weighted score: severity, timing, depth, changes.' },
      ]} />

      <Details title="How the score works">
        <p><b>score</b> = 0.45 × severity + 0.20 × who failed first + 0.25 × depth + 0.10 × recent change</p>
        <ul>
          <li>Weights are starting values, tuned later in P7.</li>
          <li>PageRank runs beside it as a second opinion.</li>
          <li>The graph is our own code, not NetworkX (needs a decision).</li>
        </ul>
        <OriginalFigure src="/assets/Pasted%20image%20(9).png" label="RCA engine" />
        <OriginalFigure src="/assets/Pasted%20image%20(10).png" label="Example ranked output" />
      </Details>
    </Section>
  )
}
