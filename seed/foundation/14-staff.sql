-- Seed: Staff (doctors, nurses, technicians, support) using UUIDv5

WITH ns AS (
  SELECT '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid AS dns
)
INSERT INTO staff (
  id, tenant_id, prefix, first_name, last_name, middle_name, date_of_birth, gender, nationality,
  phone_number, email, employee_id, staff_type, specialties, license_number, license_expiry,
  qualification, languages, display_name, status, created_at, updated_at
) VALUES
-- Doctors
(uuid_generate_v5((SELECT dns FROM ns), 'staff:DOCTOR:AHMED_ALMAN'), '11111111-1111-1111-1111-111111111111', 'Dr', 'Ahmed', 'Al-Mansoori', 'Hassan', DATE '1975-03-15', 'male', 'UAE', '+971501234567', 'ahmed.almansoori@zeal.ae', 'DOC001', 'physician', '[]'::jsonb, 'MOH-DOC-2024-001', DATE '2026-12-31', 'MD', ARRAY['Arabic','English'], 'Dr Ahmed Al-Mansoori', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'staff:DOCTOR:FATIMA_ALZA'), '11111111-1111-1111-1111-111111111111', 'Dr', 'Fatima', 'Al-Zaabi', 'Mohammed', DATE '1980-07-22', 'female', 'UAE', '+971502345678', 'fatima.alzaabi@zeal.ae', 'DOC002', 'physician', '[]'::jsonb, 'MOH-DOC-2024-002', DATE '2027-06-30', 'FRCP', ARRAY['Arabic','English'], 'Dr Fatima Al-Zaabi', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'staff:DOCTOR:OMAR_ALK'), '11111111-1111-1111-1111-111111111111', 'Dr', 'Omar', 'Al-Ketbi', NULL, DATE '1985-11-10', 'male', 'UAE', '+971503456789', 'omar.alketbi@zeal.ae', 'DOC003', 'physician', '[]'::jsonb, 'MOH-DOC-2024-003', DATE '2027-12-31', 'MBBS', ARRAY['Arabic','English'], 'Dr Omar Al-Ketbi', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'staff:DOCTOR:LAYLA_ALSH'), '11111111-1111-1111-1111-111111111111', 'Dr', 'Layla', 'Al-Shamsi', 'Abdullah', DATE '1982-09-25', 'female', 'UAE', '+971505678901', 'layla.alshamsi@zeal.ae', 'DOC004', 'physician', '[]'::jsonb, 'MOH-DOC-2024-005', DATE '2027-03-31', 'MD', ARRAY['Arabic','English'], 'Dr Layla Al-Shamsi', 'active', NOW(), NOW()),
-- Nurses
(uuid_generate_v5((SELECT dns FROM ns), 'staff:NURSE:MARIA_SANTOS'), '11111111-1111-1111-1111-111111111111', NULL, 'Maria', 'Santos', NULL, DATE '1988-02-14', 'female', 'Philippines', '+971506789012', 'maria.santos@zeal.ae', 'NRS001', 'nurse', '[]'::jsonb, 'DHA-NRS-2024-001', DATE '2026-08-31', 'BSN', ARRAY['English','Tagalog'], 'Maria Santos', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'staff:NURSE:PRIYA_SHARMA'), '11111111-1111-1111-1111-111111111111', NULL, 'Priya', 'Sharma', NULL, DATE '1990-06-08', 'female', 'India', '+971507890123', 'priya.sharma@zeal.ae', 'NRS002', 'nurse', '[]'::jsonb, 'DHA-NRS-2024-002', DATE '2027-04-30', 'RN', ARRAY['English','Hindi'], 'Priya Sharma', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'staff:NURSE:JOHN_WILLIAMS'), '11111111-1111-1111-1111-111111111111', NULL, 'John', 'Williams', 'David', DATE '1986-12-30', 'male', 'UK', '+971508901234', 'john.williams@zeal.ae', 'NRS003', 'nurse', '[]'::jsonb, 'MOH-NRS-2024-003', DATE '2026-11-30', 'RN', ARRAY['English'], 'John David Williams', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'staff:NURSE:AISHA_ALMAZ'), '11111111-1111-1111-1111-111111111111', NULL, 'Aisha', 'Al-Mazrouei', NULL, DATE '1992-04-12', 'female', 'UAE', '+971509012345', 'aisha.almazrouei@zeal.ae', 'NRS004', 'nurse', '[]'::jsonb, 'MOH-NRS-2024-004', DATE '2027-01-31', 'BSN', ARRAY['Arabic','English'], 'Aisha Al-Mazrouei', 'active', NOW(), NOW()),
-- Technicians
(uuid_generate_v5((SELECT dns FROM ns), 'staff:TECH:RAVI_KUMAR'), '11111111-1111-1111-1111-111111111111', NULL, 'Ravi', 'Kumar', NULL, DATE '1985-08-20', 'male', 'India', '+971510123456', 'ravi.kumar@zeal.ae', 'TECH001', 'technician', '[]'::jsonb, 'MOH-TECH-2024-001', DATE '2026-12-31', 'BTech', ARRAY['English','Hindi'], 'Ravi Kumar', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'staff:TECH:MOHAMMED_HASSAN'), '11111111-1111-1111-1111-111111111111', NULL, 'Mohammed', 'Hassan', 'Ali', DATE '1987-11-05', 'male', 'Egypt', '+971511234567', 'mohammed.hassan@zeal.ae', 'TECH002', 'technician', '[]'::jsonb, 'DHA-TECH-2024-002', DATE '2027-05-31', 'Diploma', ARRAY['Arabic','English'], 'Mohammed Ali Hassan', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'staff:TECH:NADIA_IBRAHIM'), '11111111-1111-1111-1111-111111111111', NULL, 'Nadia', 'Ibrahim', NULL, DATE '1991-03-18', 'female', 'Jordan', '+971512345678', 'nadia.ibrahim@zeal.ae', 'TECH003', 'technician', '[]'::jsonb, 'MOH-TECH-2024-003', DATE '2026-10-31', 'BSc', ARRAY['Arabic','English'], 'Nadia Ibrahim', 'active', NOW(), NOW()),
-- Support
(uuid_generate_v5((SELECT dns FROM ns), 'staff:SUPPORT:RAJESH_PATEL'), '11111111-1111-1111-1111-111111111111', NULL, 'Rajesh', 'Patel', NULL, DATE '1975-06-12', 'male', 'India', '+971513456789', NULL, 'SUP001', 'support', '[]'::jsonb, NULL, NULL, 'Diploma', ARRAY['English','Hindi'], 'Rajesh Patel', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'staff:SUPPORT:AHMED_YOUSEF'), '11111111-1111-1111-1111-111111111111', NULL, 'Ahmed', 'Yousef', NULL, DATE '1980-09-28', 'male', 'Sudan', '+971514567890', NULL, 'SUP002', 'support', '[]'::jsonb, NULL, NULL, 'Diploma', ARRAY['Arabic','English'], 'Ahmed Yousef', 'active', NOW(), NOW()),
(uuid_generate_v5((SELECT dns FROM ns), 'staff:SUPPORT:CARLOS_RODRIGUEZ'), '11111111-1111-1111-1111-111111111111', NULL, 'Carlos', 'Rodriguez', NULL, DATE '1978-01-15', 'male', 'Philippines', '+971515678901', NULL, 'SUP003', 'support', '[]'::jsonb, NULL, NULL, 'Certified', ARRAY['English','Spanish'], 'Carlos Rodriguez', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
