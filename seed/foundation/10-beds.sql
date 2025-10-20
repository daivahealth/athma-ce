-- Seed: Beds (109 total) using UUIDv5

WITH ns AS (
  SELECT '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid AS dns
),
ward_ids AS (
  SELECT code, id FROM wards WHERE code IN ('ICU-1','ICU-2','NICU-1','PICU-1','GEN-A','GEN-B','GEN-C','ISO-1','MAT-1')
),
-- Define plan for each ward
plan AS (
  SELECT 'ICU-1' as code, 10 as total, 'icu' as bed_type UNION ALL
  SELECT 'ICU-2', 8, 'icu' UNION ALL
  SELECT 'NICU-1', 6, 'icu' UNION ALL
  SELECT 'PICU-1', 5, 'icu' UNION ALL
  SELECT 'GEN-A', 20, 'standard' UNION ALL
  SELECT 'GEN-B', 20, 'standard' UNION ALL
  SELECT 'GEN-C', 20, 'standard' UNION ALL
  SELECT 'ISO-1', 5, 'isolation' UNION ALL
  SELECT 'MAT-1', 15, 'private'
)
INSERT INTO beds (id, ward_id, bed_number, bed_type, features, status, current_patient_id, assigned_at, created_at, updated_at)
SELECT 
  uuid_generate_v5((SELECT dns FROM ns), 'bed:' || p.code || ':' || lpad(gs::text, 3, '0')) as id,
  wid.id as ward_id,
  CASE 
    WHEN p.code IN ('GEN-A','GEN-B','GEN-C') THEN p.code || '-' || lpad(gs::text, 2, '0')
    ELSE p.code || '-' || lpad(gs::text, 3, '0')
  END as bed_number,
  p.bed_type,
  CASE p.bed_type 
    WHEN 'icu' THEN '{"oxygen": true, "monitor": true, "ventilator": true, "ecg": true}'::jsonb
    WHEN 'isolation' THEN '{"oxygen": true, "monitor": true, "negative_pressure": true, "anteroom": true}'::jsonb
    WHEN 'private' THEN '{"oxygen": true, "monitor": true, "bassinet": true, "private_bathroom": true, "tv": true, "sofa": true}'::jsonb
    ELSE '{"oxygen": true, "call_button": true}'::jsonb
  END as features,
  'available' as status,
  NULL, NULL, NOW(), NOW()
FROM plan p
JOIN ward_ids wid ON wid.code = p.code
JOIN generate_series(1, p.total) AS gs ON true
ORDER BY wid.code;

-- Sync ward bed counts
UPDATE wards w SET 
  total_beds = x.cnt,
  available_beds = x.cnt
FROM (
  SELECT ward_id, COUNT(*)::int as cnt FROM beds GROUP BY ward_id
) x
WHERE x.ward_id = w.id;
