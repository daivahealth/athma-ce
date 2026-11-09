#!/usr/bin/env bash
# Roll the demo tenant's generated data forward to today.
#
#   sudo /opt/athma/infrastructure/demo-gcp/refresh-demo-data.sh
#
# Demo VM only. Every demo-data script is dated relative to CURRENT_DATE and
# replaces only its own rows, so re-running the chain moves 13 months of
# clinic, ward, billing and oncology history up to today without growing the
# database. Installed as a daily cron job (cron/athma-demo); see
# docs/runbooks/demo-environment-gcp.md (Keep the demo data current).
#
# Runs in Asia/Kolkata time so "today", clinic hours and admission times match
# the Indian demo. Stops at the first failing script; each script is its own
# transaction, so a failure leaves that script's previous rows in place.
set -euo pipefail

ROOT=${ATHMA_ROOT:-/opt/athma}
PG=${PG_CONTAINER:-athma-demo-postgres-1}
DB_USER=${DB_USER:-zeal_user}
TZ_DEMO=${DEMO_TZ:-Asia/Kolkata}

run() {
  local db=$1 file=$2 t0
  t0=$(date +%s)
  echo "$(date -u +%FT%TZ) >>> $db < $file"
  docker exec -i -e PGTZ="$TZ_DEMO" "$PG" \
    psql -q -X -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$db" -P pager=off < "$ROOT/$file"
  echo "    done in $(( $(date +%s) - t0 ))s"
}

echo "$(date -u +%FT%TZ) demo data refresh from $ROOT ($(cat "$ROOT/.deployed-rev" 2>/dev/null || echo unknown rev))"

# Master data does not age. cancer-centre/01 and india/01 are one-time
# overlays (not re-run here); the ward/bed overlay is idempotent and cheap, so
# it is re-applied in case the database was restored.
run zeal_foundation infrastructure/demo-gcp/inpatient/01-foundation.sql

# Activity, in dependency order (see the runbook).
run zeal_clinical   seed/clinical/27-demo-activity.sql
run zeal_rcm        seed/rcm/09-demo-invoices.sql
run zeal_clinical   seed/plugins/oncology/30-demo-cohort.sql
run zeal_clinical   infrastructure/demo-gcp/cancer-centre/02-clinical.sql
run zeal_clinical   infrastructure/demo-gcp/india/02-clinical.sql
run zeal_rcm        infrastructure/demo-gcp/india/03-rcm.sql
run zeal_clinical   infrastructure/demo-gcp/inpatient/02-clinical.sql

echo "$(date -u +%FT%TZ) refresh complete"
