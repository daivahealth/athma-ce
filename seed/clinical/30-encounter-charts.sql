-- Seed: Filled clinical charts (smart-charting notes) for the oncology demo journey
-- Patient: John Smith, MRN-2025-003 (7bc65ec5-ef2f-5a36-b575-7978ce5e59c0)
-- Depends on: seed/clinical/28-oncology-demo-journey.sql (encounter ids).
--
-- WHY: The charting page loads GET /encounter-notes/encounter/:id, selects the
--   note whose content.noteType === 'smart-charting', and restores the editor
--   from content.tiptapJson. Seed 28 creates encounters but no encounter_notes,
--   so every chart opens blank. This seed inserts one smart-charting note per
--   encounter (Chief Complaints & HPI, History, Notes, Diagnosis) plus a backing
--   encounter_diagnoses row so the Diagnosis block renders.
--
-- Idempotent: clears this patient's demo notes/diagnoses for these encounters,
-- then re-inserts. Helper functions are session-local (pg_temp).

-- ── helpers ──────────────────────────────────────────────────────────────────
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

-- ── seed ─────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_tenant  UUID := '11111111-1111-1111-1111-111111111111';
  v_patient UUID := '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
  v_author  UUID := 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee';
  r RECORD;
BEGIN
  -- Per-encounter chart content: chief/HPI, history, notes, and a primary diagnosis.
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

  ('e0000001-0000-4000-8000-000000000004',
   'New diagnosis of Stage III sigmoid colorectal adenocarcinoma.',
   'cT3 N1 M0 on staging. ECOG 0. No significant comorbidities. No regular medications.',
   'Medical oncology consult. Plan: upfront sigmoid colectomy, then adjuvant FOLFOX x12. Discussed prognosis, treatment intent (curative) and risks. Tumor board scheduled.',
   'C18.7', 'Malignant neoplasm of sigmoid colon', 'primary'),

  ('e0000001-0000-4000-8000-000000000005',
   'Elective laparoscopic sigmoid colectomy for Stage III colon cancer.',
   'cT3 N1 M0 sigmoid adenocarcinoma. Pre-operative assessment cleared.',
   'Laparoscopic sigmoid colectomy, R0 resection. Pathology: pT3 N1 (2 of 16 nodes) M0, margins clear, Stage IIIB. Uncomplicated recovery.',
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
   'Completed 12 cycles of FOLFOX in Nov 2021; no evidence of disease.',
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

  -- Clear prior demo rows for these encounters, then re-seed.
  DELETE FROM encounter_notes     WHERE patient_id = v_patient AND encounter_id IN (SELECT enc FROM _charts);
  DELETE FROM encounter_diagnoses WHERE patient_id = v_patient AND encounter_id IN (SELECT enc FROM _charts);

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
