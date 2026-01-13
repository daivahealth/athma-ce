# Catalog Tables Migration Cleanup

**Date:** December 3, 2025  
**Action:** Removed all clinical catalog tables from Foundation database

## Background

All clinical catalog tables were migrated from the Foundation database (`zeal_foundation`) to the Clinical database (`zeal_clinical`) as part of the domain-driven architecture refactoring. This document records the cleanup of the Foundation database.

## Tables Dropped from Foundation Database

The following 13 tables were dropped from `zeal_foundation`:

### ValueSet Tables (5 tables)
1. `value_sets` - ValueSet master table
2. `value_set_concepts` - Concepts within valuesets
3. `value_set_concept_translations` - Multi-language translations
4. `tenant_value_set_overrides` - Tenant-specific overrides
5. `value_set_history` - Audit history

### Catalog Master Tables (8 tables)
6. `medication_master` - Medications catalog
7. `lab_test_master` - Laboratory tests catalog
8. `imaging_study_master` - Imaging/radiology studies catalog
9. `procedure_master` - Clinical procedures catalog
10. `diagnosis_master` - ICD diagnosis codes
11. `diagnosis_versions` - Diagnosis code versions
12. `note_templates` - Clinical note templates
13. `note_template_versions` - Note template versions

## Changes Made

### 1. Database Cleanup
- Dropped all 13 catalog tables from `zeal_foundation` using CASCADE
- Verified no orphaned data or constraints remain

### 2. Prisma Schema Cleanup
**File:** `/backend/shared/database-foundation/prisma/schema.prisma`
- Removed migration comment block (lines 551-569)
- Regenerated Prisma client to reflect changes

### 3. Backend Code Verification
- Confirmed no catalog-related controllers exist in Foundation service
- Confirmed no catalog-related services exist in Foundation service
- No code changes required (all catalog code was already in Clinical service)

## Current State

### Foundation Database (`zeal_foundation`)
**Tables Remaining:** 27 tables
- Tenants, Users, Facilities, Staff
- Roles, Permissions, RBAC
- Specialties, Departments, Wards, Beds, Clinics, Spaces
- Configuration management (instance/tenant/facility configs)
- MFA and trusted devices
- Audit logs

### Clinical Database (`zeal_clinical`)
**All Catalog Tables Present:**
- 5 ValueSet tables (value_sets, value_set_concepts, etc.)
- 8 Catalog master tables (medications, lab tests, etc.)
- Accessible via Clinical service API: `http://localhost:3011/api/v1/catalogs/*`

## Verification

### Foundation Service Health
```bash
curl http://localhost:3010/api/v1/health
# Response: {"service":"foundation","status":"ok","timestamp":"..."}
```

### Clinical Catalog Endpoints
```bash
# ValueSets
curl http://localhost:3011/api/v1/catalogs/valuesets

# Medications
curl http://localhost:3011/api/v1/catalogs/medications

# Lab Tests
curl http://localhost:3011/api/v1/catalogs/lab-tests

# Diagnoses
curl http://localhost:3011/api/v1/catalogs/diagnoses
```

## Cross-Service Access

Foundation service should now access catalog data via:
1. **HTTP API calls** to Clinical service endpoints
2. **Event-driven updates** for catalog changes (if needed)
3. **Caching** frequently accessed catalog data

**Important:** Never attempt direct SQL joins between Foundation and Clinical databases. Always use REST APIs for cross-domain data access.

## Related Documentation

- `/docs/architecture/ADR-0013-SERVICE-DECOMPOSITION.md` - Service decomposition strategy
- `/seed/clinical/README.md` - Clinical seed data including catalogs
- `/docs/IDENTITY-MANAGEMENT-SYSTEM.md` - Identity validation and valuesets

## Rollback (If Needed)

If rollback is required:
1. Restore tables from Clinical database backup
2. Copy data back to Foundation database
3. Revert Prisma schema changes
4. Regenerate Prisma client

**Note:** This is NOT recommended as the architecture has been designed for separated catalogs in the Clinical domain.
