-- ============================================================================
-- CBC Observation + Result Template Seed
-- Seeds core CBC analytes into observation_code_catalog and maps them to the
-- CBC lab_test_master row using stable business keys.
-- ============================================================================

-- CBC analytes, including differential count components
INSERT INTO observation_code_catalog (
  id,
  tenant_id,
  code,
  code_system,
  display_name,
  display_name_ar,
  category,
  lab_domain,
  data_type,
  default_unit,
  ref_range_low,
  ref_range_high,
  is_active,
  created_at,
  updated_at
)
SELECT
  uuid_generate_v4(),
  seed.tenant_id,
  seed.code,
  seed.code_system,
  seed.display_name,
  seed.display_name_ar,
  seed.category,
  seed.lab_domain,
  seed.data_type,
  seed.default_unit,
  seed.ref_range_low,
  seed.ref_range_high,
  seed.is_active,
  NOW(),
  NOW()
FROM (
  VALUES
    (NULL::uuid, '6690-2', 'LOINC', 'White Blood Cell Count', 'عدد كريات الدم البيضاء', 'laboratory', 'hematology', 'numeric', '10^3/uL', 4.5::numeric, 11.0::numeric, true),
    (NULL::uuid, '789-8', 'LOINC', 'Red Blood Cell Count', 'عدد كريات الدم الحمراء', 'laboratory', 'hematology', 'numeric', '10^6/uL', 4.5::numeric, 5.5::numeric, true),
    (NULL::uuid, '718-7', 'LOINC', 'Hemoglobin', 'الهيموغلوبين', 'laboratory', 'hematology', 'numeric', 'g/dL', 12.0::numeric, 17.5::numeric, true),
    (NULL::uuid, '4544-3', 'LOINC', 'Hematocrit', 'الهيماتوكريت', 'laboratory', 'hematology', 'numeric', '%', 36::numeric, 46::numeric, true),
    (NULL::uuid, '787-2', 'LOINC', 'Mean Corpuscular Volume', 'متوسط حجم الكرية', 'laboratory', 'hematology', 'numeric', 'fL', 80::numeric, 100::numeric, true),
    (NULL::uuid, '785-6', 'LOINC', 'Mean Corpuscular Hemoglobin', 'متوسط هيموغلوبين الكرية', 'laboratory', 'hematology', 'numeric', 'pg', 27::numeric, 33::numeric, true),
    (NULL::uuid, '786-4', 'LOINC', 'Mean Corpuscular Hemoglobin Concentration', 'تركيز هيموغلوبين الكرية الوسطي', 'laboratory', 'hematology', 'numeric', 'g/dL', 32::numeric, 36::numeric, true),
    (NULL::uuid, '788-0', 'LOINC', 'Red Cell Distribution Width', 'عرض توزيع كريات الدم الحمراء', 'laboratory', 'hematology', 'numeric', '%', 11.5::numeric, 14.5::numeric, true),
    (NULL::uuid, '777-3', 'LOINC', 'Platelet Count', 'عدد الصفائح الدموية', 'laboratory', 'hematology', 'numeric', '10^3/uL', 150::numeric, 400::numeric, true),
    (NULL::uuid, '32623-1', 'LOINC', 'Mean Platelet Volume', 'متوسط حجم الصفائح', 'laboratory', 'hematology', 'numeric', 'fL', 7.5::numeric, 12.0::numeric, true),
    (NULL::uuid, '770-8', 'LOINC', 'Neutrophils %', 'العدلات النسبية', 'laboratory', 'hematology', 'numeric', '%', 40::numeric, 70::numeric, true),
    (NULL::uuid, '736-9', 'LOINC', 'Lymphocytes %', 'الخلايا اللمفاوية النسبية', 'laboratory', 'hematology', 'numeric', '%', 20::numeric, 45::numeric, true),
    (NULL::uuid, '5905-5', 'LOINC', 'Monocytes %', 'الخلايا الوحيدة النسبية', 'laboratory', 'hematology', 'numeric', '%', 2::numeric, 10::numeric, true),
    (NULL::uuid, '713-8', 'LOINC', 'Eosinophils %', 'الحمضات النسبية', 'laboratory', 'hematology', 'numeric', '%', 0::numeric, 6::numeric, true),
    (NULL::uuid, '706-2', 'LOINC', 'Basophils %', 'القاعديات النسبية', 'laboratory', 'hematology', 'numeric', '%', 0::numeric, 2::numeric, true),
    (NULL::uuid, '751-8', 'LOINC', 'Neutrophils absolute', 'العدلات المطلقة', 'laboratory', 'hematology', 'numeric', '10^3/uL', 1.8::numeric, 7.7::numeric, true),
    (NULL::uuid, '731-0', 'LOINC', 'Lymphocytes absolute', 'الخلايا اللمفاوية المطلقة', 'laboratory', 'hematology', 'numeric', '10^3/uL', 1.0::numeric, 4.8::numeric, true),
    (NULL::uuid, '742-7', 'LOINC', 'Monocytes absolute', 'الخلايا الوحيدة المطلقة', 'laboratory', 'hematology', 'numeric', '10^3/uL', 0.2::numeric, 0.8::numeric, true),
    (NULL::uuid, '711-2', 'LOINC', 'Eosinophils absolute', 'الحمضات المطلقة', 'laboratory', 'hematology', 'numeric', '10^3/uL', 0.0::numeric, 0.5::numeric, true),
    (NULL::uuid, '704-7', 'LOINC', 'Basophils absolute', 'القاعديات المطلقة', 'laboratory', 'hematology', 'numeric', '10^3/uL', 0.0::numeric, 0.2::numeric, true)
) AS seed(
  tenant_id,
  code,
  code_system,
  display_name,
  display_name_ar,
  category,
  lab_domain,
  data_type,
  default_unit,
  ref_range_low,
  ref_range_high,
  is_active
)
WHERE NOT EXISTS (
  SELECT 1
  FROM observation_code_catalog existing
  WHERE existing.tenant_id IS NOT DISTINCT FROM seed.tenant_id
    AND existing.code = seed.code
    AND existing.code_system = seed.code_system
);

-- Rebuild the CBC template so the hierarchy stays deterministic across re-seeds.
DELETE FROM lab_test_result_templates
WHERE lab_test_master_id = (
  SELECT id
  FROM lab_test_master
  WHERE loinc_code = '58410-2' AND tenant_id IS NULL
  LIMIT 1
);

WITH lab_test AS (
  SELECT id
  FROM lab_test_master
  WHERE loinc_code = '58410-2' AND tenant_id IS NULL
  LIMIT 1
),
template_groups AS (
  INSERT INTO lab_test_result_templates (
    id,
    tenant_id,
    lab_test_master_id,
    parent_template_id,
    node_type,
    group_key,
    render_style,
    observation_code_catalog_id,
    display_label,
    sort_order,
    is_required,
    is_active,
    created_at,
    updated_at
  )
  SELECT
    seed.id,
    NULL,
    lab_test.id,
    NULL,
    'group',
    seed.group_key,
    'section',
    NULL,
    seed.display_label,
    seed.sort_order,
    false,
    true,
    NOW(),
    NOW()
  FROM lab_test
  JOIN (
    VALUES
      ('c2111111-1111-1111-1111-111111111111'::uuid, 'differential-count', 'Differential Count', 12)
  ) AS seed(id, group_key, display_label, sort_order)
    ON TRUE
  RETURNING id, group_key
)
INSERT INTO lab_test_result_templates (
  id,
  tenant_id,
  lab_test_master_id,
  parent_template_id,
  node_type,
  group_key,
  render_style,
  observation_code_catalog_id,
  display_label,
  sort_order,
  is_required,
  is_active,
  created_at,
  updated_at
)
SELECT
  seed.id,
  NULL,
  lab_test.id,
  template_groups.id,
  'analyte',
  seed.group_key,
  NULL,
  observation_code.id,
  observation_code.display_name,
  seed.sort_order,
  true,
  true,
  NOW(),
  NOW()
FROM lab_test
JOIN (
  VALUES
    ('c2111111-1111-1111-1111-111111111121'::uuid, NULL::text, '718-7', 10),
    ('c2111111-1111-1111-1111-111111111122'::uuid, NULL::text, '6690-2', 11),
    ('c2111111-1111-1111-1111-111111111123'::uuid, 'differential-count', '770-8', 13),
    ('c2111111-1111-1111-1111-111111111124'::uuid, 'differential-count', '736-9', 14),
    ('c2111111-1111-1111-1111-111111111125'::uuid, 'differential-count', '5905-5', 15),
    ('c2111111-1111-1111-1111-111111111126'::uuid, 'differential-count', '713-8', 16),
    ('c2111111-1111-1111-1111-111111111127'::uuid, 'differential-count', '706-2', 17),
    ('c2111111-1111-1111-1111-111111111128'::uuid, NULL::text, '777-3', 20),
    ('c2111111-1111-1111-1111-111111111129'::uuid, NULL::text, '789-8', 21),
    ('c2111111-1111-1111-1111-111111111130'::uuid, NULL::text, '4544-3', 22),
    ('c2111111-1111-1111-1111-111111111131'::uuid, NULL::text, '787-2', 23),
    ('c2111111-1111-1111-1111-111111111132'::uuid, NULL::text, '785-6', 24),
    ('c2111111-1111-1111-1111-111111111133'::uuid, NULL::text, '786-4', 25),
    ('c2111111-1111-1111-1111-111111111134'::uuid, NULL::text, '788-0', 26),
    ('c2111111-1111-1111-1111-111111111135'::uuid, NULL::text, '32623-1', 27),
    ('c2111111-1111-1111-1111-111111111136'::uuid, NULL::text, '751-8', 30),
    ('c2111111-1111-1111-1111-111111111137'::uuid, NULL::text, '731-0', 31),
    ('c2111111-1111-1111-1111-111111111138'::uuid, NULL::text, '742-7', 32),
    ('c2111111-1111-1111-1111-111111111139'::uuid, NULL::text, '711-2', 33),
    ('c2111111-1111-1111-1111-111111111140'::uuid, NULL::text, '704-7', 34)
) AS seed(id, group_key, code, sort_order)
  ON TRUE
LEFT JOIN template_groups
  ON template_groups.group_key = seed.group_key
JOIN observation_code_catalog AS observation_code
  ON observation_code.code = seed.code
 AND observation_code.code_system = 'LOINC'
 AND observation_code.category = 'laboratory'
 AND observation_code.tenant_id IS NULL;
