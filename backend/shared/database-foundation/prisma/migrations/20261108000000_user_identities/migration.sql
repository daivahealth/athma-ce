-- External sign-in identities (Google, Microsoft, GitHub) and one-time login tickets.
-- See docs/ADR/ADR-0016-external-identity-providers.md.

CREATE TABLE IF NOT EXISTS "user_identities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_subject" TEXT NOT NULL,
    "email" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "display_name" TEXT,
    "terms_version" TEXT,
    "terms_accepted_at" TIMESTAMPTZ(6),
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_identities_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "user_identities_tenant_id_provider_provider_subject_key"
    ON "user_identities"("tenant_id", "provider", "provider_subject");
CREATE INDEX IF NOT EXISTS "user_identities_user_id_idx" ON "user_identities"("user_id");

CREATE TABLE IF NOT EXISTS "oauth_login_tickets" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "ticket_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "consumed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_login_tickets_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "oauth_login_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "oauth_login_tickets_ticket_hash_key" ON "oauth_login_tickets"("ticket_hash");
CREATE INDEX IF NOT EXISTS "oauth_login_tickets_expires_at_idx" ON "oauth_login_tickets"("expires_at");
