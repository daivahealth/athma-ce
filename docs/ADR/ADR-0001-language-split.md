# ADR-0001: Language Split — Node.js/TypeScript for Transactional APIs; Python for AI/ETL

- **Status**: Accepted
- **Date**: 2025-09-29
- **Owners**: Architecture Team
- **Context**: UAE PMS + RCM SaaS, scaling to ~500 clinics

## 1. Decision
Adopt a **dual-language architecture**:
- **Node.js + TypeScript** (NestJS/Fastify) for **transactional, I/O-heavy services**:
  - api-gateway, auth, PMS core (patients, appointments, encounters, notes, eRx),
  - billing & coding (superbill, charge capture),
  - RCM core (eligibility, prior auth, claims),
  - remittance & reconciliation,
  - connectors to DHA eClaimLink / DOH Shafafiya / clearinghouses,
  - rules engine runtime, notifications.
- **Python** (FastAPI/uvicorn + workers) for **AI, data, and CPU-bound jobs**:
  - note-drafter, coder (ICD/CPT/modifiers), anomaly/denial prediction,
  - OCR/EOB parsing (doc-AI),
  - batch ETL/analytics, model training/inference pipelines.

**Inter-service contracts**:
- Synchronous: **HTTP/REST** with OpenAPI (shared types), **idempotency** on write endpoints.
- Asynchronous: **events/queues** (Kafka/RabbitMQ) for long-running flows (submission → status, ERA/RA ingest, reconciliation).
- **Shared schemas**: `@contracts` (Zod/OpenAPI) for TS; Pydantic v2 models mirror for Python. Versioned via semver.

## 2. Drivers
- **Team productivity & type safety** with React/TS frontends + shared DTOs.
- **High concurrency** & low overhead for I/O-bound workloads (payer APIs, DB).
- **Best-in-class AI/ML tooling** (PyTorch/NumPy/Pandas, OCR libs).
- **Operational separation of concerns**: API autoscaling ≠ model latency tuning.

## 3. Scope
- Applies to all net-new backend services for PMS+RCM.
- Does not prescribe cloud vendor (cloud-agnostic); aligns with UAE data residency.

## 4. Non-Goals
- Not choosing a single language for the entire stack.
- Not fixing a specific message bus vendor (Kafka vs RabbitMQ left to ADR-0002).
- Not mandating on-prem vs hosted LLMs (handled in AI ADR).

## 5. Options Considered

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Node.js/TS for all** | One stack; shared types; good I/O perf | Weak ML/AI ecosystem; Python interop still needed | ❌ |
| **Python for all** | Strong ML; unified tooling | Weaker type-sharing with React; higher memory per conn; Prisma loss | ❌ |
| **Go for all** | Excellent perf; small binaries | Team ramp-up; less ergonomic web framework & ORMs for our needs | ❌ |
| **.NET/JVM** | Mature, great tooling | Hiring/ramp mismatch; heavier runtime for small services | ❌ |
| **Split: Node for APIs, Python for AI/ETL** | Best-of-both; team fit; cost & throughput | Two build pipelines; contract discipline required | ✅ **Chosen** |

## 6. Expected Capacity (Planning)
Assumptions for 500 clinics:
- ~1,000 concurrent users at peak; ~6,000 rpm (~100 RPS total).
- **Node API pod (2 vCPU, 3–4 GB)** with Fastify ≈ **50–150 RPS** I/O-heavy.
- Run **4–6 pods per critical service** behind HPA; external bottlenecks (DB, payers) gated by queues and caches.

## 7. Architecture Implications
- **DB**: PostgreSQL 16 with RLS (multi-tenant), PgBouncer pooling, hot indexes; time/tenant partitioning on large tables (claims, remittances).
- **Caching**: Redis for code sets, fee schedules, auth sessions (short TTL).
- **Queues**: RabbitMQ/Kafka for connectors (retry/backoff/DLQ, idempotency keys).
- **Schemas**: Single source of truth in `@contracts` (OpenAPI + Zod); generate Python Pydantic models from OpenAPI to avoid drift.
- **Testing**: Contract tests (Dredd/Prism), load tests (k6), async saga tests for RA ingestion & reconciliation.

## 8. Security & Compliance
- **Auth**: Argon2id, JWT 15m + refresh rotation; SCIM/SSO-ready.
- **Data**: RLS per tenant; field encryption for high-risk PHI; TLS 1.2+; secrets in KMS.
- **Privacy**: PDPL/GDPR DSAR workflows; PHI redaction in logs; data residency (UAE region).
- **Supply chain**: SAST/SCA in CI; SBOM (CycloneDX); ZAP baseline DAST on web.

## 9. Observability
- **OpenTelemetry** traces across API→connector→DB/queue; propagate `trace_id`.
- Prometheus RED metrics; Grafana SLO burn-rate alerts.
- Structured logs (JSON) with `tenant_id`, `claim_no`, correlation IDs (PII-safe).

## 10. Rollout Plan
1. **MVP** services in Node: auth, PMS core (patients/appointments), RCM core (eligibility, validate).
2. Add Python **AI sidecars** (note-drafter, coder) behind feature flags (shadow → suggest → assist).
3. Introduce queues for connectors; enforce idempotency keys; add DLQ dashboards.
4. Expand to remittance ingestion & reconciliation; add underpayment detection.
5. Scale out read replicas/analytics marts; enable autoscaling playbooks.

## 11. Risks & Mitigations
- **Schema drift (TS ↔ Python)** → Generate Pydantic from OpenAPI; CI contract tests.
- **Operational complexity (two stacks)** → Platform templates; golden Docker images; shared Helm/IaC.
- **Hot spots in Postgres** → Partitioning, targeted indexes, async workflows to smooth spikes.
- **Third-party slowness** (payer APIs) → Circuit breakers, backoff, bulkheads via queues.

## 12. Cost Notes
- Node API pods are memory-light; Python workers scale by queue depth and model latency.
- GPU/CPU segregation for AI inference; spot/training pools separated from prod APIs.

## 13. Triggers to Revisit
- Throughput consistently > 500 RPS per service with CPU saturation.
- Team composition shifts (Python-only or Go-heavy).
- Requirement for binary plugins/shared memory that favors a single runtime.
- Move to gRPC-only mesh or strict event-sourcing (may tilt language choices).

## 14. Acceptance Criteria
- Contracts package published; Python clients generated from the same OpenAPI.
- End-to-end booking→encounter→claim→remittance flow proven with mixed Node/Python.
- SLOs defined and met under 2× expected peak in load tests.
- Security checklist (ASVS) phase-1 controls implemented and passing in CI.
