-- =====================================================
-- Seed: Multi-Facility Staff Specialties
-- Description: Demonstrate staff working at multiple facilities
-- Dependencies: 24-additional-facilities.sql, 21-staff.sql, 23-staff-specialties.sql
-- =====================================================

-- Note: This demonstrates real-world scenarios:
-- 1. Locum doctors working at multiple facilities
-- 2. Different specialties at different facilities
-- 3. Facility-specific credentialing

DO $$
DECLARE
  v_tenant_id UUID := '11111111-1111-1111-1111-111111111111';
  
  -- Facility IDs
  v_main_facility UUID;
  v_downtown_facility UUID;
  v_alain_hospital UUID;
  v_marina_diagnostic UUID;
  
  -- Specialty IDs
  v_gen_med UUID;
  v_cardio UUID;
  v_ortho UUID;
  v_rad UUID;
  v_ped UUID;
  v_derm UUID;
BEGIN
  -- Get facility IDs
  SELECT id INTO v_main_facility FROM facilities WHERE code IS NULL AND name LIKE '%Main%';
  SELECT id INTO v_downtown_facility FROM facilities WHERE code = 'ARMC-DT';
  SELECT id INTO v_alain_hospital FROM facilities WHERE code = 'ARSH-AA';
  SELECT id INTO v_marina_diagnostic FROM facilities WHERE code = 'ARDC-MAR';
  
  -- Get specialty IDs
  SELECT id INTO v_gen_med FROM specialties WHERE code = 'GEN_MED';
  SELECT id INTO v_cardio FROM specialties WHERE code = 'CARDIO';
  SELECT id INTO v_ortho FROM specialties WHERE code = 'ORTHO';
  SELECT id INTO v_rad FROM specialties WHERE code = 'RAD';
  SELECT id INTO v_ped FROM specialties WHERE code = 'PED';
  SELECT id INTO v_derm FROM specialties WHERE code = 'DERM';
  
  RAISE NOTICE 'Facilities found: Main=%, Downtown=%, Al Ain=%, Marina=%', 
    v_main_facility, v_downtown_facility, v_alain_hospital, v_marina_diagnostic;
  
  -- =====================================================
  -- Dr. Ahmed (Cardiologist) - Works at 3 facilities
  -- =====================================================
  
  -- Downtown Clinic: General Medicine (primary)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_downtown_facility,
    v_gen_med,
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC001';
  
  -- Al Ain Hospital: Cardiology (primary) + General Med (secondary)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_alain_hospital,
    v_cardio,
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC001';
  
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_alain_hospital,
    v_gen_med,
    FALSE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC001';
  
  -- =====================================================
  -- Dr. Sarah Johnson (Orthopedist) - Works at 2 facilities
  -- =====================================================
  
  -- Downtown Clinic: Orthopedics (primary)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_downtown_facility,
    v_ortho,
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC004';
  
  -- Al Ain Hospital: Orthopedics (primary)
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_alain_hospital,
    v_ortho,
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC004';
  
  -- =====================================================
  -- Dr. Fatima (Pediatrician) - Works at Downtown
  -- =====================================================
  
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_downtown_facility,
    v_ped,
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC002';
  
  -- =====================================================
  -- Mohammed Hassan (Radiology Tech) - Works at Marina Diagnostic
  -- =====================================================
  
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_marina_diagnostic,
    v_rad,
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'TECH002';
  
  -- =====================================================
  -- Dr. Layla (Dermatologist) - Works at Downtown
  -- =====================================================
  
  INSERT INTO staff_specialties (id, tenant_id, staff_id, facility_id, specialty_id, primary_flag, created_at, updated_at)
  SELECT
    uuid_generate_v4(),
    v_tenant_id,
    st.id,
    v_downtown_facility,
    v_derm,
    TRUE,
    NOW(),
    NOW()
  FROM staff st WHERE st.employee_id = 'DOC005';
  
END $$;

-- =====================================================
-- Verification
-- =====================================================

-- Count total staff specialties
SELECT COUNT(*) as total_staff_specialties FROM staff_specialties;

-- Staff working at multiple facilities
SELECT 
  st.employee_id,
  st.first_name || ' ' || st.last_name as name,
  COUNT(DISTINCT ss.facility_id) as facility_count,
  string_agg(DISTINCT f.name, ' | ' ORDER BY f.name) as facilities
FROM staff st
JOIN staff_specialties ss ON ss.staff_id = st.id
JOIN facilities f ON f.id = ss.facility_id
GROUP BY st.id, st.employee_id, st.first_name, st.last_name
HAVING COUNT(DISTINCT ss.facility_id) > 1
ORDER BY facility_count DESC;

-- Specialties by facility
SELECT 
  f.code as facility_code,
  f.name as facility_name,
  sp.code as specialty_code,
  sp.name as specialty_name,
  COUNT(DISTINCT ss.staff_id) FILTER (WHERE ss.primary_flag) as primary_staff,
  COUNT(DISTINCT ss.staff_id) as total_staff
FROM facilities f
LEFT JOIN staff_specialties ss ON ss.facility_id = f.id
LEFT JOIN specialties sp ON sp.id = ss.specialty_id
WHERE ss.id IS NOT NULL
GROUP BY f.id, f.code, f.name, sp.id, sp.code, sp.name
ORDER BY f.name, total_staff DESC;

-- Dr. Ahmed's multi-facility presence
SELECT 
  st.employee_id,
  f.name as facility,
  sp.code,
  sp.name as specialty,
  ss.primary_flag
FROM staff st
JOIN staff_specialties ss ON ss.staff_id = st.id
JOIN facilities f ON f.id = ss.facility_id
JOIN specialties sp ON sp.id = ss.specialty_id
WHERE st.employee_id = 'DOC001'
ORDER BY f.name, ss.primary_flag DESC;

-- Facilities offering cardiology
SELECT 
  f.name as facility_name,
  f.city,
  COUNT(DISTINCT ss.staff_id) as cardiologist_count,
  string_agg(DISTINCT st.first_name || ' ' || st.last_name, ', ') as cardiologists
FROM facilities f
JOIN staff_specialties ss ON ss.facility_id = f.id
JOIN specialties sp ON sp.id = ss.specialty_id
JOIN staff st ON st.id = ss.staff_id
WHERE sp.code = 'CARDIO'
  AND ss.primary_flag = TRUE
GROUP BY f.id, f.name, f.city
ORDER BY cardiologist_count DESC;

-- Expected results:
-- Total staff_specialties: ~20 (13 original + 7 new multi-facility)
-- Multi-facility staff: Dr. Ahmed (3 facilities), Dr. Sarah (2), etc.
-- Cardiology available at: Main + Al Ain
-- Downtown offers: General Med, Ortho, Peds, Derm
