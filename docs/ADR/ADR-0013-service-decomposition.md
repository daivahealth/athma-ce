# ADR-0013: Domain Service Decomposition & Database Strategy

- **Status**: Proposed
- **Date**: 2025-10-06
- **Authors**: Platform Architecture
- **Related**: ADR-0001 (Language Split), ADR-0003 (Multi-Tenancy), ADR-0010 (Data Architecture)

## 1) Decision

Adopt a **hybrid service + database topology**:

1. Keep the existing **Foundation service** focused on multi-tenant master data (tenants, facilities, staff, RBAC, reference catalogs) backed by the shared Postgres cluster defined in ADR-0003.
2. Introduce distinct **domain services**, each with its own Postgres database (or schema-level isolation at minimum) tuned to its workload:
   - **Patient Service** – demographics, consents, insurance cards.
   - **Scheduling Service** – provider availability, slots, appointments.
   - **Encounter/EHR Service** – clinical notes, orders, results, attachments.
   - **Billing/RCM Service** – payer plans, eligibility, claims, remittance, payments.
   - Optional future domains (Care Management, Analytics, Integrations) follow the same pattern.
3. Share contracts through `@zeal/contracts` and exchange data via synchronous REST (ADR-0002) and domain events; avoid cross-database joins.
4. Feed analytics/reporting via CDC or event streams into a warehouse to preserve enterprise-wide visibility.

## 2) Drivers

- **Scale**: 1,000+ clinics/hospitals will create high concurrency on scheduling and encounters. Independent services and databases scale horizontally without one hot spot throttling others.
- **Isolation**: Faults or schema migrations in billing should not impact patient onboarding or scheduling; per-domain databases shrink blast radius.
- **Team Autonomy**: Separate deployments unblock parallel workstreams while matching ADR-0001 (modular NestJS services).
- **Compliance**: Easier to enforce least privilege and auditing per domain; roles in RBAC can map to service scopes.

## 3) Scope

- Applies to all new backend capabilities beyond master data.
- Foundation retains ownership of reference entities but delegates operational records to domain services.
- Shared libraries (`@zeal/shared-utils`, `@zeal/shared-database`, `@zeal/contracts`) remain the common toolkit.

## 4) Non-Goals

- Does not mandate a specific cloud vendor or managed Postgres flavor.
- Does not detail data warehouse implementation (covered in ADR-0010 future revisions).
- No changes to language split (Node for transactional APIs, Python for AI) beyond reinforcing service boundaries.

## 5) Options Considered

| Option | Pros | Cons | Verdict |
| --- | --- | --- | --- |
| **Single Foundation monolith + DB** | Simpler operations, transactional joins | High blast radius; limited scalability; harder to enforce domain ownership | ❌ |
| **Per-domain services sharing single DB** | Domain deploy independence; simple reporting | Shared DB still bottleneck; migration risk remains | ❌ |
| **Hybrid: foundation + per-domain DBs (chosen)** | Scalability, isolation, ADR-aligned | Requires contracts/events, CDC for analytics, more infra | ✅ |

## 6) Implementation Plan

1. **Phase 1 (Immediate)**
   - Finalize Foundation API surface for existing master data.
   - Expand `@zeal/contracts` to include DTOs for patients, appointments, encounters, billing.
2. **Phase 2 (Short-Term)**
   - Stand up Patient Service and Scheduling Service with dedicated Postgres instances (RLS-enabled similar to ADR-0003).
   - Seed data via Foundation APIs and domain-specific migrations.
   - Introduce domain events (e.g., `tenant.created`, `staff.added`) for downstream sync.
3. **Phase 3 (Mid-Term)**
   - Launch Encounter/EHR Service and Billing/RCM Service, each with own DB and service layer.
   - Add Kafka/RabbitMQ-based CDC or event sourcing for analytics/warehouse ingestion.
4. **Phase 4 (Long-Term)**
   - Review performance metrics; shard heavy services (e.g., Scheduling) by tenant clusters if needed.
   - Harden multi-region rollout; apply blue/green strategies per service.

## 7) Consequences

- **Operational Complexity**: More services and databases to provision, monitor, and secure; requires platform automation (Terraform, pipelines) and consistent observability.
- **Consistency Model**: Cross-domain workflows become eventually consistent; teams must design sagas and compensating actions.
- **Analytics**: Central reporting moves to warehouse layer; direct SQL across domains is discouraged.
- **Team Structure**: Enables domain-aligned squads (Scheduling, Billing, etc.) with independent release cadence.

## 8) Risk & Mitigations

- **Eventual Consistency Bugs** → Establish clear event schemas, idempotent handlers, contract testing.
- **Schema Drift** → Use `@zeal/contracts`, OpenAPI generation, and automated validation across services.
- **Operational Overhead** → Platform team to provide service templates, shared CI/CD, and managed database provisioning.

## 9) Follow-Up ADRs

- Update ADR-0010 (Data Architecture) with warehouse/CDC details.
- Draft service-specific ADRs (Patient, Scheduling, etc.) as they are implemented.
- Extend ADR-0008 (Deployment Infrastructure) to cover multi-database provisioning strategy.

