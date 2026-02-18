-- ============================================================================
-- AI Features - Semantic Catalog Seed Data
-- This provides the initial metrics, dimensions, and join paths for the
-- Natural Language Report Builder feature
-- ============================================================================

-- Fixed UUIDs for consistent seeding
-- Metrics
DO $$
BEGIN
  -- Revenue Metrics
  INSERT INTO semantic_metrics (id, tenant_id, name, display_name, display_name_ar, description, expression, database, base_table, data_type, default_aggregation, required_permission, category, format, is_active)
  VALUES
    ('a1000001-0001-0001-0001-000000000001', NULL, 'total_revenue', 'Total Revenue', 'إجمالي الإيرادات', 'Sum of all invoice net amounts', 'net_amount', 'rcm', 'invoices', 'decimal', 'SUM', 'rcm.reports.revenue', 'Revenue', 'currency', true),
    ('a1000001-0001-0001-0001-000000000002', NULL, 'invoice_count', 'Invoice Count', 'عدد الفواتير', 'Count of invoices', '1', 'rcm', 'invoices', 'integer', 'COUNT', 'rcm.reports.invoices', 'Revenue', 'number', true),
    ('a1000001-0001-0001-0001-000000000003', NULL, 'outstanding_balance', 'Outstanding Balance', 'الرصيد المستحق', 'Sum of unpaid invoice amounts', 'balance_due', 'rcm', 'invoices', 'decimal', 'SUM', 'rcm.reports.aging', 'Revenue', 'currency', true),
    ('a1000001-0001-0001-0001-000000000004', NULL, 'paid_amount', 'Paid Amount', 'المبلغ المدفوع', 'Sum of paid amounts', 'paid_amount', 'rcm', 'invoices', 'decimal', 'SUM', 'rcm.reports.revenue', 'Revenue', 'currency', true),
    ('a1000001-0001-0001-0001-000000000005', NULL, 'discount_amount', 'Discount Amount', 'مبلغ الخصم', 'Sum of discounts applied', 'discount_amount', 'rcm', 'invoices', 'decimal', 'SUM', 'rcm.reports.revenue', 'Revenue', 'currency', true),

    -- Clinical Metrics
    ('a1000001-0001-0001-0001-000000000010', NULL, 'patient_count', 'Patient Count', 'عدد المرضى', 'Count of unique patients', 'id', 'clinical', 'patients', 'integer', 'COUNT_DISTINCT', 'clinical.reports.patients', 'Clinical', 'number', true),
    ('a1000001-0001-0001-0001-000000000011', NULL, 'encounter_count', 'Encounter Count', 'عدد الزيارات', 'Count of patient encounters', '1', 'clinical', 'encounters', 'integer', 'COUNT', 'clinical.reports.encounters', 'Clinical', 'number', true),
    ('a1000001-0001-0001-0001-000000000012', NULL, 'new_patient_count', 'New Patients', 'المرضى الجدد', 'Count of newly registered patients', '1', 'clinical', 'patients', 'integer', 'COUNT', 'clinical.reports.patients', 'Clinical', 'number', true),
    ('a1000001-0001-0001-0001-000000000013', NULL, 'admission_count', 'Admission Count', 'عدد الدخول', 'Count of inpatient admissions', '1', 'clinical', 'inpatient_admissions', 'integer', 'COUNT', 'clinical.reports.admissions', 'Inpatient', 'number', true),
    ('a1000001-0001-0001-0001-000000000014', NULL, 'discharge_count', 'Discharge Count', 'عدد الخروج', 'Count of patient discharges', '1', 'clinical', 'discharge_transactions', 'integer', 'COUNT', 'clinical.reports.admissions', 'Inpatient', 'number', true),

    -- Scheduling Metrics
    ('a1000001-0001-0001-0001-000000000020', NULL, 'appointment_count', 'Appointment Count', 'عدد المواعيد', 'Count of scheduled appointments', '1', 'clinical', 'appointments', 'integer', 'COUNT', 'clinical.reports.appointments', 'Scheduling', 'number', true),
    ('a1000001-0001-0001-0001-000000000021', NULL, 'completed_appointments', 'Completed Appointments', 'المواعيد المكتملة', 'Count of completed appointments', '1', 'clinical', 'appointments', 'integer', 'COUNT', 'clinical.reports.appointments', 'Scheduling', 'number', true),
    ('a1000001-0001-0001-0001-000000000022', NULL, 'cancelled_appointments', 'Cancelled Appointments', 'المواعيد الملغاة', 'Count of cancelled appointments', '1', 'clinical', 'appointments', 'integer', 'COUNT', 'clinical.reports.appointments', 'Scheduling', 'number', true),
    ('a1000001-0001-0001-0001-000000000023', NULL, 'no_show_count', 'No Shows', 'عدم الحضور', 'Count of no-show appointments', '1', 'clinical', 'appointments', 'integer', 'COUNT', 'clinical.reports.appointments', 'Scheduling', 'number', true),

    -- Staff Metrics
    ('a1000001-0001-0001-0001-000000000030', NULL, 'staff_count', 'Staff Count', 'عدد الموظفين', 'Count of active staff members', '1', 'foundation', 'staff', 'integer', 'COUNT', 'foundation.reports.staff', 'Staff', 'number', true),
    ('a1000001-0001-0001-0001-000000000031', NULL, 'physician_count', 'Physician Count', 'عدد الأطباء', 'Count of physicians', '1', 'foundation', 'staff', 'integer', 'COUNT', 'foundation.reports.staff', 'Staff', 'number', true)
  ON CONFLICT (tenant_id, name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    display_name_ar = EXCLUDED.display_name_ar,
    description = EXCLUDED.description,
    expression = EXCLUDED.expression,
    default_aggregation = EXCLUDED.default_aggregation,
    required_permission = EXCLUDED.required_permission,
    category = EXCLUDED.category,
    format = EXCLUDED.format,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  -- Dimensions
  INSERT INTO semantic_dimensions (id, tenant_id, name, display_name, display_name_ar, description, column_ref, database, base_table, data_type, allowed_operators, required_permission, category, is_lookup, lookup_values, is_active)
  VALUES
    -- Time Dimensions
    ('b1000001-0001-0001-0001-000000000001', NULL, 'invoice_date', 'Invoice Date', 'تاريخ الفاتورة', 'Date when the invoice was created', 'invoice_date', 'rcm', 'invoices', 'date', ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, true),
    ('b1000001-0001-0001-0001-000000000002', NULL, 'encounter_date', 'Encounter Date', 'تاريخ الزيارة', 'Date of the patient encounter', 'encounter_date', 'clinical', 'encounters', 'date', ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, true),
    ('b1000001-0001-0001-0001-000000000003', NULL, 'appointment_date', 'Appointment Date', 'تاريخ الموعد', 'Scheduled appointment date', 'appointment_date', 'clinical', 'appointments', 'date', ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, true),
    ('b1000001-0001-0001-0001-000000000004', NULL, 'admission_date', 'Admission Date', 'تاريخ الدخول', 'Date of admission', 'admission_date', 'clinical', 'inpatient_admissions', 'date', ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, true),
    ('b1000001-0001-0001-0001-000000000005', NULL, 'discharge_date', 'Discharge Date', 'تاريخ الخروج', 'Date of discharge', 'discharge_date', 'clinical', 'discharge_transactions', 'date', ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, true),
    ('b1000001-0001-0001-0001-000000000006', NULL, 'registration_date', 'Registration Date', 'تاريخ التسجيل', 'Date patient was registered', 'created_at', 'clinical', 'patients', 'date', ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, true),

    -- Status Dimensions
    ('b1000001-0001-0001-0001-000000000010', NULL, 'invoice_status', 'Invoice Status', 'حالة الفاتورة', 'Payment status of the invoice', 'status', 'rcm', 'invoices', 'string', ARRAY['eq', 'in', 'not_in'], NULL, 'Status', true, ARRAY['draft', 'unpaid', 'partial', 'paid', 'cancelled', 'void'], true),
    ('b1000001-0001-0001-0001-000000000011', NULL, 'appointment_status', 'Appointment Status', 'حالة الموعد', 'Status of the appointment', 'status', 'clinical', 'appointments', 'string', ARRAY['eq', 'in', 'not_in'], NULL, 'Status', true, ARRAY['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'], true),
    ('b1000001-0001-0001-0001-000000000012', NULL, 'encounter_status', 'Encounter Status', 'حالة الزيارة', 'Status of the encounter', 'status', 'clinical', 'encounters', 'string', ARRAY['eq', 'in', 'not_in'], NULL, 'Status', true, ARRAY['planned', 'arrived', 'triaged', 'in_progress', 'completed', 'cancelled'], true),
    ('b1000001-0001-0001-0001-000000000013', NULL, 'admission_status', 'Admission Status', 'حالة الدخول', 'Status of the admission', 'clinical_status', 'clinical', 'inpatient_admissions', 'string', ARRAY['eq', 'in', 'not_in'], NULL, 'Status', true, ARRAY['ADMITTED', 'ACTIVE', 'ON_LEAVE', 'DISCHARGE_PLANNING', 'DISCHARGED', 'EXPIRED', 'ABSCONDED', 'CANCELLED'], true),

    -- Demographics Dimensions
    ('b1000001-0001-0001-0001-000000000020', NULL, 'patient_gender', 'Patient Gender', 'جنس المريض', 'Gender of the patient', 'gender', 'clinical', 'patients', 'string', ARRAY['eq', 'in'], NULL, 'Demographics', true, ARRAY['male', 'female', 'other'], true),
    ('b1000001-0001-0001-0001-000000000021', NULL, 'patient_nationality', 'Patient Nationality', 'جنسية المريض', 'Nationality of the patient', 'nationality', 'clinical', 'patients', 'string', ARRAY['eq', 'in', 'not_in'], NULL, 'Demographics', false, NULL, true),
    ('b1000001-0001-0001-0001-000000000022', NULL, 'staff_type', 'Staff Type', 'نوع الموظف', 'Type of staff member', 'staff_type', 'foundation', 'staff', 'string', ARRAY['eq', 'in', 'not_in'], NULL, 'Staff', true, ARRAY['physician', 'nurse', 'technician', 'admin', 'support'], true),

    -- Classification Dimensions
    ('b1000001-0001-0001-0001-000000000030', NULL, 'encounter_type', 'Encounter Type', 'نوع الزيارة', 'Type of patient encounter', 'encounter_type', 'clinical', 'encounters', 'string', ARRAY['eq', 'in', 'not_in'], NULL, 'Classification', true, ARRAY['outpatient', 'inpatient', 'emergency', 'telehealth', 'home_visit'], true),
    ('b1000001-0001-0001-0001-000000000031', NULL, 'appointment_type', 'Appointment Type', 'نوع الموعد', 'Type of appointment', 'appointment_type', 'clinical', 'appointments', 'string', ARRAY['eq', 'in', 'not_in'], NULL, 'Classification', true, ARRAY['new', 'follow_up', 'procedure', 'lab', 'imaging', 'telehealth'], true),

    -- Organization Dimensions
    ('b1000001-0001-0001-0001-000000000040', NULL, 'facility_id', 'Facility', 'المنشأة', 'Healthcare facility', 'facility_id', 'clinical', 'encounters', 'uuid', ARRAY['eq', 'in'], NULL, 'Organization', false, NULL, true),
    ('b1000001-0001-0001-0001-000000000041', NULL, 'department_id', 'Department', 'القسم', 'Hospital department', 'department_id', 'clinical', 'encounters', 'uuid', ARRAY['eq', 'in'], NULL, 'Organization', false, NULL, true),
    ('b1000001-0001-0001-0001-000000000042', NULL, 'ward_id', 'Ward', 'الجناح', 'Hospital ward', 'ward_id', 'clinical', 'inpatient_admissions', 'uuid', ARRAY['eq', 'in'], NULL, 'Organization', false, NULL, true),
    ('b1000001-0001-0001-0001-000000000043', NULL, 'specialty_code', 'Specialty', 'التخصص', 'Medical specialty', 'specialty_code', 'clinical', 'encounters', 'string', ARRAY['eq', 'in'], NULL, 'Organization', false, NULL, true),

    -- Provider Dimensions
    ('b1000001-0001-0001-0001-000000000050', NULL, 'attending_physician_id', 'Attending Physician', 'الطبيب المعالج', 'Primary attending physician', 'attending_physician_id', 'clinical', 'encounters', 'uuid', ARRAY['eq', 'in'], NULL, 'Provider', false, NULL, true),
    ('b1000001-0001-0001-0001-000000000051', NULL, 'primary_nurse_id', 'Primary Nurse', 'الممرض الرئيسي', 'Primary nurse assigned', 'primary_nurse_id', 'clinical', 'inpatient_admissions', 'uuid', ARRAY['eq', 'in'], NULL, 'Provider', false, NULL, true)
  ON CONFLICT (tenant_id, name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    display_name_ar = EXCLUDED.display_name_ar,
    description = EXCLUDED.description,
    column_ref = EXCLUDED.column_ref,
    allowed_operators = EXCLUDED.allowed_operators,
    is_lookup = EXCLUDED.is_lookup,
    lookup_values = EXCLUDED.lookup_values,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  -- Join Paths
  INSERT INTO semantic_join_paths (id, tenant_id, name, from_table, from_database, to_table, to_database, join_type, join_condition, cardinality, is_active)
  VALUES
    ('c1000001-0001-0001-0001-000000000001', NULL, 'encounters_to_patients', 'encounters', 'clinical', 'patients', 'clinical', 'inner', 'encounters.patient_id = patients.id', 'many-to-one', true),
    ('c1000001-0001-0001-0001-000000000002', NULL, 'appointments_to_patients', 'appointments', 'clinical', 'patients', 'clinical', 'inner', 'appointments.patient_id = patients.id', 'many-to-one', true),
    ('c1000001-0001-0001-0001-000000000003', NULL, 'invoices_to_encounters', 'invoices', 'rcm', 'encounters', 'clinical', 'left', 'invoices.encounter_id = encounters.id', 'many-to-one', true),
    ('c1000001-0001-0001-0001-000000000004', NULL, 'invoices_to_patients', 'invoices', 'rcm', 'patients', 'clinical', 'inner', 'invoices.patient_id = patients.id', 'many-to-one', true),
    ('c1000001-0001-0001-0001-000000000005', NULL, 'admissions_to_patients', 'inpatient_admissions', 'clinical', 'patients', 'clinical', 'inner', 'inpatient_admissions.patient_id = patients.id', 'many-to-one', true),
    ('c1000001-0001-0001-0001-000000000006', NULL, 'admissions_to_encounters', 'inpatient_admissions', 'clinical', 'encounters', 'clinical', 'inner', 'inpatient_admissions.encounter_id = encounters.id', 'one-to-one', true),
    ('c1000001-0001-0001-0001-000000000007', NULL, 'discharges_to_admissions', 'discharge_transactions', 'clinical', 'inpatient_admissions', 'clinical', 'inner', 'discharge_transactions.admission_id = inpatient_admissions.id', 'many-to-one', true),
    ('c1000001-0001-0001-0001-000000000008', NULL, 'encounters_to_staff', 'encounters', 'clinical', 'staff', 'foundation', 'left', 'encounters.attending_physician_id = staff.id', 'many-to-one', true)
  ON CONFLICT (tenant_id, name) DO UPDATE SET
    from_table = EXCLUDED.from_table,
    from_database = EXCLUDED.from_database,
    to_table = EXCLUDED.to_table,
    to_database = EXCLUDED.to_database,
    join_type = EXCLUDED.join_type,
    join_condition = EXCLUDED.join_condition,
    cardinality = EXCLUDED.cardinality,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  RAISE NOTICE 'Semantic catalog seeded successfully';
END $$;
