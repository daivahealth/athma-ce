-- Seed: Recent biomarker results for the oncology demo patient
-- Patient: John Smith, MRN-2025-003 (7bc65ec5-ef2f-5a36-b575-7978ce5e59c0)
--
-- WHY: The Care Context rail shows a "Biomarkers" section only when the patient
--   has biomarker results within the past 3 months (GET
--   /wellness/biomarkers/results/patient/:id). Seeds a recent metabolic /
--   cardiovascular panel so the section renders. collected_at is relative to
--   NOW() so the data stays inside the 3-month window whenever the seed is run.
--
-- Idempotent: clears this patient's results, then re-inserts.

DO $$
DECLARE
  v_tenant  UUID := '11111111-1111-1111-1111-111111111111';
  v_patient UUID := '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
  v_by      UUID := 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee';
  -- biomarker_definitions ids (from seed):
  d_hba1c    UUID := 'bbf490f3-ec28-4fba-8a80-43858ca5c75e';
  d_glucose  UUID := 'fca856c5-a95b-4a3c-9392-44a34183ca0e';
  d_ldl      UUID := '5e7bc783-7b62-47ea-80aa-ba9d76c8077e';
  d_hdl      UUID := '89720232-d82a-4f5b-b51c-e1c9ecfcc858';
  d_tg       UUID := '8aced26d-870a-48d8-941c-a46811ddc90a';
  d_tchol    UUID := 'b93a065e-77da-471e-9c78-fc7d0583104c';
  d_vitd     UUID := 'b6bf6c2b-339d-4009-8388-9d47062b9e1c';
  d_crp      UUID := '01b4a0e7-d716-44cd-9a5a-5b7f26551a3b';
BEGIN
  DELETE FROM biomarker_results WHERE patient_id = v_patient;

  INSERT INTO biomarker_results
    (id, tenant_id, patient_id, biomarker_id, value, unit, reference_min, reference_max,
     optimal_min, optimal_max, interpretation, source, collected_at, previous_value,
     change_percent, trend_direction, created_at, created_by)
  VALUES
    -- Metabolic (most recent panel, ~3 weeks ago)
    (gen_random_uuid(), v_tenant, v_patient, d_hba1c,   7.6, '%',     4.0, 5.6, 4.0, 5.4, 'high',       'lab', NOW() - INTERVAL '21 days', 8.4, -9.5,  'improving', NOW(), v_by),
    (gen_random_uuid(), v_tenant, v_patient, d_glucose, 138, 'mg/dL', 70,  99,  70,  90,  'high',       'lab', NOW() - INTERVAL '21 days', 152, -9.2,  'improving', NOW(), v_by),
    -- Inflammatory
    (gen_random_uuid(), v_tenant, v_patient, d_crp,     2.4, 'mg/L',  0,   3.0, 0,   1.0, 'borderline', 'lab', NOW() - INTERVAL '21 days', 2.8, -14.3, 'improving', NOW(), v_by),
    -- Cardiovascular lipid panel (~7 weeks ago)
    (gen_random_uuid(), v_tenant, v_patient, d_ldl,     108, 'mg/dL', 0,   100, 0,   70,  'high',       'lab', NOW() - INTERVAL '49 days', 122, -11.5, 'improving', NOW(), v_by),
    (gen_random_uuid(), v_tenant, v_patient, d_hdl,     44,  'mg/dL', 40,  200, 60,  200, 'normal',     'lab', NOW() - INTERVAL '49 days', 41,  7.3,   'improving', NOW(), v_by),
    (gen_random_uuid(), v_tenant, v_patient, d_tg,      172, 'mg/dL', 0,   150, 0,   100, 'high',       'lab', NOW() - INTERVAL '49 days', 190, -9.5,  'improving', NOW(), v_by),
    (gen_random_uuid(), v_tenant, v_patient, d_tchol,   198, 'mg/dL', 0,   200, 0,   180, 'normal',     'lab', NOW() - INTERVAL '49 days', 210, -5.7,  'improving', NOW(), v_by),
    -- Nutrient (~11 weeks ago)
    (gen_random_uuid(), v_tenant, v_patient, d_vitd,    26,  'ng/mL', 30,  100, 40,  80,  'low',        'lab', NOW() - INTERVAL '77 days', 22,  18.2,  'improving', NOW(), v_by);
END $$;
