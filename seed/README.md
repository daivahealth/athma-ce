# Zeal Platform - Seed Data

## Overview

This directory contains seed data files for initializing the Zeal healthcare platform database with sample data for development, testing, and demonstration purposes.

## ⚠️ Important Notes

- **DO NOT use seed data in production environments**
- All UUIDs are hardcoded for consistency across environments
- Passwords are placeholder hashes only
- Data reflects UAE healthcare context
- All monetary values in AED (Arab Emirates Dirham)
- Timestamps use UAE timezone (+04:00)

## Execution Sequence

The seed files **must** be executed in the order specified in `00-seed-execution-guide.md` to respect foreign key dependencies.

### Quick Start

```bash
# Make the execution script executable
chmod +x execute-all-seeds.sh

# Run all seed files in correct order
./execute-all-seeds.sh

# Or use the helper script
psql -d zeal_db -f 00-seed-execution-guide.md
```

## Seed File Structure

### Phase 1: Foundation Data (Files 01-11)
| File | Table | Description | Records |
|------|-------|-------------|---------|
| `01-tenants.sql` | tenants | Multi-tenant organizations | 3 |
| `02-users.sql` | users | System and tenant users | 12 |
| `03-locations.sql` | locations | Geographic locations | 12 |
| `04-facilities.sql` | facilities | Healthcare facilities | 10 |
| `05-spaces.sql` | spaces | Rooms and spaces | 25+ |
| `06-equipment.sql` | equipment | Medical equipment | 20+ |
| `07-specialties.sql` | specialties | Medical specialties | 15 |
| `08-post-offices.sql` | post_offices | UAE health authorities | 6 |
| `09-code-systems.sql` | code_systems | Terminology systems | 5 |
| `10-concepts.sql` | concepts | Coded values | ~15 |
| `11-value-sets.sql` | value_sets, value_set_members | Concept collections | 3 sets |

### Phase 2: RBAC & Security (Files 12-17)
| File | Table | Description | Required |
|------|-------|-------------|----------|
| `12-roles.sql` | roles | System and tenant roles | ✅ |
| `13-permissions.sql` | permissions | System permissions | ✅ |
| `14-role-permissions.sql` | role_permissions | Role-permission mappings | ✅ |
| `15-user-roles.sql` | user_roles | User-role assignments | ✅ |
| `16-user-mfa-settings.sql` | user_mfa_settings | MFA settings | ✅ |
| `17-user-trusted-devices.sql` | user_trusted_devices | Trusted devices | ✅ |

### Phase 3: Healthcare Providers (Files 18-22)
| File | Table | Description | Required |
|------|-------|-------------|----------|
| `18-staff.sql` | staff | Healthcare providers | ✅ |
| `19-staff-specialties.sql` | staff_specialties | Staff specialty mappings | ✅ |
| `20-staff-licenses.sql` | staff_licenses | Professional licenses | ✅ |
| `21-staff-schedules.sql` | staff_schedules | Provider availability | ✅ |
| `22-equipment-schedules.sql` | equipment_schedules | Equipment availability | ✅ |

### Phase 4: Master Reference Tables (Files 23-26)
| File | Table | Description | Required |
|------|-------|-------------|----------|
| `23-medication-master.sql` | medication_master | Medication catalog | ✅ |
| `24-lab-test-master.sql` | lab_test_master | Laboratory test catalog | ✅ |
| `25-imaging-study-master.sql` | imaging_study_master | Imaging study catalog | ✅ |
| `26-procedure-master.sql` | procedure_master | Procedure catalog | ✅ |

### Phase 5: Payers & Financial Setup (Files 27-30)
| File | Table | Description | Required |
|------|-------|-------------|----------|
| `27-payers.sql` | payers | Insurance companies | ✅ |
| `28-fee-schedules.sql` | fee_schedules | Pricing rules | ✅ |
| `29-payer-networks.sql` | payer_networks | Payer networks | ✅ |
| `30-copay-exemptions.sql` | copay_exemptions | Copay exemptions | ✅ |

### Phase 6: Patients & Policies (Files 31-35)
| File | Table | Description | Required |
|------|-------|-------------|----------|
| `31-patients.sql` | patients | Patient records | ✅ |
| `32-policies.sql` | policies | Insurance policies | ✅ |
| `33-policy-benefits.sql` | policy_benefits | Coverage details | ✅ |
| `34-patient-consents.sql` | patient_consents | Patient consents | ✅ |
| `35-patient-notification-preferences.sql` | patient_notification_preferences | Notification preferences | ✅ |

### Phase 7-16: Clinical, Billing & Operational Data
See `00-seed-execution-guide.md` for complete list of all 96 seed files.

## Sample Data Overview

### Tenants
- **Demo Medical Clinic** (demo-clinic.zeal.ae) - Full features
- **Demo General Hospital** (demo-hospital.zeal.ae) - Hospital operations
- **Demo Diagnostic Center** (demo-diagnostic.zeal.ae) - Diagnostic services

### Users & RBAC
- **Super Admin** - System administrator with full access
- **Demo Admin** - Tenant administrator
- **Healthcare Staff** - Physicians, nurses, technicians, pharmacists
- **Administrative Staff** - Managers, billing staff, receptionists
- **API User** - System integration user

### Facilities & Equipment
- **10 Healthcare Facilities** - Clinics, hospitals, diagnostic centers, surgery centers
- **25+ Spaces** - Consultation rooms, operating rooms, ICU, labs, waiting areas
- **20+ Equipment** - Medical devices, diagnostic equipment, surgical tools

### Specialties
15 medical specialties including Internal Medicine, Cardiology, Pediatrics, Orthopedics, etc.

### UAE Health Authorities
- DHA (Dubai Health Post Office / eClaimLink)
- DOH (Shafafiya)
- MOHAP
- Various emirate-specific authorities

### Insurance Payers
- Daman (Government)
- SAICO (Private)
- NextCare (TPA)
- Oman Insurance
- Cash/Self-Pay

### Patients
Sample patients with diverse demographics and Arabic name translations

### Master Reference Data
- **Medications**: Common medications with NDC, ATC, and local codes
- **Lab Tests**: Laboratory tests with LOINC and CPT codes
- **Imaging Studies**: Imaging studies with CPT and local codes
- **Procedures**: Medical procedures with CPT, ICD-10-PCS, and local codes

### Multi-Language Support
- **Arabic Translations** - Patient names, staff names, facility names, specialties, medications, clinical notes, prescriptions
- **Translation Helper Functions** - Database functions for managing translations

## Verification Queries

After seeding, verify data integrity:

```sql
-- Check record counts per table
SELECT 
    schemaname,
    tablename,
    n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;

-- Verify tenant isolation (RLS)
SET app.current_tenant_id = 'tenant-demo-clinic-uuid';
SELECT COUNT(*) as tenant1_patients FROM patients;

SET app.current_tenant_id = 'tenant-demo-hospital-uuid';
SELECT COUNT(*) as tenant2_patients FROM patients;

-- Verify RBAC system
SELECT r.name as role_name, COUNT(p.id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id
GROUP BY r.name;

-- Verify MFA settings
SELECT mfa_method, COUNT(*) as user_count
FROM user_mfa_settings
GROUP BY mfa_method;

-- Verify translations
SELECT entity_type, language_code, COUNT(*) as translation_count 
FROM translations 
GROUP BY entity_type, language_code;

-- Verify relationships
SELECT 
    p.mrn,
    p.first_name || ' ' || p.last_name as patient_name,
    pol.policy_number,
    pay.name as payer
FROM patients p
LEFT JOIN policies pol ON pol.patient_id = p.id
LEFT JOIN payers pay ON pay.id = pol.payer_id
ORDER BY p.mrn;

-- Verify master reference data
SELECT 'medication_master' as table_name, COUNT(*) as count FROM medication_master
UNION ALL SELECT 'lab_test_master', COUNT(*) FROM lab_test_master
UNION ALL SELECT 'imaging_study_master', COUNT(*) FROM imaging_study_master
UNION ALL SELECT 'procedure_master', COUNT(*) FROM procedure_master;
```

## Customization

To customize seed data for your environment:

1. **Update Tenant Information**: Edit `01-tenants.sql`
2. **Modify Specialties**: Edit `02-specialties.sql`
3. **Configure UAE Authorities**: Edit `03-post-offices.sql`
4. **Add More Payers**: Edit `17-payers.sql`
5. **Adjust Business Rules**: Edit `39-visit-classification-rules.sql`

## Regenerating Seed Data

To regenerate seed data from scratch:

```bash
# Drop all data (CAUTION!)
psql -d zeal_db -c "TRUNCATE TABLE tenants CASCADE;"

# Re-run seed files
./execute-all-seeds.sh
```

## Testing with Seed Data

### Test Scenarios

1. **Appointment-based Encounter**
```sql
-- Use patient MRN001 with scheduled appointment
SELECT * FROM appointments 
WHERE patient_id = 'patient-ahmed-uuid';
```

2. **Walk-in Encounter**
```sql
-- Create walk-in encounter for patient MRN002
INSERT INTO encounters (
    patient_id, primary_staff_id, encounter_source,
    walk_in_details
) VALUES (
    'patient-fatima-uuid',
    'staff-uuid-here',
    'walk_in',
    '{"arrival_time": "2024-01-15T14:00:00+04:00", "urgency_level": "medium"}'::jsonb
);
```

3. **Visit Classification**
```sql
-- Test visit classification rules
SELECT * FROM visit_classification_rules 
WHERE is_active = TRUE
ORDER BY priority DESC;
```

4. **Master Reference Data Usage**
```sql
-- Test medication master data
SELECT medication_name, ndc_code, atc_code, local_code 
FROM medication_master 
WHERE is_active = TRUE 
LIMIT 5;

-- Test lab test master data
SELECT test_name, loinc_code, cpt_code, local_code 
FROM lab_test_master 
WHERE is_active = TRUE 
LIMIT 5;

-- Test imaging study master data
SELECT study_name, cpt_code, local_code, modality 
FROM imaging_study_master 
WHERE is_active = TRUE 
LIMIT 5;

-- Test procedure master data
SELECT procedure_name, cpt_code, icd10_pcs_code, local_code 
FROM procedure_master 
WHERE is_active = TRUE 
LIMIT 5;
```

## Additional Resources

- **Main Documentation**: `/docs/05-Data-Model.md`
- **Encounter Sources**: `/docs/17-Encounter-Sources.md`
- **Billing Workflows**: `/docs/14-Billing-Workflows.md`
- **Terminology Management**: `/docs/16-Terminology-Management.md`
- **Order Management**: `/docs/18-Order-Management.md`
- **Master Reference Tables**: `/docs/19-Master-Reference-Tables.md`

## Support

For issues or questions about seed data:
1. Check the execution guide: `00-seed-execution-guide.md`
2. Review foreign key dependencies
3. Verify RLS policies are configured correctly
4. Check PostgreSQL logs for constraint violations

---

**Last Updated**: September 2025  
**Version**: 1.0.0  
**Compatible with**: PostgreSQL 16+
