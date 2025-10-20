-- Seed: Specialties (25 total) with translations and sample authority codes

-- Ensure clean state if run standalone
TRUNCATE TABLE specialty_translations RESTART IDENTITY CASCADE;
TRUNCATE TABLE specialty_codes_authority RESTART IDENTITY CASCADE;
TRUNCATE TABLE specialties RESTART IDENTITY CASCADE;

-- Insert 25 specialties (IDs are deterministic using UUIDv5 over DNS namespace)
INSERT INTO specialties (id, code, name, description, is_active, sort_order, created_at, updated_at) VALUES
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:GEN_MED'), 'GEN_MED', 'General Medicine', NULL, TRUE, 1, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:FAM_MED'), 'FAM_MED', 'Family Medicine', NULL, TRUE, 2, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:GEN_SURG'), 'GEN_SURG', 'General Surgery', NULL, TRUE, 3, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:ORTHO'), 'ORTHO', 'Orthopedics', NULL, TRUE, 4, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:NEURO_SURG'), 'NEURO_SURG', 'Neurosurgery', NULL, TRUE, 5, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:CARDIO_SURG'), 'CARDIO_SURG', 'Cardiothoracic Surgery', NULL, TRUE, 6, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:PLASTIC'), 'PLASTIC', 'Plastic Surgery', NULL, TRUE, 7, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:CARDIO'), 'CARDIO', 'Cardiology', NULL, TRUE, 8, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:PULMO'), 'PULMO', 'Pulmonology', NULL, TRUE, 9, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:GASTRO'), 'GASTRO', 'Gastroenterology', NULL, TRUE, 10, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:NEPHRO'), 'NEPHRO', 'Nephrology', NULL, TRUE, 11, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:ENDO'), 'ENDO', 'Endocrinology', NULL, TRUE, 12, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:NEURO'), 'NEURO', 'Neurology', NULL, TRUE, 13, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:ONCO'), 'ONCO', 'Oncology', NULL, TRUE, 14, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:PED'), 'PED', 'Pediatrics', NULL, TRUE, 15, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:NEONAT'), 'NEONAT', 'Neonatology', NULL, TRUE, 16, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:OBGYN'), 'OBGYN', 'Obstetrics & Gynecology', NULL, TRUE, 17, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:RAD'), 'RAD', 'Radiology', NULL, TRUE, 18, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:PATH'), 'PATH', 'Pathology', NULL, TRUE, 19, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:DERM'), 'DERM', 'Dermatology', NULL, TRUE, 20, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:OPHTHAL'), 'OPHTHAL', 'Ophthalmology', NULL, TRUE, 21, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:ENT'), 'ENT', 'Otolaryngology (ENT)', NULL, TRUE, 22, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:PSYCH'), 'PSYCH', 'Psychiatry', NULL, TRUE, 23, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:ANESTH'), 'ANESTH', 'Anesthesiology', NULL, TRUE, 24, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:EMERG'), 'EMERG', 'Emergency Medicine', NULL, TRUE, 25, NOW(), NOW());

-- Arabic translations (partial sample for key specialties; extend as needed)
INSERT INTO specialty_translations (id, specialty_id, lang, display_name, description, created_at, updated_at) VALUES
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:GEN_MED:ar'), (SELECT id FROM specialties WHERE code='GEN_MED'), 'ar', 'طب عام', NULL, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:FAM_MED:ar'), (SELECT id FROM specialties WHERE code='FAM_MED'), 'ar', 'طب الأسرة', NULL, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:GEN_SURG:ar'), (SELECT id FROM specialties WHERE code='GEN_SURG'), 'ar', 'الجراحة العامة', NULL, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:ORTHO:ar'), (SELECT id FROM specialties WHERE code='ORTHO'), 'ar', 'جراحة العظام', NULL, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:CARDIO:ar'), (SELECT id FROM specialties WHERE code='CARDIO'), 'ar', 'أمراض القلب', NULL, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:PED:ar'), (SELECT id FROM specialties WHERE code='PED'), 'ar', 'طب الأطفال', NULL, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:OBGYN:ar'), (SELECT id FROM specialties WHERE code='OBGYN'), 'ar', 'النساء والتوليد', NULL, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:RAD:ar'), (SELECT id FROM specialties WHERE code='RAD'), 'ar', 'الأشعة التشخيصية', NULL, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:DERM:ar'), (SELECT id FROM specialties WHERE code='DERM'), 'ar', 'الأمراض الجلدية', NULL, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:OPHTHAL:ar'), (SELECT id FROM specialties WHERE code='OPHTHAL'), 'ar', 'طب وجراحة العيون', NULL, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:ENT:ar'), (SELECT id FROM specialties WHERE code='ENT'), 'ar', 'الأذن والأنف والحنجرة', NULL, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','tr:PSYCH:ar'), (SELECT id FROM specialties WHERE code='PSYCH'), 'ar', 'الطب النفسي', NULL, NOW(), NOW());

-- Sample authority mappings (DHA) for a subset
INSERT INTO specialty_codes_authority (id, specialty_id, authority, authority_code, authority_name, is_active, created_at, updated_at) VALUES
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','sca:CARDIO:DHA'), (SELECT id FROM specialties WHERE code='CARDIO'), 'DHA', 'MED-010', 'Dubai Health Authority', TRUE, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','sca:ORTHO:DHA'), (SELECT id FROM specialties WHERE code='ORTHO'), 'DHA', 'SURG-020', 'Dubai Health Authority', TRUE, NOW(), NOW()),
  (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8','sca:PED:DHA'), (SELECT id FROM specialties WHERE code='PED'), 'DHA', 'PED-005', 'Dubai Health Authority', TRUE, NOW(), NOW());
