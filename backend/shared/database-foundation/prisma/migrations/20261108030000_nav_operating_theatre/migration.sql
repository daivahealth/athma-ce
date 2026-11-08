-- Navigation switch for the Operating Theatre section (sidebar), on by default
-- for every tenant. Sandboxes without the operating_theatre module turn it off
-- per tenant. See docs/features/SANDBOX-TENANTS.md (Modules).
INSERT INTO instance_configs (id, config_key, value, value_type, category, description, is_overridable, is_sensitive, created_at, updated_at)
VALUES (gen_random_uuid(), 'feature.nav.operatingTheatre', 'true', 'boolean', 'feature', 'Enable feature.nav.operatingTheatre navigation section', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (config_key) DO NOTHING;
