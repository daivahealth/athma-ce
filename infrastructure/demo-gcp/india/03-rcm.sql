-- =============================================================================
-- Demo overlay (zeal_rcm): follow 01-foundation.sql in billing data.
--   * The sample national payer drops the "Zeal" brand.
--   * Prescriber names stored with dispensings follow the staff renames.
-- Idempotent. Run after 01-foundation.sql.
-- =============================================================================

BEGIN;

UPDATE payers SET payer_name = 'National Demo Health Insurance'
WHERE payer_name = 'Zeal National Health Insurance';

CREATE TEMP TABLE demo_name_map (old_name text, new_name text) ON COMMIT DROP;
INSERT INTO demo_name_map VALUES
  ('Mohammed Ali Hassan', 'Imran Qureshi'),
  ('John David Williams', 'Sameer Joshi'),
  ('Ahmed Al-Mansoori',   'Vikram Iyer'),
  ('Aisha Al-Mazrouei',   'Ananya Desai'),
  ('Fatima Al-Zaabi',     'Meera Krishnan'),
  ('Layla Al-Shamsi',     'Kavya Nair'),
  ('Carlos Rodriguez',    'Rohan D''Souza'),
  ('Omar Al-Ketbi',       'Arjun Mehta'),
  ('Mohammed Hassan',     'Imran Qureshi'),
  ('Nadia Ibrahim',       'Sana Shaikh'),
  ('John Williams',       'Sameer Joshi'),
  ('Maria Santos',        'Maria Fernandes'),
  ('Ahmed Yousef',        'Aditya Rao');

DO $$
DECLARE m record;
BEGIN
  FOR m IN SELECT * FROM demo_name_map ORDER BY length(old_name) DESC LOOP
    UPDATE pharmacy_dispensings SET prescribed_by_name = replace(prescribed_by_name, m.old_name, m.new_name)
    WHERE prescribed_by_name LIKE '%' || m.old_name || '%';
  END LOOP;
END $$;

COMMIT;
