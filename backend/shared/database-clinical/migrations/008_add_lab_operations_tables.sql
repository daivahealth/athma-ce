CREATE TABLE IF NOT EXISTS "lab_specimens" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "order_id" UUID NOT NULL REFERENCES "clinical_orders"("id") ON DELETE CASCADE,
  "specimen_type" VARCHAR(100),
  "container_type" VARCHAR(100),
  "collection_site" VARCHAR(100),
  "barcode" VARCHAR(100),
  "collected_at" TIMESTAMPTZ(6),
  "collected_by" UUID,
  "status" VARCHAR(30) NOT NULL DEFAULT 'pending_collection',
  "rejection_reason" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_lab_specimens_order"
  ON "lab_specimens" ("tenant_id", "order_id");
CREATE INDEX IF NOT EXISTS "idx_lab_specimens_status"
  ON "lab_specimens" ("tenant_id", "status");
CREATE INDEX IF NOT EXISTS "idx_lab_specimens_barcode"
  ON "lab_specimens" ("tenant_id", "barcode");

CREATE TABLE IF NOT EXISTS "lab_specimen_tests" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "specimen_id" UUID NOT NULL REFERENCES "lab_specimens"("id") ON DELETE CASCADE,
  "lab_order_test_id" UUID NOT NULL REFERENCES "lab_order_tests"("id") ON DELETE CASCADE,
  "status" VARCHAR(30) NOT NULL DEFAULT 'collected',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT "ux_lab_specimen_tests_specimen_test" UNIQUE ("specimen_id", "lab_order_test_id")
);

CREATE INDEX IF NOT EXISTS "idx_lab_specimen_tests_specimen"
  ON "lab_specimen_tests" ("tenant_id", "specimen_id");
CREATE INDEX IF NOT EXISTS "idx_lab_specimen_tests_order_test"
  ON "lab_specimen_tests" ("tenant_id", "lab_order_test_id");
CREATE INDEX IF NOT EXISTS "idx_lab_specimen_tests_status"
  ON "lab_specimen_tests" ("tenant_id", "status");

CREATE TABLE IF NOT EXISTS "lab_accessions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "specimen_id" UUID NOT NULL REFERENCES "lab_specimens"("id") ON DELETE CASCADE,
  "accession_number" VARCHAR(100) NOT NULL,
  "received_at" TIMESTAMPTZ(6),
  "received_by" UUID,
  "receiving_location" VARCHAR(255),
  "accessioned_at" TIMESTAMPTZ(6),
  "accessioned_by" UUID,
  "status" VARCHAR(30) NOT NULL DEFAULT 'received',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT "ux_lab_accessions_number" UNIQUE ("tenant_id", "accession_number")
);

CREATE INDEX IF NOT EXISTS "idx_lab_accessions_specimen"
  ON "lab_accessions" ("tenant_id", "specimen_id");
CREATE INDEX IF NOT EXISTS "idx_lab_accessions_status"
  ON "lab_accessions" ("tenant_id", "status");

CREATE TABLE IF NOT EXISTS "lab_specimen_events" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "specimen_id" UUID NOT NULL REFERENCES "lab_specimens"("id") ON DELETE CASCADE,
  "event_type" VARCHAR(50) NOT NULL,
  "event_time" TIMESTAMPTZ(6) NOT NULL,
  "performed_by" UUID,
  "notes" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_lab_specimen_events_specimen"
  ON "lab_specimen_events" ("tenant_id", "specimen_id");
CREATE INDEX IF NOT EXISTS "idx_lab_specimen_events_type"
  ON "lab_specimen_events" ("tenant_id", "event_type");
CREATE INDEX IF NOT EXISTS "idx_lab_specimen_events_time"
  ON "lab_specimen_events" ("tenant_id", "event_time");

CREATE TABLE IF NOT EXISTS "lab_processing_runs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "specimen_id" UUID NOT NULL REFERENCES "lab_specimens"("id") ON DELETE CASCADE,
  "lab_order_test_id" UUID NOT NULL REFERENCES "lab_order_tests"("id") ON DELETE CASCADE,
  "run_type" VARCHAR(20) NOT NULL DEFAULT 'manual',
  "instrument_code" VARCHAR(100),
  "instrument_run_id" VARCHAR(100),
  "status" VARCHAR(30) NOT NULL DEFAULT 'processing',
  "raw_payload" JSONB,
  "processed_at" TIMESTAMPTZ(6),
  "processed_by" UUID,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_lab_processing_runs_specimen"
  ON "lab_processing_runs" ("tenant_id", "specimen_id");
CREATE INDEX IF NOT EXISTS "idx_lab_processing_runs_order_test"
  ON "lab_processing_runs" ("tenant_id", "lab_order_test_id");
CREATE INDEX IF NOT EXISTS "idx_lab_processing_runs_status"
  ON "lab_processing_runs" ("tenant_id", "status");
