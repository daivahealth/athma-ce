-- =============================================================================
-- 20-rcm-claims.sql
-- Consolidated RCM data (claims, preauth, denials/appeals, invoices) for all
-- 5 oncology demo patients. Replaces rcm/09-oncology-demo-claims.sql,
-- rcm/09-denials-appeals.sql and rcm/10-care-context-invoices.sql (Rajesh Iyer
-- only) with coverage across the full oncology roster.
--
-- DB: zeal_rcm. Runs against a different database than the clinical seed
-- files in this folder, so patient/encounter ids below are literal (no
-- cross-database function calls) but mirror the same uuid_from_text() values
-- used in the clinical seed files -- keep them in sync if patient/encounter
-- ids change there.
--
-- Idempotent: deletes by fixed id before inserting.
-- =============================================================================

BEGIN;

DELETE FROM appeals  WHERE id IN ('b0000009-0000-4000-8000-000000000001');
DELETE FROM denials  WHERE id IN ('d0000009-0000-4000-8000-000000000001','d0000009-0000-4000-8000-000000000002');
DELETE FROM invoices WHERE id IN (
  'f1000010-0000-4000-8000-000000000005','f1000010-0000-4000-8000-000000000006','f1000010-0000-4000-8000-000000000010',
  'f1000010-0000-4000-8000-000000000011','f1000010-0000-4000-8000-000000000012',
  'f1000010-0000-4000-8000-000000000013','f1000010-0000-4000-8000-000000000014','f1000010-0000-4000-8000-000000000015'
);
DELETE FROM preauth_requests WHERE patient_id IN (
  '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', '92cc0af1-1b43-5680-ba12-794b1fc57c9c',
  '860e17bf-fc64-517d-8b6e-14ac079f997d', '9bda4734-1746-5671-a8a9-7272603412c4',
  'b61e1dc8-b886-567c-9fd2-93e7628a8738');
DELETE FROM claims WHERE patient_id IN (
  '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', '92cc0af1-1b43-5680-ba12-794b1fc57c9c',
  '860e17bf-fc64-517d-8b6e-14ac079f997d', '9bda4734-1746-5671-a8a9-7272603412c4',
  'b61e1dc8-b886-567c-9fd2-93e7628a8738');

INSERT INTO payers (
  id, tenant_id, payer_name, payer_id, payer_type, contact_info, configuration,
  status, created_at, updated_at
) VALUES (
  'a0000005-0000-4000-8000-000000000001', '11111111-1111-1111-1111-111111111111',
  'Zeal National Health Insurance', 'ZNHI', 'insurance', '{}', '{}', 'active', NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Claims -- one per major treatment encounter, across all 5 patients.
-- ---------------------------------------------------------------------------
INSERT INTO claims (
  id, tenant_id, claim_number, status, payer_id, patient_id, encounter_id,
  total_amount, currency, service_date, submitted_at, adjudicated_at,
  created_at, updated_at
) VALUES
-- Rajesh Iyer: colectomy (paid), chemo cycle 1 (denied), 1yr surveillance CT (paid)
('a0000006-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','CLM-2021-0001','paid','a0000005-0000-4000-8000-000000000001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000005',
 45000.00,'INR','2021-04-05','2021-04-12 09:00:00+00','2021-04-25 09:00:00+00',NOW(),NOW()),
('a0000006-0000-4000-8000-000000000002','11111111-1111-1111-1111-111111111111','CLM-2021-0002','denied','a0000005-0000-4000-8000-000000000001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000006',
 8500.00,'INR','2021-05-10','2021-05-15 09:00:00+00','2021-05-28 09:00:00+00',NOW(),NOW()),
('a0000006-0000-4000-8000-000000000003','11111111-1111-1111-1111-111111111111','CLM-2022-0001','denied','a0000005-0000-4000-8000-000000000001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000010',
 3200.00,'INR','2022-04-10','2022-04-15 09:00:00+00','2022-04-28 09:00:00+00',NOW(),NOW()),
-- Priya Sharma: lumpectomy (paid), radiation completion (paid)
('a0000006-0000-4000-8000-000000000004','11111111-1111-1111-1111-111111111111','CLM-2023-0101','paid','a0000005-0000-4000-8000-000000000001','92cc0af1-1b43-5680-ba12-794b1fc57c9c','d5f5d0d5-d069-580b-bdc3-276ff3f6c60d',
 32000.00,'INR','2023-03-01','2023-03-08 09:00:00+00','2023-03-20 09:00:00+00',NOW(),NOW()),
('a0000006-0000-4000-8000-000000000005','11111111-1111-1111-1111-111111111111','CLM-2023-0102','paid','a0000005-0000-4000-8000-000000000001','92cc0af1-1b43-5680-ba12-794b1fc57c9c','cb28e7a8-50a7-5c31-804f-5725fa5ba7a9',
 18500.00,'INR','2023-09-20','2023-09-25 09:00:00+00','2023-10-05 09:00:00+00',NOW(),NOW()),
-- Vijay Nair: palliative chemo cycle 1 (paid)
('a0000006-0000-4000-8000-000000000006','11111111-1111-1111-1111-111111111111','CLM-2024-0201','paid','a0000005-0000-4000-8000-000000000001','860e17bf-fc64-517d-8b6e-14ac079f997d','34599f43-33e3-5886-8aa1-ba38521af861',
 9800.00,'INR','2024-02-22','2024-02-27 09:00:00+00','2024-03-10 09:00:00+00',NOW(),NOW()),
-- Suresh Menon: definitive radiation course (paid)
('a0000006-0000-4000-8000-000000000007','11111111-1111-1111-1111-111111111111','CLM-2024-0301','paid','a0000005-0000-4000-8000-000000000001','9bda4734-1746-5671-a8a9-7272603412c4','32303136-62ed-5b02-9333-df50475172e5',
 22000.00,'INR','2024-05-06','2024-05-30 09:00:00+00','2024-06-10 09:00:00+00',NOW(),NOW()),
-- Ananya Reddy: R-CHOP cycle 1 (paid)
('a0000006-0000-4000-8000-000000000008','11111111-1111-1111-1111-111111111111','CLM-2024-0401','paid','a0000005-0000-4000-8000-000000000001','b61e1dc8-b886-567c-9fd2-93e7628a8738','317f0074-6aef-5dee-bcd8-924cb3136e69',
 11200.00,'INR','2024-06-03','2024-06-08 09:00:00+00','2024-06-20 09:00:00+00',NOW(),NOW());

-- ---------------------------------------------------------------------------
-- Preauth requests.
-- ---------------------------------------------------------------------------
INSERT INTO preauth_requests (
  id, tenant_id, auth_number, internal_ref, patient_id, payer_id, encounter_id,
  auth_type, requested_services, diagnosis_codes, clinical_notes, urgency_level,
  status, approved_amount, valid_from, valid_to, submitted_at, decided_at,
  created_at, updated_at
) VALUES
('a0000007-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','PA-2021-0001','REF-2021-0001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','a0000005-0000-4000-8000-000000000001','e0000001-0000-4000-8000-000000000005',
 'inpatient','["Laparoscopic sigmoid colectomy"]'::jsonb,'{C18.9}','Stage III sigmoid colon adenocarcinoma requiring elective resection.','routine',
 'approved',45000.00,'2021-03-26','2021-05-05','2021-03-25 09:00:00+00','2021-03-26 10:00:00+00',NOW(),NOW()),
('a0000007-0000-4000-8000-000000000002','11111111-1111-1111-1111-111111111111','PA-2021-0002','REF-2021-0002','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','a0000005-0000-4000-8000-000000000001','e0000001-0000-4000-8000-000000000006',
 'medication','["FOLFOX x12 cycles"]'::jsonb,'{C18.9}','Adjuvant chemotherapy for node-positive Stage IIIB colon cancer.','routine',
 'approved',95000.00,'2021-05-01','2021-11-01','2021-04-25 09:00:00+00','2021-04-28 10:00:00+00',NOW(),NOW()),
('a0000007-0000-4000-8000-000000000003','11111111-1111-1111-1111-111111111111','PA-2023-0101','REF-2023-0101','92cc0af1-1b43-5680-ba12-794b1fc57c9c','a0000005-0000-4000-8000-000000000001','d5f5d0d5-d069-580b-bdc3-276ff3f6c60d',
 'inpatient','["Lumpectomy with sentinel node biopsy"]'::jsonb,'{C50.911}','Stage IIA right breast cancer requiring breast-conserving surgery.','routine',
 'approved',32000.00,'2023-02-13','2023-03-15','2023-02-12 09:00:00+00','2023-02-13 10:00:00+00',NOW(),NOW()),
('a0000007-0000-4000-8000-000000000004','11111111-1111-1111-1111-111111111111','PA-2024-0301','REF-2024-0301','9bda4734-1746-5671-a8a9-7272603412c4','a0000005-0000-4000-8000-000000000001','32303136-62ed-5b02-9333-df50475172e5',
 'outpatient','["IMRT 60Gy/20# to prostate"]'::jsonb,'{C61}','Definitive radiation for Stage II prostate adenocarcinoma.','routine',
 'approved',22000.00,'2024-04-25','2024-06-01','2024-04-20 09:30:00+00','2024-04-22 10:00:00+00',NOW(),NOW());

-- ---------------------------------------------------------------------------
-- Denials + appeals -- Rajesh Iyer two originally-denied claims.
-- ---------------------------------------------------------------------------
INSERT INTO denials (
  id, tenant_id, claim_id, denial_code, denial_reason, remark_codes,
  denied_amount, currency, status, denied_at, appeal_deadline, created_at, updated_at
) VALUES
('d0000009-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','a0000006-0000-4000-8000-000000000002','CO-50','Non-covered service under this plan without prior authorization on file.','["M15","N130"]',
 8500.00,'INR','appealed','2021-05-28 09:00:00+00','2021-06-27',NOW(),NOW()),
('d0000009-0000-4000-8000-000000000002','11111111-1111-1111-1111-111111111111','a0000006-0000-4000-8000-000000000003','CO-197','Precertification/authorization absent.','["N657"]',
 3200.00,'INR','open','2022-04-28 09:00:00+00','2022-05-28',NOW(),NOW());

INSERT INTO appeals (
  id, tenant_id, denial_id, status, narrative, justification, supporting_refs,
  filed_at, outcome, created_at, updated_at
) VALUES (
  'b0000009-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','d0000009-0000-4000-8000-000000000001',
  'submitted','Requesting reconsideration of denial for chemotherapy cycle 1, which was pre-authorized under PA-2021-0002 covering the full FOLFOX x12 course.',
  'Preauthorization PA-2021-0002 was approved 2021-04-28 for the full 12-cycle FOLFOX course, prior to this claim''s service date.','["PA-2021-0002"]',
  '2021-06-05 09:00:00+00','pending',NOW(),NOW()
);

-- ---------------------------------------------------------------------------
-- Invoices.
-- ---------------------------------------------------------------------------
INSERT INTO invoices (
  id, tenant_id, patient_id, encounter_id, patient_display_name, invoice_number,
  invoice_date, due_date, gross_amount, total_discounts, net_amount, amount_paid,
  balance_due, status, currency, created_at, updated_at
) VALUES
('f1000010-0000-4000-8000-000000000005','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000005','Rajesh Iyer','INV-2021-0005',
 '2021-04-09','2021-05-09',45000.00,2000.00,43000.00,43000.00,0.00,'paid','INR',NOW(),NOW()),
('f1000010-0000-4000-8000-000000000006','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000006','Rajesh Iyer','INV-2021-0006',
 '2021-05-10','2021-06-09',8500.00,0.00,8500.00,0.00,8500.00,'pending','INR',NOW(),NOW()),
('f1000010-0000-4000-8000-000000000010','11111111-1111-1111-1111-111111111111','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000010','Rajesh Iyer','INV-2022-0001',
 '2022-04-10','2022-05-10',3200.00,0.00,3200.00,0.00,3200.00,'pending','INR',NOW(),NOW()),
('f1000010-0000-4000-8000-000000000011','11111111-1111-1111-1111-111111111111','92cc0af1-1b43-5680-ba12-794b1fc57c9c','d5f5d0d5-d069-580b-bdc3-276ff3f6c60d','Priya Sharma','INV-2023-0101',
 '2023-03-01','2023-04-01',32000.00,1500.00,30500.00,30500.00,0.00,'paid','INR',NOW(),NOW()),
('f1000010-0000-4000-8000-000000000012','11111111-1111-1111-1111-111111111111','92cc0af1-1b43-5680-ba12-794b1fc57c9c','cb28e7a8-50a7-5c31-804f-5725fa5ba7a9','Priya Sharma','INV-2023-0102',
 '2023-09-20','2023-10-20',18500.00,0.00,18500.00,18500.00,0.00,'paid','INR',NOW(),NOW()),
('f1000010-0000-4000-8000-000000000013','11111111-1111-1111-1111-111111111111','860e17bf-fc64-517d-8b6e-14ac079f997d','34599f43-33e3-5886-8aa1-ba38521af861','Vijay Nair','INV-2024-0201',
 '2024-02-22','2024-03-24',9800.00,0.00,9800.00,9800.00,0.00,'paid','INR',NOW(),NOW()),
('f1000010-0000-4000-8000-000000000014','11111111-1111-1111-1111-111111111111','9bda4734-1746-5671-a8a9-7272603412c4','32303136-62ed-5b02-9333-df50475172e5','Suresh Menon','INV-2024-0301',
 '2024-05-06','2024-06-05',22000.00,1000.00,21000.00,21000.00,0.00,'paid','INR',NOW(),NOW()),
('f1000010-0000-4000-8000-000000000015','11111111-1111-1111-1111-111111111111','b61e1dc8-b886-567c-9fd2-93e7628a8738','317f0074-6aef-5dee-bcd8-924cb3136e69','Ananya Reddy','INV-2024-0401',
 '2024-06-03','2024-07-03',11200.00,0.00,11200.00,11200.00,0.00,'paid','INR',NOW(),NOW());

COMMIT;
