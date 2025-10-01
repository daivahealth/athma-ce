# ADR-0004: Multi-Language Support — Centralized Translations Table

- **Status**: Accepted
- **Date**: 2025-10-01
- **Owners**: Architecture Team, UAE Compliance Team
- **Related**: ADR-0001 (Language Split), ADR-0003 (Multi-Tenancy)
- **Context**: UAE healthcare regulations require Arabic language support for all patient-facing content

## 1) Decision

Adopt a **centralized translations table** approach for multi-language support:

- **Single translations table** with flexible entity-type mapping
- **Entity-agnostic design** supporting any table/field combination
- **Language codes** following ISO 639-1 standard (`en`, `ar`, `fr`, etc.)
- **Fallback mechanism** to English when translations are missing
- **Arabic text search** with PostgreSQL stemming and normalization
- **RLS integration** with existing tenant isolation

## 2) Drivers

- **UAE Healthcare Compliance**: DHA/DOH/MOHAP regulations mandate Arabic support
- **Future-proofing**: Support additional languages (French, German, Hindi) without schema changes
- **Operational efficiency**: Single table vs. adding `_ar` columns to every table
- **Maintainability**: Centralized translation management
- **Performance**: Optimized indexes and search capabilities

## 3) Scope

Applies to all user-facing content including:
- **Patient demographics** (names, addresses, emergency contacts)
- **Staff information** (names, titles, specialties)
- **Facility details** (names, addresses, specialties)
- **Clinical content** (SOAP notes, prescriptions, instructions)
- **Master reference data** (medications, lab tests, procedures)
- **Legal documents** (consents, certificates, disclaimers)
- **Billing content** (service descriptions, patient statements)

## 4) Non-Goals

- Not implementing real-time translation services (human translation required)
- Not supporting automatic language detection
- Not covering right-to-left (RTL) UI layout (handled in frontend ADR)

## 5) Database Schema

```sql
CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL,     -- 'patient', 'medication', 'facility'
    entity_id UUID NOT NULL,
    field_name VARCHAR(100) NOT NULL,     -- 'first_name', 'description', 'name'
    language_code VARCHAR(10) NOT NULL,   -- 'en', 'ar', 'fr'
    translated_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, entity_id, field_name, language_code)
);
```

## 6) Supported Entity Types

| Entity Type | Fields | Usage |
|-------------|--------|-------|
| **patient** | first_name, last_name, address, city, emirate | Demographics |
| **staff** | first_name, last_name, title, specialty | Provider info |
| **facility** | name, address, city, specialty | Facility details |
| **specialty** | name, description | Medical specialties |
| **medication** | medication_name, generic_name, dosage_form, strength | Drug dictionary |
| **lab_test** | test_name, description, instructions | Lab catalog |
| **imaging_study** | study_name, description, instructions | Imaging catalog |
| **procedure** | procedure_name, description, instructions | Procedure catalog |
| **clinical_note** | content, subjective, objective, assessment, plan | SOAP notes |
| **prescription** | sig, instructions, dosage, frequency, duration | Prescription details |

## 7) Helper Functions

### Get Translation with Fallback
```sql
CREATE OR REPLACE FUNCTION get_translation(
    p_entity_type VARCHAR(100),
    p_entity_id UUID,
    p_field_name VARCHAR(100),
    p_language_code VARCHAR(10) DEFAULT 'en'
) RETURNS TEXT AS $$
-- Returns translated text or falls back to English
$$ LANGUAGE plpgsql;
```

### Set Translation
```sql
CREATE OR REPLACE FUNCTION set_translation(
    p_entity_type VARCHAR(100),
    p_entity_id UUID,
    p_field_name VARCHAR(100),
    p_language_code VARCHAR(10),
    p_translated_text TEXT
) RETURNS UUID AS $$
-- Upserts translation with conflict handling
$$ LANGUAGE plpgsql;
```

### Arabic Text Search
```sql
CREATE OR REPLACE FUNCTION search_entities_by_translation(
    p_entity_type VARCHAR(100),
    p_field_name VARCHAR(100),
    p_search_text TEXT,
    p_language_code VARCHAR(10) DEFAULT 'ar'
) RETURNS TABLE(entity_id UUID, translated_text TEXT, rank REAL) AS $$
-- Full-text search with Arabic stemming
$$ LANGUAGE plpgsql;
```

## 8) Performance Optimizations

### Indexes
```sql
-- Entity lookup
CREATE INDEX idx_translations_entity ON translations(entity_type, entity_id);

-- Language filtering
CREATE INDEX idx_translations_language ON translations(language_code);

-- Field filtering
CREATE INDEX idx_translations_field ON translations(field_name);

-- Arabic text search
CREATE INDEX idx_translations_arabic_fts ON translations 
USING gin(to_tsvector('arabic_config', translated_text))
WHERE language_code = 'ar';

-- Composite query optimization
CREATE INDEX idx_translations_entity_lang_field ON translations(entity_type, entity_id, language_code, field_name);
```

### Arabic Text Search Configuration
```sql
CREATE TEXT SEARCH CONFIGURATION arabic_config (COPY = simple);
CREATE TEXT SEARCH DICTIONARY arabic_stem (
    TEMPLATE = snowball,
    Language = arabic
);
```

## 9) Security & Compliance

### RLS Integration
```sql
CREATE POLICY tenant_isolation_translations ON translations
  FOR ALL TO application_role
  USING (
    EXISTS (
      SELECT 1 FROM (
        SELECT 'patient' as entity_type, id as entity_id, tenant_id FROM patients
        UNION ALL
        SELECT 'staff' as entity_type, id as entity_id, tenant_id FROM staff
        -- ... other entity types
      ) entities
      WHERE entities.entity_type = translations.entity_type 
        AND entities.entity_id = translations.entity_id
        AND (entities.tenant_id IS NULL OR entities.tenant_id = current_setting('app.current_tenant_id')::uuid)
    )
  );
```

### UAE Compliance Features
- **Arabic prescription labels** (mandatory for patients)
- **Arabic consent forms** with digital signatures
- **Arabic medical certificates** (sick leave, fitness)
- **Arabic billing statements** and service descriptions
- **Arabic discharge summaries** and care plans
- **DHA/DOH/MOHAP integration** with Arabic data fields

## 10) API Integration

### Response Format
```typescript
interface PatientResponse {
  id: string;
  first_name: string;
  last_name: string;
  translations: {
    ar: {
      first_name: string;
      last_name: string;
    };
    en: {
      first_name: string;
      last_name: string;
    };
  };
}
```

### Language Detection
- **User preference** stored in `users.preferred_language`
- **Tenant default** in `tenants.default_language`
- **Session-based** language switching
- **Fallback chain**: User → Tenant → System default (English)

## 11) Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **`_ar` columns** | Simple queries, type safety | Schema changes for new languages, maintenance overhead | ❌ |
| **JSONB fields** | Flexible, single column | Poor indexing, complex queries, no text search | ❌ |
| **Separate translation tables** | Type safety, clear structure | Multiple tables, complex joins, maintenance overhead | ❌ |
| **Centralized translations table** | Flexible, scalable, maintainable | Slightly complex queries, requires helper functions | ✅ **Chosen** |

## 12) Implementation Phases

### Phase 1: Database Schema (Week 1-2)
- [x] Create translations table
- [x] Add RLS policies
- [x] Create Arabic text search indexes
- [x] Implement helper functions

### Phase 2: API Layer (Week 3-4)
- [ ] Add translation fields to API responses
- [ ] Implement bilingual field mapping
- [ ] Add Arabic validation rules
- [ ] Create Arabic error messages

### Phase 3: UI Components (Week 5-6)
- [ ] Implement RTL layout support
- [ ] Add Arabic font loading
- [ ] Create bilingual form components
- [ ] Implement Arabic date/number formatting

### Phase 4: Document Generation (Week 7-8)
- [ ] Create Arabic PDF templates
- [ ] Implement Arabic font embedding
- [ ] Add bilingual content generation
- [ ] Test PDF rendering

### Phase 5: Integration Testing (Week 9-10)
- [ ] Test DHA/DOH/MOHAP integration
- [ ] Validate FHIR/HL7 Arabic fields
- [ ] Test Arabic search functionality
- [ ] Validate Arabic audit logging

### Phase 6: QA & Validation (Week 11-12)
- [ ] Arabic medical terminology review
- [ ] Linguistic accuracy validation
- [ ] Cultural appropriateness review
- [ ] Legal compliance verification

## 13) Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Translation quality** | High | Native Arabic speaker review, medical terminology validation |
| **Performance impact** | Medium | Optimized indexes, caching, query optimization |
| **Data consistency** | Medium | Helper functions, validation rules, audit logging |
| **Maintenance overhead** | Low | Centralized management, automated testing |

## 14) Monitoring & Observability

### Metrics
- **Translation coverage** by entity type and language
- **Search performance** for Arabic text queries
- **API response times** with translation loading
- **Translation update frequency** and patterns

### Alerts
- **Missing translations** for critical patient-facing content
- **Search performance degradation** for Arabic queries
- **Translation data quality** issues

## 15) Cost Considerations

- **Storage**: Minimal overhead (~10-20% increase for Arabic content)
- **Performance**: Optimized indexes minimize query impact
- **Maintenance**: Centralized approach reduces operational complexity
- **Compliance**: Avoids regulatory penalties and enables UAE market access

## 16) Triggers to Revisit

- **New language requirements** (French, German, Hindi)
- **Performance issues** with translation queries
- **Regulatory changes** in UAE healthcare requirements
- **Team composition changes** affecting Arabic language expertise

## 17) Acceptance Criteria

- [x] Translations table created with proper RLS policies
- [x] Helper functions implemented and tested
- [x] Arabic text search configured with stemming
- [x] Performance indexes created and validated
- [ ] API responses include translation fields
- [ ] Arabic PDF generation working
- [ ] DHA/DOH/MOHAP integration tested with Arabic data
- [ ] Native Arabic speaker validation completed
- [ ] UAE compliance verification passed

## 18) Related Documentation

- [Arabic Compliance Checklist](../23-Arabic-Compliance-Checklist.md)
- [Data Model](../05-Data-Model.md) - Translations table schema
- [RBAC Access Control](../20-RBAC-Access-Control.md) - Translation permissions
- [UAE Integrations](../07-Integrations-UAE.md) - Arabic data requirements
