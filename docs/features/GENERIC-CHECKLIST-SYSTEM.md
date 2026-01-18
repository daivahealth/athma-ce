# Generic Clinical Checklist System - Design Document

## Overview

A flexible, template-based checklist system that can be used across multiple clinical workflows (discharge, surgery, outpatient visits, etc.) with dynamic field definitions and role-based completion tracking.

## User Decision Summary
- ✅ Generic checklist templates (not hardcoded)
- ✅ Part of Clinical Master Catalogs
- ✅ Support multiple categories (Discharge, Surgery, Pre-op, Post-op, Outpatient, etc.)
- ✅ Can be filled by Nurses, Doctors, and other staff
- ✅ Integration with Care Channels (inpatient)
- ✅ Support for Outpatient scenarios

---

## Architecture Components

### 1. Checklist Templates (Master Catalog)
**Purpose**: Define reusable checklist templates that can be instantiated for specific patients/encounters

### 2. Checklist Instances (Runtime)
**Purpose**: Actual checklists created from templates and filled out by clinical staff

### 3. Integration Layer
**Purpose**: Connect checklists to encounters, admissions, Care Channels, and clinical workflows

---

## Database Schema

### Core Models

```prisma
// ============================================================================
// CHECKLIST TEMPLATES (Master Catalog)
// ============================================================================

/// Checklist template categories
enum ChecklistCategory {
  DISCHARGE              // Patient discharge planning
  SURGERY                // Surgical procedures
  PRE_OPERATIVE          // Pre-op assessment
  POST_OPERATIVE         // Post-op recovery
  ADMISSION              // Admission intake
  TRANSFER               // Inter-facility transfer
  OUTPATIENT_VISIT       // Outpatient appointment
  PROCEDURE              // General procedures
  EMERGENCY              // Emergency department
  ANESTHESIA             // Anesthesia checklist
  INFECTION_CONTROL      // Infection prevention
  FALL_PREVENTION        // Fall risk assessment
  PAIN_MANAGEMENT        // Pain assessment
  WOUND_CARE             // Wound management
  CUSTOM                 // Tenant-defined custom type
}

/// Status of checklist template
enum ChecklistTemplateStatus {
  DRAFT                  // Being created/edited
  ACTIVE                 // Available for use
  DEPRECATED             // Old version, no longer recommended
  ARCHIVED               // No longer in use
}

/// Checklist template definition (Master)
model ChecklistTemplate {
  id                  String                    @id @default(uuid()) @db.Uuid
  tenantId            String                    @db.Uuid
  facilityId          String?                   @db.Uuid  // Optional: facility-specific template

  // Template Identification
  code                String                    @db.VarChar(50)   // e.g., "DISCHARGE_V2", "PRE_OP_CARDIAC"
  name                String                    @db.VarChar(255)  // e.g., "Standard Discharge Checklist"
  description         String?                   @db.Text
  category            ChecklistCategory

  // Template Metadata
  version             Int                       @default(1)       // Version number for template evolution
  status              ChecklistTemplateStatus   @default(DRAFT)

  // Applicability Rules (JSON)
  applicableToInpatient     Boolean             @default(true)
  applicableToOutpatient    Boolean             @default(true)
  applicableEncounterTypes  String[]            // e.g., ["inpatient_admission", "outpatient_visit"]
  applicableDepartments     String[]            // e.g., ["cardiology", "surgery"]

  // Completion Rules
  requiresAllItems          Boolean             @default(false)  // Must all items be completed?
  minimumCompletionPercent  Int?                                 // e.g., 80 for 80% required

  // Approval Workflow (Configurable)
  requiresVerification      Boolean             @default(false)  // Does this checklist need supervisor verification?
  verificationRoles         String[]            // Who can verify? e.g., ["PHYSICIAN", "CHARGE_NURSE"]
  allowSelfVerification     Boolean             @default(false)  // Can completer verify their own checklist?

  // Auto-Creation Rules (Configurable)
  autoCreateEnabled         Boolean             @default(false)  // Should this checklist auto-create?
  autoCreateOn              String[]            // Triggers: ["admission_created", "pre_surgery", "encounter_checkin"]
  autoCreateConditions      Json?               @db.JsonB        // Optional conditions: {"admissionType": "elective", "department": "cardiology"}
  autoCreateDueHours        Int?                                 // Due X hours after creation (e.g., 24)

  // Permissions (who can complete this checklist)
  allowedRoles              String[]            // e.g., ["NURSE", "PHYSICIAN", "THERAPIST"]

  // Metadata
  estimatedMinutes          Int?                // Estimated time to complete

  // Relationships
  items               ChecklistTemplateItem[]
  instances           ChecklistInstance[]

  // Audit
  createdAt           DateTime                  @default(now()) @db.Timestamptz(6)
  updatedAt           DateTime                  @updatedAt @db.Timestamptz(6)
  createdBy           String                    @db.Uuid
  updatedBy           String?                   @db.Uuid

  @@unique([tenantId, code, version])
  @@index([tenantId, category, status])
  @@index([tenantId, facilityId, status])
  @@map("checklist_template")
}

// ============================================================================
// CHECKLIST TEMPLATE ITEMS (Template Fields)
// ============================================================================

/// Field type for checklist items
enum ChecklistItemType {
  BOOLEAN               // Yes/No checkbox
  TEXT                  // Free text input
  TEXT_AREA             // Multi-line text
  DATE                  // Date picker
  DATETIME              // Date + time picker
  TIME                  // Time picker
  NUMBER                // Numeric input
  SELECT_SINGLE         // Dropdown (single choice)
  SELECT_MULTIPLE       // Multi-select dropdown
  STAFF_SELECTOR        // Choose a staff member
  SECTION_HEADER        // Just a header/divider
  FILE_UPLOAD           // Attach document/image
}

/// Individual item/question in a checklist template
model ChecklistTemplateItem {
  id                  String                    @id @default(uuid()) @db.Uuid
  tenantId            String                    @db.Uuid
  templateId          String                    @db.Uuid

  // Item Definition
  code                String                    @db.VarChar(100)  // e.g., "medical_clearance", "medications_reconciled"
  label               String                    @db.VarChar(500)  // Question/label text
  description         String?                   @db.Text          // Help text
  itemType            ChecklistItemType

  // Display Order
  sectionName         String?                   @db.VarChar(100)  // e.g., "Medical Clearance", "Medications"
  displayOrder        Int                                         // Order within template

  // Validation Rules
  isRequired          Boolean                   @default(false)
  defaultValue        String?                   @db.Text          // Default value (JSON)

  // Options (for SELECT types)
  options             Json?                     @db.JsonB         // e.g., [{"value": "home", "label": "Home"}]

  // Conditional Logic (show/hide based on other fields)
  showIf              Json?                     @db.JsonB         // e.g., {"itemCode": "medical_clearance", "equals": true}

  // Additional Metadata
  metadata            Json?                     @db.JsonB         // Custom attributes

  // Relationships
  template            ChecklistTemplate         @relation(fields: [templateId], references: [id], onDelete: Cascade)
  responses           ChecklistInstanceResponse[]

  // Audit
  createdAt           DateTime                  @default(now()) @db.Timestamptz(6)
  updatedAt           DateTime                  @updatedAt @db.Timestamptz(6)

  @@unique([templateId, code])
  @@index([tenantId, templateId, displayOrder])
  @@map("checklist_template_item")
}

// ============================================================================
// CHECKLIST INSTANCES (Runtime/Filled Checklists)
// ============================================================================

/// Status of checklist instance
enum ChecklistInstanceStatus {
  NOT_STARTED           // Created but not yet filled
  IN_PROGRESS           // Partially completed
  COMPLETED             // All required items filled
  VERIFIED              // Reviewed and verified by supervisor
  CANCELLED             // Checklist cancelled/voided
}

/// Context where checklist is being used
enum ChecklistContext {
  INPATIENT_ADMISSION   // Linked to inpatient admission
  OUTPATIENT_ENCOUNTER  // Linked to outpatient encounter
  STANDALONE            // Not linked to specific encounter
  CARE_CHANNEL          // Part of care channel workflow
}

/// Instance of a checklist (actual checklist being filled)
model ChecklistInstance {
  id                  String                    @id @default(uuid()) @db.Uuid
  tenantId            String                    @db.Uuid
  facilityId          String                    @db.Uuid

  // Template Reference
  templateId          String                    @db.Uuid
  templateVersion     Int                       // Snapshot of version when created
  templateName        String                    @db.VarChar(255)  // Snapshot for reporting
  templateCategory    ChecklistCategory                           // Snapshot

  // Context
  context             ChecklistContext

  // Linkages (at least one should be set based on context)
  patientId           String                    @db.Uuid
  encounterId         String?                   @db.Uuid          // Link to encounter (inpatient or outpatient)
  admissionId         String?                   @db.Uuid          // Link to inpatient admission
  careChannelId       String?                   @db.Uuid          // Link to care channel

  // Status Tracking
  status              ChecklistInstanceStatus   @default(NOT_STARTED)
  completionPercent   Int                       @default(0)       // 0-100

  // Completion Tracking
  startedAt           DateTime?                 @db.Timestamptz(6)
  startedBy           String?                   @db.Uuid
  completedAt         DateTime?                 @db.Timestamptz(6)
  completedBy         String?                   @db.Uuid
  verifiedAt          DateTime?                 @db.Timestamptz(6)
  verifiedBy          String?                   @db.Uuid

  // Due Date (optional)
  dueAt               DateTime?                 @db.Timestamptz(6)

  // Notes
  notes               String?                   @db.Text

  // Relationships
  template            ChecklistTemplate         @relation(fields: [templateId], references: [id])
  responses           ChecklistInstanceResponse[]

  // Audit
  createdAt           DateTime                  @default(now()) @db.Timestamptz(6)
  updatedAt           DateTime                  @updatedAt @db.Timestamptz(6)
  createdBy           String                    @db.Uuid
  updatedBy           String?                   @db.Uuid

  @@index([tenantId, patientId, status])
  @@index([tenantId, encounterId])
  @@index([tenantId, admissionId])
  @@index([tenantId, careChannelId])
  @@index([tenantId, templateId])
  @@index([tenantId, status, dueAt])
  @@map("checklist_instance")
}

// ============================================================================
// CHECKLIST RESPONSES (Answers to Items)
// ============================================================================

/// Individual response to a checklist item
model ChecklistInstanceResponse {
  id                  String                    @id @default(uuid()) @db.Uuid
  tenantId            String                    @db.Uuid

  // Linkage
  instanceId          String                    @db.Uuid
  templateItemId      String                    @db.Uuid

  // Response Data (stored as JSON for flexibility)
  valueBoolean        Boolean?                                    // For BOOLEAN type
  valueText           String?                   @db.Text          // For TEXT/TEXT_AREA
  valueNumber         Float?                                      // For NUMBER type
  valueDate           DateTime?                 @db.Timestamptz(6)  // For DATE/DATETIME/TIME
  valueJson           Json?                     @db.JsonB         // For complex types (SELECT_MULTIPLE, FILE_UPLOAD)
  valueStaffId        String?                   @db.Uuid          // For STAFF_SELECTOR

  // Metadata
  respondedBy         String?                   @db.Uuid          // Who answered this item
  respondedAt         DateTime?                 @db.Timestamptz(6)

  // Relationships
  instance            ChecklistInstance         @relation(fields: [instanceId], references: [id], onDelete: Cascade)
  templateItem        ChecklistTemplateItem     @relation(fields: [templateItemId], references: [id])

  // Audit
  createdAt           DateTime                  @default(now()) @db.Timestamptz(6)
  updatedAt           DateTime                  @updatedAt @db.Timestamptz(6)

  @@unique([instanceId, templateItemId])
  @@index([tenantId, instanceId])
  @@map("checklist_instance_response")
}
```

---

## Service Architecture

### 1. ChecklistTemplateService
**Location**: `/backend/services/clinical/src/modules/checklist/template.service.ts`

**Responsibilities**:
- CRUD operations for checklist templates
- Template versioning
- Template cloning/duplication
- Template search and filtering

**Key Methods**:
```typescript
createTemplate(dto: CreateTemplateDto, context)
updateTemplate(templateId: string, dto: UpdateTemplateDto, context)
getTemplate(templateId: string, tenantId: string)
searchTemplates(filters: TemplateSearchDto, tenantId: string)
activateTemplate(templateId: string, context)
archiveTemplate(templateId: string, context)
cloneTemplate(templateId: string, newCode: string, context)
```

### 2. ChecklistTemplateItemService
**Location**: `/backend/services/clinical/src/modules/checklist/template-item.service.ts`

**Responsibilities**:
- Manage template items (add, update, delete, reorder)
- Validate item configurations
- Handle conditional logic

**Key Methods**:
```typescript
addItem(templateId: string, dto: AddItemDto, context)
updateItem(itemId: string, dto: UpdateItemDto, context)
deleteItem(itemId: string, context)
reorderItems(templateId: string, itemOrder: string[], context)
validateItemLogic(item: ChecklistTemplateItem)
```

### 3. ChecklistInstanceService
**Location**: `/backend/services/clinical/src/modules/checklist/instance.service.ts`

**Responsibilities**:
- Create checklist instances from templates
- Track completion status
- Calculate completion percentage
- Handle checklist lifecycle

**Key Methods**:
```typescript
createInstance(dto: CreateInstanceDto, context)
getInstanceById(instanceId: string, tenantId: string)
getInstancesForAdmission(admissionId: string, tenantId: string)
getInstancesForEncounter(encounterId: string, tenantId: string)
updateInstanceStatus(instanceId: string, status: ChecklistInstanceStatus, context)
calculateCompletion(instanceId: string)
completeInstance(instanceId: string, context)
verifyInstance(instanceId: string, context)
```

### 4. ChecklistResponseService
**Location**: `/backend/services/clinical/src/modules/checklist/response.service.ts`

**Responsibilities**:
- Save/update individual item responses
- Validate responses against template rules
- Track who answered what and when

**Key Methods**:
```typescript
saveResponse(instanceId: string, itemId: string, dto: SaveResponseDto, context)
saveMultipleResponses(instanceId: string, responses: SaveResponseDto[], context)
getResponses(instanceId: string, tenantId: string)
validateResponse(response: any, templateItem: ChecklistTemplateItem)
```

### 5. ChecklistIntegrationService
**Location**: `/backend/services/clinical/src/modules/checklist/integration.service.ts`

**Responsibilities**:
- Auto-create checklists based on triggers (e.g., on admission)
- Post checklist completion messages to Care Channels
- Emit events when checklists are completed
- Handle verification workflow

**Key Methods**:
```typescript
// Auto-creation based on template configuration
async autoCreateChecklistsForAdmission(admissionId: string, context) {
  // Find all templates with autoCreateEnabled=true AND autoCreateOn includes "admission_created"
  const templates = await this.templateService.findAutoCreateTemplates({
    trigger: 'admission_created',
    context: 'inpatient',
    tenantId: context.tenantId,
  });

  for (const template of templates) {
    // Check if conditions match (if specified)
    if (template.autoCreateConditions) {
      const admission = await this.getAdmission(admissionId);
      const conditionsMet = this.evaluateConditions(admission, template.autoCreateConditions);
      if (!conditionsMet) continue;
    }

    // Create instance
    const dueAt = template.autoCreateDueHours
      ? addHours(new Date(), template.autoCreateDueHours)
      : null;

    await this.instanceService.createInstance({
      templateId: template.id,
      patientId: admission.patientId,
      admissionId: admission.id,
      encounterId: admission.encounterId,
      context: ChecklistContext.INPATIENT_ADMISSION,
      dueAt,
    }, context);
  }
}

async completeInstance(instanceId: string, context) {
  const instance = await this.instanceService.getInstanceById(instanceId, context.tenantId);
  const template = await this.templateService.getTemplate(instance.templateId, context.tenantId);

  // Check completion requirements
  const completionPercent = await this.instanceService.calculateCompletion(instanceId);

  if (template.minimumCompletionPercent && completionPercent < template.minimumCompletionPercent) {
    throw new BadRequestException(
      `Checklist must be at least ${template.minimumCompletionPercent}% complete`
    );
  }

  // Update status
  await this.instanceService.updateInstanceStatus(
    instanceId,
    ChecklistInstanceStatus.COMPLETED,
    context
  );

  // If requires verification, notify verifiers
  if (template.requiresVerification) {
    await this.notifyVerifiers(instance, template, context);
  }

  // Post to channel if linked
  if (instance.careChannelId) {
    await this.postCompletionToChannel(instanceId, context);
  }
}

async verifyInstance(instanceId: string, context) {
  const instance = await this.instanceService.getInstanceById(instanceId, context.tenantId);
  const template = await this.templateService.getTemplate(instance.templateId, context.tenantId);

  // Check if template requires verification
  if (!template.requiresVerification) {
    throw new BadRequestException('This checklist does not require verification');
  }

  // Check if user has verification role
  const userHasRole = this.checkUserRole(context.userRoles, template.verificationRoles);
  if (!userHasRole) {
    throw new ForbiddenException('You do not have permission to verify this checklist');
  }

  // Check self-verification rule
  if (!template.allowSelfVerification && instance.completedBy === context.userId) {
    throw new BadRequestException('You cannot verify your own checklist');
  }

  // Mark as verified
  await this.instanceService.updateInstanceStatus(
    instanceId,
    ChecklistInstanceStatus.VERIFIED,
    context
  );

  // Post verification to channel
  if (instance.careChannelId) {
    await this.postVerificationToChannel(instanceId, context);
  }
}

postCompletionToChannel(instanceId: string, context)
postVerificationToChannel(instanceId: string, context)
emitChecklistCompletedEvent(instanceId: string, context)
notifyVerifiers(instance: ChecklistInstance, template: ChecklistTemplate, context)
evaluateConditions(data: any, conditions: Json): boolean
```

---

## API Endpoints

### Template Management (Admin/Configuration)

```
POST   /api/v1/clinical/checklist-templates
GET    /api/v1/clinical/checklist-templates
GET    /api/v1/clinical/checklist-templates/:id
PATCH  /api/v1/clinical/checklist-templates/:id
DELETE /api/v1/clinical/checklist-templates/:id
POST   /api/v1/clinical/checklist-templates/:id/activate
POST   /api/v1/clinical/checklist-templates/:id/archive
POST   /api/v1/clinical/checklist-templates/:id/clone

POST   /api/v1/clinical/checklist-templates/:id/items
PATCH  /api/v1/clinical/checklist-template-items/:itemId
DELETE /api/v1/clinical/checklist-template-items/:itemId
POST   /api/v1/clinical/checklist-templates/:id/items/reorder
```

### Instance Management (Clinical Workflows)

```
POST   /api/v1/clinical/checklist-instances                    # Create new instance
GET    /api/v1/clinical/checklist-instances/:id                # Get instance with responses
PATCH  /api/v1/clinical/checklist-instances/:id/status         # Update status
POST   /api/v1/clinical/checklist-instances/:id/complete       # Mark complete
POST   /api/v1/clinical/checklist-instances/:id/verify         # Verify checklist

POST   /api/v1/clinical/checklist-instances/:id/responses      # Save single response
POST   /api/v1/clinical/checklist-instances/:id/responses/bulk # Save multiple responses
GET    /api/v1/clinical/checklist-instances/:id/responses      # Get all responses

# Context-specific endpoints
GET    /api/v1/inpatient/admissions/:id/checklists             # Get checklists for admission
GET    /api/v1/encounters/:id/checklists                       # Get checklists for encounter
POST   /api/v1/inpatient/admissions/:id/checklists             # Create checklist for admission
```

---

## Frontend Components

### 1. Template Builder (Admin)
**Location**: `/frontend/src/modules/clinical/components/checklist/TemplateBuilder.tsx`

**Features**:
- Visual template designer
- Drag-and-drop item ordering
- Field type selection
- Conditional logic builder
- Preview mode

### 2. Checklist Form (Clinical)
**Location**: `/frontend/src/modules/clinical/components/checklist/ChecklistForm.tsx`

**Features**:
- Render checklist based on template
- Dynamic field rendering based on item types
- Conditional visibility
- Progress indicator
- Auto-save
- Section grouping with accordions

### 3. Checklist List (Clinical)
**Location**: `/frontend/src/modules/clinical/components/checklist/ChecklistList.tsx`

**Features**:
- Show all checklists for patient/encounter
- Status badges (Not Started, In Progress, Completed)
- Quick actions (View, Continue, Verify)
- Filter by category

### 4. Checklist Summary (Reports)
**Location**: `/frontend/src/modules/clinical/components/checklist/ChecklistSummary.tsx`

**Features**:
- Read-only view of completed checklist
- Show who completed what and when
- Export to PDF
- Audit trail

---

## Integration with Existing Systems

### 1. Replace Current Discharge Checklist

**Migration Strategy**:

1. **Create Discharge Template**:
   - Seed a `ChecklistTemplate` with category `DISCHARGE`
   - **Configure trigger**: `autoCreateOn: ["discharge_planning_initiated"]`
   - **Configure verification**: `requiresVerification: true, verificationRoles: ["PHYSICIAN", "CHARGE_NURSE"]`
   - Add all current discharge checklist fields as `ChecklistTemplateItem`s
   - Map field types (e.g., `medicalClearance` → `BOOLEAN`)

2. **Integration with Discharge Service** (Backend):

   Update `DischargeService.updateDischargeChecklist()`:
   ```typescript
   // After line 152 in discharge.service.ts
   if (newDischargeStatus === InpatientDischargeStatus.INITIATED) {
     // Trigger checklist auto-creation
     await this.checklistIntegrationService.autoCreateChecklists(
       admissionId,
       'discharge_planning_initiated',
       context
     );

     this.logger.log(`Discharge checklist auto-created for admission ${admissionId}`);
   }
   ```

3. **Frontend Integration**:

   **Admission Detail Page** (`/admissions/[id]/page.tsx`):
   ```typescript
   // When user clicks "Start Discharge Planning"
   const handleStartDischargePlanning = async () => {
     // This will trigger discharge status NONE → INITIATED
     // Which in turn auto-creates the checklist
     await updateDischargeChecklist(admissionId, {});

     // Redirect to checklist
     router.push(`/admissions/${admissionId}/checklists`);
   };
   ```

   **New Checklists Tab**:
   - Show all checklists for admission (discharge, assessments, etc.)
   - Status badges for each checklist
   - Progress indicators

4. **Auto-migrate on GET**:
   - When GET `/admissions/:id/checklists` is called:
     - If old `DischargeChecklist` exists, create `ChecklistInstance` + responses from it
     - Return new format
     - Mark old record as migrated

5. **Deprecate old endpoint**:
   - Keep old PATCH endpoint working temporarily
   - Update frontend to use new generic endpoints
   - Remove old schema after migration complete

### 2. Care Channel Integration

**Post to Channel on Key Events**:

```typescript
// 1. When discharge planning is initiated (checklist auto-created)
await channelEventEmitter.emitChecklistCreated(
  instanceId,
  channelId,
  {
    checklistName: "Discharge Checklist",
    category: "DISCHARGE",
    dueAt: "2026-01-20 14:00"
  },
  tx,
  context
);

// 2. When checklist is completed (by nurse)
await channelEventEmitter.emitChecklistCompleted(
  instanceId,
  channelId,
  {
    checklistName: "Discharge Checklist",
    completedBy: staffName,
    completionPercent: 100
  },
  tx,
  context
);

// 3. When checklist is verified (by doctor)
await channelEventEmitter.emitChecklistVerified(
  instanceId,
  channelId,
  {
    checklistName: "Discharge Checklist",
    verifiedBy: doctorName,
    verificationRole: "PHYSICIAN"
  },
  tx,
  context
);
```

**Channel Message Examples**:
```
[SYSTEM] Discharge Checklist created - Due: Jan 20, 2:00 PM
Staff can begin completing discharge planning items.

[SYSTEM] Discharge Checklist completed by Nurse Sarah (100%)
Awaiting physician verification.

[SYSTEM] Discharge Checklist verified by Dr. Ahmed
Patient ready for discharge.
```

**Implementation**:
- Checklist completion/verification automatically updates admission `dischargeStatus`
- When checklist is verified → Admission status changes to READY
- Frontend shows "Complete Discharge" button only when status = READY

### 3. Outpatient Integration

**Trigger on Outpatient Encounter**:
```typescript
// When outpatient appointment is checked in
const encounterType = "outpatient_visit";
const applicableTemplates = await checklistTemplateService.findApplicableTemplates({
  encounterType,
  department: "cardiology",
  facilityId,
  tenantId
});

for (const template of applicableTemplates) {
  await checklistInstanceService.createInstance({
    templateId: template.id,
    patientId,
    encounterId,
    context: ChecklistContext.OUTPATIENT_ENCOUNTER
  }, context);
}
```

---

## Example Use Cases

### Use Case 1: Discharge Checklist (Current)
**Template**: `DISCHARGE_V2`

**Configuration**:
```json
{
  "requiresVerification": true,
  "verificationRoles": ["PHYSICIAN", "CHARGE_NURSE"],
  "allowSelfVerification": false,
  "autoCreateEnabled": true,
  "autoCreateOn": ["discharge_planning_initiated"],
  "autoCreateDueHours": 48
}
```

**Workflow**:
1. **Staff clicks "Start Discharge Planning"** → Triggers discharge status change to INITIATED
2. **Checklist auto-created** (due in 48 hours from discharge planning start)
3. Nurse completes checklist → Status: COMPLETED
4. Doctor/Charge Nurse verifies → Status: VERIFIED → Admission discharge status → READY
5. Doctor clicks "Complete Discharge" → Admission discharged

**Items**:
- Medical Clearance (BOOLEAN)
- Cleared By (STAFF_SELECTOR) - shown if medical clearance = true
- Medications Reconciled (BOOLEAN)
- Follow-up Appointment Scheduled (BOOLEAN)
- Appointment Date (DATE) - shown if follow-up scheduled = true
- ...

### Use Case 2: Pre-Operative Checklist
**Template**: `PRE_OP_CARDIAC`

**Configuration**:
```json
{
  "requiresVerification": true,
  "verificationRoles": ["ANESTHESIOLOGIST", "SURGEON"],
  "allowSelfVerification": false,
  "autoCreateEnabled": true,
  "autoCreateOn": ["surgery_scheduled"],
  "autoCreateConditions": {"surgeryType": "cardiac"},
  "autoCreateDueHours": 2
}
```

**Workflow**:
1. Cardiac surgery scheduled → Checklist auto-created (due 2 hours before surgery)
2. Nurse completes pre-op checks → Status: COMPLETED
3. Anesthesiologist/Surgeon verifies → Status: VERIFIED
4. Surgery can proceed

**Items**:
- NPO Confirmed (BOOLEAN)
- Consent Signed (BOOLEAN)
- Anesthesia Clearance (BOOLEAN)
- Blood Type Verified (SELECT_SINGLE: A+, A-, B+, etc.)
- Allergies Documented (TEXT_AREA)
- Pre-op ECG Completed (BOOLEAN)
- ECG Results (FILE_UPLOAD) - shown if ECG completed = true

### Use Case 3: Outpatient Diabetes Visit
**Template**: `OUTPATIENT_DIABETES`

**Configuration**:
```json
{
  "requiresVerification": false,
  "verificationRoles": [],
  "allowSelfVerification": true,
  "autoCreateEnabled": false,
  "autoCreateOn": []
}
```

**Workflow**:
1. Nurse manually creates checklist during appointment
2. Nurse completes all items → Status: COMPLETED
3. No verification needed (physician reviews during encounter)

**Items**:
- HbA1c Level (NUMBER)
- Blood Glucose (NUMBER)
- Diet Adherence (SELECT_SINGLE: Excellent, Good, Fair, Poor)
- Exercise Routine (TEXT_AREA)
- Medication Review Completed (BOOLEAN)
- Foot Exam Completed (BOOLEAN)
- Retinal Screening Scheduled (BOOLEAN)

### Use Case 4: Surgery Safety Checklist (WHO)
**Template**: `WHO_SURGICAL_SAFETY`

**Configuration**:
```json
{
  "requiresVerification": true,
  "verificationRoles": ["SURGEON", "ANESTHESIOLOGIST", "SCRUB_NURSE"],
  "allowSelfVerification": true,
  "autoCreateEnabled": true,
  "autoCreateOn": ["patient_in_or"],
  "autoCreateDueHours": 0
}
```

**Workflow**:
1. Patient enters OR → Checklist auto-created (immediate)
2. Team completes each section (Sign In, Time Out, Sign Out)
3. All three roles must verify → Status: VERIFIED
4. Surgery documented as complete

**Sections**: Sign In, Time Out, Sign Out

**Items**:
- Patient Identity Confirmed (BOOLEAN)
- Surgical Site Marked (BOOLEAN)
- Anesthesia Safety Check Complete (BOOLEAN)
- Instrument Count Correct (BOOLEAN)
- Specimen Labeled (BOOLEAN)
- ...

### Use Case 5: Manual Checklist (No Auto-Create, No Verification)
**Template**: `WOUND_CARE_ASSESSMENT`

**Configuration**:
```json
{
  "requiresVerification": false,
  "allowSelfVerification": true,
  "autoCreateEnabled": false
}
```

**Workflow**:
1. Wound care nurse manually creates checklist when needed
2. Completes assessment → Status: COMPLETED
3. No verification step required

---

## Seeding Initial Templates

**Script**: `/backend/services/clinical/prisma/seeds/checklist-templates.ts`

```typescript
const dischargeTemplate = {
  code: "DISCHARGE_STANDARD_V1",
  name: "Standard Discharge Checklist",
  category: "DISCHARGE",
  applicableToInpatient: true,
  applicableToOutpatient: false,
  status: "ACTIVE",
  items: [
    // Medical Clearance Section
    {
      code: "medical_clearance",
      label: "Medical clearance obtained",
      itemType: "BOOLEAN",
      sectionName: "Medical Clearance",
      displayOrder: 1,
      isRequired: true
    },
    {
      code: "medical_cleared_by",
      label: "Cleared by",
      itemType: "STAFF_SELECTOR",
      sectionName: "Medical Clearance",
      displayOrder: 2,
      showIf: { itemCode: "medical_clearance", equals: true }
    },
    // Medications Section
    {
      code: "medications_reconciled",
      label: "Medications reconciled",
      itemType: "BOOLEAN",
      sectionName: "Medications",
      displayOrder: 3,
      isRequired: true
    },
    // ... more items
  ]
};
```

---

## Implementation Phases

### Phase 1: Core Schema & Services (Week 1-2)
1. Add Prisma schema to `database-clinical`
2. Generate and push migrations
3. Create base services (Template, TemplateItem, Instance, Response)
4. Write unit tests

### Phase 2: API Layer (Week 2-3)
1. Create controllers
2. Add DTOs with validation
3. Add Swagger documentation
4. Write integration tests

### Phase 3: Template Builder UI (Week 3-4)
1. Admin page for template management
2. Template item builder
3. Preview functionality
4. Import/export templates (JSON)

### Phase 4: Clinical Forms UI (Week 4-5)
1. Generic checklist renderer component
2. Response saving with auto-save
3. Progress tracking
4. Integration with admission detail page

### Phase 5: Migration & Integration (Week 5-6)
1. Seed discharge template
2. Migrate existing discharge checklists
3. Update Care Channel integration
4. Add checklist tab to inpatient channel page
5. Create outpatient checklist workflow

### Phase 6: Additional Templates (Week 6+)
1. Seed pre-op, post-op templates
2. Create surgery templates
3. Create outpatient visit templates
4. Train staff on template creation

---

## Benefits Over Current Approach

| Feature | Current (Hardcoded) | New (Generic) |
|---------|---------------------|---------------|
| Flexibility | Fixed 30 fields | Unlimited dynamic fields |
| Customization | Requires code changes | Admin can configure |
| Reusability | Discharge only | Any clinical workflow |
| Outpatient | Not supported | Fully supported |
| Field Types | Boolean, text, date only | 12+ field types |
| Conditional Logic | None | Show/hide based on answers |
| Versioning | None | Built-in template versioning |
| Multi-tenant | Limited | Full tenant customization |
| Reporting | Manual | Auto-generated from responses |
| Channel Integration | Hardcoded | Event-driven |

---

## Security & Compliance

### Role-Based Access
- Templates specify `allowedRoles` (e.g., only nurses can complete discharge checklist)
- Backend validates user role before allowing responses
- Audit trail tracks who completed what

### Tenant Isolation
- All queries filtered by `tenantId`
- Templates can be facility-specific or tenant-wide
- No cross-tenant data leakage

### Data Privacy
- Checklist responses contain PHI → stored in Clinical database
- Responses linked to patient and encounter
- Retention follows encounter retention policy

### Audit Trail
- `createdBy`, `updatedBy` on all records
- `respondedBy`, `respondedAt` on each response
- `completedBy`, `verifiedBy` on instances

---

## Future Enhancements (Post-MVP)

1. **Conditional Branching**: More complex logic (AND/OR conditions)
2. **Calculations**: Compute scores based on responses (e.g., risk scores)
3. **Alerts**: Notify staff when checklist is due or overdue
4. **Reminders**: Auto-reminders in Care Channel
5. **Approval Workflows**: Multi-step approvals (nurse completes, doctor verifies)
6. **Templates from Library**: Import WHO, JCI, NABH standard templates
7. **Analytics Dashboard**: Completion rates, average time, bottlenecks
8. **Mobile App**: Complete checklists on mobile devices
9. **Offline Mode**: Fill checklists offline, sync later
10. **Voice Input**: Dictate responses using speech-to-text

---

## Migration Plan from Current Discharge Checklist

### Step 1: Parallel Running (Month 1)
- Keep old `DischargeChecklist` table
- Create new generic system
- Both systems work simultaneously
- New admissions use new system
- Old admissions can finish with old system

### Step 2: Data Migration (Month 2)
- Script to convert old discharge checklists to new format
- Create discharge template matching old schema
- Migrate existing records to instances + responses
- Verify data integrity

### Step 3: Frontend Cutover (Month 2-3)
- Update discharge page to use new generic component
- Remove old discharge form code
- Test thoroughly

### Step 4: Cleanup (Month 3)
- Remove old endpoints
- Drop `DischargeChecklist` table
- Remove old DTOs and services

---

## Success Criteria

**MVP Complete When**:
1. ✅ Admin can create discharge template via UI
2. ✅ Template has all current discharge fields
3. ✅ Clinical staff can fill checklist for admission
4. ✅ Completion tracking works (0-100%)
5. ✅ Channel message posted on completion
6. ✅ Old discharge checklists migrated successfully
7. ✅ Pre-op template created and working
8. ✅ Outpatient checklist created for at least one encounter type
9. ✅ Authorization works (role-based access)
10. ✅ Performance: Load checklist in <500ms

---

## Estimated Effort

- **Phase 1-2** (Backend): 2 weeks
- **Phase 3** (Admin UI): 1 week
- **Phase 4** (Clinical UI): 1 week
- **Phase 5** (Migration): 1 week
- **Phase 6** (Templates): Ongoing

**Total**: ~6 weeks for full MVP including migration

---

## Configuration Matrix

Here are common template configuration patterns:

| Scenario | Auto-Create | Verification Required | Verifiers | Self-Verify | Use Case |
|----------|-------------|----------------------|-----------|-------------|----------|
| **Discharge Checklist** | ✅ Yes (on discharge planning) | ✅ Yes | Physician, Charge Nurse | ❌ No | High-stakes, needs doctor approval |
| **Pre-Op Checklist** | ✅ Yes (surgery scheduled) | ✅ Yes | Surgeon, Anesthesiologist | ❌ No | Critical safety checklist |
| **Post-Op Assessment** | ✅ Yes (surgery complete) | ❌ No | - | ✅ N/A | Nursing documentation |
| **Outpatient Visit** | ❌ Manual | ❌ No | - | ✅ N/A | Routine assessment |
| **WHO Surgical Safety** | ✅ Yes (patient in OR) | ✅ Yes | Multiple roles | ✅ Yes | Team-based checklist |
| **Wound Care** | ❌ Manual | ❌ No | - | ✅ N/A | As-needed assessment |
| **Fall Risk** | ✅ Yes (on admission + q24h) | ❌ No | - | ✅ N/A | Regular reassessment |

---

## Remaining Questions for User

Before starting implementation, please confirm:

1. ~~**Approval Workflow**: Do you need multi-step approval?~~ ✅ **ANSWERED**: Yes, configurable per template

2. ~~**Auto-creation**: Should checklists be auto-created on admission?~~ ✅ **ANSWERED**: Yes, configurable per template

3. **Mandatory Templates**: Should certain templates be REQUIRED (cannot discharge/proceed without completion)?

4. **Template Permissions**: Should template creation be admin-only, or can department heads create templates?

5. **Scoring**: Do you need calculated scores (e.g., fall risk score from checklist answers)?

6. **File Uploads**: Should we support file attachments (e.g., upload consent form in checklist)?

7. **Priority Order**: Which templates should we build first after discharge?
   - Pre-operative checklist
   - Post-operative checklist
   - Outpatient diabetes visit
   - Surgery safety checklist (WHO)
   - Fall risk assessment
   - Other?

8. **Recurring Checklists**: Do you need checklists that repeat automatically (e.g., fall risk q24h, vitals q4h)?

---

**Ready to proceed?** This is a significant architectural enhancement that will make your clinical workflows much more flexible and scalable.
