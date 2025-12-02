-- ============================================
-- Comprehensive ValueSets Seed for Clinical Database
-- Database: zeal_clinical
-- Includes: All common valuesets with translations
-- ============================================

\echo '🌱 Seeding ValueSets...'

-- Set timestamps
\set ts 'NOW()'

-- ============================================
-- 1. NAME TITLES
-- ============================================
\echo '  → name_titles'
INSERT INTO value_sets (id, code, name, description, category, version, status, is_system, is_extensible, source, created_at, updated_at) VALUES
('10000000-0000-0000-0000-000000000001', 'name_titles', 'Name Titles', 'Common name titles and honorifics', 'demographics', '1.0', 'active', true, true, 'ZEAL', :ts, :ts);

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, sort_order, is_default, status, created_at, updated_at) VALUES
('11000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'name_titles', 'mr', 'Mr.', 1, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'name_titles', 'mrs', 'Mrs.', 2, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'name_titles', 'ms', 'Ms.', 3, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'name_titles', 'miss', 'Miss', 4, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'name_titles', 'dr', 'Dr.', 5, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'name_titles', 'prof', 'Prof.', 6, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'name_titles', 'sheikh', 'Sheikh', 7, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', 'name_titles', 'sheikha', 'Sheikha', 8, false, 'active', :ts, :ts);

INSERT INTO value_set_concept_translations (id, concept_id, language_code, display, created_at, updated_at) VALUES
('12000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 'ar', 'السيد', :ts, :ts),
('12000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000002', 'ar', 'السيدة', :ts, :ts),
('12000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', 'ar', 'الآنسة', :ts, :ts),
('12000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000004', 'ar', 'الآنسة', :ts, :ts),
('12000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000005', 'ar', 'الدكتور', :ts, :ts),
('12000000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000006', 'ar', 'البروفيسور', :ts, :ts),
('12000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000007', 'ar', 'الشيخ', :ts, :ts),
('12000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000008', 'ar', 'الشيخة', :ts, :ts);

-- ============================================
-- 2. ADMINISTRATIVE GENDER
-- ============================================
\echo '  → administrative_gender'
INSERT INTO value_sets (id, code, name, description, category, version, status, is_system, is_extensible, source, created_at, updated_at) VALUES
('10000000-0000-0000-0000-000000000002', 'administrative_gender', 'Administrative Gender', 'Gender for administrative purposes', 'demographics', '1.0', 'active', true, false, 'HL7 FHIR', :ts, :ts);

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, definition, sort_order, is_default, status, created_at, updated_at) VALUES
('11000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', 'administrative_gender', 'male', 'Male', 'Male gender', 1, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', 'administrative_gender', 'female', 'Female', 'Female gender', 2, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000002', 'administrative_gender', 'other', 'Other', 'Other gender', 3, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000002', 'administrative_gender', 'unknown', 'Unknown', 'Unknown gender', 4, false, 'active', :ts, :ts);

INSERT INTO value_set_concept_translations (id, concept_id, language_code, display, created_at, updated_at) VALUES
('12000000-0000-0000-0000-000000000011', '11000000-0000-0000-0000-000000000011', 'ar', 'ذكر', :ts, :ts),
('12000000-0000-0000-0000-000000000012', '11000000-0000-0000-0000-000000000012', 'ar', 'أنثى', :ts, :ts),
('12000000-0000-0000-0000-000000000013', '11000000-0000-0000-0000-000000000013', 'ar', 'آخر', :ts, :ts),
('12000000-0000-0000-0000-000000000014', '11000000-0000-0000-0000-000000000014', 'ar', 'غير معروف', :ts, :ts);

-- ============================================
-- 3. BLOOD GROUPS
-- ============================================
\echo '  → blood_groups'
INSERT INTO value_sets (id, code, name, description, category, version, status, is_system, is_extensible, source, created_at, updated_at) VALUES
('10000000-0000-0000-0000-000000000003', 'blood_groups', 'Blood Groups', 'ABO blood group system with Rh factor', 'clinical', '1.0', 'active', true, false, 'WHO', :ts, :ts);

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, sort_order, is_default, status, created_at, updated_at) VALUES
('11000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'a_positive', 'A+', 1, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'a_negative', 'A-', 2, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'b_positive', 'B+', 3, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'b_negative', 'B-', 4, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'ab_positive', 'AB+', 5, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000026', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'ab_negative', 'AB-', 6, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000027', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'o_positive', 'O+', 7, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000028', '10000000-0000-0000-0000-000000000003', 'blood_groups', 'o_negative', 'O-', 8, false, 'active', :ts, :ts);

-- ============================================
-- 4. MARITAL STATUS
-- ============================================
\echo '  → marital_status'
INSERT INTO value_sets (id, code, name, description, category, version, status, is_system, is_extensible, source, created_at, updated_at) VALUES
('10000000-0000-0000-0000-000000000004', 'marital_status', 'Marital Status', 'Marital status codes', 'demographics', '1.0', 'active', true, true, 'HL7 FHIR', :ts, :ts);

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, sort_order, is_default, status, created_at, updated_at) VALUES
('11000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000004', 'marital_status', 'single', 'Single', 1, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000004', 'marital_status', 'married', 'Married', 2, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000033', '10000000-0000-0000-0000-000000000004', 'marital_status', 'divorced', 'Divorced', 3, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000034', '10000000-0000-0000-0000-000000000004', 'marital_status', 'widowed', 'Widowed', 4, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000035', '10000000-0000-0000-0000-000000000004', 'marital_status', 'separated', 'Separated', 5, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000036', '10000000-0000-0000-0000-000000000004', 'marital_status', 'unknown', 'Unknown', 6, false, 'active', :ts, :ts);

INSERT INTO value_set_concept_translations (id, concept_id, language_code, display, created_at, updated_at) VALUES
('12000000-0000-0000-0000-000000000031', '11000000-0000-0000-0000-000000000031', 'ar', 'أعزب', :ts, :ts),
('12000000-0000-0000-0000-000000000032', '11000000-0000-0000-0000-000000000032', 'ar', 'متزوج', :ts, :ts),
('12000000-0000-0000-0000-000000000033', '11000000-0000-0000-0000-000000000033', 'ar', 'مطلق', :ts, :ts),
('12000000-0000-0000-0000-000000000034', '11000000-0000-0000-0000-000000000034', 'ar', 'أرمل', :ts, :ts),
('12000000-0000-0000-0000-000000000035', '11000000-0000-0000-0000-000000000035', 'ar', 'منفصل', :ts, :ts),
('12000000-0000-0000-0000-000000000036', '11000000-0000-0000-0000-000000000036', 'ar', 'غير معروف', :ts, :ts);

-- ============================================
-- 5. ISO 3166 COUNTRIES (GCC + Major countries)
-- ============================================
\echo '  → iso_3166_countries'
INSERT INTO value_sets (id, code, name, description, category, version, status, is_system, is_extensible, source, source_url, created_at, updated_at) VALUES
('10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'ISO 3166 Countries', 'ISO 3166-1 Alpha-2 country codes', 'administrative', '1.0', 'active', true, false, 'ISO 3166-1', 'https://www.iso.org/iso-3166-country-codes.html', :ts, :ts);

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, system_code, sort_order, is_default, status, created_at, updated_at) VALUES
-- GCC Countries
('11000000-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'AE', 'United Arab Emirates', 'ISO3166-1', 1, true, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'SA', 'Saudi Arabia', 'ISO3166-1', 2, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000103', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'BH', 'Bahrain', 'ISO3166-1', 3, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000104', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'KW', 'Kuwait', 'ISO3166-1', 4, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000105', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'OM', 'Oman', 'ISO3166-1', 5, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000106', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'QA', 'Qatar', 'ISO3166-1', 6, false, 'active', :ts, :ts),
-- South Asia
('11000000-0000-0000-0000-000000000111', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'IN', 'India', 'ISO3166-1', 20, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000112', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'PK', 'Pakistan', 'ISO3166-1', 21, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000113', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'BD', 'Bangladesh', 'ISO3166-1', 22, false, 'active', :ts, :ts),
-- Western Countries
('11000000-0000-0000-0000-000000000121', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'US', 'United States', 'ISO3166-1', 40, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000122', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'GB', 'United Kingdom', 'ISO3166-1', 41, false, 'active', :ts, :ts),
('11000000-0000-0000-0000-000000000123', '10000000-0000-0000-0000-000000000005', 'iso_3166_countries', 'CA', 'Canada', 'ISO3166-1', 42, false, 'active', :ts, :ts);

INSERT INTO value_set_concept_translations (id, concept_id, language_code, display, created_at, updated_at) VALUES
('12000000-0000-0000-0000-000000000101', '11000000-0000-0000-0000-000000000101', 'ar', 'الإمارات العربية المتحدة', :ts, :ts),
('12000000-0000-0000-0000-000000000102', '11000000-0000-0000-0000-000000000102', 'ar', 'المملكة العربية السعودية', :ts, :ts),
('12000000-0000-0000-0000-000000000103', '11000000-0000-0000-0000-000000000103', 'ar', 'البحرين', :ts, :ts);

\echo '✅ ValueSets seeded successfully!'

-- Verification
SELECT
  vs.code as valueset_code,
  vs.name as valueset_name,
  COUNT(DISTINCT vsc.id) as concept_count,
  COUNT(DISTINCT vsct.id) as translation_count
FROM value_sets vs
LEFT JOIN value_set_concepts vsc ON vsc.value_set_id = vs.id
LEFT JOIN value_set_concept_translations vsct ON vsct.concept_id = vsc.id
GROUP BY vs.id, vs.code, vs.name
ORDER BY vs.code;
