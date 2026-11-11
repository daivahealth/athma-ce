# Public Landing Page and Production Access Requests

The public demo introduces Athma before anyone signs in, and lets organisations ask for a production system.

## Landing page

`/{locale}` shows the landing page when the build has `LANDING_PAGE_ENABLED`; otherwise it redirects to `/{locale}/dashboard` as before.

| Setting | Values | Default |
|---|---|---|
| `NEXT_PUBLIC_LANDING_PAGE` (build time; `LANDING_PAGE_ENABLED` in `frontend/src/lib/config/deployment.ts`) | `on` / `off` | `on` in `demo` mode, `off` in every other mode |

### Public addresses

The landing page, the demo app and the production app can each have their own address. All three are build-time origins (`https://host`, no path); anything else is ignored. Empty means "this same site", and links stay relative.

| Setting (build time) | Example | Used for |
|---|---|---|
| `NEXT_PUBLIC_LANDING_URL` (`LANDING_URL`) | `https://athma.daiva.health` | "What it is" and "Request production access" on the login page. On any other host, `/{locale}` redirects here, so the home page has one address. |
| `NEXT_PUBLIC_DEMO_APP_URL` (`DEMO_APP_URL`) | `https://demo.athma.daiva.health` | "Sign in" and "Explore the live demo" on the landing page, "Explore the demo" after a request is sent. All go to `{DEMO_APP_URL}/{locale}/login`. |
| `NEXT_PUBLIC_PRODUCTION_APP_URL` (`PRODUCTION_APP_URL`) | `https://app.athma.daiva.health` | **Customer sign-in** next to "Request production access", to `{PRODUCTION_APP_URL}/{locale}/login`. Hidden while empty. |

On the demo VM these come from `LANDING_DOMAIN`, `SITE_DOMAIN` and `PRODUCTION_APP_URL`, and Caddy serves only the public pages on the landing host (see the [demo runbook](../runbooks/demo-environment-gcp.md), "Public addresses"). The landing page is still part of the product frontend. When the production app launches, the public site should move to its own deployment and send access requests to production, so prospects' details are not stored in the demo database ([saas-three-surface-plan.md](../plan/saas-three-surface-plan.md)).

The page (`frontend/src/components/landing/landing-page.tsx`, route `app/[locale]/(public)/page.tsx`) has:

- no environment banner, no demo notice, no `[DEMO]` tab-title suffix and no noindex (`app/[locale]/(public)/layout.tsx`), so the same landing page can front a demo or a production deployment (the demo warnings live in the demo app itself: banner, login notice, Terms/Privacy);
- "Explore the live demo" (to `{DEMO_APP_URL}/{locale}/login`, where visitors use social sign-in, see [ADR-0016](../ADR/ADR-0016-external-identity-providers.md)) and "View on GitHub" (`SOURCE_REPOSITORY_URL`, the public `daivahealth/athma-ce` repository, Apache 2.0);
- the modules in the demo;
- "Open source, for anyone" and "Hosted Athma, starting in India" with "Request production access" and, when `PRODUCTION_APP_URL` is set, "Customer sign-in";
- footer with copyright (Daiva Health Systems Private Limited) and Terms / Privacy.

The login page links back to `LANDING_URL` ("What it is", "Request production access") when the landing page is on.

## Request production access

`/{locale}/request-access` (public, `app/[locale]/(public)/request-access/page.tsx`) has no environment banner either and collects organisation name and type, country, contact name, work email, optional phone, facility and bed counts, modules of interest and a message. The requester must tick consent to be stored and contacted. Signed-in demo visitors can submit too: the endpoint is exempt from read-only enforcement.

Abuse controls: a hidden honeypot field (submissions that fill it are dropped silently with the normal response), 5 requests per IP per hour and 3 per email per day (in-memory, per foundation process), and server-side validation with length limits. There is no CAPTCHA.

## Reviewing requests

Platform admins open **Access requests** from the gear (Administration) menu, `/{locale}/access-requests`. The menu item shows only when the token carries `platform.access_request.read`. Each request shows the organisation, contact (with a `mailto:` link), modules and message; the admin can add internal notes and mark it `contacted`, `approved` or `declined`. Filters show counts per status. When email is configured (`SMTP_*` and `ACCESS_REQUEST_NOTIFY_TO`, see the demo runbook), each new request also emails the operator a summary with a link to this page, with the requester as reply-to. Sending never delays or fails the request.

## Permissions and data

- Access requests are **instance-wide**, not tenant data (`access_requests` in `zeal_foundation`, no `tenant_id`).
- `platform.access_request.read` and `platform.access_request.manage` (resource `platform`) are granted to `super_admin` only. `tenant_admin` (seed `05-role-permissions.sql`) and `demo_visitor` (seed `21-demo-visitor.sql`) never receive resource `platform`, so hospital admins and visitors cannot read prospects' contact details. Platform admins come from `OAUTH_PLATFORM_ADMINS` (ADR-0016).
- The demo notice on the Terms and Privacy pages lists what the demo stores: social sign-in identity data and access request details.
- On demo builds the Privacy Policy adds **Personal data on this demo** (`DemoPrivacySection`): what is collected and why (including sandbox contents), storage in Google Cloud Mumbai, retention (demo accounts 12 months after last sign-in, sandboxes 30 days after creation or 60 if extended, access requests 24 months after last contact), no sale or sharing, and DPDP Act rights with the contact in `NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL` (`PRIVACY_CONTACT_EMAIL` in the demo `.env`). The wording is a draft pending Daiva Health's approval.

API: [ACCESS-REQUESTS-API.md](../api/ACCESS-REQUESTS-API.md).

## Code map

| File | Role |
|---|---|
| `frontend/src/components/landing/landing-page.tsx` | Landing page |
| `frontend/src/app/[locale]/(public)/page.tsx` | `/{locale}`: landing page, redirect to `LANDING_URL` from another host, or redirect to the dashboard |
| `frontend/src/lib/config/deployment.ts` | `LANDING_PAGE_ENABLED`, `LANDING_URL`, `DEMO_APP_URL`, `PRODUCTION_APP_URL`, `siteHref` |
| `infrastructure/demo-gcp/Caddyfile` | Demo VM: landing-only public host, app host, redirects |
| `frontend/src/app/[locale]/(public)/request-access/page.tsx` | Request form |
| `frontend/src/app/[locale]/(dashboard)/access-requests/page.tsx` | Admin review page |
| `frontend/src/modules/access-requests/api.ts` | API calls, option lists |
| `backend/services/foundation/src/modules/access-request/` | Controller, service, DTOs |
| `backend/shared/database-foundation/prisma/migrations/20261108010000_access_requests/` | Table and platform permissions |
