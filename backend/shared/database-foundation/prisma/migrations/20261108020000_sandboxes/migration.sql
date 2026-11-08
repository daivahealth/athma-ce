-- Self-serve sandbox tenants on the public demo. See docs/ADR/ADR-0017-sandbox-tenants.md.

CREATE TABLE IF NOT EXISTS "sandboxes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "owner_provider" TEXT NOT NULL,
    "owner_subject" TEXT NOT NULL,
    "owner_email" TEXT,
    "owner_name" TEXT,
    "organisation_name" TEXT NOT NULL,
    "organisation_type" TEXT NOT NULL,
    "modules" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'provisioning',
    "error" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activated_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6),
    "extended_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "last_switch_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sandboxes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "sandboxes_tenant_id_key" ON "sandboxes"("tenant_id");
CREATE INDEX IF NOT EXISTS "sandboxes_owner_provider_owner_subject_idx" ON "sandboxes"("owner_provider", "owner_subject");
CREATE INDEX IF NOT EXISTS "sandboxes_status_expires_at_idx" ON "sandboxes"("status", "expires_at");
-- One live sandbox per external identity (not in schema.prisma: Prisma has no partial unique indexes).
CREATE UNIQUE INDEX IF NOT EXISTS "sandboxes_one_live_per_owner"
    ON "sandboxes"("owner_provider", "owner_subject") WHERE "status" IN ('provisioning', 'active');

-- Platform permissions (also in seed/foundation/04-permissions.sql); granted to super_admin only.
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0045-000000000003', 'platform.sandbox.read', 'View Sandboxes', 'List sandbox tenants on the public demo', 'platform', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0045-000000000004', 'platform.sandbox.manage', 'Manage Sandboxes', 'Delete or extend sandbox tenants', 'platform', 'manage', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT gen_random_uuid(), r.id, p.id, NOW()
FROM roles r
JOIN permissions p ON p.code IN ('platform.sandbox.read', 'platform.sandbox.manage')
WHERE r.code = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;
