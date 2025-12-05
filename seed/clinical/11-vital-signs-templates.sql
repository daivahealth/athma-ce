-- ============================================================================
-- VITAL SIGNS TEMPLATES SEED DATA
-- ============================================================================
-- Configurable vital signs templates for different care settings, age groups,
-- and specialties. Each template defines which vitals to capture and their
-- validation rules.
-- ============================================================================

\echo '💓 Seeding vital signs templates...'

-- Truncate existing data
TRUNCATE TABLE vital_signs_templates CASCADE;

-- ============================================================================
-- 1. DEFAULT OPD VITALS (Adult - General Medicine & Cardiology)
-- ============================================================================

INSERT INTO vital_signs_templates (
  id,
  tenant_id,
  template_code,
  version,
  name,
  description,
  care_setting,
  age_group,
  specialties,
  groups,
  is_active,
  is_default,
  created_at,
  updated_at
) VALUES (
  '60000000-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'default_opd_vitals',
  1,
  '{"en": "Default OPD Vitals", "ar": "العلامات الحيوية للعيادات الخارجية"}',
  '{"en": "Standard vital signs for adult outpatient consultations", "ar": "العلامات الحيوية القياسية لمراجعات العيادات الخارجية للبالغين"}',
  ARRAY['OPD', 'ER']::text[],
  ARRAY['adult']::text[],
  ARRAY['GEN_MED', 'CARDIO']::text[],
  '[
    {
      "id": "basic_vitals",
      "label": {"en": "Basic Vitals", "ar": "العلامات الحيوية الأساسية"},
      "sortOrder": 1,
      "items": [
        {
          "id": "heart_rate",
          "code": "HR",
          "loincCode": "8867-4",
          "type": "number",
          "label": {"en": "Heart Rate", "ar": "معدل ضربات القلب"},
          "unitOptions": ["bpm"],
          "defaultUnit": "bpm",
          "minValue": 30,
          "maxValue": 220,
          "normalRange": {"min": 60, "max": 100},
          "decimals": 0,
          "required": true,
          "sortOrder": 1,
          "captureTimeRequired": true
        },
        {
          "id": "systolic_bp",
          "code": "SBP",
          "loincCode": "8480-6",
          "type": "number",
          "label": {"en": "Systolic BP", "ar": "الضغط الانقباضي"},
          "unitOptions": ["mmHg"],
          "defaultUnit": "mmHg",
          "minValue": 60,
          "maxValue": 260,
          "normalRange": {"min": 90, "max": 140},
          "decimals": 0,
          "required": true,
          "sortOrder": 2,
          "captureTimeRequired": true,
          "displayWith": "diastolic_bp"
        },
        {
          "id": "diastolic_bp",
          "code": "DBP",
          "loincCode": "8462-4",
          "type": "number",
          "label": {"en": "Diastolic BP", "ar": "الضغط الانبساطي"},
          "unitOptions": ["mmHg"],
          "defaultUnit": "mmHg",
          "minValue": 30,
          "maxValue": 160,
          "normalRange": {"min": 60, "max": 90},
          "decimals": 0,
          "required": true,
          "sortOrder": 3,
          "captureTimeRequired": true
        },
        {
          "id": "temperature",
          "code": "TEMP",
          "loincCode": "8310-5",
          "type": "number",
          "label": {"en": "Temperature", "ar": "درجة الحرارة"},
          "unitOptions": ["°C", "°F"],
          "defaultUnit": "°C",
          "minValue": 32,
          "maxValue": 45,
          "normalRange": {"min": 36.1, "max": 37.2},
          "decimals": 1,
          "required": true,
          "sortOrder": 4,
          "captureTimeRequired": false
        },
        {
          "id": "respiratory_rate",
          "code": "RR",
          "loincCode": "9279-1",
          "type": "number",
          "label": {"en": "Respiratory Rate", "ar": "معدل التنفس"},
          "unitOptions": ["breaths/min"],
          "defaultUnit": "breaths/min",
          "minValue": 8,
          "maxValue": 50,
          "normalRange": {"min": 12, "max": 20},
          "decimals": 0,
          "required": false,
          "sortOrder": 5,
          "captureTimeRequired": false
        },
        {
          "id": "oxygen_saturation",
          "code": "SPO2",
          "loincCode": "2708-6",
          "type": "number",
          "label": {"en": "Oxygen Saturation (SpO2)", "ar": "تشبع الأكسجين"},
          "unitOptions": ["%"],
          "defaultUnit": "%",
          "minValue": 70,
          "maxValue": 100,
          "normalRange": {"min": 95, "max": 100},
          "decimals": 0,
          "required": false,
          "sortOrder": 6,
          "captureTimeRequired": false
        }
      ]
    },
    {
      "id": "anthropometrics",
      "label": {"en": "Anthropometrics", "ar": "القياسات الجسدية"},
      "sortOrder": 2,
      "items": [
        {
          "id": "height_cm",
          "code": "HT",
          "loincCode": "8302-2",
          "type": "number",
          "label": {"en": "Height", "ar": "الطول"},
          "unitOptions": ["cm", "m", "ft"],
          "defaultUnit": "cm",
          "minValue": 40,
          "maxValue": 250,
          "decimals": 1,
          "required": false,
          "sortOrder": 1
        },
        {
          "id": "weight_kg",
          "code": "WT",
          "loincCode": "29463-7",
          "type": "number",
          "label": {"en": "Weight", "ar": "الوزن"},
          "unitOptions": ["kg", "lbs"],
          "defaultUnit": "kg",
          "minValue": 0.5,
          "maxValue": 500,
          "decimals": 1,
          "required": false,
          "sortOrder": 2
        },
        {
          "id": "bmi",
          "code": "BMI",
          "loincCode": "39156-5",
          "type": "calculated",
          "label": {"en": "BMI", "ar": "مؤشر كتلة الجسم"},
          "unitOptions": ["kg/m²"],
          "defaultUnit": "kg/m²",
          "decimals": 1,
          "formula": "weight_kg / ((height_cm/100) ^ 2)",
          "dependsOn": ["weight_kg", "height_cm"],
          "readOnly": true,
          "sortOrder": 3,
          "normalRange": {"min": 18.5, "max": 24.9}
        }
      ]
    }
  ]'::jsonb,
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. PEDIATRIC VITALS (Children - General Pediatrics)
-- ============================================================================

INSERT INTO vital_signs_templates (
  id,
  tenant_id,
  template_code,
  version,
  name,
  description,
  care_setting,
  age_group,
  specialties,
  groups,
  is_active,
  is_default,
  created_at,
  updated_at
) VALUES (
  '60000000-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'pediatric_vitals',
  1,
  '{"en": "Pediatric Vitals", "ar": "العلامات الحيوية للأطفال"}',
  '{"en": "Vital signs optimized for children aged 1-12 years", "ar": "العلامات الحيوية المحسّنة للأطفال من عمر 1-12 سنة"}',
  ARRAY['OPD', 'ER', 'IPD']::text[],
  ARRAY['child']::text[],
  ARRAY['PEDIATRICS']::text[],
  '[
    {
      "id": "basic_vitals",
      "label": {"en": "Basic Vitals", "ar": "العلامات الحيوية الأساسية"},
      "sortOrder": 1,
      "items": [
        {
          "id": "heart_rate",
          "code": "HR",
          "loincCode": "8867-4",
          "type": "number",
          "label": {"en": "Heart Rate", "ar": "معدل ضربات القلب"},
          "unitOptions": ["bpm"],
          "defaultUnit": "bpm",
          "minValue": 60,
          "maxValue": 160,
          "normalRange": {"min": 70, "max": 120},
          "decimals": 0,
          "required": true,
          "sortOrder": 1
        },
        {
          "id": "systolic_bp",
          "code": "SBP",
          "loincCode": "8480-6",
          "type": "number",
          "label": {"en": "Systolic BP", "ar": "الضغط الانقباضي"},
          "unitOptions": ["mmHg"],
          "defaultUnit": "mmHg",
          "minValue": 70,
          "maxValue": 140,
          "normalRange": {"min": 90, "max": 110},
          "decimals": 0,
          "required": true,
          "sortOrder": 2,
          "displayWith": "diastolic_bp"
        },
        {
          "id": "diastolic_bp",
          "code": "DBP",
          "loincCode": "8462-4",
          "type": "number",
          "label": {"en": "Diastolic BP", "ar": "الضغط الانبساطي"},
          "unitOptions": ["mmHg"],
          "defaultUnit": "mmHg",
          "minValue": 40,
          "maxValue": 90,
          "normalRange": {"min": 50, "max": 70},
          "decimals": 0,
          "required": true,
          "sortOrder": 3
        },
        {
          "id": "temperature",
          "code": "TEMP",
          "loincCode": "8310-5",
          "type": "number",
          "label": {"en": "Temperature", "ar": "درجة الحرارة"},
          "unitOptions": ["°C", "°F"],
          "defaultUnit": "°C",
          "minValue": 35,
          "maxValue": 42,
          "normalRange": {"min": 36.5, "max": 37.5"},
          "decimals": 1,
          "required": true,
          "sortOrder": 4
        },
        {
          "id": "respiratory_rate",
          "code": "RR",
          "loincCode": "9279-1",
          "type": "number",
          "label": {"en": "Respiratory Rate", "ar": "معدل التنفس"},
          "unitOptions": ["breaths/min"],
          "defaultUnit": "breaths/min",
          "minValue": 12,
          "maxValue": 40,
          "normalRange": {"min": 18, "max": 30},
          "decimals": 0,
          "required": true,
          "sortOrder": 5
        }
      ]
    },
    {
      "id": "anthropometrics",
      "label": {"en": "Growth Parameters", "ar": "معايير النمو"},
      "sortOrder": 2,
      "items": [
        {
          "id": "height_cm",
          "code": "HT",
          "loincCode": "8302-2",
          "type": "number",
          "label": {"en": "Height", "ar": "الطول"},
          "unitOptions": ["cm"],
          "defaultUnit": "cm",
          "minValue": 50,
          "maxValue": 180,
          "decimals": 1,
          "required": true,
          "sortOrder": 1
        },
        {
          "id": "weight_kg",
          "code": "WT",
          "loincCode": "29463-7",
          "type": "number",
          "label": {"en": "Weight", "ar": "الوزن"},
          "unitOptions": ["kg"],
          "defaultUnit": "kg",
          "minValue": 5,
          "maxValue": 100,
          "decimals": 1,
          "required": true,
          "sortOrder": 2
        },
        {
          "id": "head_circumference",
          "code": "HC",
          "loincCode": "9843-4",
          "type": "number",
          "label": {"en": "Head Circumference", "ar": "محيط الرأس"},
          "unitOptions": ["cm"],
          "defaultUnit": "cm",
          "minValue": 30,
          "maxValue": 65,
          "decimals": 1,
          "required": false,
          "sortOrder": 3,
          "metadata": {"recommendedFor": ["under5"]}
        }
      ]
    }
  ]'::jsonb,
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. ICU COMPREHENSIVE VITALS (All ages - Critical Care)
-- ============================================================================

INSERT INTO vital_signs_templates (
  id,
  tenant_id,
  template_code,
  version,
  name,
  description,
  care_setting,
  age_group,
  specialties,
  groups,
  is_active,
  is_default,
  created_at,
  updated_at
) VALUES (
  '60000000-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  'icu_comprehensive_vitals',
  1,
  '{"en": "ICU Comprehensive Vitals", "ar": "العلامات الحيوية الشاملة للعناية المركزة"}',
  '{"en": "Detailed vital signs monitoring for ICU patients", "ar": "مراقبة تفصيلية للعلامات الحيوية لمرضى العناية المركزة"}',
  ARRAY['ICU']::text[],
  ARRAY['adult', 'child', 'elderly']::text[],
  ARRAY['CRITICAL_CARE', 'CARDIO', 'PULMONOLOGY']::text[],
  '[
    {
      "id": "hemodynamics",
      "label": {"en": "Hemodynamics", "ar": "الديناميكا الدموية"},
      "sortOrder": 1,
      "items": [
        {
          "id": "heart_rate",
          "code": "HR",
          "loincCode": "8867-4",
          "type": "number",
          "label": {"en": "Heart Rate", "ar": "معدل ضربات القلب"},
          "unitOptions": ["bpm"],
          "defaultUnit": "bpm",
          "minValue": 20,
          "maxValue": 220,
          "normalRange": {"min": 60, "max": 100},
          "decimals": 0,
          "required": true,
          "sortOrder": 1,
          "captureTimeRequired": true
        },
        {
          "id": "systolic_bp",
          "code": "SBP",
          "loincCode": "8480-6",
          "type": "number",
          "label": {"en": "Systolic BP", "ar": "الضغط الانقباضي"},
          "unitOptions": ["mmHg"],
          "defaultUnit": "mmHg",
          "minValue": 40,
          "maxValue": 280,
          "normalRange": {"min": 90, "max": 140},
          "decimals": 0,
          "required": true,
          "sortOrder": 2,
          "displayWith": "diastolic_bp"
        },
        {
          "id": "diastolic_bp",
          "code": "DBP",
          "loincCode": "8462-4",
          "type": "number",
          "label": {"en": "Diastolic BP", "ar": "الضغط الانبساطي"},
          "unitOptions": ["mmHg"],
          "defaultUnit": "mmHg",
          "minValue": 20,
          "maxValue": 180,
          "normalRange": {"min": 60, "max": 90},
          "decimals": 0,
          "required": true,
          "sortOrder": 3
        },
        {
          "id": "mean_arterial_pressure",
          "code": "MAP",
          "type": "calculated",
          "label": {"en": "MAP", "ar": "متوسط الضغط الشرياني"},
          "unitOptions": ["mmHg"],
          "defaultUnit": "mmHg",
          "decimals": 1,
          "formula": "(systolic_bp + 2 * diastolic_bp) / 3",
          "dependsOn": ["systolic_bp", "diastolic_bp"],
          "readOnly": true,
          "sortOrder": 4,
          "normalRange": {"min": 70, "max": 100}
        },
        {
          "id": "central_venous_pressure",
          "code": "CVP",
          "type": "number",
          "label": {"en": "Central Venous Pressure", "ar": "الضغط الوريدي المركزي"},
          "unitOptions": ["mmHg", "cmH2O"],
          "defaultUnit": "mmHg",
          "minValue": 0,
          "maxValue": 30,
          "normalRange": {"min": 2, "max": 8},
          "decimals": 0,
          "required": false,
          "sortOrder": 5
        }
      ]
    },
    {
      "id": "respiratory",
      "label": {"en": "Respiratory", "ar": "الجهاز التنفسي"},
      "sortOrder": 2,
      "items": [
        {
          "id": "respiratory_rate",
          "code": "RR",
          "loincCode": "9279-1",
          "type": "number",
          "label": {"en": "Respiratory Rate", "ar": "معدل التنفس"},
          "unitOptions": ["breaths/min"],
          "defaultUnit": "breaths/min",
          "minValue": 4,
          "maxValue": 60,
          "normalRange": {"min": 12, "max": 20},
          "decimals": 0,
          "required": true,
          "sortOrder": 1
        },
        {
          "id": "oxygen_saturation",
          "code": "SPO2",
          "loincCode": "2708-6",
          "type": "number",
          "label": {"en": "SpO2", "ar": "تشبع الأكسجين"},
          "unitOptions": ["%"],
          "defaultUnit": "%",
          "minValue": 60,
          "maxValue": 100,
          "normalRange": {"min": 95, "max": 100},
          "decimals": 0,
          "required": true,
          "sortOrder": 2
        },
        {
          "id": "fio2",
          "code": "FIO2",
          "type": "number",
          "label": {"en": "FiO2", "ar": "تركيز الأكسجين المستنشق"},
          "unitOptions": ["%"],
          "defaultUnit": "%",
          "minValue": 21,
          "maxValue": 100,
          "decimals": 0,
          "required": false,
          "sortOrder": 3
        }
      ]
    },
    {
      "id": "other_vitals",
      "label": {"en": "Other Vitals", "ar": "علامات أخرى"},
      "sortOrder": 3,
      "items": [
        {
          "id": "temperature",
          "code": "TEMP",
          "loincCode": "8310-5",
          "type": "number",
          "label": {"en": "Temperature", "ar": "درجة الحرارة"},
          "unitOptions": ["°C", "°F"],
          "defaultUnit": "°C",
          "minValue": 32,
          "maxValue": 45,
          "normalRange": {"min": 36.1, "max": 37.2},
          "decimals": 1,
          "required": true,
          "sortOrder": 1
        },
        {
          "id": "gcs_total",
          "code": "GCS",
          "type": "number",
          "label": {"en": "Glasgow Coma Scale", "ar": "مقياس غلاسكو للغيبوبة"},
          "unitOptions": ["points"],
          "defaultUnit": "points",
          "minValue": 3,
          "maxValue": 15,
          "decimals": 0,
          "required": false,
          "sortOrder": 2
        }
      ]
    }
  ]'::jsonb,
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. DIABETIC CLINIC VITALS (Adult - Endocrinology)
-- ============================================================================

INSERT INTO vital_signs_templates (
  id,
  tenant_id,
  template_code,
  version,
  name,
  description,
  care_setting,
  age_group,
  specialties,
  groups,
  is_active,
  is_default,
  created_at,
  updated_at
) VALUES (
  '60000000-0000-0000-0000-000000000004',
  '11111111-1111-1111-1111-111111111111',
  'diabetic_clinic_vitals',
  1,
  '{"en": "Diabetic Clinic Vitals", "ar": "العلامات الحيوية لعيادة السكري"}',
  '{"en": "Specialized vital signs for diabetes patients", "ar": "علامات حيوية متخصصة لمرضى السكري"}',
  ARRAY['OPD']::text[],
  ARRAY['adult', 'elderly']::text[],
  ARRAY['ENDOCRINOLOGY', 'DIABETES']::text[],
  '[
    {
      "id": "basic_vitals",
      "label": {"en": "Basic Vitals", "ar": "العلامات الحيوية الأساسية"},
      "sortOrder": 1,
      "items": [
        {
          "id": "systolic_bp",
          "code": "SBP",
          "loincCode": "8480-6",
          "type": "number",
          "label": {"en": "Systolic BP", "ar": "الضغط الانقباضي"},
          "unitOptions": ["mmHg"],
          "defaultUnit": "mmHg",
          "minValue": 60,
          "maxValue": 260,
          "normalRange": {"min": 90, "max": 130},
          "decimals": 0,
          "required": true,
          "sortOrder": 1,
          "displayWith": "diastolic_bp"
        },
        {
          "id": "diastolic_bp",
          "code": "DBP",
          "loincCode": "8462-4",
          "type": "number",
          "label": {"en": "Diastolic BP", "ar": "الضغط الانبساطي"},
          "unitOptions": ["mmHg"],
          "defaultUnit": "mmHg",
          "minValue": 30,
          "maxValue": 160,
          "normalRange": {"min": 60, "max": 80},
          "decimals": 0,
          "required": true,
          "sortOrder": 2
        },
        {
          "id": "heart_rate",
          "code": "HR",
          "loincCode": "8867-4",
          "type": "number",
          "label": {"en": "Heart Rate", "ar": "معدل ضربات القلب"},
          "unitOptions": ["bpm"],
          "defaultUnit": "bpm",
          "minValue": 30,
          "maxValue": 220,
          "normalRange": {"min": 60, "max": 100},
          "decimals": 0,
          "required": true,
          "sortOrder": 3
        }
      ]
    },
    {
      "id": "diabetes_specific",
      "label": {"en": "Diabetes Monitoring", "ar": "مراقبة السكري"},
      "sortOrder": 2,
      "items": [
        {
          "id": "blood_glucose",
          "code": "BG",
          "loincCode": "2339-0",
          "type": "number",
          "label": {"en": "Blood Glucose", "ar": "سكر الدم"},
          "unitOptions": ["mg/dL", "mmol/L"],
          "defaultUnit": "mg/dL",
          "minValue": 20,
          "maxValue": 600,
          "normalRange": {"min": 70, "max": 100},
          "decimals": 0,
          "required": true,
          "sortOrder": 1
        },
        {
          "id": "weight_kg",
          "code": "WT",
          "loincCode": "29463-7",
          "type": "number",
          "label": {"en": "Weight", "ar": "الوزن"},
          "unitOptions": ["kg"],
          "defaultUnit": "kg",
          "minValue": 20,
          "maxValue": 300,
          "decimals": 1,
          "required": true,
          "sortOrder": 2
        },
        {
          "id": "height_cm",
          "code": "HT",
          "loincCode": "8302-2",
          "type": "number",
          "label": {"en": "Height", "ar": "الطول"},
          "unitOptions": ["cm"],
          "defaultUnit": "cm",
          "minValue": 100,
          "maxValue": 250,
          "decimals": 1,
          "required": false,
          "sortOrder": 3
        },
        {
          "id": "bmi",
          "code": "BMI",
          "loincCode": "39156-5",
          "type": "calculated",
          "label": {"en": "BMI", "ar": "مؤشر كتلة الجسم"},
          "unitOptions": ["kg/m²"],
          "defaultUnit": "kg/m²",
          "decimals": 1,
          "formula": "weight_kg / ((height_cm/100) ^ 2)",
          "dependsOn": ["weight_kg", "height_cm"],
          "readOnly": true,
          "sortOrder": 4,
          "normalRange": {"min": 18.5, "max": 24.9}
        },
        {
          "id": "waist_circumference",
          "code": "WC",
          "loincCode": "8280-0",
          "type": "number",
          "label": {"en": "Waist Circumference", "ar": "محيط الخصر"},
          "unitOptions": ["cm"],
          "defaultUnit": "cm",
          "minValue": 40,
          "maxValue": 200,
          "decimals": 1,
          "required": false,
          "sortOrder": 5
        }
      ]
    }
  ]'::jsonb,
  true,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

\echo '✅ Vital signs templates seeded successfully!'
\echo 'Templates created:'
\echo '  - Default OPD Vitals (Adult)'
\echo '  - Pediatric Vitals (Children)'
\echo '  - ICU Comprehensive Vitals (Critical Care)'
\echo '  - Diabetic Clinic Vitals (Endocrinology)'
