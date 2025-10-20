-- Seed Data: Post Offices (UAE Healthcare Authorities & Clearinghouses)
-- Execution Order: 3 (No dependencies)

INSERT INTO post_offices (id, code, name, authority, emirate, is_active) VALUES
(gen_random_uuid(), 'DHPO', 'Dubai Health Post Office (eClaimLink)', 'DHA', 'Dubai', TRUE),
(gen_random_uuid(), 'DOH_SHF', 'DOH Shafafiya', 'DOH', 'Abu Dhabi', TRUE),
(gen_random_uuid(), 'MOHAP', 'Ministry of Health and Prevention', 'MOHAP', 'Federal', TRUE),
(gen_random_uuid(), 'HAAD', 'Department of Health Abu Dhabi', 'DOH', 'Abu Dhabi', TRUE),
(gen_random_uuid(), 'SHARJAH_DOH', 'Sharjah Department of Health', 'Sharjah Health Authority', 'Sharjah', TRUE),
(gen_random_uuid(), 'CLEARING_UAE', 'UAE National Clearinghouse', 'PRIVATE', 'Federal', TRUE);

-- Verify
SELECT code, name, authority, emirate FROM post_offices ORDER BY emirate, code;
