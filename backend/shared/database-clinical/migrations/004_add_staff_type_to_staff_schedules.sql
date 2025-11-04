-- Migration: Ensure denormalized staff details on staff_schedules
-- Adds staff_type column (and staff_display_name if missing), then clears existing data

ALTER TABLE staff_schedules
  ADD COLUMN IF NOT EXISTS staff_display_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS staff_type VARCHAR(50);

-- Existing records are obsolete with the new denormalized columns; clear them
TRUNCATE staff_schedules RESTART IDENTITY;
