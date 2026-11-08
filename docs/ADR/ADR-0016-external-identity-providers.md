# ADR-0016: External Identity Providers for the Public Demo

**Status:** Accepted
**Date:** 2026-11-08
**Deciders:** Engineering Team
**Related:** ADR-0003 (multitenancy), ADR-0005 (RBAC), ADR-0007 (security & compliance)

## Context

The Athma demo is opening to the public. Visitors must be able to sign in with an account they already have (Google, Microsoft or GitHub), explore every module of the demo hospital read-only, and later create a sandbox tenant of their own. Until now foundation only supported email + password (+ MFA) and issued its own JWTs, which every service verifies.

The operator (platform owner) also needs a named admin login instead of the shared seeded `admin@zeal.local`, whose password is published in the repository.

## Decision

### 1. Foundation stays the only token issuer

External sign-in is an OAuth 2.0 authorization code flow (with PKCE and a client secret) implemented in foundation (`modules/auth/oauth`). After the provider round trip, foundation issues the same access and refresh tokens as password login (`AuthService.issueSession`). Other services need no change and never talk to an identity provider.

No hosted broker (Keycloak, Auth0) and no new runtime dependencies: three providers do not justify another moving part.

### 2. Identities are keyed by provider subject, never by email

`user_identities` links `(tenant_id, provider, provider_subject)` to a user. Emails are stored for contact only:

- An identity is never linked to an existing user by email. A new subject always gets a new user.
- If the provider email is unverified or already used in the tenant, the user gets a synthetic, non-deliverable login email (`<provider>-<hash>@visitors.athma.invalid`).
- External users get an unusable random password hash, so password login is impossible for them.

This rules out account takeover by registering someone else's email with a provider.

### 3. New identities become read-only demo visitors

New identities are provisioned in `PUBLIC_DEMO_TENANT_ID` with the `demo_visitor` role and `read_only` access to every facility, so the read-only enforcement from the RBAC doc applies to them automatically.

**Platform admins** are listed in `OAUTH_PLATFORM_ADMINS` as `google:<email>`. A listed Google identity with a verified email is provisioned with `OAUTH_PLATFORM_ADMIN_ROLES` (default `super_admin,tenant_admin`) instead. Only Google is accepted for this, because it reliably asserts email verification. After the first sign-in the account is bound to the Google subject.

### 4. Browser binding and token hand-off

- `start` sets an HttpOnly, SameSite=Lax cookie holding a random nonce and the PKCE verifier; the signed `state` (10 minutes) carries the nonce's hash, provider, return path, locale and accepted terms version. The callback refuses a state whose nonce does not match the cookie (login CSRF).
- The callback never puts tokens in a URL. It stores a single-use ticket (2 minutes, only its SHA-256 is stored) and redirects to `/{locale}/auth/callback#ticket=…`. Fragments are not sent to servers or in `Referer`. The page posts the ticket to `POST /auth/oauth/exchange` and removes it from history.
- `returnTo` must be a same-site relative path (no open redirect).

### 5. Consent and limits

- The user must tick a consent box (demo Terms and Privacy Policy) before the buttons work; `start` refuses requests without `acceptTerms`. The accepted terms version is stored on the identity.
- In-memory per-IP limits: 30 starts per minute, `OAUTH_MAX_NEW_ACCOUNTS_PER_IP_PER_HOUR` (default 5) new accounts per hour. They are per process: a multi-instance deployment needs a shared store.

## Consequences

- Visitors' names and emails are personal data held by the operator; the privacy notice and DPDP Act obligations apply (consent recorded per identity).
- `demo_visitor` lacks `user.read`, so visitors cannot list each other.
- Password login (`findByEmail`) still matches the first user with an email across tenants; once one person can have users in several tenants (sandboxes), login needs a tenant choice.
- Provider app registrations (client ids, secrets, redirect URIs) are operator tasks; see the demo runbook.

## Alternatives considered

- **NextAuth/Auth.js in the frontend:** would create a second session system beside foundation's JWTs.
- **Keycloak or a hosted broker:** more operational load than three providers justify.
- **Linking by verified email:** convenient, but one provider's email verification would then grant access to another provider's account.
