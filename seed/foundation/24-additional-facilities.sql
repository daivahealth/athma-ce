-- =====================================================
-- Seed: Additional Facilities
-- Description: Add more facilities to demonstrate multi-facility scenarios
-- Dependencies: 01-tenants.sql
-- =====================================================

-- Note: These facilities demonstrate:
-- 1. Different facility types (clinic, hospital, diagnostic center)
-- 2. Different locations within UAE
-- 3. Multi-facility network management

INSERT INTO facilities (
  id, tenant_id, name, code, facility_type, license_number,
  address_line1, address_line2, city, emirate, postal_code, country,
  latitude, longitude, google_place_id,
  phone_number, email, website,
  building_number, floor_numbers, total_floors,
  capacity, operating_hours, status,
  created_at, updated_at
) VALUES

-- =====================================================
-- Al Rashid Medical Center - Downtown Branch
-- =====================================================
(
  uuid_from_text('22222222-2222-2222-2222-222222222222'),
  uuid_from_text('11111111-1111-1111-1111-111111111111'),
  'Al Rashid Medical Center - Downtown',
  'ARMC-DT',
  'clinic',
  'DHA-CLINIC-2024-002',
  'Sheikh Zayed Road',
  'Trade Centre District',
  'Dubai',
  'Dubai',
  '00000',
  'UAE',
  25.2048, 55.2708,
  'ChIJabcdefghijklmnop123',
  '+971-4-321-9876',
  'downtown@alrashid.ae',
  'https://alrashid.ae/downtown',
  'Tower 15',
  ARRAY['G', '1', '2'],
  3,
  50,
  '{"monday": {"open": "08:00", "close": "22:00"}, "tuesday": {"open": "08:00", "close": "22:00"}, "wednesday": {"open": "08:00", "close": "22:00"}, "thursday": {"open": "08:00", "close": "22:00"}, "friday": {"open": "08:00", "close": "22:00"}, "saturday": {"open": "08:00", "close": "18:00"}, "sunday": {"open": "09:00", "close": "18:00"}}'::jsonb,
  'active',
  NOW(),
  NOW()
),

-- =====================================================
-- Al Rashid Specialty Hospital - Al Ain
-- =====================================================
(
  uuid_from_text('33333333-3333-3333-3333-333333333333'),
  uuid_from_text('11111111-1111-1111-1111-111111111111'),
  'Al Rashid Specialty Hospital - Al Ain',
  'ARSH-AA',
  'hospital',
  'DOH-HOSPITAL-2024-003',
  'Khalifa Bin Zayed Street',
  'Al Ain City',
  'Al Ain',
  'Abu Dhabi',
  '00000',
  'UAE',
  24.2075, 55.7447,
  'ChIJxyzdefghijklmnop456',
  '+971-3-765-4321',
  'alain@alrashid.ae',
  'https://alrashid.ae/alain',
  'Building 42',
  ARRAY['G', '1', '2', '3', '4'],
  5,
  150,
  '{"monday": {"open": "00:00", "close": "23:59"}, "tuesday": {"open": "00:00", "close": "23:59"}, "wednesday": {"open": "00:00", "close": "23:59"}, "thursday": {"open": "00:00", "close": "23:59"}, "friday": {"open": "00:00", "close": "23:59"}, "saturday": {"open": "00:00", "close": "23:59"}, "sunday": {"open": "00:00", "close": "23:59"}}'::jsonb,
  'active',
  NOW(),
  NOW()
),

-- =====================================================
-- Al Rashid Diagnostic Center - Marina
-- =====================================================
(
  uuid_from_text('44444444-4444-4444-4444-444444444444'),
  uuid_from_text('11111111-1111-1111-1111-111111111111'),
  'Al Rashid Diagnostic Center - Marina',
  'ARDC-MAR',
  'diagnostic_center',
  'DHA-DIAG-2024-004',
  'Dubai Marina Walk',
  'Marina Promenade',
  'Dubai',
  'Dubai',
  '00000',
  'UAE',
  25.0806, 55.1390,
  'ChIJqrsdefghijklmnop789',
  '+971-4-399-8877',
  'marina@alrashid.ae',
  'https://alrashid.ae/marina',
  'Marina Plaza',
  ARRAY['G', '1', '2'],
  3,
  30,
  '{"monday": {"open": "07:00", "close": "23:00"}, "tuesday": {"open": "07:00", "close": "23:00"}, "wednesday": {"open": "07:00", "close": "23:00"}, "thursday": {"open": "07:00", "close": "23:00"}, "friday": {"open": "07:00", "close": "23:00"}, "saturday": {"open": "07:00", "close": "20:00"}, "sunday": {"open": "09:00", "close": "20:00"}}'::jsonb,
  'active',
  NOW(),
  NOW()
);

-- =====================================================
-- Verification
-- =====================================================

-- Count facilities
SELECT COUNT(*) as total_facilities FROM facilities;

-- List all facilities
SELECT 
  code,
  name,
  facility_type,
  city,
  emirate,
  phone_number,
  email,
  capacity
FROM facilities
ORDER BY name;

-- Facilities by type
SELECT 
  facility_type,
  COUNT(*) as count,
  string_agg(name, ', ' ORDER BY name) as facility_names
FROM facilities
GROUP BY facility_type
ORDER BY count DESC;

-- Facilities by emirate
SELECT 
  emirate,
  COUNT(*) as count,
  string_agg(name, ', ' ORDER BY name) as facilities
FROM facilities
GROUP BY emirate
ORDER BY count DESC;

-- Expected output:
-- Total: 4 facilities
-- Main Hospital: Full service, 200 capacity
-- Downtown: Outpatient clinic, 50 capacity
-- Al Ain: Specialty hospital, 150 capacity
-- Marina: Diagnostic center, 30 capacity
