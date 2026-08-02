-- Migration: Add patient_identity (pluggable national identity documents)
-- Purpose:
--   Allow a patient to hold several national identity documents (ABHA number +
--   ABHA address, Emirates ID + passport, ...) each with its own verification
--   state. patients.national_id / national_id_type / issuing_country are kept
--   as the denormalised "primary" identity and stay in sync with is_primary.
--
--   PRIVACY: this table must never hold a raw Aadhaar number, an OTP, or an
--   ABDM user token — only the resulting identifiers and masked metadata.
-- Date: 2026-07-27

BEGIN;

CREATE TYPE "IdentityVerificationStatus" AS ENUM (
  'UNVERIFIED',
  'VERIFIED',
  'FAILED',
  'EXPIRED'
);

CREATE TABLE IF NOT EXISTS patient_identity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  country VARCHAR(2) NOT NULL,
  identity_type VARCHAR(50) NOT NULL,
  value VARCHAR(100) NOT NULL,
  secondary_value VARCHAR(100),
  verification_status "IdentityVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
  verification_method VARCHAR(50),
  verified_at TIMESTAMPTZ,
  verified_by UUID,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL,
  CONSTRAINT unique_patient_identity_value UNIQUE (tenant_id, country, identity_type, value),
  CONSTRAINT fk_patient_identity_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_patient_identity_tenant_patient
  ON patient_identity(tenant_id, patient_id);

CREATE INDEX IF NOT EXISTS idx_patient_identity_tenant_value
  ON patient_identity(tenant_id, value);

CREATE INDEX IF NOT EXISTS idx_patient_identity_tenant_type
  ON patient_identity(tenant_id, identity_type);

-- At most one primary identity per patient.
CREATE UNIQUE INDEX IF NOT EXISTS unique_patient_identity_primary
  ON patient_identity(tenant_id, patient_id)
  WHERE is_primary;

COMMIT;
