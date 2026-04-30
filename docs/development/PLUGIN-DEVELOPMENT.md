# Plugin Development Guide

This guide explains how to build specialty modules (plugins) for athma-ce.

## Overview

A plugin is an npm package with a standardized structure that provides:
- **Backend**: NestJS module with controllers, services, and database models
- **Frontend**: React components, hooks, pages, and navigation items
- **Manifest**: `athma-plugin.json` declaring metadata, permissions, routes, and extension points

Plugins are loaded into the clinical service at startup and integrate with core workflows through extension points and events.

## Quick Start

```
my-specialty-plugin/
├── athma-plugin.json          # Plugin manifest (required)
├── backend/
│   ├── src/
│   │   ├── my-specialty.module.ts    # NestJS module (implements AthmaPluginModule)
│   │   ├── my-specialty.controller.ts
│   │   └── my-specialty.service.ts
│   └── prisma/
│       └── schema.prisma      # Plugin database schema
├── frontend/
│   ├── index.ts               # Frontend entry point (registers with pluginRegistry)
│   ├── types/
│   ├── services/
│   ├── hooks/
│   ├── components/
│   └── pages/
├── i18n/
│   ├── en.json
│   └── ar.json
└── package.json
```

## Plugin Manifest

Every plugin must have an `athma-plugin.json` at its root:

```json
{
  "id": "my-specialty",
  "name": "My Specialty",
  "version": "1.0.0",
  "description": "Description of the specialty module",
  "specialty": {
    "code": "MY_SPECIALTY",
    "displayName": "My Specialty"
  },
  "backend": {
    "targetService": "clinical",
    "moduleEntrypoint": "./backend/src/my-specialty.module.js",
    "prismaSchema": "./backend/prisma/schema.prisma",
    "permissions": [
      "my_specialty.read",
      "my_specialty.write"
    ]
  },
  "frontend": {
    "moduleEntrypoint": "./frontend/index.ts",
    "navigation": [
      {
        "section": "my-specialty",
        "labelKey": "nav.mySpecialty",
        "icon": "Stethoscope",
        "children": [
          { "href": "/my-specialty/dashboard", "labelKey": "nav.dashboard", "icon": "LayoutDashboard" }
        ]
      }
    ]
  },
  "configKeys": [
    {
      "key": "feature.nav.my-specialty",
      "defaultValue": false,
      "valueType": "boolean",
      "category": "feature",
      "description": "Enable My Specialty module",
      "isOverridable": true
    }
  ]
}
```

### Key Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique plugin identifier |
| `backend.targetService` | Yes | Which service hosts this plugin (`clinical`, `rcm`, etc.) |
| `backend.moduleEntrypoint` | Yes | Path to compiled NestJS module |
| `backend.permissions` | No | Permission codes to register (format: `resource.action`) |
| `frontend.navigation` | No | Sidebar nav sections with feature flag gating |
| `configKeys` | No | Config entries seeded on install; include `feature.nav.{id}` |

## Backend Development

### NestJS Module

Your module must implement the `AthmaPluginModule` interface from `@athma/plugin-sdk`:

```typescript
import { Module } from '@nestjs/common';
import { AthmaPluginModule, PluginContext } from '@athma/plugin-sdk';

@Module({
  controllers: [MySpecialtyController],
  providers: [MySpecialtyService],
})
export class MySpecialtyModule implements AthmaPluginModule {
  async onPluginInit(context: PluginContext): Promise<void> {
    // Register encounter types
    context.extensionRegistry.registerEncounterType({
      code: 'my_specialty_consult',
      display: 'My Specialty Consultation',
      encounterClass: 'AMB',
      pluginId: context.pluginId,
    });

    // Register observation codes
    context.extensionRegistry.registerObservationCodes([...]);

    // Register charting panels
    context.extensionRegistry.registerChartingPanel({...});
  }
}
```

### Controllers

Use the `@PluginController()` decorator which auto-prefixes routes and applies the `PluginGuard`:

```typescript
import { Get, Post, Body, UseGuards } from '@nestjs/common';
import { PluginController } from '@athma/plugin-sdk';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';

@PluginController('my-specialty')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MySpecialtyController {
  @Get('records')
  @Permissions('my_specialty.read')
  async listRecords() { ... }

  @Post('records')
  @Permissions('my_specialty.write')
  async createRecord(@Body() body: any) { ... }
}
```

Routes are automatically prefixed as `/api/v1/plugins/my-specialty/...`.

### Database

Plugins use their own PostgreSQL schema within the clinical database:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("CLINICAL_DATABASE_URL")
  schemas  = ["plugin_my_specialty"]
}

model MyRecord {
  id       String @id @default(uuid()) @db.Uuid
  tenantId String @map("tenant_id") @db.Uuid
  // ... fields
  @@schema("plugin_my_specialty")
  @@map("my_records")
}
```

**Rules:**
- All tables must include `tenantId` for multi-tenant isolation
- Schema name must be `plugin_{pluginId}`
- Do not create foreign keys to core tables — use UUID references
- Use raw SQL via `prisma.$queryRawUnsafe` since the plugin schema is separate from the core Prisma client

### Event Handling

Subscribe to core lifecycle events:

```typescript
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PLUGIN_EVENTS, EncounterCreatedEvent } from '@athma/plugin-sdk';

@Injectable()
export class MySpecialtyEventHandler {
  @OnEvent(PLUGIN_EVENTS.ENCOUNTER_CREATED)
  async handleEncounterCreated(event: EncounterCreatedEvent) {
    if (event.encounterType === 'my_specialty_consult') {
      // Initialize specialty-specific data
    }
  }
}
```

## Frontend Development

### Plugin Registration

Register your plugin in the frontend entry point:

```typescript
import { pluginRegistry } from '@/lib/plugins/plugin-registry';
import type { FrontendPluginManifest } from '@/lib/plugins/types';
import { MySpecialtyPage } from './pages/MySpecialtyPage';

const myPlugin: FrontendPluginManifest = {
  id: 'my-specialty',
  name: 'My Specialty',
  featureFlag: 'feature.nav.my-specialty',
  navigation: [...],
  pageComponent: MySpecialtyPage,
};

pluginRegistry.register(myPlugin);
```

### API Services

Use the existing clinical API client:

```typescript
import { clinicalClient } from '@/lib/api/client';

const BASE_URL = '/api/v1/plugins/my-specialty';

export const mySpecialtyService = {
  async listRecords() {
    const { data } = await clinicalClient.get(`${BASE_URL}/records`);
    return data;
  },
};
```

### React Query Hooks

Follow the existing query key factory pattern:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const keys = {
  all: ['my-specialty'] as const,
  records: () => [...keys.all, 'records'] as const,
};

export function useRecords() {
  return useQuery({
    queryKey: keys.records(),
    queryFn: () => mySpecialtyService.listRecords(),
  });
}
```

### Extension Slots

Plugins can extend the encounter charting UI:

```typescript
encounterExtensions: {
  chartingPanels: [MySummaryPanel],
},
```

Your panel component receives `{ encounterId, patientId, encounterType }` props.

### Icon Names

Navigation icons reference Lucide icon names as strings. Available icons include: `Activity`, `BarChart3`, `Bell`, `Brain`, `Bone`, `ClipboardList`, `Eye`, `FlaskConical`, `Heart`, `HeartPulse`, `Microscope`, `Pill`, `Radiation`, `Stethoscope`, `Syringe`, `Target`, `TestTube`, `Users`, and more. See `frontend/src/lib/plugins/icon-map.ts` for the full list.

## Installation

### Local Development

Place your plugin in the `plugins/` directory:

```
athma-ce/plugins/my-specialty/
```

The `PluginLoaderModule` scans this directory at startup.

### npm Package

Publish as `@athma-plugins/my-specialty`, then install:

```bash
npm install @athma-plugins/my-specialty
```

### Activation

1. **Install** the plugin via the Foundation API:
   ```
   POST /api/v1/plugins/install
   { "packagePath": "./plugins/my-specialty" }
   ```

2. **Activate** for a tenant:
   ```
   PUT /api/v1/plugins/my-specialty/activate
   { "tenantId": "..." }
   ```

3. **Assign permissions** to roles via the RBAC system

## Multi-Tenancy

Your plugin automatically inherits athma-ce's three-layer tenant isolation:
1. **HTTP Middleware** — tenant context from `x-tenant-id` header
2. **Application** — `RequestContext.getStore().tenantId` available in services
3. **Database** — all queries must filter by `tenantId`

**Never** allow cross-tenant data access. Always include `tenantId` in queries.

## Security Checklist

- [ ] All tables have `tenantId` column
- [ ] All queries filter by `tenantId`
- [ ] Controllers use `@Permissions()` decorator
- [ ] Prisma schema only targets `plugin_{id}` schema
- [ ] No raw SQL references to core schema tables
- [ ] No secrets or credentials in manifest or code
- [ ] Input validation on all endpoints

## Reference Implementation

See `plugins/oncology/` for a complete reference plugin with:
- Tumor staging, chemo protocols, chemo orders, tumor board
- Backend NestJS module with extension point registration
- Frontend pages with tabbed UI, data tables, and status badges
- Charting panel extension (staging summary)
- English and Arabic translations
