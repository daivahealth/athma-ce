-- Migration: Add RCM denials and appeals tables
-- Purpose:
--   1. Create denials as records of payer claim denials (CARC/RARC codes, amounts, deadlines)
--   2. Create appeals as the appeal workflow against a denial (draft -> filed -> accepted/rejected)
-- Affected service/module: backend/services/rcm (modules/denials)
-- Prisma models: Denial, Appeal (backend/shared/database-rcm/prisma/schema.prisma)
-- Date: 2026-07-15

BEGIN;

CREATE TABLE IF NOT EXISTS denials (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID NOT NULL,
  claim_id        UUID NOT NULL,
  denial_code     VARCHAR(30) NOT NULL,
  denial_reason   TEXT NOT NULL,
  remark_codes    JSONB,
  denied_amount   DECIMAL(12, 2) NOT NULL,
  currency        VARCHAR(10) NOT NULL DEFAULT 'AED',
  status          VARCHAR(30) NOT NULL DEFAULT 'open',
  denied_at       TIMESTAMPTZ NOT NULL,
  appeal_deadline DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID,
  CONSTRAINT fk_denials_claim
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_denial_claim  ON denials (tenant_id, claim_id);
CREATE INDEX IF NOT EXISTS idx_denial_status ON denials (tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_denial_code   ON denials (denial_code);

CREATE TABLE IF NOT EXISTS appeals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID NOT NULL,
  denial_id       UUID NOT NULL,
  status          VARCHAR(30) NOT NULL DEFAULT 'draft',
  narrative       TEXT NOT NULL,
  justification   TEXT,
  supporting_refs JSONB NOT NULL DEFAULT '[]',
  filed_at        TIMESTAMPTZ,
  outcome         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID,
  CONSTRAINT fk_appeals_denial
    FOREIGN KEY (denial_id) REFERENCES denials(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_appeal_denial ON appeals (tenant_id, denial_id);
CREATE INDEX IF NOT EXISTS idx_appeal_status ON appeals (tenant_id, status);

COMMIT;
