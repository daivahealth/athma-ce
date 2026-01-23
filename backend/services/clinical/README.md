# Clinical Service

The Clinical Service handles all Protected Health Information (PHI) for the Zeal Healthcare Platform, including patient management, clinical encounters, scheduling, charting, and inpatient care.

## Overview

This service manages all clinical workflows and patient data, including:

- **Patient Management**: Registration, demographics, medical history, change tracking
- **Scheduling**: Appointments, availability, provider schedules, recurring series
- **Encounters**: Clinical encounters, triage, visit workflows
- **Charting**: Clinical notes, diagnoses, prescriptions, orders
- **Inpatient**: Admissions, discharges, transfers, ward management, care channels
- **Consent**: Patient consent templates and tracking
- **Catalogs**: Medical catalogs (medications, lab tests, imaging, procedures, diagnoses)
- **Value Sets**: Terminology and reference data management

## Port

**Default Port**: 3011

## Technology Stack

- NestJS with TypeScript
- PostgreSQL (via Prisma ORM) - `zeal_clinical` database
- Swagger/OpenAPI documentation
- RRule for recurring appointment series

## Module Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── common/
│   ├── decorators/            # @TenantId, @UserId, @FacilityId decorators
│   ├── guards/                # Authentication guards
│   └── interceptors/          # Request context interceptors
└── modules/
    ├── patient/               # Patient management
    │   ├── patient.controller.ts
    │   ├── patient-history.controller.ts
    │   ├── patient-document.controller.ts
    │   ├── patient.service.ts
    │   └── dto/
    ├── scheduling/            # Appointment scheduling
    │   ├── appointment.controller.ts
    │   ├── availability.controller.ts
    │   ├── schedule.controller.ts
    │   ├── appointment.service.ts
    │   ├── availability.service.ts
    │   └── dto/
    ├── encounter/             # Clinical encounters
    │   ├── encounter.controller.ts
    │   ├── triage.controller.ts
    │   ├── encounter.service.ts
    │   └── dto/
    ├── charting/              # Clinical documentation
    │   ├── controllers/
    │   │   ├── encounter-notes.controller.ts
    │   │   ├── prescriptions.controller.ts
    │   │   ├── clinical-orders.controller.ts
    │   │   └── diagnosis.controller.ts
    │   ├── services/
    │   └── dto/
    ├── inpatient/             # Inpatient care
    │   ├── admission.controller.ts
    │   ├── discharge.controller.ts
    │   ├── discharge-transaction.controller.ts
    │   ├── discharge-summary.controller.ts
    │   ├── ward.controller.ts
    │   ├── channel.controller.ts
    │   ├── membership.controller.ts
    │   ├── message.controller.ts
    │   ├── checklist.controller.ts
    │   ├── checklist-template.controller.ts
    │   └── services/
    ├── consent/               # Consent management
    │   ├── consent.controller.ts
    │   ├── consent-template.controller.ts
    │   └── consent.service.ts
    ├── catalog/               # Medical catalogs
    │   ├── catalog.controller.ts
    │   ├── controllers/
    │   │   ├── package.controller.ts
    │   │   ├── vital-signs-template.controller.ts
    │   │   ├── administrative-service.controller.ts
    │   │   └── note-templates.controller.ts
    │   └── catalog.service.ts
    ├── valueset/              # Terminology value sets
    │   ├── valueset.controller.ts
    │   └── valueset.service.ts
    └── bed-search/            # Bed availability search
        ├── bed-search.controller.ts
        └── bed-search.service.ts
```

## API Endpoints

### Patients (`/patients`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patients` | Register new patient |
| GET | `/patients/registration/defaults` | Get registration defaults |
| GET | `/patients` | Search patients |
| GET | `/patients/:id` | Get patient by ID |
| PUT | `/patients/:id` | Update patient |
| GET | `/patients/:id/history` | Get patient change history |
| POST | `/patients/:id/change-request` | Submit change request |
| POST | `/patients/:id/approve/:historyId` | Approve change request |
| GET | `/patients/:id/field/:fieldName/timeline` | Get field change timeline |
| GET | `/patients/:id/audit` | Get patient audit log |

### Patient Documents (`/patients/:patientId/documents`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patients/:patientId/documents` | Upload document |
| GET | `/patients/:patientId/documents` | List patient documents |
| GET | `/patients/:patientId/documents/:id` | Get document |
| DELETE | `/patients/:patientId/documents/:id` | Delete document |

### Scheduling - Appointments (`/scheduling/appointments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/scheduling/appointments` | Book appointment |
| GET | `/scheduling/appointments/:id` | Get appointment |
| PUT | `/scheduling/appointments/:id/reschedule` | Reschedule appointment |
| POST | `/scheduling/appointments/:id/cancel` | Cancel appointment |
| POST | `/scheduling/appointments/resources` | Create resource booking |
| POST | `/scheduling/appointments/resources/:id/confirm` | Confirm resource |
| POST | `/scheduling/appointments/series` | Create recurring series |
| GET | `/scheduling/appointments/series/:id` | Get series |
| POST | `/scheduling/appointments/series/:id/pause` | Pause series |
| POST | `/scheduling/appointments/series/:id/resume` | Resume series |
| POST | `/scheduling/appointments/series/:id/cancel` | Cancel series |
| GET | `/scheduling/appointments/patients/:patientId` | Get patient appointments |
| GET | `/scheduling/appointments/facilities/:facilityId` | Get facility appointments |
| GET | `/scheduling/appointments/facility/current` | Get current facility appointments |

### Scheduling - Availability (`/scheduling/availability`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/scheduling/availability/slots` | Get available slots |
| POST | `/scheduling/availability/check` | Check slot availability |
| GET | `/scheduling/availability/providers/:providerId` | Get provider availability |

### Scheduling - Schedules (`/scheduling/schedules`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/scheduling/schedules` | Create schedule |
| GET | `/scheduling/schedules` | List schedules |
| GET | `/scheduling/schedules/:id` | Get schedule |
| PUT | `/scheduling/schedules/:id` | Update schedule |
| DELETE | `/scheduling/schedules/:id` | Delete schedule |

### Encounters (`/encounters`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/encounters` | Create encounter |
| GET | `/encounters` | Search encounters |
| GET | `/encounters/facility/:facilityId/today` | Get today's encounters |
| GET | `/encounters/patient/:patientId/active` | Get active encounters |
| GET | `/encounters/patient/:patientId` | Get patient encounters |
| GET | `/encounters/:id` | Get encounter by ID |
| PUT | `/encounters/:id` | Update encounter |
| PATCH | `/encounters/:id/status` | Update encounter status |

### Triage (`/encounters/:id/triage`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/encounters/:id/triage` | Create triage assessment |
| GET | `/encounters/:id/triage` | Get triage data |
| PUT | `/encounters/:id/triage` | Update triage |

### Charting - Notes (`/notes`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notes` | Create clinical note |
| GET | `/notes/encounter/:encounterId` | Get encounter notes |
| GET | `/notes/:id` | Get note by ID |
| PUT | `/notes/:id` | Update note |
| DELETE | `/notes/:id` | Delete note |

### Charting - Diagnoses (`/diagnoses`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/diagnoses` | Add diagnosis |
| GET | `/diagnoses/encounter/:encounterId` | Get encounter diagnoses |
| GET | `/diagnoses/patient/:patientId` | Get patient diagnoses |
| PUT | `/diagnoses/:id` | Update diagnosis |
| DELETE | `/diagnoses/:id` | Remove diagnosis |

### Charting - Prescriptions (`/prescriptions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/prescriptions` | Create prescription |
| GET | `/prescriptions/:id` | Get prescription |
| GET | `/prescriptions/encounter/:encounterId` | Get encounter prescriptions |
| GET | `/prescriptions/patient/:patientId` | Get patient prescriptions |
| PATCH | `/prescriptions/:id` | Update prescription |
| POST | `/prescriptions/:id/discontinue` | Discontinue prescription |
| DELETE | `/prescriptions/:id` | Delete prescription |

### Charting - Orders (`/orders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create order (lab/imaging) |
| GET | `/orders/encounter/:encounterId` | Get encounter orders |
| GET | `/orders/:id` | Get order by ID |
| PATCH | `/orders/:id/status` | Update order status |
| DELETE | `/orders/:id` | Cancel order |

### Inpatient - Admissions (`/inpatient/admissions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/inpatient/admissions` | Create admission |
| GET | `/inpatient/admissions` | List admissions |
| GET | `/inpatient/admissions/:id` | Get admission |
| PUT | `/inpatient/admissions/:id` | Update admission |
| POST | `/inpatient/admissions/:id/transfer` | Transfer patient |

### Inpatient - Discharges (`/inpatient/discharges`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/inpatient/discharges` | Initiate discharge |
| GET | `/inpatient/discharges/:id` | Get discharge |
| PUT | `/inpatient/discharges/:id` | Update discharge |
| POST | `/inpatient/discharges/:id/execute` | Execute discharge |

### Inpatient - Ward Board (`/inpatient/wards`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inpatient/wards/:wardId/board` | Get ward board |
| GET | `/inpatient/wards/:wardId/census` | Get ward census |

### Inpatient - Care Channels (`/inpatient/channels`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/inpatient/channels` | Create care channel |
| GET | `/inpatient/channels/admission/:admissionId` | Get admission channels |
| GET | `/inpatient/channels/:id` | Get channel |
| PUT | `/inpatient/channels/:id` | Update channel |
| POST | `/inpatient/channels/:id/close` | Close channel |

### Inpatient - Messages (`/inpatient/channels/:channelId/messages`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/inpatient/channels/:channelId/messages` | Send message |
| GET | `/inpatient/channels/:channelId/messages` | Get messages |

### Inpatient - Checklists (`/inpatient/checklists`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/inpatient/checklists` | Create checklist |
| GET | `/inpatient/checklists/admission/:admissionId` | Get admission checklists |
| GET | `/inpatient/checklists/:id` | Get checklist |
| PUT | `/inpatient/checklists/:id/items/:itemId` | Update checklist item |

### Consent (`/consents`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/consents` | Create consent record |
| GET | `/consents/patient/:patientId` | Get patient consents |
| GET | `/consents/:id` | Get consent |
| PUT | `/consents/:id/revoke` | Revoke consent |

### Consent Templates (`/consent-templates`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/consent-templates` | Create template |
| GET | `/consent-templates` | List templates |
| GET | `/consent-templates/:id` | Get template |
| PUT | `/consent-templates/:id` | Update template |

### Catalogs (`/catalogs`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT/DELETE | `/catalogs/medications` | Medication catalog CRUD |
| GET/POST/PUT/DELETE | `/catalogs/lab-tests` | Lab test catalog CRUD |
| GET/POST/PUT/DELETE | `/catalogs/imaging-studies` | Imaging study catalog CRUD |
| GET/POST/PUT/DELETE | `/catalogs/procedures` | Procedure catalog CRUD |
| GET/POST/PUT/DELETE | `/catalogs/diagnoses` | Diagnosis catalog CRUD |
| GET/POST/PUT/DELETE | `/catalogs/diagnosis-versions` | Diagnosis version management |
| POST | `/catalogs/diagnosis-versions/:id/import` | Import diagnosis codes |

### Packages (`/packages`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/packages` | Create service package |
| GET | `/packages` | List packages |
| GET | `/packages/:id` | Get package |
| PUT | `/packages/:id` | Update package |
| DELETE | `/packages/:id` | Delete package |

### Value Sets (`/valuesets`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/valuesets` | Create value set |
| GET | `/valuesets` | List value sets |
| GET | `/valuesets/:type` | Get value set by type |
| PUT | `/valuesets/:id` | Update value set |

### Bed Search (`/bed-search`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bed-search` | Search available beds |
| GET | `/bed-search/facility/:facilityId` | Search beds in facility |

## Environment Variables

Create a `.env.local` file with:

```bash
# Server
PORT=3011
NODE_ENV=development

# Database
CLINICAL_DATABASE_URL=postgresql://zeal_user:zeal_password@localhost:5432/zeal_clinical

# Foundation Service (for staff lookup)
FOUNDATION_API_URL=http://localhost:3010

# Configuration
CONFIG_API_URL=http://localhost:3010/configs
CONFIG_CACHE_TTL=300000
```

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL 16+
- Clinical database created and migrated
- Foundation service running (for authentication)

### Running the Service

```bash
# From backend directory
npm run dev --workspace=@zeal/clinical

# Or with debug logging
npm run dev:debug --workspace=@zeal/clinical
```

### API Documentation

Swagger documentation available at:

```
http://localhost:3011/docs
```

## Request Headers

All requests require:

| Header | Description |
|--------|-------------|
| `Authorization` | Bearer token (JWT from Foundation service) |
| `x-tenant-id` | Current tenant ID |
| `x-facility-id` | Current facility ID |

## Context Decorators

The service provides custom decorators for extracting request context:

```typescript
@Get()
async getPatients(
  @TenantId() tenantId: string,
  @FacilityId() facilityId: string,
  @UserId() userId: string,
  @Context() ctx: RequestContextStore
) {
  // Use context values
}
```

## Dependencies

### Internal Packages
- `@zeal/database-clinical` - Prisma client for Clinical DB
- `@zeal/contracts` - Shared DTOs and Zod schemas
- `@zeal/shared-utils` - Shared utilities (RequestContext)
- `@zeal/shared-types` - Shared type definitions (Consent types)
- `@zeal/config-client` - Configuration client

### Key External Dependencies
- `rrule` - Recurring appointment rules
- `class-validator` - DTO validation
- `pino` - Logging

## Data Isolation

This service operates exclusively on the `zeal_clinical` database. All data is tenant-isolated using:

1. **Row-Level Security (RLS)** at database level
2. **Tenant middleware** that injects `tenantId` into all queries
3. **Request context** that propagates tenant/facility IDs

## Related Documentation

- [Architecture Overview](../../../docs/architecture/BACKEND-ARCHITECTURE.md)
- [Clinical Domain Model](../../../docs/architecture/03-Domain-Model.md)
- [Scheduling System](../../shared/database-clinical/docs/SCHEDULING_SYSTEM.md)
- [Charting Implementation](./CHARTING_IMPLEMENTATION.md)
- [ADR-0013: Service Decomposition](../../../docs/adr/ADR-0013-service-decomposition.md)
