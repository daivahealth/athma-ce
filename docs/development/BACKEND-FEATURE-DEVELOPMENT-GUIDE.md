# Backend Feature Development Guide

**Last Updated**: 2025-10-24
**For**: NestJS + Prisma Backend Services

## Overview

This guide provides step-by-step instructions for developing new features and entities in the athma-ce backend platform. Follow these guidelines to ensure consistency, maintainability, and adherence to architectural principles.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Process](#step-by-step-process)
3. [Database Schema Design](#database-schema-design)
4. [Prisma Model Creation](#prisma-model-creation)
5. [DTOs and Validation](#dtos-and-validation)
6. [Service Implementation](#service-implementation)
7. [Controller Implementation](#controller-implementation)
8. [Module Setup](#module-setup)
9. [Testing](#testing)
10. [Documentation](#documentation)
11. [Best Practices](#best-practices)
12. [Common Patterns](#common-patterns)

---

## Prerequisites

Before starting development, ensure you have:

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ running
- [ ] Project cloned and dependencies installed
- [ ] Development environment configured (`.env` files)
- [ ] Familiarity with NestJS, Prisma, and TypeScript
- [ ] Understanding of multi-tenant architecture
- [ ] Read [Architecture Documentation](../architecture/)
- [ ] Read [Multi-Tenancy Documentation](../multitenancy/)

---

## Step-by-Step Process

### Overview of Steps

```
1. Design Database Schema
   ↓
2. Create Prisma Model
   ↓
3. Generate Migration
   ↓
4. Create DTOs
   ↓
5. Implement Service
   ↓
6. Create Controller
   ↓
7. Register Module
   ↓
8. Write Tests
   ↓
9. Update Documentation
```

---

## Database Schema Design

### 1. Identify the Domain

Determine which database your entity belongs to:

- **Foundation**: Tenancy, identity, RBAC, facilities, staff, catalogs
- **Clinical**: Patient data, appointments, encounters, EHR, clinical workflows
- **RCM**: Billing, invoicing, claims, payments, financial data
- **Analytics**: Audit logs, metrics, reporting (append-only)

**Rule**: ❌ No cross-database joins! Use API calls or events for cross-domain data.

### 2. Define Required Fields

Every entity should include:

#### Core Fields

```typescript
id: UUID (primary key)
tenantId: UUID (for multi-tenant isolation)
```

#### Audit Fields (for data entities)

```typescript
// Creation tracking
createdBy: UUID (user who created)
createdAtFacility: UUID (facility where created)
createdAt: DateTime

// Update tracking
updatedBy?: UUID (user who last updated)
updatedAtFacility?: UUID (facility where updated)
updatedAt: DateTime
```

#### System Fields

```typescript
status: String (e.g., 'active', 'inactive', 'deleted')
version?: Int (for optimistic locking)
```

### 3. Design Relationships

- Use UUIDs for foreign keys
- Add `@@index` for foreign keys
- Consider soft deletes instead of hard deletes
- Plan for tenant isolation in all queries

### 4. Plan Indexes

Add indexes for:
- `tenantId` (critical for multi-tenant queries)
- Composite indexes: `(tenantId, frequently_queried_field)`
- Foreign keys
- Frequently searched fields

---

## Prisma Model Creation

### Step 1: Choose the Correct Database Package

Navigate to the appropriate database package:

```bash
cd backend/shared/database-{foundation|clinical|rcm|analytics}
```

### Step 2: Create Prisma Model

Edit `prisma/schema.prisma`:

```prisma
model YourEntity {
  // Primary Key
  id        String   @id @default(uuid()) @map("id") @db.Uuid
  tenantId  String   @map("tenant_id") @db.Uuid

  // Business Fields
  name      String   @db.VarChar(255)
  email     String?  @db.VarChar(255)
  status    String   @default("active") @db.VarChar(20)

  // JSON fields (if needed)
  metadata  Json?

  // Audit Fields
  createdBy         String   @map("created_by") @db.Uuid
  createdAtFacility String   @map("created_at_facility") @db.Uuid
  createdAt         DateTime @default(now()) @map("created_at") @db.Timestamptz(6)

  updatedBy         String?  @map("updated_by") @db.Uuid
  updatedAtFacility String?  @map("updated_at_facility") @db.Uuid
  updatedAt         DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relations (if any)
  relatedEntity RelatedEntity? @relation(fields: [relatedEntityId], references: [id])
  relatedEntityId String?      @map("related_entity_id") @db.Uuid

  // Indexes
  @@index([tenantId], map: "idx_your_entity_tenant")
  @@index([tenantId, status], map: "idx_your_entity_tenant_status")
  @@index([tenantId, createdAt], map: "idx_your_entity_tenant_created")
  @@unique([tenantId, email], map: "unq_your_entity_tenant_email")

  @@map("your_entities")
}
```

### Step 3: Generate Migration

```bash
# Create migration
npx prisma migrate dev --name add_your_entity \
  --schema prisma/schema.prisma

# Generate Prisma client
npx prisma generate --schema prisma/schema.prisma
```

### Step 4: Add to Tenant Isolation

Edit `src/prisma-tenant.middleware.ts`:

```typescript
const TENANT_ISOLATED_MODELS = [
  'Patient',
  'Appointment',
  'YourEntity',  // ← Add your new model here
  // ... other models
];
```

### Step 5: Rebuild Database Package

```bash
cd backend
npm run build --workspace=@zeal/database-clinical
```

---

## DTOs and Validation

### Step 1: Create DTO Files

Create folder: `backend/services/{service}/src/modules/your-entity/dto/`

### Step 2: Create DTOs

#### Create DTO

```typescript
// dto/create-your-entity.dto.ts
import { IsString, IsEmail, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class CreateYourEntityDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;

  @IsOptional()
  metadata?: any; // Will be stored as JSON
}
```

#### Update DTO

```typescript
// dto/update-your-entity.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateYourEntityDto } from './create-your-entity.dto';

export class UpdateYourEntityDto extends PartialType(CreateYourEntityDto) {}
```

#### Query/Search DTO

```typescript
// dto/search-your-entity.dto.ts
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchYourEntityDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
```

---

## Service Implementation

### Step 1: Create Service File

Create: `backend/services/{service}/src/modules/your-entity/your-entity.service.ts`

### Step 2: Implement Service

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical'; // or appropriate database
import { CreateYourEntityDto } from './dto/create-your-entity.dto';
import { UpdateYourEntityDto } from './dto/update-your-entity.dto';
import { SearchYourEntityDto } from './dto/search-your-entity.dto';

export interface RequestContext {
  userId: string;
  tenantId: string;
  facilityId: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class YourEntityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create new entity
   */
  async create(dto: CreateYourEntityDto, context: RequestContext) {
    // Validation logic (if needed)

    // Create entity
    const entity = await this.prisma.yourEntity.create({
      data: {
        // Business fields
        name: dto.name,
        email: dto.email ?? null,
        status: dto.status || 'active',
        metadata: dto.metadata ?? null,

        // Multi-tenant field (auto-injected by middleware, but explicit here)
        tenantId: context.tenantId,

        // Audit fields - REQUIRED
        createdBy: context.userId,
        createdAtFacility: context.facilityId,
      },
    });

    return entity;
  }

  /**
   * Find all entities with pagination
   */
  async findAll(
    tenantId: string,
    options: SearchYourEntityDto
  ) {
    const { search, status, page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      // tenantId is auto-injected by Prisma middleware
      // but you can be explicit:
      // tenantId,
    };

    // Add search conditions
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    // Execute query with pagination
    const [entities, total] = await Promise.all([
      this.prisma.yourEntity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.yourEntity.count({ where }),
    ]);

    return {
      data: entities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Find one entity by ID
   */
  async findOne(id: string, tenantId: string) {
    const entity = await this.prisma.yourEntity.findUnique({
      where: { id },
      // Tenant filtering auto-applied by middleware
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    return entity;
  }

  /**
   * Update entity
   */
  async update(
    id: string,
    dto: UpdateYourEntityDto,
    context: RequestContext
  ) {
    // Check if exists
    const existing = await this.findOne(id, context.tenantId);

    // Update entity
    const updated = await this.prisma.yourEntity.update({
      where: { id },
      data: {
        ...dto,
        // Update audit fields
        updatedBy: context.userId,
        updatedAtFacility: context.facilityId,
      },
    });

    return updated;
  }

  /**
   * Soft delete entity
   */
  async remove(id: string, context: RequestContext) {
    // Check if exists
    await this.findOne(id, context.tenantId);

    // Soft delete
    await this.prisma.yourEntity.update({
      where: { id },
      data: {
        status: 'deleted',
        updatedBy: context.userId,
        updatedAtFacility: context.facilityId,
      },
    });

    return { message: 'Entity deleted successfully' };
  }
}
```

---

## Controller Implementation

### Step 1: Create Controller File

Create: `backend/services/{service}/src/modules/your-entity/your-entity.controller.ts`

### Step 2: Implement Controller

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { YourEntityService } from './your-entity.service';
import { CreateYourEntityDto } from './dto/create-your-entity.dto';
import { UpdateYourEntityDto } from './dto/update-your-entity.dto';
import { SearchYourEntityDto } from './dto/search-your-entity.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';

@Controller('your-entities')
export class YourEntityController {
  constructor(private readonly service: YourEntityService) {}

  /**
   * POST /your-entities - Create new entity
   */
  @Post()
  async create(
    @Body() dto: CreateYourEntityDto,
    @Context() context: any
  ) {
    return this.service.create(dto, context);
  }

  /**
   * GET /your-entities - List all entities
   */
  @Get()
  async findAll(
    @Query() query: SearchYourEntityDto,
    @TenantId() tenantId: string
  ) {
    return this.service.findAll(tenantId, query);
  }

  /**
   * GET /your-entities/:id - Get entity by ID
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @TenantId() tenantId: string
  ) {
    return this.service.findOne(id, tenantId);
  }

  /**
   * PUT /your-entities/:id - Update entity
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateYourEntityDto,
    @Context() context: any
  ) {
    return this.service.update(id, dto, context);
  }

  /**
   * DELETE /your-entities/:id - Delete entity
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Context() context: any
  ) {
    return this.service.remove(id, context);
  }
}
```

---

## Module Setup

### Step 1: Create Module File

Create: `backend/services/{service}/src/modules/your-entity/your-entity.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { YourEntityController } from './your-entity.controller';
import { YourEntityService } from './your-entity.service';

@Module({
  controllers: [YourEntityController],
  providers: [YourEntityService],
  exports: [YourEntityService], // Export if needed by other modules
})
export class YourEntityModule {}
```

### Step 2: Register in App Module

Edit `backend/services/{service}/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { YourEntityModule } from './modules/your-entity/your-entity.module';

@Module({
  imports: [
    // ... existing imports
    YourEntityModule, // ← Add here
  ],
})
export class AppModule {}
```

### Step 3: Build and Test

```bash
# Build the service
npm run build --workspace=@zeal/clinical

# Start the service
npm run dev --workspace=@zeal/clinical
```

---

## Testing

### Unit Tests

Create: `your-entity.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourEntityService } from './your-entity.service';
import { PrismaService } from '@zeal/database-clinical';

describe('YourEntityService', () => {
  let service: YourEntityService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YourEntityService,
        {
          provide: PrismaService,
          useValue: {
            yourEntity: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<YourEntityService>(YourEntityService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an entity', async () => {
      const dto = {
        name: 'Test Entity',
        email: 'test@example.com',
      };
      const context = {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        tenantId: '11111111-1111-1111-1111-111111111111',
        facilityId: '22222222-2222-2222-2222-222222222222',
      };

      const expected = { id: 'abc-123', ...dto };
      jest.spyOn(prisma.yourEntity, 'create').mockResolvedValue(expected as any);

      const result = await service.create(dto, context);

      expect(result).toEqual(expected);
      expect(prisma.yourEntity.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: dto.name,
          email: dto.email,
          createdBy: context.userId,
          createdAtFacility: context.facilityId,
        }),
      });
    });
  });
});
```

### Integration Tests with Postman

1. **Create Postman Collection** for your entity
2. **Add requests** for all CRUD operations
3. **Set environment variables** (BASE_URL, TENANT_ID, USER_ID, FACILITY_ID)
4. **Test all scenarios**:
   - ✅ Create with valid data
   - ❌ Create with invalid data
   - ✅ List with pagination
   - ✅ Search with filters
   - ✅ Get by ID
   - ❌ Get non-existent ID
   - ✅ Update entity
   - ✅ Delete entity
   - ❌ Cross-tenant access (should fail)

---

## Documentation

### Update API Documentation

Create: `docs/features/your-domain/YOUR-ENTITY-API.md`

```markdown
# Your Entity API Documentation

## Endpoints

### Create Entity
POST /your-entities

### List Entities
GET /your-entities

### Get Entity
GET /your-entities/:id

### Update Entity
PUT /your-entities/:id

### Delete Entity
DELETE /your-entities/:id

## Examples
[Include curl examples]
```

### Update Postman Collection

Add your API endpoints to the appropriate Postman collection in `docs/api/postman/`.

---

## Best Practices

### 1. Multi-Tenancy

✅ **DO:**
- Always include `tenantId` in database models
- Let Prisma middleware handle tenant filtering automatically
- Use `@TenantId()` decorator in controllers
- Add `tenantId` to unique constraints

❌ **DON'T:**
- Manually add `tenantId` to every WHERE clause (middleware does this)
- Hardcode tenant IDs
- Skip tenant validation

### 2. Audit Fields

✅ **DO:**
- Always include audit fields (`createdBy`, `createdAtFacility`, etc.)
- Use `@Context()` decorator to get full context
- Ensure context contains valid UUIDs (middleware validates)

❌ **DON'T:**
- Use placeholder values like `'system'` or `'default'`
- Skip audit fields
- Make audit fields nullable (except `updated*`)

### 3. Validation

✅ **DO:**
- Use class-validator decorators in DTOs
- Validate at the DTO level
- Return clear error messages
- Use enums for fixed value sets

❌ **DON'T:**
- Skip validation
- Validate in services (should be in DTOs)
- Allow any value for constrained fields

### 4. Error Handling

✅ **DO:**
- Use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`)
- Provide clear error messages
- Log errors appropriately
- Handle database errors gracefully

❌ **DON'T:**
- Return raw Prisma errors to clients
- Use generic error messages
- Ignore errors

### 5. Database Queries

✅ **DO:**
- Use pagination for list queries
- Add indexes for frequently queried fields
- Use transactions for multi-step operations
- Use `select` to limit returned fields when appropriate

❌ **DON'T:**
- Return all records without pagination
- Query without indexes
- Make multiple sequential queries when a transaction is needed
- Return sensitive fields unnecessarily

### 6. Code Organization

✅ **DO:**
- Follow NestJS module structure
- Keep controllers thin (business logic in services)
- Use DTOs for all input/output
- Export interfaces and types

❌ **DON'T:**
- Put business logic in controllers
- Use `any` type unnecessarily
- Mix concerns across layers

---

## Common Patterns

### Pattern 1: Soft Delete

```typescript
async softDelete(id: string, context: RequestContext) {
  return this.prisma.yourEntity.update({
    where: { id },
    data: {
      status: 'deleted',
      deletedAt: new Date(),
      deletedBy: context.userId,
    },
  });
}
```

### Pattern 2: Pagination

```typescript
async findAll(options: { page?: number; limit?: number }) {
  const page = options.page || 1;
  const limit = Math.min(options.limit || 20, 100);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.yourEntity.findMany({ skip, take: limit }),
    this.prisma.yourEntity.count(),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

### Pattern 3: Transactions

```typescript
async complexOperation(dto: any, context: RequestContext) {
  return this.prisma.$transaction(async (tx) => {
    // Step 1
    const entity = await tx.yourEntity.create({ data: {...} });

    // Step 2
    await tx.relatedEntity.create({
      data: { yourEntityId: entity.id, ... }
    });

    return entity;
  });
}
```

### Pattern 4: Search with Filters

```typescript
async search(filters: SearchDto) {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.createdAfter) {
    where.createdAt = { gte: new Date(filters.createdAfter) };
  }

  return this.prisma.yourEntity.findMany({ where });
}
```

### Pattern 5: Include Relations

```typescript
async findOneWithRelations(id: string) {
  return this.prisma.yourEntity.findUnique({
    where: { id },
    include: {
      relatedEntity: true,
      anotherRelation: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
```

---

## Checklist

Before submitting your feature for review, ensure:

### Database
- [ ] Prisma model created with all required fields
- [ ] Migration generated and tested
- [ ] Tenant isolation configured
- [ ] Indexes added for performance
- [ ] Audit fields included

### Code
- [ ] DTOs created with validation
- [ ] Service implements all CRUD operations
- [ ] Controller uses decorators properly
- [ ] Module registered in AppModule
- [ ] TypeScript compiles without errors

### Testing
- [ ] Unit tests written for service
- [ ] Postman collection created
- [ ] All endpoints tested manually
- [ ] Cross-tenant isolation verified
- [ ] Error scenarios tested

### Documentation
- [ ] API documentation created
- [ ] Postman collection documented
- [ ] Code comments added
- [ ] README updated if needed

### Security
- [ ] Authentication required on all endpoints
- [ ] Authorization checks implemented
- [ ] Input validation in place
- [ ] No sensitive data exposed

---

## Quick Reference

### Required Headers for All Requests

```
x-tenant-id: <tenant-uuid>
x-user-id: <user-uuid>
x-facility-id: <facility-uuid>
Authorization: Bearer <jwt-token>
```

### Common Decorators

```typescript
@TenantId() tenantId: string          // Extract tenant ID
@Context() context: RequestContext    // Extract full context
@Body() dto: CreateDto                // Request body
@Param('id') id: string               // URL parameter
@Query() query: SearchDto             // Query parameters
```

### Prisma Middleware Models

Add your model to tenant isolation:

```typescript
// backend/shared/database-*/src/prisma-tenant.middleware.ts
const TENANT_ISOLATED_MODELS = [
  'Patient',
  'YourEntity', // ← Add here
];
```

---

## Related Documentation

- [Architecture Overview](../architecture/02-Architecture-Diagram.md)
- [Multi-Tenancy Guide](../multitenancy/TENANT-ISOLATION-IMPLEMENTATION.md)
- [API Authentication](../api/API-AUTHENTICATION-CONTEXT.md)
- [Database Configuration](../infrastructure/database/PRISMA-DATABASE-CONFIG.md)
- [Development Commands](./DEVELOPMENT-COMMANDS.md)

---

**Questions?** Check the documentation or ask the team in the development channel.

**Last Updated**: 2025-10-24
