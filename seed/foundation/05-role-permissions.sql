-- Seed: Role-Permissions
-- Assigns permissions to roles

-- Super Admin gets ALL permissions (using a cross join approach)
-- First, let's assign all RBAC permissions to super_admin
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000101', -- super_admin role
  p.id,
  NOW()
FROM permissions p
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Tenant Admin gets administrative permissions (excluding tenant management)
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000102', -- tenant_admin role
  p.id,
  NOW()
FROM permissions p
WHERE p.resource NOT IN ('tenant')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Physician gets clinical permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000103', -- physician role
  p.id,
  NOW()
FROM permissions p
WHERE p.resource IN (
  'patient', 'appointment', 'encounter', 'clinical_note', 'diagnosis',
  'vitals', 'prescription', 'lab_order', 'lab_result', 'imaging_order',
  'imaging_result', 'schedule', 'calendar', 'admission', 'discharge',
  'ward', 'triage'
)
AND p.action IN ('read', 'create', 'update', 'sign', 'close')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Nurse gets nursing-specific permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000104', -- nurse role
  p.id,
  NOW()
FROM permissions p
WHERE (
  -- Full access to vitals, triage
  (p.resource IN ('vitals', 'triage') AND p.action IN ('read', 'create', 'update'))
  -- Read/checkin access to appointments
  OR (p.resource = 'appointment' AND p.action IN ('read', 'checkin'))
  -- Read access to encounters and patients
  OR (p.resource IN ('patient', 'encounter', 'clinical_note', 'diagnosis', 'prescription', 'lab_result', 'imaging_result') AND p.action = 'read')
  -- Ward and bed access
  OR (p.resource IN ('ward', 'bed', 'admission') AND p.action IN ('read'))
  -- Schedule/calendar read
  OR (p.resource IN ('schedule', 'calendar') AND p.action = 'read')
)
ON CONFLICT (role_id, permission_id) DO NOTHING;
