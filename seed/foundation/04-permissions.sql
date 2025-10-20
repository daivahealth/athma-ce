-- Seed: Permissions

INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000001001', 'users.read', 'Read Users', 'Can view users', 'users', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000001002', 'users.write', 'Write Users', 'Can modify users', 'users', 'write', NOW(), NOW());
