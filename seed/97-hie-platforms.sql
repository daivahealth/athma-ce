-- HIE Platforms Seed Data
-- This file populates the hie_platforms table with UAE HIE platform configurations

INSERT INTO hie_platforms (id, name, display_name, authority, base_url, fhir_version, auth_type, auth_config, supported_resources, sync_enabled, is_active) VALUES
-- NABIDH (Dubai Health Authority)
('hie-nabidh-uuid', 'nabidh', 'NABIDH', 'DHA', 'https://api.nabidh.ae/fhir/R4', 'R4', 'oauth2', 
 '{"client_id": "zeal_nabidh_client", "client_secret": "encrypted_secret", "token_url": "https://auth.nabidh.ae/oauth2/token", "scope": "patient/*.read patient/*.write encounter/*.read encounter/*.write observation/*.read observation/*.write diagnosticreport/*.read diagnosticreport/*.write"}',
 ARRAY['Patient', 'Practitioner', 'Organization', 'Location', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'Condition', 'AllergyIntolerance', 'Appointment', 'Schedule', 'Coverage', 'Claim'],
 TRUE, TRUE),

-- Malaffi (Department of Health Abu Dhabi)
('hie-malaffi-uuid', 'malaffi', 'Malaffi', 'DOH', 'https://api.malaffi.ae/fhir/R4', 'R4', 'certificate',
 '{"certificate_path": "/certs/malaffi-client.pem", "private_key_path": "/certs/malaffi-private.key", "ca_certificate_path": "/certs/malaffi-ca.pem", "verify_ssl": true}',
 ARRAY['Patient', 'Practitioner', 'Organization', 'Location', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'Condition', 'AllergyIntolerance', 'Appointment', 'Schedule'],
 TRUE, TRUE),

-- Riayati (Ministry of Health and Prevention)
('hie-riayati-uuid', 'riayati', 'Riayati', 'MOHAP', 'https://api.riayati.ae/fhir/R4', 'R4', 'oauth2_pkce',
 '{"client_id": "zeal_riayati_client", "auth_url": "https://auth.riayati.ae/oauth2/authorize", "token_url": "https://auth.riayati.ae/oauth2/token", "redirect_uri": "https://zeal.ae/auth/riayati/callback", "scope": "patient/*.read patient/*.write encounter/*.read encounter/*.write observation/*.read observation/*.write"}',
 ARRAY['Patient', 'Practitioner', 'Organization', 'Location', 'Encounter', 'Observation', 'DiagnosticReport', 'MedicationRequest', 'Procedure', 'Condition', 'AllergyIntolerance', 'Appointment', 'Schedule', 'Coverage', 'Claim'],
 TRUE, TRUE);
