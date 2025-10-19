# Service ↔ Database Interaction Map

## Purpose
This document captures how Zeal's core services interact with persistence layers across the platform. It highlights the domain boundaries, summarizes data ownership, and visualizes synchronous and asynchronous flows so teams can evaluate cross-service dependencies quickly.

## Domain Boundaries
- **Foundation**: Auth, tenant/org, and catalog capabilities backed by `DB-FOUNDATION`; shared identity and reference data lives here with role-based access controls.
- **Clinical**: Patient, scheduling, encounter, and care plan services backed by `DB-CLINICAL`; row-level security (RLS) protects PHI.
- **Revenue Cycle (RCM)**: Billing, claims, eligibility, accounts receivable, and pharmacy services backed by `DB-RCM`; financial artifacts snapshot catalog references for auditability.
- **Analytics & Audit**: Audit, reporting, and ML services backed by `DB-ANALYTICS`; downstream stores receive CDC/ETL streams.
- **Shared Infrastructure**: Event bus, cache, secret manager, and observability tooling reused by services across domains.

## Service ↔ Database Map
The diagram below shows how client-facing channels reach backend services, which in turn interact with their respective domain databases and shared infrastructure. Cross-domain reads occur through service APIs rather than SQL joins to preserve ownership boundaries.

```mermaid
flowchart LR
  subgraph Clients
    W[Web App (Clinicians/Front Office)]
    B[Backoffice Admin]
    P[Public APIs / Partners]
  end

  subgraph Edge
    GW[API Gateway / Ingress]
    BFF[BFF / GraphQL Router]
  end

  Clients --> GW --> BFF

  %% Foundation
  subgraph DBF[DB-FOUNDATION]
    TBL1[(tenants\\nusers/roles\\nlocations/facilities/departments/spaces\\nstaff/staff_licenses\\nspecialties/value_sets\\ncatalogs: drugs/investigations(+translations)\\npost_offices)]
  end
  subgraph S1[Foundation Services]
    AUTH[Auth Service]
    ORG[Tenant & Org Service]
    CAT[Catalog Service]
  end
  BFF --> AUTH
  BFF --> ORG
  BFF --> CAT
  AUTH --- DBF
  ORG  --- DBF
  CAT  --- DBF

  %% Clinical
  subgraph DBC[DB-CLINICAL]
    TBL2[(patients\\npolicies/consents\\nappointments\\nencounters/notes/vitals\\norders (lab/rad/Rx)\\ncare_plans)]
  end
  subgraph S2[Clinical Services]
    PAT[Patient Service]
    SCHED[Scheduling Service]
    ENC[Encounter Service]
    CARE[Care Plan Service]
  end
  BFF --> PAT
  BFF --> SCHED
  BFF --> ENC
  BFF --> CARE
  PAT --- DBC
  SCHED --- DBC
  ENC --- DBC
  CARE --- DBC

  %% RCM
  subgraph DBR[DB-RCM]
    TBL3[(payers/fee_schedules\\nsuperbills/items\\nclaims/lines (partitioned)\\nremittances/lines (partitioned)\\neligibility/preauth/policy_benefits\\npatient_payments\\npharmacy_orders\\npharmacy_inventory/transactions\\ncost_estimates)]
  end
  subgraph S3[RCM Services]
    BILL[Billing Service]
    CLAIM[Claims Service]
    ELIG[Eligibility & Preauth Service]
    AR[AR/Finance Service]
    PHARM[Pharmacy Service]
  end
  BFF --> BILL
  BFF --> CLAIM
  BFF --> ELIG
  BFF --> AR
  BFF --> PHARM
  BILL --- DBR
  CLAIM --- DBR
  ELIG --- DBR
  AR --- DBR
  PHARM --- DBR

  %% Analytics & Audit
  subgraph DBA[DB-ANALYTICS]
    TBL4[(audit_logs/security_events/api_requests\\nusage_events\\nfacts/dimensions for BI)]
  end
  subgraph S4[Analytics Services]
    AUD[Audit Service]
    RPT[Reporting/BI Service]
    ML[ML/Insights Service]
  end
  AUD --- DBA
  RPT --- DBA
  ML --- DBA

  %% Cross-service infra
  subgraph Infra[Shared Infra]
    BUS[(Event Bus / Kafka)]
    CACHE[(Cache / Redis)]
    SECRETS[(Secret Manager)]
    OBS[(Metrics/Logs/Tracing)]
  end

  %% Event flows
  ENC -- emits events --> BUS
  PHARM -- emits events --> BUS
  BILL  -- emits events --> BUS
  CLAIM -- emits events --> BUS
  AUD   -- consumes --> BUS
  RPT   -- ETL/CDC --> DBA

  %% Catalog lookups (read)
  ENC -.-> CAT
  PHARM -.-> CAT
  BILL -.-> CAT

  %% Cache hits
  ENC -. cache .-> CACHE
  CAT -. cache .-> CACHE
  BILL -. cache .-> CACHE
```

### Interaction Notes
- Client traffic terminates at the API gateway/BFF, which orchestrates calls to downstream services within their domain boundaries.
- Foundation services centralize identity, tenancy, and reference catalogs to support other domains; catalog reads are cached and versioned.
- Clinical and RCM domains apply RLS to protect tenant-scoped PHI and financial data; cross-domain workflows happen via service APIs and the event bus.
- Analytics consumers ingest events from the bus and CDC pipelines rather than querying operational stores directly.

```mermaid
flowchart LR
  A[Service]:::svc --- B[(Database)]:::db
  C((Cache / Bus)):::infra

  classDef svc fill:#eef,stroke:#447
  classDef db fill:#efe,stroke:#484
  classDef infra fill:#ffe,stroke:#aa6
```

## Cross-Domain Flow: Encounter → Superbill → Claim
The sequence below traces how a clinician finalizing an encounter triggers billing and claims creation, with audit events emitted along the way.

```mermaid
sequenceDiagram
  participant UI as Clinician UI
  participant ENC as Encounter Service (DB-CLINICAL)
  participant CAT as Catalog Service (DB-FOUNDATION)
  participant BILL as Billing Service (DB-RCM)
  participant CLAIM as Claims Service (DB-RCM)
  participant AUD as Audit Service (DB-ANALYTICS)

  UI->>ENC: Close encounter + finalize orders (lab/rad/Rx)
  ENC->>CAT: Fetch drug/investigation details (EN/AR, codes)
  CAT-->>ENC: Catalog item + codes (validated)
  ENC->>BILL: Create Superbills + Items (snapshotted names/codes/prices)
  BILL->>CLAIM: Generate Claim (header + lines)
  CLAIM-->>UI: Claim# + status=PENDING
  ENC-->>AUD: Emit audit event (encounter_finalized)
  BILL-->>AUD: Emit audit event (superbill_created)
  CLAIM-->>AUD: Emit audit event (claim_created)
```

## Implementation Considerations
- Enforce RLS in Clinical and RCM databases; rely on role-based access in Foundation and Analytics.
- Persist reference IDs (e.g., `drug_ref_id`) alongside human-readable snapshots to satisfy auditability and downstream legal requirements.
- Use the event bus to orchestrate multi-domain workflows (Saga-style) and keep services decoupled.
- Cache catalog, value sets, and payer rules with ETags or version stamps to minimize load on Foundation services.
- Stream operational data from Clinical and RCM into Analytics via CDC/ETL and partition high-volume tables such as audit logs and claim facts.

## Communication Playbook

### Synchronous Request/Response
- Use when the caller must render or validate immediately (for example, "create superbill from encounter").
- Edge traffic flows over REST via the API Gateway/BFF; internal service-to-service calls prefer gRPC (schema contracts, lower latency) with REST as a fallback.
- Apply tight timeouts (300–1000 ms), retries only on idempotent GET/PUT, and circuit breakers that open after repeated failures (e.g., five) with 30 s half-open probes.
- Propagate authentication and tenancy by forwarding the JWT, `X-Tenant-Id`, and request context headers.
- NestJS tip: use `axios` (REST) or `@grpc/grpc-js` (gRPC) with `timeout`, `maxRedirects: 0`, `validateStatus`, and a narrow retry handler (e.g., `ECONNRESET`).

```http
POST /api/v1/billing/superbills
Authorization: Bearer <JWT>
X-Tenant-Id: 1111...
X-Idempotency-Key: enc-5f3e-...
Content-Type: application/json

{
  "encounterId": "e-123",
  "charges": [ ... ],
  "currency": "AED"
}
```

A `201 Created` returns the superbill payload; reuse of the same idempotency key yields `409 Conflict` without duplicating state.

### Asynchronous Event-Driven Flows
- Use for cross-DB workflows, fan-out, and work the user does not need to wait on (claims generation, remittance posting, analytics updates).
- Kafka (or NATS JetStream) provides durable topics, replay, and consumer groups aligned with service domains.
- Implement the Outbox pattern per service database: write domain changes and outbox records in one transaction, stream the outbox table, publish to the bus, then mark sent.
- Emit at-least-once domain events with rich context so downstream consumers stay idempotent by tracking `eventId`.

```json
{
  "eventId": "01HF...",
  "type": "EncounterFinalized",
  "occurredAt": "2025-10-16T10:15:00Z",
  "tenantId": "1111-...",
  "actor": {"userId": "2222-..."},
  "data": {
    "encounterId": "e-123",
    "primaryStaffId": "s-456",
    "diagnoses": [{"code": "J06.9", "system": "ICD-10"}],
    "procedures": [{"code": "99213", "system": "CPT"}]
  }
}
```

### Path Selection Guide

| Call | Path | Rationale |
| --- | --- | --- |
| UI → Auth | Sync REST | Tokens required immediately |
| Encounter → Catalog lookup | Sync | Data needed for validation/display |
| Encounter → Create Superbills | Sync for acknowledgement + async event | UI needs confirmation; downstream claim can fan out |
| Superbill → Generate Claim | Sync for draft or async batch | Depends on real-time vs scheduled submission |
| Remittance ingestion | Async | File/stream driven with multiple consumers |
| Pharmacy dispense → Inventory txn | Sync for stock write + async event | Inventory must commit before notifying others |

### Request Context Propagation
- Include `Authorization`, `X-Tenant-Id`, `X-User-Id`, `X-Roles`, `X-Request-Id`, and `X-Idempotency-Key` (for POST) on every internal call.
- Global middleware seeds `AsyncLocalStorage` with the decoded JWT and request metadata.
- Each request sets Postgres session settings so RLS and audit triggers operate automatically:

```sql
select set_config('app.current_tenant_id', :tenantId, true);
select set_config('app.current_user_id', :userId, true);
select set_config('app.user_agent', :userAgent, true);
```

### Failure & Resilience Checklist
- Timeouts: Gateway 2–3 s, BFF → service 1 s, service → service 300–800 ms.
- Bulkheads: isolate Clinical vs RCM workloads on separate pools/nodes to avoid noisy neighbors.
- Circuit breakers: leverage `opossum` in Nest or mesh policies (Istio/Linkerd) for consistent limits.
- Idempotency: accept `X-Idempotency-Key` on all POST mutations and record `(tenantId, key)` to short-circuit retries.
- Contracts & versioning: maintain gRPC proto/OpenAPI specs, generate TypeScript clients, and evolve APIs via additive `/api/v1/...` fields.
- Observability: propagate `traceparent`, log request outcomes, and expose RED (Rate, Errors, Duration) metrics per endpoint.

### Stack Recommendation
- Edge: API Gateway (NGINX/Envoy) → channel-specific BFFs (NestJS).
- Internal sync: gRPC between domain services (Clinical, RCM, Catalog, Auth) while keeping REST for public/admin APIs.
- Async: Kafka or NATS JetStream plus service-local Outbox tables in Clinical and RCM databases.
- Key RPC contracts: Catalog (`GetDrugById`, `SearchInvestigations`), Billing (`CreateSuperbill`, `PriceSuperbill`), Claims (`GenerateClaimDraft`, `SubmitClaim`), Pharmacy (`Dispense`, `AdjustInventory`).

### Hybrid Flow Example
1. UI finalizes an encounter via the Encounter Service (sync).
2. Encounter Service queries Catalog synchronously for code validation, writes encounter data, and records an outbox entry.
3. Outbox worker publishes `EncounterFinalized` to Kafka.
4. Billing Service consumes, creates superbills idempotently, and emits `SuperbillCreated`.
5. UI polls or receives a websocket notifying the superbill is ready; clinician triggers "Generate Claim" which calls the Claims Service synchronously.
6. Claims Service finalizes the claim, emits `ClaimCreated`, and Audit/Analytics consume the event for downstream reporting.

## Optional Extensions
If helpful, we can add endpoint groupings (for example, `/api/v1/claims/**`, `/api/v1/catalog/**`) and team ownership overlays to this document.
