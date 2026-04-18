-- Packages Seed Data
-- Health check packages and wellness programs
-- Fixed UUIDs assigned so that zeal_rcm catalog mappings can reference them deterministically.
--
-- UUID mapping (f1111111-1111-1111-1111-11111111111x):
--   111 PKG-BASIC-HEALTH      112 PKG-EXECUTIVE-HEALTH  113 PKG-PREMIUM-HEALTH
--   114 PKG-WOMENS-HEALTH     115 PKG-MENS-HEALTH        116 PKG-SENIOR-HEALTH
--   117 PKG-YOUTH-HEALTH      118 PKG-DIABETES-SCREEN    119 PKG-CARDIAC-SCREEN
--   120 PKG-PRE-EMPLOYMENT    121 PKG-PRE-MARITAL

TRUNCATE packages CASCADE;

-- =============================================================================
-- PACKAGES
-- =============================================================================

INSERT INTO packages (
  id,
  tenant_id,
  code,
  name,
  description,
  package_type,
  gender_restriction,
  min_age_years,
  max_age_years,
  care_setting,
  validity_days,
  is_active,
  is_public,
  metadata,
  created_at,
  updated_at
) VALUES
  -- =========================================================================
  -- BASIC HEALTH CHECK PACKAGES
  -- =========================================================================
  (
    'f1111111-1111-1111-1111-111111111111'::UUID,
    '11111111-1111-1111-1111-111111111111',
    'PKG-BASIC-HEALTH',
    'Basic Health Check Package',
    'Essential health screening for general wellness monitoring',
    'health_check',
    NULL,
    18,
    NULL,
    'OP',
    90,
    true,
    true,
    '{"category": "wellness", "targetAudience": "adults", "popularity": "high"}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'f1111111-1111-1111-1111-111111111112'::UUID,
    '11111111-1111-1111-1111-111111111111',
    'PKG-EXECUTIVE-HEALTH',
    'Executive Health Check Package',
    'Comprehensive health screening for busy professionals',
    'health_check',
    NULL,
    25,
    65,
    'OP',
    180,
    true,
    true,
    '{"category": "executive", "targetAudience": "working_professionals", "popularity": "high"}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'f1111111-1111-1111-1111-111111111113'::UUID,
    '11111111-1111-1111-1111-111111111111',
    'PKG-PREMIUM-HEALTH',
    'Premium Health Check Package',
    'Advanced comprehensive health screening with specialized tests',
    'health_check',
    NULL,
    30,
    NULL,
    'OP',
    365,
    true,
    true,
    '{"category": "premium", "targetAudience": "high_risk", "popularity": "medium"}'::jsonb,
    NOW(),
    NOW()
  ),

  -- =========================================================================
  -- GENDER-SPECIFIC PACKAGES
  -- =========================================================================
  (
    'f1111111-1111-1111-1111-111111111114'::UUID,
    '11111111-1111-1111-1111-111111111111',
    'PKG-WOMENS-HEALTH',
    'Women''s Health Check Package',
    'Comprehensive health screening designed for women',
    'health_check',
    'female',
    18,
    NULL,
    'OP',
    180,
    true,
    true,
    '{"category": "womens_health", "targetAudience": "women", "includes": ["gynecological", "breast", "thyroid"]}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'f1111111-1111-1111-1111-111111111115'::UUID,
    '11111111-1111-1111-1111-111111111111',
    'PKG-MENS-HEALTH',
    'Men''s Health Check Package',
    'Comprehensive health screening designed for men',
    'health_check',
    'male',
    35,
    NULL,
    'OP',
    180,
    true,
    true,
    '{"category": "mens_health", "targetAudience": "men", "includes": ["prostate", "cardiac", "liver"]}'::jsonb,
    NOW(),
    NOW()
  ),

  -- =========================================================================
  -- AGE-SPECIFIC PACKAGES
  -- =========================================================================
  (
    'f1111111-1111-1111-1111-111111111116'::UUID,
    '11111111-1111-1111-1111-111111111111',
    'PKG-SENIOR-HEALTH',
    'Senior Citizen Health Check Package',
    'Specialized health screening for seniors focusing on age-related conditions',
    'health_check',
    NULL,
    60,
    NULL,
    'OP',
    180,
    true,
    true,
    '{"category": "geriatric", "targetAudience": "seniors", "includes": ["cardiac", "diabetes", "bone_density"]}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'f1111111-1111-1111-1111-111111111117'::UUID,
    '11111111-1111-1111-1111-111111111111',
    'PKG-YOUTH-HEALTH',
    'Youth Health Check Package',
    'Health screening for young adults and adolescents',
    'health_check',
    NULL,
    15,
    30,
    'OP',
    180,
    true,
    true,
    '{"category": "youth", "targetAudience": "young_adults"}'::jsonb,
    NOW(),
    NOW()
  ),

  -- =========================================================================
  -- CONDITION-SPECIFIC PACKAGES
  -- =========================================================================
  (
    'f1111111-1111-1111-1111-111111111118'::UUID,
    '11111111-1111-1111-1111-111111111111',
    'PKG-DIABETES-SCREEN',
    'Diabetes Screening Package',
    'Comprehensive screening for diabetes and related complications',
    'screening',
    NULL,
    18,
    NULL,
    'OP',
    90,
    true,
    true,
    '{"category": "diabetes", "targetAudience": "at_risk", "focus": "diabetes_management"}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'f1111111-1111-1111-1111-111111111119'::UUID,
    '11111111-1111-1111-1111-111111111111',
    'PKG-CARDIAC-SCREEN',
    'Cardiac Screening Package',
    'Comprehensive heart health evaluation',
    'screening',
    NULL,
    30,
    NULL,
    'OP',
    180,
    true,
    true,
    '{"category": "cardiac", "targetAudience": "at_risk", "focus": "cardiovascular_health"}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'f1111111-1111-1111-1111-111111111120'::UUID,
    '11111111-1111-1111-1111-111111111111',
    'PKG-PRE-EMPLOYMENT',
    'Pre-Employment Medical Check',
    'Standard medical examination for employment purposes',
    'employment',
    NULL,
    18,
    65,
    'OP',
    30,
    true,
    true,
    '{"category": "employment", "purpose": "pre_employment", "reportRequired": true}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'f1111111-1111-1111-1111-111111111121'::UUID,
    '11111111-1111-1111-1111-111111111111',
    'PKG-PRE-MARITAL',
    'Pre-Marital Health Check',
    'Comprehensive health screening for couples planning marriage',
    'screening',
    NULL,
    18,
    45,
    'OP',
    90,
    true,
    true,
    '{"category": "premarital", "targetAudience": "couples", "includes": ["genetic", "infectious_disease", "fertility"]}'::jsonb,
    NOW(),
    NOW()
  );

-- =============================================================================
-- PACKAGE ITEMS
-- =============================================================================

-- Helper function to safely get catalog ID
CREATE OR REPLACE FUNCTION get_catalog_id(p_catalog_type text, p_code text)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid;
BEGIN
  CASE p_catalog_type
    WHEN 'medication' THEN
      SELECT id INTO v_id FROM medication_master WHERE local_code = p_code LIMIT 1;
    WHEN 'lab_test' THEN
      SELECT id INTO v_id FROM lab_test_master WHERE local_code = p_code LIMIT 1;
    WHEN 'imaging_study' THEN
      SELECT id INTO v_id FROM imaging_study_master WHERE local_code = p_code LIMIT 1;
    WHEN 'procedure' THEN
      SELECT id INTO v_id FROM procedure_master WHERE local_code = p_code LIMIT 1;
    WHEN 'administrative_service' THEN
      SELECT id INTO v_id FROM administrative_services WHERE service_code = p_code LIMIT 1;
  END CASE;
  RETURN v_id;
END;
$$;

-- Insert package items for Basic Health Check Package
INSERT INTO package_items (
  id,
  package_id,
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  (SELECT id FROM packages WHERE code = 'PKG-BASIC-HEALTH'),
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  NOW(),
  NOW()
FROM (VALUES
  -- Registration & Consultation
  ('administrative_service', get_catalog_id('administrative_service', 'CONS-GP-NEW'), 1, true, false, 'Consultation', 1, 'General physician consultation'),

  -- Laboratory Tests
  ('lab_test', get_catalog_id('lab_test', 'LAB-001'), 1, true, false, 'Blood Tests', 10, 'Complete blood count'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-005'), 1, true, false, 'Blood Tests', 11, 'Fasting blood sugar'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-007'), 1, true, false, 'Blood Tests', 12, 'Lipid profile'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-010'), 1, true, false, 'Blood Tests', 13, 'Liver function test'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-008'), 1, true, false, 'Blood Tests', 14, 'Kidney function test'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-018'), 1, true, false, 'Urine Tests', 20, 'Routine urine analysis'),

  -- Imaging
  ('imaging_study', get_catalog_id('imaging_study', 'IMG-001'), 1, true, false, 'Imaging', 30, 'Chest X-ray')
) AS t(catalog_type, catalog_id, quantity, is_mandatory, clinical_only, group_name, sort_order, notes)
WHERE catalog_id IS NOT NULL;

-- Insert package items for Executive Health Check Package
INSERT INTO package_items (
  id,
  package_id,
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  (SELECT id FROM packages WHERE code = 'PKG-EXECUTIVE-HEALTH'),
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  NOW(),
  NOW()
FROM (VALUES
  -- Registration & Consultation
  ('administrative_service', get_catalog_id('administrative_service', 'CONS-SPEC-NEW'), 1, true, false, 'Consultation', 1, 'Specialist consultation'),

  -- Laboratory Tests - Comprehensive
  ('lab_test', get_catalog_id('lab_test', 'LAB-001'), 1, true, false, 'Blood Tests', 10, 'Complete blood count'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-005'), 1, true, false, 'Blood Tests', 11, 'Fasting blood sugar'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-006'), 1, true, false, 'Blood Tests', 12, 'HbA1c for diabetes monitoring'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-007'), 1, true, false, 'Blood Tests', 13, 'Lipid profile'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-010'), 1, true, false, 'Blood Tests', 14, 'Liver function test'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-008'), 1, true, false, 'Blood Tests', 15, 'Kidney function test'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-012'), 1, true, false, 'Blood Tests', 16, 'Thyroid function test'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-VIT-D'), 1, true, false, 'Blood Tests', 17, 'Vitamin D levels'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-VIT-B12'), 1, true, false, 'Blood Tests', 18, 'Vitamin B12 levels'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-018'), 1, true, false, 'Urine Tests', 20, 'Routine urine analysis'),

  -- Imaging
  ('imaging_study', get_catalog_id('imaging_study', 'IMG-001'), 1, true, false, 'Imaging', 30, 'Chest X-ray'),
  ('imaging_study', get_catalog_id('imaging_study', 'IMG-013'), 1, true, false, 'Imaging', 31, 'Abdominal ultrasound'),

  -- Procedures
  ('procedure', get_catalog_id('procedure', 'PROC-ECG'), 1, true, false, 'Cardiac Tests', 40, 'Electrocardiogram')
) AS t(catalog_type, catalog_id, quantity, is_mandatory, clinical_only, group_name, sort_order, notes)
WHERE catalog_id IS NOT NULL;

-- Insert package items for Premium Health Check Package
INSERT INTO package_items (
  id,
  package_id,
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  (SELECT id FROM packages WHERE code = 'PKG-PREMIUM-HEALTH'),
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  NOW(),
  NOW()
FROM (VALUES
  -- Registration & Consultation
  ('administrative_service', get_catalog_id('administrative_service', 'CONS-SPEC-NEW'), 1, true, false, 'Consultation', 1, 'Specialist consultation'),

  -- Laboratory Tests - Comprehensive
  ('lab_test', get_catalog_id('lab_test', 'LAB-001'), 1, true, false, 'Blood Tests', 10, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-005'), 1, true, false, 'Blood Tests', 11, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-006'), 1, true, false, 'Blood Tests', 12, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-007'), 1, true, false, 'Blood Tests', 13, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-010'), 1, true, false, 'Blood Tests', 14, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-008'), 1, true, false, 'Blood Tests', 15, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-012'), 1, true, false, 'Blood Tests', 16, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-VIT-D'), 1, true, false, 'Blood Tests', 17, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-VIT-B12'), 1, true, false, 'Blood Tests', 18, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-018'), 1, true, false, 'Urine Tests', 20, NULL),

  -- Imaging - Comprehensive
  ('imaging_study', get_catalog_id('imaging_study', 'IMG-001'), 1, true, false, 'Imaging', 30, NULL),
  ('imaging_study', get_catalog_id('imaging_study', 'IMG-013'), 1, true, false, 'Imaging', 31, NULL),
  ('imaging_study', get_catalog_id('imaging_study', 'IMG-014'), 1, false, false, 'Imaging', 32, 'Optional based on gender'),

  -- Procedures
  ('procedure', get_catalog_id('procedure', 'PROC-ECG'), 1, true, false, 'Cardiac Tests', 40, NULL),
  ('procedure', get_catalog_id('procedure', 'PROC-ECHO'), 1, true, false, 'Cardiac Tests', 41, 'Echocardiography'),
  ('procedure', get_catalog_id('procedure', 'PROC-TMT'), 1, false, false, 'Cardiac Tests', 42, 'Treadmill test - optional')
) AS t(catalog_type, catalog_id, quantity, is_mandatory, clinical_only, group_name, sort_order, notes)
WHERE catalog_id IS NOT NULL;

-- Insert package items for Women's Health Check Package
INSERT INTO package_items (
  id,
  package_id,
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  (SELECT id FROM packages WHERE code = 'PKG-WOMENS-HEALTH'),
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  NOW(),
  NOW()
FROM (VALUES
  -- Consultation
  ('administrative_service', get_catalog_id('administrative_service', 'CONS-SPEC-NEW'), 1, true, false, 'Consultation', 1, 'Gynecology consultation'),

  -- Laboratory Tests
  ('lab_test', get_catalog_id('lab_test', 'LAB-001'), 1, true, false, 'Blood Tests', 10, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-005'), 1, true, false, 'Blood Tests', 11, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-012'), 1, true, false, 'Blood Tests', 12, 'Thyroid screening'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-VIT-D'), 1, true, false, 'Blood Tests', 13, 'Vitamin D'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-018'), 1, true, false, 'Urine Tests', 20, NULL),

  -- Imaging - Women specific
  ('imaging_study', get_catalog_id('imaging_study', 'IMG-014'), 1, true, false, 'Imaging', 30, 'Pelvic ultrasound'),
  ('imaging_study', get_catalog_id('imaging_study', 'IMG-017'), 1, false, false, 'Imaging', 31, 'Mammography for age >40')
) AS t(catalog_type, catalog_id, quantity, is_mandatory, clinical_only, group_name, sort_order, notes)
WHERE catalog_id IS NOT NULL;

-- Insert package items for Diabetes Screening Package
INSERT INTO package_items (
  id,
  package_id,
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  (SELECT id FROM packages WHERE code = 'PKG-DIABETES-SCREEN'),
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  NOW(),
  NOW()
FROM (VALUES
  -- Consultation
  ('administrative_service', get_catalog_id('administrative_service', 'CONS-GP-NEW'), 1, true, false, 'Consultation', 1, 'Physician consultation'),

  -- Laboratory Tests - Diabetes specific
  ('lab_test', get_catalog_id('lab_test', 'LAB-005'), 1, true, false, 'Blood Tests', 10, 'Fasting blood sugar'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-006'), 1, true, false, 'Blood Tests', 11, 'HbA1c'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-007'), 1, true, false, 'Blood Tests', 12, 'Lipid profile'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-008'), 1, true, false, 'Blood Tests', 13, 'Kidney function'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-018'), 1, true, false, 'Urine Tests', 20, 'Urine microalbumin')
) AS t(catalog_type, catalog_id, quantity, is_mandatory, clinical_only, group_name, sort_order, notes)
WHERE catalog_id IS NOT NULL;

-- Insert package items for Cardiac Screening Package
INSERT INTO package_items (
  id,
  package_id,
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  (SELECT id FROM packages WHERE code = 'PKG-CARDIAC-SCREEN'),
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  NOW(),
  NOW()
FROM (VALUES
  -- Consultation
  ('administrative_service', get_catalog_id('administrative_service', 'CONS-SPEC-NEW'), 1, true, false, 'Consultation', 1, 'Cardiologist consultation'),

  -- Laboratory Tests - Cardiac specific
  ('lab_test', get_catalog_id('lab_test', 'LAB-007'), 1, true, false, 'Blood Tests', 10, 'Lipid profile'),
  ('lab_test', get_catalog_id('lab_test', 'LAB-005'), 1, true, false, 'Blood Tests', 11, 'Blood sugar'),

  -- Procedures
  ('procedure', get_catalog_id('procedure', 'PROC-ECG'), 1, true, false, 'Cardiac Tests', 20, 'ECG'),
  ('procedure', get_catalog_id('procedure', 'PROC-ECHO'), 1, true, false, 'Cardiac Tests', 21, 'Echocardiography'),
  ('procedure', get_catalog_id('procedure', 'PROC-TMT'), 1, true, false, 'Cardiac Tests', 22, 'Treadmill test'),

  -- Imaging
  ('imaging_study', get_catalog_id('imaging_study', 'IMG-001'), 1, true, false, 'Imaging', 30, 'Chest X-ray')
) AS t(catalog_type, catalog_id, quantity, is_mandatory, clinical_only, group_name, sort_order, notes)
WHERE catalog_id IS NOT NULL;

-- Insert package items for Pre-Employment Medical Check
INSERT INTO package_items (
  id,
  package_id,
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  (SELECT id FROM packages WHERE code = 'PKG-PRE-EMPLOYMENT'),
  catalog_type,
  catalog_id,
  quantity,
  is_mandatory,
  clinical_only,
  group_name,
  sort_order,
  notes,
  NOW(),
  NOW()
FROM (VALUES
  -- Consultation & Report
  ('administrative_service', get_catalog_id('administrative_service', 'CONS-GP-NEW'), 1, true, false, 'Consultation', 1, 'Medical examination'),
  ('administrative_service', get_catalog_id('administrative_service', 'ADMIN-MED-CERT'), 1, true, false, 'Documentation', 2, 'Fitness certificate'),

  -- Laboratory Tests - Basic
  ('lab_test', get_catalog_id('lab_test', 'LAB-001'), 1, true, false, 'Blood Tests', 10, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-005'), 1, true, false, 'Blood Tests', 11, NULL),
  ('lab_test', get_catalog_id('lab_test', 'LAB-018'), 1, true, false, 'Urine Tests', 20, NULL),

  -- Imaging
  ('imaging_study', get_catalog_id('imaging_study', 'IMG-001'), 1, true, false, 'Imaging', 30, 'Chest X-ray for TB screening')
) AS t(catalog_type, catalog_id, quantity, is_mandatory, clinical_only, group_name, sort_order, notes)
WHERE catalog_id IS NOT NULL;

-- Drop helper function
DROP FUNCTION IF EXISTS get_catalog_id(text, text);

-- Verification queries
SELECT
  p.code,
  p.name,
  p.package_type,
  COUNT(pi.id) as item_count
FROM packages p
LEFT JOIN package_items pi ON p.id = pi.package_id
GROUP BY p.id, p.code, p.name, p.package_type
ORDER BY p.code;

SELECT
  p.name as package_name,
  pi.catalog_type,
  pi.group_name,
  pi.is_mandatory,
  pi.sort_order
FROM packages p
JOIN package_items pi ON p.id = pi.package_id
WHERE p.code = 'PKG-EXECUTIVE-HEALTH'
ORDER BY pi.sort_order;
