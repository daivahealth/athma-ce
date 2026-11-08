# Sandboxes API

Self-serve sandbox tenants. Foundation service, base `/api/v1`. Feature behaviour: [SANDBOX-TENANTS.md](../features/SANDBOX-TENANTS.md); design: [ADR-0017](../ADR/ADR-0017-sandbox-tenants.md).

All endpoints need a bearer token. `GET /sandboxes/mine`, `POST /sandboxes`, `POST /sandboxes/switch`, `POST /sandboxes/mine/extend` and `DELETE /sandboxes/mine` are open to read-only demo visitors (they are on `READ_ONLY_ALLOWED_PATHS`); creating and switching need an external identity (Google, Microsoft or GitHub sign-in).

## Sandbox object

```json
{
  "id": "74c7451f-…",
  "tenantId": "21055a31-…",
  "organisationName": "Asha Clinic",
  "organisationType": "clinic",
  "modules": ["diagnostics", "pharmacy", "analytics"],
  "status": "active",
  "createdAt": "2026-11-08T15:37:11.881Z",
  "activatedAt": "2026-11-08T15:37:12.370Z",
  "expiresAt": "2026-12-08T15:37:12.370Z",
  "canExtend": true,
  "failed": false
}
```

`status`: `provisioning`, `active`, `failed`, `expired`, `deleting`, `deleted`.

## Status

`GET /sandboxes/mine`

```json
{
  "available": true,
  "eligible": true,
  "inSandbox": false,
  "sandbox": null,
  "limits": { "lifetimeDays": 30, "extensionDays": 30 }
}
```

- `available`: sandboxes are offered on this instance. When `false`, `reason` is `disabled` or `not_configured`.
- `eligible`: the caller signed in with an external identity.
- `inSandbox`: the caller's current token is for their sandbox.
- `sandbox`: the live sandbox, else the most recent failed one, else `null`.

## Create

`POST /sandboxes` → `202` with the sandbox (`status: "provisioning"`). Poll `GET /sandboxes/mine` until `active` or `failed`.

```json
{
  "organisationName": "Asha Clinic",
  "organisationType": "clinic",
  "modules": ["diagnostics", "pharmacy"],
  "acknowledged": true
}
```

| Field | Rules |
|---|---|
| `organisationName` | Required, 2–120 characters, whitespace collapsed |
| `organisationType` | `clinic`, `hospital`, `multi_specialty_hospital`, `cancer_centre`, `diagnostic_centre`, `day_care`, `other` |
| `modules` | Optional; any of `inpatient`, `operating_theatre`, `diagnostics`, `pharmacy`, `insurance`, `oncology`, `analytics`. Omit for the type's defaults; `[]` for outpatient and billing only |
| `acknowledged` | Must be `true`: the sandbox is temporary and must not hold real patient data |

| Status | `code` | When |
|---|---|---|
| `400` | | Validation |
| `403` | `EXTERNAL_SIGN_IN_REQUIRED` | Password account |
| `409` | `SANDBOX_EXISTS` | The caller already has a live sandbox (body includes `sandbox`) |
| `429` | `SANDBOX_RATE_LIMITED` | 3 created by this identity in 24 hours |
| `503` | `SANDBOX_UNAVAILABLE` / `SANDBOX_CAPACITY` | Not enabled or configured / 50 live sandboxes |

## Switch workspace

`POST /sandboxes/switch` with `{ "target": "sandbox" | "demo" }` → `200` with the same body as `POST /auth/login` (`accessToken`, `refreshToken`, `user`, `expiresIn`). The new tokens are for the caller's account in that tenant; replace the stored session with them. `404 SANDBOX_NOT_READY` when the sandbox is not active; `404 WORKSPACE_ACCOUNT_MISSING` when the identity has no account there.

## Extend and delete

- `POST /sandboxes/mine/extend` → `200` with the sandbox; `expiresAt` moves 30 days later. Once only (`409 SANDBOX_ALREADY_EXTENDED`).
- `DELETE /sandboxes/mine` → `200` with the sandbox (`status: "deleting"`). Sign-in to the sandbox is blocked at once; data removal follows in the background. `409 SANDBOX_PROVISIONING` while provisioning.

## Platform admin

| Endpoint | Permission | Result |
|---|---|---|
| `GET /sandboxes` | `platform.sandbox.read` | `{ data: [sandbox + ownerProvider, ownerEmail, ownerName, error, lastSwitchAt, deletedAt], counts: {status: n}, limits: { maxActive, lifetimeDays } }`, newest first, up to 500 |
| `POST /sandboxes/{id}/extend` | `platform.sandbox.manage` | Extends an active sandbox (repeatable) |
| `DELETE /sandboxes/{id}` | `platform.sandbox.manage` | Deletes a sandbox and its data |

## Internal endpoints (service to service)

Called by foundation with `x-internal-api-key` and `x-tenant-id` set to the sandbox tenant. Each refuses unless `SANDBOX_ENABLED=true`, and never targets `PUBLIC_DEMO_TENANT_ID` or `SANDBOX_TEMPLATE_TENANT_ID`.

| Service | Copy | Purge |
|---|---|---|
| clinical | `POST /api/v1/internal/tenant-setup/copy` | `POST /api/v1/internal/tenant-setup/purge` |
| rcm | `POST /api/v1/internal/tenant-setup/copy` | `POST /api/v1/internal/tenant-setup/purge` |
| prm | `POST /v1/internal/tenant-setup/copy` | `POST /v1/internal/tenant-setup/purge` |

Copy body `{ "targetTenantId", "externalIds": [...] }` (keys of rows other services copied, so references to them are remapped) → `{ "copied": [{ "table", "rows" }], "sourceIds": [...] }`. Purge body `{ "tenantId" }` → `{ "deleted": [{ "table", "rows" }] }`. Both are idempotent.
