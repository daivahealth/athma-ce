# Postman Collection Summary

## 📚 **Collection Overview**

**Total Endpoints:** 22 endpoints across 3 categories
- Auth Service: 9 endpoints
- Foundation Service: 7 endpoints  
- User Facilities: 6 endpoints

---

## 🔐 **Auth Service (9 endpoints)**

### Authentication Flow
| # | Name | Method | Endpoint | Auth | Purpose |
|---|------|--------|----------|------|---------|
| 1 | Login | POST | `/api/v1/auth/login` | None | Authenticate user, get tokens |
| 2 | Refresh Token | POST | `/api/v1/auth/refresh` | None | Get new access token |
| 3 | Logout | POST | `/api/v1/auth/logout` | Bearer | Invalidate session |

### Password Management
| # | Name | Method | Endpoint | Auth | Purpose |
|---|------|--------|----------|------|---------|
| 4 | Change Password | POST | `/api/v1/auth/change-password` | Bearer | Change user password |
| 5 | Reset Password | POST | `/api/v1/auth/reset-password` | None | Request password reset |
| 6 | Confirm Reset | POST | `/api/v1/auth/confirm-reset-password` | None | Complete password reset |

### MFA & Facility
| # | Name | Method | Endpoint | Auth | Purpose |
|---|------|--------|----------|------|---------|
| 7 | MFA Verify | POST | `/api/v1/auth/mfa/verify` | None | Verify MFA code |
| 8 | MFA Status | GET | `/api/v1/auth/mfa/status` | Bearer | Get MFA status |
| 9 | **Switch Facility** ⭐ | POST | `/api/v1/auth/switch-facility` | Bearer | Change active facility |

---

## 🏢 **Foundation Service (7 endpoints)**

### Tenant-Level Operations (Query Parameter)
| # | Name | Method | Endpoint | TenantId | Purpose |
|---|------|--------|----------|----------|---------|
| 1 | Health Check | GET | `/health` | N/A | Service health |
| 2 | List Tenants | GET | `/tenants` | N/A | List all tenants |
| 3 | Create Tenant | POST | `/tenants` | N/A | Create new tenant |
| 4 | Get Tenant | GET | `/tenants/:id` | N/A | Get tenant details |
| 5 | Update Tenant | PUT | `/tenants/:id` | N/A | Update tenant |
| 6 | Delete Tenant | DELETE | `/tenants/:id` | N/A | Delete tenant |
| 7 | **List Facilities** | GET | `/facilities?tenantId=xxx` | **Query Param** | List all tenant facilities |
| 8 | Create Facility | POST | `/facilities` | Header | Create facility |
| 9 | List Users | GET | `/users` | Header | List all users |
| 10 | Create User | POST | `/users` | Header | Create new user |
| 11 | List Staff | GET | `/staff` | Header | List all staff |

---

## 🏥 **User Facilities (6 endpoints)** ⭐ NEW

### User-Level Operations (Header)
All endpoints use `x-tenant-id` header

| # | Name | Method | Endpoint | Headers | Purpose |
|---|------|--------|----------|---------|---------|
| 1 | Get User Facilities | GET | `/users/:userId/facilities` | Auth + Tenant | List user's accessible facilities |
| 2 | Assign Facility | POST | `/users/:userId/facilities/assign` | Auth + Tenant | Grant facility access |
| 3 | Set Default | POST | `/users/:userId/facilities/set-default` | Auth + Tenant | Set default facility |
| 4 | Check Access | GET | `/users/:userId/facilities/check/:facilityId` | Auth + Tenant | Verify access |
| 5 | Revoke Access | DELETE | `/users/:userId/facilities/:facilityId` | Auth + Tenant | Remove access |
| 6 | Get Facility Users | GET | `/facilities/:facilityId/users` | Auth + Tenant | List facility users |

---

## 🎯 **API Design Patterns**

### Pattern 1: Tenant-Level (Query Parameter)
**Use Case:** Admin listing ALL resources in a tenant

```http
GET /facilities?tenantId={{tenantId}}
Authorization: Bearer {{accessToken}}
```

**Endpoints:**
- `/facilities` - List all tenant facilities
- `/users` - List all tenant users (if implemented)
- `/staff` - List all tenant staff

### Pattern 2: User-Level (Header)
**Use Case:** User-specific operations

```http
GET /users/{{userId}}/facilities
Authorization: Bearer {{accessToken}}
x-tenant-id: {{tenantId}}
```

**Endpoints:**
- `/users/:userId/facilities/*` - All user-facility operations
- `/auth/switch-facility` - User switches facility

---

## 📋 **Request Headers Summary**

### All Endpoints
```
Authorization: Bearer {{accessToken}}
```

### Tenant-Level Endpoints
```
Query Parameter: ?tenantId={{tenantId}}
```
**Examples:**
- `GET /facilities?tenantId={{tenantId}}`
- `GET /users?tenantId={{tenantId}}`

### User-Level Endpoints
```
x-tenant-id: {{tenantId}}
```
**Examples:**
- `GET /users/:userId/facilities`
- `POST /users/:userId/facilities/assign`
- `POST /auth/switch-facility`

---

## 🔄 **Auto-Updated Variables**

### After Login
```javascript
pm.environment.set('accessToken', body.accessToken);
pm.environment.set('refreshToken', body.refreshToken);
pm.environment.set('tenantId', body.user.tenantId);
pm.environment.set('userId', body.user.id);
```

### After Get User Facilities
```javascript
pm.environment.set('facilityId', body.defaultFacility.id);
```

### After Switch Facility
```javascript
pm.environment.set('accessToken', body.accessToken);
```

---

## 🧪 **Testing Workflows**

### Workflow 1: Tenant Admin View
```
1. Login as admin
2. List Tenants → GET /tenants
3. List Facilities → GET /facilities?tenantId={{tenantId}}
4. List Users → GET /users (with x-tenant-id header)
```

### Workflow 2: User Facility Management
```
1. Login as user
2. Get User Facilities → GET /users/{{userId}}/facilities
3. (Admin) Assign Facility → POST /users/{{userId}}/facilities/assign
4. Set Default → POST /users/{{userId}}/facilities/set-default
5. Switch Facility → POST /auth/switch-facility
```

### Workflow 3: Facility User Management
```
1. Login as admin
2. Get Facility Users → GET /facilities/{{facilityId}}/users
3. Assign user to facility
4. Check user access → GET /users/{{userId}}/facilities/check/{{facilityId}}
5. Revoke access (if needed)
```

---

## 📖 **Environment Variables**

| Variable | Default Value | Auto-Updated | Purpose |
|----------|---------------|--------------|---------|
| `authBaseUrl` | http://localhost:3001 | No | Auth service URL |
| `foundationBaseUrl` | http://localhost:3010 | No | Foundation service URL |
| `accessToken` | "" | ✅ Yes (Login, Switch) | JWT access token |
| `refreshToken` | "" | ✅ Yes (Login, Refresh) | JWT refresh token |
| `tenantId` | 11111111... | ✅ Yes (Login) | Current tenant ID |
| `userId` | 22222222... | No | Demo user ID |
| `facilityId` | "" | ✅ Yes (Get Facilities) | Current facility ID |

---

## ✅ **Quick Start**

### 1. Import Collection
- File: `docs/postman/zeal-backend.postman_collection.json`
- Environment: `docs/postman/zeal-local.postman_environment.json`

### 2. Run Login
- Folder: **Auth Service**
- Request: **Login**
- Auto-saves: `accessToken`, `refreshToken`, `tenantId`

### 3. Test Tenant-Level
```
Foundation Service → List Facilities
  Uses query parameter: ?tenantId={{tenantId}}
```

### 4. Test User-Level
```
User Facilities → Get User Facilities
  Uses header: x-tenant-id: {{tenantId}}
  Auto-saves: facilityId
```

### 5. Test Facility Switching
```
Auth Service → Switch Facility
  Body: { "facilityId": "{{facilityId}}" }
  Auto-updates: accessToken
```

---

## 🎨 **Request Examples**

### Tenant-Level: List All Facilities
```json
GET /facilities?tenantId=11111111-1111-1111-1111-111111111111
Headers:
  Authorization: Bearer eyJhbGc...

Response:
[
  {
    "id": "facility-uuid-1",
    "name": "Dubai Central Clinic",
    "facilityType": "hospital",
    "status": "active"
  },
  {
    "id": "facility-uuid-2",
    "name": "Abu Dhabi Branch",
    "facilityType": "clinic",
    "status": "active"
  }
]
```

### User-Level: Get User's Facilities
```json
GET /users/22222222-2222-2222-2222-222222222222/facilities
Headers:
  Authorization: Bearer eyJhbGc...
  x-tenant-id: 11111111-1111-1111-1111-111111111111

Response:
{
  "defaultFacility": {
    "id": "facility-uuid-1",
    "name": "Dubai Central Clinic",
    "facilityType": "hospital",
    "accessLevel": "standard"
  },
  "facilities": [
    {
      "id": "facility-uuid-1",
      "name": "Dubai Central Clinic",
      "isDefault": true,
      "accessLevel": "standard"
    }
  ]
}
```

---

## 📊 **Design Benefits**

### Tenant-Level (Query Parameter)
✅ Explicit tenant scope in URL  
✅ Easy to switch tenants for testing  
✅ Clear audit trail  
✅ RESTful design

### User-Level (Header)
✅ Tenant from JWT context  
✅ Secure (can't manipulate URL)  
✅ Simpler API calls  
✅ User-centric operations

---

## 🚀 **Ready to Test!**

All endpoints are properly configured with the correct parameter/header patterns:
- ✅ Tenant-level → Query parameters
- ✅ User-level → Headers
- ✅ Auto-update scripts included
- ✅ Complete documentation

Import and test! 🎉

