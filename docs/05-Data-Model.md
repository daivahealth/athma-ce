# Data Model

## Database Topology Overview

Zeal uses PostgreSQL 16 with Row-Level Security (RLS) to enforce multi-tenancy. **Foundation** retains shared master data (tenants, facilities, staff, specialties, RBAC). Workload-heavy domains (Patients, Scheduling, Encounters/EHR, Billing/RCM) run in **domain-specific Postgres databases** that apply the same `tenant_id`-based RLS. This hybrid approach aligns with ADR-0003 and ADR-0013. Aggregated analytics flow into ClickHouse (ADR-0010).

> **Scalability note**: Table names are generic and support clinics, hospitals, diagnostic centers, surgical suites, and other provider types. See `12-Scalability-Healthcare-Providers.md` for patterns across multiple service lines.

## Foundation Master Data

### Tenants & Users
```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
    UNIQUE (tenant_id, email)
);
```

### Facilities & Spaces
```sql
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100),
    facility_type VARCHAR(50) DEFAULT 'clinic',
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    emirate VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'UAE',
    phone_number VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    capacity INT,
    operating_hours JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tenant_id, name)
);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    department_type VARCHAR(50),
    specialty_id UUID REFERENCES specialties(id) ON DELETE SET NULL,
    head_of_department UUID REFERENCES staff(id) ON DELETE SET NULL,
    floor_number VARCHAR(10),
    operating_hours JSONB,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    ward_type VARCHAR(50),
    total_beds INT DEFAULT 0,
    available_beds INT DEFAULT 0,
    nursing_station VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE beds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id UUID NOT NULL REFERENCES wards(id) ON DELETE CASCADE,
    bed_number VARCHAR(20) NOT NULL,
    bed_type VARCHAR(50),
    features JSONB,
    status VARCHAR(50) DEFAULT 'available',
    current_patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (ward_id, bed_number)
);

CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    space_number VARCHAR(50),
    space_type VARCHAR(50),
    floor_number VARCHAR(10),
    equipment JSONB DEFAULT '[]',
    capacity INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Staff & Specialties
```sql
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    employee_id VARCHAR(100) NOT NULL,
    staff_type VARCHAR(50) DEFAULT 'physician',
    license_number VARCHAR(100),
    license_expiry DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tenant_id, employee_id)
);

CREATE TABLE specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE staff_specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE RESTRICT,
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    primary_flag BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (staff_id, specialty_id, facility_id)
);
```

### RBAC & Multi-Facility Access
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tenant_id, code)
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    resource VARCHAR(100),
    action VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (role_id, permission_id)
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (user_id, role_id)
);

CREATE TABLE user_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    access_level VARCHAR(50) DEFAULT 'standard',
    is_default BOOLEAN DEFAULT FALSE,
    granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    UNIQUE (user_id, facility_id)
);
```

## Domain Service Schemas (Dedicated Databases)

Each domain service maintains its own Postgres database, applying the same `tenant_id` RLS policies. Samples below highlight key tables per domain.

### Patient Service
```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    emirates_id VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    marital_status VARCHAR(50),
    nationality VARCHAR(100) DEFAULT 'UAE',
    phone_number VARCHAR(20),
    email VARCHAR(255),
    address JSONB DEFAULT '{}',
    emergency_contact JSONB DEFAULT '{}',
    insurance_info JSONB DEFAULT '{}',
    preferred_language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    @@tenant_rls@@
);

CREATE TABLE patient_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    consent_text TEXT,
    signed_by VARCHAR(255),
    signed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    @@tenant_rls@@
);

CREATE TABLE patient_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    payer_id UUID,
    policy_number VARCHAR(100) NOT NULL,
    group_number VARCHAR(100),
    relationship VARCHAR(50),
    effective_date DATE,
    expiration_date DATE,
    benefits JSONB DEFAULT '{}',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    @@tenant_rls@@
);
```

### Scheduling Service
```sql
CREATE TABLE provider_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    timezone VARCHAR(50) DEFAULT 'Asia/Dubai',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    @@tenant_rls@@
);

CREATE TABLE provider_template_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
