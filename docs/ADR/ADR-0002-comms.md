# ADR-0002: Inter-Service Communication — HTTP/REST for Sync; Events for Async

- **Status**: Accepted
- **Date**: 2025-09-29
- **Owners**: Architecture Team
- **Related**: ADR-0001 (Language Split), ADR-0003 (Multi-Tenancy)

## 1) Decision
- **Synchronous calls** between services use **HTTP/REST + JSON** with **OpenAPI** contracts and **idempotency keys** for mutating endpoints.
- **Asynchronous workflows** (long-running, fan-out, retries) use a **message bus** (Kafka or RabbitMQ; final pick in a separate infra ADR). We adopt the **Transactional Outbox** pattern for publish reliability.
- **gRPC** is optional for **intra-VPC high-throughput** paths (e.g., AI inference fan-in), but **not required for MVP**.
- **GraphQL** is reserved for external developer APIs only (post-GA), not for service-to-service.

## 2) Drivers
- Clear, debuggable, browser-friendly interfaces for web/ops tools → HTTP/REST + OpenAPI.
- Strong **contract testing** and **SDK generation** for Node (Zod) and Python (Pydantic).
- PMS/RCM is overwhelmingly **I/O-bound** with external payers; async is needed for resiliency.

## 3) Scope
- Applies to all internal services: api-gateway, auth, pms-core, rcm-core, remittance, connectors, rules-engine, ai-services, notifications, audit.

## 4) Non-Goals
- Not choosing a single message bus (Kafka vs RabbitMQ resolved in infra ADR).
- Not mandating a service mesh (may be added later).

## 5) Contract Standards
- **OpenAPI 3.1** source of truth; generate TS/Python clients.
- **Idempotency**: `Idempotency-Key` header; server stores request hash & result for TTL.
- **Time bounds**: default **client timeout = 3s**, server **deadline = 5s**; retries with **exponential backoff & jitter** on safe verbs.
- **Error model**: RFC-7807 Problem+JSON; include `trace_id`, `tenant_id`.

## 6) Async/Event Patterns
- **Event types** (domain-first): `eligibility.checked`, `prior_auth.submitted`, `claim.submitted`, `claim.status.changed`, `remittance.received`, `reconciliation.exception`, `note.drafted`, `charge.suggested`.
- **Delivery**: at-least-once; consumers must be **idempotent**.
- **Ordering**: per aggregate key (e.g., claim_no) where required.
- **Reliability**: **Transactional Outbox** + background dispatcher; **Inbox** table for exactly-once effect.
- **DLQ** with alerting; replay tooling guarded by time windows and tenant filters.
- **Schema**: JSON with semantic versioning; breaking changes via new event name.

## 7) Security & Network
- **mTLS** inside the cluster, OAuth2 client-cred between services when needed.
- Rate limits per client + per tenant.
- PII minimization in events; encrypt sensitive fields as needed.

## 8) Observability
- **OpenTelemetry**: propagate `traceparent` across HTTP and message bus.
- RED metrics on all endpoints/consumers; exemplars link traces to error spikes.

## 9) Alternatives Considered

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| gRPC for everything | Fast, schemas | Browser/tooling friction, added complexity | ❌ |
| GraphQL internal | Flexible querying | Overkill for service comms; caching harder | ❌ |
| REST + Events (chosen) | Simple, debuggable, resilient | Two paradigms to operate | ✅ |

## 10) Risks & Mitigations
- **Dual-write bugs** → Outbox pattern, contract tests.
- **Schema drift** → OpenAPI as single source, CI contract validation.
- **Event storms** → Quotas, backpressure, per-tenant throttles.

## 11) Acceptance Criteria
- OpenAPI repo with generated TS/Python SDKs.
- Outbox/Inbox libs integrated in two services (rcm-core, remittance).
- k6 load + chaos tests validating timeouts/backoff and DLQ processing.
