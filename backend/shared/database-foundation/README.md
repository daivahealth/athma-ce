# @zeal/database-foundation

Prisma client and database utilities for the Foundation database (`zeal_foundation`).

## Overview

This package provides database access for the Foundation domain, which includes:

- Tenants and tenant configuration
- Users and authentication
- RBAC (roles, permissions)
- Facilities, departments, wards, beds
- Staff profiles and specialties
- Clinics and spaces

## Installation

This package is used internally within the Zeal monorepo. Reference it in your `package.json`:

```json
{
  "dependencies": {
    "@zeal/database-foundation": "file:../../shared/database-foundation"
  }
}
```

## Exports

```typescript
// Generated Prisma client
export { PrismaClient } from '../generated';
export type { Prisma } from '../generated';

// Extended client with middleware
export { ZealPrismaClient, prisma } from './client';

// NestJS integration
export { PrismaService } from './prisma.service';
export { FoundationDatabaseModule } from './database.module';
```

## Usage

### NestJS Module

Import the `FoundationDatabaseModule` in your NestJS application:

```typescript
import { FoundationDatabaseModule } from '@zeal/database-foundation';

@Module({
  imports: [FoundationDatabaseModule],
})
export class AppModule {}
```

### PrismaService

Inject `PrismaService` in your services:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
    });
  }
}
```

### Running with Request Context

Use `runWithRequestContext` for tenant-isolated transactions:

```typescript
import { PrismaService } from '@zeal/database-foundation';

async function createUserWithContext(
  prisma: PrismaService,
  tenantId: string,
  data: CreateUserDto
) {
  return prisma.runWithRequestContext(tenantId, async () => {
    return prisma.user.create({ data });
  });
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FOUNDATION_DATABASE_URL` | PostgreSQL connection string for zeal_foundation | Yes |

Example:
```bash
FOUNDATION_DATABASE_URL=postgresql://zeal_user:zeal_password@localhost:5432/zeal_foundation
```

## Building

```bash
# Generate Prisma client
npm run build --workspace=@zeal/database-foundation
```

This runs `prisma generate` to create the client from the schema.

## Schema Location

The Prisma schema is located at:
```
prisma/schema.prisma
```

## Middleware

The package includes built-in middleware for:

- **Soft Delete**: Converts `delete` operations to status updates
- **Audit Fields**: Automatically sets `updatedAt` timestamps
- **Tenant Injection**: Adds `tenantId` from request context to queries

## Error Handling

The package exports custom error classes:

```typescript
import { DatabaseError, TransactionError } from '@zeal/database-foundation';

try {
  await prisma.user.create({ data });
} catch (error) {
  if (error instanceof DatabaseError) {
    // Handle database-specific error
  }
}
```

## Transaction Support

Use transactions with automatic retry:

```typescript
import { PrismaService } from '@zeal/database-foundation';

const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  const role = await tx.userRole.create({
    data: { userId: user.id, roleId },
  });
  return { user, role };
});
```

## Related Packages

- `@zeal/database-clinical` - Clinical domain database
- `@zeal/database-rcm` - RCM domain database
- `@zeal/database-prm` - PRM domain database
- `@zeal/database-analytics` - Analytics domain database
