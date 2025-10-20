-- Seed: Spaces (~65 rooms) using UUIDv5

WITH ns AS (
  SELECT '6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid AS dns
),
alloc AS (
  -- Allocation per clinic code (unique codes across all clinics)
  SELECT 'CARDIO-1'::text as code, 5 as rooms UNION ALL
  SELECT 'PEDIA-1', 8 UNION ALL
  SELECT 'GEN-MED-1', 10 UNION ALL
  SELECT 'ORTHO-1', 6 UNION ALL
  SELECT 'DERM-1', 4 UNION ALL
  SELECT 'OPHTHAL-1', 5 UNION ALL
  SELECT 'ENT-1', 4 UNION ALL
  SELECT 'GYNECO-1', 6 UNION ALL
  SELECT 'NEURO-1', 4 UNION ALL
  SELECT 'PSYCH-1', 3 UNION ALL
  SELECT 'DT-GEN-MED-1', 6 UNION ALL
  SELECT 'DT-FAM-MED-1', 4
)
INSERT INTO spaces (id, facility_id, department_id, clinic_id, name, space_number, space_type, floor_number, equipment, capacity, is_active, created_at, updated_at)
SELECT 
  uuid_generate_v5((SELECT dns FROM ns), 'space:' || a.code || ':' || lpad(gs::text, 2, '0')) as id,
  f.id as facility_id,
  d.id as department_id,
  cl.id as clinic_id,
  a.code || ' - Room ' || lpad(gs::text, 2, '0') as name,
  a.code || '-' || lpad(gs::text, 2, '0') as space_number,
  'consultation_room' as space_type,
  COALESCE(cl.floor_number, '1') as floor_number,
  '[]'::jsonb as equipment,
  1 as capacity,
  TRUE as is_active,
  NOW(), NOW()
FROM alloc a
JOIN clinics cl ON cl.code = a.code
JOIN departments d ON d.id = cl.department_id
JOIN facilities f ON f.id = d.facility_id
JOIN generate_series(1, a.rooms) AS gs ON true
ORDER BY a.code, gs;
