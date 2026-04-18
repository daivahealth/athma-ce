-- Comprehensive Catalog-to-Billing Item Mappings
-- Covers ALL clinical catalog items: 15 Medications, 18 Lab Tests, 18 Imaging Studies,
-- 15 Procedures, 31 Administrative Services, 11 Packages
--
-- Dependencies (must be seeded first):
--   clinical: 04-medications, 05-lab-tests, 06-imaging-studies, 07-procedures,
--             09-administrative-services, 10-packages
--   rcm:      (this file — standalone)
--
-- Clinical catalog item UUIDs are FIXED in the clinical seed files:
--   Medications:   a1111111-1111-1111-1111-111111111111  through ...125
--   Lab Tests:     b1111111-1111-1111-1111-111111111111  through ...128
--   Imaging:       c1111111-1111-1111-1111-111111111111  through ...128
--   Procedures:    d1111111-1111-1111-1111-111111111111  through ...125
--   Admin Svcs:    e1111111-1111-1111-1111-111111111111  through ...141
--   Packages:      f1111111-1111-1111-1111-111111111111  through ...121
--
-- Billing item IDs are resolved via subqueries within zeal_rcm (same DB).

DO $$
DECLARE
  v_tenant_id UUID := '11111111-1111-1111-1111-111111111111'::UUID;
BEGIN

  -- ========================================================================
  -- CLEAN SLATE
  -- ========================================================================
  DELETE FROM catalog_item_mappings WHERE tenant_id = v_tenant_id;
  DELETE FROM billing_items WHERE tenant_id = v_tenant_id;

  -- ========================================================================
  -- BILLING ITEMS — MEDICATIONS (15) + dispensing fee
  -- item_type = 'pharmacy'
  -- ========================================================================
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'MED-LISINOPRIL',    'INTERNAL', 'Lisinopril 10mg Tablet',               'pharmacy', 'pharmacy', 'tablet',   2.50, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-ATORVASTATIN',  'INTERNAL', 'Atorvastatin 20mg Tablet',             'pharmacy', 'pharmacy', 'tablet',   3.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-METOPROLOL',    'INTERNAL', 'Metoprolol Succinate 50mg Tablet',     'pharmacy', 'pharmacy', 'tablet',   2.75, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-METFORMIN',     'INTERNAL', 'Metformin 500mg Tablet',               'pharmacy', 'pharmacy', 'tablet',   1.50, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-AMOXICILLIN',   'INTERNAL', 'Amoxicillin 500mg Capsule',            'pharmacy', 'pharmacy', 'capsule',  1.75, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-AZITHROMYCIN',  'INTERNAL', 'Azithromycin 250mg Tablet',            'pharmacy', 'pharmacy', 'tablet',   4.50, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-CIPROFLOXACIN', 'INTERNAL', 'Ciprofloxacin 500mg Tablet',           'pharmacy', 'pharmacy', 'tablet',   3.25, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-IBUPROFEN',     'INTERNAL', 'Ibuprofen 400mg Tablet',               'pharmacy', 'pharmacy', 'tablet',   0.75, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-PARACETAMOL',   'INTERNAL', 'Paracetamol 500mg Tablet',             'pharmacy', 'pharmacy', 'tablet',   0.50, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-TRAMADOL',      'INTERNAL', 'Tramadol 50mg Tablet',                 'pharmacy', 'pharmacy', 'tablet',   4.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-SALBUTAMOL',    'INTERNAL', 'Salbutamol 100mcg Inhaler',            'pharmacy', 'pharmacy', 'inhaler', 28.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-OMEPRAZOLE',    'INTERNAL', 'Omeprazole 20mg Capsule',              'pharmacy', 'pharmacy', 'capsule',  2.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-CETIRIZINE',    'INTERNAL', 'Cetirizine 10mg Tablet',               'pharmacy', 'pharmacy', 'tablet',   1.25, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-AMLODIPINE',    'INTERNAL', 'Amlodipine 5mg Tablet',                'pharmacy', 'pharmacy', 'tablet',   2.50, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'MED-WARFARIN',      'INTERNAL', 'Warfarin 5mg Tablet',                  'pharmacy', 'pharmacy', 'tablet',   3.50, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PHARM-DISP-FEE',   'INTERNAL', 'Pharmacy Dispensing Fee',              'pharmacy', 'pharmacy', 'each',    15.00, true, NOW(), NOW());

  -- ========================================================================
  -- BILLING ITEMS — LAB TESTS (18) + lab facility fee
  -- item_type = 'lab'
  -- ========================================================================
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES
    (gen_random_uuid(), v_tenant_id, '85025', 'CPT', 'Complete Blood Count (CBC)',                  'lab', 'lab', 'test',  75.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '85018', 'CPT', 'Hemoglobin',                                 'lab', 'lab', 'test',  45.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '85049', 'CPT', 'Platelet Count',                             'lab', 'lab', 'test',  40.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '80053', 'CPT', 'Comprehensive Metabolic Panel (CMP)',        'lab', 'lab', 'test', 120.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '82947', 'CPT', 'Fasting Blood Glucose',                     'lab', 'lab', 'test',  35.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '83036', 'CPT', 'HbA1c (Glycated Hemoglobin)',                'lab', 'lab', 'test',  85.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '80061', 'CPT', 'Lipid Panel',                               'lab', 'lab', 'test', 100.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '82565', 'CPT', 'Creatinine, Serum',                         'lab', 'lab', 'test',  50.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '82274', 'CPT', 'eGFR (Estimated Glomerular Filtration Rate)','lab', 'lab', 'test',  55.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '80076', 'CPT', 'Liver Function Tests (LFT)',                 'lab', 'lab', 'test', 110.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '84460', 'CPT', 'ALT (Alanine Aminotransferase)',             'lab', 'lab', 'test',  45.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '84443', 'CPT', 'TSH (Thyroid Stimulating Hormone)',          'lab', 'lab', 'test',  90.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '84439', 'CPT', 'Free T4 (Thyroxine)',                       'lab', 'lab', 'test',  85.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '87088', 'CPT', 'Urine Culture',                             'lab', 'lab', 'test',  95.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '87040', 'CPT', 'Blood Culture',                             'lab', 'lab', 'test', 120.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '86140', 'CPT', 'C-Reactive Protein (CRP)',                  'lab', 'lab', 'test',  65.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '85610', 'CPT', 'PT/INR (Prothrombin Time)',                 'lab', 'lab', 'test',  70.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '81001', 'CPT', 'Urinalysis, Complete',                      'lab', 'lab', 'test',  45.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'LAB-FAC-FEE', 'INTERNAL', 'Laboratory Facility Fee',       'lab', 'lab', 'each',  25.00, true, NOW(), NOW());

  -- ========================================================================
  -- BILLING ITEMS — IMAGING STUDIES (18) + radiology facility + reading fees
  -- item_type = 'imaging'
  -- ========================================================================
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES
    (gen_random_uuid(), v_tenant_id, '71046', 'CPT', 'Chest X-Ray, 2 Views',                     'imaging', 'radiology', 'study',  150.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '71045', 'CPT', 'Chest X-Ray, Single View',                 'imaging', 'radiology', 'study',  100.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '74018', 'CPT', 'Abdominal X-Ray (KUB)',                    'imaging', 'radiology', 'study',  130.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '73130', 'CPT', 'Hand X-Ray',                               'imaging', 'radiology', 'study',  100.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '70450', 'CPT', 'CT Head without Contrast',                 'imaging', 'radiology', 'study',  800.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '70460', 'CPT', 'CT Head with Contrast',                    'imaging', 'radiology', 'study',  950.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '74177', 'CPT', 'CT Abdomen and Pelvis with Contrast',      'imaging', 'radiology', 'study', 1200.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '71250', 'CPT', 'CT Chest without Contrast',                'imaging', 'radiology', 'study',  900.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '70551', 'CPT', 'MRI Brain without Contrast',               'imaging', 'radiology', 'study', 1400.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '70553', 'CPT', 'MRI Brain with and without Contrast',      'imaging', 'radiology', 'study', 1700.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '72148', 'CPT', 'MRI Lumbar Spine without Contrast',        'imaging', 'radiology', 'study', 1200.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '73721', 'CPT', 'MRI Knee without Contrast',                'imaging', 'radiology', 'study', 1100.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '76700', 'CPT', 'Ultrasound Abdomen Complete',              'imaging', 'radiology', 'study',  350.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '76856', 'CPT', 'Ultrasound Pelvis (Transabdominal)',       'imaging', 'radiology', 'study',  320.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '76536', 'CPT', 'Ultrasound Thyroid',                       'imaging', 'radiology', 'study',  280.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '93880', 'CPT', 'Carotid Doppler Ultrasound',               'imaging', 'radiology', 'study',  450.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '77067', 'CPT', 'Mammogram, Screening, Bilateral',          'imaging', 'radiology', 'study',  400.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '77066', 'CPT', 'Mammogram, Diagnostic, Bilateral',         'imaging', 'radiology', 'study',  500.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'RAD-FAC-FEE',  'INTERNAL', 'Radiology Facility Fee',      'imaging', 'radiology', 'each',    50.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'RAD-READ-FEE', 'INTERNAL', 'Radiologist Reading Fee',     'imaging', 'radiology', 'each',   100.00, true, NOW(), NOW());

  -- ========================================================================
  -- BILLING ITEMS — PROCEDURES (15) + procedure facility fee
  -- item_type = 'procedure'
  -- ========================================================================
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES
    (gen_random_uuid(), v_tenant_id, '11400', 'CPT', 'Excision of Skin Lesion, Simple',          'procedure', 'procedure', 'procedure',   350.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '10060', 'CPT', 'Incision and Drainage of Abscess',         'procedure', 'procedure', 'procedure',   280.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '20610', 'CPT', 'Joint Injection (Knee)',                   'procedure', 'procedure', 'procedure',   300.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '45380', 'CPT', 'Colonoscopy with Biopsy',                  'procedure', 'procedure', 'procedure',  1800.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '43239', 'CPT', 'Upper Endoscopy (EGD) with Biopsy',       'procedure', 'procedure', 'procedure',  1500.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '93458', 'CPT', 'Cardiac Catheterization, Diagnostic',      'procedure', 'procedure', 'procedure',  3500.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '58120', 'CPT', 'Dilation and Curettage (D&C)',             'procedure', 'procedure', 'procedure',  2500.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '29881', 'CPT', 'Arthroscopy, Knee, Surgical',              'procedure', 'procedure', 'procedure',  5000.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '31624', 'CPT', 'Bronchoscopy with BAL',                    'procedure', 'procedure', 'procedure',  2000.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '52000', 'CPT', 'Cystoscopy, Diagnostic',                   'procedure', 'procedure', 'procedure',   800.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '66984', 'CPT', 'Cataract Extraction with IOL Implant',     'procedure', 'procedure', 'procedure',  4500.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '17311', 'CPT', 'Mohs Micrographic Surgery',                'procedure', 'procedure', 'procedure',  3000.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '62323', 'CPT', 'Epidural Steroid Injection, Lumbar',       'procedure', 'procedure', 'procedure',   900.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '42825', 'CPT', 'Tonsillectomy',                            'procedure', 'procedure', 'procedure',  3500.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '41899', 'CPT', 'Tooth Extraction, Simple',                 'procedure', 'procedure', 'procedure',   400.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PROC-FAC-FEE', 'INTERNAL', 'Procedure Facility Fee',      'procedure', 'procedure', 'each',         75.00, true, NOW(), NOW());

  -- ========================================================================
  -- BILLING ITEMS — ADMINISTRATIVE SERVICES (31)
  -- item_type = 'misc'
  -- ========================================================================
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES
    -- Registration
    (gen_random_uuid(), v_tenant_id, '99201',       'CPT',      'New Patient Registration',               'misc', 'registration',  'each',     50.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '99211',       'CPT',      'Follow-up Patient Registration',         'misc', 'registration',  'each',     25.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '99281',       'CPT',      'Emergency Registration',                 'misc', 'registration',  'each',     75.00, true, NOW(), NOW()),
    -- Consultation
    (gen_random_uuid(), v_tenant_id, '99203',       'CPT',      'GP Consultation - New Patient',          'misc', 'consultation',  'visit',   150.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '99213',       'CPT',      'GP Consultation - Follow-up',            'misc', 'consultation',  'visit',   100.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '99204',       'CPT',      'Specialist Consultation - New Patient',  'misc', 'consultation',  'visit',   250.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '99214',       'CPT',      'Specialist Consultation - Follow-up',   'misc', 'consultation',  'visit',   180.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '99285',       'CPT',      'Emergency Physician Consultation',       'misc', 'consultation',  'visit',   300.00, true, NOW(), NOW()),
    -- Admission
    (gen_random_uuid(), v_tenant_id, '99221',       'CPT',      'General Ward Admission',                 'misc', 'registration',  'each',    200.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '99223',       'CPT',      'ICU Admission',                          'misc', 'registration',  'each',    500.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '99234',       'CPT',      'Day Care Admission',                     'misc', 'registration',  'each',    150.00, true, NOW(), NOW()),
    -- Room Charges
    (gen_random_uuid(), v_tenant_id, 'ROOM-001',    'LOCAL',    'General Ward Bed - Per Day',             'misc', 'room_charge',   'day',     250.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'ROOM-002',    'LOCAL',    'Semi-Private Room - Per Day',            'misc', 'room_charge',   'day',     450.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'ROOM-003',    'LOCAL',    'Private Room - Per Day',                 'misc', 'room_charge',   'day',     800.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'ROOM-ICU-001','LOCAL',    'ICU Bed - Per Day',                      'misc', 'room_charge',   'day',    1500.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'ROOM-004',    'LOCAL',    'VIP Suite - Per Day',                    'misc', 'room_charge',   'day',    2000.00, true, NOW(), NOW()),
    -- Nursing
    (gen_random_uuid(), v_tenant_id, '36000',       'CPT',      'IV Cannulation',                         'misc', 'nursing',       'each',     50.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '96374',       'CPT',      'IV Medication Administration',           'misc', 'nursing',       'each',     35.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '12001',       'CPT',      'Wound Dressing - Simple',               'misc', 'nursing',       'each',     60.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '12002',       'CPT',      'Wound Dressing - Complex',              'misc', 'nursing',       'each',    120.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '51702',       'CPT',      'Catheterization - Urinary',              'misc', 'nursing',       'each',     80.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '43752',       'CPT',      'Nasogastric Tube Insertion',             'misc', 'nursing',       'each',     90.00, true, NOW(), NOW()),
    -- Therapy
    (gen_random_uuid(), v_tenant_id, '97161',       'CPT',      'Physiotherapy Session - Initial',        'misc', 'therapy',       'session', 200.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '97110',       'CPT',      'Physiotherapy Session - Follow-up',      'misc', 'therapy',       'session', 150.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '97165',       'CPT',      'Occupational Therapy Session',           'misc', 'therapy',       'session', 180.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, '92507',       'CPT',      'Speech Therapy Session',                 'misc', 'therapy',       'session', 160.00, true, NOW(), NOW()),
    -- Administrative Documents
    (gen_random_uuid(), v_tenant_id, 'ADMIN-001',   'LOCAL',    'Medical Certificate',                    'misc', 'administrative','each',     30.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'ADMIN-002',   'LOCAL',    'Medical Report',                         'misc', 'administrative','each',     80.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'ADMIN-003',   'LOCAL',    'Prescription Copy',                      'misc', 'administrative','each',     15.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'ADMIN-004',   'LOCAL',    'Medical Records Copy',                   'misc', 'administrative','page',      5.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'ADMIN-005',   'LOCAL',    'No Objection Certificate (NOC)',         'misc', 'administrative','each',     50.00, true, NOW(), NOW());

  -- ========================================================================
  -- BILLING ITEMS — PACKAGES (11)
  -- item_type = 'package'
  -- ========================================================================
  INSERT INTO billing_items (id, tenant_id, billing_code, billing_code_type, billing_description, item_type, charge_type, default_unit, list_price, is_active, created_at, updated_at)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'PKG-BASIC-HEALTH',     'INTERNAL', 'Basic Health Check Package',           'package', 'package', 'package',   500.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PKG-EXECUTIVE-HEALTH', 'INTERNAL', 'Executive Health Check Package',       'package', 'package', 'package',  1500.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PKG-PREMIUM-HEALTH',   'INTERNAL', 'Premium Health Check Package',         'package', 'package', 'package',  2500.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PKG-WOMENS-HEALTH',    'INTERNAL', 'Women''s Health Check Package',        'package', 'package', 'package',   800.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PKG-MENS-HEALTH',      'INTERNAL', 'Men''s Health Check Package',          'package', 'package', 'package',   800.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PKG-SENIOR-HEALTH',    'INTERNAL', 'Senior Citizen Health Check Package',  'package', 'package', 'package',  1000.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PKG-YOUTH-HEALTH',     'INTERNAL', 'Youth Health Check Package',           'package', 'package', 'package',   450.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PKG-DIABETES-SCREEN',  'INTERNAL', 'Diabetes Screening Package',           'package', 'package', 'package',   600.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PKG-CARDIAC-SCREEN',   'INTERNAL', 'Cardiac Screening Package',            'package', 'package', 'package',   900.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PKG-PRE-EMPLOYMENT',   'INTERNAL', 'Pre-Employment Medical Check',         'package', 'package', 'package',   350.00, true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'PKG-PRE-MARITAL',      'INTERNAL', 'Pre-Marital Health Check',             'package', 'package', 'package',   700.00, true, NOW(), NOW());

  RAISE NOTICE 'Billing items created: 16 pharmacy + 19 lab + 20 imaging + 16 procedure + 31 misc + 11 packages = 113 total';

  -- ========================================================================
  -- CATALOG ITEM MAPPINGS
  -- Billing item IDs resolved via subquery within zeal_rcm.
  -- Clinical catalog item IDs are fixed UUIDs from clinical seed files.
  -- ========================================================================

  -- ---- MEDICATIONS (1:1 drug charge + shared dispensing fee) --------------
  INSERT INTO catalog_item_mappings
    (id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
     quantity, is_automatic, is_primary, requires_approval,
     facility_ids, payer_ids, patient_types, mapping_reason, is_active, created_at, updated_at)
  VALUES
    -- Lisinopril (MED-001)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111111',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-LISINOPRIL'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lisinopril drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111111',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Atorvastatin (MED-002)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111112',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-ATORVASTATIN'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Atorvastatin drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111112',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Metoprolol Succinate (MED-003)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111113',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-METOPROLOL'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Metoprolol drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111113',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Metformin HCl (MED-004)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111114',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-METFORMIN'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Metformin drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111114',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Amoxicillin (MED-005)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111115',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-AMOXICILLIN'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Amoxicillin drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111115',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Azithromycin (MED-006)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111116',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-AZITHROMYCIN'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Azithromycin drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111116',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Ciprofloxacin (MED-007)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111117',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-CIPROFLOXACIN'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Ciprofloxacin drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111117',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Ibuprofen (MED-008)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111118',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-IBUPROFEN'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Ibuprofen drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111118',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Paracetamol (MED-009)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111119',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-PARACETAMOL'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Paracetamol drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111119',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Tramadol HCl (MED-010)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111120',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-TRAMADOL'),
     1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Tramadol drug charge (controlled)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111120',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Salbutamol (MED-011)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111121',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-SALBUTAMOL'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Salbutamol drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111121',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Omeprazole (MED-012)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111122',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-OMEPRAZOLE'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Omeprazole drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111122',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Cetirizine HCl (MED-013)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111123',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-CETIRIZINE'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Cetirizine drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111123',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Amlodipine Besylate (MED-014)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111124',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-AMLODIPINE'),
     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Amlodipine drug charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111124',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW()),

    -- Warfarin Sodium (MED-015)
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111125',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='MED-WARFARIN'),
     1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Warfarin drug charge (monitoring required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'medication', 'a1111111-1111-1111-1111-111111111125',
     (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PHARM-DISP-FEE'),
     1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pharmacy dispensing fee', true, NOW(), NOW());

  -- ---- LAB TESTS (1:1 test charge + shared facility fee) ------------------
  INSERT INTO catalog_item_mappings
    (id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
     quantity, is_automatic, is_primary, requires_approval,
     facility_ids, payer_ids, patient_types, mapping_reason, is_active, created_at, updated_at)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111111', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='85025'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'CBC test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111111', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111112', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='85018'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Hemoglobin test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111112', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111113', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='85049'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Platelet count charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111113', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111114', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='80053'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'CMP test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111114', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111115', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='82947'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Fasting glucose charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111115', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111116', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='83036'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'HbA1c test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111116', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111117', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='80061'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lipid panel charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111117', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111118', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='82565'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Creatinine test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111118', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111119', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='82274'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'eGFR test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111119', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111120', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='80076'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'LFT charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111120', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111121', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='84460'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'ALT test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111121', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111122', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='84443'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'TSH test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111122', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111123', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='84439'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Free T4 test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111123', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111124', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='87088'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Urine culture charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111124', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111125', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='87040'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Blood culture charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111125', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111126', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='86140'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'CRP test charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111126', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111127', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='85610'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'PT/INR charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111127', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111128', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='81001'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Urinalysis charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'lab_test', 'b1111111-1111-1111-1111-111111111128', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='LAB-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Lab facility fee', true, NOW(), NOW());

  -- ---- IMAGING STUDIES (1:1 study + facility fee + reading fee) -----------
  INSERT INTO catalog_item_mappings
    (id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
     quantity, is_automatic, is_primary, requires_approval,
     facility_ids, payer_ids, patient_types, mapping_reason, is_active, created_at, updated_at)
  VALUES
    -- X-rays (no approval required)
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111111', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='71046'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Chest X-Ray 2V charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111111', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111111', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111112', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='71045'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Chest X-Ray 1V charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111112', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111112', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111113', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='74018'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Abdominal X-Ray charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111113', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111113', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111114', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='73130'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Hand X-Ray charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111114', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111114', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    -- CT scans (approval required)
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111115', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='70450'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'CT Head charge (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111115', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111115', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111116', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='70460'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'CT Head contrast charge (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111116', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111116', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111117', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='74177'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'CT Abdomen/Pelvis charge (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111117', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111117', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111118', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='71250'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'CT Chest charge (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111118', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111118', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    -- MRI scans (approval required)
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111119', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='70551'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'MRI Brain charge (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111119', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111119', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111120', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='70553'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'MRI Brain with/without contrast (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111120', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111120', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111121', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='72148'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'MRI Lumbar Spine charge (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111121', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111121', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111122', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='73721'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'MRI Knee charge (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111122', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111122', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    -- Ultrasounds (no approval required)
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111123', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='76700'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Ultrasound Abdomen charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111123', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111123', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111124', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='76856'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Ultrasound Pelvis charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111124', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111124', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111125', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='76536'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Ultrasound Thyroid charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111125', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111125', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111126', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='93880'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Carotid Doppler charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111126', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111126', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111127', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='77067'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Screening mammography charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111127', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111127', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111128', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='77066'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Diagnostic mammography charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111128', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-FAC-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiology facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'imaging_study', 'c1111111-1111-1111-1111-111111111128', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='RAD-READ-FEE'), 1, true, false, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Radiologist reading fee', true, NOW(), NOW());

  -- ---- PROCEDURES (1:1; high-value ones get a facility fee too) -----------
  INSERT INTO catalog_item_mappings
    (id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
     quantity, is_automatic, is_primary, requires_approval,
     facility_ids, payer_ids, patient_types, mapping_reason, is_active, created_at, updated_at)
  VALUES
    -- Minor office procedures (no approval, no facility fee)
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111111', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='11400'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Excision of skin lesion', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111112', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='10060'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Incision and drainage', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111113', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='20610'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Joint injection', true, NOW(), NOW()),
    -- Endoscopic and surgical procedures (approval required, facility fee added)
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111114', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='45380'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Colonoscopy (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111114', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PROC-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111115', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='43239'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Upper endoscopy EGD (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111115', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PROC-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111116', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='93458'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Cardiac catheterization (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111116', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PROC-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111117', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='58120'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'D&C (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111117', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PROC-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111118', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='29881'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Knee arthroscopy (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111118', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PROC-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111119', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='31624'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Bronchoscopy (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111119', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PROC-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111120', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='52000'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Cystoscopy diagnostic', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111121', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='66984'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Cataract extraction (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111121', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PROC-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111122', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='17311'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Mohs surgery (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111122', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PROC-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111123', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='62323'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Epidural injection (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111123', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PROC-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111124', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='42825'), 1, true, true, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Tonsillectomy (approval required)', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111124', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PROC-FAC-FEE'), 1, true, false, true, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Procedure facility fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'procedure', 'd1111111-1111-1111-1111-111111111125', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='41899'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Tooth extraction', true, NOW(), NOW());

  -- ---- ADMINISTRATIVE SERVICES (1:1) --------------------------------------
  INSERT INTO catalog_item_mappings
    (id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
     quantity, is_automatic, is_primary, requires_approval,
     facility_ids, payer_ids, patient_types, mapping_reason, is_active, created_at, updated_at)
  VALUES
    -- Registration
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111111', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='99201' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'New patient registration fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111112', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='99211' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Follow-up registration fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111113', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='99281' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Emergency registration fee', true, NOW(), NOW()),
    -- Consultation
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111114', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='99203' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'GP new patient consultation fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111115', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='99213' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'GP follow-up consultation fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111116', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='99204' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Specialist new patient consultation fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111117', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='99214' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Specialist follow-up consultation fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111118', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='99285' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Emergency physician consultation fee', true, NOW(), NOW()),
    -- Admission
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111119', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='99221' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'General ward admission fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111120', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='99223' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'ICU admission fee', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111121', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='99234' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Day care admission fee', true, NOW(), NOW()),
    -- Room charges
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111122', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='ROOM-001'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'General ward daily rate', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111123', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='ROOM-002'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Semi-private room daily rate', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111124', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='ROOM-003'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Private room daily rate', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111125', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='ROOM-ICU-001'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'ICU bed daily rate', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111126', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='ROOM-004'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'VIP suite daily rate', true, NOW(), NOW()),
    -- Nursing
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111127', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='36000' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'IV cannulation charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111128', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='96374' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'IV medication administration charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111129', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='12001' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Simple wound dressing charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111130', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='12002' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Complex wound dressing charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111131', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='51702' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Urinary catheterization charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111132', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='43752' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'NG tube insertion charge', true, NOW(), NOW()),
    -- Therapy
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111133', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='97161' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Initial physiotherapy charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111134', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='97110' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Follow-up physiotherapy charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111135', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='97165' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Occupational therapy charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111136', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='92507' AND item_type='misc'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Speech therapy charge', true, NOW(), NOW()),
    -- Administrative documents
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111137', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='ADMIN-001'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Medical certificate charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111138', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='ADMIN-002'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Medical report charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111139', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='ADMIN-003'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Prescription copy charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111140', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='ADMIN-004'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Medical records copy charge', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'administrative_service', 'e1111111-1111-1111-1111-111111111141', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='ADMIN-005'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'NOC issuance charge', true, NOW(), NOW());

  -- ---- PACKAGES (1:1) ------------------------------------------------------
  INSERT INTO catalog_item_mappings
    (id, tenant_id, catalog_type, catalog_item_id, billing_item_id,
     quantity, is_automatic, is_primary, requires_approval,
     facility_ids, payer_ids, patient_types, mapping_reason, is_active, created_at, updated_at)
  VALUES
    (gen_random_uuid(), v_tenant_id, 'package', 'f1111111-1111-1111-1111-111111111111', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PKG-BASIC-HEALTH'),     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Basic health check package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', 'f1111111-1111-1111-1111-111111111112', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PKG-EXECUTIVE-HEALTH'), 1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Executive health check package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', 'f1111111-1111-1111-1111-111111111113', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PKG-PREMIUM-HEALTH'),   1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Premium health check package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', 'f1111111-1111-1111-1111-111111111114', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PKG-WOMENS-HEALTH'),    1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Women''s health check package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', 'f1111111-1111-1111-1111-111111111115', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PKG-MENS-HEALTH'),      1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Men''s health check package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', 'f1111111-1111-1111-1111-111111111116', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PKG-SENIOR-HEALTH'),    1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Senior health check package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', 'f1111111-1111-1111-1111-111111111117', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PKG-YOUTH-HEALTH'),     1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Youth health check package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', 'f1111111-1111-1111-1111-111111111118', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PKG-DIABETES-SCREEN'),  1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Diabetes screening package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', 'f1111111-1111-1111-1111-111111111119', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PKG-CARDIAC-SCREEN'),   1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Cardiac screening package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', 'f1111111-1111-1111-1111-111111111120', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PKG-PRE-EMPLOYMENT'),   1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pre-employment medical check package', true, NOW(), NOW()),
    (gen_random_uuid(), v_tenant_id, 'package', 'f1111111-1111-1111-1111-111111111121', (SELECT id FROM billing_items WHERE tenant_id=v_tenant_id AND billing_code='PKG-PRE-MARITAL'),      1, true, true, false, ARRAY[]::TEXT[], ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'Pre-marital health check package', true, NOW(), NOW());

  RAISE NOTICE 'Catalog mappings seeded successfully for tenant %', v_tenant_id;
  RAISE NOTICE 'Medications: 30 mappings (15 × drug + dispensing fee)';
  RAISE NOTICE 'Lab tests:   36 mappings (18 × test + facility fee)';
  RAISE NOTICE 'Imaging:     54 mappings (18 × study + facility fee + reading fee)';
  RAISE NOTICE 'Procedures:  ~27 mappings (15 procedures, major ones include facility fee)';
  RAISE NOTICE 'Admin svc:   31 mappings (1:1)';
  RAISE NOTICE 'Packages:    11 mappings (1:1)';

END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
SELECT 'Billing Items by Type' AS report;
SELECT item_type, COUNT(*) AS count, SUM(list_price) AS total_list_price
FROM billing_items
GROUP BY item_type
ORDER BY item_type;

SELECT '' AS spacing;
SELECT 'Catalog Mappings by Type' AS report;
SELECT catalog_type, COUNT(*) AS count,
       SUM(CASE WHEN is_primary THEN 1 ELSE 0 END) AS primary_mappings,
       SUM(CASE WHEN requires_approval THEN 1 ELSE 0 END) AS requiring_approval
FROM catalog_item_mappings
GROUP BY catalog_type
ORDER BY catalog_type;
