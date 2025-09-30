# Seed Data Execution Guide

## Overview
This guide outlines the execution sequence for seeding the Zeal database with initial data. Files must be executed in the order specified to respect foreign key dependencies.

## Execution Sequence

### Phase 1: Foundation Data (No Dependencies)
```bash
# 1. Tenants
psql -f 01-tenants.sql

# 2. Global Reference Data
psql -f 02-specialties.sql
psql -f 03-post-offices.sql
psql -f 04-code-systems.sql
psql -f 05-concepts.sql
psql -f 06-value-sets.sql
```

### Phase 2: Organizational Structure (Depends on Phase 1)
```bash
# 7. Users & Locations
psql -f 07-users.sql
psql -f 08-locations.sql
psql -f 09-facilities.sql
psql -f 10-spaces.sql
psql -f 11-equipment.sql
```

### Phase 3: Healthcare Providers (Depends on Phase 2)
```bash
# 12. Staff & Specialties
psql -f 12-staff.sql
psql -f 13-staff-specialties.sql
psql -f 14-staff-licenses.sql
psql -f 15-staff-schedules.sql
psql -f 16-equipment-schedules.sql
```

### Phase 4: Payers & Financial Setup (Depends on Phase 1)
```bash
# 17. Payers & Fee Schedules
psql -f 17-payers.sql
psql -f 18-fee-schedules.sql
psql -f 19-codesets.sql
```

### Phase 4.5: Master Reference Tables (Depends on Phase 1)
```bash
# 19. Master Reference Data
psql -f 19-medication-master.sql
psql -f 20-lab-test-master.sql
psql -f 21-imaging-study-master.sql
psql -f 22-procedure-master.sql
```

### Phase 5: Patients (Depends on Phase 1)
```bash
# 23. Patients & Policies
psql -f 23-patients.sql
psql -f 24-policies.sql
psql -f 25-policy-benefits.sql
```

### Phase 6: Clinical Operations (Depends on Phases 3, 5)
```bash
# 26. Appointments & Encounters
psql -f 26-episodes.sql
psql -f 27-appointments.sql
psql -f 28-appointment-resources.sql
psql -f 29-encounters.sql
psql -f 30-encounter-links.sql
```

### Phase 7: Clinical Documentation (Depends on Phase 6)
```bash
# 31. Clinical Notes & Orders
psql -f 31-clinical-notes.sql
psql -f 32-orders.sql
psql -f 33-prescriptions.sql
psql -f 34-documents.sql
```

### Phase 8: Billing & RCM (Depends on Phase 6, 7)
```bash
# 35. Superbills & Claims
psql -f 35-superbills.sql
psql -f 36-superbill-items.sql
psql -f 37-claim-headers.sql
psql -f 38-claim-lines.sql
```

### Phase 9: Payments & Reconciliation (Depends on Phase 8)
```bash
# 39. Payments & Remittances
psql -f 39-patient-payments.sql
psql -f 40-remittance-headers.sql
psql -f 41-remittance-lines.sql
```

### Phase 10: Configuration & Rules (Depends on Phase 1-4)
```bash
# 42. Business Rules
psql -f 42-visit-classification-rules.sql
psql -f 43-visit-billing-map.sql
psql -f 44-followup-waiver-rules.sql
psql -f 45-visit-type-pricing-rules.sql
```

## Complete Execution Script

```bash
#!/bin/bash
# execute-all-seeds.sh

set -e  # Exit on error

DB_NAME="zeal_db"
DB_USER="zeal_user"
DB_HOST="localhost"
DB_PORT="5432"

echo "Starting seed data execution..."

# Set connection string
export PGPASSWORD="${DB_PASSWORD}"
PSQL_CMD="psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME}"

# Phase 1
echo "Phase 1: Foundation Data..."
${PSQL_CMD} -f 01-tenants.sql
${PSQL_CMD} -f 02-specialties.sql
${PSQL_CMD} -f 03-post-offices.sql
${PSQL_CMD} -f 04-code-systems.sql
${PSQL_CMD} -f 05-concepts.sql
${PSQL_CMD} -f 06-value-sets.sql

# Phase 2
echo "Phase 2: Organizational Structure..."
${PSQL_CMD} -f 07-users.sql
${PSQL_CMD} -f 08-locations.sql
${PSQL_CMD} -f 09-facilities.sql
${PSQL_CMD} -f 10-spaces.sql
${PSQL_CMD} -f 11-equipment.sql

# Phase 3
echo "Phase 3: Healthcare Providers..."
${PSQL_CMD} -f 12-staff.sql
${PSQL_CMD} -f 13-staff-specialties.sql
${PSQL_CMD} -f 14-staff-licenses.sql
${PSQL_CMD} -f 15-staff-schedules.sql
${PSQL_CMD} -f 16-equipment-schedules.sql

# Phase 4
echo "Phase 4: Payers & Financial Setup..."
${PSQL_CMD} -f 17-payers.sql
${PSQL_CMD} -f 18-fee-schedules.sql
${PSQL_CMD} -f 19-codesets.sql

# Phase 4.5
echo "Phase 4.5: Master Reference Tables..."
${PSQL_CMD} -f 19-medication-master.sql
${PSQL_CMD} -f 20-lab-test-master.sql
${PSQL_CMD} -f 21-imaging-study-master.sql
${PSQL_CMD} -f 22-procedure-master.sql

# Phase 5
echo "Phase 5: Patients..."
${PSQL_CMD} -f 23-patients.sql
${PSQL_CMD} -f 24-policies.sql
${PSQL_CMD} -f 25-policy-benefits.sql

# Phase 6
echo "Phase 6: Clinical Operations..."
${PSQL_CMD} -f 26-episodes.sql
${PSQL_CMD} -f 27-appointments.sql
${PSQL_CMD} -f 28-appointment-resources.sql
${PSQL_CMD} -f 29-encounters.sql
${PSQL_CMD} -f 30-encounter-links.sql

# Phase 7
echo "Phase 7: Clinical Documentation..."
${PSQL_CMD} -f 31-clinical-notes.sql
${PSQL_CMD} -f 32-orders.sql
${PSQL_CMD} -f 33-prescriptions.sql
${PSQL_CMD} -f 34-documents.sql

# Phase 8
echo "Phase 8: Billing & RCM..."
${PSQL_CMD} -f 35-superbills.sql
${PSQL_CMD} -f 36-superbill-items.sql
${PSQL_CMD} -f 37-claim-headers.sql
${PSQL_CMD} -f 38-claim-lines.sql

# Phase 9
echo "Phase 9: Payments & Reconciliation..."
${PSQL_CMD} -f 39-patient-payments.sql
${PSQL_CMD} -f 40-remittance-headers.sql
${PSQL_CMD} -f 41-remittance-lines.sql

# Phase 10
echo "Phase 10: Configuration & Rules..."
${PSQL_CMD} -f 42-visit-classification-rules.sql
${PSQL_CMD} -f 43-visit-billing-map.sql
${PSQL_CMD} -f 44-followup-waiver-rules.sql
${PSQL_CMD} -f 45-visit-type-pricing-rules.sql

echo "Seed data execution completed successfully!"
```

## Verification Queries

After seeding, run these queries to verify:

```sql
-- Check record counts
SELECT 'tenants' as table_name, COUNT(*) as count FROM tenants
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'patients', COUNT(*) FROM patients
UNION ALL SELECT 'staff', COUNT(*) FROM staff
UNION ALL SELECT 'facilities', COUNT(*) FROM facilities
UNION ALL SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL SELECT 'encounters', COUNT(*) FROM encounters
UNION ALL SELECT 'claims', COUNT(*) FROM claim_headers
UNION ALL SELECT 'medication_master', COUNT(*) FROM medication_master
UNION ALL SELECT 'lab_test_master', COUNT(*) FROM lab_test_master
UNION ALL SELECT 'imaging_study_master', COUNT(*) FROM imaging_study_master
UNION ALL SELECT 'procedure_master', COUNT(*) FROM procedure_master;

-- Verify RLS is working
SET app.current_tenant_id = 'tenant-uuid-here';
SELECT COUNT(*) FROM patients; -- Should only see tenant's data
```

## Notes

- All UUIDs in seed files use the format: `'[entity]-[descriptor]-uuid'`
- Dates use UAE timezone (+04:00)
- All monetary values in AED
- Passwords are hashed with Argon2id (examples use placeholder hashes)
- Tenant isolation via RLS is enforced
