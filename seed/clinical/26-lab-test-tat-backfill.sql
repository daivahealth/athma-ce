-- Lab Test TAT Backfill
-- Ensures seeded lab_test_master rows have explicit turnaround targets so
-- result pages can compute TAT status consistently.

UPDATE lab_test_master
SET turnaround_time_hours = CASE local_code
  WHEN 'LAB-001' THEN 2   -- Complete Blood Count (CBC)
  WHEN 'LAB-002' THEN 2   -- Hemoglobin
  WHEN 'LAB-003' THEN 2   -- Platelet Count
  WHEN 'LAB-004' THEN 4   -- Comprehensive Metabolic Panel (CMP)
  WHEN 'LAB-005' THEN 2   -- Fasting Blood Glucose
  WHEN 'LAB-006' THEN 24  -- HbA1c
  WHEN 'LAB-007' THEN 4   -- Lipid Panel
  WHEN 'LAB-008' THEN 2   -- Creatinine, Serum
  WHEN 'LAB-009' THEN 2   -- eGFR
  WHEN 'LAB-010' THEN 4   -- Liver Function Tests (LFT)
  WHEN 'LAB-011' THEN 2   -- ALT
  WHEN 'LAB-012' THEN 6   -- TSH
  WHEN 'LAB-013' THEN 6   -- Free T4
  WHEN 'LAB-014' THEN 48  -- Urine Culture
  WHEN 'LAB-015' THEN 72  -- Blood Culture
  WHEN 'LAB-016' THEN 4   -- CRP
  WHEN 'LAB-017' THEN 2   -- PT/INR
  WHEN 'LAB-018' THEN 1   -- Urinalysis, Complete
  ELSE turnaround_time_hours
END,
updated_at = NOW()
WHERE local_code IN (
  'LAB-001',
  'LAB-002',
  'LAB-003',
  'LAB-004',
  'LAB-005',
  'LAB-006',
  'LAB-007',
  'LAB-008',
  'LAB-009',
  'LAB-010',
  'LAB-011',
  'LAB-012',
  'LAB-013',
  'LAB-014',
  'LAB-015',
  'LAB-016',
  'LAB-017',
  'LAB-018'
);
