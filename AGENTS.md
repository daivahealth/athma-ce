# Repository Guidelines

## Project Structure & Module Organization
Monorepo root contains `backend/`, `frontend/`, `seed/`, `docs/`, and `init-scripts/`. Backend services live under `backend/services/` (e.g., `@zeal/foundation`, `@zeal/clinical`) and share Prisma packages in `backend/shared/database-*`. React/Next code resides in `frontend/`. SQL fixtures for domain databases are under `seed/`, while high-level design references sit in `docs/`. Use workspace-relative paths (e.g., `backend/services/foundation/src/...`) when referencing files in issues or PRs.

## Build, Test, and Development Commands
- `npm run dev --workspace=@zeal/foundation` – starts the NestJS foundation API on port 3010.
- `npm run dev --workspace=@zeal/clinical` – runs the clinical service locally on port 3011.
- `npm run build --workspace=@zeal/database-foundation` (or `...-clinical`) – regenerates Prisma clients and compiles shared database packages.
- `npx prisma db push --schema prisma/schema.prisma` – syncs schemas after model changes; run inside the relevant `backend/shared/database-*` package.
- `./seed/run-seeds.sh foundation` – streams SQL seed data into the `zeal_foundation` database (Postgres container must be running).

## Coding Style & Naming Conventions
TypeScript projects use 2-space indentation, ESLint, and Prettier defaults. Follow NestJS module conventions: controllers in `controllers/`, services in `services/`, DTOs in `dto/`. Environment variables belong in `.env`, `.env.example`, or service-specific config files. Use kebab-case for filenames, PascalCase for classes, camelCase for functions/variables.

## Testing Guidelines
Unit and integration tests run through `npm run test --workspace=<package>`. Prefer Jest test files alongside code (`*.spec.ts`). Aim for meaningful assertions over raw coverage metrics; existing suites exercise guards, services, and repositories.

## Commit & Pull Request Guidelines
Write commits in the imperative mood (`feat: add facility switcher guard`). Group related changes and avoid large mixed commits. Pull requests should describe intent, list affected services/packages, call out migration or seed steps, and attach screenshots or API responses when altering external behavior. Link Jira tickets or GitHub issues using `Fixes #123` when applicable. Include verification steps (commands run, tests, seed scripts) so reviewers can reproduce results quickly.

## Security & Configuration Tips
Keep `.env` files out of commits; copy from `config.env.example` when onboarding. Prisma credentials and JWT secrets are consumed from environment variables—never hard-code them in source. Use `docker-compose up -d postgres redis` to match expected local dependencies before launching services.
