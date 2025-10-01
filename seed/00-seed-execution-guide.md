# Seed Data Execution Guide

## Overview
This guide outlines the execution sequence for seeding the Zeal database with initial data. Files must be executed in the order specified to respect foreign key dependencies.

## Execution Sequence

### Phase 1: Foundation Data (No Dependencies)
```bash
# 1. Core Foundation
psql -f 01-tenants.sql
psql -f 02-users.sql
psql -f 03-locations.sql
psql -f 04-facilities.sql
psql -f 05-spaces.sql
psql -f 06-equipment.sql

# 2. Global Reference Data
psql -f 07-specialties.sql
psql -f 08-post-offices.sql
psql -f 09-code-systems.sql
psql -f 10-concepts.sql
psql -f 11-value-sets.sql
```

### Phase 2: RBAC & Security (Depends on Phase 1)
```bash
# 12. RBAC System
psql -f 12-roles.sql
psql -f 13-permissions.sql
psql -f 14-role-permissions.sql
psql -f 15-user-roles.sql

# 16. MFA & Security
psql -f 16-user-mfa-settings.sql
psql -f 17-user-trusted-devices.sql
```

### Phase 3: Healthcare Providers (Depends on Phase 1)
```bash
# 18. Staff & Specialties
psql -f 18-staff.sql
psql -f 19-staff-specialties.sql
psql -f 20-staff-licenses.sql
psql -f 21-staff-schedules.sql
psql -f 22-equipment-schedules.sql
```

### Phase 4: Master Reference Tables (Depends on Phase 1)
```bash
# 23. Master Reference Data
psql -f 23-medication-master.sql
psql -f 24-lab-test-master.sql
psql -f 25-imaging-study-master.sql
psql -f 26-procedure-master.sql
```

### Phase 5: Payers & Financial Setup (Depends on Phase 1)
```bash
# 27. Payers & Financial
psql -f 27-payers.sql
psql -f 28-fee-schedules.sql
psql -f 29-payer-networks.sql
psql -f 30-copay-exemptions.sql
```

### Phase 6: Patients & Policies (Depends on Phase 1)
```bash
# 31. Patients & Policies
psql -f 31-patients.sql
psql -f 32-policies.sql
psql -f 33-policy-benefits.sql
psql -f 34-patient-consents.sql
psql -f 35-patient-notification-preferences.sql
```

### Phase 7: Clinical Operations (Depends on Phases 3, 6)
```bash
# 36. Appointments & Encounters
psql -f 36-episodes.sql
psql -f 37-appointments.sql
psql -f 38-appointment-resources.sql
psql -f 39-appointment-waitlist.sql
psql -f 40-recurring-appointment-templates.sql
psql -f 41-encounters.sql
psql -f 42-encounter-links.sql
```

### Phase 8: Clinical Documentation (Depends on Phase 7)
```bash
# 43. Clinical Notes & Orders
psql -f 43-clinical-notes.sql
psql -f 44-orders.sql
psql -f 45-medication-orders.sql
psql -f 46-lab-orders.sql
psql -f 47-imaging-orders.sql
psql -f 48-procedure-orders.sql
psql -f 49-prescriptions.sql
psql -f 50-documents.sql
```

### Phase 9: Clinical Data (Depends on Phase 6)
```bash
# 51. Clinical Data
psql -f 51-patient-problems.sql
psql -f 52-care-plans.sql
psql -f 53-patient-allergies-enhanced.sql
psql -f 54-family-history.sql
psql -f 55-immunizations.sql
psql -f 56-vitals.sql
psql -f 57-screenings.sql
```

### Phase 10: Billing & RCM (Depends on Phase 7, 8)
```bash
# 58. Superbills & Claims
psql -f 58-superbills.sql
psql -f 59-superbill-items.sql
psql -f 60-claim-headers.sql
psql -f 61-claim-lines.sql
psql -f 62-claim-submission-batches.sql
psql -f 63-claim-acknowledgments.sql
psql -f 64-claim-denials.sql
psql -f 65-claim-appeals.sql
psql -f 66-claim-resubmissions.sql
```

### Phase 11: Payments & Reconciliation (Depends on Phase 10)
```bash
# 67. Payments & Remittances
psql -f 67-patient-payments.sql
psql -f 68-remittance-headers.sql
psql -f 69-remittance-lines.sql
psql -f 70-bill-cancellations.sql
psql -f 71-refunds.sql
psql -f 72-patient-statements.sql
psql -f 73-dunning-notices.sql
psql -f 74-collections.sql
```

### Phase 12: RCM Advanced (Depends on Phase 5, 10)
```bash
# 75. RCM Advanced
psql -f 75-eligibility-requests.sql
psql -f 76-preauth-requests.sql
psql -f 77-cost-estimates.sql
psql -f 78-payment-plans.sql
psql -f 79-ar-aging.sql
psql -f 80-write-offs.sql
```

### Phase 13: Configuration & Rules (Depends on Phase 1-4)
```bash
# 81. Business Rules
psql -f 81-visit-classification-rules.sql
psql -f 82-visit-billing-map.sql
psql -f 83-followup-waiver-rules.sql
psql -f 84-visit-type-pricing-rules.sql
psql -f 85-visit-type-history.sql
```

### Phase 14: Compliance & Security (Depends on Phase 1)
```bash
# 86. Compliance & Security
psql -f 86-data-access-logs.sql
psql -f 87-security-breaches.sql
psql -f 88-breach-notifications.sql
psql -f 89-audit-logs.sql
```

### Phase 15: Operational Data (Depends on Phase 1, 3)
```bash
# 90. Operational
psql -f 90-schedule-blocks.sql
psql -f 91-no-show-tracking.sql
psql -f 92-resource-utilization.sql
psql -f 93-charge-capture-audit.sql
psql -f 94-payment-postings.sql
psql -f 95-underpayment-analysis.sql
```

### Phase 16: Translations (Depends on Phase 1)
```bash
# 96. Multi-Language Support
psql -f 96-translations.sql
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

# Phase 1: Foundation Data
echo "Phase 1: Foundation Data..."
${PSQL_CMD} -f 01-tenants.sql
${PSQL_CMD} -f 02-users.sql
${PSQL_CMD} -f 03-locations.sql
${PSQL_CMD} -f 04-facilities.sql
${PSQL_CMD} -f 05-spaces.sql
${PSQL_CMD} -f 06-equipment.sql
${PSQL_CMD} -f 07-specialties.sql
${PSQL_CMD} -f 08-post-offices.sql
${PSQL_CMD} -f 09-code-systems.sql
${PSQL_CMD} -f 10-concepts.sql
${PSQL_CMD} -f 11-value-sets.sql

# Phase 2: RBAC & Security
echo "Phase 2: RBAC & Security..."
${PSQL_CMD} -f 12-roles.sql
${PSQL_CMD} -f 13-permissions.sql
${PSQL_CMD} -f 14-role-permissions.sql
${PSQL_CMD} -f 15-user-roles.sql
${PSQL_CMD} -f 16-user-mfa-settings.sql
${PSQL_CMD} -f 17-user-trusted-devices.sql

# Phase 3: Healthcare Providers
echo "Phase 3: Healthcare Providers..."
${PSQL_CMD} -f 18-staff.sql
${PSQL_CMD} -f 19-staff-specialties.sql
${PSQL_CMD} -f 20-staff-licenses.sql
${PSQL_CMD} -f 21-staff-schedules.sql
${PSQL_CMD} -f 22-equipment-schedules.sql

# Phase 4: Master Reference Tables
echo "Phase 4: Master Reference Tables..."
${PSQL_CMD} -f 23-medication-master.sql
${PSQL_CMD} -f 24-lab-test-master.sql
${PSQL_CMD} -f 25-imaging-study-master.sql
${PSQL_CMD} -f 26-procedure-master.sql

# Phase 5: Payers & Financial Setup
echo "Phase 5: Payers & Financial Setup..."
${PSQL_CMD} -f 27-payers.sql
${PSQL_CMD} -f 28-fee-schedules.sql
${PSQL_CMD} -f 29-payer-networks.sql
${PSQL_CMD} -f 30-copay-exemptions.sql

# Phase 6: Patients & Policies
echo "Phase 6: Patients & Policies..."
${PSQL_CMD} -f 31-patients.sql
${PSQL_CMD} -f 32-policies.sql
${PSQL_CMD} -f 33-policy-benefits.sql
${PSQL_CMD} -f 34-patient-consents.sql
${PSQL_CMD} -f 35-patient-notification-preferences.sql

# Phase 7: Clinical Operations
echo "Phase 7: Clinical Operations..."
${PSQL_CMD} -f 36-episodes.sql
${PSQL_CMD} -f 37-appointments.sql
${PSQL_CMD} -f 38-appointment-resources.sql
${PSQL_CMD} -f 39-appointment-waitlist.sql
${PSQL_CMD} -f 40-recurring-appointment-templates.sql
${PSQL_CMD} -f 41-encounters.sql
${PSQL_CMD} -f 42-encounter-links.sql

# Phase 8: Clinical Documentation
echo "Phase 8: Clinical Documentation..."
${PSQL_CMD} -f 43-clinical-notes.sql
${PSQL_CMD} -f 44-orders.sql
${PSQL_CMD} -f 45-medication-orders.sql
${PSQL_CMD} -f 46-lab-orders.sql
${PSQL_CMD} -f 47-imaging-orders.sql
${PSQL_CMD} -f 48-procedure-orders.sql
${PSQL_CMD} -f 49-prescriptions.sql
${PSQL_CMD} -f 50-documents.sql

# Phase 9: Clinical Data
echo "Phase 9: Clinical Data..."
${PSQL_CMD} -f 51-patient-problems.sql
${PSQL_CMD} -f 52-care-plans.sql
${PSQL_CMD} -f 53-patient-allergies-enhanced.sql
${PSQL_CMD} -f 54-family-history.sql
${PSQL_CMD} -f 55-immunizations.sql
${PSQL_CMD} -f 56-vitals.sql
${PSQL_CMD} -f 57-screenings.sql

# Phase 10: Billing & RCM
echo "Phase 10: Billing & RCM..."
${PSQL_CMD} -f 58-superbills.sql
${PSQL_CMD} -f 59-superbill-items.sql
${PSQL_CMD} -f 60-claim-headers.sql
${PSQL_CMD} -f 61-claim-lines.sql
${PSQL_CMD} -f 62-claim-submission-batches.sql
${PSQL_CMD} -f 63-claim-acknowledgments.sql
${PSQL_CMD} -f 64-claim-denials.sql
${PSQL_CMD} -f 65-claim-appeals.sql
${PSQL_CMD} -f 66-claim-resubmissions.sql

# Phase 11: Payments & Reconciliation
echo "Phase 11: Payments & Reconciliation..."
${PSQL_CMD} -f 67-patient-payments.sql
${PSQL_CMD} -f 68-remittance-headers.sql
${PSQL_CMD} -f 69-remittance-lines.sql
${PSQL_CMD} -f 70-bill-cancellations.sql
${PSQL_CMD} -f 71-refunds.sql
${PSQL_CMD} -f 72-patient-statements.sql
${PSQL_CMD} -f 73-dunning-notices.sql
${PSQL_CMD} -f 74-collections.sql

# Phase 12: RCM Advanced
echo "Phase 12: RCM Advanced..."
${PSQL_CMD} -f 75-eligibility-requests.sql
${PSQL_CMD} -f 76-preauth-requests.sql
${PSQL_CMD} -f 77-cost-estimates.sql
${PSQL_CMD} -f 78-payment-plans.sql
${PSQL_CMD} -f 79-ar-aging.sql
${PSQL_CMD} -f 80-write-offs.sql

# Phase 13: Configuration & Rules
echo "Phase 13: Configuration & Rules..."
${PSQL_CMD} -f 81-visit-classification-rules.sql
${PSQL_CMD} -f 82-visit-billing-map.sql
${PSQL_CMD} -f 83-followup-waiver-rules.sql
${PSQL_CMD} -f 84-visit-type-pricing-rules.sql
${PSQL_CMD} -f 85-visit-type-history.sql

# Phase 14: Compliance & Security
echo "Phase 14: Compliance & Security..."
${PSQL_CMD} -f 86-data-access-logs.sql
${PSQL_CMD} -f 87-security-breaches.sql
${PSQL_CMD} -f 88-breach-notifications.sql
${PSQL_CMD} -f 89-audit-logs.sql

# Phase 15: Operational Data
echo "Phase 15: Operational Data..."
${PSQL_CMD} -f 90-schedule-blocks.sql
${PSQL_CMD} -f 91-no-show-tracking.sql
${PSQL_CMD} -f 92-resource-utilization.sql
${PSQL_CMD} -f 93-charge-capture-audit.sql
${PSQL_CMD} -f 94-payment-postings.sql
${PSQL_CMD} -f 95-underpayment-analysis.sql

# Phase 16: Translations
echo "Phase 16: Translations..."
${PSQL_CMD} -f 96-translations.sql

echo "Seed data execution completed successfully!"
```

## Verification Queries

After seeding, run these queries to verify:

```sql
-- Check record counts for all major tables
SELECT 'tenants' as table_name, COUNT(*) as count FROM tenants
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'roles', COUNT(*) FROM roles
UNION ALL SELECT 'permissions', COUNT(*) FROM permissions
UNION ALL SELECT 'staff', COUNT(*) FROM staff
UNION ALL SELECT 'patients', COUNT(*) FROM patients
UNION ALL SELECT 'facilities', COUNT(*) FROM facilities
UNION ALL SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL SELECT 'encounters', COUNT(*) FROM encounters
UNION ALL SELECT 'claims', COUNT(*) FROM claim_headers
UNION ALL SELECT 'medication_master', COUNT(*) FROM medication_master
UNION ALL SELECT 'lab_test_master', COUNT(*) FROM lab_test_master
UNION ALL SELECT 'imaging_study_master', COUNT(*) FROM imaging_study_master
UNION ALL SELECT 'procedure_master', COUNT(*) FROM procedure_master
UNION ALL SELECT 'translations', COUNT(*) FROM translations
UNION ALL SELECT 'patient_problems', COUNT(*) FROM patient_problems
UNION ALL SELECT 'care_plans', COUNT(*) FROM care_plans
UNION ALL SELECT 'immunizations', COUNT(*) FROM immunizations
UNION ALL SELECT 'vitals', COUNT(*) FROM vitals
UNION ALL SELECT 'screenings', COUNT(*) FROM screenings
UNION ALL SELECT 'patient_statements', COUNT(*) FROM patient_statements
UNION ALL SELECT 'collections', COUNT(*) FROM collections;

-- Verify RLS is working
SET app.current_tenant_id = 'tenant-uuid-here';
SELECT COUNT(*) FROM patients; -- Should only see tenant's data

-- Check translations are working
SELECT entity_type, language_code, COUNT(*) as translation_count 
FROM translations 
GROUP BY entity_type, language_code;

-- Verify RBAC system
SELECT r.name as role_name, COUNT(p.id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id
GROUP BY r.name;

-- Check MFA settings
SELECT mfa_method, COUNT(*) as user_count
FROM user_mfa_settings
GROUP BY mfa_method;
```

## Notes

- All UUIDs in seed files use the format: `'[entity]-[descriptor]-uuid'`
- Dates use UAE timezone (+04:00)
- All monetary values in AED
- Passwords are hashed with Argon2id (examples use placeholder hashes)
- Tenant isolation via RLS is enforced
