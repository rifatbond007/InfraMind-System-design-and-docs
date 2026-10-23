import { Section, Table, Pill, Details, Bullets } from './ui.jsx'

export default function TechStack() {
  return (
    <Section
      id="stack"
      eyebrow="Technology"
      title="Stack & quality"
      summary="Python 3.11+ with pydantic, redis, httpx, FastAPI, asyncpg, PyYAML and prometheus_client. Everything else in the PRD's list is either a testbed tool or out of scope."
    >
      <Table head={['Layer', 'In use', 'Planned / dropped']} rows={[
        ['Language', 'Python ≥ 3.11 (CI 3.11)', '—'],
        ['Runtime libs', 'pydantic 2, redis, httpx, FastAPI, uvicorn, asyncpg, PyYAML, prometheus_client', <><Pill status="changed">Not declared</Pill> openai (imported lazily; falls back to Ollama) · <Pill status="planned">Not added</Pill> networkx (own graph code), Alembic, kubernetes</>],
        ['Data stores', 'Redis 7 (streams, cursors, dedup); Postgres 16 (written by the API pipeline, read by the API)', 'No migrations tool (Alembic not added)'],
        ['Sources', 'Prometheus, Loki, Jaeger, Alertmanager', <><Pill status="planned">Dropped</Pill> ELK, Datadog, PagerDuty, Grafana webhooks</>],
        ['Infra', 'kind, Helm, Chaos Mesh, Online Boutique', <><Pill status="planned">Dropped</Pill> AWS/GCP/Azure, VMs, AWS FIS</>],
        ['Channels', 'Console, generic webhook', <><Pill status="planned">Deferred</Pill> Slack, email</>],
        ['Packaging', 'Non-root Dockerfile, Helm chart (4 Deployments), 8-service docker-compose', <><Pill status="changed">Not yet</Pill> installed on kind (image builds since 23 Oct)</>],
      ]} />

      <h3 className="h3">Testing & CI</h3>
      <div className="hero-stats inline">
        <div className="stat"><strong>942</strong>unit passed</div>
        <div className="stat"><strong>943</strong>with integration</div>
        <div className="stat"><strong>22</strong>skipped (live backends)</div>
        <div className="stat"><strong>0</strong>e2e tests</div>
      </div>
      <Bullets items={[
        'Unit tests added on 21 Oct by area: evaluation 74, rca 71, llm 66, api 65, storage 50, alerting 26. Earlier: detection 81, ingestion 64, common 63, correlation 61, plus repo-level checks (module rules, metadata drift, smoke-gate logic).',
        'Fakes instead of servers: fakeredis and httpx.MockTransport.',
        'CI on every push: ruff, ruff format, mypy, pytest, hadolint (blocking) and helm-lint. Pre-commit also runs the three D24 hooks (module rules, commit trailers, PROGRESS row) in simulate mode, to become enforcing after a week.',
        'The 23 Oct audit removed 7 unreferenced functions, 3 never-raised exceptions and 2 unused dev dependencies, and made make test unit-only again.',
      ]} />

      <Details title="Versions">
        <Table head={['Tool', 'Version']} rows={[
          ['kind / kubectl / helm', 'v0.24.0 / v1.30.0 / v3.15.4'],
          ['kube-prometheus-stack', '55.7.0'],
          ['Loki / Jaeger chart / Alloy', '6.21.0 / 3.3.0 (image 1.59) / 1.13.1'],
          ['Chaos Mesh', '2.7.2'],
          ['Online Boutique', 'v0.10.7'],
          ['ruff / mypy / pytest', '0.17.1 / ≥ 1.10 / ≥ 8'],
        ]} />
      </Details>
    </Section>
  )
}
