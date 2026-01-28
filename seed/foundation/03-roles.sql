-- Seed: Roles

INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000101', '11111111-1111-1111-1111-111111111111', 'super_admin', 'Super Admin', 'System administrator with full access', TRUE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000102', '11111111-1111-1111-1111-111111111111', 'tenant_admin', 'Tenant Admin', 'Tenant administrator', TRUE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000103', '11111111-1111-1111-1111-111111111111', 'physician', 'Physician', 'Medical doctor', TRUE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000104', '11111111-1111-1111-1111-111111111111', 'nurse', 'Nurse', 'Nursing staff', TRUE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000105', '11111111-1111-1111-1111-111111111111', 'receptionist', 'Receptionist', 'Front desk staff for patient registration and scheduling', TRUE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000106', '11111111-1111-1111-1111-111111111111', 'billing_clerk', 'Billing Clerk', 'Billing and revenue cycle staff', TRUE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000107', '11111111-1111-1111-1111-111111111111', 'lab_technician', 'Lab Technician', 'Laboratory staff', TRUE, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000108', '11111111-1111-1111-1111-111111111111', 'pharmacist', 'Pharmacist', 'Pharmacy staff', TRUE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
