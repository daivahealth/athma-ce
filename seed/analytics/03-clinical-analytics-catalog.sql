-- ============================================================================
-- Clinical Analytics - Semantic Catalog Extension
-- Adds metrics, dimensions, and join paths for clinical observations,
-- diagnoses, orders, prescriptions, notes, and clinical codings.
--
-- NOTE: Run AFTER 02-semantic-catalog.sql (this extends, not replaces)
-- These tables are in zeal_analytics database
-- ============================================================================

DO $$
BEGIN
  -- =========================================================================
  -- METRICS - Clinical Analytics
  -- =========================================================================
  INSERT INTO semantic_metrics (
    id, tenant_id, name, display_name, display_name_ar, description,
    expression, database, base_table, data_type, default_aggregation,
    required_permission, category, format, sort_order, is_active,
    created_at, updated_at
  ) VALUES

    -- === Vital Signs & Observations (from clinical_observations) ===
    ('b1000001-0001-0001-0001-000000000001', NULL, 'avg_heart_rate', 'Average Heart Rate', 'متوسط معدل ضربات القلب',
     'Average heart rate from vital signs. Filter: code = ''8867-4''',
     'value_numeric', 'clinical', 'clinical_observations', 'decimal', 'AVG',
     'clinical.reports.vitals', 'Vitals', 'number', 100, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000002', NULL, 'avg_systolic_bp', 'Average Systolic BP', 'متوسط ضغط الدم الانقباضي',
     'Average systolic blood pressure. Filter: code = ''8480-6''',
     'value_numeric', 'clinical', 'clinical_observations', 'decimal', 'AVG',
     'clinical.reports.vitals', 'Vitals', 'number', 101, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000003', NULL, 'avg_diastolic_bp', 'Average Diastolic BP', 'متوسط ضغط الدم الانبساطي',
     'Average diastolic blood pressure. Filter: code = ''8462-4''',
     'value_numeric', 'clinical', 'clinical_observations', 'decimal', 'AVG',
     'clinical.reports.vitals', 'Vitals', 'number', 102, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000004', NULL, 'avg_temperature', 'Average Temperature', 'متوسط درجة الحرارة',
     'Average body temperature in Celsius. Filter: code = ''8310-5''',
     'value_numeric', 'clinical', 'clinical_observations', 'decimal', 'AVG',
     'clinical.reports.vitals', 'Vitals', 'number', 103, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000005', NULL, 'avg_spo2', 'Average SpO2', 'متوسط تشبع الأكسجين',
     'Average oxygen saturation. Filter: code = ''2708-6''',
     'value_numeric', 'clinical', 'clinical_observations', 'decimal', 'AVG',
     'clinical.reports.vitals', 'Vitals', 'number', 104, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000006', NULL, 'avg_bmi', 'Average BMI', 'متوسط مؤشر كتلة الجسم',
     'Average Body Mass Index. Filter: code = ''39156-5''',
     'value_numeric', 'clinical', 'clinical_observations', 'decimal', 'AVG',
     'clinical.reports.vitals', 'Vitals', 'number', 105, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000007', NULL, 'observation_count', 'Observation Count', 'عدد القياسات',
     'Count of clinical observations (vitals, labs, imaging)', '1', 'clinical', 'clinical_observations', 'integer', 'COUNT',
     'clinical.reports.vitals', 'Vitals', 'number', 106, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000008', NULL, 'observation_value', 'Observation Value', 'قيمة القياس',
     'Individual observation numeric value (for listing observations)', 'value_numeric', 'clinical', 'clinical_observations', 'decimal', NULL,
     'clinical.reports.vitals', 'Vitals', 'number', 107, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000009', NULL, 'abnormal_vitals_count', 'Abnormal Vitals Count', 'عدد القياسات غير الطبيعية',
     'Count of abnormal vital sign readings. Filter: interpretation IN (''high'',''low'',''critical_high'',''critical_low'')',
     '1', 'clinical', 'clinical_observations', 'integer', 'COUNT',
     'clinical.reports.vitals', 'Vitals', 'number', 108, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000010', NULL, 'avg_ejection_fraction', 'Average Ejection Fraction', 'متوسط الكسر القذفي',
     'Average ejection fraction from ECHO reports. Filter: code = ''10230-1''',
     'value_numeric', 'clinical', 'clinical_observations', 'decimal', 'AVG',
     'clinical.reports.imaging', 'Imaging', 'number', 110, true, NOW(), NOW()),

    -- === Diagnosis Metrics (from encounter_diagnoses) ===
    ('b1000001-0001-0001-0001-000000000020', NULL, 'diagnosis_count', 'Diagnosis Count', 'عدد التشخيصات',
     'Count of diagnoses across encounters', '1', 'clinical', 'encounter_diagnoses', 'integer', 'COUNT',
     'clinical.reports.diagnoses', 'Diagnoses', 'number', 120, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000021', NULL, 'primary_diagnosis_count', 'Primary Diagnosis Count', 'عدد التشخيصات الرئيسية',
     'Count of primary diagnoses. Filter: diagnosis_type = ''primary''', '1', 'clinical', 'encounter_diagnoses', 'integer', 'COUNT',
     'clinical.reports.diagnoses', 'Diagnoses', 'number', 121, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000022', NULL, 'unique_diagnosis_count', 'Unique Diagnosis Count', 'عدد التشخيصات الفريدة',
     'Count of distinct ICD codes', 'icd_code', 'clinical', 'encounter_diagnoses', 'integer', 'COUNT_DISTINCT',
     'clinical.reports.diagnoses', 'Diagnoses', 'number', 122, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000023', NULL, 'chronic_condition_count', 'Chronic Condition Count', 'عدد الأمراض المزمنة',
     'Count of chronic conditions. Filter: is_chronic = true', '1', 'clinical', 'encounter_diagnoses', 'integer', 'COUNT',
     'clinical.reports.diagnoses', 'Diagnoses', 'number', 123, true, NOW(), NOW()),

    -- === Clinical Orders (from clinical_orders) ===
    ('b1000001-0001-0001-0001-000000000030', NULL, 'total_order_count', 'Total Order Count', 'إجمالي عدد الطلبات',
     'Count of all clinical orders (lab, imaging, procedure)', '1', 'clinical', 'clinical_orders', 'integer', 'COUNT',
     'clinical.reports.orders', 'Orders', 'number', 130, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000031', NULL, 'lab_order_count', 'Lab Order Count', 'عدد طلبات المختبر',
     'Count of lab orders. Filter: order_type = ''lab''', '1', 'clinical', 'clinical_orders', 'integer', 'COUNT',
     'clinical.reports.orders', 'Orders', 'number', 131, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000032', NULL, 'imaging_order_count', 'Imaging Order Count', 'عدد طلبات الأشعة',
     'Count of imaging orders. Filter: order_type = ''imaging''', '1', 'clinical', 'clinical_orders', 'integer', 'COUNT',
     'clinical.reports.orders', 'Orders', 'number', 132, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000033', NULL, 'procedure_order_count', 'Procedure Order Count', 'عدد طلبات الإجراءات',
     'Count of procedure orders. Filter: order_type = ''procedure''', '1', 'clinical', 'clinical_orders', 'integer', 'COUNT',
     'clinical.reports.orders', 'Orders', 'number', 133, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000034', NULL, 'avg_turnaround_hours', 'Average Turnaround Time (Hours)', 'متوسط وقت الإنجاز (ساعات)',
     'Average hours between order placement and result. Filter: resulted_at IS NOT NULL',
     'EXTRACT(EPOCH FROM (resulted_at - ordered_at)) / 3600', 'clinical', 'clinical_orders', 'decimal', 'AVG',
     'clinical.reports.orders', 'Orders', 'number', 134, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000035', NULL, 'pending_results_count', 'Pending Results Count', 'عدد النتائج المعلقة',
     'Count of orders with pending results. Filter: result_status = ''pending'' OR result_status IS NULL',
     '1', 'clinical', 'clinical_orders', 'integer', 'COUNT',
     'clinical.reports.orders', 'Orders', 'number', 135, true, NOW(), NOW()),

    -- === Prescriptions (from prescription_orders) ===
    ('b1000001-0001-0001-0001-000000000040', NULL, 'prescription_count', 'Prescription Count', 'عدد الوصفات',
     'Count of prescriptions', '1', 'clinical', 'prescription_orders', 'integer', 'COUNT',
     'clinical.reports.prescriptions', 'Prescriptions', 'number', 140, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000041', NULL, 'active_prescription_count', 'Active Prescription Count', 'عدد الوصفات النشطة',
     'Count of active prescriptions. Filter: status = ''active''', '1', 'clinical', 'prescription_orders', 'integer', 'COUNT',
     'clinical.reports.prescriptions', 'Prescriptions', 'number', 141, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000042', NULL, 'unique_medication_count', 'Unique Medication Count', 'عدد الأدوية الفريدة',
     'Count of distinct medications prescribed', 'drug_name', 'clinical', 'prescription_orders', 'integer', 'COUNT_DISTINCT',
     'clinical.reports.prescriptions', 'Prescriptions', 'number', 142, true, NOW(), NOW()),

    -- === Clinical Notes (from encounter_notes) ===
    ('b1000001-0001-0001-0001-000000000050', NULL, 'clinical_note_count', 'Clinical Note Count', 'عدد الملاحظات السريرية',
     'Count of clinical notes', '1', 'clinical', 'encounter_notes', 'integer', 'COUNT',
     'clinical.reports.notes', 'Documentation', 'number', 150, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000051', NULL, 'signed_note_count', 'Signed Note Count', 'عدد الملاحظات الموقعة',
     'Count of signed/finalized notes. Filter: status = ''signed''', '1', 'clinical', 'encounter_notes', 'integer', 'COUNT',
     'clinical.reports.notes', 'Documentation', 'number', 151, true, NOW(), NOW()),

    -- === Clinical Codings (from encounter_clinical_codings) ===
    ('b1000001-0001-0001-0001-000000000060', NULL, 'coding_count', 'Clinical Coding Count', 'عدد الترميزات السريرية',
     'Count of accepted clinical codings. Filter: status = ''accepted''',
     '1', 'clinical', 'encounter_clinical_codings', 'integer', 'COUNT',
     'clinical.reports.codings', 'AI Coding', 'number', 160, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000061', NULL, 'ai_acceptance_rate', 'AI Suggestion Acceptance Rate', 'معدل قبول اقتراحات الذكاء الاصطناعي',
     'Percentage of AI coding suggestions accepted vs total (accepted + rejected)',
     'CASE WHEN status IN (''accepted'',''rejected'') THEN CASE WHEN status = ''accepted'' THEN 1 ELSE 0 END END',
     'clinical', 'encounter_clinical_codings', 'decimal', 'AVG',
     'clinical.reports.ai', 'AI Coding', 'percentage', 161, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000062', NULL, 'unique_codes_count', 'Unique Clinical Codes', 'عدد الرموز السريرية الفريدة',
     'Count of distinct clinical codes used', 'code', 'clinical', 'encounter_clinical_codings', 'integer', 'COUNT_DISTINCT',
     'clinical.reports.codings', 'AI Coding', 'number', 162, true, NOW(), NOW()),

    -- === Dashboard Aggregates (from clinical_observation_daily in analytics DB) ===
    ('b1000001-0001-0001-0001-000000000070', NULL, 'daily_avg_value', 'Daily Average Value', 'المتوسط اليومي',
     'Pre-aggregated daily average observation value (use for trends/dashboards)',
     'avg_value', 'analytics', 'clinical_observation_daily', 'decimal', 'AVG',
     'clinical.reports.vitals', 'Dashboard', 'number', 170, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000071', NULL, 'daily_record_count', 'Daily Record Count', 'العدد اليومي',
     'Pre-aggregated daily observation count (use for trends/dashboards)',
     'record_count', 'analytics', 'clinical_observation_daily', 'integer', 'SUM',
     'clinical.reports.vitals', 'Dashboard', 'number', 171, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000072', NULL, 'daily_abnormal_count', 'Daily Abnormal Count', 'العدد اليومي غير الطبيعي',
     'Pre-aggregated daily count of abnormal observations',
     'abnormal_high_count + abnormal_low_count + critical_count', 'analytics', 'clinical_observation_daily', 'integer', 'SUM',
     'clinical.reports.vitals', 'Dashboard', 'number', 172, true, NOW(), NOW())

  ON CONFLICT (tenant_id, name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    expression = EXCLUDED.expression,
    database = EXCLUDED.database,
    base_table = EXCLUDED.base_table,
    updated_at = NOW();

  -- =========================================================================
  -- DIMENSIONS - What can be grouped/filtered by
  -- =========================================================================
  INSERT INTO semantic_dimensions (
    id, tenant_id, name, display_name, display_name_ar, description,
    column_ref, database, base_table, data_type, allowed_operators,
    is_lookup, lookup_values,
    required_permission, category, sort_order, is_active,
    created_at, updated_at
  ) VALUES

    -- === clinical_observations dimensions ===
    ('c1000001-0001-0001-0001-000000000001', NULL, 'observation_code', 'Observation Code', 'رمز القياس',
     'LOINC code for the observation (e.g., 8867-4 for Heart Rate)',
     'code', 'clinical', 'clinical_observations', 'string', '{"eq","in"}',
     false, '{}',
     'clinical.reports.vitals', 'Observations', 100, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000002', NULL, 'observation_name', 'Observation Name', 'اسم القياس',
     'Display name of the observation (e.g., Heart Rate, Hemoglobin)',
     'display_name', 'clinical', 'clinical_observations', 'string', '{"eq","contains","in"}',
     false, '{}',
     'clinical.reports.vitals', 'Observations', 101, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000003', NULL, 'observation_category', 'Observation Category', 'فئة القياس',
     'Category of observation',
     'category', 'clinical', 'clinical_observations', 'string', '{"eq","in"}',
     true, '{"vital-signs","laboratory","imaging","exam","score"}',
     'clinical.reports.vitals', 'Observations', 102, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000004', NULL, 'observation_date', 'Observation Date', 'تاريخ القياس',
     'Date the observation was recorded',
     'observed_at::date', 'clinical', 'clinical_observations', 'date', '{"eq","gte","lte","between"}',
     false, '{}',
     'clinical.reports.vitals', 'Time', 103, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000005', NULL, 'observation_interpretation', 'Interpretation', 'التفسير',
     'Whether the value is normal, high, low, or critical',
     'interpretation', 'clinical', 'clinical_observations', 'string', '{"eq","in"}',
     true, '{"normal","high","low","critical_high","critical_low"}',
     'clinical.reports.vitals', 'Observations', 104, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000006', NULL, 'observation_unit', 'Unit', 'الوحدة',
     'Unit of measurement',
     'unit', 'clinical', 'clinical_observations', 'string', '{"eq"}',
     false, '{}',
     'clinical.reports.vitals', 'Observations', 105, true, NOW(), NOW()),

    -- === encounter_diagnoses dimensions ===
    ('c1000001-0001-0001-0001-000000000010', NULL, 'icd_code', 'ICD Code', 'رمز التصنيف الدولي',
     'ICD-10 diagnosis code (e.g., E11.9 for Type 2 Diabetes)',
     'icd_code', 'clinical', 'encounter_diagnoses', 'string', '{"eq","starts_with","in"}',
     false, '{}',
     'clinical.reports.diagnoses', 'Diagnoses', 110, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000011', NULL, 'icd_block', 'ICD Block', 'مجموعة التصنيف',
     'First 3 characters of ICD code for grouping (e.g., E11 for Diabetes, I50 for Heart Failure)',
     'SUBSTRING(icd_code FROM 1 FOR 3)', 'clinical', 'encounter_diagnoses', 'string', '{"eq","in"}',
     false, '{}',
     'clinical.reports.diagnoses', 'Diagnoses', 111, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000012', NULL, 'diagnosis_name', 'Diagnosis Name', 'اسم التشخيص',
     'Full diagnosis name in English',
     'diagnosis_name', 'clinical', 'encounter_diagnoses', 'string', '{"eq","contains","in"}',
     false, '{}',
     'clinical.reports.diagnoses', 'Diagnoses', 112, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000013', NULL, 'diagnosis_type', 'Diagnosis Type', 'نوع التشخيص',
     'Type of diagnosis (primary, secondary, rule_out, differential)',
     'diagnosis_type', 'clinical', 'encounter_diagnoses', 'string', '{"eq","in"}',
     true, '{"primary","secondary","rule_out","differential"}',
     'clinical.reports.diagnoses', 'Diagnoses', 113, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000014', NULL, 'is_chronic', 'Is Chronic', 'مزمن',
     'Whether the diagnosis is a chronic condition',
     'is_chronic', 'clinical', 'encounter_diagnoses', 'boolean', '{"eq"}',
     true, '{"true","false"}',
     'clinical.reports.diagnoses', 'Diagnoses', 114, true, NOW(), NOW()),

    -- === clinical_orders dimensions ===
    ('c1000001-0001-0001-0001-000000000020', NULL, 'order_type', 'Order Type', 'نوع الطلب',
     'Type of clinical order',
     'order_type', 'clinical', 'clinical_orders', 'string', '{"eq","in"}',
     true, '{"lab","imaging","procedure"}',
     'clinical.reports.orders', 'Orders', 120, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000021', NULL, 'order_code', 'Order Code', 'رمز الطلب',
     'Code for the ordered test/procedure',
     'order_code', 'clinical', 'clinical_orders', 'string', '{"eq","contains","in"}',
     false, '{}',
     'clinical.reports.orders', 'Orders', 121, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000022', NULL, 'order_name', 'Order Name', 'اسم الطلب',
     'Name of the ordered test/procedure',
     'order_name', 'clinical', 'clinical_orders', 'string', '{"eq","contains","in"}',
     false, '{}',
     'clinical.reports.orders', 'Orders', 121, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000023', NULL, 'order_priority', 'Order Priority', 'أولوية الطلب',
     'Priority of the order',
     'priority', 'clinical', 'clinical_orders', 'string', '{"eq","in"}',
     true, '{"routine","urgent","stat"}',
     'clinical.reports.orders', 'Orders', 122, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000024', NULL, 'order_status', 'Order Status', 'حالة الطلب',
     'Current status of the order',
     'status', 'clinical', 'clinical_orders', 'string', '{"eq","in"}',
     true, '{"ordered","in_progress","completed","cancelled"}',
     'clinical.reports.orders', 'Orders', 123, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000025', NULL, 'result_status', 'Result Status', 'حالة النتيجة',
     'Status of order results',
     'result_status', 'clinical', 'clinical_orders', 'string', '{"eq","in"}',
     true, '{"pending","preliminary","final","amended"}',
     'clinical.reports.orders', 'Orders', 124, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000026', NULL, 'order_date', 'Order Date', 'تاريخ الطلب',
     'Date the order was placed',
     'ordered_at::date', 'clinical', 'clinical_orders', 'date', '{"eq","gte","lte","between"}',
     false, '{}',
     'clinical.reports.orders', 'Time', 125, true, NOW(), NOW()),

    -- === prescription_orders dimensions ===
    ('c1000001-0001-0001-0001-000000000030', NULL, 'drug_name', 'Drug Name', 'اسم الدواء',
     'Brand/trade name of the medication',
     'drug_name', 'clinical', 'prescription_orders', 'string', '{"eq","contains","in"}',
     false, '{}',
     'clinical.reports.prescriptions', 'Prescriptions', 130, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000031', NULL, 'generic_name', 'Generic Name', 'الاسم العلمي',
     'Generic name of the medication',
     'generic_name', 'clinical', 'prescription_orders', 'string', '{"eq","contains","in"}',
     false, '{}',
     'clinical.reports.prescriptions', 'Prescriptions', 131, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000032', NULL, 'drug_route', 'Drug Route', 'طريقة الإعطاء',
     'Route of administration',
     'route', 'clinical', 'prescription_orders', 'string', '{"eq","in"}',
     false, '{}',
     'clinical.reports.prescriptions', 'Prescriptions', 132, true, NOW(), NOW()),

    -- === encounter_clinical_codings dimensions ===
    ('c1000001-0001-0001-0001-000000000040', NULL, 'coding_type', 'Coding Type', 'نوع الترميز',
     'Type of clinical coding',
     'coding_type', 'clinical', 'encounter_clinical_codings', 'string', '{"eq","in"}',
     true, '{"diagnosis","symptom","finding","procedure","medication"}',
     'clinical.reports.codings', 'AI Coding', 140, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000041', NULL, 'coding_code', 'Clinical Code', 'الرمز السريري',
     'ICD-10 or SNOMED code from AI suggestion',
     'code', 'clinical', 'encounter_clinical_codings', 'string', '{"eq","starts_with","in"}',
     false, '{}',
     'clinical.reports.codings', 'AI Coding', 141, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000042', NULL, 'coding_code_system', 'Code System', 'نظام الترميز',
     'Which coding system (ICD-10, SNOMED-CT)',
     'code_system', 'clinical', 'encounter_clinical_codings', 'string', '{"eq","in"}',
     true, '{"ICD-10","SNOMED-CT"}',
     'clinical.reports.codings', 'AI Coding', 142, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000043', NULL, 'coding_status', 'Coding Status', 'حالة الترميز',
     'Whether the coding was accepted, rejected, or modified by the clinician',
     'status', 'clinical', 'encounter_clinical_codings', 'string', '{"eq","in"}',
     true, '{"accepted","rejected","modified","manual"}',
     'clinical.reports.codings', 'AI Coding', 143, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000044', NULL, 'source_block_type', 'Source Block Type', 'نوع المصدر',
     'Which part of the clinical note triggered the coding suggestion',
     'source_block_type', 'clinical', 'encounter_clinical_codings', 'string', '{"eq","in"}',
     true, '{"chiefHpi","history","notes","assessment"}',
     'clinical.reports.codings', 'AI Coding', 144, true, NOW(), NOW()),

    -- === encounter_notes dimensions ===
    ('c1000001-0001-0001-0001-000000000050', NULL, 'note_type', 'Note Type', 'نوع الملاحظة',
     'Type of clinical note',
     'note_type', 'clinical', 'encounter_notes', 'string', '{"eq","in"}',
     false, '{}',
     'clinical.reports.notes', 'Documentation', 150, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000051', NULL, 'note_status', 'Note Status', 'حالة الملاحظة',
     'Status of the clinical note',
     'status', 'clinical', 'encounter_notes', 'string', '{"eq","in"}',
     false, '{}',
     'clinical.reports.notes', 'Documentation', 151, true, NOW(), NOW()),

    -- === triages dimensions ===
    ('c1000001-0001-0001-0001-000000000060', NULL, 'triage_level', 'Triage Level', 'مستوى الفرز',
     'ESI triage level (1-5)',
     'triage_level', 'clinical', 'triages', 'integer', '{"eq","gte","lte","in"}',
     true, '{"1","2","3","4","5"}',
     'clinical.reports.encounters', 'Encounters', 160, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000061', NULL, 'triage_date', 'Triage Date', 'تاريخ الفرز',
     'Date of triage',
     'triage_time::date', 'clinical', 'triages', 'date', '{"eq","gte","lte","between"}',
     false, '{}',
     'clinical.reports.encounters', 'Time', 161, true, NOW(), NOW()),

    -- === clinical_observation_daily dimensions (analytics DB) ===
    ('c1000001-0001-0001-0001-000000000070', NULL, 'daily_observation_date', 'Date', 'التاريخ',
     'Date for daily aggregated observations',
     'observation_date', 'analytics', 'clinical_observation_daily', 'date', '{"eq","gte","lte","between"}',
     false, '{}',
     'clinical.reports.vitals', 'Time', 170, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000071', NULL, 'daily_observation_code', 'Observation Code (Daily)', 'رمز القياس اليومي',
     'LOINC code for the daily aggregated observation',
     'code', 'analytics', 'clinical_observation_daily', 'string', '{"eq","in"}',
     false, '{}',
     'clinical.reports.vitals', 'Dashboard', 171, true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000072', NULL, 'daily_observation_category', 'Category (Daily)', 'الفئة اليومية',
     'Observation category for daily aggregates',
     'category', 'analytics', 'clinical_observation_daily', 'string', '{"eq","in"}',
     true, '{"vital-signs","laboratory","imaging","exam","score"}',
     'clinical.reports.vitals', 'Dashboard', 172, true, NOW(), NOW())

  ON CONFLICT (tenant_id, name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    column_ref = EXCLUDED.column_ref,
    database = EXCLUDED.database,
    base_table = EXCLUDED.base_table,
    updated_at = NOW();

  -- =========================================================================
  -- JOIN PATHS - How tables connect for cross-table queries
  -- =========================================================================
  INSERT INTO semantic_join_paths (
    id, tenant_id, name,
    from_table, from_database, to_table, to_database,
    join_type, join_condition, cardinality, description,
    is_active, created_at, updated_at
  ) VALUES

    -- clinical_observations joins
    ('d1000001-0001-0001-0001-000000000001', NULL, 'observations_to_patients',
     'clinical_observations', 'clinical', 'patients', 'clinical',
     'inner', 'clinical_observations.patient_id = patients.id', 'many-to-one',
     'Link observations to the patient they belong to',
     true, NOW(), NOW()),

    ('d1000001-0001-0001-0001-000000000002', NULL, 'observations_to_encounters',
     'clinical_observations', 'clinical', 'encounters', 'clinical',
     'left', 'clinical_observations.encounter_id = encounters.id', 'many-to-one',
     'Link observations to the encounter they were recorded in',
     true, NOW(), NOW()),

    ('d1000001-0001-0001-0001-000000000003', NULL, 'observations_to_orders',
     'clinical_observations', 'clinical', 'clinical_orders', 'clinical',
     'left', 'clinical_observations.order_id = clinical_orders.id', 'many-to-one',
     'Link observations to the source clinical order (for lab/imaging results)',
     true, NOW(), NOW()),

    -- encounter_diagnoses joins
    ('d1000001-0001-0001-0001-000000000010', NULL, 'diagnoses_to_patients',
     'encounter_diagnoses', 'clinical', 'patients', 'clinical',
     'inner', 'encounter_diagnoses.patient_id = patients.id', 'many-to-one',
     'Link diagnoses to the patient',
     true, NOW(), NOW()),

    ('d1000001-0001-0001-0001-000000000011', NULL, 'diagnoses_to_encounters',
     'encounter_diagnoses', 'clinical', 'encounters', 'clinical',
     'inner', 'encounter_diagnoses.encounter_id = encounters.id', 'many-to-one',
     'Link diagnoses to the encounter',
     true, NOW(), NOW()),

    -- clinical_orders joins
    ('d1000001-0001-0001-0001-000000000020', NULL, 'orders_to_patients',
     'clinical_orders', 'clinical', 'patients', 'clinical',
     'inner', 'clinical_orders.patient_id = patients.id', 'many-to-one',
     'Link clinical orders to the patient',
     true, NOW(), NOW()),

    ('d1000001-0001-0001-0001-000000000021', NULL, 'orders_to_encounters',
     'clinical_orders', 'clinical', 'encounters', 'clinical',
     'left', 'clinical_orders.encounter_id = encounters.id', 'many-to-one',
     'Link clinical orders to the encounter',
     true, NOW(), NOW()),

    -- prescription_orders joins
    ('d1000001-0001-0001-0001-000000000030', NULL, 'prescriptions_to_patients',
     'prescription_orders', 'clinical', 'patients', 'clinical',
     'inner', 'prescription_orders.patient_id = patients.id', 'many-to-one',
     'Link prescriptions to the patient',
     true, NOW(), NOW()),

    ('d1000001-0001-0001-0001-000000000031', NULL, 'prescriptions_to_encounters',
     'prescription_orders', 'clinical', 'encounters', 'clinical',
     'left', 'prescription_orders.encounter_id = encounters.id', 'many-to-one',
     'Link prescriptions to the encounter',
     true, NOW(), NOW()),

    -- encounter_notes joins
    ('d1000001-0001-0001-0001-000000000040', NULL, 'notes_to_encounters',
     'encounter_notes', 'clinical', 'encounters', 'clinical',
     'inner', 'encounter_notes.encounter_id = encounters.id', 'many-to-one',
     'Link notes to the encounter',
     true, NOW(), NOW()),

    ('d1000001-0001-0001-0001-000000000041', NULL, 'notes_to_patients',
     'encounter_notes', 'clinical', 'patients', 'clinical',
     'inner', 'encounter_notes.patient_id = patients.id', 'many-to-one',
     'Link notes to the patient',
     true, NOW(), NOW()),

    -- encounter_clinical_codings joins
    ('d1000001-0001-0001-0001-000000000050', NULL, 'codings_to_encounters',
     'encounter_clinical_codings', 'clinical', 'encounters', 'clinical',
     'inner', 'encounter_clinical_codings.encounter_id = encounters.id', 'many-to-one',
     'Link clinical codings to the encounter',
     true, NOW(), NOW()),

    ('d1000001-0001-0001-0001-000000000051', NULL, 'codings_to_patients',
     'encounter_clinical_codings', 'clinical', 'patients', 'clinical',
     'inner', 'encounter_clinical_codings.patient_id = patients.id', 'many-to-one',
     'Link clinical codings to the patient',
     true, NOW(), NOW()),

    -- triages joins
    ('d1000001-0001-0001-0001-000000000060', NULL, 'triages_to_encounters',
     'triages', 'clinical', 'encounters', 'clinical',
     'inner', 'triages.encounter_id = encounters.id', 'one-to-one',
     'Link triage to the encounter',
     true, NOW(), NOW()),

    ('d1000001-0001-0001-0001-000000000061', NULL, 'triages_to_patients',
     'triages', 'clinical', 'patients', 'clinical',
     'inner', 'triages.patient_id = patients.id', 'many-to-one',
     'Link triage to the patient',
     true, NOW(), NOW()),

    -- Cross-clinical joins (observations ↔ diagnoses for registry queries)
    ('d1000001-0001-0001-0001-000000000070', NULL, 'diagnoses_to_observations',
     'encounter_diagnoses', 'clinical', 'clinical_observations', 'clinical',
     'inner', 'encounter_diagnoses.encounter_id = clinical_observations.encounter_id AND encounter_diagnoses.tenant_id = clinical_observations.tenant_id',
     'many-to-many',
     'Link diagnoses to observations in the same encounter (for registry queries like "patients with diagnosis X and observation Y > value")',
     true, NOW(), NOW()),

    ('d1000001-0001-0001-0001-000000000071', NULL, 'orders_to_observations',
     'clinical_orders', 'clinical', 'clinical_observations', 'clinical',
     'left', 'clinical_orders.id = clinical_observations.order_id',
     'one-to-many',
     'Link clinical orders to their result observations',
     true, NOW(), NOW())

  ON CONFLICT (tenant_id, name) DO UPDATE SET
    join_condition = EXCLUDED.join_condition,
    description = EXCLUDED.description,
    updated_at = NOW();

END $$;
