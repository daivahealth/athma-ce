-- ============================================
-- INSTANCE CONFIGS SEED
-- ============================================
-- Instance-level configurations that apply globally across all tenants

INSERT INTO instance_configs (id, config_key, value, value_type, category, description, is_overridable, is_sensitive, created_at, updated_at)
VALUES
  -- LOCALIZATION CONFIGS
  (gen_random_uuid(), 'locale.default_language', '"en"', 'string', 'localization', 'Default language for the platform (ISO 639-1 code)', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'locale.supported_languages', '["en", "ar"]', 'json', 'localization', 'List of supported languages', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'locale.timezone', '"UTC"', 'string', 'localization', 'Default timezone (IANA timezone identifier)', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'locale.date_format', '"DD/MM/YYYY"', 'string', 'localization', 'Default date display format', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'locale.time_format', '"24h"', 'string', 'localization', 'Time format: 12h or 24h', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'locale.first_day_of_week', '1', 'number', 'localization', 'First day of week: 0=Sunday, 1=Monday', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'locale.number_format', '"en-US"', 'string', 'localization', 'Number formatting locale', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- FINANCE CONFIGS
  (gen_random_uuid(), 'finance.currency', '"USD"', 'string', 'finance', 'Default currency (ISO 4217 code)', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'finance.decimal_places', '2', 'number', 'finance', 'Number of decimal places for currency display', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'finance.tax_rate', '0', 'number', 'finance', 'Default tax rate (percentage)', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'finance.payment_terms_days', '30', 'number', 'finance', 'Default payment terms (days)', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'finance.invoice_prefix', '"INV"', 'string', 'finance', 'Invoice number prefix', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'finance.invoice_start_number', '1000', 'number', 'finance', 'Starting invoice number', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- CLINICAL CONFIGS
  (gen_random_uuid(), 'clinical.appointment_duration', '30', 'number', 'clinical', 'Default appointment duration in minutes', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'clinical.working_hours_start', '"08:00"', 'string', 'clinical', 'Default working hours start time (HH:MM)', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'clinical.working_hours_end', '"18:00"', 'string', 'clinical', 'Default working hours end time (HH:MM)', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'clinical.working_days', '[1, 2, 3, 4, 5]', 'json', 'clinical', 'Working days of the week (0=Sun, 1=Mon, ...)', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'clinical.patient_mrn_prefix', '"MRN"', 'string', 'clinical', 'Patient Medical Record Number prefix', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'clinical.mrn_format', '"{PREFIX}{YEAR}{SEQUENCE:6}"', 'string', 'clinical', 'MRN format pattern', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'clinical.enable_telemedicine', 'false', 'boolean', 'clinical', 'Enable telemedicine/video consultations', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'clinical.max_appointments_per_day', '20', 'number', 'clinical', 'Maximum appointments per provider per day', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'clinical.consultation_types', '["in-person", "video", "phone"]', 'json', 'clinical', 'Available consultation types', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'clinical.encounter_number_format', '"ENC-{YEAR}-{SEQ:6}"', 'string', 'clinical', 'Encounter number format pattern (e.g., ENC-{YEAR}-{SEQ:6})', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- SYSTEM CONFIGS
  (gen_random_uuid(), 'system.session_timeout', '60', 'number', 'system', 'User session timeout in minutes', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'system.max_file_upload_size', '10', 'number', 'system', 'Maximum file upload size in MB', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'system.allowed_file_types', '[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]', 'json', 'system', 'Allowed file upload types', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'system.data_retention_days', '2555', 'number', 'system', 'Data retention period in days (~7 years)', false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'system.enable_audit_logs', 'true', 'boolean', 'system', 'Enable comprehensive audit logging', false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'system.enable_mfa', 'false', 'boolean', 'system', 'Require multi-factor authentication', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'system.password_min_length', '8', 'number', 'system', 'Minimum password length', false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'system.password_require_special_char', 'true', 'boolean', 'system', 'Require special characters in passwords', false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (config_key) DO NOTHING;
