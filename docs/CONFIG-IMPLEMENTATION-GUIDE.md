# Configuration Management - Implementation Guide

## Quick Start

This guide provides step-by-step instructions to implement the hierarchical configuration system.

## Phase 1: Database Setup (Foundation Service)

### 1. Add Prisma Schema

Add to `/backend/services/foundation/prisma/schema.prisma`:

```prisma
model InstanceConfig {
  id            String   @id @default(uuid())
  configKey     String   @unique @map("config_key")
  value         Json
  valueType     String   @map("value_type") // 'string', 'number', 'boolean', 'json'
  category      String
  description   String?
  isOverridable Boolean  @default(true) @map("is_overridable")
  isSensitive   Boolean  @default(false) @map("is_sensitive")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  createdBy     String?  @map("created_by")
  updatedBy     String?  @map("updated_by")

  @@map("instance_configs")
}

model TenantConfig {
  id         String   @id @default(uuid())
  tenantId   String   @map("tenant_id")
  configKey  String   @map("config_key")
  value      Json
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")
  createdBy  String?  @map("created_by")
  updatedBy  String?  @map("updated_by")

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, configKey])
  @@map("tenant_configs")
}

model FacilityConfig {
  id         String   @id @default(uuid())
  facilityId String   @map("facility_id")
  configKey  String   @map("config_key")
  value      Json
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")
  createdBy  String?  @map("created_by")
  updatedBy  String?  @map("updated_by")

  facility Facility @relation(fields: [facilityId], references: [id], onDelete: Cascade)

  @@unique([facilityId, configKey])
  @@map("facility_configs")
}

model ConfigAuditLog {
  id           String   @id @default(uuid())
  configLevel  String   @map("config_level") // 'instance', 'tenant', 'facility'
  configKey    String   @map("config_key")
  entityId     String?  @map("entity_id") // tenantId or facilityId
  oldValue     Json?    @map("old_value")
  newValue     Json     @map("new_value")
  changedBy    String   @map("changed_by")
  changedAt    DateTime @default(now()) @map("changed_at")
  changeReason String?  @map("change_reason")

  @@index([configLevel, entityId])
  @@map("config_audit_log")
}
```

### 2. Update Tenant and Facility models

Add relations to existing models:

```prisma
model Tenant {
  // ... existing fields
  configs TenantConfig[]
}

model Facility {
  // ... existing fields
  configs FacilityConfig[]
}
```

### 3. Run migrations

```bash
cd backend/services/foundation
npx prisma migrate dev --name add_config_tables
npx prisma generate
```

### 4. Seed instance configs

Create `/backend/services/foundation/prisma/seed.ts` (or update existing):

```typescript
import { PrismaClient } from '@prisma/client';
import { instanceConfigsData } from './seeds/instance-configs.seed';

const prisma = new PrismaClient();

async function seedInstanceConfigs() {
  console.log('Seeding instance configs...');

  for (const config of instanceConfigsData) {
    await prisma.instanceConfig.upsert({
      where: { configKey: config.configKey },
      update: {
        value: config.value,
        valueType: config.valueType,
        category: config.category,
        description: config.description,
        isOverridable: config.isOverridable,
        isSensitive: config.isSensitive,
      },
      create: config,
    });
  }

  console.log(`✅ Seeded ${instanceConfigsData.length} instance configs`);
}

async function main() {
  await seedInstanceConfigs();
  // ... other seed functions
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:

```bash
npm run seed
```

## Phase 2: Config Service (Foundation)

### 1. Create Config Module

```bash
cd backend/services/foundation/src
mkdir -p modules/config
```

### 2. Create Config Service

`modules/config/config.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  /**
   * Resolve config value through hierarchy
   */
  async resolve(
    key: string,
    context: { tenantId?: string; facilityId?: string }
  ) {
    // 1. Try facility-level
    if (context.facilityId) {
      const facilityConfig = await this.prisma.facilityConfig.findUnique({
        where: {
          facilityId_configKey: {
            facilityId: context.facilityId,
            configKey: key,
          },
        },
      });
      if (facilityConfig) {
        return { value: facilityConfig.value, level: 'facility' };
      }
    }

    // 2. Try tenant-level
    if (context.tenantId) {
      const tenantConfig = await this.prisma.tenantConfig.findUnique({
        where: {
          tenantId_configKey: {
            tenantId: context.tenantId,
            configKey: key,
          },
        },
      });
      if (tenantConfig) {
        return { value: tenantConfig.value, level: 'tenant' };
      }
    }

    // 3. Instance-level
    const instanceConfig = await this.prisma.instanceConfig.findUnique({
      where: { configKey: key },
    });
    if (instanceConfig) {
      return { value: instanceConfig.value, level: 'instance' };
    }

    return null;
  }

  // ... other methods (create, update, delete, etc.)
}
```

### 3. Create Config Controller

`modules/config/config.controller.ts`:

```typescript
import { Controller, Get, Query, Headers } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('api/v1/configs')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get('resolve')
  async resolve(
    @Query('key') key: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('x-facility-id') facilityId?: string
  ) {
    const result = await this.configService.resolve(key, {
      tenantId,
      facilityId,
    });

    if (!result) {
      throw new NotFoundException(`Config key '${key}' not found`);
    }

    return result;
  }

  // ... other endpoints
}
```

## Phase 3: Shared Config Client

### 1. Install in each service

```bash
cd backend/services/clinical
npm install @zeal/config-client --save

cd backend/services/rcm
npm install @zeal/config-client --save
```

### 2. Initialize in each service

Create `src/config/index.ts`:

```typescript
import { createConfigClient } from '@zeal/config-client';

export const configClient = createConfigClient({
  foundationBaseUrl: process.env.FOUNDATION_BASE_URL || 'http://localhost:3010',
  enableCache: true,
  cacheConfig: {
    redisUrl: process.env.REDIS_URL,
    memoryTtlMs: 60000,  // 1 min
    redisTtlMs: 300000,  // 5 min
  },
});
```

### 3. Use in controllers/services

```typescript
import { configClient } from '../config';

async function createInvoice(req) {
  const context = {
    tenantId: req.headers['x-tenant-id'],
    facilityId: req.headers['x-facility-id'],
  };

  const currency = await configClient.get('finance.currency', context);
  const taxRate = await configClient.get('finance.tax_rate', context);

  // Use configs...
}
```

## Phase 4: Frontend Integration

### 1. Create config hook

`frontend/src/hooks/use-config.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { foundationClient } from '@/lib/api/client';

export function useConfig(keys: string[]) {
  return useQuery({
    queryKey: ['configs', ...keys],
    queryFn: async () => {
      const promises = keys.map((key) =>
        foundationClient.get('/configs/resolve', { params: { key } })
      );
      const results = await Promise.all(promises);

      const configMap: Record<string, any> = {};
      results.forEach((res, i) => {
        configMap[keys[i]] = res.data.value;
      });

      return configMap;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 2. Use in components

```typescript
import { useConfig } from '@/hooks/use-config';

function InvoiceForm() {
  const { data: config } = useConfig(['finance.currency', 'finance.tax_rate']);

  return (
    <div>
      <p>Currency: {config?.['finance.currency']}</p>
      <p>Tax Rate: {config?.['finance.tax_rate']}%</p>
    </div>
  );
}
```

## Testing

### Test config resolution

```bash
# Get instance config
curl http://localhost:3010/api/v1/configs/resolve?key=finance.currency

# Get tenant-specific config
curl http://localhost:3010/api/v1/configs/resolve?key=finance.currency \
  -H "x-tenant-id: tenant-uuid"

# Get facility-specific config
curl http://localhost:3010/api/v1/configs/resolve?key=locale.timezone \
  -H "x-tenant-id: tenant-uuid" \
  -H "x-facility-id: facility-uuid"
```

### Set tenant config

```bash
curl -X PUT http://localhost:3010/api/v1/configs/tenant/tenant-uuid/finance.currency \
  -H "Content-Type: application/json" \
  -d '{"value": "EUR"}'
```

## Best Practices

1. **Always provide context**: Pass tenantId and facilityId when available
2. **Cache configs**: Don't fetch on every request, use the client's cache
3. **Validate values**: Check config values before using them
4. **Audit changes**: Log all config modifications
5. **Use TypeScript**: Leverage type safety for config keys
6. **Document configs**: Keep config descriptions up-to-date
7. **Test overrides**: Verify hierarchy works correctly

## Common Patterns

### Middleware injection

```typescript
app.use(async (req, res, next) => {
  req.configs = await configClient.getMany(
    ['locale.timezone', 'finance.currency'],
    { tenantId: req.tenantId, facilityId: req.facilityId }
  );
  next();
});
```

### Formatting helpers

```typescript
function formatCurrency(amount: number, config: ConfigValues) {
  return new Intl.NumberFormat(config['locale.number_format'], {
    style: 'currency',
    currency: config['finance.currency'],
    minimumFractionDigits: config['finance.decimal_places'],
  }).format(amount);
}
```

## Troubleshooting

**Config not updating?**
- Check cache TTL
- Manually invalidate: `configClient.invalidate(key, context)`

**Performance issues?**
- Verify Redis connection
- Check cache hit rates
- Consider preloading common configs

**Type errors?**
- Ensure `ConfigValues` interface is up-to-date
- Rebuild config-client: `npm run build`

## Next Steps

1. Implement config UI for admins
2. Add config versioning/history
3. Add config validation rules
4. Implement config import/export
5. Add config diff viewer
6. Create config migration tools
