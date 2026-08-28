# Capabilities and Country Packs

How athma-ce stays country-neutral while shipping national integrations
(ADR-0015). Core modules depend on **capability keys**; which provider serves
a capability for a tenant is **configuration**; country-specific onboarding is
**declarative data**.

## Capability keys

Defined in `@athma/plugin-sdk` (`CAPABILITY_KEYS`):

| Key | Meaning | Example providers |
|---|---|---|
| `national.identity` | National patient identity | `abha` (IN), Emirates ID (AE), passport |
| `national.exchange` | National health information exchange (HIP/HIU) | `abdm` |
| `registry.facility` | National facility registry | `hfr` |
| `registry.practitioner` | National practitioner registry | `hpr` |
| `consent.external` | External consent infrastructure | `abdm-cm` |
| `claims.exchange` | Claims/insurance exchange | `nhcx` |

Rules (enforced by `scripts/check-boundaries.mjs` in CI):
- No core module imports plugin/connector code.
- No `country ==` conditionals outside provider implementations.
- An **unbound capability is a normal outcome** — callers degrade gracefully.
  The generic tenant with nothing bound must always work.

## Bindings are configuration

`CapabilityRegistryService` (SDK) resolves `capability.<key>.provider` through
the standard instance → tenant → facility hierarchy. Empty string = unbound.

```text
capability.registry.facility.provider     = "hfr"
capability.registry.practitioner.provider = "hpr"
capability.national.exchange.provider     = "abdm"
capability.claims.exchange.provider       = ""        # unbound
```

Grandfathered exception: `national.identity` keeps its shipped binding key
`identity.enabled_providers` — an ordered, **additive** list of
`COUNTRY:type` entries (multiple identity documents can be offered at once),
documented in
[TENANT-IDENTITY-CONFIG-REFERENCE.md](../multitenancy/TENANT-IDENTITY-CONFIG-REFERENCE.md).
The local MRN is never in any binding — it is the always-on core baseline.

Providers self-describe (`CapabilityProvider`: `providerId`, `operations`,
optional `healthCheck`) and register with the registry at boot; plugins
declare what they implement in their manifest (below), which makes the plugin
registry queryable: `GET /api/v1/plugins?capability=registry.facility`.

## Plugin manifest v2

Additive fields on `athma-plugin.json` (v1 manifests keep installing):

```json
{
  "manifestVersion": 2,
  "countries": ["IN"],
  "capabilities": [{ "key": "registry.facility", "provider": "hfr" }],
  "secrets": [{ "key": "abdm.client_secret", "scope": "facility" }],
  "callbacks": [{ "path": "/callbacks/abdm/v3", "verification": "abdm-jwt" }]
}
```

Validated at install by `PLUGIN_MANIFEST_SCHEMA`
(`@athma/plugin-sdk`). `secrets` entries name the write-only slots admins fill
through the secrets API; `callbacks` document a companion connector's public
ingress.

## Country packs

A country pack is a **versioned JSON preset** in `country-packs/` — config
values plus offerable plugins. No code, no runtime presence. Applying a pack
makes integrations *available*; activating them (credentials via the secrets
API, plugin activation) remains a separate, deliberate admin step.

```json
// country-packs/in.json (excerpt)
{
  "code": "IN",
  "version": "1.0.0",
  "config": {
    "identity.enabled_providers": ["IN:abha", "INTL:passport"],
    "capability.registry.facility.provider": "hfr",
    "capability.national.exchange.provider": "abdm",
    "plugins.available": ["abdm", "nhcx"]
  }
}
```

API (Foundation, JWT + tenant permissions):

- `GET /api/v1/country-packs` — available packs (`tenant.read`)
- `POST /api/v1/country-packs/tenant/:tenantId/apply {country, force?}`
  (`tenant.update`) — writes the pack's values as tenant config through the
  regular config service (audited with reason `Country pack <code> v<ver>`),
  **skipping keys the tenant already customized** unless `force`, skipping
  unknown keys with a warning, and stamping
  `tenants.settings.country_pack = {code, version, appliedAt, appliedBy}`.
  Re-applying is idempotent.

Packs ship with the platform (`country-packs/` at the repo root, overridable
via `COUNTRY_PACKS_DIR`). Shipped: `in` (India), `ae` (UAE), `generic`.

## Registry linking (registry.facility / registry.practitioner)

Foundation exposes country-neutral registry endpoints (JWT + facility/staff
permissions), served by whichever provider the tenant's binding names:

- `GET /api/v1/registry/facilities/search?name=|registryId=`
- `PUT /api/v1/registry/facilities/:facilityId/link {registryId}`
- `GET /api/v1/registry/facilities/:facilityId/status`
- `GET /api/v1/registry/practitioners/search`, `PUT .../:staffId/link`, `GET .../:staffId/status`

Unbound capability → `409` telling the admin to apply a country pack or set
the binding. Links persist only the generic `externalRegistryId` on
Facility/Staff. The HFR provider's `link` additionally registers the
connector's `hipId → facility` routing, which is how gateway-initiated ABDM
callbacks find the right tenant. Providers run mock (no credentials) or live
(stored credentials), exactly like the ABHA flows.

## Adding a country (checklist)

1. Write the pack (`country-packs/<code>.json`) — config values only.
2. Implement providers as a plugin/connector declaring `capabilities` in its
   manifest; register them with `CapabilityRegistryService`.
3. No core changes. If a core change seems needed, the capability SPI is
   missing an operation — extend the SPI (optional operations only), never
   special-case the country.
