-- Remap semantic-catalog required_permission values to the RBAC codes that
-- foundation actually issues in the access token (see seed/foundation/04-permissions.sql).
--
-- The catalog used to name codes such as 'clinical.reports.patients' that no
-- role holds, so in production mode the report builder filtered out every
-- metric and dimension and the planner failed with "Unknown metric".
-- Idempotent: safe to re-run on a database seeded before the remap.

BEGIN;

WITH remap(old_code, new_code) AS (VALUES
  ('clinical.reports.admissions',    'admission.read'),
  ('clinical.reports.ai',            'diagnosis.read'),
  ('clinical.reports.appointments',  'appointment.read'),
  ('clinical.reports.codings',       'diagnosis.read'),
  ('clinical.reports.diagnoses',     'diagnosis.read'),
  ('clinical.reports.encounters',    'encounter.read'),
  ('clinical.reports.imaging',       'imaging_result.read'),
  ('clinical.reports.notes',         'clinical_note.read'),
  ('clinical.reports.orders',        'clinical_order.read'),
  ('clinical.reports.patients',      'patient.read'),
  ('clinical.reports.prescriptions', 'prescription.read'),
  ('clinical.reports.vitals',        'vitals.read'),
  ('foundation.reports.staff',       'staff.read'),
  ('rcm.reports.aging',              'invoice.read'),
  ('rcm.reports.invoices',           'invoice.read'),
  ('rcm.reports.revenue',            'invoice.read'),
  ('rcm.reports.receipts',           'payment.read'),
  ('rcm.reports.refunds',            'payment.read')
)
UPDATE semantic_metrics m
   SET required_permission = r.new_code, updated_at = NOW()
  FROM remap r
 WHERE m.required_permission = r.old_code;

WITH remap(old_code, new_code) AS (VALUES
  ('clinical.reports.admissions',    'admission.read'),
  ('clinical.reports.ai',            'diagnosis.read'),
  ('clinical.reports.appointments',  'appointment.read'),
  ('clinical.reports.codings',       'diagnosis.read'),
  ('clinical.reports.diagnoses',     'diagnosis.read'),
  ('clinical.reports.encounters',    'encounter.read'),
  ('clinical.reports.imaging',       'imaging_result.read'),
  ('clinical.reports.notes',         'clinical_note.read'),
  ('clinical.reports.orders',        'clinical_order.read'),
  ('clinical.reports.patients',      'patient.read'),
  ('clinical.reports.prescriptions', 'prescription.read'),
  ('clinical.reports.vitals',        'vitals.read'),
  ('foundation.reports.staff',       'staff.read'),
  ('rcm.reports.aging',              'invoice.read'),
  ('rcm.reports.invoices',           'invoice.read'),
  ('rcm.reports.revenue',            'invoice.read'),
  ('rcm.reports.receipts',           'payment.read'),
  ('rcm.reports.refunds',            'payment.read')
)
UPDATE semantic_dimensions d
   SET required_permission = r.new_code, updated_at = NOW()
  FROM remap r
 WHERE d.required_permission = r.old_code;

COMMIT;
