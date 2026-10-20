import { Section, Flow, PlanBuilt, Details, Bullets, OriginalFigure } from './ui.jsx'

export default function RCA() {
  return (
    <Section
      id="rca"
      eyebrow="Stage 4 · Phase P5 (next)"
      title="Root cause analysis"
      tags={[['planned', 'Not built yet'], ['changed', '3 spec conflicts']]}
      summary="Designed in detail, no code yet: rca/ holds only a docstring and README. The input it needs, stream:graph-updates, is already being written by the Jaeger collector."
    >
      <Flow
        caption="Planned pipeline. Ranking is deterministic; the LLM only explains the result (D1)."
        w={134}
        colGap={44}
        nodes={[
          { id: 'g', col: 0, row: 0, label: 'graph-updates', sub: 'stream, published today', status: 'built' },
          { id: 'i', col: 0, row: 1, label: 'incidents', sub: 'stream, published today', status: 'built' },
          { id: 'k', col: 0, row: 2, label: 'K8s API watch', sub: 'deploys, config', status: 'planned' },
          { id: 'sg', col: 1, row: 0, label: 'ServiceGraph', sub: 'NetworkX DiGraph', status: 'planned' },
          { id: 'w', col: 1, row: 1, label: 'Graph walk', sub: 'DFS to callees, depth 4', status: 'planned' },
          { id: 'c', col: 1, row: 2, label: 'Change corr.', sub: '30-min pre-window', status: 'planned' },
          { id: 'ev', col: 2, row: 1, label: 'Evidence bundle', sub: 'built before ranking', status: 'planned' },
          { id: 'rk', col: 3, row: 1, label: 'Ranked candidates', sub: 'w1..w4 score', status: 'planned' },
        ]}
        edges={[['g', 'sg'], ['sg', 'w'], ['i', 'w'], ['k', 'c'], ['w', 'ev'], ['c', 'ev'], ['ev', 'rk']]}
      />

      <PlanBuilt planLabel="Planned (PRD v1.1)" rows={[
        { name: 'Dependency graph', plan: 'Built from traces, static fallback', status: 'planned', built: 'Specified (D21): caller → callee edges, weight p95 × log(calls), EWMA α 0.1, edge needs 3 observations, decays, snapshot every 60 s.', where: 'rca/graph.py (planned)' },
        { name: 'Graph walk', plan: 'Walk upstream from affected service', status: 'planned', built: 'Redefined (D2): failures flow callee → caller, so walk toward callees, depth-first, max depth 4.', where: 'rca/ (planned)' },
        { name: 'Change correlation', plan: 'Deploys, rollouts, config maps, cloud feeds', status: 'planned', built: 'Specified (D22): K8s watch on 6 resource kinds, metadata only, never Secret values. No cloud feeds.', where: 'rca/ (planned)' },
        { name: 'Ranking', plan: 'Rank candidates by probability', status: 'planned', built: 'score = w1·severity + w2·earliest onset + w3·depth + w4·change. Weights not chosen yet; tuned on dev split.', where: 'rca/ (planned)' },
        { name: 'PageRank variant', plan: '—', status: 'planned', built: 'Personalised PageRank (α 0.85) as a sensitivity check and baseline.', where: 'rca/ (planned)' },
      ]} />

      <Details title="Spec conflicts to settle before coding">
        <Bullets items={[
          'change_correlation is {0, 1} in standard 06 but a float in [0, 1] in D22 and standard 14.',
          'downstream_depth is described as "closer = higher score" but given the range [0, max_depth].',
          'The proposal says the walk goes "upstream" with BFS and DFS; D2 says toward callees, DFS.',
          'No numeric weights w1–w4 are defined anywhere yet.',
        ]} />
        <OriginalFigure src="assets/Pasted%20image%20(9).png" label="RCA engine: graph traversal, evidence aggregation, AI reasoning" />
        <OriginalFigure src="assets/Pasted%20image%20(10).png" label="Example RCA output: ranked candidates with evidence and blast radius" />
      </Details>
    </Section>
  )
}
