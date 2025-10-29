-- Multi-Resource Scheduling System Migration
-- Created: 2025-10-29
-- Purpose: Enable comprehensive appointment scheduling with staff, equipment, and space resources

-- ========================================
-- RESOURCE SCHEDULES
-- ========================================

-- Staff availability schedules (recurring weekly patterns)
CREATE TABLE IF NOT EXISTS staff_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    staff_id UUID NOT NULL,
    facility_id UUID,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    schedule_type VARCHAR(50) DEFAULT 'regular', -- regular, on-call, special
    notes TEXT,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE, -- NULL means indefinite
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT staff_schedules_time_order CHECK (end_time > start_time),
    CONSTRAINT staff_schedules_unique_slot UNIQUE (staff_id, day_of_week, start_time, effective_from)
);

CREATE INDEX idx_staff_schedules_tenant_staff ON staff_schedules(tenant_id, staff_id);
CREATE INDEX idx_staff_schedules_day_time ON staff_schedules(day_of_week, start_time);
CREATE INDEX idx_staff_schedules_effective_dates ON staff_schedules(effective_from, effective_to);
CREATE INDEX idx_staff_schedules_facility ON staff_schedules(facility_id) WHERE facility_id IS NOT NULL;

-- Equipment availability schedules (recurring weekly patterns)
CREATE TABLE IF NOT EXISTS equipment_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    equipment_id UUID NOT NULL,
    facility_id UUID,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    maintenance_type VARCHAR(50), -- scheduled_maintenance, emergency_repair, calibration
    notes TEXT,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT equipment_schedules_time_order CHECK (end_time > start_time),
    CONSTRAINT equipment_schedules_unique_slot UNIQUE (equipment_id, day_of_week, start_time, effective_from)
);

CREATE INDEX idx_equipment_schedules_tenant_equipment ON equipment_schedules(tenant_id, equipment_id);
CREATE INDEX idx_equipment_schedules_day_time ON equipment_schedules(day_of_week, start_time);
CREATE INDEX idx_equipment_schedules_effective_dates ON equipment_schedules(effective_from, effective_to);
CREATE INDEX idx_equipment_schedules_maintenance ON equipment_schedules(maintenance_type) WHERE maintenance_type IS NOT NULL;

-- Space (room) availability schedules (recurring weekly patterns)
CREATE TABLE IF NOT EXISTS space_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    space_id UUID NOT NULL,
    facility_id UUID,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    block_reason VARCHAR(100), -- maintenance, cleaning, renovation
    notes TEXT,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT space_schedules_time_order CHECK (end_time > start_time),
    CONSTRAINT space_schedules_unique_slot UNIQUE (space_id, day_of_week, start_time, effective_from)
);

CREATE INDEX idx_space_schedules_tenant_space ON space_schedules(tenant_id, space_id);
CREATE INDEX idx_space_schedules_day_time ON space_schedules(day_of_week, start_time);
CREATE INDEX idx_space_schedules_effective_dates ON space_schedules(effective_from, effective_to);

-- ========================================
-- ONE-TIME RESOURCE BLOCKS
-- ========================================

-- One-time availability blocks (vacations, emergencies, special events)
CREATE TABLE IF NOT EXISTS resource_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- staff, equipment, space
    resource_id UUID NOT NULL,
    facility_id UUID,
    block_type VARCHAR(50) NOT NULL, -- vacation, sick_leave, maintenance, emergency, special_event
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    is_available BOOLEAN DEFAULT FALSE, -- Usually blocks mean unavailable
    reason TEXT,
    approval_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT resource_blocks_time_order CHECK (end_datetime > start_datetime)
);

CREATE INDEX idx_resource_blocks_tenant_resource ON resource_blocks(tenant_id, resource_type, resource_id);
CREATE INDEX idx_resource_blocks_datetime ON resource_blocks(start_datetime, end_datetime);
CREATE INDEX idx_resource_blocks_type ON resource_blocks(block_type);
CREATE INDEX idx_resource_blocks_approval ON resource_blocks(approval_status);

-- ========================================
-- APPOINTMENT RESOURCE REQUIREMENTS
-- ========================================

-- Define resource requirements for different appointment types
CREATE TABLE IF NOT EXISTS appointment_resource_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    appointment_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- staff, equipment, space
    resource_role VARCHAR(100), -- e.g., primary_physician, nurse, anesthesiologist, mri_machine, operating_room
    resource_id UUID, -- Specific resource (optional, NULL means any of this role)
    is_required BOOLEAN DEFAULT TRUE,
    min_quantity INTEGER DEFAULT 1,
    max_quantity INTEGER DEFAULT 1,
    min_duration_minutes INTEGER DEFAULT 30,
    max_duration_minutes INTEGER,
    preparation_time_minutes INTEGER DEFAULT 0, -- Time before appointment
    cleanup_time_minutes INTEGER DEFAULT 0, -- Time after appointment
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT appointment_resource_requirements_quantity CHECK (max_quantity >= min_quantity),
    CONSTRAINT appointment_resource_requirements_duration CHECK (max_duration_minutes IS NULL OR max_duration_minutes >= min_duration_minutes)
);

CREATE INDEX idx_appt_resource_req_tenant_type ON appointment_resource_requirements(tenant_id, appointment_type);
CREATE INDEX idx_appt_resource_req_resource_type ON appointment_resource_requirements(resource_type);
CREATE INDEX idx_appt_resource_req_role ON appointment_resource_requirements(resource_role);

-- ========================================
-- APPOINTMENT RESOURCES (Actual Assignments)
-- ========================================

-- Link appointments to actual resources (staff, equipment, spaces)
CREATE TABLE IF NOT EXISTS appointment_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    appointment_id UUID NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- staff, equipment, space
    resource_id UUID NOT NULL,
    resource_role VARCHAR(100), -- e.g., primary_physician, assistant_nurse, mri_machine
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    preparation_start TIMESTAMPTZ, -- When prep begins (before start_time)
    cleanup_end TIMESTAMPTZ, -- When cleanup ends (after end_time)
    status VARCHAR(20) DEFAULT 'allocated', -- allocated, confirmed, in_use, completed, cancelled
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT appointment_resources_time_order CHECK (end_time > start_time),
    CONSTRAINT appointment_resources_prep_order CHECK (preparation_start IS NULL OR preparation_start <= start_time),
    CONSTRAINT appointment_resources_cleanup_order CHECK (cleanup_end IS NULL OR cleanup_end >= end_time)
);

CREATE INDEX idx_appointment_resources_tenant_appointment ON appointment_resources(tenant_id, appointment_id);
CREATE INDEX idx_appointment_resources_resource ON appointment_resources(resource_type, resource_id);
CREATE INDEX idx_appointment_resources_datetime ON appointment_resources(start_time, end_time);
CREATE INDEX idx_appointment_resources_status ON appointment_resources(status);

-- ========================================
-- APPOINTMENT SERIES (For Recurring Appointments)
-- ========================================

-- Manage recurring appointment series
CREATE TABLE IF NOT EXISTS appointment_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    series_name VARCHAR(200),
    appointment_type VARCHAR(100) NOT NULL,
    recurrence_pattern VARCHAR(50) NOT NULL, -- daily, weekly, monthly, custom
    recurrence_rule TEXT, -- RRULE format (RFC 5545)
    start_date DATE NOT NULL,
    end_date DATE, -- NULL means indefinite
    total_occurrences INTEGER,
    occurrences_created INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, paused, completed, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_appointment_series_tenant_patient ON appointment_series(tenant_id, patient_id);
CREATE INDEX idx_appointment_series_dates ON appointment_series(start_date, end_date);
CREATE INDEX idx_appointment_series_status ON appointment_series(status);

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE staff_schedules IS 'Recurring weekly availability schedules for staff members';
COMMENT ON TABLE equipment_schedules IS 'Recurring weekly availability schedules for medical equipment';
COMMENT ON TABLE space_schedules IS 'Recurring weekly availability schedules for spaces (rooms, beds, etc.)';
COMMENT ON TABLE resource_blocks IS 'One-time availability blocks for vacations, maintenance, emergencies, etc.';
COMMENT ON TABLE appointment_resource_requirements IS 'Define what resources are needed for different appointment types';
COMMENT ON TABLE appointment_resources IS 'Track actual resources assigned to appointments';
COMMENT ON TABLE appointment_series IS 'Manage recurring appointment series';

COMMENT ON COLUMN staff_schedules.day_of_week IS '0=Sunday, 1=Monday, ..., 6=Saturday';
COMMENT ON COLUMN staff_schedules.effective_from IS 'Start date when this schedule becomes active';
COMMENT ON COLUMN staff_schedules.effective_to IS 'End date when this schedule expires (NULL=indefinite)';
COMMENT ON COLUMN resource_blocks.is_available IS 'Usually FALSE for blocks (indicating unavailability)';
COMMENT ON COLUMN appointment_resource_requirements.resource_id IS 'Specific resource required (NULL means any resource matching the role)';
COMMENT ON COLUMN appointment_resources.preparation_start IS 'When preparation for this resource begins';
COMMENT ON COLUMN appointment_resources.cleanup_end IS 'When cleanup for this resource completes';
