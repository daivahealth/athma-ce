-- Seed default instance configurations
-- Created: 2025-10-25

-- LOCALIZATION CONFIGS
INSERT INTO instance_configs (config_key, value, value_type, category, description, is_overridable, is_sensitive)
VALUES
('locale.default_language', '"en"', 'string', 'localization', 'Default language for the platform (ISO 639-1 code)', true, false),
('locale.supported_languages', '["en", "ar"]', 'json', 'localization', 'List of supported languages', true, false),
('locale.timezone', '"UTC"', 'string', 'localization', 'Default timezone (IANA timezone identifier)', true, false),
('locale.date_format', '"DD/MM/YYYY"', 'string', 'localization', 'Default date display format', true, false),
('locale.time_format', '"24h"', 'string', 'localization', 'Time format: 12h or 24h', true, false),
('locale.first_day_of_week', '1', 'number', 'localization', 'First day of week: 0=Sunday, 1=Monday', true, false),
('locale.number_format', '"en-US"', 'string', 'localization', 'Number formatting locale', true, false)
ON CONFLICT (config_key) DO UPDATE SET
    value = EXCLUDED.value,
    value_type = EXCLUDED.value_type,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    is_overridable = EXCLUDED.is_overridable,
    is_sensitive = EXCLUDED.is_sensitive,
    updated_at = NOW();

-- FINANCE CONFIGS
INSERT INTO instance_configs (config_key, value, value_type, category, description, is_overridable, is_sensitive)
VALUES
('finance.currency', '"AED"', 'string', 'finance', 'Default currency (ISO 4217 code)', true, false),
('finance.decimal_places', '2', 'number', 'finance', 'Number of decimal places for currency display', true, false),
('finance.tax_rate', '0', 'number', 'finance', 'Default tax rate (percentage)', true, false),
('finance.payment_terms_days', '30', 'number', 'finance', 'Default payment terms (days)', true, false),
('finance.invoice_prefix', '"INV"', 'string', 'finance', 'Invoice number prefix', true, false),
('finance.invoice_start_number', '1000', 'number', 'finance', 'Starting invoice number', true, false)
ON CONFLICT (config_key) DO UPDATE SET
    value = EXCLUDED.value,
    value_type = EXCLUDED.value_type,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    is_overridable = EXCLUDED.is_overridable,
    is_sensitive = EXCLUDED.is_sensitive,
    updated_at = NOW();

-- CLINICAL CONFIGS
INSERT INTO instance_configs (config_key, value, value_type, category, description, is_overridable, is_sensitive)
VALUES
('clinical.appointment_duration', '30', 'number', 'clinical', 'Default appointment duration in minutes', true, false),
('clinical.working_hours_start', '"08:00"', 'string', 'clinical', 'Default working hours start time (HH:MM)', true, false),
('clinical.working_hours_end', '"18:00"', 'string', 'clinical', 'Default working hours end time (HH:MM)', true, false),
('clinical.working_days', '[1, 2, 3, 4, 5]', 'json', 'clinical', 'Working days of the week (0=Sun, 1=Mon, ...)', true, false),
('clinical.mrn_format', '"PAT-{YEAR}-{SEQ:6}"', 'string', 'clinical', 'MRN format pattern (e.g., PAT-{YEAR}-{SEQ:6})', true, false),
('clinical.encounter_number_format', '"ENC-{YEAR}-{SEQ:6}"', 'string', 'clinical', 'Encounter number format pattern (e.g., ENC-{YEAR}-{SEQ:6})', true, false),
('clinical.enable_telemedicine', 'false', 'boolean', 'clinical', 'Enable telemedicine/video consultations', true, false),
('clinical.max_appointments_per_day', '20', 'number', 'clinical', 'Maximum appointments per provider per day', true, false),
('clinical.consultation_types', '["in-person", "video", "phone"]', 'json', 'clinical', 'Available consultation types', true, false),
('clinical.staff_name_format', '"{prefix} {firstName} {lastName}"', 'string', 'clinical', 'Display name template for staff using placeholders prefix, firstName, middleName, lastName', true, false),
('clinical.default_country_name', '"United Arab Emirates"', 'string', 'clinical', 'Default country name for patient registration', true, false),
('clinical.default_country_iso', '"AE"', 'string', 'clinical', 'Default country ISO 3166-1 alpha-2 code', true, false),
('clinical.default_city', '"Dubai"', 'string', 'clinical', 'Default city for patient registration', true, false),
('clinical.default_nationality_name', '"United Arab Emirates"', 'string', 'clinical', 'Default nationality display name', true, false),
('clinical.default_nationality_iso', '"AE"', 'string', 'clinical', 'Default nationality ISO code', true, false)
ON CONFLICT (config_key) DO UPDATE SET
    value = EXCLUDED.value,
    value_type = EXCLUDED.value_type,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    is_overridable = EXCLUDED.is_overridable,
    is_sensitive = EXCLUDED.is_sensitive,
    updated_at = NOW();

-- SYSTEM CONFIGS
INSERT INTO instance_configs (config_key, value, value_type, category, description, is_overridable, is_sensitive)
VALUES
('system.session_timeout', '60', 'number', 'system', 'User session timeout in minutes', true, false),
('system.max_file_upload_size', '10', 'number', 'system', 'Maximum file upload size in MB', true, false),
('system.allowed_file_types', '[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]', 'json', 'system', 'Allowed file upload types', true, false),
('system.data_retention_days', '2555', 'number', 'system', 'Data retention period in days (~7 years)', false, false),
('system.enable_audit_logs', 'true', 'boolean', 'system', 'Enable comprehensive audit logging', false, false),
('system.enable_mfa', 'false', 'boolean', 'system', 'Require multi-factor authentication', true, false),
('system.password_min_length', '8', 'number', 'system', 'Minimum password length', false, false),
('system.password_require_special_char', 'true', 'boolean', 'system', 'Require special characters in passwords', false, false)
ON CONFLICT (config_key) DO UPDATE SET
    value = EXCLUDED.value,
    value_type = EXCLUDED.value_type,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    is_overridable = EXCLUDED.is_overridable,
    is_sensitive = EXCLUDED.is_sensitive,
    updated_at = NOW();
