# Database Migrations

## Initial Setup

```bash
# Create initial migration
npx prisma migrate dev --name init

# This will:
# 1. Create the zeal_prm database
# 2. Apply all schema changes
# 3. Generate Prisma client
```

## Migration Workflow

```bash
# After schema changes
npx prisma migrate dev --name descriptive_name

# Deploy to production
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset
```

## Generated Migration Structure

After running `npx prisma migrate dev --name init`, Prisma will create:

```
prisma/migrations/
└── 20260101000000_init/
    └── migration.sql
```

## Manual Migration (if needed)

If you need to create migrations manually, here's the DDL:

See `ARCHITECTURE.md` for complete schema documentation.

All tables include:
- `tenant_id` for multi-tenancy
- Proper indexes for performance
- Timestamps for audit trails
- UUID primary keys

Critical indexes:
- `(tenant_id, dedupe_key)` - Event deduplication
- `(tenant_id, idempotency_key)` - Job idempotency
- `(tenant_id, status, run_at)` - Job queue polling
- `(tenant_id, patient_id, occurred_at DESC)` - Patient timeline
- `(tenant_id, provider_message_id)` - Provider callback lookup
