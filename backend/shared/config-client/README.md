# @zeal/config-client

Hierarchical configuration management library for Zeal platform microservices.

## Features

- **Three-level hierarchy**: Instance → Tenant → Facility
- **Type-safe**: Full TypeScript support with auto-completion
- **Caching**: Two-tier cache (Redis + in-memory) for performance
- **Fallback defaults**: Always returns a value
- **Event-driven**: Cache invalidation on config changes

## Installation

```bash
npm install @zeal/config-client
```

## Usage

### Initialize the client

```typescript
import { createConfigClient } from '@zeal/config-client';

const configClient = createConfigClient({
  foundationBaseUrl: process.env.FOUNDATION_BASE_URL || 'http://localhost:3010',
  enableCache: true,
  cacheConfig: {
    redisUrl: process.env.REDIS_URL,
    memoryTtlMs: 60000,  // 1 minute
    redisTtlMs: 300000,  // 5 minutes
  },
});
```

### Get a single config

```typescript
// With full context (facility-level resolution)
const timezone = await configClient.get('locale.timezone', {
  tenantId: 'tenant-uuid',
  facilityId: 'facility-uuid',
});

// With tenant context only
const currency = await configClient.get('finance.currency', {
  tenantId: 'tenant-uuid',
});

// Instance-level only
const sessionTimeout = await configClient.get('system.session_timeout');
```

### Get multiple configs

```typescript
const configs = await configClient.getMany(
  [
    'locale.timezone',
    'finance.currency',
    'clinical.appointment_duration'
  ],
  {
    tenantId: 'tenant-uuid',
    facilityId: 'facility-uuid',
  }
);

console.log(configs['locale.timezone']); // Type-safe access
```

### Get all effective configs

```typescript
const allConfigs = await configClient.getAll({
  tenantId: 'tenant-uuid',
  facilityId: 'facility-uuid',
});
```

### Invalidate cache

```typescript
// Invalidate specific config
await configClient.invalidate('finance.currency', {
  tenantId: 'tenant-uuid',
});

// Clear all cache
await configClient.clearCache();
```

### Use in NestJS middleware

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { configClient } from './config';

@Injectable()
export class ConfigMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const context = {
      tenantId: req.headers['x-tenant-id'],
      facilityId: req.headers['x-facility-id'],
      userId: req.headers['x-user-id'],
    };

    // Attach configs to request
    req.configs = await configClient.getMany(
      ['locale.timezone', 'finance.currency'],
      context
    );

    next();
  }
}
```

## Configuration Keys

### Localization
- `locale.default_language` - Default language code
- `locale.timezone` - Default timezone
- `locale.date_format` - Date display format
- `locale.time_format` - 12h or 24h

### Finance
- `finance.currency` - ISO currency code
- `finance.tax_rate` - Default tax rate
- `finance.payment_terms_days` - Payment terms

### Clinical
- `clinical.appointment_duration` - Default appointment duration
- `clinical.working_hours_start` - Start of business hours
- `clinical.enable_telemedicine` - Enable video consultations

### System
- `system.session_timeout` - Session timeout in minutes
- `system.enable_mfa` - Require multi-factor authentication

## Resolution Hierarchy

```
1. Facility Config (if facilityId provided)
   ↓ (not found)
2. Tenant Config (if tenantId provided)
   ↓ (not found)
3. Instance Config (global default)
   ↓ (not found)
4. Code Default (hardcoded fallback)
```

## Cache Strategy

1. **Check in-memory cache** (TTL: 1 minute)
2. **Check Redis cache** (TTL: 5 minutes)
3. **Fetch from Foundation API**
4. **Fallback to code defaults**

## Type Safety

All config keys are typed, providing auto-completion and compile-time safety:

```typescript
// ✅ Valid - TypeScript knows this key exists
const timezone = await configClient.get('locale.timezone');

// ❌ Error - TypeScript catches invalid key
const invalid = await configClient.get('locale.invalid_key');
```

## Adding New Config Keys

1. Add the key to `ConfigValues` interface in `src/types.ts`
2. Add the default value to `CONFIG_DEFAULTS` in `src/defaults.ts`
3. Create instance config in database via Foundation API

## Testing

```typescript
import { createConfigClient } from '@zeal/config-client';

const testClient = createConfigClient({
  foundationBaseUrl: 'http://localhost:3010',
  enableCache: false, // Disable cache for testing
});

const timezone = await testClient.get('locale.timezone');
expect(timezone).toBe('UTC');
```

## Environment Variables

```env
FOUNDATION_BASE_URL=http://localhost:3010
REDIS_URL=redis://localhost:6379
```

## License

MIT
