# Ward Board APIs with Patient Information

Complete patient information is now included in all Ward Board API responses for grid/list display.

## Summary of Changes

✅ **Enhanced Patient Information** - All Ward Board APIs now return comprehensive patient details
✅ **Prisma Schema Updated** - Added Patient relation to InpatientAdmission model
✅ **Service Layer Updated** - Both single-ward and multi-ward APIs fetch complete patient data
✅ **Real Data** - No more placeholder/mock data - actual patient demographics included

---

## API Endpoints

### 1. Single Ward Board
**Endpoint**: `GET /api/v1/inpatient/wards/:wardId/bed-board`

### 2. Multi-Ward Board (Facility-Wide)
**Endpoint**: `GET /api/v1/inpatient/wards/multi-board`

---

## Patient Information in Response

### Enhanced PatientDisplay Interface

```typescript
interface PatientDisplay {
  patientId: string;           // Patient UUID
  mrn: string;                 // Medical Record Number (unique)
  firstName: string;           // Patient first name
  lastName: string;            // Patient last name
  displayName: string;         // Full display name (firstName + lastName or custom)
  age: number;                 // Calculated age from date of birth
  dateOfBirth: string;         // ISO 8601 date format (YYYY-MM-DD)
  gender: string;              // M, F, O (Male, Female, Other)
  nationalId?: string;         // National ID (e.g., Emirates ID, Aadhaar, Passport)
  nationalIdType?: string;     // Type: 'emirates_id', 'passport', 'aadhaar', etc.
  phoneNumber?: string;        // Primary contact number
  email?: string;              // Email address
  nationality?: string;        // Patient nationality
  preferredLanguage?: string;  // ISO 639-1 code ('en', 'ar', etc.)
}
```

---

## Complete API Response Examples

### Single Ward Board Response

```json
{
  "ward": {
    "id": "ward-uuid",
    "name": "ICU Ward",
    "code": "ICU-01"
  },
  "summary": {
    "totalBeds": 20,
    "occupied": 15,
    "empty": 3,
    "cleaning": 2,
    "reserved": 0,
    "critical": 4,
    "pendingDischarge": 2
  },
  "beds": [
    {
      "bed": {
        "id": "bed-uuid",
        "code": "ICU-BED-01",
        "spaceName": "Room 101"
      },
      "occupancy": "occupied",
      "admission": {
        "admissionId": "admission-uuid",
        "encounterId": "encounter-uuid",
        "patientId": "patient-uuid",
        "patientDisplay": {
          "patientId": "patient-uuid",
          "mrn": "MRN-2024-001234",
          "firstName": "Ahmed",
          "lastName": "Al-Mansouri",
          "displayName": "Ahmed Al-Mansouri",
          "age": 45,
          "dateOfBirth": "1979-03-15",
          "gender": "M",
          "nationalId": "784-1979-1234567-8",
          "nationalIdType": "emirates_id",
          "phoneNumber": "+971501234567",
          "email": "ahmed.almansouri@example.com",
          "nationality": "AE",
          "preferredLanguage": "ar"
        },
        "attendingPhysicianId": "doctor-uuid",
        "admissionStatus": "ACTIVE",
        "dischargeStatus": "NONE",
        "acuity": "STABLE",
        "boardFlags": {
          "npo": false,
          "fallRisk": "low",
          "telemetry": true,
          "isolation": false,
          "allergies": true,
          "dnr": false,
          "covid": false
        },
        "admittedAt": "2026-01-10T08:30:00Z",
        "expectedDischargeDate": "2026-01-15"
      },
      "actions": ["TRANSFER", "MEDS", "DETAILS"]
    },
    {
      "bed": {
        "id": "bed-uuid-2",
        "code": "ICU-BED-02",
        "spaceName": "Room 102"
      },
      "occupancy": "empty",
      "actions": ["ADMIT_PATIENT"]
    }
  ]
}
```

### Multi-Ward Board Response

```json
{
  "facilityId": "facility-uuid",
  "summary": {
    "totalWards": 3,
    "totalBeds": 50,
    "occupied": 42,
    "empty": 6,
    "cleaning": 2,
    "reserved": 0,
    "critical": 8,
    "pendingDischarge": 5,
    "occupancyRate": 84.0
  },
  "wards": [
    {
      "ward": {
        "id": "icu-ward-uuid",
        "name": "ICU Ward",
        "code": "ICU-01"
      },
      "summary": {
        "totalBeds": 20,
        "occupied": 18,
        "empty": 2,
        "cleaning": 0,
        "reserved": 0,
        "critical": 6,
        "pendingDischarge": 2
      },
      "beds": [
        {
          "bed": {
            "id": "bed-uuid",
            "code": "ICU-BED-01"
          },
          "occupancy": "occupied",
          "admission": {
            "admissionId": "admission-uuid",
            "encounterId": "encounter-uuid",
            "patientId": "patient-uuid",
            "patientDisplay": {
              "patientId": "patient-uuid",
              "mrn": "MRN-2024-001234",
              "firstName": "Ahmed",
              "lastName": "Al-Mansouri",
              "displayName": "Ahmed Al-Mansouri",
              "age": 45,
              "dateOfBirth": "1979-03-15",
              "gender": "M",
              "nationalId": "784-1979-1234567-8",
              "nationalIdType": "emirates_id",
              "phoneNumber": "+971501234567",
              "email": "ahmed.almansouri@example.com",
              "nationality": "AE",
              "preferredLanguage": "ar"
            },
            "attendingPhysicianId": "doctor-uuid",
            "admissionStatus": "ACTIVE",
            "dischargeStatus": "NONE",
            "acuity": "CRITICAL",
            "boardFlags": {
              "npo": true,
              "fallRisk": "high",
              "telemetry": true,
              "isolation": true,
              "allergies": true
            },
            "admittedAt": "2026-01-08T14:20:00Z",
            "expectedDischargeDate": "2026-01-18"
          },
          "actions": ["TRANSFER", "MEDS", "DETAILS"]
        }
      ]
    },
    {
      "ward": {
        "id": "general-ward-uuid",
        "name": "General Ward A",
        "code": "GEN-A-01"
      },
      "summary": {
        "totalBeds": 30,
        "occupied": 24,
        "empty": 4,
        "cleaning": 2,
        "reserved": 0,
        "critical": 2,
        "pendingDischarge": 3
      },
      "beds": [
        // ... bed data with patient info
      ]
    }
  ],
  "timestamp": "2026-01-13T09:55:41Z"
}
```

---

## Frontend Display Use Cases

### Grid/List Columns

The enhanced patient information supports rich grid/list displays:

```typescript
// Example: Ward Board Grid Columns
const columns = [
  { field: 'bed.code', header: 'Bed' },
  { field: 'admission.patientDisplay.mrn', header: 'MRN' },
  { field: 'admission.patientDisplay.displayName', header: 'Patient Name' },
  { field: 'admission.patientDisplay.age', header: 'Age' },
  { field: 'admission.patientDisplay.gender', header: 'Gender' },
  { field: 'admission.patientDisplay.nationalId', header: 'National ID' },
  { field: 'admission.patientDisplay.phoneNumber', header: 'Contact' },
  { field: 'admission.acuity', header: 'Acuity' },
  { field: 'admission.admissionStatus', header: 'Status' },
  { field: 'admission.admittedAt', header: 'Admitted' },
  { field: 'actions', header: 'Actions' },
];
```

### Example: Patient Card Component

```tsx
function PatientCard({ admission }: { admission: WardBoardAdmission }) {
  const patient = admission.patientDisplay;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <h3>{patient.displayName}</h3>
            <p className="text-sm text-muted-foreground">
              MRN: {patient.mrn}
            </p>
          </div>
          <Badge variant={getAcuityVariant(admission.acuity)}>
            {admission.acuity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Age:</span>{' '}
            <span>{patient.age} years</span>
          </div>
          <div>
            <span className="text-muted-foreground">Gender:</span>{' '}
            <span>{patient.gender}</span>
          </div>
          <div>
            <span className="text-muted-foreground">DOB:</span>{' '}
            <span>{format(new Date(patient.dateOfBirth), 'PP')}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Contact:</span>{' '}
            <span>{patient.phoneNumber}</span>
          </div>
          {patient.nationalId && (
            <div className="col-span-2">
              <span className="text-muted-foreground">National ID:</span>{' '}
              <span>{patient.nationalId}</span>
            </div>
          )}
          {patient.email && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Email:</span>{' '}
              <span>{patient.email}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Example: Ward Board Grid

```tsx
function WardBoardGrid({ wardId }: { wardId: string }) {
  const { data: board, isLoading } = useQuery({
    queryKey: ['ward-board', wardId],
    queryFn: () => bedBoardService.getWardBedBoard(wardId),
  });

  if (isLoading) return <Skeleton />;

  return (
    <DataTable
      data={board.beds}
      columns={[
        {
          accessorKey: 'bed.code',
          header: 'Bed',
        },
        {
          accessorKey: 'admission.patientDisplay.mrn',
          header: 'MRN',
        },
        {
          id: 'patientName',
          header: 'Patient Name',
          cell: ({ row }) => {
            const admission = row.original.admission;
            if (!admission) return '-';
            return admission.patientDisplay.displayName;
          },
        },
        {
          accessorKey: 'admission.patientDisplay.age',
          header: 'Age',
          cell: ({ row }) => {
            const admission = row.original.admission;
            return admission ? `${admission.patientDisplay.age} yrs` : '-';
          },
        },
        {
          accessorKey: 'admission.patientDisplay.gender',
          header: 'Gender',
        },
        {
          accessorKey: 'admission.acuity',
          header: 'Acuity',
          cell: ({ row }) => {
            const admission = row.original.admission;
            if (!admission) return '-';
            return (
              <Badge variant={getAcuityVariant(admission.acuity)}>
                {admission.acuity}
              </Badge>
            );
          },
        },
        {
          id: 'admittedAt',
          header: 'Admitted',
          cell: ({ row }) => {
            const admission = row.original.admission;
            if (!admission) return '-';
            return format(new Date(admission.admittedAt), 'PPp');
          },
        },
        {
          id: 'actions',
          header: 'Actions',
          cell: ({ row }) => {
            return <BedActionMenu bed={row.original} />;
          },
        },
      ]}
    />
  );
}
```

---

## TypeScript Types for Frontend

```typescript
// Complete type definitions for Ward Board with Patient Info
export interface PatientDisplay {
  patientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  displayName: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  nationalId?: string;
  nationalIdType?: string;
  phoneNumber?: string;
  email?: string;
  nationality?: string;
  preferredLanguage?: string;
}

export interface BedInfo {
  id: string;
  code: string;
  spaceName?: string;
  spaceCode?: string;
}

export interface WardInfo {
  id: string;
  name: string;
  code?: string;
}

export interface BoardFlags {
  npo?: boolean;
  fallRisk?: 'low' | 'medium' | 'high';
  telemetry?: boolean;
  isolation?: boolean;
  allergies?: boolean;
  dnr?: boolean;
  covid?: boolean;
  [key: string]: any;
}

export interface WardBoardAdmission {
  admissionId: string;
  encounterId: string;
  patientId: string;
  patientDisplay: PatientDisplay;  // ✅ Now includes full patient info
  attendingPhysicianId: string;
  attendingPhysicianName?: string;
  admissionStatus: InpatientAdmissionStatus;
  dischargeStatus: InpatientDischargeStatus;
  acuity: InpatientAcuity;
  boardFlags?: BoardFlags;
  admittedAt: Date;
  expectedDischargeDate?: Date;
}

export interface WardBoardBed {
  bed: BedInfo;
  occupancy: 'occupied' | 'empty' | 'cleaning' | 'reserved';
  admission?: WardBoardAdmission;
  actions: string[];
}

export interface WardBoardSummary {
  totalBeds: number;
  occupied: number;
  empty: number;
  cleaning?: number;
  reserved?: number;
  critical?: number;
  pendingDischarge?: number;
}

export interface WardBoardResponse {
  ward: WardInfo;
  summary: WardBoardSummary;
  beds: WardBoardBed[];
}

export interface FacilitySummary {
  totalWards: number;
  totalBeds: number;
  occupied: number;
  empty: number;
  cleaning: number;
  reserved: number;
  critical: number;
  pendingDischarge: number;
  occupancyRate: number;
}

export interface WardBoardData {
  ward: WardInfo;
  summary: WardBoardSummary;
  beds: WardBoardBed[];
}

export interface MultiWardBoardResponse {
  facilityId: string;
  summary: FacilitySummary;
  wards: WardBoardData[];
  timestamp: string;
}
```

---

## Service Implementation Example

```typescript
// src/modules/clinical/services/bed-board-service.ts
import { clinicalApi } from '@/lib/api/clinical-api';
import type { WardBoardResponse, MultiWardBoardResponse } from '../types/ward-board';

export class BedBoardService {
  /**
   * Get single ward board with complete patient info
   */
  async getWardBedBoard(
    wardId: string,
    options?: {
      includeDischargedToday?: boolean;
      statusFilter?: string[];
      acuityFilter?: string[];
    }
  ): Promise<WardBoardResponse> {
    const params = new URLSearchParams();
    if (options?.includeDischargedToday) {
      params.append('includeDischargedToday', 'true');
    }
    if (options?.statusFilter) {
      params.append('statusFilter', options.statusFilter.join(','));
    }
    if (options?.acuityFilter) {
      params.append('acuityFilter', options.acuityFilter.join(','));
    }

    const response = await clinicalApi.get<WardBoardResponse>(
      `/inpatient/wards/${wardId}/bed-board?${params}`
    );
    return response.data;
  }

  /**
   * Get multi-ward board (facility-wide) with complete patient info
   */
  async getMultiWardBedBoard(
    options?: {
      wardIds?: string[];
      includeDischargedToday?: boolean;
      statusFilter?: string[];
      acuityFilter?: string[];
      includeEmptyWards?: boolean;
    }
  ): Promise<MultiWardBoardResponse> {
    const params = new URLSearchParams();
    if (options?.wardIds) {
      params.append('wardIds', options.wardIds.join(','));
    }
    if (options?.includeDischargedToday) {
      params.append('includeDischargedToday', 'true');
    }
    if (options?.statusFilter) {
      params.append('statusFilter', options.statusFilter.join(','));
    }
    if (options?.acuityFilter) {
      params.append('acuityFilter', options.acuityFilter.join(','));
    }
    if (options?.includeEmptyWards !== undefined) {
      params.append('includeEmptyWards', String(options.includeEmptyWards));
    }

    const response = await clinicalApi.get<MultiWardBoardResponse>(
      `/inpatient/wards/multi-board?${params}`
    );
    return response.data;
  }
}

export const bedBoardService = new BedBoardService();
```

---

## React Hooks Example

```typescript
// src/modules/clinical/hooks/use-ward-board.ts
import { useQuery } from '@tanstack/react-query';
import { bedBoardService } from '../services/bed-board-service';

export function useWardBoard(wardId: string) {
  return useQuery({
    queryKey: ['ward-board', wardId],
    queryFn: () => bedBoardService.getWardBedBoard(wardId),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

export function useMultiWardBoard(
  options?: {
    wardIds?: string[];
    includeEmptyWards?: boolean;
  }
) {
  return useQuery({
    queryKey: ['multi-ward-board', options],
    queryFn: () => bedBoardService.getMultiWardBedBoard(options),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}
```

---

## Summary

### What Changed

1. **PatientDisplay Interface** - Expanded from 3 fields to 12 fields with comprehensive patient information
2. **Prisma Schema** - Added `patient` relation to `InpatientAdmission` model
3. **Database Queries** - Updated to include patient data using Prisma `include: { patient: true }`
4. **Helper Functions** - Added `calculateAge()` and `buildPatientDisplay()` methods
5. **Both APIs Updated** - Single-ward and multi-ward board APIs now return complete patient info

### Benefits for Frontend

✅ **No Additional API Calls** - All patient info included in one response
✅ **Rich Grid Display** - Comprehensive data for table columns
✅ **Search & Filter** - Patient name, MRN, contact info available
✅ **Patient Cards** - Complete demographic info for UI cards
✅ **Contact Information** - Phone and email readily available
✅ **Identity Information** - National ID for verification
✅ **Localization** - Preferred language included for UI customization
✅ **Real Data** - No more placeholder values

---

## Technical Details

**Database Relation Added**:
```prisma
model InpatientAdmission {
  // ... fields ...
  patient Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)
}

model Patient {
  // ... fields ...
  inpatientAdmissions InpatientAdmission[]
}
```

**Query Pattern**:
```typescript
const admissions = await prisma.inpatientAdmission.findMany({
  where: { /* filters */ },
  include: {
    patient: true,  // ✅ Includes all patient fields
  },
});
```

**Age Calculation**:
```typescript
calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
```

---

## API Endpoints Summary

| Endpoint | Method | Description | Patient Info |
|----------|--------|-------------|--------------|
| `/api/v1/inpatient/wards/:wardId/bed-board` | GET | Single ward board | ✅ Full |
| `/api/v1/inpatient/wards/multi-board` | GET | Multi-ward/facility board | ✅ Full |
| `/api/v1/inpatient/wards/:wardId/dashboard` | GET | Ward dashboard stats | N/A |
| `/api/v1/inpatient/wards/bed-browser` | GET | Central bed browser | ✅ Full |

All Ward Board APIs now return complete patient information ready for frontend grid/list display! 🎉
