-- Seed Data: Specialties (Global reference data)
-- Execution Order: 2 (No dependencies)

INSERT INTO specialties (id, code, name, description, is_active) VALUES
(gen_random_uuid(), 'GP', 'General Practice', 'Primary care and family medicine', TRUE),
(gen_random_uuid(), 'IM', 'Internal Medicine', 'Adult internal medicine', TRUE),
(gen_random_uuid(), 'PED', 'Pediatrics', 'Children healthcare', TRUE),
(gen_random_uuid(), 'OBGYN', 'Obstetrics & Gynecology', 'Women healthcare', TRUE),
(gen_random_uuid(), 'DERM', 'Dermatology', 'Skin conditions and cosmetic procedures', TRUE),
(gen_random_uuid(), 'ORTHO', 'Orthopedics', 'Musculoskeletal system', TRUE),
(gen_random_uuid(), 'CARDIO', 'Cardiology', 'Heart and cardiovascular system', TRUE),
(gen_random_uuid(), 'ENT', 'Otolaryngology', 'Ear, nose, and throat', TRUE),
(gen_random_uuid(), 'OPHTHAL', 'Ophthalmology', 'Eye care and vision', TRUE),
(gen_random_uuid(), 'PSYCH', 'Psychiatry', 'Mental health', TRUE),
(gen_random_uuid(), 'RADIO', 'Radiology', 'Medical imaging', TRUE),
(gen_random_uuid(), 'PATH', 'Pathology', 'Laboratory medicine', TRUE),
(gen_random_uuid(), 'PHYSIO', 'Physiotherapy', 'Physical therapy and rehabilitation', TRUE),
(gen_random_uuid(), 'DENTAL', 'Dentistry', 'Oral health and dental care', TRUE),
(gen_random_uuid(), 'EMERG', 'Emergency Medicine', 'Emergency and urgent care', TRUE);

-- Verify
SELECT code, name, is_active FROM specialties ORDER BY code;
