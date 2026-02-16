-- Wellness Program Templates Seed Data

INSERT INTO wellness_program_templates (
  id,
  tenant_id,
  code,
  name,
  description,
  program_type,
  duration_weeks,
  total_sessions,
  sessions_per_week,
  phases,
  milestones,
  prerequisites,
  estimated_cost,
  membership_tier_required,
  created_by,
  created_at,
  updated_at
) VALUES 
-- Weight Loss Program
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'WEIGHT_LOSS_12W',
  '12-Week Weight Loss Journey',
  'A comprehensive program combining nutrition, exercise, and lifestyle coaching to achieve sustainable weight loss.',
  'weight_loss',
  12,
  24,
  2,
  '[
    {
      "name": "Foundation",
      "weekStart": 1,
      "weekEnd": 4,
      "goals": ["Establish baseline", "Dietary cleanup", "Movement habit"],
      "sessionTypes": ["nutrition_consult", "fitness_assessment"]
    },
    {
      "name": "Acceleration",
      "weekStart": 5,
      "weekEnd": 8,
      "goals": ["Increase intensity", "Meal planning mastery", "Sleep optimization"],
      "sessionTypes": ["coaching", "fitness_training"]
    },
    {
      "name": "Maintenance",
      "weekStart": 9,
      "weekEnd": 12,
      "goals": ["Long-term strategy", "Social navigation", "Relapse prevention"],
      "sessionTypes": ["coaching", "nutrition_review"]
    }
  ]'::jsonb,
  '[
    {
      "name": "Initial Assessment",
      "weekNumber": 1,
      "criteria": "Complete all baseline measurements",
      "assessments": ["body_comp", "blood_panel"]
    },
    {
      "name": "Mid-Program Checkpoint",
      "weekNumber": 6,
      "criteria": "5% weight reduction or waist circumference improvement",
      "assessments": ["body_comp"]
    },
    {
      "name": "Completion",
      "weekNumber": 12,
      "criteria": "Program goals met and maintenance plan created",
      "assessments": ["body_comp", "final_review"]
    }
  ]'::jsonb,
  '{"age_range": {"min": 18, "max": 75}, "conditions": ["obesity", "metabolic_syndrome", "overweight"]}'::jsonb,
  1200.00,
  NULL,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()
),
-- Stress Management Program
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'STRESS_MGMT_8W',
  'Stress Mastery',
  'Learn tools and techniques to manage stress, improve sleep, and enhance resilience.',
  'stress_management',
  8,
  8,
  1,
  '[
    {
      "name": "Awareness",
      "weekStart": 1,
      "weekEnd": 2,
      "goals": ["Identify triggers", "Stress physiology education"],
      "sessionTypes": ["coaching"]
    },
    {
      "name": "Tools & Techniques",
      "weekStart": 3,
      "weekEnd": 6,
      "goals": ["Breathwork", "Mindfulness", "Cognitive reframing"],
      "sessionTypes": ["coaching", "meditation_instruction"]
    },
    {
      "name": "Integration",
      "weekStart": 7,
      "weekEnd": 8,
      "goals": ["Daily practice routine", "Resilience planning"],
      "sessionTypes": ["coaching"]
    }
  ]'::jsonb,
  '[
    {
      "name": "Baseline Stress Audit",
      "weekNumber": 1,
      "criteria": "Complete stress inventory",
      "assessments": ["stress_survey"]
    },
    {
      "name": "Technique Mastery",
      "weekNumber": 4,
      "criteria": "Demonstrated proficiency in 3 techniques",
      "assessments": ["observer_rating"]
    },
    {
      "name": "Program Completion",
      "weekNumber": 8,
      "criteria": "Reduced stress score by 20%",
      "assessments": ["stress_survey_post"]
    }
  ]'::jsonb,
  NULL,
  800.00,
  NULL,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()
),
-- Metabolic Reset
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'METABOLIC_RESET_4W',
  '28-Day Metabolic Reset',
  'Intensive program to reboot your metabolism through nutrition and targeted lifestyle changes.',
  'metabolic_reset',
  4,
  4,
  1,
  '[
    {
      "name": "Elimination",
      "weekStart": 1,
      "weekEnd": 2,
      "goals": ["Remove inflammatory foods", "Stabilize blood sugar"],
      "sessionTypes": ["nutrition_consult"]
    },
    {
      "name": "Reintroduction",
      "weekStart": 3,
      "weekEnd": 4,
      "goals": ["Identify sensitivities", "Create sustainable plan"],
      "sessionTypes": ["nutrition_review"]
    }
  ]'::jsonb,
  '[
    {
      "name": "Kickoff",
      "weekNumber": 1,
      "criteria": "Pantry cleanout and grocery shop",
      "assessments": []
    },
    {
      "name": "Completion",
      "weekNumber": 4,
      "criteria": "Plan adherence > 90%",
      "assessments": []
    }
  ]'::jsonb,
  NULL,
  450.00,
  NULL,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()

)
ON CONFLICT (tenant_id, code) DO NOTHING;
