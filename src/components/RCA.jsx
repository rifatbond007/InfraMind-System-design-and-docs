import { Section, Flow, PlanBuilt, Table, Details, Bullets, OriginalFigure } from './ui.jsx'

export default function RCA() {
  return (
    <Section
      id="rca"
      eyebrow="Stage 4 · Phase P5"
      title="Root cause analysis"
      tags={[['built', 'Built'], ['partial', 'K8s change watch deferred'], ['changed', 'Weights untuned']]}
      summary="A worker builds the service graph from stream:graph-updates, walks from each incident's symptom service toward its callees, bundles evidence and ranks candidate root causes with a fixed weighted score. Ranking is deterministic; the LLM never chooses (D1). Each ranking is published on stream:rca-results for the API pipeline."
    >
      <Flow
        caption="Change correlation scoring is built, but the Kubernetes watch that feeds it is deferred (D22), so it always sees an empty event list and the change term adds 0. PageRank runs beside the ranker as a sensitivity check."
        w={134}
        colGap={44}
        nodes={[
          { id: 'g', col: 0, row: 0, label: 'graph-updates', sub: 'from Jaeger collector', status: 'built' },
          { id: 'i', col: 0, row: 1, label: 'incidents', sub: 'from correlation', status: 'built' },
          { id: 'k', col: 0, row: 2, label: 'K8s API watch', sub: '6 resource kinds', status: 'planned' },
          { id: 'sg', col: 1, row: 0, label: 'ServiceGraph', sub: 'EWMA edges · decay', status: 'built' },
          { id: 'w', col: 1, row: 1, label: 'Graph walk', sub: 'BFS to callees, ≤ 4', status: 'built' },
          { id: 'c', col: 1, row: 2, label: 'Change corr.', sub: '30-min pre-window', status: 'partial' },
          { id: 'ev', col: 2, row: 1, label: 'Evidence bundle', sub: 'before ranking (D15)', status: 'built' },
          { id: 'pr', col: 3, row: 0, label: 'PageRank', sub: 'α 0.85 · check only', status: 'built' },
          { id: 'rk', col: 3, row: 1, label: 'Ranked candidates', sub: 'top 5', status: 'built' },
          { id: 'out', col: 3, row: 2, label: 'rca-results', sub: 'stream → API pipeline', status: 'built' },
        ]}
        edges={[['g', 'sg'], ['sg', 'w'], ['i', 'w'], ['k', 'c'], ['w', 'ev'], ['c', 'ev'], ['ev', 'rk'], ['sg', 'pr'], ['rk', 'out']]}
      />

      <PlanBuilt planLabel="Planned (PRD v1.1)" rows={[
        { name: 'Dependency graph', plan: 'Built from traces, static fallback', status: 'changed', built: 'Own graph code, not NetworkX. Caller → callee edges; weight is an EWMA (α 0.1) of p95 × log(calls); walkable after 3 observations; decays when silent (half-life 300 s); JSON snapshot every 60 s. Cold-start stub edges cut the score to 10%.', where: 'rca/graph.py' },
        { name: 'Graph walk', plan: 'Walk upstream from affected service', status: 'changed', built: 'Redefined (D2): failures flow callee → caller, so the walk goes toward callees. Breadth-first, max depth 4, walkable edges only.', where: 'rca/traversal.py' },
        { name: 'Change correlation', plan: 'Deploys, rollouts, config maps, cloud feeds', status: 'partial', built: 'Scoring built (float 0–1, 30-min recency window, 6 event kinds, metadata only). The K8s watch that would feed it was formally deferred on 23 Oct; there is no kubernetes dependency, so the term contributes 0 today.', where: 'rca/change_correlation.py' },
        { name: 'Ranking', plan: 'Rank candidates by probability', status: 'built', built: 'score = 0.45·severity + 0.20·earliest onset + 0.25·depth + 0.10·change, times the mean edge confidence. Ties broken by a seeded hash. These are starting values; dev-split tuning has not run.', where: 'rca/rank.py, rca/config.py' },
        { name: 'PageRank variant', plan: '—', status: 'built', built: 'Personalised PageRank (α 0.85), seeded by anomaly scores. Sensitivity check and evaluation baseline, not the headline method.', where: 'rca/rank_pagerank.py' },
        { name: 'Output', plan: 'Ranked list with evidence and blast radius', status: 'partial', built: 'Each candidate carries score, depth, confidence and evidence items (metric, log, trace, change, baseline). Published as an RcaResult with id "incident:revision"; a failed publish leaves the incident pending and the redelivery re-ranks to the same answer.', where: 'rca/worker.py, common/rca_result.py' },
      ]} />

      <Details title="How the spec conflicts were settled in code">
        <Table head={['Conflict', 'Settled as']} rows={[
          ['change_correlation: {0, 1} or float', 'Float in [0, 1], soft-saturated over several changes'],
          ['downstream_depth: closer or deeper scores higher', 'Deeper scores higher: min(1, depth / 4)'],
          ['Walk "upstream", BFS or DFS', 'Toward callees, breadth-first'],
          ['No numeric weights', 'w1 0.45, w2 0.20, w3 0.25, w4 0.10 (sum 1)'],
        ]} />
        <Bullets items={[
          'Severity: band-weighted anomaly scores squashed to 0–1 (info 0.5, warning 0.75, critical 1.0). Earliest onset: 1 / (1 + seconds late / 60).',
          'A test pins that PageRank and the weighted ranker can disagree on the same incident.',
          'D2-NativeGraph (23 Oct) records that the graph and PageRank are native code, not NetworkX; orientation and walk direction are unchanged. Supervisor sign-off pending.',
          'D22\'s change_events table was not created in storage.',
        ]} />
        <OriginalFigure src="/assets/Pasted%20image%20(9).png" label="RCA engine: graph traversal, evidence aggregation, AI reasoning" />
        <OriginalFigure src="/assets/Pasted%20image%20(10).png" label="Example RCA output: ranked candidates with evidence and blast radius" />
      </Details>
    </Section>
  )
}
