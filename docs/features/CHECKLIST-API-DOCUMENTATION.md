# Checklist System - API Documentation for Frontend

## Overview

The Generic Checklist System provides a flexible, template-based approach to creating and managing clinical checklists. This document covers all API endpoints needed for frontend implementation.

**Base URL**: `http://localhost:3011/api/v1`

**Authentication**: All requests require:
- `Authorization: Bearer <token>`
- `x-tenant-id: <uuid>`
- `x-user-id: <uuid>`
- `x-facility-id: <uuid>`

---

## Table of Contents

1. [Checklist Templates](#checklist-templates)
2. [Checklist Instances](#checklist-instances)
3. [Checklist Responses](#checklist-responses)
4. [Workflow Operations](#workflow-operations)
5. [Integration Patterns](#integration-patterns)
6. [TypeScript Types](#typescript-types)

---

## Checklist Templates

Checklist templates are reusable definitions that determine what checklists get created and when.

### 1. List Templates

**Endpoint**: `GET /inpatient/checklists/templates`

**Query Parameters**:
```typescript
{
  category?: 'DISCHARGE' | 'SURGERY' | 'PRE_OPERATIVE' | 'POST_OPERATIVE' | 'ADMISSION' | ...
  status?: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'ARCHIVED'
  applicableToInpatient?: 'true' | 'false'
  applicableToOutpatient?: 'true' | 'false'
  skip?: number    // Offset for pagination (default: 0)
  take?: number    // Number of items to return (default: 50, max: 100)
}
```

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "00000000-0000-0000-0000-000000000001",
      "code": "DISCHARGE_CHECKLIST_V1",
      "name": "Patient Discharge Checklist",
      "description": "Comprehensive checklist for patient discharge planning",
      "category": "DISCHARGE",
      "version": 1,
      "status": "ACTIVE",
      "requiresVerification": true,
      "verificationRoles": ["PHYSICIAN", "CHARGE_NURSE"],
      "autoCreateEnabled": true,
      "autoCreateOn": ["discharge_planning_initiated"],
      "autoCreateDueHours": 48,
      "estimatedMinutes": 20,
      "_count": {
        "items": 18,
        "instances": 45
      }
    }
  ],
  "meta": {
    "total": 5,
    "skip": 0,
    "take": 50,
    "hasMore": false
  }
}
```

**Use Case**: Display available templates in admin settings or when manually creating a checklist.

**Frontend Pagination Example**:
```typescript
// Load first page
const { data, meta } = await checklistTemplateService.list({
  applicableToInpatient: true,
  skip: 0,
  take: 20
});

// Load next page
if (meta.hasMore) {
  const nextPage = await checklistTemplateService.list({
    applicableToInpatient: true,
    skip: meta.skip + meta.take,
    take: 20
  });
}
```

---

### 2. Get Template by ID

**Endpoint**: `GET /inpatient/checklists/templates/:templateId`

**Response**: `200 OK`
```json
{
  "id": "00000000-0000-0000-0000-000000000001",
  "code": "DISCHARGE_CHECKLIST_V1",
  "name": "Patient Discharge Checklist",
  "description": "Comprehensive checklist for patient discharge planning",
  "category": "DISCHARGE",
  "version": 1,
  "status": "ACTIVE",
  "applicableToInpatient": true,
  "applicableToOutpatient": false,
  "requiresAllItems": false,
  "minimumCompletionPercent": 80,
  "requiresVerification": true,
  "verificationRoles": ["PHYSICIAN", "CHARGE_NURSE"],
  "allowSelfVerification": false,
  "autoCreateEnabled": true,
  "autoCreateOn": ["discharge_planning_initiated"],
  "autoCreateDueHours": 48,
  "allowedRoles": ["PHYSICIAN", "NURSE", "CHARGE_NURSE", "CASE_MANAGER"],
  "estimatedMinutes": 20,
  "items": [
    {
      "id": "00000000-0000-0000-0001-000000000001",
      "itemKey": "medical_clearance",
      "itemType": "BOOLEAN",
      "label": "Medical clearance obtained",
      "helpText": "Has the attending physician cleared the patient for discharge?",
      "sectionName": "Medical Clearance",
      "sortOrder": 1,
      "isRequired": true,
      "showIfCondition": null
    },
    {
      "id": "00000000-0000-0000-0001-000000000002",
      "itemKey": "cleared_by",
      "itemType": "STAFF_SELECTOR",
      "label": "Cleared by (Physician)",
      "helpText": "Select the physician who provided medical clearance",
      "placeholder": "Select physician",
      "sectionName": "Medical Clearance",
      "sortOrder": 2,
      "isRequired": true,
      "showIfCondition": {
        "field": "medical_clearance",
        "operator": "equals",
        "value": true
      }
    }
  ]
}
```

**Use Case**: Display template details, preview checklist structure.

---

### 3. Create Template (Admin Only)

**Endpoint**: `POST /inpatient/checklists/templates`

**Request Body**:
```json
{
  "code": "PRE_OP_CHECKLIST_V1",
  "name": "Pre-Operative Checklist",
  "description": "Pre-operative safety checklist",
  "category": "PRE_OPERATIVE",
  "status": "ACTIVE",
  "requiresVerification": true,
  "verificationRoles": ["PHYSICIAN", "ANESTHESIOLOGIST"],
  "autoCreateEnabled": true,
  "autoCreateOn": ["surgery_scheduled"],
  "autoCreateDueHours": 24,
  "items": [
    {
      "itemKey": "consent_signed",
      "itemType": "BOOLEAN",
      "label": "Informed consent signed",
      "sectionName": "Legal",
      "sortOrder": 1,
      "isRequired": true
    },
    {
      "itemKey": "npo_status",
      "itemType": "SELECT_SINGLE",
      "label": "NPO status",
      "sectionName": "Preparation",
      "sortOrder": 2,
      "isRequired": true,
      "options": {
        "values": ["Confirmed NPO", "Not NPO", "Special Instructions"]
      }
    }
  ]
}
```

**Response**: `201 Created`
```json
{
  "id": "uuid",
  "code": "PRE_OP_CHECKLIST_V1",
  "name": "Pre-Operative Checklist",
  ...
}
```

---

## Checklist Instances

Instances are runtime checklists being filled out for specific patients.

### 4. Get Checklists for Admission

**Endpoint**: `GET /inpatient/checklists/admissions/:admissionId`

**Response**: `200 OK`
```json
[
  {
    "id": "instance-uuid-1",
    "templateId": "template-uuid",
    "patientId": "patient-uuid",
    "admissionId": "admission-uuid",
    "careChannelId": "channel-uuid",
    "status": "IN_PROGRESS",
    "completionPercent": 65,
    "dueAt": "2026-01-20T14:00:00Z",
    "startedAt": "2026-01-18T10:30:00Z",
    "template": {
      "code": "DISCHARGE_CHECKLIST_V1",
      "name": "Patient Discharge Checklist",
      "category": "DISCHARGE"
    }
  }
]
```

**Use Case**: Display all checklists for a patient admission in a dedicated "Checklists" tab.

---

### 5. Get Instance by ID

**Endpoint**: `GET /inpatient/checklists/instances/:instanceId`

**Response**: `200 OK`
```json
{
  "id": "instance-uuid",
  "templateId": "template-uuid",
  "patientId": "patient-uuid",
  "admissionId": "admission-uuid",
  "careChannelId": "channel-uuid",
  "channelMessageId": "message-uuid",
  "context": "INPATIENT_ADMISSION",
  "status": "IN_PROGRESS",
  "completionPercent": 65,
  "dueAt": "2026-01-20T14:00:00Z",
  "startedAt": "2026-01-18T10:30:00Z",
  "completedAt": null,
  "verifiedAt": null,
  "completedBy": null,
  "verifiedBy": null,
  "template": {
    "id": "template-uuid",
    "code": "DISCHARGE_CHECKLIST_V1",
    "name": "Patient Discharge Checklist",
    "category": "DISCHARGE",
    "requiresVerification": true,
    "verificationRoles": ["PHYSICIAN", "CHARGE_NURSE"],
    "items": [
      {
        "id": "item-uuid-1",
        "itemKey": "medical_clearance",
        "itemType": "BOOLEAN",
        "label": "Medical clearance obtained",
        "sectionName": "Medical Clearance",
        "sortOrder": 1,
        "isRequired": true
      }
    ]
  },
  "responses": [
    {
      "id": "response-uuid-1",
      "templateItemId": "item-uuid-1",
      "valueBoolean": true,
      "answeredBy": "staff-uuid",
      "answeredAt": "2026-01-18T10:45:00Z",
      "templateItem": {
        "itemKey": "medical_clearance",
        "label": "Medical clearance obtained"
      }
    }
  ]
}
```

**Use Case**: Display full checklist with current responses for filling/reviewing.

---

### 6. List Instances (with Filters)

**Endpoint**: `GET /inpatient/checklists/instances`

**Query Parameters**:
```typescript
{
  admissionId?: string
  careChannelId?: string
  patientId?: string
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'CANCELLED'
  context?: 'INPATIENT_ADMISSION' | 'OUTPATIENT_ENCOUNTER' | 'STANDALONE'
}
```

**Response**: `200 OK` (same as #4)

---

### 7. Create Instance Manually

**Endpoint**: `POST /inpatient/checklists/instances`

**Request Body**:
```json
{
  "templateId": "template-uuid",
  "patientId": "patient-uuid",
  "admissionId": "admission-uuid",
  "careChannelId": "channel-uuid",
  "context": "INPATIENT_ADMISSION",
  "dueAt": "2026-01-20T14:00:00Z"
}
```

**Response**: `201 Created`

**Use Case**: Manually trigger a checklist that didn't auto-create.

---

## Checklist Responses

Responses store the actual answers to checklist items.

### 8. Save Single Response

**Endpoint**: `POST /inpatient/checklists/instances/:instanceId/responses`

**Request Body**:
```json
{
  "templateItemId": "item-uuid",
  "value": true  // Boolean for BOOLEAN type
}
```

**Different Value Types**:
```typescript
// BOOLEAN
{ "templateItemId": "...", "value": true }

// TEXT / TEXT_AREA
{ "templateItemId": "...", "value": "Patient understands discharge instructions" }

// NUMBER
{ "templateItemId": "...", "value": 98.6 }

// DATE
{ "templateItemId": "...", "value": "2026-01-25" }

// DATETIME
{ "templateItemId": "...", "value": "2026-01-25T10:00:00Z" }

// TIME
{ "templateItemId": "...", "value": "14:30:00" }

// SELECT_SINGLE
{ "templateItemId": "...", "value": "home" }

// SELECT_MULTIPLE
{ "templateItemId": "...", "value": ["home_health", "physical_therapy"] }

// STAFF_SELECTOR
{ "templateItemId": "...", "value": "staff-uuid" }

// FILE_UPLOAD
{
  "templateItemId": "...",
  "value": {
    "fileName": "discharge_summary.pdf",
    "fileUrl": "https://...",
    "fileSize": 102400
  }
}
```

**Response**: `201 Created`
```json
{
  "id": "response-uuid",
  "instanceId": "instance-uuid",
  "templateItemId": "item-uuid",
  "valueBoolean": true,
  "answeredBy": "staff-uuid",
  "answeredAt": "2026-01-18T11:00:00Z",
  "templateItem": {
    "itemKey": "medical_clearance",
    "label": "Medical clearance obtained"
  }
}
```

**Note**: This endpoint automatically updates `completionPercent` on the instance.

---

### 9. Bulk Save Responses

**Endpoint**: `POST /inpatient/checklists/instances/:instanceId/responses/bulk`

**Request Body**:
```json
{
  "responses": [
    {
      "templateItemId": "item-uuid-1",
      "value": true
    },
    {
      "templateItemId": "item-uuid-2",
      "value": "staff-uuid"
    },
    {
      "templateItemId": "item-uuid-3",
      "value": "Follow-up scheduled for next week"
    }
  ]
}
```

**Response**: `201 Created`
```json
[
  { "id": "response-uuid-1", ... },
  { "id": "response-uuid-2", ... },
  { "id": "response-uuid-3", ... }
]
```

**Use Case**: Auto-save entire form when user clicks "Save Draft".

---

### 10. Get Responses for Instance

**Endpoint**: `GET /inpatient/checklists/instances/:instanceId/responses`

**Response**: `200 OK`
```json
[
  {
    "id": "response-uuid-1",
    "templateItemId": "item-uuid-1",
    "valueBoolean": true,
    "answeredBy": "staff-uuid",
    "answeredAt": "2026-01-18T11:00:00Z",
    "templateItem": {
      "itemKey": "medical_clearance",
      "itemType": "BOOLEAN",
      "label": "Medical clearance obtained",
      "sortOrder": 1
    }
  }
]
```

---

### 11. Delete Response

**Endpoint**: `DELETE /inpatient/checklists/responses/:responseId`

**Response**: `204 No Content`

**Use Case**: Allow users to clear an answer.

---

## Workflow Operations

These endpoints manage the checklist lifecycle.

### 12. Complete Checklist

**Endpoint**: `PATCH /inpatient/checklists/instances/:instanceId/complete`

**Request Body**: None

**Response**: `200 OK`
```json
{
  "id": "instance-uuid",
  "status": "COMPLETED",
  "completionPercent": 100,
  "completedAt": "2026-01-18T12:00:00Z",
  "completedBy": "staff-uuid"
}
```

**Validation**:
- Checks that all required items are answered
- If template has `requiresAllItems: true`, all items must be answered
- If template has `minimumCompletionPercent`, checks percentage

**Side Effects**:
- Updates instance status to `COMPLETED`
- Posts completion message to Care Channel
- If `requiresVerification: true`, sends notification to verifiers

**Error Responses**:
```json
// 400 Bad Request
{
  "statusCode": 400,
  "message": "Cannot complete checklist: required items not answered"
}
```

---

### 13. Verify Checklist

**Endpoint**: `PATCH /inpatient/checklists/instances/:instanceId/verify`

**Request Body**: None

**Response**: `200 OK`
```json
{
  "id": "instance-uuid",
  "status": "VERIFIED",
  "verifiedAt": "2026-01-18T14:00:00Z",
  "verifiedBy": "doctor-uuid"
}
```

**Authorization**:
- User must have one of the roles in template's `verificationRoles`
- If `allowSelfVerification: false`, verifier cannot be the completer

**Side Effects** (for DISCHARGE checklists):
- Updates admission `dischargeStatus` from `INITIATED` to `READY`
- Posts verification message to Care Channel
- Enables "Complete Discharge" button

**Error Responses**:
```json
// 403 Forbidden
{
  "statusCode": 403,
  "message": "You do not have permission to verify this checklist"
}

// 400 Bad Request
{
  "statusCode": 400,
  "message": "You cannot verify your own checklist"
}
```

---

### 14. Cancel Checklist

**Endpoint**: `PATCH /inpatient/checklists/instances/:instanceId/cancel`

**Request Body**: None

**Response**: `200 OK`
```json
{
  "id": "instance-uuid",
  "status": "CANCELLED"
}
```

**Use Case**: Checklist no longer needed (e.g., surgery cancelled).

---

### 15. Update Status Manually

**Endpoint**: `PATCH /inpatient/checklists/instances/:instanceId/status`

**Request Body**:
```json
{
  "status": "IN_PROGRESS"
}
```

**Response**: `200 OK`

**Use Case**: Administrative override or status correction.

---

## Integration Patterns

### Pattern 1: Discharge Planning Workflow

**Step 1: Start Discharge Planning**
```typescript
// User clicks "Start Discharge Planning" button
PATCH /inpatient/admissions/:admissionId/discharge-checklist
Body: {} // Empty update triggers status change

// Backend automatically:
// 1. Changes dischargeStatus: NONE → INITIATED
// 2. Auto-creates discharge checklist instances
// 3. Posts checklist created message to Care Channel
```

**Step 2: Nurse Fills Checklist**
```typescript
// Navigate to Checklists tab
GET /inpatient/checklists/admissions/:admissionId

// Open checklist
GET /inpatient/checklists/instances/:instanceId

// Auto-save responses as user fills
POST /inpatient/checklists/instances/:instanceId/responses/bulk
Body: { responses: [...] }

// Mark complete when done
PATCH /inpatient/checklists/instances/:instanceId/complete
```

**Step 3: Doctor Verifies**
```typescript
// Doctor opens checklist in read-only mode
GET /inpatient/checklists/instances/:instanceId

// Verify checklist
PATCH /inpatient/checklists/instances/:instanceId/verify

// Backend automatically:
// 1. Updates instance status to VERIFIED
// 2. Changes admission dischargeStatus to READY
// 3. Posts verification message to Care Channel
```

**Step 4: Complete Discharge**
```typescript
// "Complete Discharge" button now enabled
POST /inpatient/admissions/:admissionId/discharge
Body: {
  "actualDischargeDate": "2026-01-18T15:00:00Z",
  "dischargeType": "routine",
  "dischargeDestination": "home"
}

// Backend automatically:
// 1. Discharges patient
// 2. Closes Care Channel
```

---

### Pattern 2: Real-Time Progress Updates

**Polling Strategy** (MVP):
```typescript
// Poll for checklist updates every 10 seconds
useEffect(() => {
  const interval = setInterval(() => {
    fetchChecklistInstance(instanceId);
  }, 10000);

  return () => clearInterval(interval);
}, [instanceId]);
```

**WebSocket Strategy** (Phase 2):
```typescript
// Subscribe to checklist updates
socket.on(`checklist:${instanceId}:updated`, (data) => {
  setChecklist(data);
});
```

---

### Pattern 3: Conditional Field Display

**Client-Side Logic**:
```typescript
function shouldShowField(item: ChecklistItem, responses: Response[]): boolean {
  if (!item.showIfCondition) return true;

  const { field, operator, value } = item.showIfCondition;
  const dependentResponse = responses.find(r =>
    r.templateItem.itemKey === field
  );

  if (!dependentResponse) return false;

  switch (operator) {
    case 'equals':
      return getResponseValue(dependentResponse) === value;
    case 'not_equals':
      return getResponseValue(dependentResponse) !== value;
    case 'contains':
      return getResponseValue(dependentResponse)?.includes(value);
    default:
      return true;
  }
}

function getResponseValue(response: Response): any {
  if (response.valueBoolean !== null) return response.valueBoolean;
  if (response.valueText !== null) return response.valueText;
  if (response.valueNumber !== null) return response.valueNumber;
  if (response.valueJson !== null) return response.valueJson;
  return null;
}
```

---

## TypeScript Types

### Core Types

```typescript
// Enums
export enum ChecklistCategory {
  DISCHARGE = 'DISCHARGE',
  SURGERY = 'SURGERY',
  PRE_OPERATIVE = 'PRE_OPERATIVE',
  POST_OPERATIVE = 'POST_OPERATIVE',
  ADMISSION = 'ADMISSION',
  TRANSFER = 'TRANSFER',
  OUTPATIENT_VISIT = 'OUTPATIENT_VISIT',
  PROCEDURE = 'PROCEDURE',
  EMERGENCY = 'EMERGENCY',
  ANESTHESIA = 'ANESTHESIA',
  INFECTION_CONTROL = 'INFECTION_CONTROL',
  FALL_PREVENTION = 'FALL_PREVENTION',
  PAIN_MANAGEMENT = 'PAIN_MANAGEMENT',
  WOUND_CARE = 'WOUND_CARE',
  CUSTOM = 'CUSTOM',
}

export enum ChecklistTemplateStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

export enum ChecklistItemType {
  BOOLEAN = 'BOOLEAN',
  TEXT = 'TEXT',
  TEXT_AREA = 'TEXT_AREA',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  TIME = 'TIME',
  NUMBER = 'NUMBER',
  SELECT_SINGLE = 'SELECT_SINGLE',
  SELECT_MULTIPLE = 'SELECT_MULTIPLE',
  STAFF_SELECTOR = 'STAFF_SELECTOR',
  SECTION_HEADER = 'SECTION_HEADER',
  FILE_UPLOAD = 'FILE_UPLOAD',
}

export enum ChecklistInstanceStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  CANCELLED = 'CANCELLED',
}

export enum ChecklistContext {
  INPATIENT_ADMISSION = 'INPATIENT_ADMISSION',
  OUTPATIENT_ENCOUNTER = 'OUTPATIENT_ENCOUNTER',
  STANDALONE = 'STANDALONE',
  CARE_CHANNEL = 'CARE_CHANNEL',
}

// Template Types
export interface ChecklistTemplate {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: ChecklistCategory;
  version: number;
  status: ChecklistTemplateStatus;

  // Applicability
  applicableToInpatient: boolean;
  applicableToOutpatient: boolean;
  applicableEncounterTypes: string[];
  applicableDepartments: string[];

  // Completion rules
  requiresAllItems: boolean;
  minimumCompletionPercent?: number;

  // Verification workflow
  requiresVerification: boolean;
  verificationRoles: string[];
  allowSelfVerification: boolean;

  // Auto-creation
  autoCreateEnabled: boolean;
  autoCreateOn: string[];
  autoCreateConditions?: any;
  autoCreateDueHours?: number;

  // Permissions
  allowedRoles: string[];

  // Metadata
  estimatedMinutes?: number;

  // Relations
  items?: ChecklistTemplateItem[];

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ChecklistTemplateItem {
  id: string;
  itemKey: string;
  itemType: ChecklistItemType;
  label: string;
  helpText?: string;
  placeholder?: string;

  // Ordering
  sectionName?: string;
  sortOrder: number;

  // Validation
  isRequired: boolean;
  validationRules?: any;

  // Options (for SELECT types)
  options?: {
    values: string[];
    labels?: Record<string, string>;
  };

  // Conditional display
  showIfCondition?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than';
    value: any;
  };
}

// Instance Types
export interface ChecklistInstance {
  id: string;
  templateId: string;
  patientId: string;
  encounterId?: string;
  admissionId?: string;
  careChannelId?: string;
  channelMessageId?: string;
  context: ChecklistContext;

  // Status
  status: ChecklistInstanceStatus;
  completionPercent: number;

  // Timing
  dueAt?: string;
  startedAt?: string;
  completedAt?: string;
  verifiedAt?: string;

  // Ownership
  completedBy?: string;
  verifiedBy?: string;

  // Relations
  template?: ChecklistTemplate;
  responses?: ChecklistInstanceResponse[];

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Response Types
export interface ChecklistInstanceResponse {
  id: string;
  instanceId: string;
  templateItemId: string;

  // Polymorphic values
  valueBoolean?: boolean;
  valueText?: string;
  valueNumber?: number;
  valueDate?: string;
  valueDatetime?: string;
  valueTime?: string;
  valueJson?: any;

  // Metadata
  answeredBy?: string;
  answeredAt?: string;

  // Relations
  templateItem?: ChecklistTemplateItem;
}

// API Request/Response Types
export interface CreateChecklistInstanceRequest {
  templateId: string;
  patientId: string;
  encounterId?: string;
  admissionId?: string;
  careChannelId?: string;
  context?: ChecklistContext;
  dueAt?: string;
}

export interface SaveChecklistResponseRequest {
  templateItemId: string;
  value: any;
}

export interface BulkSaveChecklistResponseRequest {
  responses: SaveChecklistResponseRequest[];
}

export interface ListChecklistInstancesQuery {
  admissionId?: string;
  careChannelId?: string;
  patientId?: string;
  status?: ChecklistInstanceStatus;
  context?: ChecklistContext;
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation error message",
  "error": "Bad Request"
}
```

### Common Error Codes

| Status Code | Scenario |
|-------------|----------|
| `400` | Validation error, business logic violation |
| `401` | Missing or invalid authentication token |
| `403` | User lacks permission (wrong role) |
| `404` | Resource not found |
| `409` | Conflict (e.g., duplicate template code) |
| `500` | Internal server error |

---

## Rate Limiting & Caching

**Recommendations**:
- **Template List**: Cache for 5 minutes (templates rarely change)
- **Instance List**: Cache for 30 seconds (updates frequently during filling)
- **Single Instance**: Cache for 10 seconds with polling
- **Responses**: No caching (real-time updates needed)

**Rate Limits** (to be implemented):
- 100 requests per minute per user for read operations
- 20 requests per minute per user for write operations

---

## Testing Checklist for Frontend

### Must Test
- [ ] Display list of checklists for admission
- [ ] Open checklist and display all items grouped by section
- [ ] Save responses for different field types (boolean, text, date, etc.)
- [ ] Auto-save draft every 30 seconds
- [ ] Show/hide conditional fields based on dependencies
- [ ] Display real-time completion percentage
- [ ] Mark checklist as complete (validate required fields)
- [ ] Display "Verify" button only for users with verification role
- [ ] Block self-verification when configured
- [ ] Display verification success message
- [ ] Update discharge status badge when verified
- [ ] Handle validation errors gracefully
- [ ] Display read-only view for completed/verified checklists
- [ ] Poll for updates when viewing checklist

### Edge Cases
- [ ] Handle network errors during save
- [ ] Handle concurrent edits by multiple users
- [ ] Display helpful message when due date approaches
- [ ] Highlight overdue checklists
- [ ] Handle checklist with no items
- [ ] Display empty state when no checklists exist

---

## Appendix: Care Channel Integration

Checklists appear as interactive messages in the Care Channel timeline.

### Checklist Created Message

```json
{
  "id": "message-uuid",
  "messageType": "CHECKLIST",
  "messageSubtype": "checklist_created",
  "bodyText": "Checklist created: Patient Discharge Checklist - Due: Jan 20, 2:00 PM",
  "checklistInstanceId": "instance-uuid",
  "payloadJson": {
    "checklistName": "Patient Discharge Checklist",
    "category": "DISCHARGE",
    "dueAt": "2026-01-20T14:00:00Z"
  },
  "createdAt": "2026-01-18T10:00:00Z"
}
```

**Frontend Rendering**:
```tsx
<ChecklistMessage
  message={message}
  checklist={checklist}
  onOpenChecklist={() => navigate(`/checklists/${instanceId}`)}
/>
```

### Checklist Completed Message

```json
{
  "messageType": "SYSTEM",
  "messageSubtype": "checklist_completed",
  "bodyText": "Checklist completed: Patient Discharge Checklist (100%)",
  "payloadJson": {
    "checklistName": "Patient Discharge Checklist",
    "completionPercent": 100,
    "completedBy": "staff-uuid"
  }
}
```

### Checklist Verified Message

```json
{
  "messageType": "SYSTEM",
  "messageSubtype": "checklist_verified",
  "bodyText": "Checklist verified: Patient Discharge Checklist - Patient ready for discharge",
  "payloadJson": {
    "checklistName": "Patient Discharge Checklist",
    "verifiedBy": "doctor-uuid"
  },
  "priority": "HIGH"
}
```

---

## Support & Questions

For API questions or issues, contact the backend team or refer to:
- Prisma schema: `/backend/shared/database-clinical/prisma/schema.prisma`
- Service implementations: `/backend/services/clinical/src/modules/inpatient/checklist-*.service.ts`
- Controllers: `/backend/services/clinical/src/modules/inpatient/checklist*.controller.ts`
