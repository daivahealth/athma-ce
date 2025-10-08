# Postman Setup

## Initial Setup

1. **Seed Demo Data**
   ```bash
   psql postgresql://zeal_user:zeal_password@localhost:5432/zeal_pms -f docs/postman/seed-demo-user.sql
   ```

2. **Import into Postman**
   - Collection: `docs/postman/zeal-backend.postman_collection.json`
   - Environment: `docs/postman/zeal-local.postman_environment.json`

## Environment Variables

The environment includes:
- `authBaseUrl`: http://localhost:3001
- `foundationBaseUrl`: http://localhost:3010
- `accessToken`: Auto-updated after login
- `refreshToken`: Auto-updated after login
- `tenantId`: 11111111-1111-1111-1111-111111111111
- `userId`: 22222222-2222-2222-2222-222222222222
- `facilityId`: Auto-updated when fetching user facilities
- `departmentId`: Auto-updated when creating department
- `wardId`: Auto-updated when creating ward
- `bedId`: Auto-updated when creating bed
- `clinicId`: Auto-updated when creating clinic
- `patientId`: For bed assignment testing

## Request Flow

### 1. Authentication
```
Auth Service → Login
  ↓ (auto-updates: accessToken, refreshToken, tenantId, userId)
Auth Service → MFA Status (optional)
```

### 2. Foundation Data
```
Foundation Service → List Tenants
Foundation Service → List Facilities
Foundation Service → List Users
```

### 3. User-Facility Management (NEW!)
```
User Facilities → Get User Facilities
  ↓ (auto-updates: facilityId to default facility)
User Facilities → Assign Facility to User
User Facilities → Set Default Facility
User Facilities → Check Facility Access
User Facilities → Get Facility Users
```

### 4. Facility Context Switching (NEW!)
```
Auth Service → Switch Facility
  ↓ (auto-updates: accessToken with new facilityId in JWT)
```

## Collection Structure

### Auth Service (9 endpoints)
- Login
- Refresh Token
- Logout
- Change Password
- Reset Password
- Confirm Reset Password
- MFA Verify
- MFA Status
- **Switch Facility** ⭐

### Foundation Service (11 endpoints)
- Health Check
- List Tenants
- Create Tenant
- Get Tenant
- Update Tenant
- Delete Tenant
- List Users
- Create User
- List Facilities
- Create Facility
- List Staff

### User Facilities (6 endpoints)
- Get User Facilities
- Assign Facility to User
- Set Default Facility
- Check Facility Access
- Revoke Facility Access
- Get Facility Users

### Departments (5 endpoints) ⭐ NEW
- Create Department
- List Departments
- Get Department
- Update Department
- Delete Department

### Wards - IPD (6 endpoints) ⭐ NEW
- Create Ward
- List Wards
- Get Ward
- Get Ward Availability
- Update Ward
- Delete Ward

### Beds - IPD (8 endpoints) ⭐ NEW
- Create Bed
- List Beds in Ward
- Get Available Beds
- Get Bed
- **Assign Patient to Bed** ⭐
- **Release Patient from Bed** ⭐
- Update Bed
- Delete Bed

### Clinics - OPD (5 endpoints) ⭐ NEW
- Create Clinic
- List Clinics
- Get Clinic
- Update Clinic
- Delete Clinic

## Testing Scenarios

### Scenario 1: Single Facility User
```
1. Login → Returns user with defaultFacility
2. Get User Facilities → Shows one facility (default)
3. Verify JWT includes facilityId
```

### Scenario 2: Multi-Facility User
```
1. Login → Returns user with defaultFacility
2. Get User Facilities → Shows multiple facilities
3. Assign Facility to User → Add new facility access
4. Switch Facility → Change active facility context
5. Verify new JWT has updated facilityId
```

### Scenario 3: Facility Access Management
```
1. Assign Facility to User (accessLevel: admin)
2. Check Facility Access → Verify hasAccess: true
3. Set Default Facility → Update user's home facility
4. Revoke Facility Access → Remove access (fails if default)
```

### Scenario 4: Facility Users
```
1. Get Facility Users → List all users with access
2. Verify default facility users
3. Check access levels
```

### Scenario 5: Setup OPD Department ⭐ NEW
```
1. Create Facility
2. Create OPD Department → Auto-saves departmentId
3. Create Cardiology Clinic → Auto-saves clinicId
4. Create Pediatrics Clinic
5. List Clinics → Verify both clinics
6. Get Clinic → View clinic with spaces
```

### Scenario 6: Setup IPD Department ⭐ NEW
```
1. Create Facility
2. Create IPD Department → Auto-saves departmentId
3. Create ICU Ward → Auto-saves wardId
4. Create General Ward
5. Create Beds in ICU Ward → Auto-saves bedId
6. Get Ward Availability → Check bed counts
```

### Scenario 7: Patient Admission (IPD) ⭐ NEW
```
1. Get Available Beds → Find empty bed
2. Assign Patient to Bed → Patient admitted
3. Get Ward Availability → Verify occupancy increased
4. Get Bed → Verify patient assigned
5. Release Patient from Bed → Patient discharged
6. Get Ward Availability → Verify occupancy decreased
```

### Scenario 8: Full Hierarchy Setup ⭐ NEW
```
1. Create Facility
2. Create OPD Department
3. Create Cardiology Clinic
4. Create IPD Department
5. Create ICU Ward
6. Create 5 ICU Beds
7. Create General Ward
8. Create 10 General Beds
9. Get Facility → View full hierarchy
10. Get Ward Availability → Check all wards
```

## Headers & Parameters

### Tenant-Level Operations (Use Query Parameter)
**Endpoints:** `/facilities`, `/users`, `/staff`, etc.

```bash
GET /facilities?tenantId={{tenantId}}
Authorization: Bearer {{accessToken}}
```

**Purpose:** List ALL resources in a tenant (admin operations)

### User-Level Operations (Use Header)
**Endpoints:** `/users/:userId/facilities/*`, `/auth/switch-facility`, etc.

```bash
GET /users/:userId/facilities
Authorization: Bearer {{accessToken}}
x-tenant-id: {{tenantId}}  (optional, from JWT)
```

**Purpose:** User-specific resources (scoped to authenticated user)

## Auto-Updated Variables

The collection uses test scripts to auto-update variables:

### After Login:
- `accessToken` → JWT with facility context
- `refreshToken` → For token refresh
- `tenantId` → User's tenant
- `userId` → User ID (extracted from response)

### After Get User Facilities:
- `facilityId` → Default facility ID

### After Switch Facility:
- `accessToken` → New JWT with updated facilityId

## JWT Claims (After Login)

The accessToken now includes:
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "tenantId": "tenant-uuid",
  "roles": ["role1", "role2"],
  "permissions": ["perm1", "perm2"],
  "defaultFacilityId": "facility-uuid",
  "facilityId": "facility-uuid",
  "facilityIds": ["facility-uuid-1", "facility-uuid-2"]
}
```

## Notes

- Login automatically saves tokens and tenant info
- Get User Facilities automatically saves default facilityId
- Switch Facility automatically updates accessToken
- Remember to add `x-tenant-id` header for tenant-scoped endpoints
- All facility operations validate tenant boundaries
- Department/Ward/Bed/Clinic creation auto-saves IDs for chaining requests

---

## 🎉 **New in v2.0: Facility Hierarchy**

The Postman collection now includes **24 new endpoints** for the enhanced facility hierarchy:

### **Hierarchy Structure:**
```
Tenant
 └─ Facility (with geocodes)
     └─ Department
         ├─ Ward (IPD) → Bed → Patient
         └─ Clinic (OPD) → Space
```

### **Key Features:**
- ✅ **Department Management**: Create functional units (OPD, IPD, Radiology, etc.)
- ✅ **Ward Management (IPD)**: Organize beds for inpatient care
- ✅ **Bed Assignment (IPD)**: Assign/release patients with automatic occupancy tracking
- ✅ **Clinic Management (OPD)**: Organize consultation rooms by specialty
- ✅ **Real-Time Availability**: Check ward occupancy and available beds
- ✅ **Auto-Variable Updates**: IDs automatically saved for request chaining

### **Total Endpoints:**
- **Auth Service**: 9 endpoints
- **Foundation Service**: 11 endpoints
- **User Facilities**: 6 endpoints
- **Departments**: 5 endpoints ⭐
- **Wards (IPD)**: 6 endpoints ⭐
- **Beds (IPD)**: 8 endpoints ⭐
- **Clinics (OPD)**: 5 endpoints ⭐

**Total: 50+ endpoints** (24 new facility hierarchy endpoints)

### **Quick Start:**
1. Import collection and environment
2. Run "Login" to authenticate
3. Run "Get User Facilities" to get facilityId
4. Create departments, wards, beds, and clinics
5. Test patient admission workflow

---

## 📚 **Related Documentation**

- `docs/API-ENDPOINTS-FACILITY-HIERARCHY.md` - Complete API reference
- `docs/FACILITY-HIERARCHY-SUMMARY.md` - Quick reference guide
- `docs/ENHANCED-FACILITY-HIERARCHY-DESIGN.md` - Full design document
