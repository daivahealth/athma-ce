# Clinical Database ValueSets Seed Data

## Overview

This directory contains seed data for populating ValueSets in the Clinical database (`zeal_clinical`). ValueSets are essential reference data used throughout the clinical workflows for patient registration, encounters, and clinical documentation.

## Seed Files

### seed-valuesets.sql
Comprehensive seed file containing all core valuesets with English and Arabic translations:

**Included ValueSets:**
- `name_titles` - Name titles and honorifics (Mr., Mrs., Dr., Sheikh, etc.)
- `administrative_gender` - Gender codes (male, female, other, unknown)
- `blood_groups` - ABO blood groups with Rh factor (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `marital_status` - Marital status codes (single, married, divorced, widowed, separated)
- `iso_3166_countries` - ISO 3166-1 Alpha-2 country codes (GCC countries + major countries)

## Running the Seed Script

### Using psql directly:
```bash
cd /Users/sajithchandran/aira/zeal/seed/clinical
PGPASSWORD=zeal_password psql -h localhost -U zeal_user -d zeal_clinical -f seed-valuesets.sql
```

### Using the provided script:
```bash
cd /Users/sajithchandran/aira/zeal/seed/clinical
./run-seeds.sh
```

## Verification

After running the seed script, verify the data:

### Check seeded valuesets:
```sql
SELECT
  vs.code,
  vs.name,
  COUNT(DISTINCT vsc.id) as concepts,
  COUNT(DISTINCT vsct.id) as translations
FROM value_sets vs
LEFT JOIN value_set_concepts vsc ON vsc.value_set_id = vs.id
LEFT JOIN value_set_concept_translations vsct ON vsct.concept_id = vsc.id
GROUP BY vs.id, vs.code, vs.name
ORDER BY vs.code;
```

### Test API endpoints:
```bash
# List all valuesets
curl 'http://localhost:3011/api/v1/valuesets' \
  -H 'x-tenant-id: 11111111-1111-1111-1111-111111111111' \
  -H 'x-user-id: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' \
  -H 'x-facility-id: 087e0bd6-8d65-5133-94bd-7b4cd6ff3665'

# Get name titles in English
curl 'http://localhost:3011/api/v1/valuesets/name_titles/concepts?language=en' \
  -H 'x-tenant-id: 11111111-1111-1111-1111-111111111111' \
  -H 'x-user-id: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' \
  -H 'x-facility-id: 087e0bd6-8d65-5133-94bd-7b4cd6ff3665'

# Get name titles in Arabic
curl 'http://localhost:3011/api/v1/valuesets/name_titles/concepts?language=ar' \
  -H 'x-tenant-id: 11111111-1111-1111-1111-111111111111' \
  -H 'x-user-id: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' \
  -H 'x-facility-id: 087e0bd6-8d65-5133-94bd-7b4cd6ff3665'
```

## Expected Results

After seeding, you should have:
- **5 ValueSets** created
- **38 Concepts** total across all valuesets
- **21 Translations** (Arabic) for various concepts

| ValueSet Code | Concept Count | Translation Count |
|--------------|---------------|-------------------|
| name_titles | 8 | 8 |
| administrative_gender | 4 | 4 |
| blood_groups | 8 | 0 |
| marital_status | 6 | 6 |
| iso_3166_countries | 12 | 3 |

## Frontend Usage

The frontend automatically uses these valuesets in clinical workflows:

```typescript
// Import hooks from Clinical module
import { useNameTitles, useCountries, useGenders } from '@/modules/clinical/hooks/use-valuesets';

// Use in components
const { data: titles } = useNameTitles('en');
const { data: countries } = useCountries('ar');
```

## Adding More ValueSets

To add additional valuesets:

1. Follow the existing pattern in `seed-valuesets.sql`
2. Use UUIDs in the format `1XXXXXXX-0000-0000-0000-00000000XXXX` for value_sets
3. Use UUIDs in the format `11XXXXXX-0000-0000-0000-00000000XXXX` for concepts
4. Use UUIDs in the format `12XXXXXX-0000-0000-0000-00000000XXXX` for translations
5. Always include `created_at` and `updated_at` timestamps using `:ts` variable
6. Include Arabic translations where applicable

## Migration Notes

- **Migration Date**: December 2, 2025
- **Migrated From**: Foundation database (`zeal_foundation`)
- **Migrated To**: Clinical database (`zeal_clinical`)
- **Reason**: ValueSets are primarily used for clinical workflows and patient registration
- **API Endpoint Changed**: From `http://localhost:3010/api/v1/valuesets` (Foundation) to `http://localhost:3011/api/v1/valuesets` (Clinical)
