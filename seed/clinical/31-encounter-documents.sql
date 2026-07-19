-- Seed: Encounter documents (reports) for the oncology demo journey
-- Patient: John Smith, MRN-2025-003 (7bc65ec5-ef2f-5a36-b575-7978ce5e59c0)
-- Depends on: seed/clinical/28-oncology-demo-journey.sql (encounter ids).
--
-- WHY: The Care Context "Documents" section lists encounter reports via
--   GET /patient-results/encounter/:id, which aggregates lab / imaging /
--   procedure reports (each FK'd to a clinical_order + encounter). Seed 28
--   creates none, so the section is empty. This seeds an order + a FINAL report
--   for the key diagnostic/treatment encounters.
--
-- Idempotent: clears this patient's clinical_orders (cascades to reports/items),
-- then re-inserts with stable ids.

DO $$
DECLARE
  v_tenant  UUID := '11111111-1111-1111-1111-111111111111';
  v_patient UUID := '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
  v_by      UUID := 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee';
  e2 UUID := 'e0000001-0000-4000-8000-000000000002'; -- Colonoscopy & Biopsy
  e3 UUID := 'e0000001-0000-4000-8000-000000000003'; -- Staging CT
  e5 UUID := 'e0000001-0000-4000-8000-000000000005'; -- Sigmoid colectomy
  e9 UUID := 'e0000001-0000-4000-8000-000000000009'; -- Interval labs
  e10 UUID := 'e0000001-0000-4000-8000-000000000010'; -- 1-yr surveillance CT
  e11 UUID := 'e0000001-0000-4000-8000-000000000011'; -- Routine follow-up
BEGIN
  DELETE FROM clinical_orders WHERE patient_id = v_patient; -- cascades to reports + items

  -- ── ENC-2021-0002: Colonoscopy (procedure) ──────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000002', v_tenant, e2, v_patient, 'procedure', '45380', 'CPT', 'Colonoscopy with biopsy', 'routine', 'completed', v_by, TIMESTAMPTZ '2021-02-28 08:30+00', NOW(), NOW());
  INSERT INTO procedure_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, indication, procedure_description, findings, complications, primary_performer, reported_by, reported_at, created_at, updated_at)
  VALUES ('4d000001-0000-4000-8000-000000000002', v_tenant, '0d000001-0000-4000-8000-000000000002', e2, v_patient, 'FINAL', 1,
    'Rectal bleeding and positive FOBT', 'Colonoscopy to caecum; 4 cm friable sigmoid mass at 25 cm biopsied.',
    'Near-circumferential sigmoid mass; biopsies taken. Remainder of colon normal.', 'None', v_by, v_by, TIMESTAMPTZ '2021-02-28 10:00+00', NOW(), NOW());

  -- ── ENC-2021-0003: Staging CT (imaging) ─────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000003', v_tenant, e3, v_patient, 'imaging', '74178', 'CPT', 'CT Chest/Abdomen/Pelvis with contrast', 'routine', 'completed', v_by, TIMESTAMPTZ '2021-03-09 09:00+00', NOW(), NOW());
  INSERT INTO imaging_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, modality, body_part, technique, findings, impression, critical_finding, reported_by, reported_at, created_at, updated_at)
  VALUES ('49000001-0000-4000-8000-000000000003', v_tenant, '0d000001-0000-4000-8000-000000000003', e3, v_patient, 'FINAL', 1,
    'CT', 'Chest / Abdomen / Pelvis', 'Contrast-enhanced multidetector CT',
    'Sigmoid wall thickening with regional lymphadenopathy. No hepatic or pulmonary metastases.',
    'Sigmoid colon malignancy with regional nodal involvement; no distant metastasis (cT3 N1 M0).', false, v_by, TIMESTAMPTZ '2021-03-10 12:00+00', NOW(), NOW());

  -- ── ENC-2021-0005: Sigmoid colectomy (procedure) ────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000005', v_tenant, e5, v_patient, 'procedure', '44207', 'CPT', 'Laparoscopic sigmoid colectomy', 'routine', 'completed', v_by, TIMESTAMPTZ '2021-04-10 08:00+00', NOW(), NOW());
  INSERT INTO procedure_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, indication, procedure_description, findings, complications, duration_minutes, primary_performer, reported_by, reported_at, created_at, updated_at)
  VALUES ('4d000001-0000-4000-8000-000000000005', v_tenant, '0d000001-0000-4000-8000-000000000005', e5, v_patient, 'FINAL', 1,
    'Stage III sigmoid adenocarcinoma', 'Laparoscopic sigmoid colectomy with primary anastomosis; R0 resection.',
    'Pathology pT3 N1 (2/16 nodes) M0, margins clear, Stage IIIB.', 'None', 185, v_by, v_by, TIMESTAMPTZ '2021-04-11 09:00+00', NOW(), NOW());

  -- ── ENC-2021-0009: Interval labs (lab) ──────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000009', v_tenant, e9, v_patient, 'lab', 'CBC-CEA', 'LOINC', 'CBC + CEA panel', 'routine', 'completed', v_by, TIMESTAMPTZ '2021-08-15 08:00+00', NOW(), NOW());
  INSERT INTO lab_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, specimen_type, reported_by, reported_at, created_at, updated_at)
  VALUES ('1a000001-0000-4000-8000-000000000009', v_tenant, '0d000001-0000-4000-8000-000000000009', e9, v_patient, 'FINAL', 1, 'Whole blood / serum', v_by, TIMESTAMPTZ '2021-08-15 14:00+00', NOW(), NOW());
  INSERT INTO lab_result_items (id, tenant_id, lab_report_id, sort_order, test_code, code_system, test_name, value_numeric, unit, ref_range_low, ref_range_high, abnormal_flag, critical_flag, created_at, updated_at) VALUES
    (gen_random_uuid(), v_tenant, '1a000001-0000-4000-8000-000000000009', 1, '83085-1', 'LOINC', 'CEA',           3.2, 'ng/mL', 0,   5,    false, false, NOW(), NOW()),
    (gen_random_uuid(), v_tenant, '1a000001-0000-4000-8000-000000000009', 2, '718-7',  'LOINC', 'Haemoglobin',  10.4, 'g/dL',  13,  17,   true,  false, NOW(), NOW()),
    (gen_random_uuid(), v_tenant, '1a000001-0000-4000-8000-000000000009', 3, '751-8',  'LOINC', 'Neutrophils',   1.3, 'x10^9/L', 2, 7,  true,  false, NOW(), NOW());

  -- ── ENC-2022-0001: 1-year surveillance CT (imaging) ─────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000010', v_tenant, e10, v_patient, 'imaging', '74178', 'CPT', 'CT Chest/Abdomen/Pelvis (surveillance)', 'routine', 'completed', v_by, TIMESTAMPTZ '2022-04-09 09:00+00', NOW(), NOW());
  INSERT INTO imaging_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, modality, body_part, technique, findings, impression, critical_finding, reported_by, reported_at, created_at, updated_at)
  VALUES ('49000001-0000-4000-8000-000000000010', v_tenant, '0d000001-0000-4000-8000-000000000010', e10, v_patient, 'FINAL', 1,
    'CT', 'Chest / Abdomen / Pelvis', 'Contrast-enhanced surveillance CT',
    'Post-surgical changes in the sigmoid colon. No local recurrence, lymphadenopathy or metastasis.',
    'No evidence of recurrent or metastatic disease at 1 year.', false, v_by, TIMESTAMPTZ '2022-04-10 11:00+00', NOW(), NOW());

  -- ── ENC-2025-0001: Follow-up CEA (lab) ──────────────────────────────────────
  INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name, priority, status, ordered_by, ordered_at, created_at, updated_at)
  VALUES ('0d000001-0000-4000-8000-000000000011', v_tenant, e11, v_patient, 'lab', 'CEA', 'LOINC', 'CEA (surveillance)', 'routine', 'completed', v_by, TIMESTAMPTZ '2025-06-20 08:00+00', NOW(), NOW());
  INSERT INTO lab_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, specimen_type, reported_by, reported_at, created_at, updated_at)
  VALUES ('1a000001-0000-4000-8000-000000000011', v_tenant, '0d000001-0000-4000-8000-000000000011', e11, v_patient, 'FINAL', 1, 'Serum', v_by, TIMESTAMPTZ '2025-06-20 13:00+00', NOW(), NOW());
  INSERT INTO lab_result_items (id, tenant_id, lab_report_id, sort_order, test_code, code_system, test_name, value_numeric, unit, ref_range_low, ref_range_high, abnormal_flag, critical_flag, created_at, updated_at) VALUES
    (gen_random_uuid(), v_tenant, '1a000001-0000-4000-8000-000000000011', 1, '83085-1', 'LOINC', 'CEA', 2.0, 'ng/mL', 0, 5, false, false, NOW(), NOW());
END $$;
