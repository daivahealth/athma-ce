# Shared Infrastructure Runbook

## Scope
- Services: Event Bus (Kafka), Cache (Redis), Secret Manager, Observability stack (Prometheus, Loki, Tempo), API Gateway ingress
- Owning team: Platform Infrastructure Team (`#team-infra`, PagerDuty: `infra-primary`)

## Key Metrics & Alerts
- Kafka cluster under-replicated partitions > 0 (critical)
- Redis memory usage > 80% for 10 minutes (warning)
- `ingress.http.5xx_rate` > 2% or `p95` latency > 1s (critical)
- Prometheus scrape failure ratio > 10% (warning)

## Triage Steps
1. Check Infra overview dashboards for Kafka/Redis/Ingress to pinpoint component under distress.
2. Review recent maintenance windows or deploys that may correlate (check `infra-changelog` Confluence page).
3. Inspect node health via Kubernetes (`kubectl get nodes`) and confirm cluster autoscaler status.

## Stabilization Actions
- For Kafka: reassign partitions (`kafka-reassign-partitions`) or scale brokers; if broker loss, trigger automatic failover via Terraform module `infra/kafka`.
- For Redis: enable eviction policy `volatile-lru` temporarily and scale vertically if memory pressure persists.
- For ingress spikes: enable rate limiting at API Gateway and coordinate with edge CDN for traffic shaping.

## Escalation
- Notify domain on-call teams if platform outage impacts their SLAs beyond 10 minutes.
- Engage Cloud Provider support if underlying managed services (e.g., MSK, ElastiCache) exhibit provider-side incidents.
- Inform Security Operations for any suspected secret compromise.

## Post-Incident
- Run capacity review for the affected component and update Terraform sizing defaults.
- Publish an incident summary in `#platform-status` and update the customer status page if user-facing impact occurred.
- Schedule resilience improvements in the Infra backlog (`INFRA-*`).
