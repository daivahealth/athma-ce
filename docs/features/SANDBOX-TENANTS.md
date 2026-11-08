# Sandbox Tenants

Signed-in visitors to the public demo can create a **sandbox**: their own hospital, set up like the demo hospital, where they can register patients, place orders and bill. The demo hospital stays read-only. Design and safeguards: [ADR-0017](../ADR/ADR-0017-sandbox-tenants.md). API: [SANDBOXES-API.md](../api/SANDBOXES-API.md).

## Who can create one

- Only users who signed in with Google, Microsoft or GitHub ([ADR-0016](../ADR/ADR-0016-external-identity-providers.md)). The shared `visitor@athma.demo` account and other password accounts get `403 EXTERNAL_SIGN_IN_REQUIRED`.
- One live sandbox per external identity (per provider subject), enforced by a partial unique index.
- At most 3 created per identity per day (`SANDBOX_MAX_CREATES_PER_DAY`) and 50 live on the instance (`SANDBOX_MAX_ACTIVE`).
- The visitor gives an organisation name and type, optionally picks modules, and acknowledges that the sandbox is temporary and must not hold real patient data.

## What a sandbox contains

A new tenant with a copy of the template tenant's setup (`SANDBOX_TEMPLATE_TENANT_ID`, default `PUBLIC_DEMO_TENANT_ID`). No patients or other transactional data are copied.

| Service | Copied |
|---|---|
| foundation | Facilities, departments, wards, beds, clinics, spaces, facility configs, roles and their permissions (except `super_admin`), staff and specialties, tenant configs, plugin activations |
| clinical | Tenant-owned catalogues and templates (administrative services, lab/imaging/procedure/medication masters, diagnoses, consent, checklist, note, vitals, wellness and form templates, packages), staff and space schedules, OT room configs, oncology protocols and masters |
| rcm | Payers, billing items, fee schedules, payer contracts, charge posting rules, catalogue mappings, membership plans and benefits, pharmacy stock |
| prm | Communication templates, engagement rules |

The table lists are in `FOUNDATION_SETUP_TABLES` (`backend/services/foundation/src/modules/sandbox/sandbox.settings.ts`) and each service's `tenant-setup.controller.ts`. Global rows (`tenant_id` NULL) are shared, not copied. Add a table there when a new tenant-owned setup table is introduced.

## Modules

Outpatient (registration, appointments, encounters, orders) and billing are always on. The organisation type preselects the optional modules; the visitor can change them. Each module sets an existing navigation switch for the sandbox tenant:

| Module | Switch (`tenant_configs`) | Clinic | Hospital, multi-speciality | Cancer centre | Diagnostic centre | Day care | Other |
|---|---|---|---|---|---|---|---|
| `inpatient` | `feature.nav.inpatientCare` | | ✓ | ✓ | | | ✓ |
| `operating_theatre` | `feature.nav.operatingTheatre` | | ✓ | ✓ | | ✓ | ✓ |
| `diagnostics` (lab, imaging, procedure results) | `feature.nav.resultsReporting` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `pharmacy` | `feature.nav.pharmacy` | ✓ | ✓ | ✓ | | ✓ | ✓ |
| `insurance` (claims, eligibility, pre-auth) | `feature.nav.revenueCycle` | | ✓ | ✓ | | | ✓ |
| `oncology` | `feature.nav.oncology` and the oncology plugin activation | | | ✓ | | | |
| `analytics` | `feature.nav.analytics` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

Everything is copied either way, so a module can be switched on later under Configurations.

## The owner's account

The sandbox gets one user for the owner, linked to the same external identity: role `tenant_admin`, admin access to every facility, and a staff record (`SANDBOX-OWNER`, physician) so clinical screens that need a clinician work. The owner keeps their read-only visitor account in the demo hospital and switches between the two (`POST /sandboxes/switch`); each switch issues a new session for the account in that tenant.

## Lifecycle

| Status | Meaning |
|---|---|
| `provisioning` | Being copied (usually a few seconds). Provisioning runs one at a time in foundation |
| `active` | Usable until `expiresAt` (30 days, `SANDBOX_LIFETIME_DAYS`). The owner can extend once by 30 days (`SANDBOX_EXTENSION_DAYS`); platform admins can extend again |
| `failed` | Copying failed; partial data is removed. The owner can try again |
| `expired` / `deleting` | Past its date, or deleted by the owner or a platform admin. Sign-in is blocked at once; data is being removed |
| `deleted` | All data removed from every service and the tenant row deleted. The `sandboxes` record is kept |

Foundation sweeps every 15 minutes: it expires sandboxes past their date, fails provisioning stuck for over an hour, finishes interrupted removals, retries cleanup of failed sandboxes, and purges deleted sandboxes once more 65–100 minutes after deletion (an access token issued before deletion stays valid for up to an hour).

## Platform admins

`GET /sandboxes` (`platform.sandbox.read`) lists every sandbox with its owner and status; `DELETE /sandboxes/{id}` and `POST /sandboxes/{id}/extend` need `platform.sandbox.manage`. Both permissions are `super_admin` only, like the access request permissions.

## Prerequisites

Sandboxes are refused (`503 SANDBOX_UNAVAILABLE`) unless `SANDBOX_ENABLED=true`, `AUTH_REQUIRE_TOKEN_FOR_WRITES=true`, `AUTH_REQUIRE_TOKEN_FOR_READS=true`, a template tenant and `INTERNAL_API_KEY` are set. Each service's internal copy and purge endpoints also refuse unless `SANDBOX_ENABLED=true`, and never target the demo or template tenant. Operations: [demo runbook, "Sandboxes"](../runbooks/demo-environment-gcp.md#sandboxes).

## Code map

| File | Role |
|---|---|
| `backend/shared/utils/src/tenant-data.ts` | Generic copy (`copyTenantSetup`) and purge (`purgeTenantData`), id mapping, request guards |
| `backend/services/foundation/src/modules/sandbox/` | Sandbox records, orchestration, switch, expiry sweep, API |
| `backend/services/{clinical,rcm}/src/modules/tenant-setup/`, `backend/services/prm/src/tenant-setup/` | Internal copy and purge endpoints and table lists |
| `backend/shared/database-foundation/prisma/migrations/20261108020000_sandboxes/` | `sandboxes` table and platform permissions |
