-- Add patient name format configuration to instance_configs
-- Created: 2025-11-06
-- This configuration supports different name formatting conventions across geographies
-- Examples:
--   USA/Western: "lastName, firstName middleName" (Last name first)
--   UAE/Middle East: "title firstName middleName lastName" (First name first with title)
--   Asian: Various formats based on region

-- Ensure UUID generation is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure the instance_configs table has proper defaults
ALTER TABLE instance_configs ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE instance_configs ALTER COLUMN updated_at SET DEFAULT NOW();

INSERT INTO instance_configs (config_key, value, value_type, category, description, is_overridable, is_sensitive)
VALUES
('clinical.patient_name_format', '"{title} {firstName} {middleName} {lastName}"', 'string', 'clinical', 'Display name template for patients using placeholders: title, firstName, middleName, lastName. Example formats: "{title} {firstName} {middleName} {lastName}" (UAE), "{lastName}, {firstName} {middleName}" (USA), "{firstName} {lastName}" (Simple)', true, false)
ON CONFLICT (config_key) DO UPDATE SET
    value = EXCLUDED.value,
    value_type = EXCLUDED.value_type,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    is_overridable = EXCLUDED.is_overridable,
    is_sensitive = EXCLUDED.is_sensitive,
    updated_at = NOW();
