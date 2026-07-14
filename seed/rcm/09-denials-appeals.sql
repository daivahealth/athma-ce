-- Seed: RCM denials & appeals demo data
-- Patient: John Smith (MRN-2025-003, oncology) -> patient_id 7bc65ec5-ef2f-5a36-b575-7978ce5e59c0
-- Tenant:  11111111-1111-1111-1111-111111111111
--
-- References this patient's existing claims (seeded into the running zeal_rcm DB):
--   a0000006-0000-4000-8000-000000000003  CLM-2022040001  (submitted, 3200.00 INR)
--   a0000006-0000-4000-8000-000000000002  CLM-2021050001  (paid,      8500.00 INR)
--
-- Re-runnable: removes the seeded denials (appeals cascade) before re-inserting.

DELETE FROM denials WHERE id IN (
  'd0000009-0000-4000-8000-000000000001',
  'd0000009-0000-4000-8000-000000000002'
);

INSERT INTO denials (
  id, tenant_id, claim_id, denial_code, denial_reason, remark_codes,
  denied_amount, currency, status, denied_at, appeal_deadline, created_at, updated_at
) VALUES
  (
    'd0000009-0000-4000-8000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'a0000006-0000-4000-8000-000000000003',
    'CO-197',
    'Precertification/authorization/notification absent for the billed oncology service.',
    '["N702"]'::jsonb,
    3200.00, 'INR', 'appealing',
    NOW() - INTERVAL '6 days',
    (CURRENT_DATE + INTERVAL '24 days')::date,
    NOW(), NOW()
  ),
  (
    'd0000009-0000-4000-8000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'a0000006-0000-4000-8000-000000000002',
    'CO-16',
    'Claim/service lacks information or has submission/billing error(s) needed for adjudication.',
    '["N265","N276"]'::jsonb,
    8500.00, 'INR', 'open',
    NOW() - INTERVAL '2 days',
    (CURRENT_DATE + INTERVAL '28 days')::date,
    NOW(), NOW()
  );

-- Drafted appeal against the CO-197 denial
INSERT INTO appeals (
  id, tenant_id, denial_id, status, narrative, justification, supporting_refs,
  filed_at, outcome, created_at, updated_at
) VALUES
  (
    'b0000009-0000-4000-8000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'd0000009-0000-4000-8000-000000000001',
    'draft',
    'The oncology infusion was medically necessary and delivered under an active treatment protocol. Prior authorization PA-2022-0417 was obtained before the date of service and covers the billed procedure.',
    'Authorization was on file at the time of service; the CO-197 denial appears to be a payer matching error against the correct auth reference.',
    '[{"type":"prior_auth","ref":"PA-2022-0417","description":"Approved prior authorization covering the infusion"},{"type":"clinical_note","ref":"ENC-e0000001-...-000010","description":"Treatment protocol and medical necessity note"}]'::jsonb,
    NULL, NULL, NOW(), NOW()
  );
