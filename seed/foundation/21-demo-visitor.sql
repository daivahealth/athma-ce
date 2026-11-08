-- Seed: Demo visitor (read-only) role and shared visitor account
--
-- demo_visitor sees every module of the demo tenant but cannot change data:
-- foundation puts readOnly: true in the access token of anyone holding this
-- role, and readOnlyAccessMiddleware in every service refuses their writes.
-- See docs/security/20-RBAC-Access-Control.md (Read-only access).
--
-- Idempotent. Re-run after any seed that adds permissions (plugins included)
-- so the role picks up new read permissions.
--
-- Shared visitor login (until social sign-in lands): visitor@athma.demo / Visitor@123

-- Role
INSERT INTO roles (id, tenant_id, code, name, description, is_system, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000109', '11111111-1111-1111-1111-111111111111', 'demo_visitor', 'Demo Visitor',
   'Read-only access to every module of the demo hospital. Cannot create, change or delete anything.', TRUE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Every read permission, except ones that would expose secrets, other
-- tenants, audit trails, other visitors' accounts or platform data
-- (access requests hold prospects' contact details).
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT gen_random_uuid(), '00000000-0000-0000-0000-000000000109', p.id, NOW()
FROM permissions p
WHERE (p.action IN ('read', 'view', 'list', 'search') OR p.code ~ '[.:](read|view|list)$')
  AND p.code NOT IN ('secret.read', 'tenant.read', 'audit.read', 'user.read')
  AND p.resource <> 'platform'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Shared visitor account
INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, created_at, updated_at)
VALUES
  ('aaaaaaaa-0000-4000-8000-00000000d001', '11111111-1111-1111-1111-111111111111', 'visitor@athma.demo', 'Demo', 'Visitor',
   '$argon2id$v=19$m=65536,p=4,t=3$WqQgqZLQ7qknMPapMJhwOg$cXZLI9DN8XJmYUxuo+CTdxc4zI8ABb6hAO1jolj9CHA',
   'demo_visitor', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (id, user_id, role_id, assigned_by, assigned_at, expires_at, is_active, created_at)
VALUES
  ('00000000-0000-0000-0000-00000000d001', 'aaaaaaaa-0000-4000-8000-00000000d001', '00000000-0000-0000-0000-000000000109', NULL, NOW(), NULL, TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- Read-only access to every facility of the demo tenant; the main hospital is the default.
INSERT INTO user_facilities (id, user_id, facility_id, is_default, access_level, granted_at, created_at, updated_at)
SELECT gen_random_uuid(), 'aaaaaaaa-0000-4000-8000-00000000d001', f.id,
       ROW_NUMBER() OVER (ORDER BY (f.code ILIKE 'MAIN%') DESC, f.code) = 1,
       'read_only', NOW(), NOW(), NOW()
FROM facilities f
WHERE f.tenant_id = '11111111-1111-1111-1111-111111111111'
ON CONFLICT (user_id, facility_id) DO NOTHING;
