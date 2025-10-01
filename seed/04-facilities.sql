-- Facilities Seed Data
-- File: 04-facilities.sql
-- Description: Healthcare facilities (clinics, hospitals, etc.)

-- Demo Clinic
INSERT INTO facilities (id, location_id, name, facility_type, license_number, phone, email, website, status, created_at, updated_at) VALUES
('facility-demo-clinic-uuid', 'location-dubai-sheikh-zayed-uuid', 'Demo Medical Clinic', 'clinic', 'DHA-CLINIC-2024-001', '+971-4-123-4567', 'info@demo-clinic.ae', 'https://demo-clinic.ae', 'active', NOW(), NOW());

-- Demo Hospital
INSERT INTO facilities (id, location_id, name, facility_type, license_number, phone, email, website, status, created_at, updated_at) VALUES
('facility-demo-hospital-uuid', 'location-abu-dhabi-corniche-uuid', 'Demo General Hospital', 'hospital', 'DOH-HOSPITAL-2024-001', '+971-2-987-6543', 'info@demo-hospital.ae', 'https://demo-hospital.ae', 'active', NOW(), NOW());

-- Demo Diagnostic Center
INSERT INTO facilities (id, location_id, name, facility_type, license_number, phone, email, website, status, created_at, updated_at) VALUES
('facility-demo-diagnostic-uuid', 'location-dubai-jbr-uuid', 'Demo Diagnostic Center', 'diagnostic_center', 'DHA-DIAG-2024-001', '+971-4-555-1234', 'info@demo-diagnostic.ae', 'https://demo-diagnostic.ae', 'active', NOW(), NOW());

-- Demo Surgery Center
INSERT INTO facilities (id, location_id, name, facility_type, license_number, phone, email, website, status, created_at, updated_at) VALUES
('facility-demo-surgery-uuid', 'location-dubai-business-bay-uuid', 'Demo Surgery Center', 'surgery_center', 'DHA-SURG-2024-001', '+971-4-777-8888', 'info@demo-surgery.ae', 'https://demo-surgery.ae', 'active', NOW(), NOW());

-- Demo Dental Clinic
INSERT INTO facilities (id, location_id, name, facility_type, license_number, phone, email, website, status, created_at, updated_at) VALUES
('facility-demo-dental-uuid', 'location-sharjah-city-center-uuid', 'Demo Dental Clinic', 'dental_clinic', 'DHA-DENTAL-2024-001', '+971-6-111-2222', 'info@demo-dental.ae', 'https://demo-dental.ae', 'active', NOW(), NOW());

-- Demo Pharmacy
INSERT INTO facilities (id, location_id, name, facility_type, license_number, phone, email, website, status, created_at, updated_at) VALUES
('facility-demo-pharmacy-uuid', 'location-dubai-sheikh-zayed-uuid', 'Demo Pharmacy', 'pharmacy', 'DHA-PHARM-2024-001', '+971-4-333-4444', 'info@demo-pharmacy.ae', 'https://demo-pharmacy.ae', 'active', NOW(), NOW());

-- Demo Physiotherapy Center
INSERT INTO facilities (id, location_id, name, facility_type, license_number, phone, email, website, status, created_at, updated_at) VALUES
('facility-demo-physio-uuid', 'location-abu-dhabi-al-reem-uuid', 'Demo Physiotherapy Center', 'physiotherapy_center', 'DHA-PHYSIO-2024-001', '+971-2-555-6666', 'info@demo-physio.ae', 'https://demo-physio.ae', 'active', NOW(), NOW());

-- Demo Mental Health Center
INSERT INTO facilities (id, location_id, name, facility_type, license_number, phone, email, website, status, created_at, updated_at) VALUES
('facility-demo-mental-uuid', 'location-dubai-jbr-uuid', 'Demo Mental Health Center', 'mental_health_center', 'DHA-MENTAL-2024-001', '+971-4-777-9999', 'info@demo-mental.ae', 'https://demo-mental.ae', 'active', NOW(), NOW());

-- Demo Maternity Hospital
INSERT INTO facilities (id, location_id, name, facility_type, license_number, phone, email, website, status, created_at, updated_at) VALUES
('facility-demo-maternity-uuid', 'location-abu-dhabi-khalifa-city-uuid', 'Demo Maternity Hospital', 'maternity_hospital', 'DHA-MAT-2024-001', '+971-2-888-0000', 'info@demo-maternity.ae', 'https://demo-maternity.ae', 'active', NOW(), NOW());

-- Demo Emergency Center
INSERT INTO facilities (id, location_id, name, facility_type, license_number, phone, email, website, status, created_at, updated_at) VALUES
('facility-demo-emergency-uuid', 'location-sharjah-al-majaz-uuid', 'Demo Emergency Center', 'emergency_center', 'DHA-EMERG-2024-001', '+971-6-999-1111', 'info@demo-emergency.ae', 'https://demo-emergency.ae', 'active', NOW(), NOW());
