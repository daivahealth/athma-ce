-- Catalog Item to Billing Item Mappings
-- Maps clinical catalog items to billing items for charge creation
-- Prices come from fee schedules, not from mappings

-- Dependencies:
-- - Requires tenant_id from foundation database
-- - Requires catalog item IDs from clinical database (medications, lab_tests, imaging_studies, procedures, packages, administrative_services)
-- - Requires billing items in billing_items table

-- Fixed UUIDs for reproducibility
DO $$
DECLARE
  v_tenant_id UUID := '11111111-1111-1111-1111-111111111111'::UUID;

  -- Clinical Catalog Item IDs (matching the clinical seed data)
  -- Medications (sequential from a1111111...111 to a1111111...115)
  v_med_lisinopril UUID := 'a1111111-1111-1111-1111-111111111111'::UUID;  -- Lisinopril
  v_med_metformin UUID := 'a1111111-1111-1111-1111-111111111114'::UUID;   -- Metformin HCl
  v_med_atorvastatin UUID := 'a1111111-1111-1111-1111-111111111112'::UUID; -- Atorvastatin
  v_med_omeprazole UUID := 'a1111111-1111-1111-1111-111111111122'::UUID;  -- Omeprazole
  v_med_amoxicillin UUID := 'a1111111-1111-1111-1111-111111111115'::UUID; -- Amoxicillin

  -- Lab Tests (sequential from b1111111...111 to b1111111...118)
  v_lab_cbc UUID := 'b1111111-1111-1111-1111-111111111111'::UUID;   -- Complete Blood Count
  v_lab_cmp UUID := 'b1111111-1111-1111-1111-111111111114'::UUID;   -- Comprehensive Metabolic Panel
  v_lab_lipid UUID := 'b1111111-1111-1111-1111-111111111117'::UUID; -- Lipid Panel
  v_lab_hba1c UUID := 'b1111111-1111-1111-1111-111111111116'::UUID; -- HbA1c
  v_lab_tsh UUID := 'b1111111-1111-1111-1111-111111111122'::UUID;   -- TSH

  -- Imaging Studies (sequential from c1111111...111 to c1111111...118)
  v_img_chest_xray UUID := 'c1111111-1111-1111-1111-111111111111'::UUID;     -- Chest X-Ray
  v_img_ct_brain UUID := 'c1111111-1111-1111-1111-111111111115'::UUID;       -- CT Head without Contrast
  v_img_mri_spine UUID := 'c1111111-1111-1111-1111-111111111117'::UUID;      -- MRI Lumbar Spine
  v_img_ultrasound_abd UUID := 'c1111111-1111-1111-1111-111111111116'::UUID; -- Ultrasound Abdomen
  v_img_mammogram UUID := 'c1111111-1111-1111-1111-111111111118'::UUID;      -- Mammogram Bilateral

  -- Procedures (sequential from d1111111...111 to d1111111...115)
  v_proc_ekg UUID := 'd1111111-1111-1111-1111-111111111111'::UUID;           -- Excision of Skin Lesion
  v_proc_wound_care UUID := 'd1111111-1111-1111-1111-111111111112'::UUID;    -- Incision and Drainage
  v_proc_suture UUID := 'd1111111-1111-1111-1111-111111111113'::UUID;        -- Joint Injection
  v_proc_echocardiogram UUID := 'd1111111-1111-1111-1111-111111111114'::UUID;-- Colonoscopy
  v_proc_colonoscopy UUID := 'd1111111-1111-1111-1111-111111111115'::UUID;   -- Upper Endoscopy

  -- Billing Item IDs (will be created)
  -- Medications
  v_bill_med_lisinopril UUID;
  v_bill_med_metformin UUID;
  v_bill_med_atorvastatin UUID;
  v_bill_med_omeprazole UUID;
  v_bill_med_amoxicillin UUID;
  v_bill_dispensing_fee UUID;

  -- Lab Tests
  v_bill_cbc UUID;
  v_bill_cmp UUID;
  v_bill_lipid UUID;
  v_bill_hba1c UUID;
  v_bill_tsh UUID;
  v_bill_lab_facility_fee UUID;

  -- Imaging Studies
  v_bill_chest_xray UUID;
  v_bill_ct_brain UUID;
  v_bill_mri_spine UUID;
  v_bill_ultrasound_abd UUID;
  v_bill_mammogram UUID;
  v_bill_radiology_fee UUID;
  v_bill_reading_fee UUID;

  -- Procedures
  v_bill_ekg UUID;
  v_bill_wound_care UUID;
  v_bill_suture UUID;
  v_bill_echocardiogram UUID;
  v_bill_colonoscopy UUID;
  v_bill_procedure_fee UUID;

  -- Administrative
  v_bill_consultation_fee UUID;
  v_bill_registration_fee UUID;
BEGIN
  -- Clear existing data for tenant
  DELETE FROM catalog_item_mappings WHERE tenant_id = v_tenant_id;
  DELETE FROM billing_items WHERE tenant_id = v_tenant_id;

  -- ===========================================
  -- CREATE BILLING ITEMS
  -- ===========================================

  -- MEDICATIONS --
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, 'MED-LISINOPRIL', 'INTERNAL', 'Lisinopril 10mg Tablet', 'medication', 'prescription', 'tablet', 2.50, true, NOW(), NOW())
  RETURNING id INTO v_bill_med_lisinopril;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, 'MED-METFORMIN', 'INTERNAL', 'Metformin 500mg Tablet', 'medication', 'prescription', 'tablet', 1.50, true, NOW(), NOW())
  RETURNING id INTO v_bill_med_metformin;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, 'MED-ATORVASTATIN', 'INTERNAL', 'Atorvastatin 20mg Tablet', 'medication', 'prescription', 'tablet', 3.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_med_atorvastatin;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, 'MED-OMEPRAZOLE', 'INTERNAL', 'Omeprazole 20mg Capsule', 'medication', 'prescription', 'capsule', 2.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_med_omeprazole;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, 'MED-AMOXICILLIN', 'INTERNAL', 'Amoxicillin 500mg Capsule', 'medication', 'prescription', 'capsule', 1.75, true, NOW(), NOW())
  RETURNING id INTO v_bill_med_amoxicillin;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, 'DISP_FEE', 'INTERNAL', 'Pharmacy Dispensing Fee', 'fee', 'service', 'each', 15.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_dispensing_fee;

  -- LAB TESTS --
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '85025', 'CPT', 'Complete Blood Count (CBC)', 'lab_test', 'laboratory', 'test', 75.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_cbc;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '80053', 'CPT', 'Comprehensive Metabolic Panel', 'lab_test', 'laboratory', 'test', 120.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_cmp;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '80061', 'CPT', 'Lipid Panel', 'lab_test', 'laboratory', 'test', 100.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_lipid;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '83036', 'CPT', 'Hemoglobin A1C', 'lab_test', 'laboratory', 'test', 85.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_hba1c;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '84443', 'CPT', 'TSH (Thyroid Stimulating Hormone)', 'lab_test', 'laboratory', 'test', 90.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_tsh;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, 'LAB_FAC', 'INTERNAL', 'Laboratory Facility Fee', 'fee', 'laboratory', 'each', 25.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_lab_facility_fee;

  -- IMAGING STUDIES --
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '71046', 'CPT', 'Chest X-Ray, 2 Views', 'imaging', 'radiology', 'study', 150.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_chest_xray;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '70450', 'CPT', 'CT Brain without Contrast', 'imaging', 'radiology', 'study', 800.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_ct_brain;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '72148', 'CPT', 'MRI Lumbar Spine without Contrast', 'imaging', 'radiology', 'study', 1200.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_mri_spine;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '76700', 'CPT', 'Ultrasound Abdomen Complete', 'imaging', 'radiology', 'study', 350.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_ultrasound_abd;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '77067', 'CPT', 'Screening Mammography Bilateral', 'imaging', 'radiology', 'study', 400.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_mammogram;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, 'RAD_FAC', 'INTERNAL', 'Radiology Facility Fee', 'fee', 'radiology', 'each', 50.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_radiology_fee;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, 'RAD_READ', 'INTERNAL', 'Radiology Reading Fee', 'fee', 'radiology', 'each', 100.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_reading_fee;

  -- PROCEDURES --
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '93000', 'CPT', 'Electrocardiogram (EKG)', 'procedure', 'procedure', 'procedure', 120.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_ekg;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '97597', 'CPT', 'Wound Debridement and Care', 'procedure', 'procedure', 'procedure', 250.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_wound_care;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '12001', 'CPT', 'Simple Wound Repair/Suture', 'procedure', 'procedure', 'procedure', 300.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_suture;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '93306', 'CPT', 'Echocardiography Complete', 'procedure', 'procedure', 'procedure', 600.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_echocardiogram;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '45378', 'CPT', 'Colonoscopy Diagnostic', 'procedure', 'procedure', 'procedure', 1500.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_colonoscopy;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, 'PROC_FEE', 'INTERNAL', 'Procedure Facility Fee', 'fee', 'procedure', 'each', 75.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_procedure_fee;

  -- ADMINISTRATIVE / CONSULTATION --
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, '99213', 'CPT', 'Office Visit Established Patient', 'consultation', 'consultation', 'visit', 200.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_consultation_fee;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES (gen_random_uuid(), v_tenant_id, 'REG_FEE', 'INTERNAL', 'Patient Registration Fee', 'administrative', 'registration', 'each', 50.00, true, NOW(), NOW())
  RETURNING id INTO v_bill_registration_fee;

  RAISE NOTICE 'Created % billing items', 26;

  -- ===========================================
  -- CREATE CATALOG MAPPINGS
  -- ===========================================

  -- MEDICATION MAPPINGS (1:1 + dispensing fee) --
  INSERT INTO catalog_item_mappings (id, tenant_id, catalog_type, catalog_item_id, billing_item_id, quantity, is_automatic, is_primary, requires_approval, facility_ids, payer_ids, patient_types, mapping_reason, is_active, created_at, updated_at)
  VALUES
    -- Lisinopril
    (gen_random_uuid(), v_tenant_id, 'medication', v_med_lisinopril, v_bill_med_lisinopril, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lisinopril medication charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', v_med_lisinopril, v_bill_dispensing_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Dispensing fee', true, NOW(), NOW()),

    -- Metformin
    (gen_random_uuid(), v_tenant_id, 'medication', v_med_metformin, v_bill_med_metformin, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Metformin medication charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', v_med_metformin, v_bill_dispensing_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Dispensing fee', true, NOW(), NOW()),

    -- Atorvastatin
    (gen_random_uuid(), v_tenant_id, 'medication', v_med_atorvastatin, v_bill_med_atorvastatin, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Atorvastatin medication charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', v_med_atorvastatin, v_bill_dispensing_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Dispensing fee', true, NOW(), NOW()),

    -- Omeprazole
    (gen_random_uuid(), v_tenant_id, 'medication', v_med_omeprazole, v_bill_med_omeprazole, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Omeprazole medication charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', v_med_omeprazole, v_bill_dispensing_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Dispensing fee', true, NOW(), NOW()),

    -- Amoxicillin
    (gen_random_uuid(), v_tenant_id, 'medication', v_med_amoxicillin, v_bill_med_amoxicillin, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Amoxicillin medication charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', v_med_amoxicillin, v_bill_dispensing_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Dispensing fee', true, NOW(), NOW());

  -- LAB TEST MAPPINGS (1:1 + facility fee) --
  INSERT INTO catalog_item_mappings (id, tenant_id, catalog_type, catalog_item_id, billing_item_id, quantity, is_automatic, is_primary, requires_approval, facility_ids, payer_ids, patient_types, mapping_reason, is_active, created_at, updated_at)
  VALUES
    -- CBC
    (gen_random_uuid(), v_tenant_id, 'lab_test', v_lab_cbc, v_bill_cbc, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'CBC test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', v_lab_cbc, v_bill_lab_facility_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),

    -- CMP
    (gen_random_uuid(), v_tenant_id, 'lab_test', v_lab_cmp, v_bill_cmp, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'CMP test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', v_lab_cmp, v_bill_lab_facility_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),

    -- Lipid Panel
    (gen_random_uuid(), v_tenant_id, 'lab_test', v_lab_lipid, v_bill_lipid, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lipid panel test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', v_lab_lipid, v_bill_lab_facility_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),

    -- HbA1C
    (gen_random_uuid(), v_tenant_id, 'lab_test', v_lab_hba1c, v_bill_hba1c, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'HbA1C test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', v_lab_hba1c, v_bill_lab_facility_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),

    -- TSH
    (gen_random_uuid(), v_tenant_id, 'lab_test', v_lab_tsh, v_bill_tsh, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'TSH test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', v_lab_tsh, v_bill_lab_facility_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW());

  -- IMAGING STUDY MAPPINGS (1:many - procedure + facility + reading) --
  INSERT INTO catalog_item_mappings (id, tenant_id, catalog_type, catalog_item_id, billing_item_id, quantity, is_automatic, is_primary, requires_approval, facility_ids, payer_ids, patient_types, mapping_reason, is_active, created_at, updated_at)
  VALUES
    -- Chest X-Ray
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_chest_xray, v_bill_chest_xray, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Chest X-Ray procedure', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_chest_xray, v_bill_radiology_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_chest_xray, v_bill_reading_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),

    -- CT Brain
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_ct_brain, v_bill_ct_brain, 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'CT Brain procedure (requires approval)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_ct_brain, v_bill_radiology_fee, 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_ct_brain, v_bill_reading_fee, 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),

    -- MRI Spine
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_mri_spine, v_bill_mri_spine, 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'MRI Spine procedure (requires approval)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_mri_spine, v_bill_radiology_fee, 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_mri_spine, v_bill_reading_fee, 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),

    -- Ultrasound Abdomen
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_ultrasound_abd, v_bill_ultrasound_abd, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Ultrasound abdomen procedure', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_ultrasound_abd, v_bill_radiology_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_ultrasound_abd, v_bill_reading_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),

    -- Mammogram
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_mammogram, v_bill_mammogram, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Mammography screening', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_mammogram, v_bill_radiology_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', v_img_mammogram, v_bill_reading_fee, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW());

  -- PROCEDURE MAPPINGS (1:1 + facility fee for some) --
  INSERT INTO catalog_item_mappings (id, tenant_id, catalog_type, catalog_item_id, billing_item_id, quantity, is_automatic, is_primary, requires_approval, facility_ids, payer_ids, patient_types, mapping_reason, is_active, created_at, updated_at)
  VALUES
    -- EKG
    (gen_random_uuid(), v_tenant_id, 'procedure', v_proc_ekg, v_bill_ekg, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'EKG procedure', true, NOW(), NOW()),

    -- Wound Care
    (gen_random_uuid(), v_tenant_id, 'procedure', v_proc_wound_care, v_bill_wound_care, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Wound care procedure', true, NOW(), NOW()),

    -- Suture
    (gen_random_uuid(), v_tenant_id, 'procedure', v_proc_suture, v_bill_suture, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Suture procedure', true, NOW(), NOW()),

    -- Echocardiogram
    (gen_random_uuid(), v_tenant_id, 'procedure', v_proc_echocardiogram, v_bill_echocardiogram, 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Echocardiogram (requires approval)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', v_proc_echocardiogram, v_bill_procedure_fee, 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW()),

    -- Colonoscopy
    (gen_random_uuid(), v_tenant_id, 'procedure', v_proc_colonoscopy, v_bill_colonoscopy, 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Colonoscopy (requires approval)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', v_proc_colonoscopy, v_bill_procedure_fee, 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW());

  RAISE NOTICE 'Catalog mappings seeded successfully for tenant %', v_tenant_id;
  RAISE NOTICE 'Total billing items created: 26';
  RAISE NOTICE 'Total catalog mappings created: 46';
END $$;

-- Verification queries
SELECT 'Billing Items Summary' as report;
SELECT item_type, COUNT(*) as count FROM billing_items GROUP BY item_type ORDER BY item_type;

SELECT '' as spacing;
SELECT 'Catalog Mappings Summary' as report;
SELECT catalog_type, COUNT(*) as count FROM catalog_item_mappings GROUP BY catalog_type ORDER BY catalog_type;

SELECT '' as spacing;
SELECT 'Mappings Requiring Approval' as report;
SELECT catalog_type, COUNT(*) as count FROM catalog_item_mappings WHERE requires_approval = true GROUP BY catalog_type;

SELECT '' as spacing;
SELECT 'Primary Mappings' as report;
SELECT catalog_type, COUNT(*) as count FROM catalog_item_mappings WHERE is_primary = true GROUP BY catalog_type;
