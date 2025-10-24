DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'uuid_from_text'
      AND proargtypes = 'text'::regtype::oidvector
  ) THEN
    EXECUTE $$CREATE OR REPLACE FUNCTION uuid_from_text(input text)
    RETURNS uuid
    LANGUAGE sql
    IMMUTABLE
    AS $fn$ SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, input); $fn$;$$;
  END IF;
END;
$$;
