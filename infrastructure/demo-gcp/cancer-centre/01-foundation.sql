-- =============================================================================
-- Demo overlay (zeal_foundation): present the demo tenant as a cancer centre.
-- =============================================================================
-- Demo VM only — the shared seeds (seed/foundation/07-facilities.sql) keep the
-- generic "Zeal Main Hospital" for local development.
--
--   * Facility MAIN-HOSP ("Zeal Main Hospital", Abu Dhabi) becomes
--     "Cancer Hospital" in Mumbai. Its id is unchanged, so every clinical,
--     billing and access row that points at it keeps working.
--   * Adds facility CANCER-CLINIC ("Cancer Clinic", Thane) — the satellite
--     follow-up clinic. Every user with access to the hospital gets access to
--     it, and the hospital's staff-specialty mappings are copied to it.
--
-- Idempotent. Run with ../cancer-centre/02-clinical.sql after
-- seed/plugins/oncology/30-demo-cohort.sql (see docs/runbooks/demo-environment-gcp.md).
-- =============================================================================

BEGIN;

UPDATE facilities SET
  name = 'Cancer Hospital',
  license_number = 'MH-CEA-2026-ONC-0001',
  address_line1 = 'Sion-Trombay Road',
  address_line2 = 'Chembur',
  city = 'Mumbai',
  emirate = 'Maharashtra',
  postal_code = '400071',
  country = 'India',
  latitude = 19.05220000,
  longitude = 72.90050000,
  google_place_id = NULL,
  phone_number = '+91-22-6100-0000',
  email = 'info@cancer-hospital.example.in',
  website = 'https://cancer-hospital.example.in',
  building_number = 'Main Block',
  capacity = 450,
  updated_at = NOW()
WHERE id = '087e0bd6-8d65-5133-94bd-7b4cd6ff3665';

INSERT INTO facilities (
  id, tenant_id, name, code, facility_type, license_number, address_line1, address_line2, city, emirate,
  postal_code, country, latitude, longitude, phone_number, email, website, building_number, floor_numbers,
  total_floors, capacity, operating_hours, status, created_at, updated_at
) VALUES (
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'facility:CANCER-CLINIC'),
  '11111111-1111-1111-1111-111111111111', 'Cancer Clinic', 'CANCER-CLINIC', 'clinic', 'MH-CEA-2026-ONC-0002',
  'Ghodbunder Road', 'Thane West', 'Thane', 'Maharashtra', '400615', 'India', 19.23070000, 72.97810000,
  '+91-22-6100-0100', 'clinic@cancer-hospital.example.in', 'https://cancer-hospital.example.in/clinic', 'Tower B', '{G,1}',
  2, 40, '{"monday":{"open":"08:00","close":"20:00"},"tuesday":{"open":"08:00","close":"20:00"},"wednesday":{"open":"08:00","close":"20:00"},"thursday":{"open":"08:00","close":"20:00"},"friday":{"open":"08:00","close":"20:00"},"saturday":{"open":"08:00","close":"14:00"}}'::jsonb,
  'active', NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, address_line1 = EXCLUDED.address_line1, city = EXCLUDED.city,
  emirate = EXCLUDED.emirate, country = EXCLUDED.country, updated_at = NOW();

-- Same users as the hospital can work at the clinic.
INSERT INTO user_facilities (id, user_id, facility_id, is_default, access_level, granted_at, created_at, updated_at)
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'user-facility:' || uf.user_id || ':CANCER-CLINIC'),
       uf.user_id, uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'facility:CANCER-CLINIC'),
       false, uf.access_level, NOW(), NOW(), NOW()
FROM user_facilities uf
WHERE uf.facility_id = '087e0bd6-8d65-5133-94bd-7b4cd6ff3665' AND uf.revoked_at IS NULL
ON CONFLICT (id) DO NOTHING;

-- The hospital's clinicians also consult at the clinic.
INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'staff-specialty:' || ss.id || ':CANCER-CLINIC'),
       ss.tenant_id, ss.staff_id, uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'facility:CANCER-CLINIC'),
       ss.specialty_id, ss.primary_flag, NOW(), NOW()
FROM staff_specialties ss
WHERE ss.facility_id = '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'
ON CONFLICT (id) DO NOTHING;

COMMIT;

SELECT code, name, facility_type, city, country FROM facilities ORDER BY code;
