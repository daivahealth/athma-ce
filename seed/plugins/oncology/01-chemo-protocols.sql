-- Chemotherapy Protocol Seed Data
-- Schema: plugin_oncology  |  DB: zeal_clinical
-- Tenant: 11111111-1111-1111-1111-111111111111
-- Idempotent: deletes this tenant's protocols first (older seed runs used
-- gen_random_uuid() ids, so a plain ON CONFLICT (id) can't reconcile with
-- pre-existing rows sharing the same (tenant_id, code)), then re-inserts with
-- deterministic ids via uuid_from_text().
-- Covers: Breast, Lung, Colorectal, Lymphoma, Leukemia, Ovarian, Gastric, Bladder, Head & Neck, Myeloma

DELETE FROM plugin_oncology.chemo_protocols WHERE tenant_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO plugin_oncology.chemo_protocols (
  id, tenant_id, code, name, description,
  cancer_type, intent, regimen,
  total_cycles, cycle_duration_days,
  premedications, "supportiveCare", hydration, lab_prerequisites,
  emetogenic_risk, dose_formula, is_active,
  created_at, updated_at
)
VALUES

-- ─────────────────────────────────────────────────────────────────────────────
-- BREAST CANCER
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-ac-t'), '11111111-1111-1111-1111-111111111111'::uuid,
 'AC-T', 'AC → Paclitaxel (Dose-Dense)',
 'Standard adjuvant regimen for HER2-negative breast cancer. AC given every 2 weeks x 4, followed by paclitaxel every 2 weeks x 4.',
 'Breast Cancer', 'adjuvant',
 '[
   {"drug":"Doxorubicin","dose":60,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":15},
   {"drug":"Cyclophosphamide","dose":600,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":30},
   {"drug":"Paclitaxel","dose":175,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":180,"diluent":"NS 500 mL"}
 ]'::jsonb,
 8, 14,
 '["Ondansetron 8 mg IV 30 min before","Dexamethasone 20 mg IV 30 min before","Lorazepam 1 mg IV PRN","Diphenhydramine 50 mg IV before paclitaxel","Ranitidine 50 mg IV before paclitaxel","Dexamethasone 20 mg IV before paclitaxel"]'::jsonb,
 '["G-CSF (Pegfilgrastim 6 mg SC day 2 of each AC cycle)","G-CSF (Pegfilgrastim 6 mg SC day 2 of each paclitaxel cycle)"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"CBC","parameter":"Platelets","minValue":100000,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"LFT","parameter":"Bilirubin","minValue":null,"unit":"mg/dL","timing":"within 7d before cycle 1"}]'::jsonb,
 'high', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-tc'), '11111111-1111-1111-1111-111111111111'::uuid,
 'TC', 'Docetaxel + Cyclophosphamide (TC)',
 'Adjuvant regimen for early-stage HER2-negative breast cancer. 4-6 cycles every 21 days.',
 'Breast Cancer', 'adjuvant',
 '[
   {"drug":"Docetaxel","dose":75,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 250 mL"},
   {"drug":"Cyclophosphamide","dose":600,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":30}
 ]'::jsonb,
 6, 21,
 '["Dexamethasone 8 mg PO BID x 3 days starting day before","Ondansetron 8 mg IV 30 min before","Dexamethasone 20 mg IV 30 min before"]'::jsonb,
 '["G-CSF (Pegfilgrastim 6 mg SC day 2)","Prophylactic antibiotics if clinically indicated"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"CBC","parameter":"Platelets","minValue":100000,"unit":"/mm³","timing":"within 48h before each cycle"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-tch'), '11111111-1111-1111-1111-111111111111'::uuid,
 'TCH', 'Docetaxel + Carboplatin + Trastuzumab (TCH)',
 'Adjuvant regimen for HER2-positive early breast cancer. Non-anthracycline option. Trastuzumab continued for 1 year total.',
 'Breast Cancer – HER2+', 'adjuvant',
 '[
   {"drug":"Docetaxel","dose":75,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 250 mL"},
   {"drug":"Carboplatin","dose":6,"unit":"AUC","route":"IV","day":1,"doseFormula":"auc","infusionDurationMin":30,"diluent":"D5W 250 mL"},
   {"drug":"Trastuzumab","dose":8,"unit":"mg/kg","route":"IV","day":1,"doseFormula":"weight","infusionDurationMin":90},
   {"drug":"Trastuzumab (maintenance)","dose":6,"unit":"mg/kg","route":"IV","day":1,"doseFormula":"weight","infusionDurationMin":30}
 ]'::jsonb,
 6, 21,
 '["Dexamethasone 8 mg PO BID x 3 days starting day before","Ondansetron 8 mg IV 30 min before","Dexamethasone 20 mg IV 30 min before","Diphenhydramine 25 mg IV before trastuzumab (loading dose only)"]'::jsonb,
 '["G-CSF (Pegfilgrastim 6 mg SC day 2)","ECHO/MUGA before cycle 1 and every 3 months"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"ECHO/MUGA","parameter":"LVEF","minValue":50,"unit":"%","timing":"within 4w before cycle 1"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-cmf'), '11111111-1111-1111-1111-111111111111'::uuid,
 'CMF', 'Cyclophosphamide + Methotrexate + 5-FU (CMF)',
 'Classical adjuvant regimen. Used in patients who cannot receive anthracyclines. 6 cycles every 28 days.',
 'Breast Cancer', 'adjuvant',
 '[
   {"drug":"Cyclophosphamide","dose":600,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":30},
   {"drug":"Methotrexate","dose":40,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":15},
   {"drug":"Fluorouracil","dose":600,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":15}
 ]'::jsonb,
 6, 28,
 '["Ondansetron 8 mg IV 30 min before","Dexamethasone 8 mg IV 30 min before"]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Creatinine","parameter":"eGFR","minValue":50,"unit":"mL/min","timing":"within 7d before each cycle"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-capecitabine-breast'), '11111111-1111-1111-1111-111111111111'::uuid,
 'Capecitabine-Breast', 'Capecitabine (Breast)',
 'Single-agent capecitabine for metastatic or adjuvant use in HER2- breast cancer after anthracycline and taxane.',
 'Breast Cancer', 'palliative',
 '[
   {"drug":"Capecitabine","dose":1250,"unit":"mg/m²","route":"PO","day":[1,2,3,4,5,6,7,8,9,10,11,12,13,14],"doseFormula":"bsa"}
 ]'::jsonb,
 6, 21,
 '[]'::jsonb,
 '["Hand-foot syndrome management: urea cream","Loperamide PRN for diarrhoea"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC","parameter":"ANC","minValue":1000,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Creatinine","parameter":"CrCl","minValue":30,"unit":"mL/min","timing":"within 7d before each cycle"}]'::jsonb,
 'low', 'bsa', true, NOW(), NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- LUNG CANCER
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-carbo-pac'), '11111111-1111-1111-1111-111111111111'::uuid,
 'Carbo-Pac', 'Carboplatin + Paclitaxel (NSCLC)',
 'First-line doublet for advanced NSCLC. 4-6 cycles every 21 days.',
 'Non-Small Cell Lung Cancer (NSCLC)', 'palliative',
 '[
   {"drug":"Carboplatin","dose":6,"unit":"AUC","route":"IV","day":1,"doseFormula":"auc","infusionDurationMin":30,"diluent":"D5W 250 mL"},
   {"drug":"Paclitaxel","dose":200,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":180,"diluent":"NS 500 mL"}
 ]'::jsonb,
 6, 21,
 '["Dexamethasone 20 mg IV 30 min before","Diphenhydramine 50 mg IV before","Ranitidine 50 mg IV before","Ondansetron 8 mg IV 30 min before"]'::jsonb,
 '["G-CSF if ANC nadir < 500","Pegfilgrastim 6 mg SC day 2 if prior febrile neutropenia"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Renal function","parameter":"CrCl","minValue":45,"unit":"mL/min","timing":"within 7d before each cycle"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-cis-pem'), '11111111-1111-1111-1111-111111111111'::uuid,
 'Cis-Pem', 'Cisplatin + Pemetrexed (NSCLC non-squamous)',
 'Standard first-line doublet for non-squamous NSCLC without EGFR/ALK mutation. 4-6 cycles every 21 days.',
 'NSCLC – Adenocarcinoma', 'palliative',
 '[
   {"drug":"Cisplatin","dose":75,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 500 mL"},
   {"drug":"Pemetrexed","dose":500,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":10,"diluent":"NS 100 mL"}
 ]'::jsonb,
 6, 21,
 '["Dexamethasone 4 mg PO BID day before, day of, day after (rash prophylaxis)","Folic acid 400 mcg PO daily starting 7 days before cycle 1","Vitamin B12 1000 mcg IM 1 week before cycle 1 then every 9 weeks","Ondansetron 8 mg IV 30 min before","Dexamethasone 20 mg IV 30 min before","Aprepitant 125 mg PO day 1 then 80 mg days 2-3"]'::jsonb,
 '["Adequate hydration mandatory"]'::jsonb,
 '[{"fluid":"Normal saline 1000 mL","ratePerHour":250,"durationHours":4,"timing":"pre"},{"fluid":"Normal saline 1000 mL","ratePerHour":125,"durationHours":8,"timing":"post"}]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Renal function","parameter":"CrCl","minValue":45,"unit":"mL/min","timing":"within 48h before each cycle"},{"test":"Serum Mg","parameter":"Magnesium","minValue":0.7,"unit":"mmol/L","timing":"within 48h before each cycle"}]'::jsonb,
 'high', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-ep-sclc'), '11111111-1111-1111-1111-111111111111'::uuid,
 'EP-SCLC', 'Etoposide + Cisplatin (SCLC)',
 'Standard first-line regimen for extensive-stage SCLC. 4-6 cycles every 21 days.',
 'Small Cell Lung Cancer (SCLC)', 'palliative',
 '[
   {"drug":"Etoposide","dose":100,"unit":"mg/m²","route":"IV","day":[1,2,3],"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 250 mL"},
   {"drug":"Cisplatin","dose":75,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 500 mL"}
 ]'::jsonb,
 6, 21,
 '["Ondansetron 8 mg IV 30 min before each day","Dexamethasone 20 mg IV day 1","Aprepitant 125 mg PO day 1 then 80 mg days 2-3"]'::jsonb,
 '["G-CSF if prior febrile neutropenia","Prophylactic cranial irradiation (PCI) if CR/PR achieved"]'::jsonb,
 '[{"fluid":"Normal saline 1000 mL","ratePerHour":250,"durationHours":4,"timing":"pre"},{"fluid":"Normal saline 1000 mL","ratePerHour":125,"durationHours":8,"timing":"post"}]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Renal function","parameter":"CrCl","minValue":60,"unit":"mL/min","timing":"within 48h before each cycle"}]'::jsonb,
 'high', 'bsa', true, NOW(), NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- COLORECTAL CANCER
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-folfox'), '11111111-1111-1111-1111-111111111111'::uuid,
 'FOLFOX', 'FOLFOX (mFOLFOX6)',
 'Standard first/second-line regimen for metastatic colorectal cancer and adjuvant for stage III colon cancer. Every 14 days.',
 'Colorectal Cancer', 'palliative',
 '[
   {"drug":"Oxaliplatin","dose":85,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":120,"diluent":"D5W 250 mL"},
   {"drug":"Leucovorin","dose":400,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":120,"diluent":"D5W 250 mL"},
   {"drug":"Fluorouracil (bolus)","dose":400,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":5},
   {"drug":"Fluorouracil (infusion)","dose":2400,"unit":"mg/m²","route":"IV","day":[1,2],"doseFormula":"bsa","infusionDurationMin":2880,"diluent":"NS 250 mL"}
 ]'::jsonb,
 12, 14,
 '["Ondansetron 8 mg IV 30 min before","Dexamethasone 8 mg IV 30 min before"]'::jsonb,
 '["Cold prevention: avoid cold drinks and exposure for 3-5 days after oxaliplatin","PICC line or port recommended for 46-h 5-FU infusion"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"LFT","parameter":"Bilirubin","minValue":null,"unit":"mg/dL","timing":"within 7d before cycle 1"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-folfiri'), '11111111-1111-1111-1111-111111111111'::uuid,
 'FOLFIRI', 'FOLFIRI',
 'Second-line colorectal cancer after FOLFOX failure, or first-line with bevacizumab. Every 14 days.',
 'Colorectal Cancer', 'palliative',
 '[
   {"drug":"Irinotecan","dose":180,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":90,"diluent":"D5W 250 mL"},
   {"drug":"Leucovorin","dose":400,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":120,"diluent":"D5W 250 mL"},
   {"drug":"Fluorouracil (bolus)","dose":400,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":5},
   {"drug":"Fluorouracil (infusion)","dose":2400,"unit":"mg/m²","route":"IV","day":[1,2],"doseFormula":"bsa","infusionDurationMin":2880,"diluent":"NS 250 mL"}
 ]'::jsonb,
 12, 14,
 '["Ondansetron 8 mg IV 30 min before","Dexamethasone 8 mg IV 30 min before","Atropine 0.25–1 mg IV for acute cholinergic syndrome during irinotecan"]'::jsonb,
 '["Loperamide 4 mg at first loose stool then 2 mg every 2h (delayed diarrhoea)","PICC line or port recommended"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"UGT1A1 genotype","parameter":"Polymorphism","minValue":null,"unit":"","timing":"before cycle 1 (if available)"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-capox'), '11111111-1111-1111-1111-111111111111'::uuid,
 'CAPOX', 'Capecitabine + Oxaliplatin (CAPOX / XELOX)',
 'Oral alternative to FOLFOX for colorectal cancer. Convenient outpatient regimen. Every 21 days.',
 'Colorectal Cancer', 'palliative',
 '[
   {"drug":"Oxaliplatin","dose":130,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":120,"diluent":"D5W 250 mL"},
   {"drug":"Capecitabine","dose":1000,"unit":"mg/m²","route":"PO","day":[1,2,3,4,5,6,7,8,9,10,11,12,13,14],"doseFormula":"bsa"}
 ]'::jsonb,
 8, 21,
 '["Ondansetron 8 mg IV before oxaliplatin","Dexamethasone 8 mg IV before oxaliplatin"]'::jsonb,
 '["Cold prevention for 3-5 days after oxaliplatin","Hand-foot syndrome management: urea cream"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Creatinine","parameter":"CrCl","minValue":30,"unit":"mL/min","timing":"within 7d before each cycle"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- LYMPHOMA
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-r-chop'), '11111111-1111-1111-1111-111111111111'::uuid,
 'R-CHOP', 'R-CHOP (Rituximab-CHOP)',
 'Standard first-line regimen for CD20+ diffuse large B-cell lymphoma (DLBCL) and follicular lymphoma. Every 21 days.',
 'Non-Hodgkin Lymphoma (DLBCL)', 'curative',
 '[
   {"drug":"Rituximab","dose":375,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":240},
   {"drug":"Cyclophosphamide","dose":750,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":30},
   {"drug":"Doxorubicin (Hydroxydaunorubicin)","dose":50,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":15},
   {"drug":"Vincristine (Oncovin)","dose":1.4,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":10},
   {"drug":"Prednisone","dose":100,"unit":"mg","route":"PO","day":[1,2,3,4,5],"doseFormula":"fixed"}
 ]'::jsonb,
 6, 21,
 '["Diphenhydramine 50 mg IV before rituximab","Acetaminophen 650 mg PO before rituximab","Dexamethasone 8 mg IV before rituximab (cycle 1)","Ondansetron 8 mg IV 30 min before chemo","Dexamethasone 8 mg IV 30 min before chemo"]'::jsonb,
 '["G-CSF (Pegfilgrastim 6 mg SC day 2)","PCP prophylaxis: Co-trimoxazole 480 mg PO alternate days","Antifungal prophylaxis if indicated","ECHO before cycle 1 (doxorubicin)"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1000,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"CBC","parameter":"Platelets","minValue":75000,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"ECHO","parameter":"LVEF","minValue":50,"unit":"%","timing":"within 4w before cycle 1"},{"test":"HBsAg/anti-HBc","parameter":"Hepatitis B","minValue":null,"unit":"","timing":"before cycle 1"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-abvd'), '11111111-1111-1111-1111-111111111111'::uuid,
 'ABVD', 'ABVD (Hodgkin Lymphoma)',
 'Standard first-line regimen for classical Hodgkin lymphoma. 4-6 cycles every 28 days (days 1 and 15).',
 'Hodgkin Lymphoma', 'curative',
 '[
   {"drug":"Doxorubicin (Adriamycin)","dose":25,"unit":"mg/m²","route":"IV","day":[1,15],"doseFormula":"bsa","infusionDurationMin":15},
   {"drug":"Bleomycin","dose":10,"unit":"units/m²","route":"IV","day":[1,15],"doseFormula":"bsa","infusionDurationMin":10},
   {"drug":"Vinblastine","dose":6,"unit":"mg/m²","route":"IV","day":[1,15],"doseFormula":"bsa","infusionDurationMin":10},
   {"drug":"Dacarbazine","dose":375,"unit":"mg/m²","route":"IV","day":[1,15],"doseFormula":"bsa","infusionDurationMin":30,"diluent":"D5W 250 mL"}
 ]'::jsonb,
 6, 28,
 '["Test dose Bleomycin 1 unit IV before first dose","Ondansetron 8 mg IV 30 min before","Dexamethasone 8 mg IV 30 min before"]'::jsonb,
 '["Pulmonary function tests before cycle 1 (bleomycin)","G-CSF only if clinically indicated — NOT routine with ABVD (may worsen bleomycin pulmonary toxicity)","PCP prophylaxis: Co-trimoxazole 480 mg alternate days"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1000,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Pulmonary function (DLCO)","parameter":"DLCO","minValue":60,"unit":"% predicted","timing":"before cycle 1 then every 2 cycles"},{"test":"ECHO","parameter":"LVEF","minValue":50,"unit":"%","timing":"within 4w before cycle 1"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-r-cvp'), '11111111-1111-1111-1111-111111111111'::uuid,
 'R-CVP', 'R-CVP (Rituximab + CVP)',
 'For indolent follicular lymphoma or low-grade NHL where anthracyclines are contraindicated. Every 21 days.',
 'Follicular Lymphoma', 'palliative',
 '[
   {"drug":"Rituximab","dose":375,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":240},
   {"drug":"Cyclophosphamide","dose":750,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":30},
   {"drug":"Vincristine","dose":1.4,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":10},
   {"drug":"Prednisolone","dose":40,"unit":"mg/m²","route":"PO","day":[1,2,3,4,5],"doseFormula":"bsa"}
 ]'::jsonb,
 8, 21,
 '["Diphenhydramine 50 mg IV before rituximab","Acetaminophen 650 mg PO before rituximab","Ondansetron 8 mg IV 30 min before chemo"]'::jsonb,
 '["PCP prophylaxis: Co-trimoxazole 480 mg alternate days","Hepatitis B screening and prophylaxis before rituximab"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1000,"unit":"/mm³","timing":"within 48h before each cycle"}]'::jsonb,
 'low', 'bsa', true, NOW(), NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- LEUKEMIA / MYELOMA
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-hypercvad-a'), '11111111-1111-1111-1111-111111111111'::uuid,
 'HyperCVAD-A', 'HyperCVAD Part A (ALL)',
 'Intensive induction Part A for adult ALL. Alternates with Part B (high-dose methotrexate + cytarabine). Every 21 days.',
 'Acute Lymphoblastic Leukemia (ALL)', 'curative',
 '[
   {"drug":"Cyclophosphamide","dose":300,"unit":"mg/m²","route":"IV","day":[1,2,3],"doseFormula":"bsa","infusionDurationMin":180},
   {"drug":"Vincristine","dose":2,"unit":"mg","route":"IV","day":[4,11],"doseFormula":"fixed","infusionDurationMin":15},
   {"drug":"Doxorubicin","dose":50,"unit":"mg/m²","route":"IV","day":4,"doseFormula":"bsa","infusionDurationMin":15},
   {"drug":"Dexamethasone","dose":40,"unit":"mg","route":"PO","day":[1,2,3,4,11,12,13,14],"doseFormula":"fixed"}
 ]'::jsonb,
 8, 21,
 '["Mesna 600 mg/m² IV with each cyclophosphamide dose and 4h after","Ondansetron 8 mg IV 30 min before","Dexamethasone 8 mg IV 30 min before"]'::jsonb,
 '["G-CSF (Filgrastim 5 mcg/kg/day SC from day 5 until ANC recovery)","PCP prophylaxis: Co-trimoxazole 480 mg BID TIW","Fluconazole 100 mg PO daily antifungal prophylaxis","Acyclovir 400 mg PO BID viral prophylaxis","Central line mandatory"]'::jsonb,
 '[{"fluid":"Normal saline 1000 mL with KCl 20 mmol","ratePerHour":125,"durationHours":24,"timing":"pre"}]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":null,"unit":"/mm³","timing":"daily during treatment"},{"test":"LFT","parameter":"Bilirubin","minValue":null,"unit":"mg/dL","timing":"within 48h before each cycle"},{"test":"Renal function","parameter":"Creatinine","minValue":null,"unit":"mg/dL","timing":"within 48h before each cycle"}]'::jsonb,
 'high', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-vmp'), '11111111-1111-1111-1111-111111111111'::uuid,
 'VMP', 'Bortezomib + Melphalan + Prednisone (VMP)',
 'Standard of care for newly diagnosed multiple myeloma patients ineligible for transplant. 9 cycles every 42 days.',
 'Multiple Myeloma', 'palliative',
 '[
   {"drug":"Bortezomib","dose":1.3,"unit":"mg/m²","route":"SC","day":[1,4,8,11,22,25,29,32],"doseFormula":"bsa"},
   {"drug":"Melphalan","dose":9,"unit":"mg/m²","route":"PO","day":[1,2,3,4],"doseFormula":"bsa"},
   {"drug":"Prednisone","dose":60,"unit":"mg/m²","route":"PO","day":[1,2,3,4],"doseFormula":"bsa"}
 ]'::jsonb,
 9, 42,
 '[]'::jsonb,
 '["Acyclovir 400 mg PO BID (VZV prophylaxis — mandatory with bortezomib)","Bisphosphonate: Zoledronic acid 4 mg IV monthly or Denosumab 120 mg SC monthly"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1000,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"CBC","parameter":"Platelets","minValue":70000,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Renal function","parameter":"CrCl","minValue":30,"unit":"mL/min","timing":"within 7d before each cycle"}]'::jsonb,
 'minimal', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-rd-myeloma'), '11111111-1111-1111-1111-111111111111'::uuid,
 'RD-Myeloma', 'Lenalidomide + Dexamethasone (Rd)',
 'Continuous Rd for newly diagnosed myeloma ineligible for stem cell transplant. Every 28 days until progression.',
 'Multiple Myeloma', 'palliative',
 '[
   {"drug":"Lenalidomide","dose":25,"unit":"mg","route":"PO","day":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"doseFormula":"fixed"},
   {"drug":"Dexamethasone","dose":40,"unit":"mg","route":"PO","day":[1,8,15,22],"doseFormula":"fixed"}
 ]'::jsonb,
 18, 28,
 '[]'::jsonb,
 '["VTE prophylaxis: aspirin 100 mg PO daily or LMWH if high risk","Acyclovir 400 mg PO BID viral prophylaxis","Bisphosphonate monthly"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1000,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Renal function","parameter":"CrCl","minValue":30,"unit":"mL/min","timing":"within 7d before each cycle"}]'::jsonb,
 'minimal', 'fixed', true, NOW(), NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- OVARIAN CANCER
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-carbo-tax-ovary'), '11111111-1111-1111-1111-111111111111'::uuid,
 'Carbo-Tax-Ovary', 'Carboplatin + Paclitaxel (Ovarian)',
 'Standard first-line regimen for advanced ovarian, fallopian tube, and primary peritoneal carcinoma. 6 cycles every 21 days.',
 'Ovarian Cancer', 'curative',
 '[
   {"drug":"Carboplatin","dose":5,"unit":"AUC","route":"IV","day":1,"doseFormula":"auc","infusionDurationMin":30,"diluent":"D5W 250 mL"},
   {"drug":"Paclitaxel","dose":175,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":180,"diluent":"NS 500 mL"}
 ]'::jsonb,
 6, 21,
 '["Dexamethasone 20 mg IV 30 min before","Diphenhydramine 50 mg IV before","Ranitidine 50 mg IV before","Ondansetron 8 mg IV 30 min before"]'::jsonb,
 '["G-CSF if ANC nadir < 500 or febrile neutropenia","CA-125 before each cycle"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Renal function","parameter":"CrCl","minValue":50,"unit":"mL/min","timing":"within 7d before each cycle"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-bep'), '11111111-1111-1111-1111-111111111111'::uuid,
 'BEP', 'Bleomycin + Etoposide + Cisplatin (BEP)',
 'Standard first-line for germ cell tumours (testicular, ovarian GCT). 3-4 cycles every 21 days.',
 'Ovarian Cancer', 'curative',
 '[
   {"drug":"Bleomycin","dose":30,"unit":"units","route":"IV","day":[1,8,15],"doseFormula":"fixed","infusionDurationMin":30},
   {"drug":"Etoposide","dose":100,"unit":"mg/m²","route":"IV","day":[1,2,3,4,5],"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 250 mL"},
   {"drug":"Cisplatin","dose":20,"unit":"mg/m²","route":"IV","day":[1,2,3,4,5],"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 500 mL"}
 ]'::jsonb,
 4, 21,
 '["Bleomycin test dose 1 unit before first dose","Ondansetron 8 mg IV 30 min before each day","Dexamethasone 20 mg IV day 1","Aprepitant 125 mg PO day 1 then 80 mg days 2-5"]'::jsonb,
 '["DLCO / PFTs before cycle 1 (bleomycin pulmonary toxicity monitoring)","Audiogram before cycle 1 (cisplatin ototoxicity)"]'::jsonb,
 '[{"fluid":"Normal saline 1000 mL","ratePerHour":250,"durationHours":4,"timing":"pre"},{"fluid":"Normal saline 1000 mL with KCl 20 mmol + MgSO4 2g","ratePerHour":125,"durationHours":8,"timing":"post"}]'::jsonb,
 '[{"test":"Renal function","parameter":"CrCl","minValue":60,"unit":"mL/min","timing":"within 48h before each cycle"},{"test":"DLCO","parameter":"DLCO","minValue":60,"unit":"% predicted","timing":"within 4w before cycle 1"}]'::jsonb,
 'high', 'bsa', true, NOW(), NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- GASTRIC / UPPER GI CANCER
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-flot'), '11111111-1111-1111-1111-111111111111'::uuid,
 'FLOT', 'FLOT (Perioperative Gastric)',
 'Perioperative chemotherapy for resectable gastric and gastroesophageal junction adenocarcinoma. 4 pre-op + 4 post-op cycles every 14 days.',
 'Gastric Cancer', 'neoadjuvant',
 '[
   {"drug":"Docetaxel","dose":50,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 250 mL"},
   {"drug":"Oxaliplatin","dose":85,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":120,"diluent":"D5W 250 mL"},
   {"drug":"Leucovorin","dose":200,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":120},
   {"drug":"Fluorouracil","dose":2600,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":1440,"diluent":"NS 250 mL"}
 ]'::jsonb,
 8, 14,
 '["Dexamethasone 8 mg PO BID day before through day 3","Ondansetron 8 mg IV 30 min before","Dexamethasone 20 mg IV 30 min before"]'::jsonb,
 '["G-CSF (Pegfilgrastim 6 mg SC day 2)","PICC line or port recommended (24-h 5-FU)","Cold avoidance 3-5 days after oxaliplatin"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"LFT","parameter":"ALT","minValue":null,"unit":"U/L","timing":"within 7d before each cycle"}]'::jsonb,
 'high', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-eof'), '11111111-1111-1111-1111-111111111111'::uuid,
 'EOF', 'Epirubicin + Oxaliplatin + Capecitabine (EOX)',
 'Perioperative or palliative regimen for gastric/GEJ cancer. Alternative to ECF. Every 21 days.',
 'Gastric Cancer', 'palliative',
 '[
   {"drug":"Epirubicin","dose":50,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":15},
   {"drug":"Oxaliplatin","dose":130,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":120,"diluent":"D5W 250 mL"},
   {"drug":"Capecitabine","dose":625,"unit":"mg/m²","route":"PO","day":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"doseFormula":"bsa"}
 ]'::jsonb,
 6, 21,
 '["Ondansetron 8 mg IV 30 min before","Dexamethasone 8 mg IV 30 min before"]'::jsonb,
 '["ECHO before cycle 1 (epirubicin)","Cold avoidance after oxaliplatin","Hand-foot syndrome management: urea cream"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"ECHO","parameter":"LVEF","minValue":50,"unit":"%","timing":"within 4w before cycle 1"},{"test":"Creatinine","parameter":"CrCl","minValue":30,"unit":"mL/min","timing":"within 7d before each cycle"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- BLADDER / UROTHELIAL CANCER
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-gemcis-bladder'), '11111111-1111-1111-1111-111111111111'::uuid,
 'GemCis-Bladder', 'Gemcitabine + Cisplatin (Bladder)',
 'Standard first-line for metastatic urothelial/bladder carcinoma and neoadjuvant for muscle-invasive disease. Every 28 days.',
 'Bladder Cancer', 'palliative',
 '[
   {"drug":"Gemcitabine","dose":1000,"unit":"mg/m²","route":"IV","day":[1,8,15],"doseFormula":"bsa","infusionDurationMin":30,"diluent":"NS 100 mL"},
   {"drug":"Cisplatin","dose":70,"unit":"mg/m²","route":"IV","day":2,"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 500 mL"}
 ]'::jsonb,
 6, 28,
 '["Ondansetron 8 mg IV 30 min before cisplatin","Dexamethasone 20 mg IV 30 min before cisplatin","Aprepitant 125 mg PO day 2 then 80 mg days 3-4"]'::jsonb,
 '["Hydration mandatory around cisplatin","Audiogram before cycle 1 (cisplatin)","Renal function monitoring"]'::jsonb,
 '[{"fluid":"Normal saline 1000 mL","ratePerHour":250,"durationHours":4,"timing":"pre"},{"fluid":"Normal saline 1000 mL with MgSO4 2g","ratePerHour":125,"durationHours":8,"timing":"post"}]'::jsonb,
 '[{"test":"Renal function","parameter":"CrCl","minValue":60,"unit":"mL/min","timing":"within 48h before each cycle"},{"test":"CBC","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Serum Mg","parameter":"Magnesium","minValue":0.7,"unit":"mmol/L","timing":"within 48h before each cycle"}]'::jsonb,
 'high', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-gemcarbo-bladder'), '11111111-1111-1111-1111-111111111111'::uuid,
 'GemCarbo-Bladder', 'Gemcitabine + Carboplatin (Bladder — cisplatin ineligible)',
 'For cisplatin-ineligible patients with metastatic urothelial cancer. Every 21 days.',
 'Bladder Cancer', 'palliative',
 '[
   {"drug":"Gemcitabine","dose":1000,"unit":"mg/m²","route":"IV","day":[1,8],"doseFormula":"bsa","infusionDurationMin":30,"diluent":"NS 100 mL"},
   {"drug":"Carboplatin","dose":4.5,"unit":"AUC","route":"IV","day":1,"doseFormula":"auc","infusionDurationMin":30,"diluent":"D5W 250 mL"}
 ]'::jsonb,
 6, 21,
 '["Ondansetron 8 mg IV 30 min before","Dexamethasone 8 mg IV 30 min before"]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Renal function","parameter":"CrCl","minValue":30,"unit":"mL/min","timing":"within 7d before each cycle"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- HEAD AND NECK CANCER
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-tpf-hn'), '11111111-1111-1111-1111-111111111111'::uuid,
 'TPF-HN', 'Docetaxel + Cisplatin + 5-FU (TPF Induction)',
 'Induction chemotherapy for locally advanced head and neck squamous cell carcinoma before CRT. 3 cycles every 21 days.',
 'Head and Neck Cancer', 'neoadjuvant',
 '[
   {"drug":"Docetaxel","dose":75,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 250 mL"},
   {"drug":"Cisplatin","dose":75,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 500 mL"},
   {"drug":"Fluorouracil","dose":750,"unit":"mg/m²","route":"IV","day":[1,2,3,4,5],"doseFormula":"bsa","infusionDurationMin":1440,"diluent":"NS 250 mL"}
 ]'::jsonb,
 3, 21,
 '["Dexamethasone 8 mg PO BID x 3 days starting day before","Ondansetron 8 mg IV 30 min before","Dexamethasone 20 mg IV 30 min before","Aprepitant 125 mg PO day 1 then 80 mg days 2-5"]'::jsonb,
 '["G-CSF (Pegfilgrastim 6 mg SC day 2 — mandatory)","Nutritional support: consider NG/PEG if inadequate oral intake","Central line/PICC for 5-day 5-FU infusion","Mucositis mouth care protocol"]'::jsonb,
 '[{"fluid":"Normal saline 1000 mL","ratePerHour":250,"durationHours":4,"timing":"pre"},{"fluid":"Normal saline 1000 mL with KCl 20 mmol + MgSO4 2g","ratePerHour":125,"durationHours":8,"timing":"post"}]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Renal function","parameter":"CrCl","minValue":60,"unit":"mL/min","timing":"within 48h before each cycle"},{"test":"LFT","parameter":"ALT","minValue":null,"unit":"U/L","timing":"within 7d before each cycle"}]'::jsonb,
 'high', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-cis-rt-hn'), '11111111-1111-1111-1111-111111111111'::uuid,
 'Cis-RT-HN', 'Concurrent Cisplatin (High-Dose) + Radiotherapy',
 'Concurrent cisplatin with definitive/adjuvant radiotherapy for locally advanced HNSCC. Every 21 days x 3 cycles.',
 'Head and Neck Cancer', 'curative',
 '[
   {"drug":"Cisplatin","dose":100,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 500 mL"}
 ]'::jsonb,
 3, 21,
 '["Ondansetron 8 mg IV 30 min before","Dexamethasone 20 mg IV 30 min before","Aprepitant 125 mg PO day 1 then 80 mg days 2-3"]'::jsonb,
 '["Concurrent with radiotherapy — coordinate with radiation oncology","Nutritional support mandatory — consider PEG prophylactically","Mucositis mouth care protocol daily","Audiogram before each cycle (cisplatin ototoxicity)"]'::jsonb,
 '[{"fluid":"Normal saline 1000 mL","ratePerHour":250,"durationHours":4,"timing":"pre"},{"fluid":"Normal saline 1000 mL with MgSO4 2g + KCl 20 mmol","ratePerHour":125,"durationHours":8,"timing":"post"}]'::jsonb,
 '[{"test":"Renal function","parameter":"CrCl","minValue":60,"unit":"mL/min","timing":"within 48h before each cycle"},{"test":"CBC","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"Audiogram","parameter":"Hearing","minValue":null,"unit":"","timing":"before cycle 1 then before each cycle"}]'::jsonb,
 'high', 'bsa', true, NOW(), NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- PANCREATIC CANCER
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-folfirinox'), '11111111-1111-1111-1111-111111111111'::uuid,
 'FOLFIRINOX', 'FOLFIRINOX (Pancreatic)',
 'First-line for metastatic pancreatic cancer in patients with good performance status (ECOG 0-1). Every 14 days.',
 'Pancreatic Cancer', 'palliative',
 '[
   {"drug":"Oxaliplatin","dose":85,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":120,"diluent":"D5W 250 mL"},
   {"drug":"Irinotecan","dose":180,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":90,"diluent":"D5W 250 mL"},
   {"drug":"Leucovorin","dose":400,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":120},
   {"drug":"Fluorouracil (bolus)","dose":400,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":5},
   {"drug":"Fluorouracil (infusion)","dose":2400,"unit":"mg/m²","route":"IV","day":[1,2],"doseFormula":"bsa","infusionDurationMin":2880,"diluent":"NS 250 mL"}
 ]'::jsonb,
 12, 14,
 '["Ondansetron 8 mg IV 30 min before","Dexamethasone 8 mg IV 30 min before","Atropine 0.25-1 mg IV for cholinergic syndrome (irinotecan)","Aprepitant 125 mg PO day 1 then 80 mg days 2-3"]'::jsonb,
 '["G-CSF (Pegfilgrastim 6 mg SC day 2)","PICC/port for 46-h 5-FU infusion","Loperamide protocol for delayed diarrhoea","Cold avoidance 3-5 days after oxaliplatin","UGT1A1 testing recommended (irinotecan dose reduction if *28/*28)"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"LFT","parameter":"Bilirubin","minValue":null,"unit":"mg/dL","timing":"within 7d before each cycle"}]'::jsonb,
 'high', 'bsa', true, NOW(), NOW()),

(uuid_from_text('chemo-protocol-gemnab-pancreas'), '11111111-1111-1111-1111-111111111111'::uuid,
 'GemNab-Pancreas', 'Gemcitabine + Nab-Paclitaxel (Pancreatic)',
 'Alternative first-line for metastatic pancreatic cancer. Less toxic than FOLFIRINOX. Every 28 days.',
 'Pancreatic Cancer', 'palliative',
 '[
   {"drug":"Nab-Paclitaxel (Abraxane)","dose":125,"unit":"mg/m²","route":"IV","day":[1,8,15],"doseFormula":"bsa","infusionDurationMin":30},
   {"drug":"Gemcitabine","dose":1000,"unit":"mg/m²","route":"IV","day":[1,8,15],"doseFormula":"bsa","infusionDurationMin":30,"diluent":"NS 100 mL"}
 ]'::jsonb,
 6, 28,
 '["Ondansetron 8 mg IV 30 min before","Dexamethasone 8 mg IV 30 min before"]'::jsonb,
 '["No routine G-CSF","Peripheral neuropathy monitoring"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"LFT","parameter":"Bilirubin","minValue":null,"unit":"mg/dL","timing":"within 7d before each cycle"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- PROSTATE CANCER
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-docetaxel-pca'), '11111111-1111-1111-1111-111111111111'::uuid,
 'Docetaxel-PCa', 'Docetaxel + Prednisone (Prostate)',
 'Standard chemotherapy for metastatic castration-resistant prostate cancer (mCRPC). Every 21 days x 10 cycles.',
 'Prostate Cancer', 'palliative',
 '[
   {"drug":"Docetaxel","dose":75,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":60,"diluent":"NS 250 mL"},
   {"drug":"Prednisone","dose":5,"unit":"mg","route":"PO","day":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"doseFormula":"fixed"}
 ]'::jsonb,
 10, 21,
 '["Dexamethasone 8 mg PO 12h, 3h, 1h before (or 8 mg IV 30 min before)","Ondansetron 8 mg IV 30 min before"]'::jsonb,
 '["G-CSF (Pegfilgrastim 6 mg SC day 2)","PSA and imaging response assessment every 3 cycles"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC with differential","parameter":"ANC","minValue":1500,"unit":"/mm³","timing":"within 48h before each cycle"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW()),

-- ─────────────────────────────────────────────────────────────────────────────
-- HEPATOCELLULAR CARCINOMA
-- ─────────────────────────────────────────────────────────────────────────────

(uuid_from_text('chemo-protocol-gemox-hcc'), '11111111-1111-1111-1111-111111111111'::uuid,
 'GEMOX-HCC', 'Gemcitabine + Oxaliplatin (GEMOX — Biliary/HCC)',
 'Systemic chemotherapy for advanced biliary tract cancer or HCC not suitable for targeted therapy. Every 14 days.',
 'Hepatocellular Carcinoma (HCC)', 'palliative',
 '[
   {"drug":"Gemcitabine","dose":1000,"unit":"mg/m²","route":"IV","day":1,"doseFormula":"bsa","infusionDurationMin":100,"diluent":"NS 100 mL"},
   {"drug":"Oxaliplatin","dose":100,"unit":"mg/m²","route":"IV","day":2,"doseFormula":"bsa","infusionDurationMin":120,"diluent":"D5W 250 mL"}
 ]'::jsonb,
 8, 14,
 '["Ondansetron 8 mg IV 30 min before","Dexamethasone 8 mg IV 30 min before"]'::jsonb,
 '["LFT and Child-Pugh score before each cycle","Cold avoidance after oxaliplatin"]'::jsonb,
 '[]'::jsonb,
 '[{"test":"CBC","parameter":"ANC","minValue":1000,"unit":"/mm³","timing":"within 48h before each cycle"},{"test":"LFT","parameter":"Bilirubin","minValue":null,"unit":"mg/dL","timing":"within 48h before each cycle"},{"test":"Child-Pugh","parameter":"Score","minValue":null,"unit":"","timing":"within 7d before each cycle"}]'::jsonb,
 'moderate', 'bsa', true, NOW(), NOW())

ON CONFLICT (id) DO NOTHING;
