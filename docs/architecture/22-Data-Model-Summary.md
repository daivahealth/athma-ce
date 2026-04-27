# Data Model Summary - athma-ce Platform

## Overview

This document provides a **high-level summary** of the athma-ce Platform data model, highlighting key tables, relationships, and design decisions.

**Total Tables**: 100+  
**Total Indexes**: 300+  
**Total RLS Policies**: 100+  
**Database**: PostgreSQL 16+  
**Last Updated**: October 2025

---

## Table Categories

### 1. Core Infrastructure (10 tables)

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `tenants` | Multi-tenant organizations | Isolated data per tenant |
| `users` | System users | RBAC, MFA, audit tracking |
| `locations` | Geographic locations | Address, emirate, settings |
| `facilities` | Healthcare facilities | License, specialty, type |
| `spaces` | Rooms/areas | Capacity, equipment, type |
| `staff` | Healthcare providers | Licenses, specialties, credentials |
| `equipment` | Medical equipment | Type, status, maintenance |
| `patients` | Patient records | MRN, Emirates ID, demographics |
| `episodes` | Care episodes | Group related encounters |
| `documents` | File storage | S3 links, metadata, AV scan |

---

### 2. RBAC & Security (8 tables)

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `roles` | Access roles | Tenant-specific, system protection |
| `permissions` | Permission definitions | Global, resource.action format |
| `role_permissions` | Role-permission mapping | Many-to-many |
| `user_roles` | User-role assignment | Expiration, audit trail |
| `user_mfa_settings` | MFA configuration | TOTP, SMS, Email, backup codes |
| `user_mfa_backup_codes` | Recovery codes | Hashed, one-time use |
| `user_mfa_attempts` | MFA audit log | Success/failure tracking |
| `user_trusted_devices` | Trusted devices | 30-day expiration |

**Key Features**:
- ✅ Granular permissions (200+ permissions)
- ✅ Multi-role support
- ✅ Temporal access (role expiration)
- ✅ MFA enforcement for admin roles
- ✅ Complete audit trail

---

### 3. Clinical Documentation (15 tables)

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `appointments` | Scheduled visits | Multi-resource, visit classification |
| `encounters` | Clinical visits | Source tracking, episode linking |
| `encounter_links` | Encounter relationships | Follow-up, referral tracking |
| `vitals` | Vital signs | BP, HR, temp, BMI, O2 sat |
| `clinical_notes` | SOAP notes | Sectioned, signed, timestamped |
| `patient_problems` | Problem list | ICD-10, status, severity, chronic flags |
| `care_plans` | Care coordination | Goals, interventions, outcomes |
| `care_plan_interventions` | Care activities | Frequency, completion tracking |
| `immunizations` | Vaccine records | CVX codes, dose series, next due |
| `screenings` | Screening tools | PHQ-9, GAD-7, scores, interpretation |
| `patient_allergies_enhanced` | Allergy tracking | Severity, reactions, verification |
| `family_history` | Family conditions | Genetic risk, inheritance patterns |
| `staff_schedules` | Provider availability | Day/time schedules |
| `equipment_schedules` | Equipment availability | Maintenance windows |
| `schedule_blocks` | Reserved time | Surgery, procedures, admin |

**Key Features**:
- ✅ Complete SOAP documentation
- ✅ Structured problem list
- ✅ Care plan management
- ✅ Preventive care tracking
- ✅ Multi-resource scheduling

---

### 4. Order Management (16 tables)

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `orders` | Generic orders | Type, status, priority, approval |
| `medication_orders` | Medication orders | Dosage, frequency, refills |
| `lab_orders` | Lab test orders | LOINC, specimen, fasting |
| `imaging_orders` | Imaging orders | CPT, modality, contrast |
| `procedure_orders` | Procedure orders | CPT, anesthesia, consent |
| `referral_orders` | Specialist referrals | Specialty, urgency, clinical summary |
| `lab_results` | Lab results | LOINC, value, reference range, abnormal flags |
| `imaging_results` | Imaging reports | Findings, impression, DICOM |
| `procedure_results` | Procedure outcomes | Start/end time, findings, complications |
| `medication_inventory` | Pharmacy stock | Quantity, expiry, controlled substances |
| `medication_dispensing` | Dispensing log | Quantity, date, dispensed by |
| `prescriptions` | eRx integration | NCPDP SCRIPT, pharmacy routing |
| `lab_panels` | Test grouping | CBC, BMP, lipid panel |
| `operative_notes` | Surgical documentation | Surgeon, assistant, findings |
| `procedure_consents` | Consent forms | Digital signature, witness |
| `intraoperative_events` | Real-time tracking | Vital signs, complications |

**Key Features**:
- ✅ Unified order entry
- ✅ Type-specific extensions
- ✅ Result tracking
- ✅ Approval workflows
- ✅ HL7/FHIR integration ready

---

### 5. Master Reference Tables (4 tables)

| Table | Purpose | Coding Systems |
|-------|---------|----------------|
| `medication_master` | Medication catalog | NDC, ATC, Local |
| `lab_test_master` | Lab test catalog | LOINC, CPT, Local |
| `imaging_study_master` | Imaging catalog | CPT, Local |
| `procedure_master` | Procedure catalog | CPT, ICD-10-PCS, Local |

**Key Features**:
- ✅ Standardized order entry
- ✅ Auto-population of codes
- ✅ Multi-tenant (global + tenant-specific)
- ✅ Billing-ready CPT codes
- ✅ Clinical decision support data

---

### 6. Billing & Claims (20 tables)

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `superbills` | Encounter charges | Invoice generation, payment status |
| `superbill_items` | Line-level charges | CPT, units, pricing |
| `claim_headers` | Claim metadata | Payer, status, totals |
| `claim_lines` | Claim line items | CPT, modifiers, diagnosis pointers |
| `claim_submission_batches` | Batch processing | DHA/DOH/MOHAP submission |
| `claim_batch_items` | Batch tracking | Per-claim status, ACK codes |
| `claim_acknowledgments` | ACK processing | Technical, business, payment, rejection |
| `claim_denials` | Denial tracking | CARC/RARC codes, type, source |
| `claim_appeals` | Appeal management | Multi-level, documents, resolution |
| `claim_resubmissions` | Resubmission log | Linked to denials, new batches |
| `validation_findings` | Pre-submission validation | Errors, warnings, fixes |
| `submission_logs` | Submission audit | Timestamps, users, responses |
| `eligibility_requests` | Eligibility checks | Request/response payloads |
| `eligibility_benefits` | Coverage details | Copays, deductibles, limits |
| `preauth_requests` | Prior authorization | Status, auth reference, validity |
| `preauth_items` | PA line items | Requested vs approved units |
| `cost_estimates` | Patient estimates | Expected patient responsibility |
| `bill_cancellations` | Bill voids | Reason, items affected |
| `refunds` | Refund processing | Amount, method, allocation |
| `uae_eclaims_fields` | UAE-specific | DHA/DOH required fields |

**Key Features**:
- ✅ Complete claim lifecycle
- ✅ Batch submission to UAE authorities
- ✅ Denial management & appeals
- ✅ Multi-level acknowledgments
- ✅ Pre-submission validation

---

### 7. Payments & AR (15 tables)

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `patient_payments` | Patient collections | Cash, card, allocation |
| `payment_postings` | Insurance payments | Check, EFT, reconciliation |
| `remittance_headers` | ERA/EOB headers | Payer, totals, date |
| `remittance_lines` | ERA line details | Allowed, paid, adjustments |
| `reconciliations` | Payment reconciliation | Expected vs actual, variance |
| `patient_statements` | Patient billing | Line-level detail, delivery |
| `patient_statement_items` | Statement lines | Service, charges, balance |
| `dunning_notices` | Collection notices | 4-level escalation |
| `collections` | Collections agency | Handover, recovery tracking |
| `underpayment_analysis` | Variance analysis | Expected vs paid, appeal tracking |
| `ar_aging` | AR aging buckets | 0-30, 31-60, 61-90, 90+ |
| `write_offs` | Write-off tracking | Amount, reason, reversals |
| `payment_plans` | Installment plans | Terms, schedule, compliance |
| `collection_agencies` | Agency management | Contact, terms, recovery rates |
| `era_parser_queue` | ERA ingestion | Raw file, parsing, posting |

**Key Features**:
- ✅ Insurance AR (claims → remittance → reconciliation)
- ✅ Patient AR (statements → dunning → collections)
- ✅ Payment posting automation
- ✅ Variance detection
- ✅ Collections workflow

---

### 8. Payers & Insurance (10 tables)

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `payers` | Insurance companies | Network, contact, status |
| `policies` | Patient insurance | Primary, secondary, benefits |
| `policy_benefits` | Coverage details | Copays, deductibles, limits |
| `fee_schedules` | Payer pricing | Code-level fees |
| `fee_schedule_versions` | Fee versioning | Effective dates, history |
| `fee_schedule_item_versions` | Line versioning | Point-in-time pricing |
| `payer_networks` | Network management | Tiers, coverage area |
| `copay_exemptions` | Exemption rules | Chronic disease, preventive care |
| `payer_contracts` | Contract terms | Capitation, risk-sharing |
| `codesets` | Medical codes | ICD-10, CPT, HCPCS |

**Key Features**:
- ✅ Multi-payer support
- ✅ Fee schedule versioning
- ✅ Network management
- ✅ Exemption rules
- ✅ Contract tracking

---

### 9. Scheduling (10 tables)

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `appointments` | Scheduled visits | Multi-resource, visit type |
| `appointment_resources` | Resource assignments | Staff, equipment, spaces |
| `appointment_resource_requirements` | Resource templates | By appointment type |
| `resource_conflicts` | Conflict detection | Double-booking, maintenance |
| `staff_schedules` | Staff availability | Day/time patterns |
| `equipment_schedules` | Equipment availability | Maintenance, calibration |
| `schedule_blocks` | Reserved blocks | Surgery, procedures, admin |
| `no_show_tracking` | No-show management | Penalties, waivers |
| `resource_utilization` | Utilization metrics | Daily rollups, percentages |
| `appointment_waitlist` | Waitlist management | Priority, notification |

**Key Features**:
- ✅ Multi-resource scheduling
- ✅ Conflict detection & resolution
- ✅ Block scheduling for procedures
- ✅ Utilization tracking
- ✅ No-show penalty management

---

### 10. Compliance & Audit (12 tables)

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `data_access_logs` | Access audit | Every patient view logged |
| `patient_consents` | Consent management | Data sharing, research, marketing |
| `consent_sharing_agreements` | Sharing agreements | Entity, purpose, access level |
| `security_breaches` | Incident tracking | Severity, affected patients, notifications |
| `breach_notifications` | Notification log | Regulatory, patient, delivery status |
| `audit_logs` | System audit | All changes, before/after |
| `data_retention_policies` | Retention rules | Per table, archive, delete |
| `patient_notification_preferences` | Communication prefs | SMS, email, WhatsApp |
| `notification_logs` | Delivery tracking | Status, cost, failures |
| `eligibility_audit_trail` | Eligibility failures | Retry policies, reason codes |
| `denial_risk_scoring` | AI risk prediction | Model, confidence, factors |
| `claim_anomaly_detection` | Anomaly detection | ML-based outlier detection |

**Key Features**:
- ✅ Complete audit trail
- ✅ Breach notification (UAE PDPL)
- ✅ Consent management
- ✅ Data access logging
- ✅ Retention policies

---

### 11. Terminology Management (5 tables)

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `code_systems` | Code system registry | ICD-10, CPT, LOINC, SNOMED |
| `concepts` | Coded values | Multi-language, version control |
| `concept_translations` | Translations | Arabic, English |
| `value_sets` | Concept collections | Visit types, diagnoses |
| `value_set_members` | Value set membership | Validation, expansion |

**Key Features**:
- ✅ Standard vocabularies
- ✅ Multi-language support
- ✅ Value set validation
- ✅ Terminology versioning

---

### 12. UAE-Specific (6 tables)

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `post_offices` | Health authorities | DHA, DOH, MOHAP |
| `staff_licenses` | Provider licenses | Per authority, expiration |
| `specialties` | Medical specialties | Global catalog |
| `staff_specialties` | Staff-specialty map | Primary flag |
| `uae_eclaims_fields` | eClaims 2.1 fields | DHA/DOH specific |
| `uae_drg_tariffs` | DRG tariffs | National fee schedules |

**Key Features**:
- ✅ DHA eClaimLink integration
- ✅ DOH Shafafiya integration
- ✅ License tracking per authority
- ✅ National tariff support

---

## Key Design Patterns

### 1. Multi-Tenancy

**Pattern**: Row-Level Security (RLS)

```sql
-- Every tenant-scoped table has RLS policy
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_patients ON patients
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

**Benefits**:
- Single database, multiple tenants
- Automatic tenant isolation
- No application-layer filtering needed
- Regulatory compliance by design

---

### 2. Audit Trail

**Pattern**: Comprehensive logging at multiple levels

```sql
-- System audit (all changes)
audit_logs: who, what, when, before/after

-- Data access audit (every view)
data_access_logs: who viewed which patient when

-- Domain-specific audit
user_mfa_attempts: authentication attempts
claim_submission_batches: claim lifecycle
payment_postings: payment processing
```

**Benefits**:
- Complete audit trail for compliance
- Forensic investigation capability
- Regulatory reporting
- Security monitoring

---

### 3. Versioning

**Pattern**: Temporal data with effective dates

```sql
-- Fee schedules
fee_schedule_versions
    ├── version_number
    ├── effective_date
    ├── expiration_date
    └── is_active

-- Point-in-time pricing
SELECT fee_amount 
FROM fee_schedule_item_versions
WHERE code = '99213'
  AND effective_date <= '2025-10-01'
  AND (expiration_date IS NULL OR expiration_date > '2025-10-01')
  AND is_active = true;
```

**Benefits**:
- Historical pricing accuracy
- Contract compliance
- Audit capability
- No data loss

---

### 4. Polymorphic Relationships

**Pattern**: Parent-child with type-specific extensions

```sql
orders (parent)
    ├── medication_orders (child)
    ├── lab_orders (child)
    ├── imaging_orders (child)
    ├── procedure_orders (child)
    └── referral_orders (child)
```

**Benefits**:
- Unified order management
- Type-specific fields
- Common workflow (status, approvals)
- Extensible to new order types

---

### 5. Master Reference Data

**Pattern**: Global catalog with tenant overrides

```sql
medication_master
    ├── tenant_id (NULL = global)
    ├── ndc_code
    ├── atc_code
    ├── local_code
    └── ...

-- Global medications (tenant_id IS NULL)
-- Tenant-specific medications (tenant_id = 'tenant-uuid')
```

**Benefits**:
- Standardized data entry
- Reduced errors
- Auto-population
- Billing accuracy
- Clinical decision support

---

### 6. Status-Driven Workflows

**Pattern**: State machine with status field

```sql
-- Claim lifecycle
claim_headers.status:
    draft → validated → submitted → accepted → paid → reconciled
                ↓           ↓           ↓
            rejected   denied     partial

-- Encounter lifecycle
encounters.status:
    scheduled → checked_in → in_progress → completed
                     ↓              ↓
                cancelled      no_show
```

**Benefits**:
- Clear workflow states
- Transition validation
- Status-based permissions
- Progress tracking

---

## Performance Optimizations

### Composite Indexes

**Pattern**: Multi-column indexes for common queries

```sql
-- Patient + date range (most common query pattern)
CREATE INDEX idx_encounters_patient_date ON encounters(patient_id, encounter_date DESC);
CREATE INDEX idx_appointments_patient_date ON appointments(patient_id, scheduled_at DESC);
CREATE INDEX idx_orders_patient_date ON orders(encounter_id, created_at DESC);

-- Staff + date range
CREATE INDEX idx_appointments_staff_date ON appointments(primary_staff_id, scheduled_at DESC);
CREATE INDEX idx_encounters_staff_date ON encounters(primary_staff_id, encounter_date DESC);

-- Status + date (for dashboards)
CREATE INDEX idx_claims_status_date ON claim_headers(status, service_date DESC);
CREATE INDEX idx_orders_status_date ON orders(status, ordered_at DESC);
```

**Benefits**:
- Fast patient chart retrieval
- Efficient date range queries
- Dashboard performance
- Report generation speed

---

### Partitioning Strategy

**Pattern**: Time-based partitioning for high-volume tables

```sql
-- Partition by month for claims (high volume)
CREATE TABLE claim_headers (
    ...
    service_date DATE NOT NULL
) PARTITION BY RANGE (service_date);

CREATE TABLE claim_headers_2025_10 PARTITION OF claim_headers
    FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- Similar for:
- remittance_headers (by received_at)
- audit_logs (by created_at)
- data_access_logs (by accessed_at)
- notification_logs (by created_at)
```

**Benefits**:
- Query performance (prune old partitions)
- Maintenance efficiency (drop old partitions)
- Backup/restore flexibility
- Storage management

---

### Generated Columns

**Pattern**: Computed columns for derived values

```sql
-- Auto-calculated totals
superbills.net_amount = gross_amount - discount_amount + tax_amount

-- Auto-calculated percentages
resource_utilization.utilization_percentage = 
    (total_used_minutes / total_available_minutes * 100)

-- Auto-calculated variances
underpayment_analysis.variance_amount = expected_amount - paid_amount
underpayment_analysis.variance_percentage = 
    ((expected_amount - paid_amount) / expected_amount * 100)
```

**Benefits**:
- Data consistency
- No application logic needed
- Always up-to-date
- Index-able for queries

---

## Security Architecture

### Row-Level Security (RLS)

**All tenant-scoped tables**:
```sql
USING (tenant_id = current_setting('app.current_tenant_id')::uuid)
```

**User-scoped tables** (MFA, trusted devices):
```sql
USING (user_id = current_setting('app.current_user_id')::uuid)
```

**Hierarchical RLS** (child tables):
```sql
USING (
    EXISTS (
        SELECT 1 FROM parent_table
        WHERE parent_table.id = child_table.parent_id
          AND parent_table.tenant_id = current_setting('app.current_tenant_id')::uuid
    )
)
```

---

### Encryption Strategy

| Data Type | Encryption Method | Key Management |
|-----------|-------------------|----------------|
| **At Rest** | AES-256 | AWS KMS / Azure Key Vault |
| **In Transit** | TLS 1.3 | Certificate rotation |
| **Field-Level** | Application-layer | Per-tenant keys |
| **Backups** | Encrypted snapshots | Separate keys |

**Encrypted Fields**:
- Emirates ID
- SSN/National ID
- Payment card data
- MFA secrets
- Backup codes

---

## Scalability Considerations

### Horizontal Scaling

**Read Replicas**:
- Reports and analytics → Read replicas
- Primary transactions → Primary database
- Async processing → Eventual consistency

**Sharding Strategy** (future):
- Shard by `tenant_id`
- Each shard handles subset of tenants
- Cross-shard queries avoided

### Caching Strategy

**Redis Caching**:
```typescript
// Cache user permissions (5-minute TTL)
cache:permissions:{tenant_id}:{user_id} → ['patients.read', 'claims.submit', ...]

// Cache patient demographics (15-minute TTL)
cache:patient:{patient_id} → {mrn, name, dob, ...}

// Cache fee schedules (1-hour TTL)
cache:fee_schedule:{payer_id}:{code} → {amount, effective_date}
```

---

## Data Retention & Archival

### Retention Policies

| Table Category | Retention Period | Archive Strategy |
|----------------|------------------|------------------|
| **Clinical records** | 10 years | Archive to S3 after 7 years |
| **Claims** | 10 years | Archive to S3 after 7 years |
| **Audit logs** | 7 years | Archive to S3 after 5 years |
| **Data access logs** | 3 years | Archive to S3 after 1 year |
| **Appointments** | 7 years | Archive to S3 after 5 years |
| **Notification logs** | 1 year | Delete after 1 year |

**Implementation**:
```sql
-- Automated archival function
CREATE OR REPLACE FUNCTION archive_old_data()
RETURNS VOID AS $$
DECLARE
    policy RECORD;
BEGIN
    FOR policy IN SELECT * FROM data_retention_policies WHERE is_active = true LOOP
        -- Archive to archived_data table
        -- Delete from source table
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Scheduled job (run monthly)
SELECT cron.schedule('archive-old-data', '0 0 1 * *', 'SELECT archive_old_data()');
```

---

## Summary Statistics

### By Category

| Category | Tables | Indexes | RLS Policies | Key Features |
|----------|--------|---------|--------------|--------------|
| **Core** | 10 | 25 | 10 | Multi-tenancy, audit |
| **RBAC** | 8 | 15 | 7 | Permissions, MFA |
| **Clinical** | 15 | 40 | 15 | SOAP, problems, care plans |
| **Orders** | 16 | 35 | 16 | Unified entry, results |
| **Master Data** | 4 | 12 | 4 | Catalogs, codes |
| **Billing** | 20 | 50 | 20 | Claims, denials, appeals |
| **Payments** | 15 | 40 | 15 | AR, collections, reconciliation |
| **Insurance** | 10 | 25 | 10 | Payers, networks, exemptions |
| **Scheduling** | 10 | 30 | 10 | Multi-resource, utilization |
| **Compliance** | 12 | 35 | 12 | Access logs, consents, breaches |
| **Terminology** | 5 | 10 | 5 | Code systems, value sets |
| **UAE-Specific** | 6 | 13 | 5 | Authorities, licenses, tariffs |
| **TOTAL** | **131** | **330** | **129** | Enterprise-grade healthcare platform |

---

## Integration Summary

### Inbound Integrations

| System | Protocol | Data | Frequency |
|--------|----------|------|-----------|
| Lab (LIS) | HL7 ORU | Lab results | Real-time |
| Imaging (PACS) | HL7 ORU | Imaging reports | Real-time |
| Pharmacy | NCPDP | Rx fills, status | Real-time |
| DHA | XML | ACK, remittance | Batch (daily) |
| DOH | XML | ACK, remittance | Batch (daily) |

### Outbound Integrations

| System | Protocol | Data | Frequency |
|--------|----------|------|-----------|
| Lab (LIS) | HL7 ORM | Lab orders | Real-time |
| Imaging (RIS) | HL7 ORM | Imaging orders | Real-time |
| Pharmacy | NCPDP SCRIPT | Prescriptions | Real-time |
| DHA eClaimLink | XML | Claims, prior auth | Batch (daily) |
| DOH Shafafiya | XML | Claims, prior auth | Batch (daily) |
| Clearinghouse | EDI | Claims | Batch (daily) |

---

## Compliance Checklist

### UAE PDPL ✅
- ✅ Data subject rights (access, rectification, deletion)
- ✅ Consent management with digital signatures
- ✅ Data breach notification within 72 hours
- ✅ Data processing agreements
- ✅ Access logging and audit trails
- ✅ Data residency in UAE regions

### DHA Requirements ✅
- ✅ eClaimLink integration
- ✅ Licensed provider tracking
- ✅ Batch submission with ACK processing
- ✅ XML schema compliance
- ✅ Prior authorization workflow

### DOH Requirements ✅
- ✅ Shafafiya integration
- ✅ Network provider validation
- ✅ Prior authorization tracking
- ✅ Remittance reconciliation

### HIPAA (International) ✅
- ✅ Access control (RBAC)
- ✅ Audit controls (data access logs)
- ✅ Encryption (at rest, in transit)
- ✅ Breach notification
- ✅ Minimum necessary rule

---

## Next Steps

1. **Review complete data model**: [05-Data-Model.md](./05-Data-Model.md)
2. **Understand clinical workflows**: [21-EMR-Clinical-Data-Capture.md](./21-EMR-Clinical-Data-Capture.md)
3. **Review RBAC design**: [20-RBAC-Access-Control.md](./20-RBAC-Access-Control.md)
4. **Check API specifications**: [04-Interfaces.md](./04-Interfaces.md)
5. **Deploy infrastructure**: [10-Deployment-&-Ops.md](./10-Deployment-&-Ops.md)
6. **Load seed data**: [../seed/README.md](../seed/README.md)

---

**© 2025 athma-ce Platform. All rights reserved.**

