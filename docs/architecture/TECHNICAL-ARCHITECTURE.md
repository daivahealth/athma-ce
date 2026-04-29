# athma-ce Technical Architecture

![Status](https://img.shields.io/badge/Status-Active-success)
![Focus](https://img.shields.io/badge/Scope-Current%20Implementation-blue)

**Last Updated**: April 29, 2026  
**Document Owner**: Engineering Team  
**Audience**: Engineers, architects, and AI coding agents

## Purpose

This document describes the architecture that is implemented in the `athma-ce` repository today. It replaces older descriptions that mixed current implementation with planned target-state architecture.

When this document and the code disagree, treat the code as the source of truth and update this file in the same change.

## 1. System Summary

athma-ce is a multi-tenant healthcare platform that combines:

- Practice management and foundation/master-data workflows
- Clinical and EHR workflows
- Revenue cycle and pharmacy workflows
- Patient relationship management workflows
- AI-assisted reporting and semantic search

The current repository is organized as:

- A single Next.js frontend in `frontend/`
- Multiple NestJS backend services in `backend/services/`
- Per-domain Prisma/database packages in `backend/shared/database-*`
- Shared contracts, utilities, observability, and config packages in `backend/shared/`

## 2. Implemented Topology

### 2.1 Runtime Overview

```text
Users
  |
  v
Next.js frontend (:3000)
  |
  +--> Foundation API (:3010, /api/v1)
  +--> Clinical API (:3011, /api/v1)
  +--> RCM API (:3012, /api/v1)
  +--> PRM API (:3013, mixed /v1 style)
  +--> AI Gateway API (:3015, /api/v1)

Shared infrastructure
  - PostgreSQL (:5432)
  - Redis (:6379)
  - pgAdmin (:8080)
  - RedisInsight (:5540)
```

### 2.2 Important Current-State Clarifications

- The frontend currently calls services directly through service-specific API clients.
- The repository does not currently run a local API gateway or unified edge router in `docker-compose.yml`.
- The implemented backend topology is not a single monolith and not the older four-database model described in some legacy docs.
- PRM is implemented as its own service with its own database package.
- AI workloads are implemented in a separate `ai-gateway` service.

## 3. Backend Architecture

### 3.1 Service Inventory

| Service | Port | Global Prefix / Docs | Primary Responsibility |
| --- | --- | --- | --- |
| Foundation | `3010` | `/api/v1`, Swagger at `/api/docs` | Auth, tenancy, users, facilities, staff, RBAC, organizational master data |
| Clinical | `3011` | `/api/v1` | Patients, encounters, charting, scheduling, observations, inpatient, wellness-related clinical workflows |
| RCM | `3012` | `/api/v1` | Billing, claims, remittance, insurance, eligibility, preauth, membership-related RCM workflows, pharmacy-financial workflows |
| PRM | `3013` | service-specific routes, Swagger at `/api-docs` | Patient engagement, rules, templates, tasks, provider callbacks, event ingestion |
| AI Gateway | `3015` | `/api/v1`, Swagger at `/api/docs` | Report builder, semantic search, AI audit and related AI orchestration |

### 3.2 Shared Backend Packages

| Package | Purpose |
| --- | --- |
| `backend/shared/database-foundation` | Prisma client and schema for foundation data |
| `backend/shared/database-clinical` | Prisma client and schema for clinical data |
| `backend/shared/database-rcm` | Prisma client and schema for RCM data |
| `backend/shared/database-prm` | Prisma client and schema for PRM data |
| `backend/shared/database-analytics` | Analytics-oriented schema/package used by AI and reporting workloads |
| `backend/shared/observability` | Logging, tracing, metrics, NestJS observability helpers |
| `backend/shared/utils` | Shared backend helpers |
| `backend/shared/types` | Shared backend type definitions |
| `backend/shared/config-client` | Shared configuration access |

### 3.3 Domain Boundaries

Current service boundaries in code:

- Foundation owns identity and tenant-scoped reference data such as users, facilities, departments, wards, beds, clinics, specialties, staff, and configuration.
- Clinical owns patient and encounter workflows such as scheduling, charting, observations, consent, inpatient operations, and reporting inputs tied to clinical records.
- RCM owns financial workflows such as claims, billing, remittance, policies, payer contracts, catalog mappings, charge posting, and related ledger operations.
- PRM owns engagement automation and patient outreach workflows.
- AI Gateway owns report-builder and semantic-search capabilities rather than embedding those concerns into the domain services directly.

### 3.4 Communication Pattern

Implemented communication patterns today:

- Frontend to backend: HTTP calls through Axios clients in `frontend/src/lib/api/client.ts`
- Service to database: service-local Prisma access through the matching `database-*` package
- Cross-domain coordination: primarily HTTP/service APIs and shared identifiers
- Shared schemas/types: package-level sharing through `@zeal/*` packages and repo-local contracts/patterns

Notably, the repo should not be documented as relying on direct cross-database joins for domain integration.

## 4. Data Architecture

### 4.1 Current Database Model

The current repository reflects a domain-oriented database layout:

| Database Package | Intended Data Ownership |
| --- | --- |
| Foundation | tenancy, identity, RBAC, facilities, staff, master/reference configuration |
| Clinical | PHI, patients, appointments, encounters, charting, inpatient workflows |
| RCM | billing, claims, coverage, remittance, finance-related operational data |
| PRM | engagement workflows, rules, templates, queue/task-oriented PRM data |
| Analytics | AI/reporting-oriented or aggregated analytical data where applicable |

### 4.2 Data Governance Rules

- Tenant context is carried through request headers and claims.
- Cross-database joins should be avoided; domain integration should happen through APIs, identifiers, and controlled data movement.
- PHI-heavy workflows remain in clinical and adjacent clinical-service boundaries.
- Shared master/reference data is anchored in foundation rather than duplicated arbitrarily.

### 4.3 Tenant Context

The frontend API client currently injects:

- `Authorization`
- `x-tenant-id`
- `x-user-id`
- `x-facility-id`

Those headers are part of the implemented request contract and must be preserved when changing shared clients or adding services.

## 5. Frontend Architecture

### 5.1 Frontend Shape

The frontend is a single Next.js App Router application in `frontend/`.

Key characteristics visible in the current codebase:

- Localized route shell under `frontend/src/app/[locale]`
- Authenticated route groups organized as `(dashboard)` and `(clinical)`
- Domain modules under `frontend/src/modules/`
- Shared API clients and auth/session logic under `frontend/src/lib/`
- Shared UI and layout components under `frontend/src/components/`

### 5.2 Current Route-Level Structure

Top-level route structure currently implemented:

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

This is materially different from older documentation that described separate `(foundation)` and `(rcm)` route groups as if they already existed.

### 5.3 Frontend Domain Modules

Current module directories include:

- `clinical`
- `foundation`
- `membership`
- `pharmacy`
- `prm`
- `rcm`
- `reporting`
- `semantic-search`
- `wellness`

These modules are consumed within the shared application shell rather than deployed as separate frontends.

### 5.4 API Client Topology

The frontend currently defines distinct Axios clients for:

- Foundation
- Clinical
- RCM
- RCM Claims
- PRM
- AI Gateway

Base URLs default to:

- Foundation: `http://localhost:3010/api/v1`
- Clinical: `http://localhost:3011/api/v1`
- RCM: `http://localhost:3012/api/v1`
- PRM: `http://localhost:3013`
- AI Gateway: `http://localhost:3015/api/v1`

## 6. Security Architecture

### 6.1 Implemented Security Controls

- JWT-based authentication via foundation/auth flows
- Tenant-scoped request headers
- Facility-scoped request context where required
- Service-level validation pipes in NestJS
- Shared observability and logging packages
- CORS configuration on each backend service

### 6.2 Multitenancy Expectations

- Foundation remains the anchor for tenant and user identity.
- Services must continue to enforce tenant-scoped access.
- Shared frontend clients should be preferred over one-off HTTP code because they already attach tenant and auth context.

## 7. Local Infrastructure

The root `docker-compose.yml` currently provisions:

- PostgreSQL
- Redis
- pgAdmin
- RedisInsight

It does not currently provision:

- A local API gateway
- Kafka or another event bus
- A full production-grade observability stack
- Kubernetes deployment primitives

Those may still exist as future or environment-specific concerns, but they should not be documented here as current local architecture without matching implementation.

## 8. Observability

The repository includes a shared observability package:

- `backend/shared/observability`

Implemented patterns in code include:

- shared logger setup
- tracing bootstrap
- metrics helpers
- NestJS request logging middleware/module support

This document intentionally stops short of claiming a fully provisioned Prometheus/Grafana/Loki/Tempo deployment unless the corresponding runtime/infrastructure docs are updated to match.

## 9. Current Gaps Between Older Docs and Code

The following older assumptions were inaccurate for the implemented repo and are now corrected here:

- "Four databases" as the active architecture
- API gateway as a required current hop for all traffic
- frontend route groups split into `(foundation)` and `(rcm)` as implemented structure
- foundation on port `3001`
- generic "microservices" descriptions that omitted PRM and AI Gateway

## 10. Planned vs Implemented Guidance

When documenting architecture in this repository:

- mark implemented behavior as current state
- mark target-state ideas as planned
- do not present proposed gateway, deployment, or data-platform topology as already deployed unless backed by code or infra
- update ADRs when the implementation materially moves past the original decision text

## 11. Related Documentation

- [Architecture README](./README.md)
- [Frontend Architecture Recommendation](./FRONTEND-ARCHITECTURE-RECOMMENDATION.md)
- [Backend Architecture](./BACKEND-ARCHITECTURE.md)
- [ADR-0013 Service Decomposition](../ADR/ADR-0013-service-decomposition.md)
- [Services Overview](../services/README.md)
