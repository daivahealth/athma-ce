# Frontend Architecture Decision

**Date**: 2025-10-25
**Status**: Recommended
**Decision Makers**: Development Team

## Decision

**Build a single monolithic Next.js application with domain-based module structure**

## Context

The athma-ce platform has:
- 4 separate backend databases (Foundation, Clinical, RCM, Analytics)
- 3 NestJS microservices with clear domain boundaries
- Multi-tenant architecture requiring consistent context across all operations
- Healthcare workflows that span multiple domains (Patient → Appointment → Billing)

## Options Considered

### Option 1: Monolithic Frontend with Domain Modules ✅ SELECTED

**Structure**: Single Next.js app with `/modules/clinical`, `/modules/rcm`, `/modules/foundation`

**Pros**:
- ✅ Unified user experience for healthcare workflows
- ✅ Simplified authentication and tenant context management
- ✅ Easy component reuse across domains
- ✅ Single deployment and build process
- ✅ Faster development initially
- ✅ Easier to maintain with small team
- ✅ Can evolve to micro-frontends later

**Cons**:
- ❌ Larger bundle size
- ❌ Potential coupling between modules
- ❌ All domains must deploy together

### Option 2: Micro-Frontends (Separate Apps)

**Structure**: Separate Next.js apps for Clinical and RCM with shell app for routing

**Pros**:
- ✅ Independent deployment per domain
- ✅ Clear technical boundaries
- ✅ Team autonomy
- ✅ Smaller bundle size per app

**Cons**:
- ❌ Complex shared state management
- ❌ Duplicate authentication logic
- ❌ Inconsistent UX without careful coordination
- ❌ More infrastructure and DevOps overhead
- ❌ Slower initial development
- ❌ Difficult with small team

### Option 3: Hybrid (Monolith + Embedded Micro-Apps)

**Structure**: Main app with embedded micro-apps for specific features

**Pros**:
- ✅ Best of both worlds for specific use cases
- ✅ Can isolate complex features

**Cons**:
- ❌ Highest complexity
- ❌ Overkill for current scale
- ❌ Requires module federation setup

## Decision Rationale

### Why Monolithic Frontend?

1. **Workflow Continuity**
   - Healthcare workflows naturally span multiple domains
   - Example: Patient registration → Appointment scheduling → Billing
   - Keeping these in one app provides seamless UX

2. **Multi-Tenancy Consistency**
   - Single authentication context
   - Centralized tenant management
   - Consistent header injection across all API calls
   - One place to manage tenant switching

3. **Development Efficiency**
   - Small development team (currently)
   - Faster time to market
   - Easier onboarding for new developers
   - Single codebase to understand

4. **Code Reuse**
   - Shared components (tables, forms, modals)
   - Common utilities (date formatting, validation)
   - Single API client configuration
   - Shared state management patterns

5. **Technical Simplicity**
   - No module federation complexity
   - No shell app coordination
   - Standard Next.js routing
   - Easier debugging and testing

6. **Future Flexibility**
   - Clear module boundaries allow future extraction
   - Can evolve to micro-frontends if needed
   - No rewrite required for evolution

## Architecture Highlights

### Domain Modules

```
/modules
  /clinical       - Patient, Appointment, Encounter management
  /rcm            - Billing, Claims, Payment processing
  /foundation     - Users, Facilities, Settings
```

Each module is self-contained with its own:
- Components
- Services (API calls)
- Types
- Hooks
- Utilities

### Shared Layer

```
/shared
  /components     - Reusable UI components
  /lib            - Core utilities (auth, tenant, API)
  /hooks          - Common hooks
  /types          - Shared TypeScript types
```

Provides common functionality used across all modules.

### Multi-Tenancy

Centralized in `/shared/lib/tenant/`:
- TenantContext provider
- useTenant hook
- Automatic header injection via API interceptors
- Tenant switcher component

### Authentication

Centralized in `/shared/lib/auth/`:
- AuthContext provider
- JWT token management
- Protected route wrapper
- Auto-refresh on token expiry

## Technology Decisions

| Category | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14+ (App Router) | Server components, built-in routing, API routes |
| Language | TypeScript | Type safety, better DX, catches errors early |
| UI Library | React 18+ | Industry standard, team familiarity |
| Styling | Tailwind CSS + shadcn/ui | Fast development, consistent design system |
| State | Zustand | Lightweight, simple API, better than Redux for this scale |
| Forms | React Hook Form + Zod | Performance, validation, type safety |
| API Client | Axios | Interceptors for auth/tenant, widespread support |
| Data Fetching | TanStack Query | Caching, background updates, optimistic updates |

## Implementation Plan

### Phase 1: Foundation (Week 1-2)
- [ ] Initialize Next.js project
- [ ] Setup Tailwind CSS and shadcn/ui
- [ ] Implement authentication (login, JWT, protected routes)
- [ ] Implement multi-tenancy (context, interceptors)
- [ ] Build shared components (Button, Input, Table, Modal)
- [ ] Create API client with interceptors

### Phase 2: Clinical Module (Week 3-4)
- [ ] Patient management (list, create, edit, view)
- [ ] Patient search and filtering
- [ ] Patient history view
- [ ] Basic appointment scheduling

### Phase 3: RCM Module (Week 5-6)
- [ ] Invoice management
- [ ] Payment processing
- [ ] Claims tracking

### Phase 4: Foundation Module (Week 7-8)
- [ ] User management
- [ ] Facility management
- [ ] Settings and configuration
- [ ] Role-based access control UI

### Phase 5: Polish & Deploy (Week 9-10)
- [ ] Testing (unit, integration, E2E)
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Documentation
- [ ] CI/CD pipeline
- [ ] Production deployment

## Success Metrics

1. **Development Velocity**
   - Time to implement new feature: < 2 days
   - Time to onboard new developer: < 1 week

2. **Performance**
   - Initial page load: < 2 seconds
   - Time to interactive: < 3 seconds
   - Bundle size: < 500KB (main)

3. **Code Quality**
   - Test coverage: > 80%
   - TypeScript strict mode: Enabled
   - Zero console errors in production

4. **User Experience**
   - Consistent design across modules
   - Seamless navigation between domains
   - Fast search and filtering: < 500ms

## Evolution Path

If/when you need micro-frontends:

```
Current State:
  Single Next.js app with domain modules

Step 1: Package Shared Components
  Extract /shared to npm package

Step 2: Module Federation
  Implement Webpack Module Federation
  Keep single deployment

Step 3: Separate Repositories
  Split modules into separate repos
  Still single deployment via shell

Step 4: Independent Deployment
  Separate CI/CD per module
  True micro-frontends
```

Current architecture supports this evolution without requiring a rewrite.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Large bundle size | Code splitting, lazy loading, tree shaking |
| Module coupling | Enforce module boundaries with ESLint rules |
| Slow build times | Next.js incremental builds, caching |
| Testing complexity | Modular test structure, mocked API layer |
| Performance degradation | Performance monitoring, bundle analysis |

## Decision Review

**Review Date**: 2026-01-25 (3 months from now)

**Criteria for Reconsidering**:
- Team grows to 15+ developers
- Need independent deployment cycles per domain
- Bundle size exceeds 5MB
- Performance issues that can't be resolved
- Regulatory requirements for separate deployments

## References

- [Full Architecture Document](./FRONTEND-ARCHITECTURE-RECOMMENDATION.md)
- [Backend Architecture](./MULTI-TENANT-ARCHITECTURE.md)
- [Multi-Tenancy Implementation](../multitenancy/TENANT-ISOLATION-IMPLEMENTATION.md)
- [API Authentication Context](../api/API-AUTHENTICATION-CONTEXT.md)

---

**Status**: Approved for Implementation
**Next Steps**: Begin Phase 1 (Foundation setup)
