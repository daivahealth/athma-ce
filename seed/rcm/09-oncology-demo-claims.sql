-- =============================================================================
-- 09-oncology-demo-claims.sql
-- Demo RCM data for John Smith's Stage III colorectal cancer journey.
-- Patient 7bc65ec5-ef2f-5a36-b575-7978ce5e59c0, encounters seeded by
-- seed/clinical/28-oncology-demo-journey.sql.
--
-- Seeds: 1 demo payer, 3 claims and 2 preauth requests, linked to the
--        seeded surgery / chemo / surveillance encounters.
--
-- Idempotent: re-runnable. Scoped to this patient; stable ids.
-- =============================================================================

BEGIN;

-- Clean up any prior run for this patient.
DELETE FROM preauth_requests WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';
DELETE FROM claims           WHERE patient_id = '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0';

-- ---------------------------------------------------------------------------
-- Demo payer (preauth_requests.payer_id is NOT NULL -> FK to payers).
-- ---------------------------------------------------------------------------
INSERT INTO payers (
  id, tenant_id, payer_name, payer_id, payer_type, contact_info, configuration,
  status, created_at, updated_at
) VALUES (
  'a0000005-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','Zeal National Health Insurance','ZNHI','insurance','{}','{}','active',NOW(),NOW()
) ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Claims -- surgery, chemo cycle 1, 1-year surveillance CT.
-- ---------------------------------------------------------------------------
INSERT INTO claims (
  id, tenant_id, claim_number, status, payer_id, patient_id, encounter_id,
  total_amount, currency, service_date, submitted_at, adjudicated_at,
  created_at, updated_at
) VALUES
('a0000006-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','CLM-2021040001','paid','a0000005-0000-4000-8000-000000000001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000005',
 45000.00,'INR','2021-04-05','2021-04-06 10:00:00+00','2021-04-20 15:00:00+00',NOW(),NOW()),
('a0000006-0000-4000-8000-000000000002','11111111-1111-1111-1111-111111111111','CLM-2021050001','paid','a0000005-0000-4000-8000-000000000001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000006',
 8500.00,'INR','2021-05-10','2021-05-11 10:00:00+00','2021-05-25 15:00:00+00',NOW(),NOW()),
('a0000006-0000-4000-8000-000000000003','11111111-1111-1111-1111-111111111111','CLM-2022040001','submitted','a0000005-0000-4000-8000-000000000001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','e0000001-0000-4000-8000-000000000010',
 3200.00,'INR','2022-04-10','2022-04-11 10:00:00+00',NULL,NOW(),NOW());

-- ---------------------------------------------------------------------------
-- Preauth requests -- surgery (colectomy) and adjuvant FOLFOX chemotherapy.
-- ---------------------------------------------------------------------------
INSERT INTO preauth_requests (
  id, tenant_id, auth_number, internal_ref, patient_id, payer_id, encounter_id,
  auth_type, requested_services, diagnosis_codes, clinical_notes, urgency_level,
  status, approved_amount, valid_from, valid_to, submitted_at, decided_at,
  created_at, updated_at
) VALUES
('a0000007-0000-4000-8000-000000000001','11111111-1111-1111-1111-111111111111','AUTH-2021-0001','PA-2021-0001','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','a0000005-0000-4000-8000-000000000001','e0000001-0000-4000-8000-000000000005',
 'inpatient','[{"service":"Laparoscopic sigmoid colectomy","code":"0DTN4ZZ"}]',ARRAY['C18.9']::text[],'Stage III sigmoid colon adenocarcinoma requiring resection.','urgent',
 'approved',45000.00,'2021-03-25','2021-04-30','2021-03-22 09:00:00+00','2021-03-24 14:00:00+00',NOW(),NOW()),
('a0000007-0000-4000-8000-000000000002','11111111-1111-1111-1111-111111111111','AUTH-2021-0002','PA-2021-0002','7bc65ec5-ef2f-5a36-b575-7978ce5e59c0','a0000005-0000-4000-8000-000000000001','e0000001-0000-4000-8000-000000000006',
 'medication','[{"service":"Adjuvant mFOLFOX6 chemotherapy","cycles":12,"protocol":"FOLFOX"}]',ARRAY['C18.9']::text[],'Adjuvant chemotherapy x12 cycles post R0 resection, node-positive disease.','routine',
 'approved',102000.00,'2021-04-20','2021-12-31','2021-04-15 09:00:00+00','2021-04-18 14:00:00+00',NOW(),NOW());

COMMIT;
