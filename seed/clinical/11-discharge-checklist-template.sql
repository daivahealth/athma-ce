-- ============================================================================
-- Discharge Checklist Template Seed Data
-- Creates a comprehensive discharge checklist template that auto-creates
-- when discharge planning is initiated
-- ============================================================================

-- Note: This uses the default tenant ID from foundation seeds
-- Replace '11111111-1111-1111-1111-111111111111' with actual tenant ID if different

-- Insert Discharge Checklist Template
INSERT INTO checklist_template (
  id,
  tenant_id,
  facility_id,
  code,
  name,
  description,
  category,
  version,
  status,
  applicable_to_inpatient,
  applicable_to_outpatient,
  applicable_encounter_types,
  applicable_departments,
  requires_all_items,
  minimum_completion_percent,
  requires_verification,
  verification_roles,
  allow_self_verification,
  auto_create_enabled,
  auto_create_on,
  auto_create_conditions,
  auto_create_due_hours,
  allowed_roles,
  estimated_minutes,
  created_at,
  updated_at,
  created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,  -- Default tenant
  NULL,  -- All facilities
  'DISCHARGE_CHECKLIST_V1',
  'Patient Discharge Checklist',
  'Comprehensive checklist for patient discharge planning and execution',
  'DISCHARGE',
  1,
  'ACTIVE',
  true,   -- Applicable to inpatient
  false,  -- Not applicable to outpatient
  '{}',   -- All encounter types
  '{}',   -- All departments
  false,  -- Does not require ALL items
  80,     -- Minimum 80% completion
  true,   -- Requires verification
  ARRAY['PHYSICIAN', 'CHARGE_NURSE']::text[],  -- Can be verified by doctors or charge nurses
  false,  -- Self-verification not allowed
  true,   -- Auto-create enabled
  ARRAY['discharge_planning_initiated']::text[],  -- Trigger
  NULL,   -- No additional conditions
  48,     -- Due in 48 hours
  ARRAY['PHYSICIAN', 'NURSE', 'CHARGE_NURSE', 'CASE_MANAGER']::text[],
  20,     -- Estimated 20 minutes to complete
  NOW(),
  NOW(),
  '11111111-1111-1111-1111-111111111111'::uuid
) ON CONFLICT (id) DO NOTHING;

-- Insert Checklist Template Items

-- Section 1: Medical Clearance
INSERT INTO checklist_template_item (
  id,
  tenant_id,
  template_id,
  item_key,
  item_type,
  label,
  help_text,
  placeholder,
  section_name,
  sort_order,
  is_required,
  validation_rules,
  options,
  show_if_condition,
  created_at,
  updated_at
) VALUES
-- Medical clearance
(
  '00000000-0000-0000-0001-000000000001'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'medical_clearance',
  'BOOLEAN',
  'Medical clearance obtained',
  'Has the attending physician cleared the patient for discharge?',
  NULL,
  'Medical Clearance',
  1,
  true,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0001-000000000002'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'cleared_by',
  'STAFF_SELECTOR',
  'Cleared by (Physician)',
  'Select the physician who provided medical clearance',
  'Select physician',
  'Medical Clearance',
  2,
  true,
  NULL,
  NULL,
  jsonb_build_object('field', 'medical_clearance', 'operator', 'equals', 'value', true),
  NOW(),
  NOW()
),

-- Section 2: Medications
(
  '00000000-0000-0000-0001-000000000003'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'medications_reconciled',
  'BOOLEAN',
  'Medications reconciled',
  'Have all medications been reviewed and reconciled?',
  NULL,
  'Medications',
  3,
  true,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0001-000000000004'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'discharge_prescriptions_issued',
  'BOOLEAN',
  'Discharge prescriptions issued',
  'Have discharge prescriptions been written and sent to pharmacy?',
  NULL,
  'Medications',
  4,
  true,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),

-- Section 3: Follow-up Care
(
  '00000000-0000-0000-0001-000000000005'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'follow_up_appointment_scheduled',
  'BOOLEAN',
  'Follow-up appointment scheduled',
  'Has a follow-up appointment been scheduled?',
  NULL,
  'Follow-up Care',
  5,
  true,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0001-000000000006'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'follow_up_date',
  'DATE',
  'Follow-up appointment date',
  'Date of scheduled follow-up appointment',
  'Select date',
  'Follow-up Care',
  6,
  false,
  NULL,
  NULL,
  jsonb_build_object('field', 'follow_up_appointment_scheduled', 'operator', 'equals', 'value', true),
  NOW(),
  NOW()
),

-- Section 4: Patient Education
(
  '00000000-0000-0000-0001-000000000007'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'discharge_instructions_provided',
  'BOOLEAN',
  'Discharge instructions provided',
  'Have written discharge instructions been provided to patient/family?',
  NULL,
  'Patient Education',
  7,
  true,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0001-000000000008'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'patient_education_completed',
  'BOOLEAN',
  'Patient education completed',
  'Has the patient/family been educated on medications, diet, activity restrictions?',
  NULL,
  'Patient Education',
  8,
  true,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),

-- Section 5: Equipment & Services
(
  '00000000-0000-0000-0001-000000000009'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'dme_needed',
  'BOOLEAN',
  'Durable Medical Equipment (DME) needed?',
  'Does the patient require any medical equipment at home?',
  NULL,
  'Equipment & Services',
  9,
  true,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0001-000000000010'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'dme_ordered',
  'BOOLEAN',
  'DME ordered and arranged',
  'Has the required medical equipment been ordered?',
  NULL,
  'Equipment & Services',
  10,
  false,
  NULL,
  NULL,
  jsonb_build_object('field', 'dme_needed', 'operator', 'equals', 'value', true),
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0001-000000000011'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'home_health_needed',
  'BOOLEAN',
  'Home health services needed?',
  'Does the patient require home health nursing or therapy?',
  NULL,
  'Equipment & Services',
  11,
  true,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0001-000000000012'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'home_health_ordered',
  'BOOLEAN',
  'Home health services ordered',
  'Have home health services been arranged?',
  NULL,
  'Equipment & Services',
  12,
  false,
  NULL,
  NULL,
  jsonb_build_object('field', 'home_health_needed', 'operator', 'equals', 'value', true),
  NOW(),
  NOW()
),

-- Section 6: Logistics
(
  '00000000-0000-0000-0001-000000000013'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'transportation_arranged',
  'BOOLEAN',
  'Transportation arranged',
  'Has patient transportation been arranged for discharge?',
  NULL,
  'Logistics',
  13,
  true,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0001-000000000014'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'personal_belongings_returned',
  'BOOLEAN',
  'Personal belongings returned',
  'Have all patient personal belongings been returned?',
  NULL,
  'Logistics',
  14,
  true,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),

-- Section 7: Administrative
(
  '00000000-0000-0000-0001-000000000015'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'billing_cleared',
  'BOOLEAN',
  'Billing cleared/Co-pay collected',
  'Have billing issues been resolved or co-pay collected?',
  NULL,
  'Administrative',
  15,
  false,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0001-000000000016'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'insurance_notified',
  'BOOLEAN',
  'Insurance company notified',
  'Has the insurance company been notified of discharge?',
  NULL,
  'Administrative',
  16,
  false,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0001-000000000017'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'medical_records_completed',
  'BOOLEAN',
  'Medical records completed',
  'Have all required medical records been completed and signed?',
  NULL,
  'Administrative',
  17,
  true,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
),

-- Section 8: Final Notes
(
  '00000000-0000-0000-0001-000000000018'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'discharge_notes',
  'TEXT_AREA',
  'Discharge notes',
  'Additional notes or special instructions for discharge',
  'Enter any additional notes...',
  'Final Notes',
  18,
  false,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Discharge checklist template seed data inserted successfully';
END $$;
