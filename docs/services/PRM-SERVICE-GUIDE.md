# Patient Relationship Management (PRM) Service

**Service:** `@zeal/prm`
**Port:** `3013`
**Database:** `zeal_prm`
**Version:** `1.0.0`

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Core Concepts](#core-concepts)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Workflows](#workflows)
- [Configuration](#configuration)
- [Development](#development)

---

## Overview

The PRM (Patient Relationship Management) service is an **event-driven patient engagement platform** that automates communication and task management based on clinical and operational events. It enables healthcare providers to deliver timely, personalized care coordination through automated rules and workflows.

### Key Capabilities

- **Event Ingestion** - Captures patient engagement events from Clinical, RCM, and external systems
- **Rules Engine** - Evaluates JSON-based conditions to trigger actions automatically
- **Multi-Channel Messaging** - SMS, WhatsApp, Email, In-App, Push notifications
- **Task Management** - Creates human follow-up tasks for care coordinators
- **Template Library** - Multi-language communication templates with variable substitution
- **Patient Preferences** - Respects quiet hours, DND, and channel preferences
- **Job Queue** - Postgres-backed durable queue with retry logic
- **Provider Integration** - Webhook handling for delivery status (Twilio, SendGrid, etc.)

### Use Cases

1. **Appointment Reminders** - Automatically send reminders 24 hours before appointments
2. **Care Plan Follow-ups** - Engage patients post-discharge with care instructions
3. **Billing Notifications** - Alert patients about pending payments or insurance updates
4. **Health Campaigns** - Wellness reminders for preventive care (flu shots, screenings)
5. **No-Show Recovery** - Re-engage patients who missed appointments
6. **Medication Adherence** - Remind patients to take medications or refill prescriptions

---

## Architecture

### Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         PRM Service                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Events     │  │    Rules     │  │  Templates   │      │
│  │  Controller  │  │  Controller  │  │  Controller  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Tasks     │  │   Messages   │  │ Preferences  │      │
│  │  Controller  │  │  Controller  │  │  Controller  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Rules Engine Service                       │ │
│  │  (JSON DSL evaluator with AND/OR/NOT logic)            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Jobs Worker Service                        │ │
│  │  (Postgres-backed queue with FOR UPDATE SKIP LOCKED)   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  PostgreSQL      │
                    │  zeal_prm        │
                    └──────────────────┘
```

### Data Flow

```
1. Event Ingestion
   ┌─────────────┐
   │ Clinical /  │──┐
   │ RCM Service │  │
   └─────────────┘  │
                    ▼
              POST /v1/events
                    │
                    ▼
   ┌────────────────────────────────┐
   │  1. Dedupe check (idempotent)  │
   │  2. Persist event with patient │
   │     snapshot                   │
   │  3. Evaluate active rules      │
   └────────────────────────────────┘
                    │
                    ▼
2. Rule Evaluation
   ┌────────────────────────────────┐
   │  Match by event_type/subtype   │
   │  Evaluate JSON conditions      │
   │  Check cooldown/limits         │
   └────────────────────────────────┘
                    │
                    ▼
3. Action Scheduling
   ┌────────────────────────────────┐
   │  Create job (SEND_MESSAGE /    │
   │              CREATE_TASK)      │
   │  Schedule with delay           │
   └────────────────────────────────┘
                    │
                    ▼
4. Job Execution (Worker)
   ┌────────────────────────────────┐
   │  Lock ready jobs (SKIP LOCKED) │
   │  Check consent                 │
   │  Render template               │
   │  Send via provider OR          │
   │  Create task for staff         │
   └────────────────────────────────┘
                    │
                    ▼
5. Delivery Tracking
   ┌────────────────────────────────┐
   │  Provider webhooks update      │
   │  message status (sent,         │
   │  delivered, read, failed)      │
   └────────────────────────────────┘
```

---

## Core Concepts

### 1. Patient Engagement Events

Events are the **triggers** for all PRM workflows. Any system can send events to PRM.

**Event Structure:**
```json
{
  "patient_id": "uuid",
  "source_system": "zeal-clinical",
  "source_module": "appointment",
  "event_type": "appointment_confirmed",
  "event_subtype": "new_patient",
  "severity": 0,
  "occurred_at": "2026-01-01T10:00:00Z",
  "entity_type": "appointment",
  "entity_id": "uuid",
  "payload": {
    "appointment_date": "2026-01-05T14:00:00Z",
    "provider_name": "Dr. Sarah Ahmed",
    "specialty": "Cardiology"
  },
  "dedupe_key": "apt-123-confirmed"
}
```

**Common Event Types:**
- `appointment_confirmed`, `appointment_cancelled`, `appointment_missed`
- `encounter_started`, `encounter_completed`
- `invoice_generated`, `payment_received`, `payment_overdue`
- `care_plan_created`, `medication_prescribed`
- `lab_result_ready`, `imaging_completed`

### 2. Engagement Rules

Rules define **when and how** to engage patients. Written in JSON DSL for flexibility.

**Rule Structure:**
```json
{
  "code": "appointment-reminder-sms",
  "name": "24h Appointment Reminder (SMS)",
  "category": "appointment_reminders",
  "trigger_event_type": "appointment_confirmed",
  "condition_expr": {
    "and": [
      {
        "field": "event.payload.appointment_date",
        "op": "gte",
        "value": "{{now_plus_24h}}"
      },
      {
        "field": "patient.age_years_at_event",
        "op": "gte",
        "value": 18
      }
    ]
  },
  "schedule_mode": "DELAYED",
  "delay_seconds": 82800,
  "action_type": "SEND_MESSAGE",
  "action_payload": {
    "channel": "sms",
    "template_code": "apt-reminder-24h-sms",
    "purpose": "care"
  },
  "priority": 100,
  "cooldown_seconds": 3600,
  "is_active": true
}
```

**Condition Operators:**
- Comparison: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`
- Membership: `in`, `not_in`
- Text: `contains`
- Existence: `exists`
- Logical: `and`, `or`, `not`

### 3. Communication Templates

Templates define **what to send** with variable substitution.

**Template Structure:**
```json
{
  "code": "apt-reminder-24h-sms",
  "name": "Appointment Reminder - 24 Hours",
  "channel": "sms",
  "language": "en",
  "category": "transactional",
  "body": "Hi {{patient_name}}, reminder: You have an appointment with {{provider_name}} tomorrow at {{appointment_time}}. Reply CONFIRM or call us at +971-4-XXX-XXXX.",
  "variables_schema": {
    "type": "object",
    "properties": {
      "patient_name": { "type": "string" },
      "provider_name": { "type": "string" },
      "appointment_time": { "type": "string" }
    },
    "required": ["patient_name", "appointment_time"]
  },
  "approval_status": "approved",
  "is_active": true
}
```

**Supported Channels:**
- `sms` - SMS via Twilio/custom provider
- `whatsapp` - WhatsApp Business API
- `email` - SendGrid/SMTP
- `in_app` - Mobile/web app notifications
- `push` - Firebase Cloud Messaging

**Multi-Language Support:**
- Same template code with different `language` values
- Template selection based on patient's `preferred_language`
- Fallback to English if translation unavailable

### 4. Patient Tasks

Human follow-up tasks created when automation isn't appropriate.

**Task Types:**
- `follow_up` - Call patient for follow-up
- `document_request` - Request missing documents
- `consent_needed` - Obtain consent for procedure
- `payment_reminder` - Follow up on overdue payment
- `care_coordination` - Coordinate care with external providers

**Task Priorities:**
- `1` - Low
- `2` - Medium (default)
- `3` - High
- `4` - Urgent

**Task Statuses:**
- `pending` - Not started
- `in_progress` - Being worked on
- `completed` - Done
- `cancelled` - No longer needed
- `skipped` - Skipped (reason in outcome)

### 5. Patient Preferences

Respect patient communication preferences and consent.

**Preference Settings:**
- `preferred_language` - Language for communications (en, ar, etc.)
- `channel_order` - Preferred channels in order (e.g., `["sms", "email"]`)
- `quiet_hours_start` / `quiet_hours_end` - No messages during this time (e.g., "22:00" to "08:00")
- `timezone` - Patient timezone (IANA format)
- `dnd_enabled` / `dnd_until` - Do Not Disturb mode
- `sms_opt_out`, `email_opt_out`, `whatsapp_opt_out` - Channel-specific opt-outs

**Consent Integration:**
- PRM checks consent before sending messages
- Integration with Clinical consent service (placeholder in current version)
- `purpose` field: `care`, `billing`, `admin`, `marketing`

### 6. Job Queue

Postgres-backed durable queue for reliable message delivery.

**Job Lifecycle:**
```
READY ──> RUNNING ──> DONE
   │          │
   │          ├──> FAILED (retry if attempts < max)
   │          └──> DEAD (max retries exceeded)
   └──> SKIPPED (consent denied, patient opted out)
```

**Job Locking:**
- Uses `FOR UPDATE SKIP LOCKED` to prevent duplicate processing
- Each worker instance has unique ID
- Jobs locked for duration of execution
- Automatic unlock on worker crash (locked_at timeout)

**Retry Logic:**
- Default: 3 attempts with exponential backoff
- Configurable per job type
- Failed jobs store error in `last_error` field

---

## API Endpoints

### Events

#### Ingest Event
```http
POST /v1/events
Authorization: Bearer <JWT>
x-tenant-id: <tenant-uuid>
x-user-id: <user-uuid>

{
  "patient_id": "uuid",
  "source_system": "zeal-clinical",
  "source_module": "appointment",
  "event_type": "appointment_confirmed",
  "occurred_at": "2026-01-01T10:00:00Z",
  "entity_type": "appointment",
  "entity_id": "uuid",
  "payload": { ... },
  "dedupe_key": "unique-key"
}
```

**Response:**
```json
{
  "event_id": "uuid",
  "duplicate": false,
  "rules_evaluated": 3,
  "jobs_created": 1
}
```

### Rules

#### Create Rule
```http
POST /v1/rules
Authorization: Bearer <JWT>
x-tenant-id: <tenant-uuid>
x-user-id: <user-uuid>

{
  "code": "appointment-reminder-sms",
  "name": "24h Appointment Reminder",
  "category": "appointment_reminders",
  "trigger_event_type": "appointment_confirmed",
  "condition_expr": { ... },
  "schedule_mode": "DELAYED",
  "delay_seconds": 82800,
  "action_type": "SEND_MESSAGE",
  "action_payload": { ... }
}
```

#### List Rules
```http
GET /v1/rules?isActive=true&category=appointment_reminders
```

#### Get Rule
```http
GET /v1/rules/:ruleId
```

#### Update Rule
```http
PATCH /v1/rules/:ruleId
```

#### Delete Rule
```http
DELETE /v1/rules/:ruleId
```

### Templates

#### Create Template
```http
POST /v1/templates

{
  "code": "apt-reminder-24h-sms",
  "name": "Appointment Reminder - 24 Hours",
  "channel": "sms",
  "language": "en",
  "category": "transactional",
  "body": "Hi {{patient_name}}, ...",
  "variables_schema": { ... }
}
```

#### List Templates
```http
GET /v1/templates?channel=sms&language=en&isActive=true
```

#### Get Template
```http
GET /v1/templates/:templateId
```

#### Update Template
```http
PATCH /v1/templates/:templateId
```

#### Delete Template
```http
DELETE /v1/templates/:templateId
```

### Tasks

#### Create Task
```http
POST /v1/tasks

{
  "patient_id": "uuid",
  "task_type": "follow_up",
  "title": "Call patient about lab results",
  "priority": 3,
  "assigned_to_user_id": "uuid",
  "due_at": "2026-01-05T14:00:00Z"
}
```

#### List Tasks
```http
GET /v1/tasks?patientId=uuid&status=pending&assignedToUserId=uuid
```

#### Get Task
```http
GET /v1/tasks/:taskId
```

#### Update Task
```http
PATCH /v1/tasks/:taskId

{
  "status": "completed",
  "outcome": "Patient confirmed appointment",
  "completed_at": "2026-01-05T15:30:00Z"
}
```

#### Delete Task
```http
DELETE /v1/tasks/:taskId
```

### Messages

#### List Messages
```http
GET /v1/messages?patientId=uuid&channel=sms&status=delivered
```

#### Get Message
```http
GET /v1/messages/:messageId
```

### Patient Preferences

#### Get Preferences
```http
GET /v1/patients/:patientId/preferences
```

#### Update Preferences
```http
PUT /v1/patients/:patientId/preferences

{
  "preferred_language": "ar",
  "channel_order": ["whatsapp", "sms", "email"],
  "quiet_hours_start": "22:00",
  "quiet_hours_end": "08:00",
  "timezone": "Asia/Dubai",
  "sms_opt_out": false
}
```

### Provider Webhooks

#### Receive Webhook
```http
POST /v1/providers/webhooks/:channel

{
  "MessageSid": "SM...",
  "MessageStatus": "delivered",
  "To": "+971501234567"
}
```

#### List Callbacks
```http
GET /v1/providers/callbacks?channel=sms&processed=false
```

---

## Database Schema

### Core Tables

#### `patient_engagement_events`
Stores all patient engagement events with denormalized patient snapshots.

**Key Fields:**
- `id`, `tenant_id`, `patient_id`
- `patient_display_name`, `patient_gender`, `patient_dob`, `patient_age_years_at_event`, `patient_ref`, `patient_mobile_masked`
- `source_system`, `source_module`, `event_type`, `event_subtype`, `severity`, `occurred_at`
- `entity_type`, `entity_id`, `payload` (JSONB)
- `correlation_id`, `dedupe_key` (unique per tenant)

**Indexes:**
- `idx_events_tenant_dedupe` - Unique on (tenant_id, dedupe_key)
- `idx_events_patient_timeline` - (tenant_id, patient_id, occurred_at DESC)
- `idx_events_type_time` - (tenant_id, event_type, occurred_at DESC)

#### `engagement_rules`
Rules configuration with JSON DSL conditions.

**Key Fields:**
- `id`, `tenant_id`, `code` (unique per tenant), `name`, `description`, `category`
- `trigger_event_type`, `trigger_event_subtype`
- `condition_expr` (JSONB) - JSON DSL condition tree
- `schedule_mode` (IMMEDIATE | DELAYED), `delay_seconds`
- `action_type` (SEND_MESSAGE | CREATE_TASK), `action_payload` (JSONB)
- `priority`, `cooldown_seconds`, `idempotency_window`, `max_executions_per_day`
- `effective_from`, `effective_to`, `is_active`

**Indexes:**
- `idx_rules_tenant_code` - Unique on (tenant_id, code)
- `idx_rules_active_trigger` - (tenant_id, is_active, trigger_event_type, priority DESC)

#### `communication_templates`
Multi-language, multi-channel message templates.

**Key Fields:**
- `id`, `tenant_id`, `code`, `name`, `description`, `category`
- `channel`, `language`, `subject`, `body`, `variables_schema` (JSONB)
- `approval_status` (draft | pending | approved | rejected), `approved_at`, `approved_by`
- `version`, `content_hash` (SHA-256), `is_active`

**Indexes:**
- `idx_templates_unique` - Unique on (tenant_id, code, language, channel, version)
- `idx_templates_lookup` - (tenant_id, code, language, channel, version DESC)

#### `patient_preferences`
Patient communication preferences and consent.

**Key Fields:**
- `id`, `tenant_id`, `patient_id` (unique per tenant)
- `preferred_language`, `channel_order` (JSONB array)
- `quiet_hours_start`, `quiet_hours_end`, `timezone`
- `dnd_enabled`, `dnd_until`
- `sms_opt_out`, `email_opt_out`, `whatsapp_opt_out`
- `guardian_name`, `guardian_contact`, `guardian_ref` (for minors)

#### `patient_messages`
Message log with provider tracking and denormalized patient snapshot.

**Key Fields:**
- `id`, `tenant_id`, `patient_id`
- `patient_display_name`, `patient_gender`, `patient_ref`
- `direction` (outbound | inbound), `channel`
- `to_address`, `from_address` (masked)
- `template_id`, `template_version`, `subject`, `body_rendered`, `variables_used` (JSONB)
- `purpose`, `consent_reference_id`
- `related_event_id`, `related_entity_type`, `related_entity_id`
- `provider_message_id` (unique - Twilio SID, SendGrid ID, etc.)
- `status` (pending | queued | sent | delivered | read | failed | skipped), `status_reason`
- `sent_at`, `delivered_at`, `read_at`, `failed_at`, `retry_count`
- `idempotency_key` (unique per tenant)

**Indexes:**
- `idx_messages_tenant_idempotency` - Unique on (tenant_id, idempotency_key)
- `idx_messages_patient_timeline` - (tenant_id, patient_id, created_at DESC)
- `idx_messages_provider` - (tenant_id, provider_message_id)

#### `patient_tasks`
Human follow-up tasks with denormalized patient snapshot.

**Key Fields:**
- `id`, `tenant_id`, `patient_id`
- `patient_display_name`, `patient_gender`, `patient_age_years_at_event`, `patient_ref`
- `task_type`, `title`, `description`, `priority`
- `assigned_to_user_id`, `assigned_to_role`
- `status` (pending | in_progress | completed | cancelled | skipped)
- `due_at`, `completed_at`, `cancelled_at`
- `outcome`, `outcome_details` (JSONB)
- `related_event_id`, `related_entity_type`, `related_entity_id`

**Indexes:**
- `idx_tasks_status_due` - (tenant_id, status, due_at)
- `idx_tasks_assigned` - (tenant_id, assigned_to_user_id, status, due_at)

#### `prm_jobs`
Postgres-backed job queue with locking.

**Key Fields:**
- `id`, `tenant_id`, `patient_id`
- `job_type` (SEND_MESSAGE | CREATE_TASK), `payload` (JSONB)
- `run_at`, `status` (READY | RUNNING | DONE | FAILED | SKIPPED | DEAD)
- `attempts`, `max_attempts`
- `locked_at`, `locked_by` (worker instance ID)
- `last_error`, `idempotency_key` (unique per tenant)

**Indexes:**
- `idx_jobs_ready` - (tenant_id, status, run_at) - for worker polling
- `idx_jobs_tenant_idempotency` - Unique on (tenant_id, idempotency_key)

#### `engagement_rule_runs`
Audit trail for rule evaluations.

**Key Fields:**
- `id`, `tenant_id`, `rule_id`, `event_id`
- `decision` (execute | skip), `skip_reason`
- `action_result` (JSONB) - job IDs, error details
- `correlation_id`, `evaluated_at`

#### `provider_callbacks`
Raw webhook payloads from SMS/Email/WhatsApp providers.

**Key Fields:**
- `id`, `tenant_id`, `channel`, `provider_message_id`
- `received_at`, `payload` (JSONB)
- `processed`, `processed_at`

---

## Workflows

### Workflow 1: Appointment Reminder

**Scenario:** Send SMS reminder 24 hours before appointment

**Setup:**
1. Create template `apt-reminder-24h-sms`
2. Create rule that triggers on `appointment_confirmed` event
3. Rule schedules job 24h before appointment time

**Flow:**
```
1. Clinical service confirms appointment
   └─> POST /v1/events
       {
         "event_type": "appointment_confirmed",
         "payload": {
           "appointment_date": "2026-01-05T14:00:00Z",
           "provider_name": "Dr. Ahmed"
         }
       }

2. PRM evaluates active rules
   └─> Matches "appointment-reminder-sms" rule
       └─> Creates job scheduled for 2026-01-04T14:00:00Z

3. Worker picks up job at scheduled time
   └─> Checks patient preferences (SMS not opted out, not in quiet hours)
   └─> Renders template with variables
   └─> Sends SMS via Twilio
   └─> Records message with provider_message_id

4. Provider webhook received
   └─> POST /v1/providers/webhooks/sms
       { "MessageStatus": "delivered" }
   └─> Updates message status to "delivered"
```

### Workflow 2: No-Show Follow-up Task

**Scenario:** Create task for nurse to call patient who missed appointment

**Setup:**
1. Create rule that triggers on `appointment_missed` event
2. Rule creates task assigned to care coordinator role

**Flow:**
```
1. Clinical service marks appointment as no-show
   └─> POST /v1/events
       { "event_type": "appointment_missed" }

2. PRM evaluates rules
   └─> Matches "no-show-follow-up" rule
       └─> Creates job (CREATE_TASK) immediately

3. Worker picks up job
   └─> Creates task in patient_tasks table
       {
         "task_type": "follow_up",
         "title": "Call patient about missed appointment",
         "assigned_to_role": "nurse",
         "priority": 3
       }

4. Nurse reviews tasks dashboard
   └─> GET /v1/tasks?assignedToRole=nurse&status=pending
   └─> Calls patient
   └─> PATCH /v1/tasks/:taskId
       {
         "status": "completed",
         "outcome": "Patient rescheduled for next week"
       }
```

### Workflow 3: Multi-Language Care Plan

**Scenario:** Send post-discharge care instructions in patient's language

**Setup:**
1. Create templates for English and Arabic
   - `care-plan-discharge-email-en`
   - `care-plan-discharge-email-ar`
2. Create rule that checks patient's `preferred_language`

**Flow:**
```
1. Clinical service discharges patient
   └─> POST /v1/events
       { "event_type": "encounter_completed" }

2. PRM evaluates rules
   └─> Fetches patient preferences
       { "preferred_language": "ar" }
   └─> Selects Arabic template
   └─> Creates job (SEND_MESSAGE via email)

3. Worker renders template
   └─> Merges variables: {{patient_name}}, {{care_instructions}}
   └─> Sends email via SendGrid
   └─> Records message with Arabic template reference
```

---

## Configuration

### Environment Variables

```bash
# Server
PORT=3013
NODE_ENV=development

# Database
PRM_DATABASE_URL="postgresql://postgres:password@localhost:5432/zeal_prm"

# OIDC Authentication
OIDC_ISSUER_URL="https://auth.zeal.health"
OIDC_CLIENT_ID="prm-service"
OIDC_CLIENT_SECRET="secret"
OIDC_TENANT_CLAIM="tid"
OIDC_USER_CLAIM="sub"

# Job Worker
JOB_WORKER_INTERVAL_MS=5000
JOB_WORKER_BATCH_SIZE=10
JOB_WORKER_INSTANCE_ID="worker-1"

# External Services
CLINICAL_SERVICE_URL="http://localhost:3011"
CONSENT_SERVICE_URL="http://localhost:3011/v1/consent"

# Message Providers (Future)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
SENDGRID_API_KEY="SG..."
```

### Rule Configuration Examples

#### Example 1: Appointment Reminder
```json
{
  "code": "apt-reminder-24h",
  "trigger_event_type": "appointment_confirmed",
  "condition_expr": {
    "and": [
      { "field": "event.payload.appointment_date", "op": "exists" },
      { "field": "patient.age_years_at_event", "op": "gte", "value": 18 }
    ]
  },
  "schedule_mode": "DELAYED",
  "delay_seconds": 82800,
  "action_type": "SEND_MESSAGE",
  "action_payload": {
    "channel": "sms",
    "template_code": "apt-reminder-24h",
    "purpose": "care"
  }
}
```

#### Example 2: Overdue Payment Alert
```json
{
  "code": "payment-overdue-30d",
  "trigger_event_type": "invoice_generated",
  "condition_expr": {
    "and": [
      { "field": "event.payload.amount_due", "op": "gt", "value": 100 },
      { "field": "event.payload.payment_status", "op": "eq", "value": "pending" }
    ]
  },
  "schedule_mode": "DELAYED",
  "delay_seconds": 2592000,
  "action_type": "SEND_MESSAGE",
  "action_payload": {
    "channel": "email",
    "template_code": "payment-reminder-30d",
    "purpose": "billing"
  }
}
```

---

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL 16
- Prisma CLI

### Setup

```bash
# 1. Install dependencies
cd backend/services/prm
npm install

# 2. Generate Prisma Client
cd ../../shared/database-prm
npm run prisma:generate

# 3. Run migrations
npm run prisma:migrate

# 4. Seed data (optional)
cd ../../../seed
./run-seeds.sh prm

# 5. Start service
cd ../backend/services/prm
npm run dev
```

### API Documentation

Swagger UI available at: `http://localhost:3013/api-docs`

### Database Management

```bash
# Prisma Studio
cd backend/shared/database-prm
npx prisma studio

# Create migration
npx prisma migrate dev --name add_new_field

# Deploy migration
npx prisma migrate deploy
```

### Testing Event Ingestion

```bash
curl -X POST http://localhost:3013/v1/events \
  -H "Authorization: Bearer <JWT>" \
  -H "x-tenant-id: <tenant-uuid>" \
  -H "x-user-id: <user-uuid>" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "uuid",
    "source_system": "zeal-clinical",
    "source_module": "appointment",
    "event_type": "appointment_confirmed",
    "occurred_at": "2026-01-01T10:00:00Z",
    "entity_type": "appointment",
    "entity_id": "uuid",
    "payload": {
      "appointment_date": "2026-01-05T14:00:00Z",
      "provider_name": "Dr. Ahmed"
    },
    "dedupe_key": "apt-123-confirmed"
  }'
```

### Worker Monitoring

Check worker logs for job processing:
```bash
tail -f logs/prm-worker.log | grep "Processing.*jobs"
```

---

## Troubleshooting

### Common Issues

**1. Jobs not executing**
- Check worker is running: `ps aux | grep "node.*main.js"`
- Verify database connection: `PRM_DATABASE_URL` is correct
- Check job status: `SELECT status, COUNT(*) FROM prm_jobs GROUP BY status;`
- Inspect failed jobs: `SELECT * FROM prm_jobs WHERE status = 'FAILED' LIMIT 10;`

**2. Messages not sending**
- Verify patient preferences: `GET /v1/patients/:id/preferences`
- Check opt-out status: `sms_opt_out`, `email_opt_out`, etc.
- Verify consent service response (currently stubbed)
- Check provider credentials (Twilio, SendGrid)

**3. Rules not matching**
- Check rule is active: `is_active = true`
- Verify trigger matches: `trigger_event_type` and optional `trigger_event_subtype`
- Test condition expression: Use Prisma Studio to inspect `condition_expr`
- Check effective dates: `effective_from` and `effective_to`

**4. Duplicate events**
- Events are idempotent by `dedupe_key`
- Use format: `<entity>-<id>-<action>`
- Example: `apt-12345-confirmed`

---

## Roadmap

### Planned Features

- **Provider Integrations**
  - Twilio SMS/WhatsApp
  - SendGrid Email
  - Firebase Push Notifications

- **Advanced Rules**
  - Time-based triggers (cron-like)
  - Patient cohort targeting (age groups, conditions)
  - A/B testing for templates

- **Analytics Dashboard**
  - Message delivery rates
  - Patient engagement metrics
  - Rule performance tracking

- **Campaign Management**
  - Bulk messaging for health campaigns
  - Enrollment/drip campaigns
  - Opt-in management

- **Two-Way Messaging**
  - Patient replies to messages
  - Chatbot integration
  - Appointment confirmation via SMS

---

## Support

**Documentation:** `/docs/services/PRM-SERVICE-GUIDE.md`
**API Reference:** `http://localhost:3013/api-docs`
**Database Schema:** `/backend/shared/database-prm/prisma/schema.prisma`
**Architecture Docs:** `/docs/architecture/BACKEND-ARCHITECTURE.md`

For questions or issues, contact the athma-ce Health development team.
