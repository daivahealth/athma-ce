-- =============================================================================
-- 12-patient-lung.sql
-- Palliative journey: Stage IV NSCLC (adenocarcinoma) with liver metastasis,
-- first-line Cisplatin+Pemetrexed, for Vijay Nair (new patient, MRN-2025-005).
-- No surgery (unresectable metastatic disease).
--
-- Seeds: patient record, 7 encounters, encounter_notes/diagnoses, clinical
--   orders + reports, clinical_observations (CEA trend), plugin_oncology.*
--   (diagnosis, staging, care plan, all 6 real chemo_orders), and
--   cancer_timeline_events derived from the rows above.
--
-- Idempotent: re-runnable, all writes scoped to this patient with stable
-- uuid_from_text() ids.
-- =============================================================================

BEGIN;

DELETE FROM plugin_oncology.cancer_timeline_events WHERE patient_id = uuid_from_text('patient-rashid-al-suwaidi');
DELETE FROM plugin_oncology.chemo_orders           WHERE patient_id = uuid_from_text('patient-rashid-al-suwaidi');
DELETE FROM plugin_oncology.oncology_care_plans    WHERE patient_id = uuid_from_text('patient-rashid-al-suwaidi');
DELETE FROM plugin_oncology.tumor_staging          WHERE patient_id = uuid_from_text('patient-rashid-al-suwaidi');
DELETE FROM plugin_oncology.cancer_diagnoses       WHERE patient_id = uuid_from_text('patient-rashid-al-suwaidi');

DELETE FROM clinical_orders       WHERE patient_id = uuid_from_text('patient-rashid-al-suwaidi');
DELETE FROM clinical_observations WHERE patient_id = uuid_from_text('patient-rashid-al-suwaidi');
DELETE FROM encounter_notes       WHERE patient_id = uuid_from_text('patient-rashid-al-suwaidi');
DELETE FROM encounter_diagnoses   WHERE patient_id = uuid_from_text('patient-rashid-al-suwaidi');
DELETE FROM encounters            WHERE patient_id = uuid_from_text('patient-rashid-al-suwaidi');
DELETE FROM patients              WHERE id = uuid_from_text('patient-rashid-al-suwaidi');

INSERT INTO patients (
  id, mrn, tenant_id, national_id, national_id_type, issuing_country,
  first_name, last_name, middle_name, date_of_birth, gender, marital_status,
  nationality, preferred_language, phone_number, email, address_line1,
  address_line2, city, postal_code, country, emergency_contact, insurance_info,
  created_by, created_at_facility, registration_source, registration_notes,
  status, created_at, updated_at, updated_by, updated_at_facility
) VALUES (
  uuid_from_text('patient-rashid-al-suwaidi'), 'MRN-2025-005', '11111111-1111-1111-1111-111111111111'::UUID,
  '456789012345', 'national_id', 'IN',
  'Vijay', 'Nair', NULL, DATE '1958-09-22', 'male', 'married',
  'India', 'en', '+919747556677', 'vijay.nair@example.in', 'Marine Drive',
  NULL, 'Kochi', '682031', 'IN',
  '{"name":"Latha Nair","relation":"spouse","phone":"+919747556688"}'::jsonb,
  '{"payer":"Star Health Insurance","memberId":"STAR667788"}'::jsonb,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::UUID,
  'manual', 'Initial registration via pulmonology referral',
  'active', NOW(), NOW(), NULL, NULL
);

INSERT INTO encounters (
  id, encounter_number, tenant_id, patient_id, facility_id, facility_name,
  primary_staff_id, encounter_class, encounter_type, status, priority,
  start_time, end_time, encounter_source, chief_complaint, presenting_symptoms,
  notes, allergies, current_medications, medical_history, created_at, updated_at
) VALUES
(uuid_from_text('encounter-rashid-01'),'ENC-2024-0201','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee','AMB','Primary Care Visit','finished','routine',
 '2024-01-10 09:00:00+00','2024-01-10 09:30:00+00','appointment','Persistent cough, weight loss, occasional hemoptysis','6-week history of cough, 5kg unintentional weight loss, one episode of blood-streaked sputum',
 '65-year-old male, 40 pack-year smoking history. CXR shows right upper lobe opacity. Referred for CT chest.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-rashid-02'),'ENC-2024-0202','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Imaging (Chest CT)','finished','routine',
 '2024-01-17 10:00:00+00','2024-01-17 10:30:00+00','appointment','CT chest for suspicious CXR finding','Cough, weight loss, hemoptysis',
 'CT chest: 3.8 cm right upper lobe mass with mediastinal lymphadenopathy. Suspicious for primary lung malignancy.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-rashid-03'),'ENC-2024-0203','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e761d1dc-1d77-5499-bd12-b077276934a7','AMB','Bronchoscopy & Biopsy','finished','routine',
 '2024-01-24 08:00:00+00','2024-01-24 09:00:00+00','appointment','Diagnostic bronchoscopy with biopsy','Right upper lobe mass on CT',
 'Bronchoscopy with transbronchial biopsy: adenocarcinoma of the lung. EGFR wild-type, ALK negative, PD-L1 TPS 40%.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-rashid-04'),'ENC-2024-0204','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Staging PET-CT','finished','routine',
 '2024-02-01 09:00:00+00','2024-02-01 10:00:00+00','appointment','PET-CT for biopsy-proven lung adenocarcinoma','Staging workup',
 'PET-CT: FDG-avid right upper lobe mass, mediastinal nodal involvement, and a solitary FDG-avid liver lesion consistent with metastasis. Stage IV (cT2b N2 M1b).',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-rashid-05'),'ENC-2024-0205','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Oncology Consultation','finished','routine',
 '2024-02-08 09:00:00+00','2024-02-08 10:00:00+00','referral','Newly diagnosed metastatic lung cancer','Referred for oncology assessment',
 'Medical oncology consult: Stage IV (M1b) lung adenocarcinoma, EGFR wild-type, ALK negative, PD-L1 40%. Not a surgical candidate. Plan: palliative first-line cisplatin + pemetrexed.',
 '["No known drug allergies"]',NULL,'Stage IV Lung Adenocarcinoma (dx 2024), 40 pack-year smoking history',NOW(),NOW()),
(uuid_from_text('encounter-rashid-06'),'ENC-2024-0206','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Chemotherapy','finished','routine',
 '2024-02-22 09:00:00+00','2024-02-22 13:30:00+00','appointment','Palliative chemotherapy cycle 1','Chemotherapy infusion',
 'Cisplatin + pemetrexed cycle 1 of 6 administered with hydration and antiemetic prophylaxis; tolerated well.',
 '["No known drug allergies"]','["Cisplatin/Pemetrexed (chemo)","Ondansetron PRN"]','Stage IV Lung Adenocarcinoma (dx 2024)',NOW(),NOW()),
(uuid_from_text('encounter-rashid-07'),'ENC-2024-0207','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Chemotherapy & Restaging','finished','routine',
 '2024-06-06 09:00:00+00','2024-06-06 13:30:00+00','appointment','Chemotherapy cycle 6 and restaging review','Chemotherapy infusion and response assessment',
 'Cisplatin + pemetrexed cycle 6 of 6 administered. Restaging CT: partial response, primary mass and liver lesion both reduced in size. CEA down from 12.4 to 4.8. Plan maintenance pemetrexed.',
 '["No known drug allergies"]','["Pemetrexed maintenance (chemo)"]','Stage IV Lung Adenocarcinoma (dx 2024), partial response to first-line chemotherapy',NOW(),NOW());

INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id, code, code_system, display_name,
  category, value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, created_at, updated_at
) VALUES
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),uuid_from_text('encounter-rashid-04'),'2039-6','LOINC','CEA (Carcinoembryonic antigen)','laboratory',12.4,'ng/mL',0,5,'high','2024-02-01 10:15:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),uuid_from_text('encounter-rashid-07'),'2039-6','LOINC','CEA (Carcinoembryonic antigen)','laboratory',4.8,'ng/mL',0,5,'normal','2024-06-06 09:15:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW());

INSERT INTO plugin_oncology.cancer_diagnoses (
  id, tenant_id, patient_id, encounter_id, cancer_type, primary_site,
  primary_site_code, laterality, histology_morphology, morphology_code,
  icd_code, snomed_code, diagnosis_date, clinical_status, verification_status,
  grade, metastatic_status, is_recurrence, biomarkers, ecog_at_diagnosis,
  diagnosed_by, notes, created_at, updated_at
) VALUES (
  uuid_from_text('diagnosis-rashid'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),uuid_from_text('encounter-rashid-05'),
  'Non-Small Cell Lung Cancer (Adenocarcinoma)','Right upper lobe','C34.1','right','Adenocarcinoma','8140/3',
  'C34.11','254637007','2024-02-08','active','confirmed',
  'G3','distant',false,'{"EGFR":"wild-type","ALK":"negative","PDL1_TPS":"40%"}',1,
  '6d2df89a-3f81-5338-b197-373d347031db','Poorly differentiated adenocarcinoma of the right upper lobe with liver metastasis.',NOW(),NOW()
);

INSERT INTO plugin_oncology.tumor_staging (
  id, tenant_id, cancer_diagnosis_id, patient_id, encounter_id, provider_id,
  staging_system, staging_edition, staging_type, stage_group, t_category,
  n_category, m_category, body_site, grade, histology, staging_date, status,
  notes, created_at, updated_at
) VALUES (
  uuid_from_text('staging-rashid-clinical'),'11111111-1111-1111-1111-111111111111',uuid_from_text('diagnosis-rashid'),uuid_from_text('patient-rashid-al-suwaidi'),uuid_from_text('encounter-rashid-04'),'23ef067c-d352-5415-945b-9b802d20bc3c',
  'AJCC','8th','clinical','IV','cT2b','cN2','cM1b','Right upper lobe','G3','Adenocarcinoma','2024-02-01','active','Clinical staging by PET-CT: solitary liver metastasis, mediastinal nodal involvement.',NOW(),NOW()
);

INSERT INTO plugin_oncology.oncology_care_plans (
  id, tenant_id, patient_id, cancer_diagnosis_id, plan_number, version,
  treatment_intent, oncology_subspecialty, planned_modalities, planned_cycles,
  cycle_duration_days, milestones, follow_up_schedule, status, start_date, end_date,
  created_by, approved_by, approved_at, notes, created_at, updated_at
) VALUES (
  uuid_from_text('careplan-rashid'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),uuid_from_text('diagnosis-rashid'),'CP-2024-0201',1,
  'palliative','medical_oncology','["chemotherapy"]',6,
  21,'[{"label":"Start first-line chemotherapy","date":"2024-02-22"},{"label":"Restaging after 6 cycles","date":"2024-06-06"}]','{"plan":"Restaging CT every 2-3 cycles; maintenance pemetrexed if responding"}','completed','2024-02-22','2024-06-06',
  '6d2df89a-3f81-5338-b197-373d347031db','6d2df89a-3f81-5338-b197-373d347031db','2024-02-09',
  'Palliative first-line cisplatin + pemetrexed for EGFR/ALK wild-type Stage IV adenocarcinoma.',NOW(),NOW()
);

INSERT INTO plugin_oncology.chemo_orders (
  id, tenant_id, patient_id, encounter_id, protocol_id, ordering_provider,
  cycle_number, day_number, scheduled_date, administered_at, bsa, weight, height,
  cancer_diagnosis_id, oncology_care_plan_id, dose_adjustments, pre_chemo_checklist,
  status, administered_by, adverse_reactions, administration_details,
  drug_preparation_details, nurse_verification_checklist, notes, created_at, updated_at
) VALUES
(uuid_from_text('chemo-order-rashid-cycle-1'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),uuid_from_text('encounter-rashid-06'),uuid_from_text('chemo-protocol-cis-pem'),'6d2df89a-3f81-5338-b197-373d347031db',
 1,1,'2024-02-22','2024-02-22 09:30:00+00',1.85,72.0,172.0,
 uuid_from_text('diagnosis-rashid'),uuid_from_text('careplan-rashid'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 1 of 6 completed with hydration protocol.',NOW(),NOW()),
(uuid_from_text('chemo-order-rashid-cycle-2'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),NULL,uuid_from_text('chemo-protocol-cis-pem'),'6d2df89a-3f81-5338-b197-373d347031db',
 2,1,'2024-03-14','2024-03-14 09:30:00+00',1.83,71.0,172.0,
 uuid_from_text('diagnosis-rashid'),uuid_from_text('careplan-rashid'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[{"term":"Fatigue","grade":1}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 2 of 6; mild fatigue.',NOW(),NOW()),
(uuid_from_text('chemo-order-rashid-cycle-3'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),NULL,uuid_from_text('chemo-protocol-cis-pem'),'6d2df89a-3f81-5338-b197-373d347031db',
 3,1,'2024-04-04','2024-04-04 09:30:00+00',1.82,70.5,172.0,
 uuid_from_text('diagnosis-rashid'),uuid_from_text('careplan-rashid'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[{"term":"Nausea","grade":1}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 3 of 6; nausea well controlled.',NOW(),NOW()),
(uuid_from_text('chemo-order-rashid-cycle-4'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),NULL,uuid_from_text('chemo-protocol-cis-pem'),'6d2df89a-3f81-5338-b197-373d347031db',
 4,1,'2024-04-25','2024-04-25 09:30:00+00',1.81,70.0,172.0,
 uuid_from_text('diagnosis-rashid'),uuid_from_text('careplan-rashid'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 4 of 6 completed without complication.',NOW(),NOW()),
(uuid_from_text('chemo-order-rashid-cycle-5'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),NULL,uuid_from_text('chemo-protocol-cis-pem'),'6d2df89a-3f81-5338-b197-373d347031db',
 5,1,'2024-05-16','2024-05-16 09:30:00+00',1.81,70.2,172.0,
 uuid_from_text('diagnosis-rashid'),uuid_from_text('careplan-rashid'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[{"term":"Peripheral neuropathy","grade":1}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 5 of 6; grade 1 neuropathy noted.',NOW(),NOW()),
(uuid_from_text('chemo-order-rashid-cycle-6'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-rashid-al-suwaidi'),uuid_from_text('encounter-rashid-07'),uuid_from_text('chemo-protocol-cis-pem'),'6d2df89a-3f81-5338-b197-373d347031db',
 6,1,'2024-06-06','2024-06-06 09:30:00+00',1.80,70.5,172.0,
 uuid_from_text('diagnosis-rashid'),uuid_from_text('careplan-rashid'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 6 of 6 (final induction cycle) completed. Restaging shows partial response.',NOW(),NOW());

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
  v_patient UUID := uuid_from_text('patient-rashid-al-suwaidi');
  v_author  UUID := '6d2df89a-3f81-5338-b197-373d347031db';
  r RECORD;
BEGIN
  CREATE TEMP TABLE _charts (
    enc UUID, chief TEXT, hist TEXT, notes TEXT, icd TEXT, dx TEXT, dxtype TEXT
  ) ON COMMIT DROP;

  INSERT INTO _charts VALUES
  (uuid_from_text('encounter-rashid-01'), '6-week history of cough, weight loss and one episode of hemoptysis.',
   '65-year-old male, 40 pack-year smoking history. No prior lung cancer screening.',
   'CXR shows right upper lobe opacity. Referred for CT chest.', 'R91.8', 'Other nonspecific abnormal finding of lung field', 'primary'),
  (uuid_from_text('encounter-rashid-02'), 'CT chest for suspicious CXR finding.',
   'Cough, weight loss and hemoptysis for 6 weeks.',
   'CT chest: 3.8 cm right upper lobe mass with mediastinal lymphadenopathy. Bronchoscopy with biopsy arranged.', 'R91.8', 'Other nonspecific abnormal finding of lung field', 'primary'),
  (uuid_from_text('encounter-rashid-03'), 'Diagnostic bronchoscopy with transbronchial biopsy.',
   '3.8 cm right upper lobe mass on CT.',
   'Bronchoscopy: adenocarcinoma of the lung. EGFR wild-type, ALK negative, PD-L1 TPS 40%. Staging PET-CT arranged.', 'C34.11', 'Malignant neoplasm of upper lobe, right bronchus or lung', 'primary'),
  (uuid_from_text('encounter-rashid-04'), 'Staging PET-CT for biopsy-proven lung adenocarcinoma.',
   'Adenocarcinoma confirmed on bronchoscopic biopsy.',
   'PET-CT: FDG-avid primary mass, mediastinal nodal involvement, solitary liver metastasis. Clinical stage IV (cT2b N2 M1b). CEA 12.4.', 'C34.11', 'Malignant neoplasm of upper lobe, right bronchus or lung', 'primary'),
  (uuid_from_text('encounter-rashid-05'), 'New diagnosis of Stage IV lung adenocarcinoma with liver metastasis.',
   'cT2b N2 M1b on staging. ECOG 1. 40 pack-year smoking history.',
   'Medical oncology consult. Not a surgical candidate given metastatic disease. Plan: palliative first-line cisplatin + pemetrexed given EGFR/ALK wild-type status.', 'C34.11', 'Malignant neoplasm of upper lobe, right bronchus or lung', 'primary'),
  (uuid_from_text('encounter-rashid-06'), 'Palliative chemotherapy cycle 1 of 6.',
   'Stage IV lung adenocarcinoma, ECOG 1.',
   'Cisplatin + pemetrexed cycle 1 administered with hydration and antiemetic prophylaxis; tolerated well. Next cycle in 3 weeks.', 'Z51.11', 'Encounter for antineoplastic chemotherapy', 'primary'),
  (uuid_from_text('encounter-rashid-07'), 'Chemotherapy cycle 6 of 6 and restaging review.',
   'Completed 5 prior cycles of cisplatin + pemetrexed without dose-limiting toxicity.',
   'Cycle 6 (final induction cycle) administered. Restaging CT: partial response, primary mass and liver lesion reduced in size. CEA down to 4.8. Plan maintenance pemetrexed.', 'C34.11', 'Malignant neoplasm of upper lobe, right bronchus or lung', 'primary');

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
  v_patient UUID := uuid_from_text('patient-rashid-al-suwaidi');
  v_surg    UUID := 'e761d1dc-1d77-5499-bd12-b077276934a7';
  v_rad     UUID := '23ef067c-d352-5415-945b-9b802d20bc3c';
  e2 UUID := uuid_from_text('encounter-rashid-02');
  e3 UUID := uuid_from_text('encounter-rashid-03');
BEGIN
  DELETE FROM clinical_orders WHERE patient_id = v_patient;

  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-rashid-ctchest'), v_tenant, e2, v_patient, 'imaging', '71260', 'CPT', 'CT Chest with contrast', 'routine', 'completed', v_rad, TIMESTAMPTZ '2024-01-17 09:30+00', NOW(), NOW());
  INSERT INTO imaging_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, modality, body_part, technique, findings, impression, critical_finding, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('report-rashid-ctchest'), v_tenant, uuid_from_text('order-rashid-ctchest'), e2, v_patient, 'FINAL', 1,
    'CT', 'Chest', 'Contrast-enhanced CT chest',
    '3.8 cm right upper lobe mass with mediastinal lymphadenopathy.',
    'Findings highly suspicious for primary lung malignancy; tissue diagnosis recommended.', true, v_rad, TIMESTAMPTZ '2024-01-17 12:00+00', NOW(), NOW());

  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-rashid-bronch'), v_tenant, e3, v_patient, 'procedure', '31625', 'CPT', 'Bronchoscopy with transbronchial biopsy', 'routine', 'completed', v_surg, TIMESTAMPTZ '2024-01-24 07:30+00', NOW(), NOW());
  INSERT INTO procedure_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, indication, procedure_description, findings, complications, primary_performer, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('report-rashid-bronch'), v_tenant, uuid_from_text('order-rashid-bronch'), e3, v_patient, 'FINAL', 1,
    'Right upper lobe mass suspicious for malignancy', 'Flexible bronchoscopy with transbronchial biopsy of right upper lobe mass.',
    'Adenocarcinoma of the lung, EGFR wild-type, ALK negative, PD-L1 TPS 40%.', 'None', v_surg, v_surg, TIMESTAMPTZ '2024-01-26 10:00+00', NOW(), NOW());

  -- ── CEA tumor marker (lab) ───────────────────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-rashid-cea'), v_tenant, uuid_from_text('encounter-rashid-07'), v_patient, 'lab', 'CEA', 'LOINC', 'CEA (restaging)', 'routine', 'completed', v_surg, TIMESTAMPTZ '2024-06-06 08:30+00', NOW(), NOW());
  INSERT INTO lab_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, specimen_type, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('lab-report-rashid-cea'), v_tenant, uuid_from_text('order-rashid-cea'), uuid_from_text('encounter-rashid-07'), v_patient, 'FINAL', 1, 'Serum', v_surg, TIMESTAMPTZ '2024-06-06 12:00+00', NOW(), NOW());
  INSERT INTO lab_result_items (id, tenant_id, lab_report_id, sort_order, test_code, code_system, test_name, value_numeric, unit, ref_range_low, ref_range_high, abnormal_flag, critical_flag, created_at, updated_at) VALUES
    (gen_random_uuid(), v_tenant, uuid_from_text('lab-report-rashid-cea'), 1, '83085-1', 'LOINC', 'CEA', 4.8, 'ng/mL', 0, 5, false, false, NOW(), NOW());
END $$;

INSERT INTO plugin_oncology.cancer_timeline_events
  (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by, created_at)
VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-rashid-al-suwaidi'), uuid_from_text('diagnosis-rashid'), 'diagnosis', TIMESTAMPTZ '2024-01-26 10:00+00',
   'Lung adenocarcinoma diagnosed', 'Poorly differentiated adenocarcinoma of the right upper lobe. EGFR wild-type, ALK negative, PD-L1 TPS 40%.',
   'cancer_diagnosis', uuid_from_text('diagnosis-rashid'), jsonb_build_object('cancerType','NSCLC','primarySite','Right upper lobe','clinicalStatus','active','metastaticStatus','distant'), 'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-rashid-al-suwaidi'), uuid_from_text('diagnosis-rashid'), 'staging', TIMESTAMPTZ '2024-02-01 10:00+00',
   'Clinical staging — cT2b N2 M1b (Stage IV)', 'AJCC 8th ed. clinical stage IV: solitary liver metastasis, mediastinal nodal involvement on PET-CT.',
   'tumor_staging', uuid_from_text('staging-rashid-clinical'), jsonb_build_object('stagingSystem','AJCC8','stageGroup','IV','tCategory','cT2b','nCategory','N2','mCategory','M1b'), 'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-rashid-al-suwaidi'), uuid_from_text('diagnosis-rashid'), 'care_plan_created', TIMESTAMPTZ '2024-02-08 10:00+00',
   'Care plan CP-2024-0201 created', 'Palliative-intent plan: first-line cisplatin + pemetrexed for 6 cycles.',
   'oncology_care_plan', uuid_from_text('careplan-rashid'), jsonb_build_object('planNumber','CP-2024-0201','treatmentIntent','palliative'), 'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-rashid-al-suwaidi'), uuid_from_text('diagnosis-rashid'), 'response_assessment', TIMESTAMPTZ '2024-06-06 13:00+00',
   'Partial response to first-line chemotherapy', 'Restaging CT after 6 cycles: primary mass and liver lesion reduced in size. CEA down from 12.4 to 4.8.',
   'manual', NULL, jsonb_build_object('category','response'), 'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW());

INSERT INTO plugin_oncology.cancer_timeline_events
  (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by, created_at)
SELECT
  gen_random_uuid(), co.tenant_id, co.patient_id, co.cancer_diagnosis_id, 'chemo_completed',
  co.administered_at, 'Cisplatin+Pemetrexed cycle ' || co.cycle_number || '/6 completed', co.notes,
  'chemo_order', co.id,
  jsonb_build_object('protocol','Cis-Pem','cycleNumber',co.cycle_number,'dayNumber',co.day_number,'bsa',co.bsa,'protocolTotalCycles',6),
  CASE WHEN co.adverse_reactions::text != '[]' THEN 'warning' ELSE 'info' END,
  co.ordering_provider, NOW()
FROM plugin_oncology.chemo_orders co
WHERE co.patient_id = uuid_from_text('patient-rashid-al-suwaidi')
ORDER BY co.cycle_number;

COMMIT;
