# ABDM Connector — Internal API

Service-to-service contract between core services (clinical) and the ABDM
connector (`backend/connectors/abdm-connector`, port 3016). All internal routes
require the shared `X-Internal-Api-Key` header; callers should also send
`X-Service-Name` for audit/trace clarity. The public callback ingress is
documented at the end.

Base URL: `http://<abdm-connector>:3016/api/v1`

## Correlations

Every outbound async ABDM gateway request MUST be registered here **before**
the request is sent — the later callback can only be routed through this store.

### `POST /internal/correlations`
```json
{
  "txnId": "string (gateway request/transaction id)",
  "flow": "abha.verify | abha.enrol | link.care-context | ...",
  "tenantId": "uuid",
  "facilityId": "uuid (optional)",
  "ttlSeconds": 1800,
  "metadata": { "non-sensitive routing context only": true }
}
```
- `201` with the entry. Re-registering the same `txnId` for the same tenant refreshes the TTL.
- `409` if the `txnId` is already registered to a different tenant.
- Never put OTPs, tokens, or identifiers in `metadata`.

### `GET /internal/correlations/:txnId`
- `200` with the entry while pending and unexpired; `404` when unknown or expired.
- Statuses: `pending → completed | failed | expired`.

## HIP routing

Gateway-initiated flows (discovery, consent notifications) carry a HIP id, not
one of our transaction ids. Each facility is its own HIP (ABDM HRP model);
facility onboarding (HFR linking, #96) maintains this mapping.

### `PUT /internal/hip-mappings`
```json
{ "hipId": "string", "tenantId": "uuid", "facilityId": "uuid" }
```

### `GET /internal/hip-mappings/:hipId`
- `200` with `{hipId, tenantId, facilityId}`; `404` when unmapped.

## Quarantine

Callbacks that fail verification or cannot be resolved to a tenant are stored
for operator triage (see the [runbook](../runbooks/abdm-connector.md)).

### `GET /internal/quarantine`
- Unresolved entries, newest first (max 200): `{path, reason, detail, headers, body, receivedAt}`.
- `reason`: `verification_failed | unresolvable | malformed`.

### `PUT /internal/quarantine/:id/resolve`
- Marks an entry handled after remediation.

## ABHA flows (issue #97)

The clinical service's `AbhaProvider` is a thin client of these routes — the
connector owns credentials, gateway sessions, and payload crypto, and selects
the live NHA gateway vs the offline mock per tenant/facility (stored
credentials → live; none → mock). Every response carries `gateway: 'abdm' |
'mock'`. Sensitive values (Aadhaar, OTP) transit request bodies on the
internal network only and are never logged.

| Route | Body | Returns |
|---|---|---|
| `POST /internal/abha/enrol/request-otp` | `{tenantId, facilityId?, aadhaar}` | `{txnId, maskedTarget?, message?, gateway}` |
| `POST /internal/abha/enrol/verify` | `{tenantId, facilityId?, txnId, otp, mobile?}` | ABHA profile + `gateway` |
| `POST /internal/abha/login/request-otp` | `{tenantId, facilityId?, loginHint, loginId}` | `{txnId, ..., gateway}` |
| `POST /internal/abha/login/verify` | `{tenantId, facilityId?, txnId, otp}` | ABHA profile + `gateway` |
| `POST /internal/abha/address/suggestions` | `{tenantId, facilityId?, txnId}` | `{suggestions[], gateway}` |
| `POST /internal/abha/address` | `{tenantId, facilityId?, txnId, abhaAddress}` | `{abhaAddress, gateway}` |
| `GET /internal/abha/gateway` | query `tenantId`, `facilityId?` | `{gateway}` (credential presence only) |
| `GET /internal/abha/health` | query `tenantId`, `facilityId?` | `{status: ok\|mock\|error, gateway, detail?}` — live status performs the real gateway session handshake |

Provider failures are returned as `422 {code, message, retryable}` and
re-raised by the clinical client as `IdentityProviderError` — the seam above
the gateway is unchanged.

## Registries (HFR / HPR)

| Route | Body | Returns |
|---|---|---|
| `POST /internal/registries/facility/search` | `{tenantId, facilityId?, name?, registryId?, filters?}` | `{records[], gateway}` |
| `POST /internal/registries/facility/link` | `{tenantId, entityId, registryId}` | `{registryId, record, gateway}` — also registers the `hipId → facility` callback routing |
| `POST /internal/registries/practitioner/search` | same shape | `{records[], gateway}` |
| `POST /internal/registries/practitioner/link` | `{tenantId, entityId, registryId}` | `{registryId, record, gateway}` |

Live calls hit the HFR/HPR APIs (`abdm.hfr_base_url` / `abdm.hpr_base_url`
config; sandbox defaults pending reconciliation with NHA docs); tenants
without stored credentials get deterministic mock results. Failures serialize
as `422 {code, message, retryable}`.

## Domain-event ingestion

### `POST /internal/events`
- Receives the clinical outbox dispatcher's deliveries (envelope: `{id, seq, type, version, tenantId, facilityId?, aggregateType, aggregateId, occurredAt, payload}`).
- Idempotent by event `id` — duplicates ack `200 {accepted: true, duplicate: true}`.
- Relevant types are stored `received` in `event_inbox` for the M2 handlers; others `ignored`. See [DOMAIN-EVENTS.md](../architecture/DOMAIN-EVENTS.md).

## Public callback ingress

### `ANY /callbacks/abdm/v3/*`
- The single endpoint registered with the ABDM gateway per environment.
- Always answers `202 {"accepted": true}` — processing outcome is never leaked.
- Verification: `Authorization: Bearer <gateway JWT>` required
  (`ABDM_CALLBACK_AUTH=bearer`, default). Full JWKS signature verification
  is tracked as follow-up work for the M2/HIP phase (#82).
- Tenant resolution order: `request-id`/`x-request-id` header or
  `resp.requestId`/`requestId`/`txnId` in the body → correlation store;
  else `x-hip-id` header or `hip.id`/`hipId` in the body → HIP mapping;
  else quarantine.
