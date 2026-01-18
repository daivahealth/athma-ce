# Care Channel API - Quick Reference

## Authentication Headers (Required for all endpoints)

```
x-tenant-id: YOUR_TENANT_UUID
x-user-id: YOUR_USER_UUID (authenticated staff member)
x-facility-id: YOUR_FACILITY_UUID
```

---

## 1. Channel Management

### Get Channel by Admission ID
```bash
GET /api/v1/inpatient/channels/:admissionId/by-admission

# Example
curl http://localhost:3011/api/v1/inpatient/channels/ADMISSION_ID/by-admission \
  -H "x-tenant-id: YOUR_TENANT_ID"

# Response
{
  "id": "channel-uuid",
  "admissionId": "admission-uuid",
  "patientId": "patient-uuid",
  "status": "ACTIVE",
  "createdAt": "2026-01-14T10:00:00Z"
}
```

### Create Channel (Usually auto-created on admission)
```bash
POST /api/v1/inpatient/channels

# Request Body
{
  "admissionId": "admission-uuid",
  "channelName": "Optional custom name"
}
```

### Close Channel
```bash
PATCH /api/v1/inpatient/channels/:channelId/close

# Request Body
{
  "closureReason": "discharged"  // optional
}
```

### Reopen Channel
```bash
PATCH /api/v1/inpatient/channels/:channelId/reopen
```

---

## 2. Care Team Membership

### Add Team Member
```bash
POST /api/v1/inpatient/channels/:channelId/members

# Request Body
{
  "staffId": "staff-uuid",
  "memberRole": "ATTENDING_PHYSICIAN"
}

# Valid Roles:
# - ATTENDING_PHYSICIAN
# - RESIDENT_PHYSICIAN
# - CONSULTING_PHYSICIAN
# - PRIMARY_NURSE
# - CHARGE_NURSE
# - STAFF_NURSE
# - PHARMACIST
# - CASE_MANAGER
# - RESPIRATORY_THERAPIST
# - PHYSICAL_THERAPIST
# - DIETITIAN
# - OTHER
```

### Remove Team Member
```bash
DELETE /api/v1/inpatient/channels/:channelId/members/:memberId

# Request Body
{
  "removalReason": "Rotation ended"  // optional
}
```

### Get Active Members
```bash
GET /api/v1/inpatient/channels/:channelId/members

# Response
[
  {
    "id": "member-uuid",
    "staffId": "staff-uuid",
    "memberRole": "ATTENDING_PHYSICIAN",
    "addedAt": "2026-01-14T10:00:00Z",
    "addedBy": "user-uuid"
  }
]
```

### Get Membership History (includes removed members)
```bash
GET /api/v1/inpatient/channels/:channelId/members?includeHistory=true
```

### Sync Team from Admission
```bash
POST /api/v1/inpatient/channels/:channelId/members/sync

# Request Body
{
  "admissionId": "admission-uuid"
}

# Automatically adds:
# - Attending physician
# - Primary nurse (if set)
# - Consulting physicians (if any)
```

---

## 3. Messaging (Timeline)

### Post Text Message (Human Chat)
```bash
POST /api/v1/inpatient/channels/:channelId/messages

# Request Body (MINIMAL - only these fields allowed)
{
  "bodyText": "Patient vitals are stable",
  "priority": "NORMAL"  // optional: NORMAL | HIGH | URGENT
}

# ✅ CORRECT Examples:
{
  "bodyText": "Patient is ready for discharge"
}

{
  "bodyText": "Urgent: Patient showing adverse reaction",
  "priority": "URGENT"
}

# ❌ INCORRECT - DO NOT include these fields:
{
  "bodyText": "Message",
  "authorStaffId": "...",    // ❌ Auto-set from context
  "visibility": "CARE_TEAM", // ❌ Auto-set to CARE_TEAM
  "messageType": "TEXT"      // ❌ Auto-set
}

# Response
{
  "id": "message-uuid",
  "channelId": "channel-uuid",
  "messageType": "TEXT",
  "bodyText": "Patient vitals are stable",
  "authorStaffId": "your-user-id",  // Auto-set
  "priority": "NORMAL",
  "visibility": "CARE_TEAM",  // Auto-set
  "createdAt": "2026-01-14T10:30:00Z"
}
```

### Get Timeline (Paginated Messages)
```bash
GET /api/v1/inpatient/channels/:channelId/messages?limit=50&offset=0

# Query Parameters (all optional):
# - limit: Number of messages (1-200, default 50)
# - offset: Skip first N messages (default 0)
# - messageType: Filter by type (TEXT | SYSTEM | CLINICAL_EVENT)
# - messageSubtype: Filter by subtype (admission_created, bed_transfer, etc.)
# - since: ISO timestamp, get messages after this time
# - search: Full-text search in bodyText

# Examples:
GET .../messages?limit=100&offset=0
GET .../messages?messageType=SYSTEM
GET .../messages?messageSubtype=bed_transfer
GET .../messages?since=2026-01-14T00:00:00Z
GET .../messages?search=discharge

# Response
{
  "data": [
    {
      "id": "msg-uuid",
      "messageType": "TEXT",
      "bodyText": "Patient is doing well",
      "authorStaffId": "staff-uuid",
      "priority": "NORMAL",
      "createdAt": "2026-01-14T10:30:00Z"
    },
    {
      "id": "msg-uuid-2",
      "messageType": "SYSTEM",
      "messageSubtype": "bed_transfer",
      "bodyText": "Patient transferred from Ward A to Ward B",
      "linkedEntityType": "bed_assignment",
      "linkedEntityId": "assignment-uuid",
      "isSystemMessage": true,
      "createdAt": "2026-01-14T09:00:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### Get Single Message
```bash
GET /api/v1/inpatient/channels/:channelId/messages/:messageId

# Response
{
  "id": "message-uuid",
  "channelId": "channel-uuid",
  "messageType": "TEXT",
  "bodyText": "Patient vitals stable",
  "authorStaffId": "staff-uuid",
  "createdAt": "2026-01-14T10:30:00Z"
}
```

### Delete Message (Soft Delete)
```bash
DELETE /api/v1/inpatient/channels/:channelId/messages/:messageId

# Response
{
  "id": "message-uuid",
  "deletedAt": "2026-01-14T11:00:00Z",
  "deletedBy": "user-uuid"
}
```

### Search Messages
```bash
GET /api/v1/inpatient/channels/:channelId/messages/search?q=discharge

# Response: Same format as Get Timeline
```

---

## 4. Message Types & Subtypes

### Message Types (Enum)
- **TEXT** - Human chat message (posted by care team)
- **SYSTEM** - System notification (auto-generated)
- **CLINICAL_EVENT** - Clinical transaction event (future)
- **TASK** - Task assignment (future)
- **ALERT** - High-priority alert (future)

### System Message Subtypes (Auto-generated)
| Subtype | When Created | Triggered By |
|---------|--------------|--------------|
| `admission_created` | Patient admitted | AdmissionService.createAdmission() |
| `bed_transfer` | Patient moved to new bed | TransferService.transferPatient() |
| `discharge_intimation` | Discharge checklist ready | DischargeService.updateChecklist() when ready=true |
| `discharge_confirmed` | Patient discharged | DischargeService.dischargePatient() |

### Message Priority (Enum)
- **NORMAL** - Default priority
- **HIGH** - Important message
- **URGENT** - Requires immediate attention

### Message Visibility (Enum - MVP uses CARE_TEAM only)
- **CARE_TEAM** - Visible to all team members (default)
- **NURSING_ONLY** - Future
- **DOCTORS_ONLY** - Future

---

## 5. Real-Time Updates (MVP: Polling)

### Frontend Polling Pattern
```javascript
// Poll every 10 seconds for new messages
const lastTimestamp = '2026-01-14T10:30:00Z';

setInterval(async () => {
  const response = await fetch(
    `/api/v1/inpatient/channels/${channelId}/messages?since=${lastTimestamp}&limit=50`,
    {
      headers: {
        'x-tenant-id': tenantId,
        'x-user-id': userId,
        'x-facility-id': facilityId,
      }
    }
  );

  const { data } = await response.json();

  if (data.length > 0) {
    // Update UI with new messages
    updateTimeline(data);

    // Update lastTimestamp to latest message
    lastTimestamp = data[0].createdAt;
  }
}, 10000);
```

---

## 6. Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Tenant ID is required. Please provide x-tenant-id header.",
  "timestamp": "2026-01-14T10:00:00Z",
  "path": "/api/v1/inpatient/channels/...",
  "error": "Bad Request"
}
```

### 400 Validation Error
```json
{
  "statusCode": 400,
  "message": [
    "property authorStaffId should not exist",
    "bodyText must be a string"
  ],
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Channel with ID abc-123 not found",
  "error": "Not Found"
}
```

---

## 7. Complete Example Workflow

```bash
# Step 1: Admit patient (creates channel automatically)
POST /api/v1/inpatient/admissions
# Response includes admissionId

# Step 2: Get channel for admission
GET /api/v1/inpatient/channels/{admissionId}/by-admission
# Response includes channelId

# Step 3: Add additional team member
POST /api/v1/inpatient/channels/{channelId}/members
Body: { "staffId": "nurse-uuid", "memberRole": "STAFF_NURSE" }

# Step 4: Post a chat message
POST /api/v1/inpatient/channels/{channelId}/messages
Body: { "bodyText": "Patient vitals checked, all normal" }

# Step 5: Transfer patient (auto-creates system message)
POST /api/v1/inpatient/admissions/{admissionId}/transfer
Body: { "toBedId": "bed-uuid", "toWardId": "ward-uuid" }

# Step 6: Get full timeline
GET /api/v1/inpatient/channels/{channelId}/messages?limit=100

# Step 7: Discharge patient (auto-creates system message + closes channel)
POST /api/v1/inpatient/admissions/{admissionId}/discharge
Body: { "dischargeType": "HOME", "dischargeDate": "2026-01-15T10:00:00Z" }
```

---

## 8. Testing with cURL

```bash
# Set variables
TENANT_ID="11111111-1111-1111-1111-111111111111"
USER_ID="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
FACILITY_ID="087e0bd6-8d65-5133-94bd-7b4cd6ff3665"
CHANNEL_ID="01b8ec52-bc7f-425d-b736-763bfcd5e6d6"

# Post a message
curl -X POST "http://localhost:3011/api/v1/inpatient/channels/$CHANNEL_ID/messages" \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: $TENANT_ID" \
  -H "x-user-id: $USER_ID" \
  -H "x-facility-id: $FACILITY_ID" \
  -d '{"bodyText": "Patient doing well today"}'

# Get timeline
curl "http://localhost:3011/api/v1/inpatient/channels/$CHANNEL_ID/messages?limit=20" \
  -H "x-tenant-id: $TENANT_ID" | jq

# Add team member
curl -X POST "http://localhost:3011/api/v1/inpatient/channels/$CHANNEL_ID/members" \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: $TENANT_ID" \
  -H "x-user-id: $USER_ID" \
  -H "x-facility-id: $FACILITY_ID" \
  -d '{"staffId": "staff-uuid-here", "memberRole": "PRIMARY_NURSE"}'
```

---

## 9. Frontend Integration Example (React)

```typescript
import { clinicalApi } from '@/lib/api';

// Post text message
async function postMessage(channelId: string, text: string) {
  const response = await clinicalApi.post(
    `/inpatient/channels/${channelId}/messages`,
    { bodyText: text }  // Only bodyText and priority allowed
  );
  return response.data;
}

// Get timeline
async function getTimeline(channelId: string, limit = 50, offset = 0) {
  const response = await clinicalApi.get(
    `/inpatient/channels/${channelId}/messages`,
    { params: { limit, offset } }
  );
  return response.data;
}

// Get active members
async function getTeamMembers(channelId: string) {
  const response = await clinicalApi.get(
    `/inpatient/channels/${channelId}/members`
  );
  return response.data;
}
```

---

## Notes

1. **Authentication**: All endpoints require `x-tenant-id`, `x-user-id`, and `x-facility-id` headers
2. **Tenant Isolation**: Users can only access channels within their tenant
3. **System Messages**: Created automatically by backend services, not via API
4. **Idempotency**: System messages use idempotency keys to prevent duplicates
5. **Soft Delete**: Deleted messages remain in database with `deletedAt` timestamp
6. **Message History**: All messages are append-only for audit compliance
