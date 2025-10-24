# Enhanced Facility Hierarchy Design

## 🏥 **Proposed Structure**

```
Tenant (Organization)
 └─ Facility (Physical building with location: hospital, clinic, diagnostic center)
     └─ Department (Functional unit: OPD, IPD, Radiology, Surgery)
         ├─ Ward (IPD-specific; groups Beds)
         │   └─ Bed (Patient accommodation)
         └─ Clinic (OPD-specific; groups consultation rooms)
             └─ Space (Consultation rooms, procedure rooms)
```

---

## 📊 **Current vs Proposed Schema**

### Current Schema (Flat)
```
Tenant
 └─ Facility
     └─ Space
```

**Limitations:**
- ❌ No department organization
- ❌ No distinction between IPD/OPD areas
- ❌ No ward/bed management
- ❌ No clinic grouping
- ❌ No geocode/coordinates for mapping

### Proposed Schema (Hierarchical)
```
Tenant
 └─ Facility (enhanced with location & geocodes)
     └─ Department (NEW)
         ├─ Ward (NEW - IPD)
         │   └─ Bed (NEW)
         └─ Clinic (NEW - OPD)
             └─ Space (existing)
```

**Benefits:**
- ✅ Real-world healthcare structure
- ✅ Clear organizational hierarchy
- ✅ IPD/OPD separation
- ✅ Bed management for inpatients
- ✅ Clinic management for outpatients
- ✅ Department-level operations

---

## 🗂️ **New Data Models**

### 1. Enhanced Facility Model
**Purpose:** Physical building with location and geocode information

```prisma
model Facility {
  id              String       @id @default(uuid()) @map("id") @db.Uuid
  tenantId        String       @map("tenant_id") @db.Uuid
  name            String
  code            String?      // e.g., "DXB-MAIN-HOSP", "AUH-CLINIC-01"
  facilityType    String       @map("facility_type")  // hospital, clinic, diagnostic_center, pharmacy
  licenseNumber   String?      @map("license_number")
  
  // Location Information (NEW)
  addressLine1    String?      @map("address_line1")
  addressLine2    String?      @map("address_line2")
  city            String?
  emirate         String?
  postalCode      String?      @map("postal_code")
  country         String       @default("UAE")
  
  // Geocode Information (NEW)
  latitude        Decimal?     @db.Decimal(10, 8)  // e.g., 25.2048493
  longitude       Decimal?     @db.Decimal(11, 8)  // e.g., 55.2707828
  googlePlaceId   String?      @map("google_place_id")  // For Google Maps integration
  
  // Contact Information
  phoneNumber     String?      @map("phone_number")
  email           String?
  website         String?
  
  // Building Details (NEW)
  buildingNumber  String?      @map("building_number")
  floorNumbers    String[]     @map("floor_numbers")  // ["G", "1", "2", "3"]
  totalFloors     Int?         @map("total_floors")
  
  // Operational Details
  capacity        Int?         // Total beds/spaces
  operatingHours  Json?        @map("operating_hours")
  status          String       @default("active")
  
  createdAt       DateTime     @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt       DateTime     @updatedAt @map("updated_at") @db.Timestamptz(6)
  
  tenant          Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  departments     Department[] // NEW
  userFacilities  UserFacility[]
  defaultForUsers User[]       @relation("UserDefaultFacility")
  appointments    Appointment[]
  encounters      Encounter[]
  spaces          Space[]      // Legacy/direct spaces
  
  @@unique([tenantId, code])
  @@index([tenantId, facilityType])
  @@index([tenantId, city])
  @@index([tenantId, emirate])
  @@index([latitude, longitude])  // For geo-queries
  @@map("facilities")
}
```

**New Fields Explained:**
- **code**: Unique identifier within tenant (e.g., "DXB-MAIN-HOSP")
- **addressLine1/2**: Full street address
- **city/emirate**: Location within UAE
- **latitude/longitude**: Precise geocodes for mapping (Decimal type for accuracy)
- **googlePlaceId**: Integration with Google Maps/Places API
- **buildingNumber**: Building identifier in complex
- **floorNumbers**: Array of floor identifiers
- **totalFloors**: Number of floors in building

**Examples:**
- "Dubai Healthcare City Hospital" → lat: 25.2048, lng: 55.2708
- "Abu Dhabi Main Clinic" → lat: 24.4539, lng: 54.3773
- "Sharjah Diagnostic Center" → lat: 25.3463, lng: 55.4209

---

### 2. Department Model (NEW)
**Purpose:** Functional unit within a facility

```prisma
model Department {
  id              String    @id @default(uuid()) @map("id") @db.Uuid
  facilityId      String    @map("facility_id") @db.Uuid
  name            String
  code            String?   // e.g., "OPD", "IPD", "RAD", "SURG"
  departmentType  String    @map("department_type")  // opd, ipd, radiology, laboratory, surgery, emergency, pharmacy
  headOfDepartment String?  @map("head_of_department") @db.Uuid  // Staff ID
  floorNumber     String?   @map("floor_number")
  phoneExtension  String?   @map("phone_extension")
  operatingHours  Json?     @map("operating_hours")
  status          String    @default("active")
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt       DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
  
  facility        Facility  @relation(fields: [facilityId], references: [id], onDelete: Cascade)
  hod             Staff?    @relation("DepartmentHead", fields: [headOfDepartment], references: [id])
  wards           Ward[]    // IPD departments have wards
  clinics         Clinic[]  // OPD departments have clinics
  spaces          Space[]   // Direct spaces (e.g., radiology rooms)
  
  @@unique([facilityId, code])
  @@index([facilityId, departmentType])
  @@map("departments")
}
```

**Examples:**
- "Outpatient Department (OPD)" → type: opd
- "Inpatient Department (IPD)" → type: ipd
- "Radiology Department" → type: radiology
- "Emergency Department" → type: emergency

---

### 3. Ward Model (NEW - IPD)
**Purpose:** IPD-specific grouping of beds

```prisma
model Ward {
  id              String    @id @default(uuid()) @map("id") @db.Uuid
  departmentId    String    @map("department_id") @db.Uuid
  name            String
  code            String?   // e.g., "ICU-1", "GEN-WARD-A"
  wardType        String    @map("ward_type")  // general, icu, nicu, picu, isolation, maternity
  floorNumber     String?   @map("floor_number")
  totalBeds       Int       @default(0) @map("total_beds")
  availableBeds   Int       @default(0) @map("available_beds")
  nursingStation  String?   @map("nursing_station")
  status          String    @default("active")
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt       DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
  
  department      Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)
  beds            Bed[]
  
  @@unique([departmentId, code])
  @@index([departmentId, wardType])
  @@map("wards")
}
```

**Examples:**
- "ICU Ward 1" → type: icu, beds: 10
- "General Ward A" → type: general, beds: 30
- "Maternity Ward" → type: maternity, beds: 15

---

### 4. Bed Model (NEW - IPD)
**Purpose:** Individual bed for inpatient care

```prisma
model Bed {
  id              String    @id @default(uuid()) @map("id") @db.Uuid
  wardId          String    @map("ward_id") @db.Uuid
  bedNumber       String    @map("bed_number")
  bedType         String    @map("bed_type")  // standard, icu, isolation, private, semi_private
  features        Json?     // { oxygen: true, monitor: true, ventilator: false }
  status          String    @default("available")  // available, occupied, maintenance, reserved
  currentPatientId String?  @map("current_patient_id") @db.Uuid
  assignedAt      DateTime? @map("assigned_at") @db.Timestamptz(6)
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt       DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
  
  ward            Ward      @relation(fields: [wardId], references: [id], onDelete: Cascade)
  currentPatient  Patient?  @relation(fields: [currentPatientId], references: [id])
  
  @@unique([wardId, bedNumber])
  @@index([wardId, status])
  @@index([currentPatientId])
  @@map("beds")
}
```

**Examples:**
- "ICU-101" → type: icu, status: occupied
- "GEN-A-201" → type: standard, status: available
- "ISO-301" → type: isolation, status: maintenance

---

### 5. Clinic Model (NEW - OPD)
**Purpose:** OPD-specific grouping of consultation rooms

```prisma
model Clinic {
  id              String    @id @default(uuid()) @map("id") @db.Uuid
  departmentId    String    @map("department_id") @db.Uuid
  name            String
  code            String?   // e.g., "CARDIO-CLINIC", "PEDIA-1"
  specialty       String?   // cardiology, pediatrics, general_medicine, etc.
  floorNumber     String?   @map("floor_number")
  totalRooms      Int       @default(0) @map("total_rooms")
  operatingHours  Json?     @map("operating_hours")
  status          String    @default("active")
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt       DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
  
  department      Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)
  spaces          Space[]    // Consultation rooms
  
  @@unique([departmentId, code])
  @@index([departmentId, specialty])
  @@map("clinics")
}
```

**Examples:**
- "Cardiology Clinic" → specialty: cardiology, rooms: 5
- "Pediatrics Clinic 1" → specialty: pediatrics, rooms: 8
- "General Medicine Clinic" → specialty: general_medicine, rooms: 10

---

### 6. Updated Space Model
**Purpose:** Physical room (consultation, procedure, diagnostic)

```prisma
model Space {
  id              String      @id @default(uuid()) @map("id") @db.Uuid
  facilityId      String      @map("facility_id") @db.Uuid
  departmentId    String?     @map("department_id") @db.Uuid  // NEW
  clinicId        String?     @map("clinic_id") @db.Uuid      // NEW (for OPD rooms)
  name            String
  spaceNumber     String?     @map("space_number")
  spaceType       String      @map("space_type")  // consultation, procedure, diagnostic, operating_room
  floorNumber     String?     @map("floor_number")  // NEW
  equipment       Json        @default("[]")
  capacity        Int         @default(1)
  isActive        Boolean     @default(true) @map("is_active")
  createdAt       DateTime    @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt       DateTime    @updatedAt @map("updated_at") @db.Timestamptz(6)
  
  facility        Facility    @relation(fields: [facilityId], references: [id], onDelete: Cascade)
  department      Department? @relation(fields: [departmentId], references: [id])  // NEW
  clinic          Clinic?     @relation(fields: [clinicId], references: [id])      // NEW
  appointments    Appointment[]
  
  @@index([facilityId, departmentId])
  @@index([clinicId])
  @@map("spaces")
}
```

---

## 🎯 **Hierarchy Examples**

### Example 1: Large Hospital
```
Al Rashid Medical Center (Tenant)
 ├─ Main Hospital Building (Facility - hospital)
 │   📍 Dubai Healthcare City, Dubai (lat: 25.2048, lng: 55.2708)
 │   ├─ Outpatient Department (Department - opd)
 │   │   ├─ Cardiology Clinic (Clinic)
 │   │   │   ├─ Consultation Room 101 (Space)
 │   │   │   ├─ Consultation Room 102 (Space)
 │   │   │   └─ ECG Room (Space - procedure)
 │   │   └─ Pediatrics Clinic (Clinic)
 │   │       ├─ Consultation Room 201 (Space)
 │   │       └─ Vaccination Room (Space)
 │   │
 │   ├─ Inpatient Department (Department - ipd)
 │   │   ├─ ICU Ward (Ward)
 │   │   │   ├─ Bed ICU-101 (Bed)
 │   │   │   ├─ Bed ICU-102 (Bed)
 │   │   │   └─ Bed ICU-103 (Bed)
 │   │   └─ General Ward A (Ward)
 │   │       ├─ Bed GEN-A-201 (Bed)
 │   │       └─ Bed GEN-A-202 (Bed)
 │   │
 │   ├─ Radiology Department (Department - radiology)
 │   │   ├─ X-Ray Room 1 (Space)
 │   │   ├─ CT Scan Room (Space)
 │   │   └─ MRI Room (Space)
 │   │
 │   └─ Surgery Department (Department - surgery)
 │       ├─ Operating Room 1 (Space)
 │       ├─ Operating Room 2 (Space)
 │       └─ Recovery Room (Space)
 │
 └─ Diagnostic Center (Facility - diagnostic_center)
     📍 Al Wasl Road, Dubai (lat: 25.2285, lng: 55.2843)
     └─ Laboratory Department (Department - laboratory)
         ├─ Blood Testing Lab (Space)
         ├─ Microbiology Lab (Space)
         └─ Pathology Lab (Space)
```

### Example 2: Small Clinic
```
Test Clinic (Tenant)
 └─ Main Clinic Building (Facility - clinic)
     📍 Downtown Dubai, Dubai (lat: 25.1972, lng: 55.2744)
     └─ General Practice Department (Department - opd)
         └─ General Clinic (Clinic)
             ├─ Consultation Room 1 (Space)
             ├─ Consultation Room 2 (Space)
             └─ Minor Procedure Room (Space)
```

---

## 🔄 **Migration Strategy**

### Phase 1: Add New Tables (Non-Breaking)
```sql
-- 1. Create Department table
CREATE TABLE departments (...);

-- 2. Create Ward table (IPD)
CREATE TABLE wards (...);

-- 3. Create Bed table (IPD)
CREATE TABLE beds (...);

-- 4. Create Clinic table (OPD)
CREATE TABLE clinics (...);
```

### Phase 2: Update Existing Tables
```sql
-- 1. Add location & geocode fields to facilities
ALTER TABLE facilities ADD COLUMN code VARCHAR(50);
ALTER TABLE facilities ADD COLUMN building_number VARCHAR(50);
ALTER TABLE facilities ADD COLUMN floor_numbers TEXT[];
ALTER TABLE facilities ADD COLUMN total_floors INTEGER;
ALTER TABLE facilities ADD COLUMN latitude DECIMAL(10, 8);
ALTER TABLE facilities ADD COLUMN longitude DECIMAL(11, 8);
ALTER TABLE facilities ADD COLUMN google_place_id VARCHAR(255);
ALTER TABLE facilities ADD COLUMN country VARCHAR(50) DEFAULT 'UAE';

-- 2. Add departmentId to spaces (nullable)
ALTER TABLE spaces ADD COLUMN department_id UUID;

-- 3. Add clinicId to spaces (nullable)
ALTER TABLE spaces ADD COLUMN clinic_id UUID;

-- 4. Add floorNumber to spaces
ALTER TABLE spaces ADD COLUMN floor_number VARCHAR(10);

-- 5. Create indexes for geocode queries
CREATE INDEX idx_facilities_geocode ON facilities(latitude, longitude);
CREATE INDEX idx_facilities_city ON facilities(tenant_id, city);
CREATE INDEX idx_facilities_emirate ON facilities(tenant_id, emirate);
CREATE UNIQUE INDEX idx_facilities_code ON facilities(tenant_id, code);
```

### Phase 3: Data Migration
```sql
-- 1. Generate codes for existing facilities
UPDATE facilities
SET code = CONCAT(
  UPPER(SUBSTRING(city FROM 1 FOR 3)),
  '-',
  UPPER(SUBSTRING(facility_type FROM 1 FOR 4)),
  '-',
  LPAD(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at)::TEXT, 2, '0')
);

-- 2. Create default OPD department for each facility
INSERT INTO departments (id, facility_id, name, code, department_type, status)
SELECT 
  gen_random_uuid(),
  id,
  'Outpatient Department',
  'OPD',
  'opd',
  'active'
FROM facilities;

-- 3. Create default clinic for each OPD department
INSERT INTO clinics (id, department_id, name, code, status)
SELECT 
  gen_random_uuid(),
  id,
  'General Clinic',
  'GEN-CLINIC',
  'active'
FROM departments WHERE department_type = 'opd';

-- 4. Link existing spaces to departments/clinics
UPDATE spaces s
SET 
  department_id = d.id,
  clinic_id = c.id
FROM departments d
JOIN clinics c ON c.department_id = d.id
WHERE s.facility_id = d.facility_id
  AND d.department_type = 'opd';
```

### Phase 4: Add Constraints (Optional)
```sql
-- Add NOT NULL constraint to code after data migration
ALTER TABLE facilities ALTER COLUMN code SET NOT NULL;
```

---

## 📋 **API Endpoints**

### Facility Endpoints (Enhanced)
```
GET    /facilities?tenantId=xxx&city=xxx&emirate=xxx  # List facilities with geo-filtering
POST   /facilities                                     # Create facility (with geocodes)
GET    /facilities/:id                                 # Get facility details
PUT    /facilities/:id                                 # Update facility
DELETE /facilities/:id                                 # Delete facility
GET    /facilities/nearby?lat=xxx&lng=xxx&radius=5km  # Find nearby facilities
GET    /facilities/:id/departments                     # List departments
```

### Department Endpoints
```
GET    /facilities/:facilityId/departments      # List departments
POST   /facilities/:facilityId/departments      # Create department
GET    /departments/:id                         # Get department
PUT    /departments/:id                         # Update department
DELETE /departments/:id                         # Delete department
```

### Ward Endpoints (IPD)
```
GET    /departments/:departmentId/wards   # List wards
POST   /departments/:departmentId/wards   # Create ward
GET    /wards/:id                         # Get ward details
PUT    /wards/:id                         # Update ward
GET    /wards/:id/beds                    # List beds in ward
GET    /wards/:id/availability            # Check bed availability
```

### Bed Endpoints (IPD)
```
GET    /wards/:wardId/beds                # List beds
POST   /wards/:wardId/beds                # Create bed
GET    /beds/:id                          # Get bed details
PUT    /beds/:id                          # Update bed
POST   /beds/:id/assign                   # Assign patient to bed
POST   /beds/:id/release                  # Release bed
GET    /beds/available?wardId=xxx         # Find available beds
```

### Clinic Endpoints (OPD)
```
GET    /departments/:departmentId/clinics  # List clinics
POST   /departments/:departmentId/clinics  # Create clinic
GET    /clinics/:id                        # Get clinic details
PUT    /clinics/:id                        # Update clinic
GET    /clinics/:id/spaces                 # List consultation rooms
GET    /clinics/:id/schedule               # Get clinic schedule
```

### Updated Space Endpoints
```
GET    /spaces?facilityId=xxx&departmentId=xxx&clinicId=xxx
POST   /spaces                             # Create space
GET    /spaces/:id                         # Get space
PUT    /spaces/:id                         # Update space
GET    /spaces/:id/availability            # Check availability
```

---

## 🏗️ **Implementation Phases**

### Phase 1: Database Schema (Week 1)
- [ ] Create Prisma models for Department, Ward, Bed, Clinic
- [ ] Update Facility model with location & geocode fields
- [ ] Generate migration files
- [ ] Test migration on dev database
- [ ] Update existing Space model

### Phase 2: Foundation Service - Core (Week 2)
- [ ] Update Facility module with geocode fields
- [ ] Add geocode validation and nearby facility search
- [ ] Department module (repository, service, controller)

### Phase 3: Foundation Service - IPD (Week 3)
- [ ] Ward module (repository, service, controller)
- [ ] Bed module
- [ ] Bed assignment/release logic
- [ ] Availability tracking

### Phase 4: Foundation Service - OPD (Week 4)
- [ ] Clinic module (repository, service, controller)
- [ ] Update Space module with clinic relationship
- [ ] Clinic scheduling integration

### Phase 5: Data Migration (Week 5)
- [ ] Add geocode data to existing facilities (manual/API)
- [ ] Generate facility codes
- [ ] Create default departments for existing facilities
- [ ] Migrate existing spaces to clinics
- [ ] Validate data integrity

### Phase 6: Integration (Week 6)
- [ ] Update appointment scheduling with new hierarchy
- [ ] Update encounter creation with department context
- [ ] Update user-facility mapping with department/clinic access
- [ ] Frontend UI for hierarchy navigation

---

## 🎨 **UI/UX Implications**

### Facility Selection Flow
```
1. Select Facility → "Main Hospital Building" (Dubai Healthcare City)
2. Select Department → "Outpatient Department"
3. Select Clinic → "Cardiology Clinic"
4. Select Space → "Consultation Room 101"
```

### Facility Map View
```
Map showing all facilities with markers at geocode locations:
📍 Main Hospital (lat: 25.2048, lng: 55.2708)
📍 Diagnostic Center (lat: 25.2285, lng: 55.2843)
📍 Clinic Branch (lat: 25.1972, lng: 55.2744)

Filter by: City | Emirate | Facility Type | Distance
```

### Bed Management Dashboard
```
Ward: ICU Ward 1
├─ Total Beds: 10
├─ Occupied: 7
├─ Available: 3
└─ Maintenance: 0

Bed List:
- ICU-101: Occupied (Patient: Ahmed Ali)
- ICU-102: Available
- ICU-103: Occupied (Patient: Sara Mohammed)
```

### Appointment Scheduling
```
Select:
1. Facility: Main Hospital
2. Department: OPD
3. Clinic: Cardiology Clinic
4. Space: Consultation Room 101
5. Doctor: Dr. Ahmed
6. Time Slot: 10:00 AM
```

---

## 📊 **Benefits of New Structure**

### Operational Benefits
- ✅ **Bed Management**: Track IPD bed occupancy
- ✅ **Clinic Organization**: Group OPD consultation rooms
- ✅ **Department Operations**: Department-level reporting
- ✅ **Geocode Integration**: Map-based facility finder
- ✅ **Resource Allocation**: Better capacity planning
- ✅ **Multi-Site Support**: Multiple facilities per tenant with precise locations

### Technical Benefits
- ✅ **Scalability**: Supports large hospital networks
- ✅ **Flexibility**: Adapts to different healthcare models
- ✅ **Reporting**: Department/ward/clinic-level analytics
- ✅ **Scheduling**: More granular resource booking
- ✅ **Compliance**: Better audit trails

### Business Benefits
- ✅ **Real-World Mapping**: Matches actual hospital structure
- ✅ **Multi-Facility Support**: Tenant can have multiple facilities across UAE
- ✅ **IPD/OPD Separation**: Different workflows for inpatient/outpatient
- ✅ **Capacity Management**: Track bed availability in real-time
- ✅ **Department Autonomy**: Each department can operate independently
- ✅ **Geographic Intelligence**: Find nearest facility, route patients, analyze coverage

---

## 🔐 **Security & Access Control**

### User Access Levels
```typescript
// Current: User → Facility
user.defaultFacilityId

// Enhanced: User → Facility → Department → Clinic/Ward
user.defaultFacilityId
user.defaultDepartmentId  // NEW
user.defaultClinicId      // NEW (for OPD users)
user.defaultWardId        // NEW (for IPD users)
```

### RBAC Permissions
```
facility:view
facility:manage
facility:view:geocode
department:manage:ward
department:manage:clinic
ward:manage:bed
ward:assign:patient
clinic:manage:schedule
space:manage:availability
```

---

## 📈 **Reporting & Analytics**

### Tenant-Level
- Occupancy across all facilities
- Revenue by facility/city/emirate
- Staff distribution by location
- Geographic coverage analysis

### Facility-Level
- Department performance
- Bed utilization (IPD)
- Clinic throughput (OPD)

### Department-Level
- Ward occupancy (IPD)
- Clinic appointments (OPD)
- Resource utilization

### Ward/Clinic-Level
- Bed turnover rates
- Patient wait times
- Room utilization

---

## 🚀 **Next Steps**

### Immediate (This Sprint)
1. Review and approve this design
2. Create detailed Prisma schema with geocode fields
3. Generate migration files
4. Test on development database

### Short-Term (Next Sprint)
1. Update Facility module with geocode fields
2. Implement Department module
3. Add geocode validation & nearby search
4. Data migration scripts

### Medium-Term (Month 2)
1. Implement Ward & Bed modules (IPD)
2. Implement Clinic module (OPD)
3. Update Space module
4. Integration with scheduling

### Long-Term (Month 3+)
1. Frontend hierarchy navigation
2. Facility map view with geocode markers
3. Bed management dashboard
4. Clinic scheduling interface
5. Department-level reporting
6. Capacity planning tools
7. Patient routing based on location

---

## 📚 **References**

- Current Schema: `backend/shared/database/prisma/schema.prisma`
- Domain Model: `docs/03-Domain-Model.md`
- Data Model: `docs/05-Data-Model.md`
- Multi-Resource Scheduling: `docs/13-Multi-Resource-Scheduling.md`

---

## ✅ **Approval Checklist**

Before proceeding with implementation:
- [ ] Review hierarchy structure
- [ ] Validate against real-world use cases
- [ ] Confirm department types
- [ ] Verify ward/bed requirements
- [ ] Approve clinic model
- [ ] Review migration strategy
- [ ] Estimate implementation timeline

---

## 💡 **Questions to Consider**

1. **Department Types**: Do we need additional department types beyond opd, ipd, radiology, laboratory, surgery, emergency, pharmacy?

2. **Ward Types**: Are general, icu, nicu, picu, isolation, maternity sufficient?

3. **Bed Features**: What equipment/features need to be tracked per bed?

4. **Clinic Specialties**: Should clinics be linked to medical specialties table?

5. **Access Control**: Should users be assigned at department/clinic/ward level or just facility level?

6. **Backward Compatibility**: How to handle existing appointments/encounters during migration?

7. **Geocode Source**: Should we integrate with Google Maps API, OpenStreetMap, or manual entry for facility geocodes?

8. **Distance Calculation**: Should we use Haversine formula for nearby facility search or integrate with a mapping service?

---

## 🗺️ **Geocode Integration Notes**

### Geocode Precision
- **Decimal(10, 8)** for latitude: ±90° with 8 decimal places (~1.1mm precision)
- **Decimal(11, 8)** for longitude: ±180° with 8 decimal places (~1.1mm precision)

### Distance Calculation (Haversine Formula)
```sql
-- Find facilities within 5km radius
SELECT *,
  (6371 * acos(
    cos(radians(:lat)) * cos(radians(latitude)) *
    cos(radians(longitude) - radians(:lng)) +
    sin(radians(:lat)) * sin(radians(latitude))
  )) AS distance_km
FROM facilities
WHERE latitude IS NOT NULL
  AND longitude IS NOT NULL
HAVING distance_km < 5
ORDER BY distance_km;
```

### Google Maps Integration
- Store `google_place_id` for rich integration
- Use Places API for address autocomplete
- Use Geocoding API to convert addresses to lat/lng
- Use Maps JavaScript API for frontend map display

This enhanced structure will transform Zeal PMS into a true enterprise healthcare platform with geographic intelligence! 🏥 🗺️
