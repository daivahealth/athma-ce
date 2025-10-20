TRUNCATE TABLE
  user_facilities,
  user_roles,
  role_permissions,
  user_mfa_backup_codes,
  user_mfa_attempts,
  user_mfa_settings,
  user_trusted_devices,
  staff_specialties,
  staff,
  clinics,
  spaces,
  beds,
  wards,
  departments,
  facilities,
  users,
  roles,
  permissions,
  specialty_translations,
  specialty_codes_authority,
  specialties,
  tenants
CASCADE;

INSERT INTO tenants (id, name, domain, status, settings, created_at, updated_at)
VALUES (uuid_from_text('11111111-1111-1111-1111-111111111111'), 'Demo Health Group', 'demo.zeal.ae', 'active', '{}'::jsonb, NOW(), NOW());

INSERT INTO facilities (
  id, tenant_id, name, code, facility_type, license_number,
  address_line1, city, emirate, country, status,
  created_at, updated_at
) VALUES
  (uuid_from_text('22222222-1111-1111-1111-111111111111'), uuid_from_text('11111111-1111-1111-1111-111111111111'), 'Demo Medical Clinic', 'CLINIC-001', 'clinic', 'DHA-CLINIC-2024-001',
   'Sheikh Zayed Rd', 'Dubai', 'Dubai', 'UAE', 'active', NOW(), NOW()),
  (uuid_from_text('22222222-1111-1111-1111-111111111112'), uuid_from_text('11111111-1111-1111-1111-111111111111'), 'Demo General Hospital', 'HOSP-001', 'hospital', 'DOH-HOSPITAL-2024-001',
   'Corniche Rd', 'Abu Dhabi', 'Abu Dhabi', 'UAE', 'active', NOW(), NOW());

INSERT INTO departments (
  id, facility_id, name, department_type, status, created_at, updated_at
) VALUES
  (uuid_from_text('33333333-1111-1111-1111-111111111111'), uuid_from_text('22222222-1111-1111-1111-111111111111'), 'Outpatient Department', 'outpatient', 'active', NOW(), NOW()),
  (uuid_from_text('33333333-1111-1111-1111-111111111112'), uuid_from_text('22222222-1111-1111-1111-111111111112'), 'Intensive Care Unit', 'icu', 'active', NOW(), NOW()),
  (uuid_from_text('33333333-1111-1111-1111-111111111113'), uuid_from_text('22222222-1111-1111-1111-111111111112'), 'Radiology', 'diagnostic', 'active', NOW(), NOW());

INSERT INTO wards (
  id, department_id, name, ward_type, total_beds, available_beds,
  status, created_at, updated_at
) VALUES
  (uuid_from_text('44444444-1111-1111-1111-111111111111'), uuid_from_text('33333333-1111-1111-1111-111111111112'), 'ICU A', 'icu', 8, 8, 'active', NOW(), NOW()),
  (uuid_from_text('44444444-1111-1111-1111-111111111112'), uuid_from_text('33333333-1111-1111-1111-111111111112'), 'ICU B', 'icu', 6, 6, 'active', NOW(), NOW());

INSERT INTO beds (
  id, ward_id, bed_number, bed_type, status, features,
  created_at, updated_at
) VALUES
  (uuid_from_text('55555555-1111-1111-1111-111111111111'), uuid_from_text('44444444-1111-1111-1111-111111111111'), 'ICUA-01', 'icu', 'available', '[]'::jsonb, NOW(), NOW()),
  (uuid_from_text('55555555-1111-1111-1111-111111111112'), uuid_from_text('44444444-1111-1111-1111-111111111111'), 'ICUA-02', 'icu', 'available', '[]'::jsonb, NOW(), NOW()),
  (uuid_from_text('55555555-1111-1111-1111-111111111113'), uuid_from_text('44444444-1111-1111-1111-111111111112'), 'ICUB-01', 'icu', 'available', '[]'::jsonb, NOW(), NOW());

INSERT INTO clinics (
  id, department_id, name, code, specialty, status, created_at, updated_at
) VALUES
  (uuid_from_text('66666666-1111-1111-1111-111111111111'), uuid_from_text('33333333-1111-1111-1111-111111111111'), 'Cardiology Clinic', 'CLN-CARD', 'CARD', 'active', NOW(), NOW()),
  (uuid_from_text('66666666-1111-1111-1111-111111111112'), uuid_from_text('33333333-1111-1111-1111-111111111111'), 'Pediatrics Clinic', 'CLN-PEDS', 'PEDS', 'active', NOW(), NOW());

INSERT INTO spaces (
  id, facility_id, department_id, clinic_id, name, space_number, space_type,
  floor_number, equipment, capacity, is_active, created_at, updated_at
) VALUES
  (uuid_from_text('77777777-1111-1111-1111-111111111111'), uuid_from_text('22222222-1111-1111-1111-111111111111'), uuid_from_text('33333333-1111-1111-1111-111111111111'), uuid_from_text('66666666-1111-1111-1111-111111111111'),
   'Consultation Room 1', 'C-101', 'consultation_room', '1', '[]'::jsonb, 2, TRUE, NOW(), NOW()),
  (uuid_from_text('77777777-1111-1111-1111-111111111112'), uuid_from_text('22222222-1111-1111-1111-111111111112'), uuid_from_text('33333333-1111-1111-1111-111111111112'), NULL,
   'Operating Room 1', 'OR-1', 'operating_room', '2', '["anesthesia machine", "defibrillator"]'::jsonb, 6, TRUE, NOW(), NOW());

INSERT INTO specialties (id, code, name, description, is_active, sort_order, created_at, updated_at)
VALUES
  (uuid_from_text('88888888-1111-1111-1111-111111111111'), 'INTMED', 'Internal Medicine', 'Adult internal medicine services', TRUE, 1, NOW(), NOW()),
  (uuid_from_text('88888888-1111-1111-1111-111111111112'), 'CARD', 'Cardiology', 'Heart and vascular care', TRUE, 2, NOW(), NOW()),
  (uuid_from_text('88888888-1111-1111-1111-111111111113'), 'PEDS', 'Pediatrics', 'Child and adolescent care', TRUE, 3, NOW(), NOW());

INSERT INTO specialty_translations (id, specialty_id, lang, display_name, description, created_at, updated_at)
VALUES
  (uuid_from_text('99999999-1111-1111-1111-111111111111'), uuid_from_text('88888888-1111-1111-1111-111111111112'), 'ar', 'أمراض القلب', 'رعاية القلب والأوعية الدموية', NOW(), NOW());

INSERT INTO specialty_codes_authority (id, specialty_id, authority, authority_code, authority_name, is_active, created_at, updated_at)
VALUES
  (uuid_from_text('aaaaaaaa-1111-1111-1111-111111111111'), uuid_from_text('88888888-1111-1111-1111-111111111112'), 'DHA', '001', 'Dubai Health Authority', TRUE, NOW(), NOW());
