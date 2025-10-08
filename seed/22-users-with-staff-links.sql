-- =====================================================
-- Seed: Users with Staff Links
-- Description: Create user accounts for staff members who need system access
-- Dependencies: 02-users.sql, 21-staff.sql
-- =====================================================

-- Note: This demonstrates the optional User-Staff relationship:
-- - Doctors, nurses, technicians get user accounts (linked to staff)
-- - Support staff do NOT get user accounts (no system access)
-- - We'll also create admin-only users (not linked to staff)

-- =====================================================
-- Update existing users to link with staff
-- (if users were created before staff)
-- =====================================================

-- This section is optional and depends on execution order
-- Uncomment if you already have users and want to link them

/*
UPDATE users 
SET staff_id = (SELECT id FROM staff WHERE employee_id = 'DOC001')
WHERE email = 'doctor@armc.ae';
*/

-- =====================================================
-- Create new users linked to staff
-- =====================================================

-- Password: all use 'password123' (hashed) for demo purposes
-- In production, users should set their own passwords

DO $$
DECLARE
  v_tenant_id UUID := '11111111-1111-1111-1111-111111111111';
  v_password_hash TEXT := '$2b$10$YourHashedPasswordHere';  -- Replace with actual hash
BEGIN

  -- =====================================================
  -- Doctors (all get system access)
  -- =====================================================

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'ahmed.almansoori@armc.ae',
    'Dr. Ahmed',
    'Al-Mansoori',
    v_password_hash,
    'doctor',
    'active',
    id,  -- Link to staff
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'DOC001';

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'fatima.alzaabi@armc.ae',
    'Dr. Fatima',
    'Al-Zaabi',
    v_password_hash,
    'doctor',
    'active',
    id,
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'DOC002';

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'omar.alketbi@armc.ae',
    'Dr. Omar',
    'Al-Ketbi',
    v_password_hash,
    'doctor',
    'active',
    id,
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'DOC003';

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'sarah.johnson@armc.ae',
    'Dr. Sarah',
    'Johnson',
    v_password_hash,
    'doctor',
    'active',
    id,
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'DOC004';

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'layla.alshamsi@armc.ae',
    'Dr. Layla',
    'Al-Shamsi',
    v_password_hash,
    'doctor',
    'active',
    id,
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'DOC005';

  -- =====================================================
  -- Nurses (all get system access)
  -- =====================================================

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'maria.santos@armc.ae',
    'Maria',
    'Santos',
    v_password_hash,
    'nurse',
    'active',
    id,
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'NRS001';

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'priya.sharma@armc.ae',
    'Priya',
    'Sharma',
    v_password_hash,
    'nurse',
    'active',
    id,
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'NRS002';

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'john.williams@armc.ae',
    'John',
    'Williams',
    v_password_hash,
    'nurse',
    'active',
    id,
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'NRS003';

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'aisha.almazrouei@armc.ae',
    'Aisha',
    'Al-Mazrouei',
    v_password_hash,
    'nurse',
    'active',
    id,
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'NRS004';

  -- =====================================================
  -- Technicians (all get system access)
  -- =====================================================

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'ravi.kumar@armc.ae',
    'Ravi',
    'Kumar',
    v_password_hash,
    'technician',
    'active',
    id,
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'TECH001';

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'mohammed.hassan@armc.ae',
    'Mohammed',
    'Hassan',
    v_password_hash,
    'technician',
    'active',
    id,
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'TECH002';

  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    'nadia.ibrahim@armc.ae',
    'Nadia',
    'Ibrahim',
    v_password_hash,
    'technician',
    'active',
    id,
    NOW(),
    NOW()
  FROM staff
  WHERE employee_id = 'TECH003';

  -- =====================================================
  -- Admin-Only Users (NOT linked to staff)
  -- =====================================================

  -- IT Administrator
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  VALUES (
    uuid_generate_v4(),
    v_tenant_id,
    'it.admin@armc.ae',
    'IT',
    'Administrator',
    v_password_hash,
    'system_admin',
    'active',
    NULL,  -- NOT linked to staff
    NOW(),
    NOW()
  );

  -- Billing Specialist
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, created_at, updated_at)
  VALUES (
    uuid_generate_v4(),
    v_tenant_id,
    'billing@armc.ae',
    'Billing',
    'Department',
    v_password_hash,
    'billing_specialist',
    'active',
    NULL,  -- NOT linked to staff
    NOW(),
    NOW()
  );

END $$;

-- =====================================================
-- Verification
-- =====================================================

-- Summary: Users by type
SELECT 
  CASE 
    WHEN u.staff_id IS NOT NULL THEN 'Healthcare Staff with Access'
    ELSE 'Admin/System User'
  END as user_type,
  u.role,
  COUNT(*) as count
FROM users u
WHERE u.tenant_id = '11111111-1111-1111-1111-111111111111'
GROUP BY user_type, u.role
ORDER BY user_type, u.role;

-- Staff with system access
SELECT 
  s.employee_id,
  s.first_name || ' ' || s.last_name as staff_name,
  s.staff_type,
  u.email as user_email,
  u.role as system_role,
  'Has System Access' as status
FROM staff s
JOIN users u ON u.staff_id = s.id
WHERE s.tenant_id = '11111111-1111-1111-1111-111111111111'
ORDER BY s.staff_type, s.employee_id;

-- Staff WITHOUT system access
SELECT 
  s.employee_id,
  s.first_name || ' ' || s.last_name as staff_name,
  s.staff_type,
  'NO System Access' as status,
  'Support staff - no login needed' as reason
FROM staff s
LEFT JOIN users u ON u.staff_id = s.id
WHERE s.tenant_id = '11111111-1111-1111-1111-111111111111'
  AND u.id IS NULL
ORDER BY s.staff_type, s.employee_id;

-- Users NOT linked to staff
SELECT 
  u.email,
  u.first_name || ' ' || u.last_name as user_name,
  u.role,
  'Admin/System User' as user_type,
  'Not a healthcare provider' as note
FROM users u
WHERE u.tenant_id = '11111111-1111-1111-1111-111111111111'
  AND u.staff_id IS NULL
ORDER BY u.role, u.email;

-- Complete overview
SELECT 
  'Total Staff' as category,
  COUNT(*)::text as count
FROM staff
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
UNION ALL
SELECT 
  'Staff with System Access',
  COUNT(DISTINCT u.staff_id)::text
FROM users u
WHERE u.tenant_id = '11111111-1111-1111-1111-111111111111'
  AND u.staff_id IS NOT NULL
UNION ALL
SELECT 
  'Staff without System Access',
  (COUNT(s.id) - COUNT(u.id))::text
FROM staff s
LEFT JOIN users u ON u.staff_id = s.id
WHERE s.tenant_id = '11111111-1111-1111-1111-111111111111'
UNION ALL
SELECT 
  'Total Users',
  COUNT(*)::text
FROM users
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
UNION ALL
SELECT 
  'Users NOT linked to Staff',
  COUNT(*)::text
FROM users
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
  AND staff_id IS NULL;

-- Expected Results:
-- Total Staff: 15
-- Staff with System Access: 12 (5 doctors + 4 nurses + 3 techs)
-- Staff without System Access: 3 (3 support staff)
-- Total Users: 14 (12 staff + 2 admin)
-- Users NOT linked to Staff: 2 (IT admin + billing)
