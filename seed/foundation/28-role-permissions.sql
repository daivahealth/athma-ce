-- =====================================================
-- Seed: Role-Permission Assignments
-- Description: Assign permissions to roles
-- Dependencies: 26-roles-updated.sql, 27-permissions-updated.sql
-- =====================================================

-- Note: This defines what each role can do

DO $$
DECLARE
  v_tenant_id UUID := uuid_from_text('11111111-1111-1111-1111-111111111111');
  
  -- Role IDs
  v_system_admin UUID;
  v_physician UUID;
  v_nurse UUID;
  v_lab_tech UUID;
  v_rad_tech UUID;
  v_pharmacist UUID;
  v_receptionist UUID;
  v_billing UUID;
  v_med_records UUID;
  v_facility_mgr UUID;
BEGIN

  -- Get role IDs
  SELECT id INTO v_system_admin FROM roles WHERE code = 'SYSTEM_ADMIN' AND tenant_id = v_tenant_id;
  SELECT id INTO v_physician FROM roles WHERE code = 'PHYSICIAN' AND tenant_id = v_tenant_id;
  SELECT id INTO v_nurse FROM roles WHERE code = 'NURSE' AND tenant_id = v_tenant_id;
  SELECT id INTO v_lab_tech FROM roles WHERE code = 'LAB_TECH' AND tenant_id = v_tenant_id;
  SELECT id INTO v_rad_tech FROM roles WHERE code = 'RAD_TECH' AND tenant_id = v_tenant_id;
  SELECT id INTO v_pharmacist FROM roles WHERE code = 'PHARMACIST' AND tenant_id = v_tenant_id;
  SELECT id INTO v_receptionist FROM roles WHERE code = 'RECEPTIONIST' AND tenant_id = v_tenant_id;
  SELECT id INTO v_billing FROM roles WHERE code = 'BILLING' AND tenant_id = v_tenant_id;
  SELECT id INTO v_med_records FROM roles WHERE code = 'MED_RECORDS' AND tenant_id = v_tenant_id;
  SELECT id INTO v_facility_mgr FROM roles WHERE code = 'FACILITY_MGR' AND tenant_id = v_tenant_id;

  -- =====================================================
  -- SYSTEM_ADMIN: All permissions
  -- =====================================================
  INSERT INTO role_permissions (id, role_id, permission_id, created_at)
  SELECT 
    uuid_generate_v4(),
    v_system_admin,
    p.id,
    NOW()
  FROM permissions p;

  -- =====================================================
  -- PHYSICIAN: Full clinical access
  -- =====================================================
  INSERT INTO role_permissions (id, role_id, permission_id, created_at)
  SELECT 
    uuid_generate_v4(),
    v_physician,
    p.id,
    NOW()
  FROM permissions p
  WHERE p.code IN (
    'patient:create', 'patient:read', 'patient:update',
    'appointment:create', 'appointment:read', 'appointment:update', 'appointment:delete',
    'encounter:create', 'encounter:read', 'encounter:update', 'encounter:sign',
    'order:create', 'order:read', 'order:update', 'order:cancel', 'order:sign',
    'prescription:create', 'prescription:read',
    'lab:create', 'lab:read',
    'radiology:create', 'radiology:read',
    'bed:assign', 'bed:release', 'bed:read',
    'report:clinical'
  );

  -- =====================================================
  -- NURSE: Clinical access (no signing)
  -- =====================================================
  INSERT INTO role_permissions (id, role_id, permission_id, created_at)
  SELECT 
    uuid_generate_v4(),
    v_nurse,
    p.id,
    NOW()
  FROM permissions p
  WHERE p.code IN (
    'patient:read', 'patient:update',
    'appointment:read', 'appointment:update',
    'encounter:read', 'encounter:update',
    'order:read',
    'prescription:read',
    'lab:read',
    'radiology:read',
    'bed:assign', 'bed:release', 'bed:read',
    'report:clinical'
  );

  -- =====================================================
  -- LAB_TECH: Lab-specific access
  -- =====================================================
  INSERT INTO role_permissions (id, role_id, permission_id, created_at)
  SELECT 
    uuid_generate_v4(),
    v_lab_tech,
    p.id,
    NOW()
  FROM permissions p
  WHERE p.code IN (
    'patient:read',
    'lab:read', 'lab:update', 'lab:sign'
  );

  -- =====================================================
  -- RAD_TECH: Radiology-specific access
  -- =====================================================
  INSERT INTO role_permissions (id, role_id, permission_id, created_at)
  SELECT 
    uuid_generate_v4(),
    v_rad_tech,
    p.id,
    NOW()
  FROM permissions p
  WHERE p.code IN (
    'patient:read',
    'radiology:read', 'radiology:update', 'radiology:sign'
  );

  -- =====================================================
  -- PHARMACIST: Pharmacy access
  -- =====================================================
  INSERT INTO role_permissions (id, role_id, permission_id, created_at)
  SELECT 
    uuid_generate_v4(),
    v_pharmacist,
    p.id,
    NOW()
  FROM permissions p
  WHERE p.code IN (
    'patient:read',
    'prescription:read', 'prescription:dispense'
  );

  -- =====================================================
  -- RECEPTIONIST: Front desk access
  -- =====================================================
  INSERT INTO role_permissions (id, role_id, permission_id, created_at)
  SELECT 
    uuid_generate_v4(),
    v_receptionist,
    p.id,
    NOW()
  FROM permissions p
  WHERE p.code IN (
    'patient:create', 'patient:read', 'patient:update',
    'appointment:create', 'appointment:read', 'appointment:update', 'appointment:delete',
    'bed:read'
  );

  -- =====================================================
  -- BILLING: Financial access
  -- =====================================================
  INSERT INTO role_permissions (id, role_id, permission_id, created_at)
  SELECT 
    uuid_generate_v4(),
    v_billing,
    p.id,
    NOW()
  FROM permissions p
  WHERE p.code IN (
    'patient:read',
    'encounter:read',
    'billing:create', 'billing:read', 'billing:update', 'billing:payment',
    'report:financial'
  );

  -- =====================================================
  -- MED_RECORDS: Documentation access
  -- =====================================================
  INSERT INTO role_permissions (id, role_id, permission_id, created_at)
  SELECT 
    uuid_generate_v4(),
    v_med_records,
    p.id,
    NOW()
  FROM permissions p
  WHERE p.code IN (
    'patient:read', 'patient:update',
    'encounter:read',
    'report:clinical', 'report:operational'
  );

  -- =====================================================
  -- FACILITY_MGR: Facility operations
  -- =====================================================
  INSERT INTO role_permissions (id, role_id, permission_id, created_at)
  SELECT 
    uuid_generate_v4(),
    v_facility_mgr,
    p.id,
    NOW()
  FROM permissions p
  WHERE p.code IN (
    'facility:read', 'facility:update',
    'staff:read',
    'bed:read',
    'report:operational'
  );

END $$;

-- =====================================================
-- Verification
-- =====================================================

-- Count permissions per role
SELECT 
  r.code as role_code,
  r.name as role_name,
  COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON rp.role_id = r.id
WHERE r.tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
GROUP BY r.id, r.code, r.name
ORDER BY permission_count DESC;

-- Sample permissions for physician
SELECT 
  p.code,
  p.name,
  p.resource,
  p.action
FROM roles r
JOIN role_permissions rp ON rp.role_id = r.id
JOIN permissions p ON p.id = rp.permission_id
WHERE r.code = 'PHYSICIAN'
  AND r.tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
ORDER BY p.resource, p.action
LIMIT 15;

-- Expected:
-- SYSTEM_ADMIN: ~50 permissions (all)
-- PHYSICIAN: ~25 permissions (clinical)
-- NURSE: ~15 permissions
-- LAB_TECH: ~4 permissions
-- etc.
