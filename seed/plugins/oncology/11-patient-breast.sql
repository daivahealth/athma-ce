-- =============================================================================
-- 11-patient-breast.sql
-- Full oncology journey: Stage IIA right breast cancer (ER+/PR+/HER2-),
-- curative breast-conserving surgery + AC-T chemotherapy + adjuvant whole-breast
-- radiation, for Priya Sharma (new patient, MRN-2025-004).
--
-- Seeds: patient record, 15 encounters, encounter_notes/diagnoses, clinical
--   orders + reports, clinical_observations (CA 15-3 trend), plugin_oncology.*
--   (diagnosis, staging, tumor board, care plan, all 8 real chemo_orders),
--   a real OT request/schedule/report for the lumpectomy, the full radiation
--   pipeline (prescription -> simulation -> plan -> 15 fractions -> 2
--   on-treatment reviews -> completion summary), and cancer_timeline_events
--   derived from the rows above.
--
-- Idempotent: re-runnable, all writes scoped to this patient with stable
-- uuid_from_text() ids.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Clean up any prior run for this patient.
-- ---------------------------------------------------------------------------
DELETE FROM plugin_oncology.cancer_timeline_events        WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM plugin_oncology.radiation_completion_summaries WHERE prescription_id = uuid_from_text('radiation-prescription-mariam');
DELETE FROM plugin_oncology.radiation_on_treatment_reviews WHERE prescription_id = uuid_from_text('radiation-prescription-mariam');
DELETE FROM plugin_oncology.radiation_fractions            WHERE treatment_plan_id = uuid_from_text('radiation-treatment-plan-mariam');
DELETE FROM plugin_oncology.radiation_treatment_plans      WHERE prescription_id = uuid_from_text('radiation-prescription-mariam');
DELETE FROM plugin_oncology.radiation_simulations          WHERE prescription_id = uuid_from_text('radiation-prescription-mariam');
DELETE FROM plugin_oncology.radiation_prescriptions        WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM plugin_oncology.chemo_orders                   WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM plugin_oncology.tumor_board_cases              WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM plugin_oncology.oncology_care_plans            WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM plugin_oncology.tumor_staging                  WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM plugin_oncology.cancer_diagnoses                WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');

DELETE FROM ot_reports   WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM ot_schedules WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM ot_requests  WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');

DELETE FROM clinical_orders       WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi'); -- cascades
DELETE FROM clinical_observations WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM encounter_notes       WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM encounter_diagnoses   WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM encounters            WHERE patient_id = uuid_from_text('patient-mariam-al-nuaimi');
DELETE FROM patients              WHERE id = uuid_from_text('patient-mariam-al-nuaimi');

-- ---------------------------------------------------------------------------
-- (0) Patient record.
-- ---------------------------------------------------------------------------
INSERT INTO patients (
  id, mrn, tenant_id, national_id, national_id_type, issuing_country,
  first_name, last_name, middle_name, date_of_birth, gender, marital_status,
  nationality, preferred_language, phone_number, email, address_line1,
  address_line2, city, postal_code, country, emergency_contact, insurance_info,
  created_by, created_at_facility, registration_source, registration_notes,
  status, created_at, updated_at, updated_by, updated_at_facility
) VALUES (
  uuid_from_text('patient-mariam-al-nuaimi'), 'MRN-2025-004', '11111111-1111-1111-1111-111111111111'::UUID,
  '345678901234', 'national_id', 'IN',
  'Priya', 'Sharma', NULL, DATE '1971-05-12', 'female', 'married',
  'India', 'en', '+919845123456', 'priya.sharma@example.in', 'Malabar Hill',
  NULL, 'Mumbai', '400006', 'IN',
  '{"name":"Anil Sharma","relation":"spouse","phone":"+919845123467"}'::jsonb,
  '{"payer":"Star Health Insurance","memberId":"STAR445566"}'::jsonb,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::UUID,
  'manual', 'Initial registration via breast clinic front desk',
  'active', NOW(), NOW(), NULL, NULL
);

-- ---------------------------------------------------------------------------
-- (1) Encounters -- 15 total, chronological 2023 -> 2024.
--     Providers: PCP = Dr Ahmed Al-Mansoori, Surgeon = Dr Omar Al-Ketbi,
--     Medical oncologist = Dr Fatima Al-Zaabi, Radiation oncologist = Dr Layla Al-Shamsi.
-- ---------------------------------------------------------------------------
INSERT INTO encounters (
  id, encounter_number, tenant_id, patient_id, facility_id, facility_name,
  primary_staff_id, encounter_class, encounter_type, status, priority,
  start_time, end_time, encounter_source, chief_complaint, presenting_symptoms,
  notes, allergies, current_medications, medical_history, created_at, updated_at
) VALUES
(uuid_from_text('encounter-mariam-01'),'ENC-2023-0101','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee','AMB','Breast Clinic Presentation','finished','routine',
 '2023-01-05 09:00:00+00','2023-01-05 09:30:00+00','appointment','Palpable right breast lump','New palpable mass, upper outer quadrant right breast, noticed 3 weeks ago',
 'Self-detected 2 cm firm, non-tender mass in the right breast upper outer quadrant. No nipple discharge or skin changes. Referred to breast imaging.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-mariam-02'),'ENC-2023-0102','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Diagnostic Mammogram & Ultrasound','finished','routine',
 '2023-01-12 10:00:00+00','2023-01-12 10:45:00+00','referral','Diagnostic breast imaging','Palpable right breast mass',
 'Mammogram + targeted ultrasound: 2.1 cm irregular spiculated mass, right breast upper outer quadrant, BI-RADS 5. No suspicious axillary nodes on ultrasound.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-mariam-03'),'ENC-2023-0103','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e761d1dc-1d77-5499-bd12-b077276934a7','AMB','Core Needle Biopsy','finished','routine',
 '2023-01-20 08:30:00+00','2023-01-20 09:15:00+00','appointment','Image-guided core needle biopsy','BI-RADS 5 right breast mass',
 'Ultrasound-guided core needle biopsy of right breast mass: invasive ductal carcinoma, grade 2. ER positive, PR positive, HER2 negative, Ki-67 18%.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-mariam-04'),'ENC-2023-0104','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Breast MRI (Staging)','finished','routine',
 '2023-01-28 11:00:00+00','2023-01-28 11:45:00+00','appointment','Pre-operative staging breast MRI','Biopsy-confirmed invasive ductal carcinoma',
 'Breast MRI: 2.3 cm enhancing mass right upper outer quadrant, no additional foci, no contralateral disease. Clinical stage cT2 N0 M0.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-mariam-05'),'ENC-2023-0105','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Tumor Board Review','finished','routine',
 '2023-02-05 13:00:00+00','2023-02-05 14:00:00+00','internal','Multidisciplinary breast tumor board review','Newly staged cT2 N0 M0 right breast cancer',
 'MDT review: ER+/PR+/HER2- invasive ductal carcinoma, cT2 N0 M0. Consensus: breast-conserving surgery with sentinel node biopsy, adjuvant AC-T chemotherapy given tumor size/grade, then whole-breast radiation.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-mariam-06'),'ENC-2023-0106','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Oncology Consultation','finished','routine',
 '2023-02-10 09:00:00+00','2023-02-10 10:00:00+00','referral','Newly diagnosed breast cancer','Referred for oncology assessment',
 'Medical oncology consult: clinical Stage IIA (cT2 N0 M0) right breast invasive ductal carcinoma, ER+/PR+/HER2-. Plan per tumor board: surgery, then AC-T, then radiation.',
 '["No known drug allergies"]','["Multivitamin"]','Stage IIA Right Breast Cancer (dx 2023)',NOW(),NOW()),
(uuid_from_text('encounter-mariam-07'),'ENC-2023-0107','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e761d1dc-1d77-5499-bd12-b077276934a7','IMP','Surgery (Lumpectomy + SLNB)','finished','urgent',
 '2023-03-01 07:00:00+00','2023-03-01 11:00:00+00','referral','Breast-conserving surgery with sentinel node biopsy','Scheduled resection',
 'Right breast lumpectomy with sentinel lymph node biopsy; pathology pT2 N0 (0/3 sentinel nodes) M0, margins clear.',
 '["No known drug allergies"]','["Multivitamin"]','Stage IIA Right Breast Cancer (dx 2023)',NOW(),NOW()),
(uuid_from_text('encounter-mariam-08'),'ENC-2023-0108','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e761d1dc-1d77-5499-bd12-b077276934a7','AMB','Post-operative Follow-up','finished','routine',
 '2023-03-15 10:00:00+00','2023-03-15 10:30:00+00','appointment','Post-operative wound check','Recovery review after lumpectomy',
 'Wound healing well. Final pathology: pT2 N0 (0/3 sentinel nodes) M0, Stage IIA, margins clear. Cleared to start adjuvant chemotherapy.',
 '["No known drug allergies"]','["Multivitamin"]','Stage IIA Right Breast Cancer (dx 2023)',NOW(),NOW()),
(uuid_from_text('encounter-mariam-09'),'ENC-2023-0109','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Chemotherapy','finished','routine',
 '2023-03-29 09:00:00+00','2023-03-29 13:00:00+00','appointment','Adjuvant chemotherapy cycle 1 (AC)','Chemotherapy infusion',
 'Adjuvant AC (doxorubicin/cyclophosphamide) cycle 1 of 4 administered; tolerated well with antiemetic prophylaxis.',
 '["No known drug allergies"]','["AC chemo","Ondansetron PRN"]','Stage IIA Right Breast Cancer (dx 2023)',NOW(),NOW()),
(uuid_from_text('encounter-mariam-10'),'ENC-2023-0110','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Chemotherapy','finished','routine',
 '2023-05-24 09:00:00+00','2023-05-24 12:00:00+00','appointment','Adjuvant chemotherapy cycle 5 (Paclitaxel)','Chemotherapy infusion',
 'AC phase complete (4 cycles). Starting paclitaxel phase cycle 1 of 4 (overall cycle 5 of 8); tolerated well.',
 '["No known drug allergies"]','["Paclitaxel","Ondansetron PRN"]','Stage IIA Right Breast Cancer (dx 2023)',NOW(),NOW()),
(uuid_from_text('encounter-mariam-11'),'ENC-2023-0111','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Radiation Simulation & Planning','finished','routine',
 '2023-08-10 09:00:00+00','2023-08-10 10:00:00+00','referral','CT simulation for adjuvant whole-breast radiation','Post-chemotherapy, planning adjuvant RT',
 'CT simulation completed on breast board with arms up; isocenter tattoos placed. IMRT plan to right breast/chest wall, 40.05 Gy in 15 fractions.',
 '["No known drug allergies"]',NULL,'Stage IIA Right Breast Cancer (dx 2023), status post surgery and chemotherapy',NOW(),NOW()),
(uuid_from_text('encounter-mariam-12'),'ENC-2023-0112','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Radiation On-Treatment Review','finished','routine',
 '2023-08-31 09:00:00+00','2023-08-31 09:20:00+00','appointment','Week 1 on-treatment review','Weekly radiation oncology review',
 'Week 1 review: grade 1 skin erythema, no significant pain, tolerating treatment well. Continue as planned.',
 '["No known drug allergies"]',NULL,'Stage IIA Right Breast Cancer (dx 2023), on adjuvant radiation',NOW(),NOW()),
(uuid_from_text('encounter-mariam-13'),'ENC-2023-0113','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Radiation On-Treatment Review','finished','routine',
 '2023-09-05 09:00:00+00','2023-09-05 09:20:00+00','appointment','Week 2 on-treatment review','Weekly radiation oncology review',
 'Week 2 review: grade 2 skin erythema/dry desquamation, mild discomfort, no treatment break required. Skin care advised.',
 '["No known drug allergies"]',NULL,'Stage IIA Right Breast Cancer (dx 2023), on adjuvant radiation',NOW(),NOW()),
(uuid_from_text('encounter-mariam-14'),'ENC-2023-0114','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Radiation Completion Visit','finished','routine',
 '2023-09-20 10:00:00+00','2023-09-20 10:30:00+00','appointment','Radiation completion assessment','End of adjuvant radiation course',
 'Completed all 15 fractions (40.05 Gy). Grade 2 acute dermatitis resolving. No treatment interruptions. Plan surveillance and endocrine therapy.',
 '["No known drug allergies"]','["Tamoxifen 20mg QD"]','Stage IIA Right Breast Cancer (dx 2023), completed surgery/chemo/radiation',NOW(),NOW()),
(uuid_from_text('encounter-mariam-15'),'ENC-2024-0101','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Survivorship Follow-up','finished','routine',
 '2024-03-15 09:00:00+00','2024-03-15 09:30:00+00','appointment','6-month survivorship follow-up','Routine oncology surveillance',
 'Routine survivorship follow-up: NED, on tamoxifen, tolerating well. CA 15-3 within normal limits. Mammogram surveillance scheduled.',
 '["No known drug allergies"]','["Tamoxifen 20mg QD"]','Stage IIA Right Breast Cancer (dx 2023, in remission)',NOW(),NOW());

-- ---------------------------------------------------------------------------
-- (2) Clinical observations -- CA 15-3 tumor-marker trend.
-- ---------------------------------------------------------------------------
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id, code, code_system, display_name,
  category, value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, created_at, updated_at
) VALUES
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-04'),'6875-9','LOINC','CA 15-3 (Cancer Antigen 15-3)','laboratory',42.0,'U/mL',0,30,'high','2023-01-28 12:00:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-08'),'6875-9','LOINC','CA 15-3 (Cancer Antigen 15-3)','laboratory',24.0,'U/mL',0,30,'normal','2023-03-15 10:15:00+00','e761d1dc-1d77-5499-bd12-b077276934a7','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-15'),'6875-9','LOINC','CA 15-3 (Cancer Antigen 15-3)','laboratory',18.5,'U/mL',0,30,'normal','2024-03-15 09:10:00+00','6d2df89a-3f81-5338-b197-373d347031db','encounter',NOW(),NOW());

-- ---------------------------------------------------------------------------
-- (3) Oncology plugin.
-- ---------------------------------------------------------------------------
INSERT INTO plugin_oncology.cancer_diagnoses (
  id, tenant_id, patient_id, encounter_id, cancer_type, primary_site,
  primary_site_code, laterality, histology_morphology, morphology_code,
  icd_code, snomed_code, diagnosis_date, clinical_status, verification_status,
  grade, metastatic_status, is_recurrence, biomarkers, ecog_at_diagnosis,
  diagnosed_by, notes, created_at, updated_at
) VALUES (
  uuid_from_text('diagnosis-mariam'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-06'),
  'Breast Cancer','Right breast, upper outer quadrant','C50.4',NULL,'Invasive ductal carcinoma','8500/3',
  'C50.911','254837009','2023-02-10','active','confirmed',
  'G2','none',false,'{"ER":"positive","PR":"positive","HER2":"negative","Ki67":"18%"}',0,
  '6d2df89a-3f81-5338-b197-373d347031db','ER+/PR+/HER2-negative invasive ductal carcinoma of the right breast.',NOW(),NOW()
);

INSERT INTO plugin_oncology.tumor_staging (
  id, tenant_id, cancer_diagnosis_id, patient_id, encounter_id, provider_id,
  staging_system, staging_edition, staging_type, stage_group, t_category,
  n_category, m_category, body_site, grade, histology, staging_date, status,
  notes, created_at, updated_at
) VALUES
(uuid_from_text('staging-mariam-clinical'),'11111111-1111-1111-1111-111111111111',uuid_from_text('diagnosis-mariam'),uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-04'),'6d2df89a-3f81-5338-b197-373d347031db',
 'AJCC','8th','clinical','IIA','cT2','cN0','cM0','Right breast','G2','Invasive ductal carcinoma','2023-01-28','active','Clinical staging from breast MRI prior to surgery.',NOW(),NOW()),
(uuid_from_text('staging-mariam-pathologic'),'11111111-1111-1111-1111-111111111111',uuid_from_text('diagnosis-mariam'),uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-08'),'e761d1dc-1d77-5499-bd12-b077276934a7',
 'AJCC','8th','pathologic','IIA','pT2','pN0','pM0','Right breast','G2','Invasive ductal carcinoma','2023-03-15','active','Pathologic staging after lumpectomy and sentinel node biopsy: 0 of 3 nodes positive.',NOW(),NOW());

INSERT INTO plugin_oncology.tumor_board_cases (
  id, tenant_id, patient_id, cancer_diagnosis_id, staging_id, meeting_date,
  presented_by, attendees, clinical_summary, imaging_findings, pathology_report,
  molecular_profile, mdt_recommendation, treatment_intent, recommended_pathway,
  treatment_plan, decision, review_outcome, follow_up_actions, status,
  created_at, updated_at
) VALUES (
  uuid_from_text('tumor-board-mariam'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('diagnosis-mariam'),uuid_from_text('staging-mariam-clinical'),'2023-02-05',
  '6d2df89a-3f81-5338-b197-373d347031db',
  '[{"name":"Dr Fatima Al-Zaabi","role":"Medical Oncology"},{"name":"Dr Omar Al-Ketbi","role":"Breast Surgery"},{"name":"Dr Layla Al-Shamsi","role":"Radiation Oncology"}]',
  '52-year-old female with biopsy-proven ER+/PR+/HER2-negative invasive ductal carcinoma, clinical cT2 N0 M0.',
  'Breast MRI: 2.3 cm enhancing right breast mass, no additional foci, no contralateral disease.',
  'Core biopsy: invasive ductal carcinoma, grade 2, ER positive, PR positive, HER2 negative, Ki-67 18%.',
  'ER positive, PR positive, HER2 negative, Ki-67 18%.',
  'Breast-conserving surgery with sentinel lymph node biopsy, followed by adjuvant AC-T chemotherapy given tumor size/grade, then whole-breast radiation and endocrine therapy.',
  'curative',
  '["surgery","chemotherapy","radiation"]',
  '{"summary":"Lumpectomy + SLNB, then AC-T x8, then whole-breast RT 40.05Gy/15#, then tamoxifen"}',
  'Proceed to breast-conserving surgery',
  'consensus',
  '["Schedule lumpectomy with sentinel node biopsy","Refer to medical oncology for adjuvant chemo planning pending final pathology","Refer to radiation oncology post-chemo"]',
  'completed', NOW(), NOW()
);

INSERT INTO plugin_oncology.oncology_care_plans (
  id, tenant_id, patient_id, cancer_diagnosis_id, tumor_board_case_id, plan_number, version,
  treatment_intent, oncology_subspecialty, planned_modalities, planned_cycles,
  cycle_duration_days, milestones, follow_up_schedule, status, start_date, end_date,
  created_by, approved_by, approved_at, notes, created_at, updated_at
) VALUES (
  uuid_from_text('careplan-mariam'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('diagnosis-mariam'),uuid_from_text('tumor-board-mariam'),'CP-2023-0001',1,
  'curative','medical_oncology','["surgery","chemotherapy","radiation"]',8,
  14,
  '[{"label":"Lumpectomy + SLNB","date":"2023-03-01"},{"label":"Complete AC-T chemotherapy","date":"2023-07-05"},{"label":"Complete adjuvant radiation","date":"2023-09-20"}]',
  '{"plan":"Mammogram annually, clinical exam every 6 months for 5 years, tamoxifen x5 years"}',
  'completed','2023-03-01','2023-09-20',
  '6d2df89a-3f81-5338-b197-373d347031db','6d2df89a-3f81-5338-b197-373d347031db','2023-02-08',
  'AC-T x8 cycles followed by whole-breast radiation given BCS.',NOW(),NOW()
);

-- Chemo orders -- AC-T (8 cycles, real rows for every cycle).
INSERT INTO plugin_oncology.chemo_orders (
  id, tenant_id, patient_id, encounter_id, protocol_id, ordering_provider,
  cycle_number, day_number, scheduled_date, administered_at, bsa, weight, height,
  cancer_diagnosis_id, oncology_care_plan_id, dose_adjustments, pre_chemo_checklist,
  status, administered_by, adverse_reactions, administration_details,
  drug_preparation_details, nurse_verification_checklist, notes, created_at, updated_at
) VALUES
(uuid_from_text('chemo-order-mariam-cycle-1'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-09'),uuid_from_text('chemo-protocol-ac-t'),'6d2df89a-3f81-5338-b197-373d347031db',
 1,1,'2023-03-29','2023-03-29 09:30:00+00',1.68,64.0,160.0,
 uuid_from_text('diagnosis-mariam'),uuid_from_text('careplan-mariam'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','AC cycle 1 of 4 completed without complication.',NOW(),NOW()),
(uuid_from_text('chemo-order-mariam-cycle-2'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),NULL,uuid_from_text('chemo-protocol-ac-t'),'6d2df89a-3f81-5338-b197-373d347031db',
 2,1,'2023-04-12','2023-04-12 09:30:00+00',1.68,63.8,160.0,
 uuid_from_text('diagnosis-mariam'),uuid_from_text('careplan-mariam'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[{"term":"Nausea","grade":1}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','AC cycle 2 of 4; mild nausea, well controlled.',NOW(),NOW()),
(uuid_from_text('chemo-order-mariam-cycle-3'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),NULL,uuid_from_text('chemo-protocol-ac-t'),'6d2df89a-3f81-5338-b197-373d347031db',
 3,1,'2023-04-26','2023-04-26 09:30:00+00',1.67,63.5,160.0,
 uuid_from_text('diagnosis-mariam'),uuid_from_text('careplan-mariam'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','AC cycle 3 of 4 completed without complication.',NOW(),NOW()),
(uuid_from_text('chemo-order-mariam-cycle-4'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),NULL,uuid_from_text('chemo-protocol-ac-t'),'6d2df89a-3f81-5338-b197-373d347031db',
 4,1,'2023-05-10','2023-05-10 09:30:00+00',1.67,63.2,160.0,
 uuid_from_text('diagnosis-mariam'),uuid_from_text('careplan-mariam'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[{"term":"Fatigue","grade":1}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','AC cycle 4 of 4 (final AC cycle) completed; transitioning to paclitaxel.',NOW(),NOW()),
(uuid_from_text('chemo-order-mariam-cycle-5'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-10'),uuid_from_text('chemo-protocol-ac-t'),'6d2df89a-3f81-5338-b197-373d347031db',
 5,1,'2023-05-24','2023-05-24 09:30:00+00',1.67,63.5,160.0,
 uuid_from_text('diagnosis-mariam'),uuid_from_text('careplan-mariam'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Paclitaxel cycle 1 of 4 (overall cycle 5 of 8) completed without complication.',NOW(),NOW()),
(uuid_from_text('chemo-order-mariam-cycle-6'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),NULL,uuid_from_text('chemo-protocol-ac-t'),'6d2df89a-3f81-5338-b197-373d347031db',
 6,1,'2023-06-07','2023-06-07 09:30:00+00',1.68,63.7,160.0,
 uuid_from_text('diagnosis-mariam'),uuid_from_text('careplan-mariam'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[{"term":"Peripheral neuropathy","grade":1}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Paclitaxel cycle 2 of 4; grade 1 neuropathy noted.',NOW(),NOW()),
(uuid_from_text('chemo-order-mariam-cycle-7'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),NULL,uuid_from_text('chemo-protocol-ac-t'),'6d2df89a-3f81-5338-b197-373d347031db',
 7,1,'2023-06-21','2023-06-21 09:30:00+00',1.68,64.0,160.0,
 uuid_from_text('diagnosis-mariam'),uuid_from_text('careplan-mariam'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[{"term":"Peripheral neuropathy","grade":1}]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Paclitaxel cycle 3 of 4; neuropathy stable.',NOW(),NOW()),
(uuid_from_text('chemo-order-mariam-cycle-8'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),NULL,uuid_from_text('chemo-protocol-ac-t'),'6d2df89a-3f81-5338-b197-373d347031db',
 8,1,'2023-07-05','2023-07-05 09:30:00+00',1.68,64.2,160.0,
 uuid_from_text('diagnosis-mariam'),uuid_from_text('careplan-mariam'),'{}','{"consentSigned":true,"labsReviewed":true}',
 'completed','6d2df89a-3f81-5338-b197-373d347031db','[]','{"route":"IV","infusionCenter":"Day Oncology Unit"}',
 '{}','{}','Paclitaxel cycle 4 of 4 (final cycle, overall cycle 8 of 8) completed. Chemotherapy course complete.',NOW(),NOW());

-- ---------------------------------------------------------------------------
-- (4) Real OT request/schedule/report for the lumpectomy + SLNB.
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
  uuid_from_text('ot-request-mariam'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-07'),
  'e761d1dc-1d77-5499-bd12-b077276934a7','2023-02-12 09:00:00+00',
  'Intermediate','19301','Lumpectomy with Sentinel Lymph Node Biopsy','Stage IIA right breast invasive ductal carcinoma (cT2 N0 M0)','ELECTIVE',
  90,'2023-03-01','4cb5b98f-4fe2-56d3-aa74-c946bcfbbc41',
  'e761d1dc-1d77-5499-bd12-b077276934a7',true,'General',
  '["Sentinel node gamma probe","Specimen radiography"]'::jsonb,false,'[]'::jsonb,'Breast-conserving surgery for Stage IIA breast cancer.',
  'COMPLETED',uuid_from_text('ot-schedule-mariam'),'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','2023-02-13 10:00:00+00','e761d1dc-1d77-5499-bd12-b077276934a7','2023-03-01 11:00:00+00',
  NOW(),NOW(),'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

INSERT INTO ot_schedules (
  id, tenant_id, ot_request_id, patient_id, encounter_id, ot_room_space_id,
  scheduled_start_time, scheduled_end_time, actual_start_time, actual_end_time,
  primary_surgeon_id, assistant_surgeon_ids, anaesthesia_type, schedule_status,
  is_current, created_at, updated_at, created_by, updated_by
) VALUES (
  uuid_from_text('ot-schedule-mariam'),'11111111-1111-1111-1111-111111111111',uuid_from_text('ot-request-mariam'),uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-07'),'4cb5b98f-4fe2-56d3-aa74-c946bcfbbc41',
  '2023-03-01 07:00:00+00','2023-03-01 08:30:00+00','2023-03-01 07:05:00+00','2023-03-01 08:35:00+00',
  'e761d1dc-1d77-5499-bd12-b077276934a7','{}','General','SURGERY_COMPLETED',
  true,NOW(),NOW(),'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

INSERT INTO ot_reports (
  id, tenant_id, schedule_id, ot_request_id, patient_id, encounter_id,
  report_number, report_status, signed_by, signed_at, remarks,
  created_at, updated_at, created_by, updated_by
) VALUES (
  uuid_from_text('ot-report-mariam'),'11111111-1111-1111-1111-111111111111',uuid_from_text('ot-schedule-mariam'),uuid_from_text('ot-request-mariam'),uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-07'),
  'OTR-2023-0101','SIGNED','e761d1dc-1d77-5499-bd12-b077276934a7','2023-03-01 11:30:00+00',
  'Right breast lumpectomy with sentinel lymph node biopsy. Pathology pT2 N0 (0/3 sentinel nodes) M0, Stage IIA, margins clear.',
  NOW(),NOW(),'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

-- ---------------------------------------------------------------------------
-- (5) Radiation pipeline -- prescription -> simulation -> plan -> 15
--     fractions -> 2 on-treatment reviews -> completion summary.
-- ---------------------------------------------------------------------------
INSERT INTO plugin_oncology.radiation_prescriptions (
  id, tenant_id, patient_id, encounter_id, cancer_profile_id, prescription_number,
  treatment_intent, laterality, modality, technique, total_dose_gy, dose_per_fraction_gy,
  planned_fractions, concurrent_chemo, planned_start_date, planned_end_date,
  prescription_notes, prescribed_by, prescribed_at, status, created_at, updated_at
) VALUES (
  uuid_from_text('radiation-prescription-mariam'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-mariam-al-nuaimi'),uuid_from_text('encounter-mariam-11'),uuid_from_text('diagnosis-mariam'),'RTX-2023-0101',
  'adjuvant','right','External Beam (Photon)','IMRT',40.05,2.67,
  15,false,'2023-08-24','2023-09-07',
  'Adjuvant whole-breast/chest wall hypofractionated radiation following breast-conserving surgery and AC-T chemotherapy.',
  '23ef067c-d352-5415-945b-9b802d20bc3c','2023-08-10 09:30:00+00','COMPLETED',NOW(),NOW()
);

INSERT INTO plugin_oncology.radiation_simulations (
  id, tenant_id, prescription_id, simulation_date, patient_position,
  immobilization_device, contrast_used, scan_region, setup_reference,
  tattoo_marking_done, simulation_notes, performed_by, status, created_at, updated_at
) VALUES (
  uuid_from_text('radiation-simulation-mariam'),'11111111-1111-1111-1111-111111111111',uuid_from_text('radiation-prescription-mariam'),'2023-08-10',
  'Supine, arms up on breast board','Breast board with wing boards',false,'Right chest wall / breast','Isocenter tattoos placed',
  true,'CT simulation uncomplicated; free-breathing technique.','23ef067c-d352-5415-945b-9b802d20bc3c','COMPLETED',NOW(),NOW()
);

INSERT INTO plugin_oncology.radiation_treatment_plans (
  id, tenant_id, prescription_id, simulation_id, external_plan_reference,
  planning_system, planning_status, planner_id, physicist_id, radiation_oncologist_id,
  contouring_completed, physics_qa_completed, treatment_machine, plan_notes,
  approved_by, approved_at, status, created_at, updated_at
) VALUES (
  uuid_from_text('radiation-treatment-plan-mariam'),'11111111-1111-1111-1111-111111111111',uuid_from_text('radiation-prescription-mariam'),uuid_from_text('radiation-simulation-mariam'),'RTP-2023-0101',
  'Eclipse TPS','approved','23ef067c-d352-5415-945b-9b802d20bc3c','e761d1dc-1d77-5499-bd12-b077276934a7','23ef067c-d352-5415-945b-9b802d20bc3c',
  true,true,'Linac 1 (TrueBeam)','IMRT plan to right breast/chest wall, 40.05 Gy in 15 fractions; heart and lung constraints met.',
  '23ef067c-d352-5415-945b-9b802d20bc3c','2023-08-20 10:00:00+00','COMPLETED',NOW(),NOW()
);

INSERT INTO plugin_oncology.radiation_fractions (
  id, tenant_id, treatment_plan_id, fraction_number, planned_date, actual_date,
  planned_dose_gy, delivered_dose_gy, treatment_machine, radiation_therapist_id,
  status, verification_completed, created_at, updated_at
)
SELECT
  uuid_from_text('radiation-fraction-mariam-' || n),
  '11111111-1111-1111-1111-111111111111',
  uuid_from_text('radiation-treatment-plan-mariam'),
  n,
  (DATE '2023-08-24' + (n - 1)),
  ((DATE '2023-08-24' + (n - 1))::timestamp + TIME '08:00')::timestamptz,
  2.67, 2.67, 'Linac 1 (TrueBeam)', 'e761d1dc-1d77-5499-bd12-b077276934a7',
  'COMPLETED', true, NOW(), NOW()
FROM generate_series(1, 15) AS n;

INSERT INTO plugin_oncology.radiation_on_treatment_reviews (
  id, tenant_id, prescription_id, review_date, week_number, toxicity_grade,
  pain_score, weight_kg, treatment_break_required, review_notes, reviewed_by,
  created_at, updated_at
) VALUES
(uuid_from_text('radiation-review-mariam-w1'),'11111111-1111-1111-1111-111111111111',uuid_from_text('radiation-prescription-mariam'),'2023-08-31',1,'Grade 1 dermatitis',1,64.0,false,'Mild erythema, tolerating treatment well. Continue skin care.','23ef067c-d352-5415-945b-9b802d20bc3c',NOW(),NOW()),
(uuid_from_text('radiation-review-mariam-w2'),'11111111-1111-1111-1111-111111111111',uuid_from_text('radiation-prescription-mariam'),'2023-09-05',2,'Grade 2 dermatitis',2,63.8,false,'Dry desquamation, mild discomfort. No break required; advised moisturizer and loose clothing.','23ef067c-d352-5415-945b-9b802d20bc3c',NOW(),NOW());

INSERT INTO plugin_oncology.radiation_completion_summaries (
  id, tenant_id, prescription_id, completion_date, planned_total_dose_gy,
  delivered_total_dose_gy, planned_fractions, delivered_fractions, interruptions,
  acute_toxicity_summary, response_assessment_plan, followup_plan, completed_by,
  created_at, updated_at
) VALUES (
  uuid_from_text('radiation-completion-mariam'),'11111111-1111-1111-1111-111111111111',uuid_from_text('radiation-prescription-mariam'),'2023-09-07',
  40.05,40.05,15,15,false,
  'Grade 2 acute radiation dermatitis, resolving. No treatment breaks required.',
  'Clinical exam and mammography surveillance per survivorship schedule.',
  'Endocrine therapy (tamoxifen) x5 years, clinical exam every 6 months, annual mammogram.',
  '23ef067c-d352-5415-945b-9b802d20bc3c',NOW(),NOW()
);

-- ---------------------------------------------------------------------------
-- (6) Encounter notes + diagnoses (smart-charting) for every encounter.
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
  v_patient UUID := uuid_from_text('patient-mariam-al-nuaimi');
  v_author  UUID := '6d2df89a-3f81-5338-b197-373d347031db';
  r RECORD;
BEGIN
  CREATE TEMP TABLE _charts (
    enc UUID, chief TEXT, hist TEXT, notes TEXT, icd TEXT, dx TEXT, dxtype TEXT
  ) ON COMMIT DROP;

  INSERT INTO _charts VALUES
  (uuid_from_text('encounter-mariam-01'), 'New palpable right breast mass, upper outer quadrant.',
   '52-year-old female. No prior breast cancer. Mother had breast cancer at age 60. No prior mammogram in last 2 years.',
   'Palpable 2 cm firm mass, non-tender. No skin changes or nipple discharge. Referred for diagnostic imaging.', 'N63', 'Unspecified lump in breast', 'primary'),
  (uuid_from_text('encounter-mariam-02'), 'Diagnostic mammogram and targeted ultrasound for palpable mass.',
   '3-week history of palpable right breast mass.',
   'Mammogram + ultrasound: 2.1 cm irregular spiculated mass, right breast, BI-RADS 5. No suspicious axillary nodes. Biopsy recommended.', 'N63', 'Unspecified lump in breast', 'primary'),
  (uuid_from_text('encounter-mariam-03'), 'Image-guided core needle biopsy of BI-RADS 5 right breast mass.',
   'BI-RADS 5 mass on recent mammogram/ultrasound.',
   'Core biopsy: invasive ductal carcinoma, grade 2. ER positive, PR positive, HER2 negative, Ki-67 18%. Staging workup arranged.', 'C50.911', 'Malignant neoplasm of right breast', 'primary'),
  (uuid_from_text('encounter-mariam-04'), 'Pre-operative staging breast MRI.',
   'Biopsy-confirmed invasive ductal carcinoma.',
   'Breast MRI: 2.3 cm enhancing mass, no additional foci, no contralateral disease. Clinical stage cT2 N0 M0. CA 15-3 elevated at 42.', 'C50.911', 'Malignant neoplasm of right breast', 'primary'),
  (uuid_from_text('encounter-mariam-05'), 'Multidisciplinary breast tumor board review.',
   'cT2 N0 M0 ER+/PR+/HER2- invasive ductal carcinoma.',
   'MDT consensus: breast-conserving surgery with sentinel node biopsy, adjuvant AC-T chemotherapy, then whole-breast radiation and endocrine therapy.', 'C50.911', 'Malignant neoplasm of right breast', 'primary'),
  (uuid_from_text('encounter-mariam-06'), 'New diagnosis of Stage IIA right breast cancer.',
   'cT2 N0 M0 on staging. ECOG 0. No significant comorbidities.',
   'Medical oncology consult. Plan per tumor board: surgery, then AC-T x8, then radiation and tamoxifen. Discussed prognosis and treatment intent (curative).', 'C50.911', 'Malignant neoplasm of right breast', 'primary'),
  (uuid_from_text('encounter-mariam-07'), 'Breast-conserving surgery with sentinel lymph node biopsy.',
   'cT2 N0 M0 right breast carcinoma. Pre-operative assessment cleared.',
   'Right breast lumpectomy with sentinel node biopsy. Pathology pT2 N0 (0/3 nodes) M0, margins clear, Stage IIA. Uncomplicated recovery.', 'C50.911', 'Malignant neoplasm of right breast', 'primary'),
  (uuid_from_text('encounter-mariam-08'), 'Post-operative wound check after lumpectomy.',
   'Day 14 post-op, uncomplicated breast-conserving surgery.',
   'Wound healing well. Final pathology reviewed: pT2 N0 (0/3 nodes) M0, Stage IIA, margins clear. Cleared to start adjuvant chemotherapy.', 'C50.911', 'Malignant neoplasm of right breast', 'primary'),
  (uuid_from_text('encounter-mariam-09'), 'Adjuvant chemotherapy cycle 1 of 8 (AC).',
   'pT2 N0 M0 Stage IIA, status post lumpectomy. ECOG 0.',
   'Adjuvant AC cycle 1 administered; tolerated well with antiemetic prophylaxis. Next cycle in 2 weeks.', 'Z51.11', 'Encounter for antineoplastic chemotherapy', 'primary'),
  (uuid_from_text('encounter-mariam-10'), 'Adjuvant chemotherapy cycle 5 of 8 (start of paclitaxel phase).',
   'AC phase (4 cycles) completed without complication.',
   'Starting paclitaxel phase, cycle 1 of 4 (overall cycle 5 of 8). Tolerated well.', 'Z51.11', 'Encounter for antineoplastic chemotherapy', 'primary'),
  (uuid_from_text('encounter-mariam-11'), 'CT simulation for adjuvant whole-breast radiation.',
   'Completed AC-T chemotherapy; now planning adjuvant RT.',
   'CT simulation on breast board, arms up; isocenter tattoos placed. IMRT plan to right breast/chest wall, 40.05 Gy in 15 fractions.', 'Z51.0', 'Encounter for antineoplastic radiation therapy', 'primary'),
  (uuid_from_text('encounter-mariam-12'), 'Week 1 radiation on-treatment review.',
   'On adjuvant whole-breast radiation, day 6 of 15 fractions.',
   'Grade 1 skin erythema, no significant pain. Tolerating treatment well. Continue as planned.', 'Z51.0', 'Encounter for antineoplastic radiation therapy', 'primary'),
  (uuid_from_text('encounter-mariam-13'), 'Week 2 radiation on-treatment review.',
   'On adjuvant whole-breast radiation, day 11 of 15 fractions.',
   'Grade 2 skin erythema with dry desquamation, mild discomfort. No treatment break required; skin care advised.', 'Z51.0', 'Encounter for antineoplastic radiation therapy', 'primary'),
  (uuid_from_text('encounter-mariam-14'), 'Radiation completion assessment.',
   'Completed all 15 planned fractions.',
   'Completed 40.05 Gy in 15 fractions. Grade 2 acute dermatitis resolving, no interruptions. Starting tamoxifen; plan surveillance.', 'Z08', 'Encounter for follow-up examination after treatment for malignant neoplasm', 'primary'),
  (uuid_from_text('encounter-mariam-15'), 'Routine 6-month survivorship follow-up.',
   'Stage IIA right breast cancer treated in 2023, no evidence of disease.',
   'NED, on tamoxifen, tolerating well. CA 15-3 within normal limits. Mammogram surveillance scheduled. Next follow-up in 6 months.', 'Z08', 'Encounter for follow-up examination after treatment for malignant neoplasm', 'primary');

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
-- (7) Encounter documents (orders + reports) for key encounters.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_tenant  UUID := '11111111-1111-1111-1111-111111111111';
  v_patient UUID := uuid_from_text('patient-mariam-al-nuaimi');
  v_surg    UUID := 'e761d1dc-1d77-5499-bd12-b077276934a7';
  v_rad     UUID := '23ef067c-d352-5415-945b-9b802d20bc3c';
  e2 UUID := uuid_from_text('encounter-mariam-02');
  e3 UUID := uuid_from_text('encounter-mariam-03');
  e7 UUID := uuid_from_text('encounter-mariam-07');
BEGIN
  DELETE FROM clinical_orders WHERE patient_id = v_patient;

  -- ── Diagnostic mammogram + ultrasound (imaging) ─────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-mariam-mammo'), v_tenant, e2, v_patient, 'imaging', '77065', 'CPT', 'Diagnostic mammogram + targeted ultrasound', 'routine', 'completed', v_rad, TIMESTAMPTZ '2023-01-12 09:30+00', NOW(), NOW());
  INSERT INTO imaging_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, modality, body_part, technique, findings, impression, critical_finding, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('report-mariam-mammo'), v_tenant, uuid_from_text('order-mariam-mammo'), e2, v_patient, 'FINAL', 1,
    'Mammography + Ultrasound', 'Right Breast', 'Digital mammography with targeted ultrasound',
    '2.1 cm irregular spiculated mass, right breast upper outer quadrant. No suspicious axillary lymphadenopathy.',
    'BI-RADS 5, highly suggestive of malignancy. Biopsy recommended.', true, v_rad, TIMESTAMPTZ '2023-01-12 11:00+00', NOW(), NOW());

  -- ── Core needle biopsy (procedure) ──────────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-mariam-biopsy'), v_tenant, e3, v_patient, 'procedure', '19083', 'CPT', 'Ultrasound-guided core needle biopsy, breast', 'routine', 'completed', v_surg, TIMESTAMPTZ '2023-01-20 08:00+00', NOW(), NOW());
  INSERT INTO procedure_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, indication, procedure_description, findings, complications, primary_performer, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('report-mariam-biopsy'), v_tenant, uuid_from_text('order-mariam-biopsy'), e3, v_patient, 'FINAL', 1,
    'BI-RADS 5 right breast mass', 'Ultrasound-guided core needle biopsy, right breast mass.',
    'Invasive ductal carcinoma, grade 2. ER positive (95%), PR positive (80%), HER2 negative (IHC 1+), Ki-67 18%.', 'None', v_surg, v_surg, TIMESTAMPTZ '2023-01-22 10:00+00', NOW(), NOW());

  -- ── Lumpectomy + SLNB (procedure) ───────────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-mariam-surgery'), v_tenant, e7, v_patient, 'procedure', '19301', 'CPT', 'Lumpectomy with sentinel lymph node biopsy', 'routine', 'completed', v_surg, TIMESTAMPTZ '2023-03-01 06:30+00', NOW(), NOW());
  INSERT INTO procedure_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, indication, procedure_description, findings, complications, duration_minutes, primary_performer, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('report-mariam-surgery'), v_tenant, uuid_from_text('order-mariam-surgery'), e7, v_patient, 'FINAL', 1,
    'Stage IIA right breast invasive ductal carcinoma', 'Right breast lumpectomy with sentinel lymph node biopsy; R0 resection.',
    'Pathology pT2 N0 (0/3 sentinel nodes) M0, margins clear, Stage IIA.', 'None', 90, v_surg, v_surg, TIMESTAMPTZ '2023-03-02 09:00+00', NOW(), NOW());

  -- ── CA 15-3 tumor marker (lab) ───────────────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-mariam-ca153'), v_tenant, uuid_from_text('encounter-mariam-15'), v_patient, 'lab', 'CA15-3', 'LOINC', 'CA 15-3 (surveillance)', 'routine', 'completed', v_rad, TIMESTAMPTZ '2024-03-15 08:30+00', NOW(), NOW());
  INSERT INTO lab_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, specimen_type, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('lab-report-mariam-ca153'), v_tenant, uuid_from_text('order-mariam-ca153'), uuid_from_text('encounter-mariam-15'), v_patient, 'FINAL', 1, 'Serum', v_rad, TIMESTAMPTZ '2024-03-15 12:00+00', NOW(), NOW());
  INSERT INTO lab_result_items (id, tenant_id, lab_report_id, sort_order, test_code, code_system, test_name, value_numeric, unit, ref_range_low, ref_range_high, abnormal_flag, critical_flag, created_at, updated_at) VALUES
    (gen_random_uuid(), v_tenant, uuid_from_text('lab-report-mariam-ca153'), 1, '6875-9', 'LOINC', 'CA 15-3', 18.5, 'U/mL', 0, 30, false, false, NOW(), NOW());
END $$;

-- ---------------------------------------------------------------------------
-- (8) Cancer timeline events -- derived from the real rows above.
-- ---------------------------------------------------------------------------
INSERT INTO plugin_oncology.cancer_timeline_events
  (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by, created_at)
VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-mariam-al-nuaimi'), uuid_from_text('diagnosis-mariam'), 'diagnosis', TIMESTAMPTZ '2023-01-22 10:00+00',
   'Invasive ductal carcinoma diagnosed', 'ER+/PR+/HER2-negative invasive ductal carcinoma of the right breast, grade 2. Confirmed on core needle biopsy.',
   'cancer_diagnosis', uuid_from_text('diagnosis-mariam'), jsonb_build_object('cancerType','Breast','primarySite','Right breast','clinicalStatus','active','metastaticStatus','none'), 'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-mariam-al-nuaimi'), uuid_from_text('diagnosis-mariam'), 'staging', TIMESTAMPTZ '2023-01-28 12:00+00',
   'Clinical staging — cT2 N0 M0 (Stage IIA)', 'AJCC 8th ed. clinical stage IIA based on breast MRI.',
   'tumor_staging', uuid_from_text('staging-mariam-clinical'), jsonb_build_object('stagingSystem','AJCC8','stageGroup','IIA','tCategory','cT2','nCategory','N0','mCategory','M0'), 'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-mariam-al-nuaimi'), uuid_from_text('diagnosis-mariam'), 'tumor_board', TIMESTAMPTZ '2023-02-05 14:00+00',
   'Tumor board — curative intent', 'MDT recommendation: breast-conserving surgery + SLNB, adjuvant AC-T, then whole-breast radiation and endocrine therapy.',
   'tumor_board_case', uuid_from_text('tumor-board-mariam'), jsonb_build_object('treatmentIntent','curative'), 'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-mariam-al-nuaimi'), uuid_from_text('diagnosis-mariam'), 'care_plan_created', TIMESTAMPTZ '2023-02-08 09:00+00',
   'Care plan CP-2023-0001 created', 'Curative-intent plan: surgery, AC-T chemotherapy, radiation, and endocrine therapy.',
   'oncology_care_plan', uuid_from_text('careplan-mariam'), jsonb_build_object('planNumber','CP-2023-0001','treatmentIntent','curative'), 'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-mariam-al-nuaimi'), uuid_from_text('diagnosis-mariam'), 'care_plan_approved', TIMESTAMPTZ '2023-02-08 09:30+00',
   'Care plan approved', 'Approved by surgical, medical, and radiation oncology.', 'oncology_care_plan', uuid_from_text('careplan-mariam'), jsonb_build_object('planNumber','CP-2023-0001'), 'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-mariam-al-nuaimi'), uuid_from_text('diagnosis-mariam'), 'custom', TIMESTAMPTZ '2023-03-01 11:30+00',
   'Lumpectomy with SLNB — OT report signed', 'R0 resection. Pathology pT2 N0 (0/3 nodes) M0, margins clear.', 'manual', uuid_from_text('ot-report-mariam'), jsonb_build_object('category','surgery'), 'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-mariam-al-nuaimi'), uuid_from_text('diagnosis-mariam'), 'staging', TIMESTAMPTZ '2023-03-15 10:15+00',
   'Pathologic staging — pT2 N0 M0 (Stage IIA)', 'Post-operative AJCC 8th ed. pathologic stage IIA.', 'tumor_staging', uuid_from_text('staging-mariam-pathologic'), jsonb_build_object('stagingSystem','AJCC8','stageGroup','IIA','tCategory','pT2','nCategory','N0','mCategory','M0'), 'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-mariam-al-nuaimi'), uuid_from_text('diagnosis-mariam'), 'radiation_prescribed', TIMESTAMPTZ '2023-08-10 09:30+00',
   'Adjuvant radiation prescribed', '40.05 Gy in 15 fractions to right breast/chest wall, IMRT technique.', 'radiation_prescription', uuid_from_text('radiation-prescription-mariam'), jsonb_build_object('totalDoseGy',40.05,'plannedFractions',15,'technique','IMRT'), 'info', '23ef067c-d352-5415-945b-9b802d20bc3c', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-mariam-al-nuaimi'), uuid_from_text('diagnosis-mariam'), 'radiation_started', TIMESTAMPTZ '2023-08-24 08:00+00',
   'Radiation treatment started', 'Fraction 1 of 15 delivered.', 'radiation_prescription', uuid_from_text('radiation-prescription-mariam'), '{}'::jsonb, 'info', '23ef067c-d352-5415-945b-9b802d20bc3c', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-mariam-al-nuaimi'), uuid_from_text('diagnosis-mariam'), 'radiation_completed', TIMESTAMPTZ '2023-09-07 08:30+00',
   'Radiation treatment completed', 'All 15 fractions delivered, 40.05 Gy total. Grade 2 dermatitis, resolving, no interruptions.', 'radiation_prescription', uuid_from_text('radiation-completion-mariam'), jsonb_build_object('deliveredFractions',15,'deliveredTotalDoseGy',40.05), 'milestone', '23ef067c-d352-5415-945b-9b802d20bc3c', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-mariam-al-nuaimi'), uuid_from_text('diagnosis-mariam'), 'follow_up', TIMESTAMPTZ '2024-03-15 09:10+00',
   '6-month survivorship follow-up — NED', 'On tamoxifen, tolerating well. CA 15-3 within normal limits.', 'manual', NULL, '{}'::jsonb, 'info', '6d2df89a-3f81-5338-b197-373d347031db', NOW());

-- Chemo cycle events -- derived from the real chemo_orders rows inserted above.
INSERT INTO plugin_oncology.cancer_timeline_events
  (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by, created_at)
SELECT
  gen_random_uuid(), co.tenant_id, co.patient_id, co.cancer_diagnosis_id, 'chemo_completed',
  co.administered_at,
  'AC-T cycle ' || co.cycle_number || '/8 completed',
  co.notes,
  'chemo_order', co.id,
  jsonb_build_object('protocol','AC-T','cycleNumber',co.cycle_number,'dayNumber',co.day_number,'bsa',co.bsa,'protocolTotalCycles',8),
  CASE WHEN co.adverse_reactions::text != '[]' THEN 'warning' ELSE 'info' END,
  co.ordering_provider, NOW()
FROM plugin_oncology.chemo_orders co
WHERE co.patient_id = uuid_from_text('patient-mariam-al-nuaimi')
ORDER BY co.cycle_number;

COMMIT;
