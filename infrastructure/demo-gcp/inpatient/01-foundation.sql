-- =============================================================================
-- Demo overlay (zeal_foundation): inpatient wards and beds for Cancer Hospital.
-- =============================================================================
-- Demo VM only. The demo database was restored without departments, wards or
-- beds, so the ward board, bed board and bed search had nothing to show. This
-- adds an Inpatient Services department to facility MAIN-HOSP ("Cancer
-- Hospital") and seven oncology wards, 96 beds in all.
--
-- Ids are uuid_generate_v5(<ns>, 'ward:ONC-<code>') and
-- uuid_generate_v5(<ns>, 'bed:ONC-<code>:<nnn>'). 02-clinical.sql derives the
-- same ids to put patients in these beds (the clinical database cannot read
-- foundation), so keep the ward plan below in step with that file.
--
-- Idempotent: re-running updates names and bed counts in place.
-- See docs/runbooks/demo-environment-gcp.md (Inpatient demo data).
-- =============================================================================

BEGIN;

INSERT INTO departments (
  id, facility_id, name, code, department_type, specialty_id, head_of_department,
  floor_number, phone_extension, operating_hours, status, created_at, updated_at
) VALUES (
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'dept:MAIN:IPD'),
  '087e0bd6-8d65-5133-94bd-7b4cd6ff3665', 'Inpatient Services', 'IPD', 'ipd', NULL, NULL,
  '3', '3000', '{"always_open": true}'::jsonb, 'active', NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, status = 'active', updated_at = NOW();

CREATE TEMP TABLE onc_ward ON COMMIT DROP AS
SELECT * FROM (VALUES
  ('MED-M', 'Medical Oncology Ward - Male',   'general',   'male_only',   '4', 20, 'general',   false, NULL::text),
  ('MED-F', 'Medical Oncology Ward - Female', 'general',   'female_only', '4', 20, 'general',   false, NULL),
  ('SURG',  'Surgical Oncology Ward',         'general',   'mixed',       '5', 18, 'general',   false, NULL),
  ('HEM',   'Haemato-Oncology Ward',          'isolation', 'mixed',       '6', 12, 'isolation', true,  'protective'),
  ('BMT',   'Bone Marrow Transplant Unit',    'isolation', 'mixed',       '6',  6, 'isolation', true,  'protective'),
  ('ICU',   'Oncology ICU',                   'icu',       'mixed',       '3', 10, 'icu',       false, NULL),
  ('PALL',  'Palliative Care Ward',           'general',   'mixed',       '2', 10, 'general',   false, NULL)
) AS w(code, name, ward_type, gender, floor, beds, bed_type, isolation, isolation_type);

INSERT INTO wards (
  id, department_id, name, code, ward_type, gender_restriction, specialty_id, floor_number,
  total_beds, nursing_station, status, created_at, updated_at
)
SELECT
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'ward:ONC-' || w.code),
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'dept:MAIN:IPD'),
  w.name, 'ONC-' || w.code, w.ward_type, w.gender, NULL, w.floor,
  w.beds, 'NS-ONC-' || w.code, 'active', NOW(), NOW()
FROM onc_ward w
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, ward_type = EXCLUDED.ward_type, gender_restriction = EXCLUDED.gender_restriction,
  floor_number = EXCLUDED.floor_number, total_beds = EXCLUDED.total_beds, status = 'active', updated_at = NOW();

INSERT INTO beds (
  id, ward_id, bed_number, bed_type, features, requires_isolation, isolation_type,
  gender_restriction, status, maintenance_notes, created_at, updated_at
)
SELECT
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'bed:ONC-' || w.code || ':' || lpad(n::text, 3, '0')),
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'ward:ONC-' || w.code),
  w.code || '-' || lpad(n::text, 2, '0'),
  w.bed_type,
  CASE w.code
    WHEN 'ICU' THEN '{"oxygen": true, "ventilator": true, "cardiac_monitor": true, "infusion_pumps": 4}'
    WHEN 'BMT' THEN '{"oxygen": true, "hepa_filter": true, "positive_pressure": true, "cardiac_monitor": true}'
    WHEN 'HEM' THEN '{"oxygen": true, "hepa_filter": true, "infusion_pumps": 2}'
    ELSE '{"oxygen": true, "iv_pole": true, "infusion_pumps": 1}'
  END::jsonb,
  w.isolation, w.isolation_type, w.gender,
  -- One bed out of service so the board shows the maintenance state.
  CASE WHEN w.code = 'MED-M' AND n = 20 THEN 'maintenance' ELSE 'active' END,
  CASE WHEN w.code = 'MED-M' AND n = 20 THEN 'Bed motor fault - biomedical engineering informed' END,
  NOW(), NOW()
FROM onc_ward w, generate_series(1, w.beds) AS n
ON CONFLICT (id) DO UPDATE SET
  bed_number = EXCLUDED.bed_number, bed_type = EXCLUDED.bed_type, features = EXCLUDED.features,
  requires_isolation = EXCLUDED.requires_isolation, isolation_type = EXCLUDED.isolation_type,
  gender_restriction = EXCLUDED.gender_restriction, status = EXCLUDED.status,
  maintenance_notes = EXCLUDED.maintenance_notes, updated_at = NOW();

COMMIT;

SELECT 'onc wards' AS what, COUNT(*) FROM wards WHERE code LIKE 'ONC-%'
UNION ALL SELECT 'onc beds', COUNT(*) FROM beds b JOIN wards w ON w.id = b.ward_id WHERE w.code LIKE 'ONC-%';
