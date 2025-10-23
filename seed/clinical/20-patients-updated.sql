-- ================================================================
-- Zeal Clinical DB: Sample Patients (Updated Identity Schema)
-- ================================================================
-- This file demonstrates the new identity management approach:
-- - nationalId (generic field for primary identity)
-- - nationalIdType (emirates_id, aadhaar, passport, etc.)
-- - issuingCountry (ISO 3166-1 alpha-2 code)
-- - state (replaces emirate for generic use)
-- ================================================================

-- UAE Patient with Emirates ID
INSERT INTO patients (
  id, tenant_id, national_id, national_id_type, issuing_country,
  first_name, last_name, middle_name, date_of_birth, gender,
  marital_status, nationality, preferred_language,
  phone_number, email,
  address_line1, address_line2, city, state, postal_code, country,
  blood_group, status, created_at, updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001', -- tenant_id
  '784-1990-1234567-8',
  'emirates_id',
  'AE',
  'Ahmed',
  'Al Mansoori',
  'Mohammed',
  '1990-05-15',
  'male',
  'married',
  'United Arab Emirates',
  'ar',
  '+971501234567',
  'ahmed.almansoori@example.ae',
  'Flat 301, Building 15',
  'Sheikh Zayed Road',
  'Dubai',
  'Dubai', -- Using state instead of emirate
  '00000',
  'AE',
  'O+',
  'active',
  NOW(),
  NOW()
);

-- Indian Patient with Aadhaar
INSERT INTO patients (
  id, tenant_id, national_id, national_id_type, issuing_country,
  first_name, last_name, date_of_birth, gender,
  nationality, preferred_language,
  phone_number, email,
  address_line1, city, state, postal_code, country,
  blood_group, status, created_at, updated_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000001',
  '2345 6789 0123',
  'aadhaar',
  'IN',
  'Priya',
  'Sharma',
  '1988-08-20',
  'female',
  'India',
  'en',
  '+971502345678',
  'priya.sharma@example.com',
  'Villa 45, Springs Community',
  'Dubai',
  'Dubai',
  '00000',
  'AE',
  'B+',
  'active',
  NOW(),
  NOW()
);

-- Foreign Patient with Passport
INSERT INTO patients (
  id, tenant_id, national_id, national_id_type, issuing_country,
  first_name, last_name, date_of_birth, gender,
  nationality, preferred_language,
  phone_number, email,
  address_line1, city, state, country,
  status, created_at, updated_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000001',
  'A1234567',
  'passport',
  'GB',
  'Sarah',
  'Johnson',
  '1985-12-10',
  'female',
  'United Kingdom',
  'en',
  '+971503456789',
  'sarah.johnson@example.com',
  'Apartment 202, Marina Tower',
  'Dubai',
  'Dubai',
  'AE',
  'active',
  NOW(),
  NOW()
);

-- ================================================================
-- Patient Documents (Supporting Identity Documents)
-- ================================================================

-- Emirates ID Document for Ahmed
INSERT INTO patient_documents (
  id, tenant_id, patient_id,
  document_type, document_number, issuing_country, issuing_authority,
  issue_date, expiry_date, is_primary_identity,
  verification_status, verified_at,
  created_at, updated_at
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'emirates_id',
  '784-1990-1234567-8',
  'AE',
  'Federal Authority for Identity and Citizenship (ICA)',
  '2020-01-15',
  '2030-01-14',
  true,
  'verified',
  NOW(),
  NOW(),
  NOW()
);

-- Aadhaar Document for Priya
INSERT INTO patient_documents (
  id, tenant_id, patient_id,
  document_type, document_number, issuing_country, issuing_authority,
  issue_date, is_primary_identity,
  verification_status, verified_at,
  metadata,
  created_at, updated_at
) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '00000000-0000-0000-0000-000000000001',
  '22222222-2222-2222-2222-222222222222',
  'aadhaar',
  '2345 6789 0123',
  'IN',
  'Unique Identification Authority of India (UIDAI)',
  '2015-06-10',
  true,
  'verified',
  NOW(),
  '{"maskedValue": "XXXX XXXX 0123"}',
  NOW(),
  NOW()
);

-- Passport Document for Sarah
INSERT INTO patient_documents (
  id, tenant_id, patient_id,
  document_type, document_number, issuing_country, issuing_authority,
  issue_date, expiry_date, is_primary_identity,
  verification_status, verified_at,
  created_at, updated_at
) VALUES (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '00000000-0000-0000-0000-000000000001',
  '33333333-3333-3333-3333-333333333333',
  'passport',
  'A1234567',
  'GB',
  'Her Majesty''s Passport Office',
  '2019-03-20',
  '2029-03-19',
  true,
  'verified',
  NOW(),
  NOW(),
  NOW()
);

-- Additional Passport for Ahmed (dual identity)
INSERT INTO patient_documents (
  id, tenant_id, patient_id,
  document_type, document_number, issuing_country, issuing_authority,
  issue_date, expiry_date, is_primary_identity,
  verification_status,
  created_at, updated_at
) VALUES (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '00000000-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'passport',
  'A9876543',
  'AE',
  'Ministry of Foreign Affairs and International Cooperation',
  '2021-07-01',
  '2031-06-30',
  false, -- Not primary, Emirates ID is primary
  'verified',
  NOW(),
  NOW()
);
