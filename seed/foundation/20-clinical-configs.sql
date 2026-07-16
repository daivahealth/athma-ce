-- ============================================
-- CLINICAL WORKFLOW CONFIGURATION SEEDS
-- ============================================
-- Instance-level defaults for clinical workflow behavior.
-- Overridable at tenant and facility level via the
-- Configurations page.

INSERT INTO instance_configs (id, config_key, value, value_type, category, description, is_overridable, is_sensitive, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'care_context.min_encounters', '5', 'number', 'clinical', 'Minimum number of encounters a patient must have before the Care Context workspace entry point appears on their record', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (config_key) DO NOTHING;
