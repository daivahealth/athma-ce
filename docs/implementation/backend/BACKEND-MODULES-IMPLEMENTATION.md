# Backend Foundation Service - New Modules Implementation

**Status**: ✅ Department Module Complete | 🔄 Ward, Bed, Clinic Modules In Progress

---

## ✅ **Completed: Department Module**

### Files Created:
```
backend/services/foundation/src/modules/department/
├── dto/
│   ├── create-department.dto.ts  ✅
│   └── update-department.dto.ts  ✅
├── department.repository.ts      ✅
├── department.service.ts          ✅
├── department.controller.ts       ✅
└── department.module.ts           ✅
```

### API Endpoints:
```
POST   /facilities/:facilityId/departments
GET    /facilities/:facilityId/departments?type=opd
GET    /departments/:id
PATCH  /departments/:id
DELETE /departments/:id
```

### Features:
- ✅ CRUD operations for departments
- ✅ Validation for facility existence
- ✅ Unique code per facility
- ✅ Head of department assignment
- ✅ Department type enum (OPD, IPD, Radiology, etc.)
- ✅ Cascading checks before deletion

---

## 🔄 **To Implement: Ward Module (IPD)**

### Files to Create:
```
backend/services/foundation/src/modules/ward/
├── dto/
│   ├── create-ward.dto.ts
│   └── update-ward.dto.ts
├── ward.repository.ts
├── ward.service.ts
├── ward.controller.ts
└── ward.module.ts
```

### API Endpoints:
```
POST   /departments/:departmentId/wards
GET    /departments/:departmentId/wards?type=icu
GET    /wards/:id
GET    /wards/:id/beds
GET    /wards/:id/availability
PATCH  /wards/:id
DELETE /wards/:id
```

### Key Features:
- Ward types: general, icu, nicu, picu, isolation, maternity
- Track totalBeds and availableBeds
- Auto-update availableBeds when beds are assigned/released
- Nursing station management
- Floor number tracking

### Ward DTO Example:
```typescript
export enum WardType {
  GENERAL = 'general',
  ICU = 'icu',
  NICU = 'nicu',
  PICU = 'picu',
  ISOLATION = 'isolation',
  MATERNITY = 'maternity',
}

export class CreateWardDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(WardType)
  wardType: WardType;

  @IsString()
  @IsOptional()
  floorNumber?: string;

  @IsInt()
  @IsOptional()
  totalBeds?: number;

  @IsString()
  @IsOptional()
  nursingStation?: string;
}
```

---

## 🔄 **To Implement: Bed Module (IPD)**

### Files to Create:
```
backend/services/foundation/src/modules/bed/
├── dto/
│   ├── create-bed.dto.ts
│   ├── update-bed.dto.ts
│   ├── assign-bed.dto.ts
│   └── release-bed.dto.ts
├── bed.repository.ts
├── bed.service.ts
├── bed.controller.ts
└── bed.module.ts
```

### API Endpoints:
```
POST   /wards/:wardId/beds
GET    /wards/:wardId/beds?status=available
GET    /beds/:id
GET    /beds/available?wardId=xxx
POST   /beds/:id/assign
POST   /beds/:id/release
PATCH  /beds/:id
DELETE /beds/:id
```

### Key Features:
- Bed types: standard, icu, isolation, private, semi_private
- Bed statuses: available, occupied, maintenance, reserved
- Patient assignment tracking
- Auto-update ward availableBeds count
- Features tracking (oxygen, monitor, ventilator)

### Bed DTO Example:
```typescript
export enum BedType {
  STANDARD = 'standard',
  ICU = 'icu',
  ISOLATION = 'isolation',
  PRIVATE = 'private',
  SEMI_PRIVATE = 'semi_private',
}

export enum BedStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
}

export class AssignBedDto {
  @IsUUID()
  patientId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ReleaseBedDto {
  @IsString()
  @IsOptional()
  notes?: string;
}
```

---

## 🔄 **To Implement: Clinic Module (OPD)**

### Files to Create:
```
backend/services/foundation/src/modules/clinic/
├── dto/
│   ├── create-clinic.dto.ts
│   └── update-clinic.dto.ts
├── clinic.repository.ts
├── clinic.service.ts
├── clinic.controller.ts
└── clinic.module.ts
```

### API Endpoints:
```
POST   /departments/:departmentId/clinics
GET    /departments/:departmentId/clinics?specialty=cardiology
GET    /clinics/:id
GET    /clinics/:id/spaces
GET    /clinics/:id/schedule
PATCH  /clinics/:id
DELETE /clinics/:id
```

### Key Features:
- Specialty tracking (cardiology, pediatrics, etc.)
- Total rooms count
- Operating hours management
- Link to consultation spaces
- Floor number tracking

### Clinic DTO Example:
```typescript
export class CreateClinicDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsString()
  @IsOptional()
  floorNumber?: string;

  @IsInt()
  @IsOptional()
  totalRooms?: number;

  @IsObject()
  @IsOptional()
  operatingHours?: Record<string, any>;
}
```

---

## 🔄 **To Update: Facility Module**

### New Endpoints to Add:
```
GET    /facilities/nearby?lat=25.2048&lng=55.2708&radius=5
POST   /facilities/:id/geocode
GET    /facilities?city=Dubai&emirate=Dubai
PATCH  /facilities/:id/geocode
```

### New Features:
- Geocode management (latitude, longitude, googlePlaceId)
- Nearby facility search using Haversine formula
- City/Emirate filtering
- Building details (buildingNumber, floorNumbers, totalFloors)
- Capacity tracking

### Geocode DTO Example:
```typescript
export class UpdateGeocodeDto {
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  googlePlaceId?: string;

  @IsString()
  @IsOptional()
  buildingNumber?: string;

  @IsArray()
  @IsOptional()
  floorNumbers?: string[];

  @IsInt()
  @IsOptional()
  totalFloors?: number;
}

export class NearbyFacilitiesDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  @IsOptional()
  radius?: number; // in kilometers, default 5
}
```

### Haversine Formula Implementation:
```typescript
async findNearby(lat: number, lng: number, radius: number = 5) {
  // Raw SQL query using Haversine formula
  const facilities = await this.prisma.$queryRaw`
    SELECT *,
      (6371 * acos(
        cos(radians(${lat})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(latitude))
      )) AS distance_km
    FROM facilities
    WHERE latitude IS NOT NULL
      AND longitude IS NOT NULL
      AND status = 'active'
    HAVING distance_km < ${radius}
    ORDER BY distance_km
  `;
  
  return facilities;
}
```

---

## 📋 **AppModule Updates**

### Update `app.module.ts`:
```typescript
import { DepartmentModule } from './modules/department/department.module';
import { WardModule } from './modules/ward/ward.module';
import { BedModule } from './modules/bed/bed.module';
import { ClinicModule } from './modules/clinic/clinic.module';

@Module({
  imports: [
    // ... existing modules
    DepartmentModule,
    WardModule,
    BedModule,
    ClinicModule,
  ],
  // ...
})
export class AppModule {}
```

---

## 🧪 **Testing Strategy**

### Unit Tests:
- [ ] Department service tests
- [ ] Ward service tests (with bed count updates)
- [ ] Bed service tests (with patient assignment)
- [ ] Clinic service tests
- [ ] Facility geocode tests

### Integration Tests:
- [ ] Create department → Create ward → Create beds
- [ ] Assign patient to bed → Release bed
- [ ] Create department → Create clinic → Link spaces
- [ ] Find nearby facilities by geocode
- [ ] Cascade deletion checks

### E2E Tests:
- [ ] Full IPD workflow (department → ward → bed → patient)
- [ ] Full OPD workflow (department → clinic → space → appointment)
- [ ] Geocode search and filtering

---

## 📊 **Database Relationships**

```
Facility (enhanced with geocodes)
  ↓
Department (OPD, IPD, etc.)
  ↓
  ├─ Ward (IPD only)
  │   ↓
  │   Bed (patient assignment)
  │
  └─ Clinic (OPD only)
      ↓
      Space (consultation rooms)
```

---

## 🚀 **Implementation Priority**

### Phase 1 (Completed):
- [x] Department module

### Phase 2 (High Priority):
- [ ] Ward module
- [ ] Bed module
- [ ] Bed assignment/release logic

### Phase 3 (High Priority):
- [ ] Clinic module
- [ ] Link spaces to clinics

### Phase 4 (Medium Priority):
- [ ] Facility geocode endpoints
- [ ] Nearby facility search

### Phase 5 (Low Priority):
- [ ] Advanced filtering
- [ ] Analytics endpoints
- [ ] Bulk operations

---

## 📝 **Implementation Notes**

### Important Considerations:

1. **Ward Bed Count Management**:
   - When a bed is created, increment ward.totalBeds
   - When a bed is assigned, decrement ward.availableBeds
   - When a bed is released, increment ward.availableBeds
   - Use database transactions for consistency

2. **Patient-Bed Assignment**:
   - Only one patient per bed at a time
   - Track assignedAt timestamp
   - Validate patient exists and belongs to same tenant
   - Update bed status to 'occupied'

3. **Department Type Validation**:
   - IPD departments can only have wards
   - OPD departments can only have clinics
   - Other departments (radiology, lab) can only have spaces

4. **Geocode Precision**:
   - Use Decimal(10,8) for latitude
   - Use Decimal(11,8) for longitude
   - Validate coordinates are within valid ranges
   - Optional Google Place ID for integration

5. **Cascade Deletion**:
   - Cannot delete department with active wards/clinics
   - Cannot delete ward with occupied beds
   - Cannot delete clinic with scheduled appointments
   - Soft delete (status='inactive') preferred

---

## 🔗 **Related Documentation**

- `docs/ENHANCED-FACILITY-HIERARCHY-DESIGN.md` - Full design
- `docs/FACILITY-HIERARCHY-SUMMARY.md` - Quick reference
- `docs/DEPLOYMENT-SUCCESS.md` - Database deployment
- `backend/shared/database/prisma/schema.prisma` - Schema reference

---

**Next Steps**: Implement Ward, Bed, and Clinic modules following the Department module pattern.

**Estimated Time**: 
- Ward module: 2-3 hours
- Bed module: 3-4 hours (includes assignment logic)
- Clinic module: 2-3 hours
- Facility updates: 2-3 hours
- Testing: 4-5 hours

**Total**: ~15-20 hours of development time
