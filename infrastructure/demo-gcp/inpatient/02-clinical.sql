-- =============================================================================
-- Demo overlay (zeal_clinical): oncology inpatients in the Cancer Hospital wards.
-- =============================================================================
-- Demo VM only. Run after 01-foundation.sql (once) and, on every refresh,
-- after seed/clinical/27-demo-activity.sql, seed/plugins/oncology/30-demo-cohort.sql
-- and ../cancer-centre/02-clinical.sql (refresh-demo-data.sh does this).
--
--   * About 10 oncology admissions a day over the same 13 months as the demo
--     activity: day-care-style chemo stays, surgery, febrile neutropenia,
--     ICU, palliative care, haemato-oncology and bone marrow transplant, with
--     realistic lengths of stay. Rows: encounter `DEMO-ENC-IPO-*`, admission
--     `DEMO-ADM-ONC-*` (so 27-demo-activity.sql removes them with its own).
--   * Every current demo inpatient (these and 27-demo-activity.sql's
--     `DEMO-ADM-*`) is put in a bed in the ward that fits the case and the
--     patient's gender; overflow goes to a compatible ward, and the newest
--     two admissions are left waiting for a bed. Open bed assignments, acuity,
--     board flags, vitals due/overdue, nurse, discharge planning and a few
--     beds awaiting cleaning are filled in so the ward and bed boards look live.
--
-- Ward and bed ids are derived exactly as in 01-foundation.sql.
-- Deterministic (hash based) and re-runnable: removes its own rows first.
-- Dates are relative to CURRENT_DATE / NOW() in the session time zone; the
-- refresh script runs with PGTZ=Asia/Kolkata.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION pg_temp.h(key text) RETURNS double precision
LANGUAGE sql IMMUTABLE AS $$
  SELECT ('x' || substr(md5(key), 1, 8))::bit(32)::bigint / 4294967295.0
$$;

-- ---------------------------------------------------------------------------
-- Clean up a previous run.
-- ---------------------------------------------------------------------------
DELETE FROM bed_assignments WHERE notes = '[demo-inpatient]';
DELETE FROM inpatient_admissions WHERE admission_number LIKE 'DEMO-ADM-ONC-%';
DELETE FROM encounters WHERE encounter_number LIKE 'DEMO-ENC-IPO-%';
UPDATE inpatient_admissions SET
  current_ward_id = NULL, current_ward_name = NULL, current_space_id = NULL,
  current_bed_id = NULL, current_bed_number = NULL
WHERE admission_number LIKE 'DEMO-ADM-%';

-- ---------------------------------------------------------------------------
-- Wards and beds (same plan and ids as 01-foundation.sql).
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE onc_ward ON COMMIT DROP AS
SELECT code, name, beds,
       uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'ward:ONC-' || code) AS ward_id
FROM (VALUES
  ('MED-M', 'Medical Oncology Ward - Male',   20),
  ('MED-F', 'Medical Oncology Ward - Female', 20),
  ('SURG',  'Surgical Oncology Ward',         18),
  ('HEM',   'Haemato-Oncology Ward',          12),
  ('BMT',   'Bone Marrow Transplant Unit',     6),
  ('ICU',   'Oncology ICU',                   10),
  ('PALL',  'Palliative Care Ward',           10)
) AS w(code, name, beds);

CREATE TEMP TABLE onc_bed ON COMMIT DROP AS
SELECT w.code AS ward_code, w.ward_id, w.name AS ward_name,
       uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'bed:ONC-' || w.code || ':' || lpad(n::text, 3, '0')) AS bed_id,
       w.code || '-' || lpad(n::text, 2, '0') AS bed_number,
       -- A fixed but scattered fill order, so occupied beds are not all bed 1..k.
       row_number() OVER (PARTITION BY w.code ORDER BY pg_temp.h('bed-order' || w.code || n)) AS rk,
       false AS taken
FROM onc_ward w, generate_series(1, w.beds) AS n
WHERE NOT (w.code = 'MED-M' AND n = 20);   -- under maintenance in foundation

-- Beds used by real (non-demo) admissions stay theirs.
UPDATE onc_bed b SET taken = true
FROM inpatient_admissions a
WHERE a.current_bed_id = b.bed_id AND a.admission_number NOT LIKE 'DEMO-ADM-%'
  AND a.admission_status::text NOT IN ('DISCHARGED', 'CANCELLED', 'EXPIRED', 'ABSCONDED');

-- ---------------------------------------------------------------------------
-- Demo patients, by registration, with gender and a haemato-lymphoid flag.
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE onc_pt ON COMMIT DROP AS
SELECT row_number() OVER (ORDER BY p.created_at, p.mrn) AS rn, p.id, p.gender,
       p.created_at::date AS registered_on,
       EXISTS (SELECT 1 FROM plugin_oncology.cancer_diagnoses d
               WHERE d.patient_id = p.id AND d.icd_code ~ '^C(8[1-9]|9[0-6])') AS haem
FROM patients p
WHERE p.mrn LIKE 'MRN-DEMO-%'
  -- Registry candidates held back by 30-demo-cohort.sql are not oncology inpatients.
  AND EXISTS (SELECT 1 FROM plugin_oncology.cancer_diagnoses d WHERE d.patient_id = p.id);
CREATE INDEX ON onc_pt (rn);

-- Physicians (names as the India overlay presents them) and ward nurses.
CREATE TEMP TABLE onc_doc ON COMMIT DROP AS
SELECT * FROM (VALUES
  (0, 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee'::uuid, 'Dr. Vikram Iyer'),
  (1, '6d2df89a-3f81-5338-b197-373d347031db'::uuid, 'Dr. Meera Krishnan'),
  (2, 'e761d1dc-1d77-5499-bd12-b077276934a7'::uuid, 'Dr. Arjun Mehta'),
  (3, '23ef067c-d352-5415-945b-9b802d20bc3c'::uuid, 'Dr. Kavya Nair')
) AS d(i, id, name);
CREATE TEMP TABLE onc_nurse ON COMMIT DROP AS
SELECT * FROM (VALUES
  (0, 'f97c5b31-aa24-5862-98cf-ee29d50db5d1'::uuid),
  (1, 'ed5e312b-408f-564c-8bb1-49e921f36106'::uuid),
  (2, 'ac4287f1-9764-590c-b62a-1ea17f43aad8'::uuid),
  (3, 'aebba554-5fff-5daf-966c-713ea9f34426'::uuid)
) AS n(i, id);

-- ---------------------------------------------------------------------------
-- Oncology admissions: 3,950 over 395 days (about 10 a day).
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE onc_adm ON COMMIT DROP AS
SELECT
  g.n,
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-onc-adm-' || g.n) AS admission_id,
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-onc-enc-' || g.n) AS encounter_id,
  -- Any hour of the day (oncology emergencies arrive overnight too), so a
  -- morning refresh already shows some of today's admissions.
  g.day + make_interval(hours => floor(pg_temp.h('onc-hr' || g.n) * 24)::int,
                        mins => (pg_temp.h('onc-mi' || g.n) * 59)::int) AS admitted_at,
  (SELECT p.id FROM onc_pt p
    WHERE p.rn = 1 + floor(pg_temp.h('onc-pt' || g.n)
                 * greatest(1, (SELECT COUNT(*) FROM onc_pt q WHERE q.registered_on <= g.day)))) AS patient_id,
  pg_temp.h('onc-cat' || g.n) AS roll,
  pg_temp.h('onc-los' || g.n) AS los_roll,
  NULL::text AS category,
  NULL::int AS los_days,
  NULL::text AS ward_code
FROM (
  SELECT n, CURRENT_DATE - 394 + floor((n - 1) * 395.0 / 3950)::int AS day
  FROM generate_series(1, 3950) AS n
) g;
DELETE FROM onc_adm WHERE admitted_at > NOW() OR patient_id IS NULL;

-- Case mix: haemato-lymphoid patients go to HEM (some BMT); others by roll.
UPDATE onc_adm a SET category = CASE
    WHEN p.haem AND a.roll < 0.2 THEN 'bmt'
    WHEN p.haem                 THEN 'haem'
    WHEN a.roll < 0.32 THEN 'chemo'
    WHEN a.roll < 0.58 THEN 'surgery'
    WHEN a.roll < 0.68 THEN 'icu'
    WHEN a.roll < 0.78 THEN 'palliative'
    ELSE 'neutropenia' END
FROM onc_pt p WHERE p.id = a.patient_id;

UPDATE onc_adm SET los_days = CASE category
    WHEN 'chemo'       THEN 2 + (los_roll * 2)::int     -- 2-4
    WHEN 'surgery'     THEN 3 + (los_roll * 6)::int     -- 3-9
    WHEN 'icu'         THEN 2 + (los_roll * 4)::int     -- 2-6
    WHEN 'palliative'  THEN 4 + (los_roll * 8)::int     -- 4-12
    WHEN 'neutropenia' THEN 3 + (los_roll * 4)::int     -- 3-7
    WHEN 'haem'        THEN 5 + (los_roll * 9)::int     -- 5-14
    WHEN 'bmt'         THEN 18 + (los_roll * 10)::int   -- 18-28
  END;

ALTER TABLE onc_adm ADD COLUMN discharge_at timestamptz;
UPDATE onc_adm SET discharge_at = (admitted_at::date + los_days)
  + make_interval(hours => 10 + (pg_temp.h('onc-dc' || n) * 7)::int, mins => (pg_temp.h('onc-dm' || n) * 59)::int);

-- No patient in two beds at once: current stays that collide with another
-- current stay (here or in 27-demo-activity.sql) move to an idle patient.
CREATE TEMP TABLE onc_busy ON COMMIT DROP AS
SELECT patient_id FROM inpatient_admissions
WHERE admission_number LIKE 'DEMO-ADM-%' AND admission_status::text <> 'DISCHARGED';

WITH cur AS (
  SELECT n, patient_id, row_number() OVER (PARTITION BY patient_id ORDER BY admitted_at) AS k
  FROM onc_adm WHERE discharge_at > NOW()
), clash AS (
  SELECT n, row_number() OVER (ORDER BY n) AS j FROM cur
  WHERE k > 1 OR patient_id IN (SELECT patient_id FROM onc_busy)
), pool AS (
  SELECT id, row_number() OVER (ORDER BY pg_temp.h('onc-pool' || id)) AS j FROM onc_pt
  WHERE id NOT IN (SELECT patient_id FROM cur) AND id NOT IN (SELECT patient_id FROM onc_busy)
)
UPDATE onc_adm a SET patient_id = pool.id
FROM clash JOIN pool USING (j) WHERE a.n = clash.n;

UPDATE onc_adm a SET ward_code = CASE a.category
    WHEN 'surgery' THEN 'SURG' WHEN 'icu' THEN 'ICU' WHEN 'palliative' THEN 'PALL'
    WHEN 'haem' THEN 'HEM' WHEN 'bmt' THEN 'BMT'
    ELSE CASE WHEN p.gender = 'female' THEN 'MED-F' ELSE 'MED-M' END END
FROM onc_pt p WHERE p.id = a.patient_id;

-- ---------------------------------------------------------------------------
-- Encounters and admissions.
-- ---------------------------------------------------------------------------
INSERT INTO encounters (
  id, encounter_number, tenant_id, patient_id, facility_id, facility_name,
  department_id, department_name, primary_staff_id,
  encounter_class, encounter_type, status, priority, start_time, end_time, encounter_source,
  chief_complaint, created_at, updated_at
)
SELECT
  a.encounter_id, 'DEMO-ENC-IPO-' || lpad(a.n::text, 4, '0'),
  '11111111-1111-1111-1111-111111111111'::uuid, a.patient_id,
  '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::uuid, 'Cancer Hospital',
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'dept:MAIN:IPD'), 'Inpatient Services',
  d.id, 'IMP', 'inpatient',
  CASE WHEN a.discharge_at > NOW() THEN 'in-progress' ELSE 'finished' END,
  CASE WHEN a.category IN ('icu', 'neutropenia') THEN 'urgent' ELSE 'routine' END,
  a.admitted_at, CASE WHEN a.discharge_at > NOW() THEN NULL ELSE a.discharge_at END,
  CASE WHEN a.category IN ('icu', 'neutropenia', 'palliative') THEN 'emergency' ELSE 'appointment' END,
  CASE a.category
    WHEN 'chemo'       THEN 'Admitted for scheduled inpatient chemotherapy cycle'
    WHEN 'surgery'     THEN 'Elective oncological surgery'
    WHEN 'icu'         THEN 'Post-operative / critical care monitoring'
    WHEN 'palliative'  THEN 'Pain and symptom control'
    WHEN 'neutropenia' THEN 'Fever with neutropenia after chemotherapy'
    WHEN 'haem'        THEN 'Induction / consolidation chemotherapy'
    WHEN 'bmt'         THEN 'Haematopoietic stem cell transplant'
  END,
  a.admitted_at, a.admitted_at
FROM onc_adm a JOIN onc_doc d ON d.i = a.n % 4;

INSERT INTO inpatient_admissions (
  id, tenant_id, facility_id, patient_id, encounter_id, admission_number, admission_date,
  admission_type, admission_source, attending_physician_id, attending_physician_display_name,
  expected_discharge_date, actual_discharge_date, admission_status, discharge_status,
  discharge_type, discharge_destination, length_of_stay_days, estimated_cost,
  insurance_auth_number, insurance_auth_date,
  current_ward_id, current_ward_name, created_at, updated_at, created_by
)
SELECT
  a.admission_id, '11111111-1111-1111-1111-111111111111'::uuid,
  '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::uuid, a.patient_id, a.encounter_id,
  'DEMO-ADM-ONC-' || lpad(a.n::text, 4, '0'), a.admitted_at,
  CASE WHEN a.category IN ('icu', 'neutropenia', 'palliative') THEN 'emergency' ELSE 'elective' END,
  CASE WHEN a.category IN ('icu', 'neutropenia', 'palliative') THEN 'emergency_room' ELSE 'outpatient_dept' END,
  d.id, d.name,
  -- The stay as planned; about one in seven runs a day over.
  (a.discharge_at::date - CASE WHEN a.n % 7 = 0 THEN 1 ELSE 0 END),
  CASE WHEN a.discharge_at <= NOW() THEN a.discharge_at END,
  (CASE WHEN a.discharge_at <= NOW() THEN 'DISCHARGED'
        WHEN a.discharge_at < NOW() + INTERVAL '1 day' THEN 'DISCHARGE_PLANNING'
        ELSE 'ADMITTED' END)::"InpatientAdmissionStatus",
  (CASE WHEN a.discharge_at <= NOW() THEN 'CONFIRMED'
        WHEN a.discharge_at < NOW() + INTERVAL '1 day' THEN
          CASE WHEN a.n % 2 = 0 THEN 'READY' ELSE 'INITIATED' END
        WHEN a.discharge_at < NOW() + INTERVAL '2 days' THEN 'FIT_FOR_DISCHARGE'
        ELSE 'NONE' END)::"InpatientDischargeStatus",
  CASE WHEN a.discharge_at <= NOW() THEN 'routine' END,
  CASE WHEN a.discharge_at <= NOW() THEN
    CASE WHEN a.category = 'palliative' AND a.n % 5 = 0 THEN 'hospice' ELSE 'home' END END,
  CASE WHEN a.discharge_at <= NOW() THEN a.los_days
       ELSE (CURRENT_DATE - a.admitted_at::date) END,
  (CASE a.category WHEN 'bmt' THEN 1450000 WHEN 'surgery' THEN 285000 WHEN 'icu' THEN 210000
     WHEN 'haem' THEN 340000 WHEN 'chemo' THEN 65000 WHEN 'palliative' THEN 90000 ELSE 120000 END
   * (0.85 + 0.3 * pg_temp.h('onc-cost' || a.n)))::numeric(12, 2),
  CASE WHEN a.n % 3 <> 0 THEN 'PMJAY-' || to_char(a.admitted_at, 'YYMMDD') || '-' || lpad(a.n::text, 4, '0') END,
  CASE WHEN a.n % 3 <> 0 THEN a.admitted_at::date END,
  w.ward_id, w.name,
  a.admitted_at, coalesce(least(a.discharge_at, NOW()), a.admitted_at),
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
FROM onc_adm a
JOIN onc_doc d ON d.i = a.n % 4
JOIN onc_ward w ON w.code = a.ward_code;

-- ---------------------------------------------------------------------------
-- Put current inpatients in beds.
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE onc_cur ON COMMIT DROP AS
SELECT ia.id, ia.patient_id, ia.admission_date, ia.admission_number, p.gender,
       coalesce(a.ward_code,
         CASE WHEN EXISTS (SELECT 1 FROM plugin_oncology.cancer_diagnoses d
                           WHERE d.patient_id = ia.patient_id AND d.icd_code ~ '^C(8[1-9]|9[0-6])') THEN 'HEM'
              WHEN p.gender = 'female' THEN 'MED-F' ELSE 'MED-M' END) AS want_ward,
       coalesce(a.category, 'medical') AS category,
       NULL::uuid AS bed_id,
       row_number() OVER (ORDER BY ia.admission_date DESC) AS newest
FROM inpatient_admissions ia
JOIN patients p ON p.id = ia.patient_id
LEFT JOIN onc_adm a ON a.admission_id = ia.id
WHERE ia.admission_number LIKE 'DEMO-ADM-%' AND ia.admission_status::text <> 'DISCHARGED';

-- The newest two wait for a bed (admission desk worklist).
DELETE FROM onc_cur WHERE newest <= 2;

-- Pass 1: the ward that fits, longest-staying patients first.
WITH want AS (
  SELECT id, want_ward, row_number() OVER (PARTITION BY want_ward ORDER BY admission_date, id) AS k
  FROM onc_cur
), free AS (
  SELECT bed_id, ward_code, row_number() OVER (PARTITION BY ward_code ORDER BY rk) AS k
  FROM onc_bed WHERE NOT taken
)
UPDATE onc_cur c SET bed_id = free.bed_id
FROM want JOIN free ON free.ward_code = want.want_ward AND free.k = want.k
WHERE c.id = want.id;
UPDATE onc_bed b SET taken = true FROM onc_cur c WHERE c.bed_id = b.bed_id;

-- Pass 2: overflow into a compatible ward (same-gender medical, surgical,
-- palliative), men first, then women.
WITH want AS (
  SELECT id, row_number() OVER (ORDER BY admission_date, id) AS k
  FROM onc_cur WHERE bed_id IS NULL AND want_ward NOT IN ('ICU', 'BMT') AND gender <> 'female'
), free AS (
  SELECT bed_id, row_number() OVER (ORDER BY ward_code <> 'MED-M', ward_code, rk) AS k
  FROM onc_bed WHERE NOT taken AND ward_code IN ('MED-M', 'SURG', 'PALL', 'HEM')
)
UPDATE onc_cur c SET bed_id = free.bed_id FROM want JOIN free USING (k) WHERE c.id = want.id;
UPDATE onc_bed b SET taken = true FROM onc_cur c WHERE c.bed_id = b.bed_id;

WITH want AS (
  SELECT id, row_number() OVER (ORDER BY admission_date, id) AS k
  FROM onc_cur WHERE bed_id IS NULL AND want_ward NOT IN ('ICU', 'BMT') AND gender = 'female'
), free AS (
  SELECT bed_id, row_number() OVER (ORDER BY ward_code <> 'MED-F', ward_code, rk) AS k
  FROM onc_bed WHERE NOT taken AND ward_code IN ('MED-F', 'SURG', 'PALL', 'HEM')
)
UPDATE onc_cur c SET bed_id = free.bed_id FROM want JOIN free USING (k) WHERE c.id = want.id;
UPDATE onc_bed b SET taken = true FROM onc_cur c WHERE c.bed_id = b.bed_id;

INSERT INTO bed_assignments (
  id, tenant_id, admission_id, patient_id, bed_id, ward_id, space_id,
  assigned_at, assigned_by, notes, created_at, updated_at
)
SELECT
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-onc-bed-' || c.id),
  '11111111-1111-1111-1111-111111111111'::uuid, c.id, c.patient_id, b.bed_id, b.ward_id,
  b.bed_id,   -- the app stores the bed id as the space id (admission.service.ts)
  c.admission_date + INTERVAL '45 minutes', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  '[demo-inpatient]', c.admission_date + INTERVAL '45 minutes', c.admission_date + INTERVAL '45 minutes'
FROM onc_cur c JOIN onc_bed b ON b.bed_id = c.bed_id;

-- Location, acuity, board flags, vitals rhythm and nurse for current inpatients.
UPDATE inpatient_admissions ia SET
  current_ward_id = b.ward_id, current_ward_name = b.ward_name,
  current_space_id = b.bed_id, current_bed_id = b.bed_id, current_bed_number = b.bed_number,
  acuity = (CASE
    WHEN b.ward_code = 'ICU' THEN CASE WHEN pg_temp.h('acu' || ia.id) < 0.45 THEN 'CRITICAL' ELSE 'WATCH' END
    WHEN b.ward_code = 'BMT' OR c.category = 'neutropenia' THEN
      CASE WHEN pg_temp.h('acu' || ia.id) < 0.5 THEN 'WATCH' ELSE 'STABLE' END
    WHEN pg_temp.h('acu' || ia.id) < 0.04 THEN 'CRITICAL'
    WHEN pg_temp.h('acu' || ia.id) < 0.16 THEN 'WATCH'
    ELSE 'STABLE' END)::"InpatientAcuity",
  vitals_frequency = CASE WHEN b.ward_code = 'ICU' THEN 'q1h'
                          WHEN b.ward_code IN ('BMT', 'HEM') OR c.category = 'neutropenia' THEN 'q4h'
                          WHEN b.ward_code = 'PALL' THEN 'q8h' ELSE 'q6h' END,
  primary_nurse_id = n.id,
  isolation_type = CASE WHEN b.ward_code IN ('BMT', 'HEM') OR c.category = 'neutropenia' THEN 'protective' END,
  fall_risk_score = 1 + (pg_temp.h('fall' || ia.id) * 4)::int,
  clinical_alerts = array_remove(ARRAY[
    CASE WHEN b.ward_code IN ('BMT', 'HEM') OR c.category = 'neutropenia' THEN 'isolation' END,
    CASE WHEN pg_temp.h('fall' || ia.id) > 0.7 THEN 'fall_risk' END,
    CASE WHEN c.category = 'surgery' AND pg_temp.h('npo' || ia.id) < 0.35 THEN 'npo' END,
    CASE WHEN pg_temp.h('alg' || ia.id) < 0.18 THEN 'allergies' END,
    CASE WHEN b.ward_code = 'PALL' AND pg_temp.h('dnr' || ia.id) < 0.4 THEN 'dnr' END
  ], NULL),
  board_flags = jsonb_build_object(
    'npo', c.category = 'surgery' AND pg_temp.h('npo' || ia.id) < 0.35,
    'fallRisk', CASE WHEN pg_temp.h('fall' || ia.id) > 0.7 THEN 'high'
                     WHEN pg_temp.h('fall' || ia.id) > 0.4 THEN 'medium' ELSE 'low' END,
    'telemetry', b.ward_code = 'ICU',
    'isolation', b.ward_code IN ('BMT', 'HEM') OR c.category = 'neutropenia',
    'allergies', pg_temp.h('alg' || ia.id) < 0.18,
    'chemoToday', c.category IN ('chemo', 'haem') AND pg_temp.h('ctd' || ia.id) < 0.6
  )
FROM onc_cur c
JOIN onc_bed b ON b.bed_id = c.bed_id
JOIN onc_nurse n ON n.i = abs(hashtext(b.ward_code)) % 4
WHERE ia.id = c.id;

-- Last vitals 0-5 h ago; next due from the frequency, so ~1 in 6 is overdue.
UPDATE inpatient_admissions SET
  last_vitals_at = NOW() - make_interval(mins => (pg_temp.h('vit' || id) * 300)::int),
  next_vitals_at = NOW() - make_interval(mins => (pg_temp.h('vit' || id) * 300)::int)
                   + CASE vitals_frequency WHEN 'q1h' THEN INTERVAL '1 hour' WHEN 'q4h' THEN INTERVAL '4 hours'
                                           WHEN 'q8h' THEN INTERVAL '8 hours' ELSE INTERVAL '6 hours' END
WHERE admission_number LIKE 'DEMO-ADM-%' AND current_bed_id IS NOT NULL
  AND admission_status::text <> 'DISCHARGED';

-- ---------------------------------------------------------------------------
-- Discharges of the last 36 hours: released bed history, and the most recent
-- ones still awaiting housekeeping. They take beds that are free now.
-- ---------------------------------------------------------------------------
WITH recent AS (
  SELECT a.admission_id, a.patient_id, a.admitted_at, a.discharge_at, a.ward_code,
         row_number() OVER (PARTITION BY a.ward_code ORDER BY a.discharge_at DESC) AS k
  FROM onc_adm a
  WHERE a.discharge_at <= NOW() AND a.discharge_at > NOW() - INTERVAL '36 hours'
), free AS (
  SELECT bed_id, ward_id, bed_number, ward_name, ward_code,
         row_number() OVER (PARTITION BY ward_code ORDER BY rk DESC) AS k
  FROM onc_bed WHERE NOT taken
), placed AS (
  SELECT r.*, f.bed_id, f.ward_id, f.bed_number, f.ward_name
  FROM recent r JOIN free f ON f.ward_code = r.ward_code AND f.k = r.k
), hist AS (
  INSERT INTO bed_assignments (
    id, tenant_id, admission_id, patient_id, bed_id, ward_id, space_id,
    assigned_at, released_at, assigned_by, released_by,
    cleaning_required, cleaning_completed_at, cleaning_completed_by,
    notes, created_at, updated_at
  )
  SELECT
    uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-onc-bed-' || p.admission_id),
    '11111111-1111-1111-1111-111111111111'::uuid, p.admission_id, p.patient_id, p.bed_id, p.ward_id, p.bed_id,
    p.admitted_at + INTERVAL '45 minutes', p.discharge_at,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    true,
    CASE WHEN p.discharge_at < NOW() - INTERVAL '3 hours' THEN p.discharge_at + INTERVAL '90 minutes' END,
    CASE WHEN p.discharge_at < NOW() - INTERVAL '3 hours' THEN 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid END,
    '[demo-inpatient]', p.admitted_at + INTERVAL '45 minutes', p.discharge_at
  FROM placed p
  RETURNING admission_id, bed_id
)
UPDATE inpatient_admissions ia SET
  current_space_id = p.bed_id, current_bed_id = p.bed_id, current_bed_number = p.bed_number
FROM placed p WHERE ia.id = p.admission_id;

COMMIT;

-- Summary for the refresh log.
SELECT 'onc admissions' AS what, COUNT(*) FROM inpatient_admissions WHERE admission_number LIKE 'DEMO-ADM-ONC-%'
UNION ALL SELECT 'current inpatients', COUNT(*) FROM inpatient_admissions
  WHERE admission_number LIKE 'DEMO-ADM-%' AND admission_status::text <> 'DISCHARGED'
UNION ALL SELECT 'in a bed', COUNT(*) FROM inpatient_admissions
  WHERE admission_number LIKE 'DEMO-ADM-%' AND admission_status::text <> 'DISCHARGED' AND current_bed_id IS NOT NULL
UNION ALL SELECT 'beds awaiting cleaning', COUNT(*) FROM bed_assignments
  WHERE notes = '[demo-inpatient]' AND released_at IS NOT NULL AND cleaning_completed_at IS NULL;
