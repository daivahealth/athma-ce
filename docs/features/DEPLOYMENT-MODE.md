# Deployment Mode, Environment Notices and Legal Pages

Every Athma frontend build declares which kind of instance it is: development, demo, staging or production. Non-production instances say so on every screen, so nobody mistakes a demo or test box for a live system or enters real patient data into it. The app also serves public Terms & Conditions and Privacy Policy pages.

## Setting the mode

The mode comes from `NEXT_PUBLIC_DEPLOYMENT_MODE` in the frontend build environment.

| Value (aliases) | Mode | Badge | Notice |
|---|---|---|---|
| `development` (`dev`, `local`) | development | `DEV` | Development instance; data may be reset; no real patient data |
| `demo` (`sandbox`) | demo | `DEMO` | Not for production or clinical use; no real or live patient data; records are fictitious and may be reset |
| `staging` (`stage`, `uat`, `qa`, `test`) | staging | `STAGING` | Staging/test environment; not for clinical use; no real patient data |
| `production` (`prod`, `live`) | production | none | none |

- Values are case-insensitive. An unknown or empty value falls back to the default.
- **Default when unset:** `development` under `next dev`, `production` for a `next build`. A production build of a demo or test box must therefore set the variable explicitly.
- Like every `NEXT_PUBLIC_*` value, the mode is **baked in at build time**. Changing it means rebuilding the frontend image; restarting the container is not enough.
- The single source of truth is `frontend/src/lib/config/deployment.ts` (`DEPLOYMENT_MODE`, `getDeploymentModeInfo()`). Read the mode from there; do not read `process.env.NEXT_PUBLIC_DEPLOYMENT_MODE` elsewhere.

The demo stack in `infrastructure/demo-gcp/` builds with `demo` by default. Override it with `DEPLOYMENT_MODE=<mode>` in that stack's `.env` (see [the demo runbook](../runbooks/demo-environment-gcp.md)).

## What a non-production instance shows

| Where | What |
|---|---|
| App shell (dashboard and clinical layouts) | Full-width banner above the topbar with the mode's notice and links to Terms and Privacy (`EnvironmentBanner`). Its **×** button closes it for the rest of the browser session (`sessionStorage` key `athma.environment-banner.dismissed`); a new session shows it again, and the topbar badge stays visible meanwhile |
| Public landing and request-access pages | No banner, so the same landing site can front demo and production deployments |
| Topbar | Compact `DEV` / `DEMO` / `STAGING` pill next to the sidebar toggle that stays visible while scrolling; the notice is its tooltip (`EnvironmentBadge`) |
| Login screen | The badge under the logo and the notice above the sign-in form |
| Terms and Privacy pages | The banner, plus a highlighted "Demonstration environment" (or "<MODE> environment") section listing the restrictions |
| Browser tab | Title suffix, e.g. `Patients | Athma [DEMO]` |
| Search engines | `<meta name="robots" content="noindex, nofollow">` |

Production shows none of these.

The demo disclaimer covers: not for production or clinical use; no real or live patient data or PHI/PII; all records are fictitious; data may be reset or deleted without notice and is not backed up for recovery; nothing shown is medical advice; availability and security are not guaranteed to production standards.

## Read-only demo visitors

A user holding the `demo_visitor` role gets a read-only access token (`readOnly: true`), and every backend service refuses their writes with `403 READ_ONLY_ACCESS` (see [Read-only access](../security/20-RBAC-Access-Control.md#read-only-access)). The UI does not hide action buttons; instead:

- the environment banner adds "You are exploring in read-only mode; changes are not saved" (with a **Create your own sandbox** link when [sandboxes](./SANDBOX-TENANTS.md) are on), and the topbar badge reads `DEMO · READ-ONLY` (`DEMO · SANDBOX` inside the user's sandbox);
- when a write is refused, the API client shows a "Read-only demo" toast (at most one every 4 seconds), next to whatever error the screen itself shows.

Visitors usually arrive through **social sign-in**: when the instance has external providers configured, the login page shows "Continue with Google / Microsoft / GitHub", enabled once the visitor ticks the demo Terms and Privacy consent (`SocialSignIn`, `frontend/src/components/auth/social-sign-in.tsx`). After the provider round trip, `/{locale}/auth/callback` exchanges the one-time ticket for a session. Design: [ADR-0016](../ADR/ADR-0016-external-identity-providers.md).

**Email sign-in on the login page** is controlled by `NEXT_PUBLIC_LOGIN_EMAIL` (build time; `EMAIL_LOGIN_MODE` in `frontend/src/lib/config/deployment.ts`):

| Value | Login page |
|---|---|
| `collapsed` (default in `demo` mode) | Only the external sign-in buttons, with a small "Staff sign-in with email" link that expands the email + password form |
| `visible` (default in every other mode) | The email + password form is shown as usual, below the external buttons under an "or sign in with email" divider |

The form is always shown when no external provider is enabled or the provider list cannot be loaded, and when the URL has `?staff=1` (a bookmarkable staff link) or `?email=`. Collapsing only changes the page: `POST /auth/login` still accepts email and password.

`frontend/src/lib/auth/read-only.ts` holds `useIsReadOnlyUser()`, `isReadOnlyError()` and the toast. The read-only state is read from the stored access token after mount, so server render and first paint never show it.

## Terms & Conditions and Privacy Policy

- Routes: `/{locale}/terms` and `/{locale}/privacy`, in the `(legal)` route group. They are public (no auth guard), so they can be opened from the login screen.
- Linked from: the login screen footer, the user menu in the topbar, the environment banner, and the footer of the legal pages.
- Content mirrors the Terms & Conditions and Privacy Policy published by Daiva Health Systems Private Limited at [daiva.health](https://daiva.health/) (last updated November 2026), adapted to Athma: the licence section names Athma CE's Apache License 2.0, and the privacy contact points users to the organisation operating the instance. Each page states that the daiva.health version applies if the two differ. When daiva.health updates its policies, update `frontend/src/app/[locale]/(legal)/*/page.tsx` and `LEGAL_LAST_UPDATED` in `frontend/src/components/legal/legal-shell.tsx`.
- The pages are English only for now; the `ar` locale renders the English text.
- The privacy page states that Athma sends no usage data to Daiva Health. Keep that true: frontend observability (`NEXT_PUBLIC_OBSERVABILITY_ENABLED`) exports only to the operator's own OpenTelemetry collector. If any outbound telemetry is added, update the privacy page in the same change.

## Code map

| File | Role |
|---|---|
| `frontend/src/lib/config/deployment.ts` | Parses the mode, labels and notices, and `EMAIL_LOGIN_MODE` |
| `frontend/src/components/layout/environment-banner.tsx` | `EnvironmentBanner` and `EnvironmentBadge` (with the read-only notice) |
| `frontend/src/lib/auth/read-only.ts` | Read-only user detection and the refused-write toast |
| `frontend/src/components/legal/legal-shell.tsx` | Legal page header/footer, `LegalLinks`, document and section layout |
| `frontend/src/components/legal/deployment-notice-section.tsx` | Instance notice on the legal pages |
| `frontend/src/app/[locale]/(legal)/` | Terms and Privacy routes |
| `frontend/src/app/layout.tsx` | Tab-title suffix and `noindex` |
