# Scheduling System REST API

Complete REST API documentation for the Multi-Resource Appointment Scheduling System.

## Base URL

All endpoints are prefixed with: `/scheduling`

---

## Table of Contents

1. [Schedule Management](#schedule-management)
   - [Staff Schedules](#staff-schedules)
   - [Equipment Schedules](#equipment-schedules)
   - [Space Schedules](#space-schedules)
   - [Resource Blocks](#resource-blocks)
2. [Availability](#availability)
3. [Appointments](#appointments)
4. [Appointment Series](#appointment-series)

---

## Schedule Management

### Staff Schedules

#### Create Staff Schedule

```http
POST /scheduling/staff-schedules
```

**Request Body:**
```json
{
  "staffId": "uuid",
  "facilityId": "uuid (optional)",
  "dayOfWeek": 1,
  "startTime": "09:00:00",
  "endTime": "17:00:00",
  "isAvailable": true,
  "scheduleType": "regular",
  "notes": "Regular working hours",
  "effectiveFrom": "2025-01-01",
  "effectiveTo": "2025-12-31"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "staffId": "uuid",
  "dayOfWeek": 1,
  "startTime": "09:00:00",
  "endTime": "17:00:00",
  "isAvailable": true,
  "effectiveFrom": "2025-01-01",
  "createdAt": "2025-10-29T10:00:00Z"
}
```

#### Get Staff Schedules

```http
GET /scheduling/staff-schedules/:staffId
```

**Query Parameters:**
- `effectiveDate` (optional): Filter by effective date (ISO date string)
- `includeExpired` (optional): Include expired schedules (true/false)
- `facilityId` (optional): Filter by facility

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "staffId": "uuid",
    "dayOfWeek": 1,
    "startTime": "09:00:00",
    "endTime": "17:00:00",
    "isAvailable": true
  }
]
```

#### Update Staff Schedule

```http
PUT /scheduling/staff-schedules/:id
```

**Request Body:**
```json
{
  "startTime": "08:00:00",
  "endTime": "16:00:00"
}
```

**Response:** `200 OK`

#### Delete Staff Schedule

```http
DELETE /scheduling/staff-schedules/:id
```

**Response:** `204 No Content`

#### Create Weekly Schedule (Bulk)

```http
POST /scheduling/staff-schedules/weekly
```

**Request Body:**
```json
{
  "staffId": "uuid",
  "days": [1, 2, 3, 4, 5],
  "startTime": "09:00:00",
  "endTime": "17:00:00",
  "isAvailable": true,
  "scheduleType": "regular",
  "facilityId": "uuid",
  "effectiveFrom": "2025-01-01",
  "effectiveTo": null,
  "notes": "Monday-Friday schedule"
}
```

**Response:** `201 Created`
```json
[
  { "id": "uuid", "dayOfWeek": 1, ... },
  { "id": "uuid", "dayOfWeek": 2, ... },
  { "id": "uuid", "dayOfWeek": 3, ... },
  { "id": "uuid", "dayOfWeek": 4, ... },
  { "id": "uuid", "dayOfWeek": 5, ... }
]
```

### Equipment Schedules

#### Create Equipment Schedule

```http
POST /scheduling/equipment-schedules
```

**Request Body:**
```json
{
  "equipmentId": "uuid",
  "facilityId": "uuid (optional)",
  "dayOfWeek": 1,
  "startTime": "08:00:00",
  "endTime": "20:00:00",
  "isAvailable": true,
  "maintenanceType": "scheduled_maintenance",
  "notes": "Available except maintenance windows",
  "effectiveFrom": "2025-01-01"
}
```

**Response:** `201 Created`

#### Get Equipment Schedules

```http
GET /scheduling/equipment-schedules/:equipmentId
```

**Query Parameters:**
- `effectiveDate` (optional)
- `includeExpired` (optional)

**Response:** `200 OK`

#### Update / Delete Equipment Schedule

```http
PUT /scheduling/equipment-schedules/:id
DELETE /scheduling/equipment-schedules/:id
```

### Space Schedules

#### Create Space Schedule

```http
POST /scheduling/space-schedules
```

**Request Body:**
```json
{
  "spaceId": "uuid",
  "facilityId": "uuid (optional)",
  "dayOfWeek": 1,
  "startTime": "07:00:00",
  "endTime": "21:00:00",
  "isAvailable": true,
  "blockReason": null,
  "notes": "Operating room availability",
  "effectiveFrom": "2025-01-01"
}
```

**Response:** `201 Created`

#### Get / Update / Delete Space Schedule

```http
GET /scheduling/space-schedules/:spaceId
PUT /scheduling/space-schedules/:id
DELETE /scheduling/space-schedules/:id
```

### Resource Blocks

#### Create Resource Block

```http
POST /scheduling/resource-blocks
```

**Request Body:**
```json
{
  "resourceType": "staff",
  "resourceId": "uuid",
  "facilityId": "uuid (optional)",
  "blockType": "vacation",
  "startDatetime": "2025-12-20T00:00:00Z",
  "endDatetime": "2025-12-30T23:59:59Z",
  "isAvailable": false,
  "reason": "Annual vacation"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "resourceType": "staff",
  "resourceId": "uuid",
  "blockType": "vacation",
  "startDatetime": "2025-12-20T00:00:00Z",
  "endDatetime": "2025-12-30T23:59:59Z",
  "approvalStatus": "pending",
  "createdAt": "2025-10-29T10:00:00Z"
}
```

#### Get Resource Blocks

```http
GET /scheduling/resource-blocks
```

**Query Parameters:**
- `resourceType` (optional): staff, equipment, or space
- `resourceId` (optional)
- `startDate` (optional): Filter by date range
- `endDate` (optional)
- `approvalStatus` (optional): pending, approved, rejected
- `facilityId` (optional)

**Response:** `200 OK`

#### Get Pending Approval Blocks

```http
GET /scheduling/resource-blocks/pending
```

**Query Parameters:**
- `facilityId` (optional)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "resourceType": "staff",
    "resourceId": "uuid",
    "blockType": "vacation",
    "approvalStatus": "pending",
    "reason": "Annual vacation"
  }
]
```

#### Approve Resource Block

```http
POST /scheduling/resource-blocks/:id/approve
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "approvalStatus": "approved",
  "approvedBy": "uuid",
  "approvedAt": "2025-10-29T10:05:00Z"
}
```

#### Reject Resource Block

```http
POST /scheduling/resource-blocks/:id/reject
```

**Request Body:**
```json
{
  "reason": "Insufficient coverage during this period"
}
```

**Response:** `200 OK`

#### Update / Delete Resource Block

```http
PUT /scheduling/resource-blocks/:id
DELETE /scheduling/resource-blocks/:id
```

#### Get Resource Schedules for Date

```http
GET /scheduling/resources/:resourceType/:resourceId/schedules/:date
```

**Example:**
```http
GET /scheduling/resources/staff/uuid-123/schedules/2025-11-05
```

**Response:** `200 OK`
```json
{
  "recurringSchedules": [
    {
      "dayOfWeek": 2,
      "startTime": "09:00:00",
      "endTime": "17:00:00",
      "isAvailable": true
    }
  ],
  "blocks": [
    {
      "blockType": "vacation",
      "startDatetime": "2025-11-05T00:00:00Z",
      "endDatetime": "2025-11-05T23:59:59Z"
    }
  ]
}
```

---

## Availability

### Find Available Slots

```http
POST /scheduling/availability/find-slots
```

**Request Body:**
```json
{
  "resourceType": "staff",
  "resourceId": "uuid",
  "startDate": "2025-11-03",
  "endDate": "2025-11-07",
  "durationMinutes": 30,
  "facilityId": "uuid (optional)",
  "slotInterval": 15,
  "includePreparationTime": false,
  "preparationMinutes": 0,
  "cleanupMinutes": 0
}
```

**Response:** `200 OK`
```json
[
  {
    "startTime": "2025-11-03T10:00:00Z",
    "endTime": "2025-11-03T10:30:00Z"
  },
  {
    "startTime": "2025-11-03T10:15:00Z",
    "endTime": "2025-11-03T10:45:00Z"
  }
]
```

### Check Slot Availability

```http
POST /scheduling/availability/check-slot
```

**Request Body:**
```json
{
  "resourceType": "staff",
  "resourceId": "uuid",
  "startTime": "2025-11-03T10:00:00Z",
  "endTime": "2025-11-03T10:30:00Z",
  "preparationStart": "2025-11-03T09:45:00Z",
  "cleanupEnd": "2025-11-03T10:40:00Z"
}
```

**Response:** `200 OK`
```json
{
  "isAvailable": true
}
```

### Detect Conflicts

```http
POST /scheduling/availability/detect-conflicts
```

**Request Body:** Same as check-slot

**Response:** `200 OK`
```json
{
  "conflicts": [
    {
      "type": "DOUBLE_BOOKING",
      "message": "Resource already booked during this time",
      "details": [...]
    }
  ]
}
```

### Find Slots for Appointment Type

```http
POST /scheduling/availability/find-slots-for-appointment-type
```

**Request Body:**
```json
{
  "appointmentType": "mri_scan",
  "startDate": "2025-11-03",
  "endDate": "2025-11-07",
  "facilityId": "uuid",
  "preferredStaffIds": ["uuid1", "uuid2"],
  "preferredTimeOfDay": "morning",
  "slotInterval": 15
}
```

**Response:** `200 OK`
```json
[
  {
    "startTime": "2025-11-03T10:00:00Z",
    "endTime": "2025-11-03T11:00:00Z",
    "resources": [
      { "type": "staff", "id": "uuid", "role": "radiologist" },
      { "type": "equipment", "id": "uuid", "role": "mri_machine" },
      { "type": "space", "id": "uuid", "role": "imaging_room" }
    ]
  }
]
```

### Get Resource Utilization

```http
POST /scheduling/availability/utilization
```

**Request Body:**
```json
{
  "resourceType": "staff",
  "resourceId": "uuid",
  "startDate": "2025-11-01",
  "endDate": "2025-11-30"
}
```

**Response:** `200 OK`
```json
{
  "totalMinutes": 9600,
  "bookedMinutes": 5400,
  "blockedMinutes": 800,
  "availableMinutes": 3400,
  "utilizationPercentage": 56.25
}
```

**Alternative GET endpoint:**
```http
GET /scheduling/availability/resources/:resourceType/:resourceId/utilization?startDate=2025-11-01&endDate=2025-11-30
```

### Find Next Available Slot

```http
POST /scheduling/availability/next-available
```

**Request Body:**
```json
{
  "resourceType": "staff",
  "resourceId": "uuid",
  "durationMinutes": 30,
  "startFrom": "2025-11-03T00:00:00Z",
  "maxDaysToSearch": 30
}
```

**Response:** `200 OK`
```json
{
  "slot": {
    "startTime": "2025-11-03T14:00:00Z",
    "endTime": "2025-11-03T14:30:00Z"
  }
}
```

### Suggest Alternative Slots

```http
POST /scheduling/availability/suggest-alternatives
```

**Request Body:**
```json
{
  "resourceType": "staff",
  "resourceId": "uuid",
  "preferredStartTime": "2025-11-03T10:00:00Z",
  "durationMinutes": 30,
  "maxAlternatives": 5,
  "searchWindowDays": 7
}
```

**Response:** `200 OK`
```json
[
  { "startTime": "2025-11-03T10:30:00Z", "endTime": "2025-11-03T11:00:00Z" },
  { "startTime": "2025-11-03T11:00:00Z", "endTime": "2025-11-03T11:30:00Z" },
  { "startTime": "2025-11-03T14:00:00Z", "endTime": "2025-11-03T14:30:00Z" }
]
```

---

## Appointments

### Book Appointment

```http
POST /scheduling/appointments
```

**Request Body:**
```json
{
  "patientId": "uuid",
  "appointmentType": "general_checkup",
  "startTime": "2025-11-03T10:00:00Z",
  "endTime": "2025-11-03T10:30:00Z",
  "facilityId": "uuid",
  "spaceId": "uuid",
  "staffId": "uuid",
  "preferredResources": [
    {
      "type": "staff",
      "id": "uuid",
      "role": "primary_physician"
    },
    {
      "type": "space",
      "id": "uuid",
      "role": "exam_room"
    }
  ],
  "notes": "Patient requested morning slot",
  "visitType": "in-person",
  "autoAllocateResources": true
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "patientId": "uuid",
  "appointmentType": "general_checkup",
  "status": "scheduled",
  "startTime": "2025-11-03T10:00:00Z",
  "endTime": "2025-11-03T10:30:00Z",
  "duration": 30,
  "createdAt": "2025-10-29T10:00:00Z",
  "resources": [
    {
      "id": "uuid",
      "resourceType": "staff",
      "resourceId": "uuid",
      "resourceRole": "primary_physician",
      "status": "allocated"
    }
  ]
}
```

### Get Appointment with Resources

```http
GET /scheduling/appointments/:id
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "patientId": "uuid",
  "patient": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  },
  "appointmentType": "general_checkup",
  "status": "scheduled",
  "startTime": "2025-11-03T10:00:00Z",
  "endTime": "2025-11-03T10:30:00Z",
  "resources": [...]
}
```

### Reschedule Appointment

```http
PUT /scheduling/appointments/:id/reschedule
```

**Request Body:**
```json
{
  "newStartTime": "2025-11-04T14:00:00Z",
  "newEndTime": "2025-11-04T14:30:00Z",
  "reason": "Patient requested later time"
}
```

**Response:** `200 OK`

### Cancel Appointment

```http
POST /scheduling/appointments/:id/cancel
```

**Request Body:**
```json
{
  "reason": "Patient unable to attend"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

### Allocate Resource to Appointment

```http
POST /scheduling/appointments/resources
```

**Request Body:**
```json
{
  "appointmentId": "uuid",
  "resourceType": "equipment",
  "resourceId": "uuid",
  "resourceRole": "x_ray_machine",
  "startTime": "2025-11-03T10:00:00Z",
  "endTime": "2025-11-03T10:30:00Z",
  "preparationStart": "2025-11-03T09:45:00Z",
  "cleanupEnd": "2025-11-03T10:40:00Z"
}
```

**Response:** `201 Created`

### Confirm Resource Allocation

```http
POST /scheduling/appointments/resources/:resourceId/confirm
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "status": "confirmed"
}
```

### Get Patient Appointments

```http
GET /scheduling/appointments/patients/:patientId
```

**Query Parameters:**
- `startDate` (optional)
- `endDate` (optional)
- `status` (optional): scheduled, completed, cancelled
- `includeResources` (optional): true/false

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "appointmentType": "general_checkup",
    "status": "scheduled",
    "startTime": "2025-11-03T10:00:00Z",
    "endTime": "2025-11-03T10:30:00Z"
  }
]
```

### Get Facility Appointments

```http
GET /scheduling/appointments/facilities/:facilityId?startDate=2025-11-01&endDate=2025-11-30
```

**Query Parameters:**
- `startDate` (required)
- `endDate` (required)
- `status` (optional)
- `includeResources` (optional)

**Response:** `200 OK`

### Get Current Facility Appointments

```http
GET /scheduling/appointments/facility/current?startDate=2025-11-01&endDate=2025-11-30
```

Uses the user's facility from context.

---

## Appointment Series

### Create Recurring Appointment Series

```http
POST /scheduling/appointments/series
```

**Request Body:**
```json
{
  "patientId": "uuid",
  "seriesName": "Physical Therapy - 8 weeks",
  "appointmentType": "physical_therapy",
  "recurrencePattern": "weekly",
  "recurrenceRule": "FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=24",
  "startDate": "2025-01-06",
  "endDate": "2025-03-01",
  "totalOccurrences": 24,
  "preferredTime": {
    "hour": 10,
    "minute": 0
  },
  "durationMinutes": 45,
  "facilityId": "uuid",
  "preferredResources": [
    {
      "type": "staff",
      "id": "uuid",
      "role": "physical_therapist"
    }
  ],
  "notes": "3x per week for 8 weeks"
}
```

**Response:** `201 Created`
```json
{
  "series": {
    "id": "uuid",
    "patientId": "uuid",
    "seriesName": "Physical Therapy - 8 weeks",
    "appointmentType": "physical_therapy",
    "recurrencePattern": "weekly",
    "totalOccurrences": 24,
    "occurrencesCreated": 24,
    "status": "active",
    "createdAt": "2025-10-29T10:00:00Z"
  },
  "appointmentsCreated": 24,
  "appointmentsFailed": 0,
  "appointments": [...]
}
```

### Get Appointment Series

```http
GET /scheduling/appointments/series/:id
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "patientId": "uuid",
  "patient": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe"
  },
  "seriesName": "Physical Therapy - 8 weeks",
  "status": "active",
  "totalOccurrences": 24,
  "occurrencesCreated": 24,
  "appointments": [
    {
      "id": "uuid",
      "startTime": "2025-01-06T10:00:00Z",
      "status": "scheduled"
    },
    ...
  ]
}
```

### Pause Appointment Series

```http
POST /scheduling/appointments/series/:id/pause
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "status": "paused"
}
```

### Resume Appointment Series

```http
POST /scheduling/appointments/series/:id/resume
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "status": "active"
}
```

### Cancel Appointment Series

```http
POST /scheduling/appointments/series/:id/cancel
```

**Request Body:**
```json
{
  "reason": "Patient unable to continue treatment"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Appointment series cancelled successfully",
  "appointmentsCancelled": 15
}
```

---

## Error Responses

All endpoints return standard HTTP status codes and error responses:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "End time must be after start time",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Appointment not found",
  "error": "Not Found"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Access denied",
  "error": "Forbidden"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Resource already booked during this time",
  "error": "Conflict"
}
```

---

## Common Patterns

### Date/Time Formats

- **Date**: `YYYY-MM-DD` (e.g., `2025-11-03`)
- **Time**: `HH:MM:SS` (e.g., `09:00:00`, `17:30:00`)
- **DateTime**: ISO 8601 (e.g., `2025-11-03T10:00:00Z`)

### Day of Week

- `0` = Sunday
- `1` = Monday
- `2` = Tuesday
- `3` = Wednesday
- `4` = Thursday
- `5` = Friday
- `6` = Saturday

### Resource Types

- `staff` - Healthcare providers
- `equipment` - Medical equipment
- `space` - Physical locations (rooms, areas)

### Block Types

- `vacation` - Staff vacation
- `sick_leave` - Staff sick leave
- `maintenance` - Equipment/space maintenance
- `emergency` - Emergency unavailability
- `special_event` - Special events

### Approval Status

- `pending` - Awaiting approval
- `approved` - Approved and active
- `rejected` - Rejected

### Appointment Status

- `scheduled` - Scheduled
- `confirmed` - Confirmed
- `completed` - Completed
- `cancelled` - Cancelled
- `no_show` - No show

---

## Authentication & Authorization

All endpoints require authentication via Bearer token:

```http
Authorization: Bearer <token>
```

The request context (tenant, facility, user) is automatically extracted from the token and applied to all operations.

---

## Rate Limiting

API endpoints are subject to rate limiting:

- Standard endpoints: 100 requests per minute
- Availability check endpoints: 200 requests per minute
- Bulk operations: 10 requests per minute

---

## Pagination

For list endpoints that may return many results, use pagination:

```http
GET /scheduling/appointments/patients/:patientId?page=1&limit=20
```

**Response includes pagination metadata:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Webhooks (Future Enhancement)

The system can notify external services of scheduling events:

- `appointment.booked`
- `appointment.rescheduled`
- `appointment.cancelled`
- `resource_block.approved`
- `resource_block.rejected`

Configure webhooks in system settings.

---

## Support

For API support and bug reports:
- GitHub Issues: https://github.com/your-org/zeal/issues
- Documentation: https://docs.your-org.com/scheduling-api
