-- Transactional outbox (ADR-0015 §5, issue #112).
CREATE TABLE IF NOT EXISTS domain_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seq BIGSERIAL UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    event_version INTEGER NOT NULL DEFAULT 1,
    tenant_id UUID NOT NULL,
    facility_id UUID,
    aggregate_type TEXT NOT NULL,
    aggregate_id UUID NOT NULL,
    payload JSONB NOT NULL,
    occurred_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS domain_events_event_type_idx ON domain_events(event_type);
CREATE INDEX IF NOT EXISTS domain_events_aggregate_idx ON domain_events(tenant_id, aggregate_type, aggregate_id);

CREATE TABLE IF NOT EXISTS outbox_cursors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id TEXT UNIQUE NOT NULL,
    position BIGINT NOT NULL DEFAULT 0,
    attempts INTEGER NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMPTZ(6),
    last_error TEXT,
    updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outbox_dead_letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id TEXT NOT NULL,
    event_id UUID NOT NULL,
    seq BIGINT NOT NULL,
    error TEXT NOT NULL,
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS outbox_dead_letters_sub_idx ON outbox_dead_letters(subscriber_id, created_at);
