# ABDM Connector Runbook

## Scope
- Service: `@zeal/abdm-connector` (`backend/connectors/abdm-connector`), port 3016
- Database: `zeal_abdm` (`ABDM_DATABASE_URL`) — correlation/routing state only, no PHI
- Role: owns the ABDM gateway edge (callbacks, correlation, tenant routing) for all tenants; shared multi-tenant platform service in SaaS, single-tenant self-hosted (ADR-0015)

## Environment
| Variable | Meaning |
|---|---|
| `PORT` | HTTP port (default 3016) |
| `ABDM_DATABASE_URL` | Postgres URL for `zeal_abdm` |
| `INTERNAL_API_KEY` | Shared key for the internal API (same value as clinical/foundation) |
| `ABDM_CALLBACK_AUTH` | `bearer` (default) or `none` (local dev only — never production) |
| `FOUNDATION_BASE_URL` | Foundation service URL — per-tenant ABDM settings (config) and per-facility credentials (TenantSecret store) resolve through it |
| `ABDM_CLIENT_ID` / `ABDM_CLIENT_SECRET` | Optional single-tenant/self-hosted credential fallback, used only when a tenant has NO stored secret |

## Health
- `GET /health` → `{status, database}`; `degraded` means the `zeal_abdm` DB is unreachable — callbacks are still answered `202` but everything quarantines, so treat as an incident.

## ABHA flows

The connector owns the entire ABDM edge for ABHA (issue #97): gateway
sessions, RSA payload encryption, live-vs-mock selection per tenant/facility.
The clinical service calls `/internal/abha/*` and holds no ABDM credentials.
`GET /internal/abha/health?tenantId=` is the activation gate: `mock` = no
credentials stored, `error` = credentials present but the NHA session
handshake failed (check credential validity and `abdm.gateway_url`).

## Key invariants
1. The public callback ingress always returns `202` — outcome (processed vs quarantined) is never leaked to the caller.
2. Tenancy is resolved ONLY via the correlation store (`txnId`) or the `hipId → facility` mapping. A callback that resolves via neither is quarantined, never guessed.
3. A `txnId` can never be re-registered to a different tenant (`409`).

## Triage: quarantined callbacks
Quarantine entries mean one of:
- `verification_failed` — missing/malformed gateway auth. A spike usually means gateway config drift or someone probing the endpoint.
- `unresolvable` — no matching correlation or HIP mapping. Usual causes: correlation TTL expired before the gateway answered (slow gateway day), a facility's HIP mapping was never registered, or the clinical service failed to register the transaction before calling out.
- `malformed` — handler threw on the payload.

Steps:
1. List: `GET /api/v1/internal/quarantine` (header `X-Internal-Api-Key`).
2. For `unresolvable` with a known `request-id`: check `correlation_entries` for that `txnId` (`expired`? re-drive the flow from the clinical side). For a `x-hip-id`: check `hip_facility_mappings` — register the mapping via `PUT /api/v1/internal/hip-mappings` if the facility was onboarded but never mapped.
3. After remediation, mark handled: `PUT /api/v1/internal/quarantine/:id/resolve`.
4. `verification_failed` spikes: confirm `ABDM_CALLBACK_AUTH` is `bearer` and (once JWKS verification lands with #97) that gateway certs are current.

## Local dev
```bash
cd backend
docker compose up -d postgres
npm run dev --workspace=@zeal/abdm-connector
```
The `zeal_abdm` database is created by `init-scripts/01-init-database.sql` on a fresh postgres volume; on an existing volume create it manually and run `npx prisma db push` from the connector directory.

## Escalation
- Gateway-side outage (ABDM sandbox/production down) degrades ABHA verification and exchange flows platform-wide for India tenants — user-facing flows must degrade to "verification unavailable, saved as unverified" (clinical side), not error.
- PHI is never in this service's DB or logs; a suspected leak here is a security incident regardless.
