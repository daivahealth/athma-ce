-- Ensure a safe, idempotent UUID helper that either casts valid UUIDs or
-- deterministically generates a v5 UUID from input text using a fixed namespace.
DROP FUNCTION IF EXISTS uuid_from_text(text);

CREATE OR REPLACE FUNCTION uuid_from_text(input text) RETURNS uuid AS $fn$
DECLARE
  parsed uuid;
BEGIN
  BEGIN
    parsed := input::uuid; -- cast when input is already a UUID
    RETURN parsed;
  EXCEPTION WHEN invalid_text_representation THEN
    -- otherwise, generate a deterministic v5 UUID using the DNS namespace
    RETURN uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, input);
  END;
END;
$fn$ LANGUAGE plpgsql IMMUTABLE;

TRUNCATE tenants CASCADE;

INSERT INTO tenants (id, name, domain, status, settings, created_at, updated_at)
VALUES
  (uuid_from_text('tenant-demo-0001'), 'Demo Health Group', 'demo.zeal.ae', 'active', '{}'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Add demo clinic tenant referenced by user fixtures
INSERT INTO tenants (id, name, domain, status, settings, created_at, updated_at)
VALUES
  (uuid_from_text('tenant-demo-clinic-uuid'), 'Demo Medical Clinic Tenant', 'clinic.demo.zeal.ae', 'active', '{}'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
