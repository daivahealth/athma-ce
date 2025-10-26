-- Migration: Add configuration management tables
-- Created: 2025-10-25

-- Create instance_configs table (global defaults)
CREATE TABLE IF NOT EXISTS instance_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    value_type VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    is_overridable BOOLEAN DEFAULT true,
    is_sensitive BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_instance_configs_category ON instance_configs(category);

-- Create tenant_configs table (tenant-level overrides)
CREATE TABLE IF NOT EXISTS tenant_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    config_key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT unique_tenant_config UNIQUE(tenant_id, config_key)
);

CREATE INDEX IF NOT EXISTS idx_tenant_configs_tenant ON tenant_configs(tenant_id);

-- Create facility_configs table (facility-level overrides)
CREATE TABLE IF NOT EXISTS facility_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    config_key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT unique_facility_config UNIQUE(facility_id, config_key)
);

CREATE INDEX IF NOT EXISTS idx_facility_configs_facility ON facility_configs(facility_id);

-- Create config_audit_log table (audit trail)
CREATE TABLE IF NOT EXISTS config_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_level VARCHAR(50) NOT NULL,
    config_key VARCHAR(255) NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB NOT NULL,
    changed_by UUID NOT NULL,
    changed_at TIMESTAMPTZ(6) DEFAULT NOW(),
    change_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_config_audit_level_entity ON config_audit_log(config_level, entity_id);
CREATE INDEX IF NOT EXISTS idx_config_audit_key ON config_audit_log(config_key);
CREATE INDEX IF NOT EXISTS idx_config_audit_changed_by ON config_audit_log(changed_by);

-- Add comments for documentation
COMMENT ON TABLE instance_configs IS 'Global configuration defaults applicable to all tenants';
COMMENT ON TABLE tenant_configs IS 'Tenant-specific configuration overrides';
COMMENT ON TABLE facility_configs IS 'Facility-specific configuration overrides';
COMMENT ON TABLE config_audit_log IS 'Audit trail for configuration changes';
