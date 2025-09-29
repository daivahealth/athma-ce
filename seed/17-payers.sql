-- Seed Data: Payers (Insurance Companies in UAE)
-- Execution Order: 17 (Depends on tenants)

-- Set tenant context for first tenant
SET app.current_tenant_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO payers (id, tenant_id, name, type, status, post_office_code, settings) VALUES
('payer-daman-uuid', '11111111-1111-1111-1111-111111111111', 'Daman', 'government', 'active', 'DOH_SHF',
 '{"network_type":"PPO","requires_preauth":["surgery","MRI","CT"],"claim_format":"XML"}'::jsonb),
 
('payer-saico-uuid', '11111111-1111-1111-1111-111111111111', 'SAICO', 'private', 'active', 'DHPO',
 '{"network_type":"PPO","requires_preauth":["surgery","procedures"],"claim_format":"XML"}'::jsonb),
 
('payer-nextcare-uuid', '11111111-1111-1111-1111-111111111111', 'NextCare', 'tpa', 'active', 'CLEARING_UAE',
 '{"network_type":"HMO","requires_preauth":["specialist","imaging"],"claim_format":"EDI"}'::jsonb),
 
('payer-oman-uuid', '11111111-1111-1111-1111-111111111111', 'Oman Insurance', 'private', 'active', 'DHPO',
 '{"network_type":"PPO","requires_preauth":["surgery","ICU"],"claim_format":"XML"}'::jsonb),
 
('payer-cash-uuid', '11111111-1111-1111-1111-111111111111', 'Cash/Self-Pay', 'self_pay', 'active', NULL,
 '{"network_type":"none","requires_preauth":[],"claim_format":"none"}'::jsonb);

-- Add payers for second tenant
SET app.current_tenant_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO payers (id, tenant_id, name, type, status, post_office_code) VALUES
('payer-daman-t2', '22222222-2222-2222-2222-222222222222', 'Daman', 'government', 'active', 'DOH_SHF'),
('payer-cash-t2', '22222222-2222-2222-2222-222222222222', 'Cash/Self-Pay', 'self_pay', 'active', NULL);

-- Verify
RESET app.current_tenant_id;
SELECT t.name as tenant, p.name as payer, p.type, p.status 
FROM payers p
JOIN tenants t ON t.id = p.tenant_id
ORDER BY t.name, p.name;
