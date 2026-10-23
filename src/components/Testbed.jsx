import { Section, Flow, PlanBuilt, Table, Pill, Details } from './ui.jsx'

export default function Testbed() {
  return (
    <Section
      id="testbed"
      eyebrow="Phase P1"
      title="Testbed"
      tags={[['built', 'Built'], ['blocked', '1 blocker']]}
      summary="A local kind cluster runs Online Boutique, a full observability stack and Chaos Mesh. One command (make up) brings it all up; make smoke-testbed checks it (6/6 passing)."
    >
      <Flow
        caption="Faults are injected into Boutique; the observability stack records them; InfraMind reads the stack."
        w={132}
        colGap={44}
        nodes={[
          { id: 'chaos', col: 0, row: 0, label: 'Chaos Mesh 2.7.2', sub: '5 fault CRs', status: 'changed' },
          { id: 'app', col: 1, row: 0, label: 'Online Boutique', sub: 'v0.10.7 · 11 svcs', status: 'built' },
          { id: 'prom', col: 2, row: 0, label: 'Prometheus', sub: '+ Alertmanager', status: 'external' },
          { id: 'loki', col: 2, row: 1, label: 'Loki 6.21', sub: 'via Grafana Alloy', status: 'external' },
          { id: 'jae', col: 2, row: 2, label: 'Jaeger 1.59', sub: 'OTel traces', status: 'external' },
          { id: 'im', col: 3, row: 1, label: 'InfraMind', sub: 'on host :8080', status: 'built' },
        ]}
        edges={[['chaos', 'app'], ['app', 'prom'], ['app', 'loki'], ['app', 'jae'], ['prom', 'im'], ['loki', 'im'], ['jae', 'im']]}
      />

      <PlanBuilt planLabel="Planned (PRD / proposal)" rows={[
        { name: 'Cluster', plan: 'Kubernetes', status: 'built', built: 'kind v0.24, k8s 1.30, 1 control-plane + 1 worker (fits a 7 GiB dev box).', where: 'testbed/kind/' },
        { name: 'App under test', plan: 'Sock Shop (proposal) / Online Boutique (PRD)', status: 'changed', built: 'Online Boutique, load generator off, tracing on for 6 services.', where: 'testbed/boutique/' },
        { name: 'Observability', plan: 'Existing tools', status: 'built', built: 'kube-prometheus-stack 55.7, Loki 6.21, Jaeger 3.3, Alloy 1.13.', where: 'testbed/obs/' },
        { name: 'Fault injection', plan: 'Chaos Mesh, AWS FIS', status: 'blocked', built: 'Chaos Mesh only. Pod-level faults work; stress and network faults do not inject.', where: 'testbed/chaos/' },
      ]} />

      <h3 className="h3">Fault experiments</h3>
      <Table head={['Experiment', 'Target', 'Injects?']} rows={[
        ['pod-kill', 'frontend pod', <Pill status="built">Verified</Pill>],
        ['oom-kill (container-kill)', 'frontend server container', <Pill status="changed">Not verified</Pill>],
        ['cpu-stress', 'adservice, 2 workers at 80% for 5 min', <Pill status="blocked">No</Pill>],
        ['stress-memory', 'cartservice, hold 200 MiB', <Pill status="blocked">No</Pill>],
        ['network-delay', 'recommendation → productcatalog, 200 ± 50 ms', <Pill status="blocked">No</Pill>],
      ]} />

      <div className="callout blocked">
        <b>Open blocker.</b> chaos-daemon runs with <code>runtime=docker</code> on a containerd node and rejects every container id (<code>expected docker:// but got container</code>). Recorded runs confirm no effect: network delay left edge latency at about 1.2 ms. The proposed fix (D2-Chaos-runtime) is waiting for approval. NetworkChaos also needs host kernel modules <code>sch_netem</code>, <code>ip_set_hash_ipport</code>, <code>ip_set_hash_net</code>.
      </div>

      <Details title="Ports, gates and partial tracing">
        <Table head={['Port', 'Service']} rows={[
          ['30090', 'Prometheus'], ['30093', 'Alertmanager'], ['30300', 'Grafana'],
          ['30100', 'Loki gateway'], ['30686', 'Jaeger UI'], ['30317 / 30318', 'OTLP gRPC / HTTP'],
          ['8080', 'InfraMind API (host). Alertmanager posts to a host address chosen at install time: INFRAMIND_HOST_ADDR, else host.docker.internal on Docker Desktop, else the kind network gateway'],
        ]} />
        <p><b>Gates:</b> <code>make smoke-testbed</code> (6 checks, including a pod-kill visible in all three backends), <code>make smoke-ingestion</code> (5), <code>make smoke-detection</code> (about 7 min). On 23 Oct, after the webhook host fix, smoke-testbed passed 6/6 and smoke-ingestion 5/5 again on Docker Desktop (the fix is not committed yet). <code>make observe-fault</code> prints before/during/after timelines for any chaos CR.</p>
        <p><b>Partial service graph:</b> adservice, cartservice, shippingservice and emailservice emit no traces. Live-verified edges: frontend → productcatalog, frontend → recommendation, recommendation → productcatalog.</p>
      </Details>
    </Section>
  )
}
