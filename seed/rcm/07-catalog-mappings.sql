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

  -- Sample Catalog Item IDs (these should match actual clinical catalog IDs)
  v_medication_paracetamol UUID := '22222222-2222-2222-2222-222222222201'::UUID;
  v_medication_amoxicillin UUID := '22222222-2222-2222-2222-222222222202'::UUID;
  v_lab_cbc UUID := '33333333-3333-3333-3333-333333333301'::UUID;
  v_lab_lipid_panel UUID := '33333333-3333-3333-3333-333333333302'::UUID;
  v_imaging_chest_xray UUID := '44444444-4444-4444-4444-444444444401'::UUID;
  v_imaging_mri_brain UUID := '44444444-4444-4444-4444-444444444402'::UUID;
  v_procedure_wound_dressing UUID := '55555555-5555-5555-5555-555555555501'::UUID;
  v_package_health_checkup UUID := '66666666-6666-6666-6666-666666666601'::UUID;
  v_admin_registration UUID := '77777777-7777-7777-7777-777777777701'::UUID;

  -- Billing Item IDs (create these first)
  v_bill_drug_code UUID;
  v_bill_dispensing_fee UUID;
  v_bill_cpt_85025 UUID;
  v_bill_lab_facility_fee UUID;
  v_bill_xray_code UUID;
  v_bill_radiology_fee UUID;
  v_bill_reading_fee UUID;
  v_bill_procedure_code UUID;
  v_bill_consultation_fee UUID;
  v_bill_registration_fee UUID;
  v_bill_dha_drug_code UUID;
  v_bill_insurance_lab_code UUID;
BEGIN
  -- Clear existing data for tenant
  DELETE FROM catalog_item_mappings WHERE tenant_id = v_tenant_id;

  -- Create Billing Items first
  -- Drug codes
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'DRG001', 'INTERNAL', 'Medication Dispensing', 'medication', 'prescription', 'unit', true)
  RETURNING id INTO v_bill_drug_code;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'DRG_FEE', 'INTERNAL', 'Pharmacy Dispensing Fee', 'fee', 'service', 'each', true)
  RETURNING id INTO v_bill_dispensing_fee;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'DHA_DRG001', 'DHA', 'DHA Approved Drug Code', 'medication', 'prescription', 'unit', true)
  RETURNING id INTO v_bill_dha_drug_code;

  -- Lab test codes
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, '85025', 'CPT', 'Complete Blood Count (CBC) with automated differential', 'lab_test', 'laboratory', 'test', true)
  RETURNING id INTO v_bill_cpt_85025;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'LAB_FAC', 'INTERNAL', 'Laboratory Facility Fee', 'fee', 'laboratory', 'each', true)
  RETURNING id INTO v_bill_lab_facility_fee;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'INS_LAB001', 'INSURANCE', 'Insurance Company Lab Code', 'lab_test', 'laboratory', 'test', true)
  RETURNING id INTO v_bill_insurance_lab_code;

  -- Radiology codes
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, '71045', 'CPT', 'Chest X-Ray Single View', 'imaging', 'radiology', 'study', true)
  RETURNING id INTO v_bill_xray_code;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'RAD_FAC', 'INTERNAL', 'Radiology Facility Fee', 'fee', 'radiology', 'each', true)
  RETURNING id INTO v_bill_radiology_fee;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'RAD_READ', 'INTERNAL', 'Radiology Reading Fee', 'fee', 'radiology', 'each', true)
  RETURNING id INTO v_bill_reading_fee;

  -- Procedure codes
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, '12001', 'CPT', 'Simple Wound Repair', 'procedure', 'procedure', 'procedure', true)
  RETURNING id INTO v_bill_procedure_code;

  -- Service fees
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'CONSULT', 'INTERNAL', 'Consultation Fee', 'consultation', 'consultation', 'visit', true)
  RETURNING id INTO v_bill_consultation_fee;

  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, is_active)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'REG_FEE', 'INTERNAL', 'Registration Fee', 'administrative', 'registration', 'each', true)
  RETURNING id INTO v_bill_registration_fee;

  -- ===========================================
  -- 1. Simple 1:1 Mappings
  -- ===========================================

  -- Medication: Paracetamol → Drug Code (for cash patients)
  INSERT INTO catalog_item_mappings (
    id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
    quantity, is_automatic, is_primary, requires_approval,
    facility_ids, payer_ids, patient_types,
    mapping_reason, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_tenant_id, 'medication', v_medication_paracetamol, v_bill_drug_code,
    1, true, true, false,
    ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY['cash']::TEXT[],
    'Standard billing for cash patients', true, NOW(), NOW()
  );

  -- Lab Test: CBC → CPT Code 85025
  INSERT INTO catalog_item_mappings (
    id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
    quantity, is_automatic, is_primary, requires_approval,
    facility_ids, payer_ids, patient_types,
    mapping_reason, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_tenant_id, 'lab_test', v_lab_cbc, v_bill_cpt_85025,
    1, true, true, false,
    ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
    'Standard CPT code for CBC test', true, NOW(), NOW()
  );

  -- ===========================================
  -- 2. One-to-Many Mappings
  -- ===========================================

  -- Imaging: Chest X-Ray → Multiple billing items

  -- Primary: X-Ray code
  INSERT INTO catalog_item_mappings (
    id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
    quantity, is_automatic, is_primary, requires_approval,
    facility_ids, payer_ids, patient_types,
    mapping_reason, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_tenant_id, 'imaging_study', v_imaging_chest_xray, v_bill_xray_code,
    1, true, true, false,
    ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
    'Primary CPT code for chest x-ray', true, NOW(), NOW()
  );

  -- Secondary: Facility fee
  INSERT INTO catalog_item_mappings (
    id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
    quantity, is_automatic, is_primary, requires_approval,
    facility_ids, payer_ids, patient_types,
    mapping_reason, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_tenant_id, 'imaging_study', v_imaging_chest_xray, v_bill_radiology_fee,
    1, true, false, false,
    ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
    'Facility fee for radiology services', true, NOW(), NOW()
  );

  -- Secondary: Reading fee
  INSERT INTO catalog_item_mappings (
    id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
    quantity, is_automatic, is_primary, requires_approval,
    facility_ids, payer_ids, patient_types,
    mapping_reason, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_tenant_id, 'imaging_study', v_imaging_chest_xray, v_bill_reading_fee,
    1, true, false, false,
    ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
    'Professional reading fee', true, NOW(), NOW()
  );

  -- ===========================================
  -- 3. Package Mappings
  -- ===========================================

  -- Package: Health Checkup → Multiple services
  INSERT INTO catalog_item_mappings (
    id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
    quantity, is_automatic, is_primary, requires_approval,
    facility_ids, payer_ids, patient_types,
    mapping_reason, is_active, created_at, updated_at
  ) VALUES
    (gen_random_uuid(), v_tenant_id, 'package', v_package_health_checkup, v_bill_consultation_fee, 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Consultation in package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', v_package_health_checkup, v_bill_cpt_85025, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'CBC test in package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', v_package_health_checkup, v_bill_xray_code, 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Chest X-ray in package', true, NOW(), NOW());

  -- ===========================================
  -- 4. Context-Based Mappings (Payer-Specific)
  -- ===========================================

  -- NOTE: In a real implementation, you would:
  -- 1. Get actual payer IDs from the payers table
  -- 2. Use those IDs in the payer_ids array
  -- Example structure (commented out as we don't have real payer IDs):

  -- Lab Test: CBC → Different codes for DHA vs Insurance
  -- INSERT INTO catalog_item_mappings (...)
  -- VALUES (..., ARRAY['<dha-payer-id>']::TEXT[], ..., 'DHA-specific lab code');

  -- INSERT INTO catalog_item_mappings (...)
  -- VALUES (..., ARRAY['<insurance-payer-id>']::TEXT[], ..., 'Insurance-specific lab code');

  -- ===========================================
  -- 5. Administrative Service Mappings
  -- ===========================================

  -- Admin: Registration → Registration Fee
  INSERT INTO catalog_item_mappings (
    id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
    quantity, is_automatic, is_primary, requires_approval,
    facility_ids, payer_ids, patient_types,
    mapping_reason, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_tenant_id, 'administrative_service', v_admin_registration, v_bill_registration_fee,
    1, true, true, false,
    ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
    'Registration fee for new patients', true, NOW(), NOW()
  );

  -- ===========================================
  -- 6. Mappings with Approval Required
  -- ===========================================

  -- MRI Brain → Requires approval before charging (high-value procedure)
  INSERT INTO catalog_item_mappings (
    id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
    quantity, is_automatic, is_primary, requires_approval,
    facility_ids, payer_ids, patient_types,
    mapping_reason, notes, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), v_tenant_id, 'imaging_study', v_imaging_mri_brain, v_bill_xray_code,
    1, false, true, true,
    ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[],
    'High-value imaging requires pre-approval',
    'Requires authorization from insurance or patient confirmation',
    true, NOW(), NOW()
  );

  RAISE NOTICE 'Catalog mappings seeded successfully for tenant %', v_tenant_id;
END $$;

-- Verification queries
SELECT 'Total catalog mappings:' as label, COUNT(*) as count FROM catalog_item_mappings;
SELECT 'Mappings by catalog type:' as label, catalog_type, COUNT(*) as count FROM catalog_item_mappings GROUP BY catalog_type ORDER BY catalog_type;
SELECT 'Mappings requiring approval:' as label, COUNT(*) as count FROM catalog_item_mappings WHERE requires_approval = true;
SELECT 'Automatic mappings:' as label, COUNT(*) as count FROM catalog_item_mappings WHERE is_automatic = true;
SELECT 'Primary mappings:' as label, COUNT(*) as count FROM catalog_item_mappings WHERE is_primary = true;
