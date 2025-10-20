#!/usr/bin/env bash

set -euo pipefail

CONTAINER_NAME=${CONTAINER_NAME:-zeal-postgres}
DB_USER=${DB_USER:-zeal_user}
DB_NAME=${DB_NAME:-zeal_foundation}

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Error: postgres container '${CONTAINER_NAME}' is not running." >&2
  exit 1
fi

for file in $(ls -1 *.sql | sort -V); do
  echo "→ Applying ${file}"
  docker exec -i "${CONTAINER_NAME}" psql -v ON_ERROR_STOP=1 -U "${DB_USER}" -d "${DB_NAME}" < "${file}"
  echo "   ✓ done"
  echo ""
done

echo "All foundation seed files applied to database '${DB_NAME}'."
