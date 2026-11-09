# Demo Environment on GCP (single VM)

## Scope
- A **demo** instance of the full athma-ce stack on one Compute Engine VM. Not production: there is no high availability, no managed database, no backups beyond the VM disk, and the services use seed/demo data only.
- Never load real patient data into this environment.
- Assets: [`infrastructure/demo-gcp/`](../../infrastructure/demo-gcp/) (Dockerfiles, `docker-compose.yml`, `Caddyfile`, `db-snapshot.sh`, `.env.example`).

## Topology

| Item | Value |
|---|---|
| GCP project | `athma-ce-demo` (org `sajithchandran-org`) |
| VM | `athma-demo`, `asia-south1-a`, e2-standard-2 (2 vCPU / 8 GB), Debian 12, 30 GB pd-balanced, 4 GB swap |
| Static IP | `athma-demo-ip` → `34.100.225.182` |
| Firewall | `allow-http-https` (tcp 80/443, target tag `web`); SSH via OS Login |
| App dir on VM | `/opt/athma` (compose project in `/opt/athma/infrastructure/demo-gcp`, secrets in `.env`, mode 600) |

All containers run under one Docker Compose project: Postgres (pgvector, pg16), Redis, foundation, clinical, rcm, prm, ai-gateway, abdm-connector, the Next.js frontend, and Caddy.

Caddy terminates TLS (Let's Encrypt) and routes by hostname, because every backend service uses the same `/api/v1` prefix:

| Hostname | Target |
|---|---|
| `<DEMO_DOMAIN>` and `app.<DEMO_DOMAIN>` | frontend :3000 |
| `foundation.<DEMO_DOMAIN>` | foundation :3010 |
| `clinical.<DEMO_DOMAIN>` | clinical :3011 |
| `rcm.<DEMO_DOMAIN>` | rcm :3012 |
| `prm.<DEMO_DOMAIN>` | prm :3013 |
| `ai.<DEMO_DOMAIN>` | ai-gateway :3015 |

Inside the compose network the services call each other by container name, set in the shared backend environment (`CLINICAL_API_URL`, `CLINICAL_SERVICE_URL`, `FOUNDATION_API_URL` and others). RCM accepts these either as a bare origin (`http://clinical:3011`) or with the prefix (`http://clinical:3011/api/v1`): it appends `/api/v1` when the value has no path. Other services may not, so keep `/api/v1` on `FOUNDATION_API_URL`.

The abdm-connector (:3016) is internal only.

`DEMO_DOMAIN` is `athma-ce-demo.daiva.health`, so the app is at `https://athma-ce-demo.daiva.health`. `daiva.health` DNS is hosted in Netlify, which needs two `A` records:

| Name | Type | Value |
|---|---|---|
| `athma-ce-demo` | A | `34.100.225.182` |
| `*.athma-ce-demo` | A | `34.100.225.182` |

A `<ip-with-dashes>.sslip.io` domain (for example `34-100-225-182.sslip.io`) also works with no DNS setup. However, some corporate networks block `sslip.io`, including the Narayana Health office network. After changing `DEMO_DOMAIN` in `.env`, rebuild the frontend (`sudo docker compose build frontend && sudo docker compose up -d`), because the `NEXT_PUBLIC_*` URLs are baked in at build time.

Browser calls cross subdomains. Foundation, clinical, prm and ai-gateway allow the origins listed in `CORS_ORIGINS`, which is set to `https://<DEMO_DOMAIN>,https://app.<DEMO_DOMAIN>`. RCM reflects the request origin.

## Build notes
- **Backend image:** one image (`Dockerfile.backend`) for all six services; compose picks the entrypoint per service. Compiled entrypoints live at `services/<svc>/dist/services/<svc>/src/main.js`.
- **Clinical runs through ts-node (`--transpile-only`):** the oncology plugin's module entrypoint is TypeScript and is `require()`d at boot (discovered from `/app/plugins`).
- **Build order:** turbo does not order builds by `file:` workspace dependencies. The Dockerfile builds contracts/types, then utils, then the other shared packages, then everything else.
- **Frontend contract types:** the frontend imports `backend/contracts/src` by relative path, so the image keeps the repo layout.
- **Deployment mode:** the frontend builds with `NEXT_PUBLIC_DEPLOYMENT_MODE=demo`, which shows the "DEMO: not for production or clinical use, no real or live patient data" banner, a `DEMO` badge and a `[DEMO]` tab-title suffix, and sets `noindex`. Override it with `DEPLOYMENT_MODE=<mode>` in `.env`, then rebuild the frontend. See [Deployment Mode](../features/DEPLOYMENT-MODE.md).

## Monthly cost (approximate, on-demand)

| Item | ~USD/month |
|---|---|
| e2-standard-2 running 24×7 (asia-south1) | 55–58 |
| 30 GB pd-balanced | 4 |
| Static IP | 4 |
| Egress and snapshots | 1–2 |
| **Always on** | **~65** |
| Stopped (disk + IP only) | ~8 |

Stop the VM between demos to cut cost to about $8 a month:

```bash
gcloud compute instances stop athma-demo --zone=asia-south1-a --project=athma-ce-demo
gcloud compute instances start athma-demo --zone=asia-south1-a --project=athma-ce-demo
```

Containers restart automatically (`restart: unless-stopped`).

## Deploy or update

### First deploy
1. Package the source from the repo root on a dev machine, excluding `node_modules`, `dist`, `.next`, `.git` and `.env*`, and copy it to the VM with `gcloud compute scp`. Extract it into `/opt/athma`.
2. Create `/opt/athma/infrastructure/demo-gcp/.env` from `.env.example`, generating every secret with `openssl rand`.
3. Build and start the stack:
   ```bash
   cd /opt/athma/infrastructure/demo-gcp
   sudo docker compose build
   sudo docker compose up -d
   ```

### Redeploy
Build the new release next to the running one, so the site stays up during the build, then swap directories.

1. On a dev machine, package the commit to deploy and copy it over:
   ```bash
   git fetch origin
   git archive --format=tar.gz -o athma.tgz origin/main
   gcloud compute scp athma.tgz athma-demo:/tmp/athma.tgz --zone=asia-south1-a --project=athma-ce-demo
   ```
2. On the VM, free disk space first. Docker's build cache grows by several GB per build, and the 30 GB disk fills up with "no space left on device" partway through the build. Pruning does not touch running containers or the images they use.
   ```bash
   sudo docker builder prune -af && sudo docker image prune -f && df -h /
   ```
3. Extract the release, reuse the existing secrets, record the revision, and build:
   ```bash
   sudo rm -rf /opt/athma-new && sudo mkdir /opt/athma-new
   sudo tar xzf /tmp/athma.tgz -C /opt/athma-new
   sudo cp -p /opt/athma/infrastructure/demo-gcp/.env /opt/athma-new/infrastructure/demo-gcp/.env
   echo <commit-sha> | sudo tee /opt/athma-new/.deployed-rev
   cd /opt/athma-new/infrastructure/demo-gcp && sudo docker compose build
   ```
   The compose project name is `athma-demo`, so the build retags the live images, but running containers keep the old ones until `up -d`.
4. Apply schema changes (see [Schema changes](#schema-changes)) after stopping the app services, then swap and start:
   ```bash
   cd /opt/athma/infrastructure/demo-gcp
   sudo docker compose stop foundation clinical rcm prm ai-gateway abdm-connector frontend
   # apply migrations here
   sudo rm -rf /opt/athma-prev && sudo mv /opt/athma /opt/athma-prev && sudo mv /opt/athma-new /opt/athma
   cd /opt/athma/infrastructure/demo-gcp && sudo docker compose up -d
   ```
5. Prune the build cache again (step 2), then check the stack (see [Triage](#triage)). Each API host should answer, for example `curl -s -o /dev/null -w "%{http_code}" https://foundation.<DEMO_DOMAIN>/api/v1/health`.

`/opt/athma-prev` keeps the previous source tree. Rolling back means swapping it back and rebuilding, and reversing any schema changes by hand.

### Schema changes
The containers do not run migrations at startup, and the demo database has no `_prisma_migrations` history because it was restored from a dump (see [Reset demo data](#reset-demo-data)). Apply every schema change in the deployed range by hand:

1. List what changed since the deployed revision (`cat /opt/athma/.deployed-rev` on the VM):
   ```bash
   git diff --stat <deployed-sha> origin/main -- '*migrations*' '*schema.prisma' plugins/*/backend/prisma
   ```
2. Run each new migration SQL file against its database (`zeal_foundation`, `zeal_clinical`, `zeal_rcm`, `zeal_prm`, `zeal_abdm`, `zeal_analytics`). Plugin schemas such as `plugin_oncology` live in `zeal_clinical`:
   ```bash
   sudo docker exec -i athma-demo-postgres-1 psql -v ON_ERROR_STOP=1 -U zeal_user -d zeal_foundation < <migration>.sql
   ```
3. A `schema.prisma` change without a migration file (plugin schemas often have none) needs its SQL written by hand. To see what is still missing, diff a database against its schema from inside the service container that owns it:
   ```bash
   sudo docker compose exec -T prm sh -c 'cd /app/backend/shared/database-prm && npx prisma migrate diff --from-url "$PRM_DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --script'
   ```
   Review the output before applying it. Apply only additive statements without asking; a dropped column or table can lose demo data.

## Read-only visitors

Public visitors use the read-only `demo_visitor` role; their writes are refused by every service. The backend containers run with `AUTH_REQUIRE_TOKEN_FOR_WRITES=true` (compose default), so writes without a valid JWT or the internal key are refused with 401. See [Read-only access](../security/20-RBAC-Access-Control.md#read-only-access).

## Tenant isolation

Every service refuses a request whose token names a different tenant from its `x-tenant-id` header (`403 TENANT_MISMATCH`). Reads without a token are controlled by `AUTH_REQUIRE_TOKEN_FOR_READS`: the compose default is `report`, which only logs. Sandbox tenants ([ADR-0017](../ADR/ADR-0017-sandbox-tenants.md)) must not be enabled until it is `true`.

To switch reads to enforcing:

1. With `report` on, browse the demo signed in and signed out (landing, login, request access, a few modules), then look for refusals that would have happened:
   ```bash
   cd /opt/athma/infrastructure/demo-gcp
   sudo docker compose logs --since 24h foundation clinical rcm prm ai-gateway 2>&1 | grep 'tokenless read would be refused' | sort | uniq -c | sort -rn | head -30
   ```
   Lines from the browser before sign-in or from a service-to-service call need fixing first; probes from the internet (random paths) are expected.
2. Add `AUTH_REQUIRE_TOKEN_FOR_READS=true` to `.env`, then `sudo docker compose up -d foundation clinical rcm prm ai-gateway`.
3. Check that a tokenless read is refused and the site still works:
   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' https://clinical.athma-ce-demo.daiva.health/api/v1/patients   # 401
   ```

Rolling back is removing the line and recreating the services.

Clinical migration `014_per_tenant_document_numbers.sql` makes patient MRNs, encounter numbers, admission numbers and consent template codes unique per tenant. Apply it with the other schema changes:

```bash
sudo docker exec -i athma-demo-postgres-1 psql -v ON_ERROR_STOP=1 -U zeal_user -d zeal_clinical \
  < backend/shared/database-clinical/migrations/014_per_tenant_document_numbers.sql
```

## Sandboxes

Signed-in visitors can create their own sandbox hospital ([SANDBOX-TENANTS.md](../features/SANDBOX-TENANTS.md)). Off by default (`SANDBOX_ENABLED=false`).

To turn on:

1. Apply foundation migration `20261108020000_sandboxes` (the `sandboxes` table and the `platform.sandbox.*` permissions for `super_admin`):
   ```bash
   sudo docker exec -i athma-demo-postgres-1 psql -v ON_ERROR_STOP=1 -U zeal_user -d zeal_foundation \
     < backend/shared/database-foundation/prisma/migrations/20261108020000_sandboxes/migration.sql
   ```
2. Apply foundation migration `20261108030000_nav_operating_theatre` (instance default for the new Operating Theatre menu switch; without it the OT menu disappears for every tenant):
   ```bash
   sudo docker exec -i athma-demo-postgres-1 psql -v ON_ERROR_STOP=1 -U zeal_user -d zeal_foundation \
     < backend/shared/database-foundation/prisma/migrations/20261108030000_nav_operating_theatre/migration.sql
   ```
3. Make sure reads are enforced (see [Tenant isolation](#tenant-isolation)): sandbox creation is refused while `AUTH_REQUIRE_TOKEN_FOR_READS` is not `true`.
4. Add `SANDBOX_ENABLED=true` to `.env` and recreate the backend: `sudo docker compose up -d foundation clinical rcm prm ai-gateway`. Every service reads it: the internal copy and purge endpoints refuse without it.

Limits (`.env`, defaults): `SANDBOX_MAX_ACTIVE=50`, `SANDBOX_LIFETIME_DAYS=30`, `SANDBOX_EXTENSION_DAYS=30`, `SANDBOX_MAX_CREATES_PER_DAY=3`. Each sandbox copies the demo hospital's setup (a few MB; the patients are not copied).

Checking on sandboxes:

```bash
sudo docker exec athma-demo-postgres-1 psql -U zeal_user -d zeal_foundation -c \
  "select organisation_name, organisation_type, status, owner_email, created_at, expires_at, left(error, 80) from sandboxes order by created_at desc limit 20"
sudo docker compose logs --since 1h foundation 2>&1 | grep -i sandbox
```

- **Stuck in `provisioning`:** the sweep marks it `failed` after an hour and removes partial data.
- **`failed` with a service error:** cleanup is retried every 15 minutes until every service has removed the data. The owner can create another.
- **Delete one by hand:** use the platform admin API (`DELETE /api/v1/sandboxes/{id}`) or set `expires_at` in the past and wait for the sweep. Never delete a sandbox tenant's rows with SQL against the demo tenant id.

Turning sandboxes off (`SANDBOX_ENABLED=false`) stops creation and the expiry sweep; owners can still switch to existing sandboxes, which stay until sandboxes are turned on again and the sweep expires them.

The seeded `admin@zeal.local` has a random password on the demo (root-only `/root/athma-demo-admin.txt` on the VM); the published `Admin@123` does not work there. Platform admins sign in with Google (`OAUTH_PLATFORM_ADMINS`).

Create the role and the shared visitor account (`visitor@athma.demo` / `Visitor@123`) once, and again after any seed or plugin that adds permissions:

```bash
# VM
cd /opt/athma
sudo docker exec -i athma-demo-postgres-1 psql -U zeal_user -d zeal_foundation < seed/foundation/21-demo-visitor.sql
```

Check: log in as the visitor, open any patient, and try to save a change. It should be refused with a "Read-only demo" toast.

## Social sign-in (Google, Microsoft, GitHub)

Visitors sign in with an existing account and land as read-only `demo_visitor` users ([ADR-0016](../ADR/ADR-0016-external-identity-providers.md)). Each provider shows up on the login page once its client id and secret are in `.env`.

Register one app per provider. In every case the redirect URI is `https://foundation.<DEMO_DOMAIN>/api/v1/auth/oauth/<provider>/callback`:

| Provider | Where | Settings |
|---|---|---|
| Google | Google Cloud console → APIs & Services → Credentials → OAuth client ID (Web application), in project `athma-ce-demo` | Consent screen: External, scopes `openid email profile`, app name "Athma Demo", links to `https://<DEMO_DOMAIN>/en/privacy` and `/en/terms`. Redirect URI `…/auth/oauth/google/callback` |
| Microsoft | Microsoft Entra admin center → App registrations → New registration | Supported account types: "Any Entra ID tenant + personal Microsoft accounts". Platform Web, redirect URI `…/auth/oauth/microsoft/callback`. Certificates & secrets → new client secret (note its expiry). API permissions: `openid email profile User.Read` (delegated) |
| GitHub | GitHub → Settings → Developer settings → OAuth Apps → New (under the daivahealth org) | Homepage `https://<DEMO_DOMAIN>`, callback URL `…/auth/oauth/github/callback` |

Put the ids and secrets in `/opt/athma/infrastructure/demo-gcp/.env` (`OAUTH_GOOGLE_CLIENT_ID`, `OAUTH_GOOGLE_CLIENT_SECRET`, and so on) together with `OAUTH_PLATFORM_ADMINS=google:<your Google email>`, then `sudo docker compose up -d foundation`. No rebuild is needed.

Check: `curl -s https://foundation.<DEMO_DOMAIN>/api/v1/auth/oauth/providers` lists the providers, and signing in with a fresh account lands read-only.

The `user_identities` and `oauth_login_tickets` tables come from migration `20261108000000_user_identities`; apply it by hand on the VM (see [Schema changes](#schema-changes)):

```bash
# VM
cd /opt/athma
sudo docker exec -i athma-demo-postgres-1 psql -U zeal_user -d zeal_foundation \
  < backend/shared/database-foundation/prisma/migrations/20261108000000_user_identities/migration.sql
```

Visitors who signed in: `select provider, email, last_login_at from user_identities order by created_at desc;` in `zeal_foundation`.

## Landing page and access requests

The demo build shows the public landing page at `/` and the "Request production access" form ([feature doc](../features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md)). Turn the landing page off with `LANDING_PAGE=off` in `.env` and rebuild the frontend.

The `access_requests` table and the platform permissions come from migration `20261108010000_access_requests`; apply it by hand on the VM:

```bash
# VM
cd /opt/athma
sudo docker exec -i athma-demo-postgres-1 psql -U zeal_user -d zeal_foundation \
  < backend/shared/database-foundation/prisma/migrations/20261108010000_access_requests/migration.sql
```

Platform admins must sign out and in again to pick up the new permissions. Review requests under the gear menu, **Access requests**. No email is sent for new requests.

## Public address (SITE_DOMAIN)

The web app's public address is `SITE_DOMAIN` (for example `athma.daiva.health`); `DEMO_DOMAIN` and `app.DEMO_DOMAIN` redirect to it (308), so every visitor has one browser session and sign-in always returns to the same address. The APIs stay on `*.DEMO_DOMAIN`, so OAuth redirect URIs do not change. Unset, `SITE_DOMAIN` is `DEMO_DOMAIN` and nothing redirects.

Order matters, or the old address redirects to one that does not resolve:

1. Add a Netlify DNS `A` record `athma` → `34.100.225.182` and wait until `dig +short athma.daiva.health` returns it.
2. Add `SITE_DOMAIN=athma.daiva.health` to `.env`, then `sudo docker compose up -d caddy foundation` (Caddy fetches the certificate on first request).
3. Optionally update the Google OAuth branding links (home page, privacy, terms) to the new address.

## Email alerts

New access requests can email the operator. Foundation sends through SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, optional `MAIL_FROM`) to `ACCESS_REQUEST_NOTIFY_TO` (comma-separated), with the requester as reply-to. Without them nothing is sent and requests are still stored.

For Gmail: turn on 2-Step Verification on the account, create an app password at https://myaccount.google.com/apppasswords, then in `.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=<gmail address>
SMTP_PASS=<16-character app password>
ACCESS_REQUEST_NOTIFY_TO=<where alerts go>
```

and `sudo docker compose up -d foundation`. Failures are logged by foundation (`Email "…" failed`) and never block the request.

## India demo content

`infrastructure/demo-gcp/india/` presents the demo tenant as an Indian hospital group: tenant "Athma Demo Hospital", the Dubai clinic becomes "Athma City Clinic" (Pune), staff get Indian names (same gender) with +91 phones and `@demo.athma.example` emails, copies of staff names on appointments, schedules and dispensings follow, and the sample payer drops the Zeal brand. Ids do not change. Run after any reseed or `27-demo-activity.sql` refresh (back up first):

```bash
# VM
cd /opt/athma/infrastructure/demo-gcp/india
sudo docker exec -i athma-demo-postgres-1 psql -U zeal_user -d zeal_foundation -v ON_ERROR_STOP=1 < 01-foundation.sql
sudo docker exec -i athma-demo-postgres-1 psql -U zeal_user -d zeal_clinical   -v ON_ERROR_STOP=1 < 02-clinical.sql
sudo docker exec -i athma-demo-postgres-1 psql -U zeal_user -d zeal_rcm        -v ON_ERROR_STOP=1 < 03-rcm.sql
```

## Reset demo data
Demo data is copied from a local dev database that has been seeded with `seed/run-seeds.sh`:

```bash
# dev machine
infrastructure/demo-gcp/db-snapshot.sh dump ./dbdump
# VM, after copying ./dbdump over
cd /opt/athma/infrastructure/demo-gcp
sudo docker compose stop foundation clinical rcm prm ai-gateway abdm-connector
sudo ./db-snapshot.sh restore /opt/athma/dbdump
sudo docker compose up -d
```

### Keep the demo data current (daily refresh)
Since 2026-11-09 the VM refreshes all generated demo data itself, so graphs,
worklists and the ward board always run up to today.
`infrastructure/demo-gcp/refresh-demo-data.sh` re-runs the whole chain below
in dependency order: the inpatient ward overlay, demo activity, invoices,
oncology cohort, cancer-centre clinical overlay, India name overlays, and
inpatient beds. It takes about 90 seconds. It runs with
`PGTZ=Asia/Kolkata`, so "today", clinic hours and admission times are Indian
times. It stops at the first failing script. Each script is one transaction,
so a failure keeps that script's previous rows.

`/etc/cron.d/athma-demo` (source: `infrastructure/demo-gcp/cron/athma-demo`)
runs the refresh at 00:15 IST, to roll over to the new day. It runs it again
at 12:30 IST, so today's clinic shows the morning as done. On the 1st of each
month, `monthly-maintenance.sh` runs at 22:00 UTC. It runs `VACUUM (FULL,
ANALYZE)` on every database to reclaim the dead rows the refreshes leave,
prunes Docker build cache and dangling images, and trims the journal and the
refresh log. Output goes to `/var/log/athma-demo-refresh.log`.

The data does not grow: every script deletes its own rows before writing.
On 2026-11-09 all databases together were about 230 MB, so no monthly data
purge is needed. The monthly job does not delete backups or sandbox tenants.

```bash
# VM: install or update the schedule after a deploy that changes it
sudo install -m 644 /opt/athma/infrastructure/demo-gcp/cron/athma-demo /etc/cron.d/athma-demo
# run a refresh now
sudo /opt/athma/infrastructure/demo-gcp/refresh-demo-data.sh
```

The cron jobs call the scripts in `/opt/athma`, so a deploy (directory swap)
picks up script changes automatically. Within 30 minutes of a refresh, press
**Refresh** on the dashboard to see the new numbers before the cache rebuilds.

### Inpatient demo data (wards and beds)
The demo database was restored without departments, wards or beds, so the ward
board, bed board and bed search were empty. `infrastructure/demo-gcp/inpatient/`
fixes this (demo VM only; local development keeps `seed/foundation/09-wards.sql`
and `10-beds.sql`):

- `01-foundation.sql` adds the **Inpatient Services** department to Cancer
  Hospital, plus seven oncology wards with 96 beds: Medical Oncology Male and
  Female, Surgical Oncology, Haemato-Oncology, Bone Marrow Transplant Unit,
  Oncology ICU and Palliative Care. Bed MED-M-20 is under maintenance.
- `02-clinical.sql` adds about 10 oncology admissions a day over 13 months
  (`DEMO-ADM-ONC-*`, encounters `DEMO-ENC-IPO-*`). The case mix covers chemo
  cycles, surgery, febrile neutropenia, ICU, palliative care,
  haemato-oncology and BMT, each with a realistic length of stay.
  Every current demo inpatient gets a bed in a ward that fits the case and
  gender, with an open bed assignment. Each one also gets acuity, board flags,
  a vitals rhythm (some overdue), a primary nurse and discharge planning
  status. The newest two admissions wait for a bed, and beds freed by the
  latest discharges await cleaning. About 64 patients are in, about 65%
  occupancy.

Ward and bed ids are `uuid_generate_v5` names (`ward:ONC-<code>`,
`bed:ONC-<code>:<nnn>`) that both files derive. The clinical database cannot
read foundation, so keep the two ward plans in step. The new admissions have
no invoices: `09-demo-invoices.sql` bills only `27-demo-activity.sql` stays.

### Refresh the dashboard's demo activity (manual)
The daily refresh above does this. The HealthAI+ dashboard's worklists,
forecast and Week/Month views read 13 months of activity that
`seed/clinical/27-demo-activity.sql` and `seed/rcm/09-demo-invoices.sql`
generate relative to the day they run. To run them by hand, run both on the
same day, then the cancer-centre, India and inpatient overlays (or just run
`refresh-demo-data.sh`). They only replace their own rows
(MRN `MRN-DEMO-*`, encounter `DEMO-ENC-*`, admission `DEMO-ADM-*`, invoice
`DEMO-INV-*`), so they are safe on a database that has had real demo use:

```bash
# VM; the DB container name and user come from the compose .env
cd /opt/athma
sudo docker exec -i <postgres-container> psql -v ON_ERROR_STOP=1 -U <db-user> -d zeal_clinical < seed/clinical/27-demo-activity.sql
sudo docker exec -i <postgres-container> psql -v ON_ERROR_STOP=1 -U <db-user> -d zeal_rcm < seed/rcm/09-demo-invoices.sql
```

Then press **Refresh** on the dashboard (or wait up to 30 minutes) so the
cached metrics are rebuilt.

### Cancer-centre presentation (oncology demos)
Since 2026-11-05 the demo tenant is presented as a cancer centre:

- Facility `MAIN-HOSP` is renamed **Cancer Hospital** (Mumbai). A second
  facility, **Cancer Clinic** (`CANCER-CLINIC`, Thane), is the satellite
  follow-up clinic. Every user with hospital access can use it.
- Every patient without a hand-built cancer record has a full cancer journey,
  generated by `seed/plugins/oncology/30-demo-cohort.sql`, except 8 demo
  patients held back as registry candidates (Registry → Candidates shows 7;
  the 8th is a benign biopsy that must not appear). See
  [Demo cohort](../features/oncology/ONCOLOGY-PLUGIN.md#demo-cohort).

The facility changes live only on the demo, in `infrastructure/demo-gcp/cancer-centre/`.
The shared seeds still create "Zeal Main Hospital" for local development.
The cohort is dated relative to today, like the demo activity. Re-run all of
it, in this order, after (or together with) the demo-activity refresh above:

```bash
# VM
cd /opt/athma
P="sudo docker exec -i <postgres-container> psql -v ON_ERROR_STOP=1 -U <db-user>"
$P -d zeal_foundation < infrastructure/demo-gcp/cancer-centre/01-foundation.sql
$P -d zeal_clinical   < seed/plugins/oncology/30-demo-cohort.sql      # ~20 s
$P -d zeal_clinical   < infrastructure/demo-gcp/cancer-centre/02-clinical.sql
```

The clinical scripts can be re-run safely. `01-foundation.sql` is a one-time
overlay: since users were added after 2026-11-05, re-running it fails on
`user_facilities_user_id_facility_id_key`, so the daily refresh skips it.
`30-demo-cohort.sql` replaces only the
rows it wrote earlier, and rows of patients that no longer exist. Re-running
`27-demo-activity.sql` recreates the demo patients, so always run the cohort
again after it. Otherwise the demo patients have no cancer data, and their
encounters lose the oncology chief complaints and diagnoses.

Before the first run, back up both databases with `pg_dump -Fc` into
`/opt/athma-backups/`. The 2026-11-05 backups are named
`*-pre-cancer-20261105-0831.dump`.

Tenant secrets (`tenant_secrets`) are encrypted with the source machine's `SECRETS_MASTER_KEY` and will not decrypt on the demo VM. Re-enter any ABDM/NHCX credentials through the settings UI, or keep the providers on mock.

## Triage
- `sudo docker compose ps` and `sudo docker compose logs -f --tail=200 <service>`
- Memory pressure: run `free -h`. The stack uses about 3–4 GB, and swap absorbs build spikes. Resize to e2-standard-4 if services are OOM-killed.
- TLS failures: Caddy needs ports 80 and 443 reachable from the internet. Check `sudo docker compose logs caddy`.
- Disk full (`no space left on device` during a build): `sudo docker builder prune -af && sudo docker image prune -f`.
- `The table ... does not exist` in a service log: a schema change was not applied. See [Schema changes](#schema-changes).
