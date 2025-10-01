-- Equipment Seed Data
-- File: 06-equipment.sql
-- Description: Medical equipment and devices

-- Demo Clinic Equipment
INSERT INTO equipment (id, facility_id, name, equipment_type, model, serial_number, status, last_maintenance, next_maintenance, created_at, updated_at) VALUES
-- Consultation Room Equipment
('equipment-demo-clinic-stethoscope-1-uuid', 'facility-demo-clinic-uuid', 'Digital Stethoscope', 'stethoscope', 'Littmann 3200', 'ST-001-2024', 'active', NOW() - INTERVAL '30 days', NOW() + INTERVAL '335 days', NOW(), NOW()),
('equipment-demo-clinic-bp-monitor-1-uuid', 'facility-demo-clinic-uuid', 'Blood Pressure Monitor', 'bp_monitor', 'Omron M10-IT', 'BP-001-2024', 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '350 days', NOW(), NOW()),
('equipment-demo-clinic-thermometer-1-uuid', 'facility-demo-clinic-uuid', 'Digital Thermometer', 'thermometer', 'Braun ThermoScan 7', 'TH-001-2024', 'active', NOW() - INTERVAL '7 days', NOW() + INTERVAL '358 days', NOW(), NOW()),

-- Examination Room Equipment
('equipment-demo-clinic-exam-table-1-uuid', 'facility-demo-clinic-uuid', 'Examination Table', 'exam_table', 'Midmark 400', 'ET-001-2024', 'active', NOW() - INTERVAL '60 days', NOW() + INTERVAL '305 days', NOW(), NOW()),
('equipment-demo-clinic-otoscope-1-uuid', 'facility-demo-clinic-uuid', 'Digital Otoscope', 'otoscope', 'Welch Allyn MacroView', 'OT-001-2024', 'active', NOW() - INTERVAL '45 days', NOW() + INTERVAL '320 days', NOW(), NOW()),
('equipment-demo-clinic-ophthalmoscope-1-uuid', 'facility-demo-clinic-uuid', 'Digital Ophthalmoscope', 'ophthalmoscope', 'Welch Allyn PanOptic', 'OP-001-2024', 'active', NOW() - INTERVAL '20 days', NOW() + INTERVAL '345 days', NOW(), NOW()),

-- Lab Equipment
('equipment-demo-clinic-microscope-1-uuid', 'facility-demo-clinic-uuid', 'Digital Microscope', 'microscope', 'Olympus BX53', 'MC-001-2024', 'active', NOW() - INTERVAL '90 days', NOW() + INTERVAL '275 days', NOW(), NOW()),
('equipment-demo-clinic-centrifuge-1-uuid', 'facility-demo-clinic-uuid', 'Centrifuge', 'centrifuge', 'Eppendorf 5424', 'CF-001-2024', 'active', NOW() - INTERVAL '30 days', NOW() + INTERVAL '335 days', NOW(), NOW()),
('equipment-demo-clinic-analyzer-1-uuid', 'facility-demo-clinic-uuid', 'Blood Analyzer', 'analyzer', 'Sysmex XN-1000', 'BA-001-2024', 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '350 days', NOW(), NOW());

-- Demo Hospital Equipment
INSERT INTO equipment (id, facility_id, name, equipment_type, model, serial_number, status, last_maintenance, next_maintenance, created_at, updated_at) VALUES
-- Operating Room Equipment
('equipment-demo-hospital-surgical-table-1-uuid', 'facility-demo-hospital-uuid', 'Surgical Table', 'surgical_table', 'Maquet Alphamaxx', 'ST-001-2024', 'active', NOW() - INTERVAL '30 days', NOW() + INTERVAL '335 days', NOW(), NOW()),
('equipment-demo-hospital-anesthesia-machine-1-uuid', 'facility-demo-hospital-uuid', 'Anesthesia Machine', 'anesthesia_machine', 'Drager Primus', 'AM-001-2024', 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '350 days', NOW(), NOW()),
('equipment-demo-hospital-monitor-1-uuid', 'facility-demo-hospital-uuid', 'Patient Monitor', 'patient_monitor', 'Philips IntelliVue MX800', 'PM-001-2024', 'active', NOW() - INTERVAL '7 days', NOW() + INTERVAL '358 days', NOW(), NOW()),

-- ICU Equipment
('equipment-demo-hospital-ventilator-1-uuid', 'facility-demo-hospital-uuid', 'Ventilator', 'ventilator', 'Hamilton C3', 'VT-001-2024', 'active', NOW() - INTERVAL '20 days', NOW() + INTERVAL '345 days', NOW(), NOW()),
('equipment-demo-hospital-defibrillator-1-uuid', 'facility-demo-hospital-uuid', 'Defibrillator', 'defibrillator', 'Philips HeartStart MRx', 'DF-001-2024', 'active', NOW() - INTERVAL '10 days', NOW() + INTERVAL '355 days', NOW(), NOW()),
('equipment-demo-hospital-infusion-pump-1-uuid', 'facility-demo-hospital-uuid', 'Infusion Pump', 'infusion_pump', 'Baxter Sigma Spectrum', 'IP-001-2024', 'active', NOW() - INTERVAL '5 days', NOW() + INTERVAL '360 days', NOW(), NOW()),

-- Radiology Equipment
('equipment-demo-hospital-xray-1-uuid', 'facility-demo-hospital-uuid', 'X-Ray Machine', 'xray_machine', 'Siemens Mobilett Mira', 'XR-001-2024', 'active', NOW() - INTERVAL '45 days', NOW() + INTERVAL '320 days', NOW(), NOW()),
('equipment-demo-hospital-ultrasound-1-uuid', 'facility-demo-hospital-uuid', 'Ultrasound Machine', 'ultrasound', 'GE Logiq E10', 'US-001-2024', 'active', NOW() - INTERVAL '30 days', NOW() + INTERVAL '335 days', NOW(), NOW());

-- Demo Diagnostic Center Equipment
INSERT INTO equipment (id, facility_id, name, equipment_type, model, serial_number, status, last_maintenance, next_maintenance, created_at, updated_at) VALUES
-- MRI Equipment
('equipment-demo-diagnostic-mri-1-uuid', 'facility-demo-diagnostic-uuid', 'MRI Scanner', 'mri_scanner', 'Siemens Magnetom Aera 1.5T', 'MRI-001-2024', 'active', NOW() - INTERVAL '60 days', NOW() + INTERVAL '305 days', NOW(), NOW()),

-- CT Equipment
('equipment-demo-diagnostic-ct-1-uuid', 'facility-demo-diagnostic-uuid', 'CT Scanner', 'ct_scanner', 'GE Revolution EVO', 'CT-001-2024', 'active', NOW() - INTERVAL '45 days', NOW() + INTERVAL '320 days', NOW(), NOW()),

-- Ultrasound Equipment
('equipment-demo-diagnostic-ultrasound-1-uuid', 'facility-demo-diagnostic-uuid', 'Ultrasound Machine', 'ultrasound', 'Philips EPIQ 7', 'US-001-2024', 'active', NOW() - INTERVAL '30 days', NOW() + INTERVAL '335 days', NOW(), NOW()),

-- X-Ray Equipment
('equipment-demo-diagnostic-xray-1-uuid', 'facility-demo-diagnostic-uuid', 'Digital X-Ray', 'xray_machine', 'Siemens Mobilett Mira Max', 'XR-001-2024', 'active', NOW() - INTERVAL '20 days', NOW() + INTERVAL '345 days', NOW(), NOW()),

-- Mammography Equipment
('equipment-demo-diagnostic-mammo-1-uuid', 'facility-demo-diagnostic-uuid', 'Mammography Machine', 'mammography', 'Hologic Selenia Dimensions', 'MM-001-2024', 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '350 days', NOW(), NOW());

-- Demo Surgery Center Equipment
INSERT INTO equipment (id, facility_id, name, equipment_type, model, serial_number, status, last_maintenance, next_maintenance, created_at, updated_at) VALUES
-- Surgical Equipment
('equipment-demo-surgery-table-1-uuid', 'facility-demo-surgery-uuid', 'Surgical Table', 'surgical_table', 'Maquet Alphamaxx', 'ST-001-2024', 'active', NOW() - INTERVAL '30 days', NOW() + INTERVAL '335 days', NOW(), NOW()),
('equipment-demo-surgery-table-2-uuid', 'facility-demo-surgery-uuid', 'Surgical Table', 'surgical_table', 'Maquet Alphamaxx', 'ST-002-2024', 'active', NOW() - INTERVAL '25 days', NOW() + INTERVAL '340 days', NOW(), NOW()),

-- Anesthesia Equipment
('equipment-demo-surgery-anesthesia-1-uuid', 'facility-demo-surgery-uuid', 'Anesthesia Machine', 'anesthesia_machine', 'Drager Primus', 'AM-001-2024', 'active', NOW() - INTERVAL '20 days', NOW() + INTERVAL '345 days', NOW(), NOW()),
('equipment-demo-surgery-anesthesia-2-uuid', 'facility-demo-surgery-uuid', 'Anesthesia Machine', 'anesthesia_machine', 'Drager Primus', 'AM-002-2024', 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '350 days', NOW(), NOW()),

-- Monitoring Equipment
('equipment-demo-surgery-monitor-1-uuid', 'facility-demo-surgery-uuid', 'Patient Monitor', 'patient_monitor', 'Philips IntelliVue MX800', 'PM-001-2024', 'active', NOW() - INTERVAL '10 days', NOW() + INTERVAL '355 days', NOW(), NOW()),
('equipment-demo-surgery-monitor-2-uuid', 'facility-demo-surgery-uuid', 'Patient Monitor', 'patient_monitor', 'Philips IntelliVue MX800', 'PM-002-2024', 'active', NOW() - INTERVAL '5 days', NOW() + INTERVAL '360 days', NOW(), NOW()),

-- Recovery Equipment
('equipment-demo-surgery-recovery-monitor-uuid', 'facility-demo-surgery-uuid', 'Recovery Monitor', 'patient_monitor', 'Philips IntelliVue MX450', 'PM-003-2024', 'active', NOW() - INTERVAL '7 days', NOW() + INTERVAL '358 days', NOW(), NOW());
