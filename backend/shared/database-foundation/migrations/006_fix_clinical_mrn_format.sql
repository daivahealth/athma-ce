-- Migration: Correct clinical MRN format configuration key
-- Replaces legacy `clinical.patient_mrn_format` with `clinical.mrn_format`

DELETE FROM instance_configs
WHERE config_key = 'clinical.patient_mrn_format';

INSERT INTO instance_configs (
    config_key,
    value,
    value_type,
    category,
    description,
    is_overridable,
    is_sensitive,
    created_at,
    updated_at
) VALUES (
    'clinical.mrn_format',
    '"PAT-{YEAR}-{SEQ:6}"',
    'string',
    'clinical',
    'MRN format pattern (e.g., PAT-{YEAR}-{SEQ:6})',
    true,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (config_key) DO UPDATE SET
    value = EXCLUDED.value,
    value_type = EXCLUDED.value_type,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    is_overridable = EXCLUDED.is_overridable,
    is_sensitive = EXCLUDED.is_sensitive,
    updated_at = EXCLUDED.updated_at;

-- Clean up any tenant-level records using the legacy key
DELETE FROM tenant_configs
WHERE config_key = 'clinical.patient_mrn_format';
