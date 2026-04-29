# Frontend Architecture Recommendation

**Project**: athma-ce  
**Status**: Active guidance aligned with current implementation  
**Last Updated**: April 29, 2026

## Summary

athma-ce should continue to use a single Next.js application with domain-oriented modules and shared application shell infrastructure.

That is also the architecture currently implemented in this repository.

## Why This Approach Fits athma-ce

- Healthcare workflows cross domain boundaries frequently, so a single authenticated shell keeps navigation and context management coherent.
- Tenant, facility, and user context are already centralized in shared frontend infrastructure.
- Shared UI primitives, form behavior, auth flows, and API client behavior are easier to keep consistent in one application.
- The existing repository already follows this pattern, so the guidance should reinforce it instead of describing a different structure.

## Current Implemented Shape

### App Router

Current top-level route structure:

```text
frontend/src/app/
  layout.tsx
  page.tsx
  [locale]/
    layout.tsx
    (dashboard)/
      layout.tsx
      page.tsx
      ...
    (clinical)/
      layout.tsx
      ...
```

This means:

- localization is handled at the `[locale]` segment
- authenticated pages are currently grouped primarily through `(dashboard)` and `(clinical)`
- older documentation that described `(foundation)` and `(rcm)` route groups as implemented structure is no longer accurate

### Domain Modules

Current module directories:

- `frontend/src/modules/clinical`
- `frontend/src/modules/foundation`
- `frontend/src/modules/membership`
- `frontend/src/modules/pharmacy`
- `frontend/src/modules/prm`
- `frontend/src/modules/rcm`
- `frontend/src/modules/reporting`
- `frontend/src/modules/semantic-search`
- `frontend/src/modules/wellness`

These are domain modules inside one app, not separate deployable frontends.

### Shared Frontend Infrastructure

Important shared areas:

- `frontend/src/components`
  shared UI and layout components
- `frontend/src/lib/api`
  shared Axios clients, base services, and client plumbing
- `frontend/src/lib/auth`
  token helpers and auth support
- `frontend/src/lib/stores`
  shared client state such as auth
- `frontend/src/lib/i18n`
  localization support

## API Client Architecture

The frontend currently uses dedicated Axios clients rather than a single generic endpoint:

- `foundationClient`
- `clinicalClient`
- `rcmClient`
- `rcmClaimsClient`
- `prmClient`
- `aiGatewayClient`

Default local base URLs:

- Foundation: `http://localhost:3010/api/v1`
- Clinical: `http://localhost:3011/api/v1`
- RCM: `http://localhost:3012/api/v1`
- PRM: `http://localhost:3013`
- AI Gateway: `http://localhost:3015/api/v1`

Shared interceptors attach:

- bearer auth
- `x-tenant-id`
- `x-user-id`
- `x-facility-id`

This shared client layer is the preferred integration path for new frontend code.

## Recommended Development Pattern

### Route and Module Responsibility Split

- Route files in `app/` should stay thin and compose module-level screens or flows.
- Domain-specific data access belongs in `frontend/src/modules/<domain>/services`.
- Domain hooks should live with their module when the concern is domain-specific.
- Cross-domain or app-shell concerns should stay in shared `components` or `lib`.

### State Management

- Use TanStack Query for server state and caching.
- Use shared stores only for client state that genuinely crosses screens, such as auth/session or shell state.
- Avoid duplicating server state in local stores unless there is a strong UX reason.

### UI Composition

- Reuse shared components before introducing feature-local primitives.
- Keep layout concerns in shared layout components.
- Keep branding, auth handling, and shell behaviors centralized.

## What Should Not Be Reintroduced

- Do not document or build the frontend as if each backend service requires its own independent frontend application.
- Do not bypass shared API clients for routine service access.
- Do not create route-group documentation that no longer matches the real `app/` tree.
- Do not treat foundation as running on port `3001`; the implemented foundation service runs on `3010`.

## When This Document Must Be Updated

Update this document when any of the following change:

- route-group structure in `frontend/src/app`
- the set of shared API clients
- frontend domain-module boundaries
- auth or tenant-context propagation behavior
- a decision to split the frontend into separate deployables

## Related Documents

- [Technical Architecture](./TECHNICAL-ARCHITECTURE.md)
- [Frontend Architecture Decision](./FRONTEND-ARCHITECTURE-DECISION.md)
- [Services Overview](../services/README.md)
