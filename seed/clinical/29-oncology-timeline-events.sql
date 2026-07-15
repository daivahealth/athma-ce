-- Seed: Oncology cancer-timeline events for the demo journey
-- Patient: John Smith, MRN-2025-003 (7bc65ec5-ef2f-5a36-b575-7978ce5e59c0)
-- Depends on: seed/clinical/28-oncology-demo-journey.sql (uses the same
--   cancer_diagnosis_id d0000001-...0001 so chemo grouping + deep-links align).
--
-- WHY THIS EXISTS:
--   The Cancer Timeline page (GET /plugins/oncology/timeline/:patientId) reads
--   ONLY from plugin_oncology.cancer_timeline_events. In production those rows
--   are emitted by the service's logTimelineEvent() after each clinical write.
--   Seed 28 writes the registry tables via raw SQL, so no timeline events are
--   produced and the timeline renders empty. This seed populates the timeline
--   directly to mirror the 5-year Stage IIIB colorectal journey.
--
-- Idempotent: clears this patient's timeline, then re-inserts.

DO $$
DECLARE
  v_tenant   UUID := '11111111-1111-1111-1111-111111111111';
  v_patient  UUID := '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
  v_diag     UUID := 'd0000001-0000-4000-8000-000000000001';
  v_by       UUID := 'aebba554-5fff-5daf-966c-713ea9f34426'; -- treating oncologist
BEGIN
  DELETE FROM plugin_oncology.cancer_timeline_events WHERE patient_id = v_patient;

  -- Milestone events (diagnosis → staging → tumor board → care plan → surgery → response → surveillance)
  INSERT INTO plugin_oncology.cancer_timeline_events
    (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, metadata, severity, created_by, created_at)
  VALUES
    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'diagnosis',        TIMESTAMPTZ '2021-02-28 09:00+00',
       'Colorectal adenocarcinoma diagnosed',
       'Sigmoid colon adenocarcinoma, moderately differentiated (G2), ICD-O C18.9. Confirmed on colonoscopic biopsy.',
       'cancer_diagnosis',
       jsonb_build_object('cancerType','Colorectal','primarySite','Sigmoid colon','clinicalStatus','active','metastaticStatus','M0'),
       'milestone', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'staging',          TIMESTAMPTZ '2021-03-10 10:00+00',
       'Clinical staging — cT3 N1 M0 (Stage III)',
       'AJCC 8th ed. clinical stage III based on staging CT chest/abdomen/pelvis.',
       'tumor_staging',
       jsonb_build_object('stagingSystem','AJCC8','stageGroup','III','tCategory','cT3','nCategory','N1','mCategory','M0'),
       'info', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'tumor_board',      TIMESTAMPTZ '2021-03-20 14:00+00',
       'Tumor board — curative intent',
       'MDT recommendation: upfront sigmoid colectomy followed by adjuvant FOLFOX x12.',
       'tumor_board_case',
       jsonb_build_object('treatmentIntent','curative'),
       'milestone', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'care_plan_created', TIMESTAMPTZ '2021-03-25 09:00+00',
       'Care plan CP-2021-0001 created',
       'Curative-intent plan: sigmoid colectomy plus adjuvant chemotherapy.',
       'oncology_care_plan',
       jsonb_build_object('planNumber','CP-2021-0001','treatmentIntent','curative'),
       'info', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'care_plan_approved', TIMESTAMPTZ '2021-03-28 09:00+00',
       'Care plan approved',
       'Approved by surgical and medical oncology.',
       'oncology_care_plan',
       jsonb_build_object('planNumber','CP-2021-0001'),
       'info', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'custom',           TIMESTAMPTZ '2021-04-10 08:00+00',
       'Laparoscopic sigmoid colectomy',
       'R0 resection. Pathology pT3 N1 (2/16 nodes) M0, margins clear.',
       'manual',
       jsonb_build_object('category','surgery'),
       'milestone', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'staging',          TIMESTAMPTZ '2021-04-20 11:00+00',
       'Pathologic staging — pT3 N1 M0 (Stage IIIB)',
       'Post-operative AJCC 8th ed. pathologic stage IIIB.',
       'tumor_staging',
       jsonb_build_object('stagingSystem','AJCC8','stageGroup','IIIB','tCategory','pT3','nCategory','N1','mCategory','M0'),
       'info', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'response_assessment', TIMESTAMPTZ '2021-11-15 10:00+00',
       'Adjuvant therapy complete — NED',
       'Completed 12 cycles of FOLFOX. Post-treatment imaging shows no evidence of disease; CEA normalised (2.1).',
       'manual',
       jsonb_build_object('category','response'),
       'milestone', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'follow_up',        TIMESTAMPTZ '2022-04-10 09:30+00',
       '1-year surveillance — NED',
       'Surveillance CT: no recurrence. CEA 2.1.',
       'manual', '{}'::jsonb, 'info', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'follow_up',        TIMESTAMPTZ '2023-04-12 09:30+00',
       '2-year surveillance — NED',
       'Colonoscopy clear; CEA 1.9.',
       'manual', '{}'::jsonb, 'info', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'follow_up',        TIMESTAMPTZ '2024-04-15 09:30+00',
       '3-year surveillance — NED',
       'CT surveillance stable; CEA 2.0.',
       'manual', '{}'::jsonb, 'info', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'follow_up',        TIMESTAMPTZ '2025-06-20 10:00+00',
       'Routine oncology follow-up — NED',
       'CEA 2.0 stable; diabetes/HTN controlled; vitals within normal limits.',
       'manual', '{}'::jsonb, 'info', v_by, NOW()),

    (gen_random_uuid(), v_tenant, v_patient, v_diag, 'follow_up',        TIMESTAMPTZ '2026-09-15 15:30+00',
       'Surveillance imaging scheduled',
       'Annual surveillance CT + CEA planned.',
       'manual', '{}'::jsonb, 'info', v_by, NOW());

  -- Adjuvant FOLFOX x12 — biweekly completed cycles. Same protocol + diagnosis so
  -- the timeline groups them into one collapsible "FOLFOX" node (needs >=2 cycles).
  INSERT INTO plugin_oncology.cancer_timeline_events
    (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, metadata, severity, created_by, created_at)
  SELECT
    gen_random_uuid(), v_tenant, v_patient, v_diag, 'chemo_completed',
    (DATE '2021-05-05' + ((n - 1) * 14))::timestamptz + TIME '09:00',
    'FOLFOX cycle ' || n || '/12 completed',
    CASE WHEN n = 3
      THEN 'mFOLFOX6 cycle 3 administered; grade 1 neutropenia, oxaliplatin dose maintained.'
      ELSE 'mFOLFOX6 cycle ' || n || ' administered; tolerated well.'
    END,
    'chemo_order',
    jsonb_build_object('protocol','FOLFOX','cycleNumber',n,'dayNumber',1,'bsa',1.92,'protocolTotalCycles',12),
    CASE WHEN n = 3 THEN 'warning' ELSE 'info' END,
    v_by, NOW()
  FROM generate_series(1, 12) AS n;
END $$;
