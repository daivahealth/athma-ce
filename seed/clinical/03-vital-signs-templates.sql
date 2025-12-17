-- Vital Signs Templates Seed Data
-- Pre-configured templates for different care settings and age groups

TRUNCATE vital_signs_templates CASCADE;

-- =============================================================================
-- ADULT TEMPLATES
-- =============================================================================

-- Default Adult OPD Template
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
  metadata,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'adult_opd_vitals',
  1,
  '{"en": "Adult OPD Vital Signs", "ar": "العلامات الحيوية للعيادات الخارجية للبالغين"}'::jsonb,
  '{"en": "Standard vital signs for adult outpatient visits", "ar": "العلامات الحيوية القياسية لزيارات العيادات الخارجية للبالغين"}'::jsonb,
  ARRAY['OP']::text[],
  ARRAY['adult']::text[],
  ARRAY['general_medicine', 'internal_medicine']::text[],
  '[
    {
      "groupCode": "basic_vitals",
      "groupName": {"en": "Basic Vitals", "ar": "العلامات الحيوية الأساسية"},
      "sortOrder": 1,
      "items": [
        {
          "code": "temp",
          "name": {"en": "Temperature", "ar": "درجة الحرارة"},
          "unit": "°C",
          "normalRange": {"min": 36.1, "max": 37.2},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "pulse",
          "name": {"en": "Pulse Rate", "ar": "معدل النبض"},
          "unit": "bpm",
          "normalRange": {"min": 60, "max": 100},
          "required": true,
          "sortOrder": 2
        },
        {
          "code": "resp_rate",
          "name": {"en": "Respiratory Rate", "ar": "معدل التنفس"},
          "unit": "breaths/min",
          "normalRange": {"min": 12, "max": 20},
          "required": true,
          "sortOrder": 3
        },
        {
          "code": "bp_systolic",
          "name": {"en": "Blood Pressure (Systolic)", "ar": "ضغط الدم (الانقباضي)"},
          "unit": "mmHg",
          "normalRange": {"min": 90, "max": 120},
          "required": true,
          "sortOrder": 4
        },
        {
          "code": "bp_diastolic",
          "name": {"en": "Blood Pressure (Diastolic)", "ar": "ضغط الدم (الانبساطي)"},
          "unit": "mmHg",
          "normalRange": {"min": 60, "max": 80},
          "required": true,
          "sortOrder": 5
        },
        {
          "code": "spo2",
          "name": {"en": "Oxygen Saturation (SpO2)", "ar": "تشبع الأكسجين"},
          "unit": "%",
          "normalRange": {"min": 95, "max": 100},
          "required": true,
          "sortOrder": 6
        }
      ]
    },
    {
      "groupCode": "anthropometric",
      "groupName": {"en": "Anthropometric Measurements", "ar": "القياسات الجسدية"},
      "sortOrder": 2,
      "items": [
        {
          "code": "height",
          "name": {"en": "Height", "ar": "الطول"},
          "unit": "cm",
          "required": false,
          "sortOrder": 1
        },
        {
          "code": "weight",
          "name": {"en": "Weight", "ar": "الوزن"},
          "unit": "kg",
          "required": true,
          "sortOrder": 2
        },
        {
          "code": "bmi",
          "name": {"en": "BMI", "ar": "مؤشر كتلة الجسم"},
          "unit": "kg/m²",
          "normalRange": {"min": 18.5, "max": 24.9},
          "required": false,
          "sortOrder": 3,
          "calculated": true,
          "formula": "weight / (height/100)^2"
        }
      ]
    }
  ]'::jsonb,
  true,
  true,
  '{"category": "standard", "version": "1.0"}'::jsonb,
  NOW(),
  NOW()
);

-- Adult Emergency Template
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
  metadata,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'adult_emergency_vitals',
  1,
  '{"en": "Adult Emergency Vital Signs", "ar": "العلامات الحيوية للطوارئ للبالغين"}'::jsonb,
  '{"en": "Comprehensive vital signs for emergency department", "ar": "العلامات الحيوية الشاملة لقسم الطوارئ"}'::jsonb,
  ARRAY['OP']::text[],
  ARRAY['adult']::text[],
  ARRAY['emergency_medicine']::text[],
  '[
    {
      "groupCode": "basic_vitals",
      "groupName": {"en": "Basic Vitals", "ar": "العلامات الحيوية الأساسية"},
      "sortOrder": 1,
      "items": [
        {
          "code": "temp",
          "name": {"en": "Temperature", "ar": "درجة الحرارة"},
          "unit": "°C",
          "normalRange": {"min": 36.1, "max": 37.2},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "pulse",
          "name": {"en": "Pulse Rate", "ar": "معدل النبض"},
          "unit": "bpm",
          "normalRange": {"min": 60, "max": 100},
          "required": true,
          "sortOrder": 2
        },
        {
          "code": "resp_rate",
          "name": {"en": "Respiratory Rate", "ar": "معدل التنفس"},
          "unit": "breaths/min",
          "normalRange": {"min": 12, "max": 20},
          "required": true,
          "sortOrder": 3
        },
        {
          "code": "bp_systolic",
          "name": {"en": "Blood Pressure (Systolic)", "ar": "ضغط الدم (الانقباضي)"},
          "unit": "mmHg",
          "normalRange": {"min": 90, "max": 120},
          "required": true,
          "sortOrder": 4
        },
        {
          "code": "bp_diastolic",
          "name": {"en": "Blood Pressure (Diastolic)", "ar": "ضغط الدم (الانبساطي)"},
          "unit": "mmHg",
          "normalRange": {"min": 60, "max": 80},
          "required": true,
          "sortOrder": 5
        },
        {
          "code": "spo2",
          "name": {"en": "Oxygen Saturation (SpO2)", "ar": "تشبع الأكسجين"},
          "unit": "%",
          "normalRange": {"min": 95, "max": 100},
          "required": true,
          "sortOrder": 6
        }
      ]
    },
    {
      "groupCode": "consciousness",
      "groupName": {"en": "Consciousness Assessment", "ar": "تقييم الوعي"},
      "sortOrder": 2,
      "items": [
        {
          "code": "gcs_total",
          "name": {"en": "Glasgow Coma Scale", "ar": "مقياس غلاسكو للغيبوبة"},
          "unit": "points",
          "normalRange": {"min": 15, "max": 15},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "avpu",
          "name": {"en": "AVPU Scale", "ar": "مقياس AVPU"},
          "unit": "",
          "options": ["Alert", "Voice", "Pain", "Unresponsive"],
          "required": false,
          "sortOrder": 2
        }
      ]
    },
    {
      "groupCode": "pain",
      "groupName": {"en": "Pain Assessment", "ar": "تقييم الألم"},
      "sortOrder": 3,
      "items": [
        {
          "code": "pain_score",
          "name": {"en": "Pain Score", "ar": "درجة الألم"},
          "unit": "/10",
          "normalRange": {"min": 0, "max": 0},
          "required": true,
          "sortOrder": 1
        }
      ]
    },
    {
      "groupCode": "anthropometric",
      "groupName": {"en": "Anthropometric Measurements", "ar": "القياسات الجسدية"},
      "sortOrder": 4,
      "items": [
        {
          "code": "weight",
          "name": {"en": "Weight", "ar": "الوزن"},
          "unit": "kg",
          "required": true,
          "sortOrder": 1
        }
      ]
    }
  ]'::jsonb,
  true,
  true,
  '{"category": "emergency", "version": "1.0", "includesTriageScores": true}'::jsonb,
  NOW(),
  NOW()
);

-- Adult ICU Template
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
  metadata,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'adult_icu_vitals',
  1,
  '{"en": "Adult ICU Vital Signs", "ar": "العلامات الحيوية للعناية المركزة للبالغين"}'::jsonb,
  '{"en": "Comprehensive vital signs monitoring for ICU patients", "ar": "مراقبة شاملة للعلامات الحيوية لمرضى العناية المركزة"}'::jsonb,
  ARRAY['IP']::text[],
  ARRAY['adult']::text[],
  ARRAY['critical_care', 'intensive_care']::text[],
  '[
    {
      "groupCode": "hemodynamic",
      "groupName": {"en": "Hemodynamic Parameters", "ar": "المعايير الديناميكية الدموية"},
      "sortOrder": 1,
      "items": [
        {
          "code": "bp_systolic",
          "name": {"en": "Blood Pressure (Systolic)", "ar": "ضغط الدم (الانقباضي)"},
          "unit": "mmHg",
          "normalRange": {"min": 90, "max": 120},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "bp_diastolic",
          "name": {"en": "Blood Pressure (Diastolic)", "ar": "ضغط الدم (الانبساطي)"},
          "unit": "mmHg",
          "normalRange": {"min": 60, "max": 80},
          "required": true,
          "sortOrder": 2
        },
        {
          "code": "map",
          "name": {"en": "Mean Arterial Pressure (MAP)", "ar": "متوسط الضغط الشرياني"},
          "unit": "mmHg",
          "normalRange": {"min": 70, "max": 100},
          "required": true,
          "sortOrder": 3
        },
        {
          "code": "heart_rate",
          "name": {"en": "Heart Rate", "ar": "معدل ضربات القلب"},
          "unit": "bpm",
          "normalRange": {"min": 60, "max": 100},
          "required": true,
          "sortOrder": 4
        },
        {
          "code": "cvp",
          "name": {"en": "Central Venous Pressure (CVP)", "ar": "الضغط الوريدي المركزي"},
          "unit": "mmHg",
          "normalRange": {"min": 2, "max": 8},
          "required": false,
          "sortOrder": 5
        }
      ]
    },
    {
      "groupCode": "respiratory",
      "groupName": {"en": "Respiratory Parameters", "ar": "المعايير التنفسية"},
      "sortOrder": 2,
      "items": [
        {
          "code": "resp_rate",
          "name": {"en": "Respiratory Rate", "ar": "معدل التنفس"},
          "unit": "breaths/min",
          "normalRange": {"min": 12, "max": 20},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "spo2",
          "name": {"en": "Oxygen Saturation (SpO2)", "ar": "تشبع الأكسجين"},
          "unit": "%",
          "normalRange": {"min": 95, "max": 100},
          "required": true,
          "sortOrder": 2
        },
        {
          "code": "fio2",
          "name": {"en": "FiO2", "ar": "نسبة الأكسجين المستنشق"},
          "unit": "%",
          "required": false,
          "sortOrder": 3
        },
        {
          "code": "peep",
          "name": {"en": "PEEP", "ar": "ضغط نهاية الزفير الموجب"},
          "unit": "cmH2O",
          "required": false,
          "sortOrder": 4
        }
      ]
    },
    {
      "groupCode": "neurological",
      "groupName": {"en": "Neurological Assessment", "ar": "التقييم العصبي"},
      "sortOrder": 3,
      "items": [
        {
          "code": "gcs_total",
          "name": {"en": "Glasgow Coma Scale", "ar": "مقياس غلاسكو للغيبوبة"},
          "unit": "points",
          "normalRange": {"min": 15, "max": 15},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "pupil_left",
          "name": {"en": "Left Pupil Size", "ar": "حجم البؤبؤ الأيسر"},
          "unit": "mm",
          "required": false,
          "sortOrder": 2
        },
        {
          "code": "pupil_right",
          "name": {"en": "Right Pupil Size", "ar": "حجم البؤبؤ الأيمن"},
          "unit": "mm",
          "required": false,
          "sortOrder": 3
        }
      ]
    },
    {
      "groupCode": "metabolic",
      "groupName": {"en": "Metabolic Parameters", "ar": "المعايير الأيضية"},
      "sortOrder": 4,
      "items": [
        {
          "code": "temp",
          "name": {"en": "Temperature", "ar": "درجة الحرارة"},
          "unit": "°C",
          "normalRange": {"min": 36.1, "max": 37.2},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "blood_glucose",
          "name": {"en": "Blood Glucose", "ar": "سكر الدم"},
          "unit": "mg/dL",
          "normalRange": {"min": 70, "max": 140},
          "required": false,
          "sortOrder": 2
        }
      ]
    },
    {
      "groupCode": "fluid_balance",
      "groupName": {"en": "Fluid Balance", "ar": "توازن السوائل"},
      "sortOrder": 5,
      "items": [
        {
          "code": "urine_output",
          "name": {"en": "Urine Output (hourly)", "ar": "كمية البول (في الساعة)"},
          "unit": "mL/hr",
          "normalRange": {"min": 30, "max": 200},
          "required": false,
          "sortOrder": 1
        }
      ]
    }
  ]'::jsonb,
  true,
  true,
  '{"category": "critical_care", "version": "1.0", "monitoringFrequency": "hourly"}'::jsonb,
  NOW(),
  NOW()
);

-- =============================================================================
-- PEDIATRIC TEMPLATES
-- =============================================================================

-- Pediatric OPD Template
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
  metadata,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'pediatric_opd_vitals',
  1,
  '{"en": "Pediatric OPD Vital Signs", "ar": "العلامات الحيوية للأطفال بالعيادات الخارجية"}'::jsonb,
  '{"en": "Standard vital signs for pediatric outpatient visits", "ar": "العلامات الحيوية القياسية لزيارات الأطفال بالعيادات الخارجية"}'::jsonb,
  ARRAY['OP']::text[],
  ARRAY['child', 'adolescent']::text[],
  ARRAY['pediatrics', 'general_medicine']::text[],
  '[
    {
      "groupCode": "basic_vitals",
      "groupName": {"en": "Basic Vitals", "ar": "العلامات الحيوية الأساسية"},
      "sortOrder": 1,
      "items": [
        {
          "code": "temp",
          "name": {"en": "Temperature", "ar": "درجة الحرارة"},
          "unit": "°C",
          "normalRange": {"min": 36.5, "max": 37.5},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "pulse",
          "name": {"en": "Pulse Rate", "ar": "معدل النبض"},
          "unit": "bpm",
          "normalRange": {"min": 70, "max": 120},
          "required": true,
          "sortOrder": 2,
          "ageVariant": true
        },
        {
          "code": "resp_rate",
          "name": {"en": "Respiratory Rate", "ar": "معدل التنفس"},
          "unit": "breaths/min",
          "normalRange": {"min": 18, "max": 30},
          "required": true,
          "sortOrder": 3,
          "ageVariant": true
        },
        {
          "code": "bp_systolic",
          "name": {"en": "Blood Pressure (Systolic)", "ar": "ضغط الدم (الانقباضي)"},
          "unit": "mmHg",
          "normalRange": {"min": 85, "max": 110},
          "required": true,
          "sortOrder": 4,
          "ageVariant": true
        },
        {
          "code": "bp_diastolic",
          "name": {"en": "Blood Pressure (Diastolic)", "ar": "ضغط الدم (الانبساطي)"},
          "unit": "mmHg",
          "normalRange": {"min": 50, "max": 70},
          "required": true,
          "sortOrder": 5,
          "ageVariant": true
        },
        {
          "code": "spo2",
          "name": {"en": "Oxygen Saturation (SpO2)", "ar": "تشبع الأكسجين"},
          "unit": "%",
          "normalRange": {"min": 95, "max": 100},
          "required": true,
          "sortOrder": 6
        }
      ]
    },
    {
      "groupCode": "growth",
      "groupName": {"en": "Growth Parameters", "ar": "معايير النمو"},
      "sortOrder": 2,
      "items": [
        {
          "code": "height",
          "name": {"en": "Height", "ar": "الطول"},
          "unit": "cm",
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "weight",
          "name": {"en": "Weight", "ar": "الوزن"},
          "unit": "kg",
          "required": true,
          "sortOrder": 2
        },
        {
          "code": "head_circumference",
          "name": {"en": "Head Circumference", "ar": "محيط الرأس"},
          "unit": "cm",
          "required": false,
          "sortOrder": 3,
          "ageLimit": "< 3 years"
        },
        {
          "code": "bmi",
          "name": {"en": "BMI", "ar": "مؤشر كتلة الجسم"},
          "unit": "kg/m²",
          "required": false,
          "sortOrder": 4,
          "calculated": true,
          "formula": "weight / (height/100)^2"
        }
      ]
    }
  ]'::jsonb,
  true,
  true,
  '{"category": "pediatric", "version": "1.0"}'::jsonb,
  NOW(),
  NOW()
);

-- =============================================================================
-- NEONATAL TEMPLATE
-- =============================================================================

-- Neonatal ICU Template
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
  metadata,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'neonatal_icu_vitals',
  1,
  '{"en": "Neonatal ICU Vital Signs", "ar": "العلامات الحيوية لحديثي الولادة بالعناية المركزة"}'::jsonb,
  '{"en": "Comprehensive vital signs for NICU patients", "ar": "مراقبة شاملة للعلامات الحيوية لحديثي الولادة"}'::jsonb,
  ARRAY['IP']::text[],
  ARRAY['newborn']::text[],
  ARRAY['neonatology', 'pediatrics']::text[],
  '[
    {
      "groupCode": "basic_vitals",
      "groupName": {"en": "Basic Vitals", "ar": "العلامات الحيوية الأساسية"},
      "sortOrder": 1,
      "items": [
        {
          "code": "temp",
          "name": {"en": "Temperature", "ar": "درجة الحرارة"},
          "unit": "°C",
          "normalRange": {"min": 36.5, "max": 37.5},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "heart_rate",
          "name": {"en": "Heart Rate", "ar": "معدل ضربات القلب"},
          "unit": "bpm",
          "normalRange": {"min": 120, "max": 160},
          "required": true,
          "sortOrder": 2
        },
        {
          "code": "resp_rate",
          "name": {"en": "Respiratory Rate", "ar": "معدل التنفس"},
          "unit": "breaths/min",
          "normalRange": {"min": 30, "max": 60},
          "required": true,
          "sortOrder": 3
        },
        {
          "code": "spo2",
          "name": {"en": "Oxygen Saturation (SpO2)", "ar": "تشبع الأكسجين"},
          "unit": "%",
          "normalRange": {"min": 90, "max": 95},
          "required": true,
          "sortOrder": 4
        }
      ]
    },
    {
      "groupCode": "respiratory_support",
      "groupName": {"en": "Respiratory Support", "ar": "الدعم التنفسي"},
      "sortOrder": 2,
      "items": [
        {
          "code": "fio2",
          "name": {"en": "FiO2", "ar": "نسبة الأكسجين المستنشق"},
          "unit": "%",
          "required": false,
          "sortOrder": 1
        },
        {
          "code": "peep",
          "name": {"en": "PEEP", "ar": "ضغط نهاية الزفير الموجب"},
          "unit": "cmH2O",
          "required": false,
          "sortOrder": 2
        }
      ]
    },
    {
      "groupCode": "growth",
      "groupName": {"en": "Growth Parameters", "ar": "معايير النمو"},
      "sortOrder": 3,
      "items": [
        {
          "code": "weight",
          "name": {"en": "Weight", "ar": "الوزن"},
          "unit": "g",
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "length",
          "name": {"en": "Length", "ar": "الطول"},
          "unit": "cm",
          "required": true,
          "sortOrder": 2
        },
        {
          "code": "head_circumference",
          "name": {"en": "Head Circumference", "ar": "محيط الرأس"},
          "unit": "cm",
          "required": true,
          "sortOrder": 3
        }
      ]
    }
  ]'::jsonb,
  true,
  true,
  '{"category": "neonatal", "version": "1.0", "monitoringFrequency": "continuous"}'::jsonb,
  NOW(),
  NOW()
);

-- =============================================================================
-- SPECIALTY-SPECIFIC TEMPLATES
-- =============================================================================

-- Cardiology Template
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
  metadata,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'cardiology_opd_vitals',
  1,
  '{"en": "Cardiology OPD Vital Signs", "ar": "العلامات الحيوية لعيادة القلب"}'::jsonb,
  '{"en": "Enhanced cardiovascular monitoring for cardiology patients", "ar": "مراقبة محسنة للقلب والأوعية الدموية لمرضى القلب"}'::jsonb,
  ARRAY['OP']::text[],
  ARRAY['adult']::text[],
  ARRAY['cardiology']::text[],
  '[
    {
      "groupCode": "cardiovascular",
      "groupName": {"en": "Cardiovascular Parameters", "ar": "معايير القلب والأوعية الدموية"},
      "sortOrder": 1,
      "items": [
        {
          "code": "bp_systolic",
          "name": {"en": "Blood Pressure (Systolic)", "ar": "ضغط الدم (الانقباضي)"},
          "unit": "mmHg",
          "normalRange": {"min": 90, "max": 120},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "bp_diastolic",
          "name": {"en": "Blood Pressure (Diastolic)", "ar": "ضغط الدم (الانبساطي)"},
          "unit": "mmHg",
          "normalRange": {"min": 60, "max": 80},
          "required": true,
          "sortOrder": 2
        },
        {
          "code": "heart_rate",
          "name": {"en": "Heart Rate", "ar": "معدل ضربات القلب"},
          "unit": "bpm",
          "normalRange": {"min": 60, "max": 100},
          "required": true,
          "sortOrder": 3
        },
        {
          "code": "pulse",
          "name": {"en": "Pulse Rate", "ar": "معدل النبض"},
          "unit": "bpm",
          "normalRange": {"min": 60, "max": 100},
          "required": true,
          "sortOrder": 4
        },
        {
          "code": "rhythm",
          "name": {"en": "Heart Rhythm", "ar": "إيقاع القلب"},
          "unit": "",
          "options": ["Regular", "Irregular"],
          "required": true,
          "sortOrder": 5
        }
      ]
    },
    {
      "groupCode": "respiratory",
      "groupName": {"en": "Respiratory Parameters", "ar": "المعايير التنفسية"},
      "sortOrder": 2,
      "items": [
        {
          "code": "resp_rate",
          "name": {"en": "Respiratory Rate", "ar": "معدل التنفس"},
          "unit": "breaths/min",
          "normalRange": {"min": 12, "max": 20},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "spo2",
          "name": {"en": "Oxygen Saturation (SpO2)", "ar": "تشبع الأكسجين"},
          "unit": "%",
          "normalRange": {"min": 95, "max": 100},
          "required": true,
          "sortOrder": 2
        }
      ]
    },
    {
      "groupCode": "basic",
      "groupName": {"en": "Basic Measurements", "ar": "القياسات الأساسية"},
      "sortOrder": 3,
      "items": [
        {
          "code": "temp",
          "name": {"en": "Temperature", "ar": "درجة الحرارة"},
          "unit": "°C",
          "normalRange": {"min": 36.1, "max": 37.2},
          "required": true,
          "sortOrder": 1
        },
        {
          "code": "weight",
          "name": {"en": "Weight", "ar": "الوزن"},
          "unit": "kg",
          "required": true,
          "sortOrder": 2
        }
      ]
    }
  ]'::jsonb,
  true,
  false,
  '{"category": "specialty", "version": "1.0", "specialty": "cardiology"}'::jsonb,
  NOW(),
  NOW()
);

-- Verification query
SELECT
  template_code,
  name->>'en' as name_en,
  care_setting,
  age_group,
  specialties,
  is_active,
  is_default
FROM vital_signs_templates
ORDER BY template_code;
