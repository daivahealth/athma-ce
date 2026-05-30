# athma-ce Seed Data (Domain-aware)

This directory contains SQL fixtures for populating the four athma-ce domain databases. The seeds are split to mirror the architecture described in ADR-0013:

| Domain | Database | Purpose |
| --- | --- | --- |
| Foundation | `zeal_foundation` | Tenants, facilities, RBAC, catalogs |
| Clinical | `zeal_clinical` | Sample patients, clinical catalogs, CBC lab templates, and seeded narrative histopathology catalog rows |
| Revenue Cycle | `zeal_rcm` | Payers / financial reference data |
| Analytics | `zeal_analytics` | Audit and HIE health samples |

## Prerequisites
1. Postgres container running (`docker-compose up -d postgres`).
2. Env vars set (`FOUNDATION_DATABASE_URL`, `CLINICAL_DATABASE_URL`, `RCM_DATABASE_URL`, `ANALYTICS_DATABASE_URL`).
3. Prisma schemas applied to each domain (`npx prisma db push` per package).

## Seeding Workflow

```
cd seed
./run-seeds.sh foundation   # master data & RBAC
./run-seeds.sh clinical     # sample patients, clinical catalogs, CBC lab templates, and narrative histopathology rows
./run-seeds.sh rcm          # optional payer data
./run-seeds.sh analytics    # optional audit data
```

The script lists each SQL file as it streams it into the `zeal-postgres` container. Re-run the same command to reapply seeds; for destructive re-seeds, drop/truncate tables first.

## Scripts
- `run-seeds.sh` – orchestrates seed execution per domain (see `00-seed-execution-guide.md`).
- `seed-facility-hierarchy.sh` – loads demo facility hierarchy into `zeal_foundation` for walkthroughs.

## SQL Files
- **Foundation**: `01-tenants.sql` … `98-hie-data-mappings.sql` (see guide for full list).
- **Clinical**: setup helpers, sample patients, clinical catalogs, CBC observation/result template seed using flat CBC rows plus a grouped `Differential Count`, seeded `lab_test_master.report_style` / `lab_discipline` values including a narrative `Histopathology Examination` test, idempotent lab-test TAT defaults for seeded masters, oncology and OT fixtures.
- **RCM**: `17-payers.sql`.
- **Analytics**: `100-hie-sync-logs.sql`, `101-hie-platform-health.sql`.

## Verification
After seeding, spot-check counts in pgAdmin or using `node test-connection.js`. Example queries:

```sql
-- Foundation
SELECT COUNT(*) FROM tenants;
SELECT COUNT(*) FROM facilities;
SELECT COUNT(*) FROM staff;

-- Clinical
SELECT COUNT(*) FROM patients;
SELECT COUNT(*) FROM observation_code_catalog;
SELECT COUNT(*) FROM lab_test_result_templates;

-- RCM
SELECT COUNT(*) FROM payers;

-- Analytics
SELECT COUNT(*) FROM audit.audit_log;
```

## Notes
- Seed data is **development/demo only**—replace credentials and PHI before production use.
- UUIDs are fixed so relationships remain consistent across environments.
- Monetary values and examples use AED and UAE regulatory authorities.
- Update this directory when new domain tables are introduced to keep seeds in sync.
