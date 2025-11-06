# Complete Seed Checklist

Use this checklist after running Prisma migrations to load baseline data.

1. **Start Postgres:** `docker-compose up -d postgres`
2. **Create schemas:**
   ```bash
   npm run build --workspace @zeal/database-foundation
   cd backend/shared/database-foundation && npx prisma db push --schema prisma/schema.prisma && cd ../../..
   npm run build --workspace @zeal/database-clinical
   cd backend/shared/database-clinical && npx prisma db push --schema prisma/schema.prisma && cd ../../..
   npm run build --workspace @zeal/database-rcm
   cd backend/shared/database-rcm && npx prisma db push --schema prisma/schema.prisma && cd ../../..
   npm run build --workspace @zeal/database-analytics
   cd backend/shared/database-analytics && npx prisma db push --schema prisma/schema.prisma && cd ../../..
   ```
3. **Seed master data:**
   ```bash
   cd seed
   ./run-seeds.sh foundation
   ./run-seeds.sh clinical      # optional sample patients
   ./run-seeds.sh rcm           # optional payer data
   ./run-seeds.sh analytics     # optional audit fixtures
   ```
4. **Verify counts:** open pgAdmin or run `node ../test-connection.js` to confirm tables exist.
5. **(Optional) Seed facility hierarchy demo:** `./seed-facility-hierarchy.sh` (writes to `zeal_foundation`).

The `run-seeds.sh` script prints each file as it executes. Re-run for additional fixtures any time; for destructive re-seeding, drop and recreate the target database or TRUNCATE tables beforehand.
