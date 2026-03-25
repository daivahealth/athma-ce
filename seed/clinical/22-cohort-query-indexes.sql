-- ============================================================
-- 22-cohort-query-indexes.sql
-- Indexes optimized for clinical cohort queries that join
-- encounter_clinical_codings with clinical_observations.
-- ============================================================

-- Partial index on accepted codings: supports cohort queries that filter
-- by code prefix (e.g., E11%) and return patient_id.
CREATE INDEX IF NOT EXISTS idx_clinical_codings_accepted_code_patient
  ON encounter_clinical_codings (tenant_id, code_system, code, patient_id)
  WHERE status = 'accepted';

-- Covers the ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY observed_at DESC)
-- pattern used in cohort queries to find latest observation per patient per code.
-- Partial index on value_numeric IS NOT NULL avoids scanning string/coded observations.
CREATE INDEX IF NOT EXISTS idx_obs_patient_code_time_desc
  ON clinical_observations (tenant_id, patient_id, code, observed_at DESC)
  WHERE value_numeric IS NOT NULL;
