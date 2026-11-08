-- =============================================================================
-- Demo overlay (zeal_clinical): follow the staff renames in 01-foundation.sql
-- on the copies of staff names stored with appointments and schedules.
-- Idempotent. Run after 01-foundation.sql.
-- =============================================================================

BEGIN;

-- Longest names first, so "Mohammed Ali Hassan" is replaced before "Mohammed Hassan".
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
    UPDATE appointments SET staff_display_name = replace(staff_display_name, m.old_name, m.new_name)
    WHERE staff_display_name LIKE '%' || m.old_name || '%';
    UPDATE staff_schedules SET staff_display_name = replace(staff_display_name, m.old_name, m.new_name)
    WHERE staff_display_name LIKE '%' || m.old_name || '%';
  END LOOP;
END $$;

COMMIT;
