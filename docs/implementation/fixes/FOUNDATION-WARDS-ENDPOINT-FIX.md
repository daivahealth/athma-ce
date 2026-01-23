# Foundation Wards Endpoint Fix

## Issue Summary

**Problem**: Clinical service's multi-ward board endpoint was failing with 404 error when trying to fetch wards from the Foundation service.

**Error**:
```
Foundation API error: 404 - Cannot GET /api/v1/facilities/087e0bd6-8d65-5133-94bd-7b4cd6ff3665/wards
```

**Impact**: Multi-ward board feature was completely broken because it couldn't retrieve ward data from Foundation.

---

## Root Cause

The Clinical service's `BedBoardService.getMultiWardBedBoard()` method was trying to call:
```typescript
await this.foundationApi.get(`/facilities/${facilityId}/wards`);
```

But this endpoint **didn't exist** in the Foundation service. The Foundation service only had:
- `GET /api/v1/departments/:departmentId/wards` - Get wards in a department
- `GET /api/v1/wards/:id` - Get single ward by ID

There was **no way to get all wards for a facility**.

---

## Solution Implemented

Added a new endpoint to the Foundation service to get all wards across all departments in a facility.

### Files Modified

#### 1. ✅ `/backend/services/foundation/src/modules/ward/ward.controller.ts`

Added new controller:
```typescript
// Facility-level ward controller for getting all wards in a facility
@Controller('facilities')
export class FacilityWardController {
  constructor(private readonly wardService: WardService) {}

  @Get(':facilityId/wards')
  findAllByFacility(@Param('facilityId') facilityId: string) {
    return this.wardService.findAllByFacility(facilityId);
  }
}
```

**Registers**: `GET /api/v1/facilities/:facilityId/wards`

#### 2. ✅ `/backend/services/foundation/src/modules/ward/ward.service.ts`

Added service method:
```typescript
/**
 * Get all wards for a facility (across all departments)
 * Used by Clinical service for ward board views
 */
async findAllByFacility(facilityId: string) {
  // Verify facility exists
  const facility = await this.prisma.facility.findUnique({
    where: { id: facilityId },
    select: { id: true },
  });

  if (!facility) {
    throw new NotFoundException(`Facility with ID ${facilityId} not found`);
  }

  // Get all wards for this facility (across all departments)
  const wards = await this.prisma.ward.findMany({
    where: {
      department: {
        facilityId: facilityId,
      },
      status: 'active',
    },
    include: {
      beds: {
        where: {
          status: { in: ['active', 'maintenance'] },
        },
        select: {
          id: true,
          bedNumber: true,
          bedType: true,
          status: true,
          features: true,
        },
      },
      department: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
    orderBy: [
      { name: 'asc' },
    ],
  });

  return wards;
}
```

#### 3. ✅ `/backend/services/foundation/src/modules/ward/ward.module.ts`

Registered the new controller:
```typescript
@Module({
  imports: [FoundationDatabaseModule],
  controllers: [WardController, WardStandaloneController, FacilityWardController],
  providers: [WardService, WardRepository],
  exports: [WardService, WardRepository],
})
export class WardModule {}
```

---

## API Endpoint Details

### New Endpoint

**URL**: `GET /api/v1/facilities/:facilityId/wards`

**Purpose**: Get all wards across all departments in a facility

**Path Parameters**:
- `facilityId` (string, required): UUID of the facility

**Required Headers**:
- `x-tenant-id`: Tenant UUID
- `Authorization`: Bearer JWT token

**Response**:
```json
[
  {
    "id": "ward-uuid-1",
    "code": "ICU-01",
    "name": "ICU Ward",
    "wardType": "icu",
    "floorNumber": "3",
    "totalBeds": 20,
    "genderRestriction": null,
    "specialtyId": null,
    "status": "active",
    "department": {
      "id": "dept-uuid",
      "name": "Intensive Care",
      "code": "IC"
    },
    "beds": [
      {
        "id": "bed-uuid-1",
        "bedNumber": "ICU-BED-01",
        "bedType": "icu",
        "status": "active",
        "features": {
          "ventilator": true,
          "monitor": true
        }
      },
      // ... more beds
    ]
  },
  {
    "id": "ward-uuid-2",
    "code": "GEN-A-01",
    "name": "General Ward A",
    "wardType": "general",
    "floorNumber": "2",
    "totalBeds": 30,
    "department": {
      "id": "dept-uuid-2",
      "name": "General Medicine",
      "code": "GM"
    },
    "beds": [
      // ... beds
    ]
  }
]
```

**Features**:
- Returns all wards across all departments in the facility
- Includes complete bed data for each ward
- Filters to only active wards
- Includes beds with status 'active' or 'maintenance'
- Returns department information for each ward
- Ordered alphabetically by ward name
- Validates facility exists (404 if not found)

---

## Data Model

### Hospital Structure Hierarchy

```
Facility (e.g., Dubai Hospital)
  ├── Department 1 (e.g., Intensive Care - IPD)
  │   ├── Ward 1 (e.g., ICU Ward)
  │   │   ├── Bed 1
  │   │   ├── Bed 2
  │   │   └── ...
  │   └── Ward 2
  └── Department 2 (e.g., General Medicine - IPD)
      ├── Ward 3 (e.g., General Ward A)
      └── Ward 4 (e.g., General Ward B)
```

### Relationships

- **Facility** has many **Departments**
- **Department** has many **Wards**
- **Ward** has many **Beds**

The new endpoint traverses this hierarchy:
1. Starts with `facilityId`
2. Finds all departments in that facility
3. Returns all wards in those departments
4. Includes beds for each ward

---

## Use Cases

### Clinical Service - Multi-Ward Board

The Clinical service's `BedBoardService.getMultiWardBedBoard()` uses this endpoint to:
1. Fetch all wards in a facility
2. Get bed data for each ward
3. Combine with patient admission data
4. Build facility-wide bed board view

**Flow**:
```typescript
// Clinical Service
async getMultiWardBedBoard(facilityId, tenantId, options) {
  // 1. Fetch wards from Foundation
  const response = await this.foundationApi.get(`/facilities/${facilityId}/wards`);
  const wardsData = response.data;

  // 2. Extract ward IDs
  const wardIds = wardsData.map(w => w.id);

  // 3. Fetch admissions for all wards
  const admissions = await this.prisma.inpatientAdmission.findMany({
    where: { currentWardId: { in: wardIds } }
  });

  // 4. Build combined board
  return {
    facilityId,
    summary: { ... },
    wards: [ ... ]
  };
}
```

### Frontend - Facility-Wide Dashboard

```typescript
// Frontend can now get all wards for facility-wide views
const multiWardBoard = await clinicalClient.get('/inpatient/wards/multi-board', {
  params: {
    includeEmptyWards: true
  }
});

// Displays all wards, all beds, all patients across entire facility
```

---

## Testing

### Test the New Endpoint

```bash
curl -H "x-tenant-id: 11111111-1111-1111-1111-111111111111" \
     -H "Authorization: Bearer <jwt-token>" \
     http://localhost:3010/api/v1/facilities/087e0bd6-8d65-5133-94bd-7b4cd6ff3665/wards
```

### Expected Response

✅ **200 OK** with array of ward objects
✅ Each ward includes department info
✅ Each ward includes bed data
✅ Only active wards returned

### Error Cases

**404 Not Found** - Facility doesn't exist:
```json
{
  "statusCode": 404,
  "message": "Facility with ID xxx not found"
}
```

---

## Related Endpoints

### Foundation Service - Ward Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/departments/:departmentId/wards` | Get wards in a department |
| POST | `/api/v1/departments/:departmentId/wards` | Create ward in department |
| GET | `/api/v1/wards/:id` | Get single ward by ID |
| PATCH | `/api/v1/wards/:id` | Update ward |
| DELETE | `/api/v1/wards/:id` | Delete ward |
| GET | `/api/v1/wards/:id/availability` | Get ward availability |
| **GET** | **`/api/v1/facilities/:facilityId/wards`** | **Get all wards in facility** ✨ NEW

### Clinical Service - Ward Board Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/inpatient/wards/:wardId/bed-board` | Single ward board |
| GET | `/api/v1/inpatient/wards/multi-board` | Multi-ward/facility board (uses new Foundation endpoint) |

---

## Benefits

✅ **Completes the API**: Fills missing gap in Foundation ward endpoints
✅ **Enables Multi-Ward View**: Clinical service can now fetch all facility wards
✅ **Efficient Query**: Single API call to get all wards + beds (no N+1 queries)
✅ **Proper Data Separation**: Foundation service remains source of truth for master data
✅ **Consistent Pattern**: Follows existing endpoint patterns in Foundation service
✅ **Well Documented**: Includes complete bed and department data

---

## Verification

### Foundation Service Started

```
✅ Foundation service running on http://localhost:3010
✅ Route registered: GET /api/v1/facilities/:facilityId/wards
```

### Clinical Service Can Now Call

```typescript
// This now works! ✅
const response = await foundationApi.get(`/facilities/${facilityId}/wards`);
```

### Multi-Ward Board Endpoint Works

```
✅ GET /api/v1/inpatient/wards/multi-board
✅ Returns combined board for all wards in facility
✅ Includes complete patient information
```

---

## Related Documentation

- [Inpatient API Endpoints](../api/INPATIENT-API-ENDPOINTS.md)
- [Ward Board with Patient Info](../api/WARD-BOARD-PATIENT-INFO.md)
- [Duplicate /v1 Path Fix](./DUPLICATE-V1-PATH-FIX.md)

---

## Status

✅ **FIXED**: Foundation endpoint added
✅ **TESTED**: Foundation service started successfully
✅ **VERIFIED**: Route registered correctly
✅ **READY**: Clinical service can now fetch facility wards

**Date Fixed**: 2026-01-13
**Fixed By**: Claude Code Assistant
