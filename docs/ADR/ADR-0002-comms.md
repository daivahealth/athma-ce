# ADR-0002: Inter-Service Communication — gRPC for Internal Sync; REST at Edge; Events for Async

- **Status**: Accepted
- **Date**: 2025-09-29
- **Last Reviewed**: 2026-04-29
- **Owners**: Architecture Team
- **Related**: ADR-0001 (Language Split), ADR-0003 (Multi-Tenancy)

> Implementation note
> This ADR describes the intended target-state communication model. The current repository primarily uses direct REST calls between the frontend and backend services, and does not yet implement the full API gateway, gRPC, or message-bus topology described below.

## 1) Decision
- **Edge + external** synchronous calls remain **HTTP/REST + JSON** (via API Gateway/BFF) with **OpenAPI** contracts and idempotency guarantees.
- **Service-to-service synchronous** calls inside the VPC use **gRPC** as the primary transport to provide schema safety, streaming, and lower latency; REST remains available for backward compatibility or when gRPC libraries are unavailable.
- **Asynchronous workflows** (long-running, fan-out, retries) use the **message bus (Kafka)** with the **Transactional Outbox** pattern for publish reliability.
- **GraphQL** is reserved for external developer APIs only (post-GA), not for service-to-service.

### Current Repository State

- Frontend calls backend services directly through shared Axios clients.
- Backend services expose REST APIs only in the implemented repo.
- Gateway/BFF, gRPC, and message-bus layers should be treated as planned architecture unless corresponding runtime assets are added.

## 2) Drivers
- Clear, debuggable, browser-friendly interfaces for edge users → HTTP/REST + OpenAPI remains the public contract.
- Strong **schema contracts** for internal domains (Clinical, RCM, Catalog, Auth) with automatic client generation → gRPC IDL + NestJS gRPC adapters.
- Lower latency and efficient payloads for cross-domain composition (Encounter → Superbill → Claim) while retaining REST fallbacks.
- PMS/RCM remains **I/O-bound** with external payers; async via Kafka continues to protect workflows that can complete out-of-band.

## 3) Scope
- Applies to all internal services: api-gateway, auth, pms-core, rcm-core, remittance, connectors, rules-engine, ai-services, notifications, audit.

## 4) Non-Goals
- Not choosing a single message bus (Kafka vs RabbitMQ resolved in infra ADR).
- Not mandating a service mesh (may be added later).

## 5) Contract Standards
- **Edge REST**: **OpenAPI 3.1** source of truth; generate TS/Python clients.
- **Internal gRPC**: proto definitions live alongside service repos; code generation for TypeScript (NestJS) and Go/Python consumers.
- **Idempotency**: `Idempotency-Key` header on REST POST/PUT; corresponding gRPC metadata `x-idempotency-key` for mutating RPCs.
- **Timeouts**: API Gateway default **3 s**, BFF → service **1 s**, service → service gRPC **300–800 ms** with deadline propagation.
- **Error model**: REST uses RFC-7807 Problem+JSON; gRPC uses rich status codes with `google.rpc.Status` details including `trace_id`, `tenant_id`.

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
- **OpenTelemetry**: propagate `traceparent` (REST) and `grpc-trace-bin` (gRPC) across calls and the message bus.
- RED metrics on all endpoints/consumers; exemplars link traces to error spikes.

## 9) Alternatives Considered

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| REST-only internal | Simple, existing tooling | Heavier payloads, weaker schemas, harder streaming | ❌ |
| gRPC everywhere (no REST) | Fast, unified tooling | Unfriendly to browsers/partners | ❌ |
| REST at edge + gRPC internal + events (chosen) | Best of both worlds; aligns with Service ↔ DB map | ✅ |

## 10) Risks & Mitigations
- **Dual-write bugs** → Outbox pattern, contract tests.
- **Schema drift** → OpenAPI as single source, CI contract validation.
- **Event storms** → Quotas, backpressure, per-tenant throttles.

## 11) Acceptance Criteria
- OpenAPI repo with generated TS/Python SDKs for edge APIs.
- Shared proto repo (or mono-module) with generated NestJS/Go/Python gRPC clients for core domains.
- Outbox/Inbox libs integrated in two services (rcm-core, remittance).
- k6 load + chaos tests validating REST/gRPC timeout propagation, retries, and DLQ processing.

These acceptance criteria remain roadmap-oriented and should not be read as completed implementation milestones.
