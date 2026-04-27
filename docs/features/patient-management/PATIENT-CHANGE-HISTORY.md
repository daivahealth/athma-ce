# Patient Change History System

Complete guide to tracking and managing patient data changes in the athma-ce platform.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Change Types](#change-types)
5. [Implementation Guide](#implementation-guide)
6. [Query Examples](#query-examples)
7. [Patient-Initiated Changes](#patient-initiated-changes)
8. [Approval Workflows](#approval-workflows)
9. [Audit Reports](#audit-reports)
10. [Best Practices](#best-practices)
11. [Compliance](#compliance)

---

## Overview

The Patient Change History system provides:

- ✅ **Complete audit trail** - Every field change is tracked
- ✅ **Who/what/when/where/why** - Full context for every change
- ✅ **Patient consent tracking** - GDPR/HIPAA compliance
- ✅ **Approval workflows** - Review patient-initiated changes
- ✅ **Time-travel queries** - Reconstruct patient state at any point
- ✅ **Fraud detection** - Identify unusual change patterns
- ✅ **Dispute resolution** - Prove what changed and when

---

## Architecture

### Three-Layer Approach

```
┌─────────────────────────────────────────────────────────────┐
│                   Patient Data Management                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Current State (patients table)                    │
│  ┌────────────────────────────────────────────┐             │
│  │  Patient Record                             │             │
│  │  - Current values for all fields           │             │
│  │  - createdBy, createdAtFacility            │             │
│  │  - updatedBy, updatedAtFacility            │             │
│  └────────────────────────────────────────────┘             │
│                        │                                      │
│                        ▼                                      │
│  Layer 2: Change History (patient_history table)            │
│  ┌────────────────────────────────────────────┐             │
│  │  History Entry (per field change)          │             │
│  │  - fieldName, oldValue, newValue           │             │
│  │  - changeType, changeReason                │             │
│  │  - changedBy, approvedBy                   │             │
│  │  - patientConsent, consentDocUrl           │             │
│  └────────────────────────────────────────────┘             │
│                        │                                      │
│                        ▼                                      │
│  Layer 3: Analytics (audit_log table - Analytics DB)        │
│  ┌────────────────────────────────────────────┐             │
│  │  Cross-Entity Audit                        │             │
│  │  - Security monitoring                      │             │
│  │  - Compliance reporting                     │             │
│  │  - Long-term archival                       │             │
│  └────────────────────────────────────────────┘             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### patients Table (Updated)

```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,

  -- Identity, demographics, contact, address, medical fields...

  -- Registration Context
  created_by UUID NOT NULL,                    -- Who registered patient
  created_at_facility UUID NOT NULL,           -- Where registered
  registration_source VARCHAR(20) DEFAULT 'manual',
  registration_notes TEXT,

  -- Update Context
  updated_by UUID,                             -- Who last updated
  updated_at_facility UUID,                    -- Where last updated

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patients_tenant_created_by ON patients(tenant_id, created_by);
CREATE INDEX idx_patients_tenant_created_facility ON patients(tenant_id, created_at_facility);
CREATE INDEX idx_patients_tenant_reg_source ON patients(tenant_id, registration_source);
```

### patient_history Table

```sql
CREATE TABLE patient_history (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

  -- What changed
  field_name VARCHAR(100) NOT NULL,            -- 'phone_number', 'first_name', etc.
  old_value TEXT,                              -- Previous value
  new_value TEXT,                              -- New value
  change_type VARCHAR(20) NOT NULL,            -- 'update', 'correction', 'patient_request', etc.

  -- Why changed
  change_reason TEXT,                          -- Free-text reason
  supporting_doc_url TEXT,                     -- Link to supporting document

  -- Who changed
  changed_by UUID NOT NULL,                    -- User who made the change
  approved_by UUID,                            -- Supervisor who approved (if required)

  -- Where/When changed
  changed_at_facility UUID,                    -- Facility where change was made
  changed_at TIMESTAMPTZ DEFAULT NOW(),        -- When change occurred

  -- Patient consent
  patient_consent BOOLEAN DEFAULT FALSE,       -- Did patient consent?
  consent_doc_url TEXT,                        -- Link to signed consent form

  -- Metadata
  ip_address VARCHAR(50),                      -- For security tracking
  user_agent TEXT                              -- Device/browser info
);

CREATE INDEX idx_patient_history_patient_time ON patient_history(tenant_id, patient_id, changed_at);
CREATE INDEX idx_patient_history_field ON patient_history(tenant_id, field_name);
CREATE INDEX idx_patient_history_changed_by ON patient_history(tenant_id, changed_by);
CREATE INDEX idx_patient_history_change_type ON patient_history(tenant_id, change_type);
```

---

## Change Types

### Supported Change Types

| Change Type | Description | Requires Approval | Use Case |
|-------------|-------------|-------------------|----------|
| `update` | Standard staff update | No | Routine data entry corrections |
| `correction` | Error correction | Optional | Fix data entry mistakes |
| `patient_request` | Patient-initiated change | Yes | Patient requests phone number update |
| `merge` | Patient record merge | Yes | Duplicate patient consolidation |
| `import` | Bulk import/migration | No | Data migration from legacy system |

### Change Type Enum

```typescript
export enum ChangeType {
  UPDATE = 'update',
  CORRECTION = 'correction',
  PATIENT_REQUEST = 'patient_request',
  MERGE = 'merge',
  IMPORT = 'import',
}
```

---

## Implementation Guide

### 1. Service Setup

```typescript
// patient.service.ts
import { PatientHistoryService } from './patient-history.service';

@Injectable()
export class PatientService {
  constructor(
    private prisma: PrismaClient,
    private historyService: PatientHistoryService
  ) {}
}
```

### 2. Update Patient with History Tracking

```typescript
async updatePatient(
  patientId: string,
  dto: UpdatePatientDto,
  context: RequestContext
) {
  // 1. Get current patient state
  const currentPatient = await this.prisma.patient.findUnique({
    where: { id: patientId, tenantId: context.tenantId },
  });

  // 2. Detect changes
  const changes = [];
  const trackableFields = [
    'firstName', 'lastName', 'phoneNumber', 'email',
    'addressLine1', 'city', 'state', 'postalCode'
  ];

  for (const field of trackableFields) {
    if (dto[field] !== undefined && dto[field] !== currentPatient[field]) {
      changes.push({
        fieldName: field,
        oldValue: currentPatient[field],
        newValue: dto[field],
      });
    }
  }

  // 3. Update patient + record history (atomic transaction)
  const [updatedPatient] = await this.prisma.$transaction([
    this.prisma.patient.update({
      where: { id: patientId },
      data: {
        ...dto,
        updatedBy: context.userId,
        updatedAtFacility: context.facilityId,
      },
    }),
    this.historyService.recordChanges({
      tenantId: context.tenantId,
      patientId,
      changes,
      changeType: 'update',
      changedBy: context.userId,
      changedAtFacility: context.facilityId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    }),
  ]);

  return updatedPatient;
}
```

### 3. Controller Integration

```typescript
// patient.controller.ts
@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController {
  @Put(':id')
  async updatePatient(
    @Param('id') patientId: string,
    @Body() dto: UpdatePatientDto,
    @Req() request: Request
  ) {
    const context = getRequestContext(request);
    return this.patientService.updatePatient(patientId, dto, context);
  }

  @Get(':id/history')
  async getPatientHistory(
    @Param('id') patientId: string,
    @Req() request: Request
  ) {
    const context = getRequestContext(request);
    return this.historyService.getPatientHistory(
      context.tenantId,
      patientId
    );
  }
}
```

---

## Query Examples

### Get Complete Patient History

```typescript
const history = await historyService.getPatientHistory(
  tenantId,
  patientId,
  {
    limit: 100,
    offset: 0,
  }
);
```

### Get History for Specific Field

```typescript
// Get all phone number changes
const phoneHistory = await historyService.getFieldHistory(
  tenantId,
  patientId,
  'phoneNumber'
);

// Result:
[
  {
    fieldName: 'phoneNumber',
    oldValue: '+971501234567',
    newValue: '+971509876543',
    changedAt: '2024-10-20T10:30:00Z',
    changedBy: 'user-id-123',
    changeReason: 'Patient requested update'
  },
  // ... more changes
]
```

### Get Changes by User

```typescript
// Get all changes made by a specific user
const userChanges = await historyService.getChangesByUser(
  tenantId,
  userId,
  {
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-10-31'),
    limit: 100,
  }
);
```

### Reconstruct Patient State at Point in Time

```typescript
// What did patient data look like on Oct 1, 2024?
const historicalState = await historyService.getPatientStateAt(
  tenantId,
  patientId,
  new Date('2024-10-01T00:00:00Z')
);

console.log('Patient name on Oct 1:', historicalState.firstName);
console.log('Phone number on Oct 1:', historicalState.phoneNumber);
```

### Get Change Statistics

```typescript
// Changes by type in last 30 days
const stats = await historyService.getChangeStats(
  tenantId,
  {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    groupBy: 'changeType',
  }
);

// Result:
[
  { changeType: 'update', count: 150 },
  { changeType: 'patient_request', count: 25 },
  { changeType: 'correction', count: 10 },
]
```

---

## Patient-Initiated Changes

### Workflow

```
Patient requests change (e.g., phone number update)
          ↓
Staff enters change request
          ↓
Change recorded in history with changeType='patient_request'
          ↓
Supervisor reviews and approves
          ↓
Change applied to patient record
          ↓
approvedBy field updated in history
```

### Implementation

```typescript
// 1. Patient requests change
await patientService.createChangeRequest(
  patientId,
  {
    phoneNumber: '+971509999999',
    changeReason: 'Patient called to update contact number',
    patientConsent: true,
    supportingDocUrl: 's3://docs/consent-forms/patient-123-phone-change.pdf',
  },
  context
);

// 2. Get pending approvals
const pendingApprovals = await historyService.getPendingApprovals(tenantId);

// 3. Supervisor approves
await patientService.approveChangeRequest(
  historyId,
  supervisorContext
);
```

---

## Approval Workflows

### Required Approvals Matrix

| Change Type | Requires Approval | Approver Role |
|-------------|-------------------|---------------|
| `update` | No | N/A |
| `correction` | Optional (tenant config) | Supervisor |
| `patient_request` | Yes | Registrar / Supervisor |
| `merge` | Yes | Admin |
| `import` | No | N/A |

### Approval Implementation

```typescript
// Configure approval requirements in tenant settings
{
  "change_approval_config": {
    "patient_request": {
      "requires_approval": true,
      "allowed_approvers": ["admin", "supervisor", "registrar"]
    },
    "correction": {
      "requires_approval": true,
      "allowed_approvers": ["supervisor", "admin"]
    }
  }
}
```

---

## Audit Reports

### Patient Audit Report

```typescript
const auditReport = await patientService.getAuditReport(patientId, tenantId);

// Result:
{
  patient: {
    id: 'uuid',
    name: 'Ahmed Al Mansoori',
    nationalId: '784-1990-1234567-8'
  },
  registeredBy: 'user-id-123',
  registeredAt: '2024-01-15T09:00:00Z',
  registeredAtFacility: 'facility-id-456',
  totalChanges: 45,
  changesByType: {
    update: [ /* 30 changes */ ],
    patient_request: [ /* 10 changes */ ],
    correction: [ /* 5 changes */ ]
  },
  recentChanges: [ /* last 10 changes */ ]
}
```

### Facility Audit Report

```sql
-- All changes at a facility in last 30 days
SELECT
  ph.patient_id,
  p.first_name,
  p.last_name,
  ph.field_name,
  ph.change_type,
  ph.changed_by,
  ph.changed_at
FROM patient_history ph
JOIN patients p ON ph.patient_id = p.id
WHERE ph.tenant_id = ?
  AND ph.changed_at_facility = ?
  AND ph.changed_at >= NOW() - INTERVAL '30 days'
ORDER BY ph.changed_at DESC;
```

### User Activity Report

```sql
-- All changes by a user
SELECT
  ph.patient_id,
  p.first_name || ' ' || p.last_name as patient_name,
  ph.field_name,
  ph.old_value,
  ph.new_value,
  ph.changed_at
FROM patient_history ph
JOIN patients p ON ph.patient_id = p.id
WHERE ph.tenant_id = ?
  AND ph.changed_by = ?
ORDER BY ph.changed_at DESC;
```

---

## Best Practices

### 1. Always Use Transactions

```typescript
// ✅ Good - Atomic update + history
await prisma.$transaction([
  prisma.patient.update({ /* ... */ }),
  historyService.recordChanges({ /* ... */ }),
]);

// ❌ Bad - Not atomic, can have inconsistency
await prisma.patient.update({ /* ... */ });
await historyService.recordChanges({ /* ... */ });
```

### 2. Track Sensitive Changes Separately

```typescript
const sensitiveFields = [
  'nationalId',
  'dateOfBirth',
  'bloodGroup',
  'emergencyContact',
];

if (sensitiveFields.includes(fieldName)) {
  // Require supervisor approval
  // Send notification to compliance team
  // Log to security audit
}
```

### 3. Capture Context

```typescript
// Always include full context
await historyService.recordChanges({
  // ... other fields
  ipAddress: request.ip,
  userAgent: request.headers['user-agent'],
  changedAtFacility: context.facilityId,
});
```

### 4. Patient Consent for PHI Changes

```typescript
// Require consent for PHI changes
if (isPHI(fieldName)) {
  if (!dto.patientConsent) {
    throw new BadRequestException(
      'Patient consent required for PHI changes'
    );
  }

  if (!dto.consentDocUrl) {
    throw new BadRequestException(
      'Consent document required'
    );
  }
}
```

### 5. Regular Archive Old History

```sql
-- Archive history older than 7 years to separate table
INSERT INTO patient_history_archive
SELECT * FROM patient_history
WHERE changed_at < NOW() - INTERVAL '7 years';

DELETE FROM patient_history
WHERE changed_at < NOW() - INTERVAL '7 years';
```

---

## Compliance

### HIPAA Compliance

**Requirements:**
- ✅ Track all access and modifications to PHI
- ✅ Record who accessed/modified data
- ✅ Record when access/modification occurred
- ✅ Retain audit logs for 6 years minimum

**Our Implementation:**
- `patient_history` table tracks all modifications
- `changedBy` + `changedAt` fields capture who/when
- `Analytics DB audit_log` for access tracking
- Archive policy configured for 7+ years

### GDPR Compliance

**Requirements:**
- ✅ Patient consent for data processing
- ✅ Right to access (show patient their data history)
- ✅ Right to rectification (allow patient-initiated changes)
- ✅ Right to erasure ("right to be forgotten")

**Our Implementation:**
- `patientConsent` + `consentDocUrl` fields
- API endpoint: `GET /patients/:id/history` (patient portal)
- `createChangeRequest()` for patient-initiated changes
- Soft delete with `status='deleted'` + audit trail

### UAE DHA/DOH Regulations

**Requirements:**
- ✅ Arabic language support for audit trails
- ✅ Track Emirates ID changes
- ✅ Facility-level audit reports
- ✅ Staff accountability

**Our Implementation:**
- Multi-language support via translations table
- Identity change tracking in `patient_history`
- `changedAtFacility` field for facility reports
- `createdBy` + `updatedBy` for staff accountability

---

## Fraud Detection

### Detect Unusual Patterns

```typescript
// Detect rapid changes (possible fraud)
const suspiciousActivity = await historyService.detectUnusualPatterns(
  tenantId,
  {
    threshold: 5,        // 5+ changes
    timeWindow: 60,      // in 60 minutes
  }
);

// Result:
[
  {
    patient_id: 'uuid',
    changed_by: 'user-id',
    change_count: 8,
    first_change: '2024-10-20T10:00:00Z',
    last_change: '2024-10-20T10:45:00Z'
  }
]
```

### Alert on Sensitive Field Changes

```typescript
// Monitor Emirates ID changes
const emiratesIdChanges = await historyService.getPatientHistory(
  tenantId,
  patientId,
  { fieldName: 'nationalId' }
);

if (emiratesIdChanges.length > 1) {
  // Alert: Emirates ID changed multiple times
  await sendAlert({
    type: 'suspicious_activity',
    message: `Patient ${patientId} Emirates ID changed ${emiratesIdChanges.length} times`,
  });
}
```

---

## Frontend Integration

### Display Change History

```typescript
// PatientHistoryTimeline.tsx
export function PatientHistoryTimeline({ patientId }: Props) {
  const { data: history } = useQuery({
    queryKey: ['patient-history', patientId],
    queryFn: () => api.getPatientHistory(patientId),
  });

  return (
    <Timeline>
      {history.map((change) => (
        <TimelineItem key={change.id}>
          <TimelineDate>{formatDate(change.changedAt)}</TimelineDate>
          <TimelineContent>
            <p><strong>{formatFieldName(change.fieldName)}</strong> changed</p>
            <p className="text-gray-600">
              From: <code>{change.oldValue}</code>
            </p>
            <p className="text-gray-600">
              To: <code>{change.newValue}</code>
            </p>
            <p className="text-sm text-gray-500">
              By: {change.changedBy} at {change.changedAtFacility}
            </p>
            {change.changeReason && (
              <p className="text-sm italic">{change.changeReason}</p>
            )}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
```

---

## Migration Script

```sql
-- Add audit columns to existing patients table
ALTER TABLE patients
  ADD COLUMN created_by UUID,
  ADD COLUMN created_at_facility UUID,
  ADD COLUMN registration_source VARCHAR(20) DEFAULT 'manual',
  ADD COLUMN registration_notes TEXT,
  ADD COLUMN updated_by UUID,
  ADD COLUMN updated_at_facility UUID;

-- Create patient_history table
-- (Use schema from this document)

-- Create indexes
CREATE INDEX idx_patients_tenant_created_by ON patients(tenant_id, created_by);
CREATE INDEX idx_patients_tenant_created_facility ON patients(tenant_id, created_at_facility);

-- Backfill for legacy patients (optional)
UPDATE patients
SET
  created_by = 'SYSTEM_USER_ID',
  registration_source = 'import'
WHERE created_by IS NULL;
```

---

## Support

**Files:**
- Schema: `backend/shared/database-clinical/prisma/schema.prisma`
- Services: `backend/services/clinical/src/modules/patient/`
  - `patient-history.service.ts`
  - `patient.service.example.ts`
- Documentation: This file

**Version:** 1.0.0
**Last Updated:** 2025-10-23
**Maintainer:** athma-ce Platform Team
