# Developer Onboarding Guide

**Welcome to the athma-ce Platform Development Team!** 🎉

This guide will help you get started with backend development on the athma-ce healthcare platform.

## 🎯 Quick Links

### Essential Reading (First Week)

1. **[Backend Feature Development Guide](./BACKEND-FEATURE-DEVELOPMENT-GUIDE.md)** ⭐
   - Your primary reference for building new features
   - Step-by-step process from database to API
   - Read this FIRST before starting development

2. **[Multi-Tenancy Quick Reference](../multitenancy/TENANT-ISOLATION-QUICK-REFERENCE.md)**
   - How multi-tenancy works in athma-ce
   - Required headers and context
   - Common patterns

3. **[API Authentication Context](../api/API-AUTHENTICATION-CONTEXT.md)**
   - Required authentication headers
   - Context requirements for all requests
   - Common errors and solutions

4. **[Development Commands](./DEVELOPMENT-COMMANDS.md)**
   - Commands you'll use daily
   - Quick reference for common tasks

### When Building a Feature

1. **Read**: [Backend Feature Development Guide](./BACKEND-FEATURE-DEVELOPMENT-GUIDE.md)
2. **Use**: [New Feature Checklist](./NEW-FEATURE-CHECKLIST.md)
3. **Reference**: [Architecture Documentation](../architecture/)
4. **Test with**: [API Documentation](../api/)

## 🏗️ Architecture Overview

### Four-Database Domain Model

```
┌─────────────────────────────────────────────────────────┐
│ 1. zeal_foundation                                      │
│    - Tenancy, identity, RBAC                            │
│    - Facilities, staff, users                           │
│    - Master catalogs                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 2. zeal_clinical                                        │
│    - Patient data (PHI)                                 │
│    - Appointments, encounters                           │
│    - EHR, clinical workflows                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 3. zeal_rcm                                             │
│    - Billing, invoicing                                 │
│    - Claims, payments                                   │
│    - Financial data                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 4. zeal_analytics                                       │
│    - Audit logs (append-only)                           │
│    - Metrics, reporting                                 │
└─────────────────────────────────────────────────────────┘
```

**Critical Rule**: ❌ No direct SQL joins across databases. Use API calls or events.

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **API**: REST with OpenAPI/Swagger
- **Testing**: Jest + Postman

## 📝 Development Workflow

### 1. Setup Your Environment (First Time)

```bash
# Clone repository
git clone <repo-url>
cd zeal/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URLs

# Generate Prisma clients
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev --workspace=@zeal/clinical
```

### 2. Building a New Feature

**Step-by-step process**:

```
1. Design database schema
   ↓
2. Create Prisma model
   ↓
3. Generate migration
   ↓
4. Create DTOs
   ↓
5. Implement service
   ↓
6. Create controller
   ↓
7. Register module
   ↓
8. Write tests
   ↓
9. Document API
```

**Detailed guide**: [Backend Feature Development Guide](./BACKEND-FEATURE-DEVELOPMENT-GUIDE.md)

**Track progress with**: [New Feature Checklist](./NEW-FEATURE-CHECKLIST.md)

### 3. Testing Your Changes

```bash
# Run unit tests
npm run test

# Build to check for errors
npm run build

# Start service
npm run dev --workspace=@zeal/clinical

# Test with Postman
# Use collections in docs/api/postman/
```

### 4. Common Daily Commands

```bash
# Start a service
npm run dev --workspace=@zeal/clinical

# Build a service
npm run build --workspace=@zeal/clinical

# Generate Prisma client
npm run db:generate

# Create migration
npx prisma migrate dev --name <migration-name>

# View database in Prisma Studio
npm run db:studio
```

More commands: [Development Commands](./DEVELOPMENT-COMMANDS.md)

## ⚡ Key Concepts

### Multi-Tenancy

Every request MUST include:
```
x-tenant-id: <tenant-uuid>
x-user-id: <user-uuid>
x-facility-id: <facility-uuid>
```

These are automatically:
- Validated by middleware
- Injected into database queries
- Used for audit trails

**Learn more**: [Multi-Tenancy Documentation](../multitenancy/)

### Audit Fields

Every data entity includes:
```typescript
createdBy: UUID          // Who created it
createdAtFacility: UUID  // Where it was created
createdAt: DateTime      // When it was created

updatedBy: UUID          // Who last updated it
updatedAtFacility: UUID  // Where it was updated
updatedAt: DateTime      // When it was updated
```

These are **automatically populated** from request context.

### Tenant Isolation

The Prisma middleware automatically:
- Injects `WHERE tenantId = ?` to all queries
- Prevents cross-tenant data access
- Validates tenant context

You don't need to manually add tenant filtering!

## 🎓 Learning Path

### Week 1: Foundation
- [ ] Set up development environment
- [ ] Read architecture documentation
- [ ] Understand multi-tenancy model
- [ ] Run existing services locally
- [ ] Test APIs with Postman
- [ ] Review existing entity implementations (Patient, Facility)

### Week 2: First Feature
- [ ] Pick a simple entity to implement
- [ ] Follow the feature development guide
- [ ] Use the checklist
- [ ] Get code reviewed
- [ ] Deploy to dev environment

### Week 3: Advanced Topics
- [ ] Learn complex query patterns
- [ ] Understand transaction handling
- [ ] Study error handling patterns
- [ ] Review security best practices
- [ ] Learn testing strategies

### Week 4: Independence
- [ ] Implement feature independently
- [ ] Help review others' code
- [ ] Contribute to documentation
- [ ] Suggest improvements

## 📖 Code Examples

### Basic Entity Service

```typescript
@Injectable()
export class EntityService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDto, context: RequestContext) {
    return this.prisma.entity.create({
      data: {
        ...dto,
        tenantId: context.tenantId,
        createdBy: context.userId,
        createdAtFacility: context.facilityId,
      },
    });
  }

  async findAll(tenantId: string, options: SearchDto) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.entity.findMany({ skip, take: limit }),
      this.prisma.entity.count(),
    ]);

    return { data, pagination: { page, limit, total } };
  }
}
```

### Basic Controller

```typescript
@Controller('entities')
export class EntityController {
  constructor(private service: EntityService) {}

  @Post()
  create(@Body() dto: CreateDto, @Context() ctx: any) {
    return this.service.create(dto, ctx);
  }

  @Get()
  findAll(@Query() query: SearchDto, @TenantId() tenantId: string) {
    return this.service.findAll(tenantId, query);
  }
}
```

## 🐛 Common Issues & Solutions

### "Invalid UUID" Error
**Problem**: Using string like 'system' instead of UUID
**Solution**: Provide valid UUID in `x-user-id` header

### "Tenant ID Required" Error
**Problem**: Missing `x-tenant-id` header
**Solution**: Include header in all requests

### Build Errors
**Problem**: Prisma client not regenerated after schema change
**Solution**: Run `npm run db:generate`

### Tests Failing
**Problem**: Database not seeded or migrations not run
**Solution**: Run `npm run db:migrate && npm run db:seed`

**More troubleshooting**: [Development Commands](./DEVELOPMENT-COMMANDS.md)

## 🔐 Security Checklist

Every feature must:
- [ ] Require authentication (validated by middleware)
- [ ] Enforce tenant isolation (automatic)
- [ ] Validate all inputs (using DTOs)
- [ ] Not expose sensitive data
- [ ] Include audit trails
- [ ] Handle errors properly

## 📞 Getting Help

### Documentation
1. Check this guide first
2. Read the feature development guide
3. Search existing documentation
4. Review similar implementations

### Team Support
1. Ask in development Slack channel
2. Schedule pairing session
3. Request code review
4. Attend weekly tech sync

### Useful Links
- [Main Documentation](../README.md)
- [Architecture Docs](../architecture/)
- [API Docs](../api/)
- [Security Docs](../security/)
- [Runbooks](../runbooks/)

## ✅ Ready to Start?

1. **Read**: [Backend Feature Development Guide](./BACKEND-FEATURE-DEVELOPMENT-GUIDE.md)
2. **Setup**: Your development environment
3. **Pick**: Your first task
4. **Use**: The [New Feature Checklist](./NEW-FEATURE-CHECKLIST.md)
5. **Build**: Something awesome! 🚀

---

**Welcome aboard!** If you have questions, don't hesitate to ask. We're here to help you succeed.

**Last Updated**: 2025-10-24
