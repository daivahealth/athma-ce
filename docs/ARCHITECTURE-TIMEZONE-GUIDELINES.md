# Timezone Strategy for Zeal (Design + Best Practices)

## Purpose
This document defines how Zeal handles timezones across backend services, databases, and frontend clients. It explains the design decisions, operational guidelines, and the rationale for choosing UTC storage with facility-local presentation.

## Goals
- Ensure consistent time storage across tenants and services.
- Prevent ambiguity and bugs caused by daylight saving time (DST) and user locale differences.
- Allow per-facility timezone behavior without data duplication.
- Keep APIs predictable while preserving local clinical workflows.

## Design Summary
### Core Principles
1) Store all timestamps in UTC in the database.
2) Interpret business logic that depends on local time (working hours, schedules, slots) using the facility timezone.
3) Present time to users in their facility timezone or user locale.
4) Store local-only “wall-clock” fields as explicit date/time components when needed.

### Data Storage
- All clinical DB timestamps use `TIMESTAMPTZ` and `@default(now())`.
- Application writes dates using UTC (e.g., `new Date()` / ISO strings).
- Example: scheduling appointments, admissions, discharge events.

### Timezone Source of Truth
- Configuration key: `locale.timezone`.
- Default: `UTC`.
- Resolved per request via `configClient` with tenant/facility context.

## Why This Approach
- **Consistency**: UTC storage prevents cross-tenant conflicts and drifting.
- **Correctness**: Facility-local business logic avoids schedule errors (DST, overnight shifts).
- **Scalability**: Allows multiple facilities in different timezones in a single tenant.
- **Interoperability**: External systems commonly expect UTC.

## Backend Implementation Guidance
### Scheduling & Availability
- Use facility timezone for schedule calculations (day of week, working hours).
- Convert input range into facility-local boundaries, then compare against UTC-stored data.
- Example implementation: `AvailabilityService` uses Luxon + `locale.timezone` config.

### Transactions and Events
- Record all event timestamps in UTC.
- Avoid converting to local time in DB writes; convert only for display or scheduling rules.

### Discharge / Admission Workflow
- Keep `initiated_at`, `ready_at`, `executed_at` in UTC.
- Use facility timezone to interpret `targetDischargeDate`/`targetDischargeTime`.

## Frontend Guidelines
- Always render timestamps in facility timezone or user locale.
- Display “wall-clock” fields as entered (date/time pickers), but submit as ISO UTC when needed.
- For any business logic based on local time (scheduling), rely on server responses instead of client-only logic.

## When to Store Local Date/Time Separately
Use dedicated fields when user intent depends on local time without timezone offset:
- `targetDischargeDate` (DATE)
- `targetDischargeTime` (STRING)
- Any planned future reminder or checklist anchored to local time

## Recommended Libraries
- **Backend**: Luxon for timezone conversions.
- **Frontend**: date-fns + Intl formatting, or date-fns-tz if timezone conversion is required on client.

## Error Prevention Checklist
- Never store a local time as UTC without conversion.
- Do not compute “day of week” in UTC for schedule logic.
- Avoid mixing `Date` math with local time without explicit timezone conversion.
- Always include facility context when calling `configClient`.

## Example Flow (Appointment Scheduling)
1) Client selects date/time (facility-local).
2) Client sends ISO timestamps or date/time payload.
3) Backend resolves `locale.timezone` for facility.
4) Backend uses facility-local time to compute schedule availability.
5) Backend stores appointment in UTC.
6) Client displays appointment time in facility timezone.

## Open Questions / Future Enhancements
- Add a per-user timezone override for staff working across facilities.
- Add timezone-aware formatting utilities in the shared frontend UI package.
- Add audit events recording timezone at time of action for debugging.

## Summary
This strategy provides a stable, multi-tenant-safe time handling model: **UTC in storage, facility timezone for business logic, user-local formatting for display**. It prevents DST bugs, scales across regions, and keeps patient safety workflows predictable.
