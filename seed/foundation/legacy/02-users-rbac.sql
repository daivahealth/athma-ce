INSERT INTO staff (
  id, tenant_id, first_name, last_name, date_of_birth, gender,
  nationality, phone_number, email, employee_id, staff_type,
  specialties, status, created_at, updated_at
) VALUES
  ('bbbbbbbb-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Ahmed', 'Al-Mansoori', '1980-05-12', 'male',
   'UAE', '+971-50-111-2222', 'ahmed.mansoori@demo-clinic.ae', 'EMP-1001', 'physician',
   '["CARD"]'::jsonb, 'active', NOW(), NOW()),
  ('bbbbbbbb-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Fatima', 'Al-Saeed', '1988-09-03', 'female',
   'UAE', '+971-50-333-4444', 'fatima.saeed@demo-clinic.ae', 'EMP-1002', 'physician',
   '["PEDS"]'::jsonb, 'active', NOW(), NOW());

INSERT INTO staff_specialties (
  id, tenant_id, staff_id, facility_id, specialty_id, primary_flag,
  created_at, updated_at
) VALUES
  ('cccccccc-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', '88888888-1111-1111-1111-111111111112', TRUE, NOW(), NOW()),
  ('cccccccc-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-1111-1111-1111-111111111112', '22222222-1111-1111-1111-111111111111', '88888888-1111-1111-1111-111111111113', TRUE, NOW(), NOW());

INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at)
VALUES
  ('dddddddd-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'tenant_admin', 'Tenant Administrator', 'Full access within tenant', FALSE, NOW(), NOW()),
  ('dddddddd-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'physician', 'Physician', 'Clinical access', FALSE, NOW(), NOW());

INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at)
VALUES
  ('eeeeeeee-1111-1111-1111-111111111111', 'manage_users', 'Manage Users', 'Create/update tenant users', 'users', 'write', NOW(), NOW()),
  ('eeeeeeee-1111-1111-1111-111111111112', 'view_patients', 'View Patients', 'View patient demographics and history', 'patients', 'read', NOW(), NOW());

INSERT INTO role_permissions (id, role_id, permission_id, created_at)
VALUES
  ('ffffffff-1111-1111-1111-111111111111', 'dddddddd-1111-1111-1111-111111111111', 'eeeeeeee-1111-1111-1111-111111111111', NOW()),
  ('ffffffff-1111-1111-1111-111111111112', 'dddddddd-1111-1111-1111-111111111112', 'eeeeeeee-1111-1111-1111-111111111112', NOW());

INSERT INTO users (
  id, tenant_id, email, first_name, last_name, password_hash, role, status,
  staff_id, default_facility_id, last_login, created_at, updated_at
) VALUES
  ('01010101-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'admin@demo-clinic.ae', 'Sara', 'Al-Haddad', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'tenant_admin', 'active', NULL, '22222222-1111-1111-1111-111111111111', NOW(), NOW(), NOW()),
  ('02020202-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ahmed.mansoori@demo-clinic.ae', 'Ahmed', 'Al-Mansoori', '$argon2id$v=19$m=65536,t=3,p=4$hashed_password_here', 'physician', 'active', 'bbbbbbbb-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', NOW(), NOW(), NOW());

INSERT INTO user_roles (id, user_id, role_id, assigned_at, is_active)
VALUES
  ('03030303-1111-1111-1111-111111111111', '01010101-1111-1111-1111-111111111111', 'dddddddd-1111-1111-1111-111111111111', NOW(), TRUE),
  ('03030303-1111-1111-1111-111111111112', '02020202-1111-1111-1111-111111111111', 'dddddddd-1111-1111-1111-111111111112', NOW(), TRUE);

INSERT INTO user_facilities (id, user_id, facility_id, is_default, access_level, granted_at, created_at, updated_at)
VALUES
  ('04040404-1111-1111-1111-111111111111', '01010101-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', TRUE, 'admin', NOW(), NOW(), NOW()),
  ('04040404-1111-1111-1111-111111111112', '02020202-1111-1111-1111-111111111111', '22222222-1111-1111-1111-111111111111', TRUE, 'clinical', NOW(), NOW(), NOW());
