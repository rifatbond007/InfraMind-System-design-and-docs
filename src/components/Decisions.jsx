import { Section, Table, Pill } from './ui.jsx'

const rows = [
  ['D1', 'The code picks the root cause; the LLM only explains.', 'approved'],
  ['D2', 'Search from the failing service toward what it calls.', 'pending'],
  ['D3', 'No deep learning; simple statistics only.', 'approved'],
  ['D4', 'Stop learning "normal" during an incident.', 'approved'],
  ['D5', 'Online Boutique, not Sock Shop.', 'pending'],
  ['D6', '12+ scenarios × 5 runs.', 'pending'],
  ['D7', '6 baselines to compare against.', 'pending'],
  ['D7-Replay', 'Evaluate by replaying recorded signals.', 'pending'],
  ['D8', 'No cloud, VMs, Datadog/PagerDuty or auto-fixing.', 'approved'],
  ['D9', 'Hide secrets before any LLM call.', 'approved'],
  ['D15', 'Collect evidence before ranking.', 'approved'],
  ['D20', 'Postgres is the source of truth.', 'approved'],
  ['D21', 'One service map, owned by RCA.', 'pending'],
  ['D22', 'Track deploys and config changes (not built yet).', 'pending'],
  ['D24', 'Pre-commit checks (not built yet).', 'pending'],
  ['D25', 'Commits by real GitHub users only.', 'pending'],
  ['D26', 'Only pod faults until Chaos Mesh is fixed.', 'pending'],
  ['D27', '4 Helm parts instead of 7.', 'pending'],
  ['D28', 'One module joins save, explain and alert.', 'pending'],
  ['D2-Chaos', 'Switch Chaos Mesh to containerd.', 'proposed'],
]

const pill = { approved: ['built', 'Locked'], pending: ['changed', 'Awaiting sign-off'], proposed: ['planned', 'Proposed'] }

export default function Decisions() {
  return (
    <Section
      id="decisions"
      eyebrow="Decision log"
      title="Design decisions"
      summary="The main choices we made, and whether they are signed off."
    >
      <Table head={['ID', 'Decision', 'Status']} className="decisions" rows={rows.map(([id, text, s]) => [
        <code>{id}</code>, text, <Pill status={pill[s][0]}>{pill[s][1]}</Pill>,
      ])} />
    </Section>
  )
}
