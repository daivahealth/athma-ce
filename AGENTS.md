# AGENTS.md - Zeal Healthcare Platform

Guidelines for AI coding agents working in this repository.

## Project Structure

```
zeal/
├── backend/
│   ├── services/           # NestJS microservices
│   │   ├── foundation/     # Auth, RBAC, tenants, users (port 3010)
│   │   ├── clinical/       # Patients, encounters, scheduling (port 3011)
│   │   ├── rcm/            # Billing, claims, insurance (port 3012)
│   │   └── prm/            # Patient engagement (port 3013)
│   ├── shared/             # Shared packages
│   │   ├── database-*/     # Prisma clients per domain
│   │   ├── utils/          # RequestContext, middleware
│   │   └── types/          # Shared type definitions
│   └── contracts/          # Shared DTOs and Zod schemas (@zeal/contracts)
├── frontend/               # Next.js 14 App Router
│   └── src/
│       ├── app/            # Route segments: (auth), (clinical), (dashboard)
│       ├── modules/        # Domain modules: clinical/, foundation/, rcm/, prm/
│       ├── components/     # Shared UI (shadcn/ui)
│       └── lib/            # API clients, stores, utilities
├── seed/                   # SQL seed files per database
└── docs/                   # Architecture, ADRs, runbooks
```

## Build & Development Commands

### Backend (run from `backend/`)
```bash
docker-compose up -d postgres redis           # Start infrastructure
npm install                                   # Install dependencies
npm run build --workspace=@zeal/database-foundation  # Regenerate Prisma after schema changes
npx prisma db push --schema prisma/schema.prisma     # Push schema (run in database pkg dir)
npm run dev --workspace=@zeal/foundation      # Start Foundation (port 3010)
npm run dev --workspace=@zeal/clinical        # Start Clinical (port 3011)
npm run type-check --workspace=@zeal/foundation      # Type checking
```

### Frontend (run from `frontend/`)
```bash
npm run dev          # Port 3000
npm run build        # Production build
npm run lint:fix     # Auto-fix linting issues
npm run format       # Prettier
```

### Testing
```bash
# Frontend (Vitest)
npm run test                           # Run all tests once
npm run test:watch                     # Watch mode
npx vitest run src/path/to/file.test.ts  # Single test file
npx vitest run -t "test name"          # Single test by name

# Backend (Jest) - currently minimal test coverage
npm run test --workspace=@zeal/foundation
```

### Database Seeding
```bash
./seed/run-seeds.sh foundation   # Seed zeal_foundation
./seed/run-seeds.sh clinical     # Seed zeal_clinical
```

## Code Style Guidelines

### General
- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Trailing commas**: Required (ES5 style)
- **Line length**: 100 characters max
- **File naming**: kebab-case (`patient-service.ts`, `use-patients.ts`)

### TypeScript
- **Strict mode** enabled with `noImplicitAny`, `strictNullChecks`
- Use `type` imports: `import type { Patient } from './types'`
- Prefer interfaces for object shapes, types for unions/intersections
- Avoid `any`; use `unknown` and narrow with type guards
- Use nullish coalescing (`??`) over logical OR for defaults

### Naming Conventions
| Entity | Convention | Example |
|--------|------------|---------|
| Files | kebab-case | `patient-service.ts` |
| Classes | PascalCase | `PatientService` |
| Interfaces/Types | PascalCase | `CreatePatientDto` |
| Functions/Variables | camelCase | `getPatientById` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| React Components | PascalCase | `PatientForm` |
| React Hooks | camelCase with `use` prefix | `usePatients` |

### Imports Order
```typescript
// 1. External packages
import { Injectable } from '@nestjs/common';
// 2. Internal packages (@zeal/*)
import type { Patient } from '@zeal/contracts';
// 3. Relative imports (parent first, then siblings)
import { RequestContext } from '../../common/context';
```

## Backend Patterns (NestJS)

- Use `@ApiTags`, `@ApiOperation`, `@ApiResponse` decorators on controllers
- DTOs reference `@zeal/contracts` for shared types
- Use context decorators (`@TenantId()`, `@FacilityId()`, `@UserId()`) instead of manual header parsing
- Services inject `PrismaService` and always filter by `tenantId`
- Use NestJS exceptions: `BadRequestException`, `NotFoundException`, `UnauthorizedException`
- Global exception filter handles Prisma errors automatically
- Log errors with context: `logger.error({ tenantId, userId }, 'Error message')`

## Frontend Patterns (Next.js + React Query)

- Services extend `BaseApiService` and export singleton instances
- Use query key factories: `PATIENT_KEYS.list(params)`, `PATIENT_KEYS.detail(id)`
- React Query hooks wrap services with `useQuery`/`useMutation`
- Set appropriate `staleTime` (30s for lists, 60s for details)
- Invalidate queries on mutations using `queryClient.invalidateQueries()`
- API clients (`foundationApi`, `clinicalApi`, `rcmApi`) already attach auth headers

## Error Handling

- **Backend**: NestJS exceptions auto-handled by global filter; Prisma errors mapped to HTTP
- **Frontend**: API interceptors handle 401 (redirect to login), mutations use `onError` for toasts

## Security & Multi-Tenancy

### Critical Rules
1. **PHI isolation**: Patient data only in `zeal_clinical` database
2. **No cross-database joins**: Use REST APIs for inter-service data
3. **Required headers**: `Authorization`, `x-tenant-id`, `x-facility-id` on all requests
4. **Use existing API clients** - they already attach required headers

### Row-Level Security
All tables include `tenant_id` with RLS policies enforced at database level.

## Commit & PR Guidelines

### Commit Messages
Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
```
feat(clinical): add patient history tracking
fix(foundation): resolve RBAC permission caching issue
```

### Pull Requests
- Explain intent and list impacted services
- Note schema changes and required seed updates
- Include API responses or UI screenshots
- Link issues: `Fixes #123`

## Key Files Reference
- **Prisma schemas**: `backend/shared/database-*/prisma/schema.prisma`
- **API clients**: `frontend/src/lib/api/client.ts`
- **Auth store**: `frontend/src/lib/stores/auth-store.ts`
- **Shared types**: `backend/contracts/src/types/`
- **ADRs**: `docs/adr/` (especially ADR-0013 for service decomposition)
