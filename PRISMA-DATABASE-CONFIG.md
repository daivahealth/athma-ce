# 🗄️ Prisma Database Configuration Guide (Domain Split)

The Zeal platform now stores data in **four PostgreSQL databases** that align with the ADR-0013 domain decomposition:

| Domain | Database name | Prisma package |
| --- | --- | --- |
| Foundation | `zeal_foundation` | `backend/shared/database-foundation` |
| Clinical | `zeal_clinical` | `backend/shared/database-clinical` |
| Revenue Cycle | `zeal_rcm` | `backend/shared/database-rcm` |
| Analytics & Audit | `zeal_analytics` | `backend/shared/database-analytics` |

Each Prisma package reads its connection string from a dedicated environment variable. The legacy `DATABASE_URL` is still supported for compatibility but now points at the **Foundation** database only.

---

## 1. Configure Environment Variables

Create or update `backend/.env` (or `backend/config.env.example`) with the four domain URLs:

```env
DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_foundation?schema=public"  # legacy / default
FOUNDATION_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_foundation?schema=public"
CLINICAL_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_clinical?schema=public"
RCM_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_rcm?schema=public"
ANALYTICS_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_analytics?schema=public"
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=zeal_user
POSTGRES_PASSWORD=zeal_password
```

> **Docker tip:** the updated `init-scripts/01-init-database.sql` provisions these four databases automatically when `docker-compose up` starts the Postgres container.

---

## 2. Prisma Schemas by Domain

Each package has its own `schema.prisma` referencing the appropriate environment variable:

```prisma
// backend/shared/database-foundation/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("FOUNDATION_DATABASE_URL")
  extensions = [uuid_ossp(map: "uuid-ossp"), pg_trgm, unaccent]
}
```

The other packages (`database-clinical`, `database-rcm`, `database-analytics`) follow the same pattern but read `CLINICAL_DATABASE_URL`, `RCM_DATABASE_URL`, and `ANALYTICS_DATABASE_URL` respectively.

---

## 3. Generate Prisma Clients

Run Prisma commands in each package when the schema changes:

```bash
# Foundation
cd backend
npm run build --workspace @zeal/database-foundation

# Clinical
npm run build --workspace @zeal/database-clinical

# Revenue Cycle
npm run build --workspace @zeal/database-rcm

# Analytics & Audit
npm run build --workspace @zeal/database-analytics
```

> The workspace build script executes `prisma generate --schema prisma/schema.prisma` followed by TypeScript compilation. If you only need to regenerate Prisma without compiling TypeScript, run `npx prisma generate --schema prisma/schema.prisma` inside the package directory.

---

## 4. Service Environment Files

Each NestJS service consumes the database that matches its domain. Example `.env.local` snippets:

- `backend/services/foundation/.env.local`
  ```env
  FOUNDATION_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_foundation?schema=public"
  ```

- `backend/services/clinical/.env.local`
  ```env
  CLINICAL_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_clinical?schema=public"
  ```

- `backend/services/rcm/.env.local`
  ```env
  RCM_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_rcm?schema=public"
  ```

- `backend/services/auth/.env.local`
  ```env
  FOUNDATION_DATABASE_URL="postgresql://zeal_user:zeal_password@localhost:5432/zeal_foundation?schema=public"
  ```

Update deployment manifests (Helm, K8s, ECS, etc.) to pass the same variables to each container. The `legacy` `DATABASE_URL` should only be referenced by code that has not yet been migrated.

---

## 5. Quick Connection Test

Use the updated `test-connection.js` to validate connectivity to all four databases:

```bash
node test-connection.js
```

Successful output lists the host, database, and PostgreSQL version for each domain database.

---

## 6. Common Troubleshooting

1. **`Missing environment variable`** – ensure each Prisma package has its corresponding `*_DATABASE_URL` defined.
2. **`permission denied for schema public`** – rerun `docker-compose down -v && docker-compose up` so the bootstrap script can reapply grants, or manually `GRANT ALL PRIVILEGES ON DATABASE ... TO zeal_user;`.
3. **`duplicate key value violates unique constraint (audit log)`** – audit triggers now live in `zeal_analytics`. Confirm you are writing audit data to the analytics database, not the domain OLTP stores.

For additional questions, see `docs/10-Deployment-&-Ops.md` for environment-specific overrides.
