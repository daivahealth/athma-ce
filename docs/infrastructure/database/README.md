# Database Documentation

This folder contains database configuration, setup, and administration guides for the athma-ce platform.

## 📚 Documents

### Database Configuration

1. **[PRISMA-DATABASE-CONFIG.md](./PRISMA-DATABASE-CONFIG.md)**
   - Four-database domain architecture setup
   - Environment variable configuration
   - Prisma client generation
   - Database connection pooling
   - Multi-database migration strategy

### Database Administration

2. **[PGADMIN-CONNECTION-GUIDE.md](./PGADMIN-CONNECTION-GUIDE.md)**
   - PgAdmin 4 setup and configuration
   - Connecting to PostgreSQL databases
   - Server connection parameters
   - Database browsing and management

3. **[PGADMIN-TROUBLESHOOTING.md](./PGADMIN-TROUBLESHOOTING.md)**
   - Common connection issues
   - Authentication problems
   - Network and firewall issues
   - Performance troubleshooting

### Migration & Schema Management

4. **[MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)**
   - Database migration workflow
   - Creating and applying migrations
   - Rollback procedures
   - Schema versioning

## 🗄️ Database Architecture

### Four-Database Domain Model

The athma-ce platform uses **four PostgreSQL databases** aligned with domain boundaries (ADR-0013):

```
┌─────────────────────────────────────────────────────────┐
│ 1. zeal_foundation                                      │
│    - Tenancy and identity                               │
│    - RBAC and permissions                               │
│    - Organizational hierarchy (facilities, departments)  │
│    - Staff and user management                          │
│    - Master catalogs and reference data                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 2. zeal_clinical                                        │
│    - Patient PHI (Protected Health Information)         │
│    - Appointments and scheduling                        │
│    - Encounters and visits                              │
│    - Electronic Health Records (EHR)                    │
│    - Clinical notes, vitals, care plans                 │
│    - Patient consents and documents                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 3. zeal_rcm                                             │
│    - Revenue Cycle Management                           │
│    - Billing and invoicing                              │
│    - Pharmacy and prescriptions                         │
│    - Claims management                                  │
│    - Payer contracts                                    │
│    - Financial data                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 4. zeal_analytics                                       │
│    - Audit logs (append-only)                           │
│    - Usage metrics                                      │
│    - Reporting aggregates                               │
│    - Business intelligence data                         │
└─────────────────────────────────────────────────────────┘
```

### Critical Rules

- ❌ **NO direct SQL joins across databases**
- ✅ Cross-domain communication via REST APIs or events
- ✅ Foundation database is the source of truth for master data
- ✅ All services reference Foundation via IDs/events

## 🚀 Quick Start

### 1. Local Database Setup

#### Using Docker Compose

```bash
# Start PostgreSQL with all four databases
docker-compose up -d postgres

# Verify databases are running
docker-compose ps
```

#### Manual Setup

```bash
# Create databases
createdb zeal_foundation
createdb zeal_clinical
createdb zeal_rcm
createdb zeal_analytics

# Create user with privileges
psql -c "CREATE USER zeal_user WITH PASSWORD 'zeal_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE zeal_foundation TO zeal_user;"
psql -c "GRANT ALL PRIVILEGES ON DATABASE zeal_clinical TO zeal_user;"
psql -c "GRANT ALL PRIVILEGES ON DATABASE zeal_rcm TO zeal_user;"
psql -c "GRANT ALL PRIVILEGES ON DATABASE zeal_analytics TO zeal_user;"
```

### 2. Configure Environment Variables

Create `backend/.env`:

```env
# Foundation Database
FOUNDATION_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_foundation?schema=public"

# Clinical Database
CLINICAL_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_clinical?schema=public"

# RCM Database
RCM_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_rcm?schema=public"

# Analytics Database
ANALYTICS_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_analytics?schema=public"

# Legacy support (points to foundation)
DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_foundation?schema=public"
```

### 3. Generate Prisma Clients

```bash
# Generate all Prisma clients
npm run db:generate

# Or generate individually
npx prisma generate --schema backend/shared/database-foundation/prisma/schema.prisma
npx prisma generate --schema backend/shared/database-clinical/prisma/schema.prisma
npx prisma generate --schema backend/shared/database-rcm/prisma/schema.prisma
npx prisma generate --schema backend/shared/database-analytics/prisma/schema.prisma
```

### 4. Run Migrations

```bash
# Run migrations for all databases
npm run db:migrate

# Or migrate individually
npx prisma migrate dev --schema backend/shared/database-foundation/prisma/schema.prisma
npx prisma migrate dev --schema backend/shared/database-clinical/prisma/schema.prisma
npx prisma migrate dev --schema backend/shared/database-rcm/prisma/schema.prisma
npx prisma migrate dev --schema backend/shared/database-analytics/prisma/schema.prisma
```

### 5. Seed Databases

```bash
# Seed all databases with test data
npm run db:seed
```

## 🔧 Database Tools

### Prisma Studio

Visual database browser:

```bash
# Open for foundation database
npx prisma studio --schema backend/shared/database-foundation/prisma/schema.prisma

# Open for clinical database
npx prisma studio --schema backend/shared/database-clinical/prisma/schema.prisma
```

### PgAdmin

See [PGADMIN-CONNECTION-GUIDE.md](./PGADMIN-CONNECTION-GUIDE.md) for setup instructions.

### Command Line

```bash
# Connect to database
psql -U zeal_user -d zeal_foundation

# List all databases
psql -U zeal_user -l

# Dump database
pg_dump -U zeal_user zeal_foundation > foundation_backup.sql

# Restore database
psql -U zeal_user zeal_foundation < foundation_backup.sql
```

## 📊 Database Schema Management

### Prisma Package Structure

```
backend/shared/
├── database-foundation/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── index.ts
│       └── prisma.service.ts
├── database-clinical/
│   └── [same structure]
├── database-rcm/
│   └── [same structure]
└── database-analytics/
    └── [same structure]
```

### Creating Migrations

```bash
# Create migration for foundation
npx prisma migrate dev --name add_new_field \
  --schema backend/shared/database-foundation/prisma/schema.prisma

# Apply to production
npx prisma migrate deploy \
  --schema backend/shared/database-foundation/prisma/schema.prisma
```

## 🔒 Security & Compliance

### Row-Level Security (RLS)

See [Multi-Tenancy Documentation](../../multitenancy/POSTGRESQL-RLS-SETUP.md) for tenant isolation setup.

### Encryption

- **At Rest**: PostgreSQL encryption using LUKS/dm-crypt
- **In Transit**: TLS 1.3 connections required
- **Column-Level**: PII/PHI encrypted using pgcrypto

### Backup & Recovery

```bash
# Automated backups (configured in infrastructure)
# - Daily full backups
# - Hourly incremental backups
# - 30-day retention
# - Cross-region replication

# Manual backup
pg_dump -Fc -U zeal_user zeal_clinical > clinical_backup.dump

# Restore
pg_restore -U zeal_user -d zeal_clinical clinical_backup.dump
```

## 📈 Performance Optimization

### Indexing Strategy

- All foreign keys indexed
- Composite indexes for common queries
- Tenant ID included in all tenant-isolated table indexes
- Covering indexes for frequently queried columns

### Connection Pooling

```typescript
// Prisma connection pool configuration
datasource db {
  provider = "postgresql"
  url      = env("FOUNDATION_DATABASE_URL")

  // Connection pool settings
  pool_size = 20
  connection_limit = 100
  pool_timeout = 30
}
```

### Query Optimization

- Use `select` to limit returned fields
- Leverage `include` for efficient joins
- Use `cursor` pagination for large datasets
- Implement caching for read-heavy operations

## 🐛 Troubleshooting

### Common Issues

See [PGADMIN-TROUBLESHOOTING.md](./PGADMIN-TROUBLESHOOTING.md) for detailed troubleshooting guide.

#### Connection Refused

```bash
# Check PostgreSQL is running
pg_isready

# Check port is open
nc -zv localhost 5432

# Verify pg_hba.conf allows connections
cat /var/lib/postgresql/data/pg_hba.conf
```

#### Migration Failures

```bash
# Check migration status
npx prisma migrate status

# Reset database (development only!)
npx prisma migrate reset

# Resolve migration conflicts
npx prisma migrate resolve
```

## 📖 Related Documentation

- [Multi-Tenancy](../../multitenancy/) - Tenant isolation and RLS
- [Architecture](../../architecture/05-Data-Model.md) - Complete data model
- [Security](../../security/) - Security and compliance
- [Development](../../development/) - Development setup

## 🔗 Quick Links

- [Main README](../../README.md)
- [Prisma Configuration](./PRISMA-DATABASE-CONFIG.md)
- [PgAdmin Guide](./PGADMIN-CONNECTION-GUIDE.md)
- [Migration Guide](./MIGRATION-GUIDE.md)
- [RLS Setup](../../multitenancy/POSTGRESQL-RLS-SETUP.md)

---

*For detailed database administration, see the individual guides in this folder.*
