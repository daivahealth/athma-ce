# Charting Backend Implementation

This document outlines the complete backend implementation for the charting module, which handles clinical notes, diagnoses, clinical orders, and prescriptions for patient encounters.

## Architecture Overview

The charting module follows NestJS best practices with a layered architecture:

```
charting/
├── dto/                    # Data Transfer Objects (Request/Response validation)
│   ├── clinical-note.dto.ts
│   ├── diagnosis.dto.ts
│   ├── clinical-order.dto.ts
│   └── prescription.dto.ts
├── services/              # Business logic layer
│   ├── clinical-notes.service.ts
│   ├── diagnosis.service.ts
│   ├── clinical-orders.service.ts
│   └── prescriptions.service.ts
├── controllers/           # API endpoints
│   ├── clinical-notes.controller.ts
│   ├── diagnosis.controller.ts
│   ├── clinical-orders.controller.ts
│   └── prescriptions.controller.ts
└── charting.module.ts     # Module registration
```

## API Endpoints

### Clinical Notes

**Base URL**: `/api/v1/clinical-notes`

- `POST /` - Create a new clinical note
- `GET /:id` - Get note by ID
- `GET /encounter/:encounterId` - Get all notes for an encounter
- `GET /patient/:patientId` - Get all notes for a patient
- `PATCH /:id` - Update note metadata
- `PUT /:id/sections` - Update note sections
- `POST /:id/sign` - Sign a note
- `DELETE /:id` - Delete a note (soft delete)

### Diagnoses

**Base URL**: `/api/v1/diagnoses`

- `POST /` - Add a diagnosis to encounter
- `GET /:id` - Get diagnosis by ID
- `GET /encounter/:encounterId` - Get all diagnoses for an encounter
- `GET /patient/:patientId` - Get all diagnoses for a patient
- `PATCH /:id` - Update a diagnosis
- `DELETE /:id` - Remove a diagnosis

### Clinical Orders

**Base URL**: `/api/v1/clinical-orders`

- `POST /` - Create a new order (lab, imaging, procedure)
- `GET /:id` - Get order by ID
- `GET /encounter/:encounterId` - Get all orders for an encounter
- `GET /patient/:patientId` - Get all orders for a patient
- `PATCH /:id` - Update order details
- `PUT /:id/results` - Add order results
- `DELETE /:id` - Cancel an order

### Prescriptions

**Base URL**: `/api/v1/prescriptions`

- `POST /` - Create a new prescription
- `GET /:id` - Get prescription by ID
- `GET /encounter/:encounterId` - Get all prescriptions for an encounter
- `GET /patient/:patientId` - Get all prescriptions for a patient (active medications)
- `PATCH /:id` - Update prescription details
- `POST /:id/discontinue` - Discontinue a prescription
- `DELETE /:id` - Delete a prescription

## Key Features

### Clinical Notes

- Support for multiple note types (SOAP, H&P, Progress, Discharge, Procedure, Consultation)
- Multilingual support (EN/AR)
- Flexible JSONB sections for structured or free-text content
- Digital signature workflow with co-sign capability
- Amendment tracking and versioning
- Medico-legal compliance

### Diagnoses

- ICD-10 code support
- Primary/secondary/rule-out/differential classification
- Present on admission tracking
- Chronic condition flags
- Multilingual diagnosis names (EN/AR)
- RCM billing integration ready

### Clinical Orders

- Support for labs (LOINC), imaging (CPT), procedures (CPT/SNOMED)
- Priority levels (stat, urgent, routine)
- Result tracking with structured data
- Multilingual order names (EN/AR)
- Status tracking (ordered → in progress → completed)

### Prescriptions

- NDC/RxNorm drug code support
- Complete dosing information (dose, route, frequency, duration)
- Multilingual instructions (EN/AR)
- Refill tracking
- Active medication list for patient safety

## Security & Multi-Tenancy

All endpoints enforce:
- Multi-tenancy isolation (automatic via Prisma middleware)
- Authentication via JWT
- Required headers: `x-tenant-id`, `x-user-id`, `x-facility-id`
- RBAC permissions (future enhancement)

## Database Relations

All charting data is anchored to encounters:

```
Encounter
├── ClinicalNote (1:many)
│   └── ClinicalNoteSection (1:many)
├── EncounterDiagnosis (1:many)
├── ClinicalOrder (1:many)
└── PrescriptionOrder (1:many)
```

This design enables:
- Easy chart loading (single encounter query)
- Efficient billing integration (all data tied to encounter)
- Clean audit trails (encounter-level tracking)

## Usage Example

### Creating a SOAP Note

```typescript
POST /api/v1/clinical-notes
{
  "encounterId": "uuid",
  "patientId": "uuid",
  "noteType": "soap",
  "language": "en",
  "title": "Follow-up Visit",
  "authorStaffId": "uuid",
  "sections": [
    {
      "sectionCode": "subjective",
      "sectionName": "Subjective",
      "content": {
        "text": "Patient reports improved symptoms..."
      },
      "sortOrder": 1
    },
    {
      "sectionCode": "objective",
      "sectionName": "Objective",
      "content": {
        "vitalSigns": {
          "bp": "120/80",
          "hr": 72,
          "temp": 37.0
        },
        "text": "Patient appears well..."
      },
      "sortOrder": 2
    },
    {
      "sectionCode": "assessment",
      "sectionName": "Assessment",
      "content": {
        "text": "Improvement noted. Continue current treatment plan."
      },
      "sortOrder": 3
    },
    {
      "sectionCode": "plan",
      "sectionName": "Plan",
      "content": {
        "text": "1. Continue current medications\n2. Follow-up in 2 weeks\n3. Lab work as ordered"
      },
      "sortOrder": 4
    }
  ]
}
```

### Adding a Diagnosis

```typescript
POST /api/v1/diagnoses
{
  "encounterId": "uuid",
  "patientId": "uuid",
  "icdCode": "J45.0",
  "diagnosisName": "Allergic asthma",
  "diagnosisNameAr": "الربو التحسسي",
  "diagnosisType": "primary",
  "diagnosisRank": 1,
  "isChronic": true,
  "diagnosedBy": "uuid"
}
```

### Ordering a Lab Test

```typescript
POST /api/v1/clinical-orders
{
  "encounterId": "uuid",
  "patientId": "uuid",
  "orderType": "lab",
  "orderCode": "2345-7",
  "codeSystem": "LOINC",
  "orderName": "Glucose, Blood",
  "orderNameAr": "جلوكوز الدم",
  "priority": "routine",
  "clinicalIndication": "Diabetes follow-up",
  "orderedBy": "uuid"
}
```

### Prescribing Medication

```typescript
POST /api/v1/prescriptions
{
  "encounterId": "uuid",
  "patientId": "uuid",
  "drugCode": "0169-7501-11",
  "codeSystem": "NDC",
  "drugName": "Metformin Hydrochloride 500mg Tablet",
  "drugNameAr": "ميتفورمين هيدروكلوريد 500 ملغ قرص",
  "genericName": "Metformin",
  "dosage": "500mg",
  "route": "oral",
  "frequency": "twice daily",
  "duration": "30 days",
  "quantity": "60",
  "refills": 3,
  "instructions": "Take with meals to reduce stomach upset",
  "instructionsAr": "تناول مع الوجبات لتقليل اضطراب المعدة",
  "prescribedBy": "uuid"
}
```

## Testing

Run tests with:
```bash
cd backend/services/clinical
npm run test                  # Unit tests
npm run test:e2e             # Integration tests
npm run test:cov             # Coverage report
```

## Future Enhancements

1. **AI Note Generation** - Integrate with AI service for automated note drafting
2. **Voice-to-Text** - Dictation support for clinical notes
3. **Order Sets** - Pre-defined order bundles for common conditions
4. **Clinical Decision Support** - Drug interaction checking, dose verification
5. **e-Prescribing** - Direct integration with pharmacies
6. **Result Notifications** - Alert clinicians when critical results arrive
7. **Mobile Charting** - Optimized mobile endpoints for bedside documentation

## Deployment Notes

The charting module is part of the clinical microservice. Deploy with:

```bash
cd backend/services/clinical
npm run build
npm start
```

Service runs on port 3011 by default. Configure via environment variables:
- `PORT` - Service port (default: 3011)
- `CLINICAL_DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - For authentication
- `REDIS_URL` - For caching (optional)

## API Documentation

Swagger documentation available at: `http://localhost:3011/api/docs`

All endpoints include:
- Request/response schemas
- Validation rules
- Example payloads
- Error responses
