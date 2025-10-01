-- HIE Data Mappings Seed Data
-- This file populates the hie_data_mappings table with field mapping configurations for each HIE platform

INSERT INTO hie_data_mappings (id, tenant_id, platform_id, resource_type, field_mapping, transformation_rules, validation_rules, is_active) VALUES
-- NABIDH Patient Mapping
('hie-mapping-nabidh-patient-uuid', 'tenant-demo-clinic-uuid', 'hie-nabidh-uuid', 'Patient',
 '{"identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "emirates_id"}], "name": [{"use": "official", "family": "last_name", "given": ["first_name"]}], "gender": "gender", "birthDate": "date_of_birth", "address": [{"use": "home", "line": ["address_line_1", "address_line_2"], "city": "city", "state": "emirate", "postalCode": "postal_code", "country": "AE"}]}',
 '{"date_of_birth": "format_date", "gender": "map_gender", "emirate": "map_emirate_code"}',
 '{"required_fields": ["emirates_id", "first_name", "last_name", "date_of_birth", "gender"], "emirates_id_format": "^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$"}',
 TRUE),

-- NABIDH Encounter Mapping
('hie-mapping-nabidh-encounter-uuid', 'tenant-demo-clinic-uuid', 'hie-nabidh-uuid', 'Encounter',
 '{"status": "finished", "class": {"system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "AMB", "display": "ambulatory"}, "subject": {"reference": "Patient/{patient_id}"}, "participant": [{"individual": {"reference": "Practitioner/{primary_staff_id}"}}], "period": {"start": "start_time", "end": "end_time"}}',
 '{"start_time": "format_datetime", "end_time": "format_datetime"}',
 '{"required_fields": ["patient_id", "primary_staff_id", "start_time"]}',
 TRUE),

-- NABIDH Observation Mapping
('hie-mapping-nabidh-observation-uuid', 'tenant-demo-clinic-uuid', 'hie-nabidh-uuid', 'Observation',
 '{"status": "final", "category": [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/observation-category", "code": "vital-signs", "display": "Vital Signs"}]}], "code": {"coding": [{"system": "http://loinc.org", "code": "loinc_code", "display": "description"}]}, "subject": {"reference": "Patient/{patient_id}"}, "encounter": {"reference": "Encounter/{encounter_id}"}, "valueQuantity": {"value": "value", "unit": "unit", "system": "http://unitsofmeasure.org", "code": "unit_code"}, "effectiveDateTime": "recorded_at"}',
 '{"recorded_at": "format_datetime", "value": "format_numeric"}',
 '{"required_fields": ["patient_id", "encounter_id", "loinc_code", "value", "unit"]}',
 TRUE),

-- Malaffi Patient Mapping
('hie-mapping-malaffi-patient-uuid', 'tenant-demo-clinic-uuid', 'hie-malaffi-uuid', 'Patient',
 '{"identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "emirates_id"}], "name": [{"use": "official", "family": "last_name", "given": ["first_name"]}], "gender": "gender", "birthDate": "date_of_birth", "address": [{"use": "home", "line": ["address_line_1"], "city": "city", "state": "emirate", "postalCode": "postal_code", "country": "AE"}]}',
 '{"date_of_birth": "format_date", "gender": "map_gender", "emirate": "map_emirate_code"}',
 '{"required_fields": ["emirates_id", "first_name", "last_name", "date_of_birth", "gender"], "emirates_id_format": "^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$"}',
 TRUE),

-- Malaffi Encounter Mapping
('hie-mapping-malaffi-encounter-uuid', 'tenant-demo-clinic-uuid', 'hie-malaffi-uuid', 'Encounter',
 '{"status": "finished", "class": {"system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "AMB", "display": "ambulatory"}, "subject": {"reference": "Patient/{patient_id}"}, "participant": [{"individual": {"reference": "Practitioner/{primary_staff_id}"}}], "period": {"start": "start_time", "end": "end_time"}}',
 '{"start_time": "format_datetime", "end_time": "format_datetime"}',
 '{"required_fields": ["patient_id", "primary_staff_id", "start_time"]}',
 TRUE),

-- Riayati Patient Mapping
('hie-mapping-riayati-patient-uuid', 'tenant-demo-clinic-uuid', 'hie-riayati-uuid', 'Patient',
 '{"identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "emirates_id"}, {"use": "secondary", "system": "http://fhir.ae/identifier/unified-medical-record", "value": "unified_medical_record_number"}], "name": [{"use": "official", "family": "last_name", "given": ["first_name"]}], "gender": "gender", "birthDate": "date_of_birth", "address": [{"use": "home", "line": ["address_line_1", "address_line_2"], "city": "city", "state": "emirate", "postalCode": "postal_code", "country": "AE"}]}',
 '{"date_of_birth": "format_date", "gender": "map_gender", "emirate": "map_emirate_code"}',
 '{"required_fields": ["emirates_id", "first_name", "last_name", "date_of_birth", "gender"], "emirates_id_format": "^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$"}',
 TRUE),

-- Riayati Encounter Mapping
('hie-mapping-riayati-encounter-uuid', 'tenant-demo-clinic-uuid', 'hie-riayati-uuid', 'Encounter',
 '{"status": "finished", "class": {"system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "AMB", "display": "ambulatory"}, "subject": {"reference": "Patient/{patient_id}"}, "participant": [{"individual": {"reference": "Practitioner/{primary_staff_id}"}}], "period": {"start": "start_time", "end": "end_time"}}',
 '{"start_time": "format_datetime", "end_time": "format_datetime"}',
 '{"required_fields": ["patient_id", "primary_staff_id", "start_time"]}',
 TRUE),

-- Hospital tenant mappings (same mappings for hospital)
('hie-mapping-nabidh-patient-hospital-uuid', 'tenant-demo-hospital-uuid', 'hie-nabidh-uuid', 'Patient',
 '{"identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "emirates_id"}], "name": [{"use": "official", "family": "last_name", "given": ["first_name"]}], "gender": "gender", "birthDate": "date_of_birth", "address": [{"use": "home", "line": ["address_line_1", "address_line_2"], "city": "city", "state": "emirate", "postalCode": "postal_code", "country": "AE"}]}',
 '{"date_of_birth": "format_date", "gender": "map_gender", "emirate": "map_emirate_code"}',
 '{"required_fields": ["emirates_id", "first_name", "last_name", "date_of_birth", "gender"], "emirates_id_format": "^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$"}',
 TRUE),

('hie-mapping-malaffi-patient-hospital-uuid', 'tenant-demo-hospital-uuid', 'hie-malaffi-uuid', 'Patient',
 '{"identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "emirates_id"}], "name": [{"use": "official", "family": "last_name", "given": ["first_name"]}], "gender": "gender", "birthDate": "date_of_birth", "address": [{"use": "home", "line": ["address_line_1"], "city": "city", "state": "emirate", "postalCode": "postal_code", "country": "AE"}]}',
 '{"date_of_birth": "format_date", "gender": "map_gender", "emirate": "map_emirate_code"}',
 '{"required_fields": ["emirates_id", "first_name", "last_name", "date_of_birth", "gender"], "emirates_id_format": "^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$"}',
 TRUE),

('hie-mapping-riayati-patient-hospital-uuid', 'tenant-demo-hospital-uuid', 'hie-riayati-uuid', 'Patient',
 '{"identifier": [{"use": "official", "system": "http://fhir.ae/identifier/emirates-id", "value": "emirates_id"}, {"use": "secondary", "system": "http://fhir.ae/identifier/unified-medical-record", "value": "unified_medical_record_number"}], "name": [{"use": "official", "family": "last_name", "given": ["first_name"]}], "gender": "gender", "birthDate": "date_of_birth", "address": [{"use": "home", "line": ["address_line_1", "address_line_2"], "city": "city", "state": "emirate", "postalCode": "postal_code", "country": "AE"}]}',
 '{"date_of_birth": "format_date", "gender": "map_gender", "emirate": "map_emirate_code"}',
 '{"required_fields": ["emirates_id", "first_name", "last_name", "date_of_birth", "gender"], "emirates_id_format": "^[0-9]{3}-[0-9]{4}-[0-9]{7}-[0-9]{1}$"}',
 TRUE);
