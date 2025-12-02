-- ============================================
-- Seed Data: Core ValueSets for Clinical Database
-- Database: zeal_clinical
-- Description: Essential valuesets for patient registration and clinical workflows
-- ============================================

-- ============================================
-- 1. NAME TITLES
-- ============================================
INSERT INTO value_sets (id, code, name, description, category, version, status, is_system, is_extensible, source, created_at, updated_at)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'name_titles',
  'Name Titles',
  'Common name titles and honorifics',
  'demographics',
  '1.0',
  'active',
  true,
  true,
  'ZEAL',
  NOW(),
  NOW()
);

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, sort_order, is_default, status, created_at, updated_at)
VALUES
  ('11000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'name_titles', 'mr', 'Mr.', 1, false, 'active', NOW(), NOW()),
  ('11000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'name_titles', 'mrs', 'Mrs.', 2, false, 'active', NOW(), NOW()),
  ('11000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'name_titles', 'ms', 'Ms.', 3, false, 'active', NOW(), NOW()),
  ('11000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'name_titles', 'miss', 'Miss', 4, false, 'active', NOW(), NOW()),
  ('11000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'name_titles', 'dr', 'Dr.', 5, false, 'active', NOW(), NOW()),
  ('11000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'name_titles', 'prof', 'Prof.', 6, false, 'active', NOW(), NOW()),
  ('11000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'name_titles', 'sheikh', 'Sheikh', 7, false, 'active', NOW(), NOW()),
  ('11000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', 'name_titles', 'sheikha', 'Sheikha', 8, false, 'active', NOW(), NOW());

-- Arabic translations for name titles
INSERT INTO value_set_concept_translations (id, concept_id, language_code, display, created_at, updated_at)
VALUES
  ('12000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 'ar', 'السيد', NOW(), NOW()),
  ('12000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000002', 'ar', 'السيدة', NOW(), NOW()),
  ('12000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', 'ar', 'الآنسة', NOW(), NOW()),
  ('12000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000004', 'ar', 'الآنسة', NOW(), NOW()),
  ('12000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000005', 'ar', 'الدكتور', NOW(), NOW()),
  ('12000000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000006', 'ar', 'البروفيسور', NOW(), NOW()),
  ('12000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000007', 'ar', 'الشيخ', NOW(), NOW()),
  ('12000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000008', 'ar', 'الشيخة', NOW(), NOW());

-- ============================================
-- 2. ADMINISTRATIVE GENDER
-- ============================================
INSERT INTO value_sets (id, code, name, description, category, version, status, is_system, is_extensible, source)
VALUES (
  '10000000-0000-0000-0000-000000000002',
  'administrative_gender',
  'Administrative Gender',
  'Gender for administrative purposes',
  'demographics',
  '1.0',
  'active',
  true,
  false,
  'HL7 FHIR'
);

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, definition, sort_order, is_default, status)
VALUES
  ('11000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', 'administrative_gender', 'male', 'Male', 'Male gender', 1, false, 'active'),
  ('11000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', 'administrative_gender', 'female', 'Female', 'Female gender', 2, false, 'active'),
  ('11000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000002', 'administrative_gender', 'other', 'Other', 'Other gender', 3, false, 'active'),
  ('11000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000002', 'administrative_gender', 'unknown', 'Unknown', 'Unknown gender', 4, false, 'active');

INSERT INTO value_set_concept_translations (id, concept_id, language_code, display)
VALUES
  ('12000000-0000-0000-0000-000000000011', '11000000-0000-0000-0000-000000000011', 'ar', 'ذكر'),
  ('12000000-0000-0000-0000-000000000012', '11000000-0000-0000-0000-000000000012', 'ar', 'أنثى'),
  ('12000000-0000-0000-0000-000000000013', '11000000-0000-0000-0000-000000000013', 'ar', 'آخر'),
  ('12000000-0000-0000-0000-000000000014', '11000000-0000-0000-0000-000000000014', 'ar', 'غير معروف');

-- ============================================
-- 3. BLOOD GROUPS (ABO + RH)
-- ============================================
INSERT INTO value_sets (id, code, name, description, category, version, status, is_system, is_extensible, source)
VALUES (
  '10000000-0000-0000-0000-000000000003',
  'blood_groups',
  'Blood Groups',
  'ABO blood group system with Rh factor',
  'clinical',
  '1.0',
  'active',
  true,
  false,
  'WHO'
);

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, sort_order, is_default, status)
VALUES
  ('11000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'a_positive', 'A+', 1, false, 'active'),
  ('11000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'a_negative', 'A-', 2, false, 'active'),
  ('11000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'b_positive', 'B+', 3, false, 'active'),
  ('11000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'b_negative', 'B-', 4, false, 'active'),
  ('11000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'ab_positive', 'AB+', 5, false, 'active'),
  ('11000000-0000-0000-0000-000000000026', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'ab_negative', 'AB-', 6, false, 'active'),
  ('11000000-0000-0000-0000-000000000027', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'o_positive', 'O+', 7, false, 'active'),
  ('11000000-0000-0000-0000-000000000028', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'o_negative', 'O-', 8, false, 'active');

INSERT INTO value_set_concept_translations (id, concept_id, language_code, display)
VALUES
  ('12000000-0000-0000-0000-000000000021', '11000000-0000-0000-0000-000000000021', 'ar', 'A+'),
  ('12000000-0000-0000-0000-000000000022', '11000000-0000-0000-0000-000000000022', 'ar', 'A-'),
  ('12000000-0000-0000-0000-000000000023', '11000000-0000-0000-0000-000000000023', 'ar', 'B+'),
  ('12000000-0000-0000-0000-000000000024', '11000000-0000-0000-0000-000000000024', 'ar', 'B-'),
  ('12000000-0000-0000-0000-000000000025', '11000000-0000-0000-0000-000000000025', 'ar', 'AB+'),
  ('12000000-0000-0000-0000-000000000026', '11000000-0000-0000-0000-000000000026', 'ar', 'AB-'),
  ('12000000-0000-0000-0000-000000000027', '11000000-0000-0000-0000-000000000027', 'ar', 'O+'),
  ('12000000-0000-0000-0000-000000000028', '11000000-0000-0000-0000-000000000028', 'ar', 'O-');

-- ============================================
-- 4. MARITAL STATUS
-- ============================================
INSERT INTO value_sets (id, code, name, description, category, version, status, is_system, is_extensible, source)
VALUES (
  '10000000-0000-0000-0000-000000000004',
  'marital_status',
  'Marital Status',
  'Marital status codes',
  'demographics',
  '1.0',
  'active',
  true,
  true,
  'HL7 FHIR'
);

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, sort_order, is_default, status)
VALUES
  ('11000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000004', 'marital_status', 'single', 'Single', 1, false, 'active'),
  ('11000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000004', 'marital_status', 'married', 'Married', 2, false, 'active'),
  ('11000000-0000-0000-0000-000000000033', '10000000-0000-0000-0000-000000000004', 'marital_status', 'divorced', 'Divorced', 3, false, 'active'),
  ('11000000-0000-0000-0000-000000000034', '10000000-0000-0000-0000-000000000004', 'marital_status', 'widowed', 'Widowed', 4, false, 'active'),
  ('11000000-0000-0000-0000-000000000035', '10000000-0000-0000-0000-000000000004', 'marital_status', 'separated', 'Separated', 5, false, 'active'),
  ('11000000-0000-0000-0000-000000000036', '10000000-0000-0000-0000-000000000004', 'marital_status', 'unknown', 'Unknown', 6, false, 'active');

INSERT INTO value_set_concept_translations (id, concept_id, language_code, display)
VALUES
  ('12000000-0000-0000-0000-000000000031', '11000000-0000-0000-0000-000000000031', 'ar', 'أعزب'),
  ('12000000-0000-0000-0000-000000000032', '11000000-0000-0000-0000-000000000032', 'ar', 'متزوج'),
  ('12000000-0000-0000-0000-000000000033', '11000000-0000-0000-0000-000000000033', 'ar', 'مطلق'),
  ('12000000-0000-0000-0000-000000000034', '11000000-0000-0000-0000-000000000034', 'ar', 'أرمل'),
  ('12000000-0000-0000-0000-000000000035', '11000000-0000-0000-0000-000000000035', 'ar', 'منفصل'),
  ('12000000-0000-0000-0000-000000000036', '11000000-0000-0000-0000-000000000036', 'ar', 'غير معروف');

-- ============================================
-- VERIFICATION QUERY
-- ============================================
SELECT
  vs.code as valueset_code,
  vs.name as valueset_name,
  COUNT(DISTINCT vsc.id) as concept_count,
  COUNT(DISTINCT vsct.id) as translation_count
FROM value_sets vs
LEFT JOIN value_set_concepts vsc ON vsc.value_set_id = vs.id
LEFT JOIN value_set_concept_translations vsct ON vsct.concept_id = vsc.id
WHERE vs.code IN ('name_titles', 'administrative_gender', 'blood_groups', 'marital_status')
GROUP BY vs.id, vs.code, vs.name
ORDER BY vs.code;
