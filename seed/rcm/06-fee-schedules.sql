-- =====================================================
-- Fee Schedules Seed Data
-- =====================================================
-- Purpose: Create authority fee schedules (DHA/DOH/MOHAP) and sample fee schedule items
-- Dependencies: None (Global/Authority schedules)
-- Note: tenantId is NULL for authority schedules
-- =====================================================

-- Clean up existing data
DELETE FROM fee_schedule_items;
DELETE FROM fee_schedules;

-- =====================================================
-- AUTHORITY FEE SCHEDULES
-- =====================================================

-- DHA Fee Schedule (Dubai Health Authority) - 2024
INSERT INTO fee_schedules (
  id,
  "tenantId",
  "scheduleName",
  "scheduleType",
  "authorityCode",
  version,
  "effectiveFrom",
  "effectiveTo",
  status,
  "baseFeeScheduleId",
  metadata,
  "createdAt",
  "updatedAt"
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  NULL,
  'DHA Unified Fee Schedule 2024',
  'authority',
  'DHA',
  '2024.1',
  '2024-01-01T00:00:00Z',
  '2024-12-31T23:59:59Z',
  'active',
  NULL,
  '{"description": "Dubai Health Authority official fee schedule for 2024", "regulation": "DHA Circular No. 1/2024", "lastReviewDate": "2024-01-01"}'::jsonb,
  NOW(),
  NOW()
);

-- DOH Fee Schedule (Department of Health - Abu Dhabi) - 2024
INSERT INTO fee_schedules (
  id,
  "tenantId",
  "scheduleName",
  "scheduleType",
  "authorityCode",
  version,
  "effectiveFrom",
  "effectiveTo",
  status,
  "baseFeeScheduleId",
  metadata,
  "createdAt",
  "updatedAt"
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  NULL,
  'DOH Standard Healthcare Tariff 2024',
  'authority',
  'DOH',
  '2024.1',
  '2024-01-01T00:00:00Z',
  '2024-12-31T23:59:59Z',
  'active',
  NULL,
  '{"description": "Abu Dhabi Department of Health standard tariff 2024", "regulation": "DOH Policy No. 12/2024", "lastReviewDate": "2024-01-01"}'::jsonb,
  NOW(),
  NOW()
);

-- MOHAP Fee Schedule (Ministry of Health and Prevention) - 2024
INSERT INTO fee_schedules (
  id,
  "tenantId",
  "scheduleName",
  "scheduleType",
  "authorityCode",
  version,
  "effectiveFrom",
  "effectiveTo",
  status,
  "baseFeeScheduleId",
  metadata,
  "createdAt",
  "updatedAt"
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  NULL,
  'MOHAP Federal Fee Schedule 2024',
  'authority',
  'MOHAP',
  '2024.1',
  '2024-01-01T00:00:00Z',
  '2024-12-31T23:59:59Z',
  'active',
  NULL,
  '{"description": "Ministry of Health and Prevention federal fee schedule", "regulation": "MOHAP Decree No. 5/2024", "lastReviewDate": "2024-01-01"}'::jsonb,
  NOW(),
  NOW()
);

-- =====================================================
-- FEE SCHEDULE ITEMS - DHA
-- =====================================================

-- Consultation Fees (DHA)
INSERT INTO fee_schedule_items (
  id,
  "feeScheduleId",
  "billingItemId",
  code,
  "codeType",
  "baseAmount",
  currency,
  unit,
  multiplier,
  "discountPct",
  "maxAllowedAmount",
  "serviceGroup",
  priority,
  "createdAt",
  "updatedAt"
) VALUES
-- General Consultation
('dha-item-00001', '11111111-1111-1111-1111-111111111111', NULL, '99201', 'CPT', 200.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('dha-item-00002', '11111111-1111-1111-1111-111111111111', NULL, '99202', 'CPT', 250.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('dha-item-00003', '11111111-1111-1111-1111-111111111111', NULL, '99203', 'CPT', 300.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('dha-item-00004', '11111111-1111-1111-1111-111111111111', NULL, '99204', 'CPT', 400.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('dha-item-00005', '11111111-1111-1111-1111-111111111111', NULL, '99205', 'CPT', 500.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),

-- Laboratory Tests (DHA)
('dha-item-00010', '11111111-1111-1111-1111-111111111111', NULL, '85025', 'CPT', 50.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()), -- Complete Blood Count (CBC)
('dha-item-00011', '11111111-1111-1111-1111-111111111111', NULL, '80053', 'CPT', 150.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()), -- Comprehensive Metabolic Panel
('dha-item-00012', '11111111-1111-1111-1111-111111111111', NULL, '82947', 'CPT', 60.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()), -- Glucose
('dha-item-00013', '11111111-1111-1111-1111-111111111111', NULL, '83036', 'CPT', 80.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()), -- Hemoglobin A1C
('dha-item-00014', '11111111-1111-1111-1111-111111111111', NULL, '84443', 'CPT', 120.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()), -- Thyroid Stimulating Hormone (TSH)

-- Imaging (DHA)
('dha-item-00020', '11111111-1111-1111-1111-111111111111', NULL, '71020', 'CPT', 250.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW()), -- Chest X-Ray 2 Views
('dha-item-00021', '11111111-1111-1111-1111-111111111111', NULL, '70450', 'CPT', 800.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW()), -- CT Head without contrast
('dha-item-00022', '11111111-1111-1111-1111-111111111111', NULL, '70553', 'CPT', 1500.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW()), -- MRI Brain with/without contrast
('dha-item-00023', '11111111-1111-1111-1111-111111111111', NULL, '76700', 'CPT', 400.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW()), -- Ultrasound Abdomen Complete

-- Procedures (DHA)
('dha-item-00030', '11111111-1111-1111-1111-111111111111', NULL, '45378', 'CPT', 2500.00, 'AED', 'procedure', NULL, NULL, NULL, 'procedure', 100, NOW(), NOW()), -- Colonoscopy
('dha-item-00031', '11111111-1111-1111-1111-111111111111', NULL, '43239', 'CPT', 2000.00, 'AED', 'procedure', NULL, NULL, NULL, 'procedure', 100, NOW(), NOW()), -- Upper GI Endoscopy
('dha-item-00032', '11111111-1111-1111-1111-111111111111', NULL, '93005', 'CPT', 300.00, 'AED', 'procedure', NULL, NULL, NULL, 'cardiology', 100, NOW(), NOW()), -- ECG Tracing
('dha-item-00033', '11111111-1111-1111-1111-111111111111', NULL, '93306', 'CPT', 800.00, 'AED', 'exam', NULL, NULL, NULL, 'cardiology', 100, NOW(), NOW()); -- Echocardiography

-- =====================================================
-- FEE SCHEDULE ITEMS - DOH (Abu Dhabi)
-- =====================================================

-- Consultation Fees (DOH) - Slightly higher than DHA
INSERT INTO fee_schedule_items (
  id,
  "feeScheduleId",
  "billingItemId",
  code,
  "codeType",
  "baseAmount",
  currency,
  unit,
  multiplier,
  "discountPct",
  "maxAllowedAmount",
  "serviceGroup",
  priority,
  "createdAt",
  "updatedAt"
) VALUES
('doh-item-00001', '22222222-2222-2222-2222-222222222222', NULL, '99201', 'CPT', 220.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('doh-item-00002', '22222222-2222-2222-2222-222222222222', NULL, '99202', 'CPT', 270.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('doh-item-00003', '22222222-2222-2222-2222-222222222222', NULL, '99203', 'CPT', 330.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('doh-item-00004', '22222222-2222-2222-2222-222222222222', NULL, '99204', 'CPT', 440.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('doh-item-00005', '22222222-2222-2222-2222-222222222222', NULL, '99205', 'CPT', 550.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),

-- Laboratory Tests (DOH)
('doh-item-00010', '22222222-2222-2222-2222-222222222222', NULL, '85025', 'CPT', 55.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()),
('doh-item-00011', '22222222-2222-2222-2222-222222222222', NULL, '80053', 'CPT', 165.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()),
('doh-item-00012', '22222222-2222-2222-2222-222222222222', NULL, '82947', 'CPT', 65.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()),
('doh-item-00013', '22222222-2222-2222-2222-222222222222', NULL, '83036', 'CPT', 88.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()),
('doh-item-00014', '22222222-2222-2222-2222-222222222222', NULL, '84443', 'CPT', 132.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()),

-- Imaging (DOH)
('doh-item-00020', '22222222-2222-2222-2222-222222222222', NULL, '71020', 'CPT', 275.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW()),
('doh-item-00021', '22222222-2222-2222-2222-222222222222', NULL, '70450', 'CPT', 880.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW()),
('doh-item-00022', '22222222-2222-2222-2222-222222222222', NULL, '70553', 'CPT', 1650.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW()),
('doh-item-00023', '22222222-2222-2222-2222-222222222222', NULL, '76700', 'CPT', 440.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW());

-- =====================================================
-- FEE SCHEDULE ITEMS - MOHAP (Federal)
-- =====================================================

-- Consultation Fees (MOHAP) - Lower than DHA/DOH
INSERT INTO fee_schedule_items (
  id,
  "feeScheduleId",
  "billingItemId",
  code,
  "codeType",
  "baseAmount",
  currency,
  unit,
  multiplier,
  "discountPct",
  "maxAllowedAmount",
  "serviceGroup",
  priority,
  "createdAt",
  "updatedAt"
) VALUES
('mohap-item-00001', '33333333-3333-3333-3333-333333333333', NULL, '99201', 'CPT', 150.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('mohap-item-00002', '33333333-3333-3333-3333-333333333333', NULL, '99202', 'CPT', 200.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('mohap-item-00003', '33333333-3333-3333-3333-333333333333', NULL, '99203', 'CPT', 250.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('mohap-item-00004', '33333333-3333-3333-3333-333333333333', NULL, '99204', 'CPT', 350.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),
('mohap-item-00005', '33333333-3333-3333-3333-333333333333', NULL, '99205', 'CPT', 450.00, 'AED', 'visit', NULL, NULL, NULL, 'consultation', 100, NOW(), NOW()),

-- Laboratory Tests (MOHAP)
('mohap-item-00010', '33333333-3333-3333-3333-333333333333', NULL, '85025', 'CPT', 45.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()),
('mohap-item-00011', '33333333-3333-3333-3333-333333333333', NULL, '80053', 'CPT', 135.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()),
('mohap-item-00012', '33333333-3333-3333-3333-333333333333', NULL, '82947', 'CPT', 50.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()),
('mohap-item-00013', '33333333-3333-3333-3333-333333333333', NULL, '83036', 'CPT', 70.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()),
('mohap-item-00014', '33333333-3333-3333-3333-333333333333', NULL, '84443', 'CPT', 100.00, 'AED', 'test', NULL, NULL, NULL, 'laboratory', 100, NOW(), NOW()),

-- Imaging (MOHAP)
('mohap-item-00020', '33333333-3333-3333-3333-333333333333', NULL, '71020', 'CPT', 200.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW()),
('mohap-item-00021', '33333333-3333-3333-3333-333333333333', NULL, '70450', 'CPT', 700.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW()),
('mohap-item-00022', '33333333-3333-3333-3333-333333333333', NULL, '70553', 'CPT', 1300.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW()),
('mohap-item-00023', '33333333-3333-3333-3333-333333333333', NULL, '76700', 'CPT', 350.00, 'AED', 'exam', NULL, NULL, NULL, 'radiology', 100, NOW(), NOW());

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count fee schedules and items
SELECT
  'Fee Schedules' as entity,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE status = 'active') as active_count
FROM fee_schedules
UNION ALL
SELECT
  'Fee Schedule Items' as entity,
  COUNT(*) as count,
  NULL as active_count
FROM fee_schedule_items;

-- Summary by authority
SELECT
  fs."authorityCode",
  fs."scheduleName",
  fs.version,
  fs."effectiveFrom",
  fs."effectiveTo",
  fs.status,
  COUNT(fsi.id) as item_count,
  COUNT(DISTINCT fsi."serviceGroup") as service_groups
FROM fee_schedules fs
LEFT JOIN fee_schedule_items fsi ON fs.id = fsi.fee_schedule_id
WHERE fs."tenantId" IS NULL
GROUP BY fs.id, fs."authorityCode", fs."scheduleName", fs.version, fs."effectiveFrom", fs."effectiveTo", fs.status
ORDER BY fs."authorityCode";

-- Sample price comparison for common CPT codes
SELECT
  fsi.code,
  fsi."codeType",
  fsi."serviceGroup",
  MAX(CASE WHEN fs."authorityCode" = 'DHA' THEN fsi."baseAmount" END) as dha_price,
  MAX(CASE WHEN fs."authorityCode" = 'DOH' THEN fsi."baseAmount" END) as doh_price,
  MAX(CASE WHEN fs."authorityCode" = 'MOHAP' THEN fsi."baseAmount" END) as mohap_price,
  fsi.currency
FROM fee_schedule_items fsi
JOIN fee_schedules fs ON fsi.fee_schedule_id = fs.id
WHERE fsi.code IN ('99201', '99203', '85025', '71020', '70450')
GROUP BY fsi.code, fsi."codeType", fsi."serviceGroup", fsi.currency
ORDER BY fsi.code;
