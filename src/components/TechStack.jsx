import { Section, Table, Pill, Details, Bullets } from './ui.jsx'

export default function TechStack() {
  return (
    <Section
      id="stack"
      eyebrow="Technology"
      title="Stack & quality"
      summary="Python 3.11+ with pydantic, redis, httpx and FastAPI. Everything else in the PRD's list is either a testbed tool or out of scope."
    >
      <Table head={['Layer', 'In use', 'Planned / dropped']} rows={[
        ['Language', 'Python ≥ 3.11 (CI 3.11)', '—'],
        ['Runtime libs', 'pydantic 2, redis, httpx, FastAPI, uvicorn', <><Pill status="planned">Not added</Pill> networkx, SQLAlchemy/asyncpg, Alembic, Jinja, openai, kubernetes</>],
        ['Data stores', 'Redis 7 (streams, cursors, dedup)', <><Pill status="changed">Idle</Pill> Postgres 16 runs, unused</>],
        ['Sources', 'Prometheus, Loki, Jaeger, Alertmanager', <><Pill status="planned">Dropped</Pill> ELK, Datadog, PagerDuty, Grafana webhooks</>],
        ['Infra', 'kind, Helm, Chaos Mesh, Online Boutique', <><Pill status="planned">Dropped</Pill> AWS/GCP/Azure, VMs, AWS FIS</>],
        ['Channels', '—', <><Pill status="planned">P6</Pill> Slack, email, webhook</>],
        ['Packaging', 'Dockerfile (placeholder CMD), docker-compose', <><Pill status="planned">P8</Pill> Helm chart in deploy/helm/</>],
      ]} />

      <h3 className="h3">Testing & CI</h3>
      <div className="hero-stats inline">
        <div className="stat"><strong>509</strong>passed</div>
        <div className="stat"><strong>4</strong>skipped (live backends)</div>
        <div className="stat"><strong>6.7 s</strong>full suite</div>
        <div className="stat"><strong>0</strong>e2e tests</div>
      </div>
      <Bullets items={[
        'Unit tests by area: detection 81, common 63, ingestion 64, correlation 61, api 25, plus about 48 repo-level checks (module rules, metadata drift, smoke-gate logic).',
        'Fakes instead of servers: fakeredis and httpx.MockTransport.',
        'CI on every push: ruff, ruff format, mypy, pytest, hadolint (non-blocking). A passing GitHub Actions run has not been recorded yet.',
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
