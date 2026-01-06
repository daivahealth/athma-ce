-- Seed: Wards (9 total) using UUIDv5
-- Updated to include gender_restriction and specialty_id fields

WITH ns AS (
  SELECT '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid AS dns
), deps AS (
  SELECT uuid_generate_v5((SELECT dns FROM ns), 'dept:MAIN:IPD') AS ipd_id
), specs AS (
  SELECT
    uuid_generate_v5((SELECT dns FROM ns), 'specialty:CARDIO') AS cardio_id,
    uuid_generate_v5((SELECT dns FROM ns), 'specialty:NEONAT') AS neonat_id,
    uuid_generate_v5((SELECT dns FROM ns), 'specialty:PED') AS ped_id,
    uuid_generate_v5((SELECT dns FROM ns), 'specialty:GEN_MED') AS gen_med_id,
    uuid_generate_v5((SELECT dns FROM ns), 'specialty:OBGYN') AS obgyn_id
)
INSERT INTO wards (id, department_id, name, code, ward_type, gender_restriction, specialty_id, floor_number, total_beds, nursing_station, status, created_at, updated_at)
VALUES
(uuid_generate_v5((SELECT dns FROM ns), 'ward:ICU-1'), (SELECT ipd_id FROM deps), 'ICU Ward 1', 'ICU-1', 'icu', 'mixed', (SELECT cardio_id FROM specs), '3', 10, 'NS-ICU-1', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:ICU-2'), (SELECT ipd_id FROM deps), 'ICU Ward 2', 'ICU-2', 'icu', 'mixed', NULL, '3', 8, 'NS-ICU-2', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:NICU-1'), (SELECT ipd_id FROM deps), 'Neonatal ICU', 'NICU-1', 'nicu', 'mixed', (SELECT neonat_id FROM specs), '3', 6, 'NS-NICU-1', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:PICU-1'), (SELECT ipd_id FROM deps), 'Pediatric ICU', 'PICU-1', 'picu', 'mixed', (SELECT ped_id FROM specs), '3', 5, 'NS-PICU-1', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:GEN-A'), (SELECT ipd_id FROM deps), 'General Ward A - Male', 'GEN-A', 'general', 'male_only', (SELECT gen_med_id FROM specs), '4', 20, 'NS-GEN-A', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:GEN-B'), (SELECT ipd_id FROM deps), 'General Ward B - Female', 'GEN-B', 'general', 'female_only', (SELECT gen_med_id FROM specs), '4', 20, 'NS-GEN-B', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:GEN-C'), (SELECT ipd_id FROM deps), 'General Ward C - Mixed', 'GEN-C', 'general', 'mixed', NULL, '5', 20, 'NS-GEN-C', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:ISO-1'), (SELECT ipd_id FROM deps), 'Isolation Ward', 'ISO-1', 'isolation', 'mixed', NULL, '5', 5, 'NS-ISO-1', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:MAT-1'), (SELECT ipd_id FROM deps), 'Maternity Ward', 'MAT-1', 'maternity', 'female_only', (SELECT obgyn_id FROM specs), '6', 15, 'NS-MAT-1', 'active', NOW(), NOW());
