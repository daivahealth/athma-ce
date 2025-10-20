-- Seed: Facilities (Main Hospital, Downtown Clinic) - UUIDv5 deterministic IDs

WITH ns AS (
  SELECT '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid AS dns
)
INSERT INTO facilities (
  id, tenant_id, name, code, facility_type, license_number,
  address_line1, address_line2, city, emirate, postal_code, country,
  latitude, longitude, google_place_id,
  phone_number, email, website,
  building_number, floor_numbers, total_floors,
  capacity, operating_hours, status,
  created_at, updated_at
)
VALUES
-- Main Hospital (Abu Dhabi)
(
  uuid_generate_v5((SELECT dns FROM ns), 'facility:MAIN_HOSPITAL'),
  '11111111-1111-1111-1111-111111111111',
  'Zeal Main Hospital', 'MAIN-HOSP', 'hospital', 'DOH-HOSPITAL-2024-001',
  'Corniche Rd', NULL, 'Abu Dhabi', 'Abu Dhabi', '00000', 'UAE',
  24.4539, 54.3773, 'ChIJ-main-hospital-abu-dhabi-001',
  '+971-2-987-6543', 'info@zeal-main-hospital.ae', 'https://main-hospital.zeal.ae',
  'Building 1', ARRAY['G','1','2','3','4','5','6'], 7,
  200, '{"always_open": true}'::jsonb, 'active',
  NOW(), NOW()
),
-- Downtown Clinic (Dubai)
(
  uuid_generate_v5((SELECT dns FROM ns), 'facility:DOWNTOWN_CLINIC'),
  '11111111-1111-1111-1111-111111111111',
  'Zeal Downtown Clinic', 'DT-CLINIC', 'clinic', 'DHA-CLINIC-2024-001',
  'Sheikh Zayed Rd', 'Trade Centre District', 'Dubai', 'Dubai', '00000', 'UAE',
  25.2048, 55.2708, 'ChIJ-downtown-clinic-dubai-001',
  '+971-4-123-4567', 'info@zeal-downtown-clinic.ae', 'https://downtown-clinic.zeal.ae',
  'Tower 15', ARRAY['G','1','2'], 3,
  50, '{"monday": {"open": "08:00", "close": "22:00"}}'::jsonb, 'active',
  NOW(), NOW()
);
