-- ============================================================================
-- AI Features - Semantic Catalog Seed Data
-- This provides the initial metrics, dimensions, and join paths for the
-- Natural Language Report Builder feature
--
-- NOTE: These tables are in zeal_analytics database
-- ============================================================================

-- Clear existing data for clean re-seeding
TRUNCATE TABLE semantic_metrics CASCADE;
TRUNCATE TABLE semantic_dimensions CASCADE;
TRUNCATE TABLE semantic_join_paths CASCADE;

-- Fixed UUIDs for consistent seeding
DO $$
BEGIN
  -- =========================================================================
  -- METRICS - What can be measured in reports
  -- =========================================================================
  INSERT INTO semantic_metrics (
    id, tenant_id, name, display_name, display_name_ar, description,
    expression, database, base_table, data_type, default_aggregation,
    required_permission, category, format, sort_order, is_active,
    created_at, updated_at
  ) VALUES
    -- Revenue Metrics
    ('a1000001-0001-0001-0001-000000000001', NULL, 'total_revenue', 'Total Revenue', 'إجمالي الإيرادات',
     'Sum of all invoice net amounts', 'net_amount', 'rcm', 'invoices', 'decimal', 'SUM',
     'rcm.reports.revenue', 'Revenue', 'currency', 1, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000002', NULL, 'invoice_count', 'Invoice Count', 'عدد الفواتير',
     'Count of invoices', '1', 'rcm', 'invoices', 'integer', 'COUNT',
     'rcm.reports.invoices', 'Revenue', 'number', 2, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000003', NULL, 'outstanding_balance', 'Outstanding Balance', 'الرصيد المستحق',
     'Sum of unpaid invoice amounts', 'balance_due', 'rcm', 'invoices', 'decimal', 'SUM',
     'rcm.reports.aging', 'Revenue', 'currency', 3, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000004', NULL, 'paid_amount', 'Paid Amount', 'المبلغ المدفوع',
     'Sum of paid amounts', 'paid_amount', 'rcm', 'invoices', 'decimal', 'SUM',
     'rcm.reports.revenue', 'Revenue', 'currency', 4, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000005', NULL, 'discount_amount', 'Discount Amount', 'مبلغ الخصم',
     'Sum of discounts applied', 'discount_amount', 'rcm', 'invoices', 'decimal', 'SUM',
     'rcm.reports.revenue', 'Revenue', 'currency', 5, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000006', NULL, 'average_invoice_amount', 'Average Invoice Amount', 'متوسط مبلغ الفاتورة',
     'Average invoice amount', 'net_amount', 'rcm', 'invoices', 'decimal', 'AVG',
     'rcm.reports.revenue', 'Revenue', 'currency', 6, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000007', NULL, 'invoice_amount', 'Invoice Amount', 'مبلغ الفاتورة',
     'Individual invoice net amount (use for listing invoices)', 'net_amount', 'rcm', 'invoices', 'decimal', NULL,
     'rcm.reports.invoices', 'Revenue', 'currency', 7, true, NOW(), NOW()),

    -- Clinical Metrics
    ('a1000001-0001-0001-0001-000000000010', NULL, 'patient_count', 'Patient Count', 'عدد المرضى',
     'Count of unique patients', 'id', 'clinical', 'patients', 'integer', 'COUNT_DISTINCT',
     'clinical.reports.patients', 'Clinical', 'number', 10, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000011', NULL, 'encounter_count', 'Encounter Count', 'عدد الزيارات',
     'Count of patient encounters', '1', 'clinical', 'encounters', 'integer', 'COUNT',
     'clinical.reports.encounters', 'Clinical', 'number', 11, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000012', NULL, 'new_patient_count', 'New Patients', 'المرضى الجدد',
     'Count of newly registered patients', '1', 'clinical', 'patients', 'integer', 'COUNT',
     'clinical.reports.patients', 'Clinical', 'number', 12, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000013', NULL, 'admission_count', 'Admission Count', 'عدد الدخول',
     'Count of inpatient admissions', '1', 'clinical', 'inpatient_admissions', 'integer', 'COUNT',
     'clinical.reports.admissions', 'Inpatient', 'number', 13, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000014', NULL, 'discharge_count', 'Discharge Count', 'عدد الخروج',
     'Count of patient discharges', '1', 'clinical', 'discharge_transactions', 'integer', 'COUNT',
     'clinical.reports.admissions', 'Inpatient', 'number', 14, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000015', NULL, 'average_length_of_stay', 'Avg Length of Stay', 'متوسط مدة الإقامة',
     'Average length of stay in days', 'EXTRACT(EPOCH FROM (discharge_date - admission_date))/86400', 'clinical', 'inpatient_admissions', 'decimal', 'AVG',
     'clinical.reports.admissions', 'Inpatient', 'number', 15, true, NOW(), NOW()),

    -- Scheduling Metrics
    ('a1000001-0001-0001-0001-000000000020', NULL, 'appointment_count', 'Appointment Count', 'عدد المواعيد',
     'Count of scheduled appointments', '1', 'clinical', 'appointments', 'integer', 'COUNT',
     'clinical.reports.appointments', 'Scheduling', 'number', 20, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000021', NULL, 'completed_appointments', 'Completed Appointments', 'المواعيد المكتملة',
     'Count of completed appointments', '1', 'clinical', 'appointments', 'integer', 'COUNT',
     'clinical.reports.appointments', 'Scheduling', 'number', 21, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000022', NULL, 'cancelled_appointments', 'Cancelled Appointments', 'المواعيد الملغاة',
     'Count of cancelled appointments', '1', 'clinical', 'appointments', 'integer', 'COUNT',
     'clinical.reports.appointments', 'Scheduling', 'number', 22, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000023', NULL, 'no_show_count', 'No Shows', 'عدم الحضور',
     'Count of no-show appointments', '1', 'clinical', 'appointments', 'integer', 'COUNT',
     'clinical.reports.appointments', 'Scheduling', 'number', 23, true, NOW(), NOW()),

    -- Staff Metrics
    ('a1000001-0001-0001-0001-000000000030', NULL, 'staff_count', 'Staff Count', 'عدد الموظفين',
     'Count of active staff members', '1', 'foundation', 'staff', 'integer', 'COUNT',
     'foundation.reports.staff', 'Staff', 'number', 30, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000031', NULL, 'physician_count', 'Physician Count', 'عدد الأطباء',
     'Count of physicians', '1', 'foundation', 'staff', 'integer', 'COUNT',
     'foundation.reports.staff', 'Staff', 'number', 31, true, NOW(), NOW()),

    -- Receipt Metrics
    ('a1000001-0001-0001-0001-000000000040', NULL, 'total_receipts_amount', 'Total Receipts', 'إجمالي الإيصالات',
     'Sum of all receipt amounts', 'amount', 'rcm', 'receipts', 'decimal', 'SUM',
     'rcm.reports.receipts', 'Receipts', 'currency', 40, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000041', NULL, 'receipt_count', 'Receipt Count', 'عدد الإيصالات',
     'Count of payment receipts', '1', 'rcm', 'receipts', 'integer', 'COUNT',
     'rcm.reports.receipts', 'Receipts', 'number', 41, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000042', NULL, 'average_receipt_amount', 'Average Receipt', 'متوسط الإيصال',
     'Average receipt amount', 'amount', 'rcm', 'receipts', 'decimal', 'AVG',
     'rcm.reports.receipts', 'Receipts', 'currency', 42, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000043', NULL, 'receipt_amount', 'Receipt Amount', 'مبلغ الإيصال',
     'Individual receipt amount (use for listing receipts)', 'amount', 'rcm', 'receipts', 'decimal', NULL,
     'rcm.reports.receipts', 'Receipts', 'currency', 43, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000044', NULL, 'cash_receipts_total', 'Cash Receipts Total', 'إجمالي الإيصالات النقدية',
     'Sum of cash payment receipts', 'amount', 'rcm', 'receipts', 'decimal', 'SUM',
     'rcm.reports.receipts', 'Receipts', 'currency', 44, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000045', NULL, 'card_receipts_total', 'Card Receipts Total', 'إجمالي إيصالات البطاقة',
     'Sum of card payment receipts', 'amount', 'rcm', 'receipts', 'decimal', 'SUM',
     'rcm.reports.receipts', 'Receipts', 'currency', 45, true, NOW(), NOW()),

    -- Refund Metrics
    ('a1000001-0001-0001-0001-000000000050', NULL, 'total_refunds_amount', 'Total Refunds', 'إجمالي المبالغ المستردة',
     'Sum of all refund amounts', 'amount', 'rcm', 'refunds', 'decimal', 'SUM',
     'rcm.reports.refunds', 'Refunds', 'currency', 50, true, NOW(), NOW()),

    ('a1000001-0001-0001-0001-000000000051', NULL, 'refund_count', 'Refund Count', 'عدد المبالغ المستردة',
     'Count of refunds', '1', 'rcm', 'refunds', 'integer', 'COUNT',
     'rcm.reports.refunds', 'Refunds', 'number', 51, true, NOW(), NOW())
  ON CONFLICT (tenant_id, name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    display_name_ar = EXCLUDED.display_name_ar,
    description = EXCLUDED.description,
    expression = EXCLUDED.expression,
    default_aggregation = EXCLUDED.default_aggregation,
    required_permission = EXCLUDED.required_permission,
    category = EXCLUDED.category,
    format = EXCLUDED.format,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  RAISE NOTICE 'Seeded semantic_metrics';

  -- =========================================================================
  -- DIMENSIONS - What can be grouped/filtered by in reports
  -- =========================================================================
  INSERT INTO semantic_dimensions (
    id, tenant_id, name, display_name, display_name_ar, description,
    column_ref, database, base_table, data_type, allowed_operators,
    required_permission, category, is_lookup, lookup_values, sort_order, is_active,
    created_at, updated_at
  ) VALUES
    -- Time Dimensions
    ('b1000001-0001-0001-0001-000000000001', NULL, 'invoice_date', 'Invoice Date', 'تاريخ الفاتورة',
     'Date when the invoice was created', 'invoice_date', 'rcm', 'invoices', 'date',
     ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, 1, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000002', NULL, 'encounter_date', 'Encounter Date', 'تاريخ الزيارة',
     'Date of the patient encounter', 'encounter_date', 'clinical', 'encounters', 'date',
     ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, 2, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000003', NULL, 'appointment_date', 'Appointment Date', 'تاريخ الموعد',
     'Scheduled appointment date', 'start_time::date', 'clinical', 'appointments', 'date',
     ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, 3, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000004', NULL, 'admission_date', 'Admission Date', 'تاريخ الدخول',
     'Date of admission', 'admission_date', 'clinical', 'inpatient_admissions', 'date',
     ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, 4, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000005', NULL, 'discharge_date', 'Discharge Date', 'تاريخ الخروج',
     'Date of discharge', 'discharge_date', 'clinical', 'discharge_transactions', 'date',
     ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, 5, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000006', NULL, 'registration_date', 'Registration Date', 'تاريخ التسجيل',
     'Date patient was registered', 'created_at::date', 'clinical', 'patients', 'date',
     ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, 6, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000007', NULL, 'appointment_time', 'Appointment Time', 'وقت الموعد',
     'Start time of the appointment', 'start_time', 'clinical', 'appointments', 'datetime',
     ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, 7, true, NOW(), NOW()),

    -- Status Dimensions
    ('b1000001-0001-0001-0001-000000000010', NULL, 'invoice_status', 'Invoice Status', 'حالة الفاتورة',
     'Payment status of the invoice', 'status', 'rcm', 'invoices', 'string',
     ARRAY['eq', 'in', 'not_in'], NULL, 'Status', true,
     ARRAY['draft', 'unpaid', 'partial', 'paid', 'cancelled', 'void'], 10, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000011', NULL, 'appointment_status', 'Appointment Status', 'حالة الموعد',
     'Status of the appointment', 'status', 'clinical', 'appointments', 'string',
     ARRAY['eq', 'in', 'not_in'], NULL, 'Status', true,
     ARRAY['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'], 11, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000012', NULL, 'encounter_status', 'Encounter Status', 'حالة الزيارة',
     'Status of the encounter', 'status', 'clinical', 'encounters', 'string',
     ARRAY['eq', 'in', 'not_in'], NULL, 'Status', true,
     ARRAY['planned', 'arrived', 'triaged', 'in_progress', 'completed', 'cancelled'], 12, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000013', NULL, 'admission_status', 'Admission Status', 'حالة الدخول',
     'Status of the admission', 'clinical_status', 'clinical', 'inpatient_admissions', 'string',
     ARRAY['eq', 'in', 'not_in'], NULL, 'Status', true,
     ARRAY['ADMITTED', 'ACTIVE', 'ON_LEAVE', 'DISCHARGE_PLANNING', 'DISCHARGED', 'EXPIRED', 'ABSCONDED', 'CANCELLED'], 13, true, NOW(), NOW()),

    -- Demographics Dimensions
    ('b1000001-0001-0001-0001-000000000020', NULL, 'patient_gender', 'Patient Gender', 'جنس المريض',
     'Gender of the patient', 'gender', 'clinical', 'patients', 'string',
     ARRAY['eq', 'in'], NULL, 'Demographics', true, ARRAY['male', 'female', 'other'], 20, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000021', NULL, 'patient_nationality', 'Patient Nationality', 'جنسية المريض',
     'Nationality of the patient', 'nationality', 'clinical', 'patients', 'string',
     ARRAY['eq', 'in', 'not_in'], NULL, 'Demographics', false, NULL, 21, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000022', NULL, 'patient_name', 'Patient Name', 'اسم المريض',
     'Full name of the patient', 'CONCAT(first_name, '' '', last_name)', 'clinical', 'patients', 'string',
     ARRAY['eq', 'contains', 'starts_with'], NULL, 'Demographics', false, NULL, 22, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000023', NULL, 'patient_age', 'Patient Age', 'عمر المريض',
     'Age of the patient in years', 'EXTRACT(YEAR FROM AGE(date_of_birth))', 'clinical', 'patients', 'integer',
     ARRAY['eq', 'gt', 'gte', 'lt', 'lte', 'between'], NULL, 'Demographics', false, NULL, 23, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000024', NULL, 'patient_mrn', 'MRN', 'رقم الملف الطبي',
     'Medical Record Number', 'mrn', 'clinical', 'patients', 'string',
     ARRAY['eq', 'contains', 'starts_with'], NULL, 'Demographics', false, NULL, 24, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000025', NULL, 'patient_id', 'Patient ID', 'معرف المريض',
     'Unique patient identifier', 'id', 'clinical', 'patients', 'uuid',
     ARRAY['eq', 'in'], NULL, 'Demographics', false, NULL, 25, true, NOW(), NOW()),

    -- Staff Dimensions
    ('b1000001-0001-0001-0001-000000000026', NULL, 'staff_type', 'Staff Type', 'نوع الموظف',
     'Type of staff member', 'staff_type', 'foundation', 'staff', 'string',
     ARRAY['eq', 'in', 'not_in'], NULL, 'Staff', true,
     ARRAY['physician', 'nurse', 'technician', 'admin', 'support'], 26, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000027', NULL, 'doctor_name', 'Doctor Name', 'اسم الطبيب',
     'Name of the doctor/staff', 'staff_display_name', 'clinical', 'appointments', 'string',
     ARRAY['eq', 'contains', 'starts_with'], NULL, 'Staff', false, NULL, 27, true, NOW(), NOW()),

    -- Classification Dimensions
    ('b1000001-0001-0001-0001-000000000030', NULL, 'encounter_type', 'Encounter Type', 'نوع الزيارة',
     'Type of patient encounter', 'encounter_type', 'clinical', 'encounters', 'string',
     ARRAY['eq', 'in', 'not_in'], NULL, 'Classification', true,
     ARRAY['outpatient', 'inpatient', 'emergency', 'telehealth', 'home_visit'], 30, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000031', NULL, 'appointment_type', 'Appointment Type', 'نوع الموعد',
     'Type of appointment', 'appointment_type', 'clinical', 'appointments', 'string',
     ARRAY['eq', 'in', 'not_in'], NULL, 'Classification', true,
     ARRAY['new', 'follow_up', 'procedure', 'lab', 'imaging', 'telehealth'], 31, true, NOW(), NOW()),

    -- Organization Dimensions
    ('b1000001-0001-0001-0001-000000000040', NULL, 'facility_id', 'Facility', 'المنشأة',
     'Healthcare facility', 'facility_id', 'clinical', 'encounters', 'uuid',
     ARRAY['eq', 'in'], NULL, 'Organization', false, NULL, 40, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000041', NULL, 'department_id', 'Department', 'القسم',
     'Hospital department', 'department_id', 'clinical', 'encounters', 'uuid',
     ARRAY['eq', 'in'], NULL, 'Organization', false, NULL, 41, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000042', NULL, 'ward_id', 'Ward', 'الجناح',
     'Hospital ward', 'ward_id', 'clinical', 'inpatient_admissions', 'uuid',
     ARRAY['eq', 'in'], NULL, 'Organization', false, NULL, 42, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000043', NULL, 'specialty_code', 'Specialty', 'التخصص',
     'Medical specialty', 'specialty_code', 'clinical', 'encounters', 'string',
     ARRAY['eq', 'in'], NULL, 'Organization', false, NULL, 43, true, NOW(), NOW()),

    -- Provider Dimensions
    ('b1000001-0001-0001-0001-000000000050', NULL, 'attending_physician_id', 'Attending Physician', 'الطبيب المعالج',
     'Primary attending physician', 'attending_physician_id', 'clinical', 'encounters', 'uuid',
     ARRAY['eq', 'in'], NULL, 'Provider', false, NULL, 50, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000051', NULL, 'primary_nurse_id', 'Primary Nurse', 'الممرض الرئيسي',
     'Primary nurse assigned', 'primary_nurse_id', 'clinical', 'inpatient_admissions', 'uuid',
     ARRAY['eq', 'in'], NULL, 'Provider', false, NULL, 51, true, NOW(), NOW()),

    -- Invoice Dimensions
    ('b1000001-0001-0001-0001-000000000060', NULL, 'invoice_number', 'Invoice Number', 'رقم الفاتورة',
     'Invoice number for listing', 'invoice_number', 'rcm', 'invoices', 'string',
     ARRAY['eq', 'contains', 'starts_with'], NULL, 'Invoice', false, NULL, 60, true, NOW(), NOW()),

    -- Receipt Dimensions
    ('b1000001-0001-0001-0001-000000000070', NULL, 'receipt_date', 'Receipt Date', 'تاريخ الإيصال',
     'Date when the receipt was issued', 'receipt_date', 'rcm', 'receipts', 'date',
     ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, 70, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000071', NULL, 'receipt_number', 'Receipt Number', 'رقم الإيصال',
     'Receipt number for listing', 'receipt_number', 'rcm', 'receipts', 'string',
     ARRAY['eq', 'contains', 'starts_with'], NULL, 'Receipt', false, NULL, 71, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000072', NULL, 'payment_method', 'Payment Method', 'طريقة الدفع',
     'Method of payment', 'payment_method', 'rcm', 'receipts', 'string',
     ARRAY['eq', 'in', 'not_in'], NULL, 'Receipt', true,
     ARRAY['cash', 'card', 'upi', 'bank_transfer', 'wallet'], 72, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000073', NULL, 'receipt_currency', 'Receipt Currency', 'عملة الإيصال',
     'Currency of the receipt', 'currency', 'rcm', 'receipts', 'string',
     ARRAY['eq', 'in'], NULL, 'Receipt', true,
     ARRAY['AED', 'USD', 'EUR', 'GBP', 'INR'], 73, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000074', NULL, 'receipt_patient_name', 'Patient Name (Receipt)', 'اسم المريض (الإيصال)',
     'Patient name on the receipt', 'patient_display_name', 'rcm', 'receipts', 'string',
     ARRAY['eq', 'contains', 'starts_with'], NULL, 'Receipt', false, NULL, 74, true, NOW(), NOW()),

    -- Refund Dimensions
    ('b1000001-0001-0001-0001-000000000080', NULL, 'refund_date', 'Refund Date', 'تاريخ الاسترداد',
     'Date when the refund was issued', 'refund_date', 'rcm', 'refunds', 'date',
     ARRAY['eq', 'gte', 'lte', 'between'], NULL, 'Time', false, NULL, 80, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000081', NULL, 'refund_number', 'Refund Number', 'رقم الاسترداد',
     'Refund number for listing', 'refund_number', 'rcm', 'refunds', 'string',
     ARRAY['eq', 'contains', 'starts_with'], NULL, 'Refund', false, NULL, 81, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000082', NULL, 'refund_status', 'Refund Status', 'حالة الاسترداد',
     'Status of the refund', 'status', 'rcm', 'refunds', 'string',
     ARRAY['eq', 'in', 'not_in'], NULL, 'Refund', true,
     ARRAY['pending', 'approved', 'processed', 'rejected', 'cancelled'], 82, true, NOW(), NOW()),

    ('b1000001-0001-0001-0001-000000000083', NULL, 'refund_method', 'Refund Method', 'طريقة الاسترداد',
     'Method of refund payment', 'refund_method', 'rcm', 'refunds', 'string',
     ARRAY['eq', 'in', 'not_in'], NULL, 'Refund', true,
     ARRAY['cash', 'card', 'bank_transfer', 'wallet', 'original_payment'], 83, true, NOW(), NOW())
  ON CONFLICT (tenant_id, name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    display_name_ar = EXCLUDED.display_name_ar,
    description = EXCLUDED.description,
    column_ref = EXCLUDED.column_ref,
    allowed_operators = EXCLUDED.allowed_operators,
    is_lookup = EXCLUDED.is_lookup,
    lookup_values = EXCLUDED.lookup_values,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  RAISE NOTICE 'Seeded semantic_dimensions';

  -- =========================================================================
  -- JOIN PATHS - How tables connect for cross-table queries
  -- =========================================================================
  INSERT INTO semantic_join_paths (
    id, tenant_id, name, from_table, from_database, to_table, to_database,
    join_type, join_condition, cardinality, description, is_active,
    created_at, updated_at
  ) VALUES
    ('c1000001-0001-0001-0001-000000000001', NULL, 'encounters_to_patients',
     'encounters', 'clinical', 'patients', 'clinical', 'inner',
     'encounters.patient_id = patients.id', 'many-to-one',
     'Link encounters to their patients', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000002', NULL, 'appointments_to_patients',
     'appointments', 'clinical', 'patients', 'clinical', 'inner',
     'appointments.patient_id = patients.id', 'many-to-one',
     'Link appointments to their patients', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000003', NULL, 'invoices_to_encounters',
     'invoices', 'rcm', 'encounters', 'clinical', 'left',
     'invoices.encounter_id = encounters.id', 'many-to-one',
     'Link invoices to their encounters', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000004', NULL, 'invoices_to_patients',
     'invoices', 'rcm', 'patients', 'clinical', 'inner',
     'invoices.patient_id = patients.id', 'many-to-one',
     'Link invoices to their patients', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000005', NULL, 'admissions_to_patients',
     'inpatient_admissions', 'clinical', 'patients', 'clinical', 'inner',
     'inpatient_admissions.patient_id = patients.id', 'many-to-one',
     'Link admissions to their patients', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000006', NULL, 'admissions_to_encounters',
     'inpatient_admissions', 'clinical', 'encounters', 'clinical', 'inner',
     'inpatient_admissions.encounter_id = encounters.id', 'one-to-one',
     'Link admissions to their initial encounter', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000007', NULL, 'discharges_to_admissions',
     'discharge_transactions', 'clinical', 'inpatient_admissions', 'clinical', 'inner',
     'discharge_transactions.admission_id = inpatient_admissions.id', 'many-to-one',
     'Link discharges to their admissions', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000008', NULL, 'encounters_to_staff',
     'encounters', 'clinical', 'staff', 'foundation', 'left',
     'encounters.attending_physician_id = staff.id', 'many-to-one',
     'Link encounters to attending physician', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000009', NULL, 'appointments_to_encounters',
     'appointments', 'clinical', 'encounters', 'clinical', 'left',
     'appointments.encounter_id = encounters.id', 'one-to-one',
     'Link appointments to resulting encounters', true, NOW(), NOW()),

    -- Receipt Join Paths
    ('c1000001-0001-0001-0001-000000000010', NULL, 'receipts_to_patients',
     'receipts', 'rcm', 'patients', 'clinical', 'inner',
     'receipts.patient_id = patients.id', 'many-to-one',
     'Link receipts to their patients', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000011', NULL, 'receipts_to_invoices',
     'receipts', 'rcm', 'invoices', 'rcm', 'left',
     'receipts.invoice_id = invoices.id', 'many-to-one',
     'Link receipts to their invoices', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000012', NULL, 'receipt_allocations_to_receipts',
     'receipt_allocations', 'rcm', 'receipts', 'rcm', 'inner',
     'receipt_allocations.receipt_id = receipts.id', 'many-to-one',
     'Link receipt allocations to receipts', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000013', NULL, 'receipt_allocations_to_invoices',
     'receipt_allocations', 'rcm', 'invoices', 'rcm', 'inner',
     'receipt_allocations.invoice_id = invoices.id', 'many-to-one',
     'Link receipt allocations to invoices', true, NOW(), NOW()),

    -- Refund Join Paths
    ('c1000001-0001-0001-0001-000000000014', NULL, 'refunds_to_receipts',
     'refunds', 'rcm', 'receipts', 'rcm', 'left',
     'refunds.receipt_id = receipts.id', 'many-to-one',
     'Link refunds to their original receipts', true, NOW(), NOW()),

    ('c1000001-0001-0001-0001-000000000015', NULL, 'refunds_to_patients',
     'refunds', 'rcm', 'patients', 'clinical', 'inner',
     'refunds.patient_id = patients.id', 'many-to-one',
     'Link refunds to their patients', true, NOW(), NOW())
  ON CONFLICT (tenant_id, name) DO UPDATE SET
    from_table = EXCLUDED.from_table,
    from_database = EXCLUDED.from_database,
    to_table = EXCLUDED.to_table,
    to_database = EXCLUDED.to_database,
    join_type = EXCLUDED.join_type,
    join_condition = EXCLUDED.join_condition,
    cardinality = EXCLUDED.cardinality,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

  RAISE NOTICE 'Seeded semantic_join_paths';

  RAISE NOTICE '✓ Semantic catalog seeded successfully to zeal_analytics';
END $$;
