-- =============================================================================
-- Demo activity: 13 months of clinic and ward history for the HealthAI+ dashboard
-- =============================================================================
-- Gives the dashboard's Today worklists, forecast and Week/Month views
-- (docs/features/dashboard.md) something realistic to read: a weekly rhythm
-- (busy weekdays, a quiet Saturday, near-closed Sunday), a monsoon-season
-- bump, a gentle upward trend over the year, today's clinic in progress,
-- next week's bookings, open orders and a ward with inpatients.
--
-- Everything is dated relative to CURRENT_DATE, so re-run it (with
-- rcm/09-demo-invoices.sql) before a demo to bring the history up to today.
-- It is deterministic (hash-based, no random()) and re-runnable: it deletes
-- its own rows first. Its rows are recognisable by MRN prefix `MRN-DEMO-`,
-- encounter number `DEMO-ENC-`, admission number `DEMO-ADM-`.
--
-- Tenant: Zeal Healthcare (11111111-...), Zeal Main Hospital.
-- Patient ids, MRNs and names are derived the same way in
-- rcm/09-demo-invoices.sql so invoices point at these patients.
-- =============================================================================

BEGIN;

-- Deterministic 0..1 from a text key.
CREATE OR REPLACE FUNCTION pg_temp.h(key text) RETURNS double precision
LANGUAGE sql IMMUTABLE AS $$
  SELECT ('x' || substr(md5(key), 1, 8))::bit(32)::bigint / 4294967295.0
$$;

-- ---------------------------------------------------------------------------
-- Clean up a previous run (admissions first: their encounter FK is RESTRICT).
-- ---------------------------------------------------------------------------
DELETE FROM inpatient_admissions WHERE admission_number LIKE 'DEMO-ADM-%';
DELETE FROM patients WHERE mrn LIKE 'MRN-DEMO-%';

-- ---------------------------------------------------------------------------
-- Patients: 900, registered over the last 395 days, more of them recently.
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE demo_patient ON COMMIT DROP AS
SELECT
  k,
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-patient-' || k) AS id,
  'MRN-DEMO-' || lpad(k::text, 4, '0') AS mrn,
  (ARRAY['Aarav','Diya','Vihaan','Ananya','Arjun','Isha','Kabir','Meera','Rohan','Saanvi',
         'Omar','Fatima','Yusuf','Layla','Hamdan','Noura','Rahul','Priya','Nikhil','Kavya',
         'Aditya','Sneha','Farhan','Zara','Karthik','Lakshmi','Vivek','Pooja','Imran','Aisha'])
    [1 + (k * 7) % 30] AS first_name,
  (ARRAY['Sharma','Iyer','Nair','Reddy','Khan','Menon','Patel','Gupta','Rao','Pillai',
         'Al Hashimi','Kapoor','Das','Joshi','Kumar','Shetty','Bose','Varma','Hegde','Qureshi'])
    [1 + (k * 11) % 20] AS last_name,
  CASE WHEN k % 2 = 0 THEN 'female' ELSE 'male' END AS gender,
  (CURRENT_DATE - ((18 + (pg_temp.h('dob' || k) * 62)::int) * 365 + (k * 37) % 365))::date AS dob,
  -- Registration spread over 395 days, denser toward today.
  (CURRENT_DATE - (394 * (1 - sqrt(k / 900.0)))::int)
    + make_interval(hours => 8 + (k % 9), mins => (k * 13) % 60) AS registered_at
FROM generate_series(1, 900) AS k;

-- Keep registrations off Sundays: move them to Monday.
UPDATE demo_patient
SET registered_at = registered_at + INTERVAL '1 day'
WHERE EXTRACT(DOW FROM registered_at) = 0 AND registered_at + INTERVAL '1 day' <= NOW();

-- Rank by registration so a visit can pick any patient registered by its day
-- with one hash instead of scanning them all.
CREATE TEMP TABLE demo_patient_rank ON COMMIT DROP AS
SELECT row_number() OVER (ORDER BY registered_at, k) AS rn, k, id, registered_at::date AS registered_on
FROM demo_patient;
CREATE INDEX ON demo_patient_rank (rn);

INSERT INTO patients (
  id, mrn, tenant_id, first_name, last_name, date_of_birth, gender,
  phone_number, nationality, preferred_language, country, city,
  created_by, created_at_facility, registration_source, status, created_at, updated_at
)
SELECT
  id, mrn, '11111111-1111-1111-1111-111111111111'::uuid, first_name, last_name, dob, gender,
  '+9198' || lpad(((k * 7919) % 100000000)::text, 8, '0'), 'IN', 'en', 'IN', 'Bengaluru',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::uuid,
  'walk_in', 'active', registered_at, registered_at
FROM demo_patient;

-- ---------------------------------------------------------------------------
-- Outpatient days: how many visits each day, with a weekly shape, a
-- monsoon-season bump (peaks early August) and a trend.
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE demo_day ON COMMIT DROP AS
SELECT
  d::date AS day,
  (CURRENT_DATE - d::date) AS age,
  greatest(0, round(
    CASE EXTRACT(DOW FROM d)
      WHEN 0 THEN 2 WHEN 1 THEN 30 WHEN 2 THEN 26 WHEN 3 THEN 25
      WHEN 4 THEN 27 WHEN 5 THEN 23 ELSE 11 END
    * (0.82 + 0.18 * (1 - (CURRENT_DATE - d::date) / 395.0))     -- ~20% growth over the year
    * (1 + 0.08 * cos(2 * pi() * (EXTRACT(DOY FROM d) - 220) / 365.0)) -- seasonal
    * (0.85 + 0.3 * pg_temp.h('day' || d::date))                  -- day-to-day noise
  ))::int AS visits,
  (SELECT COUNT(*) FROM demo_patient_rank r WHERE r.registered_on <= d::date) AS registered
FROM generate_series(CURRENT_DATE - 394, CURRENT_DATE + 14, INTERVAL '1 day') AS d;

-- Physicians seen in clinic (foundation staff, Zeal Main Hospital).
CREATE TEMP TABLE demo_staff ON COMMIT DROP AS
SELECT * FROM (VALUES
  (0, 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee'::uuid, 'Dr. Ahmed Al-Mansoori'),
  (1, '6d2df89a-3f81-5338-b197-373d347031db'::uuid, 'Dr. Fatima Al-Zaabi'),
  (2, 'e761d1dc-1d77-5499-bd12-b077276934a7'::uuid, 'Dr. Omar Al-Ketbi'),
  (3, '23ef067c-d352-5415-945b-9b802d20bc3c'::uuid, 'Dr. Layla Al-Shamsi')
) AS s(i, id, name);

-- One row per visit slot; patients are only those already registered by then.
CREATE TEMP TABLE demo_visit ON COMMIT DROP AS
SELECT
  v.day, v.age, v.slot,
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-visit-' || v.day || '-' || v.slot) AS appointment_id,
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-encounter-' || v.day || '-' || v.slot) AS encounter_id,
  v.day + make_interval(hours => 9 + (v.slot * 20) / 60, mins => (v.slot * 20) % 60) AS starts_at,
  pg_temp.h('outcome' || v.day || v.slot) AS roll,
  (SELECT r.id FROM demo_patient_rank r
    WHERE r.rn = 1 + floor(pg_temp.h('pick' || v.day || '-' || v.slot) * v.registered)) AS patient_id,
  (v.slot % 4) AS staff_i
FROM (
  SELECT d.day, d.age, d.registered, s AS slot
  FROM demo_day d, generate_series(0, 40) AS s
  WHERE s < d.visits AND d.registered > 0
) v;
DELETE FROM demo_visit WHERE patient_id IS NULL;

-- Appointments: past ones mostly completed, ~6% no-show, ~4% cancelled;
-- today's earlier slots done, later ones still booked; future ones booked.
INSERT INTO appointments (
  id, tenant_id, patient_id, facility_id, staff_id, staff_display_name,
  appointment_type, visit_type, status, start_time, end_time, duration, notes,
  created_at, updated_at
)
SELECT
  appointment_id, '11111111-1111-1111-1111-111111111111'::uuid, patient_id,
  '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::uuid, s.id, s.name,
  CASE WHEN roll < 0.65 THEN 'consultation' WHEN roll < 0.9 THEN 'follow_up' ELSE 'procedure' END,
  CASE WHEN roll < 0.65 THEN 'new' ELSE 'follow_up' END,
  CASE
    WHEN starts_at > NOW() THEN 'scheduled'
    WHEN roll > 0.96 THEN 'cancelled'
    WHEN roll > 0.90 THEN 'no_show'
    WHEN starts_at > NOW() - INTERVAL '40 minutes' THEN 'confirmed'
    ELSE 'completed'
  END,
  starts_at, starts_at + INTERVAL '20 minutes', 20, '[demo-activity]',
  least(starts_at - INTERVAL '5 days', NOW()), least(starts_at - INTERVAL '5 days', NOW())
FROM demo_visit v JOIN demo_staff s ON s.i = v.staff_i;

-- Encounters for every visit that happened (or is happening now).
INSERT INTO encounters (
  id, encounter_number, tenant_id, patient_id, facility_id, primary_staff_id, appointment_id,
  encounter_class, encounter_type, status, priority, start_time, end_time, encounter_source,
  created_at, updated_at
)
SELECT
  encounter_id,
  'DEMO-ENC-' || to_char(day, 'YYMMDD') || '-' || lpad(slot::text, 2, '0'),
  '11111111-1111-1111-1111-111111111111'::uuid, patient_id,
  '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::uuid, s.id, appointment_id,
  'AMB', 'outpatient',
  CASE WHEN starts_at > NOW() - INTERVAL '40 minutes' THEN 'in-progress' ELSE 'finished' END,
  'routine', starts_at,
  CASE WHEN starts_at > NOW() - INTERVAL '40 minutes' THEN NULL ELSE starts_at + INTERVAL '20 minutes' END,
  'appointment', starts_at, starts_at
FROM demo_visit v JOIN demo_staff s ON s.i = v.staff_i
WHERE starts_at <= NOW() AND roll <= 0.90;

-- ---------------------------------------------------------------------------
-- Orders: ~30% of visits get labs, ~10% imaging. Older ones are complete;
-- the last two days' are still open, a couple of them urgent.
-- ---------------------------------------------------------------------------
INSERT INTO clinical_orders (
  id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name,
  priority, status, result_status, ordered_by, ordered_at, performed_at, resulted_at, created_at, updated_at
)
SELECT
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-order-' || e.id),
  e.tenant_id, e.id, e.patient_id, o.order_type, o.code, o.system, o.name,
  CASE WHEN pg_temp.h('prio' || e.id) > 0.93 THEN 'stat' ELSE 'routine' END,
  CASE WHEN e.start_time > NOW() - INTERVAL '2 days' AND pg_temp.h('open' || e.id) < 0.7 THEN
         CASE WHEN pg_temp.h('ip' || e.id) < 0.5 THEN 'ordered' ELSE 'in_progress' END
       ELSE 'completed' END,
  CASE WHEN e.start_time > NOW() - INTERVAL '2 days' AND pg_temp.h('open' || e.id) < 0.7 THEN 'pending' ELSE 'final' END,
  e.primary_staff_id, e.start_time + INTERVAL '10 minutes',
  e.start_time + INTERVAL '1 hour', e.start_time + INTERVAL '5 hours',
  e.start_time + INTERVAL '10 minutes', e.start_time + INTERVAL '5 hours'
FROM encounters e
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    ('lab', '58410-2', 'LOINC', 'Complete blood count (CBC)', 0.00, 0.30),
    ('imaging', '36643-5', 'LOINC', 'Chest X-ray, 2 views', 0.30, 0.40)
  ) AS t(order_type, code, system, name, lo, hi)
  WHERE pg_temp.h('order' || e.id) >= t.lo AND pg_temp.h('order' || e.id) < t.hi
) o
WHERE e.encounter_number LIKE 'DEMO-ENC-%';

-- Normalise urgency: only open orders keep "stat", and only a few of them.
UPDATE clinical_orders SET priority = 'routine'
WHERE id IN (
  SELECT c.id FROM clinical_orders c
  JOIN encounters e ON e.id = c.encounter_id AND e.encounter_number LIKE 'DEMO-ENC-%'
  WHERE c.priority = 'stat' AND c.status = 'completed'
);

-- Lab reports: final for completed labs in the last 2 weeks; recent ones still draft/preliminary.
INSERT INTO lab_reports (
  id, tenant_id, order_id, encounter_id, patient_id, report_status, version,
  specimen_type, collection_date, received_date, reported_at, verified_at, created_at, updated_at
)
SELECT
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-report-' || c.id),
  c.tenant_id, c.id, c.encounter_id, c.patient_id,
  CASE WHEN c.status = 'completed' THEN 'FINAL'
       WHEN pg_temp.h('rs' || c.id) < 0.5 THEN 'PRELIMINARY' ELSE 'DRAFT' END,
  1, 'blood', c.ordered_at + INTERVAL '20 minutes', c.ordered_at + INTERVAL '1 hour',
  c.ordered_at + INTERVAL '4 hours',
  CASE WHEN c.status = 'completed' THEN c.ordered_at + INTERVAL '5 hours' END,
  c.ordered_at, c.ordered_at + INTERVAL '5 hours'
FROM clinical_orders c
JOIN encounters e ON e.id = c.encounter_id AND e.encounter_number LIKE 'DEMO-ENC-%'
WHERE c.order_type = 'lab'
  AND (c.status = 'in_progress' OR (c.status = 'completed' AND c.ordered_at > NOW() - INTERVAL '14 days'));

-- ---------------------------------------------------------------------------
-- Ward: ~2 admissions a day over 395 days, 4-day median stay. Recent ones are
-- still in; a few are past their expected discharge or being planned out.
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE demo_admission ON COMMIT DROP AS
SELECT
  n,
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-adm-enc-' || n) AS encounter_id,
  (SELECT r.id FROM demo_patient_rank r
    WHERE r.rn = 1 + floor(pg_temp.h('adm' || n) * (SELECT COUNT(*) FROM demo_patient_rank))) AS patient_id,
  (CURRENT_DATE - (394 - (n * 394) / 760))::date + make_interval(hours => 10 + n % 10) AS admitted_at,
  2 + (pg_temp.h('los' || n) * 6)::int AS stay_days,
  (n % 4) AS staff_i
FROM generate_series(1, 760) AS n;

INSERT INTO encounters (
  id, encounter_number, tenant_id, patient_id, facility_id, primary_staff_id,
  encounter_class, encounter_type, status, priority, start_time, end_time, encounter_source,
  created_at, updated_at
)
SELECT
  a.encounter_id, 'DEMO-ENC-IP-' || lpad(a.n::text, 3, '0'),
  '11111111-1111-1111-1111-111111111111'::uuid, a.patient_id,
  '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::uuid, s.id,
  'IMP', 'inpatient',
  CASE WHEN a.admitted_at + make_interval(days => a.stay_days) > NOW() THEN 'in-progress' ELSE 'finished' END,
  CASE WHEN a.n % 3 = 0 THEN 'urgent' ELSE 'routine' END,
  a.admitted_at,
  CASE WHEN a.admitted_at + make_interval(days => a.stay_days) > NOW() THEN NULL
       ELSE a.admitted_at + make_interval(days => a.stay_days) END,
  CASE WHEN a.n % 3 = 0 THEN 'emergency' ELSE 'appointment' END, a.admitted_at, a.admitted_at
FROM demo_admission a JOIN demo_staff s ON s.i = a.staff_i
WHERE a.admitted_at <= NOW();

INSERT INTO inpatient_admissions (
  id, tenant_id, facility_id, patient_id, encounter_id, admission_number, admission_date,
  admission_type, admission_source, attending_physician_id, expected_discharge_date,
  actual_discharge_date, admission_status, created_at, updated_at, created_by
)
SELECT
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-adm-' || a.n),
  '11111111-1111-1111-1111-111111111111'::uuid, '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::uuid,
  a.patient_id, a.encounter_id, 'DEMO-ADM-' || lpad(a.n::text, 3, '0'), a.admitted_at,
  CASE WHEN a.n % 3 = 0 THEN 'emergency' ELSE 'elective' END,
  CASE WHEN a.n % 3 = 0 THEN 'emergency_room' ELSE 'outpatient_dept' END,
  s.id,
  -- The stay as planned; a few current patients have overrun it.
  (a.admitted_at + make_interval(days => a.stay_days - CASE WHEN a.n % 7 = 0 THEN 1 ELSE 0 END))::date,
  CASE WHEN a.admitted_at + make_interval(days => a.stay_days) > NOW() THEN NULL
       ELSE a.admitted_at + make_interval(days => a.stay_days) END,
  (CASE
     WHEN a.admitted_at + make_interval(days => a.stay_days) <= NOW() THEN 'DISCHARGED'
     WHEN a.admitted_at + make_interval(days => a.stay_days) < NOW() + INTERVAL '1 day' THEN 'DISCHARGE_PLANNING'
     ELSE 'ADMITTED'
   END)::"InpatientAdmissionStatus",
  a.admitted_at, a.admitted_at, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
FROM demo_admission a JOIN demo_staff s ON s.i = a.staff_i
WHERE a.admitted_at <= NOW();

COMMIT;

-- Summary for the seed log.
SELECT 'demo patients' AS what, COUNT(*) FROM patients WHERE mrn LIKE 'MRN-DEMO-%'
UNION ALL SELECT 'demo encounters', COUNT(*) FROM encounters WHERE encounter_number LIKE 'DEMO-ENC-%'
UNION ALL SELECT 'demo appointments', COUNT(*) FROM appointments WHERE notes = '[demo-activity]'
UNION ALL SELECT 'demo open orders', COUNT(*) FROM clinical_orders c JOIN encounters e ON e.id = c.encounter_id
  WHERE e.encounter_number LIKE 'DEMO-ENC-%' AND c.status IN ('ordered', 'in_progress')
UNION ALL SELECT 'demo inpatients now', COUNT(*) FROM inpatient_admissions
  WHERE admission_number LIKE 'DEMO-ADM-%' AND admission_status::text <> 'DISCHARGED';
