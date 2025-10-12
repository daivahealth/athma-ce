# ADR-0003: Multi-Tenancy — Row-Level Security (RLS) in a Shared Cluster

- **Status**: Accepted
- **Date**: 2025-09-29
- **Owners**: Architecture Team
- **Related**: ADR-0001 (Language Split), ADR-0002 (Comms)

## 1) Decision
Adopt **row-level multi-tenancy** in PostgreSQL with **RLS** enforced on all tables using a `tenant_id` column. The shared cluster described below remains the **Foundation master data store**, while domain services provision their own Postgres databases (see ADR-0013) and apply the same RLS pattern. For the foundation cluster we continue to operate one logical database per region (UAE) with:
- **Shared schema** for all tenants
- **RLS policies** for SELECT/INSERT/UPDATE/DELETE
- **Service roles** that bypass RLS only for maintenance/ETL jobs
- **Partitioning** (by month and/or `tenant_id`) on high-volume tables (claims, remittances, events)

## 2) Drivers
- **Operational simplicity** for 100–500+ clinics: single migration path, one schema to maintain.
- **Connection pooling** efficiency (PgBouncer) vs many schemas/DBs.
- **Analytics**: easier cross-tenant reporting/benchmarks (with strict access controls).
- **Cost**: fewer DB instances; better hardware utilization.

## 3) Scope
- Foundation master data (tenants, facilities, departments, staff, specialties, RBAC, reference catalogs).
- Domain services (Patients, Scheduling, Encounters/EHR, Billing/RCM, etc.) must mirror this RLS pattern in their dedicated databases but manage their own schemas and partitions (see ADR-0013).

## 4) Non-Goals
- Not offering per-tenant dedicated DB by default. (Premium tier may add “isolated cluster” later.)
- Not covering multi-region active-active (future ADR).

## 5) Security Posture
- **RLS** enabled with `USING (tenant_id = current_setting('app.tenant_id')::text)`.
- App sets `app.tenant_id` at session via auth middleware; service accounts audited.
- **Column encryption** (pgcrypto or app-level envelope) for high-risk PHI (e.g., Emirates ID).
- **Audit**: append-only audit table with tenant scoping; immutable S3 archive.

## 6) Data Management
- **Partitions**: monthly for `claim_headers`, `remittance_headers/lines`, `audit_events`.
- **Indexes**: composite `(tenant_id, status)`, `(tenant_id, payer_id, encounter_date)`.
- **Archival**: move cold partitions to cheaper storage; keep recent 12–24 months hot.
- **Backups**: PITR with WAL; **RPO ≤ 15 min**, **RTO ≤ 1 hr**.

## 7) Performance & Noisy Neighbor
- **Caps**: per-tenant rate limits & queue quotas.
- **Caching**: Redis for code sets/fee schedules to reduce DB churn.
- **Workload isolation**: heavy analytics via read replicas; long queries routed off primary.

## 8) Alternatives Considered

| Model | Pros | Cons | Verdict |
|---|---|---|---|
| **Schema-per-tenant** | Strong isolation, easy export | Migration complexity ×N, pool fragmentation | ❌ |
| **DB-per-tenant** | Max isolation, legal clarity | High cost/ops, limited pooling, migration pain | ❌ |
| **RLS (chosen)** | Simple ops, pooled perf, shared schema | Requires strict policy discipline; noisy neighbor risk | ✅ |
| **Hybrid per-domain DBs** | Service isolation, tailored scaling | Requires contracts/events, analytics stitching | ✅ (per ADR-0013) |

## 9) Risks & Mitigations
- **Misconfigured RLS** → Security tests in CI; `FORCE RLS`; deny by default.
- **Tenant hotspots** → Per-tenant quotas, HPA on workers, partition pruning.
- **Cross-tenant analytics leakage** → Dedicated analytics role with view-level masking; data exports anonymized.

## 10) Residency & Sharding
- **Primary residency**: UAE region cluster(s).
- If large enterprise tenants require isolation, offer **“isolated shard”**: separate DB cluster with the same schema + RLS.
- Tenants mapped to shards via a routing table; application uses shard key at auth time.

## 11) Acceptance Criteria
- RLS policies applied and tested on a representative set of tables.
- PgBouncer in transaction mode; max connections on Postgres < 25% of headroom.
- Partitioned tables with pruning verified; nightly vacuum/analyze plan in place.
