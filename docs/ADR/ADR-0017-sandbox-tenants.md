# ADR-0017: Self-Serve Sandbox Tenants on the Public Demo

**Status:** Accepted (isolation prerequisites implemented; provisioning in progress)
**Date:** 2026-11-08
**Deciders:** Engineering Team
**Related:** ADR-0003 (multitenancy), ADR-0005 (RBAC), ADR-0016 (external identity providers)

## Context

Public visitors sign in with Google, Microsoft or GitHub and explore the demo hospital read-only (ADR-0016). To evaluate Athma properly they need to register patients, place orders and bill, without touching the shared demo hospital or each other's data.

Athma is already multi-tenant: every service scopes data by `tenant_id`. But two things assumed a single trusted organisation per instance:

1. **Tenant context came from a header.** Clinical, ai-gateway and most foundation controllers take the tenant from `x-tenant-id` and never compare it with the JWT. Only rcm (`TenantContextGuard`) and prm (`@TenantId()`) used the token. Requests without any token could also read a tenant's data by naming it. With one public, read-only tenant this exposed nothing; with writable sandboxes, a sandbox owner could write into the demo hospital or read another visitor's sandbox.
2. **Some document numbers were unique per instance.** `patients.mrn`, `encounters.encounter_number`, `inpatient_admissions.admission_number` and `consent_templates.template_code` had instance-wide unique keys, while the generators number per tenant (`PAT-2026-000001`, ...). The second tenant's first patient would fail to save.

## Decision

### 1. Bind the tenant to the token in every service (prerequisite)

The shared `readOnlyAccessMiddleware` (`@zeal/shared-utils`, mounted in all five services) now:

- refuses any request whose bearer token names a different tenant from `x-tenant-id` (`403 TENANT_MISMATCH`), with no `super_admin` exemption;
- fills a missing `x-tenant-id`, and overwrites `x-user-id`, from a verified token;
- with `AUTH_REQUIRE_TOKEN_FOR_READS=true`, refuses tokenless reads (`401 AUTH_REQUIRED`) except health checks, external sign-in, config resolution and API docs; `report` only logs them, for rollout;
- trusts a valid `x-internal-api-key` (service-to-service) for any tenant. Service-to-service reads now send it.

Doing this centrally avoids touching the ~100 controllers that read the header, and covers new controllers by default. Details: [Tenant binding](../security/20-RBAC-Access-Control.md#tenant-binding).

### 2. Document numbers are unique per tenant

The four keys above become `(tenant_id, …)` unique (clinical migration `014_per_tenant_document_numbers.sql`). Lookups by consent template code now include the tenant.

### 3. A sandbox is a tenant copied from the demo hospital's setup

"Create my sandbox" creates a new tenant and copies the demo tenant's **setup**, not its patients: facilities, departments, clinics, spaces, wards and beds, staff with specialties and schedules, roles with their permissions, tenant-owned catalogues and templates, price lists, payers and contracts, engagement rules, and oncology protocols. Global rows (`tenant_id IS NULL` catalogues, permissions, specialties) are shared, not copied.

New primary keys are derived, not looked up: `new_id = uuid_generate_v5(sandbox_tenant_id, old_id::text)`. Every reference to a copied row, including references across databases (a clinical `facility_id` pointing at a foundation facility), maps with the same function, so the copy needs no id-mapping tables and each database can be copied independently. References to global rows are left unchanged.

### 4. Organisation type and modules choose what is shown, not what is copied

The creation form asks for the organisation name, type (clinic, hospital, multi-speciality hospital, cancer centre, diagnostic centre, day care) and modules. The type preselects modules (a clinic gets outpatient, lab, pharmacy and billing; a cancer centre gets everything including oncology). Everything is copied either way; modules that are off are hidden from navigation by a per-tenant "modules enabled" setting, and oncology uses the existing plugin activation. A module can be switched on later without re-provisioning.

### 5. The visitor becomes the sandbox's administrator

The sandbox gets a user linked to the same external identity (`user_identities` is keyed by tenant, provider and subject), with `tenant_admin` and admin access to every sandbox facility. The visitor switches between the demo hospital (read-only) and their sandbox; switching issues a fresh session for the user in the target tenant, so each token carries exactly one tenant.

### 6. Limits

One sandbox per person, at most 50 active on the instance, deleted 30 days after creation with one extension. Deletion removes the tenant's rows from every database.

## Consequences

- Deployments where untrusted users can hold accounts in more than one tenant must run with `AUTH_REQUIRE_TOKEN_FOR_WRITES=true` and `AUTH_REQUIRE_TOKEN_FOR_READS=true`. The demo turns reads on in `report` mode first.
- Service-to-service callers must send the caller's token or the internal key, for reads as well as writes.
- A super admin cannot act in another tenant by changing the header; cross-tenant administration goes through dedicated platform endpoints.
- The copy depends on the demo tenant's setup being complete and consistent; a broken reference in the template is copied too.
- Sandbox data is real data entered by visitors. The demo privacy notice covers it, and deletion on expiry bounds retention.
