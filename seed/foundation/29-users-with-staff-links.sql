-- =====================================================
-- Seed: Users with Staff Links
-- Description: Create user accounts for healthcare staff
-- Dependencies: 21-staff.sql, 26-roles-updated.sql
-- =====================================================

-- Note: This creates user accounts linked to staff members
-- Password for all demo users: "Password123!" (should be changed in production)
-- Hash: $2b$10$K7L/WzMZ7QGZ.Z8qPZ8Z8u7QGZ.Z8qPZ8Z8u7QGZ.Z8qPZ8Z8u (placeholder)

DO $$
DECLARE
  v_tenant_id UUID := uuid_from_text('11111111-1111-1111-1111-111111111111');
  v_main_facility UUID;
  -- For demo, using a simple hash (in production, use proper bcrypt)
  v_password_hash TEXT := '$2b$10$rZ8Z8u7QGZ.Z8qPZ8Z8u7QGZ.Z8qPZ8Z8u7QGZ.Z8qPZ8Z8u';
BEGIN

  -- Get main facility for default
  SELECT id INTO v_main_facility 
  FROM facilities 
  WHERE tenant_id = v_tenant_id 
    AND name LIKE '%Main%'
  LIMIT 1;

  -- =====================================================
  -- Doctor User Accounts (linked to staff)
  -- =====================================================
  
  -- Dr. Ahmed Al-Mansoori (Cardiologist)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('01111111-1111-1111-1111-111111111111'),
    v_tenant_id,
    'ahmed.almansoori@armc.ae',
    'Dr. Ahmed',
    'Al-Mansoori',
    v_password_hash,
    'doctor',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC001';

  -- Dr. Fatima Al-Zaabi (Pediatrician)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('02222222-2222-2222-2222-222222222222'),
    v_tenant_id,
    'fatima.alzaabi@armc.ae',
    'Dr. Fatima',
    'Al-Zaabi',
    v_password_hash,
    'doctor',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC002';

  -- Dr. Omar Al-Ketbi (General Practitioner)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('03333333-3333-3333-3333-333333333333'),
    v_tenant_id,
    'omar.alketbi@armc.ae',
    'Dr. Omar',
    'Al-Ketbi',
    v_password_hash,
    'doctor',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC003';

  -- Dr. Sarah Johnson (Orthopedic Surgeon)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('04444444-4444-4444-4444-444444444444'),
    v_tenant_id,
    'sarah.johnson@armc.ae',
    'Dr. Sarah',
    'Johnson',
    v_password_hash,
    'doctor',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC004';

  -- Dr. Layla Al-Shamsi (Dermatologist)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('05555555-5555-5555-5555-555555555555'),
    v_tenant_id,
    'layla.alshamsi@armc.ae',
    'Dr. Layla',
    'Al-Shamsi',
    v_password_hash,
    'doctor',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC005';

  -- =====================================================
  -- Nurse User Accounts
  -- =====================================================
  
  -- Maria Santos (ICU Nurse)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('06666666-6666-6666-6666-666666666666'),
    v_tenant_id,
    'maria.santos@armc.ae',
    'Maria',
    'Santos',
    v_password_hash,
    'nurse',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'NRS001';

  -- Priya Sharma (Pediatric Nurse)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('07777777-7777-7777-7777-777777777777'),
    v_tenant_id,
    'priya.sharma@armc.ae',
    'Priya',
    'Sharma',
    v_password_hash,
    'nurse',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'NRS002';

  -- John Williams (Emergency Nurse)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('08888888-8888-8888-8888-888888888888'),
    v_tenant_id,
    'john.williams@armc.ae',
    'John',
    'Williams',
    v_password_hash,
    'nurse',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'NRS003';

  -- Aisha Al-Mazrouei (General Ward Nurse)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('09999999-9999-9999-9999-999999999999'),
    v_tenant_id,
    'aisha.almazrouei@armc.ae',
    'Aisha',
    'Al-Mazrouei',
    v_password_hash,
    'nurse',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'NRS004';

  -- =====================================================
  -- Technician User Accounts
  -- =====================================================
  
  -- Ravi Kumar (Lab Technician)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('0a111111-1111-1111-1111-111111111111'),
    v_tenant_id,
    'ravi.kumar@armc.ae',
    'Ravi',
    'Kumar',
    v_password_hash,
    'technician',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'TECH001';

  -- Mohammed Hassan (Radiology Technician)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('0b222222-2222-2222-2222-222222222222'),
    v_tenant_id,
    'mohammed.hassan@armc.ae',
    'Mohammed',
    'Hassan',
    v_password_hash,
    'technician',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'TECH002';

  -- Nadia Ibrahim (Pharmacy Technician)
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  SELECT
    uuid_from_text('0c333333-3333-3333-3333-333333333333'),
    v_tenant_id,
    'nadia.ibrahim@armc.ae',
    'Nadia',
    'Ibrahim',
    v_password_hash,
    'technician',
    'active',
    st.id,
    v_main_facility,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'TECH003';

  -- =====================================================
  -- Admin/System Users (NOT linked to staff)
  -- =====================================================
  
  -- IT Administrator
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  VALUES (
    uuid_from_text('0d444444-4444-4444-4444-444444444444'),
    v_tenant_id,
    'it.admin@armc.ae',
    'IT',
    'Administrator',
    v_password_hash,
    'admin',
    'active',
    NULL,  -- NOT linked to staff
    v_main_facility,
    NOW(),
    NOW()
  );

  -- Billing Manager
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  VALUES (
    uuid_from_text('0e555555-5555-5555-5555-555555555555'),
    v_tenant_id,
    'billing.manager@armc.ae',
    'Billing',
    'Manager',
    v_password_hash,
    'billing_manager',
    'active',
    NULL,  -- NOT linked to staff
    v_main_facility,
    NOW(),
    NOW()
  );

  -- Facility Manager
  INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, staff_id, default_facility_id, created_at, updated_at)
  VALUES (
    uuid_from_text('0f666666-6666-6666-6666-666666666666'),
    v_tenant_id,
    'facility.manager@armc.ae',
    'Facility',
    'Manager',
    v_password_hash,
    'facility_manager',
    'active',
    NULL,  -- NOT linked to staff
    v_main_facility,
    NOW(),
    NOW()
  );

END $$;

-- =====================================================
-- Verification
-- =====================================================

-- Summary by type
SELECT 
  CASE 
    WHEN u.staff_id IS NOT NULL THEN 'Healthcare Staff with Access'
    ELSE 'Admin/System User'
  END as user_type,
  u.role,
  COUNT(*) as count
FROM users u
WHERE u.tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
GROUP BY user_type, u.role
ORDER BY user_type, u.role;

-- Healthcare staff with user accounts
SELECT 
  u.email,
  u.role as system_role,
  s.employee_id,
  s.staff_type,
  s.first_name || ' ' || s.last_name as staff_name,
  'Has System Access' as status
FROM users u
JOIN staff s ON s.id = u.staff_id
WHERE u.tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
ORDER BY s.staff_type, s.employee_id;

-- Admin users (not linked to staff)
SELECT 
  u.email,
  u.role,
  u.first_name || ' ' || u.last_name as name,
  'Admin User (not healthcare staff)' as type
FROM users u
WHERE u.tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
  AND u.staff_id IS NULL
ORDER BY u.email;

-- Staff WITHOUT system access (support staff)
SELECT 
  s.employee_id,
  s.first_name || ' ' || s.last_name as name,
  s.staff_type,
  'NO System Access' as status,
  'Support staff - no login needed' as reason
FROM staff s
LEFT JOIN users u ON u.staff_id = s.id
WHERE s.tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
  AND u.id IS NULL
ORDER BY s.staff_type, s.employee_id;

-- Complete summary
SELECT 
  'Total Staff' as category,
  COUNT(*)::text as count
FROM staff
WHERE tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
UNION ALL
SELECT 
  'Staff with System Access',
  COUNT(DISTINCT u.staff_id)::text
FROM users u
WHERE u.tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
  AND u.staff_id IS NOT NULL
UNION ALL
SELECT 
  'Staff without System Access',
  (COUNT(s.id) - COUNT(u.id))::text
FROM staff s
LEFT JOIN users u ON u.staff_id = s.id
WHERE s.tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
UNION ALL
SELECT 
  'Total Users',
  COUNT(*)::text
FROM users
WHERE tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
UNION ALL
SELECT 
  'Admin Users (not staff)',
  COUNT(*)::text
FROM users
WHERE tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
  AND staff_id IS NULL;

-- Expected Results:
-- Total Staff: 16
-- Staff with System Access: 12 (5 doctors + 4 nurses + 3 technicians)
-- Staff without System Access: 3 (support staff)
-- Total Users: 15 (12 staff + 3 admin)
-- Admin Users (not staff): 3
