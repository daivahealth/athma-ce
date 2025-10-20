-- Seed: Staff Specialties using UUIDv5

WITH ns AS (
  SELECT '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid AS dns
), ids AS (
  SELECT 
    uuid_generate_v5((SELECT dns FROM ns), 'facility:MAIN_HOSPITAL') AS main_fac,
    uuid_generate_v5((SELECT dns FROM ns), 'facility:DOWNTOWN_CLINIC') AS dt_fac,
    uuid_generate_v5((SELECT dns FROM ns), 'staff:DOCTOR:AHMED_ALMAN') AS st_ahmed,
    uuid_generate_v5((SELECT dns FROM ns), 'staff:DOCTOR:FATIMA_ALZA') AS st_fatima,
    uuid_generate_v5((SELECT dns FROM ns), 'staff:DOCTOR:OMAR_ALK') AS st_omar,
    uuid_generate_v5((SELECT dns FROM ns), 'staff:DOCTOR:LAYLA_ALSH') AS st_layla
)
INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
VALUES
-- Ahmed: Cardiology (primary) at Main Hospital
(uuid_generate_v5((SELECT dns FROM ns), 'ss:AHMED:CARDIO:MAIN'), '11111111-1111-1111-1111-111111111111', (SELECT st_ahmed FROM ids), (SELECT main_fac FROM ids), (SELECT id FROM specialties WHERE code='CARDIO'), TRUE, NOW(), NOW()),
-- Ahmed: Internal Medicine (secondary)
(uuid_generate_v5((SELECT dns FROM ns), 'ss:AHMED:GEN_MED:MAIN'), '11111111-1111-1111-1111-111111111111', (SELECT st_ahmed FROM ids), (SELECT main_fac FROM ids), (SELECT id FROM specialties WHERE code='GEN_MED'), FALSE, NOW(), NOW()),
-- Fatima: Pediatrics (primary) at Main Hospital
(uuid_generate_v5((SELECT dns FROM ns), 'ss:FATIMA:PED:MAIN'), '11111111-1111-1111-1111-111111111111', (SELECT st_fatima FROM ids), (SELECT main_fac FROM ids), (SELECT id FROM specialties WHERE code='PED'), TRUE, NOW(), NOW()),
-- Omar: General Medicine (primary) at Downtown Clinic
(uuid_generate_v5((SELECT dns FROM ns), 'ss:OMAR:GEN_MED:DT'), '11111111-1111-1111-1111-111111111111', (SELECT st_omar FROM ids), (SELECT dt_fac FROM ids), (SELECT id FROM specialties WHERE code='GEN_MED'), TRUE, NOW(), NOW()),
-- Layla: Dermatology (primary) at Main Hospital
(uuid_generate_v5((SELECT dns FROM ns), 'ss:LAYLA:DERM:MAIN'), '11111111-1111-1111-1111-111111111111', (SELECT st_layla FROM ids), (SELECT main_fac FROM ids), (SELECT id FROM specialties WHERE code='DERM'), TRUE, NOW(), NOW());
