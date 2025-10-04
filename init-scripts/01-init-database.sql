-- Initialize Zeal PMS Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS audit;

-- Set search path
SET search_path TO public, audit;

-- Create audit schema for tracking changes
CREATE SCHEMA IF NOT EXISTS audit;

-- Create audit table function
CREATE OR REPLACE FUNCTION audit.audit_table()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit.audit_log (
            table_name,
            operation,
            old_data,
            new_data,
            changed_by,
            changed_at
        ) VALUES (
            TG_TABLE_NAME,
            'INSERT',
            NULL,
            row_to_json(NEW),
            current_setting('app.current_user_id', true),
            NOW()
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit.audit_log (
            table_name,
            operation,
            old_data,
            new_data,
            changed_by,
            changed_at
        ) VALUES (
            TG_TABLE_NAME,
            'UPDATE',
            row_to_json(OLD),
            row_to_json(NEW),
            current_setting('app.current_user_id', true),
            NOW()
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit.audit_log (
            table_name,
            operation,
            old_data,
            new_data,
            changed_by,
            changed_at
        ) VALUES (
            TG_TABLE_NAME,
            'DELETE',
            row_to_json(OLD),
            NULL,
            current_setting('app.current_user_id', true),
            NOW()
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(255) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(255),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at ON audit.audit_log(changed_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_by ON audit.audit_log(changed_by);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO zeal_user;
GRANT USAGE ON SCHEMA audit TO zeal_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO zeal_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO zeal_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA audit TO zeal_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA audit TO zeal_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO zeal_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO zeal_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit GRANT ALL ON TABLES TO zeal_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit GRANT ALL ON SEQUENCES TO zeal_user;

-- Create a function to set the current user for audit logging
CREATE OR REPLACE FUNCTION set_current_user(user_id VARCHAR(255))
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id, true);
END;
$$ LANGUAGE plpgsql;

-- Create a function to get database info
CREATE OR REPLACE FUNCTION get_database_info()
RETURNS TABLE (
    database_name TEXT,
    version TEXT,
    uptime INTERVAL,
    connections INTEGER,
    max_connections INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        current_database()::TEXT as database_name,
        version()::TEXT as version,
        NOW() - pg_postmaster_start_time() as uptime,
        (SELECT count(*) FROM pg_stat_activity WHERE state = 'active')::INTEGER as connections,
        (SELECT setting::INTEGER FROM pg_settings WHERE name = 'max_connections')::INTEGER as max_connections;
END;
$$ LANGUAGE plpgsql;

-- Log successful initialization
INSERT INTO audit.audit_log (table_name, operation, new_data, changed_by, changed_at)
VALUES ('database', 'INIT', '{"message": "Database initialized successfully"}', 'system', NOW());





