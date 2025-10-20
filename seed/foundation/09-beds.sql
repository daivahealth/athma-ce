-- =====================================================
-- Seed: Beds (IPD)
-- Description: Individual beds for patient admission in wards
-- Dependencies: 08-wards.sql
-- =====================================================

-- Note: Beds are created in wards
-- Ward bed counts (total_beds, available_beds) will be updated after bed creation

-- =====================================================
-- ICU Ward 1 Beds (10 beds)
-- =====================================================

INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status, created_at, updated_at)
VALUES
  (uuid_from_text('20000001-0001-0001-0001-000000000001'), uuid_from_text('10000001-0001-0001-0001-000000000001'), 'ICU-101', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0001-0001-000000000002'), uuid_from_text('10000001-0001-0001-0001-000000000001'), 'ICU-102', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0001-0001-000000000003'), uuid_from_text('10000001-0001-0001-0001-000000000001'), 'ICU-103', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0001-0001-000000000004'), uuid_from_text('10000001-0001-0001-0001-000000000001'), 'ICU-104', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0001-0001-000000000005'), uuid_from_text('10000001-0001-0001-0001-000000000001'), 'ICU-105', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0001-0001-000000000006'), uuid_from_text('10000001-0001-0001-0001-000000000001'), 'ICU-106', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0001-0001-000000000007'), uuid_from_text('10000001-0001-0001-0001-000000000001'), 'ICU-107', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0001-0001-000000000008'), uuid_from_text('10000001-0001-0001-0001-000000000001'), 'ICU-108', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0001-0001-000000000009'), uuid_from_text('10000001-0001-0001-0001-000000000001'), 'ICU-109', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0001-0001-000000000010'), uuid_from_text('10000001-0001-0001-0001-000000000001'), 'ICU-110', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW());

-- =====================================================
-- ICU Ward 2 Beds (8 beds)
-- =====================================================

INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status, created_at, updated_at)
VALUES
  (uuid_from_text('20000001-0001-0002-0001-000000000001'), uuid_from_text('10000001-0001-0001-0001-000000000002'), 'ICU-201', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0002-0001-000000000002'), uuid_from_text('10000001-0001-0001-0001-000000000002'), 'ICU-202', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0002-0001-000000000003'), uuid_from_text('10000001-0001-0001-0001-000000000002'), 'ICU-203', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0002-0001-000000000004'), uuid_from_text('10000001-0001-0001-0001-000000000002'), 'ICU-204', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0002-0001-000000000005'), uuid_from_text('10000001-0001-0001-0001-000000000002'), 'ICU-205', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0002-0001-000000000006'), uuid_from_text('10000001-0001-0001-0001-000000000002'), 'ICU-206', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0002-0001-000000000007'), uuid_from_text('10000001-0001-0001-0001-000000000002'), 'ICU-207', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0001-0002-0001-000000000008'), uuid_from_text('10000001-0001-0001-0001-000000000002'), 'ICU-208', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW());

-- =====================================================
-- NICU Beds (6 beds)
-- =====================================================

INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status, created_at, updated_at)
VALUES
  (uuid_from_text('20000001-0002-0001-0001-000000000001'), uuid_from_text('10000001-0002-0001-0001-000000000001'), 'NICU-101', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "incubator": true, "phototherapy": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0002-0001-0001-000000000002'), uuid_from_text('10000001-0002-0001-0001-000000000001'), 'NICU-102', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "incubator": true, "phototherapy": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0002-0001-0001-000000000003'), uuid_from_text('10000001-0002-0001-0001-000000000001'), 'NICU-103', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "incubator": true, "phototherapy": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0002-0001-0001-000000000004'), uuid_from_text('10000001-0002-0001-0001-000000000001'), 'NICU-104', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "incubator": true, "phototherapy": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0002-0001-0001-000000000005'), uuid_from_text('10000001-0002-0001-0001-000000000001'), 'NICU-105', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "incubator": true, "phototherapy": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0002-0001-0001-000000000006'), uuid_from_text('10000001-0002-0001-0001-000000000001'), 'NICU-106', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "incubator": true, "phototherapy": true}', 'available', NOW(), NOW());

-- =====================================================
-- PICU Beds (5 beds)
-- =====================================================

INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status, created_at, updated_at)
VALUES
  (uuid_from_text('20000001-0003-0001-0001-000000000001'), uuid_from_text('10000001-0003-0001-0001-000000000001'), 'PICU-101', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0003-0001-0001-000000000002'), uuid_from_text('10000001-0003-0001-0001-000000000001'), 'PICU-102', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0003-0001-0001-000000000003'), uuid_from_text('10000001-0003-0001-0001-000000000001'), 'PICU-103', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0003-0001-0001-000000000004'), uuid_from_text('10000001-0003-0001-0001-000000000001'), 'PICU-104', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0003-0001-0001-000000000005'), uuid_from_text('10000001-0003-0001-0001-000000000001'), 'PICU-105', 'icu', '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}', 'available', NOW(), NOW());

-- =====================================================
-- General Ward A Beds (20 beds)
-- =====================================================

INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status, created_at, updated_at)
SELECT
  uuid_generate_v4(),
  uuid_from_text('10000001-0004-0001-0001-000000000001'),
  'GEN-A-' || LPAD(seq::TEXT, 3, '0'),
  'standard',
  '{"oxygen": true, "monitor": false, "call_button": true}',
  'available',
  NOW(),
  NOW()
FROM generate_series(101, 120) AS seq;

-- =====================================================
-- General Ward B Beds (20 beds)
-- =====================================================

INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status, created_at, updated_at)
SELECT
  uuid_generate_v4(),
  uuid_from_text('10000001-0004-0001-0001-000000000002'),
  'GEN-B-' || LPAD(seq::TEXT, 3, '0'),
  'standard',
  '{"oxygen": true, "monitor": false, "call_button": true}',
  'available',
  NOW(),
  NOW()
FROM generate_series(201, 220) AS seq;

-- =====================================================
-- General Ward C Beds (20 beds)
-- =====================================================

INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status, created_at, updated_at)
SELECT
  uuid_generate_v4(),
  uuid_from_text('10000001-0004-0001-0001-000000000003'),
  'GEN-C-' || LPAD(seq::TEXT, 3, '0'),
  'standard',
  '{"oxygen": true, "monitor": false, "call_button": true}',
  'available',
  NOW(),
  NOW()
FROM generate_series(301, 320) AS seq;

-- =====================================================
-- Isolation Ward Beds (5 beds)
-- =====================================================

INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status, created_at, updated_at)
VALUES
  (uuid_from_text('20000001-0005-0001-0001-000000000001'), uuid_from_text('10000001-0005-0001-0001-000000000001'), 'ISO-101', 'isolation', '{"oxygen": true, "monitor": true, "negative_pressure": true, "anteRoom": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0005-0001-0001-000000000002'), uuid_from_text('10000001-0005-0001-0001-000000000001'), 'ISO-102', 'isolation', '{"oxygen": true, "monitor": true, "negative_pressure": true, "anteRoom": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0005-0001-0001-000000000003'), uuid_from_text('10000001-0005-0001-0001-000000000001'), 'ISO-103', 'isolation', '{"oxygen": true, "monitor": true, "negative_pressure": true, "anteRoom": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0005-0001-0001-000000000004'), uuid_from_text('10000001-0005-0001-0001-000000000001'), 'ISO-104', 'isolation', '{"oxygen": true, "monitor": true, "negative_pressure": true, "anteRoom": true}', 'available', NOW(), NOW()),
  (uuid_from_text('20000001-0005-0001-0001-000000000005'), uuid_from_text('10000001-0005-0001-0001-000000000001'), 'ISO-105', 'isolation', '{"oxygen": true, "monitor": true, "negative_pressure": true, "anteRoom": true}', 'available', NOW(), NOW());

-- =====================================================
-- Maternity Ward Beds (15 beds: 10 standard + 5 private)
-- =====================================================

-- Standard maternity beds
INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status, created_at, updated_at)
SELECT
  uuid_generate_v4(),
  uuid_from_text('10000001-0006-0001-0001-000000000001'),
  'MAT-' || LPAD(seq::TEXT, 3, '0'),
  'standard',
  '{"oxygen": true, "monitor": true, "baby_bassinet": true, "call_button": true}',
  'available',
  NOW(),
  NOW()
FROM generate_series(101, 110) AS seq;

-- Private maternity beds
INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status, created_at, updated_at)
SELECT
  uuid_generate_v4(),
  uuid_from_text('10000001-0006-0001-0001-000000000001'),
  'MAT-P' || LPAD((seq - 200)::TEXT, 2, '0'),
  'private',
  '{"oxygen": true, "monitor": true, "baby_bassinet": true, "private_bathroom": true, "tv": true, "sofa": true}',
  'available',
  NOW(),
  NOW()
FROM generate_series(201, 205) AS seq;

-- =====================================================
-- Update Ward Bed Counts
-- =====================================================

-- This function will calculate and update total_beds and available_beds for all wards
-- based on the actual beds created

UPDATE wards w
SET 
  total_beds = (SELECT COUNT(*) FROM beds WHERE ward_id = w.id),
  available_beds = (SELECT COUNT(*) FROM beds WHERE ward_id = w.id AND status = 'available'),
  updated_at = NOW();

-- =====================================================
-- Verification
-- =====================================================

-- Verify beds created and ward counts updated
SELECT 
  w.name as ward_name,
  w.ward_type,
  w.total_beds,
  w.available_beds,
  COUNT(b.id) as actual_beds,
  COUNT(CASE WHEN b.status = 'available' THEN 1 END) as actual_available
FROM wards w
LEFT JOIN beds b ON b.ward_id = w.id
GROUP BY w.id, w.name, w.ward_type, w.total_beds, w.available_beds
ORDER BY w.ward_type, w.name;

-- Expected output:
-- ICU Ward 1: 10 beds (10 available)
-- ICU Ward 2: 8 beds (8 available)
-- NICU: 6 beds (6 available)
-- PICU: 5 beds (5 available)
-- General Ward A: 20 beds (20 available)
-- General Ward B: 20 beds (20 available)
-- General Ward C: 20 beds (20 available)
-- Isolation Ward: 5 beds (5 available)
-- Maternity Ward: 15 beds (15 available)

-- Total: 109 beds, all available

-- Detailed bed list
SELECT 
  w.name as ward_name,
  b.bed_number,
  b.bed_type,
  b.features,
  b.status
FROM beds b
JOIN wards w ON w.id = b.ward_id
ORDER BY w.name, b.bed_number
LIMIT 20;

-- Bed count by ward type
SELECT 
  w.ward_type,
  COUNT(b.id) as total_beds,
  COUNT(CASE WHEN b.status = 'available' THEN 1 END) as available_beds,
  COUNT(CASE WHEN b.status = 'occupied' THEN 1 END) as occupied_beds
FROM wards w
LEFT JOIN beds b ON b.ward_id = w.id
GROUP BY w.ward_type
ORDER BY w.ward_type;
