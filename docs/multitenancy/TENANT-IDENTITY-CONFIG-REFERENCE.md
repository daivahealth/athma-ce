# Tenant Identity Configuration Reference

How to configure which national identity types are available to a tenant.

> **History:** an earlier design (2025-10) stored identity configuration in
> `tenants.settings.identity_config` (JSONB). That mechanism was never wired to
> code and is **retired** — no service reads it. The configuration hierarchy
> below is the only mechanism. Older documents in
> `docs/features/identity-management/` describe the retired design and carry a
> deprecation banner.

## Configuration Location

Identity configuration uses the standard three-tier config hierarchy
(instance → tenant → facility), stored in `zeal_foundation`
(`instance_configs`, `tenant_configs`, `facility_configs`) and resolved by
`ConfigClient` / `GET /api/v1/configs/resolve`.

## Configuration Keys

| Key | Type | Default | Meaning |
|---|---|---|---|
| `identity.enabled_providers` | json (string array) | `["AE:emirates_id", "INTL:passport"]` | Which national identity providers are offered, as `COUNTRY:identityType` keys. Order is display order. |
| `abdm.enabled` | boolean | `false` | Master switch for the ABHA provider. `IN:abha` must be listed in `identity.enabled_providers` **and** this must be `true` — enabling ABHA without ABDM credentials would surface a broken flow. |
| `abdm.environment` | string | `sandbox` | ABDM gateway environment. |
| `abdm.base_url`, `abdm.gateway_url`, `abdm.cm_id`, `abdm.consent_version` | string | see `CONFIG_DEFAULTS` | ABDM gateway endpoints and consent-manager settings. |

Defaults are declared in `backend/shared/config-client/src/defaults.ts` and
seeded by `seed/foundation/01-core.sql`.

## The local MRN is not configurable

Every patient receives a local MRN at registration regardless of this
configuration. National identities are **additive** — `PatientIdentity` rows
linked to a patient who already has an MRN. When no provider is enabled (or a
national gateway is down), registration proceeds on MRN alone.

## Examples

Enable Emirates ID + passport for a UAE tenant (this is also the default):

```bash
curl -X PUT "$FOUNDATION/api/v1/configs/tenant/$TENANT_ID/identity.enabled_providers" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"value": ["AE:emirates_id", "INTL:passport"]}'
```

Enable ABHA for an Indian tenant (two switches, per the table above):

```bash
curl -X PUT "$FOUNDATION/api/v1/configs/tenant/$TENANT_ID/identity.enabled_providers" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"value": ["IN:abha", "INTL:passport"]}'
```

```bash
curl -X PUT "$FOUNDATION/api/v1/configs/tenant/$TENANT_ID/abdm.enabled" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"value": true}'
```

## ABDM credentials (per facility)

Gateway credentials are **not** config keys — they live in the encrypted
TenantSecret store (owner `abdm`), scoped per **facility** (each facility is
its own HIP in ABDM's HRP model) with automatic fallback to a tenant-scoped
secret for tenant-wide registrations:

```bash
curl -X PUT "$FOUNDATION/api/v1/secrets/tenant/$TENANT_ID/abdm.client_id" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"value": "<client id>", "ownerId": "abdm", "facilityId": "<facility uuid>"}'
```

```bash
curl -X PUT "$FOUNDATION/api/v1/secrets/tenant/$TENANT_ID/abdm.client_secret" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"value": "<client secret>", "ownerId": "abdm", "facilityId": "<facility uuid>"}'
```

Gateway selection is **per request, per tenant/facility**: stored credentials
→ live NHA gateway; none → the fully-exercisable mock (the provider listing's
`gateway` field badges which one a tenant gets). Sandbox and production
tenants coexist in one deployment. The `ABDM_CLIENT_ID`/`ABDM_CLIENT_SECRET`
env vars remain a fallback for single-tenant/self-hosted installs only —
they apply when a tenant has **no** stored secret.

Verify a tenant's setup with `GET /api/v1/national-identity/abha/health`
(clinical): `ok` (live handshake succeeded) | `mock` (no credentials stored) |
`error` (credentials present but the gateway session handshake failed).

## How it takes effect

`GET /api/v1/national-identity/providers` (clinical service) resolves these
keys for the caller's tenant and returns only enabled providers with their
capability sets. The registration UI renders whatever comes back — there is no
country logic in the frontend.

## Verification behavior

Whether an identity type supports online verification is a property of the
**provider** (its capability set), not of configuration. Emirates ID is
validate-only; ABHA supports validate/verify/enroll/demographics/card. There
is no per-tenant "document verification" toggle.

## Related

- `backend/services/clinical/src/modules/national-identity/` — providers and enablement logic
- [docs/ADR/ADR-0015-capability-plugin-architecture.md](../ADR/ADR-0015-capability-plugin-architecture.md) — capability binding scheme this generalizes into
- [docs/multitenancy/README.md](README.md) — tenant isolation model
