-- =====================================================
-- Seed: Departments
-- Description: Functional units within facilities (OPD, IPD, Radiology, etc.)
-- Dependencies: 04-facilities.sql, staff (for head of department)
-- =====================================================

-- Note: Ensure you have tenant_id and facility_id from previous seed data
-- Default tenant: 11111111-1111-1111-1111-111111111111
-- We'll create departments for the facilities seeded in 04-facilities.sql

-- =====================================================
-- OPD Departments
-- =====================================================

INSERT INTO departments (id, facility_id, name, code, department_type, floor_number, phone_extension, operating_hours, status, created_at, updated_at)
SELECT
  uuid_from_text('d0000001-0001-0001-0001-000000000001'),
  id,
  'Outpatient Department',
  'OPD',
  'opd',
  '1',
  '1000',
  '{"monday": {"open": "08:00", "close": "20:00"}, "tuesday": {"open": "08:00", "close": "20:00"}, "wednesday": {"open": "08:00", "close": "20:00"}, "thursday": {"open": "08:00", "close": "20:00"}, "friday": {"open": "08:00", "close": "20:00"}, "saturday": {"open": "08:00", "close": "14:00"}}'::jsonb,
  'active',
  NOW(),
  NOW()
FROM facilities 
WHERE tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111') 
LIMIT 1;
   

-- =====================================================
-- IPD Departments
-- =====================================================

INSERT INTO departments (id, facility_id, name, code, department_type, floor_number, phone_extension, operating_hours, status, created_at, updated_at)
SELECT
  uuid_from_text('d0000001-0002-0001-0001-000000000001'),
  id,
  'Inpatient Department',
  'IPD',
  'ipd',
  '3',
  '3000',
  '{"monday": {"open": "00:00", "close": "23:59"}, "tuesday": {"open": "00:00", "close": "23:59"}, "wednesday": {"open": "00:00", "close": "23:59"}, "thursday": {"open": "00:00", "close": "23:59"}, "friday": {"open": "00:00", "close": "23:59"}, "saturday": {"open": "00:00", "close": "23:59"}, "sunday": {"open": "00:00", "close": "23:59"}}'::jsonb,
  'active',
  NOW(),
  NOW()
FROM facilities 
WHERE tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111') 
LIMIT 1;

-- =====================================================
-- Emergency Department
-- =====================================================

INSERT INTO departments (id, facility_id, name, code, department_type, floor_number, phone_extension, operating_hours, status, created_at, updated_at)
SELECT
  uuid_from_text('d0000001-0003-0001-0001-000000000001'),
  id,
  'Emergency Department',
  'ER',
  'emergency',
  'G',
  '9999',
  '{"monday": {"open": "00:00", "close": "23:59"}, "tuesday": {"open": "00:00", "close": "23:59"}, "wednesday": {"open": "00:00", "close": "23:59"}, "thursday": {"open": "00:00", "close": "23:59"}, "friday": {"open": "00:00", "close": "23:59"}, "saturday": {"open": "00:00", "close": "23:59"}, "sunday": {"open": "00:00", "close": "23:59"}}'::jsonb,
  'active',
  NOW(),
  NOW()
FROM facilities 
WHERE tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111') 
LIMIT 1;

-- =====================================================
-- Radiology Department
-- =====================================================

INSERT INTO departments (id, facility_id, name, code, department_type, floor_number, phone_extension, operating_hours, status, created_at, updated_at)
SELECT
  uuid_from_text('d0000001-0004-0001-0001-000000000001'),
  id,
  'Radiology Department',
  'RAD',
  'radiology',
  '2',
  '2000',
  '{"monday": {"open": "07:00", "close": "22:00"}, "tuesday": {"open": "07:00", "close": "22:00"}, "wednesday": {"open": "07:00", "close": "22:00"}, "thursday": {"open": "07:00", "close": "22:00"}, "friday": {"open": "07:00", "close": "22:00"}, "saturday": {"open": "08:00", "close": "18:00"}, "sunday": {"open": "08:00", "close": "18:00"}}'::jsonb,
  'active',
  NOW(),
  NOW()
FROM facilities 
WHERE tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111') 
LIMIT 1;

-- =====================================================
-- Laboratory Department
-- =====================================================

INSERT INTO departments (id, facility_id, name, code, department_type, floor_number, phone_extension, operating_hours, status, created_at, updated_at)
SELECT
  uuid_from_text('d0000001-0005-0001-0001-000000000001'),
  id,
  'Laboratory Department',
  'LAB',
  'laboratory',
  '1',
  '1500',
  '{"monday": {"open": "06:00", "close": "23:00"}, "tuesday": {"open": "06:00", "close": "23:00"}, "wednesday": {"open": "06:00", "close": "23:00"}, "thursday": {"open": "06:00", "close": "23:00"}, "friday": {"open": "06:00", "close": "23:00"}, "saturday": {"open": "07:00", "close": "20:00"}, "sunday": {"open": "07:00", "close": "20:00"}}'::jsonb,
  'active',
  NOW(),
  NOW()
FROM facilities 
WHERE tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111') 
LIMIT 1;

-- =====================================================
-- Surgery Department
-- =====================================================

INSERT INTO departments (id, facility_id, name, code, department_type, floor_number, phone_extension, operating_hours, status, created_at, updated_at)
SELECT
  uuid_from_text('d0000001-0006-0001-0001-000000000001'),
  id,
  'Surgery Department',
  'SURG',
  'surgery',
  '4',
  '4000',
  '{"monday": {"open": "07:00", "close": "20:00"}, "tuesday": {"open": "07:00", "close": "20:00"}, "wednesday": {"open": "07:00", "close": "20:00"}, "thursday": {"open": "07:00", "close": "20:00"}, "friday": {"open": "07:00", "close": "20:00"}}'::jsonb,
  'active',
  NOW(),
  NOW()
FROM facilities 
WHERE tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111') 
LIMIT 1;

-- =====================================================
-- Pharmacy Department
-- =====================================================

INSERT INTO departments (id, facility_id, name, code, department_type, floor_number, phone_extension, operating_hours, status, created_at, updated_at)
SELECT
  uuid_from_text('d0000001-0007-0001-0001-000000000001'),
  id,
  'Pharmacy Department',
  'PHARM',
  'pharmacy',
  'G',
  '1200',
  '{"monday": {"open": "00:00", "close": "23:59"}, "tuesday": {"open": "00:00", "close": "23:59"}, "wednesday": {"open": "00:00", "close": "23:59"}, "thursday": {"open": "00:00", "close": "23:59"}, "friday": {"open": "00:00", "close": "23:59"}, "saturday": {"open": "00:00", "close": "23:59"}, "sunday": {"open": "00:00", "close": "23:59"}}'::jsonb,
  'active',
  NOW(),
  NOW()
FROM facilities 
WHERE tenant_id = uuid_from_text('11111111-1111-1111-1111-111111111111') 
LIMIT 1;

-- =====================================================
-- Verification
-- =====================================================

-- Verify departments created
SELECT 
  d.name,
  d.code,
  d.department_type,
  d.floor_number,
  f.name as facility_name
FROM departments d
JOIN facilities f ON f.id = d.facility_id
ORDER BY f.name, d.code;

-- Expected output:
-- Downtown Clinic → OPD (1 department)
-- Main Hospital → OPD, IPD, ER, RAD, LAB, SURG, PHARM (7 departments)
