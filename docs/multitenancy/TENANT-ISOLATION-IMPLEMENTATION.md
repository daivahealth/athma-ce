# Tenant Isolation Implementation Guide

**Date:** 2025-10-24
**Status:** ✅ Implemented

## Overview

This document describes the multi-layer tenant isolation strategy implemented across the PMS system for both Clinical and RCM domains.

## Architecture

We use a **3-layer defense-in-depth** approach:

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: Request Context Middleware                 │
│ - Extracts tenant ID from headers                   │
│ - Validates UUID format                             │
│ - Stores in AsyncLocalStorage                       │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ Layer 2: Prisma Middleware                          │
│ - Auto-injects WHERE tenantId = ?                   │
│ - Applies to all CRUD operations                    │
│ - Prevents cross-tenant data access                 │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ Layer 3: PostgreSQL RLS (Optional)                  │
│ - Database-level enforcement                        │
│ - Uses session variables                            │
│ - Last line of defense                              │
└─────────────────────────────────────────────────────┘
```

## Components

### 1. Request Context Middleware

**File:** `backend/services/clinical/src/common/middleware/tenant-context.middleware.ts`

**Purpose:** Extracts tenant context from HTTP headers and stores in AsyncLocalStorage

**Headers Required:**
- `x-tenant-id` (required) - UUID format
- `x-user-id` (optional) - Falls back to 'system'
- `x-facility-id` (optional) - Falls back to 'default-facility'

**Example:**
```typescript
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;

    // Validate and store in AsyncLocalStorage
    RequestContext.run({ tenantId, userId, ... }, () => {
      next();
    });
  }
}
```

### 2. Prisma Tenant Isolation Middleware

**File:** `backend/shared/database-clinical/src/prisma-tenant.middleware.ts`

**Purpose:** Automatically injects `tenantId` filter into all database queries

**Features:**
- ✅ Auto-injection for all CRUD operations
- ✅ Prevents cross-tenant data access
- ✅ Prevents changing tenantId on existing records
- ✅ Configurable model inclusion/exclusion
- ✅ Error on missing tenant context

**Supported Operations:**
- `findUnique`, `findFirst`, `findMany`
- `create`, `createMany`
- `update`, `updateMany`, `upsert`
- `delete`, `deleteMany`
- `count`, `aggregate`, `groupBy`

**Example Injection:**

```typescript
// Before middleware:
await prisma.patient.findMany({ where: { status: 'active' } });

// After middleware (automatic):
await prisma.patient.findMany({
  where: {
    status: 'active',
    tenantId: '11111111-1111-1111-1111-111111111111' // Auto-injected!
  }
});
```

### 3. Tenant Context Decorators

**File:** `backend/services/clinical/src/common/decorators/tenant-context.decorator.ts`

**Available Decorators:**

#### `@TenantId()`
Extracts tenant ID from request context
```typescript
@Get()
async searchPatients(
  @TenantId() tenantId: string,
  @Query() query: SearchPatientsDto
) {
  return this.service.search(tenantId, query);
}
```

#### `@Context()`
Extracts full request context
```typescript
@Post()
async createPatient(
  @Body() dto: CreatePatientDto,
  @Context() context: RequestContext
) {
  return this.service.create(dto, context);
}
```

#### `@UserId()`, `@FacilityId()`
Extract specific context values
```typescript
@Get('my-data')
async getMyData(@UserId() userId: string) {
  return this.service.getUserData(userId);
}
```

## Configuration

### Step 1: Register Middleware in PrismaService

The middleware is automatically registered in `PrismaService.onModuleInit()`:

```typescript
// backend/shared/database-clinical/src/prisma.service.ts
async onModuleInit() {
  await this.$connect();

  // Register tenant isolation middleware
  this.$use(createTenantIsolationMiddleware());

  console.log('✅ Prisma tenant isolation middleware registered');
}
```

### Step 2: Register HTTP Middleware in AppModule

```typescript
// backend/services/clinical/src/app.module.ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantContextMiddleware)
      .exclude('/health', '/api/v1/health') // Exclude health checks
      .forRoutes('*');
  }
}
```

### Step 3: Configure Model Isolation

Edit the model lists in `prisma-tenant.middleware.ts`:

```typescript
const TENANT_ISOLATED_MODELS = [
  'Patient',
  'PatientHistory',
  'PatientDocument',
  'PatientConsent',
  'Appointment',
  'Encounter',
  'Invoice',
  'Payment',
  // Add all tenant-isolated models
];

const EXCLUDED_MODELS = [
  // Models that don't need tenant isolation
  // 'SystemConfiguration',
  // 'GlobalSettings',
];
```

## Usage Examples

### Basic Usage (Automatic)

Once configured, tenant isolation is **completely automatic**:

```typescript
@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Tenant ID is automatically injected!
    return this.prisma.patient.findMany();

    // Actual query executed:
    // SELECT * FROM patient WHERE tenant_id = '<current-tenant-id>'
  }

  async create(data: CreatePatientDto) {
    // Tenant ID is automatically added to create data!
    return this.prisma.patient.create({ data });

    // Actual query executed:
    // INSERT INTO patient (tenant_id, ...) VALUES ('<current-tenant-id>', ...)
  }
}
```

### Using Decorators in Controllers

```typescript
@Controller('patients')
export class PatientController {
  constructor(private service: PatientService) {}

  @Get()
  async search(
    @TenantId() tenantId: string,
    @Query() query: SearchDto
  ) {
    // tenantId is automatically extracted from x-tenant-id header
    return this.service.search(tenantId, query);
  }

  @Post()
  async create(
    @Body() dto: CreatePatientDto,
    @Context() context: RequestContext
  ) {
    // context contains: tenantId, userId, facilityId, etc.
    return this.service.create(dto, context);
  }
}
```

### Manual Tenant ID Usage (Legacy Code)

For existing code that manually passes tenantId:

```typescript
// Old way - still works but redundant
async search(tenantId: string, query: any) {
  return this.prisma.patient.findMany({
    where: {
      tenantId, // Explicitly passed (optional now)
      status: 'active'
    }
  });
}

// The middleware will ensure the tenantId matches the request context
// If tenantId doesn't match, the query will return 0 results (safe)
```

## Bypassing Tenant Checks (Use with Caution!)

For system-level operations that need to access multiple tenants:

### Method 1: Using Utility Function

```typescript
import { withoutTenantCheck } from '@zeal/database-clinical';

async systemOperation() {
  return withoutTenantCheck(async () => {
    // Queries here will NOT have tenant filtering
    return this.prisma.patient.findMany();
  });
}
```

### Method 2: Using Decorator

```typescript
@Controller('admin')
export class AdminController {
  @Get('all-patients')
  @BypassTenantCheck() // Use with EXTREME caution!
  async getAllPatients() {
    return this.service.getAllPatientsAcrossAllTenants();
  }
}
```

## Testing

### Test with cURL

```bash
# Success - with valid tenant ID
curl -X GET "http://localhost:3011/api/v1/patients" \
  -H "x-tenant-id: 11111111-1111-1111-1111-111111111111"

# Error - without tenant ID
curl -X GET "http://localhost:3011/api/v1/patients"
# Response: "Tenant ID is required. Please provide x-tenant-id header."

# Error - invalid UUID format
curl -X GET "http://localhost:3011/api/v1/patients" \
  -H "x-tenant-id: invalid-uuid"
# Response: "Invalid tenant ID format. Must be a valid UUID."
```

### Test Cross-Tenant Isolation

```bash
# Create patient in tenant A
curl -X POST "http://localhost:3011/api/v1/patients" \
  -H "x-tenant-id: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" \
  -H "Content-Type: application/json" \
  -d '{"firstName": "John", "lastName": "Doe", ...}'

# Try to access from tenant B - should return empty or 404
curl -X GET "http://localhost:3011/api/v1/patients/{patient-id}" \
  -H "x-tenant-id: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
# Response: Patient not found (tenant isolation working!)
```

## Performance Considerations

### Index Recommendations

Ensure all tenant-isolated tables have composite indexes:

```sql
-- Add composite index on (tenant_id, <frequently_queried_column>)
CREATE INDEX idx_patient_tenant_id_status ON patient(tenant_id, status);
CREATE INDEX idx_patient_tenant_id_created_at ON patient(tenant_id, created_at);
CREATE INDEX idx_appointment_tenant_id_date ON appointment(tenant_id, appointment_date);
```

### Query Performance

The middleware adds minimal overhead:
- **~0.1ms** per query (in-memory AsyncLocalStorage lookup)
- No additional database round trips
- Indexes ensure efficient tenant filtering

## Security Best Practices

1. **Always use HTTPS** - tenant IDs in headers must be encrypted in transit
2. **Validate tenant access** - ensure user is authorized for the requested tenant
3. **Audit tenant access** - log all cross-tenant access attempts
4. **Use PostgreSQL RLS** - enable as an additional safety layer
5. **Regular security audits** - review bypass mechanisms and system operations

## Migration Guide

### Migrating Existing Controllers

**Before:**
```typescript
@Get()
async search(@Query() query: SearchDto, @Req() req: any) {
  const tenantId = req.headers['x-tenant-id'] || req.tenant?.id || 'default-tenant';
  return this.service.search(tenantId, query);
}
```

**After:**
```typescript
@Get()
async search(
  @Query() query: SearchDto,
  @TenantId() tenantId: string
) {
  return this.service.search(tenantId, query);
}
```

### Migrating Existing Services

No changes needed! Services automatically benefit from Prisma middleware:

```typescript
@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  // No changes needed - tenant isolation is automatic
  async findAll() {
    return this.prisma.patient.findMany();
  }
}
```

## Troubleshooting

### Error: "Tenant context required for Patient.findMany"

**Cause:** Query executed outside of request context

**Solution:**
1. Ensure middleware is registered in AppModule
2. Ensure request includes `x-tenant-id` header
3. For background jobs, manually set context:

```typescript
RequestContext.run({ tenantId: 'xxx', userId: 'system' }, async () => {
  await this.service.processData();
});
```

### Error: "Cannot change tenantId of existing record"

**Cause:** Trying to update a record's tenantId

**Solution:** TenantId is immutable. Create a new record if needed.

## Related Documentation

- [PostgreSQL RLS Setup](./POSTGRESQL-RLS-SETUP.md)
- [Request Context Module](../backend/shared/shared-utils/README.md)
- [API Controllers Created](./API-CONTROLLERS-CREATED.md)
