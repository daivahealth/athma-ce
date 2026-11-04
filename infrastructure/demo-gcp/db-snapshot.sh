#!/usr/bin/env bash
# Copy the demo databases between Postgres instances.
#
#   ./db-snapshot.sh dump <out-dir>     # on a machine with the source DB (default container zeal-postgres)
#   ./db-snapshot.sh restore <in-dir>   # on the demo VM, from infrastructure/demo-gcp
#
# Only use with seed/demo data. Never copy real patient data to the demo VM.
set -euo pipefail

DBS=(zeal_foundation zeal_clinical zeal_rcm zeal_analytics zeal_prm zeal_abdm)
mode=${1:?dump|restore}
dir=${2:?directory}

case "$mode" in
  dump)
    src=${SOURCE_CONTAINER:-zeal-postgres}
    mkdir -p "$dir"
    for db in "${DBS[@]}"; do
      echo ">>> dumping $db"
      docker exec "$src" pg_dump -U zeal_user -Fc --no-owner --no-acl "$db" > "$dir/$db.dump"
    done
    ;;
  restore)
    for db in "${DBS[@]}"; do
      echo ">>> restoring $db"
      docker compose exec -T postgres psql -U zeal_user -d postgres -v ON_ERROR_STOP=1 \
        -c "DROP DATABASE IF EXISTS $db WITH (FORCE)" -c "CREATE DATABASE $db OWNER zeal_user"
      docker compose exec -T postgres pg_restore -U zeal_user -d "$db" --no-owner --no-acl < "$dir/$db.dump"
    done
    ;;
  *) echo "unknown mode $mode" >&2; exit 1 ;;
esac
