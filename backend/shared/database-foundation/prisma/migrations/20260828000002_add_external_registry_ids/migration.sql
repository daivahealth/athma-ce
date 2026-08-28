-- Generic national-registry link ids (ADR-0015): which registry they refer to
-- is decided by the tenant's registry.facility / registry.practitioner
-- capability bindings — these are deliberately not ABDM-named columns.
ALTER TABLE "facilities" ADD COLUMN IF NOT EXISTS "external_registry_id" TEXT;
ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "external_registry_id" TEXT;
