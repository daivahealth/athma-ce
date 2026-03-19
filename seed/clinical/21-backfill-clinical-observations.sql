-- ============================================================================
-- Backfill Clinical Observations from Existing Triage Data
-- Run once to populate clinical_observations from existing triage vital signs
-- ============================================================================

-- Helper function to interpret a value against reference ranges
CREATE OR REPLACE FUNCTION _interpret_value(val NUMERIC, ref_low NUMERIC, ref_high NUMERIC)
RETURNS VARCHAR(20) AS $$
BEGIN
  IF ref_low IS NULL AND ref_high IS NULL THEN RETURN NULL; END IF;
  IF ref_low IS NOT NULL AND val < ref_low THEN
    IF val < ref_low * 0.8 THEN RETURN 'critical_low'; END IF;
    RETURN 'low';
  END IF;
  IF ref_high IS NOT NULL AND val > ref_high THEN
    IF val > ref_high * 1.2 THEN RETURN 'critical_high'; END IF;
    RETURN 'high';
  END IF;
  RETURN 'normal';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Backfill Heart Rate from triage.vital_signs
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id,
  code, code_system, display_name, display_name_ar, category,
  value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, source_id,
  created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  t.tenant_id,
  t.patient_id,
  t.encounter_id,
  '8867-4', 'LOINC', 'Heart Rate', 'معدل ضربات القلب', 'vital-signs',
  (t.vital_signs->>'heartRate')::NUMERIC,
  'bpm', 60, 100,
  _interpret_value((t.vital_signs->>'heartRate')::NUMERIC, 60, 100),
  COALESCE(t.triage_time, t.created_at),
  t.triage_staff_id,
  'triage',
  t.id,
  NOW(), NOW()
FROM triages t
WHERE t.vital_signs->>'heartRate' IS NOT NULL
  AND (t.vital_signs->>'heartRate')::NUMERIC > 0
ON CONFLICT DO NOTHING;

-- Backfill Systolic BP
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id,
  code, code_system, display_name, display_name_ar, category,
  value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, source_id,
  created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  t.tenant_id, t.patient_id, t.encounter_id,
  '8480-6', 'LOINC', 'Systolic Blood Pressure', 'ضغط الدم الانقباضي', 'vital-signs',
  (t.vital_signs->>'systolicBP')::NUMERIC,
  'mmHg', 90, 140,
  _interpret_value((t.vital_signs->>'systolicBP')::NUMERIC, 90, 140),
  COALESCE(t.triage_time, t.created_at),
  t.triage_staff_id, 'triage', t.id,
  NOW(), NOW()
FROM triages t
WHERE t.vital_signs->>'systolicBP' IS NOT NULL
  AND (t.vital_signs->>'systolicBP')::NUMERIC > 0
ON CONFLICT DO NOTHING;

-- Backfill Diastolic BP
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id,
  code, code_system, display_name, display_name_ar, category,
  value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, source_id,
  created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  t.tenant_id, t.patient_id, t.encounter_id,
  '8462-4', 'LOINC', 'Diastolic Blood Pressure', 'ضغط الدم الانبساطي', 'vital-signs',
  (t.vital_signs->>'diastolicBP')::NUMERIC,
  'mmHg', 60, 90,
  _interpret_value((t.vital_signs->>'diastolicBP')::NUMERIC, 60, 90),
  COALESCE(t.triage_time, t.created_at),
  t.triage_staff_id, 'triage', t.id,
  NOW(), NOW()
FROM triages t
WHERE t.vital_signs->>'diastolicBP' IS NOT NULL
  AND (t.vital_signs->>'diastolicBP')::NUMERIC > 0
ON CONFLICT DO NOTHING;

-- Backfill Temperature (normalize to Celsius)
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id,
  code, code_system, display_name, display_name_ar, category,
  value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, source_id,
  created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  t.tenant_id, t.patient_id, t.encounter_id,
  '8310-5', 'LOINC', 'Body Temperature', 'درجة حرارة الجسم', 'vital-signs',
  CASE
    WHEN t.vital_signs->>'temperatureUnit' = 'fahrenheit'
    THEN ROUND(((t.vital_signs->>'temperature')::NUMERIC - 32) * 5.0 / 9.0, 1)
    ELSE (t.vital_signs->>'temperature')::NUMERIC
  END,
  '°C', 36.1, 37.2,
  _interpret_value(
    CASE
      WHEN t.vital_signs->>'temperatureUnit' = 'fahrenheit'
      THEN ROUND(((t.vital_signs->>'temperature')::NUMERIC - 32) * 5.0 / 9.0, 1)
      ELSE (t.vital_signs->>'temperature')::NUMERIC
    END,
    36.1, 37.2
  ),
  COALESCE(t.triage_time, t.created_at),
  t.triage_staff_id, 'triage', t.id,
  NOW(), NOW()
FROM triages t
WHERE t.vital_signs->>'temperature' IS NOT NULL
  AND (t.vital_signs->>'temperature')::NUMERIC > 0
ON CONFLICT DO NOTHING;

-- Backfill Respiratory Rate
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id,
  code, code_system, display_name, display_name_ar, category,
  value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, source_id,
  created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  t.tenant_id, t.patient_id, t.encounter_id,
  '9279-1', 'LOINC', 'Respiratory Rate', 'معدل التنفس', 'vital-signs',
  (t.vital_signs->>'respiratoryRate')::NUMERIC,
  '/min', 12, 20,
  _interpret_value((t.vital_signs->>'respiratoryRate')::NUMERIC, 12, 20),
  COALESCE(t.triage_time, t.created_at),
  t.triage_staff_id, 'triage', t.id,
  NOW(), NOW()
FROM triages t
WHERE t.vital_signs->>'respiratoryRate' IS NOT NULL
  AND (t.vital_signs->>'respiratoryRate')::NUMERIC > 0
ON CONFLICT DO NOTHING;

-- Backfill Oxygen Saturation
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id,
  code, code_system, display_name, display_name_ar, category,
  value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, source_id,
  created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  t.tenant_id, t.patient_id, t.encounter_id,
  '2708-6', 'LOINC', 'Oxygen Saturation (SpO2)', 'تشبع الأكسجين', 'vital-signs',
  (t.vital_signs->>'oxygenSaturation')::NUMERIC,
  '%', 95, 100,
  _interpret_value((t.vital_signs->>'oxygenSaturation')::NUMERIC, 95, 100),
  COALESCE(t.triage_time, t.created_at),
  t.triage_staff_id, 'triage', t.id,
  NOW(), NOW()
FROM triages t
WHERE t.vital_signs->>'oxygenSaturation' IS NOT NULL
  AND (t.vital_signs->>'oxygenSaturation')::NUMERIC > 0
ON CONFLICT DO NOTHING;

-- Backfill Weight (normalize to kg)
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id,
  code, code_system, display_name, display_name_ar, category,
  value_numeric, unit,
  observed_at, observed_by, source_type, source_id,
  created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  t.tenant_id, t.patient_id, t.encounter_id,
  '29463-7', 'LOINC', 'Body Weight', 'وزن الجسم', 'vital-signs',
  CASE
    WHEN t.vital_signs->>'weightUnit' = 'lbs'
    THEN ROUND((t.vital_signs->>'weight')::NUMERIC * 0.453592, 1)
    ELSE (t.vital_signs->>'weight')::NUMERIC
  END,
  'kg',
  COALESCE(t.triage_time, t.created_at),
  t.triage_staff_id, 'triage', t.id,
  NOW(), NOW()
FROM triages t
WHERE t.vital_signs->>'weight' IS NOT NULL
  AND (t.vital_signs->>'weight')::NUMERIC > 0
ON CONFLICT DO NOTHING;

-- Backfill Height (normalize to cm)
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id,
  code, code_system, display_name, display_name_ar, category,
  value_numeric, unit,
  observed_at, observed_by, source_type, source_id,
  created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  t.tenant_id, t.patient_id, t.encounter_id,
  '8302-2', 'LOINC', 'Body Height', 'طول الجسم', 'vital-signs',
  CASE
    WHEN t.vital_signs->>'heightUnit' = 'in'
    THEN ROUND((t.vital_signs->>'height')::NUMERIC * 2.54, 1)
    ELSE (t.vital_signs->>'height')::NUMERIC
  END,
  'cm',
  COALESCE(t.triage_time, t.created_at),
  t.triage_staff_id, 'triage', t.id,
  NOW(), NOW()
FROM triages t
WHERE t.vital_signs->>'height' IS NOT NULL
  AND (t.vital_signs->>'height')::NUMERIC > 0
ON CONFLICT DO NOTHING;

-- Backfill BMI
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id,
  code, code_system, display_name, display_name_ar, category,
  value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, source_id,
  created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  t.tenant_id, t.patient_id, t.encounter_id,
  '39156-5', 'LOINC', 'Body Mass Index (BMI)', 'مؤشر كتلة الجسم', 'vital-signs',
  (t.vital_signs->>'bmi')::NUMERIC,
  'kg/m2', 18.5, 24.9,
  _interpret_value((t.vital_signs->>'bmi')::NUMERIC, 18.5, 24.9),
  COALESCE(t.triage_time, t.created_at),
  t.triage_staff_id, 'triage', t.id,
  NOW(), NOW()
FROM triages t
WHERE t.vital_signs->>'bmi' IS NOT NULL
  AND (t.vital_signs->>'bmi')::NUMERIC > 0
ON CONFLICT DO NOTHING;

-- Backfill Blood Glucose (normalize to mg/dL)
INSERT INTO clinical_observations (
  id, tenant_id, patient_id, encounter_id,
  code, code_system, display_name, display_name_ar, category,
  value_numeric, unit, ref_range_low, ref_range_high, interpretation,
  observed_at, observed_by, source_type, source_id,
  created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  t.tenant_id, t.patient_id, t.encounter_id,
  '2345-7', 'LOINC', 'Blood Glucose', 'سكر الدم', 'vital-signs',
  CASE
    WHEN t.vital_signs->>'bloodGlucoseUnit' = 'mmol/L'
    THEN ROUND((t.vital_signs->>'bloodGlucose')::NUMERIC * 18.0182, 1)
    ELSE (t.vital_signs->>'bloodGlucose')::NUMERIC
  END,
  'mg/dL', 70, 100,
  _interpret_value(
    CASE
      WHEN t.vital_signs->>'bloodGlucoseUnit' = 'mmol/L'
      THEN ROUND((t.vital_signs->>'bloodGlucose')::NUMERIC * 18.0182, 1)
      ELSE (t.vital_signs->>'bloodGlucose')::NUMERIC
    END,
    70, 100
  ),
  COALESCE(t.triage_time, t.created_at),
  t.triage_staff_id, 'triage', t.id,
  NOW(), NOW()
FROM triages t
WHERE t.vital_signs->>'bloodGlucose' IS NOT NULL
  AND (t.vital_signs->>'bloodGlucose')::NUMERIC > 0
ON CONFLICT DO NOTHING;

-- Clean up helper function
DROP FUNCTION IF EXISTS _interpret_value(NUMERIC, NUMERIC, NUMERIC);

-- Report backfill results
SELECT category, COUNT(*) as observation_count
FROM clinical_observations
GROUP BY category
ORDER BY category;
