-- Seed: PRM provider callbacks

INSERT INTO provider_callbacks (
  id,
  tenant_id,
  channel,
  provider_message_id,
  received_at,
  payload,
  processed,
  processed_at
) VALUES
  (
    uuid_from_text('prm-callback-sms-1'),
    '11111111-1111-1111-1111-111111111111',
    'sms',
    'SM1234567890',
    NOW() - INTERVAL '2 hours',
    '{"status":"delivered","to":"+971501234567","from":"+971500000000","timestamp":"2026-01-20T08:30:00Z"}'::jsonb,
    true,
    NOW() - INTERVAL '1 hour'
  ),
  (
    uuid_from_text('prm-callback-email-1'),
    '11111111-1111-1111-1111-111111111111',
    'email',
    'EM9876543210',
    NOW() - INTERVAL '1 day',
    '{"status":"opened","to":"fatima.hassan@example.ae","from":"no-reply@zeal.local","timestamp":"2026-01-19T12:05:00Z"}'::jsonb,
    true,
    NOW() - INTERVAL '20 hours'
  ),
  (
    uuid_from_text('prm-callback-whatsapp-1'),
    '11111111-1111-1111-1111-111111111111',
    'whatsapp',
    'WA5555555555',
    NOW() - INTERVAL '3 hours',
    '{"status":"failed","reason":"undelivered","to":"+971502345678","timestamp":"2026-01-20T07:10:00Z"}'::jsonb,
    false,
    NULL
  )
ON CONFLICT DO NOTHING;
