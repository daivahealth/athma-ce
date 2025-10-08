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

### Auth Service (8 endpoints)
- Login
- Refresh Token
- Logout
- Change Password
- Reset Password
- Confirm Reset Password
- MFA Verify
- MFA Status
- **Switch Facility** ⭐ NEW

### Foundation Service (8 endpoints)
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

### User Facilities (6 endpoints) ⭐ NEW
- Get User Facilities
- Assign Facility to User
- Set Default Facility
- Check Facility Access
- Revoke Facility Access
- Get Facility Users

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
