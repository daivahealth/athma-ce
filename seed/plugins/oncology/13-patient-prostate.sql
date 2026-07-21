-- =============================================================================
-- 13-patient-prostate.sql
-- Definitive (radiation-only) journey: Stage II prostate adenocarcinoma
-- (Gleason 3+4=7), for Suresh Menon (new patient, MRN-2025-006).
-- No chemotherapy, no surgery.
--
-- Seeds: patient record, 6 encounters, encounter_notes/diagnoses, clinical
--   orders + reports, clinical_observations (PSA trend), plugin_oncology.*
--   (diagnosis, staging, care plan), the full radiation pipeline
--   (prescription -> simulation -> plan -> 20 fractions -> 2 on-treatment
--   reviews -> completion summary), and cancer_timeline_events.
--
-- Idempotent: re-runnable, all writes scoped to this patient with stable
-- uuid_from_text() ids.
-- =============================================================================

BEGIN;

DELETE FROM plugin_oncology.cancer_timeline_events        WHERE patient_id = uuid_from_text('patient-khalid-al-falasi');
DELETE FROM plugin_oncology.radiation_completion_summaries WHERE prescription_id = uuid_from_text('radiation-prescription-khalid');
DELETE FROM plugin_oncology.radiation_on_treatment_reviews WHERE prescription_id = uuid_from_text('radiation-prescription-khalid');
DELETE FROM plugin_oncology.radiation_fractions            WHERE treatment_plan_id = uuid_from_text('radiation-treatment-plan-khalid');
DELETE FROM plugin_oncology.radiation_treatment_plans      WHERE prescription_id = uuid_from_text('radiation-prescription-khalid');
DELETE FROM plugin_oncology.radiation_simulations          WHERE prescription_id = uuid_from_text('radiation-prescription-khalid');
DELETE FROM plugin_oncology.radiation_prescriptions        WHERE patient_id = uuid_from_text('patient-khalid-al-falasi');
DELETE FROM plugin_oncology.oncology_care_plans            WHERE patient_id = uuid_from_text('patient-khalid-al-falasi');
DELETE FROM plugin_oncology.tumor_staging                  WHERE patient_id = uuid_from_text('patient-khalid-al-falasi');
DELETE FROM plugin_oncology.cancer_diagnoses                WHERE patient_id = uuid_from_text('patient-khalid-al-falasi');

DELETE FROM clinical_orders       WHERE patient_id = uuid_from_text('patient-khalid-al-falasi');
DELETE FROM clinical_observations WHERE patient_id = uuid_from_text('patient-khalid-al-falasi');
DELETE FROM encounter_notes       WHERE patient_id = uuid_from_text('patient-khalid-al-falasi');
DELETE FROM encounter_diagnoses   WHERE patient_id = uuid_from_text('patient-khalid-al-falasi');
DELETE FROM encounters            WHERE patient_id = uuid_from_text('patient-khalid-al-falasi');
DELETE FROM patients              WHERE id = uuid_from_text('patient-khalid-al-falasi');

INSERT INTO patients (
  id, mrn, tenant_id, national_id, national_id_type, issuing_country,
  first_name, last_name, middle_name, date_of_birth, gender, marital_status,
  nationality, preferred_language, phone_number, email, address_line1,
  address_line2, city, postal_code, country, emergency_contact, insurance_info,
  created_by, created_at_facility, registration_source, registration_notes,
  status, created_at, updated_at, updated_by, updated_at_facility
) VALUES (
  uuid_from_text('patient-khalid-al-falasi'), 'MRN-2025-006', '11111111-1111-1111-1111-111111111111'::UUID,
  '567890123456', 'national_id', 'IN',
  'Suresh', 'Menon', NULL, DATE '1960-04-02', 'male', 'married',
  'India', 'en', '+919656778899', 'suresh.menon@example.in', 'MG Road',
  NULL, 'Bangalore', '560001', 'IN',
  '{"name":"Radha Menon","relation":"spouse","phone":"+919656778800"}'::jsonb,
  '{"payer":"Star Health Insurance","memberId":"STAR889900"}'::jsonb,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::UUID,
  'manual', 'Initial registration via urology referral',
  'active', NOW(), NOW(), NULL, NULL
);

INSERT INTO encounters (
  id, encounter_number, tenant_id, patient_id, facility_id, facility_name,
  primary_staff_id, encounter_class, encounter_type, status, priority,
  start_time, end_time, encounter_source, chief_complaint, presenting_symptoms,
  notes, allergies, current_medications, medical_history, created_at, updated_at
) VALUES
(uuid_from_text('encounter-khalid-01'),'ENC-2024-0301','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-khalid-al-falasi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee','AMB','Primary Care Visit','finished','routine',
 '2024-03-05 09:00:00+00','2024-03-05 09:30:00+00','appointment','Elevated PSA on routine screening','Asymptomatic, PSA 8.2 ng/mL on annual screening',
 '64-year-old male, asymptomatic, routine screening PSA elevated at 8.2 ng/mL (baseline <4.0). Referred to urology.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-khalid-02'),'ENC-2024-0302','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-khalid-al-falasi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 'e761d1dc-1d77-5499-bd12-b077276934a7','AMB','Urology Consultation & Biopsy','finished','routine',
 '2024-03-12 08:00:00+00','2024-03-12 09:00:00+00','referral','Elevated PSA workup','PSA 8.2 ng/mL',
 'Digital rectal exam: firm nodule left lobe. TRUS-guided biopsy performed: acinar adenocarcinoma, Gleason 3+4=7 (Grade Group 2), 4 of 12 cores positive.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-khalid-03'),'ENC-2024-0303','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-khalid-al-falasi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Staging MRI Pelvis','finished','routine',
 '2024-03-25 10:00:00+00','2024-03-25 10:45:00+00','appointment','Multiparametric MRI for staging','Biopsy-confirmed prostate adenocarcinoma',
 'Multiparametric MRI pelvis: tumor confined to the prostate gland, no extracapsular extension or seminal vesicle invasion, no pelvic lymphadenopathy. Clinical stage cT2a N0 M0.',
 NULL,NULL,NULL,NOW(),NOW()),
(uuid_from_text('encounter-khalid-04'),'ENC-2024-0304','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-khalid-al-falasi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '6d2df89a-3f81-5338-b197-373d347031db','AMB','Oncology Consultation','finished','routine',
 '2024-04-02 09:00:00+00','2024-04-02 10:00:00+00','referral','Newly diagnosed prostate cancer','Referred for oncology assessment',
 'Consultation: Stage II (cT2a N0 M0) prostate adenocarcinoma, Gleason 3+4=7. Discussed options; patient elects definitive radiation with short-course androgen deprivation over surgery.',
 '["No known drug allergies"]',NULL,'Stage II Prostate Cancer (dx 2024)',NOW(),NOW()),
(uuid_from_text('encounter-khalid-05'),'ENC-2024-0305','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-khalid-al-falasi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Radiation Simulation & Planning','finished','routine',
 '2024-04-20 09:00:00+00','2024-04-20 10:00:00+00','referral','CT simulation for definitive prostate radiation','Planning for curative-intent radiation',
 'CT simulation with full bladder protocol and knee/ankle immobilization. IMRT plan to prostate, 60 Gy in 20 fractions, started on leuprolide (ADT).',
 '["No known drug allergies"]','["Leuprolide (ADT)"]','Stage II Prostate Cancer (dx 2024)',NOW(),NOW()),
(uuid_from_text('encounter-khalid-06'),'ENC-2024-0306','11111111-1111-1111-1111-111111111111',uuid_from_text('patient-khalid-al-falasi'),'087e0bd6-8d65-5133-94bd-7b4cd6ff3665','Zeal Main Hospital',
 '23ef067c-d352-5415-945b-9b802d20bc3c','AMB','Follow-up','finished','routine',
 '2024-08-15 09:00:00+00','2024-08-15 09:30:00+00','appointment','Post-radiation follow-up, 3 months','Routine oncology surveillance',
 'Post-radiation follow-up: PSA nadir 1.1 ng/mL (down from 8.2). Grade 1 residual urinary frequency, otherwise well. Continue ADT and PSA surveillance.',
 '["No known drug allergies"]','["Leuprolide (ADT)"]','Stage II Prostate Cancer (dx 2024, treated with definitive radiation)',NOW(),NOW());

INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id, code, code_system, display_name,
  category, value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, created_at, updated_at
) VALUES
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-khalid-al-falasi'),uuid_from_text('encounter-khalid-01'),'83112-3','LOINC','Prostate Specific Antigen (PSA), Total','laboratory',8.2,'ng/mL',0,4.0,'high','2024-03-05 09:15:00+00','e64ff25b-9d46-5b0e-9bc3-6596a5850cee','encounter',NOW(),NOW()),
(gen_random_uuid(),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-khalid-al-falasi'),uuid_from_text('encounter-khalid-06'),'83112-3','LOINC','Prostate Specific Antigen (PSA), Total','laboratory',1.1,'ng/mL',0,4.0,'normal','2024-08-15 09:10:00+00','23ef067c-d352-5415-945b-9b802d20bc3c','encounter',NOW(),NOW());

INSERT INTO plugin_oncology.cancer_diagnoses (
  id, tenant_id, patient_id, encounter_id, cancer_type, primary_site,
  primary_site_code, laterality, histology_morphology, morphology_code,
  icd_code, snomed_code, diagnosis_date, clinical_status, verification_status,
  grade, metastatic_status, is_recurrence, biomarkers, ecog_at_diagnosis,
  diagnosed_by, notes, created_at, updated_at
) VALUES (
  uuid_from_text('diagnosis-khalid'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-khalid-al-falasi'),uuid_from_text('encounter-khalid-04'),
  'Prostate Cancer','Prostate, left lobe','C61',NULL,'Acinar adenocarcinoma','8140/3',
  'C61','399068003','2024-04-02','active','confirmed',
  'Gleason 3+4=7 (Grade Group 2)','none',false,'{"gleasonScore":"3+4=7","gradeGroup":"2","coresPositive":"4/12"}',0,
  '6d2df89a-3f81-5338-b197-373d347031db','Acinar adenocarcinoma of the prostate, Gleason 3+4=7, organ-confined.',NOW(),NOW()
);

INSERT INTO plugin_oncology.tumor_staging (
  id, tenant_id, cancer_diagnosis_id, patient_id, encounter_id, provider_id,
  staging_system, staging_edition, staging_type, stage_group, t_category,
  n_category, m_category, body_site, grade, histology, staging_date, status,
  notes, created_at, updated_at
) VALUES (
  uuid_from_text('staging-khalid-clinical'),'11111111-1111-1111-1111-111111111111',uuid_from_text('diagnosis-khalid'),uuid_from_text('patient-khalid-al-falasi'),uuid_from_text('encounter-khalid-03'),'23ef067c-d352-5415-945b-9b802d20bc3c',
  'AJCC','8th','clinical','II','cT2a','cN0','cM0','Prostate','Grade Group 2','Acinar adenocarcinoma','2024-03-25','active','Clinical staging by multiparametric MRI: organ-confined disease, no nodal or distant spread.',NOW(),NOW()
);

INSERT INTO plugin_oncology.oncology_care_plans (
  id, tenant_id, patient_id, cancer_diagnosis_id, plan_number, version,
  treatment_intent, oncology_subspecialty, planned_modalities, milestones,
  follow_up_schedule, status, start_date, end_date,
  created_by, approved_by, approved_at, notes, created_at, updated_at
) VALUES (
  uuid_from_text('careplan-khalid'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-khalid-al-falasi'),uuid_from_text('diagnosis-khalid'),'CP-2024-0301',1,
  'curative','radiation_oncology','["radiation"]',
  '[{"label":"Start definitive radiation","date":"2024-05-06"},{"label":"Complete 20 fractions","date":"2024-05-25"}]',
  '{"plan":"PSA every 3 months for first year, then every 6 months; continue ADT for 6 months total"}',
  'completed','2024-04-20','2024-05-25',
  '23ef067c-d352-5415-945b-9b802d20bc3c','23ef067c-d352-5415-945b-9b802d20bc3c','2024-04-05',
  'Definitive IMRT (60 Gy / 20 fractions) with short-course ADT for Grade Group 2 organ-confined prostate cancer.',NOW(),NOW()
);

INSERT INTO plugin_oncology.radiation_prescriptions (
  id, tenant_id, patient_id, encounter_id, cancer_profile_id, prescription_number,
  treatment_intent, modality, technique, total_dose_gy, dose_per_fraction_gy,
  planned_fractions, concurrent_chemo, planned_start_date, planned_end_date,
  prescription_notes, prescribed_by, prescribed_at, status, created_at, updated_at
) VALUES (
  uuid_from_text('radiation-prescription-khalid'),'11111111-1111-1111-1111-111111111111',uuid_from_text('patient-khalid-al-falasi'),uuid_from_text('encounter-khalid-05'),uuid_from_text('diagnosis-khalid'),'RTX-2024-0301',
  'definitive','External Beam (Photon)','IMRT',60.0,3.0,
  20,false,'2024-05-06','2024-05-25',
  'Definitive moderately hypofractionated IMRT to the prostate with concurrent leuprolide (ADT).',
  '23ef067c-d352-5415-945b-9b802d20bc3c','2024-04-20 09:30:00+00','COMPLETED',NOW(),NOW()
);

INSERT INTO plugin_oncology.radiation_simulations (
  id, tenant_id, prescription_id, simulation_date, patient_position,
  immobilization_device, contrast_used, scan_region, setup_reference,
  tattoo_marking_done, simulation_notes, performed_by, status, created_at, updated_at
) VALUES (
  uuid_from_text('radiation-simulation-khalid'),'11111111-1111-1111-1111-111111111111',uuid_from_text('radiation-prescription-khalid'),'2024-04-20',
  'Supine, knee and ankle immobilization','Knee/ankle cushions, full-bladder + empty-rectum protocol',false,'Pelvis','Isocenter tattoos placed',
  true,'CT simulation uncomplicated; daily image guidance planned.','23ef067c-d352-5415-945b-9b802d20bc3c','COMPLETED',NOW(),NOW()
);

INSERT INTO plugin_oncology.radiation_treatment_plans (
  id, tenant_id, prescription_id, simulation_id, external_plan_reference,
  planning_system, planning_status, planner_id, physicist_id, radiation_oncologist_id,
  contouring_completed, physics_qa_completed, treatment_machine, plan_notes,
  approved_by, approved_at, status, created_at, updated_at
) VALUES (
  uuid_from_text('radiation-treatment-plan-khalid'),'11111111-1111-1111-1111-111111111111',uuid_from_text('radiation-prescription-khalid'),uuid_from_text('radiation-simulation-khalid'),'RTP-2024-0301',
  'Eclipse TPS','approved','23ef067c-d352-5415-945b-9b802d20bc3c','e761d1dc-1d77-5499-bd12-b077276934a7','23ef067c-d352-5415-945b-9b802d20bc3c',
  true,true,'Linac 2 (TrueBeam)','IMRT plan to prostate, 60 Gy in 20 fractions with daily image guidance; bladder/rectum constraints met.',
  '23ef067c-d352-5415-945b-9b802d20bc3c','2024-04-28 10:00:00+00','COMPLETED',NOW(),NOW()
);

INSERT INTO plugin_oncology.radiation_fractions (
  id, tenant_id, treatment_plan_id, fraction_number, planned_date, actual_date,
  planned_dose_gy, delivered_dose_gy, treatment_machine, radiation_therapist_id,
  status, verification_completed, created_at, updated_at
)
SELECT
  uuid_from_text('radiation-fraction-khalid-' || n),
  '11111111-1111-1111-1111-111111111111',
  uuid_from_text('radiation-treatment-plan-khalid'),
  n,
  (DATE '2024-05-06' + (n - 1)),
  ((DATE '2024-05-06' + (n - 1))::timestamp + TIME '07:30')::timestamptz,
  3.0, 3.0, 'Linac 2 (TrueBeam)', 'e761d1dc-1d77-5499-bd12-b077276934a7',
  'COMPLETED', true, NOW(), NOW()
FROM generate_series(1, 20) AS n;

INSERT INTO plugin_oncology.radiation_on_treatment_reviews (
  id, tenant_id, prescription_id, review_date, week_number, toxicity_grade,
  pain_score, weight_kg, treatment_break_required, review_notes, reviewed_by,
  created_at, updated_at
) VALUES
(uuid_from_text('radiation-review-khalid-w2'),'11111111-1111-1111-1111-111111111111',uuid_from_text('radiation-prescription-khalid'),'2024-05-17',2,'Grade 1 GU/GI',0,81.0,false,'Mild urinary frequency, no rectal symptoms. Continue as planned.','23ef067c-d352-5415-945b-9b802d20bc3c',NOW(),NOW()),
(uuid_from_text('radiation-review-khalid-w4'),'11111111-1111-1111-1111-111111111111',uuid_from_text('radiation-prescription-khalid'),'2024-05-24',4,'Grade 2 GU / Grade 1 GI',1,80.5,false,'Increased urinary frequency and mild urgency, mild rectal irritation. No break required; alpha-blocker started.','23ef067c-d352-5415-945b-9b802d20bc3c',NOW(),NOW());

INSERT INTO plugin_oncology.radiation_completion_summaries (
  id, tenant_id, prescription_id, completion_date, planned_total_dose_gy,
  delivered_total_dose_gy, planned_fractions, delivered_fractions, interruptions,
  acute_toxicity_summary, response_assessment_plan, followup_plan, completed_by,
  created_at, updated_at
) VALUES (
  uuid_from_text('radiation-completion-khalid'),'11111111-1111-1111-1111-111111111111',uuid_from_text('radiation-prescription-khalid'),'2024-05-25',
  60.0,60.0,20,20,false,
  'Grade 2 acute genitourinary and grade 1 gastrointestinal toxicity, both managed conservatively, no treatment breaks.',
  'PSA at 3 months, then every 6 months.',
  'Continue leuprolide (ADT) to complete 6 months total; PSA surveillance per schedule.',
  '23ef067c-d352-5415-945b-9b802d20bc3c',NOW(),NOW()
);

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
  v_patient UUID := uuid_from_text('patient-khalid-al-falasi');
  v_author  UUID := '23ef067c-d352-5415-945b-9b802d20bc3c';
  r RECORD;
BEGIN
  CREATE TEMP TABLE _charts (
    enc UUID, chief TEXT, hist TEXT, notes TEXT, icd TEXT, dx TEXT, dxtype TEXT
  ) ON COMMIT DROP;

  INSERT INTO _charts VALUES
  (uuid_from_text('encounter-khalid-01'), 'Elevated PSA (8.2 ng/mL) on routine annual screening, asymptomatic.',
   '64-year-old male. No prior prostate biopsy. No family history of prostate cancer.',
   'Digital rectal exam deferred to urology. Referred for urology consultation and biopsy.', 'R97.20', 'Elevated prostate specific antigen [PSA]', 'primary'),
  (uuid_from_text('encounter-khalid-02'), 'Urology workup of elevated PSA.',
   'PSA 8.2 ng/mL on screening, asymptomatic.',
   'DRE: firm nodule left lobe. TRUS-guided biopsy: acinar adenocarcinoma, Gleason 3+4=7 (Grade Group 2), 4 of 12 cores positive. Staging MRI arranged.', 'C61', 'Malignant neoplasm of prostate', 'primary'),
  (uuid_from_text('encounter-khalid-03'), 'Multiparametric MRI pelvis for staging.',
   'Biopsy-confirmed Gleason 3+4=7 prostate adenocarcinoma.',
   'MRI: organ-confined disease, no extracapsular extension, no nodal involvement. Clinical stage cT2a N0 M0.', 'C61', 'Malignant neoplasm of prostate', 'primary'),
  (uuid_from_text('encounter-khalid-04'), 'New diagnosis of Stage II prostate adenocarcinoma.',
   'cT2a N0 M0, Gleason 3+4=7. ECOG 0.',
   'Oncology consult: discussed surgery vs. radiation. Patient elects definitive radiation with short-course ADT.', 'C61', 'Malignant neoplasm of prostate', 'primary'),
  (uuid_from_text('encounter-khalid-05'), 'CT simulation for definitive prostate radiation.',
   'Stage II prostate cancer, plan for definitive IMRT.',
   'CT simulation with bladder/rectum protocol; IMRT plan to prostate, 60 Gy in 20 fractions. Started leuprolide (ADT).', 'Z51.0', 'Encounter for antineoplastic radiation therapy', 'primary'),
  (uuid_from_text('encounter-khalid-06'), 'Post-radiation follow-up at 3 months.',
   'Completed definitive IMRT (60 Gy/20#) with ADT.',
   'PSA nadir 1.1 ng/mL (down from 8.2). Grade 1 residual urinary frequency, improving. Continue ADT and PSA surveillance.', 'Z08', 'Encounter for follow-up examination after treatment for malignant neoplasm', 'primary');

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
  v_patient UUID := uuid_from_text('patient-khalid-al-falasi');
  v_urol    UUID := 'e761d1dc-1d77-5499-bd12-b077276934a7';
  v_rad     UUID := '23ef067c-d352-5415-945b-9b802d20bc3c';
  e2 UUID := uuid_from_text('encounter-khalid-02');
  e3 UUID := uuid_from_text('encounter-khalid-03');
BEGIN
  DELETE FROM clinical_orders WHERE patient_id = v_patient;

  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-khalid-biopsy'), v_tenant, e2, v_patient, 'procedure', '55700', 'CPT', 'TRUS-guided prostate biopsy', 'routine', 'completed', v_urol, TIMESTAMPTZ '2024-03-12 07:30+00', NOW(), NOW());
  INSERT INTO procedure_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, indication, procedure_description, findings, complications, primary_performer, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('report-khalid-biopsy'), v_tenant, uuid_from_text('order-khalid-biopsy'), e2, v_patient, 'FINAL', 1,
    'Elevated PSA, palpable nodule', 'Transrectal ultrasound-guided systematic 12-core prostate biopsy.',
    'Acinar adenocarcinoma, Gleason 3+4=7 (Grade Group 2), 4 of 12 cores positive, left lobe predominant.', 'None', v_urol, v_urol, TIMESTAMPTZ '2024-03-14 10:00+00', NOW(), NOW());

  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-khalid-mri'), v_tenant, e3, v_patient, 'imaging', '72197', 'CPT', 'MRI Pelvis, multiparametric', 'routine', 'completed', v_rad, TIMESTAMPTZ '2024-03-25 09:30+00', NOW(), NOW());
  INSERT INTO imaging_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, modality, body_part, technique, findings, impression, critical_finding, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('report-khalid-mri'), v_tenant, uuid_from_text('order-khalid-mri'), e3, v_patient, 'FINAL', 1,
    'MRI', 'Pelvis', 'Multiparametric prostate MRI',
    'Tumor confined to the prostate gland, no extracapsular extension or seminal vesicle invasion, no pelvic lymphadenopathy.',
    'Organ-confined prostate cancer, clinical stage cT2a N0 M0.', false, v_rad, TIMESTAMPTZ '2024-03-25 12:00+00', NOW(), NOW());

  -- ── PSA tumor marker (lab) ───────────────────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES (uuid_from_text('order-khalid-psa'), v_tenant, uuid_from_text('encounter-khalid-06'), v_patient, 'lab', 'PSA', 'LOINC', 'PSA, Total (follow-up)', 'routine', 'completed', v_rad, TIMESTAMPTZ '2024-08-15 08:30+00', NOW(), NOW());
  INSERT INTO lab_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, specimen_type, reported_by, reported_at, created_at, updated_at)
  VALUES (uuid_from_text('lab-report-khalid-psa'), v_tenant, uuid_from_text('order-khalid-psa'), uuid_from_text('encounter-khalid-06'), v_patient, 'FINAL', 1, 'Serum', v_rad, TIMESTAMPTZ '2024-08-15 12:00+00', NOW(), NOW());
  INSERT INTO lab_result_items (id, tenant_id, lab_report_id, sort_order, test_code, code_system, test_name, value_numeric, unit, ref_range_low, ref_range_high, abnormal_flag, critical_flag, created_at, updated_at) VALUES
    (gen_random_uuid(), v_tenant, uuid_from_text('lab-report-khalid-psa'), 1, '83112-3', 'LOINC', 'Prostate Specific Antigen (PSA), Total', 1.1, 'ng/mL', 0, 4.0, false, false, NOW(), NOW());
END $$;

INSERT INTO plugin_oncology.cancer_timeline_events
  (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by, created_at)
VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-khalid-al-falasi'), uuid_from_text('diagnosis-khalid'), 'diagnosis', TIMESTAMPTZ '2024-03-14 10:00+00',
   'Prostate adenocarcinoma diagnosed', 'Acinar adenocarcinoma of the prostate, Gleason 3+4=7 (Grade Group 2). Confirmed on TRUS biopsy.',
   'cancer_diagnosis', uuid_from_text('diagnosis-khalid'), jsonb_build_object('cancerType','Prostate','primarySite','Prostate','clinicalStatus','active','metastaticStatus','none'), 'milestone', '6d2df89a-3f81-5338-b197-373d347031db', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-khalid-al-falasi'), uuid_from_text('diagnosis-khalid'), 'staging', TIMESTAMPTZ '2024-03-25 12:00+00',
   'Clinical staging — cT2a N0 M0 (Stage II)', 'AJCC 8th ed. clinical stage II based on multiparametric MRI.',
   'tumor_staging', uuid_from_text('staging-khalid-clinical'), jsonb_build_object('stagingSystem','AJCC8','stageGroup','II','tCategory','cT2a','nCategory','N0','mCategory','M0'), 'info', '23ef067c-d352-5415-945b-9b802d20bc3c', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-khalid-al-falasi'), uuid_from_text('diagnosis-khalid'), 'care_plan_created', TIMESTAMPTZ '2024-04-02 10:00+00',
   'Care plan CP-2024-0301 created', 'Curative-intent plan: definitive IMRT with short-course ADT.',
   'oncology_care_plan', uuid_from_text('careplan-khalid'), jsonb_build_object('planNumber','CP-2024-0301','treatmentIntent','curative'), 'info', '23ef067c-d352-5415-945b-9b802d20bc3c', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-khalid-al-falasi'), uuid_from_text('diagnosis-khalid'), 'radiation_prescribed', TIMESTAMPTZ '2024-04-20 09:30+00',
   'Definitive radiation prescribed', '60 Gy in 20 fractions to the prostate, IMRT technique, with concurrent ADT.', 'radiation_prescription', uuid_from_text('radiation-prescription-khalid'), jsonb_build_object('totalDoseGy',60.0,'plannedFractions',20,'technique','IMRT'), 'info', '23ef067c-d352-5415-945b-9b802d20bc3c', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-khalid-al-falasi'), uuid_from_text('diagnosis-khalid'), 'radiation_started', TIMESTAMPTZ '2024-05-06 07:30+00',
   'Radiation treatment started', 'Fraction 1 of 20 delivered.', 'radiation_prescription', uuid_from_text('radiation-prescription-khalid'), '{}'::jsonb, 'info', '23ef067c-d352-5415-945b-9b802d20bc3c', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-khalid-al-falasi'), uuid_from_text('diagnosis-khalid'), 'radiation_completed', TIMESTAMPTZ '2024-05-25 08:00+00',
   'Radiation treatment completed', 'All 20 fractions delivered, 60 Gy total. Grade 2 GU / Grade 1 GI toxicity, no interruptions.', 'radiation_prescription', uuid_from_text('radiation-completion-khalid'), jsonb_build_object('deliveredFractions',20,'deliveredTotalDoseGy',60.0), 'milestone', '23ef067c-d352-5415-945b-9b802d20bc3c', NOW()),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', uuid_from_text('patient-khalid-al-falasi'), uuid_from_text('diagnosis-khalid'), 'follow_up', TIMESTAMPTZ '2024-08-15 09:10+00',
   'Post-radiation follow-up — PSA nadir', 'PSA nadir 1.1 ng/mL, down from 8.2 at diagnosis. Continuing ADT.', 'manual', NULL, '{}'::jsonb, 'info', '23ef067c-d352-5415-945b-9b802d20bc3c', NOW());

COMMIT;
