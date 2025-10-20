-- =====================================================
-- Seed: Permissions (Updated for Current Schema)
-- Description: System permissions for RBAC
-- Dependencies: None (global permissions)
-- =====================================================

-- Note: Permissions are fine-grained actions
-- Format: {resource}:{action}

INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at)
VALUES
  -- =====================================================
  -- Patient Management
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000001'), 'patient:create', 'Create Patient', 'Register new patients', 'patient', 'create', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000002'), 'patient:read', 'View Patient', 'View patient information', 'patient', 'read', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000003'), 'patient:update', 'Update Patient', 'Update patient information', 'patient', 'update', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000004'), 'patient:delete', 'Delete Patient', 'Archive patient records', 'patient', 'delete', NOW(), NOW()),
  
  -- =====================================================
  -- Appointment Management
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000010'), 'appointment:create', 'Create Appointment', 'Schedule appointments', 'appointment', 'create', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000011'), 'appointment:read', 'View Appointment', 'View appointments', 'appointment', 'read', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000012'), 'appointment:update', 'Update Appointment', 'Modify appointments', 'appointment', 'update', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000013'), 'appointment:delete', 'Cancel Appointment', 'Cancel appointments', 'appointment', 'delete', NOW(), NOW()),
  
  -- =====================================================
  -- Encounter/Visit Management
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000020'), 'encounter:create', 'Create Encounter', 'Create patient encounters/visits', 'encounter', 'create', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000021'), 'encounter:read', 'View Encounter', 'View encounter details', 'encounter', 'read', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000022'), 'encounter:update', 'Update Encounter', 'Update encounter documentation', 'encounter', 'update', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000023'), 'encounter:sign', 'Sign Encounter', 'Sign and finalize encounters', 'encounter', 'sign', NOW(), NOW()),
  
  -- =====================================================
  -- Clinical Orders
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000030'), 'order:create', 'Create Order', 'Create clinical orders', 'order', 'create', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000031'), 'order:read', 'View Order', 'View orders', 'order', 'read', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000032'), 'order:update', 'Update Order', 'Modify orders', 'order', 'update', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000033'), 'order:cancel', 'Cancel Order', 'Cancel orders', 'order', 'cancel', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000034'), 'order:sign', 'Sign Order', 'Sign and authorize orders', 'order', 'sign', NOW(), NOW()),
  
  -- =====================================================
  -- Prescription Management
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000040'), 'prescription:create', 'Create Prescription', 'Prescribe medications', 'prescription', 'create', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000041'), 'prescription:read', 'View Prescription', 'View prescriptions', 'prescription', 'read', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000042'), 'prescription:dispense', 'Dispense Medication', 'Dispense prescribed medications', 'prescription', 'dispense', NOW(), NOW()),
  
  -- =====================================================
  -- Lab Management
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000050'), 'lab:create', 'Create Lab Order', 'Order lab tests', 'lab', 'create', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000051'), 'lab:read', 'View Lab Results', 'View lab results', 'lab', 'read', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000052'), 'lab:update', 'Update Lab Results', 'Enter lab results', 'lab', 'update', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000053'), 'lab:sign', 'Sign Lab Results', 'Sign and release lab results', 'lab', 'sign', NOW(), NOW()),
  
  -- =====================================================
  -- Imaging/Radiology
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000060'), 'radiology:create', 'Create Imaging Order', 'Order imaging studies', 'radiology', 'create', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000061'), 'radiology:read', 'View Imaging', 'View imaging studies', 'radiology', 'read', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000062'), 'radiology:update', 'Update Imaging', 'Update imaging reports', 'radiology', 'update', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000063'), 'radiology:sign', 'Sign Imaging Report', 'Sign imaging reports', 'radiology', 'sign', NOW(), NOW()),
  
  -- =====================================================
  -- Bed Management
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000070'), 'bed:assign', 'Assign Bed', 'Assign patients to beds', 'bed', 'assign', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000071'), 'bed:release', 'Release Bed', 'Release beds from patients', 'bed', 'release', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000072'), 'bed:read', 'View Bed Status', 'View bed availability', 'bed', 'read', NOW(), NOW()),
  
  -- =====================================================
  -- Billing Management
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000080'), 'billing:create', 'Create Charge', 'Create billing charges', 'billing', 'create', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000081'), 'billing:read', 'View Billing', 'View billing information', 'billing', 'read', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000082'), 'billing:update', 'Update Billing', 'Modify billing records', 'billing', 'update', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000083'), 'billing:payment', 'Process Payment', 'Process patient payments', 'billing', 'payment', NOW(), NOW()),
  
  -- =====================================================
  -- Facility Management
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000090'), 'facility:create', 'Create Facility', 'Create new facilities', 'facility', 'create', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000091'), 'facility:read', 'View Facility', 'View facility information', 'facility', 'read', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000092'), 'facility:update', 'Update Facility', 'Update facility settings', 'facility', 'update', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000093'), 'facility:delete', 'Delete Facility', 'Archive facilities', 'facility', 'delete', NOW(), NOW()),
  
  -- =====================================================
  -- User Management
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000100'), 'user:create', 'Create User', 'Create user accounts', 'user', 'create', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000101'), 'user:read', 'View User', 'View user information', 'user', 'read', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000102'), 'user:update', 'Update User', 'Update user accounts', 'user', 'update', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000103'), 'user:delete', 'Delete User', 'Deactivate user accounts', 'user', 'delete', NOW(), NOW()),
  
  -- =====================================================
  -- Staff Management
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000110'), 'staff:create', 'Create Staff', 'Create staff records', 'staff', 'create', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000111'), 'staff:read', 'View Staff', 'View staff information', 'staff', 'read', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000112'), 'staff:update', 'Update Staff', 'Update staff records', 'staff', 'update', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000113'), 'staff:delete', 'Delete Staff', 'Archive staff records', 'staff', 'delete', NOW(), NOW()),
  
  -- =====================================================
  -- Reporting
  -- =====================================================
  (uuid_from_text('20000000-0000-0000-0000-000000000120'), 'report:clinical', 'Clinical Reports', 'Access clinical reports', 'report', 'clinical', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000121'), 'report:financial', 'Financial Reports', 'Access financial reports', 'report', 'financial', NOW(), NOW()),
  (uuid_from_text('20000000-0000-0000-0000-000000000122'), 'report:operational', 'Operational Reports', 'Access operational reports', 'report', 'operational', NOW(), NOW());

END $$;

-- =====================================================
-- Verification
-- =====================================================

SELECT 
  code,
  name,
  resource,
  action,
  description
FROM permissions
ORDER BY resource, action;

-- Count by resource
SELECT 
  resource,
  COUNT(*) as permission_count
FROM permissions
GROUP BY resource
ORDER BY permission_count DESC;

-- Expected: ~50 permissions across 12 resources
