-- Migration: 009_add_hie_fetch_jobs
-- Adds the hie_fetch_jobs table backing consent-driven external-record fetches
-- from a Health Information Exchange (HIE). Region/network-agnostic; the
-- concrete provider is selected in application config. See ADR-0012.
--
-- NOTE: Do NOT auto-apply against the shared database. Apply during a
-- coordinated clinical-schema migration window.

CREATE TABLE IF NOT EXISTS "hie_fetch_jobs" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id"         UUID NOT NULL,
  "patient_id"        UUID NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "consent_id"        UUID,
  "provider"          VARCHAR(50) NOT NULL,
  "patient_reference" VARCHAR(200),
  "record_types"      JSONB NOT NULL DEFAULT '[]',
  "status"            VARCHAR(20) NOT NULL DEFAULT 'pending',
  "attempts"          INTEGER NOT NULL DEFAULT 0,
  "records_fetched"   INTEGER NOT NULL DEFAULT 0,
  "document_ids"      JSONB NOT NULL DEFAULT '[]',
  "summary"           JSONB,
  "error_code"        VARCHAR(50),
  "error_message"     TEXT,
  "requested_by"      UUID,
  "started_at"        TIMESTAMPTZ(6),
  "completed_at"      TIMESTAMPTZ(6),
  "created_at"        TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at"        TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_hie_fetch_jobs_tenant_patient"
  ON "hie_fetch_jobs" ("tenant_id", "patient_id");
CREATE INDEX IF NOT EXISTS "idx_hie_fetch_jobs_tenant_status"
  ON "hie_fetch_jobs" ("tenant_id", "status");
CREATE INDEX IF NOT EXISTS "idx_hie_fetch_jobs_tenant_consent"
  ON "hie_fetch_jobs" ("tenant_id", "consent_id");
