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

frontend/                        # Next.js 14 application
├── src/
│   ├── app/                     # App Router pages
│   ├── components/              # React components (Radix UI, shadcn/ui)
│   ├── lib/                     # Client utilities
│   ├── hooks/                   # Custom React hooks
│   └── providers/               # Context providers (React Query, Auth)
```

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

# Terminal 2 - Backend (Foundation/PMS service)
cd backend/services/pms
npm run dev

# Terminal 3 - Frontend
cd frontend
npm run dev
```

### Service Ports
- Frontend: http://localhost:3000
- Backend (PMS): http://localhost:3002
- API Base: http://localhost:3002/api/v1/pms
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
- Next.js 14 - App Router
- React 18 - UI library
- TanStack Query - Server state management
- Zustand - Client state management
- next-intl - Internationalization
- Radix UI - Headless component primitives
- Tailwind CSS - Styling
- Zod - Schema validation
- React Hook Form - Form management
- Vitest - Testing

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
All queries must be tenant-scoped:
- Every table (except Foundation master tables) includes `tenant_id`
- Use Prisma middleware or RLS policies for automatic tenant filtering
- Never expose cross-tenant data

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

### Adding a New Entity
1. Identify which domain database it belongs to
2. Add model to appropriate `backend/shared/database-{domain}/prisma/schema.prisma`
3. Run `npx prisma generate && npx prisma db push`
4. Create service module in appropriate service directory
5. Add DTOs to `backend/contracts/`
6. Implement frontend components and API integration

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

Key documents in `/docs`:
- **ADR-0001**: Language Split (English/Arabic)
- **ADR-0003**: Multi-Tenancy
- **ADR-0004**: Multi-Language Support
- **ADR-0005**: RBAC Access Control
- **ADR-0013**: Service Decomposition & Database Strategy
- **IDENTITY-MANAGEMENT-SYSTEM.md**: Complete identity system documentation (validation, labels, multi-country support)

Project-specific docs:
- `DEVELOPMENT-COMMANDS.md` - Detailed process management
- `PGADMIN-CONNECTION-GUIDE.md` - Database GUI setup
- `PRISMA-DATABASE-CONFIG.md` - Prisma configuration details
- `seed/README.md` - Data seeding instructions

## Notes for Claude Code

- **Never use hardcoded paths**: Use relative paths from project root
- **Database changes**: Always run `npx prisma generate` after schema changes
- **Service dependencies**: Services depend on shared database packages via `file:../../shared/database-{domain}`
- **Port conflicts**: Check running processes with `lsof -i :PORT` before starting services
- **Cache issues**: Clear Next.js cache with `rm -rf frontend/.next` if frontend behaves unexpectedly
- **Seed data**: All seed UUIDs are fixed for consistent relationships across environments
