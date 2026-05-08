# athma-ce Services Documentation

This directory contains comprehensive documentation for all athma-ce backend services.

## Available Services

### [PRM Service - Patient Relationship Management](./PRM-SERVICE-GUIDE.md)

**Port:** 3013 | **Database:** `zeal_prm`

Event-driven patient engagement platform for automated communication and task management.

**Key Features:**
- Event ingestion from Clinical/RCM systems
- JSON-based rules engine
- Multi-channel messaging (SMS, Email, WhatsApp, Push)
- Task management for care coordinators
- Multi-language templates with variable substitution
- Patient preference management
- Postgres-backed job queue
- Provider webhook integration

**Quick Links:**
- [Full Documentation](./PRM-SERVICE-GUIDE.md)
- [API Reference](http://localhost:3013/api-docs)
- [Database Schema](../../backend/shared/database-prm/prisma/schema.prisma)

---

### Foundation Service

**Port:** 3010 | **Database:** `zeal_foundation`

Core identity, tenancy, and master data management.

**Key Features:**
- Multi-tenancy management
- User authentication & RBAC
- Organizational hierarchy (facilities, departments)
- Staff management
- Master data catalogs (specialties, services, medications, etc.)

---

### Clinical Service

**Port:** 3011 | **Database:** `zeal_clinical`

Patient health information and clinical workflows.

**Key Features:**
- Patient demographics & PHI
- Appointment scheduling
- Clinical encounters & notes
- Vital signs & observations
- Care plans & protocols
- Orders & prescriptions

---

### RCM Service (Revenue Cycle Management)

**Port:** 3012 | **Database:** `zeal_rcm`

Billing, claims, and financial operations.

**Key Features:**
- Invoice generation
- Payment processing
- Insurance claims management
- Payer contracts
- Pharmacy inventory
- Financial reporting

---

### AI Gateway Service

**Port:** 3015 | **Databases:** `zeal_analytics` + domain read access

AI-powered report generation and semantic search.

**Key Features:**
- Natural-language report builder (`/api/v1/reports/*`)
- Clinical semantic search and embedding sync
- AI audit logging and usage tracking

**Operational Notes:**
- `GET /api/v1/health` reports whether the active LLM provider is configured.
- Report generation resolves provider and credentials from Foundation config first (`ai.provider`, provider-specific API key/model), then falls back to process env.
- Embedding and semantic-search indexing resolve `ai.openai_api_key` / `OPENAI_API_KEY`.

---

## Service Interaction Patterns

### Cross-Service Communication

Services communicate via:
1. **REST APIs** - Synchronous data exchange
2. **Events** - Asynchronous workflows (via PRM)
3. **Shared Reference Data** - Foundation catalog IDs

**Example Flow:**
```
Clinical Service                    PRM Service
      │                                  │
      │  Patient checks in               │
      ├──────────────────────────────────>
      │  POST /v1/events                 │
      │  { event_type: "check_in" }      │
      │                                  │
      │                              Evaluates
      │                              Rules
      │                                  │
      │                              Sends SMS
      │                              Reminder
```

### Multi-Tenancy Headers

All API requests require:
```http
Authorization: Bearer <JWT>
x-tenant-id: <tenant-uuid>
x-user-id: <user-uuid>
x-facility-id: <facility-uuid>
```

### Error Handling

All services use consistent error format:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "patient_id",
      "message": "must be a valid UUID"
    }
  ]
}
```

---

## Development Workflow

### Starting All Services

```bash
# Terminal 1 - Database
docker-compose up -d postgres

# Terminal 2 - Foundation
cd backend/services/foundation
npm run dev

# Terminal 3 - Clinical
cd backend/services/clinical
npm run dev

# Terminal 4 - PRM
cd backend/services/prm
npm run dev

# Terminal 5 - Frontend
cd frontend
npm run dev
```

### Service URLs

| Service | Dev URL | Swagger |
|---------|---------|---------|
| Foundation | http://localhost:3010 | http://localhost:3010/api-docs |
| Clinical | http://localhost:3011 | http://localhost:3011/api-docs |
| RCM | http://localhost:3012 | http://localhost:3012/api-docs |
| PRM | http://localhost:3013 | http://localhost:3013/api-docs |
| AI Gateway | http://localhost:3015 | http://localhost:3015/api/docs |
| Frontend | http://localhost:3000 | - |

---

## Common Tasks

### Adding a New Service

1. Create service directory: `backend/services/<service-name>`
2. Initialize NestJS project: `npx @nestjs/cli new <service-name>`
3. Create database package: `backend/shared/database-<service>`
4. Update `.env` with `<SERVICE>_DATABASE_URL`
5. Configure port in service config
6. Document in this README

### Creating Database Migrations

```bash
cd backend/shared/database-<service>
npx prisma migrate dev --name <migration-name>
npx prisma generate
```

### Testing Service Integration

```bash
# Start dependent services first
npm run dev --workspace=@zeal/foundation
npm run dev --workspace=@zeal/clinical

# Then start your service
npm run dev --workspace=@zeal/<your-service>

# Test endpoint
curl http://localhost:<port>/api-docs-json
```

---

## Troubleshooting

### Service Won't Start

1. Check port is not in use: `lsof -i :<port>`
2. Verify database connection: `psql $<SERVICE>_DATABASE_URL`
3. Check environment variables: `cat .env | grep <SERVICE>`
4. Review logs: `npm run dev 2>&1 | tee service.log`

### Database Connection Issues

1. Verify PostgreSQL is running: `docker ps | grep postgres`
2. Check database exists: `psql -U postgres -l`
3. Validate connection string format:
   ```
   postgresql://user:password@host:port/database
   ```
4. Test connection: `node -e "const db = require('./prisma.service'); db.connect()"`

### CORS Errors

All services enable CORS in `main.ts`:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

---

## Architecture Patterns

### Domain-Driven Design

Each service represents a bounded context:
- **Foundation** - Identity & Access
- **Clinical** - Patient Care
- **RCM** - Financial Operations
- **PRM** - Patient Engagement

### Database-per-Service

Each service has its own PostgreSQL database:
- No direct SQL joins across services
- Reference by ID, resolve via API
- Event-driven data synchronization

### Shared Nothing Architecture

Services are independently deployable:
- Separate codebases
- Separate databases
- Separate scaling policies
- API-based integration only

---

## Additional Documentation

- [Backend Architecture](../architecture/BACKEND-ARCHITECTURE.md)
- [Frontend Architecture](../architecture/FRONTEND-ARCHITECTURE-RECOMMENDATION.md)
- [Multi-Tenancy Guide](../multitenancy/)
- [Development Guide](../development/)
- [API Gateway](../architecture/API-GATEWAY-UNIFIED-SWAGGER.md)

---

**Last Updated:** January 2026
