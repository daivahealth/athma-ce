-- =====================================================
-- Migration: Add Optional User-Staff Relationship
-- Description: Links system users to healthcare staff members
-- Author: AI Assistant
-- Date: 2025-10-08
-- =====================================================

-- Purpose:
-- This migration establishes an optional relationship between Users and Staff:
-- - Users = System accounts (authentication, authorization, RBAC)
-- - Staff = Healthcare personnel (clinical/operational identity)
-- - Not all staff need system access (e.g., janitors, outsourced workers)
-- - Not all users are staff (e.g., admin-only accounts, service accounts)

BEGIN;

-- =====================================================
-- Step 1: Add staff_id column to users table
-- =====================================================

ALTER TABLE users 
ADD COLUMN staff_id UUID NULL;

COMMENT ON COLUMN users.staff_id IS 'Optional link to staff record for healthcare personnel with system access';

-- =====================================================
-- Step 2: Add foreign key constraint
-- =====================================================

ALTER TABLE users
ADD CONSTRAINT fk_users_staff 
FOREIGN KEY (staff_id) 
REFERENCES staff(id) 
ON DELETE SET NULL;  -- If staff is deleted, user account remains but link is cleared

-- =====================================================
-- Step 3: Add unique constraint
-- =====================================================

-- One staff member can have at most one user account
ALTER TABLE users
ADD CONSTRAINT users_staff_id_unique 
UNIQUE (staff_id);

-- =====================================================
-- Step 4: Add indexes for performance
-- =====================================================

CREATE INDEX idx_users_tenant_staff ON users(tenant_id, staff_id)
WHERE staff_id IS NOT NULL;

COMMENT ON INDEX idx_users_tenant_staff IS 'Optimize queries joining users with staff';

-- =====================================================
-- Step 5: Verification queries
-- =====================================================

-- Verify column added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'staff_id'
  ) THEN
    RAISE EXCEPTION 'Migration failed: staff_id column not created';
  END IF;
  
  RAISE NOTICE 'staff_id column created successfully';
END $$;

-- Verify foreign key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_users_staff' AND table_name = 'users'
  ) THEN
    RAISE EXCEPTION 'Migration failed: fk_users_staff constraint not created';
  END IF;
  
  RAISE NOTICE 'Foreign key constraint created successfully';
END $$;

-- Verify unique constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_staff_id_unique' AND table_name = 'users'
  ) THEN
    RAISE EXCEPTION 'Migration failed: unique constraint not created';
  END IF;
  
  RAISE NOTICE 'Unique constraint created successfully';
END $$;

COMMIT;

-- =====================================================
-- Summary
-- =====================================================

SELECT 
  'Users' as table_name,
  COUNT(*) as total_records,
  COUNT(staff_id) as linked_to_staff,
  COUNT(*) - COUNT(staff_id) as not_linked
FROM users;

-- =====================================================
-- Usage Examples
-- =====================================================

-- Example 1: Create staff member without system access
-- (e.g., janitor, outsourced lab tech)
/*
INSERT INTO staff (tenant_id, first_name, last_name, employee_id, staff_type, ...)
VALUES ('tenant-uuid', 'John', 'Doe', 'EMP001', 'support', ...);
-- No user account created
*/

-- Example 2: Create user account for existing staff
-- (e.g., give a doctor system access)
/*
-- First, find the staff member
SELECT id, first_name, last_name, employee_id 
FROM staff 
WHERE employee_id = 'DOC123';

-- Then create user account linked to staff
INSERT INTO users (tenant_id, email, first_name, last_name, staff_id, ...)
VALUES (
  'tenant-uuid',
  'doctor@hospital.com',
  'Dr. Jane',
  'Smith',
  'staff-uuid-from-above',  -- Link to staff
  ...
);
*/

-- Example 3: Query users with their staff details
/*
SELECT 
  u.email,
  u.first_name || ' ' || u.last_name as user_name,
  u.role as system_role,
  s.employee_id,
  s.staff_type,
  s.specialties,
  s.license_number,
  CASE 
    WHEN s.id IS NOT NULL THEN 'Healthcare Staff'
    ELSE 'Admin/System User'
  END as user_type
FROM users u
LEFT JOIN staff s ON s.id = u.staff_id
WHERE u.tenant_id = 'tenant-uuid'
ORDER BY u.created_at DESC;
*/

-- Example 4: Find staff without system access
/*
SELECT 
  s.employee_id,
  s.first_name || ' ' || s.last_name as staff_name,
  s.staff_type,
  s.status,
  CASE 
    WHEN u.id IS NOT NULL THEN 'Has Login'
    ELSE 'No System Access'
  END as access_status
FROM staff s
LEFT JOIN users u ON u.staff_id = s.id
WHERE s.tenant_id = 'tenant-uuid'
  AND s.status = 'active'
ORDER BY s.staff_type, s.last_name;
*/

-- =====================================================
-- Rollback Script (if needed)
-- =====================================================

/*
BEGIN;

-- Drop index
DROP INDEX IF EXISTS idx_users_tenant_staff;

-- Drop foreign key
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_staff;

-- Drop unique constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_staff_id_unique;

-- Drop column
ALTER TABLE users DROP COLUMN IF EXISTS staff_id;

COMMIT;
*/

-- =====================================================
-- Design Rationale
-- =====================================================

/*
Why Optional Relationship?

1. Not all staff need system access:
   - Janitors, security, maintenance workers
   - Outsourced lab technicians
   - Temporary/contract workers
   - Students, observers
   
2. Not all users are healthcare staff:
   - IT administrators
   - Billing specialists (non-clinical)
   - Service accounts for integrations
   - Management/executive accounts

3. Separation of Concerns:
   - Users table: Authentication, authorization, RBAC
   - Staff table: Clinical identity, licenses, schedules
   - Join when needed for audit trails, encounters, orders

4. Data Integrity:
   - One staff member = at most one user account
   - Staff can exist without user (tracked for scheduling, encounters)
   - User deletion doesn't cascade to staff (SET NULL)
   - Staff deletion clears user link but preserves user account

5. Query Flexibility:
   - "Who performed this procedure?" → staff table
   - "Who accessed this record?" → users table
   - "What can Dr. Smith do in the system?" → users.permissions
   - "What is Dr. Smith licensed for?" → staff.specialties
*/
