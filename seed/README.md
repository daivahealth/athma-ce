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

### Phase 1: Foundation Data (Files 01-06)
| File | Table | Description | Records |
|------|-------|-------------|---------|
| `01-tenants.sql` | tenants | Multi-tenant organizations | 3 |
| `02-specialties.sql` | specialties | Medical specialties | 15 |
| `03-post-offices.sql` | post_offices | UAE health authorities | 6 |
| `04-code-systems.sql` | code_systems | Terminology systems | 5 |
| `05-concepts.sql` | concepts | Coded values | ~15 |
| `06-value-sets.sql` | value_sets, value_set_members | Concept collections | 3 sets |

### Phase 2: Organizational Structure (Files 07-11)
| File | Table | Description | Required |
|------|-------|-------------|----------|
| `07-users.sql` | users | System users | ✅ |
| `08-locations.sql` | locations | Physical locations | ✅ |
| `09-facilities.sql` | facilities | Healthcare facilities | ✅ |
| `10-spaces.sql` | spaces | Rooms/spaces | ✅ |
| `11-equipment.sql` | equipment | Medical equipment | ✅ |

### Phase 3: Healthcare Providers (Files 12-16)
| File | Table | Description | Required |
|------|-------|-------------|----------|
| `12-staff.sql` | staff | Healthcare providers | ✅ |
| `13-staff-specialties.sql` | staff_specialties | Staff specialty mappings | ✅ |
| `14-staff-licenses.sql` | staff_licenses | Professional licenses | ✅ |
| `15-staff-schedules.sql` | staff_schedules | Provider availability | ✅ |
| `16-equipment-schedules.sql` | equipment_schedules | Equipment availability | ✅ |

### Phase 4: Payers & Financial (Files 17-19)
| File | Table | Description | Required |
|------|-------|-------------|----------|
| `17-payers.sql` | payers | Insurance companies | ✅ |
| `18-fee-schedules.sql` | fee_schedules | Pricing rules | ✅ |
| `19-codesets.sql` | codesets | Medical coding systems | ✅ |

### Phase 4.5: Master Reference Tables (Files 19-22)
| File | Table | Description | Required |
|------|-------|-------------|----------|
| `19-medication-master.sql` | medication_master | Medication catalog | ✅ |
| `20-lab-test-master.sql` | lab_test_master | Laboratory test catalog | ✅ |
| `21-imaging-study-master.sql` | imaging_study_master | Imaging study catalog | ✅ |
| `22-procedure-master.sql` | procedure_master | Procedure catalog | ✅ |

### Phase 5: Patients (Files 23-25)
| File | Table | Description | Required |
|------|-------|-------------|----------|
| `23-patients.sql` | patients | Patient records | ✅ |
| `24-policies.sql` | policies | Insurance policies | ✅ |
| `25-policy-benefits.sql` | policy_benefits | Coverage details | ✅ |

### Phase 6-10: Clinical & Billing Data
See `00-seed-execution-guide.md` for complete list.

## Sample Data Overview

### Tenants
- **Dubai Health Center** (dhc.zeal.ae) - Full features
- **Abu Dhabi Medical Clinic** (admc.zeal.ae) - PMS + Billing
- **Sharjah Family Clinic** (sfc.zeal.ae) - Full features + Telemedicine

### Specialties
15 medical specialties including GP, Pediatrics, Cardiology, Orthopedics, etc.

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
4 sample patients with diverse demographics:
- Ahmed Al Mansoori (UAE National, Male, 38)
- Fatima Hassan (UAE National, Female, 33)
- John Smith (Expat, Male, 45)
- Sara Al Zaabi (Pediatric, Female, 8)

### Master Reference Data
- **Medications**: 15 common medications with NDC, ATC, and local codes
- **Lab Tests**: 20+ laboratory tests with LOINC and CPT codes
- **Imaging Studies**: 20+ imaging studies with CPT and local codes
- **Procedures**: 20+ medical procedures with CPT, ICD-10-PCS, and local codes

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
SET app.current_tenant_id = '11111111-1111-1111-1111-111111111111';
SELECT COUNT(*) as tenant1_patients FROM patients;

SET app.current_tenant_id = '22222222-2222-2222-2222-222222222222';
SELECT COUNT(*) as tenant2_patients FROM patients;

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
