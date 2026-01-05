# Inpatient Module - MVP API Endpoints

**Version:** 1.0
**Service:** Clinical Service
**Base URL:** `http://localhost:3011/v1/inpatient`
**Status:** Design Specification
**Last Updated:** January 2026

---

## Overview

This document specifies the MVP API endpoints required to support the 5 key inpatient screens:

1. **Admission Create** - Create new inpatient admissions
2. **Bed Board** - Real-time ward view with bed status and patient alerts
3. **Transfer Workflow** - Transfer patients between beds with event logging
4. **Discharge Workflow** - Complete discharge checklist and discharge patients
5. **Ward Dashboard** - Ward census with pending orders and vitals due

---

## 1. Admission List & Search APIs

### GET `/v1/inpatient/admissions`

**Purpose:** Search and filter inpatient admissions with pagination.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `searchTerm` | string | Search in patient name (first/last) or MRN |
| `patientName` | string | Filter by patient name (first/last) |
| `mrn` | string | Filter by MRN |
| `admissionNumber` | string | Filter by admission number |
| `status` | enum | Filter by status: `admitted`, `transferred`, `discharged`, `deceased`, `absconded` |
| `admissionDate` | date | Filter by specific admission date (YYYY-MM-DD) |
| `admissionDateFrom` | date | Filter by admission date from (YYYY-MM-DD) |
| `admissionDateTo` | date | Filter by admission date to (YYYY-MM-DD) |
| `wardId` | uuid | Filter by current ward |
| `attendingPhysicianId` | uuid | Filter by attending physician |
| `limit` | number | Results per page (default: 20, max: 100) |
| `offset` | number | Pagination offset (default: 0) |
| `sortBy` | string | Sort field: `admissionDate`, `admissionNumber` (default: `admissionDate`) |
| `sortOrder` | string | Sort order: `asc`, `desc` (default: `desc`) |

**Example Requests:**

```bash
# Search by patient name or MRN
GET /v1/inpatient/admissions?searchTerm=John&status=admitted

# Filter by status and date range
GET /v1/inpatient/admissions?status=admitted&admissionDateFrom=2026-01-01&admissionDateTo=2026-01-31

# Filter by specific date
GET /v1/inpatient/admissions?admissionDate=2026-01-05&wardId=uuid

# Search by MRN with pagination
GET /v1/inpatient/admissions?mrn=MRN12345&limit=10&offset=0

# Filter by ward and physician
GET /v1/inpatient/admissions?wardId=uuid&attendingPhysicianId=uuid
```

**Response:**
```typescript
{
  "data": [
    {
      "id": "uuid",
      "admissionNumber": "ADM-2026-00123",
      "patientId": "uuid",
      "encounterId": "uuid",
      "admissionDate": "2026-01-04T10:30:00Z",
      "admissionType": "emergency",
      "admissionSource": "emergency_room",
      "status": "admitted",
      "attendingPhysicianId": "uuid",
      "primaryNurseId": "uuid",
      "currentWardId": "uuid",
      "currentBedId": "uuid",
      "clinicalAlerts": ["critical", "isolation"],
      "isolationType": "airborne",
      "fallRiskScore": 4,
      "lastVitalsAt": "2026-01-05T10:00:00Z",
      "nextVitalsAt": "2026-01-05T14:00:00Z",
      "vitalsFrequency": "q4h",
      "expectedDischargeDate": "2026-01-10",
      "lengthOfStayDays": 1,
      "createdAt": "2026-01-04T10:30:05Z",
      "updatedAt": "2026-01-05T08:00:00Z",

      // Included relations
      "patient": {
        "id": "uuid",
        "mrn": "MRN12345",
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1980-05-15",
        "gender": "male",
        "nationalId": "784-1980-1234567-8"
      },
      "encounter": {
        "id": "uuid",
        "encounterNumber": "ENC-2026-001234",
        "status": "in-progress"
      },
      "bedAssignments": [
        {
          "id": "uuid",
          "bedId": "uuid",
          "wardId": "uuid",
          "spaceId": "uuid",
          "assignedAt": "2026-01-04T10:30:00Z",
          "releasedAt": null,
          "isTransfer": false
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

**Status Codes:**
- `200 OK` - Admissions retrieved successfully
- `400 Bad Request` - Invalid query parameters

---

## 2. Admission Create APIs

### POST `/v1/inpatient/admissions`

**Purpose:** Create a new inpatient admission from OP/ER/referral.

**Workflow:**
1. Create/link to Encounter (encounterClass = 'IMP')
2. Generate admission number
3. Assign initial bed
4. Create admission event log entry

**Request:**
```typescript
{
  // Patient & Encounter
  "patientId": "uuid",
  "encounterId": "uuid",  // Optional: create new if not provided

  // Admission Details
  "admissionDate": "2026-01-04T10:30:00Z",
  "admissionType": "emergency",  // elective, emergency, maternity, day_case, transfer
  "admissionSource": "emergency_room",  // emergency_room, outpatient_dept, transfer_in, direct, physician_referral

  // Clinical Team
  "attendingPhysicianId": "uuid",
  "primaryNurseId": "uuid",  // optional

  // Initial Location
  "initialWardId": "uuid",
  "initialBedId": "uuid",

  // Alerts (optional)
  "clinicalAlerts": ["isolation", "fall_risk"],
  "isolationType": "contact",  // contact, droplet, airborne, protective
  "fallRiskScore": 3,

  // Vitals Schedule (optional)
  "vitalsFrequency": "q4h",  // q1h, q2h, q4h, q8h, q12h, daily

  // Insurance (optional)
  "insuranceAuthNumber": "AUTH123456",
  "estimatedCost": 15000.00
}
```

**Response:**
```typescript
{
  "id": "uuid",
  "admissionNumber": "ADM-2026-00123",
  "patientId": "uuid",
  "encounterId": "uuid",
  "status": "admitted",
  "admissionDate": "2026-01-04T10:30:00Z",
  "currentBedId": "uuid",
  "createdAt": "2026-01-04T10:30:05Z"
}
```

**Status Codes:**
- `201 Created` - Admission created successfully
- `400 Bad Request` - Validation error (bed not available, missing required fields)
- `404 Not Found` - Patient, ward, or bed not found
- `409 Conflict` - Patient already has active admission

---

## 3. Bed Board APIs

### GET `/v1/inpatient/wards/:wardId/bed-board`

**Purpose:** Get real-time bed board view for a ward.

**Query Parameters:**
- `includeDischargedToday` (boolean) - Include patients discharged today (default: false)

**Response:**
```typescript
{
  "ward": {
    "id": "uuid",
    "wardCode": "ICU-01",
    "wardName": "Intensive Care Unit",
    "wardType": "icu",
    "totalBeds": 12,
    "occupiedBeds": 9,
    "availableBeds": 2,
    "maintenanceBeds": 1
  },
  "beds": [
    {
      // Foundation: Bed details
      "bedId": "uuid",
      "bedNumber": "ICU-01-A",
      "bedType": "icu",
      "status": "occupied",
      "equipment": ["ventilator", "monitor", "oxygen"],

      // Foundation: Space (room) details
      "space": {
        "spaceId": "uuid",
        "spaceNumber": "Room 101",
        "amenities": ["bathroom", "oxygen", "monitoring"]
      },

      // Clinical: Current patient admission
      "admission": {
        "admissionId": "uuid",
        "admissionNumber": "ADM-2026-00120",
        "patientId": "uuid",
        "patientName": "John Doe",  // resolved from Foundation
        "patientMRN": "MRN12345",
        "admissionDate": "2026-01-03T08:00:00Z",
        "lengthOfStayDays": 1,

        // Clinical Team
        "attendingPhysician": {
          "staffId": "uuid",
          "name": "Dr. Sarah Smith",
          "specialty": "Critical Care"
        },
        "primaryNurse": {
          "staffId": "uuid",
          "name": "Nurse Mary Johnson"
        },

        // Alerts
        "clinicalAlerts": ["critical", "isolation", "fall_risk"],
        "isolationType": "airborne",
        "fallRiskScore": 4,

        // Vitals Status
        "lastVitalsAt": "2026-01-04T10:00:00Z",
        "nextVitalsAt": "2026-01-04T14:00:00Z",
        "vitalsOverdue": false,

        // Status indicators
        "hasPendingOrders": true,
        "hasCriticalResults": false,
        "dischargeExpectedToday": false
      }
    },
    {
      "bedId": "uuid",
      "bedNumber": "ICU-01-B",
      "bedType": "icu",
      "status": "available",
      "equipment": ["ventilator", "monitor"],
      "space": {
        "spaceId": "uuid",
        "spaceNumber": "Room 102"
      },
      "admission": null  // Bed available
    },
    {
      "bedId": "uuid",
      "bedNumber": "ICU-01-C",
      "bedType": "icu",
      "status": "maintenance",
      "equipment": ["ventilator", "monitor"],
      "space": {
        "spaceId": "uuid",
        "spaceNumber": "Room 103"
      },
      "admission": null,
      "maintenanceReason": "Equipment calibration"
    }
  ],
  "summary": {
    "totalPatients": 9,
    "criticalPatients": 3,
    "isolationPatients": 2,
    "vitalsOverdue": 1,
    "pendingDischarges": 2
  }
}
```

**Status Codes:**
- `200 OK` - Bed board retrieved successfully
- `404 Not Found` - Ward not found

---

## 4. Transfer Workflow APIs

### POST `/v1/inpatient/admissions/:id/transfer`

**Purpose:** Transfer patient to a new bed/ward.

**Request:**
```typescript
{
  "toWardId": "uuid",
  "toBedId": "uuid",
  "transferReason": "Clinical deterioration requiring ICU level care",
  "transferType": "clinical_need",  // clinical_need, bed_availability, patient_request, infection_control
  "notes": "Patient showing signs of respiratory distress"
}
```

**Response:**
```typescript
{
  "admission": {
    "id": "uuid",
    "currentWardId": "uuid",
    "currentBedId": "uuid",
    "status": "admitted"
  },
  "bedAssignment": {
    "id": "uuid",
    "bedId": "uuid",
    "wardId": "uuid",
    "assignedAt": "2026-01-04T11:30:00Z",
    "isTransfer": true,
    "transferType": "clinical_need"
  },
  "event": {
    "eventId": "uuid",
    "eventType": "patient_transferred",
    "performedAt": "2026-01-04T11:30:00Z"
  }
}
```

**Workflow:**
1. Validate new bed is available
2. Release current bed
3. Assign new bed
4. Update admission location
5. Create transfer event log entry
6. Update bed status in Foundation

**Status Codes:**
- `200 OK` - Transfer successful
- `400 Bad Request` - Target bed not available
- `404 Not Found` - Admission or bed not found
- `409 Conflict` - Patient already at target bed

---

### GET `/v1/inpatient/admissions/:id/events`

**Purpose:** Get event timeline for an admission (for transfer workflow UI).

**Query Parameters:**
- `eventTypes` (string[]) - Filter by event types
- `limit` (number) - Max events to return (default: 50)

**Response:**
```typescript
{
  "admissionId": "uuid",
  "events": [
    {
      "id": "uuid",
      "eventType": "patient_transferred",
      "eventCategory": "operational",
      "performedBy": {
        "staffId": "uuid",
        "name": "Dr. Sarah Smith"
      },
      "performedAt": "2026-01-04T11:30:00Z",
      "eventData": {
        "fromWardId": "uuid",
        "fromWardName": "General Ward",
        "fromBedNumber": "GW-01-A",
        "toWardId": "uuid",
        "toWardName": "ICU",
        "toBedNumber": "ICU-01-A",
        "reason": "Clinical deterioration requiring ICU level care",
        "transferType": "clinical_need"
      },
      "notes": "Patient showing signs of respiratory distress"
    },
    {
      "id": "uuid",
      "eventType": "alert_raised",
      "eventCategory": "clinical",
      "performedBy": {
        "staffId": "uuid",
        "name": "Nurse Mary Johnson"
      },
      "performedAt": "2026-01-04T10:00:00Z",
      "eventData": {
        "alertType": "critical",
        "severity": "high",
        "details": "Patient oxygen saturation dropped to 88%"
      }
    },
    {
      "id": "uuid",
      "eventType": "bed_assigned",
      "eventCategory": "operational",
      "performedBy": {
        "staffId": "uuid",
        "name": "Admission Clerk"
      },
      "performedAt": "2026-01-03T08:00:00Z",
      "eventData": {
        "fromBedId": null,
        "toBedId": "uuid",
        "toBedNumber": "GW-01-A",
        "reason": "initial_admission"
      }
    },
    {
      "id": "uuid",
      "eventType": "admission_created",
      "eventCategory": "administrative",
      "performedBy": {
        "staffId": "uuid",
        "name": "Dr. John Williams"
      },
      "performedAt": "2026-01-03T08:00:00Z",
      "eventData": {
        "admissionType": "emergency",
        "admissionSource": "emergency_room"
      }
    }
  ]
}
```

---

## 5. Discharge Workflow APIs

### GET `/v1/inpatient/admissions/:id/discharge-checklist`

**Purpose:** Get discharge checklist for an admission.

**Response:**
```typescript
{
  "admissionId": "uuid",
  "patientId": "uuid",

  // Medical Clearance
  "medicalClearance": true,
  "medicalClearedBy": {
    "staffId": "uuid",
    "name": "Dr. Sarah Smith"
  },
  "medicalClearedAt": "2026-01-04T09:00:00Z",

  // Medications
  "medicationsReconciled": true,
  "dischargePrescriptionsIssued": true,

  // Follow-up Care
  "followUpAppointmentScheduled": true,
  "followUpAppointmentDate": "2026-01-11T10:00:00Z",
  "followUpPhysician": {
    "staffId": "uuid",
    "name": "Dr. Sarah Smith"
  },

  // Patient Education
  "dischargInstructionsProvided": true,
  "patientEducationCompleted": true,
  "educationTopics": ["medication_management", "wound_care", "diet"],

  // Equipment & Supplies
  "dmeOrdered": false,
  "dmeDescription": null,
  "homeHealthOrdered": true,
  "homeHealthAgency": "CareWell Home Health",

  // Transportation
  "transportationArranged": true,
  "transportationMode": "family",

  // Administrative
  "billingCleared": true,
  "insuranceNotified": true,
  "medicalRecordsCompleted": true,

  // Overall Status
  "readyForDischarge": true,
  "dischargeCoordinator": {
    "staffId": "uuid",
    "name": "Care Coordinator Jane Doe"
  },

  "createdAt": "2026-01-04T08:00:00Z",
  "updatedAt": "2026-01-04T11:00:00Z"
}
```

---

### PATCH `/v1/inpatient/admissions/:id/discharge-checklist`

**Purpose:** Update discharge checklist items.

**Request:**
```typescript
{
  "medicalClearance": true,
  "medicationsReconciled": true,
  "followUpAppointmentScheduled": true,
  "followUpAppointmentDate": "2026-01-11T10:00:00Z",
  "followUpPhysician": "uuid"
}
```

**Response:** Returns updated checklist (same as GET response)

---

### POST `/v1/inpatient/admissions/:id/discharge`

**Purpose:** Complete discharge process.

**Request:**
```typescript
{
  "dischargeType": "routine",  // routine, against_medical_advice, transfer, deceased, absconded
  "dischargeDestination": "home",  // home, transfer_facility, nursing_home, rehabilitation, deceased
  "dischargeNotes": "Patient discharged in stable condition with instructions for wound care and follow-up appointment scheduled.",
  "actualDischargeDate": "2026-01-04T14:00:00Z"  // optional, defaults to now
}
```

**Response:**
```typescript
{
  "admission": {
    "id": "uuid",
    "status": "discharged",
    "actualDischargeDate": "2026-01-04T14:00:00Z",
    "dischargeType": "routine",
    "lengthOfStayDays": 1
  },
  "encounter": {
    "id": "uuid",
    "status": "finished",
    "endTime": "2026-01-04T14:00:00Z"
  },
  "event": {
    "eventId": "uuid",
    "eventType": "discharge_completed",
    "performedAt": "2026-01-04T14:00:00Z"
  },
  "prmEventId": "uuid"  // Event sent to PRM for follow-up scheduling
}
```

**Workflow:**
1. Validate discharge checklist is complete (`readyForDischarge = true`)
2. Update admission status to 'discharged'
3. End encounter
4. Release bed (update Foundation bed status)
5. Create discharge event log entry
6. Send event to PRM service for follow-up coordination
7. Optionally send event to RCM for final billing

**Status Codes:**
- `200 OK` - Discharge successful
- `400 Bad Request` - Checklist not complete
- `404 Not Found` - Admission not found
- `409 Conflict` - Patient already discharged

---

## 6. Ward Dashboard APIs

### GET `/v1/inpatient/wards/:wardId/dashboard`

**Purpose:** Get ward dashboard with patients, pending orders, and vitals due.

**Response:**
```typescript
{
  "ward": {
    "id": "uuid",
    "wardCode": "ICU-01",
    "wardName": "Intensive Care Unit",
    "wardType": "icu",
    "totalBeds": 12,
    "occupiedBeds": 9
  },

  // Patients by status
  "patients": {
    "total": 9,
    "admitted": 8,
    "pendingDischarge": 1,
    "byPhysician": [
      {
        "physicianId": "uuid",
        "physicianName": "Dr. Sarah Smith",
        "patientCount": 5
      },
      {
        "physicianId": "uuid",
        "physicianName": "Dr. John Williams",
        "patientCount": 4
      }
    ]
  },

  // Pending orders
  "pendingOrders": {
    "total": 15,
    "byType": {
      "lab": 6,
      "imaging": 4,
      "procedure": 3,
      "medication": 2
    },
    "stat": 2,  // Stat orders count
    "overdue": 1  // Orders past expected completion time
  },

  // Vitals due
  "vitals": {
    "totalDueToday": 25,
    "overdue": 3,
    "dueNextHour": 5,
    "patientsOverdue": [
      {
        "admissionId": "uuid",
        "patientName": "John Doe",
        "patientMRN": "MRN12345",
        "bedNumber": "ICU-01-A",
        "lastVitalsAt": "2026-01-04T06:00:00Z",
        "nextVitalsAt": "2026-01-04T10:00:00Z",
        "vitalsFrequency": "q4h",
        "overdueMinutes": 120
      }
    ]
  },

  // Critical alerts
  "alerts": {
    "critical": 2,
    "isolation": 3,
    "fallRisk": 5
  },

  // Discharges
  "discharges": {
    "plannedToday": 2,
    "completed": 0,
    "pending": [
      {
        "admissionId": "uuid",
        "patientName": "Jane Smith",
        "bedNumber": "ICU-01-C",
        "expectedDischargeDate": "2026-01-04",
        "checklistComplete": false
      }
    ]
  }
}
```

**Status Codes:**
- `200 OK` - Dashboard retrieved successfully
- `404 Not Found` - Ward not found

---

### GET `/v1/inpatient/wards/:wardId/patients`

**Purpose:** Get detailed list of patients in a ward (for patient list view).

**Query Parameters:**
- `status` (string) - Filter by status: admitted, pendingDischarge
- `physicianId` (uuid) - Filter by attending physician
- `sortBy` (string) - Sort by: admissionDate, bedNumber, patientName
- `sortOrder` (string) - asc or desc

**Response:**
```typescript
{
  "wardId": "uuid",
  "patients": [
    {
      "admission": {
        "id": "uuid",
        "admissionNumber": "ADM-2026-00120",
        "admissionDate": "2026-01-03T08:00:00Z",
        "lengthOfStayDays": 1,
        "status": "admitted"
      },
      "patient": {
        "id": "uuid",
        "mrn": "MRN12345",
        "name": "John Doe",
        "age": 45,
        "gender": "male"
      },
      "location": {
        "bedId": "uuid",
        "bedNumber": "ICU-01-A",
        "spaceNumber": "Room 101"
      },
      "clinicalTeam": {
        "attendingPhysician": {
          "staffId": "uuid",
          "name": "Dr. Sarah Smith"
        },
        "primaryNurse": {
          "staffId": "uuid",
          "name": "Nurse Mary Johnson"
        }
      },
      "alerts": ["critical", "isolation"],
      "isolationType": "airborne",
      "vitalsStatus": {
        "lastVitalsAt": "2026-01-04T10:00:00Z",
        "nextVitalsAt": "2026-01-04T14:00:00Z",
        "overdue": false
      },
      "pendingOrders": 3,
      "expectedDischargeDate": null
    }
  ],
  "total": 9
}
```

---

## 7. Supporting APIs

### GET `/v1/inpatient/admissions/:id`

**Purpose:** Get full admission details.

**Response:** Complete InpatientAdmission object with resolved Foundation entities (ward, bed, staff names).

---

### PATCH `/v1/inpatient/admissions/:id`

**Purpose:** Update admission details.

**Request:**
```typescript
{
  "clinicalAlerts": ["critical", "fall_risk"],
  "fallRiskScore": 4,
  "vitalsFrequency": "q2h",
  "nextVitalsAt": "2026-01-04T12:00:00Z",
  "primaryNurseId": "uuid",
  "expectedDischargeDate": "2026-01-05"
}
```

---

### POST `/v1/inpatient/admissions/:id/events`

**Purpose:** Manually create an event log entry.

**Request:**
```typescript
{
  "eventType": "alert_raised",
  "eventCategory": "clinical",
  "eventData": {
    "alertType": "fall_risk",
    "severity": "high",
    "details": "Patient attempted to get out of bed unassisted"
  },
  "notes": "Side rails raised, frequent monitoring implemented"
}
```

---

## Integration Points

### Foundation Service
- `GET /v1/wards/:id` - Ward details
- `GET /v1/spaces/:id` - Space (room) details
- `GET /v1/beds/:id` - Bed details
- `GET /v1/beds/available` - Find available beds
- `PATCH /v1/beds/:id` - Update bed status (occupied/available)
- `GET /v1/staff/:id` - Staff details

### RCM Service
- `POST /v1/charges` - Create bed day charges
- `GET /v1/invoices/:patientId/status` - Check billing clearance

### PRM Service
- `POST /v1/events` - Send discharge event for follow-up

---

## MVP Tables Usage

| Screen | Primary Tables | Related Tables |
|--------|----------------|----------------|
| Admission Create | InpatientAdmission, BedAssignment, InpatientEvent | Encounter |
| Bed Board | InpatientAdmission | BedAssignment, InpatientEvent |
| Transfer Workflow | BedAssignment, InpatientEvent | InpatientAdmission |
| Discharge Workflow | DischargeChecklist, InpatientAdmission, InpatientEvent | Encounter |
| Ward Dashboard | InpatientAdmission | ClinicalOrder, InpatientAssessment |

**Not MVP Critical:**
- NursingRound - Can be added post-MVP
- IntakeOutput - ICU-specific, post-MVP
- CarePlan - Important but post-MVP

---

## Summary

**MVP Endpoints:** 13 core endpoints (including admission search)
**Database Tables:** 8 tables (InpatientAdmission, BedAssignment, InpatientEvent, DischargeChecklist, InpatientAssessment, ClinicalOrder, Encounter, Patient)
**Cross-Service Calls:** Foundation (wards, beds, staff), RCM (billing), PRM (follow-up)

All endpoints support multi-tenancy via `x-tenant-id` header and return consistent error responses.

---

**Version:** 1.0
**Last Updated:** January 2026
