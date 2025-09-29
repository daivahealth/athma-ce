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
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    encounter_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'in_progress',
    chief_complaint TEXT,
    assessment TEXT,
    plan TEXT,
    vital_signs JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
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

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    primary_staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    order_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    description TEXT,
    specifications JSONB DEFAULT '{}',
    ordered_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
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
CREATE INDEX idx_encounters_patient_staff ON encounters(patient_id, primary_staff_id);
CREATE INDEX idx_encounters_start_time ON encounters(start_time);
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
