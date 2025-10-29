-- Migration: Seed ValueSet Data
-- Description: Initial data for common valuesets
-- Author: System
-- Date: 2025-10-28

-- ============================================================================
-- 1. ISO 3166 COUNTRIES
-- ============================================================================

INSERT INTO value_sets (code, name, description, category, version, source, is_system, is_extensible)
VALUES (
  'iso_3166_countries',
  'ISO 3166 Countries',
  'Country codes as per ISO 3166-1 alpha-2 standard',
  'geography',
  '2024.1',
  'ISO 3166-1',
  true,
  false
) ON CONFLICT (code) DO NOTHING;

-- Insert countries
INSERT INTO value_set_concepts (value_set_id, code, display, sort_order, status)
SELECT
  (SELECT id FROM value_sets WHERE code = 'iso_3166_countries'),
  code,
  name,
  sort_order,
  'active'
FROM (VALUES
  ('AE', 'United Arab Emirates', 1),
  ('SA', 'Saudi Arabia', 2),
  ('QA', 'Qatar', 3),
  ('BH', 'Bahrain', 4),
  ('KW', 'Kuwait', 5),
  ('OM', 'Oman', 6),
  ('EG', 'Egypt', 7),
  ('JO', 'Jordan', 8),
  ('LB', 'Lebanon', 9),
  ('MA', 'Morocco', 10),
  ('TN', 'Tunisia', 11),
  ('DZ', 'Algeria', 12),
  ('IQ', 'Iraq', 13),
  ('YE', 'Yemen', 14),
  ('SY', 'Syria', 15),
  ('PS', 'Palestine', 16),
  ('LY', 'Libya', 17),
  ('SD', 'Sudan', 18),
  ('IN', 'India', 19),
  ('PK', 'Pakistan', 20),
  ('BD', 'Bangladesh', 21),
  ('PH', 'Philippines', 22),
  ('NP', 'Nepal', 23),
  ('LK', 'Sri Lanka', 24),
  ('US', 'United States', 25),
  ('GB', 'United Kingdom', 26),
  ('CA', 'Canada', 27),
  ('AU', 'Australia', 28),
  ('FR', 'France', 29),
  ('DE', 'Germany', 30),
  ('IT', 'Italy', 31),
  ('ES', 'Spain', 32),
  ('CN', 'China', 33),
  ('JP', 'Japan', 34),
  ('KR', 'South Korea', 35),
  ('SG', 'Singapore', 36),
  ('MY', 'Malaysia', 37),
  ('TH', 'Thailand', 38),
  ('ID', 'Indonesia', 39),
  ('ZA', 'South Africa', 40),
  ('NG', 'Nigeria', 41),
  ('KE', 'Kenya', 42),
  ('ET', 'Ethiopia', 43),
  ('BR', 'Brazil', 44),
  ('MX', 'Mexico', 45),
  ('AR', 'Argentina', 46),
  ('RU', 'Russia', 47),
  ('TR', 'Turkey', 48),
  ('IR', 'Iran', 49),
  ('AF', 'Afghanistan', 50)
) AS countries(code, name, sort_order)
ON CONFLICT (value_set_id, code) DO NOTHING;

-- Arabic translations for top MENA countries
INSERT INTO value_set_concept_translations (concept_id, language_code, display)
SELECT
  vsc.id,
  'ar',
  translations.display_ar
FROM value_set_concepts vsc
JOIN value_sets vs ON vsc.value_set_id = vs.id
JOIN (VALUES
  ('AE', 'الإمارات العربية المتحدة'),
  ('SA', 'المملكة العربية السعودية'),
  ('QA', 'قطر'),
  ('BH', 'البحرين'),
  ('KW', 'الكويت'),
  ('OM', 'عُمان'),
  ('EG', 'مصر'),
  ('JO', 'الأردن'),
  ('LB', 'لبنان'),
  ('MA', 'المغرب'),
  ('TN', 'تونس'),
  ('DZ', 'الجزائر'),
  ('IQ', 'العراق'),
  ('YE', 'اليمن'),
  ('SY', 'سوريا'),
  ('PS', 'فلسطين'),
  ('LY', 'ليبيا'),
  ('SD', 'السودان')
) AS translations(code, display_ar) ON vsc.code = translations.code
WHERE vs.code = 'iso_3166_countries'
ON CONFLICT (concept_id, language_code) DO NOTHING;

-- ============================================================================
-- 2. ADMINISTRATIVE GENDER (FHIR)
-- ============================================================================

INSERT INTO value_sets (code, name, description, category, source, is_system, is_extensible)
VALUES (
  'administrative_gender',
  'Administrative Gender',
  'Gender for administrative purposes (FHIR compliant)',
  'demographics',
  'FHIR R4',
  true,
  false
) ON CONFLICT (code) DO NOTHING;

INSERT INTO value_set_concepts (value_set_id, code, display, definition, sort_order, status)
SELECT
  (SELECT id FROM value_sets WHERE code = 'administrative_gender'),
  code,
  display,
  definition,
  sort_order,
  'active'
FROM (VALUES
  ('male', 'Male', 'Male gender', 1),
  ('female', 'Female', 'Female gender', 2),
  ('other', 'Other', 'Other gender', 3),
  ('unknown', 'Unknown', 'Unknown gender', 4)
) AS genders(code, display, definition, sort_order)
ON CONFLICT (value_set_id, code) DO NOTHING;

-- Arabic translations
INSERT INTO value_set_concept_translations (concept_id, language_code, display)
SELECT
  vsc.id,
  'ar',
  translations.display_ar
FROM value_set_concepts vsc
JOIN value_sets vs ON vsc.value_set_id = vs.id
JOIN (VALUES
  ('male', 'ذكر'),
  ('female', 'أنثى'),
  ('other', 'آخر'),
  ('unknown', 'غير معروف')
) AS translations(code, display_ar) ON vsc.code = translations.code
WHERE vs.code = 'administrative_gender'
ON CONFLICT (concept_id, language_code) DO NOTHING;

-- ============================================================================
-- 3. BLOOD GROUPS
-- ============================================================================

INSERT INTO value_sets (code, name, description, category, is_system, is_extensible)
VALUES (
  'blood_groups',
  'Blood Groups',
  'ABO and Rh blood group system',
  'medical',
  true,
  false
) ON CONFLICT (code) DO NOTHING;

INSERT INTO value_set_concepts (value_set_id, code, display, sort_order, status)
SELECT
  (SELECT id FROM value_sets WHERE code = 'blood_groups'),
  code,
  display,
  sort_order,
  'active'
FROM (VALUES
  ('A+', 'A Positive', 1),
  ('A-', 'A Negative', 2),
  ('B+', 'B Positive', 3),
  ('B-', 'B Negative', 4),
  ('AB+', 'AB Positive', 5),
  ('AB-', 'AB Negative', 6),
  ('O+', 'O Positive', 7),
  ('O-', 'O Negative', 8),
  ('unknown', 'Unknown', 9)
) AS blood_groups(code, display, sort_order)
ON CONFLICT (value_set_id, code) DO NOTHING;

-- Arabic translations
INSERT INTO value_set_concept_translations (concept_id, language_code, display)
SELECT
  vsc.id,
  'ar',
  translations.display_ar
FROM value_set_concepts vsc
JOIN value_sets vs ON vsc.value_set_id = vs.id
JOIN (VALUES
  ('A+', 'A موجب'),
  ('A-', 'A سالب'),
  ('B+', 'B موجب'),
  ('B-', 'B سالب'),
  ('AB+', 'AB موجب'),
  ('AB-', 'AB سالب'),
  ('O+', 'O موجب'),
  ('O-', 'O سالب'),
  ('unknown', 'غير معروف')
) AS translations(code, display_ar) ON vsc.code = translations.code
WHERE vs.code = 'blood_groups'
ON CONFLICT (concept_id, language_code) DO NOTHING;

-- ============================================================================
-- 4. MARITAL STATUS (FHIR)
-- ============================================================================

INSERT INTO value_sets (code, name, description, category, source, is_system, is_extensible)
VALUES (
  'marital_status',
  'Marital Status',
  'Civil or marital status of a person (FHIR compliant)',
  'demographics',
  'FHIR R4',
  true,
  false
) ON CONFLICT (code) DO NOTHING;

INSERT INTO value_set_concepts (value_set_id, code, display, sort_order, status)
SELECT
  (SELECT id FROM value_sets WHERE code = 'marital_status'),
  code,
  display,
  sort_order,
  'active'
FROM (VALUES
  ('S', 'Single', 1),
  ('M', 'Married', 2),
  ('D', 'Divorced', 3),
  ('W', 'Widowed', 4),
  ('L', 'Legally Separated', 5),
  ('UNK', 'Unknown', 6)
) AS statuses(code, display, sort_order)
ON CONFLICT (value_set_id, code) DO NOTHING;

-- Arabic translations
INSERT INTO value_set_concept_translations (concept_id, language_code, display)
SELECT
  vsc.id,
  'ar',
  translations.display_ar
FROM value_set_concepts vsc
JOIN value_sets vs ON vsc.value_set_id = vs.id
JOIN (VALUES
  ('S', 'أعزب/عزباء'),
  ('M', 'متزوج/متزوجة'),
  ('D', 'مطلق/مطلقة'),
  ('W', 'أرمل/أرملة'),
  ('L', 'منفصل قانونياً'),
  ('UNK', 'غير معروف')
) AS translations(code, display_ar) ON vsc.code = translations.code
WHERE vs.code = 'marital_status'
ON CONFLICT (concept_id, language_code) DO NOTHING;

-- ============================================================================
-- 5. ISO 639 LANGUAGES
-- ============================================================================

INSERT INTO value_sets (code, name, description, category, source, is_system, is_extensible)
VALUES (
  'iso_639_languages',
  'ISO 639 Languages',
  'Language codes as per ISO 639-1 standard',
  'localization',
  'ISO 639-1',
  true,
  false
) ON CONFLICT (code) DO NOTHING;

INSERT INTO value_set_concepts (value_set_id, code, display, sort_order, status)
SELECT
  (SELECT id FROM value_sets WHERE code = 'iso_639_languages'),
  code,
  display,
  sort_order,
  'active'
FROM (VALUES
  ('en', 'English', 1),
  ('ar', 'Arabic', 2),
  ('fr', 'French', 3),
  ('es', 'Spanish', 4),
  ('hi', 'Hindi', 5),
  ('ur', 'Urdu', 6),
  ('bn', 'Bengali', 7),
  ('tl', 'Tagalog', 8),
  ('ml', 'Malayalam', 9),
  ('ta', 'Tamil', 10),
  ('te', 'Telugu', 11),
  ('zh', 'Chinese', 12),
  ('ru', 'Russian', 13),
  ('de', 'German', 14),
  ('it', 'Italian', 15)
) AS languages(code, display, sort_order)
ON CONFLICT (value_set_id, code) DO NOTHING;

-- Arabic translations
INSERT INTO value_set_concept_translations (concept_id, language_code, display)
SELECT
  vsc.id,
  'ar',
  translations.display_ar
FROM value_set_concepts vsc
JOIN value_sets vs ON vsc.value_set_id = vs.id
JOIN (VALUES
  ('en', 'الإنجليزية'),
  ('ar', 'العربية'),
  ('fr', 'الفرنسية'),
  ('es', 'الإسبانية'),
  ('hi', 'الهندية'),
  ('ur', 'الأردية'),
  ('bn', 'البنغالية')
) AS translations(code, display_ar) ON vsc.code = translations.code
WHERE vs.code = 'iso_639_languages'
ON CONFLICT (concept_id, language_code) DO NOTHING;

-- ============================================================================
-- 6. ISO 4217 CURRENCIES
-- ============================================================================

INSERT INTO value_sets (code, name, description, category, source, is_system, is_extensible)
VALUES (
  'iso_4217_currencies',
  'ISO 4217 Currencies',
  'Currency codes as per ISO 4217 standard',
  'financial',
  'ISO 4217',
  true,
  false
) ON CONFLICT (code) DO NOTHING;

INSERT INTO value_set_concepts (value_set_id, code, display, sort_order, status)
SELECT
  (SELECT id FROM value_sets WHERE code = 'iso_4217_currencies'),
  code,
  display,
  sort_order,
  'active'
FROM (VALUES
  ('AED', 'UAE Dirham', 1),
  ('SAR', 'Saudi Riyal', 2),
  ('QAR', 'Qatari Riyal', 3),
  ('BHD', 'Bahraini Dinar', 4),
  ('KWD', 'Kuwaiti Dinar', 5),
  ('OMR', 'Omani Rial', 6),
  ('EGP', 'Egyptian Pound', 7),
  ('USD', 'US Dollar', 8),
  ('EUR', 'Euro', 9),
  ('GBP', 'British Pound', 10),
  ('INR', 'Indian Rupee', 11),
  ('PKR', 'Pakistani Rupee', 12)
) AS currencies(code, display, sort_order)
ON CONFLICT (value_set_id, code) DO NOTHING;

-- Arabic translations
INSERT INTO value_set_concept_translations (concept_id, language_code, display)
SELECT
  vsc.id,
  'ar',
  translations.display_ar
FROM value_set_concepts vsc
JOIN value_sets vs ON vsc.value_set_id = vs.id
JOIN (VALUES
  ('AED', 'درهم إماراتي'),
  ('SAR', 'ريال سعودي'),
  ('QAR', 'ريال قطري'),
  ('BHD', 'دينار بحريني'),
  ('KWD', 'دينار كويتي'),
  ('OMR', 'ريال عماني'),
  ('EGP', 'جنيه مصري'),
  ('USD', 'دولار أمريكي'),
  ('EUR', 'يورو'),
  ('GBP', 'جنيه إسترليني')
) AS translations(code, display_ar) ON vsc.code = translations.code
WHERE vs.code = 'iso_4217_currencies'
ON CONFLICT (concept_id, language_code) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Uncomment to verify data after migration:
-- SELECT vs.code, vs.name, COUNT(vsc.id) as concept_count
-- FROM value_sets vs
-- LEFT JOIN value_set_concepts vsc ON vs.id = vsc.value_set_id
-- GROUP BY vs.id, vs.code, vs.name
-- ORDER BY vs.code;
