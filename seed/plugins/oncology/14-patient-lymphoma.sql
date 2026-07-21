-- =============================================================================
-- 14-patient-lymphoma.sql
-- Curative journey: Stage II diffuse large B-cell lymphoma (DLBCL), R-CHOP x6,
-- for Ananya Reddy (new patient, MRN-2025-007). No surgery, no radiation.
--
-- Seeds: patient record, 6 encounters, encounter_notes/diagnoses, clinical
--   orders + reports, clinical_observations (LDH trend), plugin_oncology.*
--   (diagnosis, staging, tumor board, care plan, all 6 real chemo_orders),
--   and cancer_timeline_events derived from the rows above.
--
-- Idempotent: re-runnable, all writes scoped to this patient with stable
-- uuid_from_text() ids.
-- =============================================================================

BEGIN;

DELETE FROM plugin_oncology.cancer_timeline_events WHERE patient_id = uuid_from_text('patient-noora-al-kaabi');
DELETE FROM plugin_oncology.chemo_orders           WHERE patient_id = uuid_from_text('patient-noora-al-kaabi');
DELETE FROM plugin_oncology.tumor_board_cases      WHERE patient_id = uuid_from_text('patient-noora-al-kaabi');
DELETE FROM plugin_oncology.oncology_care_plans    WHERE patient_id = uuid_from_text('patient-noora-al-kaabi');
DELETE FROM plugin_oncology.tumor_staging          WHERE patient_id = uuid_from_text('patient-noora-al-kaabi');
DELETE FROM plugin_oncology.cancer_diagnoses       WHERE patient_id = uuid_from_text('patient-noora-al-kaabi');

DELETE FROM clinical_orders       WHERE patient_id = uuid_from_text('patient-noora-al-kaabi');
DELETE FROM clinical_observations WHERE patient_id = uuid_from_text('patient-noora-al-kaabi');
DELETE FROM encounter_notes       WHERE patient_id = uuid_from_text('patient-noora-al-kaabi');
DELETE FROM encounter_diagnoses   WHERE patient_id = uuid_from_text('patient-noora-al-kaabi');
DELETE FROM encounters            WHERE patient_id = uuid_from_text('patient-noora-al-kaabi');
DELETE FROM patients              WHERE id = uuid_from_text('patient-noora-al-kaabi');

INSERT INTO patients (
  id, mrn, tenant_id, national_id, national_id_type, issuing_country,
  first_name, last_name, middle_name, date_of_birth, gender, marital_status,
  nationality, preferred_language, phone_number, email, address_line1,
  address_line2, city, postal_code, country, emergency_contact, insurance_info,
  created_by, created_at_facility, registration_source, registration_notes,
  status, created_at, updated_at, updated_by, updated_at_facility
) VALUES (
  uuid_from_text('patient-noora-al-kaabi'), 'MRN-2025-007', '11111111-1111-1111-1111-111111111111'::UUID,
  '678901234567', 'national_id', 'IN',
  'Ananya', 'Reddy', NULL, DATE '1990-11-03', 'female', 'single',
  'India', 'en', '+919908990011', 'ananya.reddy@example.in', 'Jubilee Hills',
  NULL, 'Hyderabad', '500033', 'IN',
  '{"name":"Lakshmi Reddy","relation":"mother","phone":"+919908990022"}'::jsonb,
  '{"payer":"Star Health Insurance","memberId":"STAR990011"}'::jsonb,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::UUID,
  'manual', 'Initial registration via primary care referral',
  'active', NOW(), NOW(), NULL, NULL
);

INSERT INTO encounters (
  id, encounter_number, tenant_id, patient_id, facility_id, facility_name,
  primary_staff_id, encounter_class, encounter_type, status, priority,
  start_time, end_time, encounter_source, chief_complaint, presenting_symptoms,
  notes, allergies, current_medications, medical_history, created_at, updated_at
) VALUES
(uuid_from_text('encounter-noora-01'),'ENC-2024-0401','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee','AMB','Primary Care Visit','finished','routine',
 '2024-05-02 09:00:00+00','2024-05-02 09:30:00+00','appointment','Painless neck swelling and night sweats','4-week history of painless right cervical lymphadenopathy, drenching night sweats, 4kg weight loss',
 '34-year-old female with painless cervical lymphadenopathy and B symptoms. Referred for excisional biopsy.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-noora-02'),'ENC-2024-0402','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e761d1dc-1d77-5499-bd12-b077276934a7','AMB','Excisional Lymph Node Biopsy','finished','routine',
 '2024-05-09 08:00:00+00','2024-05-09 09:00:00+00','appointment','Excisional biopsy of enlarged cervical node','Painless cervical lymphadenopathy with B symptoms',
 'Excisional biopsy of right cervical node: diffuse large B-cell lymphoma (DLBCL), germinal center B-cell (GCB) subtype, CD20 positive, Ki-67 85%.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-noora-03'),'ENC-2024-0403','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Staging PET-CT & Bone Marrow Biopsy','finished','routine',
 '2024-05-20 09:00:00+00','2024-05-20 10:30:00+00','appointment','Staging workup for biopsy-proven DLBCL','Biopsy-confirmed DLBCL',
 'PET-CT: FDG-avid right cervical and right axillary nodal disease, no disease below the diaphragm. Bone marrow biopsy: no marrow involvement. Ann Arbor Stage II. LDH elevated at 310 U/L.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-noora-04'),'ENC-2024-0404','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Oncology Consultation','finished','routine',
 '2024-05-28 09:00:00+00','2024-05-28 10:00:00+00','referral','Newly diagnosed DLBCL','Referred for oncology assessment',
 'Medical oncology consult following tumor board review: Ann Arbor Stage II DLBCL (GCB subtype), curative intent. Plan R-CHOP x6 cycles every 21 days.',
 '["No known drug allergies"]',NULL,'Stage II DLBCL (dx 2024)',NOW(),NOW()),
(uuid_from_text('encounter-noora-05'),'ENC-2024-0405','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Chemotherapy','finished','routine',
 '2024-06-03 09:00:00+00','2024-06-03 14:00:00+00','appointment','Curative chemotherapy cycle 1 (R-CHOP)','Chemotherapy infusion',
 'R-CHOP cycle 1 of 6 administered with rituximab premedication and antiemetic prophylaxis; tolerated well.',
 '["No known drug allergies"]','["R-CHOP (chemo)","Ondansetron PRN"]','Stage II DLBCL (dx 2024)',NOW(),NOW()),
(uuid_from_text('encounter-noora-06'),'ENC-2024-0406','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Chemotherapy & Restaging','finished','routine',
 '2024-09-16 09:00:00+00','2024-09-16 14:00:00+00','appointment','Chemotherapy cycle 6 and end-of-treatment restaging','Chemotherapy infusion and response assessment',
 'R-CHOP cycle 6 of 6 (final cycle) administered. End-of-treatment PET-CT: complete metabolic response, Deauville score 2. LDH normalized to 165 U/L.',
 '["No known drug allergies"]',NULL,'Stage II DLBCL (dx 2024), complete response to R-CHOP',NOW(),NOW());

INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id, code, code_system, display_name,
  category, value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, created_at, updated_at
) VALUES
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),uuid_from_text('encounter-noora-03'),'14804-9','LOINC','Lactate Dehydrogenase (LDH)','laboratory',310,'U/L',140,280,'high','2024-05-20 10:45:00+00','23ef067c-d352-5415-945b-9b802d20bc3c','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),uuid_from_text('encounter-noora-06'),'14804-9','LOINC','Lactate Dehydrogenase (LDH)','laboratory',165,'U/L',140,280,'normal','2024-09-16 14:15:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW());

INSERT INTO plugin_oncology.cancer_diagnoses (
  id, tenant_id, patient_id, encounter_id, cancer_type, primary_site,
  primary_site_code, laterality, histology_morphology, morphology_code,
  icd_code, snomed_code, diagnosis_date, clinical_status, verification_status,
  metastatic_status, is_recurrence, biomarkers, ecog_at_diagnosis,
  diagnosed_by, notes, created_at, updated_at
) VALUES (
  uuid_from_text('diagnosis-noora'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),uuid_from_text('encounter-noora-04'),
  'Non-Hodgkin Lymphoma (DLBCL)','Right cervical lymph node','C77.0','right','Diffuse large B-cell lymphoma','9680/3',
  'C83.30','118600007','2024-05-09','active','confirmed',
  'regional',false,'{"CD20":"positive","cellOfOrigin":"GCB","Ki67":"85%"}',1,
  '6d2df89a-3f81-5338-b197-373d347031db','Diffuse large B-cell lymphoma, germinal center B-cell subtype, nodal presentation with B symptoms.',NOW(),NOW()
);

INSERT INTO plugin_oncology.tumor_staging (
  id, tenant_id, cancer_diagnosis_id, patient_id, encounter_id, provider_id,
  staging_system, staging_edition, staging_type, stage_group, body_site, histology,
  staging_date, status, notes, created_at, updated_at
) VALUES (
  uuid_from_text('staging-noora-clinical'),'11111111-1111-1111-1111-111111111111',uuid_from_text('diagnosis-noora'),uuid_from_text('patient-noora-al-kaabi'),uuid_from_text('encounter-noora-03'),'23ef067c-d352-5415-945b-9b802d20bc3c',
  'Ann Arbor','Lugano','clinical','II','Right cervical and axillary lymph nodes','Diffuse large B-cell lymphoma',
  '2024-05-20','active','Staging by PET-CT and bone marrow biopsy: nodal disease on one side of the diaphragm, no marrow involvement.',NOW(),NOW()
);

INSERT INTO plugin_oncology.tumor_board_cases (
  id, tenant_id, patient_id, cancer_diagnosis_id, staging_id, meeting_date,
  presented_by, attendees, clinical_summary, imaging_findings, pathology_report,
  molecular_profile, mdt_recommendation, treatment_intent, recommended_pathway,
  treatment_plan, decision, review_outcome, follow_up_actions, status,
  created_at, updated_at
) VALUES (
  uuid_from_text('tumor-board-noora'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),uuid_from_text('diagnosis-noora'),uuid_from_text('staging-noora-clinical'),'2024-05-27',
  '6d2df89a-3f81-5338-b197-373d347031db',
  '[{"name":"Dr Fatima Al-Zaabi","role":"Hematology-Oncology"},{"name":"Dr Layla Al-Shamsi","role":"Radiation Oncology"}]',
  '34-year-old female with biopsy-proven DLBCL (GCB subtype), Ann Arbor Stage II with B symptoms.',
  'PET-CT: FDG-avid right cervical and axillary nodal disease, no infradiaphragmatic disease.',
  'Excisional biopsy: diffuse large B-cell lymphoma, GCB subtype, CD20 positive, Ki-67 85%.',
  'CD20 positive, GCB cell-of-origin, Ki-67 85%.',
  'R-CHOP x6 cycles every 21 days, curative intent given limited-stage disease.',
  'curative',
  '["chemotherapy"]',
  '{"summary":"R-CHOP x6, interim PET after cycle 4, end-of-treatment PET-CT"}',
  'Proceed to R-CHOP chemoimmunotherapy',
  'consensus',
  '["Start R-CHOP cycle 1","Interim PET-CT after cycle 4","End-of-treatment PET-CT after cycle 6"]',
  'completed', NOW(), NOW()
);

INSERT INTO plugin_oncology.oncology_care_plans (
  id, tenant_id, patient_id, cancer_diagnosis_id, tumor_board_case_id, plan_number, version,
  treatment_intent, oncology_subspecialty, planned_modalities, planned_cycles,
  cycle_duration_days, milestones, follow_up_schedule, status, start_date, end_date,
  created_by, approved_by, approved_at, notes, created_at, updated_at
) VALUES (
  uuid_from_text('careplan-noora'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),uuid_from_text('diagnosis-noora'),uuid_from_text('tumor-board-noora'),'CP-2024-0401',1,
  'curative','hematology_oncology','["chemotherapy"]',6,
  21,'[{"label":"Start R-CHOP","date":"2024-06-03"},{"label":"Complete R-CHOP x6","date":"2024-09-16"}]','{"plan":"PET-CT at end of treatment, then clinical follow-up every 3 months for 2 years"}','completed','2024-06-03','2024-09-16',
  '6d2df89a-3f81-5338-b197-373d347031db','6d2df89a-3f81-5338-b197-373d347031db','2024-05-28',
  'R-CHOP x6 cycles every 21 days for limited-stage GCB-subtype DLBCL.',NOW(),NOW()
);

INSERT INTO plugin_oncology.chemo_orders (
  id, tenant_id, patient_id, encounter_id, protocol_id, ordering_provider,
  cycle_number, day_number, scheduled_date, administered_at, bsa, weight, height,
  cancer_diagnosis_id, oncology_care_plan_id, dose_adjustments, pre_chemo_checklist,
  status, administered_by, adverse_reactions, administration_details,
  drug_preparation_details, nurse_verification_checklist, notes, created_at, updated_at
) VALUES
(uuid_from_text('chemo-order-noora-cycle-1'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),uuid_from_text('encounter-noora-05'),uuid_from_text('chemo-protocol-r-chop'),'6d2df89a-3f81-5338-b197-373d347031db',
 1,1,'2024-06-03','2024-06-03 09:30:00+00',1.65,58.0,162.0,
 uuid_from_text('diagnosis-noora'),uuid_from_text('careplan-noora'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','R-CHOP cycle 1 of 6 completed with rituximab premedication.',NOW(),NOW()),
(uuid_from_text('chemo-order-noora-cycle-2'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),NULL,uuid_from_text('chemo-protocol-r-chop'),'6d2df89a-3f81-5338-b197-373d347031db',
 2,1,'2024-06-24','2024-06-24 09:30:00+00',1.64,57.5,162.0,
 uuid_from_text('diagnosis-noora'),uuid_from_text('careplan-noora'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[{"term":"Neutropenia","grade":1}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 2 of 6; mild neutropenia, dose maintained.',NOW(),NOW()),
(uuid_from_text('chemo-order-noora-cycle-3'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),NULL,uuid_from_text('chemo-protocol-r-chop'),'6d2df89a-3f81-5338-b197-373d347031db',
 3,1,'2024-07-15','2024-07-15 09:30:00+00',1.64,57.8,162.0,
 uuid_from_text('diagnosis-noora'),uuid_from_text('careplan-noora'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 3 of 6 completed without complication.',NOW(),NOW()),
(uuid_from_text('chemo-order-noora-cycle-4'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),NULL,uuid_from_text('chemo-protocol-r-chop'),'6d2df89a-3f81-5338-b197-373d347031db',
 4,1,'2024-08-05','2024-08-05 09:30:00+00',1.65,58.0,162.0,
 uuid_from_text('diagnosis-noora'),uuid_from_text('careplan-noora'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 4 of 6 completed. Interim PET-CT showed excellent response.',NOW(),NOW()),
(uuid_from_text('chemo-order-noora-cycle-5'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),NULL,uuid_from_text('chemo-protocol-r-chop'),'6d2df89a-3f81-5338-b197-373d347031db',
 5,1,'2024-08-26','2024-08-26 09:30:00+00',1.65,58.2,162.0,
 uuid_from_text('diagnosis-noora'),uuid_from_text('careplan-noora'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[{"term":"Fatigue","grade":1}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 5 of 6; mild fatigue.',NOW(),NOW()),
(uuid_from_text('chemo-order-noora-cycle-6'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-noora-al-kaabi'),uuid_from_text('encounter-noora-06'),uuid_from_text('chemo-protocol-r-chop'),'6d2df89a-3f81-5338-b197-373d347031db',
 6,1,'2024-09-16','2024-09-16 09:30:00+00',1.65,58.5,162.0,
 uuid_from_text('diagnosis-noora'),uuid_from_text('careplan-noora'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 6 of 6 (final cycle) completed. End-of-treatment PET-CT: complete metabolic response.',NOW(),NOW());

CREATE OR REPLACE FUNCTION pg_temp.text_block(btype text, header text, blockid text, txt text)
RETURNS jsonb LANGUAGE sql IMMUTABLE AS $$
  SELECT jsonb_build_object(
    'type', 'textBlock',
    'attrs', jsonb_build_object('blockType', btype, 'header', header, 'blockId', blockid),
    'content', jsonb_build_array(
      jsonb_build_object('type', 'paragraph', 'content',
        jsonb_build_array(jsonb_build_object('type', 'text', 'text', txt)))
    )
  );
$$;

CREATE OR REPLACE FUNCTION pg_temp.smart_chart(chief text, hist text, notes text)
RETURNS jsonb LANGUAGE sql IMMUTABLE AS $$
  WITH ids AS (
    SELECT 'blk_' || substr(md5(chief || '|c'), 1, 8) AS b_chief,
           'blk_' || substr(md5(hist  || '|h'), 1, 8) AS b_hist,
           'blk_' || substr(md5(notes || '|n'), 1, 8) AS b_notes,
           'blk_' || substr(md5(chief || '|dx'), 1, 8) AS b_dx
  )
  SELECT jsonb_build_object(
    'version', '1.0.0',
    'editorType', 'smart-charting',
    'noteType', 'smart-charting',
    'blocks', jsonb_build_array(
      jsonb_build_object('id', b_chief, 'type', 'chiefHpi', 'header', 'Chief Complaints and HPI', 'content', chief),
      jsonb_build_object('id', b_hist,  'type', 'history',  'header', 'History', 'content', hist),
      jsonb_build_object('id', b_notes, 'type', 'notes',    'header', 'Notes', 'content', notes),
      jsonb_build_object('id', b_dx,    'type', 'diagnosis','header', 'Diagnosis')
    ),
    'tiptapJson', jsonb_build_object('type', 'doc', 'content', jsonb_build_array(
      pg_temp.text_block('chiefHpi', 'Chief Complaints and HPI', b_chief, chief),
      pg_temp.text_block('history',  'History', b_hist, hist),
      pg_temp.text_block('notes',    'Notes',   b_notes, notes),
      jsonb_build_object('type', 'diagnosisBlock', 'attrs', jsonb_build_object('blockId', b_dx))
    ))
  )
  FROM ids;
$$;

DO $$
DECLARE
  v_tenant  UUID := '11111111-1111-1111-1111-111111111111';
  v_patient UUID := uuid_from_text('patient-noora-al-kaabi');
  v_author  UUID := '6d2df89a-3f81-5338-b197-373d347031db';
  r RECORD;
BEGIN
  CREATE TEMP TABLE _charts (
    enc UUID, chief TEXT, hist TEXT, notes TEXT, icd TEXT, dx TEXT, dxtype TEXT
  ) ON COMMIT DROP;

  INSERT INTO _charts VALUES
  (uuid_from_text('encounter-noora-01'), '4-week history of painless right cervical lymphadenopathy with night sweats and weight loss.',
   '34-year-old female. No prior lymphoma. No significant past medical history.',
   'Palpable, non-tender, firm right cervical lymph node, 3 cm. B symptoms present. Referred for excisional biopsy.', 'R59.0', 'Localized enlarged lymph nodes', 'primary'),
  (uuid_from_text('encounter-noora-02'), 'Excisional biopsy of enlarged right cervical lymph node.',
   'Painless cervical lymphadenopathy with B symptoms for 4 weeks.',
   'Excisional biopsy: diffuse large B-cell lymphoma, GCB subtype, CD20 positive, Ki-67 85%. Staging workup arranged.', 'C83.30', 'Diffuse large B-cell lymphoma, unspecified site', 'primary'),
  (uuid_from_text('encounter-noora-03'), 'Staging PET-CT and bone marrow biopsy for biopsy-proven DLBCL.',
   'DLBCL confirmed on excisional biopsy.',
   'PET-CT: FDG-avid right cervical and axillary nodal disease, no infradiaphragmatic disease. Bone marrow: no involvement. Ann Arbor Stage II. LDH 310.', 'C83.30', 'Diffuse large B-cell lymphoma, unspecified site', 'primary'),
  (uuid_from_text('encounter-noora-04'), 'New diagnosis of Stage II DLBCL following tumor board review.',
   'Ann Arbor Stage II on staging. ECOG 1. No significant comorbidities.',
   'Medical oncology consult. Tumor board consensus: R-CHOP x6 cycles every 21 days, curative intent given limited-stage disease.', 'C83.30', 'Diffuse large B-cell lymphoma, unspecified site', 'primary'),
  (uuid_from_text('encounter-noora-05'), 'Curative chemotherapy cycle 1 of 6 (R-CHOP).',
   'Stage II DLBCL, ECOG 1.',
   'R-CHOP cycle 1 administered with rituximab premedication and antiemetic prophylaxis; tolerated well. Next cycle in 3 weeks.', 'Z51.11', 'Encounter for antineoplastic chemotherapy', 'primary'),
  (uuid_from_text('encounter-noora-06'), 'Chemotherapy cycle 6 of 6 and end-of-treatment restaging.',
   'Completed 5 prior R-CHOP cycles without dose-limiting toxicity; interim PET after cycle 4 showed excellent response.',
   'R-CHOP cycle 6 (final cycle) administered. End-of-treatment PET-CT: complete metabolic response, Deauville score 2. LDH normalized.', 'Z08', 'Encounter for follow-up examination after treatment for malignant neoplasm', 'primary');

  FOR r IN SELECT * FROM _charts LOOP
    INSERT INTO encounter_notes
      (id, tenant_id, encounter_id, patient_id, note_type, language, title, status, version,
       author_staff_id, author_display_name, content, created_at, updated_at)
    VALUES
      (gen_random_uuid(), v_tenant, r.enc, v_patient, 'progress', 'en', 'Smart Charting', 'draft', 1,
       v_author, 'Care Team', pg_temp.smart_chart(r.chief, r.hist, r.notes), NOW(), NOW());

    INSERT INTO encounter_diagnoses
      (id, tenant_id, encounter_id, patient_id, icd_code, icd_version, diagnosis_name, diagnosis_type,
       diagnosed_by, diagnosed_at, created_at, updated_at)
    VALUES
      (gen_random_uuid(), v_tenant, r.enc, v_patient, r.icd, 'ICD-10', r.dx, r.dxtype,
       v_author, NOW(), NOW(), NOW());
  END LOOP;
END $$;

DO $$
DECLARE
  v_tenant  UUID := '11111111-1111-1111-1111-111111111111';
  v_patient UUID := uuid_from_text('patient-noora-al-kaabi');
  v_surg    UUID := 'e761d1dc-1d77-5499-bd12-b077276934a7';
  v_rad     UUID := '23ef067c-d352-5415-945b-9b802d20bc3c';
  e2 UUID := uuid_from_text('encounter-noora-02');
  e3 UUID := uuid_from_text('encounter-noora-03');
BEGIN
  DELETE FROM clinical_orders WHERE patient_id = v_patient;

  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-noora-biopsy'), v_tenant, e2, v_patient, 'procedure', '38510', 'CPT', 'Excisional lymph node biopsy', 'routine', 'completed', v_surg, TIMESTAMPTZ '2024-05-09 07:30+00', NOW(), NOW());
  INSERT INTO procedure_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, indication, procedure_description, findings, complications, primary_performer, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('report-noora-biopsy'), v_tenant, uuid_from_text('order-noora-biopsy'), e2, v_patient, 'FINAL', 1,
    'Painless cervical lymphadenopathy with B symptoms', 'Excisional biopsy of right cervical lymph node.',
    'Diffuse large B-cell lymphoma, germinal center B-cell subtype, CD20 positive, Ki-67 85%.', 'None', v_surg, v_surg, TIMESTAMPTZ '2024-05-11 10:00+00', NOW(), NOW());

  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-noora-petct'), v_tenant, e3, v_patient, 'imaging', '78815', 'CPT', 'PET-CT whole body, staging', 'routine', 'completed', v_rad, TIMESTAMPTZ '2024-05-20 08:30+00', NOW(), NOW());
  INSERT INTO imaging_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, modality, body_part, technique, findings, impression, critical_finding, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('report-noora-petct'), v_tenant, uuid_from_text('order-noora-petct'), e3, v_patient, 'FINAL', 1,
    'PET-CT', 'Whole body', 'FDG PET-CT for lymphoma staging',
    'FDG-avid right cervical and right axillary lymphadenopathy. No infradiaphragmatic or extranodal disease.',
    'Ann Arbor Stage II diffuse large B-cell lymphoma.', false, v_rad, TIMESTAMPTZ '2024-05-20 12:00+00', NOW(), NOW());

  -- ── LDH (lab) ────────────────────────────────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-noora-ldh'), v_tenant, uuid_from_text('encounter-noora-06'), v_patient, 'lab', 'LDH', 'LOINC', 'LDH (end-of-treatment)', 'routine', 'completed', v_rad, TIMESTAMPTZ '2024-09-16 08:30+00', NOW(), NOW());
  INSERT INTO lab_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, specimen_type, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('lab-report-noora-ldh'), v_tenant, uuid_from_text('order-noora-ldh'), uuid_from_text('encounter-noora-06'), v_patient, 'FINAL', 1, 'Serum', v_rad, TIMESTAMPTZ '2024-09-16 12:00+00', NOW(), NOW());
  INSERT INTO lab_result_items (id, tenant_id, lab_report_id, sort_order, test_code, code_system, test_name, value_numeric, unit, ref_range_low, ref_range_high, abnormal_flag, critical_flag, created_at, updated_at) VALUES
    (gen_random_uuid(), v_tenant, uuid_from_text('lab-report-noora-ldh'), 1, '14804-9', 'LOINC', 'Lactate Dehydrogenase (LDH)', 165, 'U/L', 140, 280, false, false, NOW(), NOW());
END $$;

INSERT INTO plugin_oncology.cancer_timeline_events
  (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by, created_at)
VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-noora-al-kaabi'), uuid_from_text('diagnosis-noora'), 'diagnosis', TIMESTAMPTZ '2024-05-11 10:00+00',
   'Diffuse large B-cell lymphoma diagnosed', 'DLBCL, germinal center B-cell subtype, CD20 positive, Ki-67 85%. Confirmed on excisional biopsy.',
   'cancer_diagnosis', uuid_from_text('diagnosis-noora'), jsonb_build_object('cancerType','Non-Hodgkin Lymphoma','primarySite','Right cervical lymph node','clinicalStatus','active','metastaticStatus','regional'), 'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-noora-al-kaabi'), uuid_from_text('diagnosis-noora'), 'staging', TIMESTAMPTZ '2024-05-20 12:00+00',
   'Clinical staging — Ann Arbor Stage II', 'Staging by PET-CT and bone marrow biopsy: nodal disease on one side of the diaphragm, no marrow involvement.',
   'tumor_staging', uuid_from_text('staging-noora-clinical'), jsonb_build_object('stagingSystem','Ann Arbor','stageGroup','II'), 'info', '23ef067c-d352-5415-945b-9b802d20bc3c', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-noora-al-kaabi'), uuid_from_text('diagnosis-noora'), 'tumor_board', TIMESTAMPTZ '2024-05-27 14:00+00',
   'Tumor board — curative intent', 'MDT recommendation: R-CHOP x6 cycles every 21 days for limited-stage DLBCL.',
   'tumor_board_case', uuid_from_text('tumor-board-noora'), jsonb_build_object('treatmentIntent','curative'), 'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-noora-al-kaabi'), uuid_from_text('diagnosis-noora'), 'care_plan_created', TIMESTAMPTZ '2024-05-28 10:00+00',
   'Care plan CP-2024-0401 created', 'Curative-intent plan: R-CHOP x6 cycles.',
   'oncology_care_plan', uuid_from_text('careplan-noora'), jsonb_build_object('planNumber','CP-2024-0401','treatmentIntent','curative'), 'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-noora-al-kaabi'), uuid_from_text('diagnosis-noora'), 'response_assessment', TIMESTAMPTZ '2024-09-16 14:30+00',
   'Complete metabolic response', 'End-of-treatment PET-CT after 6 cycles of R-CHOP: complete metabolic response, Deauville score 2. LDH normalized.',
   'manual', NULL, jsonb_build_object('category','response'), 'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW());

INSERT INTO plugin_oncology.cancer_timeline_events
  (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by, created_at)
SELECT
  gen_random_uuid(), co.tenant_id, co.patient_id, co.cancer_diagnosis_id, 'chemo_completed',
  co.administered_at, 'R-CHOP cycle ' || co.cycle_number || '/6 completed', co.notes,
  'chemo_order', co.id,
  jsonb_build_object('protocol','R-CHOP','cycleNumber',co.cycle_number,'dayNumber',co.day_number,'bsa',co.bsa,'protocolTotalCycles',6),
  CASE WHEN co.adverse_reactions::text != '[]' THEN 'warning' ELSE 'info' END,
  co.ordering_provider, NOW()
FROM plugin_oncology.chemo_orders co
WHERE co.patient_id = uuid_from_text('patient-noora-al-kaabi')
ORDER BY co.cycle_number;

COMMIT;
