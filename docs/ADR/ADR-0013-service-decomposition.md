# ADR-0013: Domain Service Decomposition and Database Ownership

- **Status**: Accepted and Partially Implemented
- **Date**: 2025-10-06
- **Last Reviewed**: 2026-04-29
- **Authors**: Platform Architecture
- **Related**: ADR-0001, ADR-0002, ADR-0003, ADR-0010

## Context

Earlier platform planning described a simplified four-database topology. The repository has since evolved beyond that model:

- PRM is implemented as a separate service with a dedicated database package.
- AI workloads are implemented as a separate `ai-gateway` service.
- Shared analytical concerns exist in `backend/shared/database-analytics`.

This ADR is updated to reflect the implemented domain decomposition rather than the earlier transitional plan.

## Decision

athma-ce uses domain-oriented service boundaries with database ownership aligned to those domains.

### Services

1. **Foundation**
   - tenancy, authentication, RBAC, users, facilities, staff, organizational structure, shared reference/configuration data
2. **Clinical**
   - patient-facing and PHI-heavy workflows including scheduling, encounters, charting, observations, inpatient workflows, and related care operations
3. **RCM**
   - billing, claims, remittance, eligibility, insurance, payer contracts, charge and ledger workflows, and related financial operations
4. **PRM**
   - patient engagement, workflow rules, communication templates, tasks, and event-driven outreach
5. **AI Gateway**
   - report builder, semantic search, and AI-specific orchestration and audit-oriented flows

### Database Ownership

1. **DB-Foundation**
   - identity, tenancy, RBAC, facilities, staff, shared reference data
2. **DB-Clinical**
   - patients, appointments, encounters, charting, observations, inpatient workflows, and other PHI-centric records
3. **DB-RCM**
   - billing, claims, remittance, coverage, contracts, and financial workflows
4. **DB-PRM**
   - engagement rules, templates, provider callbacks, PRM tasks, and PRM workflow state
5. **DB-Analytics**
   - analytics or AI/reporting-oriented data structures where required by platform capabilities

## Rules

- Each service owns the write path for its database.
- Cross-database joins are not an approved integration pattern.
- Cross-domain workflows must use APIs, events, shared identifiers, or explicitly designed synchronization paths.
- Foundation remains the anchor for tenant and identity context.
- Shared clients/contracts should be updated alongside service boundary changes.

## Why This Decision

- It matches the architecture that is actually implemented in the repository.
- It preserves clear separation between PHI-heavy clinical workflows, financial workflows, engagement workflows, and identity/reference data.
- It allows frontend and backend teams to reason about ownership boundaries without relying on a stale four-database abstraction.
- It keeps room for analytics and AI workloads without collapsing them back into the primary transactional domains.

## Consequences

### Positive

- Clearer service and schema ownership
- Better isolation between operational domains
- Easier incremental evolution of PRM and AI capabilities
- More accurate architecture documentation for onboarding and agent work

### Negative

- More coordination is required for cross-domain workflows
- Eventual consistency remains a concern where workflows span services
- Documentation must stay disciplined to avoid drifting back to the older topology description

## Implementation Notes

The current repository already reflects this decomposition through:

- `backend/services/foundation`
- `backend/services/clinical`
- `backend/services/rcm`
- `backend/services/prm`
- `backend/services/ai-gateway`

and through:

- `backend/shared/database-foundation`
- `backend/shared/database-clinical`
- `backend/shared/database-rcm`
- `backend/shared/database-prm`
- `backend/shared/database-analytics`

## What This ADR Does Not Claim

- It does not claim that a unified API gateway is currently required in local development.
- It does not claim that all analytics architecture is finalized.
- It does not prescribe tenant-per-database sharding.

## Follow-Up Expectations

- Update related architecture docs whenever service ownership changes.
- Keep `docs/architecture/TECHNICAL-ARCHITECTURE.md` aligned with the implemented service/database layout.
- Update data and integration ADRs if the analytics or cross-service communication model changes materially.
