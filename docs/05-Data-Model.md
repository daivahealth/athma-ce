# Data Model

## Database Schema Overview

The Zeal platform uses PostgreSQL 16 with Row-Level Security (RLS) for multi-tenant data isolation. All tables include tenant scoping, audit fields, and appropriate indexes for performance.

> **Scalability Note**: This data model uses generic table names (`facilities`, `spaces`, `staff`) to scale from clinics to hospitals, diagnostic centers, surgery centers, and other healthcare provider types without requiring structural changes. See [Scalability Guide](../docs/12-Scalability-Healthcare-Providers.md) for detailed expansion strategies.

## Core Tables

### Tenant Management

```sql
-- Tenants
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    permissions JSONB DEFAULT '{}',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

-- Locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    emirate VARCHAR(50),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Facilities (hospitals, clinics, diagnostic centers, surgery centers)
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100),
    specialty VARCHAR(100),
    facility_type VARCHAR(50) DEFAULT 'clinic', -- clinic, hospital_department, diagnostic_department, surgical_unit
    status VARCHAR(50) DEFAULT 'active',
    configuration JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spaces (rooms, beds, suites, stations, equipment locations)
CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    space_number VARCHAR(50),
    space_type VARCHAR(50), -- consultation_room, patient_room, or_suite, mri_suite, lab_station, icu_bed
    equipment JSONB DEFAULT '[]',
    capacity INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff (physicians, nurses, technicians, administrators, support)
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    license_number VARCHAR(100),
    specialty VARCHAR(100),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    staff_type VARCHAR(50) DEFAULT 'physician', -- physician, nurse, technician, administrator, support
    credentials JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment (MRI machines, surgical tools, lab equipment, etc.)
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(100) NOT NULL, -- mri_scanner, ct_scanner, surgical_table, ventilator, etc.
    model VARCHAR(100),
    serial_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- active, maintenance, out_of_order
    specifications JSONB DEFAULT '{}',
    maintenance_schedule JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff availability schedules
CREATE TABLE staff_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    notes TEXT,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (staff_id, day_of_week, start_time, end_time, effective_from)
);

-- Equipment availability schedules
CREATE TABLE equipment_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    maintenance_type VARCHAR(50), -- scheduled_maintenance, emergency_repair, calibration
    notes TEXT,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (equipment_id, day_of_week, start_time, end_time, effective_from)
);

-- Resource requirements for appointment types
CREATE TABLE appointment_resource_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    appointment_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- staff, equipment, space
    resource_id UUID, -- references staff, equipment, or spaces
    resource_role VARCHAR(100),
    is_required BOOLEAN DEFAULT TRUE,
    min_duration_minutes INTEGER DEFAULT 30,
    max_duration_minutes INTEGER,
    preparation_time_minutes INTEGER DEFAULT 0,
    cleanup_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master specialties (global)
CREATE TABLE specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff↔Specialty M:N
CREATE TABLE staff_specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE RESTRICT,
    primary_flag BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (staff_id, specialty_id)
);

-- UAE "post offices" / authorities
CREATE TABLE post_offices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,        -- e.g., 'DHPO','DOH','MOHAP'
    name VARCHAR(150) NOT NULL,
    authority VARCHAR(50),                   -- 'DHA','DOH','MOHAP','PRIVATE'
    emirate VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff licenses (many per staff; scoped by post office/authority)
CREATE TABLE staff_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    post_office_id UUID REFERENCES post_offices(id) ON DELETE SET NULL,
    license_type VARCHAR(50),
    license_number VARCHAR(100) NOT NULL,
    issued_at DATE,
    expires_at DATE,
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (staff_id, post_office_id, license_type, license_number)
);
```

### Patient Management

```sql
-- Patients
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    emirates_id VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    emirate VARCHAR(50),
    postal_code VARCHAR(20),
    emergency_contact VARCHAR(20),
    demographics JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    policy_number VARCHAR(100) NOT NULL,
    group_number VARCHAR(100),
    payer_name VARCHAR(255) NOT NULL,
    payer_id VARCHAR(100),
    relationship VARCHAR(50),
    effective_date DATE,
    expiration_date DATE,
    benefits JSONB DEFAULT '{}',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consents
CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    consent_text TEXT,
    signed_by VARCHAR(255),
    signed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Clinical Management

```sql
-- Appointments (multi-resource)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    primary_staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    primary_space_id UUID REFERENCES spaces(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    appointment_type VARCHAR(100),
    visit_type VARCHAR(50), -- new_visit, revisit, follow_up, post_op_followup, emergency
    linked_encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL, -- for follow-ups
    status VARCHAR(50) DEFAULT 'scheduled',
    reason TEXT,
    notes TEXT,
    preparation_time_minutes INTEGER DEFAULT 0,
    cleanup_time_minutes INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointment resources (extra staff/equipment/space)
CREATE TABLE appointment_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL, -- staff, equipment, space
    resource_id UUID NOT NULL,
    resource_role VARCHAR(100),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_confirmed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (appointment_id, resource_type, resource_id, resource_role)
);

-- Resource conflicts & resolutions
CREATE TABLE resource_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    conflict_type VARCHAR(50) NOT NULL, -- double_booking, maintenance_overlap, staff_unavailable
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    conflicting_appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    conflict_start_time TIMESTAMPTZ NOT NULL,
    conflict_end_time TIMESTAMPTZ NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(50) DEFAULT 'pending', -- pending, resolved, ignored
    resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Encounters
CREATE TABLE encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    primary_staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    encounter_source VARCHAR(20) NOT NULL DEFAULT 'appointment', -- appointment, walk_in, emergency, telemedicine
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    encounter_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'in_progress',
    chief_complaint TEXT,
    assessment TEXT,
    plan TEXT,
    vital_signs JSONB DEFAULT '{}',
    walk_in_details JSONB DEFAULT '{}', -- for walk-in specific data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_encounter_source CHECK (encounter_source IN ('appointment', 'walk_in', 'emergency', 'telemedicine')),
    CONSTRAINT check_appointment_or_walkin CHECK (
        (encounter_source = 'appointment' AND appointment_id IS NOT NULL) OR
        (encounter_source IN ('walk_in', 'emergency', 'telemedicine') AND appointment_id IS NULL)
    )
);

-- Clinical notes
CREATE TABLE clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    note_type VARCHAR(100),
    section VARCHAR(50) CHECK (section IN ('subjective', 'objective', 'assessment', 'plan')),
    content TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (generic order header)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    primary_staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    order_type VARCHAR(100) NOT NULL, -- medication, lab, imaging, procedure, referral
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, sent, completed, cancelled
    priority VARCHAR(20) DEFAULT 'routine', -- routine, urgent, stat
    description TEXT,
    clinical_notes TEXT,
    specifications JSONB DEFAULT '{}',
    ordered_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    sent_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_order_type CHECK (order_type IN ('medication', 'lab', 'imaging', 'procedure', 'referral', 'diet', 'nursing', 'therapy'))
);

-- Medication Orders (prescriptions)
CREATE TABLE medication_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    medication_code VARCHAR(100), -- NDC, ATC, or local code
    dosage_form VARCHAR(50), -- tablet, capsule, injection, cream, etc.
    strength VARCHAR(100), -- 500mg, 10mg/ml, etc.
    route VARCHAR(50), -- oral, IV, IM, topical, etc.
    frequency VARCHAR(100), -- BID, TID, QID, every 8 hours, etc.
    duration VARCHAR(100), -- 7 days, 2 weeks, until finished, etc.
    quantity DECIMAL(10,2), -- number of units
    quantity_unit VARCHAR(20), -- tablets, ml, grams, etc.
    refills INTEGER DEFAULT 0,
    instructions TEXT, -- patient instructions
    indication TEXT, -- reason for medication
    contraindications TEXT,
    allergies_checked BOOLEAN DEFAULT FALSE,
    drug_interactions_checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Laboratory Orders
CREATE TABLE lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    test_code VARCHAR(100), -- LOINC, local lab code
    test_category VARCHAR(100), -- hematology, chemistry, microbiology, etc.
    specimen_type VARCHAR(100), -- blood, urine, stool, sputum, etc.
    collection_method VARCHAR(100), -- venipuncture, fingerstick, clean catch, etc.
    fasting_required BOOLEAN DEFAULT FALSE,
    fasting_duration_hours INTEGER,
    special_instructions TEXT,
    reference_lab VARCHAR(255), -- external lab if applicable
    expected_result_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Imaging Orders
CREATE TABLE imaging_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    study_name VARCHAR(255) NOT NULL,
    study_code VARCHAR(100), -- CPT, local radiology code
    modality VARCHAR(50), -- X-ray, CT, MRI, Ultrasound, etc.
    body_part VARCHAR(100), -- chest, abdomen, head, etc.
    contrast_required BOOLEAN DEFAULT FALSE,
    contrast_type VARCHAR(100), -- IV, oral, rectal, etc.
    preparation_instructions TEXT,
    positioning_instructions TEXT,
    clinical_indication TEXT,
    prior_studies TEXT, -- reference to previous imaging
    radiologist_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Procedure Orders
CREATE TABLE procedure_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    procedure_name VARCHAR(255) NOT NULL,
    procedure_code VARCHAR(100), -- CPT, ICD-10-PCS, local code
    procedure_category VARCHAR(100), -- surgical, diagnostic, therapeutic, etc.
    body_system VARCHAR(100), -- cardiovascular, respiratory, etc.
    anesthesia_type VARCHAR(50), -- local, regional, general, none
    facility_required VARCHAR(50), -- clinic, hospital, surgery_center
    estimated_duration_minutes INTEGER,
    preparation_instructions TEXT,
    post_procedure_instructions TEXT,
    risks_and_complications TEXT,
    consent_required BOOLEAN DEFAULT FALSE,
    surgeon_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral Orders
CREATE TABLE referral_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    referral_type VARCHAR(50), -- specialist, facility, service
    specialty VARCHAR(100), -- cardiology, orthopedics, etc.
    referred_to_name VARCHAR(255),
    referred_to_facility VARCHAR(255),
    referred_to_contact VARCHAR(255),
    referral_reason TEXT,
    clinical_summary TEXT,
    urgency VARCHAR(20) DEFAULT 'routine', -- routine, urgent, emergency
    expected_appointment_date DATE,
    insurance_authorization_required BOOLEAN DEFAULT FALSE,
    authorization_number VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Laboratory Results
CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_order_id UUID NOT NULL REFERENCES lab_orders(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    test_code VARCHAR(100),
    result_value VARCHAR(255),
    result_unit VARCHAR(50),
    reference_range VARCHAR(100), -- normal range
    abnormal_flag VARCHAR(10), -- H, L, HH, LL, A (abnormal)
    result_status VARCHAR(50) DEFAULT 'final', -- preliminary, final, corrected, cancelled
    result_date TIMESTAMPTZ DEFAULT NOW(),
    performed_by VARCHAR(255), -- lab technician
    verified_by VARCHAR(255), -- lab director/pathologist
    methodology VARCHAR(255), -- testing method used
    specimen_id VARCHAR(100), -- lab specimen tracking ID
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Imaging Results
CREATE TABLE imaging_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imaging_order_id UUID NOT NULL REFERENCES imaging_orders(id) ON DELETE CASCADE,
    study_name VARCHAR(255) NOT NULL,
    study_code VARCHAR(100),
    modality VARCHAR(50),
    body_part VARCHAR(100),
    technique VARCHAR(255), -- imaging technique used
    contrast_used BOOLEAN DEFAULT FALSE,
    contrast_type VARCHAR(100),
    findings TEXT, -- radiology report findings
    impression TEXT, -- radiologist's impression/conclusion
    recommendations TEXT, -- follow-up recommendations
    report_status VARCHAR(50) DEFAULT 'final', -- preliminary, final, addendum
    report_date TIMESTAMPTZ DEFAULT NOW(),
    radiologist_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    radiologist_name VARCHAR(255),
    images_count INTEGER DEFAULT 0,
    dicom_study_uid VARCHAR(255), -- DICOM study identifier
    report_text TEXT, -- full radiology report
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Procedure Results
CREATE TABLE procedure_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procedure_order_id UUID NOT NULL REFERENCES procedure_orders(id) ON DELETE CASCADE,
    procedure_name VARCHAR(255) NOT NULL,
    procedure_code VARCHAR(100),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    anesthesia_used VARCHAR(100),
    complications TEXT,
    findings TEXT,
    procedure_notes TEXT,
    post_procedure_condition VARCHAR(100), -- stable, critical, etc.
    recovery_instructions TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    surgeon_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    surgeon_name VARCHAR(255),
    assistant_surgeons TEXT,
    anesthesiologist_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medication Inventory (for in-clinic pharmacy)
CREATE TABLE medication_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    medication_code VARCHAR(100), -- NDC, ATC, or local code
    dosage_form VARCHAR(50),
    strength VARCHAR(100),
    manufacturer VARCHAR(255),
    batch_number VARCHAR(100),
    expiry_date DATE,
    current_stock DECIMAL(10,2) DEFAULT 0,
    minimum_stock DECIMAL(10,2) DEFAULT 0,
    maximum_stock DECIMAL(10,2),
    unit_cost DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    storage_location VARCHAR(100),
    storage_conditions VARCHAR(100), -- room temp, refrigerated, etc.
    controlled_substance BOOLEAN DEFAULT FALSE,
    controlled_class VARCHAR(50), -- Schedule I, II, III, etc.
    requires_prescription BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'active', -- active, discontinued, recalled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medication Dispensing
CREATE TABLE medication_dispensing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_order_id UUID NOT NULL REFERENCES medication_orders(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES medication_inventory(id) ON DELETE SET NULL,
    dispensed_quantity DECIMAL(10,2) NOT NULL,
    dispensed_unit VARCHAR(20),
    dispensing_date TIMESTAMPTZ DEFAULT NOW(),
    dispensed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    patient_instructions TEXT,
    side_effects_discussed BOOLEAN DEFAULT FALSE,
    drug_interactions_discussed BOOLEAN DEFAULT FALSE,
    patient_understood BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Episodes of care (group related encounters)
CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    primary_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    specialty VARCHAR(100),
    diagnosis_snapshot JSONB DEFAULT '{}', -- primary diagnoses at episode start
    started_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'active', -- active, closed, cancelled
    closure_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link encounters to episodes
ALTER TABLE encounters ADD COLUMN episode_id UUID REFERENCES episodes(id) ON DELETE SET NULL;

-- Encounter links (explicit relationships between encounters)
CREATE TABLE encounter_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    from_encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    to_encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    relationship_type VARCHAR(40) NOT NULL, -- follow_up_of, referred_from, related_to, continued_from
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (from_encounter_id, to_encounter_id, relationship_type)
);

-- Terminology Management Tables

-- Code systems (terminology registries)
CREATE TABLE code_systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_uri VARCHAR(255) UNIQUE NOT NULL, -- e.g., 'zeal:visit-category'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'active', -- active, retired
    publisher VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Concepts (individual coded values)
CREATE TABLE concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_system_id UUID NOT NULL REFERENCES code_systems(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL, -- e.g., 'NEW', 'REVISIT'
    display_default VARCHAR(255) NOT NULL, -- 'New Visit'
    definition TEXT,
    sort_order INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (code_system_id, code)
);

-- Concept translations (for multi-language support)
CREATE TABLE concept_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL, -- 'en', 'ar'
    display TEXT NOT NULL,
    definition TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (concept_id, language_code)
);

-- Value sets (curated collections of concepts)
CREATE TABLE value_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL, -- 'visit-category'
    description TEXT,
    version VARCHAR(50) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'active',
    immutable BOOLEAN DEFAULT FALSE, -- true = no runtime changes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Value set members (concepts included in each value set)
CREATE TABLE value_set_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value_set_id UUID NOT NULL REFERENCES value_sets(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    include BOOLEAN DEFAULT TRUE, -- true = include, false = exclude
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (value_set_id, concept_id)
);

-- Visit classification rules (configurable business rules)
CREATE TABLE visit_classification_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES payers(id) ON DELETE CASCADE, -- NULL = default across payers
    specialty VARCHAR(100), -- NULL = any specialty
    scope VARCHAR(30) NOT NULL DEFAULT 'provider', -- provider, specialty, facility
    new_lookback_days INTEGER NOT NULL DEFAULT 1095, -- 3 years (CPT definition)
    followup_window_days INTEGER NOT NULL DEFAULT 30,
    must_link_for_followup BOOLEAN DEFAULT TRUE, -- require explicit encounter_links
    apply_same_staff BOOLEAN DEFAULT TRUE,
    apply_same_specialty BOOLEAN DEFAULT FALSE,
    apply_same_facility BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 100, -- higher = more specific
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visit billing map (map visit categories to billable codes)
CREATE TABLE visit_billing_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES payers(id) ON DELETE CASCADE, -- NULL = default
    in_network BOOLEAN DEFAULT TRUE,
    specialty VARCHAR(100), -- NULL = any
    place_of_service VARCHAR(20), -- clinic, telehealth, home, etc.
    visit_category_concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE RESTRICT,
    min_duration_minutes INTEGER, -- for time-based level selection
    max_duration_minutes INTEGER,
    code_type VARCHAR(20) NOT NULL DEFAULT 'CPT',
    code VARCHAR(50) NOT NULL,
    description TEXT,
    requires_preauth BOOLEAN DEFAULT FALSE,
    copay_policy VARCHAR(50) DEFAULT 'standard', -- standard, waive_followup, reduced_followup
    expected_allowed DECIMAL(10,2),
    priority INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follow-up waiver rules (fine-grained copay/fee waivers)
CREATE TABLE followup_waiver_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES payers(id) ON DELETE CASCADE, -- NULL = default
    specialty VARCHAR(100), -- NULL = any
    within_days INTEGER NOT NULL DEFAULT 14,
    waive_copay BOOLEAN DEFAULT TRUE,
    waive_professional_fee_pct NUMERIC(5,2), -- 0.00 to 100.00
    apply_when_same_diagnosis BOOLEAN DEFAULT TRUE,
    apply_when_same_procedure BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visit classification suggestions (AI predictions)
CREATE TABLE visit_classification_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    suggested_concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE RESTRICT,
    confidence NUMERIC(5,2), -- 0.00 to 100.00
    explanation TEXT,
    model_version VARCHAR(50),
    features_used JSONB DEFAULT '{}', -- input features for explainability
    accepted BOOLEAN,
    accepted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    accepted_at TIMESTAMPTZ,
    override_concept_id UUID REFERENCES concepts(id) ON DELETE RESTRICT,
    override_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visit type pricing rules (tenant-specific policies)
CREATE TABLE visit_type_pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    visit_type VARCHAR(50) NOT NULL, -- new_visit, revisit, follow_up, post_op_followup
    rule_name VARCHAR(100) NOT NULL,
    priority INTEGER DEFAULT 100,
    conditions JSONB DEFAULT '{}', -- {days_since_last_visit: {lte: 14}, specialty: "cardiology"}
    pricing_action VARCHAR(50) NOT NULL, -- no_charge, percentage_discount, fixed_discount, custom_price
    discount_percentage NUMERIC(5,2), -- e.g., 50.00 for 50% off
    discount_amount DECIMAL(10,2), -- fixed AED discount
    custom_price DECIMAL(10,2), -- override price
    applies_to_cpt_codes VARCHAR(20)[] DEFAULT '{}', -- specific CPT codes or empty for all
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE DEFAULT CURRENT_DATE,
    effective_to DATE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tenant_id, visit_type, rule_name)
);

-- Visit type history (audit trail)
CREATE TABLE visit_type_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    encounter_id UUID REFERENCES encounters(id) ON DELETE CASCADE,
    visit_type VARCHAR(50) NOT NULL,
    visit_date DATE NOT NULL,
    days_since_last_visit INTEGER,
    auto_classified BOOLEAN DEFAULT TRUE, -- true if auto-determined, false if manual override
    override_reason TEXT,
    pricing_rule_applied_id UUID REFERENCES visit_type_pricing_rules(id) ON DELETE SET NULL,
    original_price DECIMAL(10,2),
    adjusted_price DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Billing and RCM

```sql
-- Payers
CREATE TABLE payers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payer_name VARCHAR(255) NOT NULL,
    payer_id VARCHAR(100),
    payer_type VARCHAR(50),
    contact_info JSONB DEFAULT '{}',
    configuration JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee schedules
CREATE TABLE fee_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payer_id UUID NOT NULL REFERENCES payers(id) ON DELETE CASCADE,
    code_type VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    fee_amount DECIMAL(10,2) NOT NULL,
    effective_date DATE NOT NULL,
    expiration_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Superbills
CREATE TABLE superbills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    primary_staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'draft',
    payment_status VARCHAR(20) DEFAULT 'unpaid',  -- unpaid|partial|paid
    total_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - discount_amount + tax_amount) STORED,
    charges JSONB DEFAULT '[]',
    generated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claims (partitioned by service_date)
CREATE TABLE claim_headers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,   -- required for RLS
    superbill_id UUID NOT NULL REFERENCES superbills(id) ON DELETE CASCADE,
    payer_id UUID NOT NULL REFERENCES payers(id) ON DELETE CASCADE,
    claim_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    service_date DATE NOT NULL,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (service_date);

-- Monthly partitions (example)
CREATE TABLE claim_headers_2024_01 PARTITION OF claim_headers
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE claim_headers_2024_02 PARTITION OF claim_headers
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Remittances (partitioned by remittance_date)
CREATE TABLE remittance_headers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_header_id UUID NOT NULL REFERENCES claim_headers(id) ON DELETE CASCADE,
    remittance_id VARCHAR(100),
    payer_id VARCHAR(100),
    total_amount DECIMAL(10,2),
    paid_amount DECIMAL(10,2),
    remittance_date DATE NOT NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (remittance_date);

-- Superbill line items (normalized)
CREATE TABLE superbill_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    superbill_id UUID NOT NULL REFERENCES superbills(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    code_type VARCHAR(20) NOT NULL DEFAULT 'CPT',
    code VARCHAR(50) NOT NULL,
    description TEXT,
    modifiers VARCHAR(10)[] DEFAULT '{}',
    diagnosis_pointers VARCHAR(5)[] DEFAULT '{}',
    units INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    amount DECIMAL(10,2) GENERATED ALWAYS AS (units * unit_price) STORED,
    eligibility_request_id UUID REFERENCES eligibility_requests(id) ON DELETE SET NULL,
    expected_allowed DECIMAL(10,2),
    expected_patient_resp DECIMAL(10,2),
    expected_payer_resp DECIMAL(10,2),
    preauth_item_id UUID REFERENCES preauth_items(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (superbill_id, line_number)
);

-- Claim lines
CREATE TABLE claim_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_header_id UUID NOT NULL REFERENCES claim_headers(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    code_type VARCHAR(20) NOT NULL DEFAULT 'CPT',
    code VARCHAR(50) NOT NULL,
    description TEXT,
    modifiers VARCHAR(10)[] DEFAULT '{}',
    diagnosis_pointers VARCHAR(5)[] DEFAULT '{}',
    units INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    billed_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    place_of_service VARCHAR(10),
    rendering_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (claim_header_id, line_number)
);

-- Remittance lines
CREATE TABLE remittance_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remittance_header_id UUID NOT NULL REFERENCES remittance_headers(id) ON DELETE CASCADE,
    claim_header_id UUID REFERENCES claim_headers(id) ON DELETE SET NULL,
    line_number INTEGER,
    allowed_amount DECIMAL(10,2),
    paid_amount DECIMAL(10,2),
    patient_responsibility DECIMAL(10,2),
    adjustment_codes TEXT[] DEFAULT '{}',  -- e.g., {"CO-45","PR-1"} or use concept IDs later
    remark_codes TEXT[] DEFAULT '{}',
    status VARCHAR(50),                    -- PAID/PARTIAL/DENIED/ADJUSTED
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

```

### Eligibility, Benefits, Pre-Auth, Estimates, Payments

```sql
-- Eligibility requests (raw + normalized snapshot linkage)
CREATE TABLE eligibility_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    service_date DATE,
    request_payload JSONB DEFAULT '{}',
    response_payload JSONB DEFAULT '{}',
    status VARCHAR(30) DEFAULT 'completed', -- queued|submitted|completed|failed
    correlation_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eligibility benefits (normalized by service category)
CREATE TABLE eligibility_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eligibility_request_id UUID NOT NULL REFERENCES eligibility_requests(id) ON DELETE CASCADE,
    service_category VARCHAR(40) NOT NULL,  -- CONSULT, LAB, RAD, PROC, PHYSIO, PHARM, OP, IP, ED, DENTAL, VISION
    in_network BOOLEAN DEFAULT TRUE,
    coverage_status VARCHAR(30) DEFAULT 'active', -- active|inactive|limited
    copay_amount DECIMAL(10,2),
    coinsurance_pct NUMERIC(5,2),
    deductible_applies BOOLEAN,
    deductible_remaining DECIMAL(10,2),
    visit_limit INT,
    limit_period VARCHAR(20), -- per_visit|per_year|lifetime
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policy-level benefits (optional normalization)
CREATE TABLE policy_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    service_category VARCHAR(40) NOT NULL,
    in_network BOOLEAN DEFAULT TRUE,
    copay_amount DECIMAL(10,2),
    coinsurance_pct NUMERIC(5,2),
    deductible_applies BOOLEAN DEFAULT FALSE,
    annual_deductible DECIMAL(10,2),
    annual_oop_max DECIMAL(10,2),
    effective_date DATE,
    expiration_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (policy_id, service_category, in_network, effective_date)
);

-- Pre-authorization (header)
CREATE TABLE preauth_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(30) DEFAULT 'draft', -- draft|submitted|pending|approved|partial|denied|expired|revoked
    auth_reference VARCHAR(100),
    valid_from DATE,
    valid_to DATE,
    request_payload JSONB DEFAULT '{}',
    decision_payload JSONB DEFAULT '{}',
    denial_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-authorization items
CREATE TABLE preauth_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preauth_request_id UUID NOT NULL REFERENCES preauth_requests(id) ON DELETE CASCADE,
    code_type VARCHAR(20) NOT NULL DEFAULT 'CPT',
    code VARCHAR(50) NOT NULL,
    description TEXT,
    diagnosis_pointers VARCHAR(5)[] DEFAULT '{}',
    requested_units INT DEFAULT 1,
    approved_units INT,
    decision VARCHAR(20), -- approved|partial|denied|pending
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-authorization attachments (optional; or reuse documents)
CREATE TABLE preauth_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preauth_request_id UUID NOT NULL REFERENCES preauth_requests(id) ON DELETE CASCADE,
    document_id UUID,
    storage_key TEXT,
    file_name TEXT,
    mime TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cost estimates
CREATE TABLE cost_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL,
    eligibility_request_id UUID REFERENCES eligibility_requests(id) ON DELETE SET NULL,
    total_estimated_patient_resp DECIMAL(10,2),
    total_estimated_payer_resp DECIMAL(10,2),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cost_estimate_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cost_estimate_id UUID NOT NULL REFERENCES cost_estimates(id) ON DELETE CASCADE,
    code_type VARCHAR(20) NOT NULL DEFAULT 'CPT',
    code VARCHAR(50) NOT NULL,
    description TEXT,
    units INT DEFAULT 1,
    expected_allowed DECIMAL(10,2),
    expected_patient_resp DECIMAL(10,2),
    expected_payer_resp DECIMAL(10,2)
);

-- Patient payments (copay/coinsurance/deductible)
CREATE TABLE patient_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id UUID REFERENCES encounters(id) ON DELETE SET NULL,
    superbill_id UUID REFERENCES superbills(id) ON DELETE SET NULL,
    claim_header_id UUID REFERENCES claim_headers(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AED',
    method VARCHAR(30) NOT NULL, -- cash|card|upi|wallet|bank_transfer
    txn_reference VARCHAR(100),
    collected_by UUID REFERENCES users(id) ON DELETE SET NULL,
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    allocation JSONB DEFAULT '{}'
);

-- Bill cancellations
CREATE TABLE bill_cancellations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    superbill_id UUID NOT NULL REFERENCES superbills(id) ON DELETE CASCADE,
    cancellation_type VARCHAR(30) NOT NULL, -- full|partial
    reason VARCHAR(50) NOT NULL, -- patient_request|billing_error|service_not_rendered|duplicate|administrative|other
    reason_notes TEXT,
    original_amount DECIMAL(10,2) NOT NULL,
    cancelled_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending', -- pending|approved|rejected|completed
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    completed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bill cancellation items (for partial cancellations)
CREATE TABLE bill_cancellation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_cancellation_id UUID NOT NULL REFERENCES bill_cancellations(id) ON DELETE CASCADE,
    superbill_item_id UUID NOT NULL REFERENCES superbill_items(id) ON DELETE CASCADE,
    original_units INTEGER NOT NULL,
    cancelled_units INTEGER NOT NULL,
    original_amount DECIMAL(10,2) NOT NULL,
    cancelled_amount DECIMAL(10,2) NOT NULL,
    reason_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (bill_cancellation_id, superbill_item_id)
);

-- Refunds
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    superbill_id UUID REFERENCES superbills(id) ON DELETE SET NULL,
    bill_cancellation_id UUID REFERENCES bill_cancellations(id) ON DELETE SET NULL,
    refund_number VARCHAR(50) UNIQUE,
    refund_type VARCHAR(30) NOT NULL, -- full|partial|overpayment
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AED',
    method VARCHAR(30) NOT NULL, -- cash|card_reversal|bank_transfer|cheque|wallet
    status VARCHAR(30) DEFAULT 'pending', -- pending|processing|completed|failed|cancelled
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    processed_at TIMESTAMPTZ,
    txn_reference VARCHAR(100),
    bank_details JSONB DEFAULT '{}', -- account info for bank transfers
    failure_reason TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refund allocations (link refunds to original payments)
CREATE TABLE refund_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refund_id UUID NOT NULL REFERENCES refunds(id) ON DELETE CASCADE,
    patient_payment_id UUID NOT NULL REFERENCES patient_payments(id) ON DELETE CASCADE,
    allocated_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (refund_id, patient_payment_id)
);

```

## Row-Level Security (RLS) Policies

### Enable RLS on all tenant-scoped tables

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE superbills ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_resource_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE superbill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE remittance_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE eligibility_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE eligibility_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE preauth_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE preauth_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE preauth_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_cancellations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_cancellation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_type_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_type_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounter_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_set_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_classification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_billing_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE followup_waiver_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_classification_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_dispensing ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies
CREATE POLICY tenant_isolation_users ON users
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_patients ON patients
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_appointments ON appointments
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_staff_specialties ON staff_specialties
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_staff_licenses ON staff_licenses
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_equipment ON equipment
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_staff_schedules ON staff_schedules
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_equipment_schedules ON equipment_schedules
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_arr ON appointment_resource_requirements
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_appointment_resources ON appointment_resources
  FOR ALL TO application_role
  USING (
    EXISTS (SELECT 1 FROM appointments a
            WHERE a.id = appointment_resources.appointment_id
              AND a.tenant_id = current_setting('app.current_tenant_id')::uuid)
  );

CREATE POLICY tenant_isolation_resource_conflicts ON resource_conflicts
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY cross_tenant_policies ON policies
  FOR ALL TO application_role
  USING (
    EXISTS (SELECT 1 FROM patients p
            WHERE p.id = policies.patient_id
              AND p.tenant_id = current_setting('app.current_tenant_id')::uuid)
  );

CREATE POLICY tenant_isolation_eligibility_requests ON eligibility_requests
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_eligibility_benefits ON eligibility_benefits
  FOR ALL TO application_role
  USING (
    EXISTS (SELECT 1 FROM eligibility_requests er
            WHERE er.id = eligibility_benefits.eligibility_request_id
              AND er.tenant_id = current_setting('app.current_tenant_id')::uuid)
  );

CREATE POLICY tenant_isolation_preauth_requests ON preauth_requests
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_preauth_items ON preauth_items
  FOR ALL TO application_role
  USING (
    EXISTS (SELECT 1 FROM preauth_requests pr
            WHERE pr.id = preauth_items.preauth_request_id
              AND pr.tenant_id = current_setting('app.current_tenant_id')::uuid)
  );

CREATE POLICY tenant_isolation_preauth_attachments ON preauth_attachments
  FOR ALL TO application_role
  USING (
    EXISTS (SELECT 1 FROM preauth_requests pr
            WHERE pr.id = preauth_attachments.preauth_request_id
              AND pr.tenant_id = current_setting('app.current_tenant_id')::uuid)
  );

CREATE POLICY tenant_isolation_cost_estimates ON cost_estimates
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_cost_estimate_items ON cost_estimate_items
  FOR ALL TO application_role
  USING (
    EXISTS (SELECT 1 FROM cost_estimates ce
            WHERE ce.id = cost_estimate_items.cost_estimate_id
              AND ce.tenant_id = current_setting('app.current_tenant_id')::uuid)
  );

CREATE POLICY tenant_isolation_patient_payments ON patient_payments
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_bill_cancellations ON bill_cancellations
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_bill_cancellation_items ON bill_cancellation_items
  FOR ALL TO application_role
  USING (
    EXISTS (SELECT 1 FROM bill_cancellations bc
            WHERE bc.id = bill_cancellation_items.bill_cancellation_id
              AND bc.tenant_id = current_setting('app.current_tenant_id')::uuid)
  );

CREATE POLICY tenant_isolation_refunds ON refunds
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_refund_allocations ON refund_allocations
  FOR ALL TO application_role
  USING (
    EXISTS (SELECT 1 FROM refunds r
            WHERE r.id = refund_allocations.refund_id
              AND r.tenant_id = current_setting('app.current_tenant_id')::uuid)
  );

CREATE POLICY tenant_isolation_visit_type_pricing_rules ON visit_type_pricing_rules
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_visit_type_history ON visit_type_history
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_episodes ON episodes
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_encounter_links ON encounter_links
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_code_systems ON code_systems
  FOR ALL TO application_role
  USING (TRUE); -- Global terminology, no tenant isolation

CREATE POLICY tenant_isolation_concepts ON concepts
  FOR ALL TO application_role
  USING (TRUE); -- Global terminology, no tenant isolation

CREATE POLICY tenant_isolation_concept_translations ON concept_translations
  FOR ALL TO application_role
  USING (TRUE); -- Global terminology, no tenant isolation

CREATE POLICY tenant_isolation_value_sets ON value_sets
  FOR ALL TO application_role
  USING (TRUE); -- Global terminology, no tenant isolation

CREATE POLICY tenant_isolation_value_set_members ON value_set_members
  FOR ALL TO application_role
  USING (TRUE); -- Global terminology, no tenant isolation

CREATE POLICY tenant_isolation_visit_classification_rules ON visit_classification_rules
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_visit_billing_map ON visit_billing_map
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_followup_waiver_rules ON followup_waiver_rules
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_visit_classification_suggestions ON visit_classification_suggestions
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Order-related tables inherit tenancy via orders -> encounters -> patients -> tenant
CREATE POLICY tenant_isolation_medication_orders ON medication_orders
  FOR ALL TO application_role
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN encounters e ON e.id = o.encounter_id
      JOIN patients p ON p.id = e.patient_id
      WHERE o.id = medication_orders.order_id
        AND p.tenant_id = current_setting('app.current_tenant_id')::uuid
    )
  );

CREATE POLICY tenant_isolation_lab_orders ON lab_orders
  FOR ALL TO application_role
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN encounters e ON e.id = o.encounter_id
      JOIN patients p ON p.id = e.patient_id
      WHERE o.id = lab_orders.order_id
        AND p.tenant_id = current_setting('app.current_tenant_id')::uuid
    )
  );

CREATE POLICY tenant_isolation_imaging_orders ON imaging_orders
  FOR ALL TO application_role
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN encounters e ON e.id = o.encounter_id
      JOIN patients p ON p.id = e.patient_id
      WHERE o.id = imaging_orders.order_id
        AND p.tenant_id = current_setting('app.current_tenant_id')::uuid
    )
  );

CREATE POLICY tenant_isolation_procedure_orders ON procedure_orders
  FOR ALL TO application_role
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN encounters e ON e.id = o.encounter_id
      JOIN patients p ON p.id = e.patient_id
      WHERE o.id = procedure_orders.order_id
        AND p.tenant_id = current_setting('app.current_tenant_id')::uuid
    )
  );

CREATE POLICY tenant_isolation_referral_orders ON referral_orders
  FOR ALL TO application_role
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN encounters e ON e.id = o.encounter_id
      JOIN patients p ON p.id = e.patient_id
      WHERE o.id = referral_orders.order_id
        AND p.tenant_id = current_setting('app.current_tenant_id')::uuid
    )
  );

-- Result tables inherit tenancy via order tables
CREATE POLICY tenant_isolation_lab_results ON lab_results
  FOR ALL TO application_role
  USING (
    EXISTS (
      SELECT 1 FROM lab_orders lo
      JOIN orders o ON o.id = lo.order_id
      JOIN encounters e ON e.id = o.encounter_id
      JOIN patients p ON p.id = e.patient_id
      WHERE lo.id = lab_results.lab_order_id
        AND p.tenant_id = current_setting('app.current_tenant_id')::uuid
    )
  );

CREATE POLICY tenant_isolation_imaging_results ON imaging_results
  FOR ALL TO application_role
  USING (
    EXISTS (
      SELECT 1 FROM imaging_orders io
      JOIN orders o ON o.id = io.order_id
      JOIN encounters e ON e.id = o.encounter_id
      JOIN patients p ON p.id = e.patient_id
      WHERE io.id = imaging_results.imaging_order_id
        AND p.tenant_id = current_setting('app.current_tenant_id')::uuid
    )
  );

CREATE POLICY tenant_isolation_procedure_results ON procedure_results
  FOR ALL TO application_role
  USING (
    EXISTS (
      SELECT 1 FROM procedure_orders po
      JOIN orders o ON o.id = po.order_id
      JOIN encounters e ON e.id = o.encounter_id
      JOIN patients p ON p.id = e.patient_id
      WHERE po.id = procedure_results.procedure_order_id
        AND p.tenant_id = current_setting('app.current_tenant_id')::uuid
    )
  );

-- Inventory and dispensing are tenant-scoped directly
CREATE POLICY tenant_isolation_medication_inventory ON medication_inventory
  FOR ALL TO application_role
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_medication_dispensing ON medication_dispensing
  FOR ALL TO application_role
  USING (
    EXISTS (
      SELECT 1 FROM medication_orders mo
      JOIN orders o ON o.id = mo.order_id
      JOIN encounters e ON e.id = o.encounter_id
      JOIN patients p ON p.id = e.patient_id
      WHERE mo.id = medication_dispensing.medication_order_id
        AND p.tenant_id = current_setting('app.current_tenant_id')::uuid
    )
  );

-- Lines inherit tenancy via headers
CREATE POLICY tenant_isolation_claim_lines ON claim_lines
  FOR ALL TO application_role
  USING (
    EXISTS (SELECT 1 FROM claim_headers ch
            WHERE ch.id = claim_lines.claim_header_id
              AND ch.tenant_id = current_setting('app.current_tenant_id')::uuid)
  );

CREATE POLICY tenant_isolation_remittance_lines ON remittance_lines
  FOR ALL TO application_role
  USING (
    EXISTS (SELECT 1 FROM remittance_headers rh
            JOIN claim_headers ch ON ch.id = remittance_lines.claim_header_id
            WHERE rh.id = remittance_lines.remittance_header_id
              AND ch.tenant_id = current_setting('app.current_tenant_id')::uuid)
  );

-- Superbill items inherit via encounter → patient → tenant
CREATE POLICY tenant_isolation_superbill_items ON superbill_items
  FOR ALL TO application_role
  USING (
    EXISTS (SELECT 1
            FROM superbills sb
            JOIN encounters e ON e.id = sb.encounter_id
            JOIN patients p ON p.id = e.patient_id
            WHERE sb.id = superbill_items.superbill_id
              AND p.tenant_id = current_setting('app.current_tenant_id')::uuid)
  );

```

## Indexes for Performance

```sql
-- Tenant scoping
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_patients_tenant_id ON patients(tenant_id);
CREATE INDEX idx_appointments_tenant_id ON appointments(tenant_id);
CREATE INDEX idx_encounters_tenant_id ON encounters(tenant_id);
CREATE INDEX idx_staff_specialties_tenant ON staff_specialties(tenant_id);
CREATE INDEX idx_staff_licenses_tenant ON staff_licenses(tenant_id);
CREATE INDEX idx_equipment_tenant ON equipment(tenant_id);
CREATE INDEX idx_staff_schedules_tenant ON staff_schedules(tenant_id);
CREATE INDEX idx_equipment_schedules_tenant ON equipment_schedules(tenant_id);
CREATE INDEX idx_arr_tenant ON appointment_resource_requirements(tenant_id);
CREATE INDEX idx_resource_conflicts_tenant ON resource_conflicts(tenant_id);
CREATE INDEX idx_eligibility_requests_tenant ON eligibility_requests(tenant_id);
CREATE INDEX idx_preauth_requests_tenant ON preauth_requests(tenant_id);
CREATE INDEX idx_cost_estimates_tenant ON cost_estimates(tenant_id);
CREATE INDEX idx_patient_payments_tenant ON patient_payments(tenant_id);

-- Common queries
CREATE INDEX idx_appointments_patient_staff ON appointments(patient_id, primary_staff_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_type ON appointments(appointment_type, scheduled_at);
CREATE INDEX idx_appointments_visit_type ON appointments(visit_type, scheduled_at);
CREATE INDEX idx_appointments_linked_encounter ON appointments(linked_encounter_id) WHERE linked_encounter_id IS NOT NULL;
CREATE INDEX idx_encounters_patient_staff ON encounters(patient_id, primary_staff_id);
CREATE INDEX idx_encounters_start_time ON encounters(start_time);
CREATE INDEX idx_encounters_source ON encounters(encounter_source, start_time);
CREATE INDEX idx_encounters_walkin ON encounters(encounter_source, start_time) WHERE encounter_source = 'walk_in';
CREATE INDEX idx_encounters_emergency ON encounters(encounter_source, start_time) WHERE encounter_source = 'emergency';
CREATE INDEX idx_encounters_appointment ON encounters(appointment_id) WHERE appointment_id IS NOT NULL;
CREATE INDEX idx_staff_specialties_staff ON staff_specialties(staff_id);
CREATE INDEX idx_staff_licenses_staff ON staff_licenses(staff_id);
CREATE INDEX idx_appointment_resources_time ON appointment_resources(start_time, end_time);
CREATE INDEX idx_staff_schedules_time ON staff_schedules(day_of_week, start_time, end_time);
CREATE INDEX idx_equipment_schedules_time ON equipment_schedules(day_of_week, start_time, end_time);
CREATE INDEX idx_superbill_items_bill ON superbill_items(superbill_id);
CREATE INDEX idx_superbill_items_code ON superbill_items(code);
CREATE INDEX idx_claim_lines_header ON claim_lines(claim_header_id);
CREATE INDEX idx_claim_lines_code ON claim_lines(code);
CREATE INDEX idx_rem_lines_remittance ON remittance_lines(remittance_header_id);
CREATE INDEX idx_rem_lines_claim ON remittance_lines(claim_header_id);
CREATE INDEX idx_elig_benefits_req ON eligibility_benefits(eligibility_request_id);
CREATE INDEX idx_elig_benefits_cat ON eligibility_benefits(service_category, in_network);
CREATE INDEX idx_policy_benefits_policy ON policy_benefits(policy_id, service_category, in_network);
CREATE INDEX idx_preauth_req_tenant ON preauth_requests(tenant_id, status);
CREATE INDEX idx_preauth_items_req ON preauth_items(preauth_request_id);
CREATE INDEX idx_patient_payments_tenant_date ON patient_payments(tenant_id, collected_at);
CREATE INDEX idx_bill_cancellations_tenant ON bill_cancellations(tenant_id, status);
CREATE INDEX idx_bill_cancellations_superbill ON bill_cancellations(superbill_id);
CREATE INDEX idx_bill_cancellation_items_cancellation ON bill_cancellation_items(bill_cancellation_id);
CREATE INDEX idx_refunds_tenant ON refunds(tenant_id, status);
CREATE INDEX idx_refunds_patient ON refunds(patient_id, status);
CREATE INDEX idx_refunds_superbill ON refunds(superbill_id);
CREATE INDEX idx_refunds_cancellation ON refunds(bill_cancellation_id);
CREATE INDEX idx_refund_allocations_refund ON refund_allocations(refund_id);
CREATE INDEX idx_refund_allocations_payment ON refund_allocations(patient_payment_id);
CREATE INDEX idx_visit_type_pricing_rules_tenant ON visit_type_pricing_rules(tenant_id, visit_type, is_active);
CREATE INDEX idx_visit_type_pricing_rules_priority ON visit_type_pricing_rules(priority DESC) WHERE is_active = TRUE;
CREATE INDEX idx_visit_type_history_patient ON visit_type_history(patient_id, visit_date DESC);
CREATE INDEX idx_visit_type_history_staff ON visit_type_history(staff_id, visit_date DESC);
CREATE INDEX idx_visit_type_history_encounter ON visit_type_history(encounter_id) WHERE encounter_id IS NOT NULL;
CREATE INDEX idx_episodes_tenant ON episodes(tenant_id, status);
CREATE INDEX idx_episodes_patient ON episodes(patient_id, status);
CREATE INDEX idx_episodes_staff ON episodes(primary_staff_id);
CREATE INDEX idx_episodes_specialty ON episodes(specialty) WHERE specialty IS NOT NULL;
CREATE INDEX idx_encounters_episode ON encounters(episode_id) WHERE episode_id IS NOT NULL;
CREATE INDEX idx_encounter_links_from ON encounter_links(from_encounter_id, relationship_type);
CREATE INDEX idx_encounter_links_to ON encounter_links(to_encounter_id, relationship_type);
CREATE INDEX idx_encounter_links_tenant ON encounter_links(tenant_id);
CREATE INDEX idx_code_systems_uri ON code_systems(system_uri);
CREATE INDEX idx_concepts_code_system ON concepts(code_system_id, code);
CREATE INDEX idx_concepts_active ON concepts(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_concept_translations_concept ON concept_translations(concept_id);
CREATE INDEX idx_concept_translations_language ON concept_translations(language_code);
CREATE INDEX idx_value_set_members_vs ON value_set_members(value_set_id);
CREATE INDEX idx_value_set_members_concept ON value_set_members(concept_id);
CREATE INDEX idx_visit_classification_rules_tenant ON visit_classification_rules(tenant_id, is_active, priority DESC);
CREATE INDEX idx_visit_classification_rules_payer ON visit_classification_rules(payer_id) WHERE payer_id IS NOT NULL;
CREATE INDEX idx_visit_classification_rules_specialty ON visit_classification_rules(specialty) WHERE specialty IS NOT NULL;
CREATE INDEX idx_visit_billing_map_tenant ON visit_billing_map(tenant_id, is_active);
CREATE INDEX idx_visit_billing_map_payer ON visit_billing_map(payer_id) WHERE payer_id IS NOT NULL;
CREATE INDEX idx_visit_billing_map_concept ON visit_billing_map(visit_category_concept_id);
CREATE INDEX idx_visit_billing_map_specialty ON visit_billing_map(specialty) WHERE specialty IS NOT NULL;
CREATE INDEX idx_followup_waiver_rules_tenant ON followup_waiver_rules(tenant_id, is_active, priority DESC);
CREATE INDEX idx_followup_waiver_rules_payer ON followup_waiver_rules(payer_id) WHERE payer_id IS NOT NULL;
CREATE INDEX idx_followup_waiver_rules_specialty ON followup_waiver_rules(specialty) WHERE specialty IS NOT NULL;
CREATE INDEX idx_visit_classification_suggestions_appt ON visit_classification_suggestions(appointment_id);
CREATE INDEX idx_visit_classification_suggestions_patient ON visit_classification_suggestions(patient_id);
CREATE INDEX idx_visit_classification_suggestions_accepted ON visit_classification_suggestions(accepted);
CREATE INDEX idx_visit_classification_suggestions_tenant ON visit_classification_suggestions(tenant_id);
CREATE INDEX idx_orders_type_status ON orders(order_type, status, ordered_at);
CREATE INDEX idx_orders_encounter ON orders(encounter_id, order_type);
CREATE INDEX idx_medication_orders_order ON medication_orders(order_id);
CREATE INDEX idx_medication_orders_medication ON medication_orders(medication_name, medication_code);
CREATE INDEX idx_lab_orders_order ON lab_orders(order_id);
CREATE INDEX idx_lab_orders_test ON lab_orders(test_name, test_code);
CREATE INDEX idx_imaging_orders_order ON imaging_orders(order_id);
CREATE INDEX idx_imaging_orders_study ON imaging_orders(study_name, modality);
CREATE INDEX idx_procedure_orders_order ON procedure_orders(order_id);
CREATE INDEX idx_procedure_orders_procedure ON procedure_orders(procedure_name, procedure_code);
CREATE INDEX idx_referral_orders_order ON referral_orders(order_id);
CREATE INDEX idx_referral_orders_specialty ON referral_orders(specialty, urgency);
CREATE INDEX idx_lab_results_order ON lab_results(lab_order_id, result_date);
CREATE INDEX idx_lab_results_test ON lab_results(test_name, abnormal_flag);
CREATE INDEX idx_imaging_results_order ON imaging_results(imaging_order_id, report_date);
CREATE INDEX idx_imaging_results_study ON imaging_results(study_name, modality);
CREATE INDEX idx_procedure_results_order ON procedure_results(procedure_order_id);
CREATE INDEX idx_medication_inventory_tenant ON medication_inventory(tenant_id, status);
CREATE INDEX idx_medication_inventory_medication ON medication_inventory(medication_name, medication_code);
CREATE INDEX idx_medication_inventory_stock ON medication_inventory(current_stock, minimum_stock);
CREATE INDEX idx_medication_dispensing_order ON medication_dispensing(medication_order_id, dispensing_date);
CREATE INDEX idx_medication_dispensing_inventory ON medication_dispensing(inventory_id);

-- Full-text search
CREATE INDEX idx_patients_search ON patients USING gin(
  to_tsvector('english', first_name || ' ' || last_name)
);
CREATE INDEX idx_clinical_notes_search ON clinical_notes USING gin(
  to_tsvector('english', content)
);

-- Partial indexes (legacy string statuses; keep until concept IDs fully adopted)
CREATE INDEX idx_active_appointments ON appointments(scheduled_at) 
  WHERE status IN ('scheduled','confirmed');
CREATE INDEX idx_active_patients ON patients(created_at) 
  WHERE updated_at > NOW() - INTERVAL '1 year';
CREATE INDEX idx_active_staff ON staff(created_at) 
  WHERE status = 'active';
CREATE INDEX idx_active_specialties ON specialties(created_at) 
  WHERE is_active = TRUE;

```

## JSON Schemas

### WalkInDetails Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "WalkInDetails",
  "type": "object",
  "properties": {
    "arrival_time": { 
      "type": "string", 
      "format": "date-time",
      "description": "When the patient arrived for walk-in"
    },
    "wait_time_minutes": { 
      "type": "integer", 
      "minimum": 0,
      "description": "Time waited before being seen"
    },
    "urgency_level": { 
      "type": "string", 
      "enum": ["low", "medium", "high", "urgent"],
      "description": "Urgency assessment of the walk-in"
    },
    "referred_by": { 
      "type": "string",
      "description": "Who referred the patient (if applicable)"
    },
    "reason_for_walkin": { 
      "type": "string",
      "description": "Why patient chose walk-in over appointment"
    },
    "previous_appointment_cancelled": { 
      "type": "boolean",
      "description": "Whether patient cancelled a previous appointment"
    },
    "cancelled_appointment_id": { 
      "type": "string", 
      "format": "uuid",
      "description": "ID of cancelled appointment if applicable"
    },
    "insurance_verified": { 
      "type": "boolean",
      "description": "Whether insurance was verified at arrival"
    },
    "estimated_duration_minutes": { 
      "type": "integer", 
      "minimum": 1,
      "description": "Estimated encounter duration"
    },
    "notes": { 
      "type": "string",
      "description": "Additional walk-in specific notes"
    }
  },
  "required": ["arrival_time", "urgency_level"]
}
```

### Patient Demographics Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "nationality": {
      "type": "string",
      "description": "Patient nationality"
    },
    "marital_status": {
      "type": "string",
      "enum": ["single", "married", "divorced", "widowed"]
    },
    "occupation": {
      "type": "string",
      "description": "Patient occupation"
    },
    "employer": {
      "type": "string",
      "description": "Employer name"
    },
    "preferred_language": {
      "type": "string",
      "enum": ["ar", "en"],
      "default": "en"
    },
    "religion": {
      "type": "string",
      "description": "Patient religion"
    },
    "allergies": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "allergen": {"type": "string"},
          "severity": {"type": "string", "enum": ["mild", "moderate", "severe"]},
          "reaction": {"type": "string"}
        }
      }
    },
    "medical_history": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "condition": {"type": "string"},
          "diagnosis_date": {"type": "string", "format": "date"},
          "status": {"type": "string", "enum": ["active", "resolved", "chronic"]}
        }
      }
    }
  }
}
```

### Vital Signs Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "height_cm": {
      "type": "number",
      "minimum": 30,
      "maximum": 250,
      "description": "Height in centimeters"
    },
    "weight_kg": {
      "type": "number",
      "minimum": 0.5,
      "maximum": 500,
      "description": "Weight in kilograms"
    },
    "temperature_c": {
      "type": "number",
      "minimum": 30,
      "maximum": 45,
      "description": "Temperature in Celsius"
    },
    "systolic_bp": {
      "type": "integer",
      "minimum": 50,
      "maximum": 250,
      "description": "Systolic blood pressure"
    },
    "diastolic_bp": {
      "type": "integer",
      "minimum": 30,
      "maximum": 150,
      "description": "Diastolic blood pressure"
    },
    "heart_rate": {
      "type": "integer",
      "minimum": 30,
      "maximum": 200,
      "description": "Heart rate per minute"
    },
    "respiratory_rate": {
      "type": "integer",
      "minimum": 5,
      "maximum": 50,
      "description": "Respiratory rate per minute"
    },
    "oxygen_saturation": {
      "type": "number",
      "minimum": 70,
      "maximum": 100,
      "description": "Oxygen saturation percentage"
    },
    "bmi": {
      "type": "number",
      "minimum": 10,
      "maximum": 80,
      "description": "Body Mass Index"
    }
  }
}
```

### Clinical Note Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "note_type": {
      "type": "string",
      "enum": ["soap", "progress", "discharge", "consultation", "procedure"]
    },
    "sections": {
      "type": "object",
      "properties": {
        "subjective": {
          "type": "object",
          "properties": {
            "chief_complaint": {"type": "string"},
            "history_present_illness": {"type": "string"},
            "review_of_systems": {"type": "string"},
            "past_medical_history": {"type": "string"},
            "medications": {"type": "string"},
            "allergies": {"type": "string"},
            "social_history": {"type": "string"},
            "family_history": {"type": "string"}
          }
        },
        "objective": {
          "type": "object",
          "properties": {
            "vital_signs": {"$ref": "#/definitions/VitalSigns"},
            "physical_exam": {"type": "string"},
            "laboratory_results": {"type": "string"},
            "imaging_results": {"type": "string"}
          }
        },
        "assessment": {
          "type": "object",
          "properties": {
            "diagnoses": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "icd_code": {"type": "string"},
                  "description": {"type": "string"},
                  "status": {"type": "string", "enum": ["primary", "secondary", "rule_out"]}
                }
              }
            },
            "differential_diagnosis": {"type": "string"},
            "clinical_impression": {"type": "string"}
          }
        },
        "plan": {
          "type": "object",
          "properties": {
            "treatment_plan": {"type": "string"},
            "medications": {"type": "string"},
            "procedures": {"type": "string"},
            "follow_up": {"type": "string"},
            "patient_education": {"type": "string"}
          }
        }
      }
    },
    "ai_generated": {
      "type": "boolean",
      "default": false
    },
    "confidence_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 1
    }
  }
}
```

### Eligibility Snapshot Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EligibilitySnapshot",
  "type": "object",
  "properties": {
    "member_status": { 
      "type": "string", 
      "enum": ["active", "inactive", "limited"] 
    },
    "plan_name": { 
      "type": "string" 
    },
    "copays": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "service_category": { 
            "type": "string",
            "enum": ["CONSULT", "LAB", "RAD", "PROC", "PHYSIO", "PHARM", "OP", "IP", "ED", "DENTAL", "VISION"]
          },
          "in_network": { 
            "type": "boolean" 
          },
          "copay_amount": { 
            "type": "number",
            "minimum": 0,
            "description": "Fixed AED amount"
          },
          "coinsurance_pct": { 
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "Percentage (e.g., 20.00 for 20%)"
          },
          "deductible_applies": { 
            "type": "boolean" 
          },
          "deductible_remaining": { 
            "type": "number",
            "minimum": 0,
            "description": "Remaining deductible amount in AED"
          },
          "visit_limit": { 
            "type": "integer",
            "minimum": 0,
            "description": "Number of visits allowed"
          },
          "limit_period": {
            "type": "string",
            "enum": ["per_visit", "per_year", "lifetime"],
            "description": "Period for visit limits"
          }
        },
        "required": ["service_category"]
      }
    },
    "deductible": {
      "type": "object",
      "properties": {
        "annual_deductible": {
          "type": "number",
          "minimum": 0,
          "description": "Annual deductible amount in AED"
        },
        "deductible_met": {
          "type": "number",
          "minimum": 0,
          "description": "Amount of deductible already met"
        },
        "deductible_remaining": {
          "type": "number",
          "minimum": 0,
          "description": "Remaining deductible amount"
        }
      }
    },
    "out_of_pocket": {
      "type": "object",
      "properties": {
        "annual_oop_max": {
          "type": "number",
          "minimum": 0,
          "description": "Annual out-of-pocket maximum in AED"
        },
        "oop_met": {
          "type": "number",
          "minimum": 0,
          "description": "Amount of OOP already met"
        },
        "oop_remaining": {
          "type": "number",
          "minimum": 0,
          "description": "Remaining OOP amount"
        }
      }
    },
    "effective_date": {
      "type": "string",
      "format": "date",
      "description": "Coverage effective date"
    },
    "expiration_date": {
      "type": "string",
      "format": "date",
      "description": "Coverage expiration date"
    },
    "notes": {
      "type": "string",
      "description": "Additional coverage notes"
    }
  },
  "required": ["member_status"]
}
```

## Visit Type Classification Functions

### Determine Visit Type Function

```sql
-- Function to automatically determine visit type based on patient history
CREATE OR REPLACE FUNCTION determine_visit_type(
    p_patient_id UUID,
    p_staff_id UUID,
    p_appointment_date DATE
) RETURNS TABLE(
    visit_type VARCHAR(50),
    days_since_last_visit INTEGER,
    last_encounter_id UUID,
    last_visit_date DATE
) AS $$
DECLARE
    v_last_visit_date DATE;
    v_days_since_visit INTEGER;
    v_last_encounter_id UUID;
    v_visit_type VARCHAR(50);
BEGIN
    -- Find last completed encounter with this provider
    SELECT 
        DATE(e.start_time),
        e.id,
        EXTRACT(DAY FROM (p_appointment_date - DATE(e.start_time)))::INTEGER
    INTO 
        v_last_visit_date,
        v_last_encounter_id,
        v_days_since_visit
    FROM encounters e
    WHERE e.patient_id = p_patient_id
      AND e.primary_staff_id = p_staff_id
      AND e.status = 'completed'
    ORDER BY e.start_time DESC
    LIMIT 1;
    
    -- Determine visit type based on days since last visit
    IF v_last_visit_date IS NULL THEN
        -- Never seen this provider
        v_visit_type := 'new_visit';
    ELSIF v_days_since_visit > 1095 THEN
        -- More than 3 years (CPT definition of "new patient")
        v_visit_type := 'new_visit';
    ELSIF v_days_since_visit <= 14 THEN
        -- Within 14 days = likely follow-up
        v_visit_type := 'follow_up';
    ELSE
        -- Established patient, new complaint
        v_visit_type := 'revisit';
    END IF;
    
    RETURN QUERY SELECT 
        v_visit_type,
        v_days_since_visit,
        v_last_encounter_id,
        v_last_visit_date;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get applicable pricing rule for a visit
CREATE OR REPLACE FUNCTION get_visit_pricing_rule(
    p_tenant_id UUID,
    p_visit_type VARCHAR(50),
    p_days_since_last INTEGER,
    p_cpt_code VARCHAR(20),
    p_specialty VARCHAR(100) DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_rule_id UUID;
BEGIN
    -- Find the highest priority active rule that matches conditions
    SELECT id INTO v_rule_id
    FROM visit_type_pricing_rules
    WHERE tenant_id = p_tenant_id
      AND visit_type = p_visit_type
      AND is_active = TRUE
      AND (effective_from IS NULL OR effective_from <= CURRENT_DATE)
      AND (effective_to IS NULL OR effective_to >= CURRENT_DATE)
      AND (
          -- Check if CPT code matches (if specified)
          applies_to_cpt_codes = '{}' 
          OR p_cpt_code = ANY(applies_to_cpt_codes)
      )
      AND (
          -- Check JSON conditions
          conditions = '{}'
          OR (
              -- Days since last visit condition
              (conditions->'days_since_last_visit'->>'lte')::INTEGER IS NULL
              OR p_days_since_last <= (conditions->'days_since_last_visit'->>'lte')::INTEGER
          )
          AND (
              (conditions->'days_since_last_visit'->>'gte')::INTEGER IS NULL
              OR p_days_since_last >= (conditions->'days_since_last_visit'->>'gte')::INTEGER
          )
          AND (
              -- Specialty condition
              conditions->>'specialty' IS NULL
              OR p_specialty = conditions->>'specialty'
          )
      )
    ORDER BY priority DESC
    LIMIT 1;
    
    RETURN v_rule_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to calculate adjusted price based on pricing rule
CREATE OR REPLACE FUNCTION calculate_visit_price(
    p_original_price DECIMAL(10,2),
    p_pricing_rule_id UUID
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    v_rule RECORD;
    v_adjusted_price DECIMAL(10,2);
BEGIN
    IF p_pricing_rule_id IS NULL THEN
        RETURN p_original_price;
    END IF;
    
    SELECT * INTO v_rule
    FROM visit_type_pricing_rules
    WHERE id = p_pricing_rule_id;
    
    IF NOT FOUND THEN
        RETURN p_original_price;
    END IF;
    
    CASE v_rule.pricing_action
        WHEN 'no_charge' THEN
            v_adjusted_price := 0.00;
        WHEN 'percentage_discount' THEN
            v_adjusted_price := p_original_price * (1 - v_rule.discount_percentage / 100.0);
        WHEN 'fixed_discount' THEN
            v_adjusted_price := GREATEST(0, p_original_price - v_rule.discount_amount);
        WHEN 'custom_price' THEN
            v_adjusted_price := v_rule.custom_price;
        ELSE
            v_adjusted_price := p_original_price;
    END CASE;
    
    RETURN v_adjusted_price;
END;
$$ LANGUAGE plpgsql STABLE;
```

### Trigger to Auto-Record Visit Type History

```sql
-- Trigger function to record visit type history after encounter
CREATE OR REPLACE FUNCTION record_visit_type_history()
RETURNS TRIGGER AS $$
DECLARE
    v_visit_info RECORD;
    v_pricing_rule_id UUID;
BEGIN
    -- Only record when encounter is completed
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Get appointment visit type info
        SELECT 
            a.visit_type,
            a.linked_encounter_id,
            a.metadata
        INTO v_visit_info
        FROM appointments a
        WHERE a.id = NEW.appointment_id;
        
        -- Get days since last visit
        SELECT days_since_last_visit
        INTO v_visit_info.days_since_last
        FROM determine_visit_type(
            NEW.patient_id,
            NEW.primary_staff_id,
            DATE(NEW.start_time)
        );
        
        -- Record in history
        INSERT INTO visit_type_history (
            tenant_id,
            patient_id,
            staff_id,
            encounter_id,
            visit_type,
            visit_date,
            days_since_last_visit
        ) VALUES (
            (SELECT tenant_id FROM patients WHERE id = NEW.patient_id),
            NEW.patient_id,
            NEW.primary_staff_id,
            NEW.id,
            COALESCE(v_visit_info.visit_type, 'revisit'),
            DATE(NEW.start_time),
            v_visit_info.days_since_last
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to encounters table
CREATE TRIGGER trg_record_visit_type_history
    AFTER INSERT OR UPDATE ON encounters
    FOR EACH ROW
    EXECUTE FUNCTION record_visit_type_history();
```

---

## Data Encryption

### Sensitive Data Encryption

```sql
-- Enable encryption for sensitive columns
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(encrypt(data::bytea, current_setting('app.encryption_key'), 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN convert_from(decrypt(decode(encrypted_data, 'base64'), current_setting('app.encryption_key'), 'aes'), 'UTF8');
END;
$$ LANGUAGE plpgsql;

-- Encrypted columns (example)
ALTER TABLE patients ADD COLUMN emirates_id_encrypted TEXT;
ALTER TABLE patients ADD COLUMN phone_encrypted TEXT;
ALTER TABLE patients ADD COLUMN email_encrypted TEXT;

-- Trigger to automatically encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_patient_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.emirates_id IS NOT NULL THEN
        NEW.emirates_id_encrypted := encrypt_sensitive_data(NEW.emirates_id);
        NEW.emirates_id := NULL;
    END IF;
    
    IF NEW.phone IS NOT NULL THEN
        NEW.phone_encrypted := encrypt_sensitive_data(NEW.phone);
        NEW.phone := NULL;
    END IF;
    
    IF NEW.email IS NOT NULL THEN
        NEW.email_encrypted := encrypt_sensitive_data(NEW.email);
        NEW.email := NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER encrypt_patient_data_trigger
    BEFORE INSERT OR UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION encrypt_patient_data();
```

## Audit and Compliance

### Audit Logging

```sql
-- Audit log table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions for audit logs
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        tenant_id,
        user_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values,
        ip_address,
        user_agent
    ) VALUES (
        COALESCE(NEW.tenant_id, OLD.tenant_id),
        current_setting('app.current_user_id', true)::uuid,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' THEN row_to_json(NEW) ELSE row_to_json(NEW) END,
        inet_client_addr(),
        current_setting('app.user_agent', true)
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_patients_trigger
    AFTER INSERT OR UPDATE OR DELETE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_appointments_trigger
    AFTER INSERT OR UPDATE OR DELETE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();
```

## Data Retention and Archival

### Data Retention Policies

```sql
-- Data retention configuration
CREATE TABLE data_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    retention_period INTERVAL NOT NULL,
    archive_before_delete BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default retention policies
INSERT INTO data_retention_policies (table_name, retention_period, archive_before_delete) VALUES
('audit_logs', '7 years', true),
('claim_headers', '10 years', true),
('remittance_headers', '10 years', true),
('clinical_notes', '10 years', true),
('appointments', '7 years', true),
('encounters', '10 years', true);

-- Archive table for old data
CREATE TABLE archived_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_table VARCHAR(100) NOT NULL,
    original_id UUID NOT NULL,
    data JSONB NOT NULL,
    archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to archive old data
CREATE OR REPLACE FUNCTION archive_old_data()
RETURNS VOID AS $$
DECLARE
    policy RECORD;
    cutoff_date TIMESTAMP WITH TIME ZONE;
BEGIN
    FOR policy IN SELECT * FROM data_retention_policies WHERE is_active = true LOOP
        cutoff_date := NOW() - policy.retention_period;
        
        -- Archive data before deletion
        IF policy.archive_before_delete THEN
            EXECUTE format('
                INSERT INTO archived_data (original_table, original_id, data)
                SELECT %L, id, row_to_json(t.*)
                FROM %I t
                WHERE created_at < %L',
                policy.table_name, policy.table_name, cutoff_date
            );
        END IF;
        
        -- Delete old data
        EXECUTE format('DELETE FROM %I WHERE created_at < %L', 
                      policy.table_name, cutoff_date);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```
