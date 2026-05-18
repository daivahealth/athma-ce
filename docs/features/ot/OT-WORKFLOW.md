# OT Workflow

This document defines the v1 OT module workflow implemented in the Clinical service.

## Scope

The OT module covers:
- OT requests
- OT room configuration
- OT scheduling and rescheduling
- OT team assignment
- OT reports with versioned JSONB content

The current scope includes a v1 frontend workspace in the Clinical app with dedicated OT pages for:
- OT board
- OT requests
- OT schedules
- OT reports
- OT rooms

Frontend route pattern:
- each OT area has a list page as the primary landing screen
- create/configure flows live on dedicated routes such as `/ot/requests/new` and `/ot/schedules/new`
- workflow actions such as submit, approve, confirm, sign, and cancel remain available from the list screens
- OT list and selection UIs use the shared `patientDisplay` DTO instead of rendering raw patient UUIDs whenever patient context is available
- OT request, schedule, and report list pages support patient search by name, MRN, or phone using the same list-page pattern as Encounters
- `/ot` now redirects directly to `/ot/board`
- the OT board route at `/ot/board` is a room-first operational board that renders room state, current case, next case, and daily utilization from a single OT board API

The frontend currently focuses on operational workflows and CRUD/transition coverage over the implemented backend APIs. It now includes a room-first OT board view, but does not yet include a drag/drop scheduler, patient-facing OT timeline, or role-specific OT consoles.

## Ownership model

- OT requests, schedules, reports, report versions, and workflow audit data live in the Clinical database.
- OT room master data is not duplicated in Clinical.
- Clinical stores OT-specific room metadata in `ot_room_configs`.
- Foundation remains the source of truth for room master data through `Space`.
- Staff references are stored as raw UUIDs pointing to Foundation staff records.

## OT Request workflow

`OtRequest` is the entry point for OT planning.

Core characteristics:
- Standalone in v1.
- Linked to `patientId` and `encounterId`.
- Not required to be linked to `ClinicalOrder` in v1.
- Can capture surgeon, diagnosis, planned anaesthesia, equipment, blood, implants, and preferred room/date details.
- OT request creation uses the Procedures catalog as the source of truth for `procedureName`, limited to catalog records where `procedureCategory` resolves to surgical in a case-insensitive way.
- The OT request procedure picker uses debounced catalog search rather than issuing a request on every keystroke.

Lifecycle:
- `DRAFT`
- `REQUESTED`
- `UNDER_REVIEW`
- `APPROVED`
- `REJECTED`
- `SCHEDULED`
- `CANCELLED`
- `COMPLETED`

Rules:
- OT requests are created in `DRAFT`.
- Submit moves `DRAFT -> REQUESTED`.
- Review moves `REQUESTED -> UNDER_REVIEW`.
- Approve is allowed from `REQUESTED` or `UNDER_REVIEW`.
- Reject is allowed from `REQUESTED` or `UNDER_REVIEW` and requires a rejection reason.
- Scheduling is only allowed once the request is `APPROVED`.
- Completing the request requires the active schedule to have reached `SURGERY_COMPLETED` or `PATIENT_SHIFTED_TO_RECOVERY`.
- Request cancellation is blocked while a current active schedule still exists.

Auditability:
- Every request transition is recorded in `ot_request_status_events`.

## OT Room workflow

Clinical OT rooms are modeled as:
- Foundation `Space` as the room master
- Clinical `OtRoomConfig` for OT-only metadata

`OtRoomConfig` stores:
- `spaceId`
- `specialty`
- `isActive`
- `notes`

Rules:
- Only spaces explicitly configured as OT rooms can be used by OT schedules.
- Scheduling blocks inactive OT room configs.
- OT room APIs can enrich config rows with Foundation `Space` data for room name/code/location.
- The OT board uses `OtRoomConfig` plus Foundation `Space` to render room identity and state without extra client-side room lookups.

Local seeded environments also include demo OT spaces and OT room configurations for the main hospital so the OT room screens are populated immediately after seeding.

## OT Schedule workflow

`OtSchedule` represents a concrete OT booking.

Lifecycle:
- `PLANNED`
- `CONFIRMED`
- `PATIENT_READY`
- `PATIENT_IN_OT`
- `ANAESTHESIA_STARTED`
- `SURGERY_STARTED`
- `SURGERY_COMPLETED`
- `PATIENT_SHIFTED_TO_RECOVERY`
- `CANCELLED`
- `POSTPONED`

Rules:
- New schedules can be created only for OT requests in `APPROVED` or already `SCHEDULED`.
- One OT request can have many schedules over time.
- Only one schedule is marked `isCurrent = true`.
- Creating a replacement schedule retires the older current schedule and marks it `POSTPONED`.
- Creating a schedule moves the OT request to `SCHEDULED` and updates `activeScheduleId`.
- Postponing or cancelling the current schedule moves the OT request back to `APPROVED`.
- Shifting the patient to recovery auto-completes the OT request.

Auditability:
- Every schedule transition is recorded in `ot_schedule_status_events`.

## OT Team workflow

The schedule header stores the commonly queried OT roles:
- `primarySurgeonId`
- `assistantSurgeonIds`
- `anaesthetistId`
- `scrubNurseId`
- `circulatingNurseId`
- `technicianId`

The normalized OT team roster is stored in `ot_team_members`.

Roles:
- `PRIMARY_SURGEON`
- `ASSISTANT_SURGEON`
- `ANAESTHETIST`
- `SCRUB_NURSE`
- `CIRCULATING_NURSE`
- `OT_TECHNICIAN`
- `PERFUSIONIST`
- `RADIOLOGY_TECHNICIAN`

Rules:
- Team members are written along with schedule create/update.
- Duplicate `staffId + role` assignments are rejected.
- Only one primary surgeon role is allowed per schedule.

## Conflict handling

The scheduling service validates:
- room overlaps against other active OT schedules
- staff overlaps against other active OT schedules
- recurring room availability via `space_schedules`
- recurring staff availability via `staff_schedules`
- one-time blocks via `resource_blocks`

Conflict categories returned by the API:
- `room`
- `staff`
- `availability`
- `block`

This lets the frontend present actionable scheduling failures instead of a generic validation error.

## OT Board workflow

The OT board is a room-first utilization view intended for operational awareness.

Route:
- `/ot/board`

Backend API:
- `GET /api/v1/ot/board?date=YYYY-MM-DD`

Board behavior:
- returns OT-configured rooms only
- resolves room identity, room state, current case, next case, and per-room daily summary on the backend
- uses `patientDisplay` for current and next case rendering
- supports manual refresh from the UI

Board states:
- `IDLE`
- `OCCUPIED`
- `NEXT_UP`
- `BLOCKED`
- `INACTIVE`

State resolution:
- `INACTIVE`: OT room config is inactive
- `BLOCKED`: an approved `resource_block` overlaps the board time for the OT room
- `OCCUPIED`: a live intra-op schedule is in progress for the room
- `NEXT_UP`: no live case now, but another case is queued later in the day
- `IDLE`: active room with no live case and no later case for the selected day

## OT Report workflow

`OtReport` is the report header. `OtReportVersion` stores the canonical JSONB payload.

Report lifecycle:
- `DRAFT`
- `SIGNED`
- `AMENDED`
- `CANCELLED`

Rules:
- Creating an OT report creates the header plus version `1`.
- Updating report content creates a new current version.
- Signing is allowed from `DRAFT` or `AMENDED`.
- Amending is allowed only from `SIGNED`.
- Cancelling transitions the report to a terminal state.

Versioning behavior:
- `report_data` in `ot_report_versions` is the source of truth for report content.
- Only one version is marked `is_current = true`.
- Historical versions remain queryable by version number.

## Multitenancy

All OT entities are tenant-scoped:
- `tenantId` is stored on every OT table.
- OT endpoints require `x-tenant-id`.
- Clinical request filtering remains tenant-aware.

No cross-database joins are introduced. Foundation-owned entities continue to be referenced by UUID only.

## Patient display contract

OT request, schedule, and report APIs return `patientDisplay` using the same shape as other Clinical APIs such as encounters.

The frontend should prefer:
- `patientDisplay.displayName`
- `patientDisplay.mrn`
- `patientDisplay.gender`
- `patientDisplay.age`

and only fall back to raw `patientId` when `patientDisplay` is unavailable.

## RBAC

The OT frontend and backend require Foundation RBAC permissions to be present in the seeded `permissions` table. At minimum, OT users need the relevant combinations of:
- `ot_request.*`
- `ot_schedule.*`
- `ot_room.*`
- `ot_report.*`

In local seeded environments, these permissions are provisioned through the Foundation seed files and inherited by seeded roles such as `tenant_admin` and `super_admin`.
