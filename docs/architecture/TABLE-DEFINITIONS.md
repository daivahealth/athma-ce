# Table Definitions Reference

_Last updated: 21 Nov 2025_

This document provides detailed field-level definitions for all tables across the three Zeal databases. For architectural context and relationships, see [05-Data-Model.md](./05-Data-Model.md).

**Databases:**
- [Foundation Database (`zeal_foundation`)](#1-foundation-database-zeal_foundation)
- [Clinical Database (`zeal_clinical`)](#2-clinical-database-zeal_clinical)
- [RCM Database (`zeal_rcm`)](#3-rcm-database-zeal_rcm)

---

# 1. Foundation Database (`zeal_foundation`)

## 1.1 Tenancy & Identity

### `tenants`
Top-level organization (clinic, hospital group, etc.)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique tenant identifier |
| `name` | String | Unique | Organization name |
| `domain` | String | Unique | Tenant domain (e.g., "acme-healthcare") |
| `status` | String | Default: "active" | active, inactive |
| `settings` | JSON | Default: {} | Tenant configuration (regional preferences, identity config) |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `name`, `domain`

---

### `users`
Application users scoped to a tenant

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique user identifier |
| `tenant_id` | UUID | FK → tenants.id, Cascade | Tenant association |
| `email` | String | Required | User email address |
| `first_name` | String | Required | First name |
| `last_name` | String | Required | Last name |
| `password_hash` | String | Required | Hashed password (Argon2) |
| `role` | String | Required | User role code |
| `status` | String | Default: "active" | active, inactive, suspended |
| `permissions` | JSON | Default: {} | User-specific permissions |
| `staff_id` | UUID | FK → staff.id, SetNull | Linked staff profile (if clinical staff) |
| `default_facility_id` | UUID | FK → facilities.id | Default facility for login |
| `last_login` | Timestamptz | Nullable | Last successful login |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, email)`, `staff_id`
- Composite: `(tenant_id, default_facility_id)`, `(tenant_id, staff_id)`

---

### `user_facilities`
Grants user access to specific facilities

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique record identifier |
| `user_id` | UUID | FK → users.id, Cascade | User reference |
| `facility_id` | UUID | FK → facilities.id, Cascade | Facility reference |
| `is_default` | Boolean | Default: false | Whether this is the default facility |
| `access_level` | String | Default: "standard" | standard, admin, read_only |
| `granted_at` | Timestamptz | Default: now() | When access was granted |
| `granted_by` | UUID | FK → users.id, Nullable | Who granted access |
| `revoked_at` | Timestamptz | Nullable | When access was revoked |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(user_id, facility_id)`
- Composite: `(user_id, is_default)`, `(facility_id, revoked_at)`

---

### `user_mfa_settings`
Multi-factor authentication settings per user

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique record identifier |
| `user_id` | UUID | Unique, FK → users.id, Cascade | User reference |
| `totp_enabled` | Boolean | Default: false | TOTP (authenticator app) enabled |
| `totp_secret` | String | Nullable | Encrypted TOTP secret |
| `sms_enabled` | Boolean | Default: false | SMS OTP enabled |
| `sms_phone_number` | String | Nullable | Phone number for SMS |
| `email_enabled` | Boolean | Default: false | Email OTP enabled |
| `backup_codes_count` | Integer | Default: 0 | Number of unused backup codes |
| `last_used_at` | Timestamptz | Nullable | Last MFA verification |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `user_id`

---

### `user_mfa_backup_codes`
Hashed backup codes for MFA recovery

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique code identifier |
| `user_id` | UUID | FK → users.id, Cascade | User reference |
| `code_hash` | String | Required | Hashed backup code (no plaintext) |
| `used_at` | Timestamptz | Nullable | When code was used |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |

**Indexes:**
- Primary: `id`
- Index: `user_id`

---

### `user_mfa_attempts`
Audit trail of MFA verification attempts

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique attempt identifier |
| `user_id` | UUID | FK → users.id, Cascade | User reference |
| `method` | String | Required | totp, sms, email, backup_code |
| `success` | Boolean | Required | Whether verification succeeded |
| `ip_address` | String | Nullable | IP address of attempt |
| `user_agent` | String | Nullable | Browser/device user agent |
| `created_at` | Timestamptz | Default: now() | Attempt timestamp |

**Indexes:**
- Primary: `id`
- Index: `(user_id, created_at)`

---

### `user_trusted_devices`
Remembered devices for MFA

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique device identifier |
| `user_id` | UUID | FK → users.id, Cascade | User reference |
| `device_fingerprint` | String | Required | Browser/device fingerprint hash |
| `device_name` | String | Nullable | User-friendly device name |
| `ip_address` | String | Nullable | IP address when trusted |
| `user_agent` | String | Nullable | Browser/device user agent |
| `trusted_at` | Timestamptz | Default: now() | When device was trusted |
| `last_used_at` | Timestamptz | Default: now() | Last successful authentication |
| `expires_at` | Timestamptz | Nullable | Trust expiration |
| `is_active` | Boolean | Default: true | Whether trust is still valid |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |

**Indexes:**
- Primary: `id`
- Index: `(user_id, is_active)`

---

## 1.2 Facilities & Organization

### `facilities`
Physical locations (hospitals, clinics, diagnostic centers)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique facility identifier |
| `tenant_id` | UUID | FK → tenants.id, Cascade | Tenant association |
| `name` | String | Required | Facility name |
| `code` | String(50) | Nullable | Facility code |
| `facility_type` | String | Default: "clinic" | clinic, hospital, lab, imaging_center, pharmacy |
| `license_number` | String | Nullable | Government license number |
| `address_line1` | String | Nullable | Street address line 1 |
| `address_line2` | String | Nullable | Street address line 2 |
| `city` | String | Nullable | City |
| `emirate` | String | Nullable | Emirate (for UAE) / State |
| `postal_code` | String | Nullable | Postal/ZIP code |
| `country` | String | Default: "UAE" | Country code (ISO 3166-1) |
| `latitude` | Decimal(10,8) | Nullable | Latitude coordinate |
| `longitude` | Decimal(11,8) | Nullable | Longitude coordinate |
| `google_place_id` | String(255) | Nullable | Google Places API ID |
| `phone_number` | String | Nullable | Primary phone |
| `email` | String | Nullable | Contact email |
| `website` | String | Nullable | Website URL |
| `building_number` | String(50) | Nullable | Building number |
| `floor_numbers` | String[] | Array | List of floor identifiers |
| `total_floors` | Integer | Nullable | Total number of floors |
| `capacity` | Integer | Nullable | Patient capacity |
| `operating_hours` | JSON | Nullable | Operating hours by day |
| `status` | String | Default: "active" | active, inactive, maintenance |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, code)`
- Composite: `(tenant_id, facility_type)`, `(tenant_id, city)`, `(tenant_id, emirate)`, `(latitude, longitude)`

---

### `departments`
Organizational units within facilities

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique department identifier |
| `facility_id` | UUID | FK → facilities.id, Cascade | Facility association |
| `name` | String | Required | Department name |
| `code` | String(50) | Nullable | Department code |
| `department_type` | String | Required | clinical, administrative, support, emergency |
| `specialty_id` | UUID | FK → specialties.id, SetNull | Primary specialty |
| `head_of_department` | UUID | FK → staff.id, Nullable | HOD staff reference |
| `floor_number` | String(10) | Nullable | Floor location |
| `phone_extension` | String(20) | Nullable | Phone extension |
| `operating_hours` | JSON | Nullable | Department hours |
| `status` | String | Default: "active" | active, inactive |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(facility_id, code)`
- Composite: `(facility_id, department_type)`, `specialty_id`

---

### `wards`
Inpatient wards or units

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique ward identifier |
| `department_id` | UUID | FK → departments.id, Cascade | Department association |
| `name` | String | Required | Ward name |
| `code` | String(50) | Nullable | Ward code |
| `ward_type` | String | Required | general, icu, nicu, pediatric, maternity, isolation |
| `floor_number` | String(10) | Nullable | Floor location |
| `total_beds` | Integer | Default: 0 | Total bed capacity |
| `available_beds` | Integer | Default: 0 | Currently available beds |
| `nursing_station` | String | Nullable | Nursing station location |
| `status` | String | Default: "active" | active, inactive |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(department_id, code)`
- Composite: `(department_id, ward_type)`

---

### `beds`
Individual inpatient beds

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique bed identifier |
| `ward_id` | UUID | FK → wards.id, Cascade | Ward association |
| `bed_number` | String(20) | Required | Bed number |
| `bed_type` | String | Required | standard, icu, isolation, pediatric, bariatric |
| `features` | JSON | Nullable | Bed features/equipment |
| `status` | String | Default: "available" | available, occupied, maintenance, cleaning |
| `current_patient_id` | UUID | Nullable | Patient currently occupying (Clinical DB reference) |
| `assigned_at` | Timestamptz | Nullable | When patient was assigned |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(ward_id, bed_number)`
- Composite: `(ward_id, status)`, `current_patient_id`

---

### `clinics`
Outpatient clinics within departments

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique clinic identifier |
| `department_id` | UUID | FK → departments.id, Cascade | Department association |
| `name` | String | Required | Clinic name |
| `code` | String(50) | Nullable | Clinic code |
| `specialty` | String | Nullable | Clinical specialty focus |
| `floor_number` | String(10) | Nullable | Floor location |
| `total_rooms` | Integer | Default: 0 | Number of consultation rooms |
| `operating_hours` | JSON | Nullable | Clinic operating hours |
| `status` | String | Default: "active" | active, inactive |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(department_id, code)`
- Composite: `(department_id, specialty)`

---

### `spaces`
Bookable physical spaces (consultation rooms, procedure rooms, operating theaters)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique space identifier |
| `facility_id` | UUID | FK → facilities.id, Cascade | Facility association |
| `department_id` | UUID | FK → departments.id, Nullable | Department association |
| `clinic_id` | UUID | FK → clinics.id, Nullable | Clinic association |
| `name` | String | Required | Space name |
| `space_number` | String | Nullable | Room/space number |
| `space_type` | String | Required | consultation, procedure, operating_theater, imaging, lab, exam |
| `floor_number` | String(10) | Nullable | Floor location |
| `equipment` | JSON | Default: [] | Available equipment list |
| `capacity` | Integer | Default: 1 | Patient capacity |
| `is_active` | Boolean | Default: true | Whether space is bookable |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Composite: `(facility_id, department_id)`, `clinic_id`

---

## 1.3 Staff & Specialties

### `staff`
Clinical and non-clinical staff profiles

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique staff identifier |
| `tenant_id` | UUID | FK → tenants.id, Cascade | Tenant association |
| `prefix` | String(20) | Nullable | Title prefix (Dr., Prof., etc.) |
| `first_name` | String | Required | First name |
| `last_name` | String | Required | Last name |
| `middle_name` | String | Nullable | Middle name |
| `date_of_birth` | Date | Required | Date of birth |
| `gender` | String | Required | male, female, other |
| `nationality` | String | Default: "UAE" | Nationality |
| `phone_number` | String | Nullable | Contact phone |
| `email` | String | Nullable | Contact email |
| `employee_id` | String | Required | Employee/staff number |
| `staff_type` | String | Required | doctor, nurse, technician, administrative, pharmacist, therapist |
| `specialties` | JSON | Default: [] | Legacy specialty array (deprecated - use staff_specialties) |
| `license_number` | String | Nullable | Professional license number |
| `license_expiry` | Date | Nullable | License expiration date |
| `qualification` | String(150) | Nullable | Professional qualifications |
| `languages` | String(50)[] | Default: [] | Spoken languages |
| `display_name` | String(255) | Nullable | Full display name |
| `status` | String | Default: "active" | active, inactive, on_leave, suspended |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, employee_id)`

---

### `specialties`
Master list of clinical specialties (tenant-agnostic)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique specialty identifier |
| `code` | String(50) | Unique | Specialty code (e.g., "CARDIOLOGY") |
| `name` | String(150) | Required | Specialty name (English) |
| `description` | Text | Nullable | Specialty description |
| `is_active` | Boolean | Default: true | Whether specialty is active |
| `sort_order` | Integer | Default: 0 | Display sort order |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `code`
- Index: `code`

---

### `specialty_translations`
Localized specialty names and descriptions

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique translation identifier |
| `specialty_id` | UUID | FK → specialties.id, Cascade | Specialty reference |
| `lang` | Char(2) | Required | Language code (ISO 639-1: en, ar, fr) |
| `display_name` | Text | Required | Translated specialty name |
| `description` | Text | Nullable | Translated description |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(specialty_id, lang)`
- Composite: `(specialty_id, lang)`

---

### `specialty_codes_authority`
External authority mappings for specialties (DHA, DOH, etc.)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique mapping identifier |
| `specialty_id` | UUID | FK → specialties.id, Cascade | Specialty reference |
| `authority` | String(20) | Required | Authority code (DHA, DOH, MOHAP, etc.) |
| `authority_code` | String(50) | Required | Code in authority system |
| `authority_name` | String(150) | Nullable | Name in authority system |
| `is_active` | Boolean | Default: true | Whether mapping is active |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(specialty_id, authority)`
- Composite: `(authority, authority_code)`

---

### `staff_specialties`
Multi-tenant mapping of staff to specialties per facility

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique mapping identifier |
| `tenant_id` | UUID | FK → tenants.id, Cascade | Tenant association |
| `staff_id` | UUID | FK → staff.id, Cascade | Staff reference |
| `facility_id` | UUID | FK → facilities.id, Cascade | Facility reference |
| `specialty_id` | UUID | FK → specialties.id, Restrict | Specialty reference |
| `primary_flag` | Boolean | Default: false | Whether this is primary specialty at facility |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(staff_id, specialty_id, facility_id)`
- Indexes: `staff_id`, `specialty_id`, `tenant_id`, `facility_id`, `(facility_id, specialty_id)`, `(facility_id, staff_id)`

---

## 1.4 RBAC (Role-Based Access Control)

### `roles`
Tenant-defined roles

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique role identifier |
| `tenant_id` | UUID | FK → tenants.id, Cascade | Tenant association |
| `code` | String | Required | Role code (e.g., "ADMIN", "DOCTOR") |
| `name` | String | Required | Role display name |
| `description` | String | Nullable | Role description |
| `is_system` | Boolean | Default: false | Whether role is system-defined |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, code)`

---

### `permissions`
Global permission catalog

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique permission identifier |
| `code` | String | Unique | Permission code (e.g., "patients:read") |
| `name` | String | Required | Permission display name |
| `description` | String | Nullable | Permission description |
| `resource` | String | Nullable | Resource type (patients, appointments, etc.) |
| `action` | String | Nullable | Action type (read, write, delete) |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `code`

---

### `role_permissions`
Many-to-many mapping of roles to permissions

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique mapping identifier |
| `role_id` | UUID | FK → roles.id, Cascade | Role reference |
| `permission_id` | UUID | FK → permissions.id, Cascade | Permission reference |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(role_id, permission_id)`

---

### `user_roles`
Assigns roles to users with optional expiration

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique assignment identifier |
| `user_id` | UUID | FK → users.id, Cascade | User reference |
| `role_id` | UUID | FK → roles.id, Cascade | Role reference |
| `assigned_by` | UUID | Nullable | User who assigned the role |
| `assigned_at` | Timestamptz | Default: now() | Assignment timestamp |
| `expires_at` | Timestamptz | Nullable | Expiration timestamp (for temporary elevation) |
| `is_active` | Boolean | Default: true | Whether assignment is active |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(user_id, role_id)`

---

## 1.5 Configuration Management

### `instance_configs`
Global system-level configuration

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique config identifier |
| `config_key` | String | Unique | Configuration key |
| `value` | JSON | Required | Configuration value |
| `value_type` | String | Required | string, number, boolean, json |
| `category` | String | Required | Configuration category |
| `description` | String | Nullable | Configuration description |
| `is_overridable` | Boolean | Default: true | Whether tenants can override |
| `is_sensitive` | Boolean | Default: false | Whether value contains secrets |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Unique: `config_key`
- Index: `category`

---

### `tenant_configs`
Tenant-level configuration overrides

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique config identifier |
| `tenant_id` | UUID | FK → tenants.id, Cascade | Tenant reference |
| `config_key` | String | Required | Configuration key |
| `value` | JSON | Required | Configuration value |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, config_key)`
- Index: `tenant_id`

---

### `facility_configs`
Facility-level configuration overrides

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique config identifier |
| `facility_id` | UUID | FK → facilities.id, Cascade | Facility reference |
| `config_key` | String | Required | Configuration key |
| `value` | JSON | Required | Configuration value |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Unique: `(facility_id, config_key)`
- Index: `facility_id`

---

### `config_audit_log`
Audit trail for configuration changes

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique log identifier |
| `config_level` | String | Required | instance, tenant, facility |
| `config_key` | String | Required | Configuration key |
| `entity_id` | UUID | Nullable | Tenant or facility ID (null for instance) |
| `old_value` | JSON | Nullable | Previous value |
| `new_value` | JSON | Required | New value |
| `changed_by` | UUID | Required | User who made the change |
| `changed_at` | Timestamptz | Default: now() | Change timestamp |
| `change_reason` | String | Nullable | Reason for change |

**Indexes:**
- Primary: `id`
- Indexes: `(config_level, entity_id)`, `config_key`, `changed_by`

---

## 1.6 ValueSets / Reference Data

### `value_sets`
Named collections of coded concepts (e.g., marital_status, encounter_types)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique value set identifier |
| `code` | String(100) | Unique | Value set code |
| `name` | String(255) | Required | Value set name |
| `description` | Text | Nullable | Value set description |
| `category` | String(50) | Nullable | Category grouping |
| `version` | String(20) | Nullable | Version identifier |
| `status` | String(20) | Default: "active" | active, draft, retired |
| `is_system` | Boolean | Default: false | Whether system-defined |
| `is_extensible` | Boolean | Default: true | Whether tenants can add concepts |
| `source` | String(255) | Nullable | Source system/standard |
| `source_url` | Text | Nullable | Source URL |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Unique: `code`
- Indexes: `code`, `category`, `status`

---

### `value_set_concepts`
Individual concepts within value sets

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique concept identifier |
| `value_set_id` | UUID | FK → value_sets.id, Cascade | Value set reference |
| `value_set_code` | String(100) | FK → value_sets.code, Cascade | Value set code |
| `code` | String(100) | Required | Concept code |
| `display` | String(500) | Required | Display name |
| `definition` | Text | Nullable | Concept definition |
| `system_code` | String(100) | Nullable | External system code |
| `parent_id` | UUID | FK → value_set_concepts.id, SetNull | Parent concept (for hierarchies) |
| `sort_order` | Integer | Default: 0 | Display sort order |
| `is_default` | Boolean | Default: false | Whether default selection |
| `status` | String(20) | Default: "active" | active, inactive, deprecated |
| `effective_from` | Date | Nullable | Effective start date |
| `effective_to` | Date | Nullable | Effective end date |
| `metadata` | JSON | Nullable | Additional metadata |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Unique: `(value_set_code, code)`
- Indexes: `value_set_id`, `value_set_code`, `code`, `parent_id`, `status`, `(value_set_id, sort_order)`

---

### `value_set_concept_translations`
Localized display names for concepts

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique translation identifier |
| `concept_id` | UUID | FK → value_set_concepts.id, Cascade | Concept reference |
| `language_code` | String(10) | Required | Language code (ISO 639-1) |
| `display` | String(500) | Required | Translated display name |
| `definition` | Text | Nullable | Translated definition |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(concept_id, language_code)`
- Indexes: `concept_id`, `language_code`

---

### `tenant_value_set_overrides`
Tenant-specific customizations to value sets

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique override identifier |
| `tenant_id` | UUID | Required | Tenant reference |
| `value_set_id` | UUID | FK → value_sets.id, Cascade | Value set reference |
| `concept_id` | UUID | FK → value_set_concepts.id, Cascade, Nullable | Concept reference (null for set-level) |
| `override_type` | String(20) | Required | hide, rename, reorder, add |
| `custom_display` | String(500) | Nullable | Custom display name |
| `custom_metadata` | JSON | Nullable | Custom metadata |
| `sort_order` | Integer | Nullable | Custom sort order |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |
| `created_by` | UUID | Nullable | User who created |
| `updated_by` | UUID | Nullable | User who last updated |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, value_set_id, concept_id)`
- Indexes: `tenant_id`, `value_set_id`, `override_type`

---

### `value_set_history`
Audit trail for value set changes

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique log identifier |
| `entity_type` | String(50) | Required | value_set, concept, translation, override |
| `entity_id` | UUID | Required | Entity identifier |
| `action` | String(20) | Required | create, update, delete, activate, deactivate |
| `old_values` | JSON | Nullable | Previous values |
| `new_values` | JSON | Nullable | New values |
| `changed_by` | UUID | Nullable | User who made change |
| `changed_at` | Timestamptz | Default: now() | Change timestamp |
| `change_reason` | Text | Nullable | Reason for change |

**Indexes:**
- Primary: `id`
- Indexes: `(entity_type, entity_id)`, `changed_by`, `changed_at`

---

## 1.7 Clinical Catalogs

### `medication_master`
Global and tenant-specific medication catalog

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique medication identifier |
| `tenant_id` | UUID | FK → tenants.id, SetNull, Nullable | Tenant (null = global) |
| `medication_name` | String(255) | Required | Medication name |
| `generic_name` | String(255) | Nullable | Generic name |
| `brand_name` | String(255) | Nullable | Brand name |
| `ndc_code` | String(20) | Nullable | National Drug Code |
| `atc_code` | String(20) | Nullable | Anatomical Therapeutic Chemical code |
| `local_code` | String(100) | Nullable | Facility-specific code |
| `dosage_form` | String(50) | Required | tablet, capsule, injection, cream, syrup |
| `strength` | String(100) | Nullable | Strength (e.g., 500mg, 10mg/ml) |
| `route` | String(50) | Nullable | oral, IV, IM, topical, inhalation |
| `manufacturer` | String(255) | Nullable | Manufacturer name |
| `drug_class` | String(100) | Nullable | Drug class (e.g., ACE inhibitor) |
| `therapeutic_class` | String(100) | Nullable | Therapeutic class (e.g., cardiovascular) |
| `controlled_substance` | Boolean | Default: false | Whether controlled substance |
| `controlled_class` | String(50) | Nullable | Schedule I, II, III, IV, V |
| `requires_prescription` | Boolean | Default: true | Whether prescription required |
| `default_frequency` | String(100) | Nullable | Default frequency (e.g., BID, TID) |
| `default_duration` | String(100) | Nullable | Default duration (e.g., 7 days) |
| `contraindications` | String[] | Default: [] | List of contraindications |
| `common_side_effects` | String[] | Default: [] | Common side effects |
| `drug_interactions` | String[] | Default: [] | Known drug interactions |
| `storage_requirements` | String(255) | Nullable | Storage instructions |
| `is_active` | Boolean | Default: true | Whether active in catalog |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, local_code)`
- Indexes: `tenant_id`, `ndc_code`, `atc_code`, `generic_name`, `is_active`

---

### `lab_test_master`
Standardized lab test catalog with reference ranges

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique test identifier |
| `tenant_id` | UUID | FK → tenants.id, SetNull, Nullable | Tenant (null = global) |
| `test_name` | String(255) | Required | Test name |
| `loinc_code` | String(20) | Required | LOINC code |
| `cpt_code` | String(10) | Nullable | CPT billing code |
| `local_code` | String(100) | Nullable | Facility-specific code |
| `test_category` | String(100) | Required | hematology, chemistry, microbiology, immunology |
| `test_subcategory` | String(100) | Nullable | CBC, lipid panel, culture |
| `specimen_type` | String(100) | Required | blood, urine, stool, sputum, tissue |
| `collection_method` | String(100) | Nullable | venipuncture, fingerstick, clean catch |
| `fasting_required` | Boolean | Default: false | Whether fasting required |
| `fasting_duration_hours` | Integer | Nullable | Required fasting duration |
| `preparation_instructions` | Text | Nullable | Patient preparation instructions |
| `normal_range_male` | String(100) | Nullable | Normal range for males |
| `normal_range_female` | String(100) | Nullable | Normal range for females |
| `normal_range_pediatric` | String(100) | Nullable | Normal range for children |
| `units` | String(50) | Nullable | Units of measurement |
| `methodology` | String(255) | Nullable | Test methodology |
| `turnaround_time_hours` | Integer | Nullable | Expected turnaround time |
| `reference_lab` | String(255) | Nullable | Reference lab name |
| `is_active` | Boolean | Default: true | Whether active in catalog |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, loinc_code)`, `(tenant_id, local_code)`
- Indexes: `tenant_id`, `test_category`, `is_active`

---

### `imaging_study_master`
Radiology and diagnostic imaging catalog

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique study identifier |
| `tenant_id` | UUID | FK → tenants.id, SetNull, Nullable | Tenant (null = global) |
| `study_name` | String(255) | Required | Study name |
| `cpt_code` | String(10) | Nullable | CPT billing code |
| `local_code` | String(100) | Nullable | Facility-specific code |
| `modality` | String(50) | Required | X-ray, CT, MRI, Ultrasound, PET, Nuclear |
| `body_part` | String(100) | Required | Body part/region |
| `study_category` | String(100) | Nullable | diagnostic, screening, interventional |
| `contrast_required` | Boolean | Default: false | Whether contrast required |
| `contrast_type` | String(100) | Nullable | IV, oral, rectal |
| `preparation_instructions` | Text | Nullable | Patient preparation |
| `positioning_instructions` | Text | Nullable | Positioning instructions |
| `contraindications` | String[] | Default: [] | Contraindications |
| `radiation_dose` | String(100) | Nullable | Typical radiation dose |
| `estimated_duration_minutes` | Integer | Nullable | Procedure duration |
| `facility_requirements` | String(255) | Nullable | Required facility type |
| `equipment_requirements` | String(255) | Nullable | Required equipment |
| `radiologist_required` | Boolean | Default: true | Whether radiologist needed |
| `is_active` | Boolean | Default: true | Whether active in catalog |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, cpt_code)`, `(tenant_id, local_code)`
- Indexes: `tenant_id`, `modality`, `body_part`, `is_active`

---

### `procedure_master`
Medical and surgical procedures catalog

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique procedure identifier |
| `tenant_id` | UUID | FK → tenants.id, SetNull, Nullable | Tenant (null = global) |
| `procedure_name` | String(255) | Required | Procedure name |
| `cpt_code` | String(10) | Nullable | CPT billing code |
| `icd10_pcs_code` | String(10) | Nullable | ICD-10-PCS code |
| `local_code` | String(100) | Nullable | Facility-specific code |
| `procedure_category` | String(100) | Required | surgical, diagnostic, therapeutic, preventive |
| `body_system` | String(100) | Required | cardiovascular, respiratory, neurological |
| `procedure_type` | String(100) | Nullable | minor, major, endoscopic, laparoscopic |
| `anesthesia_type` | String(50) | Nullable | local, regional, general, sedation, none |
| `facility_required` | String(50) | Nullable | clinic, hospital, surgery_center, ambulatory |
| `estimated_duration_minutes` | Integer | Nullable | Procedure duration |
| `preparation_instructions` | Text | Nullable | Pre-procedure instructions |
| `post_procedure_instructions` | Text | Nullable | Post-procedure instructions |
| `risks_and_complications` | String[] | Default: [] | Known risks |
| `contraindications` | String[] | Default: [] | Contraindications |
| `consent_required` | Boolean | Default: false | Whether consent needed |
| `consent_type` | String(100) | Nullable | informed_consent, anesthesia_consent |
| `pre_procedure_requirements` | String[] | Default: [] | Required pre-op tasks |
| `post_procedure_monitoring` | Text | Nullable | Post-op monitoring |
| `recovery_time_hours` | Integer | Nullable | Expected recovery time |
| `is_active` | Boolean | Default: true | Whether active in catalog |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, cpt_code)`, `(tenant_id, icd10_pcs_code)`, `(tenant_id, local_code)`
- Indexes: `tenant_id`, `procedure_category`, `body_system`, `is_active`

---

### `diagnosis_versions`
ICD release metadata (versions)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique version identifier |
| `tenant_id` | UUID | FK → tenants.id, SetNull, Nullable | Tenant (null = global release) |
| `code_set` | String(50) | Required | ICD-10-CM, ICD-10-PCS, ICD-11 |
| `version_label` | String(100) | Required | Version label (e.g., 2024, 2025) |
| `release_date` | Date | Nullable | Official release date |
| `description` | Text | Nullable | Version description |
| `import_status` | String(30) | Default: "pending" | pending, in_progress, completed, failed |
| `import_notes` | Text | Nullable | Import notes/errors |
| `source_url` | String(255) | Nullable | Source data URL |
| `checksum` | String(128) | Nullable | Data checksum |
| `total_codes` | Integer | Default: 0 | Total codes in version |
| `imported_by` | UUID | Nullable | User who imported |
| `imported_at` | Timestamptz | Nullable | Import timestamp |
| `is_active` | Boolean | Default: true | Whether version is active |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, code_set, version_label)`
- Indexes: `tenant_id`, `code_set`, `import_status`

---

### `diagnosis_master`
ICD code catalog scoped by version and tenant

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique diagnosis identifier |
| `tenant_id` | UUID | FK → tenants.id, SetNull, Nullable | Tenant (null = global) |
| `version_id` | UUID | FK → diagnosis_versions.id, Cascade | Version reference |
| `code` | String(20) | Required | ICD code |
| `code_type` | String(50) | Nullable | diagnosis, procedure |
| `short_description` | String(255) | Nullable | Short description |
| `description` | Text | Required | Full description |
| `chapter` | String(100) | Nullable | ICD chapter |
| `block` | String(100) | Nullable | ICD block |
| `category` | String(100) | Nullable | ICD category |
| `subcategory` | String(100) | Nullable | ICD subcategory |
| `clinical_concepts` | String[] | Default: [] | Associated clinical concepts |
| `synonyms` | String[] | Default: [] | Synonym terms |
| `search_terms` | String[] | Default: [] | Additional search terms |
| `gender_restriction` | String(20) | Nullable | male, female, null |
| `age_range` | String(50) | Nullable | Age restrictions |
| `is_billable` | Boolean | Default: true | Whether billable code |
| `is_active` | Boolean | Default: true | Whether active |
| `effective_from` | Date | Nullable | Effective start date |
| `effective_to` | Date | Nullable | Effective end date |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(tenant_id, version_id, code)`
- Indexes: `tenant_id`, `version_id`, `code`, `chapter`, `is_active`

---

### `note_templates`
Reusable note templates for clinical documentation

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique template identifier |
| `tenant_id` | UUID | FK → tenants.id, SetNull, Nullable | Tenant (null = global) |
| `specialty_id` | UUID | FK → specialties.id, SetNull, Nullable | Specialty association |
| `name` | String(200) | Required | Template name |
| `description` | Text | Nullable | Template description |
| `status` | String(20) | Default: "active" | active, inactive, archived |
| `current_version` | Integer | Default: 1 | Current version number |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, status)`, `specialty_id`

---

### `note_template_versions`
Versioned template schemas

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique version identifier |
| `template_id` | UUID | FK → note_templates.id, Cascade | Template reference |
| `version` | Integer | Required | Version number |
| `schema` | JSON | Required | JSONB schema (sections + fields) |
| `change_log` | Text | Nullable | Changes in this version |
| `created_by` | UUID | Nullable | Staff who created version |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(template_id, version)`
- Composite: `(template_id, version)`

---

# 2. Clinical Database (`zeal_clinical`)

## 2.1 Patient Management

### `patients`
Patient demographic and identity records

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique patient identifier |
| `mrn` | String(50) | Unique | Medical Record Number |
| `tenant_id` | UUID | Required | Tenant association (Foundation DB reference) |
| `national_id` | String(50) | Nullable | Primary identity number |
| `national_id_type` | String(50) | Nullable | emirates_id, aadhaar, passport, nric, ssn |
| `issuing_country` | String(2) | Nullable | ISO 3166-1 alpha-2 country code |
| `title` | String(20) | Nullable | Mr., Mrs., Dr., etc. |
| `first_name` | String(100) | Required | First name |
| `last_name` | String(100) | Required | Last name |
| `middle_name` | String(100) | Nullable | Middle name |
| `display_name` | String(255) | Nullable | Full display name |
| `date_of_birth` | Date | Required | Date of birth |
| `gender` | String(10) | Required | male, female, other |
| `marital_status` | String(20) | Nullable | single, married, divorced, widowed |
| `nationality` | String(100) | Nullable | Nationality |
| `preferred_language` | String(10) | Default: "en" | Preferred language (ISO 639-1) |
| `phone_number` | String(20) | Nullable | Primary phone |
| `email` | String(255) | Nullable | Email address |
| `address_line1` | String | Nullable | Street address line 1 |
| `address_line2` | String | Nullable | Street address line 2 |
| `city` | String(100) | Nullable | City |
| `state` | String(100) | Nullable | State/Province/Emirate |
| `postal_code` | String(20) | Nullable | Postal code |
| `country` | String(2) | Nullable | Country code (ISO 3166-1) |
| `blood_group` | String(10) | Nullable | Blood type (A+, B-, O+, etc.) |
| `emergency_contact` | JSON | Nullable | Emergency contact information |
| `insurance_info` | JSON | Nullable | Insurance summary |
| `created_by` | UUID | Required | Staff who registered (Foundation DB reference) |
| `created_at_facility` | UUID | Required | Facility where registered (Foundation DB reference) |
| `registration_source` | String(20) | Default: "manual" | manual, online, import, api |
| `registration_notes` | Text | Nullable | Registration notes |
| `updated_by` | UUID | Nullable | Staff who last updated |
| `updated_at_facility` | UUID | Nullable | Facility where last updated |
| `status` | String | Default: "active" | active, inactive, deceased, merged |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `mrn`
- Indexes: `(tenant_id, mrn)`, `(tenant_id, national_id)`, `(tenant_id, first_name, last_name)`, `(tenant_id, national_id_type, issuing_country)`, `(tenant_id, created_by)`, `(tenant_id, created_at_facility)`, `(tenant_id, registration_source)`

---

### `patient_documents`
Identity documents and verification tracking

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique document identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `patient_id` | UUID | FK → patients.id, Cascade | Patient reference |
| `document_type` | String(50) | Required | emirates_id, passport, visa, driving_license, birth_certificate |
| `document_number` | String(100) | Required | Document number |
| `issuing_country` | String(2) | Required | ISO 3166-1 alpha-2 country code |
| `issuing_authority` | String(200) | Nullable | Issuing authority name |
| `issue_date` | Date | Nullable | Issue date |
| `expiry_date` | Date | Nullable | Expiration date |
| `is_primary_identity` | Boolean | Default: false | Whether primary identity document |
| `document_url` | Text | Nullable | Scanned document URL |
| `verification_status` | String(20) | Default: "pending" | pending, verified, rejected, expired |
| `verified_by` | UUID | Nullable | Staff who verified (Foundation DB reference) |
| `verified_at` | Timestamptz | Nullable | Verification timestamp |
| `verification_notes` | Text | Nullable | Verification notes |
| `metadata` | JSON | Default: {} | Additional metadata |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, patient_id)`, `(tenant_id, document_type, document_number)`, `(tenant_id, verification_status)`, `(tenant_id, is_primary_identity)`

---

### `patient_history`
Audit trail for patient data changes

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique history identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `patient_id` | UUID | FK → patients.id, Cascade | Patient reference |
| `field_name` | String(100) | Required | Field that changed |
| `old_value` | Text | Nullable | Previous value |
| `new_value` | Text | Nullable | New value |
| `change_type` | String(20) | Required | create, update, delete, merge |
| `change_reason` | Text | Nullable | Reason for change |
| `supporting_doc_url` | Text | Nullable | Supporting document URL |
| `changed_by` | UUID | Required | User who made change (Foundation DB reference) |
| `approved_by` | UUID | Nullable | User who approved change |
| `changed_at_facility` | UUID | Nullable | Facility where change made |
| `changed_at` | Timestamptz | Default: now() | Change timestamp |
| `patient_consent` | Boolean | Default: false | Whether patient consented |
| `consent_doc_url` | Text | Nullable | Consent document URL |
| `ip_address` | String(50) | Nullable | IP address |
| `user_agent` | Text | Nullable | Browser/device user agent |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, patient_id, changed_at)`, `(tenant_id, field_name)`, `(tenant_id, changed_by)`, `(tenant_id, change_type)`

---

### `patient_consents`
Patient consent management

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique consent identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `patient_id` | UUID | FK → patients.id, Cascade | Patient reference |
| `consent_type` | String(100) | Required | treatment, data_sharing, research, photography |
| `consent_category` | String(50) | Required | general, specific, limited |
| `consent_status` | String(20) | Required | active, revoked, expired, pending |
| `consent_scope` | Text | Nullable | Scope description |
| `purpose` | Text | Required | Purpose of consent |
| `description` | Text | Nullable | Detailed description |
| `legal_basis` | String(50) | Nullable | Legal basis (GDPR, HIPAA, etc.) |
| `effective_from` | Timestamptz | Required | Effective start timestamp |
| `effective_until` | Timestamptz | Nullable | Expiration timestamp |
| `is_active` | Boolean | Default: true | Whether currently active |
| `capture_method` | String(50) | Required | digital, paper, verbal, implied |
| `captured_by` | UUID | Nullable | Staff who captured (Foundation DB reference) |
| `captured_at` | Timestamptz | Default: now() | Capture timestamp |
| `captured_at_facility` | UUID | Nullable | Facility where captured |
| `signature_url` | Text | Nullable | Digital signature URL |
| `document_url` | Text | Nullable | Consent document URL |
| `witnessed_by` | UUID | Nullable | Witness staff ID |
| `witness_signature_url` | Text | Nullable | Witness signature URL |
| `revoked_at` | Timestamptz | Nullable | Revocation timestamp |
| `revoked_by` | UUID | Nullable | User who revoked |
| `revocation_reason` | Text | Nullable | Reason for revocation |
| `revocation_method` | String(50) | Nullable | Revocation method |
| `metadata` | JSON | Default: {} | Additional metadata |
| `version` | Integer | Default: 1 | Consent version |
| `parent_consent_id` | UUID | Nullable | Parent consent (for revisions) |
| `linked_entity_type` | String(50) | Nullable | encounter, procedure, research_study |
| `linked_entity_id` | UUID | Nullable | Linked entity identifier |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, patient_id, is_active)`, `(tenant_id, consent_type, consent_status)`, `(tenant_id, consent_category)`, `(tenant_id, effective_from, effective_until)`, `(tenant_id, linked_entity_type, linked_entity_id)`

---

### `consent_templates`
Reusable consent form templates

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique template identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `template_code` | String(100) | Unique | Template code |
| `consent_type` | String(100) | Required | Consent type |
| `consent_category` | String(50) | Required | Consent category |
| `title` | JSON | Required | Multi-language title |
| `description` | JSON | Required | Multi-language description |
| `content` | JSON | Required | Multi-language content |
| `legal_text` | JSON | Nullable | Multi-language legal text |
| `is_required` | Boolean | Default: false | Whether required |
| `requires_witness` | Boolean | Default: false | Whether witness required |
| `validity_days` | Integer | Nullable | Validity duration in days |
| `auto_renew` | Boolean | Default: false | Whether auto-renews |
| `version` | Integer | Default: 1 | Template version |
| `status` | String(20) | Default: "active" | active, inactive, archived |
| `supersedes` | UUID | Nullable | Previous version ID |
| `metadata` | JSON | Default: {} | Additional metadata |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `template_code`
- Indexes: `(tenant_id, consent_type)`, `(tenant_id, consent_category)`, `(tenant_id, status)`

---

## 2.2 Appointment Scheduling

### `appointments`
Patient appointments across providers and spaces

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default: uuid() | Unique appointment identifier |
| `tenant_id` | UUID | Required | Tenant association |
| `patient_id` | UUID | FK → patients.id, Cascade | Patient reference |
| `facility_id` | UUID | Required | Facility (Foundation DB reference) |
| `space_id` | UUID | Nullable | Space (Foundation DB reference) |
| `staff_id` | UUID | Nullable | Staff provider (Foundation DB reference) |
| `appointment_type` | String | Required | consultation, follow_up, procedure, imaging, lab |
| `status` | String | Default: "scheduled" | scheduled, confirmed, checked_in, in_progress, completed, cancelled, no_show |
| `start_time` | Timestamptz | Required | Appointment start time |
| `end_time` | Timestamptz | Required | Appointment end time |
| `duration` | Integer | Default: 30 | Duration in minutes |
| `notes` | String | Nullable | Appointment notes |
| `visit_type` | String | Nullable | new_patient, follow_up, routine, urgent |
| `linked_encounter_id` | UUID | Nullable | Linked encounter ID |
| `series_id` | String | Nullable | Recurring series ID |
| `cancellation_reason` | String | Nullable | Cancellation reason |
| `reschedule_reason` | String | Nullable | Reschedule reason |
| `created_at` | Timestamptz | Default: now() | Creation timestamp |
| `updated_at` | Timestamptz | Auto-update | Last update timestamp |

**Indexes:**
- Primary: `id`
- Indexes: `(tenant_id, patient_id)`, `(tenant_id, start_time)`, `(tenant_id, status)`, `(tenant_id, staff_id)`, `(tenant_id, facility_id)`

---

Due to character limits, I'll create a second file for the rest of the tables. Let me continue...
