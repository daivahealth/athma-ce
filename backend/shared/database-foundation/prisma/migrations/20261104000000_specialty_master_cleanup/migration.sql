-- Specialty master cleanup: drop the legacy staff.specialties JSON column and add CRIT_CARE.
-- Staff specialties live in staff_specialties (per tenant + facility, FK to specialties).
-- The JSON column has no facility, so it cannot be backfilled automatically; any
-- non-empty values are copied to a backup table first so nothing is lost.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema() AND table_name = 'staff' AND column_name = 'specialties'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM "staff"
      WHERE "specialties" IS NOT NULL AND "specialties" <> '[]'::jsonb
    ) THEN
      CREATE TABLE IF NOT EXISTS "staff_specialties_legacy_json" AS
        SELECT "id" AS "staff_id", "tenant_id", "specialties", NOW() AS "archived_at"
        FROM "staff"
        WHERE "specialties" IS NOT NULL AND "specialties" <> '[]'::jsonb;
      RAISE NOTICE 'Archived non-empty staff.specialties to staff_specialties_legacy_json; map them into staff_specialties manually.';
    END IF;

    ALTER TABLE "staff" DROP COLUMN "specialties";
  END IF;
END $$;

-- Add Critical Care Medicine to the specialty master (referenced by ICU vitals
-- templates). Same deterministic id as seed/foundation/02-specialties.sql.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
INSERT INTO "specialties" ("id", "code", "name", "description", "is_active", "sort_order", "created_at", "updated_at")
VALUES (uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'specialty:CRIT_CARE'), 'CRIT_CARE', 'Critical Care Medicine', NULL, TRUE, 26, NOW(), NOW())
ON CONFLICT ("code") DO NOTHING;

INSERT INTO "specialty_translations" ("id", "specialty_id", "lang", "display_name", "description", "created_at", "updated_at")
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'tr:CRIT_CARE:ar'), "id", 'ar', 'طب العناية المركزة', NULL, NOW(), NOW()
FROM "specialties" WHERE "code" = 'CRIT_CARE'
ON CONFLICT DO NOTHING;
