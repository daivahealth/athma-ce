-- =====================================================
-- Migration: Add facility_id to staff_specialties
-- Description: Enable facility-specific staff specialty assignments
-- Author: AI Assistant
-- Date: 2025-10-08
-- =====================================================

-- Purpose:
-- This migration adds facility_id to staff_specialties to support:
-- 1. Multi-facility staff (doctors working at multiple locations)
-- 2. Facility-specific credentialing (privileging)
-- 3. Direct query: "What specialties are available at this facility?"
-- 4. Staff can have different specialties at different facilities

BEGIN;

-- =====================================================
-- Step 1: Add facility_id column
-- =====================================================

ALTER TABLE staff_specialties
ADD COLUMN facility_id UUID;

COMMENT ON COLUMN staff_specialties.facility_id IS 'Facility where this staff member practices this specialty';

-- =====================================================
-- Step 2: Backfill existing data
-- =====================================================

-- For existing records, set facility_id to user's default facility
UPDATE staff_specialties ss
SET facility_id = (
  SELECT u.default_facility_id
  FROM staff st
  LEFT JOIN users u ON u.staff_id = st.id
  WHERE st.id = ss.staff_id
  LIMIT 1
)
WHERE ss.facility_id IS NULL;

-- For staff without default facility, use first facility in tenant
UPDATE staff_specialties ss
SET facility_id = (
  SELECT f.id
  FROM facilities f
  WHERE f.tenant_id = ss.tenant_id
  ORDER BY f.created_at
  LIMIT 1
)
WHERE ss.facility_id IS NULL;

-- Verify all records have facility_id
DO $$
DECLARE
  v_null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_null_count
  FROM staff_specialties
  WHERE facility_id IS NULL;
  
  IF v_null_count > 0 THEN
    RAISE EXCEPTION 'Migration failed: % records still have NULL facility_id', v_null_count;
  END IF;
  
  RAISE NOTICE 'All staff_specialties records have facility_id';
END $$;

-- =====================================================
-- Step 3: Make facility_id NOT NULL and add FK
-- =====================================================

ALTER TABLE staff_specialties
ALTER COLUMN facility_id SET NOT NULL;

ALTER TABLE staff_specialties
ADD CONSTRAINT fk_staff_specialties_facility
FOREIGN KEY (facility_id) 
REFERENCES facilities(id) 
ON DELETE CASCADE;

-- =====================================================
-- Step 4: Update Unique Constraints
-- =====================================================

-- Drop old constraint (staff + specialty)
ALTER TABLE staff_specialties 
DROP CONSTRAINT IF EXISTS ux_staff_specialty;

-- Add new constraint (staff + specialty + facility)
-- Same staff can have same specialty at different facilities
ALTER TABLE staff_specialties
ADD CONSTRAINT ux_staff_specialty_facility
UNIQUE (staff_id, specialty_id, facility_id);

-- =====================================================
-- Step 5: Update Primary Specialty Constraint
-- =====================================================

-- Drop old index (one primary per staff globally)
DROP INDEX IF EXISTS ux_staff_primary_specialty;

-- Create new index (one primary per staff per facility)
CREATE UNIQUE INDEX ux_staff_primary_specialty_facility 
  ON staff_specialties(staff_id, facility_id) 
  WHERE primary_flag = TRUE;

COMMENT ON INDEX ux_staff_primary_specialty_facility IS 'Enforce one primary specialty per staff member per facility';

-- =====================================================
-- Step 6: Add Performance Indexes
-- =====================================================

CREATE INDEX idx_staff_specialties_facility 
  ON staff_specialties(facility_id);

CREATE INDEX idx_staff_specialties_facility_specialty 
  ON staff_specialties(facility_id, specialty_id);

CREATE INDEX idx_staff_specialties_facility_staff 
  ON staff_specialties(facility_id, staff_id);

-- =====================================================
-- Step 7: Add to Facility Model
-- =====================================================

-- Facility model in Prisma will now have:
-- staffSpecialties  StaffSpecialty[]

-- =====================================================
-- Verification
-- =====================================================

-- Count records
SELECT COUNT(*) as total_staff_specialties FROM staff_specialties;

-- Verify all have facility_id
SELECT 
  CASE 
    WHEN facility_id IS NULL THEN 'NULL'
    ELSE 'Has Facility'
  END as status,
  COUNT(*) as count
FROM staff_specialties
GROUP BY status;

-- Verify constraints
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'staff_specialties'
ORDER BY constraint_type, constraint_name;

-- Sample data
SELECT 
  f.name as facility_name,
  st.first_name || ' ' || st.last_name as staff_name,
  sp.code as specialty_code,
  sp.name as specialty_name,
  ss.primary_flag
FROM staff_specialties ss
JOIN facilities f ON f.id = ss.facility_id
JOIN staff st ON st.id = ss.staff_id
JOIN specialties sp ON sp.id = ss.specialty_id
ORDER BY f.name, st.last_name
LIMIT 10;

COMMIT;

-- =====================================================
-- Example Queries (New Capabilities)
-- =====================================================

-- 1. What specialties are available at Facility A?
/*
SELECT 
  sp.code,
  sp.name,
  COUNT(DISTINCT ss.staff_id) as staff_count,
  array_agg(DISTINCT st.first_name || ' ' || st.last_name) as staff_names
FROM staff_specialties ss
JOIN specialties sp ON sp.id = ss.specialty_id
JOIN staff st ON st.id = ss.staff_id
WHERE ss.facility_id = $1
  AND ss.primary_flag = TRUE
  AND st.status = 'active'
GROUP BY sp.id, sp.code, sp.name
ORDER BY staff_count DESC;
*/

-- 2. Which facilities does Dr. Ahmed practice cardiology at?
/*
SELECT 
  f.name,
  f.city,
  ss.primary_flag
FROM staff_specialties ss
JOIN facilities f ON f.id = ss.facility_id
JOIN specialties sp ON sp.id = ss.specialty_id
JOIN staff st ON st.id = ss.staff_id
WHERE st.employee_id = 'DOC001'
  AND sp.code = 'CARDIO';
*/

-- 3. Find all cardiologists at Facility A
/*
SELECT 
  st.employee_id,
  st.first_name || ' ' || st.last_name as name,
  st.phone_number,
  st.license_number,
  sp.name as specialty
FROM staff_specialties ss
JOIN staff st ON st.id = ss.staff_id
JOIN specialties sp ON sp.id = ss.specialty_id
WHERE ss.facility_id = $1
  AND sp.code = 'CARDIO'
  AND ss.primary_flag = TRUE
  AND st.status = 'active';
*/

-- 4. Get facility specialty summary
/*
SELECT 
  f.name as facility,
  sp.code,
  sp.name,
  COUNT(DISTINCT ss.staff_id) FILTER (WHERE ss.primary_flag) as primary_count,
  COUNT(DISTINCT ss.staff_id) as total_count
FROM facilities f
LEFT JOIN staff_specialties ss ON ss.facility_id = f.id
LEFT JOIN specialties sp ON sp.id = ss.specialty_id
GROUP BY f.id, f.name, sp.id, sp.code, sp.name
HAVING COUNT(DISTINCT ss.staff_id) > 0
ORDER BY f.name, primary_count DESC;
*/

-- =====================================================
-- Rollback Script (if needed)
-- =====================================================

/*
BEGIN;

-- Drop indexes
DROP INDEX IF EXISTS idx_staff_specialties_facility;
DROP INDEX IF EXISTS idx_staff_specialties_facility_specialty;
DROP INDEX IF EXISTS idx_staff_specialties_facility_staff;

-- Drop primary constraint
DROP INDEX IF EXISTS ux_staff_primary_specialty_facility;

-- Restore old primary constraint
CREATE UNIQUE INDEX ux_staff_primary_specialty 
  ON staff_specialties(staff_id) 
  WHERE primary_flag = TRUE;

-- Drop new unique constraint
ALTER TABLE staff_specialties DROP CONSTRAINT IF EXISTS ux_staff_specialty_facility;

-- Restore old unique constraint
ALTER TABLE staff_specialties
ADD CONSTRAINT ux_staff_specialty UNIQUE (staff_id, specialty_id);

-- Drop foreign key
ALTER TABLE staff_specialties DROP CONSTRAINT IF EXISTS fk_staff_specialties_facility;

-- Drop column
ALTER TABLE staff_specialties DROP COLUMN IF EXISTS facility_id;

COMMIT;
*/
