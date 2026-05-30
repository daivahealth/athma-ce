# Seed Execution Guide (Domain Split)

athma-ce now stores data in four domain databases. Use `run-seeds.sh` to apply the relevant SQL fixtures to each domain. Run these seeds **after** Prisma has created the schemas (`npx prisma db push` per domain).

## Quick Summary

| Domain | Database | Command |
| --- | --- | --- |
| Foundation | `zeal_foundation` | `./run-seeds.sh foundation` |
| Clinical | `zeal_clinical` | `./run-seeds.sh clinical` |
| Revenue Cycle | `zeal_rcm` | `./run-seeds.sh rcm` |
| Analytics | `zeal_analytics` | `./run-seeds.sh analytics` |

Each command streams SQL files into the Postgres container (`zeal-postgres`); customise the container or user via the `CONTAINER_NAME` / `DB_USER` env vars.

## File Contents by Domain

### Foundation seeds (master data & RBAC)
```
01-tenants.sql
02-specialties.sql
02-users.sql
03-locations.sql
03-post-offices.sql
04-code-systems.sql
04-facilities.sql
05-concepts.sql
05-spaces.sql
06-equipment.sql
06-value-sets.sql
07-departments.sql
08-wards.sql
09-beds.sql
10-clinics.sql
11-spaces.sql
12-roles.sql
13-permissions.sql
14-role-permissions.sql
15-user-roles.sql
16-user-mfa-settings.sql
17-user-trusted-devices.sql
19-medication-master.sql
20-lab-test-master.sql
21-imaging-study-master.sql
21-staff.sql
22-procedure-master.sql
22-users-with-staff-links.sql
23-staff-specialties.sql
24-additional-facilities.sql
25-multi-facility-staff-specialties.sql
26-roles-updated.sql
27-permissions-updated.sql
28-role-permissions.sql
29-users-with-staff-links.sql
30-user-roles.sql
39-visit-classification-rules.sql
96-translations.sql
97-hie-platforms.sql
98-hie-data-mappings.sql
```

### Clinical seeds
```
00-setup.sql
01-patients.sql
02-valuesets.sql
03-vital-signs-templates.sql
04-medications.sql
05-lab-tests.sql
06-imaging-studies.sql
07-procedures.sql
08-diagnosis-master.sql
09-administrative-services.sql
10-packages.sql
11-discharge-checklist-template.sql
12-more-checklist-templates.sql
13-biomarkers.sql
14-wellness-programs.sql
15-longevity-protocols.sql
16-lifestyle-templates.sql
17-membership-plans.sql
18-pgvector-setup.sql
21-lab-test-result-templates.sql   # CBC analytes + hybrid CBC template (flat CBC rows with grouped Differential Count)
23-oncology-catalogs.sql
24-chemo-protocols.sql
25-ot-room-configs.sql
26-lab-test-tat-backfill.sql      # Idempotent turnaround-time defaults for seeded lab_test_master rows, including histopathology and oncology-related lab masters
27-oncology-lab-tests-backfill.sql # Idempotent oncology-focused lab_test_master rows for existing dev databases
```

### RCM seeds
```
17-payers.sql
```

### Analytics seeds
```
100-hie-sync-logs.sql
101-hie-platform-health.sql
```

## Usage

```bash
cd seed
# Foundation master data
./run-seeds.sh foundation

# Load sample patients
./run-seeds.sh clinical

# Optional payers / analytics
./run-seeds.sh rcm
./run-seeds.sh analytics
```

If any seed fails, the script stops; fix the SQL or database state and rerun the same command. Seeds are idempotent where possible, but re-running may require truncating tables first.

## Verification Queries

After seeding, connect to each domain database and spot-check counts, for example:

```sql
-- Foundation
SELECT COUNT(*) FROM tenants;
SELECT COUNT(*) FROM facilities;
SELECT COUNT(*) FROM staff;
SELECT COUNT(*) FROM roles;

-- Clinical
SELECT COUNT(*) FROM patients;
SELECT COUNT(*) FROM observation_code_catalog;
SELECT COUNT(*) FROM lab_test_result_templates;

-- RCM
SELECT COUNT(*) FROM payers;

-- Analytics
SELECT COUNT(*) FROM audit.audit_log;
```

Refer to `PRISMA-DATABASE-CONFIG.md` for more details on the domain database layout.
