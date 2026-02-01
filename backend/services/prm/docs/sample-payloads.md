# Sample API Payloads

## Event Ingestion

### POST /v1/events

**Appointment Confirmed Event:**
```json
{
  "patient_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "patient_display_name": "John Doe",
  "patient_gender": "M",
  "patient_age_years_at_event": 45,
  "patient_mrn": "MRN-123456",
  "patient_mobile_masked": "+971***1234",
  "source_system": "zeal-clinical",
  "source_module": "appointment",
  "event_type": "appointment_confirmed",
  "event_subtype": "new_patient",
  "severity": 0,
  "occurred_at": "2026-01-15T10:30:00Z",
  "entity_type": "appointment",
  "entity_id": "f1e2d3c4-b5a6-7890-cdef-123456789abc",
  "payload": {
    "appointment_datetime": "2026-01-20T14:00:00Z",
    "specialty": "cardiology",
    "physician_name": "Dr. Sarah Smith",
    "facility_name": "Zeal Clinic Dubai",
    "is_new_patient": true
  },
  "correlation_id": "corr-2026-01-15-001",
  "dedupe_key": "apt-confirm-f1e2d3c4-2026-01-15"
}
```

**Response (201):**
```json
{
  "event_id": "evt-uuid-here",
  "duplicate": false,
  "rules_evaluated": 3,
  "jobs_created": 2
}
```

**Encounter Completed Event:**
```json
{
  "patient_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "patient_display_name": "John Doe",
  "patient_gender": "M",
  "patient_age_years_at_event": 45,
  "patient_mrn": "MRN-123456",
  "source_system": "zeal-clinical",
  "source_module": "encounter",
  "event_type": "encounter_completed",
  "severity": 0,
  "occurred_at": "2026-01-20T15:30:00Z",
  "entity_type": "encounter",
  "entity_id": "enc-uuid-here",
  "payload": {
    "encounter_type": "consultation",
    "diagnosis_codes": ["I10", "E11.9"],
    "medications_prescribed": ["Metformin 500mg", "Lisinopril 10mg"],
    "follow_up_days": 30
  },
  "dedupe_key": "enc-complete-enc-uuid-here-2026-01-20"
}
```

**Invoice Generated Event (from RCM):**
```json
{
  "patient_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "patient_display_name": "John Doe",
  "patient_mrn": "MRN-123456",
  "source_system": "zeal-rcm",
  "source_module": "billing",
  "event_type": "invoice_generated",
  "severity": 1,
  "occurred_at": "2026-01-20T16:00:00Z",
  "entity_type": "invoice",
  "entity_id": "inv-uuid-here",
  "payload": {
    "invoice_number": "INV-2026-001234",
    "total_amount": 850.50,
    "currency": "AED",
    "due_date": "2026-02-19",
    "payment_link": "https://pay.zeal.health/inv-uuid-here"
  },
  "dedupe_key": "inv-gen-inv-uuid-here"
}
```

## Rule Creation

### POST /v1/rules

**Appointment Reminder Rule:**
```json
{
  "code": "apt-reminder-24h",
  "name": "Appointment Reminder 24 Hours Before",
  "description": "Send SMS reminder 24 hours before scheduled appointment",
  "category": "appointment_reminders",
  "trigger_event_type": "appointment_confirmed",
  "condition_expr": {
    "and": [
      {
        "field": "event.payload.appointment_datetime",
        "op": "exists",
        "value": true
      },
      {
        "field": "event.payload.is_cancelled",
        "op": "ne",
        "value": true
      }
    ]
  },
  "schedule_mode": "DELAYED",
  "delay_seconds": 82800,
  "action_type": "SEND_MESSAGE",
  "action_payload": {
    "channel": "sms",
    "template_code": "apt-reminder-sms",
    "purpose": "care",
    "variables": {
      "appointment_datetime": "{{event.payload.appointment_datetime}}",
      "physician_name": "{{event.payload.physician_name}}",
      "facility_name": "{{event.payload.facility_name}}"
    }
  },
  "priority": 100,
  "is_active": true
}
```

**High-Risk Patient Follow-Up Task:**
```json
{
  "code": "high-risk-followup",
  "name": "High-Risk Patient Follow-Up Task",
  "description": "Create follow-up task for high-risk patients after encounter",
  "category": "care_coordination",
  "trigger_event_type": "encounter_completed",
  "condition_expr": {
    "or": [
      {
        "field": "event.payload.diagnosis_codes",
        "op": "contains",
        "value": "I10"
      },
      {
        "field": "patient.age_years_at_event",
        "op": "gte",
        "value": 65
      }
    ]
  },
  "schedule_mode": "IMMEDIATE",
  "action_type": "CREATE_TASK",
  "action_payload": {
    "task_type": "follow_up",
    "title": "Schedule 7-day follow-up call for high-risk patient",
    "description": "Patient requires follow-up call within 7 days post-encounter",
    "priority": 3,
    "assign_role": "nurse",
    "due_at": "+7d"
  },
  "priority": 150,
  "is_active": true
}
```

**Payment Reminder Rule:**
```json
{
  "code": "payment-reminder-7d",
  "name": "Payment Reminder 7 Days Before Due",
  "description": "Send payment reminder email 7 days before invoice due date",
  "category": "billing_followup",
  "trigger_event_type": "invoice_generated",
  "condition_expr": {
    "and": [
      {
        "field": "event.payload.total_amount",
        "op": "gt",
        "value": 0
      },
      {
        "field": "event.payload.due_date",
        "op": "exists",
        "value": true
      }
    ]
  },
  "schedule_mode": "DELAYED",
  "delay_seconds": 604800,
  "action_type": "SEND_MESSAGE",
  "action_payload": {
    "channel": "email",
    "template_code": "payment-reminder-email",
    "purpose": "billing",
    "variables": {
      "invoice_number": "{{event.payload.invoice_number}}",
      "total_amount": "{{event.payload.total_amount}}",
      "due_date": "{{event.payload.due_date}}",
      "payment_link": "{{event.payload.payment_link}}"
    }
  },
  "priority": 80,
  "cooldown_seconds": 86400,
  "is_active": true
}
```

## Template Creation

### POST /v1/templates

**SMS Appointment Reminder:**
```json
{
  "code": "apt-reminder-sms",
  "name": "Appointment Reminder SMS",
  "description": "SMS reminder for upcoming appointment",
  "category": "transactional",
  "channel": "sms",
  "language": "en",
  "body": "Hi {{patient_name}}, this is a reminder about your appointment with {{physician_name}} at {{facility_name}} on {{appointment_datetime}}. Reply CANCEL to cancel.",
  "variables_schema": {
    "type": "object",
    "required": ["patient_name", "physician_name", "facility_name", "appointment_datetime"],
    "properties": {
      "patient_name": { "type": "string" },
      "physician_name": { "type": "string" },
      "facility_name": { "type": "string" },
      "appointment_datetime": { "type": "string" }
    }
  },
  "approval_status": "approved",
  "is_active": true
}
```

**Email Payment Reminder:**
```json
{
  "code": "payment-reminder-email",
  "name": "Payment Reminder Email",
  "category": "transactional",
  "channel": "email",
  "language": "en",
  "subject": "Reminder: Invoice {{invoice_number}} Due Soon",
  "body": "Dear {{patient_name}},\n\nThis is a friendly reminder that invoice {{invoice_number}} for AED {{total_amount}} is due on {{due_date}}.\n\nYou can pay online here: {{payment_link}}\n\nThank you,\nZeal Health",
  "variables_schema": {
    "type": "object",
    "required": ["patient_name", "invoice_number", "total_amount", "due_date", "payment_link"],
    "properties": {
      "patient_name": { "type": "string" },
      "invoice_number": { "type": "string" },
      "total_amount": { "type": "number" },
      "due_date": { "type": "string" },
      "payment_link": { "type": "string", "format": "uri" }
    }
  },
  "approval_status": "approved",
  "is_active": true
}
```

## Patient Preferences

### PUT /v1/patients/{patientId}/preferences

```json
{
  "preferred_language": "en",
  "channel_order": ["sms", "whatsapp", "email", "in_app"],
  "quiet_hours_start": "22:00",
  "quiet_hours_end": "08:00",
  "timezone": "Asia/Dubai",
  "dnd_enabled": false,
  "sms_opt_out": false,
  "email_opt_out": false,
  "whatsapp_opt_out": false,
  "notes": "Prefers morning communication"
}
```

## Provider Callbacks

### POST /v1/providers/sms/callbacks

**Twilio Webhook (Message Delivered):**
```json
{
  "MessageSid": "SM1234567890abcdef",
  "MessageStatus": "delivered",
  "To": "+971501234567",
  "From": "+15555551234",
  "Body": "Your appointment reminder...",
  "EventType": "message.delivered"
}
```

**SendGrid Webhook (Email Opened):**
```json
{
  "email": "patient@example.com",
  "event": "open",
  "sg_message_id": "msg-1234567890",
  "timestamp": 1705329600
}
```

## Authentication

### Development Mode
```bash
# Simple bearer token format: {tenantId}:{userId}
curl -H "Authorization: Bearer tenant-123:user-456" \
  http://localhost:3013/v1/events
```

### Production Mode (OIDC JWT)
```bash
# Use actual JWT from OIDC provider
curl -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:3013/v1/events
```
