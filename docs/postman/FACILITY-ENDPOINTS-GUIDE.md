# User-Facility Endpoints Guide

## 🎯 Quick Reference

This guide provides detailed documentation for the new user-facility management endpoints added to the Zeal Backend Postman collection.

---

## 📋 **New Endpoints Summary**

### Foundation Auth
- **Switch Facility**: Change active facility context during session

### User Facilities (Foundation Service)
- **Get User Facilities**: List all facilities user has access to
- **Assign Facility**: Grant facility access to user
- **Set Default Facility**: Set user's home facility
- **Check Access**: Verify if user has access to facility
- **Revoke Access**: Remove facility access from user
- **Get Facility Users**: List all users with access to facility

---

## 🔐 **Foundation Auth Endpoints**

### POST /api/v1/auth/switch-facility

**Description:** Switch the user's active facility context and receive a new JWT token with updated facilityId.

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "facilityId": "facility-uuid"
}
```

**Response:**
```json
{
  "accessToken": "new-jwt-with-updated-facilityId",
  "currentFacility": {
    "id": "facility-uuid",
    "name": "Abu Dhabi Branch",
    "facilityType": "clinic",
    "accessLevel": "standard",
    "isDefault": false
  }
}
```

**Auto-Updates:** `accessToken` environment variable

**Use Case:** User working at multiple facilities switches context to perform operations at a different location.

---

## 🏥 **User Facilities Endpoints**

### 1. GET /api/v1/users/:userId/facilities

**Description:** Get all facilities user has access to, including default facility.

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**URL Parameters:**
- `userId`: User UUID

**Response:**
```json
{
  "defaultFacility": {
    "id": "facility-uuid",
    "name": "Al Rashid Medical Center - Main",
    "facilityType": "hospital",
    "accessLevel": "standard"
  },
  "facilities": [
    {
      "id": "facility-uuid-1",
      "name": "Al Rashid Medical Center - Main",
      "facilityType": "hospital",
      "city": "Dubai",
      "emirate": "Dubai",
      "accessLevel": "standard",
      "isDefault": true,
      "grantedAt": "2025-10-06T..."
    },
    {
      "id": "facility-uuid-2",
      "name": "Abu Dhabi Branch",
      "facilityType": "clinic",
      "city": "Abu Dhabi",
      "emirate": "Abu Dhabi",
      "accessLevel": "admin",
      "isDefault": false,
      "grantedAt": "2025-10-06T..."
    }
  ]
}
```

**Auto-Updates:** `facilityId` to default facility ID

**Use Case:** Check which facilities a user can access and identify their default facility.

---

### 2. POST /api/v1/users/:userId/facilities/assign

**Description:** Grant a user access to a facility with specified access level.

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**URL Parameters:**
- `userId`: User UUID

**Request Body:**
```json
{
  "facilityId": "facility-uuid",
  "accessLevel": "standard",
  "setAsDefault": false
}
```

**Access Levels:**
- `standard` - Normal user access
- `admin` - Administrative access
- `read_only` - View-only access

**Response:**
```json
{
  "success": true,
  "facilityAccess": {
    "facilityId": "facility-uuid",
    "facilityName": "Abu Dhabi Branch",
    "accessLevel": "admin",
    "isDefault": false,
    "grantedAt": "2025-10-06T..."
  }
}
```

**Validations:**
- Facility must belong to user's tenant
- Facility must be active
- User cannot be assigned to facilities outside their tenant

**Use Case:** Administrator grants a doctor access to work at a new branch location.

---

### 3. POST /api/v1/users/:userId/facilities/set-default

**Description:** Set a facility as the user's default/home facility.

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**URL Parameters:**
- `userId`: User UUID

**Request Body:**
```json
{
  "facilityId": "facility-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "defaultFacility": {
    "id": "facility-uuid",
    "name": "Abu Dhabi Branch",
    "facilityType": "clinic"
  }
}
```

**Validations:**
- User must already have access to the facility
- Previous default is automatically unset
- User's `defaultFacilityId` field is updated

**Use Case:** User permanently transfers to a different facility and sets it as their new home base.

---

### 4. GET /api/v1/users/:userId/facilities/check/:facilityId

**Description:** Check if a user has access to a specific facility.

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**URL Parameters:**
- `userId`: User UUID
- `facilityId`: Facility UUID

**Response:**
```json
{
  "userId": "user-uuid",
  "facilityId": "facility-uuid",
  "hasAccess": true
}
```

**Use Case:** Validate user permissions before allowing facility-specific operations.

---

### 5. DELETE /api/v1/users/:userId/facilities/:facilityId

**Description:** Revoke a user's access to a facility (soft delete).

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**URL Parameters:**
- `userId`: User UUID
- `facilityId`: Facility UUID

**Response:**
```json
{
  "success": true,
  "message": "Facility access revoked successfully"
}
```

**Validations:**
- Cannot revoke access to default facility
- Must set new default before revoking current default
- Soft delete (sets revokedAt timestamp)

**Error Response (if default):**
```json
{
  "statusCode": 400,
  "message": "Cannot revoke access to default facility. Set a new default facility first."
}
```

**Use Case:** Administrator removes a user's access to a facility they no longer work at.

---

### 6. GET /api/v1/facilities/:facilityId/users

**Description:** Get all users who have access to a specific facility.

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**URL Parameters:**
- `facilityId`: Facility UUID

**Response:**
```json
{
  "facilityId": "facility-uuid",
  "users": [
    {
      "id": "user-uuid",
      "email": "doctor@clinic.com",
      "firstName": "Ahmad",
      "lastName": "Doctor",
      "role": "physician",
      "accessLevel": "standard",
      "isDefault": true,
      "grantedAt": "2025-10-06T..."
    },
    {
      "id": "user-uuid-2",
      "email": "admin@clinic.com",
      "firstName": "Sarah",
      "lastName": "Admin",
      "role": "admin",
      "accessLevel": "admin",
      "isDefault": false,
      "grantedAt": "2025-10-06T..."
    }
  ]
}
```

**Use Case:** View all staff members assigned to a specific facility.

---

## 🧪 **Testing Workflow**

### Step 1: Login and Get Facility Context
```
1. Foundation Auth → Login
   Response includes user.defaultFacility and user.facilities

2. User Facilities → Get User Facilities
   Auto-saves facilityId for subsequent requests
```

### Step 2: Assign Additional Facility
```
1. Foundation Service → Create Facility (if needed)
   Get new facilityId from response

2. User Facilities → Assign Facility to User
   Body: { facilityId: "new-facility-uuid", accessLevel: "admin" }
```

### Step 3: Switch Between Facilities
```
1. Foundation Auth → Switch Facility
   Body: { facilityId: "other-facility-uuid" }
   
2. Verify JWT Claims (decode accessToken)
   - defaultFacilityId: unchanged (home base)
   - facilityId: updated to new facility
```

### Step 4: Manage Default Facility
```
1. User Facilities → Set Default Facility
   Body: { facilityId: "new-default-uuid" }

2. User Facilities → Get User Facilities
   Verify new default facility
```

### Step 5: Revoke Access
```
1. User Facilities → Revoke Facility Access
   DELETE /api/v1/users/{userId}/facilities/{facilityId}
   
2. Try to revoke default → Should fail with 400 error
```

---

## 📊 **Response Codes**

### Success Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully

### Client Error Codes
- `400 Bad Request` - Invalid data or business rule violation
  - Revoking default facility
  - Cross-tenant facility assignment
  - Inactive facility assignment
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User or facility not found

### Server Error Codes
- `500 Internal Server Error` - Server-side error

---

## 🔒 **Security & Validation**

### Tenant Isolation
- All facility assignments validated against user's tenant
- Cross-tenant access automatically rejected
- RLS policies enforce boundaries

### Business Rules Enforced
1. ✅ One default facility per user
2. ✅ Cannot revoke default facility
3. ✅ Facility must belong to same tenant
4. ✅ Only active facilities can be assigned
5. ✅ Soft delete preserves audit trail

### Audit Trail
Every operation records:
- `grantedBy` - Who granted access
- `grantedAt` - When granted
- `revokedAt` - When revoked

---

## 🎨 **Postman Test Scripts**

### Auto-Save Facility ID
```javascript
// In "Get User Facilities" request
if (pm.response.code === 200) {
  const body = pm.response.json();
  if (body.defaultFacility) {
    pm.environment.set('facilityId', body.defaultFacility.id);
    console.log('Default Facility:', body.defaultFacility.name);
  }
}
```

### Auto-Save Access Token
```javascript
// In "Switch Facility" request
if (pm.response.code === 200) {
  const body = pm.response.json();
  if (body.accessToken) {
    pm.environment.set('accessToken', body.accessToken);
  }
  console.log('Switched to facility:', body.currentFacility);
}
```

---

## 📖 **Example Use Cases**

### Use Case 1: New Employee Onboarding
```
1. Create User → New staff member
2. Assign Facility → Grant access to their primary facility
   Body: { facilityId: "main-clinic-uuid", accessLevel: "standard", setAsDefault: true }
3. Verify with Get User Facilities
```

### Use Case 2: Roving Consultant
```
1. Assign Facility → Main Hospital (default)
2. Assign Facility → Branch Clinic 1 (additional)
3. Assign Facility → Branch Clinic 2 (additional)
4. User switches between facilities as needed using Switch Facility
```

### Use Case 3: Staff Transfer
```
1. Assign Facility → New location
2. Set Default Facility → Update home base
3. Revoke Facility → Remove access to old location
```

### Use Case 4: Facility Audit
```
1. Get Facility Users → See all staff at location
2. Check access levels
3. Verify default facility assignments
```

---

## 🚀 **Quick Start**

1. **Import Collection & Environment**
2. **Run Login** → Auto-saves tokens
3. **Run Get User Facilities** → Auto-saves facilityId
4. **Test facility operations** → Use saved variables

All endpoints ready to test with minimal setup! 🎉

---

## 📚 **Related Documentation**

- `docs/USER-FACILITY-MAPPING-DESIGN.md` - System design
- `docs/USER-FACILITY-COMPLETE-IMPLEMENTATION.md` - Complete guide
- `MIGRATION-GUIDE.md` - Database setup
