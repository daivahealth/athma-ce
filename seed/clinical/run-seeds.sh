#!/bin/bash

# Clinical Database Seed Runner
# Run all clinical seed scripts in order

DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="zeal_clinical"
DB_USER="zeal_user"
DB_PASS="zeal_password"

export PGPASSWORD=$DB_PASS

echo "🌱 Seeding Clinical Database..."
echo "Database: $DB_NAME"
echo ""

# Run seed scripts in order
echo "📊 Seeding ValueSets..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 01-valuesets-core.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 02-valuesets-countries.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 03-valuesets-languages-currencies.sql

echo ""
echo "💊 Seeding Catalog Data..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 04-medications.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 05-lab-tests.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 06-imaging-studies.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 07-procedures.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 08-diagnosis-master.sql

echo ""
echo "📦 Seeding Packages..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 09-packages.sql

echo ""
echo "🏥 Seeding Administrative Services..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 10-administrative-services.sql

echo ""
echo "✅ Seeding complete!"
