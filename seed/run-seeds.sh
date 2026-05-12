#!/usr/bin/env bash

set -euo pipefail

CONTAINER_NAME=${CONTAINER_NAME:-zeal-postgres}
DB_USER=${DB_USER:-zeal_user}

FOUNDATION_FILES=(
  # Aligned with current Prisma schema
  "foundation/01-core.sql"           # creates base tenant and core structure
  "foundation/01-tenants.sql"        # adds additional demo tenants (no truncate)
  "foundation/02-specialties.sql"    # medical specialties
  "foundation/03-roles.sql"          # RBAC roles
  "foundation/04-permissions.sql"    # RBAC permissions
  "foundation/05-role-permissions.sql" # role-permission mappings
  "foundation/06-users.sql"          # system users
  "foundation/07-facilities.sql"     # healthcare facilities
  "foundation/08-departments.sql"    # departments
  "foundation/09-wards.sql"          # hospital wards
  "foundation/10-beds.sql"           # beds
  "foundation/11-clinics.sql"        # clinics
  "foundation/12-spaces.sql"         # spaces
  "foundation/18-ot-spaces.sql"      # operating theatre spaces
  "foundation/13-user-roles.sql"     # user role assignments
  "foundation/14-staff.sql"          # clinical staff
  "foundation/15-staff-specialties.sql" # staff specialty mappings
  "foundation/16-rbac-expanded.sql"  # expanded RBAC
  "foundation/17-user-facilities.sql" # user facility access
)

CLINICAL_FILES=(
  "clinical/00-setup.sql"            # Helper functions
  "clinical/01-patients.sql"         # Sample patients
  "clinical/02-valuesets.sql"        # Value sets (dropdowns for forms)
  "clinical/03-vital-signs-templates.sql" # Vital signs templates
  "clinical/04-medications.sql"      # Medication catalog
  "clinical/05-lab-tests.sql"        # Lab test catalog
  "clinical/06-imaging-studies.sql"  # Imaging study catalog
  "clinical/07-procedures.sql"       # Procedure catalog
  "clinical/08-diagnosis-master.sql" # Diagnosis codes
  "clinical/09-administrative-services.sql" # Administrative services catalog
  "clinical/10-packages.sql"         # Health check packages
  "clinical/11-discharge-checklist-template.sql" # Discharge checklist
  "clinical/12-more-checklist-templates.sql"      # Surgery and Central Line checklists
  "clinical/13-biomarkers.sql"                   # Biomarker definitions
  "clinical/14-wellness-programs.sql"            # Wellness program templates
  "clinical/15-longevity-protocols.sql"           # Longevity protocols
  "clinical/16-lifestyle-templates.sql"
  "clinical/17-membership-plans.sql"
  "clinical/18-pgvector-setup.sql"    # pgvector extension for semantic search
  "clinical/23-oncology-catalogs.sql" # Oncology catalog master data (cancer types, primary sites, histologies, mappings)
  "clinical/24-chemo-protocols.sql"  # Chemotherapy protocol library (22 protocols across 12 cancer types)
  "clinical/25-ot-room-configs.sql"  # OT room configuration data
)

RCM_FILES=(
  "rcm/01-claims.sql"
  "rcm/07-catalog-mappings.sql"  # Billing items and clinical catalog mappings
  "rcm/08-pharmacy-stock.sql"    # Pharmacy stock batches (15 medications + OTC items)
)

PRM_FILES=(
  "prm/00-setup.sql"
  "prm/01-templates.sql"
  "prm/02-rules.sql"
  "prm/03-preferences.sql"
  "prm/04-provider-callbacks.sql"
)

ANALYTICS_FILES=(
  "analytics/01-audit-fixtures.sql"
  "analytics/02-semantic-catalog.sql"  # AI Report Builder semantic catalog
)

usage() {
  cat <<USAGE
Usage: ./run-seeds.sh <domain>

Domains:
  foundation   Seed master data (tenants, facilities, staff, catalogs) into zeal_foundation
  clinical     Seed sample patients & consents into zeal_clinical
  rcm          Seed payer and financial reference data into zeal_rcm
  prm          Seed patient engagement setup data into zeal_prm
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
  prm)
    DB_NAME=${PRM_DB_NAME:-zeal_prm}
    FILES=("${PRM_FILES[@]}")
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
