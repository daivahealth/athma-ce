-- Migration: Add unique constraints for bed assignment integrity
-- Purpose: Prevent double-booking of beds and ensure only one active assignment per admission
-- Date: 2026-01-09
-- Description:
--   1. Ensures only one active bed assignment per admission (where released_at IS NULL)
--   2. Prevents bed from being assigned to multiple admissions simultaneously
--   3. Maintains referential integrity for ward board consistency

-- ==============================================================================
-- Constraint 1: Only one active bed assignment per admission
-- ==============================================================================
-- This ensures an admission cannot have multiple active (unreleased) bed assignments
-- Prevents scenarios where patient appears in multiple beds on ward board
CREATE UNIQUE INDEX IF NOT EXISTS bed_assignment_one_active_per_admission
ON bed_assignments (tenant_id, admission_id)
WHERE released_at IS NULL;

COMMENT ON INDEX bed_assignment_one_active_per_admission IS
'Ensures only one active bed assignment per admission at any time';

-- ==============================================================================
-- Constraint 2: Prevent bed double-booking
-- ==============================================================================
-- This prevents a bed from being assigned to multiple admissions simultaneously
-- Critical for accurate occupancy tracking and ward board display
CREATE UNIQUE INDEX IF NOT EXISTS bed_assignment_bed_not_double_booked
ON bed_assignments (tenant_id, bed_id)
WHERE released_at IS NULL;

COMMENT ON INDEX bed_assignment_bed_not_double_booked IS
'Prevents bed from being assigned to multiple admissions simultaneously';

-- ==============================================================================
-- Migration Notes
-- ==============================================================================
-- These partial indexes only apply to active assignments (released_at IS NULL)
-- Once a bed is released, multiple historical records can exist
-- This maintains data integrity while preserving full history
