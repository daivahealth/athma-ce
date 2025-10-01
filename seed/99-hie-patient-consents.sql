-- HIE Patient Consents Seed Data
-- This file populates the hie_patient_consents table with sample patient consent data

INSERT INTO hie_patient_consents (id, tenant_id, patient_id, platform_id, consent_type, consent_status, granted_resources, denied_resources, consent_date, expiration_date, consent_method, witness_user_id, notes) VALUES
-- Ahmed Al-Mansouri consents
('hie-consent-ahmed-nabidh-uuid', 'tenant-demo-clinic-uuid', 'patient-ahmed-uuid', 'hie-nabidh-uuid', 'data_sharing', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest'],
 ARRAY['Procedure', 'AllergyIntolerance'],
 '2024-01-15 10:30:00+04', '2025-01-15 10:30:00+04', 'digital_signature', 'user-clinic-physician-uuid',
 'Patient consented to share basic clinical data with NABIDH for care coordination'),

('hie-consent-ahmed-malaffi-uuid', 'tenant-demo-clinic-uuid', 'patient-ahmed-uuid', 'hie-malaffi-uuid', 'data_sharing', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport'],
 ARRAY['MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 '2024-01-15 10:35:00+04', '2025-01-15 10:35:00+04', 'digital_signature', 'user-clinic-physician-uuid',
 'Patient consented to share clinical data with Malaffi, excluding medications'),

('hie-consent-ahmed-riayati-uuid', 'tenant-demo-clinic-uuid', 'patient-ahmed-uuid', 'hie-riayati-uuid', 'data_sharing', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 ARRAY[]::TEXT[],
 '2024-01-15 10:40:00+04', '2025-01-15 10:40:00+04', 'digital_signature', 'user-clinic-physician-uuid',
 'Patient granted full consent for national unified medical record'),

-- Fatima Hassan consents
('hie-consent-fatima-nabidh-uuid', 'tenant-demo-clinic-uuid', 'patient-fatima-uuid', 'hie-nabidh-uuid', 'data_sharing', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport'],
 ARRAY['MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 '2024-02-01 14:20:00+04', '2025-02-01 14:20:00+04', 'digital_signature', 'user-clinic-nurse-uuid',
 'Patient consented to share basic clinical data with NABIDH'),

('hie-consent-fatima-malaffi-uuid', 'tenant-demo-clinic-uuid', 'patient-fatima-uuid', 'hie-malaffi-uuid', 'data_sharing', 'denied',
 ARRAY[]::TEXT[],
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 '2024-02-01 14:25:00+04', NULL, 'digital_signature', 'user-clinic-nurse-uuid',
 'Patient declined to share data with Malaffi'),

('hie-consent-fatima-riayati-uuid', 'tenant-demo-clinic-uuid', 'patient-fatima-uuid', 'hie-riayati-uuid', 'data_sharing', 'partial',
 ARRAY['Patient', 'Encounter', 'Observation'],
 ARRAY['DiagnosticReport', 'MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 '2024-02-01 14:30:00+04', '2025-02-01 14:30:00+04', 'digital_signature', 'user-clinic-nurse-uuid',
 'Patient granted limited consent for national record'),

-- Sara Al-Zaabi consents
('hie-consent-sara-nabidh-uuid', 'tenant-demo-clinic-uuid', 'patient-sara-uuid', 'hie-nabidh-uuid', 'data_sharing', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure'],
 ARRAY['AllergyIntolerance'],
 '2024-02-15 09:15:00+04', '2025-02-15 09:15:00+04', 'digital_signature', 'user-clinic-physician-uuid',
 'Patient consented to share comprehensive clinical data with NABIDH'),

('hie-consent-sara-malaffi-uuid', 'tenant-demo-clinic-uuid', 'patient-sara-uuid', 'hie-malaffi-uuid', 'data_sharing', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport'],
 ARRAY['MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 '2024-02-15 09:20:00+04', '2025-02-15 09:20:00+04', 'digital_signature', 'user-clinic-physician-uuid',
 'Patient consented to share basic clinical data with Malaffi'),

('hie-consent-sara-riayati-uuid', 'tenant-demo-clinic-uuid', 'patient-sara-uuid', 'hie-riayati-uuid', 'data_sharing', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 ARRAY[]::TEXT[],
 '2024-02-15 09:25:00+04', '2025-02-15 09:25:00+04', 'digital_signature', 'user-clinic-physician-uuid',
 'Patient granted full consent for national unified medical record'),

-- Emergency access consents
('hie-consent-ahmed-emergency-uuid', 'tenant-demo-clinic-uuid', 'patient-ahmed-uuid', 'hie-nabidh-uuid', 'emergency_access', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 ARRAY[]::TEXT[],
 '2024-01-15 10:45:00+04', NULL, 'verbal', 'user-clinic-physician-uuid',
 'Emergency access consent for life-threatening situations'),

('hie-consent-fatima-emergency-uuid', 'tenant-demo-clinic-uuid', 'patient-fatima-uuid', 'hie-nabidh-uuid', 'emergency_access', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 ARRAY[]::TEXT[],
 '2024-02-01 14:35:00+04', NULL, 'verbal', 'user-clinic-nurse-uuid',
 'Emergency access consent for life-threatening situations'),

('hie-consent-sara-emergency-uuid', 'tenant-demo-clinic-uuid', 'patient-sara-uuid', 'hie-nabidh-uuid', 'emergency_access', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 ARRAY[]::TEXT[],
 '2024-02-15 09:30:00+04', NULL, 'verbal', 'user-clinic-physician-uuid',
 'Emergency access consent for life-threatening situations'),

-- Hospital patient consents
('hie-consent-hospital-patient-nabidh-uuid', 'tenant-demo-hospital-uuid', 'patient-hospital-uuid', 'hie-nabidh-uuid', 'data_sharing', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 ARRAY[]::TEXT[],
 '2024-03-01 08:00:00+04', '2025-03-01 08:00:00+04', 'digital_signature', 'user-hospital-physician-uuid',
 'Hospital patient consented to share all clinical data with NABIDH'),

('hie-consent-hospital-patient-malaffi-uuid', 'tenant-demo-hospital-uuid', 'patient-hospital-uuid', 'hie-malaffi-uuid', 'data_sharing', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 ARRAY[]::TEXT[],
 '2024-03-01 08:05:00+04', '2025-03-01 08:05:00+04', 'digital_signature', 'user-hospital-physician-uuid',
 'Hospital patient consented to share all clinical data with Malaffi'),

('hie-consent-hospital-patient-riayati-uuid', 'tenant-demo-hospital-uuid', 'patient-hospital-uuid', 'hie-riayati-uuid', 'data_sharing', 'granted',
 ARRAY['Patient', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'AllergyIntolerance'],
 ARRAY[]::TEXT[],
 '2024-03-01 08:10:00+04', '2025-03-01 08:10:00+04', 'digital_signature', 'user-hospital-physician-uuid',
 'Hospital patient consented to share all clinical data with Riayati');
