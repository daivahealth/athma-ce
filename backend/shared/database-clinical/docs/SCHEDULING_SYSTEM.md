# Multi-Resource Appointment Scheduling System

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [Data Models](#data-models)
5. [Core Concepts](#core-concepts)
6. [Scheduling Workflows](#scheduling-workflows)
7. [API Design Patterns](#api-design-patterns)
8. [Usage Examples](#usage-examples)
9. [Conflict Detection](#conflict-detection)
10. [Best Practices](#best-practices)

---

## Overview

The Multi-Resource Appointment Scheduling System is a comprehensive healthcare scheduling solution that coordinates appointments across multiple resource types including:

- **Staff/Physicians**: Healthcare providers with specific schedules and availability
- **Equipment**: Medical equipment like MRI machines, X-ray devices, dialysis machines
- **Spaces**: Physical locations such as examination rooms, operating rooms, treatment areas

### Key Features

✅ **Recurring Weekly Schedules** - Define regular availability patterns for resources
✅ **One-Time Blocks** - Handle vacations, maintenance, emergencies with approval workflows
✅ **Multi-Resource Coordination** - Book appointments requiring multiple resources simultaneously
✅ **Resource Requirements** - Define templates for what resources different appointment types need
✅ **Preparation & Cleanup Times** - Account for setup and teardown periods
✅ **Recurring Appointments** - Support for patient treatment series (e.g., dialysis, physical therapy)
✅ **Effective Date Ranges** - Schedules can have start and end dates
✅ **Tenant & Facility Isolation** - Multi-tenant architecture with facility-level segregation

---

## System Architecture

### Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Appointment API Layer                    │
│  (Controllers, DTOs, Validation)                            │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐ │
│  │ ScheduleService  │  │AvailabilityService│  │Appointment││
│  │                  │  │                  │  │  Service  ││
│  │ - CRUD schedules │  │ - Find slots    │  │ - Book    ││
│  │ - Handle blocks  │  │ - Check conflicts│  │ - Manage  ││
│  └──────────────────┘  └──────────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Prisma ORM Layer                          │
│  (Type-safe database access)                                │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                        │
│  - staff_schedules                                          │
│  - equipment_schedules                                      │
│  - space_schedules                                          │
│  - resource_blocks                                          │
│  - appointment_resource_requirements                        │
│  - appointment_resources                                    │
│  - appointment_series                                       │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Separation of Concerns**: Recurring schedules separate from one-time blocks
2. **Resource Abstraction**: Generic handling of different resource types
3. **Template Pattern**: Define requirements once, reuse for bookings
4. **Temporal Modeling**: Effective date ranges for schedule validity
5. **Audit Trail**: Track who created/modified resources and when
6. **Data Integrity**: Constraints ensure valid time ranges and prevent conflicts

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────────┐        ┌─────────────────────┐
│   Appointment    │◄───────│ AppointmentResource │
│                  │  1:N   │                     │
│  - id            │        │  - appointmentId    │
│  - patientId     │        │  - resourceType     │
│  - startTime     │        │  - resourceId       │
│  - endTime       │        │  - resourceRole     │
│  - status        │        │  - startTime        │
└──────────────────┘        │  - endTime          │
                            │  - preparationStart │
                            │  - cleanupEnd       │
                            └─────────────────────┘
                                       ▲
                                       │
                            ┌──────────┴──────────┐
                            │                     │
                ┌───────────┴────────┐  ┌────────┴─────────┐
                │ StaffSchedule      │  │ ResourceBlock    │
                │                    │  │                  │
                │ - staffId          │  │ - resourceType   │
                │ - dayOfWeek        │  │ - resourceId     │
                │ - startTime        │  │ - startDatetime  │
                │ - endTime          │  │ - endDatetime    │
                │ - effectiveFrom    │  │ - blockType      │
                │ - effectiveTo      │  │ - approvalStatus │
                └────────────────────┘  └──────────────────┘

┌──────────────────┐        ┌─────────────────────────────┐
│   Patient        │◄───────│   AppointmentSeries         │
│                  │  1:N   │                             │
│  - id            │        │  - patientId                │
│  - name          │        │  - recurrencePattern        │
│  - mrn           │        │  - recurrenceRule (RRULE)   │
└──────────────────┘        │  - startDate                │
                            │  - endDate                  │
                            │  - totalOccurrences         │
                            └─────────────────────────────┘

┌─────────────────────────────────────┐
│ AppointmentResourceRequirement      │
│                                     │
│  - appointmentType                  │
│  - resourceType                     │
│  - resourceRole                     │
│  - resourceId (optional)            │
│  - minQuantity / maxQuantity        │
│  - minDurationMinutes               │
│  - preparationTimeMinutes           │
│  - cleanupTimeMinutes               │
└─────────────────────────────────────┘
```

### Table Descriptions

#### 1. **staff_schedules**
Defines recurring weekly availability for staff members.

**Key Fields**:
- `day_of_week`: 0=Sunday, 6=Saturday
- `start_time`, `end_time`: Time range (TIME type)
- `effective_from`, `effective_to`: Date range for schedule validity
- `is_available`: TRUE for working hours, FALSE for blocked time
- `schedule_type`: 'regular', 'on-call', 'special'

**Use Cases**:
- Dr. Smith works Monday-Friday 9am-5pm
- Dr. Jones is on-call every Saturday 8am-12pm
- Nurse team available 24/7 in rotating shifts

#### 2. **equipment_schedules**
Defines recurring weekly availability for medical equipment.

**Key Fields**:
- Similar structure to staff_schedules
- `maintenance_type`: 'scheduled_maintenance', 'emergency_repair', 'calibration'

**Use Cases**:
- MRI machine available Monday-Friday 8am-8pm
- CT scanner maintenance every Sunday 6am-10am
- Dialysis machines calibrated monthly

#### 3. **space_schedules**
Defines recurring weekly availability for physical spaces.

**Key Fields**:
- Similar structure to staff/equipment schedules
- `block_reason`: 'maintenance', 'cleaning', 'renovation'

**Use Cases**:
- Operating Room 1 available Monday-Saturday 7am-7pm
- Exam Room 3 deep cleaning every Sunday
- Treatment area renovation for Q2

#### 4. **resource_blocks**
One-time exceptions to recurring schedules.

**Key Fields**:
- `resource_type`: 'staff', 'equipment', 'space'
- `resource_id`: UUID of the specific resource
- `block_type`: 'vacation', 'sick_leave', 'maintenance', 'emergency', 'special_event'
- `start_datetime`, `end_datetime`: Specific time range (TIMESTAMPTZ)
- `approval_status`: 'pending', 'approved', 'rejected'
- `is_available`: Usually FALSE (marking unavailability)

**Use Cases**:
- Dr. Smith vacation Dec 20-30
- MRI machine emergency repair 2pm-6pm today
- Operating Room closed for inspection tomorrow
- Staff training event next Friday 1pm-5pm

#### 5. **appointment_resource_requirements**
Templates defining what resources are needed for appointment types.

**Key Fields**:
- `appointment_type`: 'general_checkup', 'mri_scan', 'minor_surgery', etc.
- `resource_type`: 'staff', 'equipment', 'space'
- `resource_role`: 'primary_physician', 'nurse', 'mri_machine', 'operating_room'
- `resource_id`: Specific resource (NULL = any matching role)
- `min_quantity`, `max_quantity`: How many of this resource needed
- `min_duration_minutes`, `max_duration_minutes`: Time constraints
- `preparation_time_minutes`, `cleanup_time_minutes`: Buffer times

**Use Cases**:
- MRI scan requires: 1 radiologist, 1 MRI machine, 1 imaging room, 60 min duration, 15 min prep, 10 min cleanup
- Minor surgery requires: 1 surgeon, 1-2 nurses, 1 operating room, surgical equipment set
- Physical therapy requires: 1 therapist, therapy space, 30-45 min duration

#### 6. **appointment_resources**
Actual resources assigned to specific appointments.

**Key Fields**:
- `appointment_id`: Links to appointments table
- `resource_type`, `resource_id`, `resource_role`: What resource is assigned
- `start_time`, `end_time`: When the resource is needed
- `preparation_start`, `cleanup_end`: Extended time window including buffer
- `status`: 'allocated', 'confirmed', 'in_use', 'completed', 'cancelled'

**Use Cases**:
- Appointment #123 has Dr. Smith (9:00-9:30), Exam Room 2 (8:45-9:35 with prep/cleanup)
- Surgery #456 has Dr. Johnson + 2 nurses + OR #3 + surgical equipment
- MRI scan #789 has Radiologist Jones + MRI Machine B + Imaging Room 1

#### 7. **appointment_series**
Manages recurring appointments for ongoing treatments.

**Key Fields**:
- `patient_id`: Patient receiving recurring treatment
- `recurrence_pattern`: 'daily', 'weekly', 'monthly', 'custom'
- `recurrence_rule`: RRULE format (RFC 5545) for complex patterns
- `start_date`, `end_date`: Series date range
- `total_occurrences`: How many appointments in series
- `occurrences_created`: Track how many have been booked
- `status`: 'active', 'paused', 'completed', 'cancelled'

**Use Cases**:
- Dialysis patient: 3x per week for 6 months (Monday, Wednesday, Friday)
- Physical therapy: 2x per week for 8 weeks
- Chemotherapy: Every 3 weeks for 6 cycles
- Follow-up checkups: Monthly for 1 year

---

## Data Models

### Prisma Schema Overview

#### StaffSchedule Model
```prisma
model StaffSchedule {
  id           String    @id @default(uuid()) @db.Uuid
  tenantId     String    @db.Uuid
  staffId      String    @db.Uuid
  facilityId   String?   @db.Uuid
  dayOfWeek    Int       // 0=Sunday, 6=Saturday
  startTime    String    @db.Time(6)
  endTime      String    @db.Time(6)
  isAvailable  Boolean   @default(true)
  scheduleType String    @default("regular") @db.VarChar(50)
  notes        String?   @db.Text
  effectiveFrom DateTime @default(now()) @db.Date
  effectiveTo  DateTime? @db.Date
  createdAt    DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt    DateTime  @updatedAt @db.Timestamptz(6)
  createdBy    String?   @db.Uuid
  updatedBy    String?   @db.Uuid

  @@unique([staffId, dayOfWeek, startTime, effectiveFrom])
  @@map("staff_schedules")
}
```

#### ResourceBlock Model
```prisma
model ResourceBlock {
  id             String    @id @default(uuid()) @db.Uuid
  tenantId       String    @db.Uuid
  resourceType   String    @db.VarChar(50) // staff, equipment, space
  resourceId     String    @db.Uuid
  facilityId     String?   @db.Uuid
  blockType      String    @db.VarChar(50)
  startDatetime  DateTime  @db.Timestamptz(6)
  endDatetime    DateTime  @db.Timestamptz(6)
  isAvailable    Boolean   @default(false)
  reason         String?   @db.Text
  approvalStatus String    @default("pending") @db.VarChar(20)
  approvedBy     String?   @db.Uuid
  approvedAt     DateTime? @db.Timestamptz(6)
  createdAt      DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @db.Timestamptz(6)
  createdBy      String?   @db.Uuid
  updatedBy      String?   @db.Uuid

  @@map("resource_blocks")
}
```

#### AppointmentResource Model
```prisma
model AppointmentResource {
  id               String    @id @default(uuid()) @db.Uuid
  tenantId         String    @db.Uuid
  appointmentId    String    @db.Uuid
  resourceType     String    @db.VarChar(50)
  resourceId       String    @db.Uuid
  resourceRole     String?   @db.VarChar(100)
  startTime        DateTime  @db.Timestamptz(6)
  endTime          DateTime  @db.Timestamptz(6)
  preparationStart DateTime? @db.Timestamptz(6)
  cleanupEnd       DateTime? @db.Timestamptz(6)
  status           String    @default("allocated") @db.VarChar(20)
  notes            String?   @db.Text
  createdAt        DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt        DateTime  @updatedAt @db.Timestamptz(6)
  createdBy        String?   @db.Uuid
  updatedBy        String?   @db.Uuid

  appointment Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)

  @@map("appointment_resources")
}
```

---

## Core Concepts

### 1. Resource Types

The system supports three primary resource types:

- **staff**: Healthcare providers (doctors, nurses, technicians)
- **equipment**: Medical devices and tools
- **space**: Physical locations (rooms, areas, beds)

### 2. Schedule Types

#### Recurring Schedules
Define regular weekly patterns that repeat. Examples:
- Monday-Friday, 9am-5pm (regular working hours)
- Every Wednesday, 2pm-4pm (specialty clinic)
- 24/7 availability (emergency services)

#### One-Time Blocks
Exceptions to recurring schedules. Examples:
- Vacation: Dec 20-30
- Maintenance: Tomorrow 2pm-4pm
- Emergency: Today 11am-12pm

### 3. Effective Date Ranges

Schedules can have validity periods:
- `effective_from`: When the schedule starts
- `effective_to`: When the schedule ends (NULL = indefinite)

**Use Cases**:
- Seasonal schedule changes (summer vs winter hours)
- Temporary staff assignments
- Equipment rental periods
- Facility expansion phases

### 4. Approval Workflows

Resource blocks support approval status:
- **pending**: Awaiting approval
- **approved**: Authorized and active
- **rejected**: Denied

**Use Cases**:
- Staff vacation requests need manager approval
- Equipment maintenance needs scheduling coordinator approval
- Emergency blocks auto-approved, non-emergency pending

### 5. Preparation & Cleanup Times

Many procedures require buffer time:
- **Preparation**: Setup before the appointment (equipment setup, room prep, patient prep)
- **Cleanup**: Teardown after appointment (equipment cleaning, room sanitization, documentation)

**Example**:
- Appointment: 10:00 AM - 10:30 AM
- Preparation: 9:45 AM - 10:00 AM (15 min)
- Cleanup: 10:30 AM - 10:40 AM (10 min)
- **Total resource reservation**: 9:45 AM - 10:40 AM (55 min)

### 6. Resource Roles

Resources can have specific roles for appointments:
- **Staff**: 'primary_physician', 'assistant_nurse', 'anesthesiologist', 'radiologist'
- **Equipment**: 'mri_machine', 'x_ray_device', 'surgical_kit', 'dialysis_machine'
- **Space**: 'exam_room', 'operating_room', 'imaging_suite', 'treatment_area'

### 7. Recurring Appointments (RRULE)

Follows RFC 5545 iCalendar standard for recurrence rules.

**Examples**:
```
FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=24
  → Monday, Wednesday, Friday for 24 occurrences (8 weeks of dialysis)

FREQ=WEEKLY;INTERVAL=2;COUNT=8
  → Every 2 weeks for 8 occurrences (physical therapy)

FREQ=MONTHLY;BYMONTHDAY=15;COUNT=12
  → 15th of every month for 12 occurrences (monthly checkup)
```

---

## Scheduling Workflows

### Workflow 1: Creating Staff Availability

```
1. Define weekly schedule
   ├─→ staffId: "uuid-123"
   ├─→ dayOfWeek: 1 (Monday)
   ├─→ startTime: "09:00:00"
   ├─→ endTime: "17:00:00"
   ├─→ effectiveFrom: "2025-01-01"
   └─→ effectiveTo: null (indefinite)

2. System creates StaffSchedule record

3. Repeat for each day of the week

Result: Dr. Smith available Mon-Fri, 9am-5pm starting Jan 1, 2025
```

### Workflow 2: Booking a Multi-Resource Appointment

```
1. Get appointment requirements
   ├─→ appointmentType: "mri_scan"
   └─→ Fetch from appointment_resource_requirements
       ├─→ Needs: 1 radiologist (30 min)
       ├─→ Needs: 1 MRI machine (60 min, 15 min prep, 10 min cleanup)
       └─→ Needs: 1 imaging room (85 min total)

2. Find available slot
   ├─→ Query staff_schedules for available radiologists
   ├─→ Query equipment_schedules for available MRI machines
   ├─→ Query space_schedules for available imaging rooms
   ├─→ Check resource_blocks for any exceptions
   └─→ Find overlapping available time slot

3. Verify no conflicts
   ├─→ Check existing appointment_resources
   ├─→ Ensure no double-booking
   └─→ Validate time ranges

4. Create appointment
   └─→ Insert into appointments table

5. Allocate resources
   ├─→ Create AppointmentResource for radiologist (2pm-2:30pm)
   ├─→ Create AppointmentResource for MRI machine (1:45pm-3:10pm with prep/cleanup)
   └─→ Create AppointmentResource for imaging room (1:45pm-3:10pm)

6. Update resource status
   └─→ Mark all resources as 'allocated' → 'confirmed' → 'in_use' → 'completed'

Result: Fully booked multi-resource appointment with conflict-free scheduling
```

### Workflow 3: Handling Vacation Request

```
1. Staff submits vacation request
   ├─→ resourceType: "staff"
   ├─→ resourceId: "staff-uuid-123"
   ├─→ blockType: "vacation"
   ├─→ startDatetime: "2025-12-20 00:00:00"
   ├─→ endDatetime: "2025-12-30 23:59:59"
   ├─→ approvalStatus: "pending"
   └─→ isAvailable: false

2. Manager reviews request
   └─→ Check for scheduled appointments during this period

3. Manager approves
   ├─→ Update approvalStatus: "approved"
   ├─→ Set approvedBy: "manager-uuid"
   └─→ Set approvedAt: timestamp

4. System blocks availability
   └─→ Resource unavailable for scheduling during vacation period

5. Notify staff
   └─→ Confirmation sent

Result: Staff member blocked from scheduling during vacation period
```

### Workflow 4: Creating Recurring Appointments

```
1. Create appointment series
   ├─→ patientId: "patient-uuid-456"
   ├─→ appointmentType: "dialysis"
   ├─→ recurrencePattern: "weekly"
   ├─→ recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=24"
   ├─→ startDate: "2025-01-06"
   ├─→ totalOccurrences: 24
   └─→ status: "active"

2. Generate individual appointments
   ├─→ Parse RRULE
   ├─→ Calculate dates: Jan 6, 8, 10, 13, 15, 17...
   └─→ Create appointment for each occurrence

3. For each appointment:
   ├─→ Find available resources
   ├─→ Book resources
   └─→ Link to appointment series

4. Track progress
   ├─→ occurrencesCreated: 24
   └─→ status: "active"

5. Handle modifications
   ├─→ Individual appointments can be rescheduled
   ├─→ Series can be paused/cancelled
   └─→ Remaining occurrences automatically adjust

Result: 24 dialysis appointments scheduled for 8 weeks (Mon, Wed, Fri)
```

---

## API Design Patterns

### Service Layer Architecture

#### 1. **ScheduleService**
Manages CRUD operations for schedules and blocks.

**Methods**:
```typescript
class ScheduleService {
  // Staff Schedules
  async createStaffSchedule(data: CreateStaffScheduleDto): Promise<StaffSchedule>
  async updateStaffSchedule(id: string, data: UpdateStaffScheduleDto): Promise<StaffSchedule>
  async deleteStaffSchedule(id: string): Promise<void>
  async getStaffSchedules(staffId: string, effectiveDate?: Date): Promise<StaffSchedule[]>

  // Equipment Schedules
  async createEquipmentSchedule(data: CreateEquipmentScheduleDto): Promise<EquipmentSchedule>
  async updateEquipmentSchedule(id: string, data: UpdateEquipmentScheduleDto): Promise<EquipmentSchedule>

  // Space Schedules
  async createSpaceSchedule(data: CreateSpaceScheduleDto): Promise<SpaceSchedule>

  // Resource Blocks
  async createResourceBlock(data: CreateResourceBlockDto): Promise<ResourceBlock>
  async approveResourceBlock(id: string, approverId: string): Promise<ResourceBlock>
  async rejectResourceBlock(id: string, approverId: string, reason: string): Promise<ResourceBlock>
  async getPendingBlocks(facilityId?: string): Promise<ResourceBlock[]>
}
```

#### 2. **AvailabilityService**
Finds available time slots considering all constraints.

**Methods**:
```typescript
class AvailabilityService {
  // Find available slots for specific resource
  async findAvailableSlots(params: {
    resourceType: 'staff' | 'equipment' | 'space',
    resourceId: string,
    startDate: Date,
    endDate: Date,
    durationMinutes: number,
    facilityId?: string
  }): Promise<TimeSlot[]>

  // Find slots that satisfy all resource requirements
  async findAvailableSlotsForAppointmentType(params: {
    appointmentType: string,
    startDate: Date,
    endDate: Date,
    facilityId?: string,
    preferredStaffIds?: string[]
  }): Promise<MultiResourceSlot[]>

  // Check if specific time slot is available
  async isSlotAvailable(params: {
    resources: Array<{ type: string, id: string }>,
    startTime: Date,
    endTime: Date
  }): Promise<boolean>

  // Get resource utilization statistics
  async getResourceUtilization(params: {
    resourceType: string,
    resourceId: string,
    startDate: Date,
    endDate: Date
  }): Promise<UtilizationStats>
}
```

#### 3. **AppointmentService**
Manages appointment booking with multi-resource coordination.

**Methods**:
```typescript
class AppointmentService {
  // Book appointment with automatic resource allocation
  async bookAppointment(data: {
    patientId: string,
    appointmentType: string,
    startTime: Date,
    endTime: Date,
    facilityId?: string,
    preferredResources?: Array<{ type: string, id: string, role: string }>
  }): Promise<AppointmentWithResources>

  // Manually allocate specific resources
  async allocateResources(params: {
    appointmentId: string,
    resources: Array<{
      resourceType: string,
      resourceId: string,
      resourceRole: string,
      startTime: Date,
      endTime: Date,
      preparationStart?: Date,
      cleanupEnd?: Date
    }>
  }): Promise<AppointmentResource[]>

  // Reschedule appointment and resources
  async rescheduleAppointment(params: {
    appointmentId: string,
    newStartTime: Date,
    newEndTime: Date
  }): Promise<AppointmentWithResources>

  // Cancel appointment and release resources
  async cancelAppointment(appointmentId: string, reason?: string): Promise<void>

  // Create recurring appointment series
  async createAppointmentSeries(data: {
    patientId: string,
    appointmentType: string,
    recurrencePattern: string,
    recurrenceRule: string,
    startDate: Date,
    endDate?: Date,
    totalOccurrences?: number,
    preferredTime: { hour: number, minute: number },
    facilityId?: string
  }): Promise<AppointmentSeries>

  // Get appointment with all resources
  async getAppointmentWithResources(appointmentId: string): Promise<AppointmentWithResources>
}
```

### DTO Examples

```typescript
// CreateStaffScheduleDto
interface CreateStaffScheduleDto {
  tenantId: string;
  staffId: string;
  facilityId?: string;
  dayOfWeek: number; // 0-6
  startTime: string; // "09:00:00"
  endTime: string; // "17:00:00"
  isAvailable: boolean;
  scheduleType?: string;
  notes?: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

// CreateResourceBlockDto
interface CreateResourceBlockDto {
  tenantId: string;
  resourceType: 'staff' | 'equipment' | 'space';
  resourceId: string;
  facilityId?: string;
  blockType: 'vacation' | 'sick_leave' | 'maintenance' | 'emergency' | 'special_event';
  startDatetime: Date;
  endDatetime: Date;
  isAvailable: boolean;
  reason?: string;
}

// BookAppointmentDto
interface BookAppointmentDto {
  patientId: string;
  appointmentType: string;
  startTime: Date;
  endTime: Date;
  facilityId?: string;
  preferredResources?: Array<{
    type: 'staff' | 'equipment' | 'space';
    id: string;
    role: string;
  }>;
  notes?: string;
}

// FindAvailableSlotsDto
interface FindAvailableSlotsDto {
  appointmentType: string;
  startDate: Date; // Search from this date
  endDate: Date; // Search until this date
  facilityId?: string;
  preferredStaffIds?: string[];
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
}
```

### Controller Endpoints

```typescript
// Schedule Management
POST   /api/schedules/staff             - Create staff schedule
GET    /api/schedules/staff/:staffId    - Get staff schedules
PUT    /api/schedules/staff/:id         - Update staff schedule
DELETE /api/schedules/staff/:id         - Delete staff schedule

POST   /api/schedules/equipment         - Create equipment schedule
POST   /api/schedules/space             - Create space schedule

// Resource Blocks
POST   /api/resource-blocks              - Create resource block
GET    /api/resource-blocks/pending      - Get pending approvals
PUT    /api/resource-blocks/:id/approve  - Approve block
PUT    /api/resource-blocks/:id/reject   - Reject block

// Availability
GET    /api/availability/slots           - Find available slots
POST   /api/availability/check           - Check specific slot availability
GET    /api/availability/utilization     - Get resource utilization stats

// Appointments
POST   /api/appointments                 - Book appointment
GET    /api/appointments/:id             - Get appointment with resources
PUT    /api/appointments/:id/reschedule  - Reschedule appointment
DELETE /api/appointments/:id             - Cancel appointment

POST   /api/appointments/series          - Create recurring appointments
GET    /api/appointments/series/:id      - Get appointment series
PUT    /api/appointments/series/:id/pause - Pause series
```

---

## Usage Examples

### Example 1: Create Weekly Staff Schedule

```typescript
// Dr. Smith works Monday-Friday, 9am-5pm
const schedule = await scheduleService.createStaffSchedule({
  tenantId: 'tenant-123',
  staffId: 'staff-456',
  facilityId: 'facility-789',
  dayOfWeek: 1, // Monday
  startTime: '09:00:00',
  endTime: '17:00:00',
  isAvailable: true,
  scheduleType: 'regular',
  effectiveFrom: new Date('2025-01-01'),
  effectiveTo: null // Indefinite
});

// Repeat for Tuesday (2), Wednesday (3), Thursday (4), Friday (5)
```

### Example 2: Request Vacation Block

```typescript
// Staff requests vacation Dec 20-30
const vacationBlock = await scheduleService.createResourceBlock({
  tenantId: 'tenant-123',
  resourceType: 'staff',
  resourceId: 'staff-456',
  facilityId: 'facility-789',
  blockType: 'vacation',
  startDatetime: new Date('2025-12-20T00:00:00Z'),
  endDatetime: new Date('2025-12-30T23:59:59Z'),
  isAvailable: false,
  reason: 'Annual vacation - family trip'
});

// Manager approves
const approved = await scheduleService.approveResourceBlock(
  vacationBlock.id,
  'manager-uuid-123'
);
```

### Example 3: Find Available Slots for MRI Scan

```typescript
// Find available MRI slots next week
const availableSlots = await availabilityService.findAvailableSlotsForAppointmentType({
  appointmentType: 'mri_scan',
  startDate: new Date('2025-11-03'),
  endDate: new Date('2025-11-07'),
  facilityId: 'facility-789',
  preferredStaffIds: ['radiologist-001'] // Optional preference
});

// Returns array of slots with all required resources available
// [
//   {
//     startTime: '2025-11-03T10:00:00Z',
//     endTime: '2025-11-03T11:25:00Z',
//     resources: [
//       { type: 'staff', id: 'radiologist-001', role: 'radiologist' },
//       { type: 'equipment', id: 'mri-machine-A', role: 'mri_machine' },
//       { type: 'space', id: 'imaging-room-1', role: 'imaging_room' }
//     ]
//   },
//   // ... more slots
// ]
```

### Example 4: Book Multi-Resource Appointment

```typescript
// Book MRI appointment with automatic resource allocation
const appointment = await appointmentService.bookAppointment({
  patientId: 'patient-123',
  appointmentType: 'mri_scan',
  startTime: new Date('2025-11-03T10:00:00Z'),
  endTime: new Date('2025-11-03T11:00:00Z'),
  facilityId: 'facility-789',
  preferredResources: [
    { type: 'staff', id: 'radiologist-001', role: 'radiologist' },
    { type: 'equipment', id: 'mri-machine-A', role: 'mri_machine' }
  ],
  notes: 'Patient has claustrophobia - needs extra time'
});

// System automatically:
// 1. Validates all resources are available
// 2. Creates appointment record
// 3. Allocates resources with prep/cleanup times
// 4. Returns complete booking details
```

### Example 5: Create Recurring Dialysis Appointments

```typescript
// Patient needs dialysis 3x per week for 8 weeks
const series = await appointmentService.createAppointmentSeries({
  patientId: 'patient-456',
  appointmentType: 'dialysis',
  recurrencePattern: 'weekly',
  recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=24', // 24 sessions
  startDate: new Date('2025-01-06'),
  totalOccurrences: 24,
  preferredTime: { hour: 10, minute: 0 }, // 10:00 AM
  facilityId: 'facility-789'
});

// System creates 24 individual appointments
// Each appointment automatically allocated with required resources
// Patient has consistent schedule: Mon/Wed/Fri at 10am for 8 weeks
```

### Example 6: Check Conflict Before Booking

```typescript
// Verify resources are available before booking
const isAvailable = await availabilityService.isSlotAvailable({
  resources: [
    { type: 'staff', id: 'doctor-123' },
    { type: 'space', id: 'exam-room-2' }
  ],
  startTime: new Date('2025-11-03T14:00:00Z'),
  endTime: new Date('2025-11-03T14:30:00Z')
});

if (isAvailable) {
  // Proceed with booking
  await appointmentService.bookAppointment({ /* ... */ });
} else {
  // Show conflict message, suggest alternative times
  const alternatives = await availabilityService.findAvailableSlots({ /* ... */ });
}
```

---

## Conflict Detection

### Conflict Types

1. **Double Booking**: Resource already assigned to another appointment
2. **Schedule Overlap**: Resource schedule doesn't cover requested time
3. **Resource Block**: Resource blocked due to vacation, maintenance, etc.
4. **Preparation/Cleanup Overlap**: Buffer times conflict with adjacent appointments
5. **Effective Date Mismatch**: Schedule not active for requested date

### Conflict Detection Algorithm

```typescript
async function detectConflicts(
  resourceType: string,
  resourceId: string,
  requestedStart: Date,
  requestedEnd: Date,
  requestedDate: Date
): Promise<Conflict[]> {
  const conflicts: Conflict[] = [];

  // 1. Check recurring schedule exists and covers time
  const dayOfWeek = requestedDate.getDay();
  const schedules = await getActiveSchedules(resourceId, resourceType, requestedDate);

  const coveringSchedule = schedules.find(s =>
    s.dayOfWeek === dayOfWeek &&
    s.startTime <= requestedStart.getTime() &&
    s.endTime >= requestedEnd.getTime() &&
    s.isAvailable === true
  );

  if (!coveringSchedule) {
    conflicts.push({ type: 'SCHEDULE_UNAVAILABLE', message: 'No matching schedule' });
  }

  // 2. Check for resource blocks (vacations, maintenance, etc.)
  const blocks = await prisma.resourceBlock.findMany({
    where: {
      resourceType,
      resourceId,
      approvalStatus: 'approved',
      startDatetime: { lte: requestedEnd },
      endDatetime: { gte: requestedStart }
    }
  });

  if (blocks.length > 0) {
    conflicts.push({ type: 'BLOCKED', message: 'Resource blocked', blocks });
  }

  // 3. Check for existing appointments (double booking)
  const existingAppointments = await prisma.appointmentResource.findMany({
    where: {
      resourceType,
      resourceId,
      status: { in: ['allocated', 'confirmed', 'in_use'] },
      OR: [
        // Requested slot overlaps with existing appointment
        {
          startTime: { lte: requestedEnd },
          endTime: { gte: requestedStart }
        },
        // Include prep/cleanup times
        {
          preparationStart: { not: null, lte: requestedEnd },
          cleanupEnd: { not: null, gte: requestedStart }
        }
      ]
    }
  });

  if (existingAppointments.length > 0) {
    conflicts.push({ type: 'DOUBLE_BOOKING', appointments: existingAppointments });
  }

  return conflicts;
}
```

### Conflict Resolution Strategies

1. **Suggest Alternative Times**: Find nearest available slots
2. **Resource Substitution**: Offer equivalent resources (different MRI machine, different room)
3. **Waiting List**: Queue patient for cancellations
4. **Bump Lower Priority**: Override non-urgent appointments (with approval)
5. **Split Resources**: Use different resources for parts of appointment if possible

---

## Best Practices

### 1. Schedule Management

✅ **DO**:
- Create schedules with effective date ranges for flexibility
- Use `effectiveTo` for temporary schedule changes
- Maintain audit trail with `createdBy` and `updatedBy`
- Set realistic preparation and cleanup times
- Use descriptive notes for schedule context

❌ **DON'T**:
- Create overlapping schedules for the same resource
- Delete schedules with active appointments
- Ignore timezone considerations
- Skip effective date validation

### 2. Resource Blocking

✅ **DO**:
- Require approval for non-emergency blocks
- Provide clear reasons for blocks
- Use appropriate block types (vacation, maintenance, etc.)
- Check for existing appointments before approving blocks
- Notify affected parties of approved blocks

❌ **DON'T**:
- Auto-approve vacation requests without checking conflicts
- Block resources without reason
- Forget to set `isAvailable = false` for unavailable blocks
- Allow overlapping blocks

### 3. Appointment Booking

✅ **DO**:
- Validate all resource availability before booking
- Include preparation and cleanup times
- Check appointment resource requirements
- Provide meaningful error messages on conflicts
- Send confirmation notifications to all parties
- Support partial booking (hold resources temporarily)

❌ **DON'T**:
- Book without checking conflicts
- Ignore buffer times
- Skip validation of resource requirements
- Book resources outside their schedules
- Double-book resources

### 4. Recurring Appointments

✅ **DO**:
- Use standard RRULE format (RFC 5545)
- Validate recurrence rule before creation
- Allow individual appointment modifications
- Track series status (active, paused, cancelled)
- Limit series to reasonable duration (suggest max 6-12 months)
- Allow series to be paused and resumed

❌ **DON'T**:
- Create infinite recurrence without end date or count
- Force all series appointments to be identical
- Prevent cancellation of individual occurrences
- Auto-create all occurrences upfront (create on-demand or in batches)

### 5. Multi-Resource Coordination

✅ **DO**:
- Define resource requirements per appointment type
- Support optional vs required resources
- Allow resource preferences (preferred doctor, etc.)
- Validate all resources are available simultaneously
- Provide resource substitution options
- Consider resource proximity (same building, floor, etc.)

❌ **DON'T**:
- Assume resources are interchangeable
- Book resources independently without checking overlap
- Ignore resource roles and qualifications
- Skip validation of resource quantities

### 6. Performance Optimization

✅ **DO**:
- Use database indexes effectively (see migration file)
- Implement caching for frequently accessed schedules
- Batch availability queries when possible
- Paginate results for large date ranges
- Use partial indexes for conditional queries
- Consider materialized views for complex availability calculations

❌ **DON'T**:
- Load all schedules into memory
- Query one resource at a time in loops
- Skip index hints for complex queries
- Ignore query performance monitoring

### 7. Data Integrity

✅ **DO**:
- Use database constraints (time order, quantity checks)
- Validate date ranges (end > start)
- Enforce tenant isolation
- Use transactions for multi-table operations
- Implement soft deletes where appropriate
- Maintain referential integrity with foreign keys

❌ **DON'T**:
- Skip validation in application layer
- Allow orphaned resource allocations
- Bypass tenant boundaries
- Delete records with active references

### 8. User Experience

✅ **DO**:
- Show visual calendar with availability
- Highlight conflicts and suggest alternatives
- Provide filtering and search capabilities
- Allow drag-and-drop rescheduling
- Send reminders and notifications
- Support waitlists for fully booked slots

❌ **DON'T**:
- Show only unavailable slots without explanation
- Make users manually check each resource
- Hide conflict reasons
- Prevent easy rescheduling
- Forget timezone conversions in UI

---

## Migration Guide

### Running the Database Migration

1. **Locate the migration file**:
   ```
   /backend/shared/database-clinical/migrations/001_create_scheduling_tables.sql
   ```

2. **Connect to your database**:
   ```bash
   psql -U your_username -d your_database_name
   ```

3. **Run the migration**:
   ```sql
   \i /path/to/001_create_scheduling_tables.sql
   ```

4. **Verify tables created**:
   ```sql
   \dt
   -- Should show: staff_schedules, equipment_schedules, space_schedules,
   --              resource_blocks, appointment_resource_requirements,
   --              appointment_resources, appointment_series
   ```

### Generating Prisma Client

After updating the schema:

```bash
cd /backend/shared/database-clinical
npx prisma generate
```

### Seeding Initial Data

Create seed file with default resource requirements:

```typescript
// prisma/seeds/appointment-resource-requirements.ts
const requirements = [
  {
    appointmentType: 'general_checkup',
    requirements: [
      { resourceType: 'staff', resourceRole: 'physician', minQuantity: 1, minDurationMinutes: 15 },
      { resourceType: 'space', resourceRole: 'exam_room', minQuantity: 1, minDurationMinutes: 15 }
    ]
  },
  {
    appointmentType: 'mri_scan',
    requirements: [
      { resourceType: 'staff', resourceRole: 'radiologist', minQuantity: 1, minDurationMinutes: 30, preparationTimeMinutes: 5 },
      { resourceType: 'equipment', resourceRole: 'mri_machine', minQuantity: 1, minDurationMinutes: 60, preparationTimeMinutes: 15, cleanupTimeMinutes: 10 },
      { resourceType: 'space', resourceRole: 'imaging_room', minQuantity: 1, minDurationMinutes: 85 }
    ]
  }
  // Add more appointment types...
];
```

---

## Testing Strategy

### Unit Tests

Test individual service methods:

```typescript
describe('ScheduleService', () => {
  it('should create staff schedule with valid data', async () => {
    const schedule = await scheduleService.createStaffSchedule({ /* ... */ });
    expect(schedule.id).toBeDefined();
  });

  it('should reject overlapping schedules', async () => {
    await expect(
      scheduleService.createStaffSchedule({ /* overlapping times */ })
    ).rejects.toThrow('Schedule conflicts');
  });
});

describe('AvailabilityService', () => {
  it('should find available slots within date range', async () => {
    const slots = await availabilityService.findAvailableSlots({ /* ... */ });
    expect(slots.length).toBeGreaterThan(0);
  });

  it('should detect blocked resources', async () => {
    const isAvailable = await availabilityService.isSlotAvailable({ /* ... */ });
    expect(isAvailable).toBe(false);
  });
});
```

### Integration Tests

Test complete workflows:

```typescript
describe('Multi-Resource Booking Flow', () => {
  it('should book appointment with all required resources', async () => {
    // Setup: Create schedules
    await createStaffSchedule();
    await createEquipmentSchedule();
    await createSpaceSchedule();

    // Action: Book appointment
    const appointment = await appointmentService.bookAppointment({ /* ... */ });

    // Assert: All resources allocated
    expect(appointment.resources).toHaveLength(3);
    expect(appointment.resources).toContainEqual(
      expect.objectContaining({ resourceType: 'staff' })
    );
  });
});
```

### End-to-End Tests

Test API endpoints:

```typescript
describe('POST /api/appointments', () => {
  it('should book appointment via API', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .send({
        patientId: 'patient-123',
        appointmentType: 'general_checkup',
        startTime: '2025-11-03T10:00:00Z',
        endTime: '2025-11-03T10:15:00Z'
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.resources).toBeDefined();
  });
});
```

---

## Deployment Checklist

- [ ] Run database migration `001_create_scheduling_tables.sql`
- [ ] Generate Prisma client with new models
- [ ] Seed appointment resource requirements
- [ ] Create initial staff schedules
- [ ] Create initial equipment schedules
- [ ] Create initial space schedules
- [ ] Configure approval workflows for resource blocks
- [ ] Set up notification system for confirmations/reminders
- [ ] Implement conflict resolution UI
- [ ] Add calendar visualization
- [ ] Configure timezone handling
- [ ] Set up monitoring for booking failures
- [ ] Create admin dashboard for schedule management
- [ ] Document API endpoints for frontend team
- [ ] Train staff on new scheduling system
- [ ] Migrate existing appointments to new system (if applicable)

---

## Support and Maintenance

### Common Issues

**Issue**: Double bookings occurring
**Solution**: Ensure conflict detection runs in transaction with proper isolation level

**Issue**: Schedules not appearing as available
**Solution**: Check `effective_from`/`effective_to` dates and `isAvailable` flag

**Issue**: Resource blocks not being respected
**Solution**: Verify `approvalStatus` is 'approved' and dates are correct

**Issue**: Recurring appointments creating too many records
**Solution**: Create occurrences on-demand or in batches rather than all upfront

### Monitoring Metrics

- Booking success rate
- Conflict detection accuracy
- Resource utilization percentage
- Average time to find available slot
- Approval workflow time
- Cancellation rate
- No-show rate

### Database Maintenance

```sql
-- Clean up old cancelled appointments (older than 1 year)
DELETE FROM appointment_resources
WHERE status = 'cancelled'
AND updated_at < NOW() - INTERVAL '1 year';

-- Archive completed appointment series
UPDATE appointment_series
SET status = 'completed'
WHERE end_date < CURRENT_DATE AND status = 'active';

-- Vacuum tables periodically
VACUUM ANALYZE staff_schedules;
VACUUM ANALYZE appointment_resources;
```

---

## Conclusion

This Multi-Resource Appointment Scheduling System provides a comprehensive solution for healthcare appointment management with support for:

- ✅ Complex multi-resource coordination
- ✅ Recurring schedules with exceptions
- ✅ Approval workflows for time-off requests
- ✅ Preparation and cleanup time management
- ✅ Recurring appointment series
- ✅ Robust conflict detection
- ✅ Multi-tenant and facility isolation

The system is designed to scale with your organization and can be extended with additional features such as:

- Waitlist management
- Patient preferences and history
- Resource cost tracking
- Analytics and reporting
- Integration with billing systems
- Mobile app support
- Calendar sync (Google Calendar, Outlook, etc.)

For implementation support and questions, refer to the service layer code examples and API documentation provided in this document.

---

**Document Version**: 1.0
**Last Updated**: 2025-10-29
**Author**: Zeal Development Team
