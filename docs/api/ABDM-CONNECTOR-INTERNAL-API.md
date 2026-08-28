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

## Public callback ingress

### `ANY /callbacks/abdm/v3/*`
- The single endpoint registered with the ABDM gateway per environment.
- Always answers `202 {"accepted": true}` — processing outcome is never leaked.
- Verification: `Authorization: Bearer <gateway JWT>` required
  (`ABDM_CALLBACK_AUTH=bearer`, default). Full JWKS signature verification
  lands with the live gateway wiring (#97).
- Tenant resolution order: `request-id`/`x-request-id` header or
  `resp.requestId`/`requestId`/`txnId` in the body → correlation store;
  else `x-hip-id` header or `hip.id`/`hipId` in the body → HIP mapping;
  else quarantine.
