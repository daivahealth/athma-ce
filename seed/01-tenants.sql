-- Seed Data: Tenants
-- Execution Order: 1 (No dependencies)

-- Multi-tenant healthcare providers in UAE
INSERT INTO tenants (id, name, domain, status, settings, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Dubai Health Center', 'dhc.zeal.ae', 'active', 
 '{"timezone":"Asia/Dubai","default_language":"en","currencies":["AED"],"features":["pms","rcm","ai"]}'::jsonb, 
 NOW()),
 
('22222222-2222-2222-2222-222222222222', 'Abu Dhabi Medical Clinic', 'admc.zeal.ae', 'active',
 '{"timezone":"Asia/Dubai","default_language":"ar","currencies":["AED"],"features":["pms","billing"]}'::jsonb,
 NOW()),
 
('33333333-3333-3333-3333-333333333333', 'Sharjah Family Clinic', 'sfc.zeal.ae', 'active',
 '{"timezone":"Asia/Dubai","default_language":"en","currencies":["AED"],"features":["pms","rcm","ai","telemedicine"]}'::jsonb,
 NOW());

-- Verify
SELECT id, name, domain, status FROM tenants ORDER BY created_at;
