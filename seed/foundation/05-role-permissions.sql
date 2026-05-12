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
  'imaging_result', 'procedure_result', 'schedule', 'calendar', 'admission', 'discharge',
  'ward', 'triage', 'consent', 'clinical_order', 'availability',
  'ot_request', 'ot_schedule', 'ot_room', 'ot_report',
  'care_channel', 'care_team', 'care_message', 'checklist',
  'discharge_summary', 'note_template', 'catalog', 'valueset'
)
AND p.action IN ('read', 'create', 'update', 'sign', 'close', 'add', 'enter', 'verify', 'amend', 'review', 'approve', 'cancel', 'advance')
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
  -- Schedule/calendar/availability read
  OR (p.resource IN ('schedule', 'calendar', 'availability') AND p.action = 'read')
  -- OT tracking access
  OR (p.resource IN ('ot_request', 'ot_schedule', 'ot_room', 'ot_report') AND p.action = 'read')
  -- Consent management
  OR (p.resource IN ('consent', 'consent_template') AND p.action IN ('read', 'create'))
  -- Care channel access (read, create messages, view team)
  OR (p.resource IN ('care_channel', 'care_team', 'care_message') AND p.action IN ('read', 'create', 'add'))
  -- Checklist access
  OR (p.resource IN ('checklist', 'checklist_template') AND p.action IN ('read', 'create', 'update'))
  -- Discharge summary read
  OR (p.resource = 'discharge_summary' AND p.action = 'read')
  -- Note template read
  OR (p.resource = 'note_template' AND p.action = 'read')
  -- Catalog and valueset read
  OR (p.resource IN ('catalog', 'valueset') AND p.action = 'read')
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Receptionist gets front desk permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000105', -- receptionist role
  p.id,
  NOW()
FROM permissions p
WHERE (
  -- Patient registration and viewing
  (p.resource = 'patient' AND p.action IN ('read', 'create', 'update'))
  -- Appointment management
  OR (p.resource = 'appointment' AND p.action IN ('read', 'create', 'update', 'cancel', 'reschedule', 'checkin'))
  -- Schedule/calendar/availability read
  OR (p.resource IN ('schedule', 'calendar', 'availability') AND p.action = 'read')
  -- Encounter read only
  OR (p.resource = 'encounter' AND p.action = 'read')
  -- Ward read (for bed availability)
  OR (p.resource = 'ward' AND p.action = 'read')
  -- Consent for patient check-in
  OR (p.resource IN ('consent', 'consent_template') AND p.action IN ('read', 'create'))
  -- Catalog read for services
  OR (p.resource = 'catalog' AND p.action = 'read')
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Billing Clerk gets billing permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000106', -- billing_clerk role
  p.id,
  NOW()
FROM permissions p
WHERE (
  -- Billing/invoice management
  (p.resource IN ('invoice', 'payment', 'claim') AND p.action IN ('read', 'create', 'update', 'submit'))
  -- Patient read for billing context
  OR (p.resource = 'patient' AND p.action = 'read')
  -- Appointment and encounter read for billing
  OR (p.resource IN ('appointment', 'encounter') AND p.action = 'read')
  -- Catalog read for pricing
  OR (p.resource = 'catalog' AND p.action = 'read')
  -- Admission read for inpatient billing
  OR (p.resource = 'admission' AND p.action = 'read')
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Lab Technician gets lab permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000107', -- lab_technician role
  p.id,
  NOW()
FROM permissions p
WHERE (
  -- Lab order and result management
  (p.resource IN ('lab_order', 'lab_result') AND p.action IN ('read', 'update', 'enter'))
  -- Patient read for lab context
  OR (p.resource = 'patient' AND p.action = 'read')
  -- Encounter read
  OR (p.resource = 'encounter' AND p.action = 'read')
  -- Catalog read for tests
  OR (p.resource = 'catalog' AND p.action = 'read')
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Pharmacist gets pharmacy permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000108', -- pharmacist role
  p.id,
  NOW()
FROM permissions p
WHERE (
  -- Prescription management
  (p.resource = 'prescription' AND p.action IN ('read', 'update', 'dispense'))
  -- Patient read for context
  OR (p.resource = 'patient' AND p.action = 'read')
  -- Encounter read
  OR (p.resource = 'encounter' AND p.action = 'read')
  -- Catalog read for medications
  OR (p.resource = 'catalog' AND p.action = 'read')
  -- Admission read for inpatient prescriptions
  OR (p.resource = 'admission' AND p.action = 'read')
  -- Pharmacy module permissions (all except stock.manage — that requires pharmacy manager)
  OR (p.resource = 'pharmacy' AND p.action IN ('queue.read', 'dispensing.read', 'dispensing.verify', 'dispensing.cancel', 'dispensing.return', 'stock.read'))
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Ward nurse gets ward receive permission
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000104', -- nurse role
  p.id,
  NOW()
FROM permissions p
WHERE p.resource = 'pharmacy' AND p.action IN ('ward.receive', 'queue.read', 'dispensing.read')
ON CONFLICT (role_id, permission_id) DO NOTHING;
