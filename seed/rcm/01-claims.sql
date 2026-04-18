TRUNCATE claims CASCADE;

INSERT INTO claims (
  id, tenant_id, claim_number, status, patient_id, total_amount,
  currency, service_date, created_at, updated_at
) VALUES
  ('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'CLM-2024-0001', 'draft', 'c1111111-1111-1111-1111-111111111111', 850.00,
   'INR', CURRENT_DATE - INTERVAL '1 day', NOW(), NOW());
