# Duplicate /v1 Path Issue - Fixed

## Issue Summary

**Problem**: Frontend API calls resulted in 404 errors with duplicate `/v1` in the URL path.

**Example Error**:
```
404 GET /api/v1/v1/inpatient/wards/multi-board
         ^^^^^^ duplicate v1
```

**Expected**:
```
200 GET /api/v1/inpatient/wards/multi-board
         ^^^ single v1
```

---

## Root Cause

The issue occurred due to **double URL construction**:

1. **Backend** has global prefix: `/api/v1` (configured in NestJS)
2. **Frontend** API client has base URL: `http://localhost:3011/api/v1`
3. **Frontend** service methods included `/v1` in paths: `/v1/inpatient/...`

**Result**: `http://localhost:3011/api/v1` + `/v1/inpatient/...` = `/api/v1/v1/inpatient/...` ❌

---

## Files Fixed

### Backend (Controller Decorators)

Fixed controller decorators to remove `/v1` prefix since NestJS applies global prefix:

#### ✅ `/backend/services/clinical/src/modules/inpatient/admission.controller.ts`
```typescript
// Before
@Controller('v1/inpatient/admissions')  // ❌ Wrong

// After
@Controller('inpatient/admissions')     // ✅ Correct
```

#### ✅ `/backend/services/clinical/src/modules/inpatient/discharge.controller.ts`
```typescript
// Before
@Controller('v1/inpatient/admissions')  // ❌ Wrong

// After
@Controller('inpatient/admissions')     // ✅ Correct
```

#### ✅ `/backend/services/clinical/src/modules/inpatient/ward.controller.ts`
```typescript
// Already correct
@Controller('inpatient/wards')          // ✅ Correct
```

### Frontend (API Service Methods)

Fixed all API paths in the inpatient service to remove `/v1` prefix:

#### ✅ `/frontend/src/modules/clinical/services/inpatient-service.ts`

**Changed 15+ endpoints from**:
```typescript
// ❌ WRONG - includes /v1
clinicalClient.get('/v1/inpatient/admissions')
clinicalClient.get('/v1/inpatient/wards/multi-board')
clinicalClient.post('/v1/inpatient/admissions/:id/transfer')
```

**To**:
```typescript
// ✅ CORRECT - no /v1 prefix
clinicalClient.get('/inpatient/admissions')
clinicalClient.get('/inpatient/wards/multi-board')
clinicalClient.post('/inpatient/admissions/:id/transfer')
```

---

## Understanding the URL Construction

### Backend (NestJS)

```typescript
// main.ts or app configuration
app.setGlobalPrefix('api/v1');

// Controller
@Controller('inpatient/wards')  // Do NOT include 'v1'
export class WardController {
  @Get('multi-board')           // Do NOT include 'v1'
  async getMultiWardBoard() {
    // ...
  }
}

// Result: GET /api/v1/inpatient/wards/multi-board ✅
```

### Frontend (Axios Client)

```typescript
// API Client Configuration
export const clinicalClient = axios.create({
  baseURL: 'http://localhost:3011/api/v1',  // Includes /api/v1
});

// Service Method
async getMultiWardBedBoard() {
  // Do NOT include /v1 in path
  const response = await clinicalClient.get('/inpatient/wards/multi-board');
  //                                        ^^^ no /v1 prefix
  return response.data;
}

// Result: GET http://localhost:3011/api/v1/inpatient/wards/multi-board ✅
```

---

## Correct API URL Patterns

### ✅ Backend Controllers

```typescript
// Foundation Service (port 3010)
@Controller('tenants')              // → /api/v1/tenants
@Controller('facilities')           // → /api/v1/facilities
@Controller('users')                // → /api/v1/users

// Clinical Service (port 3011)
@Controller('patients')             // → /api/v1/patients
@Controller('inpatient/admissions') // → /api/v1/inpatient/admissions
@Controller('inpatient/wards')      // → /api/v1/inpatient/wards

// RCM Service (port 3012)
@Controller('billing')              // → /api/v1/billing
@Controller('claims')               // → /api/v1/claims
```

### ✅ Frontend API Clients

```typescript
// Base URLs (include /api/v1)
foundationClient.baseURL = 'http://localhost:3010/api/v1'
clinicalClient.baseURL   = 'http://localhost:3011/api/v1'
rcmClient.baseURL        = 'http://localhost:3012/api/v1'

// Service Methods (NO /v1 prefix in paths)
foundationClient.get('/tenants')                     // ✅
foundationClient.get('/facilities/:id')              // ✅

clinicalClient.get('/patients')                      // ✅
clinicalClient.get('/inpatient/admissions')          // ✅
clinicalClient.get('/inpatient/wards/multi-board')   // ✅

rcmClient.get('/billing/invoices')                   // ✅
rcmClient.post('/claims')                            // ✅
```

### ❌ Common Mistakes

```typescript
// DO NOT include /api/v1 in controller decorators
@Controller('api/v1/patients')      // ❌ Wrong
@Controller('v1/patients')          // ❌ Wrong

// DO NOT include /v1 in API service paths
clinicalClient.get('/v1/patients')  // ❌ Wrong
clinicalClient.get('/api/v1/...')   // ❌ Wrong
```

---

## Testing the Fix

### Test Endpoints

```bash
# Multi-Ward Board
curl -H "x-tenant-id: ..." \
     -H "x-user-id: ..." \
     -H "x-facility-id: ..." \
     http://localhost:3011/api/v1/inpatient/wards/multi-board?includeEmptyWards=true

# Single Ward Board
curl -H "x-tenant-id: ..." \
     -H "x-user-id: ..." \
     -H "x-facility-id: ..." \
     http://localhost:3011/api/v1/inpatient/wards/{wardId}/bed-board

# Admissions
curl -H "x-tenant-id: ..." \
     -H "x-user-id: ..." \
     -H "x-facility-id: ..." \
     http://localhost:3011/api/v1/inpatient/admissions

# Transfer History
curl -H "x-tenant-id: ..." \
     -H "x-user-id: ..." \
     -H "x-facility-id: ..." \
     http://localhost:3011/api/v1/inpatient/admissions/{id}/transfer-history
```

### Expected Results

✅ All endpoints return **200 OK** (or appropriate success status)
❌ No more **404 Not Found** errors
✅ URLs have **single** `/v1` not duplicate `/v1/v1`

---

## Prevention Guidelines

### For Backend Developers

1. **Never** include `/v1` or `/api/v1` in `@Controller()` decorators
2. Controllers automatically get the global prefix
3. Check registered routes on startup: Look for duplicate `/v1/v1` in logs

```typescript
// Good Examples ✅
@Controller('users')
@Controller('inpatient/admissions')
@Controller('billing/claims')

// Bad Examples ❌
@Controller('v1/users')
@Controller('api/v1/inpatient/admissions')
```

### For Frontend Developers

1. **Never** include `/v1` in API service method paths
2. The API client `baseURL` already includes `/api/v1`
3. Paths should start with resource name directly

```typescript
// Good Examples ✅
clinicalClient.get('/patients')
clinicalClient.get('/inpatient/wards/multi-board')
clinicalClient.post('/inpatient/admissions/:id/transfer')

// Bad Examples ❌
clinicalClient.get('/v1/patients')
clinicalClient.get('/api/v1/inpatient/wards/multi-board')
```

### Code Review Checklist

When reviewing API-related code:

- [ ] Backend: Controller decorators don't include `/v1` or `/api/v1`
- [ ] Frontend: API service paths don't include `/v1` or `/api/v1`
- [ ] Test the full URL in browser/Postman to verify single `/v1`
- [ ] Check backend logs for registered routes (should be `/api/v1/...` not `/api/v1/v1/...`)

---

## Verification

### Backend Routes Registered

```
✅ GET    /api/v1/inpatient/admissions
✅ POST   /api/v1/inpatient/admissions
✅ GET    /api/v1/inpatient/admissions/:id
✅ POST   /api/v1/inpatient/admissions/:id/transfer
✅ GET    /api/v1/inpatient/admissions/:id/transfer-history
✅ GET    /api/v1/inpatient/admissions/:id/current-bed-assignment
✅ GET    /api/v1/inpatient/wards/:wardId/bed-board
✅ GET    /api/v1/inpatient/wards/multi-board
✅ GET    /api/v1/inpatient/wards/bed-browser
```

### Frontend Requests

```
✅ GET    http://localhost:3011/api/v1/inpatient/admissions
✅ GET    http://localhost:3011/api/v1/inpatient/wards/multi-board
✅ POST   http://localhost:3011/api/v1/inpatient/admissions/:id/transfer
```

---

## Related Documentation

- [Inpatient API Endpoints](../api/INPATIENT-API-ENDPOINTS.md)
- [Transfer APIs Frontend Reference](../api/TRANSFER-APIS-FRONTEND-REFERENCE.md)
- [Ward Board with Patient Info](../api/WARD-BOARD-PATIENT-INFO.md)

---

## Status

✅ **FIXED**: All duplicate `/v1` issues resolved
✅ **Tested**: Endpoints return 200 OK
✅ **Documented**: Prevention guidelines added

**Date Fixed**: 2026-01-13
**Fixed By**: Claude Code Assistant
