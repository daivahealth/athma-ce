-- ============================================================================
-- Observation Code Catalog Seed
-- LOINC codes for vitals, common labs, and imaging findings
-- These are global entries (tenant_id = NULL), usable by all tenants
-- ============================================================================

-- Vital Signs
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '8867-4',  'LOINC', 'Heart Rate',              'معدل ضربات القلب',       'vital-signs', 'numeric', 'bpm',    60,    100,   true),
  (uuid_generate_v4(), NULL, '8480-6',  'LOINC', 'Systolic Blood Pressure', 'ضغط الدم الانقباضي',     'vital-signs', 'numeric', 'mmHg',   90,    140,   true),
  (uuid_generate_v4(), NULL, '8462-4',  'LOINC', 'Diastolic Blood Pressure','ضغط الدم الانبساطي',     'vital-signs', 'numeric', 'mmHg',   60,    90,    true),
  (uuid_generate_v4(), NULL, '8310-5',  'LOINC', 'Body Temperature',        'درجة حرارة الجسم',       'vital-signs', 'numeric', '°C',     36.1,  37.2,  true),
  (uuid_generate_v4(), NULL, '9279-1',  'LOINC', 'Respiratory Rate',        'معدل التنفس',            'vital-signs', 'numeric', '/min',   12,    20,    true),
  (uuid_generate_v4(), NULL, '2708-6',  'LOINC', 'Oxygen Saturation (SpO2)','تشبع الأكسجين',          'vital-signs', 'numeric', '%',      95,    100,   true),
  (uuid_generate_v4(), NULL, '29463-7', 'LOINC', 'Body Weight',             'وزن الجسم',              'vital-signs', 'numeric', 'kg',     NULL,  NULL,  true),
  (uuid_generate_v4(), NULL, '8302-2',  'LOINC', 'Body Height',             'طول الجسم',              'vital-signs', 'numeric', 'cm',     NULL,  NULL,  true),
  (uuid_generate_v4(), NULL, '39156-5', 'LOINC', 'Body Mass Index (BMI)',   'مؤشر كتلة الجسم',        'vital-signs', 'numeric', 'kg/m2',  18.5,  24.9,  true),
  (uuid_generate_v4(), NULL, '2345-7',  'LOINC', 'Blood Glucose',           'سكر الدم',               'vital-signs', 'numeric', 'mg/dL',  70,    100,   true),
  (uuid_generate_v4(), NULL, '9843-4',  'LOINC', 'Head Circumference',      'محيط الرأس',             'vital-signs', 'numeric', 'cm',     NULL,  NULL,  true)
ON CONFLICT ON CONSTRAINT ux_obs_code_system DO NOTHING;

-- Complete Blood Count (CBC)
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '718-7',  'LOINC', 'Hemoglobin',              'الهيموغلوبين',              'laboratory', 'numeric', 'g/dL',     12.0,  17.5,  true),
  (uuid_generate_v4(), NULL, '6690-2', 'LOINC', 'White Blood Cell Count',  'عدد كريات الدم البيضاء',    'laboratory', 'numeric', '10^3/uL',  4.5,   11.0,  true),
  (uuid_generate_v4(), NULL, '789-8',  'LOINC', 'Red Blood Cell Count',    'عدد كريات الدم الحمراء',    'laboratory', 'numeric', '10^6/uL',  4.5,   5.5,   true),
  (uuid_generate_v4(), NULL, '777-3',  'LOINC', 'Platelet Count',          'عدد الصفائح الدموية',       'laboratory', 'numeric', '10^3/uL',  150,   400,   true),
  (uuid_generate_v4(), NULL, '4544-3', 'LOINC', 'Hematocrit',              'الهيماتوكريت',              'laboratory', 'numeric', '%',        36,    46,    true)
ON CONFLICT ON CONSTRAINT ux_obs_code_system DO NOTHING;

-- Renal Function
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '2160-0', 'LOINC', 'Creatinine',               'الكرياتينين',              'laboratory', 'numeric', 'mg/dL',   0.7,   1.3,   true),
  (uuid_generate_v4(), NULL, '3094-0', 'LOINC', 'Blood Urea Nitrogen',      'نيتروجين اليوريا في الدم', 'laboratory', 'numeric', 'mg/dL',   7,     20,    true),
  (uuid_generate_v4(), NULL, '33914-3','LOINC', 'eGFR',                     'معدل الترشيح الكبيبي',     'laboratory', 'numeric', 'mL/min',  90,    NULL,  true)
ON CONFLICT ON CONSTRAINT ux_obs_code_system DO NOTHING;

-- Electrolytes
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '2951-2', 'LOINC', 'Sodium',    'الصوديوم',   'laboratory', 'numeric', 'mmol/L', 136,  145,  true),
  (uuid_generate_v4(), NULL, '2823-3', 'LOINC', 'Potassium', 'البوتاسيوم', 'laboratory', 'numeric', 'mmol/L', 3.5,  5.0,  true),
  (uuid_generate_v4(), NULL, '2075-0', 'LOINC', 'Chloride',  'الكلوريد',   'laboratory', 'numeric', 'mmol/L', 98,   106,  true),
  (uuid_generate_v4(), NULL, '2028-9', 'LOINC', 'CO2',       'ثاني أكسيد الكربون', 'laboratory', 'numeric', 'mmol/L', 23, 29, true)
ON CONFLICT ON CONSTRAINT ux_obs_code_system DO NOTHING;

-- Glucose & Diabetes
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '4548-4', 'LOINC', 'Hemoglobin A1c',  'الهيموغلوبين السكري', 'laboratory', 'numeric', '%',     4.0,   5.6,   true),
  (uuid_generate_v4(), NULL, '1558-6', 'LOINC', 'Fasting Glucose',  'الجلوكوز الصائم',     'laboratory', 'numeric', 'mg/dL', 70,    100,   true)
ON CONFLICT ON CONSTRAINT ux_obs_code_system DO NOTHING;

-- Lipid Panel
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '2093-3', 'LOINC', 'Total Cholesterol', 'الكوليسترول الكلي', 'laboratory', 'numeric', 'mg/dL', NULL, 200,  true),
  (uuid_generate_v4(), NULL, '2089-1', 'LOINC', 'LDL Cholesterol',   'الكوليسترول الضار', 'laboratory', 'numeric', 'mg/dL', NULL, 100,  true),
  (uuid_generate_v4(), NULL, '2085-9', 'LOINC', 'HDL Cholesterol',   'الكوليسترول النافع', 'laboratory', 'numeric', 'mg/dL', 40,   NULL, true),
  (uuid_generate_v4(), NULL, '2571-8', 'LOINC', 'Triglycerides',     'الدهون الثلاثية',    'laboratory', 'numeric', 'mg/dL', NULL, 150,  true)
ON CONFLICT ON CONSTRAINT ux_obs_code_system DO NOTHING;

-- Liver Function
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '1742-6', 'LOINC', 'ALT (Alanine Aminotransferase)',     'ناقلة أمين الألانين',     'laboratory', 'numeric', 'U/L', NULL, 35,  true),
  (uuid_generate_v4(), NULL, '1920-8', 'LOINC', 'AST (Aspartate Aminotransferase)',   'ناقلة أمين الأسبارتات',   'laboratory', 'numeric', 'U/L', NULL, 35,  true),
  (uuid_generate_v4(), NULL, '1975-2', 'LOINC', 'Total Bilirubin',                     'البيليروبين الكلي',       'laboratory', 'numeric', 'mg/dL', NULL, 1.2, true),
  (uuid_generate_v4(), NULL, '6768-6', 'LOINC', 'Alkaline Phosphatase',                'الفوسفاتاز القلوي',       'laboratory', 'numeric', 'U/L', 44,   147,  true),
  (uuid_generate_v4(), NULL, '2885-2', 'LOINC', 'Total Protein',                       'البروتين الكلي',          'laboratory', 'numeric', 'g/dL', 6.0,  8.3,  true),
  (uuid_generate_v4(), NULL, '1751-7', 'LOINC', 'Albumin',                             'الألبومين',               'laboratory', 'numeric', 'g/dL', 3.5,  5.5,  true)
ON CONFLICT ON CONSTRAINT ux_obs_code_system DO NOTHING;

-- Thyroid
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '3016-3', 'LOINC', 'TSH',  'هرمون تنشيط الغدة الدرقية', 'laboratory', 'numeric', 'mIU/L', 0.4,  4.0,  true),
  (uuid_generate_v4(), NULL, '3026-2', 'LOINC', 'Free T4', 'هرمون الثايروكسين الحر',  'laboratory', 'numeric', 'ng/dL', 0.8,  1.8,  true),
  (uuid_generate_v4(), NULL, '3053-6', 'LOINC', 'Free T3', 'هرمون ثلاثي يودوثيرونين',  'laboratory', 'numeric', 'pg/mL', 2.3,  4.2,  true)
ON CONFLICT ON CONSTRAINT ux_obs_code_system DO NOTHING;

-- Cardiac Imaging (ECHO)
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '10230-1', 'LOINC', 'Ejection Fraction',                'الكسر القذفي',                           'imaging', 'numeric', '%',  55,   70,   true),
  (uuid_generate_v4(), NULL, '29430-6', 'LOINC', 'LV Internal Diameter (Diastole)',   'القطر الداخلي للبطين الأيسر (الانبساط)', 'imaging', 'numeric', 'cm', 3.5,  5.7,  true),
  (uuid_generate_v4(), NULL, '29438-9', 'LOINC', 'LV Internal Diameter (Systole)',    'القطر الداخلي للبطين الأيسر (الانقباض)', 'imaging', 'numeric', 'cm', 2.0,  4.0,  true)
ON CONFLICT ON CONSTRAINT ux_obs_code_system DO NOTHING;

-- Coagulation
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '5902-2', 'LOINC', 'PT (Prothrombin Time)', 'زمن البروثرومبين', 'laboratory', 'numeric', 'seconds', 11,   13.5, true),
  (uuid_generate_v4(), NULL, '6301-6', 'LOINC', 'INR',                   'نسبة التخثر الدولية', 'laboratory', 'numeric', 'ratio',  0.8,  1.1,  true),
  (uuid_generate_v4(), NULL, '3173-2', 'LOINC', 'aPTT',                  'زمن الثرومبوبلاستين الجزئي', 'laboratory', 'numeric', 'seconds', 25, 35, true)
ON CONFLICT ON CONSTRAINT ux_obs_code_system DO NOTHING;

-- Urinalysis
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '2965-2', 'LOINC', 'Urine Specific Gravity', 'الثقل النوعي للبول', 'laboratory', 'numeric', NULL, 1.005, 1.030, true),
  (uuid_generate_v4(), NULL, '2756-5', 'LOINC', 'Urine pH',               'حموضة البول',        'laboratory', 'numeric', NULL, 4.5,   8.0,   true)
ON CONFLICT ON CONSTRAINT ux_obs_code_system DO NOTHING;
