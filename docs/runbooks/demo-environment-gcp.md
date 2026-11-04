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
| `app.<DEMO_DOMAIN>` | frontend :3000 |
| `foundation.<DEMO_DOMAIN>` | foundation :3010 |
| `clinical.<DEMO_DOMAIN>` | clinical :3011 |
| `rcm.<DEMO_DOMAIN>` | rcm :3012 |
| `prm.<DEMO_DOMAIN>` | prm :3013 |
| `ai.<DEMO_DOMAIN>` | ai-gateway :3015 |

The abdm-connector (:3016) is internal only. `DEMO_DOMAIN` defaults to `34-100-225-182.sslip.io`, a wildcard DNS name that needs no DNS setup. To use a `daiva.health` subdomain instead, add a wildcard `A` record (for example `*.demo.daiva.health → 34.100.225.182`) in Netlify DNS, change `DEMO_DOMAIN` in `.env`, and rebuild the frontend, because `NEXT_PUBLIC_*` URLs are baked in at build time.

Browser calls cross subdomains, so foundation, clinical, prm and ai-gateway read `CORS_ORIGINS` (set to `https://app.<DEMO_DOMAIN>`). RCM reflects the request origin.

## Build notes
- **Backend image:** one image (`Dockerfile.backend`) for all six services; compose picks the entrypoint per service. Compiled entrypoints live at `services/<svc>/dist/services/<svc>/src/main.js`.
- **Clinical runs through ts-node (`--transpile-only`):** the oncology plugin's module entrypoint is TypeScript and is `require()`d at boot (discovered from `/app/plugins`).
- **Build order:** turbo does not order builds by `file:` workspace dependencies. The Dockerfile builds contracts/types, then utils, then the other shared packages, then everything else.
- **Frontend contract types:** the frontend imports `backend/contracts/src` by relative path, so the image keeps the repo layout.

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

Tenant secrets (`tenant_secrets`) are encrypted with the source machine's `SECRETS_MASTER_KEY` and will not decrypt on the demo VM. Re-enter any ABDM/NHCX credentials through the settings UI, or keep the providers on mock.

## Triage
- `sudo docker compose ps` and `sudo docker compose logs -f --tail=200 <service>`
- Memory pressure: run `free -h`. The stack uses about 3–4 GB, and swap absorbs build spikes. Resize to e2-standard-4 if services are OOM-killed.
- TLS failures: Caddy needs ports 80 and 443 reachable from the internet. Check `sudo docker compose logs caddy`.
