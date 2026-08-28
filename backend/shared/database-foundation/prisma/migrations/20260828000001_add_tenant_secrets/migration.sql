-- Per-tenant encrypted secret storage (ADR-0015 §5, issue #81).

CREATE TABLE "tenant_secrets" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "facility_id" UUID,
    "owner_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "ciphertext" TEXT NOT NULL,
    "key_version" INTEGER NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "rotated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tenant_secrets_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "tenant_secrets_tenant_id_owner_id_idx" ON "tenant_secrets"("tenant_id", "owner_id");

-- Uniqueness must hold for both facility-scoped and tenant-scoped secrets;
-- a plain unique index over a nullable facility_id would allow duplicates.
CREATE UNIQUE INDEX "tenant_secrets_unique_with_facility"
    ON "tenant_secrets"("tenant_id", "facility_id", "owner_id", "key")
    WHERE "facility_id" IS NOT NULL;
CREATE UNIQUE INDEX "tenant_secrets_unique_without_facility"
    ON "tenant_secrets"("tenant_id", "owner_id", "key")
    WHERE "facility_id" IS NULL;

CREATE TABLE "secret_access_logs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "facility_id" UUID,
    "owner_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secret_access_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "secret_access_logs_tenant_id_key_idx" ON "secret_access_logs"("tenant_id", "key");
CREATE INDEX "secret_access_logs_created_at_idx" ON "secret_access_logs"("created_at");
