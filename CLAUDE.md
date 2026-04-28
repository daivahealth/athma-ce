# CLAUDE.md - athma-ce

Operating contract for Claude and other AI coding agents working in this repository.

This file is intentionally policy-heavy. It defines how agents should work, which documents are authoritative, when documentation updates are mandatory, and which engineering constraints must not be violated.

## Companion File Sync

- `AGENTS.md` and `CLAUDE.md` must stay materially aligned.
- Any update to one file must be reflected in the other in the same session.
- Do not change agent operating rules in only one of these files.

## Purpose

- Use this file as the top-level ruleset for agent behavior in `athma-ce`.
- Use the `docs/` tree as the detailed source of truth for architecture, APIs, workflows, runbooks, and developer guidance.
- Do not treat this file as the place to restate all architecture or feature detail already documented elsewhere.

## Documentation Hierarchy

The repository already has an extensive documentation system. Agents must use it instead of inventing parallel documentation.

- Root `AGENTS.md`: operating rules for agents.
- Root `CLAUDE.md`: same operating rules for Claude-oriented workflows.
- [docs/README.md](docs/README.md): documentation entrypoint and navigation.
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md): documentation writing standards and contribution guidance.
- [docs/architecture/](docs/architecture): system architecture, technical design, and cross-cutting design references.
- [docs/ADR/](docs/ADR): architecture decisions and decision history.
- [docs/api/](docs/api): API contracts, endpoint behavior, and integration references.
- [docs/features/](docs/features): feature behavior, workflows, and user-facing implementation detail.
- [docs/development/](docs/development): engineering workflow, commands, and implementation guidance.
- [docs/runbooks/](docs/runbooks): operational procedures and service triage steps.
- [docs/troubleshooting/](docs/troubleshooting): recurring issue diagnosis and remediation guidance.
- [docs/multitenancy/](docs/multitenancy): tenant isolation and identity configuration references.
- [docs/security/](docs/security): security and compliance references.
- [docs/services/](docs/services): service-specific orientation and interaction patterns.

## Documentation First Policy

Agents must treat documentation updates as part of the implementation, not optional follow-up.

- Any change affecting architecture, API contracts, workflows, developer expectations, operational behavior, or security assumptions must update the appropriate docs in the same session.
- If a code change does not require a doc update, the agent should be able to justify that clearly.
- If code and docs already disagree, the agent must call it out explicitly and either reconcile them or stop and surface the mismatch.
- Agents must check existing documentation before creating new docs.
- Prefer updating an existing canonical doc over creating a new file.

## Documentation Routing Rules

When a change is made, update the correct documentation family.

- Architecture, service boundaries, integration patterns, or system design changes:
  - `docs/ADR/`
  - `docs/architecture/`
- API shape, endpoint semantics, auth/header expectations, request/response changes:
  - `docs/api/`
- Feature behavior, workflows, data-entry flows, domain-specific UX behavior:
  - `docs/features/`
- Developer setup, local workflow, commands, coding patterns, implementation guidance:
  - `docs/development/`
- Runtime operations, triage, service recovery, support procedures:
  - `docs/runbooks/`
- Recurrent defects, root-cause writeups, break/fix guidance:
  - `docs/troubleshooting/`
- Tenant isolation, tenant-aware identity/config rules:
  - `docs/multitenancy/`
- Security/compliance expectations:
  - `docs/security/`

## No Silent Drift

- Do not leave behavior-changing code without aligned documentation.
- Do not change an API, workflow, or architecture rule and leave older docs misleading.
- Do not cite docs as authoritative if the implementation now contradicts them.
- If a mismatch is too large to safely reconcile in the current task, stop and report it.

## No Documentation Sprawl

- Do not create one-off summary docs, completion reports, or fix-status docs by default.
- Do not create a new markdown file if an existing canonical doc can absorb the change.
- Do not duplicate the same content across `features`, `api`, `implementation`, and `troubleshooting`.
- Use new docs only when the topic is genuinely new and does not already have a natural home.

## Repository Orientation

```text
athma-ce/
├── backend/
│   ├── services/           # NestJS services
│   ├── shared/             # Shared packages and Prisma clients
│   └── contracts/          # Shared DTOs and schemas
├── frontend/               # Next.js App Router app
├── docs/                   # Canonical documentation tree
├── seed/                   # Database seeding scripts and data
└── infrastructure/         # Infra-related assets
```

Key code locations:

- Backend services: `backend/services/`
- Shared database/schema packages: `backend/shared/`
- Shared contracts: `backend/contracts/`
- Frontend app and modules: `frontend/src/`

## Core Engineering Rules

- Explore before editing. Read the relevant code and the relevant docs first.
- Follow existing patterns unless there is a strong documented reason to change them.
- Prefer small, coherent changes over broad speculative refactors.
- Keep service boundaries explicit. Do not blur backend domain ownership.
- Preserve multi-tenant safety, auth expectations, and auditability.
- Do not invent new abstractions if an existing shared client, hook, service, DTO, or utility already covers the use case.

## Backend Rules

- Follow NestJS patterns already used in the repo.
- Use existing DTOs and shared contracts where possible.
- Keep tenant-aware filters and request context intact on all domain operations.
- Use service-local database boundaries. Do not introduce implicit cross-service joins.
- Document any change to:
  - endpoint behavior
  - DTO/schema shape
  - auth/header expectations
  - multitenancy rules
  - database migration impact

## Frontend Rules

- Use existing API clients, query hooks, stores, and UI primitives before adding new ones.
- Keep branding, theme, and interaction changes aligned with shared theme tokens and shared components.
- Do not hardcode new API access paths if the existing service/client layer is the correct seam.
- Document any change to:
  - route behavior
  - form workflow
  - user-facing feature behavior
  - API usage expectations

## Database, Security, and Multitenancy Rules

- Patient/clinical data isolation must remain intact.
- No cross-database joins as a shortcut for feature delivery.
- Required headers and tenant/facility context rules must be preserved.
- Schema changes must include:
  - impact awareness
  - affected services/modules
  - seed or migration implications
  - documentation updates in the correct doc family
- Security-sensitive changes must be reflected in `docs/security/` or related canonical docs.

## Development Workflow

Use existing docs for detailed commands and workflows:

- [docs/development/DEVELOPMENT-COMMANDS.md](docs/development/DEVELOPMENT-COMMANDS.md)
- [docs/development/DEVELOPER-ONBOARDING.md](docs/development/DEVELOPER-ONBOARDING.md)
- [docs/services/README.md](docs/services/README.md)

Common local commands:

### Backend
```bash
cd backend
docker-compose up -d postgres redis
npm install
npm run dev --workspace=@zeal/foundation
npm run dev --workspace=@zeal/clinical
npm run type-check --workspace=@zeal/foundation
```

### Frontend
```bash
cd frontend
npm run dev
npm run build
npm run lint:fix
npm run format
```

### Testing
```bash
cd frontend
npm run test

cd backend
npm run test --workspace=@zeal/foundation
```

## Dos

- Do inspect relevant docs before implementing.
- Do update the correct canonical docs in the same session when behavior changes.
- Do preserve existing service boundaries, shared contracts, and tenant context patterns.
- Do prefer existing shared utilities, clients, hooks, and components.
- Do mention any discovered code/doc mismatch in your final report.
- Do document migration, schema, or operational impact when relevant.

## Don'ts

- Don’t duplicate architecture or feature detail already covered in `docs/`.
- Don’t create summary/status/completion markdown files by default.
- Don’t invent new architecture when ADRs or architecture docs already define the direction.
- Don’t bypass shared API clients, request-context patterns, DTOs, or theme tokens without strong reason.
- Don’t make auth, tenant-safety, API-shape, or schema changes without aligned documentation.
- Don’t leave code and docs in a contradictory state without explicitly surfacing it.

## Verification and Documentation Checklist

Before closing a task, the agent should verify:

- What behavior changed?
- Which existing docs were checked before implementation?
- Which canonical docs were updated?
- What was verified locally?
- Does any known code/doc mismatch remain?

If the change affects architecture, APIs, workflows, or operations, the final response should mention the doc updates explicitly.

## Key References

- [docs/README.md](docs/README.md)
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- [docs/architecture/TECHNICAL-ARCHITECTURE.md](docs/architecture/TECHNICAL-ARCHITECTURE.md)
- [docs/development/README.md](docs/development/README.md)
- [docs/services/README.md](docs/services/README.md)
- [docs/multitenancy/README.md](docs/multitenancy/README.md)
- [docs/security/README.md](docs/security/README.md)
