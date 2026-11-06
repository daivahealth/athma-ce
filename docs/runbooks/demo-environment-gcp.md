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
1. Package the source from the repo root on a dev machine, excluding `node_modules`, `dist`, `.next`, `.git` and `.env*`, and copy it to the VM with `gcloud compute scp`. Extract it into `/opt/athma`.
2. On the first deploy, create `/opt/athma/infrastructure/demo-gcp/.env` from `.env.example`, generating every secret with `openssl rand`.
3. Build and start the stack:
   ```bash
   cd /opt/athma/infrastructure/demo-gcp
   sudo docker compose build
   sudo docker compose up -d
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

### Refresh the dashboard's demo activity
The HealthAI+ dashboard's worklists, forecast and Week/Month views read 13 months of activity that
`seed/clinical/27-demo-activity.sql` and `seed/rcm/09-demo-invoices.sql`
generate relative to the day they run. The history goes stale as days pass, so
re-run both (same day) shortly before a demo. They only replace their own rows
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
  generated by `seed/plugins/oncology/30-demo-cohort.sql`. See
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

All three scripts can be re-run safely. `30-demo-cohort.sql` replaces only the
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
