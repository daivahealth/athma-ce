-- Value Sets for Patient Registration and Clinical Operations
-- Provides dropdown options for forms (Title, Gender, Country, Nationality, etc.)

-- Clean up existing valuesets and concepts
DELETE FROM value_set_concepts WHERE value_set_code IN (
  'name_titles', 'administrative_gender', 'marital_status', 'blood_groups',
  'national_id_type', 'iso_3166_countries', 'nationalities', 'iso_639_languages',
  'patient_status', 'registration_source'
);
DELETE FROM value_sets WHERE code IN (
  'name_titles', 'administrative_gender', 'marital_status', 'blood_groups',
  'national_id_type', 'iso_3166_countries', 'nationalities', 'iso_639_languages',
  'patient_status', 'registration_source'
);

-- =============================================================================
-- TITLE VALUE SET
-- =============================================================================
INSERT INTO value_sets (id, code, name, description, category, status, is_system, is_extensible, source, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'name_titles', 'Person Title', 'Honorific titles for addressing individuals', 'demographics', 'active', true, true, 'ZEAL_SYSTEM', NOW(), NOW());

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, sort_order, is_default, status, created_at, updated_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM value_sets WHERE code = 'name_titles'),
  'name_titles',
  code,
  display,
  sort_order,
  is_default,
  'active',
  NOW(),
  NOW()
FROM (VALUES
  ('mr', 'Mr', 1, false),
  ('mrs', 'Mrs', 2, false),
  ('ms', 'Ms', 3, false),
  ('miss', 'Miss', 4, false),
  ('dr', 'Dr', 5, false),
  ('prof', 'Prof', 6, false),
  ('sheikh', 'Sheikh', 7, false),
  ('sheikha', 'Sheikha', 8, false)
) AS t(code, display, sort_order, is_default);

-- =============================================================================
-- GENDER VALUE SET
-- =============================================================================
INSERT INTO value_sets (id, code, name, description, category, status, is_system, is_extensible, source, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'administrative_gender', 'Gender', 'Biological or administrative gender', 'demographics', 'active', true, false, 'HL7_FHIR', NOW(), NOW());

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, definition, sort_order, is_default, status, created_at, updated_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM value_sets WHERE code = 'administrative_gender'),
  'administrative_gender',
  code,
  display,
  definition,
  sort_order,
  is_default,
  'active',
  NOW(),
  NOW()
FROM (VALUES
  ('male', 'Male', 'Male gender', 1, false),
  ('female', 'Female', 'Female gender', 2, false),
  ('other', 'Other', 'Other or non-binary gender', 3, false),
  ('unknown', 'Unknown', 'Gender not known', 4, false)
) AS t(code, display, definition, sort_order, is_default);

-- =============================================================================
-- MARITAL STATUS VALUE SET
-- =============================================================================
INSERT INTO value_sets (id, code, name, description, category, status, is_system, is_extensible, source, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'marital_status', 'Marital Status', 'Civil marital status of a person', 'demographics', 'active', true, true, 'HL7_FHIR', NOW(), NOW());

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, sort_order, is_default, status, created_at, updated_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM value_sets WHERE code = 'marital_status'),
  'marital_status',
  code,
  display,
  sort_order,
  is_default,
  'active',
  NOW(),
  NOW()
FROM (VALUES
  ('single', 'Single', 1, false),
  ('married', 'Married', 2, false),
  ('divorced', 'Divorced', 3, false),
  ('widowed', 'Widowed', 4, false),
  ('separated', 'Separated', 5, false),
  ('domestic_partner', 'Domestic Partner', 6, false),
  ('unknown', 'Unknown', 7, false)
) AS t(code, display, sort_order, is_default);

-- =============================================================================
-- BLOOD GROUP VALUE SET
-- =============================================================================
INSERT INTO value_sets (id, code, name, description, category, status, is_system, is_extensible, source, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'blood_groups', 'Blood Group', 'ABO and Rh blood group types', 'clinical', 'active', true, false, 'SNOMED_CT', NOW(), NOW());

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, sort_order, is_default, status, created_at, updated_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM value_sets WHERE code = 'blood_groups'),
  'blood_groups',
  code,
  display,
  sort_order,
  is_default,
  'active',
  NOW(),
  NOW()
FROM (VALUES
  ('A+', 'A Positive', 1, false),
  ('A-', 'A Negative', 2, false),
  ('B+', 'B Positive', 3, false),
  ('B-', 'B Negative', 4, false),
  ('AB+', 'AB Positive', 5, false),
  ('AB-', 'AB Negative', 6, false),
  ('O+', 'O Positive', 7, false),
  ('O-', 'O Negative', 8, false),
  ('unknown', 'Unknown', 9, false)
) AS t(code, display, sort_order, is_default);

-- =============================================================================
-- NATIONAL ID TYPE VALUE SET
-- =============================================================================
INSERT INTO value_sets (id, code, name, description, category, status, is_system, is_extensible, source, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'national_id_type', 'National ID Type', 'Types of national identification documents', 'identity', 'active', true, true, 'ZEAL_SYSTEM', NOW(), NOW());

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, definition, sort_order, is_default, status, created_at, updated_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM value_sets WHERE code = 'national_id_type'),
  'national_id_type',
  code,
  display,
  definition,
  sort_order,
  is_default,
  'active',
  NOW(),
  NOW()
FROM (VALUES
  ('emirates_id', 'Emirates ID', 'UAE National ID Card', 1, true),
  ('gcc_id', 'GCC ID', 'GCC National ID', 2, false),
  ('passport', 'Passport', 'International Passport', 3, false),
  ('visa', 'Visa', 'Visa Document', 4, false),
  ('residence_permit', 'Residence Permit', 'Residence Permit', 5, false),
  ('aadhaar', 'Aadhaar', 'India Aadhaar Card', 6, false),
  ('nric', 'NRIC', 'Singapore National Registration ID', 7, false),
  ('driving_license', 'Driving License', 'Driver License', 8, false),
  ('other', 'Other', 'Other ID Type', 9, false)
) AS t(code, display, definition, sort_order, is_default);

-- =============================================================================
-- COUNTRY VALUE SET (Major Countries)
-- =============================================================================
INSERT INTO value_sets (id, code, name, description, category, status, is_system, is_extensible, source, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'iso_3166_countries', 'Country', 'ISO 3166-1 alpha-2 country codes', 'geography', 'active', true, false, 'ISO_3166', NOW(), NOW());

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, system_code, sort_order, is_default, status, created_at, updated_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM value_sets WHERE code = 'iso_3166_countries'),
  'iso_3166_countries',
  code,
  display,
  system_code,
  sort_order,
  is_default,
  'active',
  NOW(),
  NOW()
FROM (VALUES
  -- GCC & Middle East
  ('AE', 'United Arab Emirates', 'ARE', 1, true),
  ('SA', 'Saudi Arabia', 'SAU', 2, false),
  ('QA', 'Qatar', 'QAT', 3, false),
  ('BH', 'Bahrain', 'BHR', 4, false),
  ('KW', 'Kuwait', 'KWT', 5, false),
  ('OM', 'Oman', 'OMN', 6, false),
  ('EG', 'Egypt', 'EGY', 7, false),
  ('JO', 'Jordan', 'JOR', 8, false),
  ('LB', 'Lebanon', 'LBN', 9, false),
  -- South Asia
  ('IN', 'India', 'IND', 10, false),
  ('PK', 'Pakistan', 'PAK', 11, false),
  ('BD', 'Bangladesh', 'BGD', 12, false),
  ('LK', 'Sri Lanka', 'LKA', 13, false),
  -- Southeast Asia
  ('PH', 'Philippines', 'PHL', 14, false),
  ('SG', 'Singapore', 'SGP', 15, false),
  ('MY', 'Malaysia', 'MYS', 16, false),
  ('TH', 'Thailand', 'THA', 17, false),
  -- Western Countries
  ('US', 'United States', 'USA', 18, false),
  ('GB', 'United Kingdom', 'GBR', 19, false),
  ('CA', 'Canada', 'CAN', 20, false),
  ('AU', 'Australia', 'AUS', 21, false),
  ('DE', 'Germany', 'DEU', 22, false),
  ('FR', 'France', 'FRA', 23, false),
  ('IT', 'Italy', 'ITA', 24, false),
  ('ES', 'Spain', 'ESP', 25, false)
) AS t(code, display, system_code, sort_order, is_default);

-- =============================================================================
-- NATIONALITY VALUE SET (using countries for nationalities too)
-- Note: Frontend uses iso_3166_countries for both countries and nationalities
-- This is kept as a separate valueset for future customization
-- =============================================================================
INSERT INTO value_sets (id, code, name, description, category, status, is_system, is_extensible, source, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'nationalities', 'Nationality', 'Nationality/Citizenship', 'demographics', 'active', true, false, 'ISO_3166', NOW(), NOW());

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, sort_order, is_default, status, created_at, updated_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM value_sets WHERE code = 'nationalities'),
  'nationalities',
  code,
  display,
  sort_order,
  is_default,
  'active',
  NOW(),
  NOW()
FROM (VALUES
  -- GCC & Middle East
  ('UAE', 'Emirati', 1, true),
  ('Saudi', 'Saudi Arabian', 2, false),
  ('Qatari', 'Qatari', 3, false),
  ('Bahraini', 'Bahraini', 4, false),
  ('Kuwaiti', 'Kuwaiti', 5, false),
  ('Omani', 'Omani', 6, false),
  ('Egyptian', 'Egyptian', 7, false),
  ('Jordanian', 'Jordanian', 8, false),
  ('Lebanese', 'Lebanese', 9, false),
  ('Syrian', 'Syrian', 10, false),
  ('Palestinian', 'Palestinian', 11, false),
  -- South Asia
  ('Indian', 'Indian', 12, false),
  ('Pakistani', 'Pakistani', 13, false),
  ('Bangladeshi', 'Bangladeshi', 14, false),
  ('Sri Lankan', 'Sri Lankan', 15, false),
  ('Nepali', 'Nepali', 16, false),
  -- Southeast Asia
  ('Filipino', 'Filipino', 17, false),
  ('Singaporean', 'Singaporean', 18, false),
  ('Malaysian', 'Malaysian', 19, false),
  ('Thai', 'Thai', 20, false),
  ('Indonesian', 'Indonesian', 21, false),
  -- Western
  ('American', 'American', 22, false),
  ('British', 'British', 23, false),
  ('Canadian', 'Canadian', 24, false),
  ('Australian', 'Australian', 25, false),
  ('German', 'German', 26, false),
  ('French', 'French', 27, false),
  ('Italian', 'Italian', 28, false),
  ('Spanish', 'Spanish', 29, false)
) AS t(code, display, sort_order, is_default);

-- =============================================================================
-- LANGUAGE VALUE SET
-- =============================================================================
INSERT INTO value_sets (id, code, name, description, category, status, is_system, is_extensible, source, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'iso_639_languages', 'Language', 'ISO 639-1 language codes', 'demographics', 'active', true, true, 'ISO_639', NOW(), NOW());

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, system_code, sort_order, is_default, status, created_at, updated_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM value_sets WHERE code = 'iso_639_languages'),
  'iso_639_languages',
  code,
  display,
  system_code,
  sort_order,
  is_default,
  'active',
  NOW(),
  NOW()
FROM (VALUES
  ('en', 'English', 'eng', 1, true),
  ('ar', 'Arabic', 'ara', 2, false),
  ('hi', 'Hindi', 'hin', 3, false),
  ('ur', 'Urdu', 'urd', 4, false),
  ('tl', 'Tagalog', 'tgl', 5, false),
  ('bn', 'Bengali', 'ben', 6, false),
  ('ta', 'Tamil', 'tam', 7, false),
  ('ml', 'Malayalam', 'mal', 8, false),
  ('te', 'Telugu', 'tel', 9, false),
  ('zh', 'Chinese', 'zho', 10, false),
  ('fr', 'French', 'fra', 11, false),
  ('es', 'Spanish', 'spa', 12, false),
  ('de', 'German', 'deu', 13, false),
  ('ru', 'Russian', 'rus', 14, false)
) AS t(code, display, system_code, sort_order, is_default);

-- =============================================================================
-- PATIENT STATUS VALUE SET
-- =============================================================================
INSERT INTO value_sets (id, code, name, description, category, status, is_system, is_extensible, source, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'patient_status', 'Patient Status', 'Patient record status', 'administrative', 'active', true, false, 'ZEAL_SYSTEM', NOW(), NOW());

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, definition, sort_order, is_default, status, created_at, updated_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM value_sets WHERE code = 'patient_status'),
  'patient_status',
  code,
  display,
  definition,
  sort_order,
  is_default,
  'active',
  NOW(),
  NOW()
FROM (VALUES
  ('active', 'Active', 'Patient is active and can receive care', 1, true),
  ('inactive', 'Inactive', 'Patient is not currently receiving care', 2, false),
  ('deceased', 'Deceased', 'Patient has passed away', 3, false),
  ('merged', 'Merged', 'Patient record merged with another', 4, false),
  ('deleted', 'Deleted', 'Patient record marked for deletion', 5, false)
) AS t(code, display, definition, sort_order, is_default);

-- =============================================================================
-- REGISTRATION SOURCE VALUE SET
-- =============================================================================
INSERT INTO value_sets (id, code, name, description, category, status, is_system, is_extensible, source, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'registration_source', 'Registration Source', 'How the patient was registered', 'administrative', 'active', true, true, 'ZEAL_SYSTEM', NOW(), NOW());

INSERT INTO value_set_concepts (id, value_set_id, value_set_code, code, display, sort_order, is_default, status, created_at, updated_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM value_sets WHERE code = 'registration_source'),
  'registration_source',
  code,
  display,
  sort_order,
  is_default,
  'active',
  NOW(),
  NOW()
FROM (VALUES
  ('manual', 'Manual Entry', 1, true),
  ('portal', 'Patient Portal', 2, false),
  ('mobile_app', 'Mobile App', 3, false),
  ('import', 'Data Import', 4, false),
  ('hl7', 'HL7 Interface', 5, false),
  ('fhir', 'FHIR API', 6, false)
) AS t(code, display, sort_order, is_default);

-- Verification query
SELECT
  vs.code as valueset_code,
  vs.name as valueset_name,
  COUNT(vsc.id) as concept_count
FROM value_sets vs
LEFT JOIN value_set_concepts vsc ON vs.id = vsc.value_set_id
GROUP BY vs.code, vs.name
ORDER BY vs.code;
