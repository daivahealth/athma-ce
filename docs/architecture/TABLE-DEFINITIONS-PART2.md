# Table Definitions Reference - Part 2

_Continued from [TABLE-DEFINITIONS.md](./TABLE-DEFINITIONS.md)_

_Last updated: 21 Nov 2025_

This document continues the detailed field-level definitions for Clinical and RCM databases.

---

## 2.2 Appointment Scheduling (continued)

### `appointment_series`
Recurring appointment management

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique series identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `patient_id` | UUID | FK → patients.id, Cascade | Patient reference |
| `series_name` | String(200) | Nullable | Series name |
| `appointment_type` | String(100) | Required | Type of appointments in series |
| `recurrence_pattern` | String(50) | Required | daily, weekly, monthly, custom |
| `recurrence_rule` | Text | Nullable | RRULE format (RFC 5545) |
| `start_date` | Date | Required | Series start date |
| `end_date` | Date | Nullable | Series end date |
| `total_occurrences` | Integer | Nullable | Total planned occurrences |
| `occurrences_created` | Integer | Default: 0 | Number created so far |
| `status` | String(20) | Default: "active" | active, paused, completed, cancelled |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, patient_id)`, `(start_date, end_date)`, `status`

---

### `appointment_resource_requirements`
Define what resources are needed for appointment types

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique requirement identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `appointment_type` | String(100) | Required | Appointment type |
| `resource_type` | String(50) | Required | staff, equipment, space |
| `resource_role` | String(100) | Nullable | Required role (e.g., "cardiologist", "MRI machine") |
| `resource_id` | UUID | Nullable | Specific resource ID (null = any matching role) |
| `is_required` | Boolean | Default: true | Whether resource is required |
| `min_quantity` | Integer | Default: 1 | Minimum quantity needed |
| `max_quantity` | Integer | Default: 1 | Maximum quantity needed |
| `min_duration_minutes` | Integer | Default: 30 | Minimum duration |
| `max_duration_minutes` | Integer | Nullable | Maximum duration |
| `preparation_time_minutes` | Integer | Default: 0 | Setup time before |
| `cleanup_time_minutes` | Integer | Default: 0 | Cleanup time after |
| `notes` | Text | Nullable | Additional notes |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, appointment_type)`, `resource_type`, `resource_role`

---

### `appointment_resources`
Actual resources assigned to appointments

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique assignment identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `appointment_id` | UUID | FK → appointments.id, Cascade | Appointment reference |
| `resource_type` | String(50) | Required | staff, equipment, space |
| `resource_id` | UUID | Required | Resource identifier (Foundation/Clinical DB) |
| `resource_role` | String(100) | Nullable | Resource role |
| `start_time` | Timestamptz | Required | Resource start time |
| `end_time` | Timestamptz | Required | Resource end time |
| `preparation_start` | Timestamptz | Nullable | Preparation start time |
| `cleanup_end` | Timestamptz | Nullable | Cleanup end time |
| `status` | String(20) | Default: "allocated" | allocated, confirmed, in_use, completed, cancelled |
| `notes` | Text | Nullable | Notes |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, appointment_id)`, `(resource_type, resource_id)`, `(start_time, end_time)`, `status`

---

## 2.3 Resource Scheduling

### `staff_schedules`
Weekly recurring staff availability

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique schedule identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `staff_id` | UUID | Required | Staff ID (Foundation DB reference) |
| `facility_id` | UUID | Nullable | Facility ID (Foundation DB reference) |
| `employee_id` | String(50) | Nullable | Employee ID for denormalization |
| `staff_display_name` | String(200) | Nullable | Staff name for denormalization |
| `staff_type` | String(50) | Nullable | Staff type for filtering |
| `day_of_week` | Integer | Required | 0=Sunday, 1=Monday, ..., 6=Saturday |
| `start_time` | String | Required | Start time (HH:MM format) |
| `end_time` | String | Required | End time (HH:MM format) |
| `is_available` | Boolean | Default: true | Whether available |
| `schedule_type` | String(50) | Default: "regular" | regular, on_call, flex |
| `notes` | Text | Nullable | Schedule notes |
| `effective_from` | Date | Default: today | Effective start date |
| `effective_to` | Date | Nullable | Effective end date |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Unique: `(staff_id, day_of_week, start_time, effective_from)`
- Indexes: `(tenant_id, staff_id)`, `(day_of_week, start_time)`, `(effective_from, effective_to)`, `facility_id`

---

### `equipment_schedules`
Weekly recurring equipment availability

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique schedule identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `equipment_id` | UUID | Required | Equipment ID |
| `facility_id` | UUID | Nullable | Facility ID |
| `day_of_week` | Integer | Required | 0=Sunday, 1=Monday, ..., 6=Saturday |
| `start_time` | String | Required | Start time (HH:MM) |
| `end_time` | String | Required | End time (HH:MM) |
| `is_available` | Boolean | Default: true | Whether available |
| `maintenance_type` | String(50) | Nullable | preventive, corrective, calibration |
| `notes` | Text | Nullable | Notes |
| `effective_from` | Date | Default: today | Effective start date |
| `effective_to` | Date | Nullable | Effective end date |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Unique: `(equipment_id, day_of_week, start_time, effective_from)`
- Indexes: `(tenant_id, equipment_id)`, `(day_of_week, start_time)`, `(effective_from, effective_to)`, `maintenance_type`

---

### `space_schedules`
Weekly recurring space availability

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique schedule identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `space_id` | UUID | Required | Space ID (Foundation DB reference) |
| `facility_id` | UUID | Nullable | Facility ID |
| `day_of_week` | Integer | Required | 0=Sunday, 1=Monday, ..., 6=Saturday |
| `start_time` | String | Required | Start time (HH:MM) |
| `end_time` | String | Required | End time (HH:MM) |
| `is_available` | Boolean | Default: true | Whether available |
| `block_reason` | String(100) | Nullable | maintenance, renovation, special_event |
| `notes` | Text | Nullable | Notes |
| `effective_from` | Date | Default: today | Effective start date |
| `effective_to` | Date | Nullable | Effective end date |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Unique: `(space_id, day_of_week, start_time, effective_from)`
- Indexes: `(tenant_id, space_id)`, `(day_of_week, start_time)`, `(effective_from, effective_to)`

---

### `resource_blocks`
One-time availability blocks (vacations, maintenance, emergencies)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique block identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `resource_type` | String(50) | Required | staff, equipment, space |
| `resource_id` | UUID | Required | Resource identifier |
| `facility_id` | UUID | Nullable | Facility ID |
| `block_type` | String(50) | Required | vacation, sick_leave, maintenance, emergency, special_event |
| `start_datetime` | Timestamptz | Required | Block start |
| `end_datetime` | Timestamptz | Required | Block end |
| `is_available` | Boolean | Default: false | Usually false for blocks |
| `reason` | Text | Nullable | Block reason |
| `approval_status` | String(20) | Default: "pending" | pending, approved, rejected |
| `approved_by` | UUID | Nullable | User who approved |
| `approved_at` | Timestamptz | Nullable | Approval timestamp |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, resource_type, resource_id)`, `(start_datetime, end_datetime)`, `block_type`, `approval_status`

---

## 2.4 Clinical Encounters

### `encounters`
Clinical encounter record (ambulatory/inpatient/emergency)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique encounter identifier |
| `encounter_number` | String(50) | Unique | Human-readable encounter number |
| `tenant_id` | UUID | Required | Tenant association |
| `patient_id` | UUID | FK → patients.id, Cascade | Patient reference |
| `facility_id` | UUID | Required | Facility (Foundation DB reference) |
| `appointment_id` | UUID | FK → appointments.id, Nullable | Associated appointment |
| `primary_staff_id` | UUID | Required | Primary clinician (Foundation DB reference) |
| `encounter_class` | String | Default: "AMB" | AMB (ambulatory), IMP (inpatient), EMER (emergency), following HL7 |
| `encounter_type` | String(50) | Default: "outpatient" | outpatient, inpatient, emergency, urgent_care |
| `status` | String | Default: "planned" | planned, in_progress, finished, cancelled |
| `priority` | String | Default: "routine" | routine, urgent, asap, emergency |
| `start_time` | Timestamptz | Required | Encounter start time |
| `end_time` | Timestamptz | Nullable | Encounter end time |
| `encounter_source` | String | Default: "appointment" | appointment, walk_in, referral, transfer |
| `walk_in_details` | JSON | Nullable | Walk-in specific details |
| `chief_complaint` | String | Nullable | Chief complaint |
| `presenting_symptoms` | String | Nullable | Presenting symptoms |
| `vital_signs` | JSON | Default: {} | Vital signs data |
| `allergies` | JSON | Default: [] | Allergy list |
| `current_medications` | JSON | Default: [] | Current medications |
| `medical_history` | String | Nullable | Medical history |
| `social_history` | String | Nullable | Social history |
| `family_history` | String | Nullable | Family history |
| `notes` | String | Nullable | General notes |
| `discharge_disposition` | String | Nullable | Discharge disposition |
| `follow_up_instructions` | String | Nullable | Follow-up instructions |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `encounter_number`
- Indexes: `(tenant_id, patient_id)`, `(tenant_id, start_time)`, `(tenant_id, status)`, `(tenant_id, patient_id, primary_staff_id, start_time)`

---

### `triage`
Emergency/urgent care triage assessment

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique triage identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `encounter_id` | UUID | Unique, FK → encounters.id, Cascade | Encounter reference (one-to-one) |
| `patient_id` | UUID | Required | Patient reference |
| `triage_staff_id` | UUID | Required | Triage nurse/staff (Foundation DB reference) |
| `triage_level` | Integer | Required | 1-5 triage priority (1=critical, 5=non-urgent) |
| `chief_complaints_and_hpi` | Text | Required | Combined chief complaints and HPI |
| `vital_signs` | JSON | Default: {} | Vital signs at triage |
| `pain_score` | Integer | Nullable | Pain score (0-10) |
| `allergies` | JSON | Default: [] | Known allergies |
| `current_medications` | JSON | Default: [] | Current medications |
| `triage_notes` | Text | Nullable | Triage notes |
| `triage_time` | Timestamptz | Default: now() | Triage timestamp |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `encounter_id`
- Indexes: `encounter_id`, `(tenant_id, patient_id)`, `(tenant_id, triage_level)`, `(tenant_id, triage_time)`

---

## 2.5 Clinical Documentation

### `encounter_notes`
Note headers (one per type/language per encounter)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique note identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `encounter_id` | UUID | FK → encounters.id, Cascade | Encounter reference |
| `patient_id` | UUID | Required | Patient reference |
| `note_type` | String(50) | Required | soap, h_and_p, progress, discharge, procedure, consultation |
| `language` | String(2) | Default: "en" | Language code (ISO 639-1: en, ar) |
| `title` | String(200) | Nullable | Note title |
| `status` | String(20) | Default: "draft" | draft, final, amended, signed |
| `version` | Integer | Default: 1 | Note version |
| `author_staff_id` | UUID | Required | Author staff (Foundation DB reference) |
| `co_sign_staff_id` | UUID | Nullable | Co-signer staff |
| `signed_at` | Timestamptz | Nullable | Signing timestamp |
| `co_signed_at` | Timestamptz | Nullable | Co-signing timestamp |
| `amendment_reason` | Text | Nullable | Reason for amendment |
| `superseded_by` | UUID | Nullable | ID of note that supersedes this one |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, encounter_id)`, `(tenant_id, patient_id)`, `(tenant_id, note_type, status)`, `(tenant_id, author_staff_id)`

---

### `encounter_note_sections`
Flexible JSONB note sections

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique section identifier |
| `note_id` | UUID | FK → encounter_notes.id, Cascade | Note reference |
| `section_code` | String(50) | Required | subjective, objective, assessment, plan, hpi, ros, physical_exam |
| `section_name` | String(100) | Required | Section display name |
| `sort_order` | Integer | Default: 0 | Display order |
| `content` | JSON | Required | Section content (structured or free-text) |
| `is_empty` | Boolean | Default: false | Whether section is empty |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Index: `(note_id, sort_order)`

---

### `encounter_diagnoses`
ICD-10 diagnoses linked to encounters

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique diagnosis identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `encounter_id` | UUID | FK → encounters.id, Cascade | Encounter reference |
| `patient_id` | UUID | Required | Patient reference |
| `icd_code` | String(20) | Required | ICD-10 code |
| `icd_version` | String(20) | Default: "ICD-10" | ICD version |
| `diagnosis_name` | String(500) | Required | Diagnosis name (English) |
| `diagnosis_name_ar` | String(500) | Nullable | Diagnosis name (Arabic) |
| `diagnosis_type` | String(50) | Required | primary, secondary, rule_out, differential |
| `diagnosis_rank` | Integer | Nullable | Ranking (1 = primary, 2+ = secondary) |
| `is_present_on_admission` | Boolean | Default: false | Present on admission flag |
| `is_chronic` | Boolean | Default: false | Chronic condition flag |
| `onset_date` | Date | Nullable | Onset date |
| `clinical_notes` | Text | Nullable | Clinical notes |
| `diagnosed_by` | UUID | Required | Diagnosing staff (Foundation DB reference) |
| `diagnosed_at` | Timestamptz | Default: now() | Diagnosis timestamp |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, encounter_id)`, `(tenant_id, patient_id)`, `(tenant_id, icd_code)`, `(tenant_id, diagnosis_type)`

---

## 2.6 Clinical Orders

### `clinical_orders`
Lab, imaging, and procedure orders

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique order identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `encounter_id` | UUID | FK → encounters.id, Cascade | Encounter reference |
| `patient_id` | UUID | Required | Patient reference |
| `order_type` | String(50) | Required | lab, imaging, procedure |
| `order_code` | String(50) | Required | LOINC, CPT, SNOMED code |
| `code_system` | String(20) | Required | LOINC, CPT, SNOMED |
| `order_name` | String(500) | Required | Order name (English) |
| `order_name_ar` | String(500) | Nullable | Order name (Arabic) |
| `priority` | String(20) | Default: "routine" | stat, urgent, routine |
| `status` | String(20) | Default: "ordered" | ordered, in_progress, completed, cancelled |
| `clinical_indication` | Text | Nullable | Clinical indication |
| `special_instructions` | Text | Nullable | Special instructions |
| `result_status` | String(20) | Nullable | pending, preliminary, final, amended |
| `result_data` | JSON | Nullable | Structured results |
| `result_notes` | Text | Nullable | Result notes |
| `resulted_at` | Timestamptz | Nullable | Result timestamp |
| `ordered_by` | UUID | Required | Ordering staff (Foundation DB reference) |
| `ordered_at` | Timestamptz | Default: now() | Order timestamp |
| `performed_by` | UUID | Nullable | Performing staff |
| `performed_at` | Timestamptz | Nullable | Performance timestamp |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, encounter_id)`, `(tenant_id, patient_id)`, `(tenant_id, order_type, status)`, `(tenant_id, order_code)`

---

### `prescription_orders`
Medication prescriptions

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique prescription identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `encounter_id` | UUID | FK → encounters.id, Cascade | Encounter reference |
| `patient_id` | UUID | Required | Patient reference |
| `drug_code` | String(50) | Required | NDC, RxNorm, or local code |
| `code_system` | String(20) | Default: "NDC" | NDC, RxNorm, local |
| `drug_name` | String(500) | Required | Drug name (English) |
| `drug_name_ar` | String(500) | Nullable | Drug name (Arabic) |
| `generic_name` | String(500) | Nullable | Generic name |
| `dosage` | String(100) | Required | Dosage (e.g., 500mg) |
| `route` | String(50) | Required | oral, IV, IM, topical, inhalation |
| `frequency` | String(100) | Required | Frequency (e.g., twice daily, BID) |
| `duration` | String(100) | Nullable | Duration (e.g., 7 days, 2 weeks) |
| `quantity` | String(50) | Nullable | Quantity |
| `refills` | Integer | Default: 0 | Number of refills |
| `instructions` | Text | Nullable | Patient instructions (English) |
| `instructions_ar` | Text | Nullable | Patient instructions (Arabic) |
| `status` | String(20) | Default: "active" | active, completed, cancelled, discontinued |
| `prescribed_by` | UUID | Required | Prescribing staff (Foundation DB reference) |
| `prescribed_at` | Timestamptz | Default: now() | Prescription timestamp |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, encounter_id)`, `(tenant_id, patient_id)`, `(tenant_id, drug_code)`, `(tenant_id, status)`

---

## 2.7 AI Integration

### `ai_note_suggestions`
AI-generated clinical suggestions

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique suggestion identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `encounter_id` | UUID | FK → encounters.id, Cascade | Encounter reference |
| `model_version` | String(50) | Required | AI model version |
| `suggestion_type` | String(50) | Required | note_draft, diagnosis, order, medication |
| `suggested_content` | JSON | Required | AI-generated content |
| `confidence_score` | Float | Nullable | Confidence score (0.0-1.0) |
| `status` | String(20) | Default: "pending" | pending, accepted, rejected, modified |
| `reviewed_by` | UUID | Nullable | Staff who reviewed (Foundation DB reference) |
| `reviewed_at` | Timestamptz | Nullable | Review timestamp |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, encounter_id)`, `(tenant_id, status)`

---

# 3. RCM Database (`zeal_rcm`)

## 3.1 Payer Management

### `payers`
Insurance companies and third-party payers

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique payer identifier |
| `tenant_id` | UUID | Required | Tenant association (Foundation DB reference) |
| `payer_name` | String(255) | Required | Payer name |
| `payer_id` | String(100) | Nullable | External payer ID |
| `payer_type` | String(50) | Nullable | insurance, government, corporate, tpa |
| `contact_info` | JSON | Default: {} | Contact information |
| `configuration` | JSON | Default: {} | Payer-specific configuration |
| `status` | String(50) | Default: "active" | active, inactive, suspended |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, status)`, `payer_id`

---

### `policies`
Patient insurance policies

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique policy identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `patient_id` | UUID | Required | Patient ID (Clinical DB reference - logical FK) |
| `policy_number` | String(100) | Required | Policy number |
| `group_number` | String(100) | Nullable | Group number |
| `payer_name` | String(255) | Required | Payer name (denormalized) |
| `payer_id` | UUID | FK → payers.id | Payer reference |
| `relationship` | String(50) | Nullable | self, spouse, child, parent, other |
| `effective_date` | Date | Nullable | Policy effective date |
| `expiration_date` | Date | Nullable | Policy expiration date |
| `benefits` | JSON | Default: {} | Benefit details |
| `is_primary` | Boolean | Default: false | Whether primary insurance |
| `status` | String(50) | Default: "active" | active, inactive, expired, cancelled |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, patient_id)`, `(tenant_id, status)`, `payer_id`

---

## 3.2 Encounter Coverage

### `encounter_coverages`
Financial coverage snapshot per encounter

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique coverage identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `encounter_id` | UUID | Required | Encounter ID (Clinical DB reference - logical FK) |
| `patient_id` | UUID | Required | Patient ID (Clinical DB reference - logical FK) |
| `policy_id` | UUID | FK → policies.id, SetNull, Nullable | Policy reference (may be null for self-pay) |
| `payer_id` | UUID | FK → payers.id, SetNull, Nullable | Payer reference |
| `financial_class` | String(30) | Required | insurance, corporate, tpa, cash, government |
| `coverage_level` | String(20) | Default: "primary" | primary, secondary, tertiary, self_pay |
| `plan_name` | String(255) | Nullable | Plan name snapshot |
| `member_id` | String(100) | Nullable | Member ID snapshot |
| `member_name` | String(255) | Nullable | Member name snapshot |
| `network_name` | String(255) | Nullable | Network name snapshot |
| `copay_amount` | Decimal(10,2) | Nullable | Copay amount |
| `coinsurance_pct` | Decimal(5,2) | Nullable | Coinsurance percentage |
| `deductible_snapshot` | JSON | Nullable | Deductible details snapshot |
| `benefits_snapshot` | JSON | Nullable | Benefits snapshot |
| `eligibility_request_id` | UUID | Nullable | Eligibility verification request ID |
| `preauth_request_id` | UUID | Nullable | Pre-authorization request ID |
| `cost_estimate_id` | UUID | Nullable | Cost estimate ID |
| `is_active` | Boolean | Default: true | Whether coverage is active |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, encounter_id)`, `(tenant_id, patient_id)`, `policy_id`, `payer_id`, `(tenant_id, financial_class)`, `(tenant_id, coverage_level)`

---

## 3.3 Claims Management

### `claims`
Billing claims submitted to payers

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique claim identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `claim_number` | String(50) | Required | Human-readable claim number |
| `status` | String | Default: "draft" | draft, submitted, adjudicated, paid, rejected, appealed |
| `payer_id` | UUID | FK → payers.id, SetNull, Nullable | Payer reference |
| `patient_id` | UUID | Required | Patient ID (Clinical DB reference - logical FK) |
| `encounter_id` | UUID | Nullable | Encounter ID (Clinical DB reference - logical FK) |
| `total_amount` | Decimal(12,2) | Default: 0 | Total claim amount |
| `currency` | String | Default: "AED" | Currency code (ISO 4217) |
| `service_date` | Date | Required | Date of service |
| `submitted_at` | Timestamptz | Nullable | Submission timestamp |
| `adjudicated_at` | Timestamptz | Nullable | Adjudication timestamp |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, claim_number)`
- Indexes: `(tenant_id, status)`

---

## Summary

This document provides comprehensive field-level definitions for:
- **Foundation Database**: 40+ tables covering tenancy, identity, facilities, staff, RBAC, configuration, value sets, and master catalogs
- **Clinical Database**: 20+ tables covering patients, appointments, encounters, triage, clinical notes, diagnoses, orders, prescriptions, consents, and scheduling
- **RCM Database**: 4 tables covering payers, policies, encounter coverages, and claims

For architectural context, relationships, and cross-database patterns, see:
- [05-Data-Model.md](./05-Data-Model.md) - Architectural overview
- [TABLE-DEFINITIONS.md](./TABLE-DEFINITIONS.md) - Part 1 (Foundation tables)

---

_Last updated: 21 Nov 2025_
