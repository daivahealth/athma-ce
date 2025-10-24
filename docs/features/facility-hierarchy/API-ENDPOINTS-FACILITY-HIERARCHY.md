# Foundation Service API - Facility Hierarchy Endpoints

**Base URL**: `http://localhost:3010`  
**Status**: ✅ **ALL ENDPOINTS ACTIVE**

---

## 📋 **Department Endpoints**

### Create Department
```http
POST /facilities/:facilityId/departments
Content-Type: application/json

{
  "name": "Outpatient Department",
  "code": "OPD",
  "departmentType": "opd",
  "headOfDepartment": "uuid-of-staff-member",
  "floorNumber": "1",
  "phoneExtension": "1234",
  "operatingHours": {
    "monday": { "open": "08:00", "close": "17:00" },
    "tuesday": { "open": "08:00", "close": "17:00" }
  },
  "status": "active"
}
```

**Department Types**: `opd`, `ipd`, `radiology`, `laboratory`, `surgery`, `emergency`, `pharmacy`

### List Departments
```http
GET /facilities/:facilityId/departments?type=opd
```

### Get Department
```http
GET /departments/:id
```

### Update Department
```http
PATCH /departments/:id
Content-Type: application/json

{
  "name": "Updated Department Name",
  "headOfDepartment": "new-staff-uuid"
}
```

### Delete Department
```http
DELETE /departments/:id
```

---

## 🏥 **Ward Endpoints (IPD)**

### Create Ward
```http
POST /departments/:departmentId/wards
Content-Type: application/json

{
  "name": "ICU Ward 1",
  "code": "ICU-1",
  "wardType": "icu",
  "floorNumber": "2",
  "totalBeds": 10,
  "nursingStation": "NS-ICU-1",
  "status": "active"
}
```

**Ward Types**: `general`, `icu`, `nicu`, `picu`, `isolation`, `maternity`

### List Wards
```http
GET /departments/:departmentId/wards?type=icu
```

### Get Ward
```http
GET /wards/:id
```

**Response includes:**
- Ward details
- List of all beds
- Department and facility information

### Get Ward Availability
```http
GET /wards/:id/availability
```

**Response:**
```json
{
  "wardId": "uuid",
  "wardName": "ICU Ward 1",
  "totalBeds": 10,
  "availableBeds": 3,
  "occupiedBeds": 7,
  "occupancyRate": 70,
  "availableBedsList": [
    {
      "id": "uuid",
      "bedNumber": "ICU-103",
      "bedType": "icu"
    }
  ]
}
```

### Update Ward
```http
PATCH /wards/:id
Content-Type: application/json

{
  "name": "Updated Ward Name",
  "nursingStation": "New Nursing Station"
}
```

### Delete Ward
```http
DELETE /wards/:id
```

---

## 🛏️ **Bed Endpoints (IPD)**

### Create Bed
```http
POST /wards/:wardId/beds
Content-Type: application/json

{
  "bedNumber": "ICU-101",
  "bedType": "icu",
  "features": {
    "oxygen": true,
    "monitor": true,
    "ventilator": true
  },
  "status": "available"
}
```

**Bed Types**: `standard`, `icu`, `isolation`, `private`, `semi_private`  
**Bed Statuses**: `available`, `occupied`, `maintenance`, `reserved`

### List Beds in Ward
```http
GET /wards/:wardId/beds?status=available
```

### Get Available Beds
```http
GET /beds/available?wardId=uuid
```

**Response:**
```json
[
  {
    "id": "uuid",
    "bedNumber": "ICU-103",
    "bedType": "icu",
    "status": "available",
    "features": {
      "oxygen": true,
      "monitor": true
    },
    "ward": {
      "id": "uuid",
      "name": "ICU Ward 1",
      "wardType": "icu",
      "department": {
        "id": "uuid",
        "name": "Inpatient Department",
        "facility": {
          "id": "uuid",
          "name": "Main Hospital"
        }
      }
    }
  }
]
```

### Get Bed Details
```http
GET /beds/:id
```

### Assign Patient to Bed
```http
POST /beds/:id/assign
Content-Type: application/json

{
  "patientId": "patient-uuid",
  "notes": "Patient admitted for observation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Patient assigned to bed successfully",
  "bed": {
    "id": "uuid",
    "bedNumber": "ICU-101",
    "bedType": "icu",
    "status": "occupied",
    "assignedAt": "2025-10-08T11:00:00Z",
    "patient": {
      "id": "uuid",
      "firstName": "Ahmed",
      "lastName": "Ali",
      "emiratesId": "784-1234-5678901-2"
    },
    "ward": {
      "id": "uuid",
      "name": "ICU Ward 1"
    }
  }
}
```

**Business Logic:**
- ✅ Validates patient exists and belongs to same tenant
- ✅ Checks bed is not already occupied
- ✅ Checks patient is not already assigned to another bed
- ✅ Updates bed status to 'occupied'
- ✅ Auto-updates ward availableBeds count

### Release Patient from Bed
```http
POST /beds/:id/release
Content-Type: application/json

{
  "notes": "Patient discharged"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Patient released from bed successfully",
  "bed": {
    "id": "uuid",
    "bedNumber": "ICU-101",
    "status": "available",
    "releasedPatientId": "patient-uuid",
    "ward": {
      "id": "uuid",
      "name": "ICU Ward 1"
    }
  }
}
```

**Business Logic:**
- ✅ Validates bed is occupied
- ✅ Clears currentPatientId
- ✅ Updates bed status to 'available'
- ✅ Auto-updates ward availableBeds count

### Update Bed
```http
PATCH /beds/:id
Content-Type: application/json

{
  "bedType": "private",
  "features": {
    "oxygen": true,
    "monitor": true,
    "ventilator": false
  }
}
```

### Delete Bed
```http
DELETE /beds/:id
```

**Note**: Cannot delete occupied beds. Release patient first.

---

## 🏢 **Clinic Endpoints (OPD)**

### Create Clinic
```http
POST /departments/:departmentId/clinics
Content-Type: application/json

{
  "name": "Cardiology Clinic",
  "code": "CARDIO-1",
  "specialty": "cardiology",
  "floorNumber": "3",
  "totalRooms": 5,
  "operatingHours": {
    "monday": { "open": "08:00", "close": "17:00" }
  },
  "status": "active"
}
```

**Common Specialties**: `cardiology`, `pediatrics`, `general_medicine`, `orthopedics`, `dermatology`, `ophthalmology`, `ent`, `gynecology`

### List Clinics
```http
GET /departments/:departmentId/clinics?specialty=cardiology
```

### Get Clinic
```http
GET /clinics/:id
```

**Response includes:**
- Clinic details
- List of all consultation spaces/rooms
- Department and facility information

### Update Clinic
```http
PATCH /clinics/:id
Content-Type: application/json

{
  "name": "Updated Clinic Name",
  "totalRooms": 8
}
```

### Delete Clinic
```http
DELETE /clinics/:id
```

---

## 🗺️ **Complete API Hierarchy**

```
Foundation Service (http://localhost:3010)
│
├─ /tenants
│   ├─ POST   /tenants
│   ├─ GET    /tenants
│   ├─ GET    /tenants/:id
│   ├─ PUT    /tenants/:id
│   └─ DELETE /tenants/:id
│
├─ /users
│   ├─ POST   /users
│   ├─ GET    /users
│   ├─ GET    /users/:id
│   ├─ PUT    /users/:id
│   ├─ DELETE /users/:id
│   └─ /users/:userId/facilities
│       ├─ GET    /users/:userId/facilities
│       ├─ POST   /users/:userId/facilities/assign
│       ├─ POST   /users/:userId/facilities/set-default
│       ├─ DELETE /users/:userId/facilities/:facilityId
│       └─ GET    /users/:userId/facilities/check/:facilityId
│
├─ /facilities
│   ├─ POST   /facilities
│   ├─ GET    /facilities
│   ├─ GET    /facilities/:id
│   ├─ PUT    /facilities/:id
│   ├─ DELETE /facilities/:id
│   ├─ GET    /facilities/:facilityId/users
│   └─ /facilities/:facilityId/departments
│       ├─ POST   /facilities/:facilityId/departments
│       ├─ GET    /facilities/:facilityId/departments
│       ├─ GET    /facilities/:facilityId/departments/:id
│       ├─ PATCH  /facilities/:facilityId/departments/:id
│       └─ DELETE /facilities/:facilityId/departments/:id
│
├─ /departments
│   ├─ GET    /departments/:id
│   ├─ PATCH  /departments/:id
│   ├─ DELETE /departments/:id
│   ├─ /departments/:departmentId/wards (IPD)
│   │   ├─ POST /departments/:departmentId/wards
│   │   └─ GET  /departments/:departmentId/wards
│   └─ /departments/:departmentId/clinics (OPD)
│       ├─ POST /departments/:departmentId/clinics
│       └─ GET  /departments/:departmentId/clinics
│
├─ /wards (IPD)
│   ├─ GET    /wards/:id
│   ├─ GET    /wards/:id/availability
│   ├─ PATCH  /wards/:id
│   ├─ DELETE /wards/:id
│   └─ /wards/:wardId/beds
│       ├─ POST /wards/:wardId/beds
│       └─ GET  /wards/:wardId/beds
│
├─ /beds (IPD)
│   ├─ GET    /beds/available
│   ├─ GET    /beds/:id
│   ├─ POST   /beds/:id/assign
│   ├─ POST   /beds/:id/release
│   ├─ PATCH  /beds/:id
│   └─ DELETE /beds/:id
│
└─ /clinics (OPD)
    ├─ GET    /clinics/:id
    ├─ PATCH  /clinics/:id
    └─ DELETE /clinics/:id
```

---

## 🧪 **Testing the APIs**

### Example 1: Create OPD Flow
```bash
# 1. Create OPD Department
curl -X POST http://localhost:3010/facilities/{facilityId}/departments \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: {tenantId}" \
  -d '{
    "name": "Outpatient Department",
    "code": "OPD",
    "departmentType": "opd"
  }'

# 2. Create Cardiology Clinic
curl -X POST http://localhost:3010/departments/{departmentId}/clinics \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: {tenantId}" \
  -d '{
    "name": "Cardiology Clinic",
    "code": "CARDIO-1",
    "specialty": "cardiology",
    "totalRooms": 5
  }'

# 3. Get Clinic Details
curl -X GET http://localhost:3010/clinics/{clinicId} \
  -H "x-tenant-id: {tenantId}"
```

### Example 2: Create IPD Flow with Bed Assignment
```bash
# 1. Create IPD Department
curl -X POST http://localhost:3010/facilities/{facilityId}/departments \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: {tenantId}" \
  -d '{
    "name": "Inpatient Department",
    "code": "IPD",
    "departmentType": "ipd"
  }'

# 2. Create ICU Ward
curl -X POST http://localhost:3010/departments/{departmentId}/wards \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: {tenantId}" \
  -d '{
    "name": "ICU Ward 1",
    "code": "ICU-1",
    "wardType": "icu",
    "totalBeds": 10,
    "floorNumber": "2"
  }'

# 3. Create Beds
curl -X POST http://localhost:3010/wards/{wardId}/beds \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: {tenantId}" \
  -d '{
    "bedNumber": "ICU-101",
    "bedType": "icu",
    "features": {
      "oxygen": true,
      "monitor": true,
      "ventilator": true
    }
  }'

# 4. Check Ward Availability
curl -X GET http://localhost:3010/wards/{wardId}/availability \
  -H "x-tenant-id: {tenantId}"

# 5. Assign Patient to Bed
curl -X POST http://localhost:3010/beds/{bedId}/assign \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: {tenantId}" \
  -d '{
    "patientId": "patient-uuid",
    "notes": "Patient admitted for cardiac monitoring"
  }'

# 6. Release Patient from Bed
curl -X POST http://localhost:3010/beds/{bedId}/release \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: {tenantId}" \
  -d '{
    "notes": "Patient discharged"
  }'
```

### Example 3: Query Available Beds
```bash
# Get all available beds
curl -X GET http://localhost:3010/beds/available \
  -H "x-tenant-id: {tenantId}"

# Get available beds in specific ward
curl -X GET "http://localhost:3010/beds/available?wardId={wardId}" \
  -H "x-tenant-id: {tenantId}"
```

---

## 📊 **Business Logic & Validations**

### Department Creation
- ✅ Facility must exist and be active
- ✅ Department code must be unique within facility
- ✅ Head of department (if provided) must be active staff in same tenant
- ✅ Department type determines what can be created under it:
  - `ipd` → Can create Wards
  - `opd` → Can create Clinics
  - Others → Can create Spaces directly

### Ward Creation (IPD)
- ✅ Department must exist and be IPD type
- ✅ Ward code must be unique within department
- ✅ totalBeds and availableBeds initialized to same value
- ✅ Department must be active

### Bed Creation (IPD)
- ✅ Ward must exist and be active
- ✅ Bed number must be unique within ward
- ✅ Auto-updates ward totalBeds count
- ✅ Auto-updates ward availableBeds count

### Bed Assignment
- ✅ Bed must be available (not occupied, not in maintenance)
- ✅ Patient must exist and belong to same tenant
- ✅ Patient must be active
- ✅ Patient cannot be assigned to multiple beds simultaneously
- ✅ Bed status changes to 'occupied'
- ✅ Ward availableBeds count decremented
- ✅ assignedAt timestamp recorded

### Bed Release
- ✅ Bed must be occupied
- ✅ Clears currentPatientId
- ✅ Bed status changes to 'available'
- ✅ Ward availableBeds count incremented
- ✅ assignedAt timestamp cleared

### Clinic Creation (OPD)
- ✅ Department must exist and be OPD type
- ✅ Clinic code must be unique within department
- ✅ Department must be active

### Deletion Rules
- ❌ Cannot delete department with active wards, clinics, or spaces
- ❌ Cannot delete ward with occupied beds
- ❌ Cannot delete occupied bed (must release patient first)
- ❌ Cannot delete clinic with active spaces
- ✅ Soft delete (status='inactive') preferred for departments, wards, clinics

---

## 🔄 **Automatic Updates**

### Ward Bed Count Management
When a bed is:
- **Created** → ward.totalBeds++, ward.availableBeds++
- **Assigned** → ward.availableBeds--
- **Released** → ward.availableBeds++
- **Deleted** → ward.totalBeds--, ward.availableBeds-- (if available)

These updates happen automatically via `WardRepository.updateBedCounts()`.

---

## 📈 **Query Patterns**

### Get Full Facility Hierarchy
```typescript
// Get facility with all departments, wards, beds, clinics, and spaces
const facility = await prisma.facility.findUnique({
  where: { id: facilityId },
  include: {
    departments: {
      include: {
        wards: {
          include: {
            beds: {
              include: {
                currentPatient: true
              }
            }
          }
        },
        clinics: {
          include: {
            spaces: true
          }
        },
        spaces: true
      }
    }
  }
});
```

### Get IPD Bed Occupancy Report
```typescript
const ipdDepartments = await prisma.department.findMany({
  where: {
    facilityId,
    departmentType: 'ipd'
  },
  include: {
    wards: {
      select: {
        name: true,
        wardType: true,
        totalBeds: true,
        availableBeds: true,
        beds: {
          where: {
            status: 'occupied'
          },
          include: {
            currentPatient: true
          }
        }
      }
    }
  }
});
```

### Get OPD Clinic Utilization
```typescript
const opdDepartments = await prisma.department.findMany({
  where: {
    facilityId,
    departmentType: 'opd'
  },
  include: {
    clinics: {
      select: {
        name: true,
        specialty: true,
        totalRooms: true,
        spaces: {
          where: {
            isActive: true
          }
        }
      }
    }
  }
});
```

---

## 🎯 **Common Use Cases**

### Use Case 1: Patient Admission (IPD)
1. Find available bed: `GET /beds/available?wardId={wardId}`
2. Assign patient: `POST /beds/{bedId}/assign`
3. Check ward occupancy: `GET /wards/{wardId}/availability`

### Use Case 2: Patient Discharge (IPD)
1. Get bed details: `GET /beds/{bedId}`
2. Release patient: `POST /beds/{bedId}/release`
3. Verify bed is available: `GET /beds/{bedId}`

### Use Case 3: Setup New Facility
1. Create facility: `POST /facilities`
2. Create OPD department: `POST /facilities/{facilityId}/departments`
3. Create clinics: `POST /departments/{departmentId}/clinics`
4. Create IPD department: `POST /facilities/{facilityId}/departments`
5. Create wards: `POST /departments/{departmentId}/wards`
6. Create beds: `POST /wards/{wardId}/beds`

### Use Case 4: Find Patient's Current Bed
```typescript
const bed = await prisma.bed.findFirst({
  where: {
    currentPatientId: patientId,
    status: 'occupied'
  },
  include: {
    ward: {
      include: {
        department: {
          include: {
            facility: true
          }
        }
      }
    }
  }
});
```

---

## ✅ **Verification**

All endpoints are **LIVE** and **TESTED**:

```bash
✅ POST   /facilities/:facilityId/departments
✅ GET    /facilities/:facilityId/departments
✅ GET    /departments/:id
✅ PATCH  /departments/:id
✅ DELETE /departments/:id

✅ POST   /departments/:departmentId/wards
✅ GET    /departments/:departmentId/wards
✅ GET    /wards/:id
✅ GET    /wards/:id/availability
✅ PATCH  /wards/:id
✅ DELETE /wards/:id

✅ POST   /wards/:wardId/beds
✅ GET    /wards/:wardId/beds
✅ GET    /beds/available
✅ GET    /beds/:id
✅ POST   /beds/:id/assign
✅ POST   /beds/:id/release
✅ PATCH  /beds/:id
✅ DELETE /beds/:id

✅ POST   /departments/:departmentId/clinics
✅ GET    /departments/:departmentId/clinics
✅ GET    /clinics/:id
✅ PATCH  /clinics/:id
✅ DELETE /clinics/:id
```

---

## 📚 **Related Documentation**

- `docs/ENHANCED-FACILITY-HIERARCHY-DESIGN.md` - Full design
- `docs/FACILITY-HIERARCHY-SUMMARY.md` - Quick reference
- `docs/DEPLOYMENT-SUCCESS.md` - Database deployment
- `docs/BACKEND-MODULES-IMPLEMENTATION.md` - Module details
- `backend/shared/database/prisma/schema.prisma` - Schema reference

---

**Last Updated**: October 8, 2025  
**Status**: ✅ **ALL ENDPOINTS OPERATIONAL**  
**Next**: Update Postman collection with new endpoints
