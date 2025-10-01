-- HIE Sync Logs Seed Data
-- This file populates the hie_sync_logs table with sample synchronization log entries

INSERT INTO hie_sync_logs (id, tenant_id, platform_id, sync_type, resource_type, resource_id, fhir_id, operation, status, request_payload, response_payload, error_message, retry_count, max_retries, synced_at) VALUES
-- Successful patient synchronizations
('hie-sync-ahmed-nabidh-patient-uuid', 'tenant-demo-clinic-uuid', 'hie-nabidh-uuid', 'real_time', 'Patient', 'patient-ahmed-uuid', 'nabidh-patient-001', 'create', 'success',
 '{"resourceType": "Patient", "identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "784-1990-1234567-1"}], "name": [{"use": "official", "family": "Al-Mansouri", "given": ["Ahmed"]}], "gender": "male", "birthDate": "1990-05-15"}',
 '{"resourceType": "Patient", "id": "nabidh-patient-001", "meta": {"versionId": "1", "lastUpdated": "2024-01-15T10:30:00Z"}}',
 NULL, 0, 3, '2024-01-15 10:30:15+04'),

('hie-sync-ahmed-malaffi-patient-uuid', 'tenant-demo-clinic-uuid', 'hie-malaffi-uuid', 'real_time', 'Patient', 'patient-ahmed-uuid', 'malaffi-patient-001', 'create', 'success',
 '{"resourceType": "Patient", "identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "784-1990-1234567-1"}], "name": [{"use": "official", "family": "Al-Mansouri", "given": ["Ahmed"]}], "gender": "male", "birthDate": "1990-05-15"}',
 '{"resourceType": "Patient", "id": "malaffi-patient-001", "meta": {"versionId": "1", "lastUpdated": "2024-01-15T10:35:00Z"}}',
 NULL, 0, 3, '2024-01-15 10:35:20+04'),

('hie-sync-ahmed-riayati-patient-uuid', 'tenant-demo-clinic-uuid', 'hie-riayati-uuid', 'real_time', 'Patient', 'patient-ahmed-uuid', 'riayati-patient-001', 'create', 'success',
 '{"resourceType": "Patient", "identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "784-1990-1234567-1"}, {"use": "secondary", "system": "http://fhir.ae/identifier/unified-medical-record", "value": "UAE-001-2024"}], "name": [{"use": "official", "family": "Al-Mansouri", "given": ["Ahmed"]}], "gender": "male", "birthDate": "1990-05-15"}',
 '{"resourceType": "Patient", "id": "riayati-patient-001", "meta": {"versionId": "1", "lastUpdated": "2024-01-15T10:40:00Z"}}',
 NULL, 0, 3, '2024-01-15 10:40:25+04'),

-- Successful encounter synchronizations
('hie-sync-ahmed-encounter-nabidh-uuid', 'tenant-demo-clinic-uuid', 'hie-nabidh-uuid', 'real_time', 'Encounter', 'encounter-ahmed-001-uuid', 'nabidh-encounter-001', 'create', 'success',
 '{"resourceType": "Encounter", "status": "finished", "class": {"system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "AMB", "display": "ambulatory"}, "subject": {"reference": "Patient/nabidh-patient-001"}, "participant": [{"individual": {"reference": "Practitioner/nabidh-practitioner-001"}}], "period": {"start": "2024-01-15T10:00:00Z", "end": "2024-01-15T10:30:00Z"}}',
 '{"resourceType": "Encounter", "id": "nabidh-encounter-001", "meta": {"versionId": "1", "lastUpdated": "2024-01-15T10:30:30Z"}}',
 NULL, 0, 3, '2024-01-15 10:30:45+04'),

-- Failed synchronization (retry scenario)
('hie-sync-fatima-nabidh-patient-failed-uuid', 'tenant-demo-clinic-uuid', 'hie-nabidh-uuid', 'real_time', 'Patient', 'patient-fatima-uuid', NULL, 'create', 'failed',
 '{"resourceType": "Patient", "identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "784-1995-2345678-2"}], "name": [{"use": "official", "family": "Hassan", "given": ["Fatima"]}], "gender": "female", "birthDate": "1995-08-20"}',
 NULL,
 'HTTP 401 Unauthorized: Invalid access token', 2, 3, NULL),

-- Retry synchronization
('hie-sync-fatima-nabidh-patient-retry-uuid', 'tenant-demo-clinic-uuid', 'hie-nabidh-uuid', 'real_time', 'Patient', 'patient-fatima-uuid', 'nabidh-patient-002', 'create', 'success',
 '{"resourceType": "Patient", "identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "784-1995-2345678-2"}], "name": [{"use": "official", "family": "Hassan", "given": ["Fatima"]}], "gender": "female", "birthDate": "1995-08-20"}',
 '{"resourceType": "Patient", "id": "nabidh-patient-002", "meta": {"versionId": "1", "lastUpdated": "2024-02-01T14:20:00Z"}}',
 NULL, 0, 3, '2024-02-01 14:20:15+04'),

-- Batch synchronization
('hie-sync-batch-observations-nabidh-uuid', 'tenant-demo-clinic-uuid', 'hie-nabidh-uuid', 'batch', 'Observation', 'vital-ahmed-001-uuid', 'nabidh-observation-001', 'create', 'success',
 '{"resourceType": "Observation", "status": "final", "category": [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/observation-category", "code": "vital-signs", "display": "Vital Signs"}]}], "code": {"coding": [{"system": "http://loinc.org", "code": "8310-5", "display": "Body temperature"}]}, "subject": {"reference": "Patient/nabidh-patient-001"}, "encounter": {"reference": "Encounter/nabidh-encounter-001"}, "valueQuantity": {"value": 36.5, "unit": "C", "system": "http://unitsofmeasure.org", "code": "Cel"}, "effectiveDateTime": "2024-01-15T10:15:00Z"}',
 '{"resourceType": "Observation", "id": "nabidh-observation-001", "meta": {"versionId": "1", "lastUpdated": "2024-01-15T10:15:30Z"}}',
 NULL, 0, 3, '2024-01-15 10:15:45+04'),

-- On-demand query
('hie-sync-query-patient-nabidh-uuid', 'tenant-demo-clinic-uuid', 'hie-nabidh-uuid', 'on_demand', 'Patient', 'patient-ahmed-uuid', 'nabidh-patient-001', 'read', 'success',
 '{"identifier": "784-1990-1234567-1"}',
 '{"resourceType": "Bundle", "type": "searchset", "total": 1, "entry": [{"resource": {"resourceType": "Patient", "id": "nabidh-patient-001", "identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "784-1990-1234567-1"}], "name": [{"use": "official", "family": "Al-Mansouri", "given": ["Ahmed"]}], "gender": "male", "birthDate": "1990-05-15"}}]}',
 NULL, 0, 3, '2024-01-20 09:00:00+04'),

-- Hospital synchronizations
('hie-sync-hospital-patient-nabidh-uuid', 'tenant-demo-hospital-uuid', 'hie-nabidh-uuid', 'real_time', 'Patient', 'patient-hospital-uuid', 'nabidh-patient-hospital-001', 'create', 'success',
 '{"resourceType": "Patient", "identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "784-1985-3456789-3"}], "name": [{"use": "official", "family": "Hospital", "given": ["Patient"]}], "gender": "male", "birthDate": "1985-12-10"}',
 '{"resourceType": "Patient", "id": "nabidh-patient-hospital-001", "meta": {"versionId": "1", "lastUpdated": "2024-03-01T08:00:00Z"}}',
 NULL, 0, 3, '2024-03-01 08:00:15+04'),

-- Pending synchronization
('hie-sync-pending-observation-uuid', 'tenant-demo-clinic-uuid', 'hie-malaffi-uuid', 'real_time', 'Observation', 'vital-fatima-001-uuid', NULL, 'create', 'pending',
 '{"resourceType": "Observation", "status": "final", "category": [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/observation-category", "code": "vital-signs", "display": "Vital Signs"}]}], "code": {"coding": [{"system": "http://loinc.org", "code": "8310-5", "display": "Body temperature"}]}, "subject": {"reference": "Patient/malaffi-patient-002"}, "encounter": {"reference": "Encounter/malaffi-encounter-001"}, "valueQuantity": {"value": 37.2, "unit": "C", "system": "http://unitsofmeasure.org", "code": "Cel"}, "effectiveDateTime": "2024-02-01T14:15:00Z"}',
 NULL,
 NULL, 0, 3, NULL);
