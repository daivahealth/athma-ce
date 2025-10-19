# RCM Services Runbook

## Scope
- Services: Billing Service, Claims Service, Eligibility & Preauth Service, AR/Finance Service, Pharmacy Service
- Database: DB-RCM (tenant-scoped PHI + financial data)
- Owning team: Revenue Cycle Team (`#team-rcm`, PagerDuty: `rcm-primary`)

## Key Metrics & Alerts
- `rcm.claim.submission.rate` drops < 0.7x baseline (critical)
- `rcm.superbill.create.latency.p95` > 1.2s (warning)
- Kafka consumer lag on `billing.superbill.created` > 500 messages (critical)
- `pharmacy.inventory.balance_mismatch` alert triggered (critical)

## Triage Steps
1. Review the `RCM Overview` Grafana dashboard for correlated spikes in error rates, queue lag, and DB write latency.
2. Inspect outbox table growth in DB-RCM; if >10k unsent rows, check the outbox dispatcher logs.
3. Validate external dependencies (payer gateways, clearinghouse) by checking synthetic monitors; if external outage confirmed, initiate contingency protocol.

## Stabilization Actions
- Pause asynchronous claim submission jobs via feature flag `claims.async.enabled=false` while retaining draft creation.
- Rebalance Kafka consumer group for Billing/Claims services (`kafka-consumer-groups --execute --reset-offsets ...`) when lag is isolated to a single instance.
- Execute inventory reconciliation script `scripts/pharmacy_rebalance.sql` when stock deltas exceed threshold.

## Escalation
- Engage Finance Ops when claims submission downtime exceeds 30 minutes or cash posting is blocked.
- Notify Legal/Compliance if data corruption or duplicate claim submissions occur.
- Coordinate with Clinical On-call if encounter finalization events are not arriving for >15 minutes.

## Post-Incident
- Produce denial-risk impact analysis and share with Finance leadership.
- Backfill Analytics warehouse for the affected timeframe using the CDC replay tooling.
- Update customer status page if claim submission SLA breached.
