-- ============================================================================
-- Clinical Observations Table Partitioning Setup
-- ============================================================================
-- This script converts the clinical_observations table to a partitioned table.
-- Run AFTER prisma db push has created the base table.
--
-- Partitioning strategy:
--   Level 1: LIST by tenant_id (one partition per tenant)
--   Level 2: RANGE by observed_at (monthly sub-partitions)
--
-- This dramatically improves query performance at crore-scale:
--   - Every query has tenant_id in WHERE → prunes to single tenant partition
--   - Analytics queries have time filters → further prunes to 1-3 monthly partitions
--   - Instead of scanning crores of rows, scans ~50K-200K rows per query
--
-- NOTE: This is a one-time setup script. Run manually after initial schema push.
-- The PartitionManagerService handles creating new partitions as tenants/months grow.
-- ============================================================================

-- Check if the table is already partitioned (idempotent)
DO $$
DECLARE
  is_partitioned BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_partitioned_table pt
    JOIN pg_catalog.pg_class c ON c.oid = pt.partrelid
    WHERE c.relname = 'clinical_observations'
  ) INTO is_partitioned;

  IF is_partitioned THEN
    RAISE NOTICE 'clinical_observations is already partitioned. Skipping.';
    RETURN;
  END IF;

  -- Step 1: Rename current table
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'clinical_observations') THEN
    ALTER TABLE clinical_observations RENAME TO clinical_observations_old;

    -- Step 2: Create partitioned table with same schema
    CREATE TABLE clinical_observations (
      id UUID NOT NULL DEFAULT uuid_generate_v4(),
      tenant_id UUID NOT NULL,
      patient_id UUID NOT NULL,
      encounter_id UUID,
      order_id UUID,
      code VARCHAR(20) NOT NULL,
      code_system VARCHAR(20) NOT NULL,
      display_name VARCHAR(255) NOT NULL,
      display_name_ar VARCHAR(255),
      category VARCHAR(50) NOT NULL,
      value_numeric DECIMAL(12,4),
      value_string TEXT,
      value_code VARCHAR(50),
      value_code_system VARCHAR(20),
      unit VARCHAR(50),
      ref_range_low DECIMAL(12,4),
      ref_range_high DECIMAL(12,4),
      interpretation VARCHAR(20),
      observed_at TIMESTAMPTZ NOT NULL,
      observed_by UUID,
      source_type VARCHAR(30) NOT NULL,
      source_id UUID,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (id, tenant_id, observed_at)
    ) PARTITION BY LIST (tenant_id);

    -- Step 3: Create indexes on the partitioned table
    CREATE INDEX idx_obs_tenant_patient_code ON clinical_observations (tenant_id, patient_id, code);
    CREATE INDEX idx_obs_tenant_code_time ON clinical_observations (tenant_id, code, observed_at);
    CREATE INDEX idx_obs_tenant_encounter ON clinical_observations (tenant_id, encounter_id);
    CREATE INDEX idx_obs_tenant_category_time ON clinical_observations (tenant_id, category, observed_at);
    CREATE INDEX idx_obs_tenant_order ON clinical_observations (tenant_id, order_id);
    CREATE INDEX idx_obs_tenant_patient_category_time ON clinical_observations (tenant_id, patient_id, category, observed_at);

    -- BRIN index for time-series queries (100x smaller than B-tree)
    CREATE INDEX idx_obs_observed_at_brin ON clinical_observations USING BRIN (observed_at);

    -- Partial indexes for common filtered queries
    CREATE INDEX idx_obs_vitals_only ON clinical_observations (tenant_id, patient_id, observed_at)
      WHERE category = 'vital-signs';
    CREATE INDEX idx_obs_lab_only ON clinical_observations (tenant_id, code, observed_at)
      WHERE category = 'laboratory';

    -- Step 4: Create a default partition for data that doesn't match any tenant
    CREATE TABLE clinical_observations_default PARTITION OF clinical_observations DEFAULT;

    -- Step 5: Copy existing data (if any) into the partitioned table
    -- This will go to the default partition; PartitionManagerService will
    -- create proper tenant partitions and the data can be migrated later.
    INSERT INTO clinical_observations SELECT * FROM clinical_observations_old;

    -- Step 6: Drop the old table
    DROP TABLE clinical_observations_old;

    RAISE NOTICE 'Successfully converted clinical_observations to partitioned table.';
  ELSE
    RAISE NOTICE 'clinical_observations table does not exist yet. Run prisma db push first.';
  END IF;
END $$;
