-- Spaces Seed Data
-- File: 05-spaces.sql
-- Description: Rooms and spaces within facilities

-- Demo Clinic Spaces
INSERT INTO spaces (id, facility_id, name, space_type, capacity, equipment_available, is_active, created_at, updated_at) VALUES
-- Consultation Rooms
('space-demo-clinic-consult-1-uuid', 'facility-demo-clinic-uuid', 'Consultation Room 1', 'consultation_room', 2, TRUE, TRUE, NOW(), NOW()),
('space-demo-clinic-consult-2-uuid', 'facility-demo-clinic-uuid', 'Consultation Room 2', 'consultation_room', 2, TRUE, TRUE, NOW(), NOW()),
('space-demo-clinic-consult-3-uuid', 'facility-demo-clinic-uuid', 'Consultation Room 3', 'consultation_room', 2, TRUE, TRUE, NOW(), NOW()),

-- Examination Rooms
('space-demo-clinic-exam-1-uuid', 'facility-demo-clinic-uuid', 'Examination Room 1', 'examination_room', 3, TRUE, TRUE, NOW(), NOW()),
('space-demo-clinic-exam-2-uuid', 'facility-demo-clinic-uuid', 'Examination Room 2', 'examination_room', 3, TRUE, TRUE, NOW(), NOW()),

-- Waiting Area
('space-demo-clinic-waiting-uuid', 'facility-demo-clinic-uuid', 'Main Waiting Area', 'waiting_area', 20, FALSE, TRUE, NOW(), NOW()),

-- Reception
('space-demo-clinic-reception-uuid', 'facility-demo-clinic-uuid', 'Reception Desk', 'reception', 3, FALSE, TRUE, NOW(), NOW()),

-- Pharmacy
('space-demo-clinic-pharmacy-uuid', 'facility-demo-clinic-uuid', 'In-House Pharmacy', 'pharmacy', 2, TRUE, TRUE, NOW(), NOW()),

-- Lab
('space-demo-clinic-lab-uuid', 'facility-demo-clinic-uuid', 'Laboratory', 'laboratory', 4, TRUE, TRUE, NOW(), NOW());

-- Demo Hospital Spaces
INSERT INTO spaces (id, facility_id, name, space_type, capacity, equipment_available, is_active, created_at, updated_at) VALUES
-- Operating Rooms
('space-demo-hospital-or-1-uuid', 'facility-demo-hospital-uuid', 'Operating Room 1', 'operating_room', 8, TRUE, TRUE, NOW(), NOW()),
('space-demo-hospital-or-2-uuid', 'facility-demo-hospital-uuid', 'Operating Room 2', 'operating_room', 8, TRUE, TRUE, NOW(), NOW()),
('space-demo-hospital-or-3-uuid', 'facility-demo-hospital-uuid', 'Operating Room 3', 'operating_room', 8, TRUE, TRUE, NOW(), NOW()),

-- ICU Rooms
('space-demo-hospital-icu-1-uuid', 'facility-demo-hospital-uuid', 'ICU Room 1', 'icu_room', 2, TRUE, TRUE, NOW(), NOW()),
('space-demo-hospital-icu-2-uuid', 'facility-demo-hospital-uuid', 'ICU Room 2', 'icu_room', 2, TRUE, TRUE, NOW(), NOW()),
('space-demo-hospital-icu-3-uuid', 'facility-demo-hospital-uuid', 'ICU Room 3', 'icu_room', 2, TRUE, TRUE, NOW(), NOW()),
('space-demo-hospital-icu-4-uuid', 'facility-demo-hospital-uuid', 'ICU Room 4', 'icu_room', 2, TRUE, TRUE, NOW(), NOW()),

-- General Ward Rooms
('space-demo-hospital-ward-1-uuid', 'facility-demo-hospital-uuid', 'Ward Room 1', 'ward_room', 2, TRUE, TRUE, NOW(), NOW()),
('space-demo-hospital-ward-2-uuid', 'facility-demo-hospital-uuid', 'Ward Room 2', 'ward_room', 2, TRUE, TRUE, NOW(), NOW()),
('space-demo-hospital-ward-3-uuid', 'facility-demo-hospital-uuid', 'Ward Room 3', 'ward_room', 2, TRUE, TRUE, NOW(), NOW()),
('space-demo-hospital-ward-4-uuid', 'facility-demo-hospital-uuid', 'Ward Room 4', 'ward_room', 2, TRUE, TRUE, NOW(), NOW()),
('space-demo-hospital-ward-5-uuid', 'facility-demo-hospital-uuid', 'Ward Room 5', 'ward_room', 2, TRUE, TRUE, NOW(), NOW()),
('space-demo-hospital-ward-6-uuid', 'facility-demo-hospital-uuid', 'Ward Room 6', 'ward_room', 2, TRUE, TRUE, NOW(), NOW()),

-- Emergency Room
('space-demo-hospital-er-uuid', 'facility-demo-hospital-uuid', 'Emergency Room', 'emergency_room', 6, TRUE, TRUE, NOW(), NOW()),

-- Radiology
('space-demo-hospital-radiology-uuid', 'facility-demo-hospital-uuid', 'Radiology Department', 'radiology', 4, TRUE, TRUE, NOW(), NOW()),

-- Laboratory
('space-demo-hospital-lab-uuid', 'facility-demo-hospital-uuid', 'Main Laboratory', 'laboratory', 8, TRUE, TRUE, NOW(), NOW()),

-- Pharmacy
('space-demo-hospital-pharmacy-uuid', 'facility-demo-hospital-uuid', 'Hospital Pharmacy', 'pharmacy', 4, TRUE, TRUE, NOW(), NOW());

-- Demo Diagnostic Center Spaces
INSERT INTO spaces (id, facility_id, name, space_type, capacity, equipment_available, is_active, created_at, updated_at) VALUES
-- MRI Room
('space-demo-diagnostic-mri-uuid', 'facility-demo-diagnostic-uuid', 'MRI Room', 'mri_room', 3, TRUE, TRUE, NOW(), NOW()),

-- CT Scan Room
('space-demo-diagnostic-ct-uuid', 'facility-demo-diagnostic-uuid', 'CT Scan Room', 'ct_room', 3, TRUE, TRUE, NOW(), NOW()),

-- Ultrasound Room
('space-demo-diagnostic-ultrasound-uuid', 'facility-demo-diagnostic-uuid', 'Ultrasound Room', 'ultrasound_room', 2, TRUE, TRUE, NOW(), NOW()),

-- X-Ray Room
('space-demo-diagnostic-xray-uuid', 'facility-demo-diagnostic-uuid', 'X-Ray Room', 'xray_room', 2, TRUE, TRUE, NOW(), NOW()),

-- Mammography Room
('space-demo-diagnostic-mammo-uuid', 'facility-demo-diagnostic-uuid', 'Mammography Room', 'mammography_room', 2, TRUE, TRUE, NOW(), NOW()),

-- Waiting Area
('space-demo-diagnostic-waiting-uuid', 'facility-demo-diagnostic-uuid', 'Waiting Area', 'waiting_area', 15, FALSE, TRUE, NOW(), NOW()),

-- Reception
('space-demo-diagnostic-reception-uuid', 'facility-demo-diagnostic-uuid', 'Reception', 'reception', 2, FALSE, TRUE, NOW(), NOW());

-- Demo Surgery Center Spaces
INSERT INTO spaces (id, facility_id, name, space_type, capacity, equipment_available, is_active, created_at, updated_at) VALUES
-- Operating Rooms
('space-demo-surgery-or-1-uuid', 'facility-demo-surgery-uuid', 'Operating Room 1', 'operating_room', 6, TRUE, TRUE, NOW(), NOW()),
('space-demo-surgery-or-2-uuid', 'facility-demo-surgery-uuid', 'Operating Room 2', 'operating_room', 6, TRUE, TRUE, NOW(), NOW()),

-- Recovery Room
('space-demo-surgery-recovery-uuid', 'facility-demo-surgery-uuid', 'Recovery Room', 'recovery_room', 4, TRUE, TRUE, NOW(), NOW()),

-- Pre-Op Room
('space-demo-surgery-preop-uuid', 'facility-demo-surgery-uuid', 'Pre-Operative Room', 'preop_room', 3, TRUE, TRUE, NOW(), NOW()),

-- Post-Op Room
('space-demo-surgery-postop-uuid', 'facility-demo-surgery-uuid', 'Post-Operative Room', 'postop_room', 3, TRUE, TRUE, NOW(), NOW()),

-- Waiting Area
('space-demo-surgery-waiting-uuid', 'facility-demo-surgery-uuid', 'Waiting Area', 'waiting_area', 10, FALSE, TRUE, NOW(), NOW());
