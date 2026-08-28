# ADR-0015: Capability-Based National Integration Architecture

**Status:** Proposed
**Date:** 2026-08-28
**Deciders:** Engineering Team
**Related:** ADR-0012 (HIE integration), ADR-0014 (specialty plugins)

## Context

athma-ce must run as a multi-tenant SaaS in India with full ABDM integration (ABHA, HFR, HPR, HIP/HIU, consent, and later NHCX), while the core platform remains country-neutral so other national ecosystems (NHS, NPHIES, NABIDH) can be added as content rather than core changes.

Three building blocks already exist:

- **ADR-0014** shipped an embedded plugin framework (npm packages loaded as dynamic NestJS modules, `athma-plugin.json` manifest, `PluginRegistry`/`PluginActivation`, per-plugin `plugin_{id}` schema, `PluginGuard`).
- The **national-identity module** shipped the provider pattern this ADR generalizes: a `NationalIdentityProvider` interface with per-provider capability sets, tenant-level enablement via config (`identity.enabled_providers`), and a UI that renders whatever the API returns with no country logic.
- **ADR-0012 (amended)** established a region-agnostic `HieProvider` seam with the concrete network selected by config.

What is missing for any national integration: per-tenant/facility encrypted secrets (ABDM credentials are process-wide env vars today; #81), reliable domain events (no broker, no outbox; SDK plugin events are declared but never emitted), and a callback surface that can route asynchronous responses from national gateways back to the correct tenant.

## Decision

### 1. Capability SPIs, not country logic

Core modules depend on capability interfaces defined in `@athma/plugin-sdk`, keyed by stable capability names: `national.identity`, `national.exchange`, `registry.facility`, `registry.practitioner`, `consent.external`, `claims.exchange`, `notify.channel`, `terminology`. Plugins declare implemented capabilities in their manifest; providers self-describe supported operations (the shipped identity capability-set pattern). No core module may import from a plugin, and no `country ==` conditional may exist outside a provider — enforced by an ESLint boundary rule in CI.

New SPIs are designed only when a concrete implementation needs them (ABDM now), never speculatively.

### 2. Capability binding lives in the existing config hierarchy

Which provider serves a capability for a tenant is ordinary Foundation configuration (`InstanceConfig` → `TenantConfig` → `FacilityConfig`, resolved by `ConfigClient`):

```text
capability.national.identity.providers  = ["abha"]   # additive national IDs
capability.national.exchange.provider   = "abdm"
capability.registry.facility.provider   = "hfr"
```

The local MRN is **not** a configurable provider: it is the always-on core baseline every patient receives at registration. National identities (`PatientIdentity` rows) link to a patient who already has an MRN; registration never blocks on a national gateway. State stays in core (identity rows, consent records, registry link IDs); protocol stays in plugins.

### 3. Country Packs are declarative data, not code

A country pack is a versioned JSON preset applied at tenant provisioning: config defaults (address schema, phone rules, terminology, tax), master-data seeds, and a whitelist of offerable plugins. Selecting a country makes plugins *available*; a tenant admin must still configure credentials and activate them. Anything requiring code is a plugin.

### 4. Hybrid runtime: embedded plugins + connector services

ADR-0014's embedded model remains for request-path providers and clinical/UI extensions. National infrastructure additionally gets a **connector service** — a separately deployed NestJS service owning the external edge. Decision rule: anything needing a public inbound callback endpoint, certificate/key custody, or long-lived asynchronous workflows is a connector. In SaaS, connectors are shared multi-tenant platform services (one `abdm-connector` for all India tenants); self-hosted deployments run the same container single-tenant. A national plugin is therefore a pair: thin embedded providers implementing the SPIs, backed by the connector.

### 5. Platform primitives (built once, in core)

- **`TenantSecret`**: encrypted per-tenant/per-facility secret storage in Foundation (envelope encryption; KMS-wrapped keys in SaaS, env-provided master key self-hosted). Write-only API; only the owning plugin identity may read its own secrets; every access audited. Supersedes boot-time env credential selection.
- **Transactional outbox + dispatcher**: a `domain_events` table written in the same transaction as the domain change, delivered by a polling dispatcher (the proven PRM job-runner pattern) to embedded plugins (EventEmitter2 — finally emitting the SDK's declared events) and connectors (signed internal HTTP), with per-subscriber cursors, retries, and dead-lettering. Event envelope is broker-shaped so Kafka can replace the transport later without touching producers/consumers. Kafka is explicitly **not** adopted now.
- **Callback router**: one public ingress per connector per environment. Every outbound request records `txnId → (tenantId, facilityId)` in a correlation store before leaving; inbound callbacks are signature-verified, resolved via the store (or registry mappings such as `hip-id → facility`), and processed under restored tenant context. Unresolvable callbacks are quarantined and alerted, never guessed.

### 6. Synchronous vs asynchronous rule

Synchronous SPI calls only when a user is waiting and the answer changes what renders (identity validation, OTP verification, eligibility) — always with timeouts, circuit breaker, and a defined degraded answer. Everything else (care-context linking, data push, claim submission, registry sync) reacts to outbox events. Nothing user-facing ever blocks on a national gateway.

### 7. ABDM is the reference implementation; NHCX is a separate plugin

Athma SaaS operates as an ABDM **HRP** (Health Repository Provider): one gateway registration and callback URL per environment, per-facility HFR IDs and credentials, tenant routing via the correlation store and `hip-id → facility` mapping. Implementation tracks ABDM certification milestones (M1 ABHA, M2 HIP, M3 HIU). NHCX implements the distinct `claims.exchange` capability as its own plugin/connector for the RCM domain, reusing the same primitives.

## Consequences

**Positive:**
- Adding a country is content (plugin + pack), verified continuously by keeping a generic no-plugin tenant green in CI.
- Faulty national integrations cannot take down the PHI-serving clinical process; degradation is explicit.
- Every framework primitive ships with the ABDM feature that needs it — no speculative infrastructure.
- Tenant activation of an integration is a data operation, not a deployment.

**Negative:**
- Connector services add deployables (containers, dashboards, runbooks) beyond ADR-0014's zero-infra model.
- The outbox dispatcher is custom code to own until/unless a broker replaces it.
- Two runtime models (embedded + connector) require the decision rule above to be applied consistently in review.

**Amendments to prior ADRs:**
- ADR-0014 is scoped to request-path/UI plugins; its "embedded over microservice" choice no longer applies to national infrastructure.
- ADR-0012's `HieProvider` implementations for national networks live in connector services; the seam is unchanged.

## Key Files

- `backend/shared/plugin-sdk/` — capability SPIs, manifest schema (v2), event contracts
- `backend/services/clinical/src/modules/national-identity/` — shipped reference for the provider pattern
- `backend/shared/config-client/` — capability binding resolution
- `backend/connectors/` — connector services (new; first: `abdm-connector`)
- `country-packs/` — declarative country presets (new)
