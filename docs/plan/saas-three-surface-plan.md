# From Single App to SaaS: The Three-Surface Plan

**Status:** Proposal — for review
**Date:** 2026-08-30 (Rev 2 — sales-led resequencing + AI provisioning orchestrator)
**Scope:** Splitting Athma into a public marketing site, an AI-assisted onboarding & provisioning surface, and the authenticated product app — grounded in a full audit of this repo, sequenced sales-led-first for a hospital-grade buyer, with self-serve kept one thin layer away.

---

## 1. The model, mapped to Athma

The Atlassian pattern (marketing site / signup & provisioning / product app) is the right lens: three surfaces with different technical needs, each its own deployment, sharing one identity system and one design language.

| Surface | Domain (proposed) | Needs | Today in athma-ce |
|---|---|---|---|
| Marketing | `athma.health` | SEO, static/SSR, fast anonymous first paint, CMS-editable content, pricing, "Book a demo" + live demo tenant | Does not exist — no public page of any kind |
| Onboarding & provisioning | Internal console first; `athma.health/get-started` later | Deterministic tenant bootstrap, AI-assisted setup intake, review & approval, trial state, later billing | Does not exist — tenant creation is an admin-only endpoint that writes one bare row; a working tenant needs ~20 manual SQL seed files |
| Product app | `app.athma.health` | Authenticated SPA, per-user data, rich interactivity, no SEO | Exists — the entire current frontend (~240 pages, 236 client components) |

**Two governing judgments:**

1. **Keep the product app a CSR SPA.** 236 of 240 pages are already client components; the SSR/SEO investment belongs entirely in the new marketing app, never bolted into the product frontend.
2. **Sequence sales-led, stay PLG-ready.** Athma's scope (inpatient, OT, RCM, payer integrations, HIE) is hospital-grade, and hospitals buy through demos and procurement, not credit cards. The funnel launches as *marketing → demo → sales-assisted, AI-accelerated onboarding*. Because provisioning is built as a proper engine (§5), opening public self-serve later — e.g. for a small-clinic tier — is a thin layer (signup form, email verification, rate limiting), not a rebuild.

## 2. Where the codebase actually is

- **No public surface.** The only anonymous routes are `/login`, `/reset-password`, and `/debug`. No landing page, pricing, or signup.
- **No provisioning pipeline.** `POST /api/v1/tenants` (foundation service) requires the `TENANT_CREATE` permission and inserts a single row — no admin user, no default roles, no facility, no config bootstrap. A working tenant today is only produced by manually running ~20 SQL seed files.
- **Tenancy is header-from-JWT, not subdomain.** Tenant context flows as an `x-tenant-id` header derived from a JWT claim. The `domain` column on tenants is stored but never read for routing (good news — see §3).
- **Auth is client-side only.** Tokens live in `localStorage`; route protection is a `useEffect` check in two layouts. No Next.js middleware auth gate, no httpOnly-cookie session. Acceptable for a closed pilot; not acceptable once outsiders touch the platform.
- **An AI service already exists.** `ai-gateway` (:3015) already does NL report building, semantic search, and catalog population — the natural home for the AI onboarding copilot (§5), not a new service.
- **No SaaS billing exists.** The RCM "membership/subscription" module is patient-facing clinical membership, not tenant billing. No payment-provider code anywhere.
- **Deployment is not real yet.** CI deploy workflows are `echo "Deploying..."` stubs; one Dockerfile exists (PRM only); no k8s/Terraform despite ADR-0008 describing them.

### Code / doc mismatches to reconcile

1. `docs/architecture/TECHNICAL-ARCHITECTURE.md` §7.3 says PostgreSQL RLS is enforced — it is not; isolation is a Prisma middleware in the clinical DB layer only, and the foundation DB has no equivalent.
2. `docs/architecture/FRONTEND-ARCHITECTURE-DECISION.md` mandates "a single monolithic Next.js application" — adding a marketing app supersedes this and needs an ADR.
3. ADR-0008 describes GitLab CI + Terraform; the repo uses GitHub Actions with stub deploys.

## 3. Domain & tenancy strategy

Atlassian gives every tenant a subdomain (`yourcompany.atlassian.net`) because their tenant routing is host-based. **Athma doesn't need this to launch.** Tenancy is already claim-based: the user logs in, the JWT carries `tenantId`, and every API call is scoped by header. One shared `app.athma.health` works for all tenants on day one.

| Scheme | Verdict | Why |
|---|---|---|
| Shared `app.athma.health` | ✅ Phase 1 | Zero routing work; matches the existing JWT-claim model exactly. Users pick a tenant implicitly by their login. |
| Per-tenant subdomain | 🔄 Later, as vanity/enterprise | Requires wildcard DNS + TLS, host→tenant resolution middleware, and login scoping. The `domain` column already exists for when we want it. Pairs naturally with the "isolated shard" premium tier ADR-0003 reserved. |
| Path-based (`/t/acme`) | ❌ Skip | Pollutes every route, complicates the locale prefix, and buys nothing over the claim model. |

Proposed domain map: `athma.health` (marketing + onboarding entry), `app.athma.health` (product), `api.athma.health` (gateway in front of the five services — the gateway the architecture diagrams already promise but the repo doesn't have). Consolidating the six per-service `NEXT_PUBLIC_*_BASE_URL` origins behind one API domain also fixes the CORS/cookie story needed for auth hardening.

## 4. Surface 1 — the marketing site

**New app: `marketing/` in the monorepo, at `athma.health`.** A deliberately small, content-first site: home, product tour, pricing, security/compliance page (healthcare buyers read this first), blog/changelog, contact. Every page ends at one of two CTAs: *Book a demo* → sales form, or *Explore the live demo* → a shared, read-only demo tenant.

- **Stack: Astro (recommended) or Next.js static export.** Astro is best-in-class for static, content-heavy, near-zero-JS sites, and a different framework enforces the boundary: nobody "just adds" an authenticated feature to the marketing site. Next.js SSG is acceptable — but as a *separate app*, never new routes in `frontend/`.
- **The live demo tenant is the PLG substitute.** One shared, read-only, demo-data tenant anyone can click into without signing up delivers most of the demo-engine value of self-serve trials at a fraction of the cost — no signup flow, no per-visitor provisioning, no abuse surface. It reuses the existing seed data and needs only a scoped read-only role.
- **Content: MDX in the repo first, CMS later.** Git-based MDX ships immediately; swap to a headless CMS when marketing hires happen.
- **Brand: extract shared tokens** (Athma logo assets, theme tokens) into a shared package so marketing and product don't drift visually.
- **Compliance page is a launch requirement:** data residency (UAE), encryption posture, audit logging. "AI-guided setup in hours, not months" (§5) belongs on the homepage as the headline differentiator.

## 5. Surface 2 — the AI provisioning orchestrator

The engineering center of gravity of the whole plan, and the differentiator. For hospital-grade software the real onboarding pain isn't creating an account — it's the *implementation project*: departments, wards, beds, OTs, specialties, roles, catalogs, configs. In legacy HIS rollouts that is weeks of consultant work. Athma compresses it to a guided hour with an AI copilot — governed by one non-negotiable rule:

> **The AI never provisions anything. It fills out a form; a deterministic engine executes it.** Every field the model produces is schema-validated, every enum comes from Athma's own masters, and nothing reaches the database except through typed DTOs in an audited, transactional saga. The AI proposes; the engine disposes.

### Layer 1 — the blueprint engine (deterministic core)

*foundation service · new `onboarding` module*

A versioned, strictly-typed `TenantBlueprint` schema: org profile, facilities, departments, wards/beds, OTs, specialties (from the existing specialty master), role set, config values (the existing `instance → tenant → facility` hierarchy), country pack, enabled plugins. A provisioning saga takes a *validated* blueprint and executes it transactionally and idempotently, with a resumable provisioning-state table and a full audit trail. Trial/lifecycle state (`plan`, `status`, `trial_ends_at`) lands on the tenant model here.

This engine replaces the ~20 seed SQL files as the single recipe for "what a new tenant needs" — local seeds should eventually call it, so dev and production tenants are born identical. It is required under *any* strategy, AI or not.

### Layer 2 — the AI intake copilot (blueprint author)

*ai-gateway service (:3015) · already does NL + catalog work*

Its sole job is to produce a blueprint *draft*, through whichever inputs the customer has:

- **Conversational interview:** "We're a 75-bed hospital in Dubai — two OTs, cardiology, ortho, a dialysis unit, ~40 clinical staff." The copilot asks the follow-ups a human implementation engineer would, then emits the blueprint via structured output (Claude with the tool schema locked to `TenantBlueprint` — the model cannot produce an invalid plan).
- **Document ingestion — the killer feature:** upload the staff roster spreadsheet, department list, or org-chart PDF; the copilot maps them into the blueprint. Every hospital already has this data in messy files.
- **Recommendation:** given the org profile, it proposes defaults — role template, specialty plugins, country pack — drawn only from existing catalogs.

### Layer 3 — the review gate (human approval)

*onboarding console UI*

Before execution, the blueprint renders as a human-readable, editable plan ("3 wards, 75 beds, 12 departments, 14 roles, cardiology + ortho plugins") with a diff-style preview. A human — Athma's implementation engineer initially, the customer admin later — approves; the engine runs; the copilot narrates verification ("created 75 beds, 40 staff invites queued, 2 items need attention"). The audit trail records both the AI's draft and the human's edits.

### 5.1 Rollout: internal first, customer-facing later

Build the console as an **internal implementation tool first**: the Athma team uses it to onboard sales-closed customers in an hour instead of running SQL files — immediate ROI and a live testbed for the copilot. Exposing the same copilot to customer admins later is a permissions and polish exercise, not a rebuild. Public self-serve signup (form + email verification + rate limiting + captcha in front of the same engine) stays one thin layer away, switched on when a small-clinic tier justifies it.

### 5.2 Guardrails from day one

- Enum values only from the masters — no hallucinated specialties, departments, or config keys.
- Blueprint schema versioning, so saved drafts replay correctly as the product evolves.
- **No PHI in the intake path.** Setup data is org structure — facilities, roles, staff names/emails — never patients. Keep the copilot's context window clean of clinical data by design.
- Rate limits and cost caps on the copilot; a failed AI call degrades to the manual form, never blocks provisioning.

### 5.3 Billing — designed now, built later

Enterprise healthcare deals are invoiced, not carded, so payment automation waits for self-serve volume. Decide the shape now: plan definitions, tenant↔subscription mapping, and provider webhooks living beside the onboarding module; recommendation **Stripe Billing** (Checkout + Customer Portal) when the time comes. Plan gating hooks into the same config hierarchy — a plan is effectively a config template plus limits.

> **Healthcare reality check.** Fully self-serve *production* signup is rare in EHR/clinical SaaS for good reason: real patient data carries licensing, residency, and liability obligations. Whenever self-serve opens, the model stays **self-serve sandbox, sales-assisted production activation** — converting a sandbox to a production tenant with real PHI goes through organization verification, a signed agreement (HIPAA BAA or UAE equivalent), and plan selection. The Jira-style funnel, without the compliance exposure.

## 6. Surface 3 — hardening the product app

The existing frontend is the product; it doesn't need restructuring. It needs the security posture upgraded from "closed pilot" to "outsiders touch the platform" — mandatory before the public demo tenant opens, not just before signup:

- **Move sessions out of localStorage.** Refresh token in an httpOnly, Secure, SameSite cookie; short-lived access token in memory. Half of this already exists unused — `frontend/src/app/api/auth/session/route.ts` already sets a `zeal_refresh_token` httpOnly cookie; the login page just never calls it. Finish and wire that path.
- **Add a real middleware auth gate.** Extend `frontend/src/proxy.ts` (Next 16 middleware) to check the session cookie and redirect unauthenticated hits at the edge, replacing the flash-of-null `useEffect` guard as the primary gate (keep the client guard as defense-in-depth).
- **Close the RLS gap before any external tenant.** With hand-picked pilot tenants, a tenant-filter bug is an incident; with outsiders it's a breach. Implement the PostgreSQL RLS layer ADR-0003 already accepted (and the docs already claim), starting with the clinical and foundation databases, and add the missing Prisma tenant middleware to `backend/shared/database-foundation`.
- **Login must handle "which tenant?"** — today email→user is implicitly unique across the platform. Recommendation: keep emails globally unique (simplest), allow one user ↔ multiple tenants later via a membership table.

## 7. Phased roadmap

| Phase | What | Effort |
|---|---|---|
| **0 — Foundations & hardening** | Register domains; real deploys (Dockerfiles for all services + frontend, replace stub workflows for one environment); httpOnly-cookie session + middleware gate; API gateway origin (`api.athma.health`); write the ADRs in §8. Nothing user-visible, everything load-bearing. | ≈ 2–3 weeks |
| **1 — Marketing site + live demo tenant** | New `marketing/` app: home, product, pricing, security, contact — CTAs "Book a demo" and "Explore the live demo" (shared read-only demo tenant seeded from existing seed data). Earns SEO age and captures pipeline from day one. RLS closure (§6) must land before the demo tenant opens. Can run in parallel with Phase 0. | ≈ 2–3 weeks |
| **2 — Blueprint engine + internal provisioning console** | `TenantBlueprint` schema, transactional bootstrap saga (roles, admin user, facility, configs, optional demo data), provisioning-state table, trial/lifecycle fields, internal console UI with the review gate. From this point, onboarding a sales-closed customer takes an hour, not a seed-file session. | ≈ 4–5 weeks |
| **3 — AI intake copilot** | In ai-gateway: conversational interview and document ingestion emitting schema-locked blueprint drafts; catalog-grounded recommendations; verification narration after runs. Implementation team first, then customer admins. "AI-guided setup" goes on the marketing homepage. | ≈ 3–4 weeks |
| **4 — Self-serve + billing (demand-driven)** | Public `/get-started`: signup form + email verification + rate limiting in front of the existing engine and copilot; sandbox trials with sales-assisted production activation; Stripe Billing (Checkout + Customer Portal), plan catalog, webhook-driven tenant status. Triggered by a small-clinic tier or inbound volume, not by the calendar. | ≈ 3–4 weeks when triggered |
| **5 — Enterprise surface** | Per-tenant vanity subdomains (the stored `domain` column finally earns its keep), SSO/SAML, the isolated-shard premium tier ADR-0003 reserved, headless CMS for marketing. | Later, demand-driven |

## 8. Decisions to lock in (each one an ADR)

| Decision | Recommendation |
|---|---|
| Go-to-market motion | **Sales-led with a public read-only demo tenant**; self-serve sandbox trials deferred until a small-clinic tier justifies them. Production activation always sales-assisted (compliance). |
| Provisioning architecture | **Deterministic blueprint engine in foundation + AI intake copilot in ai-gateway + human review gate.** The AI authors blueprints; only the engine writes. Internal tool first, customer-facing later. |
| Marketing stack | **Astro in `marketing/`**; Next.js SSG acceptable. Supersedes `FRONTEND-ARCHITECTURE-DECISION.md`'s single-monolith mandate. |
| Domain scheme | **athma.health / app. / api.**, shared product host, subdomains-per-tenant deferred to enterprise. |
| Billing provider | **Stripe Billing** (Checkout + Customer Portal), built only at Phase 4; revisit only if the UAE entity structure forces a regional provider. |
| Session architecture | **httpOnly refresh cookie + in-memory access token**, finishing the half-built `api/auth/session` route. |

---

*Prepared from a full audit of athma-ce (frontend, foundation/clinical/rcm/prm/ai-gateway services, docs/ADR tree, seed scripts, CI). File references and the mismatch list in §2 are verifiable in-repo.*
