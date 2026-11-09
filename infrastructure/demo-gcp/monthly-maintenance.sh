#!/usr/bin/env bash
# Monthly housekeeping for the demo VM.
#
#   sudo /opt/athma/infrastructure/demo-gcp/monthly-maintenance.sh
#
# Demo VM only. The daily refresh (refresh-demo-data.sh) deletes and rewrites
# the generated demo rows, so the data itself does not grow, but every refresh
# leaves dead row versions behind. This reclaims them, prunes Docker build
# cache and old images (the 30 GB disk filled up once during a build), and
# trims logs. It does not delete demo data, backups or sandbox tenants.
# Installed as a monthly cron job (cron/athma-demo).
set -euo pipefail

PG=${PG_CONTAINER:-athma-demo-postgres-1}
DB_USER=${DB_USER:-zeal_user}
LOG=${REFRESH_LOG:-/var/log/athma-demo-refresh.log}

echo "$(date -u +%FT%TZ) monthly maintenance"
df -h / | tail -1

# VACUUM FULL rewrites each table (brief exclusive locks; seconds at demo size).
for db in zeal_clinical zeal_rcm zeal_foundation zeal_analytics zeal_prm zeal_abdm; do
  echo ">>> vacuum full $db"
  docker exec "$PG" psql -q -X -U "$DB_USER" -d "$db" -c 'VACUUM (FULL, ANALYZE)'
done
docker exec "$PG" psql -X -At -U "$DB_USER" -d postgres \
  -c "SELECT datname || ' ' || pg_size_pretty(pg_database_size(datname)) FROM pg_database WHERE datname LIKE 'zeal_%'"

echo ">>> docker cache"
docker builder prune -af
docker image prune -f

echo ">>> logs"
journalctl --vacuum-size=200M
# Keep the last ~2 months of refresh output.
if [ -f "$LOG" ]; then tail -n 5000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"; fi

df -h / | tail -1
echo "$(date -u +%FT%TZ) maintenance complete"
