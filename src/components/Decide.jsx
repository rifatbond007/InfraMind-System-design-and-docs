import { Section } from './ui.jsx'

const items = [
  { id: 'D5', ask: 'Use Online Boutique instead of Sock Shop.', why: 'Boutique has better tracing. Already built on it.' },
  { id: 'D6', ask: 'Run each scenario 5 times (not 3), plus a fault-free run.', why: 'Gives averages with confidence intervals and a false-alarm rate.' },
  { id: 'D7', ask: 'Compare against 6 simple baselines.', why: 'Makes the result harder to dismiss.' },
  { id: 'NFR', ask: 'Report measured throughput instead of fixed targets.', why: 'Everything runs on one 7 GiB laptop.' },
  { id: 'D2', ask: 'Search from the failing service toward the services it calls.', why: '"Upstream" in the proposal was ambiguous.' },
  { id: 'Timeline', ask: 'Give the paper (P9) 3–4 weeks.', why: 'The old timeline was written before the build.' },
  { id: 'D21–D25', ask: 'Sign off the graph, change-tracking, scripts and commit rules.', why: 'Agreed by the team on 10–11 Oct.' },
  { id: 'D7-Replay', ask: 'Evaluate by replaying recorded signals.', why: 'Same input gives the same result every time.' },
  { id: 'D26–D27', ask: 'Run only pod-level faults for now; ship 4 Deployments instead of 7.', why: 'Other faults are blocked; 7 pods would add nothing.' },
  { id: 'D28', ask: 'Let one module (inframind.main) join RCA, LLM, alerts and storage.', why: 'Without it, incidents were ranked but never saved or alerted.' },
  { id: 'D2 (library)', ask: 'Accept our own graph code instead of NetworkX.', why: 'The code never used NetworkX; the docs still say it does.' },
  { id: 'D2-Chaos', ask: 'Switch Chaos Mesh to the containerd runtime.', why: 'Without it, CPU, memory and network faults do not work.' },
]

export default function Decide() {
  return (
    <Section
      id="decide"
      eyebrow="For the supervisor"
      title="Needs your decision"
      tags={[['changed', `${items.length} open`]]}
      summary="Changes from the July 2026 proposal that wait on your approval."
    >
      <div className="asks">
        {items.map(i => (
          <div className="ask" key={i.id}>
            <span className="ask-id">{i.id}</span>
            <div className="ask-body">
              <p className="ask-q">{i.ask}</p>
              <p className="ask-why"><b>Why:</b> {i.why}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
