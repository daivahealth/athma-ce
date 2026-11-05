-- =============================================================================
-- Demo activity: 13 months of billing for the HealthAI+ dashboard
-- =============================================================================
-- Companion to clinical/27-demo-activity.sql: one invoice per outpatient
-- visit that took place, and one per inpatient stay at discharge, with a
-- realistic payment mix so receivables age across 0–30 / 31–60 / 61–90 / 90+.
--
-- The clinical and RCM databases are separate, so this file re-derives the
-- same patients, visits and admissions from the same deterministic formulas
-- (same hash keys, same uuid_generate_v5 names). Keep the two files in step.
--
-- Header-only invoices (no invoice_lines: those need charges). Rows are
-- recognisable by invoice number `DEMO-INV-`; the file deletes them first.
-- Run it on the same day as the clinical file.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION pg_temp.h(key text) RETURNS double precision
LANGUAGE sql IMMUTABLE AS $$
  SELECT ('x' || substr(md5(key), 1, 8))::bit(32)::bigint / 4294967295.0
$$;

DELETE FROM invoices
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'::uuid
  AND invoice_number LIKE 'DEMO-INV-%';

-- --- Same patients as clinical/27-demo-activity.sql --------------------------
CREATE TEMP TABLE demo_patient ON COMMIT DROP AS
SELECT
  k,
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-patient-' || k) AS id,
  'MRN-DEMO-' || lpad(k::text, 4, '0') AS mrn,
  (ARRAY['Aarav','Diya','Vihaan','Ananya','Arjun','Isha','Kabir','Meera','Rohan','Saanvi',
         'Omar','Fatima','Yusuf','Layla','Hamdan','Noura','Rahul','Priya','Nikhil','Kavya',
         'Aditya','Sneha','Farhan','Zara','Karthik','Lakshmi','Vivek','Pooja','Imran','Aisha'])
    [1 + (k * 7) % 30] || ' ' ||
  (ARRAY['Sharma','Iyer','Nair','Reddy','Khan','Menon','Patel','Gupta','Rao','Pillai',
         'Al Hashimi','Kapoor','Das','Joshi','Kumar','Shetty','Bose','Varma','Hegde','Qureshi'])
    [1 + (k * 11) % 20] AS display_name,
  (CURRENT_DATE - (394 * (1 - sqrt(k / 900.0)))::int)
    + make_interval(hours => 8 + (k % 9), mins => (k * 13) % 60) AS registered_at
FROM generate_series(1, 900) AS k;

UPDATE demo_patient
SET registered_at = registered_at + INTERVAL '1 day'
WHERE EXTRACT(DOW FROM registered_at) = 0 AND registered_at + INTERVAL '1 day' <= NOW();

CREATE TEMP TABLE demo_patient_rank ON COMMIT DROP AS
SELECT row_number() OVER (ORDER BY registered_at, k) AS rn, k, registered_at::date AS registered_on
FROM demo_patient;
CREATE INDEX ON demo_patient_rank (rn);

-- --- Same visits ------------------------------------------------------------
CREATE TEMP TABLE demo_day ON COMMIT DROP AS
SELECT
  d::date AS day,
  greatest(0, round(
    CASE EXTRACT(DOW FROM d)
      WHEN 0 THEN 2 WHEN 1 THEN 30 WHEN 2 THEN 26 WHEN 3 THEN 25
      WHEN 4 THEN 27 WHEN 5 THEN 23 ELSE 11 END
    * (0.82 + 0.18 * (1 - (CURRENT_DATE - d::date) / 395.0))
    * (1 + 0.08 * cos(2 * pi() * (EXTRACT(DOY FROM d) - 220) / 365.0))
    * (0.85 + 0.3 * pg_temp.h('day' || d::date))
  ))::int AS visits,
  (SELECT COUNT(*) FROM demo_patient_rank r WHERE r.registered_on <= d::date) AS registered
FROM generate_series(CURRENT_DATE - 394, CURRENT_DATE, INTERVAL '1 day') AS d;

CREATE TEMP TABLE demo_visit ON COMMIT DROP AS
SELECT
  v.day, v.slot,
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-encounter-' || v.day || '-' || v.slot) AS encounter_id,
  v.day + make_interval(hours => 9 + (v.slot * 20) / 60, mins => (v.slot * 20) % 60) AS starts_at,
  pg_temp.h('outcome' || v.day || v.slot) AS roll,
  (SELECT r.k FROM demo_patient_rank r
    WHERE r.rn = 1 + floor(pg_temp.h('pick' || v.day || '-' || v.slot) * v.registered)) AS patient_k
FROM (
  SELECT d.day, d.registered, s AS slot
  FROM demo_day d, generate_series(0, 40) AS s
  WHERE s < d.visits AND d.registered > 0
) v;
DELETE FROM demo_visit WHERE patient_k IS NULL OR starts_at > NOW() OR roll > 0.90;

-- Outpatient invoices: visit fee, plus lab / imaging when the clinical seed ordered them.
-- Most self-pay visits are settled at the counter; insured ones (~25%) age.
CREATE TEMP TABLE demo_invoice ON COMMIT DROP AS
SELECT
  'DEMO-INV-OP-' || to_char(v.day, 'YYMMDD') || '-' || lpad(v.slot::text, 2, '0') AS number,
  v.encounter_id, v.patient_k, v.day AS invoice_date,
  (CASE WHEN v.roll < 0.65 THEN 900 WHEN v.roll < 0.9 THEN 600 ELSE 3500 END
   + CASE WHEN pg_temp.h('order' || v.encounter_id) < 0.30 THEN 650
          WHEN pg_temp.h('order' || v.encounter_id) < 0.40 THEN 1200 ELSE 0 END)::numeric AS amount,
  pg_temp.h('payer' || v.encounter_id) < 0.25 AS insured,
  pg_temp.h('paid' || v.encounter_id) AS pay_roll
FROM demo_visit v;

-- --- Same admissions; billed at discharge -------------------------------------
INSERT INTO demo_invoice
SELECT
  'DEMO-INV-IP-' || lpad(a.n::text, 3, '0'),
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-adm-enc-' || a.n),
  (SELECT r.k FROM demo_patient_rank r
    WHERE r.rn = 1 + floor(pg_temp.h('adm' || a.n) * (SELECT COUNT(*) FROM demo_patient_rank))),
  (a.admitted_at + make_interval(days => a.stay_days))::date,
  round((18000 * a.stay_days * (0.8 + 0.6 * pg_temp.h('ipamt' || a.n)))::numeric, -2),
  pg_temp.h('ippayer' || a.n) < 0.7,
  pg_temp.h('ippaid' || a.n)
FROM (
  SELECT n,
         (CURRENT_DATE - (394 - (n * 394) / 760))::date + make_interval(hours => 10 + n % 10) AS admitted_at,
         2 + (pg_temp.h('los' || n) * 6)::int AS stay_days
  FROM generate_series(1, 760) AS n
) a
WHERE a.admitted_at + make_interval(days => a.stay_days) <= NOW();

-- Payment: self-pay outpatient almost always paid; insured claims settle
-- more the older they are, leaving a tail past 90 days.
INSERT INTO invoices (
  id, tenant_id, patient_id, encounter_id, mrn, patient_display_name, invoice_number,
  invoice_date, due_date, gross_amount, total_discounts, net_amount, amount_paid, balance_due,
  status, currency, created_at, updated_at
)
SELECT
  uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'demo-invoice-' || i.number),
  '11111111-1111-1111-1111-111111111111'::uuid, p.id, i.encounter_id, p.mrn, p.display_name, i.number,
  i.invoice_date,
  i.invoice_date + CASE WHEN i.insured THEN 30 ELSE 0 END,
  i.amount, 0, i.amount, paid.amount, i.amount - paid.amount,
  CASE WHEN paid.amount >= i.amount THEN 'paid' WHEN paid.amount > 0 THEN 'partial' ELSE 'unpaid' END,
  'INR', i.invoice_date + TIME '18:00', i.invoice_date + TIME '18:00'
FROM demo_invoice i
JOIN demo_patient p ON p.k = i.patient_k
CROSS JOIN LATERAL (
  SELECT CASE
    WHEN NOT i.insured THEN CASE WHEN i.pay_roll < 0.95 THEN i.amount ELSE 0 END
    WHEN CURRENT_DATE - i.invoice_date > 180 THEN
      CASE WHEN i.pay_roll < 0.98 THEN i.amount WHEN i.pay_roll < 0.99 THEN round(i.amount * 0.6, -2) ELSE 0 END
    WHEN CURRENT_DATE - i.invoice_date > 75 THEN
      CASE WHEN i.pay_roll < 0.92 THEN i.amount WHEN i.pay_roll < 0.96 THEN round(i.amount * 0.6, -2) ELSE 0 END
    WHEN CURRENT_DATE - i.invoice_date > 40 THEN
      CASE WHEN i.pay_roll < 0.50 THEN i.amount WHEN i.pay_roll < 0.70 THEN round(i.amount * 0.6, -2) ELSE 0 END
    ELSE CASE WHEN i.pay_roll < 0.15 THEN i.amount ELSE 0 END
  END::numeric AS amount
) paid;

COMMIT;

SELECT status, COUNT(*), SUM(net_amount) AS billed, SUM(balance_due) AS open
FROM invoices
WHERE invoice_number LIKE 'DEMO-INV-%'
GROUP BY status ORDER BY status;
