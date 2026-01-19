# Inpatient Discharge Table - Implementation Summary

## Overview

Successfully separated discharge workflow from the `InpatientAdmission` table by creating a new `InpatientDischarge` transaction table. This provides better separation of concerns, richer audit trails, and more flexible discharge workflows.

---

## ✅ What Was Implemented

### 1. Database Schema

**New Table: `inpatient_discharges`**
- 40+ fields covering the complete discharge lifecycle
- 1:1 relationship with `InpatientAdmission`
- Linked to `ChecklistInstance` for discharge checklists
- Comprehensive audit trail with who/when for each stage

**New Enums:**
```prisma
enum DischargeTransactionStatus {
  PLANNING    // Discharge planning initiated
  READY       // Checklist verified, medically ready
  APPROVED    // Final approval given (optional)
  EXECUTED    // Patient discharged
  CANCELLED   // Discharge cancelled
}

enum DischargeType {
  ROUTINE
  AGAINST_MEDICAL_ADVICE
  TRANSFER_ACUTE_CARE
  TRANSFER_SNF
  TRANSFER_REHABILITATION
  EXPIRED
  ELOPED
  LEFT_WITHOUT_BEING_SEEN
}

enum DischargeDestination {
  HOME
  HOME_WITH_HOME_HEALTH
  SKILLED_NURSING_FACILITY
  ACUTE_CARE_HOSPITAL
  REHABILITATION_FACILITY
  HOSPICE_HOME
  HOSPICE_FACILITY
  PSYCHIATRIC_FACILITY
  DECEASED
  OTHER
}
```

**Key Fields:**
- **Planning Stage**: `initiatedBy`, `initiatedAt`, `targetDischargeDate`
- **Checklist**: `checklistInstanceId`, `checklistCompletedAt`, `checklistVerifiedAt`
- **Ready State**: `readyMarkedAt`, `readyMarkedBy`, `readyRemarks`
- **Approval**: `approvalRequired`, `approvedBy`, `approvedAt`
- **Execution**: `actualDischargeDate`, `dischargedBy`, `dischargeType`, `dischargeDestination`
- **Clinical**: `dischargeSummaryId`, `finalDiagnosis`, `dischargeMedications`
- **Follow-up**: `followUpAppointments`, `homeHealthOrdered`, `dmeOrdered`
- **Administrative**: `billingCleared`, `insuranceNotified`, `medicalRecordsComplete`
- **Metrics**: `lengthOfStayDays`, `planningDurationHours`

### 2. DischargeTransactionService

**New Service**: `/backend/services/clinical/src/modules/inpatient/discharge-transaction.service.ts`

**Key Methods:**

```typescript
// 1. Start discharge planning
initiateDischargePlanning(admissionId, dto, context)
  → Creates InpatientDischarge record
  → Updates admission.dischargeStatus = INITIATED
  → Creates event
  → Returns discharge transaction

// 2. Get discharge by admission
getDischargeByAdmissionId(admissionId, tenantId)
  → Includes checklist and admission details

// 3. Mark as ready (called by checklist verification)
markReady(dischargeId, remarks, context)
  → Updates status to READY
  → Records who/when marked ready
  → Updates admission status

// 4. Approve discharge (optional workflow)
approveDischarge(dischargeId, remarks, context)
  → Requires discharge to be READY
  → Updates status to APPROVED
  → Records approver and timestamp

// 5. Execute discharge
executeDischarge(dischargeId, dto, context)
  → Updates status to EXECUTED
  → Records discharge type/destination
  → Calculates length of stay
  → Updates admission status to DISCHARGED
  → Closes care channel
  → Creates events

// 6. Cancel discharge
cancelDischarge(dischargeId, reason, context)
  → Updates status to CANCELLED
  → Resets admission discharge status
```

### 3. ChecklistIntegrationService Update

**Updated**: Checklist verification now updates the discharge transaction:

```typescript
// When DISCHARGE checklist is verified:
1. Find InpatientDischarge for admission
2. Update discharge.status = READY
3. Set checklistVerifiedAt, checklistVerifiedBy
4. Set readyMarkedAt, readyMarkedBy
5. Update admission.dischargeStatus = READY (backward compat)
```

**File**: `/backend/services/clinical/src/modules/inpatient/checklist-integration.service.ts`
**Lines**: 212-249

---

## Discharge Workflow

### Complete Flow (with Care Channel Integration):

```
1. Initiate Discharge Planning
   → DischargeTransactionService.initiateDischargePlanning()
   → Creates InpatientDischarge (status: PLANNING)
   → Admission.dischargeStatus = INITIATED
   → Auto-creates discharge checklist (if configured)
   → 📢 Posts "Discharge planning initiated" message to Care Channel

2. Complete Checklist
   → Staff fills out checklist items
   → ChecklistService.completeInstance()
   → Instance.status = COMPLETED
   → 📢 Posts "Checklist completed" message to Care Channel

3. Verify Checklist
   → Authorized user verifies
   → ChecklistIntegrationService.verifyInstance()
   → InpatientDischarge.status = READY
   → Admission.dischargeStatus = READY
   → checklistVerifiedAt/By recorded
   → 📢 Posts "Patient is ready for discharge" message to Care Channel

4. Approve (Optional)
   → If discharge.approvalRequired = true
   → DischargeTransactionService.approveDischarge()
   → InpatientDischarge.status = APPROVED
   → 📢 Posts "Discharge approved" message to Care Channel

5. Execute Discharge
   → DischargeTransactionService.executeDischarge()
   → InpatientDischarge.status = EXECUTED
   → Admission.status = DISCHARGED
   → Admission.dischargeStatus = CONFIRMED
   → CareChannel.status = CLOSED
   → Length of stay calculated
   → 📢 Posts "Patient discharged to [destination]" message to Care Channel

6. Cancel (if needed)
   → DischargeTransactionService.cancelDischarge()
   → InpatientDischarge.status = CANCELLED
   → Admission.dischargeStatus = NONE
   → 📢 Posts "Discharge cancelled - Reason: [reason]" message to Care Channel
```

---

## Benefits

### 1. Separation of Concerns
- Admission = start of care
- Discharge = end of care with complex workflow
- Clear boundaries, easier to maintain

### 2. Better Audit Trail
```typescript
{
  initiatedBy: "case-manager-id",
  initiatedAt: "2025-01-20T08:00:00Z",

  checklistVerifiedBy: "physician-id",
  checklistVerifiedAt: "2025-01-21T14:30:00Z",

  readyMarkedBy: "charge-nurse-id",
  readyMarkedAt: "2025-01-21T14:31:00Z",

  approvedBy: "attending-physician-id",
  approvedAt: "2025-01-21T15:00:00Z",

  dischargedBy: "nurse-id",
  actualDischargeDate: "2025-01-21T16:00:00Z",

  lengthOfStayDays: 5,
  planningDurationHours: 32
}
```

### 3. Richer Data Model
- Discharge summary link
- Final diagnosis
- Discharge medications
- Follow-up appointments
- Home health details
- DME orders
- Patient education tracking
- Administrative checkboxes

### 4. Flexible Workflows
- Optional approval workflow
- Cancellation with reason tracking
- Multiple discharge destinations
- Different discharge types
- Target vs actual discharge times

### 5. Better Analytics
- Track planning duration
- Measure checklist completion time
- Analyze discharge delays
- Monitor approval bottlenecks
- Report on discharge destinations

---

## Migration Notes

### Legacy Support

**DischargeChecklist table retained** for backward compatibility:
- Marked as `LEGACY` in schema comments
- New workflows use `InpatientDischarge` + `ChecklistInstance`
- Can co-exist during migration period

### Backward Compatibility

The implementation maintains backward compatibility by:
1. Keeping discharge fields on `InpatientAdmission` table
2. Updating both tables during transitions
3. Old `DischargeService` still works (uses DischargeChecklist)
4. New `DischargeTransactionService` for new workflows

### Migration Path

**For existing admissions with discharge data:**
1. Create `InpatientDischarge` records from admission data
2. Link existing checklists if present
3. Infer status based on admission.dischargeStatus
4. Populate audit fields with best-effort data

**Migration script needed** (future task):
```sql
INSERT INTO inpatient_discharges (...)
SELECT
  admission_id,
  patient_id,
  ...
FROM inpatient_admissions
WHERE discharge_status != 'NONE';
```

---

## Files Modified/Created

### Schema
- ✅ `/backend/shared/database-clinical/prisma/schema.prisma`
  - Added `InpatientDischarge` model (lines 2057-2164)
  - Added 3 new enums (lines 181-213)
  - Updated `InpatientAdmission` relations (line 1828)
  - Updated `ChecklistInstance` relations (line 355)

### Package Exports
- ✅ `/backend/shared/database-clinical/src/index.ts`
  - Exported 3 new enums (lines 33-38)

### Services
- ✅ `/backend/services/clinical/src/modules/inpatient/discharge-transaction.service.ts`
  - New comprehensive service (457 lines)

- ✅ `/backend/services/clinical/src/modules/inpatient/checklist-integration.service.ts`
  - Updated `verifyInstance()` method (lines 212-249)
  - Now updates InpatientDischarge table

### Documentation
- ✅ `/docs/features/INPATIENT-DISCHARGE-TABLE-IMPLEMENTATION.md`
  - This file

---

## Next Steps

### 1. Create Controller & DTOs

**Need to create:**
- `InitiateDischargeDto` - For starting discharge planning
- `ExecuteDischargeDto` - For final discharge execution
- `DischargeTransactionController` - REST API endpoints

**Endpoints needed:**
```typescript
POST   /api/v1/inpatient/admissions/:admissionId/discharge/initiate
GET    /api/v1/inpatient/admissions/:admissionId/discharge
PATCH  /api/v1/inpatient/discharges/:id/ready
PATCH  /api/v1/inpatient/discharges/:id/approve
PATCH  /api/v1/inpatient/discharges/:id/execute
PATCH  /api/v1/inpatient/discharges/:id/cancel
```

### 2. Register in Module

**Update**: `/backend/services/clinical/src/modules/inpatient/inpatient.module.ts`
- Add `DischargeTransactionService` to providers
- Add `DischargeTransactionController` to controllers
- Export service for use by other modules

### 3. Frontend Integration

**Create:**
- TypeScript types matching new discharge model
- Service methods for API calls
- Discharge planning UI component
- Discharge execution form
- Timeline/status tracker

### 4. Testing

**Test scenarios:**
- Initiate discharge → Auto-create checklist → Verify → Execute
- Initiate with approval required → Complete flow
- Cancel discharge mid-process
- Execute without approval workflow
- Different discharge types/destinations
- Length of stay calculation
- Care channel closure on discharge

### 5. Seed Data Update

**Create sample discharge data:**
- Template discharge transactions in various states
- Link to existing admissions
- Include metrics (LOS, planning duration)

---

## API Usage Examples

### Initiate Discharge Planning

```typescript
POST /api/v1/inpatient/admissions/{admissionId}/discharge/initiate
{
  "targetDischargeDate": "2025-01-25",
  "targetDischargeTime": "14:00",
  "approvalRequired": false,
  "internalNotes": "Patient improving, target discharge Friday"
}

Response: {
  "id": "discharge-uuid",
  "admissionId": "admission-uuid",
  "status": "PLANNING",
  "initiatedBy": "case-manager-id",
  "initiatedAt": "2025-01-20T09:00:00Z",
  ...
}
```

### Execute Discharge

```typescript
PATCH /api/v1/inpatient/discharges/{dischargeId}/execute
{
  "dischargeType": "ROUTINE",
  "dischargeDestination": "HOME_WITH_HOME_HEALTH",
  "dischargeSummaryId": "note-uuid",
  "finalDiagnosis": [
    { "icdCode": "I50.9", "name": "Heart failure, unspecified" }
  ],
  "dischargeMedications": [
    { "name": "Lisinopril", "dose": "10mg", "frequency": "daily" }
  ],
  "followUpInstructions": "Follow up with cardiologist in 1 week",
  "followUpAppointments": [
    { "provider": "Dr. Smith", "date": "2025-01-28", "specialty": "Cardiology" }
  ]
}

Response: {
  "id": "discharge-uuid",
  "status": "EXECUTED",
  "actualDischargeDate": "2025-01-21T16:00:00Z",
  "lengthOfStayDays": 5,
  "planningDurationHours": 31,
  ...
}
```

---

## Care Channel Integration

All discharge transaction state changes are automatically posted to the patient's Care Channel, providing real-time visibility to the entire care team.

### Channel Message Types

| Discharge Event | Message Type | Subtype | Priority | Linked Entity |
|----------------|--------------|---------|----------|---------------|
| Planning Initiated | SYSTEM | discharge_planning_initiated | NORMAL | inpatient_discharge |
| Ready for Discharge | SYSTEM | discharge_ready | HIGH | inpatient_discharge |
| Discharge Approved | SYSTEM | discharge_approved | HIGH | inpatient_discharge |
| Discharge Confirmed | SYSTEM | discharge_confirmed | HIGH | inpatient_admission |
| Discharge Cancelled | SYSTEM | discharge_cancelled | NORMAL | inpatient_discharge |

### Channel Event Emitter Methods

**New Methods Added:**
```typescript
// 1. Discharge planning initiated
emitDischargePlanningInitiated(dischargeId, channelId, details, tx, context)

// 2. Patient ready for discharge (after checklist verification)
emitDischargeReady(dischargeId, channelId, readyDetails, tx, context)

// 3. Discharge approved (optional workflow)
emitDischargeApproved(dischargeId, channelId, approvalDetails, tx, context)

// 4. Discharge cancelled
emitDischargeCancelled(dischargeId, channelId, cancellationDetails, tx, context)

// 5. Discharge confirmed (already existed)
emitDischargeConfirmed(admissionId, channelId, dischargeDetails, tx, context)
```

### Integration Points

**1. DischargeTransactionService:**
- `initiateDischargePlanning()` → emits discharge_planning_initiated
- `markReady()` → emits discharge_ready
- `approveDischarge()` → emits discharge_approved
- `executeDischarge()` → emits discharge_confirmed + closes channel
- `cancelDischarge()` → emits discharge_cancelled

**2. ChecklistIntegrationService:**
- `verifyInstance()` → emits discharge_ready (when DISCHARGE checklist verified)

### Idempotency

All channel messages use idempotency keys to prevent duplicates:
- `discharge_planning_initiated:{dischargeId}`
- `discharge_ready:{dischargeId}`
- `discharge_approved:{dischargeId}`
- `discharge_confirmed:{admissionId}`
- `discharge_cancelled:{dischargeId}`

### Channel Lifecycle

```
Admission Created → Channel ACTIVE
  ↓
Discharge Planning → "Planning initiated" message
  ↓
Checklist Verified → "Patient ready" message (HIGH priority)
  ↓
Discharge Approved → "Approved" message (HIGH priority)
  ↓
Patient Discharged → "Discharged to [destination]" message + Channel CLOSED
```

**OR (if cancelled):**
```
Any Stage → "Discharge cancelled - Reason: [reason]" message
  ↓
Channel remains ACTIVE
```

---

## Success Criteria

✅ **Schema created** - InpatientDischarge table with all fields
✅ **Enums added** - 3 new enums for discharge workflow
✅ **Relations updated** - Connected to admission and checklist
✅ **Service created** - DischargeTransactionService with 6 methods
✅ **Integration updated** - Checklist verification updates discharge
✅ **Controller created** - DischargeTransactionController with 6 REST API endpoints
✅ **Module registration** - Added to InpatientModule providers and controllers
✅ **Care Channel integration** - All discharge state changes post messages to channel
⏳ **Frontend pending** - UI components and services
⏳ **Testing pending** - E2E workflow validation

---

## Summary

The separation of discharge into its own transaction table provides:
- **Clear lifecycle tracking** from planning → ready → approved → executed
- **Rich audit trails** with who/when at each stage
- **Flexible workflows** with optional approval
- **Better data organization** with discharge-specific fields
- **Improved analytics** with duration metrics
- **Scalable design** for future enhancements
- **Real-time care team visibility** via Care Channel integration

The implementation maintains backward compatibility while paving the way for a more robust and maintainable discharge workflow system. All discharge events are now visible in the patient's Care Channel timeline, ensuring the entire care team stays informed throughout the discharge process.
