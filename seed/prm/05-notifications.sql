-- Seed: PRM notification-center demo data
-- Mirrors the notification-center prototype. Re-runnable via ON CONFLICT (id).
-- Requires uuid_from_text() from prm/00-setup.sql.
--
-- Recipient targeting:
--   user_id = admin@zeal.local (aaaaaaaa-...) for user-addressed items
--   user_id NULL             for tenant-wide broadcast items (optionally by audience)

INSERT INTO notifications (
  id,
  tenant_id,
  user_id,
  audience,
  type,
  severity,
  title,
  body,
  entity_ref,
  read,
  read_at,
  created_at
) VALUES
  (
    uuid_from_text('prm-notif-consent-expiring'),
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    NULL,
    'consent_expiring',
    'warning',
    'Consent expiring',
    'Data-sharing consent for Ahmed Al Mansoori expires in 3 days.',
    'consent:ahmed-al-mansoori',
    false,
    NULL,
    NOW() - INTERVAL '5 minutes'
  ),
  (
    uuid_from_text('prm-notif-claim-denied'),
    '11111111-1111-1111-1111-111111111111',
    NULL,
    'billing',
    'claim_denied',
    'error',
    'Claim denied',
    'Payer denied claim CLM-10231. Review remittance and resubmit within 30 days.',
    'claim:CLM-10231',
    false,
    NULL,
    NOW() - INTERVAL '30 minutes'
  ),
  (
    uuid_from_text('prm-notif-hba1c-above-target'),
    '11111111-1111-1111-1111-111111111111',
    NULL,
    'nurse',
    'lab_out_of_range',
    'action',
    'HbA1c above target',
    'Fatima Hassan HbA1c is 8.4% (target < 7.0%). Consider care-plan follow-up.',
    'encounter:fatima-hassan-hba1c',
    false,
    NULL,
    NOW() - INTERVAL '2 hours'
  ),
  (
    uuid_from_text('prm-notif-appointment-confirmed'),
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    NULL,
    'appointment_confirmed',
    'info',
    'Appointment confirmed',
    'Ahmed Al Mansoori confirmed the appointment scheduled for tomorrow at 10:00.',
    'appointment:ahmed-al-mansoori-followup',
    true,
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '4 hours'
  )
ON CONFLICT (id) DO NOTHING;
