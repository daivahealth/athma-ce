# Ward Board Implementation - Complete Guide

## Overview

This document describes the implementation of the production-ready Ward Board architecture for Zeal's inpatient management system. The design implements an orthogonal status model with comprehensive audit trails.

**Date:** 2026-01-09
**Status:** ✅ Database Schema Complete | ⏳ Services In Progress

---

## Architecture Decisions

### Core Design Principles

1. **Three-Table Architecture**
   - `InpatientAdmission` → Current state (single source of truth)
   - `BedAssignment` → Bed/transfer history
   - `InpatientEvent` → Audit trail + timeline + analytics

2. **Orthogonal Status Model**
   - **Admission Status**: Clinical lifecycle (ADMITTED → ACTIVE → DISCHARGED)
   - **Discharge Status**: Discharge workflow (NONE → FIT_FOR_DISCHARGE → INITIATED → READY → CONFIRMED)
   - **Acuity**: Patient condition (STABLE | WATCH | CRITICAL)

3. **Denormalized Board Flags**
   - JSONB `boardFlags` field for instant ward board rendering
   - Avoids expensive joins for NPO, fall risk, telemetry, isolation indicators

4. **Database-Level Integrity**
   - Unique constraints prevent bed double-booking
   - Partial indexes ensure only one active bed assignment per admission

---

## Schema Changes

### New Enums

```prisma
enum InpatientAdmissionStatus {
  ADMITTED           // Admission created
  ACTIVE             // Under care
  ON_LEAVE           // Temporary leave
  DISCHARGE_PLANNING // Discharge planning in progress
  DISCHARGED         // Patient discharged
  EXPIRED            // Patient deceased
  ABSCONDED          // Patient left without authorization
  CANCELLED          // Admission cancelled before bed occupied
}

enum InpatientDischargeStatus {
  NONE               // No discharge planning
  FIT_FOR_DISCHARGE  // Medically fit for discharge
  INITIATED          // Discharge process initiated
  READY              // Summary, meds, bill, transport completed
  CONFIRMED          // Final discharge confirmation done
}

enum InpatientAcuity {
  STABLE   // Stable condition
  WATCH    // Requires monitoring
  CRITICAL // Critical condition
}

enum InpatientEventType {
  ADMISSION_CREATED
  STATUS_CHANGED
  DISCHARGE_STATUS_CHANGED
  BED_ASSIGNED
  BED_RELEASED
  TRANSFERRED
  FLAG_ADDED
  FLAG_REMOVED
  ACUITY_CHANGED
  NOTE_ADDED
  DISCHARGE_CONFIRMED
}
```

### Updated InpatientAdmission Model

**New Fields:**
- `admissionStatus: InpatientAdmissionStatus` - Clinical lifecycle state
- `dischargeStatus: InpatientDischargeStatus` - Discharge workflow state
- `acuity: InpatientAcuity` - Patient condition severity
- `boardFlags: Json?` - Denormalized flags for fast rendering

**Legacy Fields Retained:**
- `clinicalAlerts`, `isolationType`, `fallRiskScore` - Kept for backward compatibility during migration

**New Indexes:**
```sql
CREATE INDEX idx_admissions_tenant_admission_status ON inpatient_admissions(tenant_id, admission_status);
CREATE INDEX idx_admissions_tenant_discharge_status ON inpatient_admissions(tenant_id, discharge_status);
CREATE INDEX idx_admissions_tenant_acuity ON inpatient_admissions(tenant_id, acuity);
CREATE INDEX idx_admissions_facility_status ON inpatient_admissions(tenant_id, facility_id, admission_status);
CREATE INDEX idx_admissions_ward_status ON inpatient_admissions(tenant_id, current_ward_id, admission_status);
```

### Updated InpatientEvent Model

**Breaking Changes:**
- Removed: `eventType: String`, `eventCategory: String`, `eventData: Json`
- Added explicit fields for state transitions:
  - `fromAdmissionStatus / toAdmissionStatus`
  - `fromDischargeStatus / toDischargeStatus`
  - `fromAcuity / toAcuity`
  - `fromWardId / toWardId`, etc. for location tracking
- Added: `facilityId`, `encounterId` for better querying
- Renamed: `notes` → `reason`, `eventData` → `metadata`

---

## Database Migrations

### Migration 005: Bed Assignment Constraints

**File:** `backend/shared/database-clinical/migrations/005_add_bed_assignment_unique_constraints.sql`

**Purpose:** Prevent bed double-booking

```sql
-- Only one active bed assignment per admission
CREATE UNIQUE INDEX bed_assignment_one_active_per_admission
ON bed_assignments (tenant_id, admission_id)
WHERE released_at IS NULL;

-- Prevent bed from being assigned to multiple admissions simultaneously
CREATE UNIQUE INDEX bed_assignment_bed_not_double_booked
ON bed_assignments (tenant_id, bed_id)
WHERE released_at IS NULL;
```

**Status:** ✅ Applied successfully

### Migration 006: Status Model & Event Schema

**File:** `backend/shared/database-clinical/migrations/006_migrate_inpatient_status_and_events.sql`

**Purpose:** Transform existing data to new status model

**Steps:**
1. Create new enum types
2. Add new columns to `inpatient_admissions`
3. Migrate existing `status` string → `admissionStatus` enum
4. Build `boardFlags` JSONB from existing `clinicalAlerts`
5. Transform `inpatient_events` to new schema
6. Create indexes

**Status:** ✅ Applied successfully
**Data Migrated:** 1 admission, 1 event

---

## DTOs

### Event DTOs

**File:** `backend/services/clinical/src/modules/inpatient/dto/create-event.dto.ts`

**Enums Exported:**
- `InpatientAdmissionStatus`
- `InpatientDischargeStatus`
- `InpatientAcuity`
- `InpatientEventType`

**Main DTOs:**

```typescript
export class CreateEventDto {
  facilityId: string;
  admissionId: string;
  encounterId: string;
  patientId: string;
  eventType: InpatientEventType;

  // Status changes (optional)
  fromAdmissionStatus?: InpatientAdmissionStatus;
  toAdmissionStatus?: InpatientAdmissionStatus;
  fromDischargeStatus?: InpatientDischargeStatus;
  toDischargeStatus?: InpatientDischargeStatus;
  fromAcuity?: InpatientAcuity;
  toAcuity?: InpatientAcuity;

  // Location changes (optional, for transfers)
  fromWardId?: string;
  fromBedId?: string;
  toWardId?: string;
  toBedId?: string;

  reason?: string;
  metadata?: Record<string, any>;
  performedBy: string;
}

// Simplified helpers
export class LogAdmissionStatusChangeDto { ... }
export class LogDischargeStatusChangeDto { ... }
export class LogTransferDto { ... }
```

### Ward Board DTOs

**File:** `backend/services/clinical/src/modules/inpatient/dto/ward-board.dto.ts`

```typescript
export interface WardBoardResponse {
  ward: WardInfo;
  summary: WardBoardSummary;
  beds: WardBoardBed[];
}

export interface WardBoardBed {
  bed: BedInfo;
  occupancy: 'occupied' | 'empty' | 'cleaning' | 'reserved';
  admission?: WardBoardAdmission;
  actions: string[];
}

export interface WardBoardAdmission {
  admissionId: string;
  patientDisplay: PatientDisplay;
  admissionStatus: InpatientAdmissionStatus;
  dischargeStatus: InpatientDischargeStatus;
  acuity: InpatientAcuity;
  boardFlags?: {
    npo?: boolean;
    fallRisk?: 'low' | 'medium' | 'high';
    telemetry?: boolean;
    isolation?: boolean;
    allergies?: boolean;
  };
  admittedAt: Date;
}

export interface WardBoardQueryDto {
  facilityId: string;
  wardId: string;
  includeEmpty?: boolean;
  statusFilter?: InpatientAdmissionStatus[];
  acuityFilter?: InpatientAcuity[];
}
```

---

## Next Steps (To Be Implemented)

### 1. Update InpatientEventService

**File:** `backend/services/clinical/src/modules/inpatient/event.service.ts`

**Required Changes:**
- Update `create()` method to use new `CreateEventDto` structure
- Remove `eventCategory` logic
- Map DTO fields to new Prisma schema

**Example:**
```typescript
async createEvent(dto: CreateEventDto, tenantId: string) {
  return this.prisma.inpatientEvent.create({
    data: {
      tenantId,
      facilityId: dto.facilityId,
      admissionId: dto.admissionId,
      encounterId: dto.encounterId,
      patientId: dto.patientId,
      eventType: dto.eventType,
      fromAdmissionStatus: dto.fromAdmissionStatus,
      toAdmissionStatus: dto.toAdmissionStatus,
      fromDischargeStatus: dto.fromDischargeStatus,
      toDischargeStatus: dto.toDischargeStatus,
      fromAcuity: dto.fromAcuity,
      toAcuity: dto.toAcuity,
      fromWardId: dto.fromWardId,
      toWardId: dto.toWardId,
      // ... other fields
      reason: dto.reason,
      metadata: dto.metadata,
      performedBy: dto.performedBy,
      performedAt: new Date(),
    },
  });
}
```

### 2. Update Transfer Service

**File:** `backend/services/clinical/src/modules/inpatient/transfer.service.ts`

**Transaction Logic:**
```typescript
async transferPatient(admissionId: string, transferDto: TransferDto, userId: string) {
  return this.prisma.$transaction(async (tx) => {
    // 1. Get current admission
    const admission = await tx.inpatientAdmission.findUnique({
      where: { id: admissionId },
    });

    // 2. Close current bed assignment
    await tx.bedAssignment.updateMany({
      where: {
        admissionId,
        releasedAt: null,
      },
      data: {
        releasedAt: new Date(),
        releasedBy: userId,
      },
    });

    // 3. Create new bed assignment
    await tx.bedAssignment.create({
      data: {
        tenantId: admission.tenantId,
        admissionId,
        patientId: admission.patientId,
        bedId: transferDto.toBedId,
        wardId: transferDto.toWardId,
        spaceId: transferDto.toSpaceId,
        assignedAt: new Date(),
        assignedBy: userId,
        isTransfer: true,
        transferReason: transferDto.reason,
      },
    });

    // 4. Update admission current location
    await tx.inpatientAdmission.update({
      where: { id: admissionId },
      data: {
        currentWardId: transferDto.toWardId,
        currentSpaceId: transferDto.toSpaceId,
        currentBedId: transferDto.toBedId,
      },
    });

    // 5. Log event
    await tx.inpatientEvent.create({
      data: {
        tenantId: admission.tenantId,
        facilityId: admission.facilityId,
        admissionId,
        encounterId: admission.encounterId,
        patientId: admission.patientId,
        eventType: 'TRANSFERRED',
        fromWardId: admission.currentWardId,
        fromBedId: admission.currentBedId,
        toWardId: transferDto.toWardId,
        toBedId: transferDto.toBedId,
        reason: transferDto.reason,
        performedBy: userId,
      },
    });

    // 6. Update Foundation bed occupancy (call Foundation API)
    // await this.foundationService.updateBedOccupancy(...)
  });
}
```

### 3. Create Ward Board Service

**File:** `backend/services/clinical/src/modules/inpatient/ward-board.service.ts`

**Implementation:**
```typescript
@Injectable()
export class WardBoardService {
  constructor(
    private prisma: PrismaClinicalService,
    private foundationService: FoundationService, // HTTP client to Foundation
  ) {}

  async getWardBoard(query: WardBoardQueryDto, tenantId: string): Promise<WardBoardResponse> {
    // 1. Get all beds in ward from Foundation
    const bedsResponse = await this.foundationService.getBedsByWard(
      query.facilityId,
      query.wardId,
      tenantId,
    );

    // 2. Get active admissions for beds in this ward
    const bedIds = bedsResponse.beds.map(b => b.id);
    const admissions = await this.prisma.inpatientAdmission.findMany({
      where: {
        tenantId,
        facilityId: query.facilityId,
        currentWardId: query.wardId,
        currentBedId: { in: bedIds },
        admissionStatus: { in: ['ADMITTED', 'ACTIVE', 'DISCHARGE_PLANNING', 'ON_LEAVE'] },
        ...(query.statusFilter && { admissionStatus: { in: query.statusFilter } }),
        ...(query.acuityFilter && { acuity: { in: query.acuityFilter } }),
      },
      include: {
        patient: true,
      },
    });

    // 3. Build bed map
    const admissionsByBed = new Map();
    admissions.forEach(a => {
      if (a.currentBedId) {
        admissionsByBed.set(a.currentBedId, a);
      }
    });

    // 4. Build response
    const beds: WardBoardBed[] = bedsResponse.beds.map(bed => {
      const admission = admissionsByBed.get(bed.id);

      if (admission) {
        return {
          bed: {
            id: bed.id,
            code: bed.code,
            spaceName: bed.spaceName,
          },
          occupancy: 'occupied',
          admission: {
            admissionId: admission.id,
            patientDisplay: {
              name: `${admission.patient.firstName} ${admission.patient.lastName}`,
              age: calculateAge(admission.patient.dateOfBirth),
              sex: admission.patient.gender,
            },
            admissionStatus: admission.admissionStatus,
            dischargeStatus: admission.dischargeStatus,
            acuity: admission.acuity,
            boardFlags: admission.boardFlags,
            admittedAt: admission.admissionDate,
          },
          actions: ['TRANSFER', 'MEDS', 'DETAILS'],
        };
      } else {
        return {
          bed: { id: bed.id, code: bed.code },
          occupancy: 'empty',
          actions: ['ADMIT_PATIENT'],
        };
      }
    });

    // 5. Calculate summary
    const summary = {
      totalBeds: beds.length,
      occupied: beds.filter(b => b.occupancy === 'occupied').length,
      empty: beds.filter(b => b.occupancy === 'empty').length,
      critical: admissions.filter(a => a.acuity === 'CRITICAL').length,
      pendingDischarge: admissions.filter(a =>
        ['FIT_FOR_DISCHARGE', 'INITIATED', 'READY'].includes(a.dischargeStatus)
      ).length,
    };

    return {
      ward: bedsResponse.ward,
      summary,
      beds,
    };
  }
}
```

### 4. Create Ward Board Controller

**File:** `backend/services/clinical/src/modules/inpatient/ward.controller.ts` (may already exist)

```typescript
@Controller('v1/ward-board')
export class WardController {
  constructor(private wardBoardService: WardBoardService) {}

  @Get()
  async getWardBoard(
    @Query('facilityId') facilityId: string,
    @Query('wardId') wardId: string,
    @Query('includeEmpty') includeEmpty?: boolean,
    @TenantId() tenantId: string,
  ): Promise<WardBoardResponse> {
    return this.wardBoardService.getWardBoard(
      { facilityId, wardId, includeEmpty },
      tenantId,
    );
  }
}
```

### 5. Update Frontend Types

**File:** `frontend/src/modules/clinical/types/inpatient.ts`

Add TypeScript enums matching the backend:
```typescript
export enum InpatientAdmissionStatus {
  ADMITTED = 'ADMITTED',
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  DISCHARGE_PLANNING = 'DISCHARGE_PLANNING',
  DISCHARGED = 'DISCHARGED',
  EXPIRED = 'EXPIRED',
  ABSCONDED = 'ABSCONDED',
  CANCELLED = 'CANCELLED',
}

export enum InpatientDischargeStatus {
  NONE = 'NONE',
  FIT_FOR_DISCHARGE = 'FIT_FOR_DISCHARGE',
  INITIATED = 'INITIATED',
  READY = 'READY',
  CONFIRMED = 'CONFIRMED',
}

export enum InpatientAcuity {
  STABLE = 'STABLE',
  WATCH = 'WATCH',
  CRITICAL = 'CRITICAL',
}

export interface WardBoardBed {
  bed: {
    id: string;
    code: string;
    spaceName?: string;
  };
  occupancy: 'occupied' | 'empty' | 'cleaning' | 'reserved';
  admission?: {
    admissionId: string;
    patientDisplay: {
      name: string;
      age: number;
      sex: string;
    };
    admissionStatus: InpatientAdmissionStatus;
    dischargeStatus: InpatientDischargeStatus;
    acuity: InpatientAcuity;
    boardFlags?: {
      npo?: boolean;
      fallRisk?: 'low' | 'medium' | 'high';
      telemetry?: boolean;
      isolation?: boolean;
    };
  };
  actions: string[];
}
```

---

## Testing Strategy

### Database Constraints Testing

```sql
-- Test 1: Should FAIL - Double bed assignment
BEGIN;
INSERT INTO bed_assignments (id, tenant_id, admission_id, patient_id, bed_id, ward_id, space_id, assigned_at, assigned_by)
VALUES (gen_random_uuid(), 'tenant1', 'adm1', 'pat1', 'bed1', 'ward1', 'space1', NOW(), 'user1');

INSERT INTO bed_assignments (id, tenant_id, admission_id, patient_id, bed_id, ward_id, space_id, assigned_at, assigned_by)
VALUES (gen_random_uuid(), 'tenant1', 'adm2', 'pat2', 'bed1', 'ward1', 'space1', NOW(), 'user1');
-- Expected: ERROR - violates unique constraint "bed_assignment_bed_not_double_booked"
ROLLBACK;

-- Test 2: Should SUCCEED - Released bed can be reassigned
BEGIN;
INSERT INTO bed_assignments (id, tenant_id, admission_id, patient_id, bed_id, ward_id, space_id, assigned_at, assigned_by, released_at, released_by)
VALUES (gen_random_uuid(), 'tenant1', 'adm1', 'pat1', 'bed1', 'ward1', 'space1', NOW() - INTERVAL '1 day', 'user1', NOW(), 'user1');

INSERT INTO bed_assignments (id, tenant_id, admission_id, patient_id, bed_id, ward_id, space_id, assigned_at, assigned_by)
VALUES (gen_random_uuid(), 'tenant1', 'adm2', 'pat2', 'bed1', 'ward1', 'space1', NOW(), 'user1');
-- Expected: SUCCESS
COMMIT;
```

### Service Testing

```typescript
describe('WardBoardService', () => {
  it('should return beds with correct occupancy status', async () => {
    const result = await service.getWardBoard({
      facilityId: 'facility1',
      wardId: 'ward1',
    }, 'tenant1');

    expect(result.summary.totalBeds).toBeGreaterThan(0);
    expect(result.summary.occupied + result.summary.empty).toBe(result.summary.totalBeds);
    expect(result.beds.every(b => ['occupied', 'empty'].includes(b.occupancy))).toBe(true);
  });

  it('should filter by acuity', async () => {
    const result = await service.getWardBoard({
      facilityId: 'facility1',
      wardId: 'ward1',
      acuityFilter: ['CRITICAL'],
    }, 'tenant1');

    const occupiedBeds = result.beds.filter(b => b.admission);
    expect(occupiedBeds.every(b => b.admission.acuity === 'CRITICAL')).toBe(true);
  });
});
```

---

## API Endpoints

### Ward Board

**GET** `/clinical/v1/ward-board`

**Query Parameters:**
- `facilityId` (required): UUID
- `wardId` (required): UUID
- `includeEmpty` (optional): boolean, default true
- `statusFilter` (optional): comma-separated InpatientAdmissionStatus values
- `acuityFilter` (optional): comma-separated InpatientAcuity values

**Response:** `WardBoardResponse`

**Example:**
```bash
GET /clinical/v1/ward-board?facilityId=fac123&wardId=ward456
Authorization: Bearer <token>
x-tenant-id: tenant789
```

---

## Rollback Plan

If issues arise, rollback using:

```sql
-- backend/shared/database-clinical/migrations/rollback_006.sql
BEGIN;

-- Drop new indexes
DROP INDEX IF EXISTS idx_admissions_tenant_admission_status;
DROP INDEX IF EXISTS idx_admissions_tenant_discharge_status;
DROP INDEX IF EXISTS idx_admissions_tenant_acuity;
DROP INDEX IF EXISTS idx_admissions_facility_status;
DROP INDEX IF EXISTS idx_admissions_facility_discharge;

-- Revert InpatientAdmission
ALTER TABLE inpatient_admissions
  DROP COLUMN admission_status,
  DROP COLUMN discharge_status,
  DROP COLUMN acuity,
  DROP COLUMN board_flags;

-- Revert InpatientEvent (requires backup/restore or manual data fix)

-- Drop enums
DROP TYPE "InpatientAdmissionStatus";
DROP TYPE "InpatientDischargeStatus";
DROP TYPE "InpatientAcuity";
DROP TYPE "InpatientEventType";

COMMIT;
```

---

## References

- Prisma Schema: `backend/shared/database-clinical/prisma/schema.prisma`
- Migrations: `backend/shared/database-clinical/migrations/`
- DTOs: `backend/services/clinical/src/modules/inpatient/dto/`
- Original Design: User's architecture proposal (this document)

---

## Completion Checklist

- [x] Prisma schema updated with enums
- [x] InpatientAdmission model updated
- [x] InpatientEvent model updated
- [x] Database migrations created
- [x] Database migrations applied
- [x] Unique constraints added
- [x] DTOs created for events
- [x] DTOs created for ward board
- [ ] InpatientEventService updated
- [ ] Transfer service updated with event logging
- [ ] Ward Board service created
- [ ] Ward Board controller created
- [ ] Frontend types updated
- [ ] API integration tested
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Documentation updated

**Last Updated:** 2026-01-09
