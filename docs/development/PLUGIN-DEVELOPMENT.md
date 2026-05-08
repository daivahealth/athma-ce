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

#### Critical: UUID Parameters in `$queryRawUnsafe`

`$queryRawUnsafe` sends JavaScript string values with PostgreSQL's `text` OID (25). PostgreSQL has **no** implicit `uuid = text` operator, so every UUID parameter must be explicitly cast in the SQL string:

```sql
-- WHERE clauses
WHERE tenant_id = $1::uuid
AND patient_id = $2::uuid

-- INSERT VALUES
VALUES (gen_random_uuid(), $1::uuid, $2::uuid, ...)

-- UPDATE SET ... WHERE
WHERE id = $1::uuid AND tenant_id = $2::uuid
```

This applies to **all** UUID parameters in every clause — WHERE comparisons, INSERT values, and UPDATE assignments. Forgetting a single `::uuid` cast produces:
- `ERROR 42883: operator does not exist: uuid = text` (in WHERE)
- `ERROR 42804: column "X" is of type uuid but expression is of type text` (in INSERT/UPDATE)

**Alternative:** Use `$queryRaw` with template literal syntax. Template literal parameters are sent with OID 0 (unknown), which PostgreSQL coerces from context — no explicit `::uuid` casts needed. See [Prisma docs on queryRawUnsafe vs queryRaw](https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries).

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

## Deployment & Running

### Prerequisites

- Docker (for PostgreSQL and Redis)
- Node.js 20+
- npm

### Step 1: Start Infrastructure

```bash
cd backend
docker-compose up -d postgres redis
```

This starts PostgreSQL 16 (port 5432) and Redis 7 (port 6379). The init script creates the `zeal_foundation`, `zeal_clinical`, `zeal_rcm`, and `zeal_analytics` databases automatically.

### Step 2: Create the Plugin Database Schema

Each plugin uses an isolated PostgreSQL schema inside the target service's database. Create it before running migrations:

```bash
docker exec -it athma-postgres psql -U postgres -d zeal_clinical \
  -c "CREATE SCHEMA IF NOT EXISTS plugin_my_specialty;"
```

For the oncology plugin:

```bash
docker exec -it athma-postgres psql -U postgres -d zeal_clinical \
  -c "CREATE SCHEMA IF NOT EXISTS plugin_oncology;"
```

### Step 3: Run Foundation DB Migration

The `PluginRegistry` and `PluginActivation` tables must exist in the Foundation database:

```bash
cd backend/shared/database-foundation
npx prisma db push
```

### Step 4: Run Plugin DB Migration

Push the plugin's Prisma schema to create its tables inside the plugin schema.

**Option A — from the plugin directory** (requires `npm install` first to get Prisma 6.19):

```bash
cd plugins/my-specialty
npm install
npm run db:push
```

**Option B — from the backend directory** (uses the backend's Prisma CLI):

```bash
cd backend
npx prisma db push --schema ../plugins/my-specialty/backend/prisma/schema.prisma
```

> **Important:** Do not run bare `npx prisma db push` from a directory without a local Prisma installation. `npx` will download the latest Prisma (v7+), which is incompatible with the project's v6.19 schema format.

For the oncology plugin, this creates `cancer_diagnoses`, `tumor_stagings`, `tumor_board_cases`, `oncology_care_plans`, `chemo_protocols`, and `chemo_orders` tables in the `plugin_oncology` schema.

### Step 5: Start Backend Services

Start Foundation first (it manages the plugin registry), then Clinical (it auto-discovers plugins):

```bash
cd backend

# Foundation service (port 3010)
npm run dev --workspace=@zeal/foundation

# Clinical service (port 3011) — discovers and loads plugins at startup
npm run dev --workspace=@zeal/clinical
```

When the clinical service starts, the `PluginLoaderModule` will:
1. Scan the `plugins/` directory at the project root
2. Find any `athma-plugin.json` manifests
3. Filter for plugins targeting the `clinical` service
4. Load each plugin's NestJS module via `require()`
5. Call `onPluginInit()` to register extension points (encounter types, observation codes, charting panels)

You should see logs like:

```
[PluginLoaderModule] Discovered 1 clinical plugin(s)
[PluginLoaderModule] Loaded plugin 'oncology' v0.1.0
[PluginLoaderModule] Plugin extension summary: { "encounterTypes": 2, "observationCodes": 6, "chartingPanels": 1 }
```

### Step 6: Register the Plugin

Register the plugin in the Foundation service so it can be activated per tenant:

```bash
curl -X POST http://localhost:3010/api/v1/plugins/install \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -d '{"packagePath": "./plugins/my-specialty"}'
```

This does the following:
- Stores the manifest in the `PluginRegistry` table
- Seeds `configKeys` into `InstanceConfig` (e.g., `feature.nav.my-specialty = false`)
- Registers plugin permissions into the RBAC permission list

### Step 7: Activate for a Tenant

Enable the plugin for a specific tenant:

```bash
curl -X PUT http://localhost:3010/api/v1/plugins/my-specialty/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -d '{"tenantId": "<tenant-uuid>"}'
```

This sets `feature.nav.my-specialty = true` in the tenant's config, making the module visible to users in that tenant.

### Step 8: Assign Permissions to Roles

Use the existing RBAC system to grant plugin permissions to the appropriate roles. For oncology:

| Permission | Description |
|---|---|
| `oncology.diagnosis.read` | View cancer diagnoses |
| `oncology.diagnosis.write` | Create/edit cancer diagnoses |
| `oncology.registry.read` | View oncology registry (aggregated patient view) |
| `oncology.staging.read` | View tumor staging records |
| `oncology.staging.write` | Create/edit tumor staging |
| `oncology.tumor_board.read` | View tumor board cases |
| `oncology.tumor_board.manage` | Create/manage tumor board cases |
| `oncology.care_plan.read` | View oncology care plans |
| `oncology.care_plan.write` | Create/edit care plans |
| `oncology.care_plan.approve` | Approve care plans (sets status to active) |
| `oncology.chemo_protocol.read` | View chemo protocols (Phase 2) |
| `oncology.chemo_protocol.write` | Create/edit chemo protocols (Phase 2) |
| `oncology.chemo_order.read` | View chemo orders (Phase 2) |
| `oncology.chemo_order.write` | Create/submit chemo orders (Phase 2) |

### Step 9: Start the Frontend

```bash
cd frontend
npm run dev
```

Once the `feature.nav.my-specialty` flag is enabled for the tenant, the plugin's navigation section will appear in the sidebar. Plugin pages are served via the catch-all route at `/plugins/[...pluginPath]`.

### Verification

After completing all steps, verify the plugin is working:

1. **Backend loaded**: Check clinical service startup logs for `Loaded plugin 'my-specialty'`
2. **API accessible**: `GET http://localhost:3011/api/v1/plugins/my-specialty/...` returns data (with valid auth headers)
3. **Frontend visible**: Log in as a user in the activated tenant — the plugin's sidebar section should appear
4. **Permissions enforced**: Users without assigned plugin permissions should receive 403 responses

## Installation Methods

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

The loader also scans `node_modules/@athma-plugins/` for published plugins.

### Custom Directory

Set the `ATHMA_PLUGIN_DIR` environment variable to load plugins from an arbitrary location:

```bash
ATHMA_PLUGIN_DIR=/path/to/my-plugins npm run dev --workspace=@zeal/clinical
```

## Deactivation

To disable a plugin for a tenant:

```bash
curl -X PUT http://localhost:3010/api/v1/plugins/my-specialty/deactivate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -d '{"tenantId": "<tenant-uuid>"}'
```

This sets `feature.nav.my-specialty = false` for the tenant. The plugin's sidebar section will disappear and API endpoints will return 403. Plugin data is preserved in the database.

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

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Plugin not discovered at startup | Wrong directory or missing `athma-plugin.json` | Ensure the plugin is in `plugins/`, `node_modules/@athma-plugins/`, or `ATHMA_PLUGIN_DIR` with a valid manifest |
| `Skipping plugin` warning in logs | Manifest parse error, module import failure, or TypeScript compile error during `require()` | Check the manifest JSON, the `moduleEntrypoint` path, and for any `tsc` type errors in the plugin (`npm run type-check`) — the loader swallows all exceptions silently |
| All plugin routes return 404 | TypeScript error in plugin code caused `require()` to throw, and the loader skipped the plugin silently | Run `npm run type-check --workspace=@zeal/clinical` (or `tsc --noEmit` from the plugin's backend dir) to surface compile errors |
| Sidebar section not showing | Feature flag not enabled for tenant | Activate the plugin via `PUT /plugins/:id/activate` with the tenant ID |
| 403 on plugin API endpoints | Plugin not activated or permissions not assigned | Check tenant activation and role permissions |
| Database errors (relation does not exist) | Plugin schema or tables not created | Run `CREATE SCHEMA` and `prisma db push` for the plugin |
| Module import errors (`Cannot find module`) | Path alias not configured | Ensure `@athma/plugin-sdk` is mapped in the clinical service's `tsconfig.json` |
| `ERROR 42883: operator does not exist: uuid = text` | `$queryRawUnsafe` sends strings as text OID — PostgreSQL has no `uuid = text` operator | Add `::uuid` to every UUID parameter in WHERE clauses: `WHERE tenant_id = $1::uuid AND id = $2::uuid` |
| `ERROR 42804: column "X" is of type uuid but expression is of type text` | Same root cause in INSERT VALUES or UPDATE SET positions | Add `::uuid` to every UUID parameter in INSERT/UPDATE: `VALUES ($1::uuid, $2::uuid, ...)` |
| TypeScript error `Type 'string \| undefined' is not assignable` | `exactOptionalPropertyTypes: true` — `@Query()` returns `string \| undefined` but the service filter type uses `prop?: string` | Add `\| undefined` to all optional filter properties: `{ patientId?: string \| undefined }` |

## Reference Implementation

See `plugins/oncology/` for a complete reference plugin with:
- Cancer Diagnosis (anchor record), Tumor Staging, Tumor Board, Oncology Care Plan (Phase 1)
- Chemo Protocols, Chemo Orders (Phase 2 — in schema, hidden from nav)
- Backend NestJS module with extension point registration and raw SQL via `$queryRawUnsafe` with `::uuid` casts
- Frontend pages with data tables, slide-over forms, and status/intent badges
- Charting panel extension (oncology diagnosis summary card in encounter charting)
- English and Arabic translations

See [ONCOLOGY-PLUGIN.md](../features/oncology/ONCOLOGY-PLUGIN.md) for detailed feature documentation and [ONCOLOGY-API-ENDPOINTS.md](../api/ONCOLOGY-API-ENDPOINTS.md) for the full API reference.
