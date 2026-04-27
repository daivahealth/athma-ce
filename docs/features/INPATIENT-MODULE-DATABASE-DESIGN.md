# Inpatient Module - Database Design

**Version:** 2.2 (InpatientAssessment Rename)
**Service:** Clinical (Clinical workflows only)
**Status:** Implemented
**Last Updated:** January 2026

---

## Table of Contents

- [Overview](#overview)
- [Service Boundaries](#service-boundaries)
- [Integration with Existing Schema](#integration-with-existing-schema)
- [Clinical Workflow Tables](#clinical-workflow-tables)
- [Data Flow](#data-flow)
- [Indexes & Performance](#indexes--performance)
- [API Integration Patterns](#api-integration-patterns)

---

## Overview

The Inpatient Module extends athma-ce's Clinical service to support **hospital admission clinical workflows**, from admission to discharge. It focuses purely on **clinical data and workflows**, while facility infrastructure (wards, rooms, beds) is managed by the Foundation service.

### Key Capabilities

- **Admission Management** - Clinical admission records linked to encounters
- **Bed Assignment Tracking** - History of patient bed assignments and transfers
- **Nursing Care** - Assessments, care plans, rounds, intake/output tracking
- **Discharge Planning** - Discharge readiness checklists and coordination

### Design Principles

1. **Service Separation** - Clinical workflows in Clinical service, infrastructure in Foundation service
2. **Encounter-Centric** - Inpatient admissions link to `Encounter` with `encounterClass = 'IMP'`
3. **Multi-Tenancy** - All tables include `tenant_id` with row-level isolation
4. **Audit Trail** - Track who admitted, assessed, transferred, discharged patients
5. **API Integration** - Resolve ward/room/bed details from Foundation service via API calls

---

## Service Boundaries

### Foundation Service Owns

**Infrastructure & Organizational Data:**
- **Facility** - Hospital locations with geocodes
- **Department** - Organizational departments
- **Ward (IPD)** - Inpatient wards (ICU, Medical, Surgical, Maternity, etc.)
- **Space** - Physical spaces (patient rooms in wards, exam rooms in clinics)
- **Bed** - Individual beds with equipment and availability status
- **Clinic (OPD)** - Outpatient clinics
- **Staff** - Physicians, nurses, care coordinators

**Foundation Hierarchy:**
```
Tenant
 └─ Facility (location & geocodes)
     └─ Department
         ├─ Ward (IPD)
         │   └─ Space (patient rooms)
         │       └─ Bed
         └─ Clinic (OPD)
             └─ Space (exam rooms)
```

**Rationale:** These are organizational master data shared across all modules (outpatient, inpatient, billing, etc.).

### Clinical Service Owns

**Clinical Workflows & Patient Care Data:**
- **InpatientAdmission** - Admission records with current location (ward/bed IDs)
- **BedAssignment** - History of patient bed assignments
- **InpatientAssessment** - Clinical assessments by doctors and nurses (initial assessment, nursing assessments, shift assessments)
- **CarePlan** - Nursing care plans with goals and interventions
- **NursingRound** - Regular patient checks and rounds
- **IntakeOutput** - Fluid intake and output tracking
- **DischargeChecklist** - Discharge readiness tracking

**Rationale:** These are clinical data specific to inpatient care workflows.

---

## Integration with Existing Schema

### Encounter Model Extension

The existing `Encounter` model supports inpatient via:
- `encounterClass = 'IMP'` (Inpatient) vs `'AMB'` (Ambulatory)
- `encounterType` - Can be `'inpatient'`, `'emergency_admission'`, etc.

**Relation added:**
```prisma
model Encounter {
  // ... existing fields ...

  // Inpatient relation (one-to-one)
  inpatientAdmission   InpatientAdmission?
}
```

### Cross-Service References

Clinical service stores **IDs only** for Foundation entities:
- `currentWardId` → Resolve via Foundation API `/v1/wards/:id`
- `currentSpaceId` → Resolve via Foundation API `/v1/spaces/:id`
- `currentBedId` → Resolve via Foundation API `/v1/beds/:id`
- `attendingPhysicianId` → Resolve via Foundation API `/v1/staff/:id`

**No foreign key constraints across databases** (microservices pattern).

---

## Clinical Workflow Tables

### 1. InpatientAdmission

**Purpose:** Core admission record linking to Encounter and tracking current location.

**Schema:**
```prisma
model InpatientAdmission {
  id                      String    @id @default(uuid()) @db.Uuid
  tenantId                String    @map("tenant_id") @db.Uuid
  facilityId              String    @map("facility_id") @db.Uuid

  // Patient & Encounter
  patientId               String    @map("patient_id") @db.Uuid
  encounterId             String    @unique @map("encounter_id") @db.Uuid

  // Admission Details
  admissionNumber         String    @unique @map("admission_number") @db.VarChar(50)
  admissionDate           DateTime  @map("admission_date") @db.Timestamptz(6)
  admissionType           String    @map("admission_type") @db.VarChar(50)
  admissionSource         String    @map("admission_source") @db.VarChar(50)

  // Clinical Team (Foundation Staff IDs)
  attendingPhysicianId    String    @map("attending_physician_id") @db.Uuid
  consultingPhysicians    String[]  @map("consulting_physicians")
  primaryNurseId          String?   @map("primary_nurse_id") @db.Uuid

  // Current Location (Foundation Ward/Space/Bed IDs - resolve via API)
  currentWardId           String?   @map("current_ward_id") @db.Uuid
  currentSpaceId          String?   @map("current_space_id") @db.Uuid  // patient room
  currentBedId            String?   @map("current_bed_id") @db.Uuid

  // Status
  status                  String    @default("admitted") @db.VarChar(20)

  // Discharge Planning
  expectedDischargeDate   DateTime? @map("expected_discharge_date") @db.Date
  actualDischargeDate     DateTime? @map("actual_discharge_date") @db.Timestamptz(6)
  dischargeType           String?   @map("discharge_type") @db.VarChar(50)
  dischargeDestination    String?   @map("discharge_destination") @db.VarChar(100)

  // Insurance & Financial
  insuranceAuthNumber     String?   @map("insurance_auth_number") @db.VarChar(100)
  estimatedCost           Decimal?  @map("estimated_cost") @db.Decimal(12, 2)

  // Audit
  createdAt               DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt               DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
  createdBy               String    @map("created_by") @db.Uuid
  updatedBy               String?   @map("updated_by") @db.Uuid
}
```

**Enums:**
- `admissionType`: elective, emergency, maternity, day_case, transfer
- `admissionSource`: emergency_room, outpatient_dept, transfer_in, direct, physician_referral
- `status`: admitted, transferred, discharged, deceased, absconded
- `dischargeType`: routine, against_medical_advice, transfer, deceased, absconded

**Indexes:**
```prisma
@@index([tenantId, patientId])
@@index([tenantId, facilityId])
@@index([tenantId, admissionDate])
@@index([tenantId, status])
@@index([tenantId, attendingPhysicianId])
@@index([tenantId, currentWardId])
@@index([tenantId, currentBedId])
```

---

### 2. BedAssignment

**Purpose:** Track patient bed assignment history and transfers.

**Schema:**
```prisma
model BedAssignment {
  id                  String    @id @default(uuid()) @db.Uuid
  tenantId            String    @map("tenant_id") @db.Uuid
  admissionId         String    @map("admission_id") @db.Uuid
  patientId           String    @map("patient_id") @db.Uuid

  // Bed Location (Foundation IDs - resolve via API)
  bedId               String    @map("bed_id") @db.Uuid
  wardId              String    @map("ward_id") @db.Uuid
  spaceId             String    @map("space_id") @db.Uuid  // patient room

  // Assignment Period
  assignedAt          DateTime  @map("assigned_at") @db.Timestamptz(6)
  releasedAt          DateTime? @map("released_at") @db.Timestamptz(6)

  // Transfer Tracking
  isTransfer          Boolean   @default(false) @map("is_transfer")
  transferReason      String?   @map("transfer_reason") @db.Text
  transferType        String?   @map("transfer_type") @db.VarChar(50)

  // Audit
  assignedBy          String    @map("assigned_by") @db.Uuid
  releasedBy          String?   @map("released_by") @db.Uuid
  createdAt           DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt           DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
}
```

**Enums:**
- `transferType`: clinical_need, bed_availability, patient_request, infection_control

**Indexes:**
```prisma
@@index([tenantId, admissionId])
@@index([tenantId, patientId])
@@index([tenantId, bedId])
@@index([tenantId, assignedAt])
@@index([tenantId, wardId])
@@index([tenantId, spaceId])
```

---

### 3. InpatientAssessment

**Purpose:** Comprehensive clinical assessments by doctors and nurses with flexible JSONB data. Used for initial assessments (by doctors), nursing assessments, shift assessments, and focused assessments.

**Schema:**
```prisma
model InpatientAssessment {
  id                  String    @id @default(uuid()) @db.Uuid
  tenantId            String    @map("tenant_id") @db.Uuid
  admissionId         String    @map("admission_id") @db.Uuid
  patientId           String    @map("patient_id") @db.Uuid

  // Assessment Details
  assessmentType      String    @map("assessment_type") @db.VarChar(50)
  assessmentDate      DateTime  @map("assessment_date") @db.Timestamptz(6)

  // Vital Signs & Assessment Data
  vitalSigns          Json?     @map("vital_signs") @db.JsonB
  assessmentData      Json      @map("assessment_data") @db.JsonB

  // Clinical Findings
  abnormalFindings    String?   @map("abnormal_findings") @db.Text
  interventions       String?   @db.Text

  // Authorship
  assessedBy          String    @map("assessed_by") @db.Uuid
  reviewedBy          String?   @map("reviewed_by") @db.Uuid

  // Audit
  createdAt           DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt           DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
}
```

**Assessment Types:**
- `initial_assessment` - Initial doctor assessment on admission
- `nursing_admission` - Nursing admission assessment
- `shift` - Shift-based nursing assessment
- `focused` - Focused assessment for specific concerns
- `discharge` - Pre-discharge assessment
- `post_transfer` - Assessment after transfer between units

**Assessment Data Structure:**
```json
{
  "consciousness": "alert",
  "orientation": "oriented_x3",
  "pain_score": 3,
  "pain_location": "lower_back",
  "mobility": "ambulatory",
  "fall_risk_score": 2,
  "skin_integrity": "intact",
  "respiratory": { "pattern": "regular", "oxygen_support": "room_air" },
  "cardiovascular": { "rhythm": "regular" },
  "gastrointestinal": { "appetite": "good", "bowel_sounds": "normal" }
}
```

---

### 4. CarePlan

**Purpose:** Nursing care plans with NANDA diagnoses, goals, and interventions.

**Schema:**
```prisma
model CarePlan {
  id                  String    @id @default(uuid()) @db.Uuid
  tenantId            String    @map("tenant_id") @db.Uuid
  admissionId         String    @map("admission_id") @db.Uuid
  patientId           String    @map("patient_id") @db.Uuid

  // Care Plan Details
  planTitle           String    @map("plan_title") @db.VarChar(200)
  nursingDiagnosis    String    @map("nursing_diagnosis") @db.Text

  // Goals & Interventions (JSONB)
  goals               Json      @db.JsonB
  interventions       Json      @db.JsonB

  // Priority & Status
  priority            Int       @default(2)  // 1=high, 2=medium, 3=low
  status              String    @default("active") @db.VarChar(20)

  // Dates
  startDate           DateTime  @map("start_date") @db.Date
  targetDate          DateTime? @map("target_date") @db.Date
  endDate             DateTime? @map("end_date") @db.Date

  // Evaluation
  evaluation          String?   @db.Text
  outcomeStatus       String?   @map("outcome_status") @db.VarChar(50)

  // Audit
  createdBy           String    @map("created_by") @db.Uuid
  updatedBy           String?   @map("updated_by") @db.Uuid
  createdAt           DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt           DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
}
```

**Goals Structure:**
```json
[
  {
    "goal": "Patient will ambulate 50 feet without assistance",
    "target_date": "2026-01-10",
    "status": "in_progress"
  }
]
```

**Interventions Structure:**
```json
[
  {
    "intervention": "Assist with ambulation twice daily",
    "frequency": "BID",
    "status": "active"
  }
]
```

---

### 5. NursingRound

**Purpose:** Regular patient checks and rounds documentation.

**Schema:**
```prisma
model NursingRound {
  id                  String    @id @default(uuid()) @db.Uuid
  tenantId            String    @map("tenant_id") @db.Uuid
  admissionId         String    @map("admission_id") @db.Uuid
  patientId           String    @map("patient_id") @db.Uuid

  // Round Details
  roundType           String    @map("round_type") @db.VarChar(50)
  roundDate           DateTime  @map("round_date") @db.Timestamptz(6)
  shiftType           String?   @map("shift_type") @db.VarChar(20)

  // Checklist Data (JSONB)
  checklistData       Json      @map("checklist_data") @db.JsonB

  // Findings
  findings            String?   @db.Text
  issuesIdentified    String?   @map("issues_identified") @db.Text
  actionsPerformed    String?   @map("actions_performed") @db.Text

  // Authorship
  performedBy         String    @map("performed_by") @db.Uuid

  // Audit
  createdAt           DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt           DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
}
```

**Enums:**
- `roundType`: hourly, medication, comfort, safety, physician, multidisciplinary
- `shiftType`: morning, afternoon, night

---

### 6. IntakeOutput

**Purpose:** Fluid intake and output tracking for critically ill patients.

**Schema:**
```prisma
model IntakeOutput {
  id                  String    @id @default(uuid()) @db.Uuid
  tenantId            String    @map("tenant_id") @db.Uuid
  admissionId         String    @map("admission_id") @db.Uuid
  patientId           String    @map("patient_id") @db.Uuid

  // Record Details
  recordDate          DateTime  @map("record_date") @db.Timestamptz(6)
  recordType          String    @map("record_type") @db.VarChar(10)
  shiftType           String?   @map("shift_type") @db.VarChar(20)

  // Intake Details
  intakeType          String?   @map("intake_type") @db.VarChar(50)
  intakeAmount        Decimal?  @map("intake_amount") @db.Decimal(8, 2)
  intakeDescription   String?   @map("intake_description") @db.VarChar(200)

  // Output Details
  outputType          String?   @map("output_type") @db.VarChar(50)
  outputAmount        Decimal?  @map("output_amount") @db.Decimal(8, 2)
  outputDescription   String?   @map("output_description") @db.VarChar(200)

  // Audit
  recordedBy          String    @map("recorded_by") @db.Uuid
  createdAt           DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt           DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
}
```

**Enums:**
- `recordType`: intake, output
- `intakeType`: oral, iv, feeding_tube, blood_transfusion, tpn
- `outputType`: urine, stool, vomit, drainage, blood_loss, perspiration

---

### 7. DischargeChecklist

**Purpose:** Track discharge readiness across multiple dimensions.

**Schema:**
```prisma
model DischargeChecklist {
  id                          String    @id @default(uuid()) @db.Uuid
  tenantId                    String    @map("tenant_id") @db.Uuid
  admissionId                 String    @unique @map("admission_id") @db.Uuid
  patientId                   String    @map("patient_id") @db.Uuid

  // Medical Clearance
  medicalClearance            Boolean   @default(false) @map("medical_clearance")
  medicalClearedBy            String?   @map("medical_cleared_by") @db.Uuid
  medicalClearedAt            DateTime? @map("medical_cleared_at") @db.Timestamptz(6)

  // Medications
  medicationsReconciled       Boolean   @default(false) @map("medications_reconciled")
  dischargePrescriptionsIssued Boolean  @default(false) @map("discharge_prescriptions_issued")

  // Follow-up Care
  followUpAppointmentScheduled Boolean  @default(false) @map("follow_up_appointment_scheduled")
  followUpAppointmentDate     DateTime? @map("follow_up_appointment_date") @db.Timestamptz(6)
  followUpPhysician           String?   @map("follow_up_physician") @db.Uuid

  // Patient Education
  dischargInstructionsProvided Boolean  @default(false) @map("discharge_instructions_provided")
  patientEducationCompleted   Boolean   @default(false) @map("patient_education_completed")
  educationTopics             String[]  @map("education_topics")

  // Equipment & Supplies
  dmeOrdered                  Boolean   @default(false) @map("dme_ordered")
  dmeDescription              String?   @map("dme_description") @db.Text
  homeHealthOrdered           Boolean   @default(false) @map("home_health_ordered")
  homeHealthAgency            String?   @map("home_health_agency") @db.VarChar(200)

  // Transportation
  transportationArranged      Boolean   @default(false) @map("transportation_arranged")
  transportationMode          String?   @map("transportation_mode") @db.VarChar(100)

  // Administrative
  billingCleared              Boolean   @default(false) @map("billing_cleared")
  insuranceNotified           Boolean   @default(false) @map("insurance_notified")
  medicalRecordsCompleted     Boolean   @default(false) @map("medical_records_completed")

  // Overall Status
  readyForDischarge           Boolean   @default(false) @map("ready_for_discharge")
  dischargeCoordinator        String?   @map("discharge_coordinator") @db.Uuid

  // Audit
  createdAt                   DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt                   DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
  createdBy                   String    @map("created_by") @db.Uuid
  updatedBy                   String?   @map("updated_by") @db.Uuid
}
```

---

## Data Flow

### 1. Admission Workflow

```
1. Patient arrives → Create Encounter (encounterClass = 'IMP')
2. Create InpatientAdmission record
3. Assign bed via Foundation API → Create BedAssignment
4. Update InpatientAdmission.currentBedId
5. Doctor performs initial assessment → Create InpatientAssessment (type='initial_assessment')
6. Nurse performs admission assessment → Create InpatientAssessment (type='nursing_admission')
7. Create initial care plans → Create CarePlan
```

### 2. Transfer Workflow

```
1. Release current bed → Update BedAssignment.releasedAt
2. Assign new bed via Foundation API → Create new BedAssignment with isTransfer=true
3. Update InpatientAdmission.currentWardId and currentBedId
4. Perform post-transfer assessment → Create InpatientAssessment (type='post_transfer')
```

### 3. Discharge Workflow

```
1. Complete DischargeChecklist items
2. Set DischargeChecklist.readyForDischarge = true
3. Update InpatientAdmission:
   - status = 'discharged'
   - actualDischargeDate
   - dischargeType
4. Release bed → Update BedAssignment.releasedAt
5. End Encounter → Update Encounter.endTime
6. Trigger PRM event → Send discharge follow-up reminders
```

---

## Indexes & Performance

### High-Traffic Queries

**1. Ward Census (Get all current admissions by ward)**
```sql
-- Uses idx_admissions_tenant_ward
SELECT * FROM inpatient_admissions
WHERE tenant_id = ? AND current_ward_id = ? AND status = 'admitted';
```

**2. Physician Patient List**
```sql
-- Uses idx_admissions_tenant_physician
SELECT * FROM inpatient_admissions
WHERE tenant_id = ? AND attending_physician_id = ? AND status = 'admitted';
```

**3. Bed Assignment History**
```sql
-- Uses idx_bed_assignments_tenant_bed
SELECT * FROM bed_assignments
WHERE tenant_id = ? AND bed_id = ?
ORDER BY assigned_at DESC;
```

**4. Pending Discharge Checklists**
```sql
-- Uses idx_discharge_checklist_tenant_ready
SELECT * FROM discharge_checklists
WHERE tenant_id = ? AND ready_for_discharge = false;
```

---

## API Integration Patterns

### Cross-Service Data Resolution

**Pattern 1: Resolve Ward/Space/Bed Details**

```typescript
// Clinical Service
const admission = await prisma.inpatientAdmission.findUnique({
  where: { id: admissionId }
});

// Resolve details from Foundation API
const [ward, space, bed] = await Promise.all([
  foundationApi.get(`/v1/wards/${admission.currentWardId}`),
  foundationApi.get(`/v1/spaces/${admission.currentSpaceId}`),
  foundationApi.get(`/v1/beds/${admission.currentBedId}`)
]);

// Return enriched data
return {
  ...admission,
  ward,   // Ward name, type, capacity
  space,  // Room number, amenities
  bed     // Bed number, type, equipment
};
```

**Pattern 2: Check Bed Availability Before Assignment**

```typescript
// Call Foundation API to check bed availability
const availableBeds = await foundationApi.get('/v1/beds/available', {
  params: {
    tenantId,
    wardId,
    bedType: 'icu'
  }
});

// Assign bed
const assignment = await prisma.bedAssignment.create({
  data: {
    admissionId,
    patientId,
    bedId: availableBeds[0].id,
    wardId: availableBeds[0].wardId,
    spaceId: availableBeds[0].spaceId,  // patient room
    assignedAt: new Date(),
    assignedBy: userId
  }
});

// Update bed status in Foundation (via API)
await foundationApi.patch(`/v1/beds/${availableBeds[0].id}`, {
  status: 'occupied',
  currentPatientId: patientId,
  currentAdmissionId: admissionId,
  occupiedSince: new Date()
});
```

**Pattern 3: Aggregate Ward Census**

```typescript
// Get all admissions for a ward
const admissions = await prisma.inpatientAdmission.findMany({
  where: {
    tenantId,
    currentWardId: wardId,
    status: 'admitted'
  }
});

// Enrich with patient and staff details (from Foundation)
const enriched = await Promise.all(
  admissions.map(async (admission) => ({
    ...admission,
    patient: await foundationApi.get(`/v1/patients/${admission.patientId}`),
    attendingPhysician: await foundationApi.get(`/v1/staff/${admission.attendingPhysicianId}`),
    bed: await foundationApi.get(`/v1/beds/${admission.currentBedId}`)
  }))
);

return enriched;
```

---

## Implementation Status

### ✅ Completed

1. **Schema Design** - All 7 clinical workflow tables designed
2. **Prisma Schema** - Implemented in `backend/shared/database-clinical/prisma/schema.prisma`
3. **Database Migration** - Tables created in `zeal_clinical` database
4. **Service Separation** - Ward/Room/Bed removed from Clinical, belong to Foundation

### 🔲 Next Steps

1. **Foundation API** - Ensure Ward, Space, Bed APIs are available (already exists in Foundation)
2. **Clinical API** - Create NestJS controllers and services for inpatient workflows
3. **API Integration** - Implement cross-service resolution patterns
4. **Seed Data** - Create sample wards, spaces (patient rooms), beds for testing
5. **Frontend** - Build admission, bed management, nursing workflow UIs

---

## Summary

The Inpatient Module follows athma-ce's microservices architecture:

- **Foundation Service** - Owns facility infrastructure (Facility → Department → Ward → Space → Bed) and Staff
- **Clinical Service** - Owns clinical workflows (admissions, assessments, care plans, discharge)
- **RCM Service** - Receives bed charges and clinical services for billing
- **PRM Service** - Receives discharge events for follow-up coordination

**Key Design:**
- Foundation hierarchy: `Facility → Department → Ward → Space (patient rooms) → Bed`
- Clinical service stores IDs only (`wardId`, `spaceId`, `bedId`) and resolves via Foundation API
- Space entity is unified for both IPD (patient rooms) and OPD (exam rooms)
- All tables are multi-tenant, audited, and optimized for high-traffic queries
- Cross-service communication uses REST APIs without database-level foreign key constraints

---

**Database:** `zeal_clinical`
**Tables Added:** 8 (InpatientAdmission, BedAssignment, InpatientAssessment, CarePlan, NursingRound, IntakeOutput, DischargeChecklist, InpatientEvent)
**Version:** 2.2 (Renamed NursingAssessment to InpatientAssessment for doctor and nurse assessments)
**Last Updated:** January 2026
