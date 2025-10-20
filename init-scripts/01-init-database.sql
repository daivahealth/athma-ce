-- Initialize Zeal platform domain databases
-- Executed automatically by the postgres container on first boot

\echo '>>> Creating domain databases (foundation, clinical, rcm, analytics)'
SELECT 'CREATE DATABASE zeal_foundation OWNER zeal_user ENCODING ''UTF8'' TEMPLATE template0'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'zeal_foundation');
\gexec

SELECT 'CREATE DATABASE zeal_clinical OWNER zeal_user ENCODING ''UTF8'' TEMPLATE template0'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'zeal_clinical');
\gexec

SELECT 'CREATE DATABASE zeal_rcm OWNER zeal_user ENCODING ''UTF8'' TEMPLATE template0'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'zeal_rcm');
\gexec

SELECT 'CREATE DATABASE zeal_analytics OWNER zeal_user ENCODING ''UTF8'' TEMPLATE template0'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'zeal_analytics');
\gexec

\echo '>>> Configuring zeal_foundation'
\connect zeal_foundation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS unaccent;
ALTER SCHEMA public OWNER TO zeal_user;
GRANT ALL PRIVILEGES ON DATABASE zeal_foundation TO zeal_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO zeal_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO zeal_user;
ALTER DEFAULT PRIVILEGES FOR USER zeal_user IN SCHEMA public GRANT ALL ON TABLES TO zeal_user;
ALTER DEFAULT PRIVILEGES FOR USER zeal_user IN SCHEMA public GRANT ALL ON SEQUENCES TO zeal_user;

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
        current_database()::TEXT,
        version()::TEXT,
        NOW() - pg_postmaster_start_time(),
        (SELECT count(*) FROM pg_stat_activity WHERE state = 'active')::INTEGER,
        (SELECT setting::INTEGER FROM pg_settings WHERE name = 'max_connections')::INTEGER;
END;
$$ LANGUAGE plpgsql;

\echo '>>> Configuring zeal_clinical'
\connect zeal_clinical
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS unaccent;
ALTER SCHEMA public OWNER TO zeal_user;
GRANT ALL PRIVILEGES ON DATABASE zeal_clinical TO zeal_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO zeal_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO zeal_user;
ALTER DEFAULT PRIVILEGES FOR USER zeal_user IN SCHEMA public GRANT ALL ON TABLES TO zeal_user;
ALTER DEFAULT PRIVILEGES FOR USER zeal_user IN SCHEMA public GRANT ALL ON SEQUENCES TO zeal_user;

\echo '>>> Configuring zeal_rcm'
\connect zeal_rcm
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS unaccent;
ALTER SCHEMA public OWNER TO zeal_user;
GRANT ALL PRIVILEGES ON DATABASE zeal_rcm TO zeal_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO zeal_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO zeal_user;
ALTER DEFAULT PRIVILEGES FOR USER zeal_user IN SCHEMA public GRANT ALL ON TABLES TO zeal_user;
ALTER DEFAULT PRIVILEGES FOR USER zeal_user IN SCHEMA public GRANT ALL ON SEQUENCES TO zeal_user;

\echo '>>> Configuring zeal_analytics'
\connect zeal_analytics
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS unaccent;
ALTER SCHEMA public OWNER TO zeal_user;
GRANT ALL PRIVILEGES ON DATABASE zeal_analytics TO zeal_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO zeal_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO zeal_user;
ALTER DEFAULT PRIVILEGES FOR USER zeal_user IN SCHEMA public GRANT ALL ON TABLES TO zeal_user;
ALTER DEFAULT PRIVILEGES FOR USER zeal_user IN SCHEMA public GRANT ALL ON SEQUENCES TO zeal_user;

CREATE SCHEMA IF NOT EXISTS audit AUTHORIZATION zeal_user;

CREATE TABLE IF NOT EXISTS audit.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(255) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(255),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION audit.log_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit.audit_log(table_name, operation, old_data, new_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, 'INSERT', NULL, row_to_json(NEW), current_setting('app.current_user_id', true), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit.audit_log(table_name, operation, old_data, new_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, 'UPDATE', row_to_json(OLD), row_to_json(NEW), current_setting('app.current_user_id', true), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit.audit_log(table_name, operation, old_data, new_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, 'DELETE', row_to_json(OLD), NULL, current_setting('app.current_user_id', true), NOW());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at ON audit.audit_log(changed_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_by ON audit.audit_log(changed_by);

INSERT INTO audit.audit_log (table_name, operation, new_data, changed_by, changed_at)
VALUES ('database', 'INIT', '{"message": "zeal domain databases provisioned"}', 'system', NOW());

\echo '>>> Domain databases ready.'
