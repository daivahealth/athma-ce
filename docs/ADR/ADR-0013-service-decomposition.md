# ADR-0013: Domain Service Decomposition & Database Strategy

- **Status**: Proposed
- **Date**: 2025-10-06
- **Authors**: Platform Architecture
- **Related**: ADR-0001 (Language Split), ADR-0003 (Multi-Tenancy), ADR-0010 (Data Architecture)

## 1) Decision

Establish **four PostgreSQL databases** that align with athma-ce's major domains, reducing operational overhead while retaining isolation:

1. **DB-Foundation** – tenancy, identity, RBAC, organisational hierarchy, and shared catalogs (multi-language). This retains the shared cluster from ADR-0003 and remains the source of truth for reference data.
2. **DB-Clinical** – patient PHI, scheduling, encounters/EHR, clinical notes, vitals, care plans, and orders/results. Tuned for low-latency OLTP.
3. **DB-RCM** – billing/RCM, pharmacy inventory & dispensing, eligibility, pre-auth, claims, remittances, payments, fee schedules.
4. **DB-Analytics** – append-only audit logs, usage metrics, curated aggregates feeding BI/ML pipelines (may later move to a warehouse).

Services are grouped accordingly:
- **Foundation Services** (Auth, Tenant/Org, Catalog) read/write DB-Foundation.
- **Clinical Services** (Patient, Scheduling, Encounter, Care Plan) operate on DB-Clinical while referencing DB-Foundation for master data.
- **RCM Services** (Billing, Claims, Pharmacy, Finance) own DB-RCM but consult Foundation for tenants/staff catalogs.
- **Analytics Services** (Audit, Reporting, Insights) consume DB-Analytics and warehouse outputs.

Data contracts are published via `@zeal/contracts`; cross-domain workflows use REST (ADR-0002) and events. Direct SQL joins across databases are prohibited; data sharing occurs through service APIs/events or CDC feeds.

## 2) Drivers

- **Operational simplicity**: Four databases are manageable for the platform team while still providing domain isolation.
- **Performance**: Clinical workloads (low latency) and RCM workloads (batch) are separated so spikes do not interfere.
- **Compliance**: PHI resides only in DB-Clinical and DB-RCM; catalogs remain in DB-Foundation. Analytics/audit data is isolated for long-term retention.
- **Scalability**: Each database can be tuned and scaled independently (read replicas, partitioning) without coupling all tenants.

## 3) Scope

- All existing services must migrate to one of the four databases; new services must declare their home database during design.
- Foundation remains the source of truth for tenancy, staff, RBAC, and catalogs; other databases reference it via IDs/events.
- Warehouse/BI tooling consumes CDC streams primarily from DB-Clinical and DB-RCM into DB-Analytics or external systems.

## 4) Non-Goals

- Does not prescribe tenant-per-database sharding (still a future option).
- Does not define warehouse technology (handled in ADR-0010 updates).
- Does not change the language split from ADR-0001.

## 5) Options Considered

| Option | Pros | Cons | Verdict |
| --- | --- | --- | --- |
| **Single Foundation monolith + DB** | Simpler operations, transactional joins | High blast radius; limited scalability; harder to enforce domain ownership | ❌ |
| **Per-domain services sharing single DB** | Domain deploy independence; simple reporting | Shared DB still bottleneck; migration risk remains | ❌ |
| **Four-database topology (chosen)** | Balance between isolation & manageability; aligns with domain boundaries; clear PHI zones | Requires coordination across services; cross-db transactions unavailable | ✅ |

## 6) Implementation Plan

1. **Phase 1 – DB Provisioning**
   - Instantiate four managed Postgres clusters (Foundation, Clinical, RCM, Analytics) with RLS templates.
   - Update infrastructure-as-code (ADR-0008) to treat each database as a first-class resource.
2. **Phase 2 – Service Alignment**
   - Migrate existing tables into their target database (patients/appointments/encounters to Clinical; claims/billing/pharmacy to RCM; audit logs to Analytics).
   - Adjust Prisma clients / connection strings per service.
   - Expand `@zeal/contracts` to include any new DTOs required for cross-database interactions.
3. **Phase 3 – CDC & Analytics**
   - Configure CDC pipelines from Clinical & RCM into Analytics warehouse feeds (ADR-0010 follow-up).
   - Implement data quality monitoring for cross-database event flows.
4. **Phase 4 – Optimisation**
   - Introduce read replicas/partitioning per database based on workload.
   - Evaluate service-level autoscaling and failure domains (multi-region, blue/green).

## 7) Consequences

- **Operational Complexity**: Four databases are manageable but still require IaC, monitoring, and backup automation.
- **Consistency Model**: Cross-database transactions are unavailable; services must rely on events/sagas.
- **Analytics**: Data warehouse becomes the integration layer; Analytics DB should be treated as append-only.
- **Team Structure**: Encourages domain squads with clear ownership per database.

## 8) Risk & Mitigations

- **Eventual Consistency Bugs** → Establish clear event schemas, idempotent handlers, contract testing.
- **Schema Drift** → Use `@zeal/contracts`, OpenAPI generation, and automated validation across services.
- **Operational Overhead** → Platform team to provide service templates, shared CI/CD, and managed database provisioning.
- **Analytics Lag** → Ensure CDC jobs are monitored; fail open with alerts for BI stakeholders.

## 9) Follow-Up ADRs

- Update ADR-0010 (Data Architecture) with warehouse/CDC details.
- Draft service-specific ADRs (Patient, Scheduling, etc.) as they are implemented.
- Extend ADR-0008 (Deployment Infrastructure) to cover multi-database provisioning strategy.
