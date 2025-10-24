# Tenant Isolation - Quick Reference Guide

## For Controllers

### ✅ DO: Use decorators to extract tenant context

```typescript
@Get()
async searchPatients(
  @Query() query: SearchDto,
  @TenantId() tenantId: string  // ← Use decorator
) {
  return this.service.search(tenantId, query);
}
```

### ❌ DON'T: Manually extract from headers

```typescript
// ❌ Old way - don't do this
@Get()
async searchPatients(@Query() query: SearchDto, @Req() req: any) {
  const tenantId = req.headers['x-tenant-id'] || 'default-tenant';
  return this.service.search(tenantId, query);
}
```

## For Services

### ✅ DO: Let middleware handle tenant isolation

```typescript
@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // ✅ Tenant ID is automatically injected by middleware
    return this.prisma.patient.findMany();
  }
}
```

### ❌ DON'T: Manually add tenant filters everywhere

```typescript
// ❌ Redundant - middleware already does this
async findAll(tenantId: string) {
  return this.prisma.patient.findMany({
    where: { tenantId } // Not needed!
  });
}
```

## HTTP Requests

### ✅ DO: Always include x-tenant-id header

```bash
curl -X GET "http://localhost:3011/api/v1/patients" \
  -H "x-tenant-id: 11111111-1111-1111-1111-111111111111" \
  -H "Content-Type: application/json"
```

### ❌ DON'T: Forget the header

```bash
# ❌ This will fail
curl -X GET "http://localhost:3011/api/v1/patients"
# Error: "Tenant ID is required. Please provide x-tenant-id header."
```

## Decorator Cheat Sheet

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@TenantId()` | Get tenant ID | `@TenantId() tenantId: string` |
| `@UserId()` | Get user ID | `@UserId() userId: string` |
| `@FacilityId()` | Get facility ID | `@FacilityId() facilityId: string` |
| `@Context()` | Get full context | `@Context() context: RequestContext` |
| `@BypassTenantCheck()` | Skip tenant check (dangerous!) | `@BypassTenantCheck()` |

## Common Patterns

### Pattern 1: Simple Query

```typescript
// Service method - no tenant parameter needed
async getActivePatients() {
  return this.prisma.patient.findMany({
    where: { status: 'active' }
    // tenantId automatically added by middleware
  });
}

// Controller
@Get('active')
async getActive() {
  return this.service.getActivePatients();
}
```

### Pattern 2: Create with Context

```typescript
// Service
async create(data: CreateDto, context: RequestContext) {
  return this.prisma.patient.create({
    data: {
      ...data,
      createdBy: context.userId,
      createdAtFacility: context.facilityId
      // tenantId automatically added by middleware
    }
  });
}

// Controller
@Post()
async create(
  @Body() dto: CreateDto,
  @Context() context: RequestContext
) {
  return this.service.create(dto, context);
}
```

### Pattern 3: Background Job

```typescript
import { RequestContext } from '@zeal/shared-utils';

async processData(tenantId: string) {
  // Set context for background job
  return RequestContext.run(
    { tenantId, userId: 'system' },
    async () => {
      // Queries here have tenant context
      await this.prisma.patient.updateMany({
        where: { status: 'pending' },
        data: { processed: true }
      });
    }
  );
}
```

## Troubleshooting

### Problem: "Tenant context required for Patient.findMany"

**Solution:** Ensure middleware is registered and request includes `x-tenant-id` header

### Problem: Query returns 0 results but data exists

**Solution:** Check if you're using the correct tenant ID in the header

### Problem: Need to query across multiple tenants

**Solution:** Use `withoutTenantCheck()` (use sparingly!)

```typescript
import { withoutTenantCheck } from '@zeal/database-clinical';

async systemReport() {
  return withoutTenantCheck(async () => {
    return this.prisma.patient.groupBy({
      by: ['tenantId'],
      _count: true
    });
  });
}
```

## Migration Checklist

When adding a new model:

- [ ] Add model to `TENANT_ISOLATED_MODELS` in `prisma-tenant.middleware.ts`
- [ ] Add `tenant_id` column to table
- [ ] Create composite indexes: `(tenant_id, <key_columns>)`
- [ ] Create RLS policy (if using PostgreSQL RLS)
- [ ] Test cross-tenant isolation
- [ ] Update documentation

## Security Checklist

Before deploying:

- [ ] All API routes require `x-tenant-id` header
- [ ] Middleware is registered in AppModule
- [ ] Prisma middleware is registered in PrismaService
- [ ] All tenant-isolated models are listed
- [ ] Composite indexes created
- [ ] Cross-tenant tests passing
- [ ] Audit logging enabled
- [ ] Documentation updated

## Quick Links

- [Full Implementation Guide](./TENANT-ISOLATION-IMPLEMENTATION.md)
- [PostgreSQL RLS Setup](./POSTGRESQL-RLS-SETUP.md)
- [API Controllers](./API-CONTROLLERS-CREATED.md)
