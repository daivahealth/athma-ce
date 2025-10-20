-- Seed: Expanded RBAC (UUIDv5)

-- Additional permissions
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'perm:staff.read'), 'staff.read', 'Read Staff', 'Can view staff', 'staff', 'read', NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'perm:staff.write'), 'staff.write', 'Write Staff', 'Can modify staff', 'staff', 'write', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Map to Super Admin role
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT 
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'rp:super_admin:' || p.code),
  (SELECT id FROM roles WHERE code='super_admin' AND tenant_id='11111111-1111-1111-1111-111111111111'),
  p.id,
  NOW()
FROM permissions p
WHERE p.code IN ('staff.read','staff.write')
ON CONFLICT DO NOTHING;

-- Assign tenant_admin to admin user as well
INSERT INTO user_roles (id, user_id, role_id, assigned_by, assigned_at, expires_at, is_active, created_at)
VALUES (
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'ur:admin:tenant_admin'),
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  (SELECT id FROM roles WHERE code='tenant_admin' AND tenant_id='11111111-1111-1111-1111-111111111111'),
  NULL, NOW(), NULL, TRUE, NOW()
)
ON CONFLICT DO NOTHING;
