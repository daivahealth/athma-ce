# API Design: Tenant-Level vs User-Level Operations

## 🎯 **Design Principle**

### Tenant-Level Operations
**Pattern:** Use `tenantId` as **query parameter**
- Operations that list/manage resources at the **tenant scope**
- Admin operations to view all tenant resources
- Cross-user visibility

### User-Level Operations  
**Pattern:** Use `tenantId` in **header** (from JWT context)
- Operations specific to a **single user**
- User's personal resources/permissions
- Derived from authenticated session

---

## 📊 **Endpoint Design**

### Tenant-Level Endpoints (Query Parameter)

#### GET /facilities?tenantId={uuid}
**Purpose:** List ALL facilities in a tenant  
**Use Case:** Admin views all clinic locations  
**Authentication:** Bearer token with admin permissions  
**TenantId:** Query parameter `?tenantId=xxx`

**Example:**
```bash
curl 'http://localhost:3010/facilities?tenantId=11111111-1111-1111-1111-111111111111' \
  -H 'Authorization: Bearer {token}'
```

**Response:**
```json
[
  {
    "id": "facility-1",
    "name": "Dubai Central Clinic",
    "tenantId": "11111111-1111-1111-1111-111111111111"
  },
  {
    "id": "facility-2",
    "name": "Abu Dhabi Branch",
    "tenantId": "11111111-1111-1111-1111-111111111111"
  }
]
```

---

#### GET /users?tenantId={uuid}
**Purpose:** List ALL users in a tenant  
**Use Case:** HR/Admin views all employees  
**TenantId:** Query parameter

---

#### GET /tenants
**Purpose:** List ALL tenants (super-admin)  
**Use Case:** Platform admin views all organizations  
**TenantId:** Not required (cross-tenant)

---

### User-Level Endpoints (Header)

#### GET /users/:userId/facilities
**Purpose:** List facilities **this specific user** has access to  
**Use Case:** User sees their accessible locations  
**Authentication:** Bearer token (tenantId in JWT)  
**TenantId:** Header `x-tenant-id` (optional, for validation)

**Example:**
```bash
curl 'http://localhost:3010/users/22222222-2222-2222-2222-222222222222/facilities' \
  -H 'Authorization: Bearer {token}' \
  -H 'x-tenant-id: 11111111-1111-1111-1111-111111111111'
```

**Response:**
```json
{
  "defaultFacility": {
    "id": "facility-1",
    "name": "Dubai Central Clinic"
  },
  "facilities": [
    {
      "id": "facility-1",
      "name": "Dubai Central Clinic",
      "isDefault": true,
      "accessLevel": "standard"
    }
  ]
}
```

---

#### POST /users/:userId/facilities/assign
**Purpose:** Grant **this specific user** access to a facility  
**TenantId:** Header (from JWT)

---

#### POST /auth/switch-facility
**Purpose:** Change **current user's** active facility  
**TenantId:** From JWT token

---

## 🔐 **Security Model**

### Tenant-Level Operations
```typescript
// Admin listing all tenant facilities
GET /facilities?tenantId=xxx

Authorization: Bearer {token}
  ↓ Decode JWT
  ↓ Verify user has permission: 'facility:list:tenant'
  ↓ Verify user belongs to requested tenantId
  ↓ Return all facilities for that tenant
```

### User-Level Operations
```typescript
// User viewing their accessible facilities
GET /users/:userId/facilities

Authorization: Bearer {token}
x-tenant-id: {from-jwt} (optional)
  ↓ Decode JWT
  ↓ Extract tenantId from JWT
  ↓ Verify userId matches JWT or has permission
  ↓ Return only facilities this user can access
```

---

## 📋 **API Summary**

### Tenant-Level (Query Parameter)
| Endpoint | Method | TenantId Source | Purpose |
|----------|--------|-----------------|---------|
| `/tenants` | GET | N/A (cross-tenant) | List all tenants |
| `/facilities` | GET | Query param | List ALL tenant facilities |
| `/users` | GET | Query param | List ALL tenant users |
| `/staff` | GET | Query param | List ALL tenant staff |

### User-Level (Header)
| Endpoint | Method | TenantId Source | Purpose |
|----------|--------|-----------------|---------|
| `/users/:userId/facilities` | GET | JWT + Header | User's accessible facilities |
| `/users/:userId/facilities/assign` | POST | JWT + Header | Grant user facility access |
| `/users/:userId/facilities/set-default` | POST | JWT + Header | Set user's default facility |
| `/users/:userId/facilities/:facilityId` | DELETE | JWT + Header | Revoke user's facility access |
| `/auth/switch-facility` | POST | JWT only | Switch user's active facility |

---

## 💡 **Why This Design?**

### Tenant-Level (Query Parameter)
✅ **Explicit** - Clear which tenant's data is being requested  
✅ **Admin-Friendly** - Easy to switch between tenants  
✅ **Auditable** - Tenant context is in the URL  
✅ **Cacheable** - Query params work well with caching

### User-Level (Header)
✅ **Secure** - TenantId derived from authenticated JWT  
✅ **Simpler** - No need to pass tenantId in URL  
✅ **Stateless** - All context in token  
✅ **User-Centric** - Operations scoped to authenticated user

---

## 🔄 **Correct API Usage**

### ✅ Correct: List All Facilities (Tenant-Level)
```bash
GET /facilities?tenantId=11111111-1111-1111-1111-111111111111
Authorization: Bearer {token}
```

### ✅ Correct: Get User's Facilities (User-Level)
```bash
GET /users/22222222-2222-2222-2222-222222222222/facilities
Authorization: Bearer {token-with-tenantId-in-jwt}
x-tenant-id: 11111111-1111-1111-1111-111111111111  (optional)
```

### ❌ Incorrect: Mixing Patterns
```bash
# DON'T use header for tenant-level
GET /facilities
x-tenant-id: xxx  ❌

# DON'T use query param for user-level
GET /users/:userId/facilities?tenantId=xxx  ❌
```

---

## 📖 **Implementation Notes**

### Current Implementation
- ✅ `/facilities` - Requires query parameter `?tenantId=xxx`
- ✅ `/users/:userId/facilities` - Accepts header `x-tenant-id` (optional)
- ✅ All user-facility operations use header-based tenant context

### Future Enhancement
Consider adding JWT-based tenant extraction:
```typescript
// Extract tenantId from JWT automatically
@Get()
list(@Request() req) {
  const tenantId = req.user?.tenantId || req.query.tenantId;
  return this.facilityService.list(tenantId);
}
```

---

## 🎉 **Summary**

**Design Philosophy:**
- **Tenant-level** = Query parameter (explicit, admin-focused)
- **User-level** = Header/JWT (implicit, user-focused)

**Benefits:**
- Clear separation of concerns
- Better security model
- Intuitive API design
- Easier to understand and use

This design aligns with REST best practices and multi-tenant security patterns! ✅

