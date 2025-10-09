-- =====================================================
-- Seed: Staff Members
-- Description: Healthcare personnel (doctors, nurses, technicians, support)
-- Dependencies: 01-tenants.sql
-- =====================================================

-- Note: This seed file creates STAFF records only.
-- User accounts will be created separately and optionally linked.
-- Not all staff need system access.

-- =====================================================
-- Doctors (with various specialties)
-- =====================================================

INSERT INTO staff (id, tenant_id, first_name, last_name, middle_name, date_of_birth, gender, nationality, phone_number, email, employee_id, staff_type, specialties, license_number, license_expiry, status, created_at, updated_at)
VALUES
  -- Cardiologist
  ('d1111111-1111-1111-1111-111111111111',
   '11111111-1111-1111-1111-111111111111',
   'Ahmed', 'Al-Mansoori', 'Hassan', '1975-03-15', 'male', 'UAE',
   '+971501234567', 'ahmed.almansoori@armc.ae', 'DOC001', 'doctor',
   '["cardiology", "internal_medicine"]'::jsonb,
   'MOH-DOC-2024-001', '2026-12-31', 'active', NOW(), NOW()),

  -- Pediatrician
  ('d2222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111',
   'Fatima', 'Al-Zaabi', 'Mohammed', '1980-07-22', 'female', 'UAE',
   '+971502345678', 'fatima.alzaabi@armc.ae', 'DOC002', 'doctor',
   '["pediatrics", "neonatology"]'::jsonb,
   'MOH-DOC-2024-002', '2027-06-30', 'active', NOW(), NOW()),

  -- General Practitioner
  ('d3333333-3333-3333-3333-333333333333',
   '11111111-1111-1111-1111-111111111111',
   'Omar', 'Al-Ketbi', NULL, '1985-11-10', 'male', 'UAE',
   '+971503456789', 'omar.alketbi@armc.ae', 'DOC003', 'doctor',
   '["general_medicine", "family_medicine"]'::jsonb,
   'MOH-DOC-2024-003', '2027-12-31', 'active', NOW(), NOW()),

  -- Orthopedic Surgeon
  ('d4444444-4444-4444-4444-444444444444',
   '11111111-1111-1111-1111-111111111111',
   'Sarah', 'Johnson', 'Elizabeth', '1978-05-18', 'female', 'USA',
   '+971504567890', 'sarah.johnson@armc.ae', 'DOC004', 'doctor',
   '["orthopedics", "sports_medicine"]'::jsonb,
   'DHA-DOC-2024-004', '2026-09-30', 'active', NOW(), NOW()),

  -- Dermatologist
  ('d5555555-5555-5555-5555-555555555555',
   '11111111-1111-1111-1111-111111111111',
   'Layla', 'Al-Shamsi', 'Abdullah', '1982-09-25', 'female', 'UAE',
   '+971505678901', 'layla.alshamsi@armc.ae', 'DOC005', 'doctor',
   '["dermatology", "cosmetic_dermatology"]'::jsonb,
   'MOH-DOC-2024-005', '2027-03-31', 'active', NOW(), NOW());

-- =====================================================
-- Nurses (various specializations)
-- =====================================================

INSERT INTO staff (id, tenant_id, first_name, last_name, middle_name, date_of_birth, gender, nationality, phone_number, email, employee_id, staff_type, specialties, license_number, license_expiry, status, created_at, updated_at)
VALUES
  -- ICU Nurse
  ('a1111111-1111-1111-1111-111111111111',
   '11111111-1111-1111-1111-111111111111',
   'Maria', 'Santos', NULL, '1988-02-14', 'female', 'Philippines',
   '+971506789012', 'maria.santos@armc.ae', 'NRS001', 'nurse',
   '["icu", "critical_care"]'::jsonb,
   'MOH-NRS-2024-001', '2026-08-31', 'active', NOW(), NOW()),

  -- Pediatric Nurse
  ('a2222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111',
   'Priya', 'Sharma', NULL, '1990-06-08', 'female', 'India',
   '+971507890123', 'priya.sharma@armc.ae', 'NRS002', 'nurse',
   '["pediatrics", "nicu"]'::jsonb,
   'DHA-NRS-2024-002', '2027-04-30', 'active', NOW(), NOW()),

  -- Emergency Nurse
  ('a3333333-3333-3333-3333-333333333333',
   '11111111-1111-1111-1111-111111111111',
   'John', 'Williams', 'David', '1986-12-30', 'male', 'UK',
   '+971508901234', 'john.williams@armc.ae', 'NRS003', 'nurse',
   '["emergency", "trauma"]'::jsonb,
   'MOH-NRS-2024-003', '2026-11-30', 'active', NOW(), NOW()),

  -- General Ward Nurse
  ('a4444444-4444-4444-4444-444444444444',
   '11111111-1111-1111-1111-111111111111',
   'Aisha', 'Al-Mazrouei', NULL, '1992-04-12', 'female', 'UAE',
   '+971509012345', 'aisha.almazrouei@armc.ae', 'NRS004', 'nurse',
   '["general_ward", "medical_surgical"]'::jsonb,
   'MOH-NRS-2024-004', '2027-01-31', 'active', NOW(), NOW());

-- =====================================================
-- Technicians (Lab, Radiology, etc.)
-- =====================================================

INSERT INTO staff (id, tenant_id, first_name, last_name, middle_name, date_of_birth, gender, nationality, phone_number, email, employee_id, staff_type, specialties, license_number, license_expiry, status, created_at, updated_at)
VALUES
  -- Lab Technician
  ('b1111111-1111-1111-1111-111111111111',
   '11111111-1111-1111-1111-111111111111',
   'Ravi', 'Kumar', NULL, '1985-08-20', 'male', 'India',
   '+971510123456', 'ravi.kumar@armc.ae', 'TECH001', 'technician',
   '["laboratory", "hematology", "biochemistry"]'::jsonb,
   'MOH-TECH-2024-001', '2026-12-31', 'active', NOW(), NOW()),

  -- Radiology Technician
  ('b2222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111',
   'Mohammed', 'Hassan', 'Ali', '1987-11-05', 'male', 'Egypt',
   '+971511234567', 'mohammed.hassan@armc.ae', 'TECH002', 'technician',
   '["radiology", "ct_scan", "mri"]'::jsonb,
   'DHA-TECH-2024-002', '2027-05-31', 'active', NOW(), NOW()),

  -- Pharmacy Technician
  ('b3333333-3333-3333-3333-333333333333',
   '11111111-1111-1111-1111-111111111111',
   'Nadia', 'Ibrahim', NULL, '1991-03-18', 'female', 'Jordan',
   '+971512345678', 'nadia.ibrahim@armc.ae', 'TECH003', 'technician',
   '["pharmacy", "medication_dispensing"]'::jsonb,
   'MOH-TECH-2024-003', '2026-10-31', 'active', NOW(), NOW());

-- =====================================================
-- Support Staff (NO SYSTEM ACCESS NEEDED)
-- =====================================================

INSERT INTO staff (id, tenant_id, first_name, last_name, middle_name, date_of_birth, gender, nationality, phone_number, email, employee_id, staff_type, specialties, license_number, license_expiry, status, created_at, updated_at)
VALUES
  -- Janitor (no system access)
  ('c1111111-1111-1111-1111-111111111111',
   '11111111-1111-1111-1111-111111111111',
   'Rajesh', 'Patel', NULL, '1975-06-12', 'male', 'India',
   '+971513456789', NULL, 'SUP001', 'support',
   '["cleaning", "sanitation"]'::jsonb,
   NULL, NULL, 'active', NOW(), NOW()),

  -- Security Guard (no system access)
  ('c2222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111',
   'Ahmed', 'Yousef', NULL, '1980-09-28', 'male', 'Sudan',
   '+971514567890', NULL, 'SUP002', 'support',
   '["security", "patient_safety"]'::jsonb,
   NULL, NULL, 'active', NOW(), NOW()),

  -- Maintenance Worker (no system access)
  ('c3333333-3333-3333-3333-333333333333',
   '11111111-1111-1111-1111-111111111111',
   'Carlos', 'Rodriguez', NULL, '1978-01-15', 'male', 'Philippines',
   '+971515678901', NULL, 'SUP003', 'support',
   '["maintenance", "facility_management"]'::jsonb,
   NULL, NULL, 'active', NOW(), NOW());

-- =====================================================
-- Verification
-- =====================================================

-- Count by staff type
SELECT 
  staff_type,
  COUNT(*) as count,
  COUNT(license_number) as licensed,
  COUNT(email) as with_email
FROM staff
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
GROUP BY staff_type
ORDER BY staff_type;

-- Staff who will need system access (have email)
SELECT 
  employee_id,
  first_name || ' ' || last_name as name,
  staff_type,
  email,
  CASE WHEN email IS NOT NULL THEN 'Will need user account' ELSE 'No system access' END as access_requirement
FROM staff
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
ORDER BY staff_type, employee_id;

-- Expected output:
-- Doctors: 5 (all need access)
-- Nurses: 4 (all need access)
-- Technicians: 3 (all need access)
-- Support: 3 (NO access needed)
-- Total: 15 staff members
