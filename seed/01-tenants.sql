-- Foundation Seed: Tenants
TRUNCATE tenants CASCADE;

INSERT INTO tenants (id, name, domain, status, settings, created_at, updated_at)
VALUES
  ('tenant-demo-0001', 'Demo Health Group', 'demo.zeal.ae', 'active', '{}'::jsonb, NOW(), NOW());
