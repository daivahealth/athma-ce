-- =====================================================
-- Seed: Staff Specialties
-- Description: Assign specialties to staff at facilities
-- Dependencies: 04-facilities.sql, 21-staff.sql, specialties migration
-- =====================================================

-- Note: This demonstrates the facility-specialty relationship:
-- - Staff can have multiple specialties at one facility
-- - Staff can work at multiple facilities with different specialties
-- - Each staff has ONE primary specialty per facility

-- Get facility ID for reference
DO $$
DECLARE
  v_facility_id UUID;
  v_tenant_id UUID := uuid_from_text('11111111-1111-1111-1111-111111111111');
  
  -- Specialty IDs
  v_gen_med UUID;
  v_cardio UUID;
  v_endo UUID;
  v_ped UUID;
  v_neonat UUID;
  v_ortho UUID;
  v_derm UUID;
  v_icu UUID;
  v_emerg UUID;
  v_rad UUID;
  v_path UUID;
BEGIN
  -- Get facility ID
  SELECT id INTO v_facility_id 
  FROM facilities 
  WHERE tenant_id = v_tenant_id 
  LIMIT 1;
  
  IF v_facility_id IS NULL THEN
    RAISE EXCEPTION 'No facility found for tenant';
  END IF;
  
  -- Get specialty IDs
  SELECT id INTO v_gen_med FROM specialties WHERE code = 'GEN_MED';
  SELECT id INTO v_cardio FROM specialties WHERE code = 'CARDIO';
  SELECT id INTO v_endo FROM specialties WHERE code = 'ENDO';
  SELECT id INTO v_ped FROM specialties WHERE code = 'PED';
  SELECT id INTO v_neonat FROM specialties WHERE code = 'NEONAT';
  SELECT id INTO v_ortho FROM specialties WHERE code = 'ORTHO';
  SELECT id INTO v_derm FROM specialties WHERE code = 'DERM';
  SELECT id INTO v_rad FROM specialties WHERE code = 'RAD';
  SELECT id INTO v_path FROM specialties WHERE code = 'PATH';
  
  -- =====================================================
  -- Doctors - Assign Primary and Secondary Specialties
  -- =====================================================
  
  -- Dr. Ahmed Al-Mansoori (Cardiologist)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    id,
    v_facility_id,
    v_cardio,
    TRUE,
    NOW(),
    NOW()
  FROM staff WHERE employee_id = 'DOC001';
  
  -- Secondary: Internal Medicine
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    id,
    v_facility_id,
    v_gen_med,
    FALSE,
    NOW(),
    NOW()
  FROM staff WHERE employee_id = 'DOC001';
  
  -- Dr. Fatima Al-Zaabi (Pediatrician)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    id,
    v_facility_id,
    v_ped,
    TRUE,
    NOW(),
    NOW()
  FROM staff WHERE employee_id = 'DOC002';
  
  -- Secondary: Neonatology
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    id,
    v_facility_id,
    v_neonat,
    FALSE,
    NOW(),
    NOW()
  FROM staff WHERE employee_id = 'DOC002';
  
  -- Dr. Omar Al-Ketbi (General Practitioner)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    id,
    v_facility_id,
    v_gen_med,
    TRUE,
    NOW(),
    NOW()
  FROM staff WHERE employee_id = 'DOC003';
  
  -- Dr. Sarah Johnson (Orthopedic Surgeon)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    id,
    v_facility_id,
    v_ortho,
    TRUE,
    NOW(),
    NOW()
  FROM staff WHERE employee_id = 'DOC004';
  
  -- Dr. Layla Al-Shamsi (Dermatologist)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    id,
    v_facility_id,
    v_derm,
    TRUE,
    NOW(),
    NOW()
  FROM staff WHERE employee_id = 'DOC005';
  
  -- =====================================================
  -- Nurses - ICU, Pediatrics, Emergency specializations
  -- =====================================================
  
  -- Maria Santos (ICU Nurse)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_facility_id,
    (SELECT id FROM specialties WHERE code = 'EMERG'),  -- Critical care falls under emergency
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'NRS001';
  
  -- Priya Sharma (Pediatric Nurse)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_facility_id,
    v_ped,
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'NRS002';
  
  -- John Williams (Emergency Nurse)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_facility_id,
    (SELECT id FROM specialties WHERE code = 'EMERG'),
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'NRS003';
  
  -- Aisha Al-Mazrouei (General Ward Nurse)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_facility_id,
    v_gen_med,
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'NRS004';
  
  -- =====================================================
  -- Technicians - Radiology, Lab, Pharmacy
  -- =====================================================
  
  -- Ravi Kumar (Lab Technician)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_facility_id,
    v_path,
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'TECH001';
  
  -- Mohammed Hassan (Radiology Technician)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_facility_id,
    v_rad,
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'TECH002';
  
  -- Nadia Ibrahim (Pharmacy Technician)
  -- Pharmacy doesn't map to a medical specialty, skip for now
  
END $$;

-- =====================================================
-- Verification
-- =====================================================

-- Count by specialty
SELECT 
  sp.code,
  sp.name,
  COUNT(ss.staff_id) as total_staff,
  COUNT(ss.staff_id) FILTER (WHERE ss.primary_flag) as primary_staff
FROM specialties sp
LEFT JOIN staff_specialties ss ON ss.specialty_id = sp.id
GROUP BY sp.id, sp.code, sp.name
HAVING COUNT(ss.staff_id) > 0
ORDER BY total_staff DESC, sp.code;

-- Facility specialty summary
SELECT 
  f.name as facility_name,
  sp.code,
  sp.name as specialty_name,
  COUNT(DISTINCT ss.staff_id) as staff_count,
  string_agg(DISTINCT st.first_name || ' ' || st.last_name, ', ' ORDER BY st.last_name) as staff_names
FROM facilities f
LEFT JOIN staff_specialties ss ON ss.facility_id = f.id
LEFT JOIN specialties sp ON sp.id = ss.specialty_id
LEFT JOIN staff st ON st.id = ss.staff_id
WHERE ss.primary_flag = TRUE
GROUP BY f.id, f.name, sp.id, sp.code, sp.name
HAVING COUNT(DISTINCT ss.staff_id) > 0
ORDER BY f.name, staff_count DESC;

-- Staff with specialties
SELECT 
  st.employee_id,
  st.first_name || ' ' || st.last_name as staff_name,
  st.staff_type,
  f.name as facility_name,
  sp.code as specialty_code,
  sp.name as specialty_name,
  ss.primary_flag
FROM staff_specialties ss
JOIN staff st ON st.id = ss.staff_id
JOIN facilities f ON f.id = ss.facility_id
JOIN specialties sp ON sp.id = ss.specialty_id
ORDER BY st.staff_type, st.employee_id, ss.primary_flag DESC;

-- Primary specialties per staff
SELECT 
  st.employee_id,
  st.first_name || ' ' || st.last_name as name,
  f.name as facility,
  sp.code,
  sp.name
FROM staff_specialties ss
JOIN staff st ON st.id = ss.staff_id
JOIN facilities f ON f.id = ss.facility_id
JOIN specialties sp ON sp.id = ss.specialty_id
WHERE ss.primary_flag = TRUE
ORDER BY st.staff_type, st.employee_id;

-- Expected counts:
-- Doctors: 5 (each with primary, some with secondary)
-- Nurses: 4 (each with primary)
-- Technicians: 2 (Lab, Radiology)
-- Total staff_specialties: ~11-13 records
