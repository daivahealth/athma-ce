#!/bin/bash

# =====================================================
# Seed Facility Hierarchy Data
# Description: Quick script to seed departments, wards, beds, and clinics
# Usage: ./seed-facility-hierarchy.sh
# =====================================================

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database connection (via Docker)
CONTAINER_NAME="zeal-postgres"
DB_NAME="zeal_pms"
DB_USER="zeal_user"

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}  Zeal PMS - Facility Hierarchy Seed Data${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

# Check if PostgreSQL container is running
if ! docker ps | grep -q $CONTAINER_NAME; then
  echo -e "${YELLOW}Error: PostgreSQL container '$CONTAINER_NAME' is not running${NC}"
  echo "Start it with: docker-compose up -d postgres"
  exit 1
fi

echo -e "${GREEN}✓${NC} PostgreSQL container is running"
echo ""

# Function to execute SQL file
execute_sql() {
  local file=$1
  local description=$2
  
  echo -e "${BLUE}→${NC} $description"
  docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < "$file"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✓ Success${NC}"
  else
    echo -e "${YELLOW}  ✗ Failed${NC}"
    exit 1
  fi
  echo ""
}

# Execute seed files in order
echo -e "${BLUE}Seeding facility hierarchy data...${NC}"
echo ""

execute_sql "07-departments.sql" "Creating departments (OPD, IPD, Emergency, Radiology, etc.)"
execute_sql "08-wards.sql" "Creating wards (ICU, NICU, PICU, General, Isolation, Maternity)"
execute_sql "09-beds.sql" "Creating beds (109 beds across all wards)"
execute_sql "10-clinics.sql" "Creating clinics (Cardiology, Pediatrics, General Medicine, etc.)"
execute_sql "11-spaces.sql" "Creating spaces (Consultation rooms, OR, Radiology, Lab rooms)"

# Verification
echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}  Verification${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

echo -e "${BLUE}Facility Hierarchy Summary:${NC}"
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "
SELECT 
  f.name as facility,
  COUNT(DISTINCT d.id) as departments,
  COUNT(DISTINCT w.id) as wards,
  COUNT(DISTINCT b.id) as beds,
  COUNT(DISTINCT c.id) as clinics
FROM facilities f
LEFT JOIN departments d ON d.facility_id = f.id
LEFT JOIN wards w ON w.department_id = d.id
LEFT JOIN beds b ON b.ward_id = w.id
LEFT JOIN clinics c ON c.department_id = d.id
WHERE f.tenant_id = '11111111-1111-1111-1111-111111111111'
GROUP BY f.id, f.name
ORDER BY f.name;
"

echo ""
echo -e "${BLUE}Ward Bed Counts:${NC}"
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "
SELECT 
  w.name as ward_name,
  w.ward_type,
  w.total_beds,
  w.available_beds,
  w.floor_number
FROM wards w
ORDER BY w.ward_type, w.name;
"

echo ""
echo -e "${BLUE}Clinic Summary:${NC}"
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "
SELECT 
  c.name as clinic_name,
  c.specialty,
  c.total_rooms,
  c.floor_number
FROM clinics c
ORDER BY c.specialty, c.name;
"

echo ""
echo -e "${BLUE}Space Summary by Department:${NC}"
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "
SELECT 
  d.name as department_name,
  d.code,
  COUNT(s.id) as space_count,
  string_agg(DISTINCT s.space_type, ', ') as space_types
FROM departments d
LEFT JOIN spaces s ON s.department_id = d.id
GROUP BY d.id, d.name, d.code
ORDER BY d.code;
"

echo ""
echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  Facility Hierarchy Seed Complete!${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""
echo -e "${GREEN}Summary:${NC}"
echo -e "  • Departments: 7 (OPD, IPD, Emergency, Radiology, Lab, Surgery, Pharmacy)"
echo -e "  • Wards: 9 (ICU x2, NICU, PICU, General x3, Isolation, Maternity)"
echo -e "  • Beds: 109 (all available)"
echo -e "  • Clinics: 10 specialty clinics"
echo -e "  • Spaces: ~81 rooms (consultation, diagnostic, operating, procedure)"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Test APIs via Postman: docs/postman/zeal-backend.postman_collection.json"
echo -e "  2. Verify endpoints: http://localhost:3010/health"
echo -e "  3. View documentation: docs/API-ENDPOINTS-FACILITY-HIERARCHY.md"
echo ""
