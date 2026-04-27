# Multi-Tenancy Documentation

This folder contains all documentation related to the multi-tenancy implementation in the athma-ce PMS/RCM system.

## 📚 Documents

### Implementation Guides

1. **[TENANT-ISOLATION-IMPLEMENTATION.md](./TENANT-ISOLATION-IMPLEMENTATION.md)**
   - Complete implementation guide for tenant isolation
   - Architecture overview with 3-layer security
   - Configuration instructions
   - Usage examples and best practices
   - Troubleshooting guide

2. **[TENANT-ISOLATION-QUICK-REFERENCE.md](./TENANT-ISOLATION-QUICK-REFERENCE.md)**
   - Quick reference for developers
   - Common patterns and code examples
   - Do's and don'ts
   - Decorator cheat sheet

3. **[TENANT-ISOLATION-SUMMARY.md](./TENANT-ISOLATION-SUMMARY.md)**
   - Implementation summary and status
   - What was implemented and what's working
   - Testing instructions
   - Next steps and roadmap

### Database & Security

4. **[POSTGRESQL-RLS-SETUP.md](./POSTGRESQL-RLS-SETUP.md)**
   - PostgreSQL Row-Level Security setup guide
   - Migration scripts for database-level enforcement
   - Testing procedures
   - Performance considerations

5. **[TENANT-IDENTITY-CONFIG-REFERENCE.md](./TENANT-IDENTITY-CONFIG-REFERENCE.md)**
   - Tenant identity configuration reference
   - Identity provider integration
   - Configuration options

### API Design

6. **[API-DESIGN-TENANT-VS-USER-OPERATIONS.md](./API-DESIGN-TENANT-VS-USER-OPERATIONS.md)**
   - API design patterns for tenant vs user operations
   - Best practices for multi-tenant APIs
   - Examples and guidelines

### Architecture Decision Records

7. **[ADR-0003-multitenancy.md](../ADR/ADR-0003-multitenancy.md)**
   - Architectural decision record for multi-tenancy strategy
   - Context, decision, and consequences

## 🏗️ Architecture

The multi-tenancy system uses a **3-layer defense-in-depth approach**:

### Layer 1: HTTP Middleware
- Extracts `x-tenant-id` from request headers
- Validates UUID format
- Stores tenant context in AsyncLocalStorage
- Attaches context to request object

### Layer 2: Prisma Middleware
- Automatically intercepts ALL database queries
- Auto-injects `WHERE tenantId = ?` filters
- Prevents cross-tenant data access
- Blocks tenantId modification attempts

### Layer 3: PostgreSQL RLS (Optional)
- Database-level row-level security policies
- Final enforcement layer
- Independent of application code

## ✅ Implementation Status

**Status: ✅ READY FOR PRODUCTION**

- ✅ HTTP middleware implemented and tested
- ✅ Prisma middleware with automatic filtering
- ✅ Custom NestJS decorators for clean code
- ✅ Comprehensive documentation
- ✅ All builds successful
- 📋 PostgreSQL RLS ready to deploy (optional)

## 🚀 Quick Start

### For Controllers

```typescript
@Get()
async searchPatients(
  @Query() query: SearchDto,
  @TenantId() tenantId: string
) {
  return this.service.search(tenantId, query);
}
```

### For Services

```typescript
@Injectable()
export class PatientService {
  async findAll() {
    // Tenant ID automatically injected by middleware
    return this.prisma.patient.findMany();
  }
}
```

### HTTP Requests

```bash
curl "http://localhost:3011/api/v1/patients" \
  -H "x-tenant-id: 11111111-1111-1111-1111-111111111111"
```

## 📖 Related Documentation

- [Security & Compliance](../security/08-Security-&-Compliance.md)
- [RBAC Access Control](../security/20-RBAC-Access-Control.md)
- [Backend Overview](../implementation/backend/BACKEND-OVERVIEW.md)

## 🔗 External References

- [Prisma Middleware Documentation](https://www.prisma.io/docs/concepts/components/prisma-client/middleware)
- [PostgreSQL Row-Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Node.js AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage)
