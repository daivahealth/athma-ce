-- Migration: Add User-Facility Mapping
-- Date: 2025-10-06
-- Description: Implements user-facility relationships with default facility support

-- Step 1: Add default_facility_id column to users table
ALTER TABLE users 
ADD COLUMN default_facility_id UUID;

-- Step 2: Add foreign key constraint for default_facility_id
ALTER TABLE users 
ADD CONSTRAINT users_default_facility_id_fkey 
FOREIGN KEY (default_facility_id) REFERENCES facilities(id) ON DELETE SET NULL;

-- Step 3: Create index on users for tenant and default facility
CREATE INDEX users_tenant_id_default_facility_id_idx 
ON users(tenant_id, default_facility_id);

-- Step 4: Create user_facilities table
CREATE TABLE user_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    facility_id UUID NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    access_level VARCHAR(50) NOT NULL DEFAULT 'standard',
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    granted_by UUID,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Foreign keys
    CONSTRAINT user_facilities_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT user_facilities_facility_id_fkey 
        FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    CONSTRAINT user_facilities_granted_by_fkey 
        FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Unique constraint: one user-facility pair
    CONSTRAINT user_facilities_user_id_facility_id_key 
        UNIQUE (user_id, facility_id)
);

-- Step 5: Create indexes on user_facilities
CREATE INDEX user_facilities_user_id_is_default_idx 
ON user_facilities(user_id, is_default);

CREATE INDEX user_facilities_facility_id_revoked_at_idx 
ON user_facilities(facility_id, revoked_at);

-- Step 6: Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_facilities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_facilities_updated_at
    BEFORE UPDATE ON user_facilities
    FOR EACH ROW
    EXECUTE FUNCTION update_user_facilities_updated_at();

-- Step 7: Migrate existing data - assign all users to their tenant's first facility
INSERT INTO user_facilities (id, user_id, facility_id, is_default, access_level, granted_at)
SELECT 
    gen_random_uuid(),
    u.id,
    f.id,
    true,
    'standard',
    NOW()
FROM users u
INNER JOIN LATERAL (
    SELECT id FROM facilities 
    WHERE tenant_id = u.tenant_id 
    ORDER BY created_at ASC 
    LIMIT 1
) f ON true
WHERE NOT EXISTS (
    SELECT 1 FROM user_facilities WHERE user_id = u.id AND is_default = true
);

-- Step 8: Update users.default_facility_id from user_facilities
UPDATE users u
SET default_facility_id = uf.facility_id
FROM user_facilities uf
WHERE uf.user_id = u.id AND uf.is_default = true;

-- Step 9: Add comment to document the schema changes
COMMENT ON TABLE user_facilities IS 'Maps users to facilities with access levels and default facility designation';
COMMENT ON COLUMN user_facilities.is_default IS 'Indicates if this is the users primary/default facility';
COMMENT ON COLUMN user_facilities.access_level IS 'Access level: standard, admin, or read_only';
COMMENT ON COLUMN user_facilities.granted_by IS 'User ID who granted this facility access';
COMMENT ON COLUMN user_facilities.revoked_at IS 'Timestamp when access was revoked (soft delete)';

COMMENT ON COLUMN users.default_facility_id IS 'Users default/primary facility where they are physically located';

-- Validation queries (optional - run to verify)
-- SELECT COUNT(*) FROM users WHERE default_facility_id IS NULL; -- Should be 0 after migration
-- SELECT user_id, COUNT(*) FROM user_facilities WHERE is_default = true GROUP BY user_id HAVING COUNT(*) > 1; -- Should return no rows

