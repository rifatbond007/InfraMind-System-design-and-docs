import { Section, Table, Pill, Details } from './ui.jsx'

const rows = [
  ['D1', 'Root cause is chosen deterministically; the LLM only explains.', 'approved'],
  ['D2', 'Graph edges are caller → callee; the RCA walk goes toward callees.', 'pending'],
  ['D2-NativeGraph', 'Graph and PageRank are native code, not NetworkX (23 Oct).', 'pending'],
  ['D3', 'No deep-learning training; statistical detectors only.', 'approved'],
  ['D4', 'Baselines freeze while an incident is open.', 'approved'],
  ['D5', 'Online Boutique on kind, not Sock Shop.', 'pending'],
  ['D6', '≥ 12 scenarios × 5 runs, plus a fault-free soak.', 'pending'],
  ['D7', 'Six baselines, including LLM-only.', 'pending'],
  ['D7-Replay', 'Evaluation is reproduced by signal-time replay of NDJSON fixtures.', 'pending'],
  ['D8', 'Out of scope: cloud, VMs, Datadog/PagerDuty, auto-remediation, production scale.', 'approved'],
  ['D9', 'LLM calls go through redaction; Ollama as local fallback.', 'approved'],
  ['D12', 'Sidecars instead of forking app images.', 'approved'],
  ['D15', 'Evidence is bundled before ranking, not after.', 'approved'],
  ['D20', 'Postgres is the source of truth; Redis is only the conduit.', 'approved'],
  ['D21', 'ServiceGraph contract owned by the RCA worker.', 'pending'],
  ['D22', 'Change correlation from a Kubernetes API watch (watcher deferred 23 Oct).', 'pending'],
  ['D23', 'A top-level scripts/ folder for dev tooling.', 'pending'],
  ['D24', 'Three pre-commit hooks enforce the standards (simulate mode since 23 Oct).', 'pending'],
  ['D25', 'Commit author is a GitHub username; no AI co-author trailers.', 'pending'],
  ['D26', 'Stress/network scenarios ship marked blocked; pod-level chaos is the live path.', 'pending'],
  ['D27', 'Four Helm Deployments; alerting and the LLM folded into existing processes.', 'pending'],
  ['D27-ApiPipeline', 'RCA publishes on stream:rca-results; the API process stores, explains and alerts (23 Oct).', 'pending'],
  ['D2-Chaos', 'Run chaos-daemon on the containerd runtime.', 'proposed'],
]

const pill = { approved: ['built', 'Locked'], pending: ['changed', 'Sign-off pending'], proposed: ['planned', 'Proposed'] }

export default function Decisions() {
  return (
    <Section
      id="decisions"
      eyebrow="Decision log"
      title="Design decisions"
      summary="Every decision is locked in infraMind/docs/decision-tree.md; changing one means adding a change-log row. D10, D11, D13, D14 and D16–D19 are unused numbers."
    >
      <Table head={['ID', 'Decision', 'Status']} className="decisions" rows={rows.map(([id, text, s]) => [
        <code>{id}</code>, text, <Pill status={pill[s][0]}>{pill[s][1]}</Pill>,
      ])} />

      <Details title="How the original open questions were settled">
        <Table head={['Question in PRD v1.1', 'Outcome']} rows={[
          ['Kafka vs. Redis Streams', 'Redis Streams. Enough for prototype scale, already needed for state.'],
          ['LLM vs. graph vs. hybrid RCA', 'Hybrid, with a hard rule: the graph ranks, the LLM explains (D1).'],
          ['Static vs. trace-derived graph', 'Trace-derived with a cold-start seed file (D21).'],
          ['Time-window vs. dependency-constrained correlation', 'Time-window only so far; graph constraint not built.'],
          ['Upstream walk, BFS vs. DFS', 'Toward callees, breadth-first, depth ≤ 4 (P5 code).'],
          ['Sidecar vs. central cloud collector', 'Moot: cloud is out of scope (D8).'],
        ]} />
        <p>Also recorded outside D-numbers: the Alertmanager service-name order, 13 P4 detection rulings, and 8 P4b correlation rulings (see the specs under <code>docs/superpowers/specs/</code>).</p>
      </Details>
    </Section>
  )
}
