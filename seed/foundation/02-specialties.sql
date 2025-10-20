-- Foundation Seed: Specialties
TRUNCATE specialty_translations CASCADE;
TRUNCATE specialty_codes_authority CASCADE;
TRUNCATE specialties CASCADE;

INSERT INTO specialties (id, code, name, description, is_active, sort_order, created_at, updated_at)
VALUES
  (uuid_from_text('specialty-intmed'), 'INTMED', 'Internal Medicine', 'Adult internal medicine services', TRUE, 1, NOW(), NOW()),
  (uuid_from_text('specialty-cardio'), 'CARD', 'Cardiology', 'Heart and vascular care', TRUE, 2, NOW(), NOW()),
  (uuid_from_text('specialty-peds'), 'PEDS', 'Pediatrics', 'Child and adolescent care', TRUE, 3, NOW(), NOW());

INSERT INTO specialty_translations (id, specialty_id, lang, display_name, description, created_at, updated_at)
VALUES
  (uuid_from_text('spec-trans-intmed-ar'), uuid_from_text('specialty-intmed'), 'ar', 'الطب الباطني', 'خدمات الطب الباطني للبالغين', NOW(), NOW()),
  (uuid_from_text('spec-trans-cardio-ar'), uuid_from_text('specialty-cardio'), 'ar', 'أمراض القلب', 'رعاية القلب والأوعية الدموية', NOW(), NOW()),
  (uuid_from_text('spec-trans-peds-ar'), uuid_from_text('specialty-peds'), 'ar', 'طب الأطفال', 'رعاية الأطفال والمراهقين', NOW(), NOW());

INSERT INTO specialty_codes_authority (id, specialty_id, authority, authority_code, authority_name, is_active, created_at, updated_at)
VALUES
  (uuid_from_text('spec-auth-intmed-dha'), uuid_from_text('specialty-intmed'), 'DHA', '001', 'Dubai Health Authority', TRUE, NOW(), NOW()),
  (uuid_from_text('spec-auth-cardio-doh'), uuid_from_text('specialty-cardio'), 'DOH', '002', 'Department of Health Abu Dhabi', TRUE, NOW(), NOW());
