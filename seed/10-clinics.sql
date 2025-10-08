-- =====================================================
-- Seed: Clinics (OPD)
-- Description: OPD-specific consultation room groupings by specialty
-- Dependencies: 07-departments.sql
-- =====================================================

-- Note: Clinics can only be created in OPD departments
-- We'll create various specialty clinics for the OPD departments

-- =====================================================
-- Main Hospital - OPD Clinics
-- =====================================================

INSERT INTO clinics (id, department_id, name, code, specialty, floor_number, total_rooms, operating_hours, status, created_at, updated_at)
VALUES
  -- Cardiology Clinic
  ('c0000001-0001-0001-0001-000000000001',
   'd0000001-0001-0001-0001-000000000001', -- Main Hospital OPD
   'Cardiology Clinic', 'CARDIO-1', 'cardiology', '1', 5,
   '{"monday": {"open": "08:00", "close": "17:00"}, "tuesday": {"open": "08:00", "close": "17:00"}, "wednesday": {"open": "08:00", "close": "17:00"}, "thursday": {"open": "08:00", "close": "17:00"}, "saturday": {"open": "08:00", "close": "14:00"}}',
   'active', NOW(), NOW()),
   
  -- Pediatrics Clinic
  ('c0000001-0001-0001-0001-000000000002',
   'd0000001-0001-0001-0001-000000000001',
   'Pediatrics Clinic', 'PEDIA-1', 'pediatrics', '1', 8,
   '{"monday": {"open": "08:00", "close": "20:00"}, "tuesday": {"open": "08:00", "close": "20:00"}, "wednesday": {"open": "08:00", "close": "20:00"}, "thursday": {"open": "08:00", "close": "20:00"}, "friday": {"open": "08:00", "close": "20:00"}, "saturday": {"open": "08:00", "close": "17:00"}}',
   'active', NOW(), NOW()),
   
  -- General Medicine Clinic
  ('c0000001-0001-0001-0001-000000000003',
   'd0000001-0001-0001-0001-000000000001',
   'General Medicine Clinic', 'GEN-MED-1', 'general_medicine', '1', 10,
   '{"monday": {"open": "08:00", "close": "20:00"}, "tuesday": {"open": "08:00", "close": "20:00"}, "wednesday": {"open": "08:00", "close": "20:00"}, "thursday": {"open": "08:00", "close": "20:00"}, "friday": {"open": "08:00", "close": "20:00"}, "saturday": {"open": "08:00", "close": "14:00"}}',
   'active', NOW(), NOW()),
   
  -- Orthopedics Clinic
  ('c0000001-0001-0001-0001-000000000004',
   'd0000001-0001-0001-0001-000000000001',
   'Orthopedics Clinic', 'ORTHO-1', 'orthopedics', '1', 6,
   '{"monday": {"open": "08:00", "close": "17:00"}, "tuesday": {"open": "08:00", "close": "17:00"}, "wednesday": {"open": "08:00", "close": "17:00"}, "thursday": {"open": "08:00", "close": "17:00"}, "saturday": {"open": "08:00", "close": "14:00"}}',
   'active', NOW(), NOW()),
   
  -- Dermatology Clinic
  ('c0000001-0001-0001-0001-000000000005',
   'd0000001-0001-0001-0001-000000000001',
   'Dermatology Clinic', 'DERM-1', 'dermatology', '1', 4,
   '{"monday": {"open": "09:00", "close": "17:00"}, "tuesday": {"open": "09:00", "close": "17:00"}, "wednesday": {"open": "09:00", "close": "17:00"}, "thursday": {"open": "09:00", "close": "17:00"}}',
   'active', NOW(), NOW()),
   
  -- Ophthalmology Clinic
  ('c0000001-0001-0001-0001-000000000006',
   'd0000001-0001-0001-0001-000000000001',
   'Ophthalmology Clinic', 'OPHTHAL-1', 'ophthalmology', '1', 5,
   '{"monday": {"open": "08:00", "close": "17:00"}, "tuesday": {"open": "08:00", "close": "17:00"}, "wednesday": {"open": "08:00", "close": "17:00"}, "thursday": {"open": "08:00", "close": "17:00"}, "saturday": {"open": "08:00", "close": "14:00"}}',
   'active', NOW(), NOW()),
   
  -- ENT Clinic
  ('c0000001-0001-0001-0001-000000000007',
   'd0000001-0001-0001-0001-000000000001',
   'ENT Clinic', 'ENT-1', 'ent', '1', 4,
   '{"monday": {"open": "09:00", "close": "17:00"}, "tuesday": {"open": "09:00", "close": "17:00"}, "wednesday": {"open": "09:00", "close": "17:00"}, "saturday": {"open": "09:00", "close": "13:00"}}',
   'active', NOW(), NOW()),
   
  -- Gynecology Clinic
  ('c0000001-0001-0001-0001-000000000008',
   'd0000001-0001-0001-0001-000000000001',
   'Gynecology Clinic', 'GYNECO-1', 'gynecology', '2', 6,
   '{"monday": {"open": "08:00", "close": "17:00"}, "tuesday": {"open": "08:00", "close": "17:00"}, "wednesday": {"open": "08:00", "close": "17:00"}, "thursday": {"open": "08:00", "close": "17:00"}, "saturday": {"open": "08:00", "close": "14:00"}}',
   'active', NOW(), NOW()),
   
  -- Neurology Clinic
  ('c0000001-0001-0001-0001-000000000009',
   'd0000001-0001-0001-0001-000000000001',
   'Neurology Clinic', 'NEURO-1', 'neurology', '2', 4,
   '{"monday": {"open": "09:00", "close": "17:00"}, "tuesday": {"open": "09:00", "close": "17:00"}, "wednesday": {"open": "09:00", "close": "17:00"}, "thursday": {"open": "09:00", "close": "17:00"}}',
   'active', NOW(), NOW()),
   
  -- Psychiatry Clinic
  ('c0000001-0001-0001-0001-000000000010',
   'd0000001-0001-0001-0001-000000000001',
   'Psychiatry Clinic', 'PSYCH-1', 'psychiatry', '2', 3,
   '{"monday": {"open": "09:00", "close": "16:00"}, "tuesday": {"open": "09:00", "close": "16:00"}, "wednesday": {"open": "09:00", "close": "16:00"}, "thursday": {"open": "09:00", "close": "16:00"}}',
   'active', NOW(), NOW());


-- =====================================================
-- Verification
-- =====================================================

-- Verify clinics created
SELECT 
  c.name,
  c.code,
  c.specialty,
  c.floor_number,
  c.total_rooms,
  d.name as department_name,
  f.name as facility_name
FROM clinics c
JOIN departments d ON d.id = c.department_id
JOIN facilities f ON f.id = d.facility_id
ORDER BY f.name, c.specialty;

-- Expected output:
-- Main Hospital: 10 clinics (Cardiology, Pediatrics, General Medicine, Orthopedics, Dermatology, Ophthalmology, ENT, Gynecology, Neurology, Psychiatry)
-- Downtown Clinic: 2 clinics (General Medicine, Family Medicine)

-- Count by specialty
SELECT 
  c.specialty,
  COUNT(*) as clinic_count,
  SUM(c.total_rooms) as total_rooms
FROM clinics c
GROUP BY c.specialty
ORDER BY clinic_count DESC, c.specialty;

-- Clinics by facility
SELECT 
  f.name as facility_name,
  COUNT(c.id) as clinic_count,
  SUM(c.total_rooms) as total_consultation_rooms
FROM facilities f
JOIN departments d ON d.facility_id = f.id
JOIN clinics c ON c.department_id = d.id
GROUP BY f.id, f.name
ORDER BY f.name;
