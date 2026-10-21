import { Section } from './ui.jsx'

const items = [
  { id: 'D5', ask: 'Use Online Boutique instead of Sock Shop as the test app.', why: 'Sock Shop has weak tracing. Boutique ships OpenTelemetry and 11 gRPC services.', impact: 'Already built on Boutique (P1).' },
  { id: 'D6', ask: 'Run each scenario 5 times (proposal: 3), plus a fault-free soak run.', why: 'Gives mean ± std with a 95% CI, and false alarms per hour from the soak.', impact: 'Sets the P7 evaluation budget.' },
  { id: 'D7', ask: 'Compare against six baselines instead of "raw alerts + ablations".', why: 'Random, highest-error, deepest-erroring-span, PageRank (MicroRCA-style), LLM-only and raw Alertmanager make the RCA claim harder to dismiss.', impact: 'More work in P7.' },
  { id: 'NFR', ask: 'Replace the 10k logs/s and 5k spans/s throughput targets with load-test numbers measured on the real machine.', why: 'The prototype runs on a single 7 GiB dev machine, so measured numbers are reported instead of fixed targets.', impact: 'Changes a stated non-functional requirement.' },
  { id: 'D2', ask: 'Accept the reworded RCA walk: edges point caller → callee, and the walk goes toward callees.', why: 'The proposal said "upstream", which is ambiguous. Failures propagate from callee to caller.', impact: 'Fixes the meaning of the P5 graph walk.' },
  { id: 'Timeline', ask: 'Give the paper phase (P9) 3–4 weeks and re-baseline dates from the real start date.', why: 'The proposal timeline predates the build.', impact: 'Schedule.' },
  { id: 'D21–D25', ask: 'Sign off the service graph contract, change correlation, scripts/ folder, pre-commit hooks and commit identity rules.', why: 'Locked by the team on 10–11 Oct, marked "supervisor sign-off pending".', impact: 'D24 hooks are not written yet.' },
  { id: 'D7-Replay', ask: 'Accept signal-time replay of recorded fixtures as the evaluation\'s reproducibility method.', why: 'Detection, correlation and ranking run on signal time, so the same fixture gives a byte-identical result on every run.', impact: 'Defines how every P7 result is produced. Team-approved 21 Oct.' },
  { id: 'D26–D27', ask: 'Sign off running only pod-level scenarios until the chaos fix lands (D26), and a 4-Deployment chart with alerting and the LLM folded into existing processes (D27).', why: 'D26 ships the 6 stress/network scenarios written but marked blocked. D27 avoids 3 extra Deployments with no independent scaling need.', impact: 'Team-approved 21 Oct. D27 conflicts with the module import rule (see Architecture).' },
  { id: 'D2-Chaos', ask: 'Approve switching chaos-daemon to the containerd runtime.', why: 'Without it, CPU, memory and network faults never inject (see Testbed).', impact: 'Blocks 6 of the 14 P7 scenarios.' },
]

export default function Decide() {
  return (
    <Section
      id="decide"
      eyebrow="For the supervisor"
      title="Needs your decision"
      tags={[['changed', `${items.length} open`]]}
      summary="Changes from the July 2026 proposal that the team has adopted or proposed and that wait on your approval. Source: docs/decision-tree.md, change log."
    >
      <div className="asks">
        {items.map(i => (
          <div className="ask" key={i.id}>
            <span className="ask-id">{i.id}</span>
            <div className="ask-body">
              <p className="ask-q">{i.ask}</p>
              <p className="ask-why"><b>Why:</b> {i.why}</p>
              <p className="ask-why"><b>Affects:</b> {i.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
