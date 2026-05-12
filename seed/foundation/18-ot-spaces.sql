-- Seed: Operating Theatre Spaces (Main Hospital) using UUIDv5

WITH ns AS (
  SELECT '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid AS dns
), refs AS (
  SELECT
    (
      SELECT id
      FROM facilities
      WHERE code = 'MAIN-HOSP'
      LIMIT 1
    ) AS facility_id,
    (
      SELECT id
      FROM departments
      WHERE facility_id = (
        SELECT id
        FROM facilities
        WHERE code = 'MAIN-HOSP'
        LIMIT 1
      )
      AND code = 'SURG'
      LIMIT 1
    ) AS department_id
)
INSERT INTO spaces (
  id,
  facility_id,
  department_id,
  clinic_id,
  name,
  space_number,
  space_type,
  floor_number,
  equipment,
  capacity,
  is_active,
  created_at,
  updated_at
)
VALUES
(
  uuid_generate_v5((SELECT dns FROM ns), 'space:OT:MAIN:01'),
  (SELECT facility_id FROM refs),
  (SELECT department_id FROM refs),
  NULL,
  'Operating Theatre 01',
  'OT-01',
  'operating_theatre',
  '4',
  '["anaesthesia_workstation","laminar_flow","surgical_lights"]'::jsonb,
  1,
  TRUE,
  NOW(),
  NOW()
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'space:OT:MAIN:02'),
  (SELECT facility_id FROM refs),
  (SELECT department_id FROM refs),
  NULL,
  'Operating Theatre 02',
  'OT-02',
  'operating_theatre',
  '4',
  '["anaesthesia_workstation","c_arm","orthopaedic_table"]'::jsonb,
  1,
  TRUE,
  NOW(),
  NOW()
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'space:OT:MAIN:03'),
  (SELECT facility_id FROM refs),
  (SELECT department_id FROM refs),
  NULL,
  'Operating Theatre 03',
  'OT-03',
  'operating_theatre',
  '4',
  '["anaesthesia_workstation","microscope","neuro_navigation"]'::jsonb,
  1,
  TRUE,
  NOW(),
  NOW()
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'space:OT:MAIN:04'),
  (SELECT facility_id FROM refs),
  (SELECT department_id FROM refs),
  NULL,
  'Hybrid Operating Theatre',
  'OT-HYB-01',
  'operating_theatre',
  '4',
  '["anaesthesia_workstation","cath_lab","hybrid_imaging","laminar_flow"]'::jsonb,
  1,
  TRUE,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
