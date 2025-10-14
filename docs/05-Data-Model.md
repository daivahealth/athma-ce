# Data Model

_Last updated: 06 Oct 2025_

This document describes the relational schema implemented in `backend/shared/database/prisma/schema.prisma`. Following ADR-0013, the schema is logically split between:

- **Foundation database** – shared master data (tenants, facilities, staff, RBAC, specialty catalogs, MFA artefacts).
- **Domain databases** – currently implemented for clinical data (patients, appointments, encounters). Future services (billing, orders, etc.) will follow the same pattern but are not yet present in the schema.

Every table carries a `tenant_id` column (where applicable) and is protected by row-level security (ADR-0003). Time stamps use `TIMESTAMPTZ` to preserve audit history. Composite indexes and unique constraints are included to support the main query paths.

---

## 1. Foundation Master Data

### 1.1 Tenants & Users

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `tenants` | Top-level organisation (clinic, hospital group, etc.). | `id`, `name`, `domain`, `status`, `settings` | Soft status (`active`, `inactive`); JSON settings hold regional preferences. |
| `users` | Application users scoped to a tenant. | `tenant_id`, `email`, `first_name`, `last_name`, `role`, `status`, `permissions`, `staff_id?`, `default_facility_id?` | Foreign keys to staff/facility allow linking to clinical identity and default location. Unique on `(tenant_id, email)`. |
| `user_facilities` | Grants a user access to specific facilities. | `user_id`, `facility_id`, `access_level`, `is_default`, `granted_by`, timestamps | Enables multi-facility routing within a tenant. |
| `user_mfa_settings` | Toggle per-user multi-factor options. | `user_id`, TOTP/SMS/email flags, secrets | Enforces ADR-0005 requirements. |
| `user_mfa_backup_codes` | Hashed backup codes for MFA. | `user_id`, `code_hash`, `used_at` | No plaintext storage. |
| `user_mfa_attempts` | Audit trail of MFA verification attempts. | `user_id`, `method`, `success`, `ip_address`, `user_agent`, `created_at` | Supports anomaly detection. |
| `user_trusted_devices` | Remembered devices for MFA. | `user_id`, `device_fingerprint`, `device_name`, `expires_at`, `is_active` | Allows device revocation workflows. |

### 1.2 Facilities & Spatial Hierarchy

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `facilities` | Physical locations (hospital, clinic, diagnostic centre). | `tenant_id`, `name`, `facility_type`, address/contact fields, geo coords | `facility_type` (clinic, hospital, lab, etc.) generalises site types. |
| `departments` | Organisational units within a facility. | `facility_id`, `name`, `department_type`, `specialty_id`, `head_of_department` | Supports HOD assignment and specialty routing. |
| `wards` | Inpatient wards or units. | `department_id`, `name`, `ward_type`, `total_beds`, `available_beds` | For inpatient capacity tracking. |
| `beds` | Individual inpatient beds. | `ward_id`, `bed_number`, `bed_type`, `current_patient_id?`, `status` | `status` enumerations (available, occupied, maintenance). |
| `clinics` | Outpatient clinics within a department. | `department_id`, `name`, `code`, `specialty`, `total_rooms` | Used to group rooms/slots for scheduling. |
| `spaces` | Bookable physical spaces (rooms, suites, procedure areas). | `facility_id`, `department_id?`, `clinic_id?`, `space_type`, `equipment`, `capacity`, `is_active` | Multi-purpose to support ORs, consult rooms, imaging suites, etc. |

### 1.3 Staff & Specialties

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `staff` | Clinical and non-clinical staff profiles. | `tenant_id`, `employee_id`, `first_name`, `last_name`, `staff_type`, `license_number?`, `status` | Linked to `users` when the staff member requires login. |
| `specialties` | Master list of clinical specialties. | `code`, `name`, `description`, `is_active` | Tenant-agnostic; can be extended via translations. |
| `specialty_translations` | Localised specialty names/descriptions. | `specialty_id`, `lang`, `display_name` | Supports ADR-0004 multi-language requirements. |
| `specialty_code_authority` | External authority mappings (DHA/DOH/etc.). | `specialty_id`, `authority`, `authority_code`, `authority_name?`, `is_active` | Enables interoperability with regulator code sets. |
| `staff_specialties` | Multi-tenant mapping of staff to specialties (and facilities). | `tenant_id`, `staff_id`, `specialty_id`, `facility_id`, `primary_flag` | Many-to-many; defaults support primary/secondary specialties per facility. |

### 1.4 RBAC & Security

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `roles` | Tenant-defined roles. | `tenant_id`, `code`, `name`, `description`, `is_system` | Unique `(tenant_id, code)` ensures clean management. |
| `permissions` | Action catalogue (resource + action). | `code`, `name`, `resource`, `action` | Global list consumed by all tenants. |
| `role_permissions` | Role-to-permission mapping. | `role_id`, `permission_id` | Many-to-many join. |
| `user_roles` | Assigns roles to users. | `user_id`, `role_id`, `assigned_by`, `assigned_at`, `expires_at?`, `is_active` | Supports temporary elevation and audit. |

---

## 2. Clinical Domain Databases

The current schema provides a single set of tables for clinical workloads. In production, each clinical service (Patients, Scheduling, Encounters/EHR) will own its database, but the logical model remains the same.

### 2.1 Patients

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `patients` | Patient demographic record. | `tenant_id`, `emirates_id?`, `first_name`, `last_name`, `date_of_birth`, `gender`, contact details, `preferred_language`, `status` | JSON fields capture addresses and emergency contacts. |

### 2.2 Scheduling

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `appointments` | Booked appointments across providers/spaces. | `tenant_id`, `patient_id`, `facility_id`, `space_id?`, `staff_id?`, `appointment_type`, `status`, `start_time`, `end_time`, `duration`, `visit_type`, `linked_encounter_id?`, `notes` | Supports multi-resource scheduling and linkage to encounters. |

### 2.3 Encounters

| Table | Description | Key Columns | Notes |
| --- | --- | --- | --- |
| `encounters` | Clinical encounter record (ambulatory/inpatient/emergency). | `tenant_id`, `patient_id`, `facility_id`, `appointment_id?`, `primary_staff_id`, `encounter_class`, `status`, `priority`, `start_time`, `end_time?`, `chief_complaint`, `notes`, `vital_signs`, `allergies`, `medication_history`, `follow_up_instructions` | Designed to expand with orders, observations, etc. |

---

## 3. Relationships & Indexes (Summary)

- **Tenant scope**: Every tenant-owned table has a composite index on `(tenant_id, …)` to support RLS pruning and high-selectivity filters.
- **Facilities**: `departments`, `wards`, `beds`, `spaces`, and `clinics` cascade on delete to enforce referential integrity.
- **Staff**: `staff.specialties` are linked via the `staff_specialties` join table, enabling facility-specific specialty assignments.
- **RBAC**: Users connect to facilities via `user_facilities`, and to permissions via `roles`/`user_roles`.
- **Scheduling & clinical**: `appointments` refer to `patients`, `staff`, `facilities`, and `spaces`. `encounters` optionally link back to an appointment (for follow-ups) and track free-form clinical context in JSON columns.

---

## 4. Future Work

The schema already anticipates additional domains (orders, medications, billing, analytics). As new services come online:

- Create domain-specific tables in separate databases with the same `tenant_id` conventions and RLS policies.
- Publish field-level schemas through `@zeal/contracts` to keep services, front end, and data warehouse in sync.
- Update this document when new tables are introduced so downstream teams (analytics, integrations) have a single source of truth.

