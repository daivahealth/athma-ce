-- ============================================================================
-- Observation Code Catalog Seed
-- LOINC codes for vitals, common labs, and imaging findings
-- These are global entries (tenant_id = NULL), usable by all tenants
-- ============================================================================

-- Vital Signs
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, lab_domain, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '8867-4',  'LOINC', 'Heart Rate',              'معدل ضربات القلب',       'vital-signs', NULL, 'numeric', 'bpm',    60,    100,   true),
  (uuid_generate_v4(), NULL, '8480-6',  'LOINC', 'Systolic Blood Pressure', 'ضغط الدم الانقباضي',     'vital-signs', NULL, 'numeric', 'mmHg',   90,    140,   true),
  (uuid_generate_v4(), NULL, '8462-4',  'LOINC', 'Diastolic Blood Pressure','ضغط الدم الانبساطي',     'vital-signs', NULL, 'numeric', 'mmHg',   60,    90,    true),
  (uuid_generate_v4(), NULL, '8310-5',  'LOINC', 'Body Temperature',        'درجة حرارة الجسم',       'vital-signs', NULL, 'numeric', '°C',     36.1,  37.2,  true),
  (uuid_generate_v4(), NULL, '9279-1',  'LOINC', 'Respiratory Rate',        'معدل التنفس',            'vital-signs', NULL, 'numeric', '/min',   12,    20,    true),
  (uuid_generate_v4(), NULL, '2708-6',  'LOINC', 'Oxygen Saturation (SpO2)','تشبع الأكسجين',          'vital-signs', NULL, 'numeric', '%',      95,    100,   true),
  (uuid_generate_v4(), NULL, '29463-7', 'LOINC', 'Body Weight',             'وزن الجسم',              'vital-signs', NULL, 'numeric', 'kg',     NULL,  NULL,  true),
  (uuid_generate_v4(), NULL, '8302-2',  'LOINC', 'Body Height',             'طول الجسم',              'vital-signs', NULL, 'numeric', 'cm',     NULL,  NULL,  true),
  (uuid_generate_v4(), NULL, '39156-5', 'LOINC', 'Body Mass Index (BMI)',   'مؤشر كتلة الجسم',        'vital-signs', NULL, 'numeric', 'kg/m2',  18.5,  24.9,  true),
  (uuid_generate_v4(), NULL, '2345-7',  'LOINC', 'Blood Glucose',           'سكر الدم',               'vital-signs', NULL, 'numeric', 'mg/dL',  70,    100,   true),
  (uuid_generate_v4(), NULL, '9843-4',  'LOINC', 'Head Circumference',      'محيط الرأس',             'vital-signs', NULL, 'numeric', 'cm',     NULL,  NULL,  true)
ON CONFLICT (tenant_id, code, code_system) DO NOTHING;

-- Complete Blood Count (CBC)
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, lab_domain, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '718-7',  'LOINC', 'Hemoglobin',              'الهيموغلوبين',              'laboratory', 'hematology', 'numeric', 'g/dL',     12.0,  17.5,  true),
  (uuid_generate_v4(), NULL, '6690-2', 'LOINC', 'White Blood Cell Count',  'عدد كريات الدم البيضاء',    'laboratory', 'hematology', 'numeric', '10^3/uL',  4.5,   11.0,  true),
  (uuid_generate_v4(), NULL, '789-8',  'LOINC', 'Red Blood Cell Count',    'عدد كريات الدم الحمراء',    'laboratory', 'hematology', 'numeric', '10^6/uL',  4.5,   5.5,   true),
  (uuid_generate_v4(), NULL, '777-3',  'LOINC', 'Platelet Count',          'عدد الصفائح الدموية',       'laboratory', 'hematology', 'numeric', '10^3/uL',  150,   400,   true),
  (uuid_generate_v4(), NULL, '4544-3', 'LOINC', 'Hematocrit',              'الهيماتوكريت',              'laboratory', 'hematology', 'numeric', '%',        36,    46,    true),
  (uuid_generate_v4(), NULL, '787-2',  'LOINC', 'Mean Corpuscular Volume', 'متوسط حجم الكرية',          'laboratory', 'hematology', 'numeric', 'fL',       80,    100,   true),
  (uuid_generate_v4(), NULL, '785-6',  'LOINC', 'Mean Corpuscular Hemoglobin', 'متوسط هيموغلوبين الكرية', 'laboratory', 'hematology', 'numeric', 'pg',   27,    33,    true),
  (uuid_generate_v4(), NULL, '786-4',  'LOINC', 'Mean Corpuscular Hemoglobin Concentration', 'تركيز هيموغلوبين الكرية الوسطي', 'laboratory', 'hematology', 'numeric', 'g/dL', 32, 36, true),
  (uuid_generate_v4(), NULL, '788-0',  'LOINC', 'Red Cell Distribution Width', 'عرض توزيع كريات الدم الحمراء', 'laboratory', 'hematology', 'numeric', '%', 11.5, 14.5, true),
  (uuid_generate_v4(), NULL, '32623-1', 'LOINC', 'Mean Platelet Volume',   'متوسط حجم الصفائح',         'laboratory', 'hematology', 'numeric', 'fL',       7.5,   12.0,  true),
  (uuid_generate_v4(), NULL, '770-8',  'LOINC', 'Neutrophils %',           'العدلات النسبية',           'laboratory', 'hematology', 'numeric', '%',        40,    70,    true),
  (uuid_generate_v4(), NULL, '736-9',  'LOINC', 'Lymphocytes %',           'الخلايا اللمفاوية النسبية', 'laboratory', 'hematology', 'numeric', '%',        20,    45,    true),
  (uuid_generate_v4(), NULL, '5905-5', 'LOINC', 'Monocytes %',             'الخلايا الوحيدة النسبية',   'laboratory', 'hematology', 'numeric', '%',        2,     10,    true),
  (uuid_generate_v4(), NULL, '713-8',  'LOINC', 'Eosinophils %',           'الحمضات النسبية',           'laboratory', 'hematology', 'numeric', '%',        0,     6,     true),
  (uuid_generate_v4(), NULL, '706-2',  'LOINC', 'Basophils %',             'القاعديات النسبية',         'laboratory', 'hematology', 'numeric', '%',        0,     2,     true),
  (uuid_generate_v4(), NULL, '751-8',  'LOINC', 'Neutrophils absolute',    'العدلات المطلقة',           'laboratory', 'hematology', 'numeric', '10^3/uL',  1.8,   7.7,   true),
  (uuid_generate_v4(), NULL, '731-0',  'LOINC', 'Lymphocytes absolute',    'الخلايا اللمفاوية المطلقة', 'laboratory', 'hematology', 'numeric', '10^3/uL',  1.0,   4.8,   true),
  (uuid_generate_v4(), NULL, '742-7',  'LOINC', 'Monocytes absolute',      'الخلايا الوحيدة المطلقة',   'laboratory', 'hematology', 'numeric', '10^3/uL',  0.2,   0.8,   true),
  (uuid_generate_v4(), NULL, '711-2',  'LOINC', 'Eosinophils absolute',    'الحمضات المطلقة',           'laboratory', 'hematology', 'numeric', '10^3/uL',  0.0,   0.5,   true),
  (uuid_generate_v4(), NULL, '704-7',  'LOINC', 'Basophils absolute',      'القاعديات المطلقة',         'laboratory', 'hematology', 'numeric', '10^3/uL',  0.0,   0.2,   true)
ON CONFLICT (tenant_id, code, code_system) DO NOTHING;

-- Renal Function
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, lab_domain, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '2160-0', 'LOINC', 'Creatinine',               'الكرياتينين',              'laboratory', 'chemistry', 'numeric', 'mg/dL',   0.7,   1.3,   true),
  (uuid_generate_v4(), NULL, '3094-0', 'LOINC', 'Blood Urea Nitrogen',      'نيتروجين اليوريا في الدم', 'laboratory', 'chemistry', 'numeric', 'mg/dL',   7,     20,    true),
  (uuid_generate_v4(), NULL, '33914-3','LOINC', 'eGFR',                     'معدل الترشيح الكبيبي',     'laboratory', 'chemistry', 'numeric', 'mL/min',  90,    NULL,  true)
ON CONFLICT (tenant_id, code, code_system) DO NOTHING;

-- Electrolytes
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, lab_domain, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '2951-2', 'LOINC', 'Sodium',    'الصوديوم',   'laboratory', 'chemistry', 'numeric', 'mmol/L', 136,  145,  true),
  (uuid_generate_v4(), NULL, '2823-3', 'LOINC', 'Potassium', 'البوتاسيوم', 'laboratory', 'chemistry', 'numeric', 'mmol/L', 3.5,  5.0,  true),
  (uuid_generate_v4(), NULL, '2075-0', 'LOINC', 'Chloride',  'الكلوريد',   'laboratory', 'chemistry', 'numeric', 'mmol/L', 98,   106,  true),
  (uuid_generate_v4(), NULL, '2028-9', 'LOINC', 'CO2',       'ثاني أكسيد الكربون', 'laboratory', 'chemistry', 'numeric', 'mmol/L', 23, 29, true)
ON CONFLICT (tenant_id, code, code_system) DO NOTHING;

-- Glucose & Diabetes
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, lab_domain, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '4548-4', 'LOINC', 'Hemoglobin A1c',  'الهيموغلوبين السكري', 'laboratory', 'chemistry', 'numeric', '%',     4.0,   5.6,   true),
  (uuid_generate_v4(), NULL, '1558-6', 'LOINC', 'Fasting Glucose',  'الجلوكوز الصائم',     'laboratory', 'chemistry', 'numeric', 'mg/dL', 70,    100,   true)
ON CONFLICT (tenant_id, code, code_system) DO NOTHING;

-- Lipid Panel
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, lab_domain, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '2093-3', 'LOINC', 'Total Cholesterol', 'الكوليسترول الكلي', 'laboratory', 'chemistry', 'numeric', 'mg/dL', NULL, 200,  true),
  (uuid_generate_v4(), NULL, '2089-1', 'LOINC', 'LDL Cholesterol',   'الكوليسترول الضار', 'laboratory', 'chemistry', 'numeric', 'mg/dL', NULL, 100,  true),
  (uuid_generate_v4(), NULL, '2085-9', 'LOINC', 'HDL Cholesterol',   'الكوليسترول النافع', 'laboratory', 'chemistry', 'numeric', 'mg/dL', 40,   NULL, true),
  (uuid_generate_v4(), NULL, '2571-8', 'LOINC', 'Triglycerides',     'الدهون الثلاثية',    'laboratory', 'chemistry', 'numeric', 'mg/dL', NULL, 150,  true)
ON CONFLICT (tenant_id, code, code_system) DO NOTHING;

-- Liver Function
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, lab_domain, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '1742-6', 'LOINC', 'ALT (Alanine Aminotransferase)',     'ناقلة أمين الألانين',     'laboratory', 'chemistry', 'numeric', 'U/L', NULL, 35,  true),
  (uuid_generate_v4(), NULL, '1920-8', 'LOINC', 'AST (Aspartate Aminotransferase)',   'ناقلة أمين الأسبارتات',   'laboratory', 'chemistry', 'numeric', 'U/L', NULL, 35,  true),
  (uuid_generate_v4(), NULL, '1975-2', 'LOINC', 'Total Bilirubin',                     'البيليروبين الكلي',       'laboratory', 'chemistry', 'numeric', 'mg/dL', NULL, 1.2, true),
  (uuid_generate_v4(), NULL, '6768-6', 'LOINC', 'Alkaline Phosphatase',                'الفوسفاتاز القلوي',       'laboratory', 'chemistry', 'numeric', 'U/L', 44,   147,  true),
  (uuid_generate_v4(), NULL, '2885-2', 'LOINC', 'Total Protein',                       'البروتين الكلي',          'laboratory', 'chemistry', 'numeric', 'g/dL', 6.0,  8.3,  true),
  (uuid_generate_v4(), NULL, '1751-7', 'LOINC', 'Albumin',                             'الألبومين',               'laboratory', 'chemistry', 'numeric', 'g/dL', 3.5,  5.5,  true)
ON CONFLICT (tenant_id, code, code_system) DO NOTHING;

-- Thyroid
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, lab_domain, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '3016-3', 'LOINC', 'TSH',  'هرمون تنشيط الغدة الدرقية', 'laboratory', 'chemistry', 'numeric', 'mIU/L', 0.4,  4.0,  true),
  (uuid_generate_v4(), NULL, '3026-2', 'LOINC', 'Free T4', 'هرمون الثايروكسين الحر',  'laboratory', 'chemistry', 'numeric', 'ng/dL', 0.8,  1.8,  true),
  (uuid_generate_v4(), NULL, '3053-6', 'LOINC', 'Free T3', 'هرمون ثلاثي يودوثيرونين',  'laboratory', 'chemistry', 'numeric', 'pg/mL', 2.3,  4.2,  true)
ON CONFLICT (tenant_id, code, code_system) DO NOTHING;

-- Cardiac Imaging (ECHO)
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, lab_domain, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '10230-1', 'LOINC', 'Ejection Fraction',                'الكسر القذفي',                           'imaging', NULL, 'numeric', '%',  55,   70,   true),
  (uuid_generate_v4(), NULL, '29430-6', 'LOINC', 'LV Internal Diameter (Diastole)',   'القطر الداخلي للبطين الأيسر (الانبساط)', 'imaging', NULL, 'numeric', 'cm', 3.5,  5.7,  true),
  (uuid_generate_v4(), NULL, '29438-9', 'LOINC', 'LV Internal Diameter (Systole)',    'القطر الداخلي للبطين الأيسر (الانقباض)', 'imaging', NULL, 'numeric', 'cm', 2.0,  4.0,  true)
ON CONFLICT (tenant_id, code, code_system) DO NOTHING;

-- Coagulation
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, lab_domain, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '5902-2', 'LOINC', 'PT (Prothrombin Time)', 'زمن البروثرومبين', 'laboratory', 'coagulation', 'numeric', 'seconds', 11,   13.5, true),
  (uuid_generate_v4(), NULL, '6301-6', 'LOINC', 'INR',                   'نسبة التخثر الدولية', 'laboratory', 'coagulation', 'numeric', 'ratio',  0.8,  1.1,  true),
  (uuid_generate_v4(), NULL, '3173-2', 'LOINC', 'aPTT',                  'زمن الثرومبوبلاستين الجزئي', 'laboratory', 'coagulation', 'numeric', 'seconds', 25, 35, true)
ON CONFLICT (tenant_id, code, code_system) DO NOTHING;

-- Urinalysis
INSERT INTO observation_code_catalog (id, tenant_id, code, code_system, display_name, display_name_ar, category, lab_domain, data_type, default_unit, ref_range_low, ref_range_high, is_active)
VALUES
  (uuid_generate_v4(), NULL, '2965-2', 'LOINC', 'Urine Specific Gravity', 'الثقل النوعي للبول', 'laboratory', 'urinalysis', 'numeric', NULL, 1.005, 1.030, true),
  (uuid_generate_v4(), NULL, '2756-5', 'LOINC', 'Urine pH',               'حموضة البول',        'laboratory', 'urinalysis', 'numeric', NULL, 4.5,   8.0,   true)
ON CONFLICT (tenant_id, code, code_system) DO NOTHING;
