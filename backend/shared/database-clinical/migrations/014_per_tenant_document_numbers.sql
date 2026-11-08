-- Patient MRNs, encounter numbers, admission numbers and consent template
-- codes are unique per tenant, not across the instance. Each tenant numbers
-- its own records (PAT-2026-000001, ...), so a second tenant's first patient
-- would otherwise collide with the first tenant's. Needed for sandbox
-- tenants (docs/ADR/ADR-0017-sandbox-tenants.md). Idempotent.

ALTER TABLE patients DROP CONSTRAINT IF EXISTS patients_mrn_key;
DROP INDEX IF EXISTS patients_mrn_key;
CREATE UNIQUE INDEX IF NOT EXISTS uq_patients_tenant_mrn ON patients (tenant_id, mrn);

ALTER TABLE encounters DROP CONSTRAINT IF EXISTS encounters_encounter_number_key;
DROP INDEX IF EXISTS encounters_encounter_number_key;
CREATE UNIQUE INDEX IF NOT EXISTS uq_encounters_tenant_number ON encounters (tenant_id, encounter_number);

ALTER TABLE inpatient_admissions DROP CONSTRAINT IF EXISTS inpatient_admissions_admission_number_key;
DROP INDEX IF EXISTS inpatient_admissions_admission_number_key;
CREATE UNIQUE INDEX IF NOT EXISTS uq_inpatient_admissions_tenant_number ON inpatient_admissions (tenant_id, admission_number);

ALTER TABLE consent_templates DROP CONSTRAINT IF EXISTS consent_templates_template_code_key;
DROP INDEX IF EXISTS consent_templates_template_code_key;
CREATE UNIQUE INDEX IF NOT EXISTS uq_consent_templates_tenant_code ON consent_templates (tenant_id, template_code);
