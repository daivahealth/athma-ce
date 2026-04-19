-- Pharmacy Stock Seed Data
-- 15 medications × 1-2 batches each + 7 OTC/general items = 24 stock rows
--
-- Dependencies (must be seeded first):
--   clinical: 04-medications  (medication_id UUIDs a1111111-...-111 through ...125)
--   rcm:      07-catalog-mappings  (billing item IDs resolved by billing_code subquery)
--
-- drug_code matches local_code from medication_master (MED-001 through MED-015)
-- Expiry dates are relative to NOW() so alerts work on any run date:
--   Normal stock  → expires 12-24 months from now
--   Near-expiry   → expires 20-45 days from now  (triggers expiring-soon alert)
--   Low stock     → quantity_on_hand ≤ reorder_level (triggers low-stock alert)

DO $$
DECLARE
  v_tenant_id  UUID := '11111111-1111-1111-1111-111111111111'::UUID;
  v_user       UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID;
BEGIN

  -- ── Clean existing stock for this tenant ─────────────────────────────────
  DELETE FROM pharmacy_stock_movements WHERE tenant_id = v_tenant_id;
  DELETE FROM pharmacy_stocks            WHERE tenant_id = v_tenant_id;

  -- ========================================================================
  -- CARDIOVASCULAR MEDICATIONS
  -- ========================================================================

  -- Lisinopril 10mg  (MED-001 · a1111111-...111) — two batches
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111101', v_tenant_id, 'a1111111-1111-1111-1111-111111111111', 'MED-001', 'INTERNAL', 'Lisinopril 10mg Tablet', 'Lisinopril', 'tablet', '10mg', 'tablet', 'LIS-2024-001', 'Mylan Pharmaceuticals', (NOW() + INTERVAL '18 months')::date, (NOW() - INTERVAL '2 months')::date, 500, 320, 100, 200, 'Rack A-1', 1.80, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-LISINOPRIL' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW()),
  -- Near-expiry batch (triggers alert)
  ('91111111-1111-1111-1111-111111111102', v_tenant_id, 'a1111111-1111-1111-1111-111111111111', 'MED-001', 'INTERNAL', 'Lisinopril 10mg Tablet', 'Lisinopril', 'tablet', '10mg', 'tablet', 'LIS-2024-002', 'Mylan Pharmaceuticals', (NOW() + INTERVAL '25 days')::date, (NOW() - INTERVAL '11 months')::date, 200, 45, 100, 200, 'Rack A-1', 1.80, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-LISINOPRIL' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());

  -- Atorvastatin 20mg  (MED-002 · a1111111-...112)
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111103', v_tenant_id, 'a1111111-1111-1111-1111-111111111112', 'MED-002', 'INTERNAL', 'Atorvastatin 20mg Tablet', 'Atorvastatin Calcium', 'tablet', '20mg', 'tablet', 'ATO-2024-001', 'Pfizer', (NOW() + INTERVAL '20 months')::date, (NOW() - INTERVAL '1 month')::date, 600, 410, 150, 300, 'Rack A-2', 2.20, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-ATORVASTATIN' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());

  -- Metoprolol Succinate 50mg  (MED-003 · a1111111-...113) — low stock
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111104', v_tenant_id, 'a1111111-1111-1111-1111-111111111113', 'MED-003', 'INTERNAL', 'Metoprolol Succinate 50mg Tablet', 'Metoprolol Succinate', 'tablet', '50mg', 'tablet', 'MET-2024-001', 'AstraZeneca', (NOW() + INTERVAL '22 months')::date, (NOW() - INTERVAL '3 months')::date, 400, 80, 100, 200, 'Rack A-3', 1.95, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-METOPROLOL' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());
  -- qty_on_hand 80 < reorder_level 100 → triggers low-stock alert

  -- ========================================================================
  -- DIABETES MEDICATIONS
  -- ========================================================================

  -- Metformin HCl 500mg  (MED-004 · a1111111-...114)
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111105', v_tenant_id, 'a1111111-1111-1111-1111-111111111114', 'MED-004', 'INTERNAL', 'Metformin HCl 500mg Tablet', 'Metformin Hydrochloride', 'tablet', '500mg', 'tablet', 'MFM-2024-001', 'Bristol-Myers Squibb', (NOW() + INTERVAL '24 months')::date, (NOW() - INTERVAL '1 month')::date, 1000, 720, 200, 400, 'Rack B-1', 0.95, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-METFORMIN' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());

  -- ========================================================================
  -- ANTIBIOTICS
  -- ========================================================================

  -- Amoxicillin 500mg  (MED-005 · a1111111-...115)
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111106', v_tenant_id, 'a1111111-1111-1111-1111-111111111115', 'MED-005', 'INTERNAL', 'Amoxicillin 500mg Capsule', 'Amoxicillin', 'capsule', '500mg', 'capsule', 'AMX-2024-001', 'GlaxoSmithKline', (NOW() + INTERVAL '16 months')::date, (NOW() - INTERVAL '2 months')::date, 500, 340, 100, 200, 'Rack C-1', 1.20, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-AMOXICILLIN' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());

  -- Azithromycin 250mg  (MED-006 · a1111111-...116)
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111107', v_tenant_id, 'a1111111-1111-1111-1111-111111111116', 'MED-006', 'INTERNAL', 'Azithromycin 250mg Tablet', 'Azithromycin', 'tablet', '250mg', 'tablet', 'AZI-2024-001', 'Pfizer', (NOW() + INTERVAL '15 months')::date, (NOW() - INTERVAL '3 months')::date, 300, 185, 75, 150, 'Rack C-2', 3.10, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-AZITHROMYCIN' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());

  -- Ciprofloxacin 500mg  (MED-007 · a1111111-...117) — low stock
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111108', v_tenant_id, 'a1111111-1111-1111-1111-111111111117', 'MED-007', 'INTERNAL', 'Ciprofloxacin 500mg Tablet', 'Ciprofloxacin HCl', 'tablet', '500mg', 'tablet', 'CIP-2024-001', 'Bayer', (NOW() + INTERVAL '19 months')::date, (NOW() - INTERVAL '2 months')::date, 400, 55, 100, 200, 'Rack C-3', 2.40, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-CIPROFLOXACIN' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());
  -- qty_on_hand 55 < reorder_level 100 → triggers low-stock alert

  -- ========================================================================
  -- PAIN MANAGEMENT
  -- ========================================================================

  -- Ibuprofen 400mg  (MED-008 · a1111111-...118)
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111109', v_tenant_id, 'a1111111-1111-1111-1111-111111111118', 'MED-008', 'INTERNAL', 'Ibuprofen 400mg Tablet', 'Ibuprofen', 'tablet', '400mg', 'tablet', 'IBU-2024-001', 'Pfizer Consumer Healthcare', (NOW() + INTERVAL '21 months')::date, (NOW() - INTERVAL '1 month')::date, 800, 630, 200, 400, 'Rack D-1', 0.55, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-IBUPROFEN' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());

  -- Paracetamol 500mg  (MED-009 · a1111111-...119) — two batches, second is near-expiry + low-stock
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111110', v_tenant_id, 'a1111111-1111-1111-1111-111111111119', 'MED-009', 'INTERNAL', 'Paracetamol 500mg Tablet', 'Acetaminophen', 'tablet', '500mg', 'tablet', 'PCM-2024-001', 'Johnson & Johnson', (NOW() + INTERVAL '23 months')::date, (NOW() - INTERVAL '2 months')::date, 2000, 1540, 400, 800, 'Rack D-2', 0.30, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-PARACETAMOL' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW()),
  ('91111111-1111-1111-1111-111111111111', v_tenant_id, 'a1111111-1111-1111-1111-111111111119', 'MED-009', 'INTERNAL', 'Paracetamol 500mg Tablet', 'Acetaminophen', 'tablet', '500mg', 'tablet', 'PCM-2024-002', 'Johnson & Johnson', (NOW() + INTERVAL '20 days')::date, (NOW() - INTERVAL '11 months')::date, 500, 75, 400, 800, 'Rack D-2', 0.30, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-PARACETAMOL' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());
  -- Batch 2: near-expiry (20 days) AND low stock (75 < 400)

  -- Tramadol HCl 50mg — CONTROLLED  (MED-010 · a1111111-...120)
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, controlled_class, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111112', v_tenant_id, 'a1111111-1111-1111-1111-111111111120', 'MED-010', 'INTERNAL', 'Tramadol HCl 50mg Tablet', 'Tramadol Hydrochloride', 'tablet', '50mg', 'tablet', 'TRM-2024-001', 'Janssen Pharmaceuticals', (NOW() + INTERVAL '18 months')::date, (NOW() - INTERVAL '2 months')::date, 200, 130, 50, 100, 'Controlled Cabinet CC-1', 2.80, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-TRAMADOL' AND tenant_id = v_tenant_id LIMIT 1), 'active', true, 'Schedule IV', v_user, v_user, NOW(), NOW());

  -- ========================================================================
  -- RESPIRATORY MEDICATIONS
  -- ========================================================================

  -- Salbutamol 100mcg Inhaler  (MED-011 · a1111111-...121)
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111113', v_tenant_id, 'a1111111-1111-1111-1111-111111111121', 'MED-011', 'INTERNAL', 'Salbutamol 100mcg Inhaler', 'Albuterol Sulfate', 'inhaler', '100mcg/actuation', 'inhaler', 'SAL-2024-001', 'GlaxoSmithKline', (NOW() + INTERVAL '20 months')::date, (NOW() - INTERVAL '1 month')::date, 100, 68, 20, 40, 'Rack E-1', 19.50, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-SALBUTAMOL' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());

  -- ========================================================================
  -- GASTROINTESTINAL MEDICATIONS
  -- ========================================================================

  -- Omeprazole 20mg  (MED-012 · a1111111-...122)
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111114', v_tenant_id, 'a1111111-1111-1111-1111-111111111122', 'MED-012', 'INTERNAL', 'Omeprazole 20mg Capsule', 'Omeprazole', 'capsule', '20mg', 'capsule', 'OMP-2024-001', 'AstraZeneca', (NOW() + INTERVAL '17 months')::date, (NOW() - INTERVAL '3 months')::date, 600, 445, 100, 200, 'Rack F-1', 1.40, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-OMEPRAZOLE' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());

  -- ========================================================================
  -- ANTIHISTAMINES
  -- ========================================================================

  -- Cetirizine HCl 10mg  (MED-013 · a1111111-...123)
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111115', v_tenant_id, 'a1111111-1111-1111-1111-111111111123', 'MED-013', 'INTERNAL', 'Cetirizine HCl 10mg Tablet', 'Cetirizine Hydrochloride', 'tablet', '10mg', 'tablet', 'CTZ-2024-001', 'UCB Pharma', (NOW() + INTERVAL '22 months')::date, (NOW() - INTERVAL '1 month')::date, 500, 390, 100, 200, 'Rack G-1', 0.85, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-CETIRIZINE' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());

  -- ========================================================================
  -- ANTIHYPERTENSIVES
  -- ========================================================================

  -- Amlodipine Besylate 5mg  (MED-014 · a1111111-...124)
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111116', v_tenant_id, 'a1111111-1111-1111-1111-111111111124', 'MED-014', 'INTERNAL', 'Amlodipine Besylate 5mg Tablet', 'Amlodipine Besylate', 'tablet', '5mg', 'tablet', 'AML-2024-001', 'Pfizer', (NOW() + INTERVAL '21 months')::date, (NOW() - INTERVAL '2 months')::date, 400, 275, 100, 200, 'Rack A-4', 1.75, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-AMLODIPINE' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());

  -- ========================================================================
  -- ANTICOAGULANTS
  -- ========================================================================

  -- Warfarin Sodium 5mg  (MED-015 · a1111111-...125)
  INSERT INTO pharmacy_stocks (id, tenant_id, medication_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, billing_item_id, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111117', v_tenant_id, 'a1111111-1111-1111-1111-111111111125', 'MED-015', 'INTERNAL', 'Warfarin Sodium 5mg Tablet', 'Warfarin Sodium', 'tablet', '5mg', 'tablet', 'WAR-2024-001', 'Bristol-Myers Squibb', (NOW() + INTERVAL '16 months')::date, (NOW() - INTERVAL '4 months')::date, 300, 190, 75, 150, 'Rack A-5', 2.50, 'INR', (SELECT id FROM billing_items WHERE billing_code = 'MED-WARFARIN' AND tenant_id = v_tenant_id LIMIT 1), 'active', false, v_user, v_user, NOW(), NOW());

  -- ========================================================================
  -- OTC / GENERAL ITEMS  (no medication_id — sold over the counter)
  -- ========================================================================

  -- Vitamin C 500mg Chewable Tablet
  INSERT INTO pharmacy_stocks (id, tenant_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111118', v_tenant_id, 'OTC-VITC-500', 'INTERNAL', 'Vitamin C 500mg Chewable Tablet', 'Ascorbic Acid', 'tablet', '500mg', 'tablet', 'VC-2024-001', 'Cipla', (NOW() + INTERVAL '24 months')::date, (NOW() - INTERVAL '1 month')::date, 1000, 870, 200, 400, 'OTC Shelf 1', 0.20, 'INR', 'active', false, v_user, v_user, NOW(), NOW());

  -- Multivitamin + Mineral Tablet
  INSERT INTO pharmacy_stocks (id, tenant_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111119', v_tenant_id, 'OTC-MULTI', 'INTERNAL', 'Multivitamin + Mineral Tablet', 'Multivitamin Complex', 'tablet', 'Standard', 'tablet', 'MV-2024-001', 'Sun Pharma', (NOW() + INTERVAL '18 months')::date, (NOW() - INTERVAL '2 months')::date, 500, 380, 100, 200, 'OTC Shelf 2', 0.85, 'INR', 'active', false, v_user, v_user, NOW(), NOW());

  -- Oral Rehydration Salts (ORS) Sachet
  INSERT INTO pharmacy_stocks (id, tenant_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111120', v_tenant_id, 'OTC-ORS', 'INTERNAL', 'Oral Rehydration Salts Sachet', 'Sodium Chloride + Glucose + Potassium', 'sachet', '21.8g', 'sachet', 'ORS-2024-001', 'Electral', (NOW() + INTERVAL '30 months')::date, (NOW() - INTERVAL '1 month')::date, 600, 490, 100, 200, 'OTC Shelf 3', 0.40, 'INR', 'active', false, v_user, v_user, NOW(), NOW());

  -- Normal Saline 0.9% IV Infusion 500ml
  INSERT INTO pharmacy_stocks (id, tenant_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111121', v_tenant_id, 'IV-NS-500', 'INTERNAL', 'Normal Saline 0.9% IV Infusion 500ml', 'Sodium Chloride', 'infusion', '0.9% w/v', 'bag', 'NS-2024-001', 'Baxter', (NOW() + INTERVAL '36 months')::date, (NOW() - INTERVAL '1 month')::date, 200, 145, 50, 100, 'IV Store Ward-1', 28.00, 'INR', 'active', false, v_user, v_user, NOW(), NOW());

  -- Dextrose 5% IV Infusion 500ml — low stock
  INSERT INTO pharmacy_stocks (id, tenant_id, drug_code, code_system, drug_name, generic_name, dosage_form, strength, unit, batch_number, manufacturer, expiry_date, received_date, quantity_received, quantity_on_hand, reorder_level, reorder_quantity, storage_location, unit_cost_price, currency, status, is_controlled, created_by, updated_by, created_at, updated_at)
  VALUES
  ('91111111-1111-1111-1111-111111111122', v_tenant_id, 'IV-D5-500', 'INTERNAL', 'Dextrose 5% IV Infusion 500ml', 'Dextrose Monohydrate', 'infusion', '5% w/v', 'bag', 'D5-2024-001', 'Baxter', (NOW() + INTERVAL '36 months')::date, (NOW() - INTERVAL '1 month')::date, 200, 30, 50, 100, 'IV Store Ward-1', 30.00, 'INR', 'active', false, v_user, v_user, NOW(), NOW());
  -- qty_on_hand 30 < reorder_level 50 → triggers low-stock alert

  RAISE NOTICE 'Pharmacy stock seed complete: 24 stock batches inserted for tenant %', v_tenant_id;
  RAISE NOTICE 'Low-stock items: Metoprolol (80<100), Ciprofloxacin (55<100), Dextrose 5%% (30<50)';
  RAISE NOTICE 'Near-expiry items: Lisinopril batch-2 (25 days), Paracetamol batch-2 (20 days)';

END $$;
