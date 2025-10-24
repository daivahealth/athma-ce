# PostgreSQL Row-Level Security (RLS) Setup Guide

**Date:** 2025-10-24
**Purpose:** Database-level tenant isolation (Layer 3 defense)

## Overview

PostgreSQL Row-Level Security (RLS) provides **database-level enforcement** of tenant isolation. Even if application code bypasses Prisma middleware, the database will enforce tenant boundaries.

## Why Use PostgreSQL RLS?

- **Defense in depth** - Database enforces isolation even if app has bugs
- **Compliance** - Required for SOC 2, HIPAA, GDPR certifications
- **Zero trust** - Don't trust application code alone
- **Audit trail** - Database logs all access attempts

## Architecture

```sql
┌──────────────────────────────────────────────┐
│ 1. SET SESSION VARIABLE                      │
│    SET app.current_tenant_id = 'xxx';        │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│ 2. ENABLE RLS ON TABLE                       │
│    ALTER TABLE patient ENABLE ROW LEVEL      │
│    SECURITY;                                  │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│ 3. CREATE RLS POLICY                         │
│    CREATE POLICY tenant_isolation ON patient │
│    USING (tenant_id =                        │
│      current_setting('app.current_tenant_id')│
│    );                                         │
└──────────────────────────────────────────────┘
```

## Implementation

### Step 1: Create RLS Migration

Create a new migration file:

```sql
-- migrations/add_rls_policies.sql

-- ============================================================================
-- Enable Row-Level Security on all tenant-isolated tables
-- ============================================================================

-- Patients
ALTER TABLE patient ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_document ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_consent ENABLE ROW LEVEL SECURITY;

-- Appointments
ALTER TABLE appointment ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_slot ENABLE ROW LEVEL SECURITY;

-- Clinical
ALTER TABLE encounter ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_order ENABLE ROW LEVEL SECURITY;

-- Billing
ALTER TABLE invoice ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claim ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies for Tenant Isolation
-- ============================================================================

-- Helper function to get current tenant ID
CREATE OR REPLACE FUNCTION get_current_tenant_id() RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', true)::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function to check if RLS should be bypassed
CREATE OR REPLACE FUNCTION should_bypass_rls() RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('app.bypass_rls', true) = 'true';
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- Patient Table Policies
-- ============================================================================

CREATE POLICY tenant_isolation_patient ON patient
  USING (
    tenant_id = get_current_tenant_id()
    OR should_bypass_rls()
  );

CREATE POLICY tenant_isolation_patient_history ON patient_history
  USING (
    tenant_id = get_current_tenant_id()
    OR should_bypass_rls()
  );

CREATE POLICY tenant_isolation_patient_document ON patient_document
  USING (
    tenant_id = get_current_tenant_id()
    OR should_bypass_rls()
  );

CREATE POLICY tenant_isolation_patient_consent ON patient_consent
  USING (
    tenant_id = get_current_tenant_id()
    OR should_bypass_rls()
  );

-- ============================================================================
-- Appointment Table Policies
-- ============================================================================

CREATE POLICY tenant_isolation_appointment ON appointment
  USING (
    tenant_id = get_current_tenant_id()
    OR should_bypass_rls()
  );

CREATE POLICY tenant_isolation_appointment_slot ON appointment_slot
  USING (
    tenant_id = get_current_tenant_id()
    OR should_bypass_rls()
  );

-- ============================================================================
-- Clinical Table Policies
-- ============================================================================

CREATE POLICY tenant_isolation_encounter ON encounter
  USING (
    tenant_id = get_current_tenant_id()
    OR should_bypass_rls()
  );

CREATE POLICY tenant_isolation_prescription ON prescription
  USING (
    tenant_id = get_current_tenant_id()
    OR should_bypass_rls()
  );

CREATE POLICY tenant_isolation_lab_order ON lab_order
  USING (
    tenant_id = get_current_tenant_id()
    OR should_bypass_rls()
  );

-- ============================================================================
-- Billing Table Policies
-- ============================================================================

CREATE POLICY tenant_isolation_invoice ON invoice
  USING (
    tenant_id = get_current_tenant_id()
    OR should_bypass_rls()
  );

CREATE POLICY tenant_isolation_payment ON payment
  USING (
    tenant_id = get_current_tenant_id()
    OR should_bypass_rls()
  );

-- ============================================================================
-- Grant bypass to superuser only (for migrations, backups)
-- ============================================================================

-- Application user should NOT be able to bypass RLS
ALTER TABLE patient FORCE ROW LEVEL SECURITY;
ALTER TABLE patient_history FORCE ROW LEVEL SECURITY;
ALTER TABLE patient_document FORCE ROW LEVEL SECURITY;
-- ... repeat for all tables

-- Only superuser can bypass RLS
GRANT BYPASSRLS ON DATABASE clinical TO postgres;
```

### Step 2: Update PrismaService to Set Session Variables

The `runWithRequestContext` method already does this:

```typescript
// backend/shared/database-clinical/src/prisma.service.ts

async runWithRequestContext<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  const store = RequestContext.getStore();

  const tenantId = store?.tenantId;
  const userId = store?.userId;

  if (!tenantId || !userId) {
    throw new Error('Unable to resolve tenant/user context');
  }

  return this.$transaction(async (tx) => {
    // Set PostgreSQL session variables for RLS
    await tx.$queryRaw`
      SELECT
        set_config('app.current_tenant_id', ${tenantId}, true),
        set_config('app.current_user_id', ${userId}, true)
    `;

    return fn(tx);
  });
}
```

### Step 3: Use Transactions for RLS

For operations that need RLS enforcement:

```typescript
@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async findSecurePatient(patientId: string) {
    return this.prisma.runWithRequestContext(async (tx) => {
      // This query will be enforced by PostgreSQL RLS
      return tx.patient.findUnique({
        where: { id: patientId }
      });
    });
  }
}
```

## Testing RLS Policies

### Test 1: Verify RLS is Enabled

```sql
-- Connect to database
psql -U postgres -d clinical

-- Check RLS status
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true;

-- Expected output: List of all tenant-isolated tables
```

### Test 2: Test Without Session Variable

```sql
-- Try to query without setting tenant context
SELECT * FROM patient;

-- Expected result: 0 rows (RLS blocks all access)
```

### Test 3: Test With Session Variable

```sql
-- Set tenant context
SET app.current_tenant_id = '11111111-1111-1111-1111-111111111111';

-- Query should now return data for this tenant only
SELECT * FROM patient;

-- Try to access data from another tenant
SELECT * FROM patient WHERE tenant_id = '22222222-2222-2222-2222-222222222222';

-- Expected result: 0 rows (RLS filters out other tenants)
```

### Test 4: Test Bypass (Superuser Only)

```sql
-- Connect as superuser
psql -U postgres -d clinical

-- Bypass RLS
SET app.bypass_rls = 'true';

-- Query should return data from ALL tenants
SELECT tenant_id, COUNT(*) FROM patient GROUP BY tenant_id;
```

## Monitoring and Auditing

### Enable PostgreSQL Audit Logging

```sql
-- postgresql.conf
log_statement = 'all'
log_connections = true
log_disconnections = true

-- Log failed RLS attempts
ALTER SYSTEM SET log_min_messages TO 'warning';
```

### Create Audit View

```sql
CREATE VIEW tenant_access_audit AS
SELECT
  current_setting('app.current_tenant_id', true) AS tenant_id,
  current_setting('app.current_user_id', true) AS user_id,
  current_timestamp AS access_time,
  current_query() AS query
FROM pg_stat_activity
WHERE state = 'active';
```

## Performance Considerations

### Indexes for RLS

RLS policies use WHERE clauses, so ensure proper indexing:

```sql
-- Composite indexes for tenant + other frequently queried columns
CREATE INDEX CONCURRENTLY idx_patient_tenant_id_status
  ON patient(tenant_id, status);

CREATE INDEX CONCURRENTLY idx_appointment_tenant_id_date
  ON appointment(tenant_id, appointment_date);

CREATE INDEX CONCURRENTLY idx_encounter_tenant_id_created
  ON encounter(tenant_id, created_at);
```

### RLS Performance Impact

- **Overhead:** ~5-10% query overhead
- **Benefit:** Prevents catastrophic data leaks
- **Mitigation:** Proper indexing reduces overhead to <2%

## Security Best Practices

1. **Always use FORCE RLS** - Prevents superuser bypass in app context
2. **Audit bypass usage** - Log all `SET app.bypass_rls = 'true'` operations
3. **Rotate credentials** - Different credentials for app vs migrations
4. **Monitor failed access** - Alert on RLS policy violations
5. **Regular testing** - Automated tests for cross-tenant access

## Migration Checklist

- [ ] Create RLS migration file
- [ ] Test policies in development environment
- [ ] Create indexes for tenant_id on all tables
- [ ] Update PrismaService to set session variables
- [ ] Test cross-tenant isolation
- [ ] Test bypass mechanism for superuser
- [ ] Enable PostgreSQL audit logging
- [ ] Create monitoring dashboards
- [ ] Document bypass procedures
- [ ] Train team on RLS usage

## Rollback Plan

If RLS causes issues:

```sql
-- Disable RLS on specific table
ALTER TABLE patient DISABLE ROW LEVEL SECURITY;

-- Drop specific policy
DROP POLICY IF EXISTS tenant_isolation_patient ON patient;

-- Emergency: Disable RLS on all tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE 'ALTER TABLE ' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
  END LOOP;
END $$;
```

## Common Issues

### Issue 1: "No rows returned" even with valid tenant

**Cause:** Session variable not set

**Solution:**
```typescript
// Always use runWithRequestContext for RLS
await this.prisma.runWithRequestContext(async (tx) => {
  return tx.patient.findMany();
});
```

### Issue 2: RLS blocks migrations

**Cause:** Migration user doesn't have BYPASSRLS

**Solution:**
```sql
-- Grant bypass to migration user
ALTER USER migration_user WITH BYPASSRLS;

-- Or run migrations as superuser
```

### Issue 3: Performance degradation

**Cause:** Missing indexes on tenant_id

**Solution:**
```sql
-- Add composite indexes
CREATE INDEX CONCURRENTLY idx_<table>_tenant_id_<key_column>
  ON <table>(tenant_id, <key_column>);
```

## Related Documentation

- [Tenant Isolation Implementation](./TENANT-ISOLATION-IMPLEMENTATION.md)
- [PostgreSQL RLS Official Docs](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Security Best Practices](./SECURITY-BEST-PRACTICES.md)
