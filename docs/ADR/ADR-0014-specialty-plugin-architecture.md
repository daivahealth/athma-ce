# ADR-0014: Specialty Plugin Architecture

**Status:** Accepted  
**Date:** 2026-04-29  
**Deciders:** Engineering Team

## Context

athma-ce is an open-source healthcare platform that needs to support specialty-specific clinical modules (oncology, dental, cardiology, etc.) without coupling them into the core codebase. Community developers should be able to build, publish, and install specialty modules independently.

**Requirements:**
- Specialty modules must be independently developed and installed
- Modules must be enableable/disableable per tenant, facility, and role
- Modules must integrate with core clinical workflows (encounters, charting, orders)
- Multi-tenant safety, PHI isolation, and RBAC must be preserved
- The architecture must be accessible to open-source contributors

## Decision

We adopt an **embedded plugin architecture** where specialty modules are npm packages that load as dynamic NestJS modules inside the existing clinical service process.

### Key Design Choices

#### 1. Embedded over Microservice Deployment

Plugins load into the clinical service via `PluginLoaderModule.forRoot()` rather than running as separate services. This avoids infrastructure complexity while allowing plugins to share database connections and request context.

#### 2. Plugin Manifest (`athma-plugin.json`)

Each plugin declares its metadata, permissions, routes, config keys, and extension point contributions in a standardized manifest file. The manifest is the contract between a plugin and the platform.

#### 3. Database Schema Isolation

Plugins get their own PostgreSQL schema (e.g., `plugin_oncology`) within the existing clinical database. This provides isolation without requiring cross-database joins, while allowing plugins to reference core entities by UUID.

#### 4. Extension Point Registry

The `ExtensionRegistryService` allows plugins to register encounter types, note templates, observation codes, catalog entries, and charting panels. Core modules query this registry to discover plugin contributions.

#### 5. Event-Driven Integration

Core clinical services emit lifecycle events (`encounter.created`, `observation.created`, etc.) via `EventEmitter2`. Plugins subscribe to these events using `@OnEvent()` decorators.

#### 6. Config-Based Activation

Plugin activation leverages the existing three-tier config system (instance → tenant → facility). The `feature.nav.{pluginId}` config key controls visibility and access. A `PluginGuard` enforces activation at the API level.

#### 7. Frontend Plugin Registry

The frontend uses a build-time plugin discovery pattern. Plugins register navigation sections, page components, and encounter UI extension slots. The sidebar merges plugin navigation using the existing feature flag filtering.

## Consequences

**Positive:**
- Community developers can build specialty modules with clear contracts
- No infrastructure changes needed to add a specialty
- Full multi-tenant safety preserved via existing isolation layers
- Plugins can be developed, tested, and published independently

**Negative:**
- Plugins share the clinical service process — a buggy plugin can affect stability
- Build-time frontend discovery means plugins require a redeploy to activate
- Plugin database migrations must be carefully managed to avoid conflicts

**Mitigations:**
- Plugin validation at install time catches common issues
- Error boundaries in frontend extension slots isolate plugin UI failures
- Plugin schemas are namespaced to prevent table conflicts

## Key Files

- `backend/shared/plugin-sdk/` — Plugin SDK interfaces, guards, decorators
- `backend/shared/database-foundation/prisma/schema.prisma` — PluginRegistry, PluginActivation models
- `backend/services/foundation/src/modules/plugin/` — Plugin management API
- `backend/services/clinical/src/common/plugins/` — Plugin loader, extension registry
- `frontend/src/lib/plugins/` — Frontend plugin registry, hooks, extension slots
- `plugins/oncology/` — Reference oncology plugin implementation
