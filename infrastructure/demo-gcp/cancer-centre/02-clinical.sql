-- =============================================================================
-- Demo overlay (zeal_clinical): Cancer Hospital + Cancer Clinic.
-- =============================================================================
-- Demo VM only. Run after 01-foundation.sql and after
-- seed/plugins/oncology/30-demo-cohort.sql (which writes the chief
-- complaints this file keys on). Idempotent.
--
--   * Denormalised facility names on encounters follow the rename.
--   * About half of the post-treatment follow-up and oral-therapy review
--     visits (and their appointments) move to the Cancer Clinic, so the
--     satellite clinic has its own history and today's list. Palliative care
--     and all treatment stays at the hospital. Re-running first moves the
--     clinic's visits back, then re-selects.
-- =============================================================================

BEGIN;

UPDATE encounters SET facility_name = 'Cancer Hospital'
WHERE facility_id = '087e0bd6-8d65-5133-94bd-7b4cd6ff3665' AND facility_name IS DISTINCT FROM 'Cancer Hospital'
  AND facility_name IS NOT NULL;

-- Demo patients come from Mumbai and across India (a referral centre), not
-- only Bengaluru as 27-demo-activity.sql writes.
UPDATE patients SET city = (ARRAY['Mumbai','Mumbai','Mumbai','Mumbai','Mumbai','Mumbai','Thane','Thane','Navi Mumbai','Navi Mumbai',
    'Kalyan','Pune','Nashik','Aurangabad','Nagpur','Patna','Varanasi','Ranchi','Kolkata','Surat'])
    [1 + (('x' || substr(md5('city:' || id), 1, 8))::bit(32)::bigint % 20)::int]
WHERE tenant_id = '11111111-1111-1111-1111-111111111111' AND mrn LIKE 'MRN-DEMO-%';

-- Reset a previous run.
UPDATE appointments SET facility_id = '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'
WHERE facility_id = uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'facility:CANCER-CLINIC');
UPDATE encounters SET facility_id = '087e0bd6-8d65-5133-94bd-7b4cd6ff3665',
  facility_name = CASE WHEN facility_name IS NOT NULL THEN 'Cancer Hospital' END
WHERE facility_id = uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'facility:CANCER-CLINIC');

CREATE TEMP TABLE clinic_visit ON COMMIT DROP AS
SELECT e.id, e.appointment_id
FROM encounters e
WHERE e.tenant_id = '11111111-1111-1111-1111-111111111111'
  AND e.encounter_class = 'AMB'
  AND e.facility_id = '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'
  AND (e.chief_complaint LIKE 'Follow-up after completion of treatment%'
    OR e.chief_complaint LIKE 'Oncology review on%')
  AND substr(md5('clinic:' || e.patient_id), 1, 1) < '8'; -- half the patients follow up at the clinic

UPDATE encounters e SET facility_id = uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'facility:CANCER-CLINIC'),
  facility_name = CASE WHEN e.facility_name IS NOT NULL THEN 'Cancer Clinic' END
WHERE e.id IN (SELECT id FROM clinic_visit);

UPDATE appointments a SET facility_id = uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'facility:CANCER-CLINIC')
WHERE a.id IN (SELECT appointment_id FROM clinic_visit WHERE appointment_id IS NOT NULL);

-- Today's and upcoming bookings of the same surveillance patients (treatment
-- completed) are at the clinic too.
UPDATE appointments a SET facility_id = uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'facility:CANCER-CLINIC')
WHERE a.tenant_id = '11111111-1111-1111-1111-111111111111'
  AND a.facility_id = '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'
  AND a.start_time >= CURRENT_DATE
  AND substr(md5('clinic:' || a.patient_id), 1, 1) < '8'
  AND EXISTS (SELECT 1 FROM plugin_oncology.oncology_care_plans cp
              WHERE cp.patient_id = a.patient_id AND cp.status = 'completed' AND cp.end_date < a.start_time::date);
UPDATE encounters e SET facility_id = a.facility_id, facility_name = CASE WHEN e.facility_name IS NOT NULL THEN 'Cancer Clinic' END
FROM appointments a
WHERE e.appointment_id = a.id AND a.start_time >= CURRENT_DATE
  AND a.facility_id = uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'facility:CANCER-CLINIC');

COMMIT;

SELECT CASE facility_id WHEN '087e0bd6-8d65-5133-94bd-7b4cd6ff3665' THEN 'Cancer Hospital' ELSE 'Cancer Clinic / other' END AS facility,
       COUNT(*) AS encounters
FROM encounters GROUP BY 1;
