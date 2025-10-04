# Backend Technical Overview

## Architectural Structure

### Workspace Layout
- **services/** — domain-specific NestJS applications (`auth`, `pms`, etc.) written in TypeScript.
- **shared/** — reusable libraries: `shared-database` (Prisma client + helpers) and `shared-utils` (request context, permission cache).
- **contracts/** — shared Zod/TypeScript contracts exported as a library for request/response schemas.
- **turbo.json** (root) — turbo pipeline orchestrating builds/tests per workspace.

### Core Services
- **Auth Service (`services/auth`)**: NestJS service handling authentication, token issuance, basic MFA flows, and permission hydration.
- **PMS Service (`services/pms`)**: Entry point for practice-management APIs. Currently minimal (health endpoint) but scaffolded for future modules.
- **Other services (billing, rcm, etc.)**: Placeholders for domain-specific APIs following the same NestJS pattern.

### Shared Libraries
- **`@zeal/shared-database`**
  - Prisma-based data access utilities with `runWithRequestContext` enforcing tenant-aware transactions via Postgres `set_config`.
  - Transaction helpers (`transaction.ts`) consolidating retry logic, isolation levels.
  - Exports Nest `DatabaseModule` for easy injection across services.
- **`@zeal/shared-utils`**
  - AsyncLocalStorage-driven `RequestContext` capturing `tenantId`, `userId`, `userAgent` per request.
  - `permission-cache` providing in-memory role/permission caching with invalidation hooks.
- **`@zeal/contracts`**
  - Shared DTO/type library using Zod and TypeScript. Currently trimmed to core types/schemas consumed by services.

### Build & Tooling
- **TypeScript** strict mode with `exactOptionalPropertyTypes`, `isolatedModules`, `verbatimModuleSyntax=false` for CJS output.
- **NestJS** DI and module system, compiled to CommonJS for runtime compatibility.
- **TurboRepo** coordinates `npm run build` across workspaces; individual builds available via `npm run build --workspace=@zeal/<pkg>`.
- **Prisma** (in shared database) for data modeling and Postgres access.

### Cross-Cutting Concerns
- **Tenant Isolation**: `RequestContext` + Prisma `runWithRequestContext` ensures Postgres RLS policies act per request.
- **RBAC**: Auth service hydrates roles/permissions, caches them, and services (e.g., PMS) enforce permissions via guards and decorators.
- **Observability Hooks**: Shared utils capture userAgent, etc., priming future logging/metrics.

## Advantages

1. **Consistent NestJS Pattern**
   - Uniform module/controller/service structure simplifies onboarding.
   - Shared database module reduces boilerplate around Prisma clients.

2. **Tenant-Aware Transactions**
   - Centralized `runWithRequestContext` ensures RLS enforcement without duplicating logic in each service.
   - AsyncLocalStorage-based context is lightweight and works across async call chains.

3. **Shared Contracts & Utilities**
   - `@zeal/contracts` enables type-safe DTO reuse between services and clients.
   - Utilities (permission cache, request context) prevent code duplication and centralize critical logic.

4. **Modular Workspaces**
   - Each service/library can build independently, easing CI/CD and allowing parallel development.
   - Turbo pipeline coordinates builds but individual `npm run build --workspace` commands remain available.

5. **Strict TypeScript Configuration**
   - Early detection of missing tenant IDs, undefined fields, and mis-typed Prisma calls.
   - Encourages explicit handling of `unknown` errors and optional properties.

## Disadvantages / Trade-offs

1. **Strictness Noise**
   - `exactOptionalPropertyTypes` and strict mode surface numerous TypeScript errors during refactors (e.g., missing Prisma fields), requiring disciplined DTO design.

2. **Context Reliance**
   - AsyncLocalStorage-based context is powerful but requires every entry point (guards, controllers) to seed it correctly; missing setup can cause runtime errors.

3. **Turbo + Platform Friction**
   - TurboRepo requires access to macOS keychain for TLS (observed build blocker). Environment configuration must be handled (e.g., unlock keychain) before full builds.

4. **Shared Library Coupling**
   - Services depend on local file references (`file:../../shared/...`); during installation they require network access unless packages are pre-built. Recreating a service (like PMS) necessitates reinstalling dependencies.

5. **Minimal PMS Implementation**
   - Current PMS service is only a health endpoint; substantial functionality must be rebuilt. While the scaffold compiles, domain features (appointments, encounters) need reimplementation mindful of earlier TypeScript pitfalls.

## Recommended Next Steps

1. Reintroduce PMS domain modules incrementally, validating Prisma models and TypeScript types as they are added.
2. Automate `RequestContext` seeding in all services (e.g., global Nest middleware) to avoid manual guard wiring.
3. Address Turbo keychain issue to restore monorepo-wide builds.
4. Expand shared contracts to cover the rebuilt PMS endpoints, maintaining alignment between services and shared libs.
5. Add integration tests to ensure tenant isolation + RBAC guards behave as expected in each service.
