# Repository Guidelines

## Project Structure & Domain Split
Zeal is a healthcare platform with strict domain boundaries (ADR-0013). Backend services sit in `backend/services/` (`foundation/` for tenancy & RBAC, `clinical/` for PHI, `rcm/` for billing). Shared Prisma packages and middleware live in `backend/shared/`. The Next.js app is under `frontend/` with domain modules in `src/modules/{foundation|clinical|rcm}` and App Router segments in `src/app/(domain)/`. SQL seeds per database reside in `seed/`. Architectural decisions and runbooks are documented in `docs/`.

## Build, Seed & Development Commands
- `docker-compose up -d postgres redis` – provision required services.
- `npm run dev --workspace=@zeal/foundation` / `@zeal/clinical` – start APIs on ports 3010/3011.
- `npm run build --workspace=@zeal/database-{foundation|clinical}` – regenerate Prisma clients after schema changes.
- `npx prisma db push --schema prisma/schema.prisma` – sync schema; run inside the relevant shared database package.
- `./seed/run-seeds.sh foundation` / `clinical` – stream SQL fixtures into `zeal_foundation` / `zeal_clinical` (no cross-db joins).
- `npm run dev --workspace=frontend` – launch the unified Next.js app with tenant-aware interceptors.

## Coding Style & Conventions
TypeScript code uses 2-space indent, ESLint, and Prettier. Follow NestJS layout: `controllers/`, `services/`, `dto/`, `guards/`. DTOs reference `@zeal/contracts`. Inject context with decorators (`@TenantId()`, `@FacilityId()`) instead of manual header parsing. Use kebab-case filenames, PascalCase classes, camelCase variables. Store secrets only in `.env` / `.env.example`.

## Testing Expectations
Backend tests run via `npm run test --workspace=@zeal/<service>` using Jest (`*.spec.ts`). Integration tests should exercise Prisma clients when models change. Frontend suites (React Testing Library) live alongside components. Document verification steps in PRs (commands executed, endpoints hit).

## Commit & Pull Request Process
Commits use conventional prefixes (`feat:`, `fix:`) and should stay domain-scoped. PRs must explain intent, list impacted services/packages, note schema or seed updates (`./seed/run-seeds.sh foundation`), and attach relevant API responses or UI screenshots. Link issues with `Fixes #123`. Never introduce cross-database SQL; use REST clients or events for inter-domain data.

## Security & Tenant Tips
PHI lives only in `zeal_clinical`; financial data in `zeal_rcm`; analytics/audit in `zeal_analytics`. Identity management rules are in `docs/IDENTITY-MANAGEMENT-SYSTEM.md`; store multiple IDs in `patient_documents`. All outbound requests must include `Authorization`, `x-tenant-id`, and (where needed) `x-facility-id`. Frontend API clients (`foundationApi`, `clinicalApi`, `rcmApi`) already attach these headers—reuse them rather than reimplementing fetch logic.
