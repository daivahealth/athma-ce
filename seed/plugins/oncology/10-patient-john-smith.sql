-- =============================================================================
-- 10-patient-john-smith.sql
-- Full oncology journey: Stage IIIB colorectal cancer, curative surgery +
-- 12-cycle adjuvant FOLFOX, for Rajesh Iyer (MRN-2025-003).
-- Patient row itself lives in seed/clinical/01-patients.sql
-- (id 7bc65ec5-ef2f-5a36-b575-7978ce5e59c0, uuid_from_text('patient-john-smith')).
--
-- Seeds: encounters (14), encounter_notes, encounter_diagnoses, clinical_orders
--   + reports, clinical_observations, plugin_oncology.* (diagnosis, staging,
--   tumor board, care plan, all 12 real chemo_orders), a real OT
--   request/schedule/report for the colectomy, and cancer_timeline_events
--   derived from the rows actually inserted above.
--
-- Idempotent: re-runnable. All writes are scoped to this patient with stable
-- ids (uuid_from_text() or the fixed e0000001-... encounter ids from the
-- original seed), so a second run replaces the same rows.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Clean up any prior run for this patient (children before parents).
-- ---------------------------------------------------------------------------
DELETE FROM plugin_oncology.cancer_timeline_events WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM plugin_oncology.chemo_orders           WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM plugin_oncology.tumor_board_cases      WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM plugin_oncology.oncology_care_plans    WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM plugin_oncology.tumor_staging          WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM plugin_oncology.cancer_diagnoses       WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';

DELETE FROM ot_reports   WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM ot_schedules WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM ot_requests  WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';

DELETE FROM clinical_orders WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0'; -- cascades to reports + items

DELETE FROM clinical_observations
 WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0'
   AND encounter_id IN (
     'e0000001-0000-4000-8000-000000000001','e0000001-0000-4000-8000-000000000002',
     'e0000001-0000-4000-8000-000000000003','e0000001-0000-4000-8000-000000000004',
     'e0000001-0000-4000-8000-000000000005','e0000001-0000-4000-8000-000000000006',
     'e0000001-0000-4000-8000-000000000007','e0000001-0000-4000-8000-000000000008',
     'e0000001-0000-4000-8000-000000000009','e0000001-0000-4000-8000-000000000010',
     'e0000001-0000-4000-8000-000000000011','e0000001-0000-4000-8000-000000000012',
     uuid_from_text('encounter-john-smith-tumor-board'),
     uuid_from_text('encounter-john-smith-post-op-followup'));

DELETE FROM encounter_notes
 WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM encounter_diagnoses
 WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';

DELETE FROM encounters
 WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0'
   AND id IN (
     'e0000001-0000-4000-8000-000000000001','e0000001-0000-4000-8000-000000000002',
     'e0000001-0000-4000-8000-000000000003','e0000001-0000-4000-8000-000000000004',
     'e0000001-0000-4000-8000-000000000005','e0000001-0000-4000-8000-000000000006',
     'e0000001-0000-4000-8000-000000000007','e0000001-0000-4000-8000-000000000008',
     'e0000001-0000-4000-8000-000000000009','e0000001-0000-4000-8000-000000000010',
     'e0000001-0000-4000-8000-000000000011','e0000001-0000-4000-8000-000000000012',
     uuid_from_text('encounter-john-smith-tumor-board'),
     uuid_from_text('encounter-john-smith-post-op-followup'));

UPDATE patients SET updated_at = NOW() WHERE id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';

-- ---------------------------------------------------------------------------
-- (1) Encounters -- 14 total, chronological 2021 -> 2026.
--     Providers: PCP = Dr Ahmed Al-Mansoori, Surgeon = Dr Omar Al-Ketbi,
--     Radiologist = Dr Layla Al-Shamsi, Oncologist = Dr Fatima Al-Zaabi
--     (all deterministic staff:DOCTOR:* ids from foundation/14-staff.sql).
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
-- 2. Colonoscopy + biopsy (surgeon)
('e0000001-0000-4000-8000-000000000002','ENC-2021-0002','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e761d1dc-1d77-5499-bd12-b077276934a7','AMB','Colonoscopy & Biopsy','finished','routine',
 '2021-02-28 08:00:00+00','2021-02-28 09:15:00+00','appointment','Diagnostic colonoscopy','Sigmoid mass on colonoscopy',
 'Colonoscopy: 4 cm friable sigmoid mass; biopsy confirmed moderately differentiated adenocarcinoma.',
 NULL,NULL,NULL,NOW(),NOW()),
-- 3. Staging CT (radiologist)
('e0000001-0000-4000-8000-000000000003','ENC-2021-0003','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Imaging (Staging CT)','finished','routine',
 '2021-03-10 11:00:00+00','2021-03-10 11:45:00+00','appointment','Staging CT for biopsy-proven colon cancer','Staging workup',
 'Staging CT chest/abdomen/pelvis: sigmoid wall thickening with regional lymphadenopathy, no distant metastasis; CEA elevated at 8.5.',
 NULL,NULL,NULL,NOW(),NOW()),
-- 3b. Tumor board review (NEW -- oncologist)
(uuid_from_text('encounter-john-smith-tumor-board'),'ENC-2021-0003B','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Tumor Board Review','finished','routine',
 '2021-03-19 13:00:00+00','2021-03-19 14:00:00+00','internal','Multidisciplinary tumor board review','Newly staged sigmoid adenocarcinoma',
 'MDT review: cT3 N1 M0 sigmoid adenocarcinoma. Consensus: upfront resection followed by adjuvant FOLFOX x12, curative intent.',
 NULL,NULL,NULL,NOW(),NOW()),
-- 4. Oncology consultation -> Stage III diagnosis (oncologist)
('e0000001-0000-4000-8000-000000000004','ENC-2021-0004','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Oncology Consultation','finished','routine',
 '2021-03-20 14:00:00+00','2021-03-20 15:00:00+00','referral','Newly diagnosed colon cancer','Referred for oncology assessment',
 'Medical oncology consult: clinical Stage III (cT3 N1 M0) colorectal adenocarcinoma; plan surgery then adjuvant FOLFOX.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["Metformin 1000mg BID","Lisinopril 20mg QD"]','Stage III Colorectal Cancer (dx 2021), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 5. Surgery -- colectomy (surgeon, inpatient)
('e0000001-0000-4000-8000-000000000005','ENC-2021-0005','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e761d1dc-1d77-5499-bd12-b077276934a7','IMP','Surgery (Colectomy)','finished','urgent',
 '2021-04-05 07:30:00+00','2021-04-09 12:00:00+00','referral','Sigmoid colectomy for Stage III colon cancer','Scheduled resection',
 'Laparoscopic sigmoid colectomy; pathology pT3 N1 (2/16 nodes) M0, Stage IIIB, margins clear.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["Metformin 1000mg BID","Lisinopril 20mg QD"]','Stage III Colorectal Cancer (dx 2021), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 5b. Post-operative follow-up (NEW -- surgeon)
(uuid_from_text('encounter-john-smith-post-op-followup'),'ENC-2021-0005B','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e761d1dc-1d77-5499-bd12-b077276934a7','AMB','Post-operative Follow-up','finished','routine',
 '2021-04-20 10:00:00+00','2021-04-20 10:30:00+00','appointment','Post-operative wound check','Recovery review after colectomy',
 'Wound healing well, no signs of infection. Final pathology reviewed: pT3 N1 (2/16 nodes) M0, Stage IIIB, margins clear. Cleared to start adjuvant chemotherapy.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["Metformin 1000mg BID","Lisinopril 20mg QD"]','Stage III Colorectal Cancer (dx 2021), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 6. FOLFOX cycle 1 (oncologist)
('e0000001-0000-4000-8000-000000000006','ENC-2021-0006','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Chemotherapy','finished','routine',
 '2021-05-10 09:00:00+00','2021-05-10 13:00:00+00','appointment','Adjuvant chemotherapy cycle 1','Chemotherapy infusion',
 'Adjuvant mFOLFOX6 cycle 1 of 12 administered; tolerated well, antiemetic prophylaxis given.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["FOLFOX (chemo)","Metformin 1000mg BID","Lisinopril 20mg QD","Ondansetron PRN"]','Stage III Colorectal Cancer (dx 2021), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 7. FOLFOX cycle 2 (oncologist)
('e0000001-0000-4000-8000-000000000007','ENC-2021-0007','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Chemotherapy','finished','routine',
 '2021-05-24 09:00:00+00','2021-05-24 13:00:00+00','appointment','Adjuvant chemotherapy cycle 2','Chemotherapy infusion',
 'mFOLFOX6 cycle 2 administered; grade 1 peripheral neuropathy, counts adequate.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["FOLFOX (chemo)","Metformin 1000mg BID","Lisinopril 20mg QD","Ondansetron PRN"]','Stage III Colorectal Cancer (dx 2021), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 8. FOLFOX cycle 3 (oncologist)
('e0000001-0000-4000-8000-000000000008','ENC-2021-0008','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Chemotherapy','finished','routine',
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
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Surveillance Imaging','finished','routine',
 '2022-04-10 10:00:00+00','2022-04-10 10:45:00+00','appointment','1-year surveillance CT','Surveillance imaging',
 'Surveillance CT at 1 year: no evidence of recurrence; CEA 2.1.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["Metformin 1000mg BID","Lisinopril 20mg QD"]','Stage III Colorectal Cancer (dx 2021, in remission), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 11. Recent oncology follow-up + vitals (oncologist)
('e0000001-0000-4000-8000-000000000011','ENC-2025-0001','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Follow-up','finished','routine',
 '2025-06-20 11:00:00+00','2025-06-20 11:40:00+00','appointment','Oncology surveillance follow-up','Routine follow-up',
 'Routine oncology follow-up: NED, CEA 2.0 stable, diabetes/HTN controlled; vitals within normal limits.',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["Metformin 1000mg BID","Lisinopril 20mg QD"]','Stage III Colorectal Cancer (dx 2021, in remission), Type 2 Diabetes, Hypertension',NOW(),NOW()),
-- 12. Planned future surveillance (radiologist) -- status planned
('e0000001-0000-4000-8000-000000000012','ENC-2026-0001','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Surveillance Imaging','planned','routine',
 '2026-09-15 10:00:00+00',NULL,'appointment','Annual surveillance CT + CEA','Scheduled surveillance',
 'Planned annual surveillance CT and CEA (scheduled).',
 '["Penicillin","Sulfa drugs","Fall risk","Neutropenia risk"]','["Metformin 1000mg BID","Lisinopril 20mg QD"]','Stage III Colorectal Cancer (dx 2021, in remission), Type 2 Diabetes, Hypertension',NOW(),NOW());

-- ---------------------------------------------------------------------------
-- (2) Clinical observations -- vitals (recent) + CEA trend + CBC/HbA1c.
-- ---------------------------------------------------------------------------
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id, code, code_system, display_name,
  category, value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, created_at, updated_at
) VALUES
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','8480-6','LOINC','Systolic blood pressure','vital-signs',128,'mmHg',90,120,'normal','2025-06-20 11:05:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','8462-4','LOINC','Diastolic blood pressure','vital-signs',78,'mmHg',60,80,'normal','2025-06-20 11:05:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','8867-4','LOINC','Heart rate','vital-signs',72,'/min',60,100,'normal','2025-06-20 11:05:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','8310-5','LOINC','Body temperature','vital-signs',36.8,'Cel',36.1,37.2,'normal','2025-06-20 11:05:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','59408-5','LOINC','Oxygen saturation (SpO2)','vital-signs',98,'%',95,100,'normal','2025-06-20 11:05:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW()),
-- CEA tumor-marker trend (LOINC 2039-6), ref 0-5 ng/mL
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000003','2039-6','LOINC','CEA (Carcinoembryonic antigen)','laboratory',8.5,'ng/mL',0,5,'high','2021-03-10 11:30:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000009','2039-6','LOINC','CEA (Carcinoembryonic antigen)','laboratory',3.2,'ng/mL',0,5,'normal','2021-08-15 08:45:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000010','2039-6','LOINC','CEA (Carcinoembryonic antigen)','laboratory',2.1,'ng/mL',0,5,'normal','2022-04-10 10:15:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','2039-6','LOINC','CEA (Carcinoembryonic antigen)','laboratory',2.0,'ng/mL',0,5,'normal','2025-06-20 11:10:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW()),
-- CBC during chemo (ENC-2021-0009): mild anemia + neutropenia
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000009','718-7','LOINC','Hemoglobin','laboratory',11.8,'g/dL',13.0,17.0,'low','2021-08-15 08:45:00+00','e64ff25b-9d46-5b0e-9bc3-6596a5850cee','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000009','6690-2','LOINC','Leukocytes (WBC count)','laboratory',3.2,'10*3/uL',4.0,11.0,'low','2021-08-15 08:45:00+00','e64ff25b-9d46-5b0e-9bc3-6596a5850cee','encounter',NOW(),NOW()),
-- HbA1c (diabetes) @ recent follow-up
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000011','4548-4','LOINC','Hemoglobin A1c','laboratory',7.1,'%',4.0,5.6,'high','2025-06-20 11:12:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW());

-- ---------------------------------------------------------------------------
-- (3) Oncology plugin (schema plugin_oncology).
-- ---------------------------------------------------------------------------
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
  '6d2df89a-3f81-5338-b197-373d347031db','Moderately differentiated adenocarcinoma of the sigmoid colon, node positive.',NOW(),NOW()
);

INSERT INTO plugin_oncology.tumor_staging (
  id, tenant_id, cancer_diagnosis_id, patient_id, encounter_id, provider_id,
  staging_system, staging_edition, staging_type, stage_group, t_category,
  n_category, m_category, body_site, grade, histology, staging_date, status,
  notes, created_at, updated_at
) VALUES
('a0000002-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','d0000001-0000-4000-8000-000000000001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000004','6d2df89a-3f81-5338-b197-373d347031db',
 'AJCC','8th','clinical','III','cT3','cN1','cM0','Sigmoid colon','G2','Adenocarcinoma','2021-03-20','active','Clinical staging from CT + colonoscopy prior to resection.',NOW(),NOW()),
('a0000002-0000-4000-8000-000000000002','11111111-1111-1111-1111-111111111111','d0000001-0000-4000-8000-000000000001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0',uuid_from_text('encounter-john-smith-post-op-followup'),'e761d1dc-1d77-5499-bd12-b077276934a7',
 'AJCC','8th','pathologic','IIIB','pT3','pN1','pM0','Sigmoid colon','G2','Adenocarcinoma','2021-04-09','active','Pathologic staging after sigmoid colectomy: 2 of 16 nodes positive.',NOW(),NOW());

INSERT INTO plugin_oncology.tumor_board_cases (
  id, tenant_id, patient_id, cancer_diagnosis_id, staging_id, meeting_date,
  presented_by, attendees, clinical_summary, imaging_findings, pathology_report,
  molecular_profile, mdt_recommendation, treatment_intent, recommended_pathway,
  treatment_plan, decision, review_outcome, follow_up_actions, status,
  created_at, updated_at
) VALUES (
  uuid_from_text('tumor-board-john-smith'),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','d0000001-0000-4000-8000-000000000001','a0000002-0000-4000-8000-000000000001','2021-03-19',
  '6d2df89a-3f81-5338-b197-373d347031db',
  '[{"name":"Dr Fatima Al-Zaabi","role":"Medical Oncology"},{"name":"Dr Omar Al-Ketbi","role":"Colorectal Surgery"},{"name":"Dr Layla Al-Shamsi","role":"Radiology"}]',
  '57-year-old male with biopsy-proven moderately differentiated sigmoid adenocarcinoma, clinical cT3 N1 M0.',
  'Staging CT: sigmoid wall thickening with regional lymphadenopathy, no distant metastasis.',
  'Colonoscopic biopsy: adenocarcinoma, moderately differentiated (G2).',
  'KRAS wild-type, NRAS wild-type, BRAF wild-type, MSS.',
  'Upfront laparoscopic sigmoid colectomy, followed by adjuvant FOLFOX x12 given node-positive disease.',
  'curative',
  '["surgery","adjuvant_chemotherapy"]',
  '{"summary":"Sigmoid colectomy then adjuvant mFOLFOX6 x12, surveillance per NCCN"}',
  'Proceed to surgery, adjuvant chemo pending final pathology',
  'consensus',
  '["Schedule sigmoid colectomy","Refer to medical oncology for adjuvant planning pending final pathology"]',
  'completed', NOW(), NOW()
);

INSERT INTO plugin_oncology.oncology_care_plans (
  id, tenant_id, patient_id, cancer_diagnosis_id, tumor_board_case_id, plan_number, version,
  treatment_intent, oncology_subspecialty, planned_modalities, planned_cycles,
  cycle_duration_days, milestones, follow_up_schedule, status, start_date, end_date,
  created_by, approved_by, approved_at, notes, created_at, updated_at
) VALUES (
  'a0000003-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','d0000001-0000-4000-8000-000000000001',uuid_from_text('tumor-board-john-smith'),'CP-2021-0001',1,
  'curative','medical_oncology','["surgery","chemotherapy"]',12,
  14,'[{"label":"Sigmoid colectomy","date":"2021-04-05"},{"label":"Complete adjuvant FOLFOX","date":"2021-10-11"}]','{"plan":"CT + CEA every 6 months for 2 years, then annually"}','completed','2021-04-05','2021-10-11',
  '6d2df89a-3f81-5338-b197-373d347031db','6d2df89a-3f81-5338-b197-373d347031db','2021-03-28',
  'Adjuvant mFOLFOX6 x12 cycles following R0 resection.',NOW(),NOW()
);

-- Chemo orders -- FOLFOX (mFOLFOX6) cycles 1-3 (detailed, matches original demo)
INSERT INTO plugin_oncology.chemo_orders (
  id, tenant_id, patient_id, encounter_id, protocol_id, ordering_provider,
  cycle_number, day_number, scheduled_date, administered_at, bsa, weight, height,
  cancer_diagnosis_id, oncology_care_plan_id, dose_adjustments, pre_chemo_checklist,
  status, administered_by, adverse_reactions, administration_details,
  drug_preparation_details, nurse_verification_checklist, notes, created_at, updated_at
) VALUES
('a0000004-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000006',uuid_from_text('chemo-protocol-folfox'),'6d2df89a-3f81-5338-b197-373d347031db',
 1,1,'2021-05-10','2021-05-10 09:30:00+00',1.92,78.0,175.0,
 'd0000001-0000-4000-8000-000000000001','a0000003-0000-4000-8000-000000000001','{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 1 of 12 completed without complication.',NOW(),NOW()),
('a0000004-0000-4000-8000-000000000002','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000007',uuid_from_text('chemo-protocol-folfox'),'6d2df89a-3f81-5338-b197-373d347031db',
 2,1,'2021-05-24','2021-05-24 09:30:00+00',1.92,77.5,175.0,
 'd0000001-0000-4000-8000-000000000001','a0000003-0000-4000-8000-000000000001','{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[{"term":"Peripheral neuropathy","grade":1}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 2 of 12; grade 1 neuropathy noted.',NOW(),NOW()),
('a0000004-0000-4000-8000-000000000003','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000008',uuid_from_text('chemo-protocol-folfox'),'6d2df89a-3f81-5338-b197-373d347031db',
 3,1,'2021-06-07','2021-06-07 09:30:00+00',1.91,77.0,175.0,
 'd0000001-0000-4000-8000-000000000001','a0000003-0000-4000-8000-000000000001','{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[{"term":"Neutropenia","grade":2}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Cycle 3 of 12; grade 2 neutropenia, dose maintained.',NOW(),NOW());

-- Chemo orders -- FOLFOX cycles 4-12 (real rows, generated; not just timeline decoration)
INSERT INTO plugin_oncology.chemo_orders (
  id, tenant_id, patient_id, encounter_id, protocol_id, ordering_provider,
  cycle_number, day_number, scheduled_date, administered_at, bsa, weight, height,
  cancer_diagnosis_id, oncology_care_plan_id, dose_adjustments, pre_chemo_checklist,
  status, administered_by, adverse_reactions, administration_details,
  drug_preparation_details, nurse_verification_checklist, notes, created_at, updated_at
)
SELECT
  uuid_from_text('chemo-order-john-smith-cycle-' || n),
  '11111111-1111-1111-1111-111111111111',
  '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0',
  NULL,
  uuid_from_text('chemo-protocol-folfox'),
  '6d2df89a-3f81-5338-b197-373d347031db',
  n, 1,
  (DATE '2021-06-07' + ((n - 3) * 14)),
  ((DATE '2021-06-07' + ((n - 3) * 14))::timestamp + TIME '09:30')::timestamptz,
  1.90, 76.5, 175.0,
  'd0000001-0000-4000-8000-000000000001', 'a0000003-0000-4000-8000-000000000001',
  '{}'::jsonb, '{"consentSigned":true,"labsReviewed":true}'::jsonb,
  'completed', '6d2df89a-3f81-5338-b197-373d347031db', '[]'::jsonb,
  '{"route":"IV","infusionCenter":"Day Oncology Unit"}'::jsonb,
  '{}'::jsonb, '{}'::jsonb,
  'Cycle ' || n || ' of 12 completed without complication.',
  NOW(), NOW()
FROM generate_series(4, 12) AS n;

-- ---------------------------------------------------------------------------
-- (4) Real OT request/schedule/report for the sigmoid colectomy.
-- ---------------------------------------------------------------------------
INSERT INTO ot_requests (
  id, tenant_id, patient_id, encounter_id, requested_by, requested_at,
  surgery_type, procedure_code, procedure_name, diagnosis, priority,
  expected_duration_minutes, preferred_date, preferred_ot_room_space_id,
  primary_surgeon_id, anaesthetist_required, anaesthesia_type_planned,
  special_equipment_required, blood_required, implants_required, remarks,
  status, active_schedule_id, approved_by, approved_at, completed_by, completed_at,
  created_at, updated_at, created_by, updated_by
) VALUES (
  uuid_from_text('ot-request-john-smith'),'11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000005',
  'e761d1dc-1d77-5499-bd12-b077276934a7','2021-03-25 09:00:00+00',
  'Major','44207','Laparoscopic Sigmoid Colectomy','Stage III sigmoid colon adenocarcinoma (cT3 N1 M0)','ELECTIVE',
  185,'2021-04-05','09f2300a-5f6a-5d24-a1ae-f14367ef932e',
  'e761d1dc-1d77-5499-bd12-b077276934a7',true,'General',
  '["Laparoscopic tower","Energy device"]'::jsonb,false,'[]'::jsonb,'Elective resection for Stage III colon cancer.',
  'COMPLETED',uuid_from_text('ot-schedule-john-smith'),'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','2021-03-26 10:00:00+00','e761d1dc-1d77-5499-bd12-b077276934a7','2021-04-09 12:00:00+00',
  NOW(),NOW(),'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

INSERT INTO ot_schedules (
  id, tenant_id, ot_request_id, patient_id, encounter_id, ot_room_space_id,
  scheduled_start_time, scheduled_end_time, actual_start_time, actual_end_time,
  primary_surgeon_id, assistant_surgeon_ids, anaesthesia_type, schedule_status,
  is_current, created_at, updated_at, created_by, updated_by
) VALUES (
  uuid_from_text('ot-schedule-john-smith'),'11111111-1111-1111-1111-111111111111',uuid_from_text('ot-request-john-smith'),'7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000005','09f2300a-5f6a-5d24-a1ae-f14367ef932e',
  '2021-04-05 07:30:00+00','2021-04-05 10:35:00+00','2021-04-05 07:35:00+00','2021-04-05 10:40:00+00',
  'e761d1dc-1d77-5499-bd12-b077276934a7','{}','General','SURGERY_COMPLETED',
  true,NOW(),NOW(),'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

INSERT INTO ot_reports (
  id, tenant_id, schedule_id, ot_request_id, patient_id, encounter_id,
  report_number, report_status, signed_by, signed_at, remarks,
  created_at, updated_at, created_by, updated_by
) VALUES (
  uuid_from_text('ot-report-john-smith'),'11111111-1111-1111-1111-111111111111',uuid_from_text('ot-schedule-john-smith'),uuid_from_text('ot-request-john-smith'),'7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000005',
  'OTR-2021-0001','SIGNED','e761d1dc-1d77-5499-bd12-b077276934a7','2021-04-09 12:30:00+00',
  'Laparoscopic sigmoid colectomy, R0 resection. Pathology pT3 N1 (2/16 nodes) M0, Stage IIIB, margins clear.',
  NOW(),NOW(),'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

-- ---------------------------------------------------------------------------
-- (5) Encounter notes + diagnoses (smart-charting) for every encounter.
-- ---------------------------------------------------------------------------
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
  v_patient UUID := '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
  v_author  UUID := 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee';
  r RECORD;
BEGIN
  CREATE TEMP TABLE _charts (
    enc UUID, chief TEXT, hist TEXT, notes TEXT, icd TEXT, dx TEXT, dxtype TEXT
  ) ON COMMIT DROP;

  INSERT INTO _charts VALUES
  ('e0000001-0000-4000-8000-000000000001',
   '6 weeks of intermittent rectal bleeding with a change in bowel habit.',
   '47-year-old male. No prior colorectal screening. No known family history of GI malignancy. Not on anticoagulants.',
   'PR exam: trace blood, no external hemorrhoids. FOBT positive. Referred for colonoscopy. Safety-netted for weight loss and obstructive symptoms.',
   'K62.5', 'Hemorrhage of anus and rectum', 'primary'),

  ('e0000001-0000-4000-8000-000000000002',
   'Diagnostic colonoscopy for rectal bleeding and positive FOBT.',
   '6-week history of rectal bleeding; referred from primary care.',
   'Colonoscopy: 4 cm friable sigmoid mass at 25 cm, near-circumferential. Biopsies taken. Histology: moderately differentiated adenocarcinoma. Staging workup arranged.',
   'C18.7', 'Malignant neoplasm of sigmoid colon', 'primary'),

  ('e0000001-0000-4000-8000-000000000003',
   'Staging CT chest, abdomen and pelvis for biopsy-proven colorectal cancer.',
   'Sigmoid adenocarcinoma confirmed on colonoscopy in Feb 2021.',
   'CT: sigmoid wall thickening with regional lymphadenopathy; no distant metastasis. CEA 8.5. Clinical stage cT3 N1 M0 (Stage III).',
   'C18.7', 'Malignant neoplasm of sigmoid colon', 'primary'),

  (uuid_from_text('encounter-john-smith-tumor-board'),
   'Multidisciplinary tumor board review of newly staged sigmoid adenocarcinoma.',
   'cT3 N1 M0 confirmed on staging CT and colonoscopy.',
   'MDT consensus: upfront laparoscopic sigmoid colectomy, followed by adjuvant FOLFOX x12 given node-positive disease. Curative intent.',
   'C18.7', 'Malignant neoplasm of sigmoid colon', 'primary'),

  ('e0000001-0000-4000-8000-000000000004',
   'New diagnosis of Stage III sigmoid colorectal adenocarcinoma.',
   'cT3 N1 M0 on staging. ECOG 0. No significant comorbidities beyond diabetes/hypertension.',
   'Medical oncology consult. Plan: upfront sigmoid colectomy, then adjuvant FOLFOX x12 per tumor board. Discussed prognosis, treatment intent (curative) and risks.',
   'C18.7', 'Malignant neoplasm of sigmoid colon', 'primary'),

  ('e0000001-0000-4000-8000-000000000005',
   'Elective laparoscopic sigmoid colectomy for Stage III colon cancer.',
   'cT3 N1 M0 sigmoid adenocarcinoma. Pre-operative assessment cleared.',
   'Laparoscopic sigmoid colectomy, R0 resection. Pathology: pT3 N1 (2 of 16 nodes) M0, margins clear, Stage IIIB. Uncomplicated recovery.',
   'C18.7', 'Malignant neoplasm of sigmoid colon', 'primary'),

  (uuid_from_text('encounter-john-smith-post-op-followup'),
   'Post-operative wound check after laparoscopic sigmoid colectomy.',
   'Day 11 post-op, uncomplicated laparoscopic resection.',
   'Wound healing well, no signs of infection. Final pathology reviewed: pT3 N1 (2/16 nodes) M0, Stage IIIB, margins clear. Cleared to start adjuvant chemotherapy.',
   'C18.7', 'Malignant neoplasm of sigmoid colon', 'primary'),

  ('e0000001-0000-4000-8000-000000000006',
   'Adjuvant chemotherapy cycle 1 of 12 (mFOLFOX6).',
   'pT3 N1 M0 Stage IIIB, status post sigmoid colectomy. ECOG 0.',
   'Adjuvant mFOLFOX6 cycle 1 administered; tolerated well with antiemetic prophylaxis. BSA 1.92. Next cycle in 2 weeks.',
   'Z51.11', 'Encounter for antineoplastic chemotherapy', 'primary'),

  ('e0000001-0000-4000-8000-000000000007',
   'Adjuvant chemotherapy cycle 2 (mFOLFOX6).',
   'Cycle 1 tolerated well.',
   'mFOLFOX6 cycle 2 administered; grade 1 peripheral neuropathy, counts adequate. Continue full dose.',
   'Z51.11', 'Encounter for antineoplastic chemotherapy', 'primary'),

  ('e0000001-0000-4000-8000-000000000008',
   'Adjuvant chemotherapy cycle 3 (mFOLFOX6).',
   'Grade 1 peripheral neuropathy after cycle 2.',
   'mFOLFOX6 cycle 3 administered; mild neutropenia, oxaliplatin dose maintained. Advised infection precautions.',
   'Z51.11', 'Encounter for antineoplastic chemotherapy', 'primary'),

  ('e0000001-0000-4000-8000-000000000009',
   'Interval blood work during adjuvant chemotherapy.',
   'On adjuvant FOLFOX for Stage IIIB colon cancer.',
   'Interval labs: CEA 3.2 (down from 8.5), mild chemotherapy-related anemia and neutropenia; HbA1c monitored. Supportive care advised.',
   'Z51.11', 'Encounter for antineoplastic chemotherapy', 'primary'),

  ('e0000001-0000-4000-8000-000000000010',
   '1-year surveillance imaging after completion of adjuvant therapy.',
   'Completed 12 cycles of FOLFOX in Oct 2021; no evidence of disease.',
   'Surveillance CT at 1 year: no evidence of recurrence; CEA 2.1. Continue surveillance protocol.',
   'Z08', 'Encounter for follow-up examination after treatment for malignant neoplasm', 'primary'),

  ('e0000001-0000-4000-8000-000000000011',
   'Routine oncology surveillance follow-up.',
   'Stage IIIB colorectal cancer treated in 2021, no evidence of disease. Type 2 diabetes and hypertension.',
   'Routine oncology follow-up: NED, CEA 2.0 stable, diabetes and hypertension controlled; vitals within normal limits. Next surveillance in 12 months.',
   'Z08', 'Encounter for follow-up examination after treatment for malignant neoplasm', 'primary'),

  ('e0000001-0000-4000-8000-000000000012',
   'Annual surveillance CT and CEA.',
   'No evidence of disease since 2021 treatment.',
   'Planned annual surveillance CT and CEA. Continue survivorship care.',
   'Z08', 'Encounter for follow-up examination after treatment for malignant neoplasm', 'primary');

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

-- ---------------------------------------------------------------------------
-- (6) Encounter documents (orders + reports).
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_tenant  UUID := '11111111-1111-1111-1111-111111111111';
  v_patient UUID := '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
  v_by      UUID := 'e761d1dc-1d77-5499-bd12-b077276934a7';
  v_rad     UUID := '23ef067c-d352-5415-945b-9b802d20bc3c';
  v_pcp     UUID := 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee';
  e2 UUID := 'e0000001-0000-4000-8000-000000000002';
  e3 UUID := 'e0000001-0000-4000-8000-000000000003';
  e5 UUID := 'e0000001-0000-4000-8000-000000000005';
  e9 UUID := 'e0000001-0000-4000-8000-000000000009';
  e10 UUID := 'e0000001-0000-4000-8000-000000000010';
  e11 UUID := 'e0000001-0000-4000-8000-000000000011';
BEGIN
  -- ── ENC-2021-0002: Colonoscopy (procedure) ──────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000002', v_tenant, e2, v_patient, 'procedure', '45380', 'CPT', 'Colonoscopy with biopsy', 'routine', 'completed', v_by, TIMESTAMPTZ '2021-02-28 08:30+00', NOW(), NOW());
  INSERT INTO procedure_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, indication, procedure_description, findings, complications, primary_performer, reported_by, reported_at, created_at, updated_at)
  VALUES ('4d000001-0000-4000-8000-000000000002', v_tenant, '0d000001-0000-4000-8000-000000000002', e2, v_patient, 'FINAL', 1,
    'Rectal bleeding and positive FOBT', 'Colonoscopy to caecum; 4 cm friable sigmoid mass at 25 cm biopsied.',
    'Near-circumferential sigmoid mass; biopsies taken. Remainder of colon normal.', 'None', v_by, v_by, TIMESTAMPTZ '2021-02-28 10:00+00', NOW(), NOW());

  -- ── ENC-2021-0003: Staging CT (imaging) ─────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000003', v_tenant, e3, v_patient, 'imaging', '74178', 'CPT', 'CT Chest/Abdomen/Pelvis with contrast', 'routine', 'completed', v_rad, TIMESTAMPTZ '2021-03-09 09:00+00', NOW(), NOW());
  INSERT INTO imaging_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, modality, body_part, technique, findings, impression, critical_finding, reported_by, reported_at, created_at, updated_at)
  VALUES ('49000001-0000-4000-8000-000000000003', v_tenant, '0d000001-0000-4000-8000-000000000003', e3, v_patient, 'FINAL', 1,
    'CT', 'Chest / Abdomen / Pelvis', 'Contrast-enhanced multidetector CT',
    'Sigmoid wall thickening with regional lymphadenopathy. No hepatic or pulmonary metastases.',
    'Sigmoid colon malignancy with regional nodal involvement; no distant metastasis (cT3 N1 M0).', false, v_rad, TIMESTAMPTZ '2021-03-10 12:00+00', NOW(), NOW());

  -- ── ENC-2021-0005: Sigmoid colectomy (procedure) ────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000005', v_tenant, e5, v_patient, 'procedure', '44207', 'CPT', 'Laparoscopic sigmoid colectomy', 'routine', 'completed', v_by, TIMESTAMPTZ '2021-04-10 08:00+00', NOW(), NOW());
  INSERT INTO procedure_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, indication, procedure_description, findings, complications, duration_minutes, primary_performer, reported_by, reported_at, created_at, updated_at)
  VALUES ('4d000001-0000-4000-8000-000000000005', v_tenant, '0d000001-0000-4000-8000-000000000005', e5, v_patient, 'FINAL', 1,
    'Stage III sigmoid adenocarcinoma', 'Laparoscopic sigmoid colectomy with primary anastomosis; R0 resection.',
    'Pathology pT3 N1 (2/16 nodes) M0, margins clear, Stage IIIB.', 'None', 185, v_by, v_by, TIMESTAMPTZ '2021-04-11 09:00+00', NOW(), NOW());

  -- ── ENC-2021-0009: Interval labs (lab) ──────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000009', v_tenant, e9, v_patient, 'lab', 'CBC-CEA', 'LOINC', 'CBC + CEA panel', 'routine', 'completed', v_pcp, TIMESTAMPTZ '2021-08-15 08:00+00', NOW(), NOW());
  INSERT INTO lab_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, specimen_type, reported_by, reported_at, created_at, updated_at)
  VALUES ('1a000001-0000-4000-8000-000000000009', v_tenant, '0d000001-0000-4000-8000-000000000009', e9, v_patient, 'FINAL', 1, 'Whole blood / serum', v_pcp, TIMESTAMPTZ '2021-08-15 14:00+00', NOW(), NOW());
  INSERT INTO lab_result_items (id, tenant_id, lab_report_id, sort_order, test_code, code_system, test_name, value_numeric, unit, ref_range_low, ref_range_high, abnormal_flag, critical_flag, created_at, updated_at) VALUES
    (gen_random_uuid(), v_tenant, '1a000001-0000-4000-8000-000000000009', 1, '83085-1', 'LOINC', 'CEA',           3.2, 'ng/mL', 0,   5,    false, false, NOW(), NOW()),
    (gen_random_uuid(), v_tenant, '1a000001-0000-4000-8000-000000000009', 2, '718-7',  'LOINC', 'Haemoglobin',  10.4, 'g/dL',  13,  17,   true,  false, NOW(), NOW()),
    (gen_random_uuid(), v_tenant, '1a000001-0000-4000-8000-000000000009', 3, '751-8',  'LOINC', 'Neutrophils',   1.3, 'x10^9/L', 2, 7,  true,  false, NOW(), NOW());

  -- ── ENC-2022-0001: 1-year surveillance CT (imaging) ─────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000010', v_tenant, e10, v_patient, 'imaging', '74178', 'CPT', 'CT Chest/Abdomen/Pelvis (surveillance)', 'routine', 'completed', v_rad, TIMESTAMPTZ '2022-04-09 09:00+00', NOW(), NOW());
  INSERT INTO imaging_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, modality, body_part, technique, findings, impression, critical_finding, reported_by, reported_at, created_at, updated_at)
  VALUES ('49000001-0000-4000-8000-000000000010', v_tenant, '0d000001-0000-4000-8000-000000000010', e10, v_patient, 'FINAL', 1,
    'CT', 'Chest / Abdomen / Pelvis', 'Contrast-enhanced surveillance CT',
    'Post-surgical changes in the sigmoid colon. No local recurrence, lymphadenopathy or metastasis.',
    'No evidence of recurrent or metastatic disease at 1 year.', false, v_rad, TIMESTAMPTZ '2022-04-10 11:00+00', NOW(), NOW());

  -- ── ENC-2025-0001: Follow-up CEA (lab) ──────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000011', v_tenant, e11, v_patient, 'lab', 'CEA', 'LOINC', 'CEA (surveillance)', 'routine', 'completed', v_pcp, TIMESTAMPTZ '2025-06-20 08:00+00', NOW(), NOW());
  INSERT INTO lab_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, specimen_type, reported_by, reported_at, created_at, updated_at)
  VALUES ('1a000001-0000-4000-8000-000000000011', v_tenant, '0d000001-0000-4000-8000-000000000011', e11, v_patient, 'FINAL', 1, 'Serum', v_pcp, TIMESTAMPTZ '2025-06-20 13:00+00', NOW(), NOW());
  INSERT INTO lab_result_items (id, tenant_id, lab_report_id, sort_order, test_code, code_system, test_name, value_numeric, unit, ref_range_low, ref_range_high, abnormal_flag, critical_flag, created_at, updated_at) VALUES
    (gen_random_uuid(), v_tenant, '1a000001-0000-4000-8000-000000000011', 1, '83085-1', 'LOINC', 'CEA', 2.0, 'ng/mL', 0, 5, false, false, NOW(), NOW());
END $$;

-- ---------------------------------------------------------------------------
-- (7) Cancer timeline events -- derived from the real rows above.
-- ---------------------------------------------------------------------------
INSERT INTO plugin_oncology.cancer_timeline_events
  (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by, created_at)
VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'd0000001-0000-4000-8000-000000000001', 'diagnosis', TIMESTAMPTZ '2021-02-28 09:00+00',
   'Colorectal adenocarcinoma diagnosed',
   'Sigmoid colon adenocarcinoma, moderately differentiated (G2), ICD-O C18.9. Confirmed on colonoscopic biopsy.',
   'cancer_diagnosis', 'd0000001-0000-4000-8000-000000000001',
   jsonb_build_object('cancerType','Colorectal','primarySite','Sigmoid colon','clinicalStatus','active','metastaticStatus','M0'),
   'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),

  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'd0000001-0000-4000-8000-000000000001', 'staging', TIMESTAMPTZ '2021-03-10 10:00+00',
   'Clinical staging — cT3 N1 M0 (Stage III)',
   'AJCC 8th ed. clinical stage III based on staging CT chest/abdomen/pelvis.',
   'tumor_staging', 'a0000002-0000-4000-8000-000000000001',
   jsonb_build_object('stagingSystem','AJCC8','stageGroup','III','tCategory','cT3','nCategory','N1','mCategory','M0'),
   'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),

  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'd0000001-0000-4000-8000-000000000001', 'tumor_board', TIMESTAMPTZ '2021-03-19 14:00+00',
   'Tumor board — curative intent',
   'MDT recommendation: upfront sigmoid colectomy followed by adjuvant FOLFOX x12.',
   'tumor_board_case', uuid_from_text('tumor-board-john-smith'),
   jsonb_build_object('treatmentIntent','curative'),
   'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),

  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'd0000001-0000-4000-8000-000000000001', 'care_plan_created', TIMESTAMPTZ '2021-03-25 09:00+00',
   'Care plan CP-2021-0001 created',
   'Curative-intent plan: sigmoid colectomy plus adjuvant chemotherapy.',
   'oncology_care_plan', 'a0000003-0000-4000-8000-000000000001',
   jsonb_build_object('planNumber','CP-2021-0001','treatmentIntent','curative'),
   'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),

  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'd0000001-0000-4000-8000-000000000001', 'care_plan_approved', TIMESTAMPTZ '2021-03-28 09:00+00',
   'Care plan approved',
   'Approved by surgical and medical oncology.',
   'oncology_care_plan', 'a0000003-0000-4000-8000-000000000001',
   jsonb_build_object('planNumber','CP-2021-0001'),
   'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),

  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'd0000001-0000-4000-8000-000000000001', 'custom', TIMESTAMPTZ '2021-04-09 12:30+00',
   'Laparoscopic sigmoid colectomy — OT report signed',
   'R0 resection. Pathology pT3 N1 (2/16 nodes) M0, margins clear.',
   'manual', uuid_from_text('ot-report-john-smith'),
   jsonb_build_object('category','surgery'),
   'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),

  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'd0000001-0000-4000-8000-000000000001', 'staging', TIMESTAMPTZ '2021-04-20 11:00+00',
   'Pathologic staging — pT3 N1 M0 (Stage IIIB)',
   'Post-operative AJCC 8th ed. pathologic stage IIIB.',
   'tumor_staging', 'a0000002-0000-4000-8000-000000000002',
   jsonb_build_object('stagingSystem','AJCC8','stageGroup','IIIB','tCategory','pT3','nCategory','N1','mCategory','M0'),
   'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),

  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'd0000001-0000-4000-8000-000000000001', 'response_assessment', TIMESTAMPTZ '2021-11-01 10:00+00',
   'Adjuvant therapy complete — NED',
   'Completed 12 cycles of FOLFOX. Post-treatment imaging shows no evidence of disease; CEA normalised.',
   'manual', NULL, jsonb_build_object('category','response'), 'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),

  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'd0000001-0000-4000-8000-000000000001', 'follow_up', TIMESTAMPTZ '2022-04-10 09:30+00',
   '1-year surveillance — NED', 'Surveillance CT: no recurrence. CEA 2.1.', 'manual', NULL, '{}'::jsonb, 'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),

  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'd0000001-0000-4000-8000-000000000001', 'follow_up', TIMESTAMPTZ '2025-06-20 10:00+00',
   'Routine oncology follow-up — NED', 'CEA 2.0 stable; diabetes/HTN controlled; vitals within normal limits.', 'manual', NULL, '{}'::jsonb, 'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),

  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'd0000001-0000-4000-8000-000000000001', 'follow_up', TIMESTAMPTZ '2026-09-15 15:30+00',
   'Surveillance imaging scheduled', 'Annual surveillance CT + CEA planned.', 'manual', NULL, '{}'::jsonb, 'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW());

-- Chemo cycle events -- derived from the real chemo_orders rows just inserted.
INSERT INTO plugin_oncology.cancer_timeline_events
  (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by, created_at)
SELECT
  gen_random_uuid(), co.tenant_id, co.patient_id, co.cancer_diagnosis_id, 'chemo_completed',
  co.administered_at,
  'FOLFOX cycle ' || co.cycle_number || '/12 completed',
  co.notes,
  'chemo_order', co.id,
  jsonb_build_object('protocol','FOLFOX','cycleNumber',co.cycle_number,'dayNumber',co.day_number,'bsa',co.bsa,'protocolTotalCycles',12),
  CASE WHEN co.adverse_reactions::text != '[]' THEN 'warning' ELSE 'info' END,
  co.ordering_provider, NOW()
FROM plugin_oncology.chemo_orders co
WHERE co.patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0'
ORDER BY co.cycle_number;

COMMIT;
