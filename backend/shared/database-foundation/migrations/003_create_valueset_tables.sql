-- Migration: Create ValueSet Tables
-- Description: Reference data management system for standardized values
-- Author: System
-- Date: 2025-10-28

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. VALUE_SETS TABLE
-- ============================================================================
-- Defines categories of values (e.g., "countries", "genders", "blood_groups")
CREATE TABLE IF NOT EXISTS value_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  version VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  is_system BOOLEAN DEFAULT false,
  is_extensible BOOLEAN DEFAULT true,
  source VARCHAR(255),
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

-- Indexes for value_sets
CREATE INDEX idx_value_sets_code ON value_sets(code);
CREATE INDEX idx_value_sets_category ON value_sets(category);
CREATE INDEX idx_value_sets_status ON value_sets(status);

-- Comments
COMMENT ON TABLE value_sets IS 'Catalog of reference data categories (valuesets)';
COMMENT ON COLUMN value_sets.code IS 'Unique code identifier (e.g., iso_3166_countries)';
COMMENT ON COLUMN value_sets.is_system IS 'System-defined vs custom valuesets';
COMMENT ON COLUMN value_sets.is_extensible IS 'Whether tenants can add values';

-- ============================================================================
-- 2. VALUE_SET_CONCEPTS TABLE
-- ============================================================================
-- Individual values within a valueset
CREATE TABLE IF NOT EXISTS value_set_concepts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  value_set_id UUID NOT NULL REFERENCES value_sets(id) ON DELETE CASCADE,
  code VARCHAR(100) NOT NULL,
  display VARCHAR(500) NOT NULL,
  definition TEXT,
  system_code VARCHAR(100),
  parent_id UUID REFERENCES value_set_concepts(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active',
  effective_from DATE,
  effective_to DATE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,

  CONSTRAINT unique_valueset_code UNIQUE(value_set_id, code)
);

-- Indexes for value_set_concepts
CREATE INDEX idx_vsc_value_set ON value_set_concepts(value_set_id);
CREATE INDEX idx_vsc_code ON value_set_concepts(code);
CREATE INDEX idx_vsc_parent ON value_set_concepts(parent_id);
CREATE INDEX idx_vsc_status ON value_set_concepts(status);
CREATE INDEX idx_vsc_metadata ON value_set_concepts USING gin(metadata);
CREATE INDEX idx_vsc_sort_order ON value_set_concepts(value_set_id, sort_order);

-- Comments
COMMENT ON TABLE value_set_concepts IS 'Individual values/concepts within valuesets';
COMMENT ON COLUMN value_set_concepts.code IS 'Code value (e.g., AE, US, male)';
COMMENT ON COLUMN value_set_concepts.display IS 'Human-readable display name';
COMMENT ON COLUMN value_set_concepts.parent_id IS 'For hierarchical values';
COMMENT ON COLUMN value_set_concepts.metadata IS 'Additional attributes as JSON';

-- ============================================================================
-- 3. VALUE_SET_CONCEPT_TRANSLATIONS TABLE
-- ============================================================================
-- Localized translations for concept displays
CREATE TABLE IF NOT EXISTS value_set_concept_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concept_id UUID NOT NULL REFERENCES value_set_concepts(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL,
  display VARCHAR(500) NOT NULL,
  definition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_concept_language UNIQUE(concept_id, language_code)
);

-- Indexes for translations
CREATE INDEX idx_vsct_concept ON value_set_concept_translations(concept_id);
CREATE INDEX idx_vsct_language ON value_set_concept_translations(language_code);

-- Comments
COMMENT ON TABLE value_set_concept_translations IS 'Multi-language translations for concepts';
COMMENT ON COLUMN value_set_concept_translations.language_code IS 'ISO 639-1 language code (en, ar, fr)';

-- ============================================================================
-- 4. TENANT_VALUE_SET_OVERRIDES TABLE
-- ============================================================================
-- Tenant-specific overrides or additions to global valuesets
CREATE TABLE IF NOT EXISTS tenant_value_set_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  value_set_id UUID NOT NULL REFERENCES value_sets(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES value_set_concepts(id) ON DELETE CASCADE,
  override_type VARCHAR(20) NOT NULL,
  custom_display VARCHAR(500),
  custom_metadata JSONB,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,

  CONSTRAINT unique_tenant_valueset_concept UNIQUE(tenant_id, value_set_id, concept_id)
);

-- Indexes for overrides
CREATE INDEX idx_tvso_tenant ON tenant_value_set_overrides(tenant_id);
CREATE INDEX idx_tvso_value_set ON tenant_value_set_overrides(value_set_id);
CREATE INDEX idx_tvso_type ON tenant_value_set_overrides(override_type);

-- Comments
COMMENT ON TABLE tenant_value_set_overrides IS 'Tenant-specific customizations to valuesets';
COMMENT ON COLUMN tenant_value_set_overrides.override_type IS 'Type: disable, enable, customize, add';
COMMENT ON COLUMN tenant_value_set_overrides.concept_id IS 'NULL for valueset-level overrides';

-- ============================================================================
-- 5. VALUE_SET_HISTORY TABLE
-- ============================================================================
-- Audit trail for all changes to valuesets and concepts
CREATE TABLE IF NOT EXISTS value_set_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by UUID,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_reason TEXT
);

-- Indexes for history
CREATE INDEX idx_vsh_entity ON value_set_history(entity_type, entity_id);
CREATE INDEX idx_vsh_changed_by ON value_set_history(changed_by);
CREATE INDEX idx_vsh_changed_at ON value_set_history(changed_at);

-- Comments
COMMENT ON TABLE value_set_history IS 'Audit trail for valueset changes';
COMMENT ON COLUMN value_set_history.entity_type IS 'valueset, concept, translation, override';
COMMENT ON COLUMN value_set_history.action IS 'create, update, delete, activate, deprecate';

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_value_sets_updated_at
  BEFORE UPDATE ON value_sets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_value_set_concepts_updated_at
  BEFORE UPDATE ON value_set_concepts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_value_set_concept_translations_updated_at
  BEFORE UPDATE ON value_set_concept_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_value_set_overrides_updated_at
  BEFORE UPDATE ON tenant_value_set_overrides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- GRANT PERMISSIONS (adjust as needed for your setup)
-- ============================================================================

-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO foundation_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO foundation_app;
