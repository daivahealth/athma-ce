-- Foundation Seed: Tenants

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'uuid_from_text'
  ) THEN
    CREATE OR REPLACE FUNCTION uuid_from_text(input text) RETURNS uuid AS $fn$
    BEGIN
      RETURN uuid_generate_v5(uuid_from_text('6ba7b811-9dad-11d1-80b4-00c04fd430c8'), input);
    END;
    $fn$ LANGUAGE plpgsql IMMUTABLE;
  END IF;
END;
$$;

TRUNCATE tenants CASCADE;

INSERT INTO tenants (id, name, domain, status, settings, created_at, updated_at)
VALUES
  (uuid_from_text('tenant-demo-0001'), 'Demo Health Group', 'demo.zeal.ae', 'active', '{}'::jsonb, NOW(), NOW());
