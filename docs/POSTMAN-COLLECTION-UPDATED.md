# Postman Collection Updated - Facility Hierarchy v2.0

**Date**: October 8, 2025  
**Status**: ✅ **COMPLETE & READY FOR TESTING**

---

## 📊 **What Was Updated**

### **1. Collection File** ✅
**File**: `docs/postman/zeal-backend.postman_collection.json`

**Added 24 New Endpoints:**
- ✅ 5 Department endpoints
- ✅ 6 Ward endpoints (IPD)
- ✅ 8 Bed endpoints (IPD) with patient assignment
- ✅ 5 Clinic endpoints (OPD)

**New Folders:**
- `Departments` - Department CRUD operations
- `Wards (IPD)` - Ward management with availability tracking
- `Beds (IPD)` - Bed management with patient assignment/release
- `Clinics (OPD)` - Clinic management by specialty

### **2. Environment File** ✅
**File**: `docs/postman/zeal-local.postman_environment.json`

**Added 5 New Variables:**
- `departmentId` - Auto-updated when creating department
- `wardId` - Auto-updated when creating ward
- `bedId` - Auto-updated when creating bed
- `clinicId` - Auto-updated when creating clinic
- `patientId` - For bed assignment testing

### **3. Documentation** ✅
**File**: `docs/postman/README.md`

**Updated Sections:**
- Environment variables list
- Collection structure (now 50+ endpoints)
- 4 new testing scenarios
- Quick start guide
- Related documentation links

---

## 🎯 **New Endpoints Summary**

### **Departments (5 endpoints)**
```
POST   /facilities/:facilityId/departments
GET    /facilities/:facilityId/departments?type=opd
GET    /departments/:id
PATCH  /departments/:id
DELETE /departments/:id
```

### **Wards - IPD (6 endpoints)**
```
POST   /departments/:departmentId/wards
GET    /departments/:departmentId/wards?type=icu
GET    /wards/:id
GET    /wards/:id/availability  ⭐ Real-time occupancy
PATCH  /wards/:id
DELETE /wards/:id
```

### **Beds - IPD (8 endpoints)**
```
POST   /wards/:wardId/beds
GET    /wards/:wardId/beds?status=available
GET    /beds/available?wardId=xxx
GET    /beds/:id
POST   /beds/:id/assign       ⭐ Assign patient
POST   /beds/:id/release      ⭐ Release patient
PATCH  /beds/:id
DELETE /beds/:id
```

### **Clinics - OPD (5 endpoints)**
```
POST   /departments/:departmentId/clinics
GET    /departments/:departmentId/clinics?specialty=cardiology
GET    /clinics/:id
PATCH  /clinics/:id
DELETE /clinics/:id
```

---

## 🧪 **Testing Workflows**

### **Workflow 1: OPD Setup**
```
1. Login
2. Get User Facilities → facilityId saved
3. Create OPD Department → departmentId saved
4. Create Cardiology Clinic → clinicId saved
5. Get Clinic → Verify created
```

### **Workflow 2: IPD Setup with Patient Admission**
```
1. Login
2. Get User Facilities → facilityId saved
3. Create IPD Department → departmentId saved
4. Create ICU Ward → wardId saved
5. Create Bed ICU-101 → bedId saved
6. Get Ward Availability → totalBeds: 1, availableBeds: 1
7. Assign Patient to Bed → Patient admitted
8. Get Ward Availability → totalBeds: 1, availableBeds: 0
9. Get Bed → Verify patient assigned
10. Release Patient → Patient discharged
11. Get Ward Availability → totalBeds: 1, availableBeds: 1
```

### **Workflow 3: Multi-Ward Setup**
```
1. Create IPD Department
2. Create ICU Ward → Create 5 ICU beds
3. Create General Ward → Create 10 general beds
4. Create Isolation Ward → Create 3 isolation beds
5. Get Available Beds → See all 18 beds
6. Filter by ward: Get Available Beds?wardId=xxx
```

---

## 📋 **Auto-Variable Chaining**

The collection uses test scripts to automatically save IDs for request chaining:

### **After Create Department:**
```javascript
if (pm.response.code === 201) {
  const body = pm.response.json();
  if (body.id) { pm.environment.set('departmentId', body.id); }
  console.log('Department created:', body.name);
}
```

### **After Create Ward:**
```javascript
if (pm.response.code === 201) {
  const body = pm.response.json();
  if (body.id) { pm.environment.set('wardId', body.id); }
  console.log('Ward created:', body.name);
}
```

### **After Create Bed:**
```javascript
if (pm.response.code === 201) {
  const body = pm.response.json();
  if (body.id) { pm.environment.set('bedId', body.id); }
  console.log('Bed created:', body.bedNumber);
}
```

### **After Create Clinic:**
```javascript
if (pm.response.code === 201) {
  const body = pm.response.json();
  if (body.id) { pm.environment.set('clinicId', body.id); }
  console.log('Clinic created:', body.name);
}
```

This allows you to run requests in sequence without manually copying IDs!

---

## 🎨 **Request Examples**

### **Create OPD Department**
```json
POST /facilities/{{facilityId}}/departments

{
  "name": "Outpatient Department",
  "code": "OPD",
  "departmentType": "opd",
  "floorNumber": "1",
  "phoneExtension": "1234",
  "operatingHours": {
    "monday": { "open": "08:00", "close": "17:00" },
    "tuesday": { "open": "08:00", "close": "17:00" }
  },
  "status": "active"
}
```

### **Create ICU Ward**
```json
POST /departments/{{departmentId}}/wards

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

### **Create ICU Bed**
```json
POST /wards/{{wardId}}/beds

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

### **Assign Patient to Bed**
```json
POST /beds/{{bedId}}/assign

{
  "patientId": "{{patientId}}",
  "notes": "Patient admitted for cardiac monitoring"
}
```

### **Release Patient from Bed**
```json
POST /beds/{{bedId}}/release

{
  "notes": "Patient discharged"
}
```

### **Create Cardiology Clinic**
```json
POST /departments/{{departmentId}}/clinics

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

---

## 📊 **Collection Statistics**

### **Before Update:**
- Total Endpoints: 26
- Folders: 3
- Variables: 7

### **After Update:**
- Total Endpoints: **50+** (+24 new)
- Folders: **7** (+4 new)
- Variables: **12** (+5 new)

### **New Folders:**
1. ✅ Departments (5 endpoints)
2. ✅ Wards (IPD) (6 endpoints)
3. ✅ Beds (IPD) (8 endpoints)
4. ✅ Clinics (OPD) (5 endpoints)

---

## 🚀 **How to Use**

### **Step 1: Import**
1. Open Postman
2. Import `docs/postman/zeal-backend.postman_collection.json`
3. Import `docs/postman/zeal-local.postman_environment.json`
4. Select "Zeal Local" environment

### **Step 2: Authenticate**
1. Run "Foundation Auth → Login" (`POST http://localhost:3010/api/v1/auth/login`)
2. Verify `accessToken` and `tenantId` are set
3. Run "User Facilities → Get User Facilities"
4. Verify `facilityId` is set

### **Step 3: Test Facility Hierarchy**

**OPD Flow:**
1. Run "Departments → Create Department" (type: opd)
2. Run "Clinics → Create Clinic"
3. Run "Clinics → List Clinics"
4. Run "Clinics → Get Clinic"

**IPD Flow:**
1. Run "Departments → Create Department" (type: ipd)
2. Run "Wards → Create Ward" (type: icu)
3. Run "Beds → Create Bed"
4. Run "Wards → Get Ward Availability"
5. Run "Beds → Assign Patient to Bed"
6. Run "Wards → Get Ward Availability" (verify occupancy changed)
7. Run "Beds → Release Patient from Bed"

---

## ✅ **Verification Checklist**

- [x] Collection file updated with 24 new endpoints
- [x] Environment file updated with 5 new variables
- [x] README updated with new scenarios
- [x] Auto-variable scripts added for ID chaining
- [x] All request bodies include proper examples
- [x] All endpoints include proper headers
- [x] Query parameters documented
- [x] Response examples documented

---

## 🎊 **Summary**

The Postman collection has been **fully updated** with all facility hierarchy endpoints!

**What's New:**
- ✅ 24 new endpoints for Department, Ward, Bed, and Clinic management
- ✅ 5 new environment variables for request chaining
- ✅ Auto-save scripts for seamless workflow testing
- ✅ Complete examples for all request bodies
- ✅ 8 comprehensive testing scenarios

**Ready to Test:**
- Import the updated collection
- Run the authentication flow
- Test the new facility hierarchy endpoints
- Verify patient admission workflow

**Total Collection Size:**
- **50+ endpoints** across 7 folders
- **12 environment variables**
- **8 testing scenarios**
- **Complete API coverage** for facility hierarchy

---

**Updated by**: AI Assistant  
**Date**: October 8, 2025  
**Status**: ✅ **READY FOR IMPORT & TESTING**
