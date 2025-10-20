-- Seed: Wards (9 total) using UUIDv5

WITH ns AS (
  SELECT '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid AS dns
), deps AS (
  SELECT uuid_generate_v5((SELECT dns FROM ns), 'dept:MAIN:IPD') AS ipd_id
)
INSERT INTO wards (id, department_id, name, code, ward_type, floor_number, total_beds, available_beds, nursing_station, status, created_at, updated_at)
VALUES
(uuid_generate_v5((SELECT dns FROM ns), 'ward:ICU-1'), (SELECT ipd_id FROM deps), 'ICU Ward 1', 'ICU-1', 'icu', '3', 10, 10, 'NS-ICU-1', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:ICU-2'), (SELECT ipd_id FROM deps), 'ICU Ward 2', 'ICU-2', 'icu', '3', 8, 8, 'NS-ICU-2', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:NICU-1'), (SELECT ipd_id FROM deps), 'Neonatal ICU', 'NICU-1', 'nicu', '3', 6, 6, 'NS-NICU-1', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:PICU-1'), (SELECT ipd_id FROM deps), 'Pediatric ICU', 'PICU-1', 'picu', '3', 5, 5, 'NS-PICU-1', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:GEN-A'), (SELECT ipd_id FROM deps), 'General Ward A', 'GEN-A', 'general', '4', 20, 20, 'NS-GEN-A', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:GEN-B'), (SELECT ipd_id FROM deps), 'General Ward B', 'GEN-B', 'general', '4', 20, 20, 'NS-GEN-B', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:GEN-C'), (SELECT ipd_id FROM deps), 'General Ward C', 'GEN-C', 'general', '5', 20, 20, 'NS-GEN-C', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:ISO-1'), (SELECT ipd_id FROM deps), 'Isolation Ward', 'ISO-1', 'isolation', '5', 5, 5, 'NS-ISO-1', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'ward:MAT-1'), (SELECT ipd_id FROM deps), 'Maternity Ward', 'MAT-1', 'maternity', '6', 15, 15, 'NS-MAT-1', 'active', NOW(), NOW());
