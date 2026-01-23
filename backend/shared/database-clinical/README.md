# @zeal/database-clinical

Prisma client and database utilities for the Clinical database (`zeal_clinical`).

## Overview

This package provides database access for the Clinical domain (PHI - Protected Health Information), which includes:

- Patients and patient history
- Encounters and triage
- Appointments and scheduling
- Clinical notes, diagnoses, prescriptions, orders
- Inpatient admissions, discharges, transfers
- Care channels and checklists
- Consents and consent templates
- Medical catalogs (medications, lab tests, imaging, procedures)
- Value sets and terminology

## Installation

This package is used internally within the Zeal monorepo. Reference it in your `package.json`:

```json
{
  "dependencies": {
    "@zeal/database-clinical": "file:../../shared/database-clinical"
  }
}
```

## Exports

```typescript
// Generated Prisma client
export { PrismaClient } from '../generated';
export type { Prisma } from '../generated';

// Extended client with middleware
export { ZealPrismaClient, prisma } from './client';

// NestJS integration
export { PrismaService } from './prisma.service';
export { ClinicalDatabaseModule } from './database.module';

// Enums
export {
  InpatientAdmissionStatus,
  ChannelStatus,
  ChecklistStatus,
  // ... other enums
} from '../generated';
```

## Usage

### NestJS Module

Import the `ClinicalDatabaseModule` in your NestJS application:

```typescript
import { ClinicalDatabaseModule } from '@zeal/database-clinical';

@Module({
  imports: [ClinicalDatabaseModule],
})
export class ClinicalModule {}
```

### PrismaService

Inject `PrismaService` in your services:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async findByMrn(tenantId: string, facilityId: string, mrn: string) {
    return this.prisma.patient.findFirst({
      where: { tenantId, facilityId, mrn },
      include: { patientDocuments: true },
    });
  }
}
```

### Tenant Middleware

The Clinical database package includes automatic tenant isolation:

```typescript
// Tenant ID is automatically injected from RequestContext
const patients = await prisma.patient.findMany({
  where: { facilityId },
});
// Query automatically includes: AND tenantId = '<current-tenant>'
```

### Running with Request Context

For operations that need explicit tenant context:

```typescript
import { PrismaService } from '@zeal/database-clinical';
import { RequestContext } from '@zeal/shared-utils';

async function registerPatient(
  prisma: PrismaService,
  tenantId: string,
  data: RegisterPatientDto
) {
  return RequestContext.run({ tenantId }, async () => {
    return prisma.patient.create({ data });
  });
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLINICAL_DATABASE_URL` | PostgreSQL connection string for zeal_clinical | Yes |

Example:
```bash
CLINICAL_DATABASE_URL=postgresql://zeal_user:zeal_password@localhost:5432/zeal_clinical
```

## Building

```bash
# Generate Prisma client
npm run build --workspace=@zeal/database-clinical
```

## Schema Location

The Prisma schema is located at:
```
prisma/schema.prisma
```

## Middleware

The package includes built-in middleware for:

- **Tenant Isolation**: Automatically injects `tenantId` into all queries
- **Soft Delete**: Converts `delete` operations to status updates (configurable per model)
- **Audit Fields**: Automatically sets `createdAt`/`updatedAt` timestamps

### Models with Soft Delete Disabled

Some models use hard delete for cleanup purposes:
- Schedule child records
- Appointment exceptions
- Temporary records

## Key Models

### Patient Management
- `Patient` - Patient demographics and registration
- `PatientHistory` - Change history with approval workflow
- `PatientDocument` - Identity documents (Emirates ID, etc.)

### Scheduling
- `Schedule` - Provider/resource schedules
- `Appointment` - Individual appointments
- `AppointmentSeries` - Recurring appointment series
- `WaitlistEntry` - Appointment waitlist

### Clinical Documentation
- `Encounter` - Clinical encounters
- `Triage` - Triage assessments
- `EncounterNote` - Clinical notes
- `EncounterDiagnosis` - Diagnoses
- `Prescription` - Medication prescriptions
- `ClinicalOrder` - Lab/imaging orders

### Inpatient
- `InpatientAdmission` - Admissions
- `InpatientDischarge` - Discharges
- `CareChannel` - Care team communication
- `ChannelMessage` - Channel messages
- `Checklist` - Clinical checklists

### Catalogs
- `Medication` - Medication catalog
- `LabTest` - Laboratory test catalog
- `ImagingStudy` - Imaging study catalog
- `Procedure` - Procedure catalog
- `DiagnosisCatalog` - Diagnosis catalog (ICD codes)

## Transaction Support

Use transactions for multi-step operations:

```typescript
const result = await prisma.$transaction(async (tx) => {
  const patient = await tx.patient.create({ data: patientData });
  const encounter = await tx.encounter.create({
    data: { ...encounterData, patientId: patient.id },
  });
  return { patient, encounter };
});
```

## Related Documentation

- [Scheduling System](./docs/SCHEDULING_SYSTEM.md)
- [Scheduling API](./docs/SCHEDULING_API.md)
- [ADR-0013: Service Decomposition](../../../docs/adr/ADR-0013-service-decomposition.md)

## Related Packages

- `@zeal/database-foundation` - Foundation domain database
- `@zeal/database-rcm` - RCM domain database
- `@zeal/shared-utils` - Request context utilities
