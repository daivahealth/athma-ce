-- Migration: Add notifications table (notification center / event stream)
-- Service: @zeal/prm (database: zeal_prm)
-- Created: 2026-07-15
--
-- NOTE: This DDL is intentionally NOT applied automatically. Apply it either by
-- running `prisma migrate` from backend/shared/database-prm once the schema is
-- promoted, or by executing this file directly against the zeal_prm database:
--   docker exec -i zeal-postgres psql -U zeal_user -d zeal_prm < 001_add_notifications.sql
-- The Prisma client must be regenerated (`npm run prisma:generate` in
-- backend/shared/database-prm) so the `notification` model is available.

CREATE TABLE IF NOT EXISTS notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID NOT NULL,

    -- Recipient targeting: user_id NULL => broadcast to whole tenant,
    -- optionally narrowed by an audience role.
    user_id     UUID,
    audience    VARCHAR(50),

    -- Classification
    type        VARCHAR(100) NOT NULL,
    severity    VARCHAR(20) NOT NULL DEFAULT 'info', -- info | action | warning | error

    -- Content
    title       TEXT NOT NULL,
    body        TEXT,

    -- Originating entity reference, e.g. 'claim:abc' | 'encounter:123'
    entity_ref  TEXT,

    -- State
    read        BOOLEAN NOT NULL DEFAULT false,
    read_at     TIMESTAMPTZ(6),

    -- Audit
    created_at  TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

-- Unread badge / recipient inbox lookup
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread
    ON notifications (tenant_id, user_id, read, created_at DESC);

-- Tenant-wide recent feed
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_time
    ON notifications (tenant_id, created_at DESC);
