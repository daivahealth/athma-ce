# Clinical Core Runbook

## Scope
- Services: Patient Service, Scheduling Service, Encounter Service, Care Plan Service
- Database: DB-CLINICAL (RLS enforced)
- Owning team: Clinical Experience Team (`#team-clinical`, PagerDuty: `clinical-core`)

## Key Metrics & Alerts
- `clinical.encounter.commit.latency.p95` > 1s for 5 minutes (critical)
- `clinical.api.5xx_rate` > 1.5% (critical)
- `clinical.rls.denied_requests` spike > 50/min (warning)

## Triage Steps
1. Confirm alert context in Grafana (`Clinical Core` dashboard) and check coincident spikes in PostgreSQL I/O.
2. Review event bus lag for topics `encounter.finalized` and `schedule.updated` to ensure consumer health.
3. Inspect recent change releases and feature flags; pause any active experiment toggles related to scheduling or encounters.

## Stabilization Actions
- Apply `kubectl rollout undo` for the affected service deployment if a regression is suspected.
- Fail open to cached catalog data when Foundation lookups are degraded (temporary toggle `useCatalogCacheOnly=true`).
- Coordinate with Infra to provision replica scaling if connection pools hit max (`pg_stat_activity` shows wait events `ClientRead`).

## Escalation
- Escalate to Shared Infra if Postgres saturation persists after scaling attempts.
- Notify Security Operations if RLS denied requests correlate with auth anomalies.
- Page RCM On-call if encounter → billing handoff is blocked for >30 minutes.

## Post-Incident
- Capture patient impact assessment and update care continuity checklist.
- Run data integrity validation (`encounter_consistency.sql`) and attach results to the incident.
- Document customer communication in `#customer-updates` channel.
