-- Membership Plans Seed Data

INSERT INTO membership_plans (
  id,
  tenant_id,
  name,
  code,
  description,
  tier,
  monthly_price,
  yearly_price,
  currency,
  benefits,
  is_active,
  created_by,
  created_at,
  updated_at
) VALUES 
-- Basic Plan
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'Basic Wellness',
  'MEM_BASIC',
  'Entry-level membership for general health tracking.',
  'basic',
  29.99,
  299.90,
  'USD',
  '[
    {"name": "Monthly Health Report", "included": true},
    {"name": "Basic Biomarker Tracking", "included": true},
    {"name": "24/7 Chat Support", "included": false},
    {"name": "Telemedicine", "included": false}
  ]'::jsonb,
  true,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()
),
-- Standard Plan
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'Standard Health',
  'MEM_STANDARD',
  'Comprehensive wellness plan for proactive health management.',
  'standard',
  59.99,
  599.90,
  'USD',
  '[
    {"name": "Monthly Health Report", "included": true},
    {"name": "Advanced Biomarker Tracking", "included": true},
    {"name": "24/7 Chat Support", "included": true},
    {"name": "1 Telemedicine Session/Month", "included": true}
  ]'::jsonb,
  true,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()
),
-- Premium Plan
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'Premium Longevity',
  'MEM_PREMIUM',
  'Elite longevity and performance optimization plan.',
  'premium',
  149.99,
  1499.90,
  'USD',
  '[
    {"name": "Weekly Health Report", "included": true},
    {"name": "Full Longevity Panel", "included": true},
    {"name": "Priority 24/7 Chat Support", "included": true},
    {"name": "Unlimited Telemedicine", "included": true},
    {"name": "Personal Health Coach", "included": true}
  ]'::jsonb,
  true,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()
),
-- VIP Plan
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'VIP Executive',
  'MEM_VIP',
  'The ultimate personalized health experience with white-glove service.',
  'vip',
  499.99,
  4999.90,
  'USD',
  '[
    {"name": "Daily Health Insights", "included": true},
    {"name": "Quarterly Full Body MRI", "included": true},
    {"name": "Dedicated Medical Concierge", "included": true},
    {"name": "Unlimited Telemedicine & In-person", "included": true},
    {"name": "Global Medical Assistance", "included": true}
  ]'::jsonb,
  true,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()
)
ON CONFLICT (tenant_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  tier = EXCLUDED.tier,
  monthly_price = EXCLUDED.monthly_price,
  yearly_price = EXCLUDED.yearly_price,
  benefits = EXCLUDED.benefits,
  updated_at = NOW();
