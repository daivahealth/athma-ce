-- =============================================================================
-- Demo overlay (zeal_foundation): present the demo tenant as an Indian hospital
-- group for the public demo.
-- =============================================================================
-- Demo VM only. The shared seeds keep their UAE sample data for local development.
--
--   * Tenant "Zeal Demo Health" becomes "Athma Demo Hospital".
--   * Facility DT-CLINIC ("Zeal Downtown Clinic", Dubai) becomes "Athma City Clinic"
--     in Pune. Its id is unchanged, so every row that points at it keeps working.
--   * Staff with Arabic or Western sample names get Indian names (same gender);
--     every staff phone becomes +91 and email moves to the reserved
--     demo.athma.example domain. Ids are unchanged.
--
-- Run 02-clinical.sql and 03-rcm.sql afterwards: they update the copies of staff
-- names stored on appointments, schedules and dispensings.
-- Idempotent. See docs/runbooks/demo-environment-gcp.md (India demo content).
-- =============================================================================

BEGIN;

UPDATE tenants SET name = 'Athma Demo Hospital', updated_at = NOW()
WHERE id = '11111111-1111-1111-1111-111111111111' AND name IS DISTINCT FROM 'Athma Demo Hospital';

UPDATE facilities SET
  name = 'Athma City Clinic',
  license_number = 'MH-CEA-2026-CLN-0002',
  address_line1 = 'Fergusson College Road',
  address_line2 = 'Shivajinagar',
  city = 'Pune',
  emirate = 'Maharashtra',
  postal_code = '411004',
  country = 'India',
  latitude = 18.52040000,
  longitude = 73.85670000,
  google_place_id = NULL,
  phone_number = '+91-20-6100-0000',
  email = 'info@city-clinic.demo.athma.example',
  website = NULL,
  updated_at = NOW()
WHERE tenant_id = '11111111-1111-1111-1111-111111111111' AND code = 'DT-CLINIC';

-- Old full name (as stored, middle names included) -> new first/last name.
CREATE TEMP TABLE demo_staff_rename (old_first text, old_last text, new_first text, new_last text) ON COMMIT DROP;
INSERT INTO demo_staff_rename VALUES
  ('Omar',     'Al-Ketbi',    'Arjun',  'Mehta'),
  ('Ahmed',    'Al-Mansoori', 'Vikram', 'Iyer'),
  ('Aisha',    'Al-Mazrouei', 'Ananya', 'Desai'),
  ('Layla',    'Al-Shamsi',   'Kavya',  'Nair'),
  ('Fatima',   'Al-Zaabi',    'Meera',  'Krishnan'),
  ('Mohammed', 'Hassan',      'Imran',  'Qureshi'),
  ('Nadia',    'Ibrahim',     'Sana',   'Shaikh'),
  ('Carlos',   'Rodriguez',   'Rohan',  'D''Souza'),
  ('Maria',    'Santos',      'Maria',  'Fernandes'),
  ('John',     'Williams',    'Sameer', 'Joshi'),
  ('Ahmed',    'Yousef',      'Aditya', 'Rao');

UPDATE staff s SET
  first_name = r.new_first,
  last_name = r.new_last,
  middle_name = NULL,
  display_name = CASE WHEN s.display_name LIKE 'Dr %' THEN 'Dr ' ELSE '' END || r.new_first || ' ' || r.new_last,
  updated_at = NOW()
FROM demo_staff_rename r
WHERE s.tenant_id = '11111111-1111-1111-1111-111111111111'
  AND s.first_name = r.old_first AND s.last_name = r.old_last;

UPDATE staff SET
  nationality = 'India',
  phone_number = '+9198' || right(regexp_replace(coalesce(phone_number, ''), '\D', '', 'g'), 8),
  email = CASE WHEN email IS NULL THEN NULL
               ELSE lower(regexp_replace(first_name || '.' || last_name, '[^A-Za-z.]', '', 'g')) || '@demo.athma.example' END,
  updated_at = NOW()
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
  AND (phone_number LIKE '+971%' OR email LIKE '%@zeal.ae' OR nationality IS DISTINCT FROM 'India');

COMMIT;
