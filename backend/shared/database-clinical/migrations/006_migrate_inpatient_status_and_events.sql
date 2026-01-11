-- Migration: Migrate inpatient admission status and events to new schema
-- Purpose: Transform existing status strings and event data to new enum-based structure
-- Date: 2026-01-09
-- Author: System
-- Description:
--   1. Creates new enum types for status management
--   2. Adds new columns to inpatient_admissions
--   3. Migrates existing data to new structure
--   4. Transforms existing inpatient_events to new schema
--   5. Removes old columns after successful migration

BEGIN;

-- ==============================================================================
-- STEP 1: Create Enum Types
-- ==============================================================================

CREATE TYPE "InpatientAdmissionStatus" AS ENUM (
  'ADMITTED',
  'ACTIVE',
  'ON_LEAVE',
  'DISCHARGE_PLANNING',
  'DISCHARGED',
  'EXPIRED',
  'ABSCONDED',
  'CANCELLED'
);

CREATE TYPE "InpatientDischargeStatus" AS ENUM (
  'NONE',
  'FIT_FOR_DISCHARGE',
  'INITIATED',
  'READY',
  'CONFIRMED'
);

CREATE TYPE "InpatientAcuity" AS ENUM (
  'STABLE',
  'WATCH',
  'CRITICAL'
);

CREATE TYPE "InpatientEventType" AS ENUM (
  'ADMISSION_CREATED',
  'STATUS_CHANGED',
  'DISCHARGE_STATUS_CHANGED',
  'BED_ASSIGNED',
  'BED_RELEASED',
  'TRANSFERRED',
  'FLAG_ADDED',
  'FLAG_REMOVED',
  'ACUITY_CHANGED',
  'NOTE_ADDED',
  'DISCHARGE_CONFIRMED'
);

-- ==============================================================================
-- STEP 2: Add New Columns to inpatient_admissions
-- ==============================================================================

ALTER TABLE inpatient_admissions
ADD COLUMN admission_status "InpatientAdmissionStatus" DEFAULT 'ADMITTED',
ADD COLUMN discharge_status "InpatientDischargeStatus" DEFAULT 'NONE',
ADD COLUMN acuity "InpatientAcuity" DEFAULT 'STABLE',
ADD COLUMN board_flags JSONB;

-- ==============================================================================
-- STEP 3: Migrate Existing Status Data
-- ==============================================================================

-- Map old string status to new enum admission_status
UPDATE inpatient_admissions
SET admission_status = CASE
  WHEN status = 'admitted' THEN 'ADMITTED'::"InpatientAdmissionStatus"
  WHEN status = 'active' THEN 'ACTIVE'::"InpatientAdmissionStatus"
  WHEN status = 'transferred' THEN 'ACTIVE'::"InpatientAdmissionStatus" -- Transferred patients are active
  WHEN status = 'discharged' THEN 'DISCHARGED'::"InpatientAdmissionStatus"
  WHEN status = 'deceased' OR status = 'expired' THEN 'EXPIRED'::"InpatientAdmissionStatus"
  WHEN status = 'absconded' THEN 'ABSCONDED'::"InpatientAdmissionStatus"
  ELSE 'ACTIVE'::"InpatientAdmissionStatus"
END;

-- Set discharge_status based on discharge planning fields
UPDATE inpatient_admissions
SET discharge_status = CASE
  WHEN actual_discharge_date IS NOT NULL THEN 'CONFIRMED'::"InpatientDischargeStatus"
  WHEN expected_discharge_date IS NOT NULL AND expected_discharge_date <= CURRENT_DATE THEN 'INITIATED'::"InpatientDischargeStatus"
  WHEN discharge_planned_by IS NOT NULL THEN 'INITIATED'::"InpatientDischargeStatus"
  ELSE 'NONE'::"InpatientDischargeStatus"
END;

-- Set acuity based on clinical_alerts
UPDATE inpatient_admissions
SET acuity = CASE
  WHEN 'critical' = ANY(clinical_alerts) THEN 'CRITICAL'::"InpatientAcuity"
  WHEN fall_risk_score >= 4 OR 'fall_risk' = ANY(clinical_alerts) THEN 'WATCH'::"InpatientAcuity"
  ELSE 'STABLE'::"InpatientAcuity"
END;

-- Build board_flags JSONB from existing fields
UPDATE inpatient_admissions
SET board_flags = jsonb_build_object(
  'npo', 'npo' = ANY(clinical_alerts),
  'fallRisk', CASE
    WHEN fall_risk_score >= 4 THEN 'high'
    WHEN fall_risk_score >= 2 THEN 'medium'
    ELSE 'low'
  END,
  'isolation', isolation_type IS NOT NULL,
  'allergies', 'allergies' = ANY(clinical_alerts),
  'telemetry', 'telemetry' = ANY(clinical_alerts),
  'dnr', 'dnr' = ANY(clinical_alerts),
  'covid', 'covid' = ANY(clinical_alerts)
);

-- ==============================================================================
-- STEP 4: Transform inpatient_events Table
-- ==============================================================================

-- Add new columns
ALTER TABLE inpatient_events
ADD COLUMN facility_id UUID,
ADD COLUMN encounter_id UUID,
ADD COLUMN event_type_new "InpatientEventType",
ADD COLUMN from_admission_status "InpatientAdmissionStatus",
ADD COLUMN to_admission_status "InpatientAdmissionStatus",
ADD COLUMN from_discharge_status "InpatientDischargeStatus",
ADD COLUMN to_discharge_status "InpatientDischargeStatus",
ADD COLUMN from_acuity "InpatientAcuity",
ADD COLUMN to_acuity "InpatientAcuity",
ADD COLUMN from_ward_id UUID,
ADD COLUMN from_space_id UUID,
ADD COLUMN from_bed_id UUID,
ADD COLUMN to_ward_id UUID,
ADD COLUMN to_space_id UUID,
ADD COLUMN to_bed_id UUID,
ADD COLUMN reason TEXT,
ADD COLUMN metadata JSONB;

-- Populate facility_id and encounter_id from admission
UPDATE inpatient_events e
SET
  facility_id = a.facility_id,
  encounter_id = a.encounter_id
FROM inpatient_admissions a
WHERE e.admission_id = a.id;

-- Map old event_type strings to new enum
UPDATE inpatient_events
SET event_type_new = CASE
  WHEN event_type = 'admission_created' THEN 'ADMISSION_CREATED'::"InpatientEventType"
  WHEN event_type = 'bed_assigned' THEN 'BED_ASSIGNED'::"InpatientEventType"
  WHEN event_type = 'patient_transferred' THEN 'TRANSFERRED'::"InpatientEventType"
  WHEN event_type = 'discharge_initiated' THEN 'DISCHARGE_STATUS_CHANGED'::"InpatientEventType"
  WHEN event_type = 'discharge_completed' THEN 'DISCHARGE_CONFIRMED'::"InpatientEventType"
  WHEN event_type = 'alert_raised' THEN 'FLAG_ADDED'::"InpatientEventType"
  ELSE 'NOTE_ADDED'::"InpatientEventType"
END;

-- Copy event_data to metadata
UPDATE inpatient_events
SET metadata = event_data;

-- Make facility_id, encounter_id, and event_type_new NOT NULL
ALTER TABLE inpatient_events
ALTER COLUMN facility_id SET NOT NULL,
ALTER COLUMN encounter_id SET NOT NULL,
ALTER COLUMN event_type_new SET NOT NULL;

-- Drop old columns
ALTER TABLE inpatient_events
DROP COLUMN event_type,
DROP COLUMN event_category,
DROP COLUMN event_data,
DROP COLUMN notes,
DROP COLUMN created_at;

-- Rename new column
ALTER TABLE inpatient_events
RENAME COLUMN event_type_new TO event_type;

-- ==============================================================================
-- STEP 5: Create Indexes for New Columns
-- ==============================================================================

CREATE INDEX idx_admissions_tenant_admission_status ON inpatient_admissions(tenant_id, admission_status);
CREATE INDEX idx_admissions_tenant_discharge_status ON inpatient_admissions(tenant_id, discharge_status);
CREATE INDEX idx_admissions_tenant_acuity ON inpatient_admissions(tenant_id, acuity);
CREATE INDEX idx_admissions_facility_status ON inpatient_admissions(tenant_id, facility_id, admission_status);
CREATE INDEX idx_admissions_facility_discharge ON inpatient_admissions(tenant_id, facility_id, discharge_status);

CREATE INDEX idx_events_facility_time ON inpatient_events(tenant_id, facility_id, performed_at);
CREATE INDEX idx_events_performer_time ON inpatient_events(tenant_id, performed_by, performed_at);

-- ==============================================================================
-- STEP 6: Drop Old Status Column (optional - keep for rollback safety)
-- ==============================================================================

-- Comment this out if you want to keep the old status column for a period
-- ALTER TABLE inpatient_admissions DROP COLUMN status;

COMMIT;

-- ==============================================================================
-- Rollback Instructions
-- ==============================================================================
-- If you need to rollback this migration:
--
-- BEGIN;
-- DROP INDEX IF EXISTS idx_admissions_tenant_admission_status;
-- DROP INDEX IF EXISTS idx_admissions_tenant_discharge_status;
-- DROP INDEX IF EXISTS idx_admissions_tenant_acuity;
-- DROP INDEX IF EXISTS idx_admissions_facility_status;
-- DROP INDEX IF EXISTS idx_admissions_facility_discharge;
-- DROP INDEX IF EXISTS idx_events_facility_time;
-- DROP INDEX IF EXISTS idx_events_performer_time;
--
-- ALTER TABLE inpatient_admissions
--   DROP COLUMN admission_status,
--   DROP COLUMN discharge_status,
--   DROP COLUMN acuity,
--   DROP COLUMN board_flags;
--
-- DROP TYPE "InpatientAdmissionStatus";
-- DROP TYPE "InpatientDischargeStatus";
-- DROP TYPE "InpatientAcuity";
-- DROP TYPE "InpatientEventType";
-- COMMIT;
