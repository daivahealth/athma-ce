-- Migration: Add Form Master tables (OpenMedForm integration)
-- Purpose:
--   1. Create form_master — uploaded OpenMedForm form definition bundles, with a
--      frequency spec describing expected administration cadence
--   2. Create form_response — clinician-filled responses against a patient + encounter
-- Date: 2026-07-25

BEGIN;

CREATE TYPE "FormMasterStatus" AS ENUM (
  'ACTIVE',
  'ARCHIVED'
);

CREATE TYPE "FrequencyType" AS ENUM (
  'EVERY_N_HOURS',
  'EVERY_N_DAYS',
  'DAILY',
  'WEEKLY',
  'ONCE_PER_SHIFT',
  'ONCE_PER_ADMISSION',
  'ONCE_PER_EPISODE',
  'ON_DEMAND',
  'EVENT_BASED'
);

CREATE TYPE "FrequencyUnit" AS ENUM (
  'HOUR',
  'DAY',
  'WEEK',
  'MONTH'
);

CREATE TYPE "FormResponseStatus" AS ENUM (
  'DRAFT',
  'FINAL',
  'AMENDED'
);

CREATE TABLE IF NOT EXISTS form_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  facility_id UUID,
  form_code VARCHAR(100) NOT NULL,
  form_version VARCHAR(20) NOT NULL,
  engine VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  language VARCHAR(10),
  status "FormMasterStatus" NOT NULL DEFAULT 'ACTIVE',
  frequency_type "FrequencyType" NOT NULL,
  frequency_value INTEGER,
  frequency_unit "FrequencyUnit",
  bundle JSONB NOT NULL,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_form_master_code_version UNIQUE (tenant_id, form_code, form_version)
);

CREATE TABLE IF NOT EXISTS form_response (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  facility_id UUID,
  form_master_id UUID NOT NULL,
  form_code VARCHAR(100) NOT NULL,
  form_version VARCHAR(20) NOT NULL,
  engine VARCHAR(20) NOT NULL,
  patient_id UUID NOT NULL,
  encounter_id UUID NOT NULL,
  status "FormResponseStatus" NOT NULL DEFAULT 'DRAFT',
  data JSONB NOT NULL,
  completed_by UUID,
  completed_at TIMESTAMPTZ,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_form_response_form_master
    FOREIGN KEY (form_master_id) REFERENCES form_master(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_form_master_tenant_status
  ON form_master(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_form_response_tenant_patient
  ON form_response(tenant_id, patient_id);

CREATE INDEX IF NOT EXISTS idx_form_response_tenant_encounter
  ON form_response(tenant_id, encounter_id);

CREATE INDEX IF NOT EXISTS idx_form_response_tenant_master
  ON form_response(tenant_id, form_master_id);

COMMIT;
