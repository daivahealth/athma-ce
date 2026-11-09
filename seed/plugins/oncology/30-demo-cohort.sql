-- =============================================================================
-- 30-demo-cohort.sql — a cancer journey for every patient in the demo tenant
-- =============================================================================
-- Opt-in demo seed (not in run-seeds.sh): turns the generated demo population
-- (clinical/27-demo-activity.sql, MRN-DEMO-*) and any other patient without a
-- cancer diagnosis into an oncology cohort that looks like a high-volume Indian
-- tertiary cancer centre: oral cavity / head & neck, breast, cervix, lung,
-- GI (oesophagus, stomach, colorectal, gallbladder, pancreas, liver),
-- gynaecological, genito-urinary, CNS and haemato-lymphoid cancers.
--
-- Per patient it writes, dated relative to CURRENT_DATE:
--   cancer_diagnoses, tumor_staging (clinical, plus pathological after surgery),
--   tumor_board_cases (weekly Wednesday MDT), oncology_care_plans,
--   treatment_plans / treatment_cycles / treatment_days (doses calculated the
--   same way as treatment-schedule.ts), chemo_orders (completed history,
--   today's day-care list, the next few days pending/approved),
--   radiation prescription → simulation → plan → fractions → weekly reviews →
--   completion summary, tumour-marker trends (clinical_observations),
--   cancer_timeline_events, and oncology chief complaints / ICD-10 diagnoses
--   on the patient's existing encounters.
--
-- Registry candidates: 8 demo patients (MRN-DEMO-*, picked by hash from those
-- with an outpatient visit 7-55 days ago) are held back from the cohort and
-- stay unregistered. Each gets one finalised result on that visit, with its
-- clinical_orders row, so the registry candidate queue has work:
--   1 breast core biopsy — invasive ductal carcinoma          → high
--   2 tongue punch biopsy — squamous cell carcinoma           → high
--   3 colonoscopic biopsy — adenocarcinoma                    → high
--   4 mammogram — BI-RADS 5                                   → medium
--   5 low-dose CT chest — Lung-RADS 4B                        → medium
--   6 coded encounter diagnosis C22.0 only (no report)        → high
--   7 PSA 14.2 ng/mL only (tumour marker)                     → low
--   8 gastric biopsy — "negative for dysplasia and malignancy" → must NOT be listed
-- Every run deletes these results, any registry entry made for these
-- patients in a demo, and all registry_candidate_decisions for them, so the
-- queue is back to these 7 patients after each refresh.
--
-- Run it after 27-demo-activity.sql (same day). It is deterministic (hash
-- based) and re-runnable: it removes its own rows (ids derived from
-- 'onco-demo:'), and rows of patients that no longer exist, before writing.
-- Patients that already have a hand-built cancer diagnosis (10-14-*.sql) are
-- left alone.
--
-- Needs: 01-chemo-protocols.sql (protocol library). Adds five protocols used
-- by the cohort if missing: CisRT-Weekly, CROSS, Metronomic-HN, AML-7+3,
-- Stupp-TMZ.
-- =============================================================================

BEGIN;

-- Clock times below ("date + TIME '10:00'") are hospital local time, and
-- "today" is the hospital's today.
SET LOCAL timezone = 'Asia/Kolkata';

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION pg_temp.h(key text) RETURNS double precision
LANGUAGE sql IMMUTABLE AS $$
  SELECT ('x' || substr(md5(key), 1, 8))::bit(32)::bigint / 4294967295.0
$$;

CREATE OR REPLACE FUNCTION pg_temp.u(key text) RETURNS uuid
LANGUAGE sql IMMUTABLE AS $$
  SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'onco-demo:' || key)
$$;

-- Next weekday (Sat/Sun → Mon).
CREATE OR REPLACE FUNCTION pg_temp.wd(d date) RETURNS date
LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE EXTRACT(DOW FROM d) WHEN 6 THEN d + 2 WHEN 0 THEN d + 1 ELSE d END
$$;

-- Protocol → treatment-plan snapshot (phases, lifting a v1 flat regimen into one phase).
CREATE OR REPLACE FUNCTION pg_temp.snapshot(p plugin_oncology.chemo_protocols) RETURNS jsonb
LANGUAGE sql STABLE AS $$
  SELECT jsonb_build_object(
    'id', p.id, 'code', p.code, 'name', p.name,
    'phases', CASE WHEN jsonb_typeof(p.phases) = 'array' AND jsonb_array_length(p.phases) > 0 THEN p.phases
      ELSE jsonb_build_array(jsonb_build_object(
        'id', 'legacy-' || p.code, 'name', 'Main',
        'cycles', COALESCE(NULLIF(p.total_cycles, 0), 1),
        'cycleDurationDays', COALESCE(NULLIF(p.cycle_duration_days, 0), 21),
        'drugs', COALESCE((
          SELECT jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
            'id', 'legacy-' || p.code || '-' || ord,
            'drug', r->>'drug',
            'dose', COALESCE((r->>'dose')::numeric, 0),
            'unit', COALESCE(r->>'unit', 'mg/m²'),
            'route', COALESCE(r->>'route', 'IV'),
            'days', CASE WHEN jsonb_typeof(r->'day') = 'array' THEN r->'day'
                         ELSE jsonb_build_array(COALESCE((r->>'day')::int, 1)) END,
            'doseFormula', COALESCE(r->>'doseFormula', 'bsa'),
            'infusionDurationMin', (r->>'infusionDurationMin')::numeric,
            'diluent', r->>'diluent')) ORDER BY ord)
          FROM jsonb_array_elements(p.regimen) WITH ORDINALITY AS x(r, ord)), '[]'::jsonb)
      )) END,
    'premedications', COALESCE(p.premedications, '[]'::jsonb),
    'supportiveCare', COALESCE(p."supportiveCare", '[]'::jsonb),
    'hydration', COALESCE(p.hydration, '[]'::jsonb),
    'labPrerequisites', COALESCE(p.lab_prerequisites, '[]'::jsonb),
    'emetogenicRisk', p.emetogenic_risk
  )
$$;

-- Drug lines of a phase for one phase-cycle, overrides applied, omitted lines removed.
CREATE OR REPLACE FUNCTION pg_temp.resolved_drugs(phase jsonb, pc int)
RETURNS TABLE (line jsonb, dose numeric, unit text, days int[], note text, inf numeric)
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE l jsonb; o jsonb; v_omit boolean;
BEGIN
  FOR l IN SELECT * FROM jsonb_array_elements(phase->'drugs') LOOP
    line := l; dose := (l->>'dose')::numeric; unit := l->>'unit';
    days := ARRAY(SELECT jsonb_array_elements_text(l->'days')::int);
    note := NULL; inf := (l->>'infusionDurationMin')::numeric; v_omit := false;
    FOR o IN SELECT * FROM jsonb_array_elements(COALESCE(l->'overrides', '[]'::jsonb)) LOOP
      IF NOT (o->'cycles' @> to_jsonb(pc)) THEN CONTINUE; END IF;
      IF o ? 'dose' AND o->>'dose' IS NOT NULL THEN dose := (o->>'dose')::numeric; END IF;
      IF COALESCE(o->>'unit', '') <> '' THEN unit := o->>'unit'; END IF;
      IF jsonb_typeof(o->'days') = 'array' AND jsonb_array_length(o->'days') > 0 THEN
        days := ARRAY(SELECT jsonb_array_elements_text(o->'days')::int);
      END IF;
      IF o ? 'infusionDurationMin' AND o->>'infusionDurationMin' IS NOT NULL THEN inf := (o->>'infusionDurationMin')::numeric; END IF;
      IF o ? 'omit' AND o->>'omit' IS NOT NULL THEN v_omit := (o->>'omit')::boolean; END IF;
      IF COALESCE(o->>'note', '') <> '' THEN note := o->>'note'; END IF;
    END LOOP;
    IF NOT v_omit THEN RETURN NEXT; END IF;
  END LOOP;
END $$;

-- Cycle days that carry at least one drug (treatmentDaysOfCycle).
CREATE OR REPLACE FUNCTION pg_temp.treatment_days(phase jsonb, pc int) RETURNS int[]
LANGUAGE sql IMMUTABLE AS $$
  SELECT COALESCE(array_agg(DISTINCT d ORDER BY d), '{}')
  FROM pg_temp.resolved_drugs(phase, pc) r, unnest(r.days) d
  WHERE d BETWEEN 1 AND (phase->>'cycleDurationDays')::int
$$;

-- Item list for a treatment day (buildDayItems + calculateDose + doseForLevel).
CREATE OR REPLACE FUNCTION pg_temp.day_items(
  snap jsonb, phase_index int, pc int, cycle_day int,
  bsa numeric, wt numeric, crcl numeric, lvl int
) RETURNS jsonb LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  phase jsonb := snap->'phases'->phase_index;
  items jsonb := '[]'::jsonb;
  seq int := 1;
  first_day boolean := (pg_temp.treatment_days(phase, pc))[1] = cycle_day;
  x jsonb; r record;
  lvl_dose numeric; lvl_warn text; v numeric; out_unit text; capped boolean; formula text;
BEGIN
  IF first_day THEN
    FOR x IN SELECT * FROM jsonb_array_elements(snap->'labPrerequisites') LOOP
      items := items || jsonb_build_array(jsonb_build_object(
        'kind', 'lab', 'sequence', seq, 'timing', 'before',
        'label', (x->>'test') || CASE WHEN COALESCE(x->>'parameter', '') <> '' THEN ' — ' || (x->>'parameter') ELSE '' END,
        'detail', concat_ws(' · ',
          CASE WHEN x->>'minValue' IS NOT NULL THEN trim('≥ ' || (x->>'minValue') || ' ' || COALESCE(x->>'unit', '')) END,
          NULLIF(x->>'timing', ''))));
      seq := seq + 1;
    END LOOP;
  END IF;
  FOR x IN SELECT * FROM jsonb_array_elements(snap->'premedications') LOOP
    items := items || jsonb_build_array(jsonb_build_object('kind', 'premed', 'sequence', seq, 'timing', 'pre', 'label', x #>> '{}'));
    seq := seq + 1;
  END LOOP;
  FOR x IN SELECT * FROM jsonb_array_elements(snap->'hydration') WHERE value->>'timing' = 'pre' LOOP
    items := items || jsonb_build_array(jsonb_build_object('kind', 'hydration', 'sequence', seq, 'timing', 'pre',
      'label', x->>'fluid', 'detail', (x->>'ratePerHour') || ' mL/h × ' || (x->>'durationHours') || ' h'));
    seq := seq + 1;
  END LOOP;
  FOR r IN SELECT * FROM pg_temp.resolved_drugs(phase, pc) d WHERE cycle_day = ANY (d.days) LOOP
    lvl_dose := r.dose; lvl_warn := NULL;
    IF lvl <> 0 AND jsonb_array_length(COALESCE(r.line->'doseLevels', '[]'::jsonb)) > 0 THEN
      SELECT (dl->>'dose')::numeric INTO lvl_dose FROM jsonb_array_elements(r.line->'doseLevels') dl WHERE (dl->>'level')::int = lvl;
      IF lvl_dose IS NULL THEN lvl_dose := r.dose; lvl_warn := 'No dose level ' || lvl || ' defined — full dose used'; END IF;
    END IF;
    formula := r.line->>'doseFormula';
    out_unit := CASE WHEN r.unit LIKE 'units%' THEN 'units' ELSE 'mg' END;
    capped := NULL;
    IF formula = 'bsa' THEN v := lvl_dose * bsa;
    ELSIF formula = 'weight' THEN v := lvl_dose * wt;
    ELSIF formula = 'auc' THEN v := lvl_dose * (LEAST(crcl, 125) + 25);
    ELSE v := lvl_dose; out_unit := r.unit;
    END IF;
    IF formula IN ('bsa', 'weight', 'auc') AND (r.line->>'maxDose') IS NOT NULL AND out_unit = 'mg'
       AND v > (r.line->>'maxDose')::numeric THEN
      v := (r.line->>'maxDose')::numeric; capped := true;
    ELSE
      v := CASE WHEN v >= 100 THEN round(v) ELSE round(v, 1) END;
    END IF;
    items := items || jsonb_build_array(jsonb_strip_nulls(jsonb_build_object(
      'kind', 'chemo', 'sequence', seq, 'label', r.line->>'drug', 'drug', r.line->>'drug',
      'protocolDose', r.dose, 'protocolUnit', r.unit, 'doseFormula', formula,
      'doseLevel', lvl, 'levelDose', lvl_dose, 'calculatedDose', v, 'calculatedUnit', out_unit,
      'route', r.line->>'route', 'infusionDurationMin', r.inf, 'diluent', r.line->>'diluent',
      'capped', capped, 'note', r.note, 'warning', lvl_warn)));
    seq := seq + 1;
  END LOOP;
  FOR x IN SELECT * FROM jsonb_array_elements(snap->'hydration') WHERE value->>'timing' <> 'pre' LOOP
    items := items || jsonb_build_array(jsonb_build_object('kind', 'hydration', 'sequence', seq, 'timing', x->>'timing',
      'label', x->>'fluid', 'detail', (x->>'ratePerHour') || ' mL/h × ' || (x->>'durationHours') || ' h'));
    seq := seq + 1;
  END LOOP;
  IF first_day THEN
    FOR x IN SELECT * FROM jsonb_array_elements(snap->'supportiveCare') LOOP
      items := items || jsonb_build_array(jsonb_build_object('kind', 'supportive', 'sequence', seq, 'timing', 'post', 'label', x #>> '{}'));
      seq := seq + 1;
    END LOOP;
  END IF;
  RETURN items;
END $$;

-- ---------------------------------------------------------------------------
-- Protocols used by the cohort that the base library does not have
-- ---------------------------------------------------------------------------
INSERT INTO plugin_oncology.chemo_protocols (
  id, tenant_id, code, name, description, cancer_type, intent, regimen, total_cycles,
  cycle_duration_days, premedications, "supportiveCare", emetogenic_risk, dose_formula,
  lab_prerequisites, hydration, phases, is_active, created_at, updated_at
)
SELECT pg_temp.u('protocol:' || v.code), '11111111-1111-1111-1111-111111111111'::uuid, v.code, v.name, v.description,
  v.cancer_type, v.intent,
  (SELECT jsonb_agg(jsonb_strip_nulls(jsonb_build_object('drug', d->>'drug', 'dose', (d->>'dose')::numeric, 'unit', d->>'unit',
      'route', d->>'route', 'day', d->'days', 'doseFormula', d->>'doseFormula', 'phase', ph->>'name',
      'infusionDurationMin', (d->>'infusionDurationMin')::numeric, 'diluent', d->>'diluent')))
   FROM jsonb_array_elements(v.phases) ph, jsonb_array_elements(ph->'drugs') d),
  (SELECT SUM((ph->>'cycles')::int) FROM jsonb_array_elements(v.phases) ph),
  (v.phases->0->>'cycleDurationDays')::int,
  v.premeds, v.supportive, v.emeto, 'bsa', v.labs, v.hydration, v.phases, true, NOW(), NOW()
FROM (VALUES
  ('CisRT-Weekly', 'Weekly Cisplatin with Radiotherapy (Cervix / Head & Neck)',
   'Cisplatin 40 mg/m² weekly (max 70 mg) during external beam radiotherapy.',
   'Cervical Cancer', 'curative',
   '[{"id":"cisw-ph","name":"Concurrent chemoradiation","cycles":6,"cycleDurationDays":7,"drugs":[{"id":"cisw-cis","drug":"Cisplatin","dose":40,"unit":"mg/m²","route":"IV","days":[1],"doseFormula":"bsa","maxDose":70,"infusionDurationMin":60,"diluent":"NS 500 mL","doseLevels":[{"level":-1,"dose":30}]}]}]'::jsonb,
   '["Ondansetron 8 mg IV 30 min before","Dexamethasone 8 mg IV 30 min before"]'::jsonb,
   '["Weekly CBC and serum creatinine during radiotherapy","Oral hydration 2-3 L/day"]'::jsonb, 'high',
   '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Renal function","parameter":"CrCl","minValue":50,"unit":"mL/min","timing":"within 48h before each cycle"}]'::jsonb,
   '[{"fluid":"Normal saline 1000 mL + KCl 20 mEq + MgSO4 2 g","timing":"pre","ratePerHour":500,"durationHours":2},{"fluid":"Normal saline 500 mL","timing":"post","ratePerHour":250,"durationHours":2}]'::jsonb),
  ('CROSS', 'CROSS — Weekly Carboplatin + Paclitaxel with RT (Oesophagus)',
   'Neoadjuvant chemoradiation: carboplatin AUC 2 + paclitaxel 50 mg/m² weekly × 5 with 41.4 Gy in 23 fractions.',
   'Esophageal Cancer', 'neoadjuvant',
   '[{"id":"cross-ph","name":"Neoadjuvant CRT","cycles":5,"cycleDurationDays":7,"drugs":[{"id":"cross-pac","drug":"Paclitaxel","dose":50,"unit":"mg/m²","route":"IV","days":[1],"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 250 mL"},{"id":"cross-carbo","drug":"Carboplatin","dose":2,"unit":"AUC","route":"IV","days":[1],"doseFormula":"auc","infusionDurationMin":30,"diluent":"D5W 250 mL"}]}]'::jsonb,
   '["Dexamethasone 8 mg IV 30 min before","Pheniramine 22.75 mg IV before paclitaxel","Ranitidine 50 mg IV before paclitaxel","Ondansetron 8 mg IV 30 min before"]'::jsonb,
   '["Nutrition review weekly; consider feeding jejunostomy if weight loss > 10%"]'::jsonb, 'moderate',
   '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"CBC","parameter":"Platelets","minValue":100000,"unit":"/mm³","timing":"within 48h before each cycle"}]'::jsonb,
   '[]'::jsonb),
  ('Metronomic-HN', 'Oral Metronomic Methotrexate + Celecoxib (Head & Neck)',
   'Low-cost palliative oral metronomic therapy: methotrexate 15 mg/m² weekly with celecoxib 200 mg twice daily.',
   'Head & Neck Squamous Cell Carcinoma (HNSCC)', 'palliative',
   '[{"id":"metro-ph","name":"Metronomic","cycles":6,"cycleDurationDays":28,"drugs":[{"id":"metro-mtx","drug":"Methotrexate","dose":15,"unit":"mg/m²","route":"PO","days":[1,8,15,22],"doseFormula":"bsa"},{"id":"metro-cel","drug":"Celecoxib","dose":200,"unit":"mg","route":"PO","days":[1,8,15,22],"doseFormula":"fixed","note":"200 mg twice daily — dispensed weekly"}]}]'::jsonb,
   '[]'::jsonb, '["Folic acid 5 mg PO weekly (day after methotrexate)","Monthly CBC, LFT and creatinine"]'::jsonb, 'minimal',
   '[{"test":"CBC","parameter":"Platelets","minValue":75000,"unit":"/mm³","timing":"within 7d before each cycle"}]'::jsonb,
   '[]'::jsonb),
  ('AML-7+3', '7+3 Induction then HiDAC Consolidation (AML)',
   'Cytarabine 100 mg/m²/day continuous infusion days 1-7 + daunorubicin 60 mg/m² days 1-3, then high-dose cytarabine consolidation × 3.',
   'Acute Myeloid Leukemia (AML)', 'curative',
   '[{"id":"aml-ind","name":"Induction (7+3)","cycles":1,"cycleDurationDays":28,"drugs":[{"id":"aml-ara","drug":"Cytarabine","dose":100,"unit":"mg/m²","route":"IV","days":[1,2,3,4,5,6,7],"doseFormula":"bsa","infusionDurationMin":1440,"diluent":"NS 1000 mL"},{"id":"aml-dauno","drug":"Daunorubicin","dose":60,"unit":"mg/m²","route":"IV","days":[1,2,3],"doseFormula":"bsa","infusionDurationMin":30}]},{"id":"aml-cons","name":"Consolidation (HiDAC)","cycles":3,"cycleDurationDays":28,"drugs":[{"id":"aml-hidac","drug":"Cytarabine (high dose)","dose":3000,"unit":"mg/m²","route":"IV","days":[1,3,5],"doseFormula":"bsa","infusionDurationMin":180,"note":"Every 12 h on days 1, 3 and 5","doseLevels":[{"level":-1,"dose":1500}]}]}]'::jsonb,
   '["Ondansetron 8 mg IV 30 min before","Allopurinol 300 mg PO daily (induction)"]'::jsonb,
   '["Antifungal prophylaxis (posaconazole)","Prednisolone eye drops during HiDAC","Transfusion support to Hb > 8 g/dL, platelets > 10,000"]'::jsonb, 'moderate',
   '[{"test":"CBC with differential","parameter":"ANC","minValue":1000,"unit":"/mm³","timing":"before each consolidation"},{"test":"ECHO","parameter":"LVEF","minValue":50,"unit":"%","timing":"before induction"}]'::jsonb,
   '[]'::jsonb),
  ('Stupp-TMZ', 'Stupp Protocol — Temozolomide with RT then Adjuvant (GBM)',
   'Temozolomide 75 mg/m² daily with 60 Gy / 30 fractions, then 150-200 mg/m² days 1-5 every 28 days × 6.',
   'Glioblastoma Multiforme (GBM)', 'adjuvant',
   '[{"id":"stupp-con","name":"Concurrent (with RT)","cycles":1,"cycleDurationDays":42,"drugs":[{"id":"stupp-tmz-c","drug":"Temozolomide","dose":75,"unit":"mg/m²","route":"PO","days":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42],"doseFormula":"bsa"}]},{"id":"stupp-adj","name":"Adjuvant","cycles":6,"cycleDurationDays":28,"drugs":[{"id":"stupp-tmz-a","drug":"Temozolomide","dose":150,"unit":"mg/m²","route":"PO","days":[1,2,3,4,5],"doseFormula":"bsa","doseLevels":[{"level":-1,"dose":100}],"overrides":[{"cycles":[2,3,4,5,6],"dose":200,"note":"Escalated to 200 mg/m² if cycle 1 tolerated"}]}]}]'::jsonb,
   '["Ondansetron 8 mg PO 1 h before temozolomide"]'::jsonb,
   '["PCP prophylaxis: co-trimoxazole during concurrent phase","Levetiracetam 500 mg BID (seizure prophylaxis)"]'::jsonb, 'moderate',
   '[{"test":"CBC","parameter":"Platelets","minValue":100000,"unit":"/mm³","timing":"within 7d before each cycle"},{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 7d before each cycle"}]'::jsonb,
   '[]'::jsonb)
) AS v(code, name, description, cancer_type, intent, phases, premeds, supportive, emeto, labs, hydration)
ON CONFLICT (tenant_id, code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Cancer templates (weights roughly follow the case mix of an Indian tertiary
-- cancer centre: oral cavity leads in men, breast and cervix in women).
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE onc_type (
  ord int, key text, w_m numeric, w_f numeric, age_min int, age_max int,
  cancer_type text, sites jsonb, lat boolean, histology text, morph text, grades text[], snomed text, icd text,
  marker jsonb, biomarkers jsonb, proto_cur text, proto_pal text, surgery text, rt jsonb, rt_pal jsonb,
  subsp text, stg_sys text, stg_ed text, symptom text, workup text, imaging text, risk text,
  hormonal text, targeted text, rt_tox text
) ON COMMIT DROP;

INSERT INTO onc_type VALUES
(1,'ORAL',20,6,25,85,'Head & Neck Squamous Cell Carcinoma (HNSCC)',
 '[{"s":"Buccal mucosa","c":"C06.0"},{"s":"Oral tongue","c":"C02.1"},{"s":"Lower alveolus","c":"C03.1"},{"s":"Gingivobuccal sulcus","c":"C06.1"},{"s":"Retromolar trigone","c":"C06.2"}]',
 true,'Squamous cell carcinoma, keratinizing','8071/3','{G1,G2,G2,G3}','363505006',NULL,NULL,
 '[{"p16":"negative","PD-L1 CPS":"<1"},{"p16":"negative","PD-L1 CPS":"10"},{"p16":"negative","PD-L1 CPS":"25"}]',
 'CisRT-Weekly','Metronomic-HN','Wide local excision with segmental mandibulectomy and modified radical neck dissection',
 '{"dose":60,"fx":30,"site":"Oral cavity primary and bilateral neck","tech":"IMRT","pos":"Supine, 5-point thermoplastic head and neck mask","region":"Head and neck"}',
 '{"dose":20,"fx":5,"site":"Primary and neck nodes (palliative)","tech":"3DCRT","pos":"Supine, thermoplastic mask","region":"Head and neck"}',
 'surgical_oncology','AJCC','8th','Non-healing ulcer in the mouth for 3 months with difficulty opening the mouth',
 'Punch biopsy of oral lesion','CECT face and neck, chest X-ray','Chews tobacco (gutka/kharra) for 15+ years',NULL,NULL,'Oral mucositis'),
(2,'LARYNX',7,1,40,85,'Head & Neck Squamous Cell Carcinoma (HNSCC)',
 '[{"s":"Glottic larynx","c":"C32.0"},{"s":"Supraglottic larynx","c":"C32.1"},{"s":"Pyriform sinus","c":"C12"}]',
 false,'Squamous cell carcinoma','8070/3','{G1,G2,G3}','363505006',NULL,NULL,
 '[{"p16":"negative","PD-L1 CPS":"5"},{"p16":"negative","PD-L1 CPS":"<1"}]',
 'Cis-RT-HN','Metronomic-HN','Total laryngectomy with bilateral neck dissection',
 '{"dose":70,"fx":35,"site":"Larynx and bilateral neck","tech":"IMRT","pos":"Supine, 5-point thermoplastic head and neck mask","region":"Head and neck"}',NULL,
 'radiation_oncology','AJCC','8th','Hoarseness of voice for 2 months with pain on swallowing',
 'Direct laryngoscopy and biopsy','CECT neck and chest','Smoker (bidi), 30 pack-years',NULL,NULL,'Mucositis and dysphagia'),
(3,'ESOPH',6,4,35,85,'Esophageal Cancer',
 '[{"s":"Middle thoracic esophagus","c":"C15.4"},{"s":"Lower thoracic esophagus","c":"C15.5"}]',
 false,'Squamous cell carcinoma','8070/3','{G2,G2,G3}','372138000',NULL,NULL,
 '[{"PD-L1 CPS":"5"},{"PD-L1 CPS":"<1"},{"PD-L1 CPS":"12"}]',
 'CROSS','Carbo-Pac','Minimally invasive oesophagectomy (McKeown) with two-field lymphadenectomy',
 '{"dose":41.4,"fx":23,"site":"Oesophageal primary and peri-oesophageal nodes","tech":"VMAT","pos":"Supine, arms up on wing board","region":"Thorax"}',
 '{"dose":30,"fx":10,"site":"Oesophagus (palliative, for dysphagia)","tech":"3DCRT","pos":"Supine, arms up","region":"Thorax"}',
 'surgical_oncology','AJCC','8th','Progressive difficulty swallowing solids for 2 months with 6 kg weight loss',
 'Upper GI endoscopy and biopsy','PET-CT','Smoker and alcohol use',NULL,NULL,'Oesophagitis'),
(4,'GASTRIC',5,2,35,85,'Gastric Cancer',
 '[{"s":"Gastric antrum","c":"C16.3"},{"s":"Body of stomach","c":"C16.2"},{"s":"Cardia","c":"C16.0"}]',
 false,'Adenocarcinoma, intestinal type','8144/3','{G2,G3,G3}','363349007',NULL,
 '{"code":"83085-1","name":"Carcinoembryonic Antigen (CEA)","unit":"ng/mL","hi":5}',
 '[{"HER2":"negative","MSI":"MSS","PD-L1 CPS":"5"},{"HER2":"positive (3+)","MSI":"MSS"},{"HER2":"negative","MSI":"MSI-H"}]',
 'FLOT','CAPOX','D2 subtotal gastrectomy',NULL,NULL,
 'surgical_oncology','AJCC','8th','Epigastric pain, early satiety and black stools for 6 weeks',
 'Upper GI endoscopy and biopsy','CECT chest/abdomen and staging laparoscopy',NULL,NULL,NULL,NULL),
(5,'CRC',6,4,30,85,'Colorectal Cancer (CRC)',
 '[{"s":"Sigmoid colon","c":"C18.7"},{"s":"Ascending colon","c":"C18.2"},{"s":"Transverse colon","c":"C18.4"}]',
 false,'Adenocarcinoma','8140/3','{G1,G2,G2,G3}','363406005',NULL,
 '{"code":"83085-1","name":"Carcinoembryonic Antigen (CEA)","unit":"ng/mL","hi":5}',
 '[{"KRAS":"wild-type","NRAS":"wild-type","BRAF":"wild-type","MSI":"MSS"},{"KRAS":"G12D mutated","NRAS":"wild-type","MSI":"MSS"},{"KRAS":"wild-type","BRAF":"V600E","MSI":"MSI-H"}]',
 'CAPOX','FOLFOX','Laparoscopic oncological colectomy with D3 lymphadenectomy',NULL,NULL,
 'surgical_oncology','AJCC','8th','Altered bowel habits and blood in stool for 2 months',
 'Colonoscopy and biopsy','CECT chest, abdomen and pelvis',NULL,NULL,NULL,NULL),
(6,'RECTUM',4,2,30,85,'Rectal Cancer',
 '[{"s":"Rectum","c":"C20"}]',
 false,'Adenocarcinoma','8140/3','{G2,G2,G3}','363351006',NULL,
 '{"code":"83085-1","name":"Carcinoembryonic Antigen (CEA)","unit":"ng/mL","hi":5}',
 '[{"KRAS":"wild-type","MSI":"MSS"},{"KRAS":"G12V mutated","MSI":"MSS"}]',
 'CAPOX','FOLFIRI','Laparoscopic low anterior resection (total mesorectal excision)',
 '{"dose":25,"fx":5,"site":"Pelvis (rectum and mesorectum), short course","tech":"VMAT","pos":"Prone on belly board","region":"Pelvis"}',NULL,
 'surgical_oncology','AJCC','8th','Bleeding per rectum and tenesmus for 3 months',
 'Colonoscopy and biopsy','MRI pelvis and CECT chest/abdomen',NULL,NULL,NULL,'Proctitis and diarrhoea'),
(7,'HCC',3,1,40,85,'Hepatocellular Carcinoma (HCC)',
 '[{"s":"Liver","c":"C22.0"}]',
 false,'Hepatocellular carcinoma','8170/3','{G2,G3}','109841003','C22.0',
 '{"code":"83073-7","name":"Alpha-Fetoprotein (AFP)","unit":"ng/mL","hi":10}',
 '[{"Etiology":"Hepatitis B","Child-Pugh":"A5"},{"Etiology":"NASH","Child-Pugh":"A6"},{"Etiology":"Alcohol","Child-Pugh":"B7"}]',
 'GEMOX-HCC','GEMOX-HCC','Right hepatectomy',NULL,NULL,
 'medical_oncology','AJCC','8th','Right upper abdominal pain and loss of appetite',
 'Triple-phase CT liver with core biopsy','Triple-phase CECT abdomen, CT chest',NULL,NULL,NULL,NULL),
(8,'GB',1,4,35,85,'Gallbladder Cancer',
 '[{"s":"Gallbladder","c":"C23"}]',
 false,'Adenocarcinoma','8140/3','{G2,G3}','363355002',NULL,
 '{"code":"83084-4","name":"Cancer Antigen 19-9 (CA 19-9)","unit":"U/mL","hi":37}',
 '[{"HER2":"negative"},{"HER2":"positive (3+)"}]',
 'GEMOX-HCC','GEMOX-HCC','Radical (extended) cholecystectomy with segment IVb/V resection',NULL,NULL,
 'surgical_oncology','AJCC','8th','Right upper abdominal pain, jaundice and weight loss',
 'Image-guided biopsy of gallbladder mass','CECT abdomen and MRCP',NULL,NULL,NULL,NULL),
(9,'PANC',2,1,40,85,'Pancreatic Cancer',
 '[{"s":"Head of pancreas","c":"C25.0"}]',
 false,'Ductal adenocarcinoma','8500/3','{G2,G3}','363418001',NULL,
 '{"code":"83084-4","name":"Cancer Antigen 19-9 (CA 19-9)","unit":"U/mL","hi":37}',
 '[{"BRCA1/2":"wild-type","KRAS":"G12D"},{"BRCA2":"pathogenic variant","KRAS":"G12V"}]',
 'FOLFIRINOX','GemNab-Pancreas','Pancreaticoduodenectomy (Whipple procedure)',NULL,NULL,
 'medical_oncology','AJCC','8th','Painless progressive jaundice with itching and weight loss',
 'EUS-guided FNA','Pancreas-protocol CECT',NULL,NULL,NULL,NULL),
(10,'LUNGAD',6,4,35,85,'NSCLC – Adenocarcinoma',
 '[{"s":"Upper lobe, lung","c":"C34.1"},{"s":"Lower lobe, lung","c":"C34.3"}]',
 true,'Adenocarcinoma','8140/3','{G2,G3}','254637007',NULL,
 '{"code":"83085-1","name":"Carcinoembryonic Antigen (CEA)","unit":"ng/mL","hi":5}',
 '[{"EGFR":"exon 19 deletion","ALK":"negative","PD-L1 TPS":"10%"},{"EGFR":"wild-type","ALK":"negative","PD-L1 TPS":"60%"},{"EGFR":"L858R","ALK":"negative","PD-L1 TPS":"<1%"},{"EGFR":"wild-type","ALK":"rearranged","PD-L1 TPS":"5%"},{"EGFR":"wild-type","ALK":"negative","PD-L1 TPS":"30%"}]',
 'Cis-Pem','Cis-Pem','VATS lobectomy with mediastinal lymph node dissection',
 '{"dose":60,"fx":30,"site":"Lung primary and involved mediastinal nodes","tech":"VMAT","pos":"Supine, arms up on wing board","region":"Thorax"}',
 '{"dose":20,"fx":5,"site":"Painful bone metastasis","tech":"3DCRT","pos":"Supine","region":"Spine"}',
 'medical_oncology','AJCC','8th','Cough for 2 months with breathlessness and weight loss',
 'CT-guided core biopsy of lung mass','PET-CT and MRI brain','Never-smoker; cooking fuel exposure',NULL,NULL,'Oesophagitis'),
(11,'LUNGSQ',4,1,40,85,'NSCLC – Squamous Cell Carcinoma',
 '[{"s":"Upper lobe, lung","c":"C34.1"},{"s":"Main bronchus","c":"C34.0"}]',
 true,'Squamous cell carcinoma','8070/3','{G2,G3}','254634000',NULL,
 '{"code":"83085-1","name":"Carcinoembryonic Antigen (CEA)","unit":"ng/mL","hi":5}',
 '[{"PD-L1 TPS":"55%"},{"PD-L1 TPS":"5%"},{"PD-L1 TPS":"<1%"}]',
 'Carbo-Pac','Carbo-Pac','Right upper lobectomy with mediastinal lymph node dissection',
 '{"dose":60,"fx":30,"site":"Lung primary and involved mediastinal nodes","tech":"VMAT","pos":"Supine, arms up on wing board","region":"Thorax"}',NULL,
 'medical_oncology','AJCC','8th','Cough with blood-streaked sputum and chest pain',
 'Bronchoscopy and biopsy','PET-CT and MRI brain','Smoker, 35 pack-years',NULL,NULL,'Oesophagitis'),
(12,'SCLC',2,0.5,40,85,'Small Cell Lung Cancer (SCLC)',
 '[{"s":"Upper lobe, lung","c":"C34.1"},{"s":"Main bronchus","c":"C34.0"}]',
 true,'Small cell carcinoma','8041/3','{G4}','254632001',NULL,
 '{"code":"14804-9","name":"Lactate Dehydrogenase (LDH)","unit":"U/L","hi":250}',
 '[{"Ki-67":"90%","Synaptophysin":"positive"}]',
 'EP-SCLC','EP-SCLC',NULL,
 '{"dose":60,"fx":30,"site":"Primary and mediastinum","tech":"VMAT","pos":"Supine, arms up","region":"Thorax"}',NULL,
 'medical_oncology','AJCC','8th','Breathlessness, facial puffiness and weight loss',
 'Bronchoscopy and EBUS-guided biopsy','PET-CT and MRI brain','Smoker, 40 pack-years',NULL,NULL,'Oesophagitis'),
(13,'BRHR',0,14,28,85,'Breast Cancer – HR+/HER2-',
 '[{"s":"Upper-outer quadrant of breast","c":"C50.4"},{"s":"Upper-inner quadrant of breast","c":"C50.2"},{"s":"Central portion of breast","c":"C50.1"},{"s":"Lower-outer quadrant of breast","c":"C50.5"}]',
 true,'Infiltrating duct carcinoma, NOS','8500/3','{G1,G2,G2}','254838004',NULL,
 '{"code":"6875-9","name":"Cancer Antigen 15-3 (CA 15-3)","unit":"U/mL","hi":30}',
 '[{"ER":"positive (90%)","PR":"positive (70%)","HER2":"negative (1+)","Ki-67":"15%"},{"ER":"positive (80%)","PR":"positive (40%)","HER2":"negative (2+, FISH not amplified)","Ki-67":"25%"}]',
 'AC-T','Capecitabine-Breast','Breast-conserving surgery with sentinel lymph node biopsy',
 '{"dose":40.05,"fx":15,"site":"Whole breast / chest wall with supraclavicular fossa","tech":"IMRT","pos":"Supine on breast board, arms up","region":"Breast"}',
 '{"dose":20,"fx":5,"site":"Painful bone metastasis","tech":"3DCRT","pos":"Supine","region":"Spine"}',
 'surgical_oncology','AJCC','8th','Painless lump in the breast for 2 months',
 'Mammography, USG and core needle biopsy','PET-CT',NULL,'Letrozole 2.5 mg PO daily (5 years)',NULL,'Radiation dermatitis'),
(14,'BRHER2',0,6,28,80,'Breast Cancer – HER2+',
 '[{"s":"Upper-outer quadrant of breast","c":"C50.4"},{"s":"Central portion of breast","c":"C50.1"},{"s":"Upper-inner quadrant of breast","c":"C50.2"}]',
 true,'Infiltrating duct carcinoma, NOS','8500/3','{G3}','254838004',NULL,
 '{"code":"6875-9","name":"Cancer Antigen 15-3 (CA 15-3)","unit":"U/mL","hi":30}',
 '[{"ER":"negative","PR":"negative","HER2":"positive (3+)","Ki-67":"40%"},{"ER":"positive (60%)","PR":"negative","HER2":"positive (3+)","Ki-67":"35%"}]',
 'TCH','TCH','Modified radical mastectomy',
 '{"dose":40.05,"fx":15,"site":"Chest wall with supraclavicular fossa","tech":"IMRT","pos":"Supine on breast board, arms up","region":"Breast"}',NULL,
 'medical_oncology','AJCC','8th','Hard lump in the breast with skin puckering for 3 months',
 'Mammography, USG and core needle biopsy','PET-CT and ECHO',NULL,NULL,'Trastuzumab 3-weekly to complete 1 year','Radiation dermatitis'),
(15,'BRTN',0,6,25,75,'Breast Cancer – Triple Negative',
 '[{"s":"Upper-outer quadrant of breast","c":"C50.4"},{"s":"Lower-inner quadrant of breast","c":"C50.3"},{"s":"Central portion of breast","c":"C50.1"}]',
 true,'Infiltrating duct carcinoma, NOS','8500/3','{G3}','254838004',NULL,
 '{"code":"6875-9","name":"Cancer Antigen 15-3 (CA 15-3)","unit":"U/mL","hi":30}',
 '[{"ER":"negative","PR":"negative","HER2":"negative (0)","Ki-67":"70%","BRCA1":"not detected"},{"ER":"negative","PR":"negative","HER2":"negative (1+)","Ki-67":"60%","BRCA1":"pathogenic variant"}]',
 'AC-T','Capecitabine-Breast','Modified radical mastectomy',
 '{"dose":40.05,"fx":15,"site":"Chest wall with supraclavicular fossa","tech":"IMRT","pos":"Supine on breast board, arms up","region":"Breast"}',NULL,
 'medical_oncology','AJCC','8th','Rapidly growing lump in the breast for 6 weeks',
 'Mammography, USG and core needle biopsy','PET-CT',NULL,NULL,NULL,'Radiation dermatitis'),
(16,'CERVIX',0,14,28,85,'Cervical Cancer',
 '[{"s":"Cervix uteri","c":"C53.9"}]',
 false,'Squamous cell carcinoma, large cell non-keratinizing','8072/3','{G2,G2,G3}','363354003',NULL,NULL,
 '[{"HPV":"positive (HPV-16)","PD-L1 CPS":"≥1"},{"HPV":"positive (HPV-18)","PD-L1 CPS":"≥1"},{"HPV":"positive (HPV-16)","PD-L1 CPS":"<1"}]',
 'CisRT-Weekly','Carbo-Pac','Type C radical hysterectomy with bilateral pelvic lymphadenectomy',
 '{"dose":50,"fx":25,"site":"Whole pelvis EBRT, followed by HDR brachytherapy 7 Gy × 4","tech":"IMRT","pos":"Supine, knee and foot rest, full bladder","region":"Pelvis"}',NULL,
 'radiation_oncology','FIGO','2018','Post-coital bleeding and foul-smelling vaginal discharge for 3 months',
 'Per-speculum examination and cervical punch biopsy','MRI pelvis and CECT abdomen',NULL,NULL,NULL,'Diarrhoea and cystitis'),
(17,'OVARY',0,7,30,85,'Ovarian Cancer',
 '[{"s":"Ovary","c":"C56.9"}]',
 false,'Serous carcinoma, high grade','8461/3','{"High grade"}','363443007',NULL,
 '{"code":"83082-8","name":"Cancer Antigen 125 (CA-125)","unit":"U/mL","hi":35}',
 '[{"BRCA1":"pathogenic variant","HRD":"positive"},{"BRCA1/2":"wild-type","HRD":"negative"},{"BRCA2":"pathogenic variant","HRD":"positive"}]',
 'Carbo-Tax-Ovary','Carbo-Tax-Ovary','Interval cytoreductive surgery (total hysterectomy, bilateral salpingo-oophorectomy, omentectomy)',NULL,NULL,
 'medical_oncology','FIGO','2014','Abdominal distension and bloating for 2 months',
 'Image-guided biopsy of omental deposit with ascitic fluid cytology','CECT chest, abdomen and pelvis',NULL,NULL,NULL,NULL),
(18,'ENDOMET',0,5,45,85,'Endometrial / Uterine Cancer',
 '[{"s":"Endometrium","c":"C54.1"}]',
 false,'Endometrioid adenocarcinoma','8380/3','{G1,G2,G3}','254878006',NULL,
 '{"code":"83082-8","name":"Cancer Antigen 125 (CA-125)","unit":"U/mL","hi":35}',
 '[{"MMR":"proficient","p53":"wild-type"},{"MMR":"deficient (MLH1/PMS2 loss)","p53":"wild-type"}]',
 'Carbo-Pac','Carbo-Pac','Total laparoscopic hysterectomy with bilateral salpingo-oophorectomy and sentinel node mapping',
 '{"dose":45,"fx":25,"site":"Pelvis","tech":"IMRT","pos":"Supine, full bladder","region":"Pelvis"}',NULL,
 'surgical_oncology','FIGO','2009','Post-menopausal bleeding for 1 month',
 'Endometrial biopsy','MRI pelvis',NULL,NULL,NULL,'Diarrhoea'),
(19,'THYROID',1,3,20,75,'Thyroid Cancer',
 '[{"s":"Thyroid gland","c":"C73"}]',
 false,'Papillary carcinoma','8260/3','{"Well differentiated"}','363478007',NULL,
 '{"code":"3013-0","name":"Thyroglobulin","unit":"ng/mL","hi":40}',
 '[{"BRAF V600E":"positive","TERT promoter":"wild-type"},{"BRAF V600E":"negative"}]',
 NULL,NULL,'Total thyroidectomy with central compartment neck dissection',NULL,NULL,
 'surgical_oncology','AJCC','8th','Painless swelling in front of the neck for 4 months',
 'USG-guided FNAC (Bethesda VI)','USG neck and CECT neck',NULL,'Levothyroxine TSH suppression; radioactive iodine (I-131) ablation',NULL,NULL),
(20,'PROSTATE',8,0,50,90,'Prostate Cancer',
 '[{"s":"Prostate gland","c":"C61"}]',
 false,'Acinar adenocarcinoma','8140/3','{"ISUP Grade Group 2","ISUP Grade Group 3","ISUP Grade Group 4"}','399068003',NULL,
 '{"code":"83112-3","name":"Prostate Specific Antigen (PSA), Total","unit":"ng/mL","hi":4}',
 '[{"Gleason":"3+4=7"},{"Gleason":"4+3=7"},{"Gleason":"4+4=8"}]',
 NULL,'Docetaxel-PCa',NULL,
 '{"dose":60,"fx":20,"site":"Prostate and seminal vesicles","tech":"VMAT","pos":"Supine, knee rest, full bladder / empty rectum","region":"Pelvis"}',NULL,
 'radiation_oncology','AJCC','8th','Poor urinary stream and nocturia; raised PSA',
 'MRI-targeted prostate biopsy','PSMA PET-CT',NULL,'ADT: Leuprolide 22.5 mg depot every 3 months',NULL,'Cystitis and proctitis'),
(21,'BLADDER',2,0.5,45,85,'Bladder Cancer',
 '[{"s":"Urinary bladder","c":"C67.9"}]',
 false,'Urothelial carcinoma','8120/3','{"High grade"}','399326009',NULL,NULL,
 '[{"PD-L1":"positive (CPS ≥ 10)"},{"FGFR3":"altered"}]',
 'GemCis-Bladder','GemCarbo-Bladder','Radical cystectomy with ileal conduit',NULL,NULL,
 'surgical_oncology','AJCC','8th','Painless blood in urine for 1 month',
 'Cystoscopy and TURBT','CECT urography and CT chest','Smoker',NULL,NULL,NULL),
(22,'DLBCL',2.5,2,20,85,'Diffuse Large B-Cell Lymphoma (DLBCL)',
 '[{"s":"Lymph nodes of multiple regions","c":"C77.8"}]',
 false,'Diffuse large B-cell lymphoma, NOS','9680/3','{"High grade"}','109969005','C83.3',
 '{"code":"14804-9","name":"Lactate Dehydrogenase (LDH)","unit":"U/L","hi":250}',
 '[{"CD20":"positive","Cell of origin":"GCB","Ki-67":"80%","MYC/BCL2":"not rearranged"},{"CD20":"positive","Cell of origin":"non-GCB","Ki-67":"90%","MYC/BCL2":"not rearranged"}]',
 'R-CHOP','R-CHOP',NULL,
 '{"dose":30,"fx":15,"site":"Involved site (bulky disease)","tech":"IMRT","pos":"Supine","region":"Neck / mediastinum"}',NULL,
 'hemato_oncology','Ann Arbor (Lugano)',NULL,'Painless enlarging neck swelling with fever and night sweats',
 'Excision biopsy of cervical lymph node with IHC','PET-CT and bone marrow biopsy',NULL,NULL,NULL,'Mucositis'),
(23,'HODGKIN',2,1,18,45,'Hodgkin Lymphoma',
 '[{"s":"Lymph nodes of multiple regions","c":"C77.8"}]',
 false,'Classical Hodgkin lymphoma, nodular sclerosis','9663/3','{"Not applicable"}','118599009','C81.1',
 '{"code":"14804-9","name":"Lactate Dehydrogenase (LDH)","unit":"U/L","hi":250}',
 '[{"CD30":"positive","CD15":"positive","CD20":"negative","EBER":"negative"}]',
 'ABVD','ABVD',NULL,
 '{"dose":30,"fx":15,"site":"Involved site (mediastinum)","tech":"IMRT","pos":"Supine, arms by side","region":"Mediastinum"}',NULL,
 'hemato_oncology','Ann Arbor (Lugano)',NULL,'Neck swelling with intermittent fever and itching',
 'Excision biopsy of cervical lymph node with IHC','PET-CT',NULL,NULL,NULL,'Oesophagitis'),
(24,'MYELOMA',3,2,45,85,'Multiple Myeloma',
 '[{"s":"Bone marrow","c":"C42.1"}]',
 false,'Plasma cell myeloma','9732/3','{"Not applicable"}','109989006','C90.0',
 '{"code":"1952-1","name":"Beta-2 microglobulin","unit":"mg/L","hi":2.4}',
 '[{"M-protein":"IgG kappa 3.8 g/dL","FISH":"standard risk"},{"M-protein":"IgA lambda 2.9 g/dL","FISH":"t(4;14) high risk"}]',
 'VMP','RD-Myeloma',NULL,NULL,
 '{"dose":20,"fx":5,"site":"Lumbar spine lytic lesion","tech":"3DCRT","pos":"Supine","region":"Spine"}',
 'hemato_oncology','R-ISS',NULL,'Low back pain, fatigue and anaemia',
 'Bone marrow aspiration and biopsy, serum protein electrophoresis','Whole-body low-dose CT',NULL,NULL,NULL,'Nausea'),
(25,'ALL',2,1,18,35,'Acute Lymphoblastic Leukemia (ALL)',
 '[{"s":"Bone marrow","c":"C42.1"}]',
 false,'B lymphoblastic leukaemia/lymphoma','9811/3','{"Not applicable"}','91857003','C91.0',
 '{"code":"14804-9","name":"Lactate Dehydrogenase (LDH)","unit":"U/L","hi":250}',
 '[{"Immunophenotype":"B-ALL (CD19+, CD10+)","BCR-ABL1":"negative"},{"Immunophenotype":"B-ALL (CD19+, CD10+)","BCR-ABL1":"positive (Ph+)"}]',
 'HyperCVAD-A','HyperCVAD-A',NULL,NULL,NULL,
 'hemato_oncology','Risk group',NULL,'Fever, fatigue and easy bruising for 3 weeks',
 'Peripheral smear and bone marrow aspiration with flow cytometry','CECT chest',NULL,NULL,NULL,NULL),
(26,'AML',1.2,1.2,18,75,'Acute Myeloid Leukemia (AML)',
 '[{"s":"Bone marrow","c":"C42.1"}]',
 false,'Acute myeloid leukaemia, NOS','9861/3','{"Not applicable"}','91861009','C92.0',
 '{"code":"14804-9","name":"Lactate Dehydrogenase (LDH)","unit":"U/L","hi":250}',
 '[{"NPM1":"mutated","FLT3-ITD":"negative"},{"NPM1":"wild-type","FLT3-ITD":"positive"},{"Cytogenetics":"t(8;21) RUNX1::RUNX1T1"}]',
 'AML-7+3','AML-7+3',NULL,NULL,NULL,
 'hemato_oncology','ELN 2022',NULL,'Fever, gum bleeding and fatigue for 2 weeks',
 'Peripheral smear and bone marrow aspiration with flow cytometry and cytogenetics','Chest X-ray and ECHO',NULL,NULL,NULL,NULL),
(27,'CML',1.2,0.8,20,70,'Chronic Myeloid Leukemia (CML)',
 '[{"s":"Bone marrow","c":"C42.1"}]',
 false,'Chronic myeloid leukaemia, BCR-ABL1 positive','9875/3','{"Not applicable"}','92818009','C92.1',NULL,
 '[{"BCR-ABL1":"p210 (e14a2)","ELTS":"low"},{"BCR-ABL1":"p210 (e13a2)","ELTS":"intermediate"}]',
 NULL,NULL,NULL,NULL,NULL,
 'hemato_oncology','Phase (ELTS)',NULL,'Fullness in the left upper abdomen; high white cell count on routine test',
 'Bone marrow aspiration with cytogenetics and BCR-ABL1 RT-PCR','USG abdomen',NULL,NULL,'Imatinib 400 mg PO daily',NULL),
(28,'GBM',2,1,25,75,'Glioblastoma Multiforme (GBM)',
 '[{"s":"Frontal lobe","c":"C71.1"},{"s":"Temporal lobe","c":"C71.2"},{"s":"Parietal lobe","c":"C71.3"}]',
 true,'Glioblastoma, IDH-wildtype','9440/3','{"WHO CNS grade 4"}','393563007',NULL,NULL,
 '[{"IDH":"wild-type","MGMT promoter":"methylated"},{"IDH":"wild-type","MGMT promoter":"unmethylated"}]',
 'Stupp-TMZ','Stupp-TMZ','Maximal safe resection (awake craniotomy)',
 '{"dose":60,"fx":30,"site":"Tumour bed with 2 cm margin","tech":"VMAT","pos":"Supine, thermoplastic head mask","region":"Brain"}',NULL,
 'radiation_oncology','WHO CNS 2021',NULL,'Headache for 1 month and a new-onset seizure',
 'MRI brain with contrast and MR spectroscopy','MRI brain',NULL,NULL,NULL,'Fatigue and alopecia'),
(29,'TESTIS',1,0,18,45,'Testicular Cancer',
 '[{"s":"Testis","c":"C62.9"}]',
 true,'Mixed germ cell tumour','9085/3','{"Not applicable"}','363449006',NULL,
 '{"code":"83073-7","name":"Alpha-Fetoprotein (AFP)","unit":"ng/mL","hi":10}',
 '[{"AFP":"elevated","beta-hCG":"elevated","LDH":"normal"}]',
 'BEP','BEP','Radical inguinal orchidectomy',NULL,NULL,
 'medical_oncology','AJCC','8th','Painless swelling of the testis for 2 months',
 'USG scrotum and tumour markers; radical inguinal orchidectomy','CECT chest, abdomen and pelvis',NULL,NULL,NULL,NULL);

-- Stage options per template: weight, metastatic status, treatment pathway
-- (S surgery, C chemo, CRT chemoradiation, RT radiotherapy, H hormonal,
-- T targeted; '>' = then) and intent.
CREATE TEMP TABLE onc_stage (key text, ord int, grp text, t text, n text, m text, w numeric, met text, pathway text, intent text) ON COMMIT DROP;
INSERT INTO onc_stage VALUES
('ORAL',1,'I','T1','N0','M0',8,'localized','S','curative'),
('ORAL',2,'II','T2','N0','M0',15,'localized','S','curative'),
('ORAL',3,'III','T3','N0','M0',20,'localized','S>RT','adjuvant'),
('ORAL',4,'IVA','T4a','N2b','M0',40,'regional','S>CRT','adjuvant'),
('ORAL',5,'IVB','T4b','N2c','M0',10,'regional','CRT','curative'),
('ORAL',6,'IVC','T4a','N2c','M1',7,'distant','C','palliative'),
('LARYNX',1,'I','T1a','N0','M0',15,'localized','RT','curative'),
('LARYNX',2,'II','T2','N0','M0',15,'localized','RT','curative'),
('LARYNX',3,'III','T3','N1','M0',35,'regional','CRT','curative'),
('LARYNX',4,'IVA','T4a','N2c','M0',25,'regional','S>CRT','adjuvant'),
('LARYNX',5,'IVC','T3','N2c','M1',10,'distant','C','palliative'),
('ESOPH',1,'II','T2','N0','M0',20,'localized','CRT>S','neoadjuvant'),
('ESOPH',2,'III','T3','N1','M0',45,'regional','CRT>S','neoadjuvant'),
('ESOPH',3,'IVA','T4b','N2','M0',15,'regional','CRT','curative'),
('ESOPH',4,'IVB','T3','N2','M1',20,'distant','C','palliative'),
('GASTRIC',1,'IB','T2','N0','M0',10,'localized','S','curative'),
('GASTRIC',2,'IIB','T3','N1','M0',15,'regional','C>S','neoadjuvant'),
('GASTRIC',3,'IIIA','T4a','N2','M0',40,'regional','C>S','neoadjuvant'),
('GASTRIC',4,'IV','T4a','N3a','M1',35,'distant','C','palliative'),
('CRC',1,'I','T2','N0','M0',8,'localized','S','curative'),
('CRC',2,'IIA','T3','N0','M0',22,'localized','S','curative'),
('CRC',3,'IIIB','T3','N1b','M0',40,'regional','S>C','adjuvant'),
('CRC',4,'IVA','T4a','N2a','M1a',30,'distant','C','palliative'),
('RECTUM',1,'I','T2','N0','M0',10,'localized','S','curative'),
('RECTUM',2,'IIA','T3','N0','M0',20,'localized','RT>C>S','neoadjuvant'),
('RECTUM',3,'IIIB','T3','N1b','M0',45,'regional','RT>C>S','neoadjuvant'),
('RECTUM',4,'IVA','T3','N2a','M1a',25,'distant','C','palliative'),
('HCC',1,'IB','T1b','N0','M0',25,'localized','S','curative'),
('HCC',2,'II','T2','N0','M0',20,'localized','S','curative'),
('HCC',3,'IIIA','T3','N0','M0',25,'regional','C','palliative'),
('HCC',4,'IVB','T4','N1','M1',30,'distant','C','palliative'),
('GB',1,'I','T1b','N0','M0',5,'localized','S','curative'),
('GB',2,'IIA','T2a','N0','M0',20,'localized','S>C','adjuvant'),
('GB',3,'IIIB','T3','N1','M0',30,'regional','S>C','adjuvant'),
('GB',4,'IVB','T3','N2','M1',45,'distant','C','palliative'),
('PANC',1,'IB','T2','N0','M0',15,'localized','S>C','adjuvant'),
('PANC',2,'IIB','T3','N1','M0',20,'regional','S>C','adjuvant'),
('PANC',3,'III','T4','N1','M0',25,'regional','C','palliative'),
('PANC',4,'IV','T3','N1','M1',40,'distant','C','palliative'),
('LUNGAD',1,'IA3','T1c','N0','M0',8,'localized','S','curative'),
('LUNGAD',2,'IIB','T2b','N1','M0',10,'regional','S>C','adjuvant'),
('LUNGAD',3,'IIIA','T3','N2','M0',22,'regional','CRT','curative'),
('LUNGAD',4,'IVA','T2a','N2','M1a',30,'distant','C','palliative'),
('LUNGAD',5,'IVB','T3','N3','M1c',30,'distant','C','palliative'),
('LUNGSQ',1,'IB','T2a','N0','M0',10,'localized','S','curative'),
('LUNGSQ',2,'IIIA','T3','N2','M0',35,'regional','CRT','curative'),
('LUNGSQ',3,'IVA','T3','N2','M1b',55,'distant','C','palliative'),
('SCLC',1,'IIIA','T2b','N2','M0',35,'regional','CRT','curative'),
('SCLC',2,'IVB','T3','N3','M1c',65,'distant','C','palliative'),
('BRHR',1,'IA','T1c','N0','M0',15,'localized','S>RT>H','adjuvant'),
('BRHR',2,'IIB','T2','N1','M0',35,'regional','S>C>RT>H','adjuvant'),
('BRHR',3,'IIIA','T3','N2','M0',30,'regional','C>S>RT>H','neoadjuvant'),
('BRHR',4,'IV','T2','N1','M1',20,'distant','C>H','palliative'),
('BRHER2',1,'IA','T1c','N0','M0',10,'localized','S>C>RT','adjuvant'),
('BRHER2',2,'IIA','T2','N0','M0',35,'localized','S>C>RT','adjuvant'),
('BRHER2',3,'IIIA','T3','N1','M0',35,'regional','C>S>RT','neoadjuvant'),
('BRHER2',4,'IV','T2','N1','M1',20,'distant','C','palliative'),
('BRTN',1,'IA','T1c','N0','M0',10,'localized','S>C>RT','adjuvant'),
('BRTN',2,'IIB','T2','N1','M0',30,'regional','C>S>RT','neoadjuvant'),
('BRTN',3,'IIIA','T3','N2','M0',40,'regional','C>S>RT','neoadjuvant'),
('BRTN',4,'IV','T2','N2','M1',20,'distant','C','palliative'),
('CERVIX',1,'IB2','T1b2','N0','M0',10,'localized','S','curative'),
('CERVIX',2,'IIB','T2b','N0','M0',35,'localized','CRT','curative'),
('CERVIX',3,'IIIB','T3b','N0','M0',25,'regional','CRT','curative'),
('CERVIX',4,'IIIC1','T2b','N1','M0',15,'regional','CRT','curative'),
('CERVIX',5,'IVB','T3b','N1','M1',15,'distant','C','palliative'),
('OVARY',1,'IC','T1c','N0','M0',10,'localized','S>C','adjuvant'),
('OVARY',2,'IIIC','T3c','N0','M0',55,'regional','C>S','neoadjuvant'),
('OVARY',3,'IVA','T3c','N1','M1a',20,'distant','C>S','neoadjuvant'),
('OVARY',4,'IVB','T3c','N1','M1b',15,'distant','C','palliative'),
('ENDOMET',1,'IA','T1a','N0','M0',40,'localized','S','curative'),
('ENDOMET',2,'IB','T1b','N0','M0',20,'localized','S>RT','adjuvant'),
('ENDOMET',3,'IIIC1','T1b','N1','M0',25,'regional','S>C>RT','adjuvant'),
('ENDOMET',4,'IVB','T3','N1','M1',15,'distant','C','palliative'),
('THYROID',1,'I','T2','N0','M0',60,'localized','S>H','curative'),
('THYROID',2,'II','T3a','N1b','M0',30,'regional','S>H','curative'),
('THYROID',3,'IVB','T3a','N1b','M1',10,'distant','S>H','palliative'),
('PROSTATE',1,'IIB','T2b','N0','M0',30,'localized','H>RT','curative'),
('PROSTATE',2,'IIIB','T3a','N0','M0',30,'localized','H>RT','curative'),
('PROSTATE',3,'IVB','T3b','N1','M1b',40,'distant','H>C','palliative'),
('BLADDER',1,'II','T2','N0','M0',40,'localized','C>S','neoadjuvant'),
('BLADDER',2,'IIIA','T3a','N1','M0',30,'regional','C>S','neoadjuvant'),
('BLADDER',3,'IVB','T4b','N2','M1a',30,'distant','C','palliative'),
('DLBCL',1,'I',NULL,NULL,NULL,10,'localized','C','curative'),
('DLBCL',2,'II (bulky)',NULL,NULL,NULL,25,'regional','C>RT','curative'),
('DLBCL',3,'III',NULL,NULL,NULL,30,'regional','C','curative'),
('DLBCL',4,'IV',NULL,NULL,NULL,35,'distant','C','curative'),
('HODGKIN',1,'IIA',NULL,NULL,NULL,40,'regional','C>RT','curative'),
('HODGKIN',2,'IIIB',NULL,NULL,NULL,30,'regional','C','curative'),
('HODGKIN',3,'IVB',NULL,NULL,NULL,30,'distant','C','curative'),
('MYELOMA',1,'R-ISS I',NULL,NULL,NULL,25,'distant','C','palliative'),
('MYELOMA',2,'R-ISS II',NULL,NULL,NULL,45,'distant','C','palliative'),
('MYELOMA',3,'R-ISS III',NULL,NULL,NULL,30,'distant','RT>C','palliative'),
('ALL',1,'Standard risk',NULL,NULL,NULL,55,'distant','C','curative'),
('ALL',2,'High risk',NULL,NULL,NULL,45,'distant','C','curative'),
('AML',1,'Favourable risk',NULL,NULL,NULL,35,'distant','C','curative'),
('AML',2,'Intermediate risk',NULL,NULL,NULL,40,'distant','C','curative'),
('AML',3,'Adverse risk',NULL,NULL,NULL,25,'distant','C','curative'),
('CML',1,'Chronic phase',NULL,NULL,NULL,90,'distant','T','supportive'),
('CML',2,'Accelerated phase',NULL,NULL,NULL,10,'distant','T','supportive'),
('GBM',1,'Grade 4',NULL,NULL,NULL,100,'localized','S>CRT','adjuvant'),
('TESTIS',1,'IA','pT1','N0','M0',30,'localized','S','curative'),
('TESTIS',2,'IIB','pT2','N2','M0',40,'regional','S>C','adjuvant'),
('TESTIS',3,'IIIB','pT2','N2','M1a',30,'distant','S>C','curative');

-- ---------------------------------------------------------------------------
-- Registry candidates: demo patients held back from the cohort. Each slot
-- gets one result that the registry candidate queue
-- (GET /plugins/oncology/registry/candidates, registry-candidates.ts) should
-- pick up, written after the journeys below. Slot 8 is a benign biopsy that
-- must NOT be listed. A slot takes the MRN-DEMO-* patient of the right sex
-- and age with an outpatient visit 7-55 days ago, chosen by hash, so results
-- fall in the last ~2 months.
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE onc_cand_slot (
  slot int PRIMARY KEY, sex text, age_min int, kind text,           -- kind: pathology | imaging | diagnosis | marker
  order_code text, order_name text, specimen text, body_part text, technique text,
  history text, gross text, micro text,
  result text,                                                       -- pathology diagnosis / imaging impression
  note text,                                                         -- pathology comment / imaging recommendation
  findings text, complaint text, icd text, icd_name text, value numeric
) ON COMMIT DROP;
INSERT INTO onc_cand_slot VALUES
(1, 'female', 35, 'pathology', '33717-0', 'Histopathology — core biopsy, breast', 'Core biopsy, right breast', NULL, NULL,
 'Palpable lump right breast upper outer quadrant for 2 months. Ultrasound: 2.1 cm irregular hypoechoic lesion.',
 'Three grey-white linear cores, 1.0 to 1.6 cm long. All embedded in A1.',
 'Infiltrating tumour cells in nests, cords and tubules with moderate nuclear pleomorphism; 9 mitoses per 10 HPF. No DCIS component seen in the cores.',
 'Right breast, upper outer quadrant, core biopsy: Invasive ductal carcinoma (NST), Nottingham grade 2 (3+2+2 = 7/9).',
 'ER, PR and HER2 immunohistochemistry requested on block A1.', NULL,
 'Lump in the right breast for 2 months', NULL, NULL, NULL),
(2, 'male', 30, 'pathology', '33717-0', 'Histopathology — punch biopsy, oral cavity', 'Punch biopsy, tongue', NULL, NULL,
 'Non-healing ulcer on the left lateral border of the tongue for 3 months. Chews tobacco.',
 'Single grey-white tissue piece 0.6 x 0.4 x 0.3 cm. Entirely embedded.',
 'Sheets and islands of atypical squamous cells with keratin pearls and intercellular bridges, infiltrating the underlying stroma.',
 'Left lateral border of tongue, punch biopsy: Moderately differentiated squamous cell carcinoma, keratinising. Depth of invasion at least 4 mm in this sample.',
 'Clinical staging with CECT face and neck advised.', NULL,
 'Non-healing ulcer on the tongue for 3 months', NULL, NULL, NULL),
(3, NULL, 45, 'pathology', '33717-0', 'Histopathology — colonoscopic biopsy', 'Colonoscopic biopsy, sigmoid colon', NULL, NULL,
 'Altered bowel habit and bleeding per rectum for 2 months. Ulceroproliferative growth at 25 cm on colonoscopy.',
 'Five grey-brown tissue bits, the largest 0.4 cm. All embedded.',
 'Complex, back-to-back malignant glands with dirty necrosis, infiltrating through the muscularis mucosae.',
 'Sigmoid colon, colonoscopic biopsy: Adenocarcinoma, moderately differentiated, invading the submucosa.',
 'Mismatch repair immunohistochemistry (MLH1, PMS2, MSH2, MSH6) to follow.', NULL,
 'Blood in stools and altered bowel habit for 2 months', NULL, NULL, NULL),
(4, 'female', 40, 'imaging', '77066', 'Diagnostic mammogram with targeted ultrasound, bilateral', 'Mammography', 'Breast (bilateral)',
 'Full-field digital mammography, CC and MLO views, with targeted ultrasound of the left breast.',
 'Lump in the left breast noticed 6 weeks ago.', NULL, NULL,
 'Left breast: BI-RADS 5, highly suggestive of malignancy. Right breast: BI-RADS 1.',
 'Ultrasound-guided core biopsy of the left breast mass.',
 'Left breast upper outer quadrant: 1.8 cm irregular spiculated mass with pleomorphic microcalcifications. Ultrasound shows a hypoechoic, taller-than-wide lesion with angular margins. Two left axillary nodes with cortical thickening. Right breast: scattered fibroglandular density.',
 'Lump in the left breast for 6 weeks', NULL, NULL, NULL),
(5, 'male', 50, 'imaging', '71271', 'Low-dose CT chest (lung cancer screening)', 'CT', 'Chest',
 'Low-dose non-contrast CT of the chest, 1 mm reconstructions.',
 'Smoker, 30 pack-years. Annual lung cancer screening.', NULL, NULL,
 'Lung-RADS 4B: suspicious part-solid nodule in the right upper lobe.',
 'PET-CT and tissue sampling; discuss at the thoracic MDT.',
 'Right upper lobe apical segment: 2.3 cm part-solid nodule with a 14 mm solid component and spiculated margins. No mediastinal or hilar lymphadenopathy. No pleural effusion. Centrilobular emphysema.',
 'Annual lung screening CT — smoker, 30 pack-years', NULL, NULL, NULL),
(6, NULL, 40, 'diagnosis', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
 'Referred with an outside triphasic CT showing a 4 cm segment VI lesion with arterial enhancement and washout; chronic hepatitis B.', NULL,
 'Right upper abdominal discomfort and weight loss', 'C22.0', 'Liver cell carcinoma', NULL),
(7, 'male', 50, 'marker', '83112-3', 'Prostate Specific Antigen (PSA), Total', 'Serum', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
 'Increased urinary frequency and nocturia for 6 months', NULL, NULL, 14.2),
(8, NULL, 30, 'pathology', '33717-0', 'Histopathology — endoscopic biopsy, stomach', 'Endoscopic biopsy, gastric antrum', NULL, NULL,
 'Epigastric pain and dyspepsia for 4 months. Antral erosions on endoscopy.',
 'Four grey-white tissue bits, the largest 0.3 cm. All embedded.',
 'Antral mucosa with a dense lymphoplasmacytic infiltrate, neutrophilic activity and curved bacilli on the surface epithelium.',
 'Gastric antrum, endoscopic biopsy: Chronic active gastritis with Helicobacter pylori-like organisms. Negative for dysplasia and malignancy.',
 'No evidence of carcinoma or lymphoma in the sections examined.', NULL,
 'Epigastric pain and dyspepsia for 4 months', NULL, NULL, NULL);

CREATE TEMP TABLE onc_cand (slot int PRIMARY KEY, patient_id uuid UNIQUE, enc_id uuid, enc_day date) ON COMMIT DROP;
DO $$
DECLARE c record;
BEGIN
  FOR c IN SELECT * FROM onc_cand_slot ORDER BY slot LOOP
    INSERT INTO onc_cand
    SELECT c.slot, p.id, e.id, e.start_time::date
    FROM patients p
    JOIN LATERAL (
      SELECT e.id, e.start_time FROM encounters e
      WHERE e.patient_id = p.id AND e.encounter_class = 'AMB' AND e.encounter_number NOT LIKE 'ONC-ENC-%'
        AND e.start_time::date BETWEEN CURRENT_DATE - 55 AND CURRENT_DATE - 7
      ORDER BY e.start_time DESC LIMIT 1
    ) e ON true
    WHERE p.tenant_id = '11111111-1111-1111-1111-111111111111' AND p.mrn LIKE 'MRN-DEMO-%'
      AND (c.sex IS NULL OR p.gender = c.sex)
      AND EXTRACT(YEAR FROM age(CURRENT_DATE, p.date_of_birth)) >= c.age_min
      AND NOT EXISTS (SELECT 1 FROM onc_cand x WHERE x.patient_id = p.id)
    ORDER BY md5('cand:' || c.slot || ':' || p.id)
    LIMIT 1;
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- Remove a previous run, and plugin rows of patients that no longer exist
-- (re-running 27-demo-activity.sql recreates the demo patients). Candidate
-- patients are cleaned too, so anything added to the registry for them in a
-- demo (and every add/dismiss decision) is reset.
-- ---------------------------------------------------------------------------
DELETE FROM clinical_orders WHERE id IN (SELECT pg_temp.u('cand-ord:' || slot) FROM onc_cand_slot); -- reports cascade
DELETE FROM encounter_diagnoses WHERE id IN (SELECT pg_temp.u('cand-dx:' || slot) FROM onc_cand_slot);
DELETE FROM plugin_oncology.registry_candidate_decisions d
WHERE d.patient_id IN (SELECT patient_id FROM onc_cand)
   OR d.source_id IN (SELECT pg_temp.u('cand-' || k || ':' || slot) FROM onc_cand_slot, unnest(ARRAY['path', 'img', 'dx', 'mki']) k)
   OR NOT EXISTS (SELECT 1 FROM patients p WHERE p.id = d.patient_id);

CREATE TEMP TABLE onc_old (patient_id uuid PRIMARY KEY) ON COMMIT DROP;
INSERT INTO onc_old
SELECT patient_id FROM onc_cand
UNION
SELECT d.patient_id FROM plugin_oncology.cancer_diagnoses d
WHERE d.tenant_id = '11111111-1111-1111-1111-111111111111' AND d.id = pg_temp.u('dx:' || d.patient_id)
UNION
SELECT x.patient_id FROM (
  SELECT patient_id FROM plugin_oncology.cancer_diagnoses UNION SELECT patient_id FROM plugin_oncology.treatment_plans
  UNION SELECT patient_id FROM plugin_oncology.chemo_orders UNION SELECT patient_id FROM plugin_oncology.radiation_prescriptions
  UNION SELECT patient_id FROM plugin_oncology.cancer_timeline_events
) x WHERE NOT EXISTS (SELECT 1 FROM patients p WHERE p.id = x.patient_id);

DELETE FROM plugin_oncology.cancer_timeline_events WHERE patient_id IN (SELECT patient_id FROM onc_old);
DELETE FROM plugin_oncology.treatment_plans        WHERE patient_id IN (SELECT patient_id FROM onc_old); -- cycles/days cascade
DELETE FROM plugin_oncology.chemo_orders           WHERE patient_id IN (SELECT patient_id FROM onc_old);
DELETE FROM plugin_oncology.radiation_fractions WHERE treatment_plan_id IN (
  SELECT tp.id FROM plugin_oncology.radiation_treatment_plans tp JOIN plugin_oncology.radiation_prescriptions rp ON rp.id = tp.prescription_id
  WHERE rp.patient_id IN (SELECT patient_id FROM onc_old));
DELETE FROM plugin_oncology.radiation_treatment_plans WHERE prescription_id IN (SELECT id FROM plugin_oncology.radiation_prescriptions WHERE patient_id IN (SELECT patient_id FROM onc_old));
DELETE FROM plugin_oncology.radiation_simulations WHERE prescription_id IN (SELECT id FROM plugin_oncology.radiation_prescriptions WHERE patient_id IN (SELECT patient_id FROM onc_old));
DELETE FROM plugin_oncology.radiation_on_treatment_reviews WHERE prescription_id IN (SELECT id FROM plugin_oncology.radiation_prescriptions WHERE patient_id IN (SELECT patient_id FROM onc_old));
DELETE FROM plugin_oncology.radiation_completion_summaries WHERE prescription_id IN (SELECT id FROM plugin_oncology.radiation_prescriptions WHERE patient_id IN (SELECT patient_id FROM onc_old));
DELETE FROM plugin_oncology.radiation_prescriptions WHERE patient_id IN (SELECT patient_id FROM onc_old);
DELETE FROM plugin_oncology.oncology_care_plans    WHERE patient_id IN (SELECT patient_id FROM onc_old);
DELETE FROM plugin_oncology.tumor_board_cases      WHERE patient_id IN (SELECT patient_id FROM onc_old);
DELETE FROM plugin_oncology.tumor_staging          WHERE patient_id IN (SELECT patient_id FROM onc_old);
DELETE FROM plugin_oncology.cancer_diagnoses       WHERE patient_id IN (SELECT patient_id FROM onc_old);

DELETE FROM clinical_observations WHERE source_id = pg_temp.u('marker-source');
DELETE FROM lab_result_items WHERE lab_report_id IN (
  SELECT lr.id FROM lab_reports lr WHERE lr.patient_id IN (SELECT patient_id FROM onc_old) AND lr.id = pg_temp.u('mkr:' || lr.order_id));
DELETE FROM lab_reports lr WHERE lr.patient_id IN (SELECT patient_id FROM onc_old) AND lr.id = pg_temp.u('mkr:' || lr.order_id);
DELETE FROM clinical_orders co WHERE co.patient_id IN (SELECT patient_id FROM onc_old) AND co.order_type = 'lab'
  AND co.id = pg_temp.u('mko:' || co.patient_id || ':' || co.ordered_at::date);
UPDATE ot_requests SET active_schedule_id = NULL WHERE patient_id IN (SELECT patient_id FROM onc_old) AND id = pg_temp.u('otq:' || patient_id);
DELETE FROM ot_reports   WHERE patient_id IN (SELECT patient_id FROM onc_old) AND id = pg_temp.u('otr:' || patient_id);
DELETE FROM ot_schedules WHERE patient_id IN (SELECT patient_id FROM onc_old) AND id = pg_temp.u('ots:' || patient_id);
DELETE FROM ot_requests  WHERE patient_id IN (SELECT patient_id FROM onc_old) AND id = pg_temp.u('otq:' || patient_id);
DELETE FROM encounter_diagnoses ed
WHERE ed.patient_id IN (SELECT patient_id FROM onc_old)
  AND ed.id IN (pg_temp.u('encdx:' || ed.encounter_id), pg_temp.u('encdx2:' || ed.encounter_id));
DELETE FROM encounters WHERE encounter_number LIKE 'ONC-ENC-%';

-- ---------------------------------------------------------------------------
-- Cohort: every active patient of the tenant without a cancer diagnosis,
-- except the registry candidates held back above.
-- Each gets at least one encounter (the first oncology consult).
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE onc_patient ON COMMIT DROP AS
SELECT p.id, p.mrn, p.gender, p.date_of_birth, p.first_name, p.last_name,
       LEAST(p.created_at::date, COALESCE((SELECT MIN(e.start_time)::date FROM encounters e WHERE e.patient_id = p.id), p.created_at::date)) AS reg
FROM patients p
WHERE p.tenant_id = '11111111-1111-1111-1111-111111111111'
  AND NOT EXISTS (SELECT 1 FROM plugin_oncology.cancer_diagnoses d WHERE d.patient_id = p.id)
  AND NOT EXISTS (SELECT 1 FROM onc_cand c WHERE c.patient_id = p.id);

-- Screens that show patients.display_name (e.g. the cancer timeline header) need it set.
UPDATE patients p SET display_name = trim(p.first_name || ' ' || p.last_name)
WHERE p.id IN (SELECT id FROM onc_patient) AND COALESCE(p.display_name, '') = '';

INSERT INTO encounters (
  id, encounter_number, tenant_id, patient_id, facility_id, primary_staff_id,
  encounter_class, encounter_type, status, priority, start_time, end_time, encounter_source, created_at, updated_at
)
SELECT pg_temp.u('enc:' || op.id), 'ONC-ENC-' || op.mrn, '11111111-1111-1111-1111-111111111111'::uuid, op.id,
  '087e0bd6-8d65-5133-94bd-7b4cd6ff3665'::uuid, '6d2df89a-3f81-5338-b197-373d347031db'::uuid,
  'AMB', 'outpatient', 'finished', 'routine',
  op.reg + TIME '10:30', op.reg + TIME '11:00', 'walk_in', op.reg + TIME '10:30', op.reg + TIME '10:30'
FROM onc_patient op
WHERE NOT EXISTS (SELECT 1 FROM encounters e WHERE e.patient_id = op.id);

-- ---------------------------------------------------------------------------
-- The journeys
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  TEN CONSTANT uuid := '11111111-1111-1111-1111-111111111111';
  MED  CONSTANT uuid := '6d2df89a-3f81-5338-b197-373d347031db'; -- Medical oncology
  SURG CONSTANT uuid := 'e761d1dc-1d77-5499-bd12-b077276934a7'; -- Surgical oncology
  RAD  CONSTANT uuid := '23ef067c-d352-5415-945b-9b802d20bc3c'; -- Radiation oncology
  PHYS CONSTANT uuid := 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee'; -- Radiology / pathology at MDT
  NURSE1 CONSTANT uuid := 'f97c5b31-aa24-5862-98cf-ee29d50db5d1';
  NURSE2 CONSTANT uuid := 'aebba554-5fff-5daf-966c-713ea9f34426';
  RTT  CONSTANT uuid := '4877a9f4-1ceb-50e2-ac22-5260faa8e46e'; -- Radiation therapist
  PHYSICIST CONSTANT uuid := 'b881d4bf-bf7c-5c69-9ddf-c051066b9512';
  MARKER_SRC uuid := pg_temp.u('marker-source');
  today date := CURRENT_DATE;

  p record; t record; s record; pr plugin_oncology.chemo_protocols; e record;
  k text; sex text; v_age int; v_targeted text; seqno int := 0;
  site jsonb; v_lat text; bio jsonb; v_grade text; v_icd text; v_dxname text;
  ht numeric; wt numeric; v_bsa numeric; v_crcl numeric; ecog int;
  dx_date date; confirmed boolean; stg_date date; tb_date date; tx_start date; cur date;
  steps text[]; step text; i int; intent text; pathway text;
  resp double precision; outcome text;
  doc uuid; dx_id uuid; stg_id uuid; tb_id uuid; cp_id uuid;
  surg_date date; chemo_start date; chemo_end date; rt_start date; rt_end date; horm_start date; targ_start date;
  final_end date; proto_code text; snap jsonb; plan_id uuid;
  ph jsonb; ph_i int; pc int; cyc_n int; cstart date; cdur int; delay int; lvl int; cstatus text; tdays int[]; d int;
  ddate date; items jsonb; dstatus text; ostatus text; order_id uuid; hold_used boolean; plan_on_hold boolean;
  total_cycles int; first_given date; last_day date;
  rt jsonb; rx_id uuid; sim_id uuid; rtp_id uuid; fx int; fdate date; fstatus text; delivered int; missed int; rx_status text;
  machine text; enc_id uuid; modalities jsonb; milestones jsonb; decision text; cp_status text; tb_status text;
  v0 numeric; obs_date date; obs_val numeric; days_since int;
  cc text; v_notes text; dxcode text; dxname text; dxtype text; ip_reason text;
  enc_first uuid; bio_text text; tox text[]; aes jsonb; v_short text;
BEGIN
  FOR p IN SELECT * FROM onc_patient ORDER BY reg, mrn LOOP
    k := p.id::text;
    seqno := seqno + 1;
    sex := CASE WHEN p.gender = 'female' THEN 'F' ELSE 'M' END;
    v_age := GREATEST(18, EXTRACT(YEAR FROM age(today, p.date_of_birth))::int);

    -- Cancer type (weighted by sex, within the age band).
    SELECT * INTO t FROM (
      SELECT ot.*, SUM(CASE WHEN sex = 'F' THEN w_f ELSE w_m END) OVER (ORDER BY ord) AS cum,
                   SUM(CASE WHEN sex = 'F' THEN w_f ELSE w_m END) OVER () AS tot
      FROM onc_type ot
      WHERE v_age BETWEEN age_min AND age_max AND (CASE WHEN sex = 'F' THEN w_f ELSE w_m END) > 0
    ) x WHERE cum > pg_temp.h('type:' || k) * tot ORDER BY ord LIMIT 1;
    IF NOT FOUND THEN SELECT *, 0, 0 INTO t FROM onc_type WHERE key = 'CRC'; END IF;
    v_targeted := t.targeted;

    SELECT * INTO s FROM (
      SELECT os.*, SUM(w) OVER (ORDER BY ord) AS cum, SUM(w) OVER () AS tot FROM onc_stage os WHERE os.key = t.key
    ) x WHERE cum > pg_temp.h('stage:' || k) * tot ORDER BY ord LIMIT 1;

    site := t.sites -> floor(pg_temp.h('site:' || k) * jsonb_array_length(t.sites))::int;
    v_lat := CASE WHEN t.lat THEN CASE WHEN pg_temp.h('lat:' || k) < 0.5 THEN 'left' ELSE 'right' END END;
    bio := t.biomarkers -> floor(pg_temp.h('bio:' || k) * jsonb_array_length(t.biomarkers))::int;
    v_grade := t.grades[1 + floor(pg_temp.h('grade:' || k) * array_length(t.grades, 1))::int];
    v_icd := COALESCE(t.icd, site->>'c');
    v_dxname := CASE WHEN t.icd IS NOT NULL THEN t.cancer_type ELSE 'Malignant neoplasm of ' || lower(site->>'s') END;
    SELECT string_agg(key || ': ' || value, '; ') INTO bio_text FROM jsonb_each_text(bio);

    pathway := s.pathway; intent := s.intent;
    -- Driver-mutated metastatic lung adenocarcinoma goes on a TKI, not chemotherapy.
    IF t.key = 'LUNGAD' AND intent = 'palliative' AND (bio->>'EGFR' <> 'wild-type' OR bio->>'ALK' = 'rearranged') THEN
      pathway := 'T';
      v_targeted := CASE WHEN bio->>'ALK' = 'rearranged' THEN 'Alectinib 600 mg PO twice daily' ELSE 'Osimertinib 80 mg PO daily' END;
    END IF;

    -- Body measures (BSA by Mosteller, CrCl by Cockcroft-Gault, creatinine ~0.9).
    ht := CASE WHEN sex = 'F' THEN 148 + round((pg_temp.h('ht:' || k) * 17)::numeric, 1) ELSE 158 + round((pg_temp.h('ht:' || k) * 20)::numeric, 1) END;
    wt := CASE WHEN sex = 'F' THEN 42 + round((pg_temp.h('wt:' || k) * 28)::numeric, 1) ELSE 48 + round((pg_temp.h('wt:' || k) * 32)::numeric, 1) END;
    v_bsa := round(sqrt(ht * wt / 3600), 2);
    v_crcl := round(LEAST(140, GREATEST(35, (140 - v_age) * wt / (72 * 0.9) * CASE WHEN sex = 'F' THEN 0.85 ELSE 1 END)), 2);
    ecog := CASE WHEN s.met = 'distant' THEN 1 + floor(pg_temp.h('ecog:' || k) * 2)::int ELSE floor(pg_temp.h('ecog:' || k) * 2)::int END;

    -- Timeline anchors.
    dx_date := p.reg + 5 + floor(pg_temp.h('dx:' || k) * 8)::int;
    confirmed := dx_date <= today;
    IF NOT confirmed THEN dx_date := p.reg; END IF;
    stg_date := LEAST(dx_date + 2 + floor(pg_temp.h('stg:' || k) * 4)::int, today);
    tb_date := dx_date + 3;
    tb_date := tb_date + ((3 - EXTRACT(DOW FROM tb_date)::int + 7) % 7); -- the next Wednesday MDT
    IF NOT confirmed THEN tb_date := today + ((3 - EXTRACT(DOW FROM today)::int + 7) % 7); END IF;
    tx_start := pg_temp.wd(tb_date + 7 + floor(pg_temp.h('tx:' || k) * 10)::int);

    resp := pg_temp.h('resp:' || k);
    outcome := CASE WHEN s.met = 'distant' THEN CASE WHEN resp < 0.55 THEN 'response' WHEN resp < 0.8 THEN 'stable' ELSE 'progression' END
                    ELSE CASE WHEN resp < 0.85 THEN 'response' WHEN resp < 0.95 THEN 'stable' ELSE 'progression' END END;

    doc := CASE t.subsp WHEN 'surgical_oncology' THEN SURG WHEN 'radiation_oncology' THEN RAD ELSE MED END;
    dx_id := pg_temp.u('dx:' || k); stg_id := pg_temp.u('stg:' || k); tb_id := pg_temp.u('tb:' || k); cp_id := pg_temp.u('cp:' || k);
    surg_date := NULL; chemo_start := NULL; chemo_end := NULL; rt_start := NULL; rt_end := NULL; horm_start := NULL; targ_start := NULL;
    plan_id := NULL; rx_id := NULL; total_cycles := NULL; first_given := NULL; plan_on_hold := false; hold_used := false; proto_code := NULL; pr := NULL; snap := NULL; rt := NULL; decision := NULL; last_day := NULL;

    SELECT e2.id INTO enc_first FROM encounters e2 WHERE e2.patient_id = p.id ORDER BY abs(e2.start_time::date - dx_date), e2.start_time LIMIT 1;

    -- Diagnosis (status refined at the end).
    INSERT INTO plugin_oncology.cancer_diagnoses (
      id, tenant_id, patient_id, encounter_id, cancer_type, primary_site, primary_site_code, laterality,
      histology_morphology, morphology_code, icd_code, snomed_code, diagnosis_date, clinical_status,
      verification_status, grade, metastatic_status, is_recurrence, biomarkers, ecog_at_diagnosis,
      diagnosed_by, notes, created_at, updated_at
    ) VALUES (
      dx_id, TEN, p.id, enc_first, t.cancer_type, site->>'s', site->>'c', v_lat,
      t.histology, t.morph, v_icd, t.snomed, dx_date, 'active',
      CASE WHEN confirmed THEN 'confirmed' ELSE 'provisional' END,
      CASE WHEN confirmed THEN v_grade END, CASE WHEN confirmed THEN s.met ELSE 'unknown' END, false,
      CASE WHEN confirmed THEN bio ELSE '{}'::jsonb END, ecog, doc,
      CASE WHEN confirmed THEN concat_ws(' ', t.histology || COALESCE(', ' || v_grade, '') || ' of the ' || lower(site->>'s') || COALESCE(' (' || v_lat || ')', '') || '.',
             'Presented with: ' || lower(t.symptom) || '.', 'Risk factors: ' || t.risk || '.')
           ELSE 'Clinical suspicion of malignancy — ' || lower(t.symptom) || '. Awaiting histopathology (' || t.workup || ').' END,
      dx_date + TIME '12:00', dx_date + TIME '12:00'
    );
    INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
    VALUES (TEN, p.id, dx_id, 'diagnosis', dx_date + TIME '12:00',
      CASE WHEN confirmed THEN t.cancer_type || ' diagnosed' ELSE 'Suspected ' || t.cancer_type || ' — work-up started' END,
      CASE WHEN confirmed THEN t.histology || ' of the ' || lower(site->>'s') || '. ' || COALESCE(bio_text, '') ELSE t.workup || ' and ' || t.imaging || ' requested.' END,
      'cancer_diagnosis', dx_id,
      jsonb_build_object('cancerType', t.cancer_type, 'primarySite', site->>'s', 'clinicalStatus', 'active', 'metastaticStatus', s.met),
      'milestone', doc);

    -- Work-up still in progress: an MDT slot is booked, nothing else yet.
    IF NOT confirmed THEN
      INSERT INTO plugin_oncology.tumor_board_cases (
        id, tenant_id, patient_id, cancer_diagnosis_id, meeting_date, presented_by, attendees, clinical_summary,
        treatment_intent, recommended_pathway, treatment_plan, follow_up_actions, status, created_at, updated_at
      ) VALUES (
        tb_id, TEN, p.id, dx_id, tb_date, doc,
        jsonb_build_array(jsonb_build_object('staffId', SURG, 'role', 'Surgeon', 'specialty', 'Surgical Oncology'),
                          jsonb_build_object('staffId', MED, 'role', 'Medical Oncologist', 'specialty', 'Medical Oncology'),
                          jsonb_build_object('staffId', RAD, 'role', 'Radiation Oncologist', 'specialty', 'Radiation Oncology'),
                          jsonb_build_object('staffId', PHYS, 'role', 'Radiologist', 'specialty', 'Radiology')),
        v_age || '-year-old ' || CASE WHEN sex = 'F' THEN 'woman' ELSE 'man' END || ' with ' || lower(t.symptom) || '. Biopsy report awaited.',
        NULL, '[]'::jsonb, '{}'::jsonb,
        jsonb_build_array('Collect histopathology report', 'Complete staging: ' || t.imaging), 'scheduled', NOW(), NOW());
      UPDATE encounters SET chief_complaint = left(t.symptom, 500), presenting_symptoms = left(t.symptom, 500),
        notes = 'Evaluation for suspected malignancy. ' || t.workup || ' and ' || t.imaging || ' advised.'
      WHERE patient_id = p.id;
      INSERT INTO encounter_diagnoses (id, tenant_id, encounter_id, patient_id, icd_code, icd_version, diagnosis_name, diagnosis_type,
        diagnosis_rank, is_chronic, diagnosed_by, diagnosed_at, created_at, updated_at)
      SELECT pg_temp.u('encdx:' || en.id), TEN, en.id, p.id, 'Z03.1', 'ICD-10', 'Observation for suspected malignant neoplasm', 'primary',
        1, false, doc, en.start_time, NOW(), NOW()
      FROM encounters en WHERE en.patient_id = p.id;
      CONTINUE;
    END IF;

    -- Clinical staging.
    INSERT INTO plugin_oncology.tumor_staging (
      id, tenant_id, cancer_diagnosis_id, patient_id, encounter_id, provider_id, staging_system, staging_edition,
      staging_type, stage_group, t_category, n_category, m_category, body_site, grade, histology, staging_date, status, notes, created_at, updated_at
    ) VALUES (
      stg_id, TEN, dx_id, p.id, enc_first, doc, t.stg_sys, t.stg_ed, 'clinical', s.grp,
      regexp_replace(s.t, '^p?T', ''), regexp_replace(s.n, '^N', ''), regexp_replace(s.m, '^M', ''),
      site->>'s', v_grade, t.histology, stg_date, 'active',
      'Clinical staging on ' || t.imaging || '.', stg_date + TIME '15:00', stg_date + TIME '15:00');
    INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
    VALUES (TEN, p.id, dx_id, 'staging', stg_date + TIME '15:00',
      'Clinical staging — ' || COALESCE('c' || s.t || ' c' || s.n || ' c' || s.m || ' ', '') || '(Stage ' || s.grp || ')',
      t.stg_sys || COALESCE(' ' || t.stg_ed, '') || ' clinical stage ' || s.grp || ' on ' || t.imaging || '.',
      'tumor_staging', stg_id,
      jsonb_strip_nulls(jsonb_build_object('stagingSystem', t.stg_sys, 'stageGroup', s.grp,
        'tCategory', regexp_replace(s.t, '^p?T', ''), 'nCategory', regexp_replace(s.n, '^N', ''), 'mCategory', regexp_replace(s.m, '^M', ''))),
      'info', doc);

    -- ── Walk the pathway, laying out dates and writing treatment records ──
    steps := string_to_array(pathway, '>');
    cur := tx_start;
    modalities := '[]'::jsonb;
    FOR i IN 1 .. array_length(steps, 1) LOOP
      step := steps[i];

      IF step = 'S' AND t.surgery IS NOT NULL THEN
        surg_date := pg_temp.wd(cur);
        modalities := modalities || jsonb_build_array(jsonb_build_object(
          'modality', 'surgery', 'sequence', i,
          'status', CASE WHEN surg_date < today THEN 'completed' WHEN surg_date = today THEN 'in_progress' ELSE 'planned' END,
          'details', CASE WHEN t.key LIKE 'BR%' AND s.grp LIKE 'III%' THEN 'Modified radical mastectomy' WHEN t.key = 'OVARY' AND i = 1 THEN 'Primary staging laparotomy with optimal cytoreduction' ELSE t.surgery END,
          'startDate', surg_date, 'endDate', surg_date, 'responsibleSubspecialty', 'surgical_oncology'));
        cur := surg_date + 28 + floor(pg_temp.h('rec:' || k) * 10)::int;

      ELSIF step IN ('C', 'CRT') THEN
        proto_code := CASE WHEN intent = 'palliative' THEN COALESCE(t.proto_pal, t.proto_cur) ELSE COALESCE(t.proto_cur, t.proto_pal) END;
        IF t.key = 'BRHR' AND intent = 'adjuvant' AND s.grp LIKE 'I%' AND s.grp NOT LIKE 'III%' THEN proto_code := 'TC'; END IF;
        IF t.key = 'MYELOMA' AND v_age < 65 THEN proto_code := 'VMP'; END IF;
        SELECT * INTO pr FROM plugin_oncology.chemo_protocols WHERE tenant_id = TEN AND code = proto_code;
        IF pr.id IS NULL THEN CONTINUE; END IF;
        snap := pg_temp.snapshot(pr);
        chemo_start := pg_temp.wd(cur);
        plan_id := pg_temp.u('tp:' || k);
        plan_on_hold := pg_temp.h('hold:' || k) < 0.04;
        hold_used := false;
        INSERT INTO plugin_oncology.treatment_plans (
          id, tenant_id, patient_id, cancer_diagnosis_id, oncology_care_plan_id, protocol_id, protocol_snapshot,
          start_date, height_cm, weight_kg, bsa, creatinine_clearance, status, notes, created_by, created_at, updated_at
        ) VALUES (
          plan_id, TEN, p.id, dx_id, cp_id, pr.id, snap, chemo_start, ht, wt, v_bsa, v_crcl, 'active',
          CASE WHEN step = 'CRT' THEN 'Concurrent with radiotherapy.' END,
          CASE WHEN t.subsp = 'hemato_oncology' THEN MED ELSE MED END, chemo_start - 5 + TIME '16:00', chemo_start - 5 + TIME '16:00');

        cstart := chemo_start; cyc_n := 0; lvl := 0;
        FOR ph_i IN 0 .. jsonb_array_length(snap->'phases') - 1 LOOP
          ph := snap->'phases'->ph_i;
          cdur := (ph->>'cycleDurationDays')::int;
          FOR pc IN 1 .. (ph->>'cycles')::int LOOP
            cyc_n := cyc_n + 1;
            delay := CASE WHEN cyc_n > 1 AND cstart < today AND pg_temp.h('delay:' || k || ':' || cyc_n) < 0.08 THEN 7 ELSE 0 END;
            cstart := cstart + delay;
            IF cyc_n > 2 AND lvl = 0 AND cstart < today AND pg_temp.h('lvl:' || k || ':' || cyc_n) < 0.06 THEN lvl := -1; END IF;
            cstatus := CASE WHEN cstart > today THEN 'planned' WHEN cstart + cdur <= today THEN 'completed' ELSE 'in_progress' END;
            INSERT INTO plugin_oncology.treatment_cycles (
              id, tenant_id, treatment_plan_id, cycle_number, phase_index, phase_name, phase_cycle, planned_start_date,
              dose_level, delay_days, delay_reason, status, created_at, updated_at
            ) VALUES (
              pg_temp.u('tc:' || k || ':' || cyc_n), TEN, plan_id, cyc_n, ph_i, ph->>'name', pc, cstart, lvl, delay,
              CASE WHEN delay > 0 THEN (ARRAY['ANC 1,100/mm³ on day 1 — deferred one week', 'Grade 2 mucositis — deferred one week', 'Patient request (family function)', 'Platelets 82,000/mm³ — deferred one week'])[1 + floor(pg_temp.h('dr:' || k || cyc_n) * 4)::int] END,
              cstatus, NOW(), NOW());
            IF delay > 0 THEN
              INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
              VALUES (TEN, p.id, dx_id, 'chemo_held', cstart - 7 + TIME '10:00', pr.code || ' cycle ' || cyc_n || ' deferred by 1 week',
                'Cycle deferred on day-1 review.', 'chemo_order', NULL, jsonb_build_object('protocol', pr.code, 'cycleNumber', cyc_n), 'warning', MED);
            END IF;

            tdays := pg_temp.treatment_days(ph, pc);
            FOREACH d IN ARRAY tdays LOOP
              ddate := cstart + d - 1;
              items := pg_temp.day_items(snap, ph_i, pc, d, v_bsa, wt, v_crcl, lvl);
              order_id := NULL; ostatus := NULL;
              IF ddate < today THEN
                dstatus := 'given'; ostatus := 'completed';
              ELSIF plan_on_hold AND NOT hold_used THEN
                dstatus := 'held'; hold_used := true;
              ELSIF ddate = today THEN
                -- Today's unit mid-morning: some done, some infusing, the rest in the sign-off chain.
                dstatus := 'ordered';
                ostatus := CASE
                  WHEN pg_temp.h('os:' || k || cyc_n || d) < 0.20 THEN 'completed'
                  WHEN pg_temp.h('os:' || k || cyc_n || d) < 0.35 THEN 'in_progress'
                  WHEN pg_temp.h('os:' || k || cyc_n || d) < 0.50 THEN 'pending'
                  WHEN pg_temp.h('os:' || k || cyc_n || d) < 0.70 THEN 'approved'
                  ELSE 'verified' END;
                IF ostatus = 'completed' THEN dstatus := 'given'; END IF;
              ELSIF ddate <= today + 3 AND pg_temp.h('pre:' || k || cyc_n || d) < 0.6 THEN
                dstatus := 'ordered';
                ostatus := CASE WHEN pg_temp.h('os:' || k || cyc_n || d) < 0.5 THEN 'pending' ELSE 'approved' END;
              ELSE
                dstatus := 'planned';
              END IF;

              IF ostatus IS NOT NULL THEN
                order_id := pg_temp.u('co:' || k || ':' || cyc_n || ':' || d);
                first_given := COALESCE(first_given, CASE WHEN ostatus = 'completed' THEN ddate END);
                SELECT id INTO enc_id FROM encounters WHERE patient_id = p.id AND start_time::date = ddate LIMIT 1;
                aes := '[]'::jsonb;
                IF ostatus = 'completed' AND pg_temp.h('ae:' || k || cyc_n || d) < 0.18 THEN
                  aes := jsonb_build_array(jsonb_build_object(
                    'drug', (SELECT x->>'drug' FROM jsonb_array_elements(items) x WHERE x->>'kind' = 'chemo' ORDER BY (x->>'route') <> 'IV', (x->>'sequence')::int LIMIT 1),
                    'ctcaeGrade', 1 + floor(pg_temp.h('aeg:' || k || cyc_n) * 2)::int,
                    'type', (ARRAY['Nausea', 'Fatigue', 'Infusion reaction', 'Peripheral neuropathy', 'Mucositis', 'Diarrhoea'])[1 + floor(pg_temp.h('aet:' || k || cyc_n) * 6)::int],
                    'onsetTime', to_char(ddate + TIME '12:30', 'YYYY-MM-DD"T"HH24:MI:SS"+05:30"'),
                    'description', 'Managed with supportive care; treatment completed as planned.'));
                END IF;
                INSERT INTO plugin_oncology.chemo_orders (
                  id, tenant_id, patient_id, encounter_id, protocol_id, ordering_provider, cycle_number, day_number,
                  scheduled_date, administered_at, bsa, weight, height, creatinine_clearance, cancer_diagnosis_id,
                  oncology_care_plan_id, dose_adjustments, pre_chemo_checklist, status, verified_by, verified_at,
                  approved_by, approved_at, administered_by, adverse_reactions, administration_details,
                  drug_preparation_details, nurse_verification_checklist, notes, created_at, updated_at
                ) VALUES (
                  order_id, TEN, p.id, enc_id, pr.id, MED, cyc_n, d, ddate,
                  CASE WHEN ostatus = 'completed' AND ddate = today THEN ddate + TIME '08:45' + make_interval(mins => (pg_temp.h('at:' || k || cyc_n || d) * 90)::int)
                       WHEN ostatus = 'completed' THEN ddate + TIME '10:00' + make_interval(mins => (pg_temp.h('at:' || k || cyc_n || d) * 240)::int) END,
                  v_bsa, wt, ht, v_crcl, dx_id, cp_id,
                  COALESCE((SELECT jsonb_agg(jsonb_build_object('drug', x->>'drug',
                      'adjustmentPercent', round((x->>'levelDose')::numeric / NULLIF((x->>'protocolDose')::numeric, 0) * 100),
                      'reason', 'Dose level ' || lvl))
                    FROM jsonb_array_elements(items) x
                    WHERE x->>'kind' = 'chemo' AND lvl <> 0 AND (x->>'levelDose') <> (x->>'protocolDose')), '[]'::jsonb),
                  jsonb_build_object('consentDocumented', true, 'consentDate', chemo_start - 3, 'allergiesReviewed', true,
                    'allergiesSummary', 'No known drug allergies', 'labsReviewed', ostatus <> 'pending', 'labsDate', ddate - 1,
                    'labsWithinRange', ostatus <> 'pending' AND NOT (ddate = today AND ostatus IN ('approved', 'verified') AND pg_temp.h('lab:' || k || cyc_n || d) < 0.15), 'bsaVerified', true, 'doseVerified', ostatus <> 'pending', 'premedicationsOrdered', true),
                  ostatus,
                  CASE WHEN ostatus IN ('verified', 'in_progress', 'completed') THEN NURSE2 END,
                  CASE WHEN ostatus IN ('verified', 'in_progress', 'completed') THEN ddate - 1 + TIME '17:00' END,
                  CASE WHEN ostatus IN ('approved', 'verified', 'in_progress', 'completed') THEN MED END,
                  CASE WHEN ostatus IN ('approved', 'verified', 'in_progress', 'completed') THEN ddate - 1 + TIME '15:00' END,
                  CASE WHEN ostatus IN ('in_progress', 'completed') THEN NURSE1 END,
                  aes,
                  CASE WHEN ostatus = 'completed' THEN COALESCE((SELECT jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
                      'drug', x->>'drug', 'startedAt', to_char(ddate + TIME '10:30', 'YYYY-MM-DD"T"HH24:MI:SS"+05:30"'),
                      'completedAt', to_char(ddate + TIME '10:30' + make_interval(mins => COALESCE((x->>'infusionDurationMin')::int, 30)), 'YYYY-MM-DD"T"HH24:MI:SS"+05:30"'),
                      'accessSite', CASE WHEN x->>'route' = 'IV' THEN 'Chemoport' END)))
                    FROM jsonb_array_elements(items) x WHERE x->>'kind' = 'chemo'), '[]'::jsonb) ELSE '[]'::jsonb END,
                  CASE WHEN ostatus IN ('verified', 'in_progress', 'completed') THEN COALESCE((SELECT jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
                      'drug', x->>'drug', 'preparedBy', 'Oncology pharmacy', 'preparedAt', to_char(ddate + TIME '09:15', 'YYYY-MM-DD"T"HH24:MI:SS"+05:30"'),
                      'diluent', x->>'diluent', 'finalConcentration', (x->>'calculatedDose') || ' ' || (x->>'calculatedUnit'))))
                    FROM jsonb_array_elements(items) x WHERE x->>'kind' = 'chemo' AND x->>'route' = 'IV'), '[]'::jsonb) ELSE '[]'::jsonb END,
                  CASE WHEN ostatus = 'completed' THEN '{"patientIdentityConfirmed":true,"drugMatchesProtocol":true,"doseMatchesOrder":true,"routeCorrect":true,"timeCorrect":true,"expiryChecked":true,"allergyConfirmed":true,"infusionLinePatent":true,"patientEducated":true}'::jsonb ELSE '{}'::jsonb END,
                  pr.name || ' — cycle ' || cyc_n || ', day ' || d || CASE WHEN lvl <> 0 THEN ' (dose level ' || lvl || ')' ELSE '' END,
                  ddate - 2 + TIME '16:00', CASE WHEN ostatus = 'completed' THEN ddate + TIME '15:00' ELSE NOW() END);
              END IF;

              INSERT INTO plugin_oncology.treatment_days (
                id, tenant_id, treatment_plan_id, cycle_number, cycle_day, scheduled_date, status, items, chemo_order_id, notes, created_at, updated_at
              ) VALUES (
                pg_temp.u('td:' || k || ':' || cyc_n || ':' || d), TEN, plan_id, cyc_n, d, ddate, dstatus, items, order_id,
                CASE WHEN dstatus = 'held' THEN 'Held — admitted with febrile neutropenia; review next week' END, NOW(), NOW());
              last_day := ddate;
            END LOOP;

            IF cstatus = 'completed' THEN
              INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
              VALUES (TEN, p.id, dx_id, 'chemo_completed', cstart + TIME '15:00',
                pr.code || ' cycle ' || cyc_n || ' completed', ph->>'name' || ' phase, cycle ' || pc || '.', 'chemo_order',
                pg_temp.u('co:' || k || ':' || cyc_n || ':' || tdays[1]),
                jsonb_build_object('protocol', pr.code, 'cycleNumber', cyc_n, 'dayNumber', tdays[1], 'bsa', v_bsa), 'info', MED);
            END IF;
            cstart := cstart + cdur;
          END LOOP;
        END LOOP;
        total_cycles := cyc_n;
        chemo_end := cstart - 1;
        UPDATE plugin_oncology.treatment_plans SET status = CASE WHEN plan_on_hold AND hold_used THEN 'on_hold' WHEN chemo_end < today THEN 'completed' ELSE 'active' END
        WHERE id = plan_id;
        IF first_given IS NOT NULL THEN
          INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
          VALUES (TEN, p.id, dx_id, 'chemo_started', first_given + TIME '10:00', pr.name || ' started',
            CASE WHEN step = 'CRT' THEN 'Concurrent with radiotherapy. ' ELSE '' END || 'BSA ' || v_bsa || ' m², ' || total_cycles || ' cycles planned.',
            'chemo_order', pg_temp.u('co:' || k || ':1:' || (pg_temp.treatment_days(snap->'phases'->0, 1))[1]),
            jsonb_build_object('protocol', pr.code, 'cycleNumber', 1, 'bsa', v_bsa, 'protocolTotalCycles', total_cycles), 'milestone', MED);
        END IF;
        modalities := modalities || jsonb_build_array(jsonb_strip_nulls(jsonb_build_object(
          'modality', 'chemotherapy', 'sequence', i,
          'status', CASE WHEN chemo_end < today THEN 'completed' WHEN chemo_start <= today THEN 'in_progress' ELSE 'planned' END,
          'details', CASE WHEN step = 'CRT' THEN 'Concurrent ' ELSE initcap(intent) || ' ' END || pr.name,
          'startDate', chemo_start, 'endDate', chemo_end,
          'responsibleSubspecialty', CASE WHEN t.subsp = 'hemato_oncology' THEN 'hemato_oncology' ELSE 'medical_oncology' END,
          'plannedCycles', total_cycles, 'cycleDurationDays', (snap->'phases'->0->>'cycleDurationDays')::int,
          'protocolId', pr.id, 'protocolCode', pr.code, 'protocolName', pr.name)));
      END IF;

      IF step IN ('RT', 'CRT') THEN
        rt := CASE WHEN intent = 'palliative' THEN COALESCE(t.rt_pal, t.rt) ELSE t.rt END;
        IF rt IS NOT NULL THEN
          rt_start := CASE WHEN step = 'CRT' AND chemo_start IS NOT NULL THEN chemo_start ELSE pg_temp.wd(cur) END;
          rx_id := pg_temp.u('rx:' || k); sim_id := pg_temp.u('sim:' || k); rtp_id := pg_temp.u('rtp:' || k);
          machine := (ARRAY['Linac 1 (TrueBeam)', 'Linac 2 (Halcyon)', 'Linac 3 (Elekta Versa HD)'])[1 + floor(pg_temp.h('mc:' || k) * 3)::int];
          SELECT id INTO enc_id FROM encounters WHERE patient_id = p.id ORDER BY abs(start_time::date - (rt_start - 10)), start_time LIMIT 1;
          -- Fractions, Monday to Friday.
          fdate := rt_start; delivered := 0; missed := 0;
          INSERT INTO plugin_oncology.radiation_prescriptions (
            id, tenant_id, patient_id, encounter_id, cancer_profile_id, prescription_number, treatment_intent, laterality,
            modality, technique, total_dose_gy, dose_per_fraction_gy, planned_fractions, concurrent_chemo,
            planned_start_date, planned_end_date, prescription_notes, prescribed_by, prescribed_at, approved_by, approved_at,
            status, created_at, updated_at
          ) VALUES (
            rx_id, TEN, p.id, enc_id, dx_id, 'RTX-' || to_char(rt_start, 'YY') || '-' || lpad(seqno::text, 5, '0'),
            CASE WHEN intent IN ('palliative') THEN 'palliative' WHEN intent = 'neoadjuvant' THEN 'neoadjuvant' WHEN intent = 'adjuvant' THEN 'adjuvant' ELSE 'curative' END,
            v_lat, 'PHOTON', rt->>'tech', (rt->>'dose')::numeric, round((rt->>'dose')::numeric / (rt->>'fx')::int, 2), (rt->>'fx')::int,
            step = 'CRT', rt_start, NULL,
            (rt->>'dose') || ' Gy in ' || (rt->>'fx') || ' fractions to ' || lower(rt->>'site') || CASE WHEN step = 'CRT' THEN ', concurrent with chemotherapy.' ELSE '.' END,
            RAD, rt_start - 14 + TIME '11:00', RAD, rt_start - 3 + TIME '16:00', 'APPROVED', rt_start - 14 + TIME '11:00', NOW());
          INSERT INTO plugin_oncology.radiation_simulations (
            id, tenant_id, prescription_id, simulation_date, patient_position, immobilization_device, contrast_used, scan_region,
            setup_reference, tattoo_marking_done, simulation_notes, performed_by, status, created_at, updated_at
          ) VALUES (
            sim_id, TEN, rx_id, pg_temp.wd(rt_start - 10) + TIME '09:30', split_part(rt->>'pos', ',', 1), NULLIF(trim(split_part(rt->>'pos', ',', 2)), ''),
            rt->>'region' IN ('Head and neck', 'Thorax', 'Pelvis'), rt->>'region', 'Isocentre marked; reference tattoos placed',
            pg_temp.wd(rt_start - 10) <= today, 'CT simulation, 2.5 mm slices.', RTT,
            CASE WHEN pg_temp.wd(rt_start - 10) <= today THEN 'COMPLETED' ELSE 'SCHEDULED' END, NOW(), NOW());
          INSERT INTO plugin_oncology.radiation_treatment_plans (
            id, tenant_id, prescription_id, simulation_id, external_plan_reference, planning_system, planning_status,
            planner_id, physicist_id, radiation_oncologist_id, contouring_completed, physics_qa_completed, treatment_machine,
            plan_notes, approved_by, approved_at, status, created_at, updated_at
          ) VALUES (
            rtp_id, TEN, rx_id, sim_id, 'RTP-' || to_char(rt_start, 'YY') || '-' || lpad(seqno::text, 5, '0'),
            (ARRAY['Eclipse TPS', 'Monaco TPS'])[1 + floor(pg_temp.h('tps:' || k) * 2)::int],
            CASE WHEN rt_start - 2 <= today THEN 'APPROVED' WHEN rt_start - 6 <= today THEN 'DOSIMETRY' ELSE 'CONTOURING' END,
            PHYSICIST, PHYSICIST, RAD, rt_start - 6 <= today, rt_start - 2 <= today, machine,
            (rt->>'tech') || ' plan, ' || (rt->>'dose') || ' Gy / ' || (rt->>'fx') || ' fractions; OAR constraints met.',
            CASE WHEN rt_start - 2 <= today THEN RAD END, CASE WHEN rt_start - 2 <= today THEN rt_start - 2 + TIME '17:00' END,
            'ACTIVE', NOW(), NOW());
          FOR fx IN 1 .. (rt->>'fx')::int LOOP
            fdate := pg_temp.wd(fdate);
            fstatus := CASE WHEN fdate < today THEN 'DELIVERED' WHEN fdate = today AND pg_temp.h('fxt:' || k) < 0.5 THEN 'DELIVERED' ELSE 'SCHEDULED' END;
            IF fstatus = 'DELIVERED' AND pg_temp.h('miss:' || k || ':' || fx) < 0.015 THEN fstatus := 'MISSED'; END IF;
            IF fstatus = 'DELIVERED' THEN delivered := delivered + 1; ELSIF fstatus = 'MISSED' THEN missed := missed + 1; END IF;
            INSERT INTO plugin_oncology.radiation_fractions (
              id, tenant_id, treatment_plan_id, fraction_number, planned_date, actual_date, planned_dose_gy, delivered_dose_gy,
              treatment_machine, radiation_therapist_id, status, interruption_reason, verification_completed, created_at, updated_at
            ) VALUES (
              pg_temp.u('fx:' || k || ':' || fx), TEN, rtp_id, fx, fdate,
              CASE WHEN fstatus = 'DELIVERED' THEN fdate + TIME '08:00' + make_interval(mins => (pg_temp.h('ft:' || k) * 480)::int) END,
              round((rt->>'dose')::numeric / (rt->>'fx')::int, 2),
              CASE WHEN fstatus = 'DELIVERED' THEN round((rt->>'dose')::numeric / (rt->>'fx')::int, 2) END,
              machine, RTT, fstatus, CASE WHEN fstatus = 'MISSED' THEN (ARRAY['Linac breakdown — fraction to be compensated', 'Patient unwell (dehydration) — did not attend'])[1 + floor(pg_temp.h('mr:' || k) * 2)::int] END,
              fstatus = 'DELIVERED', NOW(), NOW());
            rt_end := fdate;
            fdate := fdate + 1;
          END LOOP;
          rx_status := CASE WHEN rt_end < today THEN 'COMPLETED' WHEN rt_start <= today THEN 'ACTIVE' ELSE 'APPROVED' END;
          UPDATE plugin_oncology.radiation_prescriptions SET planned_end_date = rt_end, status = rx_status WHERE id = rx_id;
          UPDATE plugin_oncology.radiation_treatment_plans SET status = CASE WHEN rx_status = 'COMPLETED' THEN 'COMPLETED' ELSE 'ACTIVE' END WHERE id = rtp_id;
          -- Weekly on-treatment reviews.
          FOR wk IN 1 .. ceil((rt->>'fx')::int / 5.0)::int LOOP
            EXIT WHEN rt_start + 7 * wk - 3 > today OR rt_start + 7 * wk - 3 > rt_end + 3;
            INSERT INTO plugin_oncology.radiation_on_treatment_reviews (
              id, tenant_id, prescription_id, review_date, week_number, toxicity_grade, pain_score, weight_kg,
              treatment_break_required, review_notes, reviewed_by, created_at, updated_at
            ) VALUES (
              pg_temp.u('rvw:' || k || ':' || wk), TEN, rx_id, rt_start + 7 * wk - 3 + TIME '14:00', wk,
              'Grade ' || LEAST(3, 1 + (wk - 1) / 2) || ' ' || lower(COALESCE(t.rt_tox, 'fatigue')),
              LEAST(7, 1 + wk), wt - round((wk * 0.6)::numeric, 1), false,
              CASE WHEN wk >= 4 THEN 'Symptomatic care intensified; nutrition review. Continue treatment.' ELSE 'Tolerating treatment. Continue as planned.' END,
              RAD, NOW(), NOW());
          END LOOP;
          IF rx_status = 'COMPLETED' THEN
            INSERT INTO plugin_oncology.radiation_completion_summaries (
              id, tenant_id, prescription_id, completion_date, planned_total_dose_gy, delivered_total_dose_gy, planned_fractions,
              delivered_fractions, interruptions, interruption_notes, acute_toxicity_summary, response_assessment_plan, followup_plan,
              completed_by, created_at, updated_at
            ) VALUES (
              pg_temp.u('rcs:' || k), TEN, rx_id, rt_end, (rt->>'dose')::numeric,
              round((rt->>'dose')::numeric / (rt->>'fx')::int * delivered, 2), (rt->>'fx')::int, delivered, missed > 0,
              CASE WHEN missed > 0 THEN missed || ' fraction(s) missed.' END,
              'Peak ' || lower(COALESCE(t.rt_tox, 'fatigue')) || ', grade ' || LEAST(3, 1 + ((rt->>'fx')::int / 5 - 1) / 2) || ', settling.',
              'Response assessment with ' || t.imaging || ' at 8-12 weeks.', 'Review in radiation oncology OPD at 6 weeks, then every 3 months.',
              RAD, NOW(), NOW());
          END IF;
          INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
          VALUES (TEN, p.id, dx_id, 'radiation_prescribed', rt_start - 14 + TIME '11:00',
            'Radiotherapy prescribed — ' || (rt->>'dose') || ' Gy / ' || (rt->>'fx') || ' fractions', rt->>'site',
            'radiation_prescription', rx_id,
            jsonb_build_object('totalDoseGy', (rt->>'dose')::numeric, 'plannedFractions', (rt->>'fx')::int, 'modality', 'PHOTON', 'technique', rt->>'tech'), 'info', RAD);
          IF rt_start <= today THEN
            INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
            VALUES (TEN, p.id, dx_id, 'radiation_started', rt_start + TIME '09:00', 'Radiotherapy started (' || (rt->>'tech') || ')', machine,
              'radiation_prescription', rx_id, jsonb_build_object('totalDoseGy', (rt->>'dose')::numeric, 'plannedFractions', (rt->>'fx')::int, 'modality', 'PHOTON', 'technique', rt->>'tech'), 'milestone', RAD);
          END IF;
          IF rx_status = 'COMPLETED' THEN
            INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
            VALUES (TEN, p.id, dx_id, 'radiation_completed', rt_end + TIME '12:00', 'Radiotherapy completed — ' || delivered || '/' || (rt->>'fx') || ' fractions',
              CASE WHEN missed > 0 THEN missed || ' fraction(s) missed.' ELSE 'No interruptions.' END,
              'radiation_prescription', rx_id, jsonb_build_object('totalDoseGy', (rt->>'dose')::numeric, 'plannedFractions', (rt->>'fx')::int, 'modality', 'PHOTON', 'technique', rt->>'tech'), 'milestone', RAD);
          END IF;
          modalities := modalities || jsonb_build_array(jsonb_build_object(
            'modality', 'radiation', 'sequence', i,
            'status', CASE WHEN rt_end < today THEN 'completed' WHEN rt_start <= today THEN 'in_progress' ELSE 'planned' END,
            'details', (rt->>'tech') || ' ' || (rt->>'dose') || ' Gy / ' || (rt->>'fx') || ' fractions — ' || (rt->>'site'),
            'startDate', rt_start, 'endDate', rt_end, 'responsibleSubspecialty', 'radiation_oncology', 'plannedFractions', (rt->>'fx')::int));
          cur := GREATEST(rt_end, COALESCE(chemo_end, rt_end)) + 28;
        ELSIF chemo_end IS NOT NULL THEN
          cur := chemo_end + 21;
        END IF;
      ELSIF step = 'C' AND chemo_end IS NOT NULL THEN
        cur := chemo_end + 21;
      END IF;

      IF step = 'H' AND t.hormonal IS NOT NULL THEN
        horm_start := pg_temp.wd(CASE WHEN i = 1 THEN cur ELSE cur - 14 END);
        modalities := modalities || jsonb_build_array(jsonb_build_object(
          'modality', 'hormonal', 'sequence', i, 'status', CASE WHEN horm_start <= today THEN 'in_progress' ELSE 'planned' END,
          'details', CASE WHEN t.key = 'BRHR' AND v_age < 50 THEN 'Tamoxifen 20 mg PO daily (5 years)' ELSE t.hormonal END,
          'startDate', horm_start, 'responsibleSubspecialty', 'medical_oncology'));
        IF i = 1 THEN cur := horm_start + 60; END IF; -- neoadjuvant ADT before prostate RT
      END IF;
      IF step = 'T' AND v_targeted IS NOT NULL THEN
        targ_start := pg_temp.wd(cur);
        modalities := modalities || jsonb_build_array(jsonb_build_object(
          'modality', 'targeted', 'sequence', i, 'status', CASE WHEN targ_start <= today THEN 'in_progress' ELSE 'planned' END,
          'details', v_targeted, 'startDate', targ_start,
          'responsibleSubspecialty', CASE WHEN t.subsp = 'hemato_oncology' THEN 'hemato_oncology' ELSE 'medical_oncology' END));
      END IF;
    END LOOP;

    -- HER2+: trastuzumab maintenance after TCH.
    IF t.key = 'BRHER2' AND chemo_end IS NOT NULL AND intent <> 'palliative' THEN
      modalities := modalities || jsonb_build_array(jsonb_build_object(
        'modality', 'targeted', 'sequence', jsonb_array_length(modalities) + 1,
        'status', CASE WHEN chemo_end < today THEN 'in_progress' ELSE 'planned' END,
        'details', t.targeted, 'startDate', chemo_end + 1, 'responsibleSubspecialty', 'medical_oncology'));
    END IF;

    final_end := GREATEST(surg_date, chemo_end, rt_end);

    -- Surgery in the OT module (request → schedule → signed report).
    IF surg_date IS NOT NULL THEN
      SELECT id INTO enc_id FROM encounters WHERE patient_id = p.id ORDER BY abs(start_time::date - surg_date), start_time LIMIT 1;
      INSERT INTO ot_requests (
        id, tenant_id, patient_id, encounter_id, requested_by, requested_at, surgery_type, procedure_name, diagnosis, priority,
        expected_duration_minutes, preferred_date, preferred_ot_room_space_id, primary_surgeon_id, anaesthetist_required,
        anaesthesia_type_planned, special_equipment_required, blood_required, implants_required, remarks, status,
        approved_by, approved_at, completed_by, completed_at, created_at, updated_at, created_by, updated_by
      ) VALUES (
        pg_temp.u('otq:' || p.id), TEN, p.id, enc_id, SURG, tb_date + 1 + TIME '12:00', 'Major',
        (SELECT m->>'details' FROM jsonb_array_elements(modalities) m WHERE m->>'modality' = 'surgery' LIMIT 1),
        'Stage ' || s.grp || ' ' || t.cancer_type || ' (' || v_icd || ')', 'ELECTIVE', 180 + floor(pg_temp.h('dur:' || k) * 4)::int * 30,
        surg_date, (ARRAY['09f2300a-5f6a-5d24-a1ae-f14367ef932e', '4cb5b98f-4fe2-56d3-aa74-c946bcfbbc41', 'bdb85f1c-f8d0-5a04-9712-35dbb04254d3'])[1 + floor(pg_temp.h('ot:' || k) * 3)::int]::uuid,
        SURG, true, 'General', '[]'::jsonb, true, '[]'::jsonb, 'Per MDT of ' || to_char(tb_date, 'DD Mon YYYY') || '.',
        (CASE WHEN surg_date < today THEN 'COMPLETED' ELSE 'SCHEDULED' END)::"OTRequestStatus",
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, tb_date + 2 + TIME '10:00',
        CASE WHEN surg_date < today THEN SURG END, CASE WHEN surg_date < today THEN surg_date + TIME '13:00' END,
        tb_date + 1 + TIME '12:00', NOW(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid);
      INSERT INTO ot_schedules (
        id, tenant_id, ot_request_id, patient_id, encounter_id, ot_room_space_id, scheduled_start_time, scheduled_end_time,
        actual_start_time, actual_end_time, primary_surgeon_id, assistant_surgeon_ids, anaesthesia_type, schedule_status,
        is_current, created_at, updated_at, created_by, updated_by
      ) SELECT pg_temp.u('ots:' || p.id), TEN, r.id, p.id, enc_id, r.preferred_ot_room_space_id,
          surg_date + TIME '08:00' + make_interval(hours => floor(pg_temp.h('slot:' || k) * 3)::int * 3),
          surg_date + TIME '08:00' + make_interval(hours => floor(pg_temp.h('slot:' || k) * 3)::int * 3, mins => r.expected_duration_minutes),
          CASE WHEN surg_date < today THEN surg_date + TIME '08:10' + make_interval(hours => floor(pg_temp.h('slot:' || k) * 3)::int * 3) END,
          CASE WHEN surg_date < today THEN surg_date + TIME '08:10' + make_interval(hours => floor(pg_temp.h('slot:' || k) * 3)::int * 3, mins => r.expected_duration_minutes + 15) END,
          SURG, '{}', 'General', (CASE WHEN surg_date < today THEN 'SURGERY_COMPLETED' ELSE 'CONFIRMED' END)::"OTScheduleStatus",
          true, r.created_at, NOW(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
        FROM ot_requests r WHERE r.id = pg_temp.u('otq:' || p.id);
      UPDATE ot_requests SET active_schedule_id = pg_temp.u('ots:' || p.id) WHERE id = pg_temp.u('otq:' || p.id);
      IF surg_date < today THEN
        INSERT INTO ot_reports (id, tenant_id, schedule_id, ot_request_id, patient_id, encounter_id, report_number, report_status,
          signed_by, signed_at, remarks, created_at, updated_at, created_by, updated_by)
        VALUES (pg_temp.u('otr:' || p.id), TEN, pg_temp.u('ots:' || p.id), pg_temp.u('otq:' || p.id), p.id, enc_id,
          'OTR-' || to_char(surg_date, 'YY') || '-' || lpad(seqno::text, 5, '0'), 'SIGNED', SURG, surg_date + TIME '16:00',
          (SELECT m->>'details' FROM jsonb_array_elements(modalities) m WHERE m->>'modality' = 'surgery' LIMIT 1) || ' completed uneventfully; specimen sent for histopathology.',
          surg_date + TIME '16:00', surg_date + TIME '16:00', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid);
      END IF;
    END IF;

    -- Surgery and pathological staging.
    IF surg_date IS NOT NULL AND surg_date < today THEN
      INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
      VALUES (TEN, p.id, dx_id, 'custom', surg_date + TIME '09:00', 'Surgery — ' || (SELECT m->>'details' FROM jsonb_array_elements(modalities) m WHERE m->>'modality' = 'surgery' LIMIT 1),
        'Uneventful post-operative recovery; discharged on day ' || (4 + floor(pg_temp.h('los:' || k) * 5)::int) || '.', 'manual', NULL,
        jsonb_build_object('category', 'surgery'), 'milestone', SURG);
      IF surg_date + 7 <= today AND s.t IS NOT NULL THEN
        INSERT INTO plugin_oncology.tumor_staging (
          id, tenant_id, cancer_diagnosis_id, patient_id, encounter_id, provider_id, staging_system, staging_edition,
          staging_type, stage_group, t_category, n_category, m_category, body_site, grade, histology, staging_date, status, notes, created_at, updated_at
        ) VALUES (
          pg_temp.u('pstg:' || k), TEN, dx_id, p.id, NULL, SURG, t.stg_sys, t.stg_ed, 'pathological', s.grp,
          regexp_replace(s.t, '^p?T', ''), regexp_replace(s.n, '^N', ''), regexp_replace(s.m, '^M', ''),
          site->>'s', v_grade, t.histology, surg_date + 7, 'active',
          CASE WHEN intent = 'neoadjuvant' THEN 'Post-neoadjuvant (yp) staging. ' ELSE '' END || 'Final histopathology: margins free (closest ' || (2 + floor(pg_temp.h('mar:' || k) * 8)::int) || ' mm); '
            || (floor(pg_temp.h('ln:' || k) * 4)::int) || '/' || (12 + floor(pg_temp.h('lnt:' || k) * 20)::int) || ' lymph nodes positive.',
          surg_date + 7 + TIME '15:00', surg_date + 7 + TIME '15:00');
      END IF;
    END IF;

    -- Tumour board.
    decision := (SELECT string_agg(seg, ', followed by ' ORDER BY sq) FROM (
      SELECT (m->>'sequence')::int AS sq,
        CASE WHEN COUNT(*) FILTER (WHERE m->>'modality' IN ('chemotherapy', 'radiation')) = 2 THEN
          'concurrent chemoradiation (' || MAX(CASE WHEN m->>'modality' = 'radiation' THEN split_part(m->>'details', ' — ', 1) END)
            || ' with ' || MAX(CASE WHEN m->>'modality' = 'chemotherapy' THEN m->>'protocolCode' END) || ')'
        ELSE string_agg(CASE m->>'modality'
          WHEN 'surgery' THEN 'surgery (' || lower(m->>'details') || ')'
          WHEN 'chemotherapy' THEN lower(left(m->>'details', 1)) || substr(m->>'details', 2)
          WHEN 'radiation' THEN 'radiotherapy ' || split_part(m->>'details', ' — ', 1)
          WHEN 'hormonal' THEN 'endocrine therapy (' || (m->>'details') || ')'
          WHEN 'targeted' THEN 'targeted therapy (' || (m->>'details') || ')'
        END, ' and ') END AS seg
      FROM jsonb_array_elements(modalities) m GROUP BY 1) x);
    decision := upper(left(decision, 1)) || substr(decision, 2);
    v_short := left((SELECT string_agg(CASE st
          WHEN 'S' THEN 'Surgery' WHEN 'RT' THEN 'RT' WHEN 'CRT' THEN 'Concurrent CRT' WHEN 'H' THEN 'Endocrine therapy' WHEN 'T' THEN 'Targeted therapy'
          ELSE CASE intent WHEN 'neoadjuvant' THEN 'Neoadjuvant chemo' WHEN 'adjuvant' THEN 'Adjuvant chemo' WHEN 'palliative' THEN 'Palliative chemo' ELSE 'Chemotherapy' END
        END, ' → ' ORDER BY ord) FROM unnest(steps) WITH ORDINALITY AS u(st, ord)), 100);
    tb_status := CASE WHEN tb_date > today THEN 'scheduled' WHEN tb_date = today THEN 'in_review' ELSE 'completed' END;
    INSERT INTO plugin_oncology.tumor_board_cases (
      id, tenant_id, patient_id, cancer_diagnosis_id, staging_id, meeting_date, presented_by, attendees, clinical_summary,
      imaging_findings, pathology_report, molecular_profile, mdt_recommendation, treatment_intent, recommended_pathway,
      treatment_plan, decision, review_outcome, follow_up_actions, status, created_at, updated_at
    ) VALUES (
      tb_id, TEN, p.id, dx_id, stg_id, tb_date, doc,
      jsonb_build_array(jsonb_build_object('staffId', SURG, 'role', 'Surgeon', 'specialty', 'Surgical Oncology'),
                        jsonb_build_object('staffId', MED, 'role', 'Medical Oncologist', 'specialty', 'Medical Oncology'),
                        jsonb_build_object('staffId', RAD, 'role', 'Radiation Oncologist', 'specialty', 'Radiation Oncology'),
                        jsonb_build_object('staffId', PHYS, 'role', 'Radiologist', 'specialty', 'Radiology')),
      v_age || '-year-old ' || CASE WHEN sex = 'F' THEN 'woman' ELSE 'man' END || ' presenting with ' || lower(t.symptom) || '. '
        || COALESCE(t.risk || '. ', '') || 'ECOG ' || ecog || '.',
      t.imaging || ': ' || CASE WHEN s.t IS NOT NULL THEN 'c' || s.t || ' c' || s.n || ' c' || s.m || ', ' ELSE '' END || 'stage ' || s.grp
        || CASE s.met WHEN 'distant' THEN ' with distant disease.' WHEN 'regional' THEN ' with regional nodal disease.' ELSE ', localised disease.' END,
      t.histology || COALESCE(', ' || v_grade, '') || ' (' || t.workup || ').',
      bio_text,
      CASE WHEN tb_status <> 'scheduled' THEN COALESCE(decision, 'Best supportive care') END,
      CASE WHEN tb_status <> 'scheduled' THEN intent END,
      CASE WHEN tb_status <> 'scheduled' THEN modalities ELSE '[]'::jsonb END,
      CASE WHEN tb_status <> 'scheduled' THEN jsonb_build_object('intent', intent, 'summary', COALESCE(decision, 'Best supportive care')) ELSE '{}'::jsonb END,
      CASE WHEN tb_status = 'completed' THEN v_short END,
      CASE WHEN tb_status = 'completed' THEN 'consensus' END,
      CASE WHEN tb_status = 'completed' THEN jsonb_build_array('Counsel patient and family; obtain consent', 'Financial counselling / scheme enrolment (PM-JAY)')
        || CASE WHEN rt_start IS NOT NULL AND t.rt->>'region' = 'Head and neck' THEN jsonb_build_array('Dental evaluation before radiotherapy') ELSE '[]'::jsonb END
        || CASE WHEN surg_date IS NOT NULL THEN jsonb_build_array('Pre-anaesthetic check-up and OT booking') ELSE '[]'::jsonb END
        || CASE WHEN chemo_start IS NOT NULL THEN jsonb_build_array('Chemoport insertion; book day-care chair') ELSE '[]'::jsonb END
      ELSE '[]'::jsonb END,
      tb_status, tb_date - 6 + TIME '10:00', tb_date + TIME '17:00');
    INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
    VALUES (TEN, p.id, dx_id, CASE WHEN tb_status = 'completed' THEN 'tumor_board_decision' ELSE 'tumor_board' END, tb_date + TIME '16:00',
      CASE WHEN tb_status = 'completed' THEN 'MDT decision: ' || v_short ELSE 'Scheduled for multidisciplinary tumour board' END,
      CASE WHEN tb_status = 'completed' THEN initcap(intent) || ' intent. ' || COALESCE(decision, 'Best supportive care') || '.' ELSE NULL END, 'tumor_board_case', tb_id, jsonb_build_object('intent', intent), 'info', doc);

    -- Care plan (once the MDT has met).
    IF tb_date <= today THEN
      cp_status := CASE WHEN tb_date >= today - 2 THEN 'draft'
                        WHEN plan_on_hold AND hold_used THEN 'on_hold'
                        WHEN final_end < today AND horm_start IS NULL AND targ_start IS NULL AND NOT (t.key = 'BRHER2' AND intent <> 'palliative') THEN 'completed'
                        ELSE 'active' END;
      milestones := jsonb_build_array(jsonb_build_object('name', 'Multidisciplinary tumour board', 'targetDate', tb_date, 'status', 'completed', 'completedDate', tb_date));
      IF surg_date IS NOT NULL THEN milestones := milestones || jsonb_build_array(jsonb_strip_nulls(jsonb_build_object('name', 'Surgery', 'targetDate', surg_date,
        'status', CASE WHEN surg_date < today THEN 'completed' ELSE 'pending' END, 'completedDate', CASE WHEN surg_date < today THEN surg_date END))); END IF;
      IF chemo_start IS NOT NULL THEN milestones := milestones || jsonb_build_array(
        jsonb_strip_nulls(jsonb_build_object('name', 'Start ' || proto_code, 'targetDate', chemo_start, 'status', CASE WHEN chemo_start <= today THEN 'completed' ELSE 'pending' END, 'completedDate', CASE WHEN chemo_start <= today THEN chemo_start END)),
        jsonb_strip_nulls(jsonb_build_object('name', 'Interim response assessment', 'targetDate', chemo_start + (chemo_end - chemo_start) / 2, 'status', CASE WHEN chemo_start + (chemo_end - chemo_start) / 2 < today THEN 'completed' ELSE 'pending' END))); END IF;
      IF rt_start IS NOT NULL THEN milestones := milestones || jsonb_build_array(jsonb_strip_nulls(jsonb_build_object('name', 'Complete radiotherapy', 'targetDate', rt_end,
        'status', CASE WHEN rt_end < today THEN 'completed' ELSE 'pending' END, 'completedDate', CASE WHEN rt_end < today THEN rt_end END))); END IF;
      IF final_end IS NOT NULL THEN milestones := milestones || jsonb_build_array(jsonb_build_object('name', 'End-of-treatment response assessment', 'targetDate', final_end + 42,
        'status', CASE WHEN final_end + 42 < today THEN 'completed' ELSE 'pending' END)); END IF;
      INSERT INTO plugin_oncology.oncology_care_plans (
        id, tenant_id, patient_id, cancer_diagnosis_id, tumor_board_case_id, plan_number, version, treatment_intent,
        oncology_subspecialty, planned_modalities, planned_cycles, cycle_duration_days, milestones, follow_up_schedule,
        status, start_date, end_date, created_by, approved_by, approved_at, notes, created_at, updated_at
      ) VALUES (
        cp_id, TEN, p.id, dx_id, tb_id, 'CP-' || to_char(tb_date, 'YY') || '-' || lpad(seqno::text, 5, '0'), 1, intent,
        CASE WHEN t.key IN ('CERVIX', 'OVARY', 'ENDOMET') THEN 'gynec_oncology' ELSE t.subsp END,
        modalities, total_cycles, (snap->'phases'->0->>'cycleDurationDays')::int, milestones,
        CASE WHEN intent = 'palliative' THEN '[{"intervalWeeks":4,"type":"Palliative care and symptom review"},{"intervalWeeks":12,"type":"Restaging imaging"}]'::jsonb
             ELSE '[{"intervalWeeks":12,"type":"Clinical review with tumour marker","notes":"Years 1-2"},{"intervalWeeks":26,"type":"Imaging (CECT / PET-CT)","notes":"Years 1-3"},{"intervalWeeks":52,"type":"Survivorship clinic","notes":"From year 3"}]'::jsonb END,
        cp_status, tx_start, final_end, doc,
        CASE WHEN cp_status <> 'draft' THEN MED END, CASE WHEN cp_status <> 'draft' THEN tb_date + 1 + TIME '11:00' END,
        initcap(intent) || ' intent per MDT of ' || to_char(tb_date, 'DD Mon YYYY') || ': ' || COALESCE(decision, 'supportive care') || '.',
        tb_date + 1 + TIME '10:00', NOW());
      INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
      VALUES (TEN, p.id, dx_id, 'care_plan_created', tb_date + 1 + TIME '10:00', 'Care plan CP-' || to_char(tb_date, 'YY') || '-' || lpad(seqno::text, 5, '0') || ' created',
        initcap(intent) || '-intent plan.', 'oncology_care_plan', cp_id, jsonb_build_object('treatmentIntent', intent), 'info', doc);
      IF cp_status <> 'draft' THEN
        INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
        VALUES (TEN, p.id, dx_id, 'care_plan_approved', tb_date + 1 + TIME '11:00', 'Care plan approved', NULL, 'oncology_care_plan', cp_id,
          jsonb_build_object('treatmentIntent', intent), 'info', MED);
      END IF;
    END IF;

    -- Response, and the diagnosis status that follows from it.
    IF final_end IS NOT NULL AND final_end + 42 <= today THEN
      INSERT INTO plugin_oncology.cancer_timeline_events (tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date, title, description, source_entity, source_id, metadata, severity, created_by)
      VALUES (TEN, p.id, dx_id, CASE WHEN outcome = 'progression' THEN 'custom' ELSE 'response_assessment' END, final_end + 42 + TIME '12:00',
        CASE outcome WHEN 'response' THEN CASE WHEN intent = 'palliative' THEN 'Partial response on restaging' ELSE 'Complete response — no evidence of disease' END
                     WHEN 'stable' THEN 'Stable disease on restaging' ELSE 'Disease progression on restaging' END,
        t.imaging || ' after completion of treatment.' || CASE WHEN outcome = 'progression' THEN ' Re-discussion at tumour board planned; second-line options reviewed.' ELSE '' END,
        'manual', NULL, jsonb_build_object('category', 'response', 'outcome', outcome),
        CASE WHEN outcome = 'progression' THEN 'warning' ELSE 'milestone' END, doc);
      UPDATE plugin_oncology.cancer_diagnoses
      SET clinical_status = CASE WHEN outcome = 'response' AND intent <> 'palliative' THEN 'remission' ELSE 'active' END
      WHERE id = dx_id;
    END IF;

    -- Tumour-marker trend.
    IF t.marker IS NOT NULL THEN
      v0 := (t.marker->>'hi')::numeric * CASE s.met WHEN 'localized' THEN 0.7 + pg_temp.h('m0:' || k) * 1.3
                                                    WHEN 'regional' THEN 1.5 + pg_temp.h('m0:' || k) * 4
                                                    ELSE 4 + pg_temp.h('m0:' || k) * 20 END;
      obs_date := stg_date;
      WHILE obs_date <= today LOOP
        days_since := GREATEST(0, obs_date - COALESCE(tx_start, obs_date));
        obs_val := CASE
          WHEN obs_date < tx_start THEN v0
          WHEN outcome = 'response' THEN GREATEST((t.marker->>'hi')::numeric * (0.2 + pg_temp.h('mf:' || k) * 0.4), v0 * exp(-days_since / 55.0))
          WHEN outcome = 'stable' THEN v0 * (0.75 + 0.25 * pg_temp.h('ms:' || k || obs_date))
          ELSE CASE WHEN days_since < 120 THEN v0 * (1 - days_since / 300.0) ELSE v0 * (0.6 + (days_since - 120) / 90.0) END
        END;
        obs_val := round(obs_val * (0.95 + 0.1 * pg_temp.h('mn:' || k || obs_date))::numeric, 1);
        SELECT id INTO enc_id FROM encounters WHERE patient_id = p.id ORDER BY abs(start_time::date - obs_date), start_time LIMIT 1;
        order_id := pg_temp.u('mko:' || p.id || ':' || obs_date);
        INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name,
          priority, status, result_status, ordered_by, ordered_at, performed_at, resulted_at, created_at, updated_at)
        VALUES (order_id, TEN, enc_id, p.id, 'lab', t.marker->>'code', 'LOINC', t.marker->>'name', 'routine', 'completed', 'final',
          doc, obs_date + TIME '08:00', obs_date + TIME '08:30', obs_date + TIME '13:00', obs_date + TIME '08:00', obs_date + TIME '13:00');
        INSERT INTO lab_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, specimen_type,
          collection_date, received_date, reported_by, reported_at, verified_at, created_at, updated_at)
        VALUES (pg_temp.u('mkr:' || order_id), TEN, order_id, enc_id, p.id, 'FINAL', 1, 'Serum',
          obs_date + TIME '08:30', obs_date + TIME '09:00', doc, obs_date + TIME '13:00', obs_date + TIME '13:30', obs_date + TIME '08:30', obs_date + TIME '13:30');
        INSERT INTO lab_result_items (id, tenant_id, lab_report_id, sort_order, test_code, code_system, test_name, value_numeric, unit,
          ref_range_low, ref_range_high, abnormal_flag, critical_flag, created_at, updated_at)
        VALUES (pg_temp.u('mki:' || order_id), TEN, pg_temp.u('mkr:' || order_id), 1, t.marker->>'code', 'LOINC', t.marker->>'name',
          obs_val, t.marker->>'unit', 0, (t.marker->>'hi')::numeric, obs_val > (t.marker->>'hi')::numeric, false, obs_date + TIME '13:00', obs_date + TIME '13:00');
        INSERT INTO clinical_observations (
          id, tenant_id, patient_id, encounter_id, order_id, code, code_system, display_name, category, value_numeric, unit,
          ref_range_low, ref_range_high, interpretation, observed_at, observed_by, source_type, source_id, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), TEN, p.id, enc_id, order_id, t.marker->>'code', 'LOINC', t.marker->>'name', 'laboratory', obs_val, t.marker->>'unit',
          0, (t.marker->>'hi')::numeric, CASE WHEN obs_val > (t.marker->>'hi')::numeric THEN 'high' ELSE 'normal' END,
          obs_date + TIME '08:30', doc, 'encounter', MARKER_SRC, obs_date + TIME '08:30', obs_date + TIME '08:30');
        obs_date := obs_date + CASE WHEN obs_date < COALESCE(final_end, today) THEN 42 ELSE 90 END;
      END LOOP;
    END IF;

    -- Oncology context on the patient's encounters.
    FOR e IN SELECT id, start_time::date AS day, encounter_class FROM encounters WHERE patient_id = p.id ORDER BY start_time LOOP
      dxcode := v_icd; dxname := v_dxname; dxtype := 'primary'; ip_reason := NULL;
      IF e.day < dx_date THEN
        cc := t.symptom; v_notes := 'Evaluation for suspected malignancy. ' || t.workup || ' and ' || t.imaging || ' advised.';
        dxcode := 'Z03.1'; dxname := 'Observation for suspected malignant neoplasm';
      ELSIF surg_date IS NOT NULL AND e.day BETWEEN surg_date - 1 AND surg_date + 10 THEN
        cc := CASE WHEN e.encounter_class = 'IMP' THEN 'Admitted for ' ELSE 'Post-operative review after ' END
              || lower((SELECT m->>'details' FROM jsonb_array_elements(modalities) m WHERE m->>'modality' = 'surgery' LIMIT 1));
        v_notes := 'Stage ' || s.grp || ' ' || t.cancer_type || '. ' || initcap(intent) || ' intent.';
      ELSIF chemo_start IS NOT NULL AND e.day BETWEEN chemo_start AND chemo_end THEN
        IF e.encounter_class = 'IMP' THEN
          ip_reason := (ARRAY['Febrile neutropenia after chemotherapy', 'Chemotherapy-induced vomiting with dehydration', 'Grade 3 mucositis — unable to take orally'])[1 + floor(pg_temp.h('ip:' || e.id) * 3)::int];
          cc := ip_reason; dxcode := CASE WHEN ip_reason LIKE 'Febrile%' THEN 'D70.1' WHEN ip_reason LIKE 'Chemo%' THEN 'R11.2' ELSE 'K12.31' END;
          dxname := CASE WHEN ip_reason LIKE 'Febrile%' THEN 'Agranulocytosis secondary to cancer chemotherapy' WHEN ip_reason LIKE 'Chemo%' THEN 'Nausea with vomiting' ELSE 'Oral mucositis due to antineoplastic therapy' END;
        ELSE
          cc := 'Chemotherapy review — ' || proto_code || ' cycle ' || COALESCE((SELECT MAX(tc.cycle_number) FROM plugin_oncology.treatment_cycles tc WHERE tc.treatment_plan_id = plan_id AND tc.planned_start_date <= e.day), 1);
          dxcode := 'Z51.11'; dxname := 'Encounter for antineoplastic chemotherapy';
        END IF;
        v_notes := 'On ' || proto_code || ' for stage ' || s.grp || ' ' || t.cancer_type || '. BSA ' || v_bsa || ' m².';
      ELSIF rt_start IS NOT NULL AND e.day BETWEEN rt_start AND rt_end THEN
        cc := 'Weekly on-treatment review during radiotherapy'; v_notes := (t.rt->>'tech') || ' to ' || lower(t.rt->>'site') || '.';
        dxcode := 'Z51.0'; dxname := 'Encounter for antineoplastic radiation therapy';
      ELSIF final_end IS NOT NULL AND e.day > final_end THEN
        IF e.encounter_class = 'IMP' THEN
          cc := CASE WHEN intent = 'palliative' THEN 'Admitted for pain and symptom control' ELSE 'Admitted for evaluation of new symptoms' END;
        ELSIF intent = 'palliative' THEN
          cc := 'Palliative care review — pain and symptom management';
        ELSIF e.day <= final_end + 42 THEN
          cc := 'Post-treatment review — recovering from acute effects; response assessment due ' || to_char(final_end + 42, 'DD Mon YYYY');
        ELSIF outcome = 'progression' THEN
          cc := 'Follow-up: evaluation of suspected disease progression';
        ELSIF horm_start IS NOT NULL OR targ_start IS NOT NULL THEN
          cc := 'Oncology review on ' || COALESCE(CASE WHEN t.key = 'BRHR' AND v_age < 50 THEN 'Tamoxifen 20 mg PO daily' END, t.hormonal, v_targeted) || ' — no evidence of disease';
        ELSIF outcome = 'progression' AND e.day > final_end + 42 THEN
          cc := 'Follow-up: evaluation of suspected disease progression';
        ELSE
          cc := 'Follow-up after completion of treatment — clinically no evidence of disease';
        END IF;
        v_notes := 'Stage ' || s.grp || ' ' || t.cancer_type || ', treated with ' || COALESCE(decision, 'supportive care') || '.';
      ELSIF e.encounter_class = 'IMP' THEN
        cc := CASE WHEN horm_start IS NOT NULL OR targ_start IS NOT NULL THEN 'Admitted for supportive care' ELSE 'Admitted for pre-treatment optimisation (nutrition, anaemia correction)' END;
        v_notes := 'Stage ' || s.grp || ' ' || t.cancer_type || '.';
      ELSE
        cc := CASE WHEN tb_date >= e.day THEN 'Review of histopathology and staging — ' || t.cancer_type
                   WHEN e.day >= COALESCE(horm_start, targ_start) THEN 'Oncology review on ' || COALESCE(CASE WHEN t.key = 'BRHR' AND v_age < 50 THEN 'Tamoxifen 20 mg PO daily' END, t.hormonal, v_targeted)
                   WHEN surg_date IS NOT NULL AND e.day > surg_date THEN 'Post-operative review — histopathology discussed; adjuvant treatment planned'
                   WHEN e.day > tx_start THEN 'Interval review between treatment phases — planning next modality'
                   ELSE 'Pre-treatment counselling and work-up' END;
        v_notes := 'Stage ' || s.grp || ' ' || t.cancer_type || '. ' || COALESCE(bio_text || '. ', '') || 'MDT: ' || COALESCE(decision, 'awaited') || '.';
      END IF;
      UPDATE encounters SET chief_complaint = left(cc, 500), presenting_symptoms = left(t.symptom, 500), notes = v_notes,
        medical_history = left(t.cancer_type || ' (stage ' || s.grp || ', diagnosed ' || to_char(dx_date, 'Mon YYYY') || ')' || COALESCE('; ' || t.risk, ''), 500)
      WHERE id = e.id;
      INSERT INTO encounter_diagnoses (id, tenant_id, encounter_id, patient_id, icd_code, icd_version, diagnosis_name, diagnosis_type,
        diagnosis_rank, is_chronic, onset_date, diagnosed_by, diagnosed_at, created_at, updated_at)
      VALUES (pg_temp.u('encdx:' || e.id), TEN, e.id, p.id, dxcode, 'ICD-10', dxname, dxtype, 1, false, dx_date, doc, e.day + TIME '11:00', NOW(), NOW());
      IF dxcode <> v_icd AND e.day >= dx_date THEN
        INSERT INTO encounter_diagnoses (id, tenant_id, encounter_id, patient_id, icd_code, icd_version, diagnosis_name, diagnosis_type,
          diagnosis_rank, is_chronic, onset_date, diagnosed_by, diagnosed_at, created_at, updated_at)
        VALUES (pg_temp.u('encdx2:' || e.id), TEN, e.id, p.id, v_icd, 'ICD-10', v_dxname, 'secondary', 2, true, dx_date, doc, e.day + TIME '11:00', NOW(), NOW());
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Records that would only be written later in real life (a radiotherapy
-- prescription ~2 weeks before the first fraction, a chemo schedule a few days
-- before cycle 1) are dropped when that moment is still in the future; the
-- care plan keeps them as planned modalities.
CREATE TEMP TABLE onc_future_rx ON COMMIT DROP AS
SELECT id FROM plugin_oncology.radiation_prescriptions
WHERE tenant_id = '11111111-1111-1111-1111-111111111111' AND prescribed_at > NOW()
  AND id = pg_temp.u('rx:' || patient_id);
DELETE FROM plugin_oncology.radiation_fractions WHERE treatment_plan_id IN (
  SELECT id FROM plugin_oncology.radiation_treatment_plans WHERE prescription_id IN (SELECT id FROM onc_future_rx));
DELETE FROM plugin_oncology.radiation_treatment_plans WHERE prescription_id IN (SELECT id FROM onc_future_rx);
DELETE FROM plugin_oncology.radiation_simulations WHERE prescription_id IN (SELECT id FROM onc_future_rx);
DELETE FROM plugin_oncology.radiation_prescriptions WHERE id IN (SELECT id FROM onc_future_rx);
DELETE FROM plugin_oncology.cancer_timeline_events WHERE event_date > NOW() AND source_entity IN ('radiation_prescription', 'tumor_board_case') AND event_type <> 'tumor_board';
DELETE FROM plugin_oncology.treatment_plans
WHERE tenant_id = '11111111-1111-1111-1111-111111111111' AND created_at > NOW()
  AND id = pg_temp.u('tp:' || patient_id);

-- ---------------------------------------------------------------------------
-- Registry candidate results (slots chosen above). The order sits on the
-- patient's recent outpatient visit; imaging and lab results come back the
-- same day, histopathology 2 days later, inside the 72-hour lab turnaround target (never after
-- yesterday).
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE onc_cand_row ON COMMIT DROP AS
SELECT *,
       pg_temp.u('cand-ord:' || c.slot) AS order_id,
       c.enc_day + TIME '11:30' AS ordered_at,
       LEAST(c.enc_day + CASE s.kind WHEN 'pathology' THEN 2 ELSE 0 END, CURRENT_DATE - 1) + TIME '15:00' AS result_at
FROM onc_cand c JOIN onc_cand_slot s USING (slot);

UPDATE encounters e SET chief_complaint = r.complaint, presenting_symptoms = r.complaint,
  notes = COALESCE(r.history, r.note)
FROM onc_cand_row r WHERE e.id = r.enc_id;

INSERT INTO clinical_orders (id, tenant_id, encounter_id, patient_id, order_type, order_code, code_system, order_name,
  priority, status, clinical_indication, result_status, ordered_by, ordered_at, performed_at, resulted_at, created_at, updated_at)
SELECT r.order_id, '11111111-1111-1111-1111-111111111111'::uuid, r.enc_id, r.patient_id,
  CASE r.kind WHEN 'imaging' THEN 'imaging' ELSE 'lab' END, r.order_code, CASE r.kind WHEN 'imaging' THEN 'CPT' ELSE 'LOINC' END,
  r.order_name, 'routine', 'completed', COALESCE(r.history, r.complaint), 'final',
  '6d2df89a-3f81-5338-b197-373d347031db'::uuid, r.ordered_at, r.ordered_at + INTERVAL '30 minutes', r.result_at, r.ordered_at, r.result_at
FROM onc_cand_row r WHERE r.kind IN ('pathology', 'imaging', 'marker');

-- Lab orders carry their test, as orders placed in the app do. The result page reads the test's
-- report style from it: Histopathology Examination (33717-0) is narrative, so the page shows the
-- pathology report; without this link it looks for a structured lab report and finds none.
INSERT INTO lab_order_tests (id, tenant_id, order_id, lab_test_master_id, test_code, code_system, test_name, loinc_code,
  cpt_code, specimen_type, status, created_at, updated_at)
SELECT pg_temp.u('cand-lot:' || r.slot), '11111111-1111-1111-1111-111111111111'::uuid, r.order_id,
  (SELECT m.id FROM lab_test_master m
   WHERE m.loinc_code = r.order_code AND (m.tenant_id = '11111111-1111-1111-1111-111111111111' OR m.tenant_id IS NULL)
   ORDER BY m.tenant_id NULLS LAST LIMIT 1),
  r.order_code, 'LOINC', r.order_name, r.order_code, CASE r.kind WHEN 'pathology' THEN '88305' END,
  r.specimen, 'completed', r.ordered_at, r.result_at
FROM onc_cand_row r WHERE r.kind IN ('pathology', 'marker');

INSERT INTO pathology_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, specimen_type,
  collection_date, received_date, clinical_history, specimen_received, gross_description, microscopic_description, diagnosis, comment,
  reported_by, verified_by, reported_at, verified_at, created_at, updated_at)
SELECT pg_temp.u('cand-path:' || r.slot), '11111111-1111-1111-1111-111111111111'::uuid, r.order_id, r.enc_id, r.patient_id, 'FINAL', 1, r.specimen,
  r.ordered_at + INTERVAL '30 minutes', r.ordered_at + INTERVAL '3 hours', r.history, r.specimen || ', in 10% neutral buffered formalin',
  r.gross, r.micro, r.result, r.note,
  'e64ff25b-9d46-5b0e-9bc3-6596a5850cee'::uuid, 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee'::uuid,
  r.result_at - INTERVAL '1 hour', r.result_at, r.ordered_at, r.result_at
FROM onc_cand_row r WHERE r.kind = 'pathology';

INSERT INTO imaging_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, modality, body_part,
  technique, comparison, findings, impression, recommendations, critical_finding, accession_number,
  reported_by, reviewed_by, reported_at, reviewed_at, created_at, updated_at)
SELECT pg_temp.u('cand-img:' || r.slot), '11111111-1111-1111-1111-111111111111'::uuid, r.order_id, r.enc_id, r.patient_id, 'FINAL', 1, r.specimen, r.body_part,
  r.technique, 'No prior imaging available.', r.findings, r.result, r.note, false, 'ACC-CAND-' || to_char(r.enc_day, 'YYMMDD') || '-' || r.slot,
  'e64ff25b-9d46-5b0e-9bc3-6596a5850cee'::uuid, 'e64ff25b-9d46-5b0e-9bc3-6596a5850cee'::uuid,
  r.result_at - INTERVAL '1 hour', r.result_at, r.ordered_at, r.result_at
FROM onc_cand_row r WHERE r.kind = 'imaging';

INSERT INTO lab_reports (id, tenant_id, order_id, encounter_id, patient_id, report_status, version, specimen_type,
  collection_date, received_date, reported_by, reported_at, verified_at, created_at, updated_at)
SELECT pg_temp.u('cand-lab:' || r.slot), '11111111-1111-1111-1111-111111111111'::uuid, r.order_id, r.enc_id, r.patient_id, 'FINAL', 1, r.specimen,
  r.ordered_at + INTERVAL '30 minutes', r.ordered_at + INTERVAL '1 hour', '6d2df89a-3f81-5338-b197-373d347031db'::uuid,
  r.result_at - INTERVAL '30 minutes', r.result_at, r.ordered_at, r.result_at
FROM onc_cand_row r WHERE r.kind = 'marker';
INSERT INTO lab_result_items (id, tenant_id, lab_report_id, sort_order, test_code, code_system, test_name, value_numeric, unit,
  ref_range_low, ref_range_high, abnormal_flag, critical_flag, created_at, updated_at)
SELECT pg_temp.u('cand-mki:' || r.slot), '11111111-1111-1111-1111-111111111111'::uuid, pg_temp.u('cand-lab:' || r.slot), 1,
  r.order_code, 'LOINC', r.order_name, r.value, 'ng/mL', 0, 4, true, false, r.result_at, r.result_at
FROM onc_cand_row r WHERE r.kind = 'marker';

INSERT INTO encounter_diagnoses (id, tenant_id, encounter_id, patient_id, icd_code, icd_version, diagnosis_name, diagnosis_type,
  diagnosis_rank, is_chronic, onset_date, clinical_notes, diagnosed_by, diagnosed_at, created_at, updated_at)
SELECT pg_temp.u('cand-dx:' || r.slot), '11111111-1111-1111-1111-111111111111'::uuid, r.enc_id, r.patient_id, r.icd, 'ICD-10', r.icd_name, 'primary',
  1, false, r.enc_day, COALESCE(r.history, r.note), '6d2df89a-3f81-5338-b197-373d347031db'::uuid, r.enc_day + TIME '11:00', r.enc_day + TIME '11:00', r.enc_day + TIME '11:00'
FROM onc_cand_row r WHERE r.kind = 'diagnosis';

COMMIT;

-- Summary for the seed log.
SELECT 'cohort diagnoses' AS what, COUNT(*) FROM plugin_oncology.cancer_diagnoses d WHERE d.id = pg_temp.u('dx:' || d.patient_id)
UNION ALL SELECT 'all diagnoses', COUNT(*) FROM plugin_oncology.cancer_diagnoses
UNION ALL SELECT 'tumour boards upcoming', COUNT(*) FROM plugin_oncology.tumor_board_cases WHERE meeting_date >= CURRENT_DATE
UNION ALL SELECT 'active care plans', COUNT(*) FROM plugin_oncology.oncology_care_plans WHERE status = 'active'
UNION ALL SELECT 'day-care today', COUNT(*) FROM plugin_oncology.treatment_days WHERE scheduled_date = CURRENT_DATE AND status NOT IN ('skipped', 'cancelled')
UNION ALL SELECT 'chemo orders', COUNT(*) FROM plugin_oncology.chemo_orders
UNION ALL SELECT 'patients on radiotherapy now', COUNT(*) FROM plugin_oncology.radiation_prescriptions WHERE status = 'ACTIVE'
UNION ALL SELECT 'fractions today', COUNT(*) FROM plugin_oncology.radiation_fractions WHERE planned_date = CURRENT_DATE
UNION ALL SELECT 'registry candidate results', COUNT(*) FROM clinical_orders WHERE id IN (SELECT pg_temp.u('cand-ord:' || g) FROM generate_series(1, 8) g)
UNION ALL SELECT 'registry candidate diagnoses', COUNT(*) FROM encounter_diagnoses WHERE id IN (SELECT pg_temp.u('cand-dx:' || g) FROM generate_series(1, 8) g);
