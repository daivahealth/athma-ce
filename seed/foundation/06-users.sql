-- Seed: Users
-- Default password for admin@zeal.local is: Admin@123

INSERT INTO users (id, tenant_id, email, first_name, last_name, password_hash, role, status, last_login, created_at, updated_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'admin@zeal.local', 'Super', 'Admin', '$argon2id$v=19$m=65536,t=3,p=4$md2yzi1H1NB4lo51KHKitg$I8+5LiPOl8SVhJNEnRSzVwLjt4bFyRD+lGEjTxp/7iA', 'super_admin', 'active', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
