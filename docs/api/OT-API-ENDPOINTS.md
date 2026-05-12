# OT API Endpoints

This document defines the v1 OT backend APIs implemented in the Clinical service.

Base URL:

```text
http://localhost:3011/api/v1
```

Required headers:

```text
Authorization: Bearer <jwt-token>
x-tenant-id: <tenant-uuid>
x-user-id: <user-uuid>
```

## Scope

The OT module is tenant-scoped and lives in the Clinical service. OT room master data remains owned by Foundation `Space`; the Clinical service stores OT-specific room configuration only.

## OT Requests

### `POST /ot/requests`

Creates an OT request in `DRAFT`.

Core payload fields:
- `patientId`
- `encounterId`
- `procedureName`
- `procedureCode`
- `surgeryType`
- `diagnosis`
- `priority`
- `expectedDurationMinutes`
- `preferredDate`
- `preferredOtRoomSpaceId`
- `primarySurgeonId`
- `anaesthetistRequired`
- `anaesthesiaTypePlanned`
- `specialEquipmentRequired`
- `bloodRequired`
- `implantsRequired`
- `remarks`

### `GET /ot/requests`

Filters:
- `search`
- `status`
- `patientId`
- `encounterId`
- `primarySurgeonId`

Response behavior:
- `search` matches patient first name, last name, display name, MRN, or phone number
- each OT request includes `patientDisplay`, matching the standard Clinical `PatientDisplayDto`

### `GET /ot/requests/:id`

Returns the OT request with schedules and OT reports.
The OT request, nested schedules, and nested OT reports include `patientDisplay` where patient context is available.

### `PATCH /ot/requests/:id`

Allowed only while the request is mutable:
- `DRAFT`
- `REQUESTED`
- `UNDER_REVIEW`
- `APPROVED`

### Workflow endpoints

- `POST /ot/requests/:id/submit`
- `POST /ot/requests/:id/review`
- `POST /ot/requests/:id/approve`
- `POST /ot/requests/:id/reject`
- `POST /ot/requests/:id/cancel`
- `POST /ot/requests/:id/complete`
- `GET /ot/requests/:id/history`

Transition body:

```json
{
  "reason": "optional reason",
  "remarks": "optional remarks"
}
```

Request transition rules:
- `DRAFT -> REQUESTED`
- `REQUESTED -> UNDER_REVIEW | APPROVED | REJECTED | CANCELLED`
- `UNDER_REVIEW -> APPROVED | REJECTED | CANCELLED`
- `APPROVED -> SCHEDULED | CANCELLED`
- `SCHEDULED -> COMPLETED | CANCELLED`

Additional rules:
- Reject requires `reason`.
- Complete requires the current OT schedule to be in `SURGERY_COMPLETED` or `PATIENT_SHIFTED_TO_RECOVERY`.
- Cancel is blocked while a current active OT schedule still exists.

## OT Schedules

### `POST /ot/schedules`

Creates a new schedule for an approved OT request. If the OT request already has a current schedule, the older current schedule is retired and marked `POSTPONED`.

Core payload fields:
- `otRequestId`
- `otRoomSpaceId`
- `scheduledStartTime`
- `scheduledEndTime`
- `primarySurgeonId`
- `assistantSurgeonIds`
- `anaesthetistId`
- `scrubNurseId`
- `circulatingNurseId`
- `technicianId`
- `anaesthesiaType`
- `teamMembers[]`

`teamMembers[]` shape:

```json
{
  "staffId": "uuid",
  "role": "PRIMARY_SURGEON",
  "isPrimary": true,
  "displayOrder": 1
}
```

### `GET /ot/schedules`

Filters:
- `search`
- `status`
- `patientId`
- `encounterId`
- `otRoomSpaceId`
- `primarySurgeonId`

Response behavior:
- `search` matches patient first name, last name, display name, MRN, or phone number
- each OT schedule includes `patientDisplay`, matching the standard Clinical `PatientDisplayDto`
- each OT schedule includes enriched `room` data from OT room configuration plus Foundation `Space` details, so clients do not need a separate `/ot/rooms` call to render room names
- each OT schedule also includes backend-computed `roomDisplayName` and `roomDisplayDescription` for stable list rendering even when Foundation room master detail is partial

### `GET /ot/schedules/:id`

Returns the OT schedule with team members and OT reports.
The OT schedule and nested OT reports include `patientDisplay`.

### `PATCH /ot/schedules/:id`

Updates planned/current schedule details and team membership.

### Schedule workflow endpoints

- `POST /ot/schedules/:id/confirm`
- `POST /ot/schedules/:id/patient-ready`
- `POST /ot/schedules/:id/patient-in-ot`
- `POST /ot/schedules/:id/anaesthesia-started`
- `POST /ot/schedules/:id/surgery-started`
- `POST /ot/schedules/:id/surgery-completed`
- `POST /ot/schedules/:id/shift-to-recovery`
- `POST /ot/schedules/:id/postpone`
- `POST /ot/schedules/:id/cancel`
- `GET /ot/schedules/:id/history`

Transition body:

```json
{
  "reason": "optional reason",
  "remarks": "optional remarks",
  "actualStartTime": "2026-05-09T08:00:00Z",
  "actualEndTime": "2026-05-09T10:30:00Z"
}
```

Schedule transition rules:
- `PLANNED -> CONFIRMED | CANCELLED | POSTPONED`
- `CONFIRMED -> PATIENT_READY | CANCELLED | POSTPONED`
- `PATIENT_READY -> PATIENT_IN_OT | CANCELLED | POSTPONED`
- `PATIENT_IN_OT -> ANAESTHESIA_STARTED | CANCELLED`
- `ANAESTHESIA_STARTED -> SURGERY_STARTED | CANCELLED`
- `SURGERY_STARTED -> SURGERY_COMPLETED | CANCELLED`
- `SURGERY_COMPLETED -> PATIENT_SHIFTED_TO_RECOVERY | CANCELLED`

Additional rules:
- Room overlap and staff overlap are blocked.
- `SpaceSchedule` and `StaffSchedule` recurring availability are checked when present.
- `ResourceBlock` entries for `space` and `staff` are checked for one-time conflicts.
- Cancelling or postponing the current schedule moves the OT request back to `APPROVED`.
- `PATIENT_SHIFTED_TO_RECOVERY` auto-completes the OT request.

### `POST /ot/schedules/conflicts/check`

Conflict check payload:

```json
{
  "otRoomSpaceId": "uuid",
  "scheduledStartTime": "2026-05-09T08:00:00Z",
  "scheduledEndTime": "2026-05-09T10:30:00Z",
  "scheduleId": "optional-existing-schedule-id",
  "staffIds": ["uuid-1", "uuid-2"]
}
```

Conflict response:

```json
{
  "hasConflicts": true,
  "conflicts": [
    {
      "type": "room",
      "resourceId": "space-uuid",
      "message": "OT room is already allocated to schedule 123",
      "conflictingScheduleId": "123"
    }
  ]
}
```

Conflict types:
- `room`
- `staff`
- `availability`
- `block`

## OT Rooms

### `GET /ot/rooms`

Query parameters:
- `facilityId`
- `includeInactive=true|false`

Returns OT room configs enriched with Foundation `Space` data where available.

### `POST /ot/rooms/config`

Upserts OT-specific room configuration.

Payload:

```json
{
  "spaceId": "uuid",
  "specialty": "cardiac",
  "isActive": true,
  "notes": "Laminar flow room"
}
```

### `PATCH /ot/rooms/config/:spaceId`

Updates an existing OT room configuration.

## OT Reports

### `POST /ot/reports`

Creates an OT report header plus version `1`.

Payload:

```json
{
  "scheduleId": "uuid",
  "remarks": "optional remarks",
  "reportData": {
    "operativeNote": {},
    "consumables": []
  }
}
```

### `GET /ot/reports`

Response behavior:
- `search` matches patient first name, last name, display name, MRN, or phone number
- each OT report includes `patientDisplay`, matching the standard Clinical `PatientDisplayDto`

Filters:
- `search`
- `reportStatus`
- `patientId`
- `scheduleId`

### `GET /ot/reports/:id`

Returns OT report metadata and all stored versions.

### `PATCH /ot/reports/:id`

Updates OT report metadata and, when `reportData` is provided, creates a new current version.

### Report workflow endpoints

- `POST /ot/reports/:id/sign`
- `POST /ot/reports/:id/amend`
- `POST /ot/reports/:id/cancel`
- `GET /ot/reports/:id/versions`
- `GET /ot/reports/:id/versions/:versionNo`

Report rules:
- OT report lifecycle is `DRAFT -> SIGNED -> AMENDED` with `CANCELLED` as a terminal state.
- `PATCH` creates a new current version when `reportData` changes.
- `POST /amend` is allowed only from `SIGNED`.
- `POST /sign` is allowed from `DRAFT` or `AMENDED`.
- Report content is stored as JSONB in `ot_report_versions.report_data`.

## Data ownership

- OT transactional data: Clinical database
- OT room master data: Foundation `Space`
- Staff master data: Foundation `Staff`
- Cross-service references are stored as UUIDs without cross-database foreign keys
