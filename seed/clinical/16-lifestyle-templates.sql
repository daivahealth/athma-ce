-- Lifestyle Plans Seed Data

-- Nutrition Plans
INSERT INTO nutrition_plans (
  id,
  tenant_id,
  patient_id,
  plan_name,
  plan_type,
  status,
  start_date,
  target_calories,
  target_protein,
  target_carbs,
  target_fat,
  meals_per_day,
  snacks_per_day,
  meal_plan,
  notes,
  created_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  uuid_from_text('patient-ahmed-al-mansoori'), -- Sample patient ID
  'Standard Ketogenic Plan',
  'therapeutic',
  'active',
  CURRENT_DATE,
  2200,
  120.0,
  30.0,
  180.0,
  3,
  1,
  '{"breakfast": "Eggs and Avocado", "lunch": "Salmon Salad", "dinner": "Steak with Broccoli"}'::jsonb,
  'Focus on healthy fats and keep net carbs below 30g.',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Exercise Prescriptions
INSERT INTO exercise_prescriptions (
  id,
  tenant_id,
  patient_id,
  prescription_name,
  goal,
  status,
  start_date,
  sessions_per_week,
  minutes_per_session,
  target_hr_min,
  target_hr_max,
  exercises,
  notes,
  created_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  uuid_from_text('patient-ahmed-al-mansoori'), -- Sample patient ID
  'Cardiovascular Health Level 1',
  'cardiovascular',
  'active',
  CURRENT_DATE,
  3,
  30,
  110,
  140,
  '[
    {"type": "aerobic", "name": "Brisk Walking", "duration": 30, "intensity": "moderate"},
    {"type": "flexibility", "name": "Yoga", "duration": 15, "intensity": "low"}
  ]'::jsonb,
  'Start slow and monitor heart rate during exercises.',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
