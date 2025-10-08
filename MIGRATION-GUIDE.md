# User-Facility Mapping Migration Guide

## Prerequisites
✅ Docker containers running (PostgreSQL)
✅ Prisma client generated
✅ Database schema updated

## Step 1: Run the Migration SQL

### Option A: Using psql (Recommended)
```bash
# Connect to the database
psql -h localhost -U zeal_user -d zeal_pms -f backend/shared/database/migrations/add-user-facility-mapping.sql
```

### Option B: Using pgAdmin
1. Open pgAdmin (http://localhost:8080)
2. Connect to zeal_pms database
3. Open Query Tool
4. Paste the contents of `backend/shared/database/migrations/add-user-facility-mapping.sql`
5. Execute the query

### Option C: Using Docker exec
```bash
# Copy the SQL file into the container
docker cp backend/shared/database/migrations/add-user-facility-mapping.sql zeal-postgres:/tmp/

# Execute the SQL
docker exec -it zeal-postgres psql -U zeal_user -d zeal_pms -f /tmp/add-user-facility-mapping.sql
```

## Step 2: Verify the Migration

### Check Tables Created
```bash
cd backend/shared/database
npx prisma db pull
```

### Verify Data
```sql
-- Check that all users have a default facility
SELECT COUNT(*) FROM users WHERE default_facility_id IS NULL;
-- Expected: 0

-- Check user-facility mappings
SELECT 
    u.email,
    f.name as facility_name,
    uf.is_default,
    uf.access_level
FROM users u
JOIN user_facilities uf ON u.id = uf.user_id
JOIN facilities f ON uf.facility_id = f.id
ORDER BY u.email;

-- Verify only one default facility per user
SELECT user_id, COUNT(*) as default_count
FROM user_facilities 
WHERE is_default = true 
GROUP BY user_id 
HAVING COUNT(*) > 1;
-- Expected: 0 rows
```

## Step 3: Update Prisma Migration History (Optional)

If you want Prisma to track this migration:

```bash
cd backend/shared/database

# Mark the current state as migrated
npx prisma migrate resolve --applied add-user-facility-mapping
```

## Step 4: Restart Services

### Restart Foundation Service
```bash
# Kill the current process
pkill -f "foundation"

# Start it again
cd backend/services/foundation
npm run dev
```

The service should now recognize the new schema!

## Troubleshooting

### Error: Column already exists
```sql
-- Check if migration already ran
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'default_facility_id';
```

### Error: Table already exists
```sql
-- Check if user_facilities table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'user_facilities';
```

### Rollback (if needed)
```sql
-- Drop user_facilities table
DROP TABLE IF EXISTS user_facilities CASCADE;

-- Remove default_facility_id column
ALTER TABLE users DROP COLUMN IF EXISTS default_facility_id;

-- Drop indexes
DROP INDEX IF EXISTS users_tenant_id_default_facility_id_idx;
```

## Next Steps

After successful migration:

1. ✅ Verify all users have default facilities
2. ✅ Test user creation with facility assignment
3. ✅ Implement UserFacilityRepository in foundation service
4. ✅ Update Auth service to include facility context in JWT
5. ✅ Add facility switcher to frontend

See `docs/USER-FACILITY-IMPLEMENTATION-SUMMARY.md` for complete implementation plan.

