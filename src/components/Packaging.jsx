import { Section, Flow, PlanBuilt, Details } from './ui.jsx'

export default function Packaging() {
  return (
    <Section
      id="packaging"
      eyebrow="Phase P8"
      title="Packaging & deployment"
      tags={[['built', 'Docker works'], ['changed', 'Helm install not tested']]}
      summary="InfraMind ships as one Docker image and a Helm chart with 4 parts. The Docker Compose version already runs the full pipeline."
    >
      <Flow
        caption="4 parts instead of 7: alerting and the LLM run inside the rca part."
        w={140}
        colGap={48}
        nodes={[
          { id: 'img', col: 0, row: 1, label: 'Image', sub: 'one for all', status: 'built' },
          { id: 'ch', col: 1, row: 1, label: 'Helm chart', sub: 'installs it', status: 'built' },
          { id: 'api', col: 2, row: 0, label: 'api', sub: 'web API', status: 'built' },
          { id: 'ing', col: 2, row: 1, label: 'ingestion', sub: 'collectors', status: 'built' },
          { id: 'det', col: 2, row: 2, label: 'detection', sub: '+ grouping', status: 'built' },
          { id: 'rca', col: 2, row: 3, label: 'rca', sub: '+ save · LLM · alert', status: 'built' },
          { id: 'sm', col: 3, row: 0, label: 'Monitoring', sub: 'optional', status: 'partial' },
          { id: 'pm', col: 3, row: 2, label: 'Monitoring', sub: 'optional', status: 'partial' },
        ]}
        edges={[['img', 'ch'], ['ch', 'api'], ['ch', 'ing'], ['ch', 'det'], ['ch', 'rca'], ['api', 'sm'], ['ing', 'pm'], ['det', 'pm'], ['rca', 'pm']]}
      />

      <PlanBuilt planLabel="Planned" rows={[
        { name: 'Image', plan: 'One per part', status: 'built', built: 'One image, runs as non-root.' },
        { name: 'Helm chart', plan: '7 parts', status: 'changed', built: '4 parts (D27).' },
        { name: 'Permissions', plan: 'Read-only', status: 'built', built: 'Read-only.' },
        { name: 'Self-metrics', plan: 'Yes', status: 'built', built: '6 metrics, shown in Grafana.' },
        { name: 'Docker Compose', plan: '—', status: 'built', built: 'Runs everything locally.' },
        { name: 'On the cluster', plan: 'make up-app', status: 'changed', built: 'Ready, not tested yet.' },
      ]} />

      <Details title="The 6 metrics">
        <ul>
          <li>Signals received</li>
          <li>Anomalies found</li>
          <li>Incidents opened</li>
          <li>RCA time</li>
          <li>LLM time</li>
          <li>Alerts sent</li>
        </ul>
      </Details>
    </Section>
  )
}
