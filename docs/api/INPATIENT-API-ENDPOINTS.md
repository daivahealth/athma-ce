# Inpatient Care API Endpoints

Complete reference of all Inpatient Care API endpoints with correct paths.

**Base URL**: `http://localhost:3011/api/v1`

**Required Headers** (for all requests):
```
x-tenant-id: <tenant-uuid>
x-user-id: <user-uuid>
x-facility-id: <facility-uuid>
Authorization: Bearer <jwt-token>
```

---

## Admission Management

**Base Path**: `/api/v1/inpatient/admissions`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inpatient/admissions` | Search admissions with filters |
| POST | `/inpatient/admissions` | Create new admission |
| GET | `/inpatient/admissions/:id` | Get admission by ID |
| PATCH | `/inpatient/admissions/:id` | Update admission |
| PATCH | `/inpatient/admissions/:id/status` | Update admission status |
| PATCH | `/inpatient/admissions/:id/acuity` | Update patient acuity level |
| GET | `/inpatient/admissions/:id/events` | Get admission events |
| POST | `/inpatient/admissions/:id/events` | Create admission event |

---

## Transfer Management

**Base Path**: `/api/v1/inpatient/admissions/:id`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/inpatient/admissions/:id/transfer` | Transfer patient to new bed |
| GET | `/inpatient/admissions/:id/transfer-history` | Get transfer history |
| GET | `/inpatient/admissions/:id/current-bed-assignment` | Get current bed assignment |

---

## Discharge Management

**Base Path**: `/api/v1/inpatient/admissions/:id`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inpatient/admissions/:id/discharge-checklist` | Get discharge checklist |
| PATCH | `/inpatient/admissions/:id/discharge-checklist` | Update discharge checklist |
| POST | `/inpatient/admissions/:id/discharge` | Discharge patient |

---

## Ward Board & Bed Management

**Base Path**: `/api/v1/inpatient/wards`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inpatient/wards/:wardId/bed-board` | Get single ward bed board (with patient info) |
| GET | `/inpatient/wards/:wardId/dashboard` | Get ward dashboard |
| GET | `/inpatient/wards/:wardId/patients` | Get ward patients |
| GET | `/inpatient/wards/multi-board` | Get multi-ward/facility bed board (with patient info) |
| GET | `/inpatient/wards/bed-browser` | Central bed management browser |

---

## Bed Status Management

**Base Path**: `/api/v1/inpatient/wards/beds/:bedId`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/inpatient/wards/beds/:bedId/cleaning/complete` | Mark bed cleaning as complete |
| POST | `/inpatient/wards/beds/:bedId/cleaning/required` | Mark bed cleaning as required |
| POST | `/inpatient/wards/beds/:bedId/maintenance/start` | Start bed maintenance |
| POST | `/inpatient/wards/beds/:bedId/maintenance/complete` | Complete bed maintenance |

---

## Complete API Endpoint List

### Admission APIs

```
✅ GET    /api/v1/inpatient/admissions
✅ POST   /api/v1/inpatient/admissions
✅ GET    /api/v1/inpatient/admissions/:id
✅ PATCH  /api/v1/inpatient/admissions/:id
✅ PATCH  /api/v1/inpatient/admissions/:id/status
✅ PATCH  /api/v1/inpatient/admissions/:id/acuity
✅ GET    /api/v1/inpatient/admissions/:id/events
✅ POST   /api/v1/inpatient/admissions/:id/events
```

### Transfer APIs

```
✅ POST   /api/v1/inpatient/admissions/:id/transfer
✅ GET    /api/v1/inpatient/admissions/:id/transfer-history
✅ GET    /api/v1/inpatient/admissions/:id/current-bed-assignment
```

### Discharge APIs

```
✅ GET    /api/v1/inpatient/admissions/:id/discharge-checklist
✅ PATCH  /api/v1/inpatient/admissions/:id/discharge-checklist
✅ POST   /api/v1/inpatient/admissions/:id/discharge
```

### Ward Board APIs

```
✅ GET    /api/v1/inpatient/wards/:wardId/bed-board
✅ GET    /api/v1/inpatient/wards/:wardId/dashboard
✅ GET    /api/v1/inpatient/wards/:wardId/patients
✅ GET    /api/v1/inpatient/wards/multi-board
✅ GET    /api/v1/inpatient/wards/bed-browser
```

### Bed Management APIs

```
✅ POST   /api/v1/inpatient/wards/beds/:bedId/cleaning/complete
✅ POST   /api/v1/inpatient/wards/beds/:bedId/cleaning/required
✅ POST   /api/v1/inpatient/wards/beds/:bedId/maintenance/start
✅ POST   /api/v1/inpatient/wards/beds/:bedId/maintenance/complete
```

---

## Frontend API Configuration

### Environment Variables

```env
NEXT_PUBLIC_CLINICAL_API_URL=http://localhost:3011/api/v1
```

### API Client Setup

```typescript
// src/lib/api/clinical-api.ts
import axios from 'axios';

export const clinicalApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CLINICAL_API_URL || 'http://localhost:3011/api/v1',
  timeout: 30000,
});

// Request interceptor - Add tenant context headers
clinicalApi.interceptors.request.use((config) => {
  const tenantId = getTenantId(); // From your tenant context
  const userId = getUserId();     // From JWT or auth context
  const facilityId = getFacilityId(); // From tenant context

  config.headers['x-tenant-id'] = tenantId;
  config.headers['x-user-id'] = userId;
  config.headers['x-facility-id'] = facilityId;
  config.headers['Authorization'] = `Bearer ${getAccessToken()}`;

  return config;
});
```

---

## Example Usage

### Get Ward Board with Patient Info

```typescript
// Single Ward
const response = await clinicalApi.get('/inpatient/wards/ward-uuid/bed-board');

// Multi-Ward
const response = await clinicalApi.get('/inpatient/wards/multi-board', {
  params: {
    includeEmptyWards: true,
    statusFilter: 'ACTIVE,ADMITTED',
    acuityFilter: 'CRITICAL,WATCH',
  },
});
```

### Transfer Patient

```typescript
const response = await clinicalApi.post('/inpatient/admissions/admission-uuid/transfer', {
  toWardId: 'ward-uuid',
  toBedId: 'bed-uuid',
  transferReason: 'Clinical need - requires closer monitoring',
  transferType: 'clinical_need',
  notes: 'Patient vitals declining',
});
```

### Get Transfer History

```typescript
const response = await clinicalApi.get('/inpatient/admissions/admission-uuid/transfer-history');
```

### Discharge Patient

```typescript
const response = await clinicalApi.post('/inpatient/admissions/admission-uuid/discharge', {
  dischargeDate: '2026-01-15T10:00:00Z',
  dischargeType: 'routine',
  dischargeDestination: 'home',
  dischargeSummary: 'Patient recovered well, ready for discharge',
  followUpInstructions: 'Follow up with GP in 1 week',
  medications: [],
});
```

---

## Important Notes

### ⚠️ Path Fix Applied

**Previous Issue**: Duplicate `/v1` in paths causing 404 errors
- ❌ OLD: `/api/v1/v1/inpatient/admissions/...`
- ✅ NEW: `/api/v1/inpatient/admissions/...`

**Fix Applied**: Removed `v1` prefix from controller decorators:
```typescript
// Before
@Controller('v1/inpatient/admissions')  // ❌ Wrong

// After
@Controller('inpatient/admissions')     // ✅ Correct
```

### URL Structure

The API has a global prefix `/api/v1`, so:
- **Controllers** should NOT include `v1` in their path
- **Full URL** = `http://localhost:3011` + `/api/v1` + controller path + endpoint path

Example:
- Controller: `@Controller('inpatient/wards')`
- Endpoint: `@Get('multi-board')`
- Full URL: `http://localhost:3011/api/v1/inpatient/wards/multi-board`

### Headers Are Required

All endpoints require these headers:
- `x-tenant-id` - Current tenant UUID
- `x-user-id` - Logged-in user UUID
- `x-facility-id` - Current facility UUID
- `Authorization` - Bearer JWT token

Missing headers will result in 400 Bad Request or 401 Unauthorized errors.

---

## API Documentation Links

- [Transfer APIs Frontend Reference](./TRANSFER-APIS-FRONTEND-REFERENCE.md)
- [Ward Board with Patient Info](./WARD-BOARD-PATIENT-INFO.md)
- [Bed Browser API](./BED-BROWSER-API.md) (if exists)

---

## Service Status

✅ **Clinical Service**: Running on http://localhost:3011
✅ **All Endpoints**: Registered and operational
✅ **Patient Data**: Complete patient info included in Ward Board APIs
✅ **Path Fix**: Duplicate `/v1` issue resolved

Last Updated: 2026-01-13
