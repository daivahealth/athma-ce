#!/usr/bin/env bash

set -euo pipefail

CONTAINER_NAME=${CONTAINER_NAME:-zeal-postgres}
DB_USER=${DB_USER:-zeal_user}

FOUNDATION_FILES=(
  "foundation/01-core.sql"
  "foundation/02-users-rbac.sql"
)

CLINICAL_FILES=(
  "clinical/01-patients.sql"
)

RCM_FILES=(
  "rcm/01-claims.sql"
)

ANALYTICS_FILES=(
  "analytics/01-audit-fixtures.sql"
)

usage() {
  cat <<USAGE
Usage: ./run-seeds.sh <domain>

Domains:
  foundation   Seed master data (tenants, facilities, staff, catalogs) into zeal_foundation
  clinical     Seed sample patients & consents into zeal_clinical
  rcm          Seed payer and financial reference data into zeal_rcm
  analytics    Seed audit/monitoring fixtures into zeal_analytics

Environment overrides:
  CONTAINER_NAME (default: zeal-postgres)
  DB_USER        (default: zeal_user)
  FOUNDATION_DATABASE_URL, CLINICAL_DATABASE_URL, etc. are read by Prisma but not used here.
USAGE
}

if [[ $# -ne 1 ]]; then
  usage
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Error: postgres container '${CONTAINER_NAME}' is not running." >&2
  exit 1
fi

DOMAIN="$1"
DB_NAME=""
FILES=()

case "$DOMAIN" in
  foundation)
    DB_NAME=${FOUNDATION_DB_NAME:-zeal_foundation}
    FILES=("${FOUNDATION_FILES[@]}")
    ;;
  clinical)
    DB_NAME=${CLINICAL_DB_NAME:-zeal_clinical}
    FILES=("${CLINICAL_FILES[@]}")
    ;;
  rcm)
    DB_NAME=${RCM_DB_NAME:-zeal_rcm}
    FILES=("${RCM_FILES[@]}")
    ;;
  analytics)
    DB_NAME=${ANALYTICS_DB_NAME:-zeal_analytics}
    FILES=("${ANALYTICS_FILES[@]}")
    ;;
  *)
    usage
    exit 1
    ;;
 esac

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "No seed files defined for domain '${DOMAIN}'." >&2
  exit 1
fi

capitalize() {
  printf '%s' "$1" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}'
}

display_domain=$(capitalize "$DOMAIN")

for file in "${FILES[@]}"; do
  if [[ ! -f $file ]]; then
    echo "Skipping missing file: $file"
    continue
  fi
  echo "→ ${display_domain}: applying ${file}"
  docker exec -i "${CONTAINER_NAME}" psql -v ON_ERROR_STOP=1 -U "${DB_USER}" -d "${DB_NAME}" < "$file"
  echo "   ✓ done"
  echo ""
 done

echo "All ${DOMAIN} seed files applied to database '${DB_NAME}'."
