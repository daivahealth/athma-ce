-- Seed Data: Code Systems (Terminology Registries)
-- Execution Order: 4 (No dependencies)

INSERT INTO code_systems (id, system_uri, name, description, version, status, publisher) VALUES
(uuid_from_text('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'zeal:visit-category', 'Zeal Visit Category', 
 'Classification of visit types: new, revisit, follow-up', '1.0', 'active', 'Zeal Platform'),
 
(uuid_from_text('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'http://terminology.hl7.org/CodeSystem/icd-10', 'ICD-10', 
 'International Classification of Diseases, 10th Revision', '2021', 'active', 'WHO'),
 
(uuid_from_text('cccccccc-cccc-cccc-cccc-cccccccccccc'), 'http://www.ama-assn.org/go/cpt', 'CPT', 
 'Current Procedural Terminology', '2024', 'active', 'American Medical Association'),
 
(uuid_from_text('dddddddd-dddd-dddd-dddd-dddddddddddd'), 'zeal:encounter-source', 'Encounter Source', 
 'Source/origin of clinical encounters', '1.0', 'active', 'Zeal Platform'),
 
(uuid_from_text('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'), 'zeal:urgency-level', 'Urgency Level', 
 'Clinical urgency classification', '1.0', 'active', 'Zeal Platform');

-- Verify
SELECT system_uri, name, version FROM code_systems ORDER BY system_uri;
