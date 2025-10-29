-- Add missing patient registration default configurations
-- Created: 2025-10-29

INSERT INTO instance_configs (id, config_key, value, value_type, category, description, is_overridable, is_sensitive, updated_at)
VALUES
(gen_random_uuid(), 'clinical.default_country_name', '"United Arab Emirates"', 'string', 'clinical', 'Default country name for patient registration', true, false, NOW()),
(gen_random_uuid(), 'clinical.default_country_iso', '"AE"', 'string', 'clinical', 'Default country ISO 3166-1 alpha-2 code', true, false, NOW()),
(gen_random_uuid(), 'clinical.default_city', '"Dubai"', 'string', 'clinical', 'Default city for patient registration', true, false, NOW()),
(gen_random_uuid(), 'clinical.default_nationality_name', '"United Arab Emirates"', 'string', 'clinical', 'Default nationality display name', true, false, NOW()),
(gen_random_uuid(), 'clinical.default_nationality_iso', '"AE"', 'string', 'clinical', 'Default nationality ISO code', true, false, NOW())
ON CONFLICT (config_key) DO UPDATE SET
    value = EXCLUDED.value,
    value_type = EXCLUDED.value_type,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    is_overridable = EXCLUDED.is_overridable,
    is_sensitive = EXCLUDED.is_sensitive,
    updated_at = NOW();
