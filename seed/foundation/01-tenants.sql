-- Seed: Tenants (foundation)

INSERT INTO tenants (id, name, domain, status, settings, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Zeal Demo Health', 'demo.zeal.local', 'active', '{}'::jsonb, NOW(), NOW());
