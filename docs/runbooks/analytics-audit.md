# Analytics & Audit Runbook

## Scope
- Services: Audit Service, Reporting/BI Service, ML/Insights Service
- Database: DB-ANALYTICS, downstream lake/warehouse
- Owning team: Insights & Compliance Team (`#team-analytics`, PagerDuty: `analytics-oncall`)

## Key Metrics & Alerts
- `analytics.pipeline.lag_minutes` > 30 (critical)
- `audit.ingest.success_rate` < 99% for 10 minutes (warning)
- `ml.inference.error_rate` > 5% (warning)

## Triage Steps
1. Confirm alert via the `Analytics & Audit` dashboard; identify which ingestion pipelines are degraded.
2. Inspect CDC connectors for Clinical/RCM in Debezium; restart connectors if stalled.
3. Validate storage health (S3 compatible object store, warehouse load queues) and check for quota/billing issues.

## Stabilization Actions
- Pause non-critical ML batch jobs to free compute for ingestion workloads.
- Trigger manual backfill using `scripts/run_analytics_backfill.sh --from <timestamp>` when lag exceeds 2 hours.
- Switch Reporting service to cached-mode (`REPORTING_CACHE_ONLY=1`) to reduce load on DB-ANALYTICS during incidents.

## Escalation
- Engage Shared Infra if storage or Kafka availability is degraded.
- Notify Compliance if audit log ingestion drops below 95% for more than 15 minutes.
- Loop in Data Engineering when schema drift or CDC errors appear.

## Post-Incident
- Reconcile audit log completeness (compare expected vs actual counts) and store the report in `/reports/audit-gap-YYYYMMDD.csv`.
- Update incident summary in `#compliance-updates` and share any customer-facing comms.
- Ticket follow-up actions in Jira (`ANLT-*`).
