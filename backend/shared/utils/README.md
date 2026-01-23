# @zeal/shared-utils

Shared utilities for the Zeal backend services.

## Overview

This package provides common utilities used across all backend services:

- **Request Context**: AsyncLocalStorage-based context propagation for tenant/user info
- **Name Formatter**: Configurable name formatting for different regions
- **Permission Cache**: Redis-based permission caching

## Installation

This package is used internally within the Zeal monorepo. Reference it in your `package.json`:

```json
{
  "dependencies": {
    "@zeal/shared-utils": "file:../../shared/utils"
  }
}
```

## Exports

```typescript
// Request context
export { RequestContext, RequestContextStore } from './request-context';
export { RequestContextMiddleware } from './request-context.middleware';
export { RequestContextInterceptor } from './request-context.interceptor';
export { RequestContextModule } from './request-context.module';

// Name formatting
export { formatName, NameComponents, NAME_FORMAT_TEMPLATES, parseFormatTemplate } from './name-formatter';

// Permission caching
export { getCachedPermissions, setCachedPermissions, invalidateCachedPermissions } from './permission-cache';
```

## Request Context

### Overview

The Request Context system uses Node.js `AsyncLocalStorage` to propagate tenant and user information through the async call stack without passing it explicitly to every function.

### RequestContextStore Interface

```typescript
interface RequestContextStore {
  tenantId?: string;      // Current tenant ID
  userId?: string;        // Current user ID
  userAgent?: string;     // Request user agent
  bypassTenantCheck?: boolean;  // Skip tenant validation
}
```

### RequestContext Class

```typescript
import { RequestContext } from '@zeal/shared-utils';

// Run code within a context
RequestContext.run({ tenantId: 'tenant-1', userId: 'user-1' }, () => {
  // All code in this callback has access to the context
  const tenantId = RequestContext.getTenantId(); // 'tenant-1'
});

// Get current context
const store = RequestContext.getStore();

// Get specific values
const tenantId = RequestContext.getTenantId();
const userId = RequestContext.getUserId();

// Update context within a run block
RequestContext.set({ userId: 'new-user-id' });
```

### NestJS Integration

#### Module Setup

```typescript
import { RequestContextModule } from '@zeal/shared-utils';

@Module({
  imports: [RequestContextModule],
})
export class AppModule {}
```

The module automatically registers:
- `RequestContextMiddleware` - Sets up context from HTTP headers
- `RequestContextInterceptor` - Extracts JWT claims to context

#### Middleware

The middleware extracts headers and initializes the context:

```typescript
// Headers extracted:
// x-tenant-id -> tenantId
// x-user-id -> userId
// User-Agent -> userAgent
```

#### Interceptor

The interceptor extracts user information from JWT claims:

```typescript
// JWT claims extracted:
// sub -> userId
// tenantId -> tenantId
```

## Name Formatter

### formatName Function

Formats person names according to configurable templates:

```typescript
import { formatName, NameComponents } from '@zeal/shared-utils';

const name: NameComponents = {
  title: 'Dr.',
  firstName: 'Ahmed',
  middleName: 'Mohammed',
  lastName: 'Al-Mansoori',
};

// UAE format (default)
formatName(name);
// "Dr. Ahmed Mohammed Al-Mansoori"

// USA format
formatName(name, '{lastName}, {firstName} {middleName}');
// "Al-Mansoori, Ahmed Mohammed"

// Simple format
formatName(name, '{firstName} {lastName}');
// "Ahmed Al-Mansoori"
```

### NameComponents Interface

```typescript
interface NameComponents {
  title?: string;      // Dr., Mr., Mrs., etc.
  firstName: string;   // Given name
  middleName?: string; // Middle name(s)
  lastName: string;    // Family name
  prefix?: string;     // Alternative to title (staff names)
}
```

### Predefined Templates

```typescript
import { NAME_FORMAT_TEMPLATES } from '@zeal/shared-utils';

NAME_FORMAT_TEMPLATES.UAE;        // "{title} {firstName} {middleName} {lastName}"
NAME_FORMAT_TEMPLATES.USA;        // "{lastName}, {firstName} {middleName}"
NAME_FORMAT_TEMPLATES.SIMPLE;     // "{firstName} {lastName}"
NAME_FORMAT_TEMPLATES.FORMAL;     // "{title} {lastName}"
NAME_FORMAT_TEMPLATES.FULL;       // "{firstName} {middleName} {lastName}"
NAME_FORMAT_TEMPLATES.FIRST_ONLY; // "{firstName}"
NAME_FORMAT_TEMPLATES.LAST_ONLY;  // "{lastName}"
```

### parseFormatTemplate Function

Parses a format template from configuration (handles JSON-stringified values):

```typescript
import { parseFormatTemplate } from '@zeal/shared-utils';

// Direct string
parseFormatTemplate('{title} {firstName}');
// Returns: "{title} {firstName}"

// JSON-stringified (from config)
parseFormatTemplate('"{title} {firstName}"');
// Returns: "{title} {firstName}"
```

## Permission Cache

Caches user permissions in Redis for performance:

```typescript
import {
  getCachedPermissions,
  setCachedPermissions,
  invalidateCachedPermissions,
} from '@zeal/shared-utils';

// Get cached permissions
const permissions = await getCachedPermissions(
  redisClient,
  userId,
  tenantId
);

// Cache permissions (with TTL)
await setCachedPermissions(
  redisClient,
  userId,
  tenantId,
  ['read:patients', 'write:patients']
);

// Invalidate on role change
await invalidateCachedPermissions(redisClient, userId, tenantId);
```

### Cache Key Format

```
permissions:{tenantId}:{userId}
```

### Default TTL

5 minutes (configurable)

## Usage in Services

### Database Package Integration

The request context is used by database packages for tenant isolation:

```typescript
// In @zeal/database-clinical prisma-tenant.middleware.ts
import { RequestContext } from '@zeal/shared-utils';

const tenantId = RequestContext.getTenantId();
// Automatically inject into queries
```

### Service Layer Usage

```typescript
import { Injectable } from '@nestjs/common';
import { RequestContext, formatName, NAME_FORMAT_TEMPLATES } from '@zeal/shared-utils';

@Injectable()
export class PatientService {
  async getPatientDisplayName(patient: Patient): Promise<string> {
    // Get name format from config (or use default)
    const format = NAME_FORMAT_TEMPLATES.UAE;

    return formatName({
      firstName: patient.firstName,
      middleName: patient.middleName,
      lastName: patient.lastName,
    }, format);
  }

  async getCurrentTenant(): string | undefined {
    return RequestContext.getTenantId();
  }
}
```

## Testing

When testing code that uses RequestContext, wrap your tests:

```typescript
import { RequestContext } from '@zeal/shared-utils';

describe('PatientService', () => {
  it('should create patient with tenant', async () => {
    await RequestContext.run({ tenantId: 'test-tenant' }, async () => {
      const patient = await patientService.create(data);
      expect(patient.tenantId).toBe('test-tenant');
    });
  });
});
```

## Related Packages

- `@zeal/database-foundation` - Uses RequestContext for tenant isolation
- `@zeal/database-clinical` - Uses RequestContext for tenant isolation
- `@zeal/database-rcm` - Uses RequestContext for tenant isolation
- `@zeal/config-client` - Uses RequestContext for tenant-scoped config
