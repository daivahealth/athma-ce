TRUNCATE audit.audit_log;

INSERT INTO audit.audit_log (id, table_name, operation, old_data, new_data, changed_by, changed_at)
VALUES
  ('e1111111-1111-1111-1111-111111111111', 'claims', 'CREATE', NULL, '{"claim_number":"CLM-2024-0001"}'::jsonb, '01010101-1111-1111-1111-111111111111', NOW()),
  ('e1111111-1111-1111-1111-111111111112', 'patients', 'CREATE', NULL, '{"id":"c1111111-1111-1111-1111-111111111111"}'::jsonb, '01010101-1111-1111-1111-111111111111', NOW());
