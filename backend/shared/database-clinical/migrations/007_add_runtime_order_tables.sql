-- Migration: Add runtime package orders and lab order test detail tables
-- Purpose:
--   1. Add package_order_id to clinical_orders
--   2. Create package_orders as runtime package assignment records
--   3. Create lab_order_tests as per-test execution detail rows for lab orders
-- Date: 2026-05-18

BEGIN;

ALTER TABLE clinical_orders
ADD COLUMN IF NOT EXISTS package_order_id UUID;

CREATE TABLE IF NOT EXISTS package_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  package_id UUID NOT NULL,
  encounter_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ordered',
  notes TEXT,
  ordered_by UUID NOT NULL,
  ordered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_package_orders_package
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE RESTRICT,
  CONSTRAINT fk_package_orders_encounter
    FOREIGN KEY (encounter_id) REFERENCES encounters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lab_order_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  order_id UUID NOT NULL,
  lab_test_master_id UUID,
  test_code VARCHAR(100) NOT NULL,
  code_system VARCHAR(20) NOT NULL DEFAULT 'LOINC',
  test_name VARCHAR(255) NOT NULL,
  loinc_code VARCHAR(20),
  cpt_code VARCHAR(10),
  specimen_type VARCHAR(100),
  collection_method VARCHAR(100),
  fasting_required BOOLEAN NOT NULL DEFAULT FALSE,
  fasting_duration_hours INTEGER,
  quantity DECIMAL(10, 3) NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'ordered',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_lab_order_tests_order
    FOREIGN KEY (order_id) REFERENCES clinical_orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS imaging_order_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  order_id UUID NOT NULL,
  imaging_study_master_id UUID,
  study_code VARCHAR(100) NOT NULL,
  code_system VARCHAR(20) NOT NULL DEFAULT 'CPT',
  study_name VARCHAR(255) NOT NULL,
  cpt_code VARCHAR(10),
  modality VARCHAR(50),
  body_part VARCHAR(100),
  contrast_required BOOLEAN NOT NULL DEFAULT FALSE,
  contrast_type VARCHAR(100),
  preparation_instructions TEXT,
  quantity DECIMAL(10, 3) NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'ordered',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_imaging_order_details_order
    FOREIGN KEY (order_id) REFERENCES clinical_orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS procedure_order_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  order_id UUID NOT NULL,
  procedure_master_id UUID,
  procedure_code VARCHAR(100) NOT NULL,
  code_system VARCHAR(20) NOT NULL DEFAULT 'CPT',
  procedure_name VARCHAR(255) NOT NULL,
  cpt_code VARCHAR(10),
  icd10_pcs_code VARCHAR(10),
  procedure_category VARCHAR(100),
  body_system VARCHAR(100),
  anesthesia_type VARCHAR(50),
  facility_required VARCHAR(50),
  estimated_duration_minutes INTEGER,
  preparation_instructions TEXT,
  consent_required BOOLEAN NOT NULL DEFAULT FALSE,
  quantity DECIMAL(10, 3) NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'ordered',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_procedure_order_details_order
    FOREIGN KEY (order_id) REFERENCES clinical_orders(id) ON DELETE CASCADE
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_clinical_orders_package_order'
      AND table_name = 'clinical_orders'
  ) THEN
    ALTER TABLE clinical_orders
    ADD CONSTRAINT fk_clinical_orders_package_order
      FOREIGN KEY (package_order_id) REFERENCES package_orders(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_orders_package_order
  ON clinical_orders(tenant_id, package_order_id);

CREATE INDEX IF NOT EXISTS idx_package_orders_encounter
  ON package_orders(tenant_id, encounter_id);

CREATE INDEX IF NOT EXISTS idx_package_orders_patient
  ON package_orders(tenant_id, patient_id);

CREATE INDEX IF NOT EXISTS idx_package_orders_package
  ON package_orders(tenant_id, package_id);

CREATE INDEX IF NOT EXISTS idx_package_orders_status
  ON package_orders(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_lab_order_tests_order
  ON lab_order_tests(tenant_id, order_id);

CREATE INDEX IF NOT EXISTS idx_lab_order_tests_code
  ON lab_order_tests(tenant_id, test_code);

CREATE INDEX IF NOT EXISTS idx_lab_order_tests_status
  ON lab_order_tests(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_imaging_order_details_order
  ON imaging_order_details(tenant_id, order_id);

CREATE INDEX IF NOT EXISTS idx_imaging_order_details_code
  ON imaging_order_details(tenant_id, study_code);

CREATE INDEX IF NOT EXISTS idx_imaging_order_details_status
  ON imaging_order_details(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_procedure_order_details_order
  ON procedure_order_details(tenant_id, order_id);

CREATE INDEX IF NOT EXISTS idx_procedure_order_details_code
  ON procedure_order_details(tenant_id, procedure_code);

CREATE INDEX IF NOT EXISTS idx_procedure_order_details_status
  ON procedure_order_details(tenant_id, status);

COMMIT;
