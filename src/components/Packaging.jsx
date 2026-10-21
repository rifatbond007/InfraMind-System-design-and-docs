import { Section, Flow, PlanBuilt, Table, Details, Bullets } from './ui.jsx'

export default function Packaging() {
  return (
    <Section
      id="packaging"
      eyebrow="Phase P8"
      title="Packaging & deployment"
      tags={[['built', 'Built'], ['changed', 'Not yet installed']]}
      summary="One non-root container image, a Helm chart with four Deployments and six Prometheus metrics. The chart passes lint and template checks in CI, but no image has been built or installed on the cluster yet (the dev machine has no Docker daemon)."
    >
      <Flow
        caption="Four Deployments, not seven: alerting and the LLM run inside existing processes (D27). Monitors are off by default."
        w={140}
        colGap={48}
        nodes={[
          { id: 'img', col: 0, row: 1, label: 'Image', sub: 'python 3.11 · uid 10001', status: 'built' },
          { id: 'ch', col: 1, row: 1, label: 'Helm chart', sub: 'inframind 0.1.0', status: 'built' },
          { id: 'api', col: 2, row: 0, label: 'api', sub: 'uvicorn :8080', status: 'built' },
          { id: 'ing', col: 2, row: 1, label: 'ingestion', sub: '3 collector containers', status: 'built' },
          { id: 'det', col: 2, row: 2, label: 'detection', sub: 'runs correlation', status: 'built' },
          { id: 'rca', col: 2, row: 3, label: 'rca', sub: '1 replica · snapshot', status: 'built' },
          { id: 'sm', col: 3, row: 0, label: 'ServiceMonitor', sub: 'api :8080', status: 'partial' },
          { id: 'pm', col: 3, row: 2, label: 'PodMonitor', sub: 'workers :9100', status: 'partial' },
        ]}
        edges={[['img', 'ch'], ['ch', 'api'], ['ch', 'ing'], ['ch', 'det'], ['ch', 'rca'], ['api', 'sm'], ['ing', 'pm'], ['det', 'pm'], ['rca', 'pm']]}
      />

      <PlanBuilt planLabel="Planned (standard 11)" rows={[
        { name: 'Image', plan: 'Container per component', status: 'built', built: 'Two-stage Dockerfile, runs as uid 10001; each pod overrides the command. .dockerignore keeps secrets and kubeconfigs out.', where: 'Dockerfile, .dockerignore' },
        { name: 'Helm chart', plan: 'One Deployment per stage', status: 'changed', built: 'Four Deployments: api, ingestion, detection, rca (D27). Ingress off by default; renders 13 objects.', where: 'deploy/helm/inframind/' },
        { name: 'RBAC', plan: 'Read-only cluster access', status: 'built', built: 'Namespaced Role, get/list/watch only, on pods, logs, events, config, workloads and HPAs. No ClusterRole.', where: 'templates/rbac.yaml' },
        { name: 'Metrics', plan: 'Self-monitoring', status: 'built', built: 'Six metrics on a private registry: signals received, anomalies emitted, incidents opened, RCA ranking time, LLM call time, alerts sent.', where: 'metrics.py' },
        { name: 'Local stack', plan: '—', status: 'built', built: 'docker-compose grows from 2 to 8 services: Redis, Postgres, api, detection, rca and three collectors.', where: 'docker-compose.yml' },
        { name: 'On the cluster', plan: 'make up-app', status: 'changed', built: 'Make targets exist (image, image-load, helm-install, up-app). Not yet run: no Docker daemon on the dev box.', where: 'Makefile' },
      ]} />

      <Details title="Metric names and CI checks">
        <Table head={['Metric', 'Labels']} rows={[
          [<code>inframind_signals_received_total</code>, 'source, type'],
          [<code>inframind_anomalies_emitted_total</code>, 'detector'],
          [<code>inframind_incidents_opened_total</code>, 'service'],
          [<code>inframind_rca_ranking_duration_seconds</code>, 'histogram'],
          [<code>inframind_llm_call_duration_seconds</code>, 'histogram'],
          [<code>inframind_alerts_sent_total</code>, 'channel, severity'],
        ]} />
        <Bullets items={[
          'New blocking CI job helm-lint: helm lint --strict, helm template, exactly 4 Deployments, an empty Secret, read-only RBAC, chart packaging.',
          'hadolint is now blocking at warning level (it used to be allowed to fail).',
          'Workers serve /metrics on port 9100; the API appends the same registry to its own /metrics.',
        ]} />
      </Details>
    </Section>
  )
}
