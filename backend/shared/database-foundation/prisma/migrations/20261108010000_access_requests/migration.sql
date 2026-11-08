-- Production access requests from the public site (instance-wide, not tenant data).
-- See docs/features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md.

CREATE TABLE IF NOT EXISTS "access_requests" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "organisation_name" TEXT NOT NULL,
    "organisation_type" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "facility_count" INTEGER,
    "bed_count" INTEGER,
    "modules" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "admin_notes" TEXT,
    "reviewed_at" TIMESTAMPTZ(6),
    "reviewed_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "access_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "access_requests_status_created_at_idx" ON "access_requests"("status", "created_at");

-- Platform permissions (also in seed/foundation/04-permissions.sql); granted to super_admin only.
INSERT INTO permissions (id, code, name, description, resource, action, created_at, updated_at) VALUES
  ('00000000-0000-0000-0045-000000000001', 'platform.access_request.read', 'View Access Requests', 'List production access requests submitted from the public site', 'platform', 'read', NOW(), NOW()),
  ('00000000-0000-0000-0045-000000000002', 'platform.access_request.manage', 'Manage Access Requests', 'Change the status and notes of access requests', 'platform', 'manage', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT gen_random_uuid(), r.id, p.id, NOW()
FROM roles r
JOIN permissions p ON p.code IN ('platform.access_request.read', 'platform.access_request.manage')
WHERE r.code = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;
