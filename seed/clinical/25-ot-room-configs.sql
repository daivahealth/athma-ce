-- Seed: OT Room Configurations using deterministic UUIDv5 space references

WITH ns AS (
  SELECT '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid AS dns
)
INSERT INTO ot_room_configs (
  id,
  tenant_id,
  space_id,
  specialty,
  is_active,
  notes,
  created_at,
  updated_at,
  created_by,
  updated_by
)
VALUES
(
  uuid_generate_v5((SELECT dns FROM ns), 'ot-room-config:MAIN:OT-01'),
  '11111111-1111-1111-1111-111111111111',
  uuid_generate_v5((SELECT dns FROM ns), 'space:OT:MAIN:01'),
  'general_surgery',
  TRUE,
  'General surgery theatre with laminar flow.',
  NOW(),
  NOW(),
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'ot-room-config:MAIN:OT-02'),
  '11111111-1111-1111-1111-111111111111',
  uuid_generate_v5((SELECT dns FROM ns), 'space:OT:MAIN:02'),
  'orthopaedics',
  TRUE,
  'Orthopaedic room with C-arm and traction support.',
  NOW(),
  NOW(),
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'ot-room-config:MAIN:OT-03'),
  '11111111-1111-1111-1111-111111111111',
  uuid_generate_v5((SELECT dns FROM ns), 'space:OT:MAIN:03'),
  'neurosurgery',
  TRUE,
  'Neurosurgery theatre with microscope and navigation stack.',
  NOW(),
  NOW(),
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'ot-room-config:MAIN:OT-HYB-01'),
  '11111111-1111-1111-1111-111111111111',
  uuid_generate_v5((SELECT dns FROM ns), 'space:OT:MAIN:04'),
  'cardiac_hybrid',
  TRUE,
  'Hybrid OT for complex cardiovascular and endovascular procedures.',
  NOW(),
  NOW(),
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
)
ON CONFLICT (tenant_id, space_id) DO NOTHING;
