-- Seed demo tenant and user for local testing
insert into tenants (id, name, domain, status)
values ('11111111-1111-1111-1111-111111111111', 'athma-ce Demo', 'demo.zeal.test', 'active')
ON CONFLICT (id) DO NOTHING;

insert into users (id, tenant_id, email, first_name, last_name, password_hash, role, status)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'demo@example.com',
  'Demo',
  'User',
  '$argon2id$v=19$m=65536,t=3,p=4$Yh6gaX+q+MeTgc9W2heErg$gBGgvWmQvdnG7k5Xqqkph/OQI03wECfKbAlmHD3jPjI',
  'admin',
  'active'
)
ON CONFLICT (id) DO NOTHING;
