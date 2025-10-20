# Foundation Platform Runbook

## Scope
- Services: Foundation API (Auth, Tenant & Org, Catalog, RBAC)
- Database: DB-FOUNDATION
- Owning team: Foundation Platform Team (`#team-foundation`, PagerDuty: `foundation-platform`)

## Key Metrics & Alerts
- `foundation.auth.latency.p95` > 800ms for 5 minutes (critical)
- `catalog.cache.hit_ratio` < 0.85 for 10 minutes (warning)
- API error rate (`foundation.5xx_rate`) > 2% (critical)

## Triage Steps
1. Check service health dashboards in Grafana (`Foundation Overview`) for latency/error spikes.
2. Validate recent deploys in the change log; if a deploy occurred within 30 minutes, initiate rollback via Argo CD.
3. Inspect Postgres health for `DB-FOUNDATION` (connections, locks, replication lag) using `psql \l+` and `pg_stat_activity` dashboards.

## Stabilization Actions
- Flush Redis cache keyspace `foundation:*` if catalog cache stampede suspected (coordinate with Infra team).
- Scale BFF + Foundation services horizontally via Kubernetes HPA override if thread pools are saturated.
- Enable `read_only_mode` feature flag to protect writes while assessing data integrity issues.

## Escalation
- If no mitigation in 15 minutes, page Database Reliability (`@db-oncall`) and Shared Infra (`@infra-primary`).
- For security-related anomalies (unexpected access), notify Security Operations (`#security-ops`).

## Post-Incident
- File an incident review ticket in Jira (`INC-FOUNDATION-*`).
- Update affected runbooks or dashboards within one business day.
- Share summary in `#incidents` once resolved.
