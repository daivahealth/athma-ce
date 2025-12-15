-- Seed: User Facilities (assign user to facilities) using UUIDv5

-- Admin user to both facilities; default at Main Hospital
INSERT INTO user_facilities (id, user_id, facility_id, is_default, access_level, granted_at, granted_by, revoked_at, created_at, updated_at)
VALUES
(
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'uf:admin:MAIN'),
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'facility:MAIN_HOSPITAL'),
  TRUE,
  'admin',
  NOW(),
  NULL,
  NULL,
  NOW(), NOW()
),
(
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'uf:admin:DT'),
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'facility:DOWNTOWN_CLINIC'),
  FALSE,
  'admin',
  NOW(),
  NULL,
  NULL,
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;
