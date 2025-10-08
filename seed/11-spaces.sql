-- =====================================================
-- Seed: Spaces
-- Description: Physical rooms (consultation, procedure, diagnostic, operating rooms)
-- Dependencies: 07-departments.sql, 10-clinics.sql
-- =====================================================

-- Note: Spaces can be linked to:
-- 1. Department directly (for Radiology, Lab, Surgery rooms)
-- 2. Clinic (for OPD consultation rooms)
-- 3. Facility only (legacy/unassigned spaces)

-- Get facility ID for reference
DO $$
DECLARE
  v_facility_id UUID;
  v_opd_dept_id UUID;
  v_radiology_dept_id UUID;
  v_lab_dept_id UUID;
  v_surgery_dept_id UUID;
  v_emergency_dept_id UUID;
BEGIN
  -- Get IDs
  SELECT id INTO v_facility_id FROM facilities WHERE tenant_id = '11111111-1111-1111-1111-111111111111' LIMIT 1;
  SELECT id INTO v_opd_dept_id FROM departments WHERE code = 'OPD' AND facility_id = v_facility_id;
  SELECT id INTO v_radiology_dept_id FROM departments WHERE code = 'RAD' AND facility_id = v_facility_id;
  SELECT id INTO v_lab_dept_id FROM departments WHERE code = 'LAB' AND facility_id = v_facility_id;
  SELECT id INTO v_surgery_dept_id FROM departments WHERE code = 'SURG' AND facility_id = v_facility_id;
  SELECT id INTO v_emergency_dept_id FROM departments WHERE code = 'ER' AND facility_id = v_facility_id;

  -- =====================================================
  -- OPD Clinic Consultation Rooms
  -- =====================================================

  -- Cardiology Clinic Rooms (5 rooms)
  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_facility_id,
    v_opd_dept_id,
    c.id,
    'Cardiology Consultation Room ' || seq,
    'CARDIO-CR-' || LPAD(seq::TEXT, 2, '0'),
    'consultation',
    '1',
    '["ECG Machine", "Examination Bed", "BP Monitor", "Stethoscope"]'::jsonb,
    1,
    true,
    NOW(),
    NOW()
  FROM clinics c
  CROSS JOIN generate_series(1, 5) AS seq
  WHERE c.code = 'CARDIO-1';

  -- Pediatrics Clinic Rooms (8 rooms)
  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_facility_id,
    v_opd_dept_id,
    c.id,
    'Pediatrics Consultation Room ' || seq,
    'PEDIA-CR-' || LPAD(seq::TEXT, 2, '0'),
    'consultation',
    '1',
    '["Height Scale", "Weight Scale", "Examination Bed", "Toys", "Thermometer"]'::jsonb,
    1,
    true,
    NOW(),
    NOW()
  FROM clinics c
  CROSS JOIN generate_series(1, 8) AS seq
  WHERE c.code = 'PEDIA-1';

  -- General Medicine Clinic Rooms (10 rooms)
  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_facility_id,
    v_opd_dept_id,
    c.id,
    'General Medicine Room ' || seq,
    'GEN-MED-CR-' || LPAD(seq::TEXT, 2, '0'),
    'consultation',
    '1',
    '["Examination Bed", "BP Monitor", "Stethoscope", "Otoscope"]'::jsonb,
    1,
    true,
    NOW(),
    NOW()
  FROM clinics c
  CROSS JOIN generate_series(1, 10) AS seq
  WHERE c.code = 'GEN-MED-1';

  -- Orthopedics Clinic Rooms (6 rooms)
  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_facility_id,
    v_opd_dept_id,
    c.id,
    'Orthopedics Consultation Room ' || seq,
    'ORTHO-CR-' || LPAD(seq::TEXT, 2, '0'),
    'consultation',
    '1',
    '["Examination Bed", "Goniometer", "X-Ray Viewer", "Plaster Equipment"]'::jsonb,
    1,
    true,
    NOW(),
    NOW()
  FROM clinics c
  CROSS JOIN generate_series(1, 6) AS seq
  WHERE c.code = 'ORTHO-1';

  -- Dermatology Clinic Rooms (4 rooms)
  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_facility_id,
    v_opd_dept_id,
    c.id,
    'Dermatology Consultation Room ' || seq,
    'DERM-CR-' || LPAD(seq::TEXT, 2, '0'),
    'consultation',
    '1',
    '["Examination Bed", "Dermatoscope", "Wood Lamp", "Cryotherapy Equipment"]'::jsonb,
    1,
    true,
    NOW(),
    NOW()
  FROM clinics c
  CROSS JOIN generate_series(1, 4) AS seq
  WHERE c.code = 'DERM-1';

  -- Ophthalmology Clinic Rooms (5 rooms)
  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_facility_id,
    v_opd_dept_id,
    c.id,
    'Ophthalmology Consultation Room ' || seq,
    'OPHTHAL-CR-' || LPAD(seq::TEXT, 2, '0'),
    'consultation',
    '1',
    '["Slit Lamp", "Phoropter", "Autorefractor", "Tonometer", "Ophthalmoscope"]'::jsonb,
    1,
    true,
    NOW(),
    NOW()
  FROM clinics c
  CROSS JOIN generate_series(1, 5) AS seq
  WHERE c.code = 'OPHTHAL-1';

  -- ENT Clinic Rooms (4 rooms)
  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_facility_id,
    v_opd_dept_id,
    c.id,
    'ENT Consultation Room ' || seq,
    'ENT-CR-' || LPAD(seq::TEXT, 2, '0'),
    'consultation',
    '1',
    '["Otoscope", "Laryngoscope", "Audiometer", "Examination Chair"]'::jsonb,
    1,
    true,
    NOW(),
    NOW()
  FROM clinics c
  CROSS JOIN generate_series(1, 4) AS seq
  WHERE c.code = 'ENT-1';

  -- Gynecology Clinic Rooms (6 rooms)
  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_facility_id,
    v_opd_dept_id,
    c.id,
    'Gynecology Consultation Room ' || seq,
    'GYNECO-CR-' || LPAD(seq::TEXT, 2, '0'),
    'consultation',
    '2',
    '["Examination Table", "Ultrasound Machine", "Colposcope", "Speculum Set"]'::jsonb,
    1,
    true,
    NOW(),
    NOW()
  FROM clinics c
  CROSS JOIN generate_series(1, 6) AS seq
  WHERE c.code = 'GYNECO-1';

  -- Neurology Clinic Rooms (4 rooms)
  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_facility_id,
    v_opd_dept_id,
    c.id,
    'Neurology Consultation Room ' || seq,
    'NEURO-CR-' || LPAD(seq::TEXT, 2, '0'),
    'consultation',
    '2',
    '["Examination Bed", "Reflex Hammer", "Tuning Fork", "Ophthalmoscope"]'::jsonb,
    1,
    true,
    NOW(),
    NOW()
  FROM clinics c
  CROSS JOIN generate_series(1, 4) AS seq
  WHERE c.code = 'NEURO-1';

  -- Psychiatry Clinic Rooms (3 rooms)
  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_facility_id,
    v_opd_dept_id,
    c.id,
    'Psychiatry Consultation Room ' || seq,
    'PSYCH-CR-' || LPAD(seq::TEXT, 2, '0'),
    'consultation',
    '2',
    '["Comfortable Seating", "Privacy Curtains", "Sound Insulation"]'::jsonb,
    1,
    true,
    NOW(),
    NOW()
  FROM clinics c
  CROSS JOIN generate_series(1, 3) AS seq
  WHERE c.code = 'PSYCH-1';

  -- =====================================================
  -- Radiology Department Rooms
  -- =====================================================

  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), v_facility_id, v_radiology_dept_id, NULL, 'X-Ray Room 1', 'XRAY-01', 'diagnostic', '2', '["X-Ray Machine", "Lead Aprons", "Digital Imaging System"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_radiology_dept_id, NULL, 'X-Ray Room 2', 'XRAY-02', 'diagnostic', '2', '["X-Ray Machine", "Lead Aprons", "Digital Imaging System"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_radiology_dept_id, NULL, 'CT Scan Room', 'CT-01', 'diagnostic', '2', '["CT Scanner", "Contrast Injector", "Patient Monitor"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_radiology_dept_id, NULL, 'MRI Room', 'MRI-01', 'diagnostic', '2', '["MRI Scanner", "Patient Monitor", "Headphones"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_radiology_dept_id, NULL, 'Ultrasound Room 1', 'US-01', 'diagnostic', '2', '["Ultrasound Machine", "Examination Bed", "Gel Warmer"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_radiology_dept_id, NULL, 'Ultrasound Room 2', 'US-02', 'diagnostic', '2', '["Ultrasound Machine", "Examination Bed", "Gel Warmer"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_radiology_dept_id, NULL, 'Mammography Room', 'MAMMO-01', 'diagnostic', '2', '["Mammography Machine", "Compression Plates", "Digital Imaging"]'::jsonb, 1, true, NOW(), NOW());

  -- =====================================================
  -- Laboratory Department Rooms
  -- =====================================================

  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), v_facility_id, v_lab_dept_id, NULL, 'Blood Collection Room 1', 'LAB-BLOOD-01', 'procedure', '1', '["Phlebotomy Chair", "Tourniquet", "Collection Tubes", "Centrifuge"]'::jsonb, 2, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_lab_dept_id, NULL, 'Blood Collection Room 2', 'LAB-BLOOD-02', 'procedure', '1', '["Phlebotomy Chair", "Tourniquet", "Collection Tubes", "Centrifuge"]'::jsonb, 2, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_lab_dept_id, NULL, 'Hematology Lab', 'LAB-HEMA-01', 'diagnostic', '1', '["Automated Hematology Analyzer", "Microscopes", "Cell Counter"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_lab_dept_id, NULL, 'Chemistry Lab', 'LAB-CHEM-01', 'diagnostic', '1', '["Chemistry Analyzer", "Spectrophotometer", "Centrifuge"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_lab_dept_id, NULL, 'Microbiology Lab', 'LAB-MICRO-01', 'diagnostic', '1', '["Incubators", "Microscopes", "Culture Media", "Biosafety Cabinet"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_lab_dept_id, NULL, 'Pathology Lab', 'LAB-PATH-01', 'diagnostic', '1', '["Microscopes", "Tissue Processor", "Microtome", "Staining Station"]'::jsonb, 1, true, NOW(), NOW());

  -- =====================================================
  -- Surgery Department - Operating Rooms
  -- =====================================================

  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), v_facility_id, v_surgery_dept_id, NULL, 'Operating Room 1', 'OR-01', 'operating_room', '4', '["Operating Table", "Anesthesia Machine", "Surgical Lights", "Monitoring Equipment", "Defibrillator"]'::jsonb, 3, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_surgery_dept_id, NULL, 'Operating Room 2', 'OR-02', 'operating_room', '4', '["Operating Table", "Anesthesia Machine", "Surgical Lights", "Monitoring Equipment", "Defibrillator"]'::jsonb, 3, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_surgery_dept_id, NULL, 'Operating Room 3', 'OR-03', 'operating_room', '4', '["Operating Table", "Anesthesia Machine", "Surgical Lights", "Monitoring Equipment", "Defibrillator"]'::jsonb, 3, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_surgery_dept_id, NULL, 'Minor Procedure Room 1', 'MPR-01', 'procedure', '4', '["Procedure Table", "Surgical Lights", "Minor Surgery Kit", "Suction Unit"]'::jsonb, 2, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_surgery_dept_id, NULL, 'Minor Procedure Room 2', 'MPR-02', 'procedure', '4', '["Procedure Table", "Surgical Lights", "Minor Surgery Kit", "Suction Unit"]'::jsonb, 2, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_surgery_dept_id, NULL, 'Pre-Op Room', 'PREOP-01', 'consultation', '4', '["Recliner Chairs", "IV Stands", "Monitoring Equipment", "Oxygen Supply"]'::jsonb, 4, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_surgery_dept_id, NULL, 'Recovery Room', 'RECOVERY-01', 'consultation', '4', '["Recovery Beds", "Monitoring Equipment", "Oxygen Supply", "Emergency Cart"]'::jsonb, 6, true, NOW(), NOW());

  -- =====================================================
  -- Emergency Department Rooms
  -- =====================================================

  INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
  VALUES
    (uuid_generate_v4(), v_facility_id, v_emergency_dept_id, NULL, 'Emergency Bay 1', 'ER-BAY-01', 'consultation', 'G', '["Trauma Bed", "Defibrillator", "Ventilator", "Monitoring Equipment", "Crash Cart"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_emergency_dept_id, NULL, 'Emergency Bay 2', 'ER-BAY-02', 'consultation', 'G', '["Trauma Bed", "Defibrillator", "Ventilator", "Monitoring Equipment", "Crash Cart"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_emergency_dept_id, NULL, 'Emergency Bay 3', 'ER-BAY-03', 'consultation', 'G', '["Trauma Bed", "Defibrillator", "Ventilator", "Monitoring Equipment", "Crash Cart"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_emergency_dept_id, NULL, 'Emergency Bay 4', 'ER-BAY-04', 'consultation', 'G', '["Trauma Bed", "Defibrillator", "Ventilator", "Monitoring Equipment", "Crash Cart"]'::jsonb, 1, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_emergency_dept_id, NULL, 'Resuscitation Room', 'ER-RESUS-01', 'procedure', 'G', '["Trauma Bed", "Defibrillator", "Ventilator", "Advanced Monitoring", "Crash Cart", "Intubation Equipment"]'::jsonb, 2, true, NOW(), NOW()),
    (uuid_generate_v4(), v_facility_id, v_emergency_dept_id, NULL, 'Triage Room', 'ER-TRIAGE-01', 'consultation', 'G', '["Examination Bed", "BP Monitor", "Thermometer", "Pulse Oximeter"]'::jsonb, 2, true, NOW(), NOW());

  -- =====================================================
  -- Additional OPD Clinic Rooms (remaining clinics)
  -- =====================================================

  -- Gynecology (already has 6 rooms defined above)
  -- Neurology (already has 4 rooms defined above)
  -- Psychiatry (already has 3 rooms defined above)

END $$;

-- =====================================================
-- Verification
-- =====================================================

-- Verify spaces created
SELECT 
  s.name,
  s.space_number,
  s.space_type,
  s.floor_number,
  c.name as clinic_name,
  d.name as department_name
FROM spaces s
LEFT JOIN clinics c ON c.id = s.clinic_id
JOIN departments d ON d.id = s.department_id
JOIN facilities f ON f.id = s.facility_id
WHERE f.tenant_id = '11111111-1111-1111-1111-111111111111'
ORDER BY d.name, s.space_number
LIMIT 30;

-- Count by department
SELECT 
  d.name as department_name,
  d.code,
  COUNT(s.id) as space_count,
  COUNT(CASE WHEN s.clinic_id IS NOT NULL THEN 1 END) as clinic_spaces,
  COUNT(CASE WHEN s.clinic_id IS NULL THEN 1 END) as direct_spaces
FROM departments d
LEFT JOIN spaces s ON s.department_id = d.id
GROUP BY d.id, d.name, d.code
ORDER BY d.code;

-- Count by clinic
SELECT 
  c.name as clinic_name,
  c.code,
  c.total_rooms,
  COUNT(s.id) as actual_spaces
FROM clinics c
LEFT JOIN spaces s ON s.clinic_id = c.id
GROUP BY c.id, c.name, c.code, c.total_rooms
ORDER BY c.code;

-- Count by space type
SELECT 
  space_type,
  COUNT(*) as count
FROM spaces s
JOIN facilities f ON f.id = s.facility_id
WHERE f.tenant_id = '11111111-1111-1111-1111-111111111111'
GROUP BY space_type
ORDER BY count DESC;

-- Expected output:
-- OPD Consultation Rooms: 55 (linked to clinics)
-- Radiology Rooms: 7
-- Laboratory Rooms: 6
-- Operating Rooms: 7 (3 OR + 2 MPR + Pre-Op + Recovery)
-- Emergency Bays: 6
-- Total: ~81 spaces
