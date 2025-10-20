-- =====================================================
-- Seed: Roles (Updated for Current Schema)
-- Description: System roles for RBAC
-- Dependencies: 01-tenants.sql
-- =====================================================

-- Note: Roles define what users can do in the system
-- - System roles: Global, reusable across tenants
-- - Tenant roles: Custom roles per tenant

DO $$
DECLARE
  v_tenant_id UUID := uuid_from_text('11111111-1111-1111-1111-111111111111');
BEGIN

  -- =====================================================
  -- System Roles (Tenant-Scoped in Current Schema)
  -- =====================================================
  
  -- System Administrator
  INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at)
  VALUES (
    uuid_from_text('10000000-0000-0000-0000-000000000001'),
    v_tenant_id,
    'SYSTEM_ADMIN',
    'System Administrator',
    'Full system access including tenant management',
    TRUE,
    NOW(),
    NOW()
  );
  
  -- Physician/Doctor
  INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at)
  VALUES (
    uuid_from_text('10000000-0000-0000-0000-000000000002'),
    v_tenant_id,
    'PHYSICIAN',
    'Physician',
    'Licensed doctor with full clinical access',
    TRUE,
    NOW(),
    NOW()
  );
  
  -- Nurse
  INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at)
  VALUES (
    uuid_from_text('10000000-0000-0000-0000-000000000003'),
    v_tenant_id,
    'NURSE',
    'Nurse',
    'Nursing staff with clinical access',
    TRUE,
    NOW(),
    NOW()
  );
  
  -- Lab Technician
  INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at)
  VALUES (
    uuid_from_text('10000000-0000-0000-0000-000000000004'),
    v_tenant_id,
    'LAB_TECH',
    'Laboratory Technician',
    'Lab staff with lab order and result access',
    TRUE,
    NOW(),
    NOW()
  );
  
  -- Radiology Technician
  INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at)
  VALUES (
    uuid_from_text('10000000-0000-0000-0000-000000000005'),
    v_tenant_id,
    'RAD_TECH',
    'Radiology Technician',
    'Radiology staff with imaging access',
    TRUE,
    NOW(),
    NOW()
  );
  
  -- Pharmacist
  INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at)
  VALUES (
    uuid_from_text('10000000-0000-0000-0000-000000000006'),
    v_tenant_id,
    'PHARMACIST',
    'Pharmacist',
    'Pharmacy staff with prescription access',
    TRUE,
    NOW(),
    NOW()
  );
  
  -- Receptionist
  INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at)
  VALUES (
    uuid_from_text('10000000-0000-0000-0000-000000000007'),
    v_tenant_id,
    'RECEPTIONIST',
    'Receptionist',
    'Front desk staff with appointment and registration access',
    TRUE,
    NOW(),
    NOW()
  );
  
  -- Billing Specialist
  INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at)
  VALUES (
    uuid_from_text('10000000-0000-0000-0000-000000000008'),
    v_tenant_id,
    'BILLING',
    'Billing Specialist',
    'Billing staff with financial access',
    TRUE,
    NOW(),
    NOW()
  );
  
  -- Medical Records
  INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at)
  VALUES (
    uuid_from_text('10000000-0000-0000-0000-000000000009'),
    v_tenant_id,
    'MED_RECORDS',
    'Medical Records',
    'Medical records staff with documentation access',
    TRUE,
    NOW(),
    NOW()
  );
  
  -- Facility Manager
  INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at)
  VALUES (
    uuid_from_text('10000000-0000-0000-0000-000000000010'),
    v_tenant_id,
    'FACILITY_MGR',
    'Facility Manager',
    'Facility operations manager',
    TRUE,
    NOW(),
    NOW()
  );

END $$;

-- =====================================================
-- Verification
-- =====================================================

SELECT code, name, description, is_system
FROM roles
WHERE tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111')
ORDER BY code;

-- Expected: 10 system roles
