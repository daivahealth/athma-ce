-- Longevity Protocols Seed Data

INSERT INTO longevity_protocols (
  id,
  tenant_id,
  code,
  name,
  description,
  protocol_type,
  administration_route,
  typical_duration,
  frequency_recommendation,
  components,
  contraindications,
  pre_requirements,
  monitoring_protocol,
  consent_required,
  estimated_cost,
  is_active,
  created_by,
  created_at,
  updated_at
) VALUES 
-- NAD+ Therapy
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'NAD_IV_500',
  'NAD+ Cellular Regeneration (500mg)',
  'High-dose NAD+ intravenous infusion for cellular repair, cognitive enhancement, and anti-aging.',
  'nad_plus',
  'iv',
  120,
  'Monthly or as per cellular optimization plan',
  '[
    {"name": "NAD+", "dose": "500", "unit": "mg", "optional": false},
    {"name": "Normal Saline", "dose": "500", "unit": "ml", "optional": false}
  ]'::jsonb,
  '{"conditions": ["pregnancy", "active_cancer", "severe_kidney_disease"]}'::jsonb,
  '{"labs": ["baseline_biomarkers", "renal_function"]}'::jsonb,
  '{"vitals": ["heart_rate", "blood_pressure"], "interval": 30}'::jsonb,
  true,
  850.00,
  true,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()
),
-- Glutathione Glow
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'GLUTATHIONE_IV_2000',
  'Glutathione Master Antioxidant (2000mg)',
  'Premier antioxidant therapy for detoxification, skin brightening, and immune support.',
  'iv_therapy',
  'iv',
  45,
  'Weekly for 4-6 weeks for loading, then monthly maintenance',
  '[
    {"name": "Glutathione", "dose": "2000", "unit": "mg", "optional": false},
    {"name": "Vitamin C", "dose": "1000", "unit": "mg", "optional": true},
    {"name": "Normal Saline", "dose": "250", "unit": "ml", "optional": false}
  ]'::jsonb,
  '{"conditions": ["asthma", "g6pd_deficiency"]}'::jsonb,
  NULL,
  '{"vitals": ["pre_treatment", "post_treatment"]}'::jsonb,
  true,
  350.00,
  true,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()
),
-- B12 Energy Boost
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'B12_IM_METHYL',
  'Methyl-B12 Energy Injection',
  'Pure Methylcobalamin for rapid energy boost and neurological support.',
  'iv_therapy',
  'im',
  5,
  'Monthly',
  '[
    {"name": "Methylcobalamin", "dose": "5000", "unit": "mcg", "optional": false}
  ]'::jsonb,
  NULL,
  NULL,
  NULL,
  false,
  75.00,
  true,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW(),
  NOW()
)
ON CONFLICT (tenant_id, code) DO NOTHING;
