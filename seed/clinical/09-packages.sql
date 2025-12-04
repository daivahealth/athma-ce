-- Seed data for Packages and Package Items
-- Includes various types of health checkup packages with lab tests, imaging, and procedures

-- Package 1: Basic Health Checkup
INSERT INTO packages (
    id,
    tenant_id,
    code,
    name,
    description,
    package_type,
    gender_restriction,
    min_age_years,
    max_age_years,
    care_setting,
    validity_days,
    is_active,
    is_public,
    metadata,
    created_at,
    updated_at
) VALUES (
    '30000000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'HC-BASIC-001',
    'Basic Health Checkup',
    'Comprehensive basic health screening package including blood tests and physical examination',
    'health_check',
    NULL,
    18,
    NULL,
    'OP',
    90,
    TRUE,
    TRUE,
    '{"marketing_name": "Essential Health Package", "discount_percent": 10}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Package Items for Basic Health Checkup
INSERT INTO package_items (
    id,
    package_id,
    catalog_type,
    catalog_id,
    quantity,
    is_mandatory,
    clinical_only,
    group_name,
    sort_order,
    max_uses_per_package,
    notes,
    created_at,
    updated_at
) VALUES
    -- Lab Tests
    ('31000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'LAB_TEST', '11111111-2222-3333-4444-000000000001', 1, TRUE, FALSE, 'Blood Tests', 1, NULL, 'Complete Blood Count', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'LAB_TEST', '11111111-2222-3333-4444-000000000002', 1, TRUE, FALSE, 'Blood Tests', 2, NULL, 'Lipid Profile', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 'LAB_TEST', '11111111-2222-3333-4444-000000000003', 1, TRUE, FALSE, 'Blood Tests', 3, NULL, 'Fasting Blood Sugar', NOW(), NOW()),
    -- Imaging
    ('31000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 'IMAGING_STUDY', '11111111-3333-4444-5555-000000000001', 1, FALSE, FALSE, 'Imaging', 4, NULL, 'Chest X-Ray PA', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Package 2: Pre-Employment Health Screening
INSERT INTO packages (
    id,
    tenant_id,
    code,
    name,
    description,
    package_type,
    gender_restriction,
    min_age_years,
    max_age_years,
    care_setting,
    validity_days,
    is_active,
    is_public,
    metadata,
    created_at,
    updated_at
) VALUES (
    '30000000-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'HC-PREEMP-001',
    'Pre-Employment Health Screening',
    'Standard pre-employment medical examination including fitness certificate',
    'pre_employment',
    NULL,
    18,
    65,
    'OP',
    30,
    TRUE,
    TRUE,
    '{"marketing_name": "Employment Fitness Package", "includes_certificate": true}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Package Items for Pre-Employment Screening
INSERT INTO package_items (
    id,
    package_id,
    catalog_type,
    catalog_id,
    quantity,
    is_mandatory,
    clinical_only,
    group_name,
    sort_order,
    max_uses_per_package,
    notes,
    created_at,
    updated_at
) VALUES
    -- Lab Tests
    ('31000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000002', 'LAB_TEST', '11111111-2222-3333-4444-000000000001', 1, TRUE, FALSE, 'Lab Tests', 1, NULL, 'CBC', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000002', 'LAB_TEST', '11111111-2222-3333-4444-000000000004', 1, TRUE, FALSE, 'Lab Tests', 2, NULL, 'Liver Function Test', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000002', 'LAB_TEST', '11111111-2222-3333-4444-000000000006', 1, TRUE, FALSE, 'Lab Tests', 3, NULL, 'Urinalysis', NOW(), NOW()),
    -- Imaging
    ('31000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000002', 'IMAGING_STUDY', '11111111-3333-4444-5555-000000000001', 1, TRUE, FALSE, 'Imaging', 4, NULL, 'Chest X-Ray', NOW(), NOW()),
    -- Procedure
    ('31000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000002', 'PROCEDURE', '11111111-4444-5555-6666-000000000001', 1, TRUE, FALSE, 'Procedures', 5, NULL, 'ECG', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Package 3: Executive Health Checkup
INSERT INTO packages (
    id,
    tenant_id,
    code,
    name,
    description,
    package_type,
    gender_restriction,
    min_age_years,
    max_age_years,
    care_setting,
    validity_days,
    is_active,
    is_public,
    metadata,
    created_at,
    updated_at
) VALUES (
    '30000000-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-111111111111',
    'HC-EXEC-001',
    'Executive Health Checkup',
    'Comprehensive executive health screening with advanced diagnostics and specialist consultations',
    'health_check',
    NULL,
    30,
    NULL,
    'OP',
    180,
    TRUE,
    TRUE,
    '{"marketing_name": "Premium Executive Package", "discount_percent": 15, "includes_consultation": true}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Package Items for Executive Health Checkup
INSERT INTO package_items (
    id,
    package_id,
    catalog_type,
    catalog_id,
    quantity,
    is_mandatory,
    clinical_only,
    group_name,
    sort_order,
    max_uses_per_package,
    notes,
    created_at,
    updated_at
) VALUES
    -- Lab Tests
    ('31000000-0000-0000-0000-000000000021', '30000000-0000-0000-0000-000000000003', 'LAB_TEST', '11111111-2222-3333-4444-000000000001', 1, TRUE, FALSE, 'Blood Tests', 1, NULL, 'CBC', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000022', '30000000-0000-0000-0000-000000000003', 'LAB_TEST', '11111111-2222-3333-4444-000000000002', 1, TRUE, FALSE, 'Blood Tests', 2, NULL, 'Lipid Profile', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000023', '30000000-0000-0000-0000-000000000003', 'LAB_TEST', '11111111-2222-3333-4444-000000000003', 1, TRUE, FALSE, 'Blood Tests', 3, NULL, 'Fasting Blood Sugar', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000024', '30000000-0000-0000-0000-000000000003', 'LAB_TEST', '11111111-2222-3333-4444-000000000004', 1, TRUE, FALSE, 'Blood Tests', 4, NULL, 'Liver Function', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000025', '30000000-0000-0000-0000-000000000003', 'LAB_TEST', '11111111-2222-3333-4444-000000000005', 1, TRUE, FALSE, 'Blood Tests', 5, NULL, 'Kidney Function', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000026', '30000000-0000-0000-0000-000000000003', 'LAB_TEST', '11111111-2222-3333-4444-000000000007', 1, TRUE, FALSE, 'Blood Tests', 6, NULL, 'Thyroid Profile', NOW(), NOW()),
    -- Imaging
    ('31000000-0000-0000-0000-000000000027', '30000000-0000-0000-0000-000000000003', 'IMAGING_STUDY', '11111111-3333-4444-5555-000000000001', 1, TRUE, FALSE, 'Imaging', 7, NULL, 'Chest X-Ray', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000028', '30000000-0000-0000-0000-000000000003', 'IMAGING_STUDY', '11111111-3333-4444-5555-000000000004', 1, TRUE, FALSE, 'Imaging', 8, NULL, 'Abdominal Ultrasound', NOW(), NOW()),
    -- Procedures
    ('31000000-0000-0000-0000-000000000029', '30000000-0000-0000-0000-000000000003', 'PROCEDURE', '11111111-4444-5555-6666-000000000001', 1, TRUE, FALSE, 'Procedures', 9, NULL, 'ECG', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000030', '30000000-0000-0000-0000-000000000003', 'PROCEDURE', '11111111-4444-5555-6666-000000000003', 1, FALSE, FALSE, 'Procedures', 10, NULL, 'Stress Test', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Package 4: Women's Health Checkup
INSERT INTO packages (
    id,
    tenant_id,
    code,
    name,
    description,
    package_type,
    gender_restriction,
    min_age_years,
    max_age_years,
    care_setting,
    validity_days,
    is_active,
    is_public,
    metadata,
    created_at,
    updated_at
) VALUES (
    '30000000-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-111111111111',
    'HC-WOMEN-001',
    'Women''s Health Checkup',
    'Comprehensive women''s health screening package including gynecological examinations',
    'health_check',
    'female',
    18,
    NULL,
    'OP',
    90,
    TRUE,
    TRUE,
    '{"marketing_name": "Women''s Wellness Package", "discount_percent": 12}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Package Items for Women's Health Checkup
INSERT INTO package_items (
    id,
    package_id,
    catalog_type,
    catalog_id,
    quantity,
    is_mandatory,
    clinical_only,
    group_name,
    sort_order,
    max_uses_per_package,
    notes,
    created_at,
    updated_at
) VALUES
    -- Lab Tests
    ('31000000-0000-0000-0000-000000000031', '30000000-0000-0000-0000-000000000004', 'LAB_TEST', '11111111-2222-3333-4444-000000000001', 1, TRUE, FALSE, 'Lab Tests', 1, NULL, 'CBC', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000032', '30000000-0000-0000-0000-000000000004', 'LAB_TEST', '11111111-2222-3333-4444-000000000007', 1, TRUE, FALSE, 'Lab Tests', 2, NULL, 'Thyroid Profile', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000033', '30000000-0000-0000-0000-000000000004', 'LAB_TEST', '11111111-2222-3333-4444-000000000010', 1, TRUE, FALSE, 'Lab Tests', 3, NULL, 'Vitamin D', NOW(), NOW()),
    -- Imaging
    ('31000000-0000-0000-0000-000000000034', '30000000-0000-0000-0000-000000000004', 'IMAGING_STUDY', '11111111-3333-4444-5555-000000000005', 1, TRUE, FALSE, 'Imaging', 4, NULL, 'Pelvic Ultrasound', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000035', '30000000-0000-0000-0000-000000000004', 'IMAGING_STUDY', '11111111-3333-4444-5555-000000000006', 1, FALSE, FALSE, 'Imaging', 5, NULL, 'Mammography', NOW(), NOW()),
    -- Procedures
    ('31000000-0000-0000-0000-000000000036', '30000000-0000-0000-0000-000000000004', 'PROCEDURE', '11111111-4444-5555-6666-000000000010', 1, TRUE, FALSE, 'Procedures', 6, NULL, 'Pap Smear', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Package 5: Diabetes Screening Package
INSERT INTO packages (
    id,
    tenant_id,
    code,
    name,
    description,
    package_type,
    gender_restriction,
    min_age_years,
    max_age_years,
    care_setting,
    validity_days,
    is_active,
    is_public,
    metadata,
    created_at,
    updated_at
) VALUES (
    '30000000-0000-0000-0000-000000000005',
    '11111111-1111-1111-1111-111111111111',
    'HC-DIAB-001',
    'Diabetes Screening Package',
    'Comprehensive diabetes screening and monitoring package',
    'health_check',
    NULL,
    25,
    NULL,
    'OP',
    60,
    TRUE,
    TRUE,
    '{"marketing_name": "Diabetes Care Package", "suitable_for": "diabetic and pre-diabetic patients"}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Package Items for Diabetes Screening
INSERT INTO package_items (
    id,
    package_id,
    catalog_type,
    catalog_id,
    quantity,
    is_mandatory,
    clinical_only,
    group_name,
    sort_order,
    max_uses_per_package,
    notes,
    created_at,
    updated_at
) VALUES
    -- Lab Tests
    ('31000000-0000-0000-0000-000000000041', '30000000-0000-0000-0000-000000000005', 'LAB_TEST', '11111111-2222-3333-4444-000000000003', 1, TRUE, FALSE, 'Lab Tests', 1, NULL, 'Fasting Blood Sugar', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000042', '30000000-0000-0000-0000-000000000005', 'LAB_TEST', '11111111-2222-3333-4444-000000000008', 1, TRUE, FALSE, 'Lab Tests', 2, NULL, 'HbA1c', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000043', '30000000-0000-0000-0000-000000000005', 'LAB_TEST', '11111111-2222-3333-4444-000000000002', 1, TRUE, FALSE, 'Lab Tests', 3, NULL, 'Lipid Profile', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000044', '30000000-0000-0000-0000-000000000005', 'LAB_TEST', '11111111-2222-3333-4444-000000000005', 1, TRUE, FALSE, 'Lab Tests', 4, NULL, 'Kidney Function', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000045', '30000000-0000-0000-0000-000000000005', 'LAB_TEST', '11111111-2222-3333-4444-000000000006', 1, TRUE, FALSE, 'Lab Tests', 5, NULL, 'Urinalysis', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Package 6: Annual Checkup (Senior Citizens)
INSERT INTO packages (
    id,
    tenant_id,
    code,
    name,
    description,
    package_type,
    gender_restriction,
    min_age_years,
    max_age_years,
    care_setting,
    validity_days,
    is_active,
    is_public,
    metadata,
    created_at,
    updated_at
) VALUES (
    '30000000-0000-0000-0000-000000000006',
    '11111111-1111-1111-1111-111111111111',
    'HC-SENIOR-001',
    'Senior Citizens Annual Checkup',
    'Comprehensive annual health checkup designed for senior citizens',
    'annual_checkup',
    NULL,
    60,
    NULL,
    'OP',
    365,
    TRUE,
    TRUE,
    '{"marketing_name": "Golden Years Package", "discount_percent": 20, "free_home_collection": true}',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Package Items for Senior Citizens Checkup
INSERT INTO package_items (
    id,
    package_id,
    catalog_type,
    catalog_id,
    quantity,
    is_mandatory,
    clinical_only,
    group_name,
    sort_order,
    max_uses_per_package,
    notes,
    created_at,
    updated_at
) VALUES
    -- Lab Tests
    ('31000000-0000-0000-0000-000000000051', '30000000-0000-0000-0000-000000000006', 'LAB_TEST', '11111111-2222-3333-4444-000000000001', 1, TRUE, FALSE, 'Lab Tests', 1, NULL, 'CBC', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000052', '30000000-0000-0000-0000-000000000006', 'LAB_TEST', '11111111-2222-3333-4444-000000000002', 1, TRUE, FALSE, 'Lab Tests', 2, NULL, 'Lipid Profile', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000053', '30000000-0000-0000-0000-000000000006', 'LAB_TEST', '11111111-2222-3333-4444-000000000003', 1, TRUE, FALSE, 'Lab Tests', 3, NULL, 'Blood Sugar', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000054', '30000000-0000-0000-0000-000000000006', 'LAB_TEST', '11111111-2222-3333-4444-000000000004', 1, TRUE, FALSE, 'Lab Tests', 4, NULL, 'Liver Function', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000055', '30000000-0000-0000-0000-000000000006', 'LAB_TEST', '11111111-2222-3333-4444-000000000005', 1, TRUE, FALSE, 'Lab Tests', 5, NULL, 'Kidney Function', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000056', '30000000-0000-0000-0000-000000000006', 'LAB_TEST', '11111111-2222-3333-4444-000000000007', 1, TRUE, FALSE, 'Lab Tests', 6, NULL, 'Thyroid Profile', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000057', '30000000-0000-0000-0000-000000000006', 'LAB_TEST', '11111111-2222-3333-4444-000000000010', 1, TRUE, FALSE, 'Lab Tests', 7, NULL, 'Vitamin D', NOW(), NOW()),
    -- Imaging
    ('31000000-0000-0000-0000-000000000058', '30000000-0000-0000-0000-000000000006', 'IMAGING_STUDY', '11111111-3333-4444-5555-000000000001', 1, TRUE, FALSE, 'Imaging', 8, NULL, 'Chest X-Ray', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000059', '30000000-0000-0000-0000-000000000006', 'IMAGING_STUDY', '11111111-3333-4444-5555-000000000004', 1, FALSE, FALSE, 'Imaging', 9, NULL, 'Abdominal Ultrasound', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000060', '30000000-0000-0000-0000-000000000006', 'IMAGING_STUDY', '11111111-3333-4444-5555-000000000012', 1, FALSE, FALSE, 'Imaging', 10, NULL, 'Bone Density Scan', NOW(), NOW()),
    -- Procedures
    ('31000000-0000-0000-0000-000000000061', '30000000-0000-0000-0000-000000000006', 'PROCEDURE', '11111111-4444-5555-6666-000000000001', 1, TRUE, FALSE, 'Procedures', 11, NULL, 'ECG', NOW(), NOW()),
    ('31000000-0000-0000-0000-000000000062', '30000000-0000-0000-0000-000000000006', 'PROCEDURE', '11111111-4444-5555-6666-000000000002', 1, FALSE, FALSE, 'Procedures', 12, NULL, 'Echocardiogram', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
