-- Migration: add employee_id column to staff_schedules for denormalized lookups
ALTER TABLE staff_schedules
  ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_staff_schedules_employee ON staff_schedules(employee_id);
