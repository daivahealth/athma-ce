# Facility Hierarchy - Quick Reference

## 📊 **Simplified Structure (No Location Entity)**

```
Tenant
 └─ Facility (with location & geocodes)
     └─ Department
         ├─ Ward (IPD)
         │   └─ Bed
         └─ Clinic (OPD)
             └─ Space
```

---

## 🏥 **Entity Breakdown**

### 1. **Tenant** (Organization)
- Healthcare organization/network
- Can have multiple facilities across UAE

### 2. **Facility** (Physical Building)
- Hospital, Clinic, Diagnostic Center, Pharmacy
- **NEW**: Includes full address + geocodes (lat/lng)
- **NEW**: `code` field for unique identification
- **NEW**: `googlePlaceId` for Maps integration
- **NEW**: `buildingNumber`, `floorNumbers`, `totalFloors`

### 3. **Department** (Functional Unit)
- OPD, IPD, Radiology, Laboratory, Surgery, Emergency, Pharmacy
- Belongs to a Facility
- Has a `departmentType` to distinguish IPD vs OPD

### 4. **Ward** (IPD Only)
- Groups beds for inpatient care
- Types: ICU, NICU, PICU, General, Isolation, Maternity
- Tracks `totalBeds` and `availableBeds`

### 5. **Bed** (IPD Only)
- Individual bed for patient admission
- Types: Standard, ICU, Isolation, Private, Semi-Private
- Status: Available, Occupied, Maintenance, Reserved
- Links to current patient

### 6. **Clinic** (OPD Only)
- Groups consultation rooms for outpatient care
- Linked to medical specialty (Cardiology, Pediatrics, etc.)
- Tracks `totalRooms`

### 7. **Space** (Physical Room)
- Consultation, Procedure, Diagnostic, Operating Room
- Can belong to Department or Clinic
- **NEW**: `floorNumber` field

---

## 🗺️ **Key Geocode Fields in Facility**

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `latitude` | Decimal(10,8) | Precise location | 25.2048493 |
| `longitude` | Decimal(11,8) | Precise location | 55.2707828 |
| `googlePlaceId` | String | Google Maps ID | ChIJXxR... |
| `city` | String | City name | Dubai |
| `emirate` | String | Emirate name | Dubai |
| `addressLine1` | String | Street address | Sheikh Zayed Road |
| `addressLine2` | String | Additional address | Building 5, Floor 3 |
| `postalCode` | String | Postal code | 12345 |
| `country` | String | Country (default: UAE) | UAE |

---

## 🎯 **Real-World Example**

```
Al Rashid Medical Center (Tenant)
 │
 ├─ Main Hospital (Facility)
 │   📍 Dubai Healthcare City, Dubai
 │   🌍 25.2048, 55.2708
 │   │
 │   ├─ OPD Department
 │   │   ├─ Cardiology Clinic
 │   │   │   ├─ Room 101 (Space)
 │   │   │   └─ ECG Room (Space)
 │   │   └─ Pediatrics Clinic
 │   │       └─ Room 201 (Space)
 │   │
 │   └─ IPD Department
 │       ├─ ICU Ward
 │       │   ├─ Bed ICU-101
 │       │   └─ Bed ICU-102
 │       └─ General Ward A
 │           └─ Bed GEN-201
 │
 └─ Diagnostic Center (Facility)
     📍 Al Wasl Road, Dubai
     🌍 25.2285, 55.2843
     └─ Laboratory Department
         ├─ Blood Lab (Space)
         └─ Microbiology Lab (Space)
```

---

## 🚀 **Key Benefits**

### ✅ **Simplified Architecture**
- No separate Location entity
- Location data embedded in Facility
- Fewer joins, better performance

### ✅ **Geographic Intelligence**
- Find nearest facility by geocode
- Map view of all facilities
- Distance-based search
- Coverage analysis by city/emirate

### ✅ **IPD/OPD Separation**
- Ward → Bed (for inpatients)
- Clinic → Space (for outpatients)
- Different workflows for each

### ✅ **Scalability**
- Supports small clinics to large hospital networks
- Multiple facilities per tenant
- Department-level autonomy

---

## 📋 **Common Queries**

### Find Facilities in a City
```typescript
const facilities = await prisma.facility.findMany({
  where: {
    tenantId: 'xxx',
    city: 'Dubai',
    status: 'active'
  }
});
```

### Find Nearby Facilities (5km radius)
```sql
SELECT *,
  (6371 * acos(
    cos(radians(25.2048)) * cos(radians(latitude)) *
    cos(radians(longitude) - radians(55.2708)) +
    sin(radians(25.2048)) * sin(radians(latitude))
  )) AS distance_km
FROM facilities
WHERE latitude IS NOT NULL
  AND longitude IS NOT NULL
HAVING distance_km < 5
ORDER BY distance_km;
```

### Get Facility with Full Hierarchy
```typescript
const facility = await prisma.facility.findUnique({
  where: { id: 'xxx' },
  include: {
    departments: {
      include: {
        wards: {
          include: {
            beds: true
          }
        },
        clinics: {
          include: {
            spaces: true
          }
        }
      }
    }
  }
});
```

### Check Bed Availability in Ward
```typescript
const ward = await prisma.ward.findUnique({
  where: { id: 'xxx' },
  include: {
    beds: {
      where: {
        status: 'available'
      }
    }
  }
});

console.log(`Available beds: ${ward.beds.length}/${ward.totalBeds}`);
```

---

## 🔄 **Migration Path**

### Phase 1: Add Geocode Fields to Facility
```sql
ALTER TABLE facilities ADD COLUMN latitude DECIMAL(10, 8);
ALTER TABLE facilities ADD COLUMN longitude DECIMAL(11, 8);
ALTER TABLE facilities ADD COLUMN google_place_id VARCHAR(255);
ALTER TABLE facilities ADD COLUMN code VARCHAR(50);
ALTER TABLE facilities ADD COLUMN building_number VARCHAR(50);
ALTER TABLE facilities ADD COLUMN floor_numbers TEXT[];
```

### Phase 2: Create New Tables
```sql
CREATE TABLE departments (...);
CREATE TABLE wards (...);
CREATE TABLE beds (...);
CREATE TABLE clinics (...);
```

### Phase 3: Migrate Data
```sql
-- Generate facility codes
UPDATE facilities SET code = CONCAT(city_code, '-', type_code, '-', seq);

-- Create default OPD departments
INSERT INTO departments (facility_id, name, code, department_type)
SELECT id, 'Outpatient Department', 'OPD', 'opd' FROM facilities;

-- Create default clinics
INSERT INTO clinics (department_id, name, code)
SELECT id, 'General Clinic', 'GEN-CLINIC' FROM departments WHERE department_type = 'opd';
```

---

## 📱 **UI Features Enabled**

### 1. Facility Map View
- Show all facilities on a map
- Filter by city, emirate, type
- Click marker to see details
- Get directions

### 2. Facility Finder
- "Find nearest facility"
- Distance-based search
- Filter by services available

### 3. Bed Management Dashboard
- Real-time bed occupancy
- Ward-level view
- Bed assignment workflow

### 4. Clinic Scheduling
- Clinic-specific schedules
- Room availability
- Specialty-based filtering

---

## 🎨 **Frontend Components**

### Facility Selector with Map
```typescript
<FacilitySelector
  tenantId={tenantId}
  showMap={true}
  filterByCity={true}
  onSelect={(facility) => {
    console.log(`Selected: ${facility.name}`);
    console.log(`Location: ${facility.latitude}, ${facility.longitude}`);
  }}
/>
```

### Department Navigator
```typescript
<DepartmentNavigator
  facilityId={facilityId}
  onSelectDepartment={(dept) => {
    if (dept.departmentType === 'ipd') {
      // Show wards and beds
    } else if (dept.departmentType === 'opd') {
      // Show clinics and spaces
    }
  }}
/>
```

### Bed Availability Widget
```typescript
<BedAvailability
  wardId={wardId}
  showRealTime={true}
  allowAssignment={hasPermission('ward:assign:patient')}
/>
```

---

## 📊 **Analytics & Reporting**

### Tenant-Level
- Total facilities by city/emirate
- Geographic coverage map
- Facility utilization rates

### Facility-Level
- Department performance
- IPD bed occupancy
- OPD clinic throughput

### Department-Level
- Ward occupancy (IPD)
- Clinic appointments (OPD)
- Resource utilization

### Ward/Clinic-Level
- Bed turnover rates
- Patient wait times
- Room utilization

---

## ✅ **Implementation Checklist**

### Database
- [ ] Update Prisma schema with geocode fields
- [ ] Create Department, Ward, Bed, Clinic models
- [ ] Generate migration files
- [ ] Test on dev database

### Backend
- [ ] Update Facility module with geocode validation
- [ ] Implement nearby facility search
- [ ] Create Department CRUD
- [ ] Create Ward/Bed modules (IPD)
- [ ] Create Clinic module (OPD)
- [ ] Update Space module

### Frontend
- [ ] Facility map view component
- [ ] Facility finder with distance search
- [ ] Department navigator
- [ ] Ward/Bed management UI
- [ ] Clinic scheduling UI

### Integration
- [ ] Google Maps API integration
- [ ] Geocoding service
- [ ] Update appointment booking
- [ ] Update encounter creation

---

## 🔗 **Related Documents**

- **Full Design**: `docs/ENHANCED-FACILITY-HIERARCHY-DESIGN.md`
- **Domain Model**: `docs/03-Domain-Model.md`
- **Data Model**: `docs/05-Data-Model.md`
- **Prisma Schema**: `backend/shared/database/prisma/schema.prisma`

---

**Last Updated**: October 8, 2025  
**Status**: Design Approved ✅  
**Next Step**: Implement Prisma schema updates
