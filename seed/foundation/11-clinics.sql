-- Seed: Clinics (12 total) using UUIDv5

WITH ns AS (
  SELECT '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid AS dns
), deps AS (
  SELECT 
    uuid_generate_v5((SELECT dns FROM ns), 'dept:MAIN:OPD') AS main_opd,
    uuid_generate_v5((SELECT dns FROM ns), 'dept:DT:OPD') AS dt_opd
)
INSERT INTO clinics (id, department_id, name, code, specialty, floor_number, total_rooms, operating_hours, status, created_at, updated_at)
VALUES
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:CARDIO-1'), (SELECT main_opd FROM deps), 'Cardiology Clinic', 'CARDIO-1', 'CARDIO', '1', 5, NULL, 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:PEDIA-1'), (SELECT main_opd FROM deps), 'Pediatrics Clinic', 'PEDIA-1', 'PED', '1', 8, NULL, 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:GEN-MED-1'), (SELECT main_opd FROM deps), 'General Medicine Clinic', 'GEN-MED-1', 'GEN_MED', '1', 10, NULL, 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:ORTHO-1'), (SELECT main_opd FROM deps), 'Orthopedics Clinic', 'ORTHO-1', 'ORTHO', '1', 6, NULL, 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:DERM-1'), (SELECT main_opd FROM deps), 'Dermatology Clinic', 'DERM-1', 'DERM', '1', 4, NULL, 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:OPHTHAL-1'), (SELECT main_opd FROM deps), 'Ophthalmology Clinic', 'OPHTHAL-1', 'OPHTHAL', '1', 5, NULL, 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:ENT-1'), (SELECT main_opd FROM deps), 'ENT Clinic', 'ENT-1', 'ENT', '1', 4, NULL, 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:GYNECO-1'), (SELECT main_opd FROM deps), 'Gynecology Clinic', 'GYNECO-1', 'OBGYN', '2', 6, NULL, 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:NEURO-1'), (SELECT main_opd FROM deps), 'Neurology Clinic', 'NEURO-1', 'NEURO', '2', 4, NULL, 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:PSYCH-1'), (SELECT main_opd FROM deps), 'Psychiatry Clinic', 'PSYCH-1', 'PSYCH', '2', 3, NULL, 'active', NOW(), NOW()),
-- Downtown Clinic (use unique codes)
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:DT:GEN-MED-1'), (SELECT dt_opd FROM deps), 'General Medicine Clinic', 'DT-GEN-MED-1', 'GEN_MED', 'G', 6, NULL, 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'clinic:DT:FAM-MED-1'), (SELECT dt_opd FROM deps), 'Family Medicine Clinic', 'DT-FAM-MED-1', 'FAM_MED', 'G', 4, NULL, 'active', NOW(), NOW());
