-- Migration: Remove deprecated staff_code column from staff_schedules
-- Context: Scheduling now relies exclusively on employee_id identifiers

ALTER TABLE staff_schedules DROP COLUMN IF EXISTS staff_code;
