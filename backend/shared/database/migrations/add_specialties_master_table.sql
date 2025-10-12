-- =====================================================
-- Migration: Add Specialties Master Table
-- Description: Replace JSON-based specialties with proper relational model
-- Author: AI Assistant
-- Date: 2025-10-08
-- =====================================================

-- Purpose:
-- This migration creates a master specialties table with:
-- 1. Normalized specialty data (code, name, description)
-- 2. UAE authority mappings (DHA/DOH/MOHAP codes)
-- 3. Many-to-many staff-specialties relationship
-- 4. Primary specialty enforcement (one per staff)
-- 5. Multilingual support (Arabic/English)
-- 6. Optional department labeling

BEGIN;

-- =====================================================
-- Step 1: Create Specialties Master Table
-- =====================================================

CREATE TABLE specialties (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            VARCHAR(50) UNIQUE NOT NULL,
  name            VARCHAR(150) NOT NULL,
  description     TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE specialties IS 'Master list of medical specialties';
COMMENT ON COLUMN specialties.code IS 'Unique code (e.g., ORTHO, PED, CARD) - stable identifier for joins';
COMMENT ON COLUMN specialties.name IS 'English display name';
COMMENT ON COLUMN specialties.sort_order IS 'Display order in UIs (lower = first)';

-- =====================================================
-- Step 2: Create UAE Authority Mappings
-- =====================================================

CREATE TABLE specialty_codes_authority (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialty_id      UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
  authority         VARCHAR(20) NOT NULL,
  authority_code    VARCHAR(50) NOT NULL,
  authority_name    VARCHAR(150),
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT ux_specialty_authority UNIQUE (specialty_id, authority)
);

COMMENT ON TABLE specialty_codes_authority IS 'UAE regulatory authority specialty codes (DHA, DOH, MOHAP)';
COMMENT ON COLUMN specialty_codes_authority.authority IS 'Authority name: DHA, DOH, MOHAP, etc.';
COMMENT ON COLUMN specialty_codes_authority.authority_code IS 'Official code in that authority catalog';

CREATE INDEX idx_specialty_authority ON specialty_codes_authority(authority, authority_code);

-- =====================================================
-- Step 3: Create Staff-Specialties Join Table
-- =====================================================

CREATE TABLE staff_specialties (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id      UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  specialty_id  UUID NOT NULL REFERENCES specialties(id) ON DELETE RESTRICT,
  primary_flag  BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT ux_staff_specialty UNIQUE (staff_id, specialty_id)
);

COMMENT ON TABLE staff_specialties IS 'Many-to-many: staff members can have multiple specialties';
COMMENT ON COLUMN staff_specialties.primary_flag IS 'True for the staff member primary specialty (only one allowed)';

-- Enforce: exactly one primary specialty per staff member
CREATE UNIQUE INDEX ux_staff_primary_specialty 
  ON staff_specialties(staff_id) 
  WHERE primary_flag = TRUE;

-- Performance indexes
CREATE INDEX idx_staff_specialties_staff ON staff_specialties(staff_id);
CREATE INDEX idx_staff_specialties_specialty ON staff_specialties(specialty_id);
CREATE INDEX idx_staff_specialties_tenant ON staff_specialties(tenant_id);

-- =====================================================
-- Step 4: Create Multilingual Translations
-- =====================================================

CREATE TABLE specialty_translations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialty_id  UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
  lang          CHAR(2) NOT NULL,
  display_name  TEXT NOT NULL,
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT ux_specialty_lang UNIQUE (specialty_id, lang)
);

COMMENT ON TABLE specialty_translations IS 'Multilingual specialty labels (Arabic, English, etc.)';
COMMENT ON COLUMN specialty_translations.lang IS 'ISO 639-1 language code: en, ar';

CREATE INDEX idx_specialty_translations ON specialty_translations(specialty_id, lang);

-- =====================================================
-- Step 5: Add Optional Specialty to Departments
-- =====================================================

ALTER TABLE departments
ADD COLUMN specialty_id UUID REFERENCES specialties(id) ON DELETE SET NULL;

COMMENT ON COLUMN departments.specialty_id IS 'Optional: primary specialty for this department (for UX/reporting)';

CREATE INDEX idx_departments_specialty ON departments(specialty_id);

-- =====================================================
-- Step 6: Add Indexes to Existing Tables
-- =====================================================

CREATE UNIQUE INDEX idx_specialties_code ON specialties(code);

-- =====================================================
-- Step 7: Enable Row Level Security (RLS)
-- =====================================================

-- Note: RLS will be configured separately when application_role is set up
-- For now, tenant isolation is enforced at the application layer

-- Enable RLS on staff_specialties (tenant-scoped) - ready for policies
-- ALTER TABLE staff_specialties ENABLE ROW LEVEL SECURITY;

-- Policy will be created later:
-- CREATE POLICY tenant_isolation_staff_specialties ON staff_specialties
--   FOR ALL TO application_role
--   USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Note: specialties table is global (no tenant scoping)
-- specialty_codes_authority and specialty_translations are also global

-- =====================================================
-- Step 8: Seed Common Specialties
-- =====================================================

INSERT INTO specialties (id, code, name, description, sort_order, is_active, created_at, updated_at)
VALUES
  -- Primary Care
  ('10000000-0000-0000-0000-000000000001', 'GEN_MED', 'General Medicine', 'General internal medicine', 10, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000002', 'FAM_MED', 'Family Medicine', 'Family practice and primary care', 20, true, NOW(), NOW()),
  
  -- Surgical Specialties
  ('10000000-0000-0000-0000-000000000010', 'GEN_SURG', 'General Surgery', 'General surgical procedures', 100, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000011', 'ORTHO', 'Orthopedics', 'Orthopedic surgery and sports medicine', 110, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000012', 'NEURO_SURG', 'Neurosurgery', 'Brain and spine surgery', 120, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000013', 'CARDIO_SURG', 'Cardiothoracic Surgery', 'Heart and chest surgery', 130, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000014', 'PLASTIC', 'Plastic Surgery', 'Reconstructive and cosmetic surgery', 140, true, NOW(), NOW()),
  
  -- Medical Specialties
  ('10000000-0000-0000-0000-000000000020', 'CARDIO', 'Cardiology', 'Heart and cardiovascular system', 200, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000021', 'PULMO', 'Pulmonology', 'Respiratory system and lungs', 210, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000022', 'GASTRO', 'Gastroenterology', 'Digestive system', 220, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000023', 'NEPHRO', 'Nephrology', 'Kidney diseases', 230, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000024', 'ENDO', 'Endocrinology', 'Hormonal disorders and diabetes', 240, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000025', 'NEURO', 'Neurology', 'Brain and nervous system disorders', 250, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000026', 'ONCO', 'Oncology', 'Cancer treatment', 260, true, NOW(), NOW()),
  
  -- Pediatrics & Women's Health
  ('10000000-0000-0000-0000-000000000030', 'PED', 'Pediatrics', 'Child healthcare', 300, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000031', 'NEONAT', 'Neonatology', 'Newborn intensive care', 310, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000032', 'OBGYN', 'Obstetrics & Gynecology', 'Women reproductive health and pregnancy', 320, true, NOW(), NOW()),
  
  -- Diagnostic Specialties
  ('10000000-0000-0000-0000-000000000040', 'RAD', 'Radiology', 'Medical imaging and diagnostics', 400, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000041', 'PATH', 'Pathology', 'Laboratory medicine and diagnostics', 410, true, NOW(), NOW()),
  
  -- Other Specialties
  ('10000000-0000-0000-0000-000000000050', 'DERM', 'Dermatology', 'Skin diseases', 500, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000051', 'OPHTHAL', 'Ophthalmology', 'Eye diseases and surgery', 510, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000052', 'ENT', 'Otolaryngology (ENT)', 'Ear, nose, and throat', 520, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000053', 'PSYCH', 'Psychiatry', 'Mental health disorders', 530, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000054', 'ANESTH', 'Anesthesiology', 'Anesthesia and pain management', 540, true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000055', 'EMERG', 'Emergency Medicine', 'Emergency and trauma care', 550, true, NOW(), NOW());

-- =====================================================
-- Step 9: Seed Arabic Translations
-- =====================================================

INSERT INTO specialty_translations (specialty_id, lang, display_name, created_at, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'ar', 'طب عام', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000002', 'ar', 'طب الأسرة', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000010', 'ar', 'الجراحة العامة', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000011', 'ar', 'جراحة العظام', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000012', 'ar', 'جراحة الأعصاب', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000013', 'ar', 'جراحة القلب والصدر', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000014', 'ar', 'الجراحة التجميلية', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000020', 'ar', 'أمراض القلب', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000021', 'ar', 'أمراض الرئة', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000022', 'ar', 'أمراض الجهاز الهضمي', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000023', 'ar', 'أمراض الكلى', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000024', 'ar', 'الغدد الصماء والسكري', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000025', 'ar', 'طب الأعصاب', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000026', 'ar', 'علاج الأورام', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000030', 'ar', 'طب الأطفال', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000031', 'ar', 'حديثي الولادة', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000032', 'ar', 'النساء والتوليد', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000040', 'ar', 'الأشعة التشخيصية', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000041', 'ar', 'علم الأمراض', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000050', 'ar', 'الأمراض الجلدية', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000051', 'ar', 'طب وجراحة العيون', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000052', 'ar', 'الأذن والأنف والحنجرة', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000053', 'ar', 'الطب النفسي', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000054', 'ar', 'التخدير وإدارة الألم', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000055', 'ar', 'الطوارئ والإصابات', NOW(), NOW());

-- =====================================================
-- Step 10: Sample UAE Authority Mappings (DHA Dubai)
-- =====================================================

INSERT INTO specialty_codes_authority (specialty_id, authority, authority_code, authority_name, created_at, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'DHA', 'MED-001', 'General Medicine', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000002', 'DHA', 'MED-002', 'Family Medicine', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000011', 'DHA', 'SURG-001', 'Orthopedic Surgery', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000020', 'DHA', 'MED-010', 'Cardiology', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000030', 'DHA', 'PED-001', 'Pediatrics', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000032', 'DHA', 'OBGYN-001', 'Obstetrics & Gynecology', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000040', 'DHA', 'RAD-001', 'Radiology', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000050', 'DHA', 'DERM-001', 'Dermatology', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000051', 'DHA', 'OPHT-001', 'Ophthalmology', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000052', 'DHA', 'ENT-001', 'ENT', NOW(), NOW());

COMMIT;

-- =====================================================
-- Verification
-- =====================================================

-- Count specialties
SELECT COUNT(*) as specialty_count FROM specialties;

-- Verify translations
SELECT 
  s.code,
  s.name as english_name,
  t.display_name as arabic_name
FROM specialties s
LEFT JOIN specialty_translations t ON t.specialty_id = s.id AND t.lang = 'ar'
ORDER BY s.sort_order
LIMIT 10;

-- Verify authority mappings
SELECT 
  s.code,
  s.name,
  a.authority,
  a.authority_code
FROM specialties s
JOIN specialty_codes_authority a ON a.specialty_id = s.id
ORDER BY s.code
LIMIT 10;

-- =====================================================
-- Migration Notes for Existing Data
-- =====================================================

/*
To migrate from existing staff.specialties JSON column:

1. Extract distinct specialty values:
   SELECT DISTINCT jsonb_array_elements_text(specialties::jsonb) as specialty
   FROM staff
   WHERE specialties IS NOT NULL;

2. Map to specialty codes and insert into staff_specialties:
   INSERT INTO staff_specialties (tenant_id, staff_id, specialty_id, primary_flag)
   SELECT 
     s.tenant_id,
     s.id,
     sp.id,
     (jsonb_array_elements_text(s.specialties::jsonb) = jsonb_array_element(s.specialties::jsonb, 0)) as is_primary
   FROM staff s
   CROSS JOIN LATERAL jsonb_array_elements_text(s.specialties::jsonb) AS spec
   JOIN specialties sp ON sp.code = UPPER(spec);

3. After verification, drop old column:
   ALTER TABLE staff DROP COLUMN IF EXISTS specialties;
*/

-- =====================================================
-- Rollback Script (if needed)
-- =====================================================

/*
BEGIN;

-- Drop RLS policies
DROP POLICY IF EXISTS tenant_isolation_staff_specialties ON staff_specialties;

-- Drop tables in reverse order
DROP TABLE IF EXISTS staff_specialties CASCADE;
DROP TABLE IF EXISTS specialty_translations CASCADE;
DROP TABLE IF EXISTS specialty_codes_authority CASCADE;
DROP TABLE IF EXISTS specialties CASCADE;

-- Remove department column
ALTER TABLE departments DROP COLUMN IF EXISTS specialty_id;

COMMIT;
*/
