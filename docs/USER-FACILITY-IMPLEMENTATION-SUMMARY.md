# User-Facility Mapping Implementation Summary

## ✅ Completed

### 1. Database Schema Updates
**File**: `backend/shared/database/prisma/schema.prisma`

#### Changes Made:
- **User Model**: Added `defaultFacilityId` field and relations
- **Facility Model**: Added `userFacilities` and `defaultForUsers` relations
- **New UserFacility Model**: Created join table for user-facility mapping

### Key Features:
- **Default Facility**: Every user has a `defaultFacilityId` (nullable during migration)
- **Multi-Facility Support**: Users can be mapped to multiple facilities via `user_facilities` table
- **Access Levels**: `standard`, `admin`, `read_only`
- **Audit Trail**: Tracks who granted access and when
- **Revocation**: Soft delete via `revokedAt` field

## 📋 Next Steps

### Phase 1: Database Migration (Required First)
```bash
# 1. Generate Prisma client with new schema
cd backend/shared/database
npx prisma generate

# 2. Create migration
npx prisma migrate dev --name add-user-facility-mapping

# 3. Run migration SQL (example provided in design doc)
```

### Phase 2: Foundation Service Updates
**Priority**: HIGH

1. **Create UserFacilityRepository**
   - File: `backend/services/foundation/src/modules/user-facility/user-facility.repository.ts`
   - Methods: assignFacility, revokeAccess, setDefaultFacility, getUserFacilities

2. **Update UserService**
   - File: `backend/services/foundation/src/modules/user/user.service.ts`
   - Add facility management methods
   - Validate default facility on user creation

3. **Create UserFacility Module**
   - Controller: `/users/:userId/facilities/*`
   - Service: Business logic for facility access
   - DTOs: Request/response types

### Phase 3: Auth Service Updates
**Priority**: HIGH

1. **Update JWT Claims**
   - File: `backend/services/auth/src/auth.service.ts`
   - Add `defaultFacilityId`, `facilityId`, `facilityIds[]` to token

2. **Add Facility Context to Session**
   - Update login response
   - Fetch user's default facility on authentication

3. **Implement Facility Switching**
   - Endpoint: `POST /auth/switch-facility`
   - Reissue token with new `facilityId`

### Phase 4: Frontend Updates
**Priority**: MEDIUM

1. **Update Auth Types**
   - File: `frontend/src/types/auth.ts`
   - Add facility fields to JwtClaims

2. **Update Session Management**
   - File: `frontend/src/lib/api/client.ts`
   - Store facility context in session

3. **Add Facility Switcher UI**
   - Component: `frontend/src/components/layout/facility-switcher.tsx`
   - Location: Topbar next to user info
   - Shows current facility, allows switching if user has multiple

4. **Update Topbar Display**
   - Show current facility name/icon
   - Dropdown for facility switching

### Phase 5: Data Migration
**Priority**: HIGH (Before Production)

```sql
-- Step 1: Create user_facilities table (done via Prisma migration)

-- Step 2: Assign all existing users to their tenant's first facility
INSERT INTO user_facilities (id, user_id, facility_id, is_default, access_level)
SELECT 
  gen_random_uuid(),
  u.id,
  f.id,
  true,
  'standard'
FROM users u
INNER JOIN LATERAL (
  SELECT id FROM facilities 
  WHERE tenant_id = u.tenant_id 
  ORDER BY created_at ASC 
  LIMIT 1
) f ON true
WHERE NOT EXISTS (
  SELECT 1 FROM user_facilities WHERE user_id = u.id AND is_default = true
);

-- Step 3: Update users.default_facility_id
UPDATE users u
SET default_facility_id = uf.facility_id
FROM user_facilities uf
WHERE uf.user_id = u.id AND uf.is_default = true;

-- Step 4: Add NOT NULL constraint after data migration
ALTER TABLE users ALTER COLUMN default_facility_id SET NOT NULL;
```

## 🎯 Business Logic Implementation

### User Creation Flow
```typescript
// When creating a new user
1. Create user record
2. Assign to tenant's default facility (or specified facility)
3. Set as default facility
4. Create user_facilities record with isDefault=true
5. Update user.defaultFacilityId
```

### User Login Flow
```typescript
// Enhanced login response
{
  accessToken: string,
  refreshToken: string,
  user: {
    id: string,
    email: string,
    tenantId: string,
    defaultFacility: {
      id: string,
      name: string,
      facilityType: string
    },
    facilities: [...]  // All accessible facilities
  }
}
```

### Facility Context Validation
```typescript
// Middleware for facility-scoped operations
1. Extract facilityId from JWT claims
2. Verify user has access to facility
3. Check facility belongs to user's tenant
4. Proceed with operation
```

## 🔒 Security Considerations

### Multi-Tenancy
- ✅ Facility access is always tenant-scoped
- ✅ Users cannot access facilities outside their tenant
- ✅ RLS policies will enforce facility boundaries

### RBAC Integration
- Facility access requires appropriate RBAC permissions
- `facility:assign` - Grant facility access to users
- `facility:revoke` - Revoke facility access
- `facility:switch` - Switch between accessible facilities

### Audit Trail
- All facility access grants logged with `grantedBy`
- Facility switches logged in session history
- Access revocations tracked with `revokedAt`

## 📊 API Endpoints to Implement

### User Facilities
```
GET    /users/:userId/facilities          # List user's facilities
POST   /users/:userId/facilities/grant    # Grant facility access
DELETE /users/:userId/facilities/:facilityId  # Revoke access
POST   /users/:userId/facilities/set-default  # Set default facility
```

### Auth Context
```
POST   /auth/switch-facility    # Switch active facility context
GET    /auth/current-context    # Get current session facility context
```

### Validation
```
GET    /facilities/:facilityId/accessible  # Check if user has access
```

## 🧪 Testing Requirements

### Unit Tests
- [ ] User facility assignment logic
- [ ] Default facility validation
- [ ] Access level enforcement
- [ ] Facility switching validation

### Integration Tests
- [ ] User creation with facility assignment
- [ ] Multi-facility user workflows
- [ ] Facility context in API operations
- [ ] Cross-facility data access (should fail)

### E2E Tests
- [ ] Login flow with facility assignment
- [ ] Facility switcher UI
- [ ] Operations with facility context
- [ ] Facility-scoped data access

## 📝 Documentation Updates Needed

- [ ] Update API documentation with new endpoints
- [ ] Add facility context to operation examples
- [ ] Document facility switching flow
- [ ] Update postman collection with facility tests

## 🚀 Deployment Checklist

### Pre-Production
- [ ] Run Prisma migration
- [ ] Execute data migration script
- [ ] Verify all users have default facility
- [ ] Test facility switching
- [ ] Validate RLS policies

### Production
- [ ] Schedule maintenance window
- [ ] Backup database
- [ ] Run migration
- [ ] Verify data integrity
- [ ] Test critical flows
- [ ] Monitor for errors

## 📖 References
- Design Document: `docs/USER-FACILITY-MAPPING-DESIGN.md`
- Prisma Schema: `backend/shared/database/prisma/schema.prisma`
- ADR-0003: Multi-tenancy Architecture
- ADR-0005: RBAC Access Control

