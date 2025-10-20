-- =====================================================
-- Seed: User-Role Assignments
-- Description: Assign roles to users
-- Dependencies: 29-users-with-staff-links.sql, 26-roles-updated.sql
-- =====================================================

-- Note: Assigns appropriate roles to each user based on their function

DO $$
DECLARE
  v_tenant_id UUID := uuid_from_text('11111111-1111-1111-1111-111111111111');
  
  -- Role IDs
  v_system_admin_role UUID;
  v_physician_role UUID;
  v_nurse_role UUID;
  v_lab_tech_role UUID;
  v_rad_tech_role UUID;
  v_pharmacist_role UUID;
  v_billing_role UUID;
  v_facility_mgr_role UUID;
BEGIN

  -- Get role IDs
  SELECT id INTO v_system_admin_role FROM roles WHERE code = 'SYSTEM_ADMIN' AND tenant_id = v_tenant_id;
  SELECT id INTO v_physician_role FROM roles WHERE code = 'PHYSICIAN' AND tenant_id = v_tenant_id;
  SELECT id INTO v_nurse_role FROM roles WHERE code = 'NURSE' AND tenant_id = v_tenant_id;
  SELECT id INTO v_lab_tech_role FROM roles WHERE code = 'LAB_TECH' AND tenant_id = v_tenant_id;
  SELECT id INTO v_rad_tech_role FROM roles WHERE code = 'RAD_TECH' AND tenant_id = v_tenant_id;
  SELECT id INTO v_pharmacist_role FROM roles WHERE code = 'PHARMACIST' AND tenant_id = v_tenant_id;
  SELECT id INTO v_billing_role FROM roles WHERE code = 'BILLING' AND tenant_id = v_tenant_id;
  SELECT id INTO v_facility_mgr_role FROM roles WHERE code = 'FACILITY_MGR' AND tenant_id = v_tenant_id;

  -- =====================================================
  -- Assign Roles to Doctors (PHYSICIAN role)
  -- =====================================================
  
  INSERT INTO user_roles (id, user_id, role_id, assigned_at, is_active, created_at)
  SELECT
    uuid_generate_v4(),
    u.id,
    v_physician_role,
    NOW(),
    TRUE,
    NOW()
  FROM users u
  JOIN staff s ON s.id = u.staff_id
  WHERE s.staff_type = 'doctor'
    AND u.tenant_id = v_tenant_id;

  -- =====================================================
  -- Assign Roles to Nurses (NURSE role)
  -- =====================================================
  
  INSERT INTO user_roles (id, user_id, role_id, assigned_at, is_active, created_at)
  SELECT
    uuid_generate_v4(),
    u.id,
    v_nurse_role,
    NOW(),
    TRUE,
    NOW()
  FROM users u
  JOIN staff s ON s.id = u.staff_id
  WHERE s.staff_type = 'nurse'
    AND u.tenant_id = v_tenant_id;

  -- =====================================================
  -- Assign Roles to Technicians
  -- =====================================================
  
  -- Lab Technician
  INSERT INTO user_roles (id, user_id, role_id, assigned_at, is_active, created_at)
  SELECT
    uuid_generate_v4(),
    u.id,
    v_lab_tech_role,
    NOW(),
    TRUE,
    NOW()
  FROM users u
  JOIN staff s ON s.id = u.staff_id
  WHERE s.employee_id = 'TECH001'  -- Lab tech
    AND u.tenant_id = v_tenant_id;

  -- Radiology Technician
  INSERT INTO user_roles (id, user_id, role_id, assigned_at, is_active, created_at)
  SELECT
    uuid_generate_v4(),
    u.id,
    v_rad_tech_role,
    NOW(),
    TRUE,
    NOW()
  FROM users u
  JOIN staff s ON s.id = u.staff_id
  WHERE s.employee_id = 'TECH002'  -- Rad tech
    AND u.tenant_id = v_tenant_id;

  -- Pharmacy Technician
  INSERT INTO user_roles (id, user_id, role_id, assigned_at, is_active, created_at)
  SELECT
    uuid_generate_v4(),
    u.id,
    v_pharmacist_role,
    NOW(),
    TRUE,
    NOW()
  FROM users u
  JOIN staff s ON s.id = u.staff_id
  WHERE s.employee_id = 'TECH003'  -- Pharmacy tech
    AND u.tenant_id = v_tenant_id;

  -- =====================================================
  -- Assign Roles to Admin Users
  -- =====================================================
  
  -- IT Administrator (SYSTEM_ADMIN role)
  INSERT INTO user_roles (id, user_id, role_id, assigned_at, is_active, created_at)
  SELECT
    uuid_generate_v4(),
    u.id,
    v_system_admin_role,
    NOW(),
    TRUE,
    NOW()
  FROM users u
  WHERE u.email = 'it.admin@armc.ae'
    AND u.tenant_id = v_tenant_id;

  -- Billing Manager (BILLING role)
  INSERT INTO user_roles (id, user_id, role_id, assigned_at, is_active, created_at)
  SELECT
    uuid_generate_v4(),
    u.id,
    v_billing_role,
    NOW(),
    TRUE,
    NOW()
  FROM users u
  WHERE u.email = 'billing.manager@armc.ae'
    AND u.tenant_id = v_tenant_id;

  -- Facility Manager (FACILITY_MGR role)
  INSERT INTO user_roles (id, user_id, role_id, assigned_at, is_active, created_at)
  SELECT
    uuid_generate_v4(),
    u.id,
    v_facility_mgr_role,
    NOW(),
    TRUE,
    NOW()
  FROM users u
  WHERE u.email = 'facility.manager@armc.ae'
    AND u.tenant_id = v_tenant_id;

END $$;

-- =====================================================
-- Verification
-- =====================================================

-- Users with roles
SELECT 
  u.email,
  u.role as user_role_field,
  r.code as assigned_role,
  r.name as role_name,
  s.employee_id,
  CASE WHEN s.id IS NOT NULL THEN 'Staff' ELSE 'Admin' END as user_type
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
LEFT JOIN staff s ON s.id = u.staff_id
WHERE u.tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
ORDER BY user_type, r.code;

-- Role distribution
SELECT 
  r.code,
  r.name,
  COUNT(ur.user_id) as user_count
FROM roles r
LEFT JOIN user_roles ur ON ur.role_id = r.id
WHERE r.tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
GROUP BY r.id, r.code, r.name
ORDER BY user_count DESC;

-- Users with permissions (via roles)
SELECT 
  u.email,
  COUNT(DISTINCT p.id) as permission_count,
  string_agg(DISTINCT p.resource, ', ' ORDER BY p.resource) as resources
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
JOIN role_permissions rp ON rp.role_id = r.id
JOIN permissions p ON p.id = rp.permission_id
WHERE u.tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
GROUP BY u.id, u.email
ORDER BY permission_count DESC
LIMIT 10;

-- Expected:
-- Total user-role assignments: 15
-- Physicians: 5
-- Nurses: 4
-- Lab Tech: 1
-- Rad Tech: 1
-- Pharmacist: 1
-- System Admin: 1
-- Billing: 1
-- Facility Manager: 1
