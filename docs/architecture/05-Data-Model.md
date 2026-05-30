# Data Model

_Last updated: 21 Nov 2025_

This document describes the relational schema implemented across three separate PostgreSQL databases following ADR-0013 (Service Decomposition & Database Strategy):

- **Foundation Database** (`zeal_foundation`) – Tenants, users, facilities, staff, RBAC, specialties, and master catalogs
- **Clinical Database** (`zeal_clinical`) – Patients, appointments, encounters, clinical notes, diagnoses, orders, triage
- **RCM Database** (`zeal_rcm`) – Payers, policies, claims, encounter coverages, billing, and revenue cycle management

Every tenant-scoped table carries a `tenant_id` column and is protected by row-level security (ADR-0003). All timestamps use `TIMESTAMPTZ` for audit integrity. Composite indexes and unique constraints support the main query paths across multi-tenant operations.

---

## 1. Foundation Database (`zeal_foundation`)

### 1.1 Tenants & Users

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `tenants` | Top-level organization (clinic, hospital group, etc.). | `id`, `name`, `domain`, `status`, `settings` | Soft status (`active`, `inactive`); JSON settings hold regional preferences, identity config. |
| `users` | Application users scoped to a tenant. | `tenant_id`, `email`, `first_name`, `last_name`, `role`, `status`, `permissions`, `staff_id?`, `default_facility_id?` | Foreign keys to staff/facility allow linking to clinical identity and default location. Unique on `(tenant_id, email)`. |
| `user_facilities` | Grants user access to specific facilities. | `user_id`, `facility_id`, `access_level`, `is_default`, `granted_by`, `revoked_at?` | Enables multi-facility routing within a tenant. |
| `user_mfa_settings` | Toggle per-user multi-factor options. | `user_id`, TOTP/SMS/email flags, secrets | Enforces ADR-0005 requirements. |
| `user_mfa_backup_codes` | Hashed backup codes for MFA. | `user_id`, `code_hash`, `used_at` | No plaintext storage. |
| `user_mfa_attempts` | Audit trail of MFA verification attempts. | `user_id`, `method`, `success`, `ip_address`, `user_agent`, `created_at` | Supports anomaly detection. |
| `user_trusted_devices` | Remembered devices for MFA. | `user_id`, `device_fingerprint`, `device_name`, `expires_at`, `is_active` | Allows device revocation workflows. |

### 1.2 Facilities & Spatial Hierarchy

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `facilities` | Physical locations (hospital, clinic, diagnostic centre). | `tenant_id`, `name`, `facility_type`, `license_number`, address/contact fields, geo coords (`latitude`, `longitude`) | `facility_type` (clinic, hospital, lab, etc.) generalizes site types. Includes `floor_numbers[]`, `building_number`. |
| `departments` | Organizational units within a facility. | `facility_id`, `name`, `department_type`, `specialty_id`, `head_of_department` | Supports HOD assignment and specialty routing. |
| `wards` | Inpatient wards or units. | `department_id`, `name`, `ward_type`, `total_beds`, `available_beds` | For inpatient capacity tracking. |
| `beds` | Individual inpatient beds. | `ward_id`, `bed_number`, `bed_type`, `current_patient_id?`, `status` | `status` enumerations (available, occupied, maintenance). |
| `clinics` | Outpatient clinics within a department. | `department_id`, `name`, `code`, `specialty`, `total_rooms`, `operating_hours` | Used to group rooms/slots for scheduling. |
| `spaces` | Bookable physical spaces (rooms, suites, procedure areas). | `facility_id`, `department_id?`, `clinic_id?`, `space_type`, `equipment`, `capacity`, `is_active` | Multi-purpose to support ORs, consult rooms, imaging suites, etc. |

### 1.3 Staff & Specialties

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `staff` | Clinical and non-clinical staff profiles. | `tenant_id`, `employee_id`, `first_name`, `last_name`, `staff_type`, `license_number?`, `status`, `prefix`, `qualification`, `languages[]` | Linked to `users` when the staff member requires login. |
| `specialties` | Master list of clinical specialties. | `code`, `name`, `description`, `is_active`, `sort_order` | Tenant-agnostic; can be extended via translations. |
| `specialty_translations` | Localized specialty names/descriptions. | `specialty_id`, `lang`, `display_name`, `description` | Supports ADR-0004 multi-language requirements. |
| `specialty_codes_authority` | External authority mappings (DHA/DOH/etc.). | `specialty_id`, `authority`, `authority_code`, `authority_name?`, `is_active` | Enables interoperability with regulator code sets. |
| `staff_specialties` | Multi-tenant mapping of staff to specialties (and facilities). | `tenant_id`, `staff_id`, `specialty_id`, `facility_id`, `primary_flag` | Many-to-many; supports primary/secondary specialties per facility. |

### 1.4 RBAC & Security

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `roles` | Tenant-defined roles. | `tenant_id`, `code`, `name`, `description`, `is_system` | Unique `(tenant_id, code)` ensures clean management. |
| `permissions` | Action catalog (resource + action). | `code`, `name`, `resource`, `action` | Global list consumed by all tenants. |
| `role_permissions` | Role-to-permission mapping. | `role_id`, `permission_id` | Many-to-many join. |
| `user_roles` | Assigns roles to users. | `user_id`, `role_id`, `assigned_by`, `assigned_at`, `expires_at?`, `is_active` | Supports temporary elevation and audit. |

### 1.5 Configuration Management

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `instance_configs` | Global system-level configuration. | `config_key`, `value`, `value_type`, `category`, `is_overridable`, `is_sensitive` | Instance-wide settings (not tenant-specific). |
| `tenant_configs` | Tenant-level configuration overrides. | `tenant_id`, `config_key`, `value` | Allows per-tenant customization. |
| `facility_configs` | Facility-level configuration overrides. | `facility_id`, `config_key`, `value` | Granular facility-specific settings. |
| `config_audit_log` | Audit trail for configuration changes. | `config_level`, `config_key`, `entity_id?`, `old_value`, `new_value`, `changed_by`, `changed_at`, `change_reason` | Tracks all configuration modifications. |

### 1.6 ValueSets / Reference Data

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `value_sets` | Named collections of coded concepts. | `code`, `name`, `description`, `category`, `version`, `status`, `is_system`, `is_extensible`, `source`, `source_url` | System-wide reference data sets (e.g., "marital_status", "encounter_types"). |
| `value_set_concepts` | Individual concepts within value sets. | `value_set_id`, `value_set_code`, `code`, `display`, `definition`, `system_code`, `parent_id?`, `sort_order`, `is_default`, `status`, `effective_from`, `effective_to` | Hierarchical support via `parent_id`. |
| `value_set_concept_translations` | Localized display names for concepts. | `concept_id`, `language_code`, `display`, `definition` | Multi-language support for value set concepts. |
| `tenant_value_set_overrides` | Tenant-specific customizations to value sets. | `tenant_id`, `value_set_id`, `concept_id?`, `override_type`, `custom_display`, `custom_metadata`, `sort_order` | Allows tenants to hide, reorder, or rename concepts. |
| `value_set_history` | Audit trail for value set changes. | `entity_type`, `entity_id`, `action`, `old_values`, `new_values`, `changed_by`, `changed_at`, `change_reason` | Tracks modifications to value sets and concepts. |

### 1.7 Clinical Catalogs

#### 1.7.1 Medication Master

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `medication_master` | Global and tenant-specific medication catalog. | `tenant_id?`, `medication_name`, `generic_name`, `brand_name`, `ndc_code`, `atc_code`, `local_code`, `dosage_form`, `strength`, `route`, `manufacturer`, `drug_class`, `therapeutic_class`, `controlled_substance`, `controlled_class`, `requires_prescription`, `default_frequency`, `default_duration`, `contraindications[]`, `common_side_effects[]`, `drug_interactions[]`, `storage_requirements`, `is_active` | Supports NDC (National Drug Code), ATC (Anatomical Therapeutic Chemical), and local formulary codes. Controlled substance tracking. `tenant_id=NULL` for global medications. |

#### 1.7.2 Lab Test Master

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `lab_test_master` | Standardized lab test catalog with reference ranges. | `tenant_id?`, `test_name`, `loinc_code`, `cpt_code`, `local_code`, `test_category`, `test_subcategory`, `specimen_type`, `collection_method`, `fasting_required`, `fasting_duration_hours`, `preparation_instructions`, `normal_range_male`, `normal_range_female`, `normal_range_pediatric`, `units`, `methodology`, `turnaround_time_hours`, `reference_lab`, `is_active` | LOINC codes for clinical ordering, CPT codes for billing. Gender and age-specific reference ranges. |

| `observation_code_catalog` | Canonical observation and analyte dictionary used by result entry and analytics. | `tenant_id?`, `code`, `code_system`, `display_name`, `category`, `lab_domain?`, `data_type`, `default_unit`, `ref_range_low`, `ref_range_high`, `is_active` | Supports laboratory analytes such as WBC/RBC/HGB and differential components separately from orderable panels such as CBC. `lab_domain` drives data-driven picker sections such as hematology, chemistry, coagulation, and urinalysis. |

#### 1.7.3 Imaging Study Master

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `imaging_study_master` | Radiology and diagnostic imaging catalog. | `tenant_id?`, `study_name`, `cpt_code`, `local_code`, `modality`, `body_part`, `study_category`, `contrast_required`, `contrast_type`, `preparation_instructions`, `positioning_instructions`, `contraindications[]`, `radiation_dose`, `estimated_duration_minutes`, `facility_requirements`, `equipment_requirements`, `radiologist_required`, `is_active` | Modalities: X-ray, CT, MRI, Ultrasound, etc. |

#### 1.7.4 Procedure Master

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `procedure_master` | Medical and surgical procedures catalog. | `tenant_id?`, `procedure_name`, `cpt_code`, `icd10_pcs_code`, `local_code`, `procedure_category`, `body_system`, `procedure_type`, `anesthesia_type`, `facility_required`, `estimated_duration_minutes`, `preparation_instructions`, `post_procedure_instructions`, `risks_and_complications[]`, `contraindications[]`, `consent_required`, `consent_type`, `pre_procedure_requirements[]`, `post_procedure_monitoring`, `recovery_time_hours`, `is_active` | CPT and ICD-10-PCS codes. Consent tracking, pre/post-op requirements. |

#### 1.7.5 Diagnosis Master (ICD Codes)

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `diagnosis_versions` | ICD release metadata (versions). | `tenant_id?`, `code_set`, `version_label`, `release_date`, `description`, `import_status`, `import_notes`, `source_url`, `checksum`, `total_codes`, `imported_by`, `imported_at`, `is_active` | Tracks ICD-10-CM, ICD-10-PCS, ICD-11 releases. Supports version management. |
| `diagnosis_master` | ICD code catalog scoped by version and tenant. | `tenant_id?`, `version_id`, `code`, `code_type`, `short_description`, `description`, `chapter`, `block`, `category`, `subcategory`, `clinical_concepts[]`, `synonyms[]`, `search_terms[]`, `gender_restriction`, `age_range`, `is_billable`, `is_active`, `effective_from`, `effective_to` | Full ICD hierarchy with search optimization. Billability flags. |

#### 1.7.6 Note Templates

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `note_templates` | Reusable note templates for clinical documentation. | `tenant_id?`, `specialty_id?`, `name`, `description`, `status`, `current_version` | Defines SOAP notes, H&P templates, progress notes, discharge summaries, etc. Versioned. |
| `note_template_versions` | Versioned template schemas. | `template_id`, `version`, `schema`, `change_log`, `created_by` | JSONB schema defining sections and fields for structured documentation. |

---

## 2. Clinical Database (`zeal_clinical`)

### 2.1 Patient Management

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `patients` | Patient demographic and identity records. | `id`, `mrn`, `tenant_id`, `national_id`, `national_id_type`, `issuing_country`, `title`, `first_name`, `last_name`, `middle_name`, `display_name`, `date_of_birth`, `gender`, `marital_status`, `nationality`, `preferred_language`, `phone_number`, `email`, address fields, `blood_group`, `emergency_contact`, `insurance_info`, `created_by`, `created_at_facility`, `registration_source`, `status` | Country-agnostic identity system. MRN is unique identifier. Registration and update context tracked. |
| `patient_documents` | Identity documents and verification tracking. | `tenant_id`, `patient_id`, `document_type`, `document_number`, `issuing_country`, `issuing_authority`, `issue_date`, `expiry_date`, `is_primary_identity`, `document_url`, `verification_status`, `verified_by`, `verified_at`, `verification_notes` | Tracks national IDs, passports, visas, etc. with verification workflow. |
| `patient_history` | Audit trail for patient data changes. | `tenant_id`, `patient_id`, `field_name`, `old_value`, `new_value`, `change_type`, `change_reason`, `supporting_doc_url`, `changed_by`, `approved_by`, `changed_at_facility`, `patient_consent`, `consent_doc_url`, `ip_address`, `user_agent` | Full change history with consent tracking for compliance. |
| `patient_consents` | Patient consent management. | `tenant_id`, `patient_id`, `consent_type`, `consent_category`, `consent_status`, `consent_scope`, `purpose`, `description`, `legal_basis`, `effective_from`, `effective_until`, `is_active`, `capture_method`, `captured_by`, `captured_at_facility`, `signature_url`, `document_url`, `witnessed_by`, `witness_signature_url`, `revoked_at`, `revoked_by`, `revocation_reason`, `version`, `parent_consent_id`, `linked_entity_type`, `linked_entity_id` | Comprehensive consent lifecycle with versioning and revocation. |
| `consent_templates` | Reusable consent form templates. | `tenant_id`, `template_code`, `consent_type`, `consent_category`, `title`, `description`, `content`, `legal_text`, `is_required`, `requires_witness`, `validity_days`, `auto_renew`, `version`, `status`, `supersedes` | Multi-language consent templates (JSON for EN/AR content). |

### 2.2 Appointment Scheduling

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `appointments` | Patient appointments across providers/spaces. | `tenant_id`, `patient_id`, `facility_id`, `space_id?`, `staff_id?`, `appointment_type`, `status`, `start_time`, `end_time`, `duration`, `notes`, `visit_type`, `linked_encounter_id?`, `series_id?`, `cancellation_reason`, `reschedule_reason` | Supports multi-resource scheduling and encounter linkage. |
| `appointment_series` | Recurring appointment management. | `tenant_id`, `patient_id`, `series_name`, `appointment_type`, `recurrence_pattern`, `recurrence_rule`, `start_date`, `end_date`, `total_occurrences`, `occurrences_created`, `status` | RRULE format (RFC 5545) for complex recurrence patterns. |
| `appointment_resource_requirements` | Define resources needed per appointment type. | `tenant_id`, `appointment_type`, `resource_type`, `resource_role`, `resource_id?`, `is_required`, `min_quantity`, `max_quantity`, `min_duration_minutes`, `max_duration_minutes`, `preparation_time_minutes`, `cleanup_time_minutes` | Template for resource allocation rules. |
| `appointment_resources` | Actual resources assigned to appointments. | `tenant_id`, `appointment_id`, `resource_type`, `resource_id`, `resource_role`, `start_time`, `end_time`, `preparation_start`, `cleanup_end`, `status` | Tracks staff, equipment, space allocations. |

### 2.3 Resource Scheduling

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `staff_schedules` | Weekly recurring staff availability. | `tenant_id`, `staff_id`, `facility_id?`, `employee_id`, `staff_display_name`, `staff_type`, `day_of_week`, `start_time`, `end_time`, `is_available`, `schedule_type`, `effective_from`, `effective_to` | 0=Sunday, 6=Saturday. Supports schedule versioning with effective dates. |
| `equipment_schedules` | Weekly recurring equipment availability. | `tenant_id`, `equipment_id`, `facility_id?`, `day_of_week`, `start_time`, `end_time`, `is_available`, `maintenance_type`, `effective_from`, `effective_to` | Tracks equipment downtime and maintenance windows. |
| `space_schedules` | Weekly recurring space availability. | `tenant_id`, `space_id`, `facility_id?`, `day_of_week`, `start_time`, `end_time`, `is_available`, `block_reason`, `effective_from`, `effective_to` | Room/space blocking for maintenance or special events. |
| `resource_blocks` | One-time availability blocks. | `tenant_id`, `resource_type`, `resource_id`, `facility_id?`, `block_type`, `start_datetime`, `end_datetime`, `is_available`, `reason`, `approval_status`, `approved_by`, `approved_at` | Vacations, sick leave, emergency closures, maintenance. Requires approval workflow. |

### 2.4 Clinical Encounters

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `encounters` | Clinical encounter record (ambulatory/inpatient/emergency). | `id`, `encounter_number`, `tenant_id`, `patient_id`, `facility_id`, `appointment_id?`, `primary_staff_id`, `encounter_class`, `encounter_type`, `status`, `priority`, `start_time`, `end_time?`, `encounter_source`, `walk_in_details`, `chief_complaint`, `presenting_symptoms`, `vital_signs`, `allergies[]`, `current_medications[]`, `medical_history`, `social_history`, `family_history`, `notes`, `discharge_disposition`, `follow_up_instructions` | Core encounter metadata. `encounter_class` follows HL7 (AMB, IMP, EMER, etc.). JSON fields for flexible clinical data. |
| `triage` | Emergency/urgent care triage assessment. | `tenant_id`, `encounter_id`, `patient_id`, `triage_staff_id`, `triage_level`, `chief_complaints_and_hpi`, `vital_signs`, `pain_score`, `allergies[]`, `current_medications[]`, `triage_notes`, `triage_time` | Simple 1-5 triage level. One per encounter. |

### 2.5 Clinical Documentation

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `encounter_notes` | Note headers (one per type/language per encounter). | `tenant_id`, `encounter_id`, `patient_id`, `note_type`, `language`, `title`, `status`, `version`, `author_staff_id`, `co_sign_staff_id`, `signed_at`, `co_signed_at`, `amendment_reason`, `superseded_by` | Note types: SOAP, H&P, progress, discharge, procedure, consultation. Status: draft, final, amended, signed. Multi-language support. |
| `encounter_note_sections` | Flexible JSONB note sections. | `note_id`, `section_code`, `section_name`, `sort_order`, `content`, `is_empty` | Structured or free-text content. Sections: subjective, objective, assessment, plan, HPI, ROS, physical exam, etc. |
| `encounter_diagnoses` | ICD-10 diagnoses linked to encounters. | `tenant_id`, `encounter_id`, `patient_id`, `icd_code`, `icd_version`, `diagnosis_name`, `diagnosis_name_ar`, `diagnosis_type`, `diagnosis_rank`, `is_present_on_admission`, `is_chronic`, `onset_date`, `clinical_notes`, `diagnosed_by`, `diagnosed_at` | Primary, secondary, rule-out, differential. Ranked ordering. |

### 2.6 Clinical Orders

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `clinical_orders` | Lab, imaging, and procedure orders. | `tenant_id`, `encounter_id`, `patient_id`, `package_order_id`, `order_type`, `order_code`, `code_system`, `order_name`, `order_name_ar`, `priority`, `status`, `clinical_indication`, `special_instructions`, `result_status`, `result_data`, `result_notes`, `resulted_at`, `ordered_by`, `ordered_at`, `performed_by`, `performed_at` | Shared executable order header. Order types: lab, imaging, procedure. Code systems: LOINC, CPT, SNOMED. Full result tracking. |
| `package_orders` | Runtime package assignments. | `tenant_id`, `package_id`, `encounter_id`, `patient_id`, `ordered_by`, `ordered_at`, `status`, `notes` | Package catalog selection expanded into executable `clinical_orders`. |
| `lab_order_tests` | Per-test lab order details. | `tenant_id`, `order_id`, `lab_test_master_id`, `test_code`, `test_name`, `specimen_type`, `collection_method`, `fasting_required`, `status` | Ordering/execution detail rows under a lab `clinical_order`. |
| `lab_specimens` | Collected physical samples. | `tenant_id`, `order_id`, `specimen_type`, `container_type`, `collection_site`, `barcode`, `collected_at`, `status` | Post-order specimen lifecycle begins here. |
| `lab_specimen_tests` | Specimen-to-test links. | `tenant_id`, `specimen_id`, `lab_order_test_id`, `status` | Allows one specimen to satisfy one or more ordered lab tests. |
| `lab_accessions` | Lab receiving and accession records. | `tenant_id`, `specimen_id`, `accession_number`, `received_at`, `receiving_location`, `accessioned_at`, `status` | Separate physical receiving from LIS accessioning. |
| `lab_specimen_events` | Operational specimen audit trail. | `tenant_id`, `specimen_id`, `event_type`, `event_time`, `performed_by`, `metadata` | Captures collection, receiving, accessioning, rejection, processing, and result-entry milestones. |
| `lab_processing_runs` | Processing/analyzer execution context. | `tenant_id`, `specimen_id`, `lab_order_test_id`, `run_type`, `instrument_code`, `instrument_run_id`, `status`, `raw_payload` | Manual or analyzer-linked workflow per specimen and ordered test. |
| `prescription_orders` | Medication prescriptions. | `tenant_id`, `encounter_id`, `patient_id`, `drug_code`, `code_system`, `drug_name`, `drug_name_ar`, `generic_name`, `dosage`, `route`, `frequency`, `duration`, `quantity`, `refills`, `instructions`, `instructions_ar`, `status`, `prescribed_by`, `prescribed_at` | NDC, RxNorm, or local formulary codes. Multi-language instructions. |

### 2.7 AI Integration

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `ai_note_suggestions` | AI-generated clinical suggestions. | `tenant_id`, `encounter_id`, `model_version`, `suggestion_type`, `suggested_content`, `confidence_score`, `status`, `reviewed_by`, `reviewed_at` | Future AI integration for note drafting, diagnosis suggestions, order recommendations. User review workflow. |

---

## 3. RCM Database (`zeal_rcm`)

### 3.1 Payer Management

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `payers` | Insurance companies and third-party payers. | `tenant_id`, `payer_name`, `payer_id`, `payer_type`, `contact_info`, `configuration`, `status` | Contact and configuration stored as JSON. Status: active, inactive. |
| `policies` | Patient insurance policies. | `tenant_id`, `patient_id`, `policy_number`, `group_number`, `payer_name`, `payer_id`, `relationship`, `effective_date`, `expiration_date`, `benefits`, `is_primary`, `status` | Links patients to payers. `patient_id` references Clinical DB (cross-database logical FK). Benefits stored as JSON. |

### 3.2 Encounter Coverage

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `encounter_coverages` | Financial coverage snapshot per encounter. | `tenant_id`, `encounter_id`, `patient_id`, `policy_id?`, `payer_id?`, `financial_class`, `coverage_level`, `plan_name`, `member_id`, `member_name`, `network_name`, `copay_amount`, `coinsurance_pct`, `deductible_snapshot`, `benefits_snapshot`, `eligibility_request_id?`, `preauth_request_id?`, `cost_estimate_id?`, `is_active` | Links encounters to financial coverage. Financial class: insurance, corporate, TPA, cash, government. Coverage level: primary, secondary, tertiary, self_pay. Snapshots freeze policy data at encounter time. |

### 3.3 Claims Management

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `claims` | Billing claims submitted to payers. | `tenant_id`, `claim_number`, `status`, `payer_id`, `patient_id`, `encounter_id?`, `total_amount`, `currency`, `service_date`, `submitted_at`, `adjudicated_at` | Status workflow: draft, submitted, adjudicated, paid, rejected. Cross-references Clinical and RCM entities. |

---

## 4. Cross-Database Relationships

**Critical Rules (ADR-0013):**
- **No direct SQL joins across databases**
- **Cross-domain communication uses REST APIs or events**
- **Foundation database is the source of truth for master data** (tenants, staff, facilities, catalogs)
- **All services reference Foundation via UUIDs and API calls**

### 4.1 Logical Foreign Keys

| Source DB | Table | Field | References | Target DB | Notes |
| --- | --- | --- | --- | --- | --- |
| Clinical | `patients` | `created_by` | `staff.id` | Foundation | Staff who registered patient |
| Clinical | `patients` | `created_at_facility` | `facilities.id` | Foundation | Facility where registered |
| Clinical | `appointments` | `facility_id` | `facilities.id` | Foundation | Appointment location |
| Clinical | `appointments` | `staff_id` | `staff.id` | Foundation | Appointed provider |
| Clinical | `encounters` | `facility_id` | `facilities.id` | Foundation | Encounter facility |
| Clinical | `encounters` | `primary_staff_id` | `staff.id` | Foundation | Primary clinician |
| RCM | `policies` | `patient_id` | `patients.id` | Clinical | Patient with policy |
| RCM | `encounter_coverages` | `encounter_id` | `encounters.id` | Clinical | Encounter being billed |
| RCM | `encounter_coverages` | `patient_id` | `patients.id` | Clinical | Patient being billed |
| RCM | `claims` | `patient_id` | `patients.id` | Clinical | Patient for claim |
| RCM | `claims` | `encounter_id` | `encounters.id` | Clinical | Encounter being claimed |

### 4.2 Resolution Pattern

When a service needs data from another domain:
1. **Store the UUID** of the foreign entity
2. **Fetch via REST API** from the owning service
3. **Cache frequently accessed reference data** (e.g., facility names, staff display names)
4. **Use events** for async workflows (e.g., encounter created → billing notification)

Example: Clinical service displaying appointment with staff name:
```typescript
// Clinical DB has appointment with staff_id (UUID)
const appointment = await clinicalDb.appointment.findUnique({ where: { id } });

// Fetch staff details from Foundation service via API
const staff = await foundationApi.get(`/api/v1/staff/${appointment.staff_id}`);

// Merge for display
return {
  ...appointment,
  staffName: staff.displayName,
};
```

---

## 5. Indexing Strategy

### 5.1 Tenant Isolation
Every tenant-owned table has a composite index on `(tenant_id, ...)` to support:
- Row-level security pruning
- High-selectivity tenant-scoped queries
- Multi-tenant query optimization

### 5.2 Common Index Patterns

| Index Type | Pattern | Example | Purpose |
| --- | --- | --- | --- |
| Tenant + Primary Entity | `(tenant_id, entity_id)` | `(tenant_id, patient_id)` | Fast lookups within tenant scope |
| Tenant + Foreign Key | `(tenant_id, foreign_key)` | `(tenant_id, facility_id)` | Filter by relationship |
| Tenant + Status/Type | `(tenant_id, status)` | `(tenant_id, appointment_status)` | Filter by state |
| Tenant + Temporal | `(tenant_id, timestamp)` | `(tenant_id, start_time)` | Date range queries |
| Composite Unique | `(tenant_id, unique_field)` | `(tenant_id, mrn)` | Enforce uniqueness per tenant |
| Search Terms | `GIN(search_array)` | `GIN(search_terms)` | Full-text search on arrays |
| Geographic | `(latitude, longitude)` | Facility geocoding | Proximity searches |

### 5.3 Specialized Indexes

- **Diagnosis search**: `(tenant_id, code)`, `(chapter)`, `GIN(search_terms)`
- **Medication search**: `(ndc_code)`, `(atc_code)`, `(generic_name)`, `(tenant_id, local_code)`
- **Lab/Imaging**: `(loinc_code)`, `(cpt_code)`, `(tenant_id, local_code)`
- **Encounter tracking**: `(tenant_id, patient_id, primary_staff_id, start_time)`
- **Financial class**: `(tenant_id, financial_class)`, `(tenant_id, coverage_level)`

---

## 6. Multi-Tenancy & Security

### 6.1 Row-Level Security
- Every query filtered by `tenant_id` via Prisma middleware
- Prisma middleware automatically injects tenant scope
- HTTP middleware validates tenant context from headers: `x-tenant-id`, `x-user-id`, `x-facility-id`

### 6.2 Tenant-Agnostic Tables
These tables do NOT have `tenant_id` and are shared globally:
- `permissions` (Foundation)
- `specialties` (Foundation)
- `specialty_translations` (Foundation)
- `value_sets` (Foundation - unless tenant-specific)
- `value_set_concepts` (Foundation - unless tenant-specific)

Global catalog tables (`medication_master`, `lab_test_master`, etc.) support `tenant_id = NULL` for global entries and non-NULL for tenant-specific formularies.

---

## 7. Multi-Language Support (ADR-0004)

### 7.1 Translation Strategy

| Domain | Table | Translation Fields | Notes |
| --- | --- | --- | --- |
| Foundation | `specialty_translations` | `display_name`, `description` | Per-specialty translations |
| Foundation | `value_set_concept_translations` | `display`, `definition` | Value set concept translations |
| Foundation | `note_templates` | `title`, `description`, `content` (JSON) | Multi-language template content |
| Clinical | `encounter_diagnoses` | `diagnosis_name_ar` | Arabic diagnosis display |
| Clinical | `clinical_orders` | `order_name_ar` | Arabic order display |
| Clinical | `prescription_orders` | `drug_name_ar`, `instructions_ar` | Arabic medication instructions |
| Clinical | `consent_templates` | `title`, `description`, `content`, `legal_text` (all JSON) | Multi-language consent forms |

### 7.2 Language Codes
- ISO 639-1: `en` (English), `ar` (Arabic), `fr` (French)
- Fallback mechanism: If translation missing, fall back to English
- Frontend uses `next-intl` for UI translations

---

## 8. Audit & Compliance

### 8.1 Audit Trail Tables

| Table | Database | Purpose |
| --- | --- | --- |
| `patient_history` | Clinical | Tracks all patient data changes with consent |
| `config_audit_log` | Foundation | Tracks configuration changes |
| `value_set_history` | Foundation | Tracks value set modifications |
| `user_mfa_attempts` | Foundation | MFA authentication attempts |

### 8.2 PHI Protection
- **Patient Health Information (PHI)** resides only in Clinical and RCM databases
- **Audit logging** for all clinical data access (future: Analytics database)
- **Change history** with `changed_by`, `changed_at_facility`, `ip_address`, `user_agent`
- **Consent tracking** with electronic signatures and witness support

---

## 9. Temporal & Versioning Patterns

### 9.1 Effective Dating
- `staff_schedules`: `effective_from`, `effective_to`
- `resource_blocks`: `start_datetime`, `end_datetime`
- `patient_consents`: `effective_from`, `effective_until`
- `value_set_concepts`: `effective_from`, `effective_to`
- `diagnosis_master`: `effective_from`, `effective_to`

### 9.2 Versioning
- **Note templates**: `current_version`, related `note_template_versions` table
- **Encounter notes**: `version`, `superseded_by` for amendments
- **Patient consents**: `version`, `parent_consent_id` for revisions
- **Consent templates**: `version`, `supersedes` for template evolution
- **Diagnosis versions**: `diagnosis_versions` tracks ICD releases

### 9.3 Soft Deletion
- Most tables use `status` or `is_active` flags instead of hard deletes
- `encounter_coverages`: Soft delete via `is_active = false`
- `payers`, `policies`: `status` field (active, inactive)
- `patients`, `staff`: `status` field (active, inactive, deceased)

---

## 10. Future Expansion

As new services come online:
- Create domain-specific tables in separate databases with the same `tenant_id` conventions and RLS policies
- Publish field-level schemas through `@zeal/contracts` to keep services, frontend, and data warehouse in sync
- Update this document when new tables are introduced

**Planned domains:**
- **Analytics Database** (`zeal_analytics`) - Append-only audit logs, usage metrics, reporting aggregates
- **Orders Service** - Lab results, imaging reports, procedure documentation
- **Pharmacy Service** - Inventory, dispensing, drug interactions
- **Billing Service** - Invoice generation, payment processing, revenue reporting

---

## Document Changelog

| Date | Changes | Author |
| --- | --- | --- |
| 06 Oct 2025 | Initial version | - |
| 21 Nov 2025 | Comprehensive update: Added all Foundation catalogs (medications, lab tests, imaging, procedures, diagnosis), Clinical documentation models (notes, diagnoses, orders, triage), RCM tables (payers, policies, claims, encounter coverages), scheduling models, configuration management, ValueSets, and detailed cross-database relationship patterns. | Claude Code |
