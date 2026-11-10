import { Section, Flow, PlanBuilt, Table, Pill, Details } from './ui.jsx'

export default function Testbed() {
  return (
    <Section
      id="testbed"
      eyebrow="Phase P1"
      title="Testbed"
      tags={[['built', 'Built'], ['blocked', '1 blocker']]}
      summary="A local Kubernetes cluster with a demo shop, monitoring tools and a fault injector. One command starts it: make up."
    >
      <Flow
        caption="We break the shop on purpose; monitoring records it; InfraMind reads the monitoring."
        w={132}
        colGap={44}
        nodes={[
          { id: 'chaos', col: 0, row: 0, label: 'Chaos Mesh', sub: 'injects faults', status: 'changed' },
          { id: 'app', col: 1, row: 0, label: 'Online Boutique', sub: 'demo shop', status: 'built' },
          { id: 'prom', col: 2, row: 0, label: 'Prometheus', sub: 'metrics + alerts', status: 'external' },
          { id: 'loki', col: 2, row: 1, label: 'Loki', sub: 'logs', status: 'external' },
          { id: 'jae', col: 2, row: 2, label: 'Jaeger', sub: 'traces', status: 'external' },
          { id: 'im', col: 3, row: 1, label: 'InfraMind', sub: 'port 8080', status: 'built' },
        ]}
        edges={[['chaos', 'app'], ['app', 'prom'], ['app', 'loki'], ['app', 'jae'], ['prom', 'im'], ['loki', 'im'], ['jae', 'im']]}
      />

      <PlanBuilt planLabel="Planned" rows={[
        { name: 'Cluster', plan: 'Kubernetes', status: 'built', built: 'kind, 2 nodes, fits a 7 GiB laptop.' },
        { name: 'Demo app', plan: 'Sock Shop', status: 'changed', built: 'Online Boutique (better tracing).' },
        { name: 'Monitoring', plan: 'Existing tools', status: 'built', built: 'Prometheus, Loki, Jaeger, Grafana.' },
        { name: 'Fault injection', plan: 'Chaos Mesh', status: 'blocked', built: 'Pod faults work. CPU, memory, network faults don\'t.' },
      ]} />

      <h3 className="h3">Fault types</h3>
      <Table head={['Fault', 'Works?']} rows={[
        ['Kill a pod', <Pill status="built">Yes</Pill>],
        ['Kill a container', <Pill status="changed">Not checked</Pill>],
        ['CPU stress', <Pill status="blocked">No</Pill>],
        ['Memory stress', <Pill status="blocked">No</Pill>],
        ['Network delay', <Pill status="blocked">No</Pill>],
      ]} />

      <div className="callout blocked">
        <b>Blocker:</b> Chaos Mesh is set for Docker, but the cluster uses containerd, so stress and network faults do nothing. The fix (D2-Chaos) waits for approval.
      </div>

      <Details title="Health checks and links">
        <p><b>Latest checks (10 Nov):</b> testbed 6/6, ingestion 5/5, detection 4/4 — all passing.</p>
        <Table head={['Port', 'Tool']} rows={[
          ['30090', 'Prometheus'], ['30093', 'Alertmanager'], ['30300', 'Grafana (dashboard: InfraMind / Signals)'],
          ['30686', 'Jaeger'], ['8080', 'InfraMind API'],
        ]} />
        <p>4 of 11 shop services send no traces, so the service graph is partial.</p>
      </Details>
    </Section>
  )
}
