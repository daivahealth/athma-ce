# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zeal is a comprehensive healthcare platform providing Practice Management System (PMS), Electronic Health Record (EHR), and Electronic Content Management (ECM) capabilities for UAE healthcare providers. The system is built as a multi-tenant, multi-language (English/Arabic) platform with domain-driven architecture.

## Architecture

### Four-Database Domain Architecture (ADR-0013)

The system uses four PostgreSQL databases aligned with major business domains:

1. **zeal_foundation** - Tenancy, identity, RBAC, organizational hierarchy, facilities, staff, catalogs
2. **zeal_clinical** - Patient PHI, appointments, encounters, EHR, clinical notes, vitals, care plans
3. **zeal_rcm** - Revenue Cycle Management, billing, pharmacy, claims, payers, financial data
4. **zeal_analytics** - Audit logs, usage metrics, reporting aggregates (append-only)

**Critical Rules:**
- Direct SQL joins across databases are prohibited
- Cross-domain communication uses REST APIs or events
- Foundation database is the source of truth for master data (tenants, staff, facilities, catalogs)
- All services reference Foundation via IDs/events

### Service Structure

```
backend/
├── services/                    # Domain services (NestJS)
│   ├── foundation/              # Tenants, users, facilities, staff, RBAC
│   ├── clinical/                # Patient management, appointments, encounters
│   ├── pms/                     # Practice Management Service (minimal)
│   ├── rcm/                     # Revenue Cycle Management
│   └── [ai, audit, billing, integrations, notifications, reporting]/
├── shared/                      # Shared packages
│   ├── database-foundation/     # Prisma schema for Foundation DB
│   ├── database-clinical/       # Prisma schema for Clinical DB
│   ├── database-rcm/            # Prisma schema for RCM DB
│   ├── database-analytics/      # Prisma schema for Analytics DB
│   ├── utils/                   # Shared utilities
│   ├── middleware/              # Common middleware
│   └── types/                   # Shared TypeScript types
└── contracts/                   # Data Transfer Objects (DTOs) for cross-service communication

frontend/                        # Next.js 14 application (Single monolithic app with domain modules)
├── src/
│   ├── app/                     # App Router pages
│   │   ├── (clinical)/          # Clinical domain routes (patients, appointments, encounters)
│   │   ├── (rcm)/               # RCM domain routes (billing, claims, payments)
│   │   └── (foundation)/        # Foundation domain routes (users, facilities, settings)
│   ├── modules/                 # Domain-specific modules
│   │   ├── clinical/            # Clinical components, services, hooks, types
│   │   ├── rcm/                 # RCM components, services, hooks, types
│   │   └── foundation/          # Foundation components, services, hooks, types
│   ├── shared/                  # Shared across all domains
│   │   ├── components/          # Reusable UI components (shadcn/ui)
│   │   ├── lib/
│   │   │   ├── api/             # API clients (clinicalApi, rcmApi, foundationApi)
│   │   │   ├── auth/            # Authentication & JWT handling
│   │   │   └── tenant/          # Multi-tenancy context & management
│   │   ├── hooks/               # Shared custom hooks
│   │   └── types/               # Shared TypeScript types
│   └── store/                   # Global state (Zustand)
```

### Frontend Architecture (Monolithic with Domain Modules)

**Decision:** Single Next.js application with domain-based module structure (not micro-frontends)

**Rationale:**
- Healthcare workflows span multiple domains (Patient → Appointment → Bill)
- Unified user experience with seamless navigation
- Simplified authentication and multi-tenancy management
- Shared component library across all modules
- Faster development with single codebase
- Can evolve to micro-frontends later if needed

**Multi-Tenancy in Frontend:**
- TenantContext provider manages current tenant and facility
- API interceptors automatically inject headers to all requests:
  - `x-tenant-id`: Current tenant UUID
  - `x-user-id`: Logged-in user UUID (from JWT)
  - `x-facility-id`: Current facility UUID
  - `Authorization`: Bearer JWT token
- useTenant() hook provides tenant context throughout app
- Three separate API clients: clinicalApi, rcmApi, foundationApi

**Service-Specific API Clients:**
```typescript
clinicalApi    → http://localhost:3011/api/v1  (Patient, Appointment, Encounter)
rcmApi         → http://localhost:3012/api/v1  (Billing, Claims, Payment)
foundationApi  → http://localhost:3001/api/v1  (Users, Facilities, Settings)
```

**See:** `/docs/architecture/FRONTEND-ARCHITECTURE-RECOMMENDATION.md` for complete details

### Multi-Language Support (ADR-0004)

- Single `translations` table with entity-type mapping
- ISO 639-1 language codes (`en`, `ar`, `fr`)
- Fallback mechanism to English when translations missing
- Applies to patient data, staff info, clinical content, master data
- Frontend uses next-intl for UI translations

### Identity Management System

**Key Insight:** The platform uses a **country-agnostic identity system** to support global deployment.

**Database Schema:**
- `patients` table has generic identity fields:
  - `national_id` - Primary identity number (replaces UAE-specific `emirates_id`)
  - `national_id_type` - Type: 'emirates_id', 'aadhaar', 'passport', 'nric', etc.
  - `issuing_country` - ISO 3166-1 alpha-2 code (AE, IN, GB, SG, etc.)
- `patient_documents` table tracks all identity documents with verification status

**Tenant Configuration (Foundation DB):**
- Identity labels and requirements configured per tenant in `tenants.settings.identity_config`
- Allows customization: "Emirates ID" for UAE, "Aadhaar" for India, "Passport" for international
- Frontend automatically renders correct labels based on tenant config + i18n

**Validation Framework:**
- Pluggable validators in `backend/shared/validators/src/identity/`
- Registry pattern: `IdentityValidationRegistry.validate(country, type, value)`
- Country-specific rules:
  - UAE Emirates ID: Luhn checksum, format 784-YYYY-NNNNNNN-C
  - India Aadhaar: Verhoeff algorithm, 12 digits
  - Passport: Country-specific format validation

**See:** `/docs/IDENTITY-MANAGEMENT-SYSTEM.md` for complete documentation

## Development Commands

### Starting Services

**Full development environment:**
```bash
# Terminal 1 - Database
docker-compose up -d postgres

# Terminal 2 - Backend (Foundation service)
cd backend/services/foundation
npm run dev

# Terminal 3 - Backend (Clinical service)
cd backend/services/clinical
npm run dev

# Terminal 4 - Backend (RCM service) - optional
cd backend/services/rcm
npm run dev

# Terminal 5 - Frontend (when ready)
cd frontend
npm run dev
```

**Start specific services:**
```bash
# Foundation service (Users, Facilities, Auth)
npm run dev --workspace=@zeal/foundation

# Clinical service (Patients, Appointments, Encounters)
npm run dev --workspace=@zeal/clinical

# RCM service (Billing, Claims, Payments)
npm run dev --workspace=@zeal/rcm
```

### Service Ports
- Frontend: http://localhost:3000
- Backend (Foundation): http://localhost:3010
- Backend (Clinical): http://localhost:3011
- Backend (RCM): http://localhost:3012
- API Endpoints:
  - Foundation API: http://localhost:3010/api/v1
  - Clinical API: http://localhost:3011/api/v1
  - RCM API: http://localhost:3012/api/v1
- Prisma Studio: http://localhost:5555 (when running)
- pgAdmin: http://localhost:8080 (credentials in docker-compose.yml)

### Killing Processes

```bash
# Kill backend
pkill -f "tsx watch"

# Kill frontend
pkill -f "next dev"

# Kill both
pkill -f "tsx watch" && pkill -f "next dev"

# Force kill by port
lsof -ti:3002 | xargs kill -9  # backend
lsof -ti:3000 | xargs kill -9  # frontend
```

### Database Operations

**Prisma workflows:**
```bash
cd backend/shared/database-foundation  # or database-clinical, database-rcm, database-analytics
npx prisma generate                     # Generate Prisma Client
npx prisma db push                      # Push schema to database
npx prisma studio                       # Open Prisma Studio GUI
```

**Database seeding:**
```bash
cd seed
./run-seeds.sh foundation    # Master data & RBAC
./run-seeds.sh clinical      # Patient fixtures
./run-seeds.sh rcm           # Payer data
./run-seeds.sh analytics     # Audit data
```

**Environment variables required:**
- `FOUNDATION_DATABASE_URL`
- `CLINICAL_DATABASE_URL`
- `RCM_DATABASE_URL`
- `ANALYTICS_DATABASE_URL`

### Frontend Development

```bash
cd frontend
npm run dev           # Start development server
npm run build         # Production build
npm run lint          # ESLint
npm run lint:fix      # Fix linting issues
npm run format        # Prettier formatting
npm run test          # Run Vitest tests
npm run test:watch    # Watch mode
npm run storybook     # Start Storybook
npm run mock          # Generate mock data
```

### Backend Development

```bash
cd backend/services/[service-name]
npm run dev           # Start with ts-node and hot reload
npm run build         # Compile TypeScript
npm run start         # Run compiled code
npm run type-check    # Type checking without emitting
npm run clean         # Remove dist directory
```

## Key Technologies

**Backend:**
- NestJS (v7-10) - Framework for domain services
- Prisma - Database ORM (separate client per domain database)
- PostgreSQL 16 - Primary database
- Redis 7 - Caching layer
- TypeScript - Language
- Argon2 - Password hashing

**Frontend:**
- Next.js 14 - App Router (single monolithic app with domain modules)
- React 18 - UI library
- TypeScript - Type safety
- TanStack Query (React Query) - Server state management, caching
- Zustand - Client state management (lightweight, simple)
- Axios - HTTP client with interceptors for auth/tenant headers
- next-intl - Internationalization (English/Arabic UI)
- shadcn/ui - Component library (built on Radix UI primitives)
- Tailwind CSS - Utility-first styling
- Zod - Schema validation
- React Hook Form - Form state and validation
- Vitest - Unit testing framework

## Critical Development Patterns

### Database Isolation
When working with databases, always identify which domain database you're targeting:
- Foundation: Tenants, users, facilities, staff, roles, permissions
- Clinical: Patients, appointments, encounters, clinical notes
- RCM: Billing, claims, payers, pharmacy
- Analytics: Audit logs, metrics

### Cross-Service Communication
Never directly join across database boundaries. Instead:
1. Use REST APIs to fetch data from other domains
2. Cache frequently accessed reference data (e.g., facility names)
3. Use events for async workflows
4. Store foreign keys as UUIDs but resolve via API calls

### Multi-Tenancy (ADR-0003)

**Backend:**
All queries must be tenant-scoped:
- Every table (except Foundation master tables) includes `tenant_id`
- Prisma middleware automatically injects `tenantId` into all queries
- HTTP middleware validates and extracts tenant context from headers
- Required headers: `x-tenant-id`, `x-user-id`, `x-facility-id` (all must be valid UUIDs)
- Never expose cross-tenant data

**Frontend:**
All API requests automatically include tenant context:
- TenantContext provider manages current tenant/facility state
- API interceptors inject headers: `x-tenant-id`, `x-user-id`, `x-facility-id`, `Authorization`
- Use `useTenant()` hook to access current tenant context
- Tenant switcher component for multi-tenant users
- Three domain-specific API clients (clinicalApi, rcmApi, foundationApi) with automatic header injection

### RBAC (ADR-0005)
- Roles and permissions managed in Foundation database
- Services verify permissions via JWT claims or Foundation API
- Staff-User linking: Users may have `staff_id` for clinical staff associations

### Identity Document Management
When working with patient identity:
1. **Primary Identity**: Store in `patients.national_id` for fast lookups
2. **All Documents**: Track in `patient_documents` table with verification status
3. **Validation**: Always use `IdentityValidationRegistry` before saving
4. **Normalization**: Store validated, formatted values (e.g., `784-1990-1234567-8` not `784199012345678`)
5. **Labels**: Fetch from tenant config first, fallback to i18n translations
6. **Multi-Document**: Support multiple identity types per patient (national ID + passport + visa)

## Common Workflows

### Adding a New Backend Entity
1. Identify which domain database it belongs to
2. Add Prisma model to `backend/shared/database-{domain}/prisma/schema.prisma`
3. Add model to `TENANT_ISOLATED_MODELS` in tenant middleware
4. Run `npx prisma generate && npx prisma db push`
5. Create DTOs in service's `dto/` folder with validation
6. Implement service layer with CRUD operations
7. Create controller with decorators (`@TenantId()`, `@Context()`)
8. Register module in `app.module.ts`
9. Write tests (unit + integration)
10. Document API endpoints

**See:** `/docs/development/BACKEND-FEATURE-DEVELOPMENT-GUIDE.md` for detailed steps

### Adding a New Frontend Feature
1. Identify domain (Clinical, RCM, or Foundation)
2. Create API service in `src/modules/{domain}/services/`:
   ```typescript
   class EntityService extends BaseApiService<Entity> {
     constructor() {
       super(clinicalApi, '/entities');
     }
   }
   ```
3. Add TypeScript types in `src/modules/{domain}/types/`
4. Create components in `src/modules/{domain}/components/`
5. Add routes in `src/app/(domain)/entities/`
6. Use TanStack Query for data fetching:
   ```typescript
   const { data } = useQuery({
     queryKey: ['entities'],
     queryFn: () => entityService.findAll(),
   });
   ```
7. Forms use React Hook Form + Zod validation
8. All API calls automatically include tenant headers via interceptors

**See:** `/docs/architecture/FRONTEND-ARCHITECTURE-RECOMMENDATION.md` for examples

### Adding Translations
For any user-facing content requiring Arabic translation:
1. Store base text in English in the entity's primary table
2. Use `translations` table (in Foundation DB) for Arabic/other languages
3. Entity types: `patient`, `staff`, `facility`, `medication`, `clinical_note`, etc.
4. Use helper functions `get_translation()` and `set_translation()`

### Testing Database Connections
```bash
node test-connection.js
```

## Healthcare Compliance

### UAE
- Arabic language support mandatory (DHA/DOH/MOHAP regulations)
- Emirates ID validation for UAE nationals (Luhn checksum)
- PHI resides only in Clinical and RCM databases
- Audit logging in Analytics database for all clinical data access
- Monetary values in AED (UAE Dirham)

### Multi-Country Support
- Platform supports global deployment with country-specific identity validation
- Configurable per tenant: identity types, labels, validation rules
- See `/docs/IDENTITY-MANAGEMENT-SYSTEM.md` for adding new countries

## Documentation

### Architecture & Design (`/docs/architecture/`)
- **ADR-0001**: Language Split (English/Arabic)
- **ADR-0003**: Multi-Tenancy
- **ADR-0004**: Multi-Language Support
- **ADR-0005**: RBAC Access Control
- **ADR-0013**: Service Decomposition & Database Strategy
- **FRONTEND-ARCHITECTURE-RECOMMENDATION.md**: ⭐ Complete frontend architecture guide
- **FRONTEND-ARCHITECTURE-DECISION.md**: Frontend architecture decision rationale

### Multi-Tenancy (`/docs/multitenancy/`)
- **TENANT-ISOLATION-IMPLEMENTATION.md**: Backend tenant isolation (3-layer approach)
- **TENANT-ISOLATION-QUICK-REFERENCE.md**: Developer quick reference
- **API-AUTHENTICATION-CONTEXT.md**: Required headers and JWT structure

### Developer Guides (`/docs/development/`)
- **DEVELOPER-ONBOARDING.md**: ⭐ New developer onboarding (start here)
- **BACKEND-FEATURE-DEVELOPMENT-GUIDE.md**: ⭐ Step-by-step guide for new backend features
- **NEW-FEATURE-CHECKLIST.md**: Printable checklist for feature development
- **DEVELOPMENT-COMMANDS.md**: Common development commands

### Identity Management (`/docs/`)
- **IDENTITY-MANAGEMENT-SYSTEM.md**: Complete identity system (validation, labels, multi-country support)

### Database & Infrastructure (`/docs/infrastructure/database/`)
- **PRISMA-DATABASE-CONFIG.md**: Prisma configuration details
- **PGADMIN-CONNECTION-GUIDE.md**: Database GUI setup
- **seed/README.md**: Data seeding instructions

## Notes for Claude Code

- **Never use hardcoded paths**: Use relative paths from project root
- **Database changes**: Always run `npx prisma generate` after schema changes
- **Service dependencies**: Services depend on shared database packages via `file:../../shared/database-{domain}`
- **Port conflicts**: Check running processes with `lsof -i :PORT` before starting services
- **Cache issues**: Clear Next.js cache with `rm -rf frontend/.next` if frontend behaves unexpectedly
- **Seed data**: All seed UUIDs are fixed for consistent relationships across environments
