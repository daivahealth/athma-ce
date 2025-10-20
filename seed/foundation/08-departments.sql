-- Seed: Departments (8 total) using UUIDv5

WITH ns AS (
  SELECT '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid AS dns
), fac AS (
  SELECT 
    uuid_generate_v5((SELECT dns FROM ns), 'facility:MAIN_HOSPITAL') AS main_hospital_id,
    uuid_generate_v5((SELECT dns FROM ns), 'facility:DOWNTOWN_CLINIC') AS downtown_clinic_id
)
INSERT INTO departments (id, facility_id, name, code, department_type, specialty_id, head_of_department, floor_number, phone_extension, operating_hours, status, created_at, updated_at)
VALUES
-- Main Hospital departments
(
  uuid_generate_v5((SELECT dns FROM ns), 'dept:MAIN:OPD'), (SELECT main_hospital_id FROM fac), 'Outpatient Department', 'OPD', 'opd', NULL, NULL, '1', '1000', NULL, 'active', NOW(), NOW()
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'dept:MAIN:IPD'), (SELECT main_hospital_id FROM fac), 'Inpatient Department', 'IPD', 'ipd', NULL, NULL, '3', '3000', '{"always_open": true}'::jsonb, 'active', NOW(), NOW()
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'dept:MAIN:ER'), (SELECT main_hospital_id FROM fac), 'Emergency Department', 'ER', 'emergency', NULL, NULL, 'G', '9999', '{"always_open": true}'::jsonb, 'active', NOW(), NOW()
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'dept:MAIN:RAD'), (SELECT main_hospital_id FROM fac), 'Radiology Department', 'RAD', 'radiology', NULL, NULL, '2', '2000', NULL, 'active', NOW(), NOW()
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'dept:MAIN:LAB'), (SELECT main_hospital_id FROM fac), 'Laboratory Department', 'LAB', 'laboratory', NULL, NULL, '1', '1500', NULL, 'active', NOW(), NOW()
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'dept:MAIN:SURG'), (SELECT main_hospital_id FROM fac), 'Surgery Department', 'SURG', 'surgery', NULL, NULL, '4', '4000', NULL, 'active', NOW(), NOW()
),
(
  uuid_generate_v5((SELECT dns FROM ns), 'dept:MAIN:PHARM'), (SELECT main_hospital_id FROM fac), 'Pharmacy Department', 'PHARM', 'pharmacy', NULL, NULL, 'G', '1200', '{"always_open": true}'::jsonb, 'active', NOW(), NOW()
),
-- Downtown Clinic OPD
(
  uuid_generate_v5((SELECT dns FROM ns), 'dept:DT:OPD'), (SELECT downtown_clinic_id FROM fac), 'Outpatient Department', 'OPD', 'opd', NULL, NULL, 'G', '2000', NULL, 'active', NOW(), NOW()
);
