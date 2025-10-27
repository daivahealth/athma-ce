# ValueSet / Reference Data Architecture

## Overview
A centralized reference data management system for standardized values used across the Zeal platform. This includes countries, nationalities, languages, currencies, medical codes, and other enumerated values.

## Why We Need This

### Current Issues
1. **Hardcoded values** in frontend (like countries.ts)
2. **No single source of truth** for reference data
3. **Difficult updates** - requires code deployment to change values
4. **No multi-language support** for reference data
5. **No audit trail** for reference data changes
6. **Cannot customize** reference data per tenant/facility

### Benefits
1. **Centralized management** - all reference data in one place
2. **Runtime updates** - change values without deploying code
3. **Multi-language support** - localized display names
4. **Tenant customization** - override global values per tenant
5. **Audit trail** - track who changed what and when
6. **API-driven** - fetch reference data dynamically
7. **Versioning** - maintain history of value changes

## Data Model

### 1. ValueSet (Main Table)
Defines a category of values (e.g., "countries", "genders", "blood_groups")

```sql
CREATE TABLE value_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) UNIQUE NOT NULL,  -- e.g., 'iso_3166_countries'
  name VARCHAR(255) NOT NULL,         -- e.g., 'ISO 3166 Countries'
  description TEXT,
  category VARCHAR(50),                -- e.g., 'geography', 'medical', 'demographics'
  version VARCHAR(20),                 -- e.g., '1.0', '2024.1'
  status VARCHAR(20) DEFAULT 'active', -- active, deprecated, draft
  is_system BOOLEAN DEFAULT false,     -- system vs custom valuesets
  is_extensible BOOLEAN DEFAULT true,  -- can tenants add values?
  source VARCHAR(255),                 -- e.g., 'ISO', 'FHIR', 'HL7'
  source_url TEXT,                     -- reference URL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_value_sets_code ON value_sets(code);
CREATE INDEX idx_value_sets_category ON value_sets(category);
CREATE INDEX idx_value_sets_status ON value_sets(status);
```

### 2. ValueSetConcept (Values Table)
Individual values within a valueset

```sql
CREATE TABLE value_set_concepts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  value_set_id UUID NOT NULL REFERENCES value_sets(id) ON DELETE CASCADE,
  code VARCHAR(100) NOT NULL,          -- e.g., 'AE', 'US', 'male'
  display VARCHAR(500) NOT NULL,       -- e.g., 'United Arab Emirates'
  definition TEXT,                     -- detailed description
  system_code VARCHAR(100),            -- original code from source system
  parent_id UUID REFERENCES value_set_concepts(id), -- for hierarchical values
  sort_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active', -- active, deprecated
  effective_from DATE,
  effective_to DATE,
  metadata JSONB,                      -- additional attributes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,

  UNIQUE(value_set_id, code)
);

CREATE INDEX idx_vsc_value_set ON value_set_concepts(value_set_id);
CREATE INDEX idx_vsc_code ON value_set_concepts(code);
CREATE INDEX idx_vsc_parent ON value_set_concepts(parent_id);
CREATE INDEX idx_vsc_status ON value_set_concepts(status);
CREATE INDEX idx_vsc_metadata ON value_set_concepts USING gin(metadata);
```

### 3. ValueSetConceptTranslation (Multi-language Support)
Localized translations for concept displays

```sql
CREATE TABLE value_set_concept_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concept_id UUID NOT NULL REFERENCES value_set_concepts(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL,  -- e.g., 'en', 'ar', 'fr'
  display VARCHAR(500) NOT NULL,
  definition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(concept_id, language_code)
);

CREATE INDEX idx_vsct_concept ON value_set_concept_translations(concept_id);
CREATE INDEX idx_vsct_language ON value_set_concept_translations(language_code);
```

### 4. TenantValueSetOverride (Tenant Customization)
Tenant-specific overrides or additions to global valuesets

```sql
CREATE TABLE tenant_value_set_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  value_set_id UUID NOT NULL REFERENCES value_sets(id),
  concept_id UUID REFERENCES value_set_concepts(id), -- NULL = valueset level
  override_type VARCHAR(20) NOT NULL,  -- 'disable', 'enable', 'customize', 'add'
  custom_display VARCHAR(500),
  custom_metadata JSONB,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,

  UNIQUE(tenant_id, value_set_id, concept_id)
);

CREATE INDEX idx_tvso_tenant ON tenant_value_set_overrides(tenant_id);
CREATE INDEX idx_tvso_value_set ON tenant_value_set_overrides(value_set_id);
```

### 5. ValueSetHistory (Audit Trail)
Track all changes to valuesets and concepts

```sql
CREATE TABLE value_set_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL,    -- 'valueset', 'concept', 'translation'
  entity_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL,          -- 'create', 'update', 'delete', 'activate', 'deprecate'
  old_values JSONB,
  new_values JSONB,
  changed_by UUID,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_reason TEXT
);

CREATE INDEX idx_vsh_entity ON value_set_history(entity_type, entity_id);
CREATE INDEX idx_vsh_changed_by ON value_set_history(changed_by);
CREATE INDEX idx_vsh_changed_at ON value_set_history(changed_at);
```

## Example ValueSets to Implement

### 1. ISO 3166 Countries
```sql
INSERT INTO value_sets (code, name, description, category, source, is_system)
VALUES (
  'iso_3166_countries',
  'ISO 3166 Countries',
  'Country codes as per ISO 3166-1 alpha-2',
  'geography',
  'ISO 3166-1',
  true
);

-- Concepts
INSERT INTO value_set_concepts (value_set_id, code, display, sort_order)
SELECT vs.id, 'AE', 'United Arab Emirates', 1
FROM value_sets vs WHERE vs.code = 'iso_3166_countries';

-- Arabic translation
INSERT INTO value_set_concept_translations (concept_id, language_code, display)
SELECT vsc.id, 'ar', 'الإمارات العربية المتحدة'
FROM value_set_concepts vsc
JOIN value_sets vs ON vsc.value_set_id = vs.id
WHERE vs.code = 'iso_3166_countries' AND vsc.code = 'AE';
```

### 2. Nationalities
```sql
INSERT INTO value_sets (code, name, category, is_system)
VALUES (
  'nationalities',
  'Nationalities',
  'demographics',
  true
);
```

### 3. Gender
```sql
INSERT INTO value_sets (code, name, category, source, is_system)
VALUES (
  'administrative_gender',
  'Administrative Gender',
  'demographics',
  'FHIR',
  true
);

-- male, female, other, unknown
```

### 4. Blood Groups
```sql
INSERT INTO value_sets (code, name, category, is_system)
VALUES (
  'blood_groups',
  'Blood Groups',
  'medical',
  true
);

-- A+, A-, B+, B-, O+, O-, AB+, AB-
```

### 5. Marital Status
```sql
INSERT INTO value_sets (code, name, category, source, is_system)
VALUES (
  'marital_status',
  'Marital Status',
  'demographics',
  'FHIR',
  true
);

-- single, married, divorced, widowed
```

### 6. Languages
```sql
INSERT INTO value_sets (code, name, category, source, is_system)
VALUES (
  'iso_639_languages',
  'ISO 639 Languages',
  'localization',
  'ISO 639-1',
  true
);
```

### 7. Currencies
```sql
INSERT INTO value_sets (code, name, category, source, is_system)
VALUES (
  'iso_4217_currencies',
  'ISO 4217 Currencies',
  'financial',
  'ISO 4217',
  true
);
```

## API Endpoints

### Foundation Service (Port 3010)

```typescript
// Get all valuesets
GET /api/v1/valuesets
Query: category, status, search

// Get specific valueset
GET /api/v1/valuesets/:code

// Get valueset concepts (with tenant overrides)
GET /api/v1/valuesets/:code/concepts
Query: tenantId, language, includeInactive
Response: {
  valueSet: { code, name, ... },
  concepts: [
    { code: 'AE', display: 'United Arab Emirates', ... }
  ]
}

// Search concepts across valuesets
GET /api/v1/valuesets/search
Query: q, valueSetCode, language

// Admin: Create/Update valueset
POST /api/v1/valuesets
PUT /api/v1/valuesets/:code

// Admin: Manage concepts
POST /api/v1/valuesets/:code/concepts
PUT /api/v1/valuesets/:code/concepts/:conceptId
DELETE /api/v1/valuesets/:code/concepts/:conceptId

// Tenant overrides
POST /api/v1/valuesets/:code/tenant-overrides
GET /api/v1/valuesets/:code/tenant-overrides/:tenantId
```

## Frontend Integration

### 1. Create ValueSet Hook
```typescript
// frontend/src/hooks/use-valueset.ts
export function useValueSet(code: string, options?: {
  language?: string;
  includeInactive?: boolean;
}) {
  return useQuery({
    queryKey: ['valueset', code, options],
    queryFn: () => valueSetService.getConcepts(code, options),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

### 2. Country Selector Component
```typescript
export function CountrySelector({ value, onChange }: Props) {
  const { data: countries, isLoading } = useValueSet('iso_3166_countries');

  return (
    <Select value={value} onChange={onChange}>
      {countries?.concepts.map(c => (
        <option key={c.code} value={c.code}>{c.display}</option>
      ))}
    </Select>
  );
}
```

## Migration Strategy

### Phase 1: Setup Infrastructure
1. Create tables in foundation database
2. Implement foundation service API endpoints
3. Create admin UI for managing valuesets

### Phase 2: Seed Initial Data
1. Import ISO 3166 countries
2. Import common demographics valuesets
3. Add Arabic translations

### Phase 3: Frontend Migration
1. Create useValueSet hook
2. Update components to use dynamic valuesets
3. Remove hardcoded constants

### Phase 4: Tenant Customization
1. Implement override functionality
2. Create tenant admin UI
3. Migrate existing customizations

## Configuration Integration

The valueset system complements the existing config system:

- **Config System**: Runtime behavior settings (e.g., "default_country_iso": "AE")
- **ValueSet System**: Reference data options (e.g., list of all countries)

They work together:
```typescript
// Get default country from config
const defaultCountry = await configClient.get('clinical.default_country_iso');

// Get all countries from valueset
const countries = await valueSetClient.getConcepts('iso_3166_countries');
```

## Performance Considerations

1. **Caching**: Cache valuesets at application level (10-30 minutes)
2. **CDN**: Serve common valuesets via CDN
3. **Bundling**: Bundle frequently used valuesets with app
4. **Lazy Loading**: Load valuesets on-demand
5. **Indexing**: Proper database indexes for fast lookups

## Security

1. **Read Access**: All authenticated users can read valuesets
2. **Write Access**: Only system admins can modify system valuesets
3. **Tenant Overrides**: Tenant admins can manage their overrides
4. **Audit Trail**: All changes logged in history table

## Future Enhancements

1. **FHIR Compliance**: Full FHIR ValueSet resource support
2. **Import/Export**: Bulk import from standard sources
3. **Versioning**: Support multiple versions of same valueset
4. **Dependencies**: Track valueset dependencies
5. **Validation**: Validate concept codes against external systems
6. **Smart Caching**: Intelligent cache invalidation
7. **GraphQL**: GraphQL API for complex queries
