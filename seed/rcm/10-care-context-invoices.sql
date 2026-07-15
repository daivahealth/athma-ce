-- Care Context demo invoices for MRN-2025-003 (John Smith) oncology encounters.
-- Attaches invoices to the encounters that already carry claims/denials so the
-- Care Context claim pipeline (Claims · Denials · Invoices + financials) shows
-- coherent data. Re-runnable: scoped delete + fixed ids.
BEGIN;

DELETE FROM invoices
WHERE id IN (
  'f1000010-0000-4000-8000-000000000005',
  'f1000010-0000-4000-8000-000000000006',
  'f1000010-0000-4000-8000-000000000010'
);

INSERT INTO invoices
  (id, tenant_id, patient_id, encounter_id, patient_display_name, invoice_number,
   invoice_date, due_date, gross_amount, total_discounts, net_amount, amount_paid,
   balance_due, status, currency, created_at, updated_at)
VALUES
  -- ENC-2021-0005 (colectomy) — fully paid
  ('f1000010-0000-4000-8000-000000000005', '11111111-1111-1111-1111-111111111111',
   '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'e0000001-0000-4000-8000-000000000005',
   'John Smith', 'INV-2021-000105', '2021-04-12', '2021-05-12',
   45000.00, 0.00, 45000.00, 45000.00, 0.00, 'paid', 'INR', NOW(), NOW()),
  -- ENC-2021-0006 (chemo cycle 1, has denial) — partially paid
  ('f1000010-0000-4000-8000-000000000006', '11111111-1111-1111-1111-111111111111',
   '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'e0000001-0000-4000-8000-000000000006',
   'John Smith', 'INV-2021-000106', '2021-05-11', '2021-06-10',
   8500.00, 0.00, 8500.00, 6500.00, 2000.00, 'partially_paid', 'INR', NOW(), NOW()),
  -- ENC-2022-0001 (surveillance, denied CO-16) — unpaid
  ('f1000010-0000-4000-8000-000000000010', '11111111-1111-1111-1111-111111111111',
   '7bc65ec5-ef2f-5a36-b575-7978ce5e59c0', 'e0000001-0000-4000-8000-000000000010',
   'John Smith', 'INV-2022-000110', '2022-04-11', '2022-05-11',
   3200.00, 0.00, 3200.00, 0.00, 3200.00, 'unpaid', 'INR', NOW(), NOW());

COMMIT;
