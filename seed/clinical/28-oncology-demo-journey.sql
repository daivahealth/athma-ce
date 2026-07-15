-- =============================================================================
-- 28-oncology-demo-journey.sql
-- Demo data: 5-year Stage III colorectal cancer journey for John Smith
-- Patient MRN-2025-003 (7bc65ec5-ef2f-5a36-b575-7978ce5e59c0), 2021 -> 2026.
--
-- Seeds: encounters, clinical_observations (vitals + CEA/CBC/HbA1c),
--        and plugin_oncology.* (diagnosis, staging, care plan, chemo orders).
--
-- Idempotent: re-runnable. All writes are scoped to this patient and use
-- stable ids, so a second run replaces the same rows.
--
-- NOTE: The patients table has NO allergies / chronic_conditions /
-- current_medications columns (verified against information_schema). Those
-- clinical facts are therefore surfaced on the encounters, which DO have
-- allergies (jsonb), current_medications (jsonb) and medical_history (text)
-- columns -- this is where the app reads them for the encounter/timeline UI.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Clean up any prior run for this patient (children before parents).
-- ---------------------------------------------------------------------------
DELETE FROM clinical_observations
 WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0'
   AND encounter_id IN (
     'e0000001-0000-4000-8000-000000000001','e0000001-0000-4000-8000-000000000002',
     'e0000001-0000-4000-8000-000000000003','e0000001-0000-4000-8000-000000000004',
     'e0000001-0000-4000-8000-000000000005','e0000001-0000-4000-8000-000000000006',
     'e0000001-0000-4000-8000-000000000007','e0000001-0000-4000-8000-000000000008',
     'e0000001-0000-4000-8000-000000000009','e0000001-0000-4000-8000-000000000010',
     'e0000001-0000-4000-8000-000000000011','e0000001-0000-4000-8000-000000000012');

DELETE FROM plugin_oncology.chemo_orders          WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM plugin_oncology.oncology_care_plans   WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM plugin_oncology.tumor_staging         WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM plugin_oncology.cancer_diagnoses      WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';

DELETE FROM encounters
 WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0'
   AND id IN (
     'e0000001-0000-4000-8000-000000000001','e0000001-0000-4000-8000-000000000002',
     'e0000001-0000-4000-8000-000000000003','e0000001-0000-4000-8000-000000000004',
     'e0000001-0000-4000-8000-000000000005','e0000001-0000-4000-8000-000000000006',
     'e0000001-0000-4000-8000-000000000007','e0000001-0000-4000-8000-000000000008',
     'e0000001-0000-4000-8000-000000000009','e0000001-0000-4000-8000-000000000010',
     'e0000001-0000-4000-8000-000000000011','e0000001-0000-4000-8000-000000000012');

-- ---------------------------------------------------------------------------
-- (1) Patient core record: the patients table has no allergies /
--     chronic_conditions / current_medications columns, so we bump updated_at
--     to mark the record as touched by this demo seed. The problem list,
--     allergy list and medication list live on the encounters below.
-- ---------------------------------------------------------------------------
UPDATE patients
   SET updated_at = NOW()
 WHERE id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';

-- ---------------------------------------------------------------------------
-- (2) Encounters -- chronological 2021 -> 2026.
-- ---------------------------------------------------------------------------
INSERT INTO encounters (
  id, encounter_number, tenant_id, patient_id, facility_id, facility_name,
  primary_staff_id, encounter_class, encounter_type, status, priority,
  start_time, end_time, encounter_source, chief_complaint, presenting_symptoms,
  notes, allergies, current_medications, medical_history, created_at, updated_at
) VALUES
-- 1. Presentation with symptoms (PCP)
('e0000001-0000-4000-8000-000000000001','ENC-2021-0001','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee','AMB','Primary Care Visit','finished','routine',
 '2021-02-15 09:30:00+00','2021-02-15 10:00:00+00','appointment','Rectal bleeding and change in bowel habits','Intermittent rectal bleeding x6 weeks, altered bowel habits, fatigue',
 'Presented with 6 weeks of intermittent rectal bleeding, altered bowel habits and fatigue; FOBT positive, referred for colonoscopy.',
 NULL,NULL,NULL,NOW(),NOW()),
-- 2. Colonoscopy + biopsy (proceduralist / surgeon)
('e0000001-0000-4000-8000-000000000002','ENC-2021-0002','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'ac4287f1-9764-590c-b62a-1ea17f43aad8','AMB','Colonoscopy & Biopsy','finished','routine',
 '2021-02-28 08:00:00+00','2021-02-28 09:15:00+00','appointment','Diagnostic colonoscopy','Sigmoid mass on colonoscopy',
 'Colonoscopy: 4 cm friable sigmoid mass; biopsy confirmed moderately differentiated adenocarcinoma.',
 NULL,NULL,NULL,NOW(),NOW()),
-- 3. Staging CT (radiologist)
('e0000001-0000-4000-8000-000000000003','ENC-2021-0003','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'f97c5b31-aa24-5862-98cf-ee29d50db5d1','AMB','Imaging (Staging CT)','finished','routine',
 '2021-03-10 11:00:00+00','2021-03-10 11:45:00+00','appointment','Staging CT for biopsy-proven colon cancer','Staging workup',
 'Staging CT chest/abdomen/pelvis: sigmoid wall thickening with regional lymphadenopathy, no distant metastasis; CEA elevated at 8.5.',
 NULL,NULL,NULL,NOW(),NOW()),
-- 4. Oncology consultation -> Stage III diagnosis (oncologist)
('e0000001-0000-4000-8000-000000000004','ENC-2021-0004','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'aebba554-5fff-5daf-966c-713ea9f34426','AMB','Oncology Consultation','finished','routine',
 '2021-03-20 14:00:00+00','2021-03-20 15:00:00+00','referral','Newly diagnosed colon cancer','Referred for oncology assessment',
 'Medical oncology consult: clinical Stage III (cT3 N1 M0) colorectal adenocarcinoma; plan surgery then adjuvant FOLFOX.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["Metformin 1000mg BID","Lisinopril 20mg QD"]','Stage III Colorectal Cancer (dx 2021), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 5. Surgery -- colectomy (surgeon, inpatient)
('e0000001-0000-4000-8000-000000000005','ENC-2021-0005','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'ac4287f1-9764-590c-b62a-1ea17f43aad8','IMP','Surgery (Colectomy)','finished','urgent',
 '2021-04-05 07:30:00+00','2021-04-09 12:00:00+00','referral','Sigmoid colectomy for Stage III colon cancer','Scheduled resection',
 'Laparoscopic sigmoid colectomy; pathology pT3 N1 (2/16 nodes) M0, Stage IIIB, margins clear.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["Metformin 1000mg BID","Lisinopril 20mg QD"]','Stage III Colorectal Cancer (dx 2021), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 6. FOLFOX cycle 1 (oncologist)
('e0000001-0000-4000-8000-000000000006','ENC-2021-0006','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'aebba554-5fff-5daf-966c-713ea9f34426','AMB','Chemotherapy','finished','routine',
 '2021-05-10 09:00:00+00','2021-05-10 13:00:00+00','appointment','Adjuvant chemotherapy cycle 1','Chemotherapy infusion',
 'Adjuvant mFOLFOX6 cycle 1 of 12 administered; tolerated well, antiemetic prophylaxis given.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["FOLFOX (chemo)","Metformin 1000mg BID","Lisinopril 20mg QD","Ondansetron PRN"]','Stage III Colorectal Cancer (dx 2021), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 7. FOLFOX cycle 2 (oncologist)
('e0000001-0000-4000-8000-000000000007','ENC-2021-0007','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'aebba554-5fff-5daf-966c-713ea9f34426','AMB','Chemotherapy','finished','routine',
 '2021-05-24 09:00:00+00','2021-05-24 13:00:00+00','appointment','Adjuvant chemotherapy cycle 2','Chemotherapy infusion',
 'mFOLFOX6 cycle 2 administered; grade 1 peripheral neuropathy, counts adequate.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["FOLFOX (chemo)","Metformin 1000mg BID","Lisinopril 20mg QD","Ondansetron PRN"]','Stage III Colorectal Cancer (dx 2021), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 8. FOLFOX cycle 3 (oncologist)
('e0000001-0000-4000-8000-000000000008','ENC-2021-0008','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'aebba554-5fff-5daf-966c-713ea9f34426','AMB','Chemotherapy','finished','routine',
 '2021-06-07 09:00:00+00','2021-06-07 13:00:00+00','appointment','Adjuvant chemotherapy cycle 3','Chemotherapy infusion',
 'mFOLFOX6 cycle 3 administered; mild neutropenia, oxaliplatin dose maintained.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["FOLFOX (chemo)","Metformin 1000mg BID","Lisinopril 20mg QD","Ondansetron PRN"]','Stage III Colorectal Cancer (dx 2021), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 9. Interval lab visit (PCP)
('e0000001-0000-4000-8000-000000000009','ENC-2021-0009','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee','AMB','Lab visit','finished','routine',
 '2021-08-15 08:30:00+00','2021-08-15 09:00:00+00','appointment','Interval labs during chemotherapy','Routine monitoring bloods',
 'Interval labs: CEA 3.2 (down from 8.5), mild chemo-related anemia and neutropenia; HbA1c monitored.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["FOLFOX (chemo)","Metformin 1000mg BID","Lisinopril 20mg QD","Ondansetron PRN"]','Stage III Colorectal Cancer (dx 2021), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 10. Surveillance imaging at 1 year (radiologist)
('e0000001-0000-4000-8000-000000000010','ENC-2022-0001','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'f97c5b31-aa24-5862-98cf-ee29d50db5d1','AMB','Surveillance Imaging','finished','routine',
 '2022-04-10 10:00:00+00','2022-04-10 10:45:00+00','appointment','1-year surveillance CT','Surveillance imaging',
 'Surveillance CT at 1 year: no evidence of recurrence; CEA 2.1.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["Metformin 1000mg BID","Lisinopril 20mg QD"]','Stage III Colorectal Cancer (dx 2021, in remission), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 11. Recent oncology follow-up + vitals (oncologist)
('e0000001-0000-4000-8000-000000000011','ENC-2025-0001','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'aebba554-5fff-5daf-966c-713ea9f34426','AMB','Follow-up','finished','routine',
 '2025-06-20 11:00:00+00','2025-06-20 11:40:00+00','appointment','Oncology surveillance follow-up','Routine follow-up',
 'Routine oncology follow-up: NED, CEA 2.0 stable, diabetes/HTN controlled; vitals within normal limits.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["Metformin 1000mg BID","Lisinopril 20mg QD"]','Stage III Colorectal Cancer (dx 2021, in remission), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 12. Planned future surveillance (radiologist) -- status planned
('e0000001-0000-4000-8000-000000000012','ENC-2026-0001','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'f97c5b31-aa24-5862-98cf-ee29d50db5d1','AMB','Surveillance Imaging','planned','routine',
 '2026-09-15 10:00:00+00',NULL,'appointment','Annual surveillance CT + CEA','Scheduled surveillance',
 'Planned annual surveillance CT and CEA (scheduled).',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["Metformin 1000mg BID","Lisinopril 20mg QD"]','Stage III Colorectal Cancer (dx 2021, in remission), Type 2 Diabetes, Hypertension',NOW(),NOW());

-- ---------------------------------------------------------------------------
-- (3) Clinical observations -- vitals (recent) + CEA trend + CBC/HbA1c.
-- ---------------------------------------------------------------------------
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id, code, code_system, display_name,
  category, value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, created_at, updated_at
) VALUES
-- Vitals @ recent follow-up (ENC-2025-0001)
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','8480-6','LOINC','Systolic blood pressure','vital-signs',128,'mmHg',90,120,'normal','2025-06-20 11:05:00+00','aebba554-5fff-5daf-966c-713ea9f34426','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','8462-4','LOINC','Diastolic blood pressure','vital-signs',78,'mmHg',60,80,'normal','2025-06-20 11:05:00+00','aebba554-5fff-5daf-966c-713ea9f34426','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','8867-4','LOINC','Heart rate','vital-signs',72,'/min',60,100,'normal','2025-06-20 11:05:00+00','aebba554-5fff-5daf-966c-713ea9f34426','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','8310-5','LOINC','Body temperature','vital-signs',36.8,'Cel',36.1,37.2,'normal','2025-06-20 11:05:00+00','aebba554-5fff-5daf-966c-713ea9f34426','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','59408-5','LOINC','Oxygen saturation (SpO2)','vital-signs',98,'%',95,100,'normal','2025-06-20 11:05:00+00','aebba554-5fff-5daf-966c-713ea9f34426','encounter',NOW(),NOW()),
-- CEA tumor-marker trend (LOINC 2039-6), ref 0-5 ng/mL
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000003','2039-6','LOINC','CEA (Carcinoembryonic antigen)','laboratory',8.5,'ng/mL',0,5,'high','2021-03-10 11:30:00+00','aebba554-5fff-5daf-966c-713ea9f34426','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000009','2039-6','LOINC','CEA (Carcinoembryonic antigen)','laboratory',3.2,'ng/mL',0,5,'normal','2021-08-15 08:45:00+00','aebba554-5fff-5daf-966c-713ea9f34426','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000010','2039-6','LOINC','CEA (Carcinoembryonic antigen)','laboratory',2.1,'ng/mL',0,5,'normal','2022-04-10 10:15:00+00','aebba554-5fff-5daf-966c-713ea9f34426','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','2039-6','LOINC','CEA (Carcinoembryonic antigen)','laboratory',2.0,'ng/mL',0,5,'normal','2025-06-20 11:10:00+00','aebba554-5fff-5daf-966c-713ea9f34426','encounter',NOW(),NOW()),
-- CBC during chemo (ENC-2021-0009): mild anemia + neutropenia
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000009','718-7','LOINC','Hemoglobin','laboratory',11.8,'g/dL',13.0,17.0,'low','2021-08-15 08:45:00+00','e64ff25b-9d46-5b0e-9bc3-6596a5850cee','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000009','6690-2','LOINC','Leukocytes (WBC count)','laboratory',3.2,'10*3/uL',4.0,11.0,'low','2021-08-15 08:45:00+00','e64ff25b-9d46-5b0e-9bc3-6596a5850cee','encounter',NOW(),NOW()),
-- HbA1c (diabetes) @ recent follow-up
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','4548-4','LOINC','Hemoglobin A1c','laboratory',7.1,'%',4.0,5.6,'high','2025-06-20 11:12:00+00','aebba554-5fff-5daf-966c-713ea9f34426','encounter',NOW(),NOW());

-- ---------------------------------------------------------------------------
-- (4) Oncology plugin (schema plugin_oncology).
-- ---------------------------------------------------------------------------
-- Cancer diagnosis
INSERT INTO plugin_oncology.cancer_diagnoses (
  id, tenant_id, patient_id, encounter_id, cancer_type, primary_site,
  primary_site_code, laterality, histology_morphology, morphology_code,
  icd_code, snomed_code, diagnosis_date, clinical_status, verification_status,
  grade, metastatic_status, is_recurrence, biomarkers, ecog_at_diagnosis,
  diagnosed_by, notes, created_at, updated_at
) VALUES (
  'd0000001-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000004',
  'Colorectal Cancer','Sigmoid colon','C18.7',NULL,'Adenocarcinoma','8140/3',
  'C18.9','363406005','2021-03-20','active','confirmed',
  'G2','regional',false,'{"KRAS":"wild-type","NRAS":"wild-type","BRAF":"wild-type","MSI":"MSS"}',1,
  'aebba554-5fff-5daf-966c-713ea9f34426','Moderately differentiated adenocarcinoma of the sigmoid colon, node positive.',NOW(),NOW()
);

-- Tumor staging: clinical (pre-op) and pathologic (post-op)
INSERT INTO plugin_oncology.tumor_staging (
  id, tenant_id, cancer_diagnosis_id, patient_id, encounter_id, provider_id,
  staging_system, staging_edition, staging_type, stage_group, t_category,
  n_category, m_category, body_site, grade, histology, staging_date, status,
  notes, created_at, updated_at
) VALUES
('a0000002-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','d0000001-0000-4000-8000-000000000001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000004','aebba554-5fff-5daf-966c-713ea9f34426',
 'AJCC','8th','clinical','III','cT3','cN1','cM0','Sigmoid colon','G2','Adenocarcinoma','2021-03-20','active','Clinical staging from CT + colonoscopy prior to resection.',NOW(),NOW()),
('a0000002-0000-4000-8000-000000000002','11111111-1111-1111-1111-111111111111','d0000001-0000-4000-8000-000000000001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000005','ac4287f1-9764-590c-b62a-1ea17f43aad8',
 'AJCC','8th','pathologic','IIIB','pT3','pN1','pM0','Sigmoid colon','G2','Adenocarcinoma','2021-04-09','active','Pathologic staging after sigmoid colectomy: 2 of 16 nodes positive.',NOW(),NOW());

-- Oncology care plan (curative-intent: surgery + adjuvant chemo)
INSERT INTO plugin_oncology.oncology_care_plans (
  id, tenant_id, patient_id, cancer_diagnosis_id, plan_number, version,
  treatment_intent, oncology_subspecialty, planned_modalities, planned_cycles,
  cycle_duration_days, milestones, follow_up_schedule, status, start_date,
  created_by, notes, created_at, updated_at
) VALUES (
  'a0000003-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','d0000001-0000-4000-8000-000000000001','CP-2021-0001',1,
  'curative','medical_oncology','["surgery","chemotherapy"]',12,
  14,'[{"label":"Sigmoid colectomy","date":"2021-04-05"},{"label":"Complete adjuvant FOLFOX","date":"2021-10-31"}]','{"plan":"CT + CEA every 6 months for 2 years, then annually"}','active','2021-04-05',
  'aebba554-5fff-5daf-966c-713ea9f34426','Adjuvant mFOLFOX6 x12 cycles following R0 resection.',NOW(),NOW()
);

-- Chemo orders -- FOLFOX (mFOLFOX6) cycles 1-3
INSERT INTO plugin_oncology.chemo_orders (
  id, tenant_id, patient_id, encounter_id, protocol_id, ordering_provider,
  cycle_number, day_number, scheduled_date, administered_at, bsa, weight, height,
  cancer_diagnosis_id, oncology_care_plan_id, dose_adjustments, pre_chemo_checklist,
  status, administered_by, adverse_reactions, administration_details,
  drug_preparation_details, nurse_verification_checklist, notes, created_at, updated_at
) VALUES
('a0000004-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000006','22bfa32f-ade5-4686-9817-025ca1ad9168','aebba554-5fff-5daf-966c-713ea9f34426',
 1,1,'2021-05-10','2021-05-10 09:30:00+00',1.92,78.0,175.0,
 'd0000001-0000-4000-8000-000000000001','a0000003-0000-4000-8000-000000000001','{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','aebba554-5fff-5daf-966c-713ea9f34426','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 1 of 12 completed without complication.',NOW(),NOW()),
('a0000004-0000-4000-8000-000000000002','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000007','22bfa32f-ade5-4686-9817-025ca1ad9168','aebba554-5fff-5daf-966c-713ea9f34426',
 2,1,'2021-05-24','2021-05-24 09:30:00+00',1.92,77.5,175.0,
 'd0000001-0000-4000-8000-000000000001','a0000003-0000-4000-8000-000000000001','{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','aebba554-5fff-5daf-966c-713ea9f34426','[{"term":"Peripheral neuropathy","grade":1}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 2 of 12; grade 1 neuropathy noted.',NOW(),NOW()),
('a0000004-0000-4000-8000-000000000003','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000008','22bfa32f-ade5-4686-9817-025ca1ad9168','aebba554-5fff-5daf-966c-713ea9f34426',
 3,1,'2021-06-07','2021-06-07 09:30:00+00',1.91,77.0,175.0,
 'd0000001-0000-4000-8000-000000000001','a0000003-0000-4000-8000-000000000001','{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','aebba554-5fff-5daf-966c-713ea9f34426','[{"term":"Neutropenia","grade":2}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 3 of 12; grade 2 neutropenia, dose maintained.',NOW(),NOW());

COMMIT;
