# User-Facility Mapping Design

## Overview
This document defines the user-facility relationship model for the Zeal PMS, ensuring users are properly mapped to facilities within their tenant context.

## Business Requirements

### Core Concepts
1. **Multi-Facility Access**: A user can have access to multiple facilities within their tenant
2. **Default Facility**: Each user MUST have one default/primary facility
3. **Active Context**: The system assumes the user is physically present at their default facility
4. **Facility Switching**: Users with multi-facility access can switch their active facility context

### Use Cases
- **Single Facility Users**: Most users work at one clinic/hospital only
- **Multi-Facility Users**: Administrators, roving staff, consultants may access multiple facilities
- **Facility Context**: All operations (appointments, encounters, records) are scoped to the active facility
- **Audit Trail**: Track which facility context a user was operating in for each action

## Database Schema Changes

### New Table: `user_facilities`
```prisma
model UserFacility {
  id                String    @id @default(uuid()) @map("id") @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  facilityId        String    @map("facility_id") @db.Uuid
  isDefault         Boolean   @default(false) @map("is_default")
  accessLevel       String    @default("standard") @map("access_level") // standard, admin, read_only
  grantedAt         DateTime  @default(now()) @map("granted_at") @db.Timestamptz(6)
  grantedBy         String?   @map("granted_by") @db.Uuid
  revokedAt         DateTime? @map("revoked_at") @db.Timestamptz(6)
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz(6)
  
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  facility          Facility  @relation(fields: [facilityId], references: [id], onDelete: Cascade)
  grantedByUser     User?     @relation("FacilityAccessGrantor", fields: [grantedBy], references: [id])
  
  @@unique([userId, facilityId])
  @@index([userId, isDefault])
  @@index([facilityId, revokedAt])
  @@map("user_facilities")
}
```

### Update `User` Model
```prisma
model User {
  // ... existing fields
  userFacilities       UserFacility[]
  grantedFacilityAccess UserFacility[] @relation("FacilityAccessGrantor")
  defaultFacilityId     String?         @map("default_facility_id") @db.Uuid
  defaultFacility       Facility?       @relation("UserDefaultFacility", fields: [defaultFacilityId], references: [id])
  
  @@index([tenantId, defaultFacilityId])
}
```

### Update `Facility` Model
```prisma
model Facility {
  // ... existing fields
  userFacilities    UserFacility[]
  defaultForUsers   User[]         @relation("UserDefaultFacility")
}
```

## API Changes

### User Service - New Endpoints

#### 1. Get User Facilities
```typescript
GET /users/:userId/facilities
Response: {
  defaultFacility: Facility,
  facilities: Array<{
    facility: Facility,
    accessLevel: string,
    isDefault: boolean,
    grantedAt: Date
  }>
}
```

#### 2. Set Default Facility
```typescript
POST /users/:userId/facilities/set-default
Body: { facilityId: string }
Response: { success: boolean, defaultFacility: Facility }
```

#### 3. Grant Facility Access
```typescript
POST /users/:userId/facilities/grant
Body: {
  facilityId: string,
  accessLevel: 'standard' | 'admin' | 'read_only',
  setAsDefault?: boolean
}
Response: { success: boolean, access: UserFacility }
```

#### 4. Revoke Facility Access
```typescript
DELETE /users/:userId/facilities/:facilityId
Response: { success: boolean }
```

### Enhanced User Response
```typescript
interface UserWithFacilities {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  defaultFacility: {
    id: string;
    name: string;
    facilityType: string;
  };
  facilities: Array<{
    id: string;
    name: string;
    accessLevel: string;
    isDefault: boolean;
  }>;
}
```

## Authentication & Session Enhancement

### JWT Claims Update
```typescript
interface JwtClaims {
  userId: string;
  email: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  
  // NEW: Facility context
  defaultFacilityId: string;
  facilityId: string;  // Current active facility
  facilityIds: string[];  // All accessible facilities
  
  sessionId?: string;
  iat?: number;
  exp?: number;
}
```

### Session Context
```typescript
interface UserSession {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    tenantId: string;
    defaultFacilityId: string;
    currentFacilityId: string;  // Can be switched
  };
}
```

### Facility Context Switching
```typescript
POST /auth/switch-facility
Body: { facilityId: string }
Response: { 
  accessToken: string,  // New token with updated facilityId
  currentFacility: Facility
}
```

## Implementation Phases

### Phase 1: Database Schema (Immediate)
1. Create migration for `user_facilities` table
2. Add `defaultFacilityId` to users table
3. Update Prisma schema and generate client

### Phase 2: Foundation Service (Core Logic)
1. Implement `UserFacilityRepository` 
2. Update `UserService` with facility management methods
3. Add facility access validation middleware
4. Create facility management endpoints

### Phase 3: Foundation Auth Module Integration
1. Update JWT token generation to include facility context
2. Implement facility switching endpoint
3. Add facility validation to auth guards

### Phase 4: Frontend Integration
1. Update login flow to fetch default facility
2. Add facility switcher UI component in topbar
3. Update session management with facility context
4. Show current facility in UI

### Phase 5: Data Migration
1. Script to assign all existing users to their tenant's first facility as default
2. Validation that all users have a default facility
3. Backfill historical data with facility context

## Validation Rules

### Business Rules
1. Every active user MUST have exactly one default facility
2. Default facility MUST be within the user's tenant
3. Users cannot access facilities outside their tenant
4. Cannot revoke access to default facility without setting a new default first
5. Facility access requires appropriate RBAC permissions

### Technical Constraints
1. User can only switch to facilities they have access to
2. All transactional operations must include facility context
3. Audit logs must capture facility context
4. RLS policies must respect facility boundaries

## Security Considerations

### Multi-Tenancy (ADR-0003)
- Facility access is always scoped to the user's tenant
- RLS policies enforce facility boundaries
- Cross-facility data access requires explicit permissions

### Audit Trail (ADR-0006)
- Track all facility access grants/revocations
- Log facility context switches
- Maintain `grantedBy` for accountability

### PDPL Compliance
- Facility context impacts data access patterns
- Patient records are facility-scoped by default
- Cross-facility access requires consent/justification

## Migration Strategy

### Existing Data
```sql
-- Assign all users to first facility in their tenant as default
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

-- Update users.default_facility_id
UPDATE users u
SET default_facility_id = uf.facility_id
FROM user_facilities uf
WHERE uf.user_id = u.id AND uf.is_default = true;
```

## Testing Requirements

### Unit Tests
- User facility assignment
- Default facility validation
- Access level enforcement
- Facility switching logic

### Integration Tests
- Multi-facility user workflows
- Facility context in transactions
- Cross-facility data access scenarios
- Audit trail validation

### E2E Tests
- User login with facility assignment
- Facility switching flow
- Multi-facility admin operations

## References
- ADR-0003: Multi-tenancy Architecture
- ADR-0005: RBAC Access Control  
- docs/05-Data-Model.md: Foundation data entities
- docs/20-RBAC-Access-Control.md: Permission model
