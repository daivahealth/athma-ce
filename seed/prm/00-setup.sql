-- Seed: PRM setup helpers

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Deterministic UUID helper (matches clinical seeds)
CREATE OR REPLACE FUNCTION uuid_from_text(input text)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, input);
$$;
