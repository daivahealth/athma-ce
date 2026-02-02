-- Seed: PRM patient preferences

INSERT INTO patient_preferences (
  id,
  tenant_id,
  patient_id,
  preferred_language,
  channel_order,
  quiet_hours_start,
  quiet_hours_end,
  timezone,
  dnd_enabled,
  sms_opt_out,
  email_opt_out,
  whatsapp_opt_out,
  notes,
  created_at,
  created_by,
  updated_at
) VALUES
  (
    uuid_from_text('prm-pref-ahmed-al-mansoori'),
    '11111111-1111-1111-1111-111111111111',
    uuid_from_text('patient-ahmed-al-mansoori'),
    'ar',
    '["whatsapp","sms","email"]'::jsonb,
    '21:00',
    '07:00',
    'Asia/Dubai',
    false,
    false,
    false,
    false,
    'Prefers WhatsApp messages in the evening.',
    NOW(),
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    NOW()
  ),
  (
    uuid_from_text('prm-pref-fatima-hassan'),
    '11111111-1111-1111-1111-111111111111',
    uuid_from_text('patient-fatima-hassan'),
    'en',
    '["sms","email","whatsapp"]'::jsonb,
    '20:00',
    '08:00',
    'Asia/Dubai',
    false,
    false,
    false,
    true,
    'Opted out of WhatsApp notifications.',
    NOW(),
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    NOW()
  )
ON CONFLICT (tenant_id, patient_id) DO NOTHING;
