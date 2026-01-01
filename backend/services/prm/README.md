# Zeal PRM (Patient Relationship Management) Service

## Overview

The PRM service handles patient engagement workflows including:
- Event ingestion from clinical/RCM systems
- Rules-based automation engine
- Multi-channel messaging (SMS, WhatsApp, Email, In-app)
- Patient task management
- Communication preferences and consent enforcement
- Durable job queue with Postgres-backed persistence

## Architecture

**Tech Stack:**
- Runtime: Node.js 18+
- Language: TypeScript
- Framework: Express.js
- Validation: Joi
- Auth: Passport.js with OIDC
- API Docs: OpenAPI 3.0 + Swagger UI
- Database: PostgreSQL (zeal_prm)
- ORM: Prisma
- Logging: Pino
- Config: dotenv + validation

**Key Design Principles:**
1. **Multi-tenant**: Every table has `tenant_id`, enforced via Prisma middleware
2. **Idempotent**: Events use `dedupe_key`, jobs use `idempotency_key`
3. **Privacy-first**: Minimal PHI, denormalized patient snapshots only
4. **Consent-enforced**: External consent checks before message sending
5. **Durable queuing**: Postgres-backed job queue with `FOR UPDATE SKIP LOCKED`
6. **No BPMN**: Lightweight JSON DSL for rules, no heavy workflow engines

## Quick Start

### Prerequisites
```bash
node >= 18
npm >= 9
postgresql >= 14
```

### Installation
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npm run seed
```

### Development
```bash
# Start database
docker-compose up -d postgres

# Run migrations
npm run migrate:dev

# Start server in dev mode
npm run dev

# Start job worker
npm run worker:dev
```

Server runs on: http://localhost:3013
API docs: http://localhost:3013/api-docs

### Environment Variables
```env
# Server
NODE_ENV=development
PORT=3013
LOG_LEVEL=debug

# Database
PRM_DATABASE_URL=postgresql://zeal_user:zeal_password@localhost:5432/zeal_prm

# OIDC Auth
OIDC_ISSUER=https://auth.zeal.health
OIDC_CLIENT_ID=prm-service
OIDC_CLIENT_SECRET=secret
OIDC_CALLBACK_URL=http://localhost:3013/auth/callback
OIDC_TENANT_CLAIM=tid
OIDC_USER_CLAIM=sub

# External Services
CLINICAL_CONSENT_SERVICE_URL=http://localhost:3011/api/v1/consent
CLINICAL_CONSENT_SERVICE_TIMEOUT=5000

# Job Worker
JOB_WORKER_INTERVAL_MS=5000
JOB_WORKER_BATCH_SIZE=10
JOB_WORKER_MAX_RETRIES=3
JOB_WORKER_BACKOFF_BASE_MS=1000

# Channel Providers (stubs)
SMS_PROVIDER=twilio
SMS_PROVIDER_API_KEY=stub
WHATSAPP_PROVIDER=twilio
WHATSAPP_PROVIDER_API_KEY=stub
EMAIL_PROVIDER=sendgrid
EMAIL_PROVIDER_API_KEY=stub
```

## Database Schema

See `prisma/schema.prisma` for full schema.

**Core Tables:**
- `patient_engagement_events` - Event timeline with denormalized patient snapshots
- `engagement_rules` - Rules with JSON DSL conditions
- `communication_templates` - Multi-language, multi-channel templates
- `patient_preferences` - Channel preferences, quiet hours, DND
- `patient_messages` - Message log with provider tracking
- `patient_tasks` - Human follow-up tasks
- `prm_jobs` - Durable job queue
- `engagement_rule_runs` - Audit trail for rule evaluations
- `provider_callbacks` - Raw webhook payloads for debugging

## API Endpoints

### Events
- `POST /v1/events` - Ingest engagement event (idempotent)

### Rules
- `GET /v1/rules` - List rules
- `POST /v1/rules` - Create rule
- `GET /v1/rules/:id` - Get rule
- `PUT /v1/rules/:id` - Update rule
- `PATCH /v1/rules/:id/active` - Toggle rule active status
- `DELETE /v1/rules/:id` - Soft-delete rule

### Templates
- `GET /v1/templates` - List templates
- `POST /v1/templates` - Create template
- `GET /v1/templates/:id` - Get template
- `PUT /v1/templates/:id` - Update template
- `PATCH /v1/templates/:id/approve` - Approve template
- `DELETE /v1/templates/:id` - Delete template

### Patient Preferences
- `GET /v1/patients/:patientId/preferences` - Get preferences
- `PUT /v1/patients/:patientId/preferences` - Update preferences

### Patient Timeline
- `GET /v1/patients/:patientId/timeline` - Get engagement timeline

### Messages
- `GET /v1/patients/:patientId/messages` - Get message history
- `POST /v1/patients/:patientId/messages/test` - Send test message

### Tasks
- `GET /v1/patients/:patientId/tasks` - Get patient tasks
- `POST /v1/patients/:patientId/tasks` - Create task
- `PATCH /v1/tasks/:taskId` - Update task status

### Provider Callbacks
- `POST /v1/providers/:channel/callbacks` - Receive provider webhooks

## Rules Engine

### Condition DSL
```json
{
  "and": [
    {"field": "event.event_type", "op": "=", "value": "appointment_confirmed"},
    {"field": "patient.ageYearsAtEvent", "op": ">=", "value": 65},
    {
      "or": [
        {"field": "event.payload.specialty", "op": "in", "value": ["cardiology", "neurology"]},
        {"field": "event.payload.is_new_patient", "op": "=", "value": true}
      ]
    }
  ]
}
```

**Supported Operators:**
- `=`, `!=` - Equality
- `>`, `>=`, `<`, `<=` - Comparison
- `in`, `not_in` - Array membership
- `contains` - String/array contains
- `exists` - Field existence check

### Action Types
1. **SEND_MESSAGE**: Enqueue message job
2. **CREATE_TASK**: Create patient task

## Job Worker

The worker polls `prm_jobs` table using Postgres row-level locking:
```sql
SELECT * FROM prm_jobs
WHERE tenant_id = $1
  AND status = 'READY'
  AND run_at <= NOW()
ORDER BY run_at ASC
LIMIT 10
FOR UPDATE SKIP LOCKED
```

**Retry Strategy:**
- Exponential backoff: `next_run_at = now() + base_ms * 2^attempts`
- Max retries: 3 (configurable)
- Dead letter: Jobs marked `DEAD` after max attempts

**Execution Flow:**
1. Check consent via `ClinicalConsentClient.isAllowed()`
2. Apply quiet hours / DND from preferences
3. Render template with variable substitution
4. Send via channel provider
5. Update message status + job status

## Multi-Tenancy

All queries are automatically scoped by `tenant_id`:
```typescript
// Prisma middleware intercepts all queries
prisma.$use(async (params, next) => {
  if (TENANT_ISOLATED_MODELS.includes(params.model)) {
    params.args.where = { ...params.args.where, tenantId: ctx.tenantId };
  }
  return next(params);
});
```

Tenant ID extracted from OIDC token claim (configurable via `OIDC_TENANT_CLAIM`).

## Security

- All endpoints require OIDC authentication
- Tenant isolation enforced at DB middleware layer
- No tenant_id accepted in request body (only from token)
- Patient data scoped by tenant in all queries
- Consent checks before message delivery
- Idempotency keys prevent duplicate operations

## Testing

```bash
# Unit tests
npm test

# Integration tests (requires DB)
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Deployment

```bash
# Build
npm run build

# Start production server
npm start

# Start production worker
npm run worker
```

**Docker:**
```bash
# Build image
docker build -t zeal-prm:latest .

# Run with docker-compose
docker-compose up -d
```

## Monitoring

Logs are structured JSON (Pino):
```json
{
  "level": "info",
  "time": 1703001234567,
  "tenantId": "tenant-123",
  "userId": "user-456",
  "msg": "Event ingested",
  "eventId": "evt-789",
  "eventType": "appointment_confirmed"
}
```

## License

Proprietary - Zeal Health Platform
