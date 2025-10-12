# Specialty Management API Reference

**Service**: Foundation Service  
**Base URL**: `http://localhost:3010`  
**Date**: October 8, 2025  
**Status**: ✅ **OPERATIONAL**

---

## 📋 **Endpoints Overview**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/specialties` | GET | List all specialties |
| `/specialties/stats` | GET | Get specialty statistics |
| `/specialties/code/:code` | GET | Get specialty by code |
| `/specialties/:id` | GET | Get specialty by ID |
| `/staff/search/by-specialty` | GET | Search staff by specialty |
| `/staff/doctors/specialty/:specialtyCode` | GET | Find doctors by specialty |
| `/staff/:staffId/specialties` | GET, POST | Get/assign specialties |
| `/staff/:staffId/specialties/bulk` | POST | Bulk assign specialties |
| `/staff/:staffId/specialties/primary/:specialtyId` | PUT | Change primary specialty |
| `/staff/:staffId/specialties/:specialtyId` | DELETE | Remove specialty |

---

## 🔍 **Specialty Management Endpoints**

### **1. List All Specialties**
```http
GET /specialties?includeInactive=false&locale=ar
```

**Query Parameters**:
- `includeInactive` (boolean, optional): Include inactive specialties
- `locale` (string, optional): Language code ('en', 'ar')

**Response**:
```json
[
  {
    "id": "10000000-0000-0000-0000-000000000020",
    "code": "CARDIO",
    "name": "Cardiology",
    "description": "Heart and cardiovascular system",
    "isActive": true,
    "sortOrder": 200,
    "translations": [
      {
        "lang": "ar",
        "displayName": "أمراض القلب"
      }
    ],
    "authorityCodes": [
      {
        "authority": "DHA",
        "authorityCode": "MED-010",
        "authorityName": "Cardiology"
      }
    ],
    "localizedName": "أمراض القلب"
  }
]
```

### **2. Get Specialty by Code**
```http
GET /specialties/code/ORTHO?locale=ar
```

**Response**:
```json
{
  "id": "10000000-0000-0000-0000-000000000011",
  "code": "ORTHO",
  "name": "Orthopedics",
  "localizedName": "جراحة العظام",
  "authorityCodes": [
    {
      "authority": "DHA",
      "authorityCode": "SURG-001"
    }
  ]
}
```

### **3. Get Specialty Statistics**
```http
GET /specialties/stats
Headers:
  x-tenant-id: {tenantId}
```

**Response**:
```json
[
  {
    "specialty": {
      "id": "...",
      "code": "CARDIO",
      "name": "Cardiology"
    },
    "activeStaffCount": 3
  },
  {
    "specialty": {
      "code": "ORTHO",
      "name": "Orthopedics"
    },
    "activeStaffCount": 2
  }
]
```

---

## 👨‍⚕️ **Staff Specialty Assignment Endpoints**

### **1. Assign Specialty to Staff**
```http
POST /staff/{staffId}/specialties
Headers:
  x-tenant-id: {tenantId}
  Content-Type: application/json

Body:
{
  "specialtyId": "10000000-0000-0000-0000-000000000020",
  "primaryFlag": true
}
```

**Response**:
```json
{
  "success": true,
  "staffSpecialty": {
    "id": "...",
    "staffId": "...",
    "specialtyId": "...",
    "primaryFlag": true,
    "specialty": {
      "code": "CARDIO",
      "name": "Cardiology"
    }
  },
  "message": "Primary specialty assigned successfully"
}
```

**Business Rules**:
- ✅ Only one primary specialty per staff member (enforced)
- ✅ Setting new primary automatically removes old primary flag
- ✅ Cannot assign inactive specialties
- ✅ Cannot assign duplicate specialty to same staff

### **2. Bulk Assign Specialties**
```http
POST /staff/{staffId}/specialties/bulk
Headers:
  x-tenant-id: {tenantId}

Body:
{
  "primarySpecialtyId": "10000000-0000-0000-0000-000000000020",
  "secondarySpecialtyIds": [
    "10000000-0000-0000-0000-000000000001",
    "10000000-0000-0000-0000-000000000024"
  ]
}
```

**Response**:
```json
{
  "success": true,
  "primary": {
    "specialty": {
      "code": "CARDIO",
      "name": "Cardiology"
    },
    "primaryFlag": true
  },
  "secondaries": [
    {
      "specialty": {
        "code": "GEN_MED",
        "name": "General Medicine"
      },
      "primaryFlag": false
    },
    {
      "specialty": {
        "code": "ENDO",
        "name": "Endocrinology"
      },
      "primaryFlag": false
    }
  ],
  "message": "Specialties assigned successfully"
}
```

**Business Rules**:
- ✅ Replaces ALL existing specialties
- ✅ Primary cannot be in secondary list
- ✅ All specialties must be active
- ✅ Atomic operation (all or nothing)

### **3. Get Staff Specialties**
```http
GET /staff/{staffId}/specialties?locale=ar
```

**Response**:
```json
[
  {
    "id": "...",
    "specialtyId": "...",
    "specialtyCode": "CARDIO",
    "specialtyName": "أمراض القلب",
    "isPrimary": true,
    "assignedAt": "2025-10-08T10:00:00Z",
    "specialty": {
      "code": "CARDIO",
      "name": "Cardiology",
      "localizedName": "أمراض القلب"
    }
  },
  {
    "specialtyCode": "GEN_MED",
    "specialtyName": "طب عام",
    "isPrimary": false
  }
]
```

### **4. Change Primary Specialty**
```http
PUT /staff/{staffId}/specialties/primary/{specialtyId}
```

**Response**:
```json
{
  "success": true,
  "primarySpecialty": {
    "specialtyCode": "ORTHO",
    "primaryFlag": true
  },
  "message": "Primary specialty changed successfully"
}
```

**Business Rules**:
- ✅ Specialty must already be assigned to staff
- ✅ Automatically removes primary flag from previous
- ✅ Atomic operation

### **5. Remove Specialty from Staff**
```http
DELETE /staff/{staffId}/specialties/{specialtyId}
```

**Response**:
```json
{
  "success": true,
  "message": "Specialty removed successfully"
}
```

**Business Rules**:
- ❌ Cannot remove primary specialty (change primary first)
- ❌ Cannot remove the only specialty (staff must have at least one)

---

## 🔍 **Specialty-Based Doctor Search**

### **1. General Search**
```http
GET /staff/search/by-specialty?specialtyCode=ORTHO&staffType=doctor&primaryOnly=true&activeOnly=true&facilityId={facilityId}&locale=ar
Headers:
  x-tenant-id: {tenantId}
```

**Query Parameters**:
- `specialtyCode` (string, optional): Specialty code (e.g., 'ORTHO')
- `specialtyId` (UUID, optional): Specialty ID
- `staffType` (enum, optional): 'doctor', 'nurse', 'technician', 'support'
- `primaryOnly` (boolean, default: true): Only primary specialties
- `activeOnly` (boolean, default: true): Only active staff
- `facilityId` (UUID, optional): Filter by facility
- `locale` (string, optional): Language for translations

**Response**:
```json
[
  {
    "staffId": "d4444444-4444-4444-4444-444444444444",
    "employee": {
      "employeeId": "DOC004",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "fullName": "Sarah Johnson",
      "staffType": "doctor",
      "phoneNumber": "+971504567890",
      "email": "sarah.johnson@armc.ae",
      "licenseNumber": "DHA-DOC-2024-004",
      "licenseExpiry": "2026-09-30",
      "status": "active"
    },
    "specialty": {
      "id": "...",
      "code": "ORTHO",
      "name": "جراحة العظام",
      "isPrimary": true
    },
    "hasSystemAccess": true,
    "userEmail": "sarah.johnson@armc.ae",
    "departments": [],
    "assignedAt": "2025-10-08T10:00:00Z"
  }
]
```

### **2. Quick Doctor Search (Convenience Endpoint)**
```http
GET /staff/doctors/specialty/CARDIO?facilityId={facilityId}&locale=ar
Headers:
  x-tenant-id: {tenantId}
```

**Automatically filters**:
- ✅ Only doctors
- ✅ Only primary specialty
- ✅ Only active staff

**Response**: Same as general search

---

## 💡 **Use Case Examples**

### **Use Case 1: Assign Cardiology to a Doctor**

```bash
# 1. Find cardiology specialty
curl -X GET http://localhost:3010/specialties/code/CARDIO

# 2. Assign as primary specialty
curl -X POST http://localhost:3010/staff/d1111111-1111-1111-1111-111111111111/specialties \
  -H "x-tenant-id: 11111111-1111-1111-1111-111111111111" \
  -H "Content-Type: application/json" \
  -d '{
    "specialtyId": "10000000-0000-0000-0000-000000000020",
    "primaryFlag": true
  }'
```

### **Use Case 2: Assign Multiple Specialties**

```bash
curl -X POST http://localhost:3010/staff/d1111111-1111-1111-1111-111111111111/specialties/bulk \
  -H "x-tenant-id: 11111111-1111-1111-1111-111111111111" \
  -H "Content-Type: application/json" \
  -d '{
    "primarySpecialtyId": "10000000-0000-0000-0000-000000000020",
    "secondarySpecialtyIds": [
      "10000000-0000-0000-0000-000000000001"
    ]
  }'
```

### **Use Case 3: Find Orthopedic Doctors**

```bash
curl -X GET 'http://localhost:3010/staff/doctors/specialty/ORTHO?locale=ar' \
  -H "x-tenant-id: 11111111-1111-1111-1111-111111111111"
```

### **Use Case 4: Search All Staff with Cardiology (including nurses)**

```bash
curl -X GET 'http://localhost:3010/staff/search/by-specialty?specialtyCode=CARDIO&primaryOnly=false' \
  -H "x-tenant-id: 11111111-1111-1111-1111-111111111111"
```

---

## ✅ **API Features**

### **Primary Specialty Enforcement** ✅
- Database constraint ensures only one primary per staff
- API automatically removes old primary when setting new
- Prevents orphaned primary flags

### **Specialty-Based Doctor Search** ✅
- Search by specialty code or ID
- Filter by staff type (doctor, nurse, etc.)
- Filter by facility
- Primary specialty only or all
- Active staff only or all
- Multilingual results

### **Multilingual Support** ✅
- English names by default
- Arabic translations available
- Pass `locale=ar` query parameter
- Returns `localizedName` field

### **UAE Authority Compliance** ✅
- DHA/DOH/MOHAP code mappings
- Validate licenses against authority codes
- Extensible for more authorities

---

## 🧪 **Testing Guide**

### **Test 1: List All Specialties**
```bash
curl http://localhost:3010/specialties | python3 -m json.tool
```
**Expected**: 25 specialties with translations

### **Test 2: Get Cardiology in Arabic**
```bash
curl 'http://localhost:3010/specialties/code/CARDIO?locale=ar' | python3 -m json.tool
```
**Expected**: `"localizedName": "أمراض القلب"`

### **Test 3: Assign Specialty (requires staff data)**
```bash
# First, seed staff data
cd /Users/sajithchandran/aira/zeal/seed
docker exec -i zeal-postgres psql -U zeal_user -d zeal_pms < 21-staff.sql

# Then assign
curl -X POST http://localhost:3010/staff/d1111111-1111-1111-1111-111111111111/specialties \
  -H "x-tenant-id: 11111111-1111-1111-1111-111111111111" \
  -H "Content-Type: application/json" \
  -d '{"specialtyId": "10000000-0000-0000-0000-000000000020", "primaryFlag": true}'
```

---

## 📊 **Summary**

**Total Endpoints**: 11  
**Categories**:
- Specialty Management: 4 endpoints
- Staff Assignment: 5 endpoints
- Doctor Search: 2 endpoints

**Features**:
✅ Multilingual (Arabic/English)  
✅ Primary specialty enforcement  
✅ Specialty-based search  
✅ UAE authority code mapping  
✅ Bulk assignment  
✅ Real-time statistics  

**Status**: ✅ **FULLY OPERATIONAL**
