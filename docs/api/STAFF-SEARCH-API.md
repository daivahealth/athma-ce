# Staff Search API

**Service:** Foundation
**Endpoint:** `GET /staff/search`
**Version:** 1.0
**Last Updated:** January 2026

---

## Overview

The Staff Search API provides comprehensive search and filtering capabilities for healthcare staff members. This endpoint allows searching by display name and filtering by staff type, specialty, facility, and status with pagination support.

---

## Endpoint

```
GET /staff/search
```

**Base URL:** `http://localhost:3010/api/v1`

---

## Authentication

**Required Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `x-tenant-id: <TENANT_UUID>` (or provide as query parameter)

---

## Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `tenantId` | UUID | Yes* | Tenant identifier (can use x-tenant-id header instead) | `223e4567-e89b-12d3-a456-426614174000` |
| `displayName` | string | No | Search by staff display name (case-insensitive partial match) | `Dr. Ahmed` |
| `staffType` | enum | No | Filter by staff type | `physician` |
| `status` | string | No | Filter by status (default: `active`) | `active` |
| `specialtyId` | UUID | No | Filter by specialty UUID | `323e4567-e89b-12d3-a456-426614174000` |
| `facilityId` | UUID | No | Filter by facility UUID | `423e4567-e89b-12d3-a456-426614174000` |
| `limit` | integer | No | Page size (1-100, default: 20) | `20` |
| `offset` | integer | No | Pagination offset (default: 0) | `0` |

**Staff Type Enum Values:**
- `physician`
- `nurse`
- `technician`
- `pharmacist`
- `administrative`
- `support`
- `other`

---

## Request Examples

### Example 1: Search by Display Name

```bash
GET /staff/search?displayName=Ahmed&limit=10
```

**Description:** Find all staff whose display name contains "Ahmed" (case-insensitive)

### Example 2: Filter by Staff Type

```bash
GET /staff/search?staffType=physician&limit=20
```

**Description:** Get all active physicians

### Example 3: Search Physicians with Specific Specialty

```bash
GET /staff/search?staffType=physician&specialtyId=323e4567-e89b-12d3-a456-426614174000
```

**Description:** Find all physicians with cardiology specialty

### Example 4: Search Staff at Specific Facility

```bash
GET /staff/search?facilityId=423e4567-e89b-12d3-a456-426614174000&displayName=Sara
```

**Description:** Find staff named Sara at a specific facility

### Example 5: Pagination

```bash
GET /staff/search?limit=20&offset=40
```

**Description:** Get page 3 of staff members (20 per page)

---

## Response Format

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "tenantId": "223e4567-e89b-12d3-a456-426614174000",
      "prefix": "Dr.",
      "firstName": "Ahmed",
      "middleName": "Mohamed",
      "lastName": "Hassan",
      "displayName": "Dr. Ahmed Mohamed Hassan",
      "dateOfBirth": "1985-05-15",
      "gender": "male",
      "nationality": "UAE",
      "phoneNumber": "+971501234567",
      "email": "ahmed.hassan@hospital.ae",
      "employeeId": "EMP001",
      "staffType": "physician",
      "licenseNumber": "DHA-12345",
      "licenseExpiry": "2026-12-31",
      "qualification": "MBBS, MD",
      "languages": ["en", "ar"],
      "status": "active",
      "createdAt": "2025-01-01T08:00:00Z",
      "updatedAt": "2025-01-15T10:30:00Z",
      "staffSpecialties": [
        {
          "facilityId": "423e4567-e89b-12d3-a456-426614174000",
          "primaryFlag": true,
          "specialty": {
            "id": "323e4567-e89b-12d3-a456-426614174000",
            "code": "CARDIO",
            "name": "Cardiology"
          }
        },
        {
          "facilityId": "423e4567-e89b-12d3-a456-426614174000",
          "primaryFlag": false,
          "specialty": {
            "id": "324e4567-e89b-12d3-a456-426614174000",
            "code": "INTMED",
            "name": "Internal Medicine"
          }
        }
      ]
    }
  ],
  "meta": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Response Fields

**Staff Object:**
- `id` - Staff UUID
- `displayName` - Formatted display name (e.g., "Dr. Ahmed Hassan")
- `firstName`, `lastName`, `middleName` - Name components
- `prefix` - Title prefix (Dr., Mr., Ms., etc.)
- `employeeId` - Employee ID (unique per tenant)
- `staffType` - Staff category
- `email` - Contact email
- `phoneNumber` - Contact phone
- `licenseNumber` - Professional license number
- `licenseExpiry` - License expiration date
- `qualification` - Professional qualifications
- `languages` - Array of language codes (ISO 639-1)
- `status` - Current status (active, inactive)
- `staffSpecialties` - Array of specialty assignments with facility context

**Metadata Object:**
- `total` - Total number of matching staff members
- `limit` - Current page size
- `offset` - Current pagination offset
- `hasMore` - Boolean indicating if more results exist

---

## Error Responses

### 400 Bad Request

**Missing Tenant ID:**
```json
{
  "statusCode": 400,
  "message": "tenantId is required (provide ?tenantId= or x-tenant-id header)",
  "error": "Bad Request"
}
```

**Invalid Enum Value:**
```json
{
  "statusCode": 400,
  "message": "staffType must be one of: physician, nurse, technician, pharmacist, administrative, support, other",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## Search Behavior

### Display Name Search
- **Case-Insensitive:** Search is not case-sensitive
- **Partial Match:** Matches anywhere in the display name
- **Example:** Searching "ahmed" will match "Dr. Ahmed Hassan", "Ahmed Ali", "Mohamed Ahmed"

### Staff Type Filter
- **Exact Match:** Must match one of the enum values
- **Case-Sensitive:** Use lowercase values

### Specialty Filter
- **Related Filter:** Uses `staffSpecialties` relation
- **Multiple Specialties:** Returns staff if ANY specialty matches
- **Facility Context:** Specialty assignments are facility-specific

### Facility Filter
- **Related Filter:** Uses `staffSpecialties` relation
- **Combined with Specialty:** Can combine both filters

### Status Filter
- **Default Behavior:** If not specified, defaults to `active` status only
- **Show Inactive:** Pass `status=inactive` or omit status to show all

---

## Implementation Notes

### Route Order
The `/staff/search` endpoint is defined BEFORE `/staff/:id` in the controller to prevent "search" from being interpreted as an ID parameter.

### Database Query
- Uses Prisma's case-insensitive search with `mode: 'insensitive'`
- Includes `staffSpecialties` relation with nested `specialty` data
- Orders results by `displayName` ascending
- Executes count query in parallel for pagination metadata

### Performance
- Indexed fields: `tenantId`, `displayName`, `staffType`, `status`
- Related queries use indexed foreign keys
- Pagination prevents large result sets

---

## Frontend Integration Example

```typescript
import { foundationApi } from '@/lib/api/foundation-api';

interface SearchStaffParams {
  displayName?: string;
  staffType?: 'physician' | 'nurse' | 'technician' | 'pharmacist' | 'administrative' | 'support' | 'other';
  status?: string;
  specialtyId?: string;
  facilityId?: string;
  limit?: number;
  offset?: number;
}

export const searchStaff = async (params: SearchStaffParams) => {
  const response = await foundationApi.get('/staff/search', { params });
  return response.data;
};

// Usage with React Query
const { data, isLoading } = useQuery({
  queryKey: ['staff', 'search', searchParams],
  queryFn: () => searchStaff(searchParams),
});
```

---

## Use Cases

1. **Staff Directory Search:** Allow users to search for staff by name
2. **Attending Physician Selector:** Filter physicians for admission forms
3. **Specialty-Based Search:** Find all cardiologists at a facility
4. **Department Staffing:** List all nurses at a specific facility
5. **User Assignment:** Search for active staff when creating user accounts

---

## Related Endpoints

- `GET /staff` - List all staff for a tenant (no filtering)
- `GET /staff/:id` - Get specific staff member by ID
- `POST /staff` - Create new staff member
- `PUT /staff/:id` - Update staff member
- `DELETE /staff/:id` - Archive staff member

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial implementation of staff search API |

---

**Last Updated:** January 2026
