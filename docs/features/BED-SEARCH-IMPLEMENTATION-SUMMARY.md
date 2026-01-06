# Bed Search Implementation Summary

## Overview
Implemented a comprehensive bed availability search system for inpatient admissions that separates master data (Foundation) from transactional data (Clinical) following microservices architecture principles.

## Architecture

### Service Separation
- **Foundation Service** (port 3010): Manages bed and ward master data
- **Clinical Service** (port 3011): Manages bed assignments and occupancy data

### Key Design Decisions
1. **Master Data Only in Foundation**: Beds and wards are master data with no transactional fields
2. **Occupancy in Clinical**: BedAssignment table tracks current occupancy with `releasedAt = NULL` indicating occupied
3. **Cross-Service Integration**: Clinical service calls Foundation API to enrich master data with occupancy status
4. **Race Condition Prevention**: Validation endpoint checks availability immediately before admission creation

## Database Schema Changes

### Foundation Database

#### Ward Model Updates
```prisma
model Ward {
  // New fields added:
  genderRestriction String?    @map("gender_restriction")    // male_only, female_only, mixed
  specialtyId       String?    @map("specialty_id")          // References Specialty table

  // Removed field:
  // availableBeds - Moved to calculated field based on Clinical occupancy
}
```

#### Bed Model Updates
```prisma
model Bed {
  // New master data fields:
  requiresIsolation Boolean  @default(false) @map("requires_isolation")
  isolationType     String?  @map("isolation_type")           // contact, droplet, airborne, protective
  genderRestriction String?  @map("gender_restriction")       // male_only, female_only, mixed
  maintenanceNotes  String?  @map("maintenance_notes")

  // Removed transactional fields:
  // currentPatientId - Moved to Clinical.BedAssignment
  // assignedAt       - Moved to Clinical.BedAssignment

  // Status now represents master data status only:
  status String @default("active")  // active, inactive, maintenance, decommissioned
}
```

### Clinical Database

#### BedAssignment Index
```prisma
@@index([tenantId, bedId, releasedAt], map: "idx_bed_assignments_occupancy")
```
Fast occupancy lookups: `WHERE releasedAt IS NULL` indicates currently occupied.

## API Endpoints

### 1. Search Available Beds
**Endpoint**: `GET /api/v1/beds/search-available`

**Query Parameters**:
- `facilityId` (required): UUID of facility
- `wardId` (optional): Filter by specific ward
- `bedType` (optional): icu, general, isolation, pediatric, maternity
- `genderRestriction` (optional): male_only, female_only, mixed
- `requiresIsolation` (optional): boolean
- `requiredFeatures` (optional): Array of required features
- `patientGender` (optional): Auto-match to appropriate gender-restricted beds
- `specialtyId` (optional): Filter by specialty

**Response**:
```json
{
  "data": [
    {
      "bedId": "uuid",
      "bedNumber": "GEN-A-01",
      "bedType": "general",
      "features": {
        "oxygen": true,
        "iv_pole": true,
        "cardiac_monitor": true
      },
      "requiresIsolation": false,
      "isolationType": null,
      "ward": {
        "id": "uuid",
        "name": "General Ward A - Male",
        "wardType": "general",
        "genderRestriction": "male_only",
        "specialtyName": "General Medicine"
      },
      "facility": {
        "id": "uuid",
        "name": "Zeal Main Hospital"
      },
      "isOccupied": false,
      "isAvailable": true,
      "occupancyStatus": "available",
      "occupiedSince": null
    }
  ],
  "meta": {
    "total": 109,
    "available": 109,
    "occupied": 0,
    "maintenance": 0
  }
}
```

### 2. Validate Bed Availability
**Endpoint**: `POST /api/v1/beds/validate-availability`

**Request Body**:
```json
{
  "bedId": "165e3bee-a42f-5e95-9546-db872c5dc052"
}
```

**Response**:
```json
{
  "isAvailable": true,
  "bedId": "165e3bee-a42f-5e95-9546-db872c5dc052",
  "bedNumber": "GEN-A-01",
  "ward": {
    "id": "uuid",
    "name": "General Ward A - Male",
    "wardType": "general",
    "floorNumber": "4"
  }
}
```

## Service Implementation

### Foundation Service Updates

**Files Modified**:
- `bed.service.ts`: Removed patient assignment logic, kept only master data operations
- `bed.repository.ts`: Enhanced `findAvailable()` with filtering by bedType, genderRestriction, requiresIsolation
- `bed.controller.ts`: Simplified to master data CRUD only
- `ward.service.ts`: Added support for genderRestriction and specialtyId
- `ward.repository.ts`: Updated to include specialty relationship
- DTOs updated with new enums: `GenderRestriction`, `IsolationType`, `BedStatus`

### Clinical Service - New Module

**Created Files**:

1. **bed-search.module.ts**: New module for bed search functionality
2. **bed-search.service.ts**: Core service implementing:
   - `searchAvailableBeds()`: Fetches beds from Foundation, enriches with Clinical occupancy
   - `validateBedAvailability()`: Real-time validation before assignment
   - Foundation API integration using Axios
3. **bed-search.controller.ts**: REST endpoints
4. **DTOs**:
   - `search-beds.dto.ts`: Search parameters with validation
   - `validate-bed.dto.ts`: Validation request
5. **Types**:
   - `bed-search.types.ts`: TypeScript interfaces for responses

**Key Service Logic**:
```typescript
async searchAvailableBeds(dto: SearchBedsDto, context) {
  // 1. Fetch bed master data from Foundation API
  const beds = await this.foundationApi.get('/beds/available', { params });

  // 2. Apply filters (facility, specialty, features)

  // 3. Get current occupancy from Clinical database
  const occupiedBeds = await this.prisma.bedAssignment.findMany({
    where: { bedId: { in: bedIds }, releasedAt: null }
  });

  // 4. Enrich beds with occupancy status
  // 5. Filter out occupied/maintenance beds

  return { data: availableBeds, meta: { total, available, occupied, maintenance } };
}
```

### Admission Service Integration

**Updated**: `admission.service.ts:60-72`

```typescript
// Validate bed availability before creating admission
if (dto.initialBedId) {
  const bedValidation = await this.bedSearchService.validateBedAvailability(
    { bedId: dto.initialBedId },
    { tenantId, userId, facilityId }
  );

  if (!bedValidation.isAvailable) {
    throw new BadRequestException(
      bedValidation.error || 'Bed is not available for assignment'
    );
  }
}
```

## Seed Data Updates

### Foundation Seed Files

**09-wards.sql**: Updated to include:
- `gender_restriction` column (male_only, female_only, mixed)
- `specialty_id` foreign key references
- Example: General Ward A = male_only, General Ward B = female_only, Maternity = female_only

**10-beds.sql**: Updated to include:
- `requires_isolation` column
- `isolation_type` column (airborne for ISO-1 beds)
- `gender_restriction` column (inherited from ward)
- Removed `current_patient_id` and `assigned_at` columns

Total beds seeded: **109 beds**
- ICU-1: 10 beds (mixed gender, with ventilators)
- ICU-2: 8 beds (mixed)
- NICU-1: 6 beds (mixed, pediatric)
- PICU-1: 5 beds (mixed, pediatric)
- GEN-A: 20 beds (male_only)
- GEN-B: 20 beds (female_only)
- GEN-C: 20 beds (mixed)
- ISO-1: 5 beds (mixed, airborne isolation)
- MAT-1: 15 beds (female_only, maternity)

## Testing Results

### Test 1: All Available Beds
```bash
GET /api/v1/beds/search-available?facilityId=087e0bd6-8d65-5133-94bd-7b4cd6ff3665
Response: 109 total beds, all available
```

### Test 2: Gender Filter (Female Only)
```bash
GET /api/v1/beds/search-available?facilityId=...&genderRestriction=female_only
Response: 35 beds (20 General B + 15 Maternity)
```

### Test 3: Bed Type Filter (ICU)
```bash
GET /api/v1/beds/search-available?facilityId=...&bedType=icu
Response: 24 beds (10 ICU-1 + 8 ICU-2 + 6 NICU-1)
```

### Test 4: Isolation Filter
```bash
GET /api/v1/beds/search-available?facilityId=...&requiresIsolation=true
Response: 5 beds (ISO-1 ward, airborne isolation)
```

### Test 5: Bed Validation
```bash
POST /api/v1/beds/validate-availability
Body: {"bedId": "165e3bee-a42f-5e95-9546-db872c5dc052"}
Response: {"isAvailable": true, "bedNumber": "GEN-A-01"}
```

## Services Status

Both services are running successfully:
- **Foundation Service**: http://localhost:3010 ✅
- **Clinical Service**: http://localhost:3011 ✅

Foundation API client in Clinical service: `http://localhost:3010` (configured via environment variable `FOUNDATION_SERVICE_URL`)

## Key Features Delivered

✅ View all beds irrespective of ward selection
✅ Ward filter always available
✅ Gender-specific ward filtering
✅ No special permissions needed for ICU/General assignment
✅ Conflict handling with error and forced re-selection
✅ Master data in Foundation, transactional data in Clinical
✅ Real-time occupancy status
✅ Rich filtering (bed type, isolation, features, specialty)
✅ Race condition prevention with validation endpoint
✅ Comprehensive API responses with metadata

## Next Steps (Optional Enhancements)

1. **Frontend Integration**: Build UI components for bed selection during admission
2. **Real-Time Updates**: Add WebSocket support for live bed status changes
3. **Bed Transfer**: Implement patient transfer between beds
4. **Maintenance Scheduling**: Add maintenance window management
5. **Analytics Dashboard**: Ward utilization, bed turnover rates
6. **Notification System**: Alert staff when beds become available

## Files Modified/Created

### Foundation Service
- `prisma/schema.prisma` (Ward, Bed models)
- `src/modules/bed/bed.service.ts`
- `src/modules/bed/bed.repository.ts`
- `src/modules/bed/bed.controller.ts`
- `src/modules/bed/dto/*.ts`
- `src/modules/ward/ward.service.ts`
- `src/modules/ward/ward.repository.ts`
- `src/modules/ward/dto/*.ts`
- `src/modules/department/department.repository.ts`

### Clinical Service
- `prisma/schema.prisma` (BedAssignment index)
- `src/modules/bed-search/` (new module)
  - `bed-search.module.ts`
  - `bed-search.service.ts`
  - `bed-search.controller.ts`
  - `dto/search-beds.dto.ts`
  - `dto/validate-bed.dto.ts`
  - `types/bed-search.types.ts`
- `src/modules/inpatient/admission.service.ts` (validation integration)
- `src/app.module.ts` (register BedSearchModule)

### Database Seeds
- `seed/foundation/09-wards.sql`
- `seed/foundation/10-beds.sql`

### Documentation
- `docs/features/BED-SEARCH-IMPLEMENTATION-SUMMARY.md` (this file)

## Conclusion

The bed search system is fully implemented, tested, and operational. It successfully separates concerns between master data and transactional data while providing a rich, filterable bed search experience for inpatient admissions with real-time occupancy tracking.
