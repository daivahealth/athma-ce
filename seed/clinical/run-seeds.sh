#!/bin/bash

# ValueSets Seed Runner for Clinical Database
# Run all valueset seed scripts in order

DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="zeal_clinical"
DB_USER="zeal_user"
DB_PASS="zeal_password"

export PGPASSWORD=$DB_PASS

echo "🌱 Seeding ValueSets to Clinical Database..."
echo "Database: $DB_NAME"
echo ""

# Run seed scripts in order
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 01-valuesets-core.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 02-valuesets-countries.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f 03-valuesets-languages-currencies.sql

echo ""
echo "✅ Seeding complete!"
