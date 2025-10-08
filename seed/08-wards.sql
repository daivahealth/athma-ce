-- =====================================================
-- Seed: Wards (IPD)
-- Description: IPD-specific bed groupings for inpatient care
-- Dependencies: 07-departments.sql
-- =====================================================

-- Note: Wards can only be created in IPD departments
-- We'll create various ward types for the Main Hospital IPD department

-- =====================================================
-- ICU Wards
-- =====================================================

INSERT INTO wards (id, department_id, name, code, ward_type, floor_number, total_beds, available_beds, nursing_station, status, created_at, updated_at)
VALUES
  -- ICU Ward 1
  ('10000001-0001-0001-0001-000000000001',
   'd0000001-0002-0001-0001-000000000001', -- IPD Department
   'ICU Ward 1', 'ICU-1', 'icu', '3', 0, 0, 'NS-ICU-1', 'active', NOW(), NOW()),
   
  -- ICU Ward 2
  ('10000001-0001-0001-0001-000000000002',
   'd0000001-0002-0001-0001-000000000001',
   'ICU Ward 2', 'ICU-2', 'icu', '3', 0, 0, 'NS-ICU-2', 'active', NOW(), NOW());

-- =====================================================
-- NICU Ward
-- =====================================================

INSERT INTO wards (id, department_id, name, code, ward_type, floor_number, total_beds, available_beds, nursing_station, status, created_at, updated_at)
VALUES
  ('10000001-0002-0001-0001-000000000001',
   'd0000001-0002-0001-0001-000000000001',
   'Neonatal ICU', 'NICU-1', 'nicu', '3', 0, 0, 'NS-NICU-1', 'active', NOW(), NOW());

-- =====================================================
-- PICU Ward
-- =====================================================

INSERT INTO wards (id, department_id, name, code, ward_type, floor_number, total_beds, available_beds, nursing_station, status, created_at, updated_at)
VALUES
  ('10000001-0003-0001-0001-000000000001',
   'd0000001-0002-0001-0001-000000000001',
   'Pediatric ICU', 'PICU-1', 'picu', '3', 0, 0, 'NS-PICU-1', 'active', NOW(), NOW());

-- =====================================================
-- General Wards
-- =====================================================

INSERT INTO wards (id, department_id, name, code, ward_type, floor_number, total_beds, available_beds, nursing_station, status, created_at, updated_at)
VALUES
  -- General Ward A
  ('10000001-0004-0001-0001-000000000001',
   'd0000001-0002-0001-0001-000000000001',
   'General Ward A', 'GEN-A', 'general', '4', 0, 0, 'NS-GEN-A', 'active', NOW(), NOW()),
   
  -- General Ward B
  ('10000001-0004-0001-0001-000000000002',
   'd0000001-0002-0001-0001-000000000001',
   'General Ward B', 'GEN-B', 'general', '4', 0, 0, 'NS-GEN-B', 'active', NOW(), NOW()),
   
  -- General Ward C
  ('10000001-0004-0001-0001-000000000003',
   'd0000001-0002-0001-0001-000000000001',
   'General Ward C', 'GEN-C', 'general', '5', 0, 0, 'NS-GEN-C', 'active', NOW(), NOW());

-- =====================================================
-- Isolation Ward
-- =====================================================

INSERT INTO wards (id, department_id, name, code, ward_type, floor_number, total_beds, available_beds, nursing_station, status, created_at, updated_at)
VALUES
  ('10000001-0005-0001-0001-000000000001',
   'd0000001-0002-0001-0001-000000000001',
   'Isolation Ward', 'ISO-1', 'isolation', '5', 0, 0, 'NS-ISO-1', 'active', NOW(), NOW());

-- =====================================================
-- Maternity Ward
-- =====================================================

INSERT INTO wards (id, department_id, name, code, ward_type, floor_number, total_beds, available_beds, nursing_station, status, created_at, updated_at)
VALUES
  ('10000001-0006-0001-0001-000000000001',
   'd0000001-0002-0001-0001-000000000001',
   'Maternity Ward', 'MAT-1', 'maternity', '6', 0, 0, 'NS-MAT-1', 'active', NOW(), NOW());

-- =====================================================
-- Verification
-- =====================================================

-- Verify wards created
SELECT 
  w.name,
  w.code,
  w.ward_type,
  w.floor_number,
  w.total_beds,
  w.available_beds,
  w.nursing_station,
  d.name as department_name,
  f.name as facility_name
FROM wards w
JOIN departments d ON d.id = w.department_id
JOIN facilities f ON f.id = d.facility_id
ORDER BY w.ward_type, w.code;

-- Expected output:
-- 9 wards created:
-- - 2 ICU wards
-- - 1 NICU ward
-- - 1 PICU ward
-- - 3 General wards
-- - 1 Isolation ward
-- - 1 Maternity ward

-- Note: total_beds and available_beds are 0 initially
-- They will be updated automatically when beds are created
