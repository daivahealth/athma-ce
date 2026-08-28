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

## Care contexts (HIP linking)

Populated by the inbox processor from `encounter.closed` events: when the
patient is ABHA-linked (resolved via clinical's internal ABHA endpoint —
event payloads carry ids only), the encounter becomes a care context under
the patient's ABHA address. Mock path links immediately; the live path fires
the async NHA v3 link request (correlation-tracked) and stays `pending` until
the gateway callback confirms it.

### `GET /internal/care-contexts?tenantId=&patientId=`
- Care-context state: `{careContextRef (encounter id), abhaAddress, gateway, status: pending|linked|failed, linkTxnId?, error?}`.

Clinical exposes the counterpart lookup for the connector:
`GET /api/v1/internal/national-identity/patients/:patientId/abha?tenantId=`
(internal key + `x-tenant-id` header) → `{abhaNumber, abhaAddress, verificationStatus}` or 404.

## Consents (HIE-CM)

Consent notifications arrive on the public callback ingress
(`.../consents/hip/notify`), resolve tenancy via the HIP id (header or
`notification.consentDetail.hip.id`), and are handled as:
1. artefact stored verbatim in `consent_artefacts` (idempotent by consent id;
   revocation/expiry updates `status`, the original artefact is retained),
2. surfaced into core as a generic `PatientConsent`
   (`consentCategory: abdm`, idempotent via `linkedEntityType/Id`) through
   clinical's `POST /internal/national-identity/abdm-consents`; a surfacing
   failure is recorded on the artefact (`surfaced=false` + error), never
   dropped,
3. gateway `on-notify` acknowledged best-effort on the live path.

### `GET /internal/consents?tenantId=&abhaAddress=`
- Artefact state: `{consentId, abhaAddress, status, hiTypes, fromDate, toDate, expiresAt, surfaced, surfaceError}`.

## Health-information provision (HIP data flow)

HIU requests arrive on the public ingress (`.../health-information/hip/request`),
resolve tenancy via the named consent artefact, and are **denied** (recorded,
for audit) unless that artefact is GRANTED, unexpired, and belongs to the
resolved tenant. Approved requests process asynchronously: for every linked
care context of the consented patient, the encounter summary is fetched from
clinical, built into an NRCES OPConsultRecord FHIR bundle, Fidelius-encrypted
(ECDH-Curve25519 → HKDF-SHA256 → AES-256-GCM, fresh sender key pair per
provision), and pushed to the HIU's `dataPushUrl` with SHA-256 checksums; the
gateway transfer notification fires best-effort on the live path.

Clinical counterpart: `GET /api/v1/internal/encounters/:id/summary?tenantId=`
(internal key + `x-tenant-id`) — the minimal patient+encounter summary bundles
are built from.

### `GET /internal/data-requests?tenantId=`
- Provision state: `{transactionId, consentId, status: received|pushed|denied|failed, contextsSent, error?}`.

## HIU flows (M3)

The clinical `AbdmHieProvider` (bound per tenant via
`capability.national.exchange.provider = "abdm"` behind the ADR-0012
`HIE_PROVIDER` seam) drives fetches through:

### `POST /internal/hiu/fetch` — `{tenantId, facilityId?, abhaAddress, purpose?}`
Ensures a GRANTED consent (mock: auto-granted and mirrored into
`consent_artefacts` so the loopback HIP path authorizes it; live: async
consent-request init, returns `consent_pending`), then raises the
health-information request with transfer-scoped X25519 key material and our
public `hiu/push` callback as `dataPushUrl`. Returns
`{status: completed, transactionId, records[]}` when the push arrives within
the wait window, else `consent_pending`/`transfer_pending` — the clinical
fetch-job machinery retries.

### `GET /internal/hiu/transfers/:tenantId/:transactionId`
Transfer state (never the private key): `{status, records?, error?}`.

**Push ingress** (`.../health-information/hiu/push`): carries no gateway JWT —
acceptance is by transaction correlation, content must decrypt against OUR
transfer-scoped private key, checksums verified; the key is ERASED on
success. Mock mode is a real loopback: our own HIP provision path serves the
fetch, so both directions of the Fidelius crypto run in dev/CI.

## NHCX claims exchange (Phase 5)

NHCX is a separate capability (`claims.exchange`) hosted as a cleanly-bounded
`nhcx` module in this deployable — own secret owner (`nhcx`: participant code,
client secret, encryption private key; env fallback `NHCX_*`), own callback
path. Payloads are HCX compact JWEs (RSA-OAEP-256 + A256GCM, x-hcx-* protocol
headers integrity-protected in the JWE header). Mock exchanges (no
credentials) answer instantly; live exchanges are async via the correlation
store. RCM selects NHCX per payer via `payer.configuration.eligibilityConnector
= "NHCX"` (+ `nhcxParticipantCode`, `nhcxEncryptionCert`).

### `POST /internal/nhcx/submit` — `{tenantId, facilityId?, kind: eligibility|preauth|claim, recipientCode, recipientCertPem?, payload}`
Returns `{status: responded, correlationId, response}` (mock/synchronous) or `{status: submitted, correlationId}` (live async).

### `GET /internal/nhcx/exchanges/:tenantId/:correlationId`
Exchange state: `{kind, status: submitted|responded|error, gateway, response?, error?}`.

**Payer-response ingress** (`/callbacks/nhcx/v1/*`): no gateway JWT —
authenticity is the JWE (only content addressed to our participant key
decrypts) plus correlation to an exchange we initiated; anything else is
quarantined. Always `202`.

## Public callback ingress

### `ANY /callbacks/abdm/v3/*`
- The single endpoint registered with the ABDM gateway per environment.
- Always answers `202 {"accepted": true}` — processing outcome is never leaked.
- Verification modes (`ABDM_CALLBACK_AUTH`): `jwks` — full RS256 signature
  verification against `ABDM_JWKS_URL` (**required in production**; enforces
  exp/nbf, rejects non-RS256, refreshes keys hourly and once on unknown kid);
  `bearer` (default) — structural JWT check only; `none` — local dev only.
- Tenant resolution order: `request-id`/`x-request-id` header or
  `resp.requestId`/`requestId`/`txnId` in the body → correlation store;
  else `x-hip-id` header or `hip.id`/`hipId` in the body → HIP mapping;
  else quarantine.
