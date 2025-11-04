-- Migration: Remove deprecated staff_code column from staff
-- Context: staffCode identifier replaced by employee_id across services

ALTER TABLE staff DROP CONSTRAINT IF EXISTS Staff_tenantId_staffCode_key;
ALTER TABLE staff DROP CONSTRAINT IF EXISTS staff_tenant_id_staff_code_key;
ALTER TABLE staff DROP COLUMN IF EXISTS staff_code;
