# Multi-Level Configuration Management Architecture

## Overview

This document describes the architecture for managing hierarchical configurations across instance, tenant, and facility levels in the Zeal platform.

## Configuration Hierarchy

```
Instance Config (Global)     → e.g., currency: USD, timezone: UTC
    ↓ (can override)
Tenant Config (Org-specific) → e.g., currency: EUR (for EU tenant)
    ↓ (can override)
Facility Config (Location)   → e.g., timezone: Asia/Dubai (for Dubai facility)
```

**Resolution Rule**: Most specific level wins (Facility > Tenant > Instance > Code Default)

## Architecture Components

### 1. Storage Layer (Foundation Service)

**Database Tables:**

```sql
-- Instance-level configurations (global defaults)
CREATE TABLE instance_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  value_type VARCHAR(50) NOT NULL, -- 'string', 'number', 'boolean', 'json'
  category VARCHAR(100) NOT NULL, -- 'localization', 'finance', 'clinical', 'system'
  description TEXT,
  is_overridable BOOLEAN DEFAULT true,
  is_sensitive BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

-- Tenant-level configurations (override instance)
CREATE TABLE tenant_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  config_key VARCHAR(255) NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,
  CONSTRAINT unique_tenant_config UNIQUE(tenant_id, config_key)
);

-- Facility-level configurations (override tenant/instance)
CREATE TABLE facility_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  config_key VARCHAR(255) NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,
  CONSTRAINT unique_facility_config UNIQUE(facility_id, config_key)
);

-- Audit log for config changes
CREATE TABLE config_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_level VARCHAR(50) NOT NULL, -- 'instance', 'tenant', 'facility'
  config_key VARCHAR(255) NOT NULL,
  entity_id UUID, -- tenant_id or facility_id (null for instance)
  old_value JSONB,
  new_value JSONB,
  changed_by UUID NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW(),
  change_reason TEXT
);

-- Indexes for performance
CREATE INDEX idx_tenant_configs_tenant ON tenant_configs(tenant_id);
CREATE INDEX idx_facility_configs_facility ON facility_configs(facility_id);
CREATE INDEX idx_instance_configs_category ON instance_configs(category);
CREATE INDEX idx_config_audit_entity ON config_audit_log(config_level, entity_id);
```

### 2. Config Categories and Keys

#### Localization
- `locale.default_language` - Default language (e.g., "en", "ar")
- `locale.supported_languages` - Array of supported languages
- `locale.timezone` - Default timezone (e.g., "UTC", "Asia/Dubai")
- `locale.date_format` - Date display format (e.g., "DD/MM/YYYY")
- `locale.time_format` - Time display format (e.g., "12h", "24h")
- `locale.first_day_of_week` - 0 (Sunday) or 1 (Monday)

#### Finance
- `finance.currency` - Default currency (e.g., "USD", "AED", "EUR")
- `finance.decimal_places` - Number of decimal places for currency
- `finance.tax_rate` - Default tax rate (percentage)
- `finance.tax_number` - Tax registration number
- `finance.payment_terms_days` - Default payment terms (days)
- `finance.invoice_prefix` - Invoice number prefix
- `finance.invoice_start_number` - Starting invoice number

#### Clinical
- `clinical.appointment_duration` - Default appointment duration (minutes)
- `clinical.working_hours_start` - Default start time (e.g., "08:00")
- `clinical.working_hours_end` - Default end time (e.g., "18:00")
- `clinical.working_days` - Array of working days (e.g., [1,2,3,4,5])
- `clinical.patient_mrn_prefix` - MRN prefix
- `clinical.patient_mrn_format` - MRN format pattern
- `clinical.enable_telemedicine` - Boolean flag
- `clinical.max_appointments_per_day` - Limit per provider

#### System
- `system.session_timeout` - Session timeout (minutes)
- `system.max_file_upload_size` - Max upload size (MB)
- `system.allowed_file_types` - Array of allowed file extensions
- `system.data_retention_days` - Data retention period
- `system.enable_audit_logs` - Boolean flag
- `system.enable_mfa` - Require multi-factor authentication

### 3. Service Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Foundation Service                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │          Config Management Module                  │ │
│  │  - CRUD operations for all config levels          │ │
│  │  - Config resolution logic                        │ │
│  │  - Validation & audit logging                     │ │
│  │  - Event emission on changes                      │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                           │ REST API + Events
                           ↓
┌──────────────────────────────────────────────────────────┐
│              Shared Config Client Library                │
│  - Config fetching with caching                         │
│  - Local cache (Redis + in-memory fallback)             │
│  - Event subscription for cache invalidation            │
│  - Type-safe config access                              │
└──────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Clinical   │  │     RCM      │  │    Other     │
│   Service    │  │   Service    │  │  Services    │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 4. Config Resolution Flow

```typescript
// Resolution algorithm (pseudo-code)
async function resolveConfig(
  key: string,
  context: { facilityId?, tenantId? }
): Promise<any> {

  // 1. Try facility-level (most specific)
  if (context.facilityId) {
    const facilityConfig = await cache.get(
      `config:facility:${context.facilityId}:${key}`
    );
    if (facilityConfig !== null) {
      return facilityConfig.value;
    }
  }

  // 2. Try tenant-level
  if (context.tenantId) {
    const tenantConfig = await cache.get(
      `config:tenant:${context.tenantId}:${key}`
    );
    if (tenantConfig !== null) {
      return tenantConfig.value;
    }
  }

  // 3. Try instance-level
  const instanceConfig = await cache.get(`config:instance:${key}`);
  if (instanceConfig !== null) {
    return instanceConfig.value;
  }

  // 4. Return hardcoded default
  return getCodeDefault(key);
}
```

### 5. Caching Strategy

**Two-tier cache:**
1. **Redis** (shared, persistent, TTL: 5 minutes)
2. **In-memory** (per-service instance, TTL: 1 minute)

**Cache Keys:**
- `config:instance:{key}`
- `config:tenant:{tenantId}:{key}`
- `config:facility:{facilityId}:{key}`

**Invalidation:**
- On config update → Emit event → All services invalidate relevant cache entries
- Use Redis pub/sub for cache invalidation messages

### 6. API Endpoints

**Foundation Service REST API:**

```
GET    /api/v1/configs/resolve?key={key}
       → Resolve config for current context (from headers)

GET    /api/v1/configs/instance
       → List all instance configs

GET    /api/v1/configs/instance/:key
       → Get specific instance config

POST   /api/v1/configs/instance
       → Create instance config (admin only)

PUT    /api/v1/configs/instance/:key
       → Update instance config (admin only)

DELETE /api/v1/configs/instance/:key
       → Delete instance config (admin only)

GET    /api/v1/configs/tenant/:tenantId
       → List tenant configs

PUT    /api/v1/configs/tenant/:tenantId/:key
       → Set tenant config (tenant admin)

DELETE /api/v1/configs/tenant/:tenantId/:key
       → Delete tenant config (tenant admin)

GET    /api/v1/configs/facility/:facilityId
       → List facility configs

PUT    /api/v1/configs/facility/:facilityId/:key
       → Set facility config (facility admin)

DELETE /api/v1/configs/facility/:facilityId/:key
       → Delete facility config (facility admin)

GET    /api/v1/configs/effective
       → Get all effective configs for current context

GET    /api/v1/configs/schema
       → Get config schema (all available keys + types)
```

### 7. Event-Driven Cache Invalidation

**Event Types:**
- `config.instance.updated` → Invalidate `config:instance:{key}`
- `config.tenant.updated` → Invalidate `config:tenant:{tenantId}:{key}`
- `config.facility.updated` → Invalidate `config:facility:{facilityId}:{key}`

**Event Payload:**
```json
{
  "eventType": "config.tenant.updated",
  "eventId": "uuid",
  "timestamp": "2025-10-25T14:30:00Z",
  "payload": {
    "configKey": "finance.currency",
    "level": "tenant",
    "entityId": "tenant-uuid",
    "oldValue": "USD",
    "newValue": "EUR",
    "changedBy": "user-uuid"
  }
}
```

### 8. Type Safety

**TypeScript Interfaces:**

```typescript
// Config schema definition
interface ConfigSchema {
  key: string;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  category: 'localization' | 'finance' | 'clinical' | 'system';
  defaultValue: any;
  validation?: {
    min?: number;
    max?: number;
    enum?: any[];
    pattern?: string;
  };
}

// Typed config access
interface ConfigValues {
  'locale.timezone': string;
  'locale.currency': string;
  'finance.tax_rate': number;
  'clinical.appointment_duration': number;
  // ... all other keys
}

// Type-safe getter
function getConfig<K extends keyof ConfigValues>(
  key: K,
  context: ConfigContext
): Promise<ConfigValues[K]>;
```

## Implementation Checklist

### Phase 1: Database & Schema
- [ ] Create database migrations for config tables
- [ ] Update Prisma schema
- [ ] Seed default instance configs
- [ ] Create indexes for performance

### Phase 2: Foundation Service
- [ ] Implement config CRUD operations
- [ ] Implement config resolution logic
- [ ] Add validation for config values
- [ ] Add audit logging
- [ ] Create REST API endpoints
- [ ] Add event emission on changes

### Phase 3: Shared Library
- [ ] Create @zeal/config-client package
- [ ] Implement caching layer (Redis + memory)
- [ ] Implement event subscription
- [ ] Add TypeScript types
- [ ] Write tests

### Phase 4: Service Integration
- [ ] Integrate config client in Clinical service
- [ ] Integrate config client in RCM service
- [ ] Add config middleware to inject into request context
- [ ] Update services to use configs

### Phase 5: Frontend
- [ ] Create config management UI (admin)
- [ ] Add config display in tenant/facility settings
- [ ] Use configs in frontend (timezone, currency formatting)

### Phase 6: Testing & Documentation
- [ ] Unit tests for config resolution
- [ ] Integration tests for API
- [ ] Load tests for caching
- [ ] API documentation
- [ ] User documentation

## Usage Examples

### Backend (in any service)

```typescript
import { configClient } from '@zeal/config-client';

// In a controller/handler
async function handleRequest(req) {
  const context = {
    tenantId: req.headers['x-tenant-id'],
    facilityId: req.headers['x-facility-id'],
  };

  // Get single config
  const timezone = await configClient.get('locale.timezone', context);

  // Get multiple configs
  const configs = await configClient.getMany([
    'locale.timezone',
    'finance.currency',
    'clinical.appointment_duration'
  ], context);

  // Get all effective configs
  const allConfigs = await configClient.getAll(context);
}
```

### Frontend

```typescript
import { useConfig } from '@/hooks/use-config';

function MyComponent() {
  const { config, isLoading } = useConfig([
    'locale.timezone',
    'finance.currency',
    'locale.date_format'
  ]);

  return (
    <div>
      <p>Timezone: {config['locale.timezone']}</p>
      <p>Currency: {config['finance.currency']}</p>
    </div>
  );
}
```

## Security Considerations

1. **Sensitive Configs**: Mark configs as sensitive (e.g., API keys) - encrypt at rest
2. **Access Control**: Only admins can modify instance configs
3. **Audit Trail**: All changes logged with user and timestamp
4. **Validation**: Validate config values before saving
5. **Rate Limiting**: Protect config API endpoints

## Performance Considerations

1. **Caching**: Two-tier cache reduces DB load
2. **Batch Fetching**: Fetch multiple configs in one call
3. **Lazy Loading**: Load configs on-demand
4. **Preloading**: Preload common configs on service startup
5. **CDN**: Cache public configs at edge (if applicable)

## Migration Strategy

1. Start with instance-level defaults
2. Allow tenants to override gradually
3. Migrate existing hardcoded values to configs
4. Provide migration scripts for existing data

## Monitoring

1. Track cache hit/miss rates
2. Monitor config resolution latency
3. Alert on config changes in production
4. Track config usage by key
