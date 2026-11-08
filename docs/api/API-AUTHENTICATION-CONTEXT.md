# API Authentication & Context Requirements

**Date**: 2025-10-24
**Status**: ✅ Implemented

## Overview

All API requests to the athma-ce platform require proper authentication context including **tenant ID**, **user ID**, and **facility ID**. These are used for:

1. **Multi-tenant isolation** - Ensuring data is isolated per tenant
2. **Audit trails** - Tracking who created/modified records
3. **Authorization** - Enforcing RBAC permissions
4. **Facility context** - Tracking which facility the operation occurred at

## Required Headers

### For All Requests

All API requests (except `/health` endpoints) must include the following headers:

```http
x-tenant-id: <tenant-uuid>
x-user-id: <user-uuid>
x-facility-id: <facility-uuid>
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Header Validation

All three context headers are **validated as UUIDs**:
- Must be in UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Only hexadecimal characters (0-9, a-f)
- Case insensitive
- Must be version 4 UUIDs

❌ **Invalid formats** (will be rejected):
- `'system'`, `'default-tenant'`, `'admin'` - Not UUIDs
- `12345` - Not UUID format
- Missing headers - Will return 400 Bad Request

## JWT Token Structure

When using JWT authentication, the token should contain:

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "tenantId": "11111111-1111-1111-1111-111111111111",
  "facilityId": "22222222-2222-2222-2222-222222222222",
  "role": "physician",
  "email": "user@example.com"
}
```

### Priority Order

The middleware extracts context in this priority order:

1. **JWT token** (`req.user` from authentication middleware)
2. **HTTP headers** (`x-user-id`, `x-facility-id`)
3. **Error** if not found

## Example Requests

### Creating a Patient (Correct)

```bash
curl --location 'http://localhost:3011/api/v1/patients' \
--header 'Content-Type: application/json' \
--header 'x-tenant-id: 11111111-1111-1111-1111-111111111111' \
--header 'x-user-id: 550e8400-e29b-41d4-a716-446655440000' \
--header 'x-facility-id: 22222222-2222-2222-2222-222222222222' \
--header 'Authorization: Bearer <your-jwt-token>' \
--data-raw '{
  "firstName": "Sajith",
  "lastName": "Chandran",
  "gender": "male",
  "dateOfBirth": "1989-05-25",
  "nationality": "AE",
  "nationalId": "784198512345670",
  "nationalIdType": "emirates_id",
  "issuingCountry": "AE",
  "phoneNumber": "+971501234567",
  "email": "sajithchandran@gmail.com",
  "bloodGroup": "O+",
  "addressLine1": "Dubai Marina, Tower 1, Apt 504",
  "city": "Dubai",
  "state": "Dubai",
  "country": "AE",
  "postalCode": "12345",
  "preferredLanguage": "en",
  "registrationSource": "walk_in"
}'
```

### Common Errors

#### ❌ Missing Tenant ID

```bash
# Request without x-tenant-id header
curl --location 'http://localhost:3011/api/v1/patients' \
--header 'Content-Type: application/json' \
--data-raw '{ ... }'
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Tenant ID is required. Please provide x-tenant-id header.",
  "error": "Bad Request"
}
```

#### ❌ Missing User ID

```bash
# Request without x-user-id header
curl --location 'http://localhost:3011/api/v1/patients' \
--header 'x-tenant-id: 11111111-1111-1111-1111-111111111111' \
--data-raw '{ ... }'
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "User ID is required. Please authenticate or provide x-user-id header.",
  "error": "Bad Request"
}
```

#### ❌ Missing Facility ID

```bash
# Request without x-facility-id header
curl --location 'http://localhost:3011/api/v1/patients' \
--header 'x-tenant-id: 11111111-1111-1111-1111-111111111111' \
--header 'x-user-id: 550e8400-e29b-41d4-a716-446655440000' \
--data-raw '{ ... }'
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Facility ID is required. Please provide x-facility-id header or ensure it's in your JWT token.",
  "error": "Bad Request"
}
```

#### ❌ Invalid UUID Format

```bash
# Request with invalid UUID (e.g., 'default-tenant')
curl --location 'http://localhost:3011/api/v1/patients' \
--header 'x-tenant-id: default-tenant' \
--header 'x-user-id: system' \
--header 'x-facility-id: main-facility' \
--data-raw '{ ... }'
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Invalid tenant ID format. Must be a valid UUID.",
  "error": "Bad Request"
}
```

## Write Access Rules

Every service refuses some writes before they reach a controller (see [Read-only access](../security/20-RBAC-Access-Control.md#read-only-access)):

| Status | `code` in body | When |
|---|---|---|
| `403` | `READ_ONLY_ACCESS` | The access token has `readOnly: true` (demo visitor) and the request is not `GET`/`HEAD`/`OPTIONS` or an allowlisted session/check endpoint |
| `401` | `AUTH_REQUIRED` | `AUTH_REQUIRE_TOKEN_FOR_WRITES` is on (the public demo) and an unsafe request carries no token that verifies and no valid `x-internal-api-key`. Headers alone (`x-user-id` etc.) are not enough to write |
| `403` | `TENANT_MISMATCH` | Any method: the bearer token's `tenantId` differs from `x-tenant-id`. Send the token's own tenant, or omit the header and the service fills it in |
| `401` | `AUTH_REQUIRED` | `AUTH_REQUIRE_TOKEN_FOR_READS=true` and a `GET`/`HEAD` carries neither a token that verifies nor a valid `x-internal-api-key`, outside the public read paths (health, external sign-in start/callback/providers, config resolution, API docs) |

```json
{ "statusCode": 403, "error": "Forbidden", "code": "READ_ONLY_ACCESS", "message": "This account has read-only access to the demo hospital. Create your own sandbox to try changes." }
```

Service-to-service calls, reads included, must send either the caller's bearer token or `x-internal-api-key`. Server-Sent Events streams, which cannot send headers, may pass the token as `?access_token=` on `GET` only. With a user token, `x-user-id` is always taken from the token.

## External Sign-in

Foundation endpoints (all public), design in [ADR-0016](../ADR/ADR-0016-external-identity-providers.md):

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/v1/auth/oauth/providers` | `{ providers: [{ id, label }], termsVersion }`; empty list when the instance has no external sign-in configured |
| `GET` | `/api/v1/auth/oauth/{google\|microsoft\|github}/start?locale=en&acceptTerms=true&returnTo=/en/dashboard` | Sets the `athma_oauth` cookie and redirects (302) to the provider. Without `acceptTerms=true` it redirects to `/{locale}/login?oauthError=terms_required` |
| `GET` | `/api/v1/auth/oauth/{provider}/callback` | Provider redirect target. Redirects to `/{locale}/auth/callback#ticket=…&returnTo=…`, or to `/{locale}/login?oauthError=<code>` |
| `POST` | `/api/v1/auth/oauth/exchange` | Body `{ "ticket": "…" }`. Returns the same body as `POST /auth/login`. A ticket works once, for 2 minutes; otherwise `401` |

`oauthError` codes: `provider_denied`, `invalid_state`, `terms_required`, `rate_limited`, `account_disabled`, `provider_disabled`, `not_configured`, `provider_error`.

## Audit Fields

### Automatic Population

The context headers are automatically used to populate audit fields in database records:

**On CREATE:**
```typescript
{
  createdBy: context.userId,          // From x-user-id or JWT
  createdAtFacility: context.facilityId, // From x-facility-id or JWT
  createdAt: new Date()
}
```

**On UPDATE:**
```typescript
{
  updatedBy: context.userId,          // From x-user-id or JWT
  updatedAtFacility: context.facilityId, // From x-facility-id or JWT
  updatedAt: new Date()
}
```

### Database Schema

All auditable tables include these fields:

```prisma
model Patient {
  // ... other fields

  // Audit fields - automatically populated
  createdBy         String   @map("created_by") @db.Uuid
  createdAtFacility String   @map("created_at_facility") @db.Uuid
  createdAt         DateTime @default(now()) @map("created_at")

  updatedBy         String?  @map("updated_by") @db.Uuid
  updatedAtFacility String?  @map("updated_at_facility") @db.Uuid
  updatedAt         DateTime @updatedAt @map("updated_at")
}
```

## Implementation Details

### Middleware Flow

```
1. Request arrives with headers
   ↓
2. TenantContextMiddleware extracts & validates:
   - x-tenant-id (required, must be UUID)
   - x-user-id (required, must be UUID)
   - x-facility-id (required, must be UUID)
   ↓
3. Stores in AsyncLocalStorage (RequestContext)
   ↓
4. Available to all services automatically
   ↓
5. Services use context for audit fields
   ↓
6. Prisma middleware auto-injects tenantId filter
```

### Code References

**Middleware:** `backend/services/clinical/src/common/middleware/tenant-context.middleware.ts`

```typescript
// Extract from JWT or headers
const userId = req.user?.id || req.user?.userId || req.headers['x-user-id'];
const facilityId = req.user?.facilityId || req.headers['x-facility-id'];

// Validate UUIDs
if (!userId || !uuidRegex.test(userId)) {
  throw new BadRequestException('User ID is required and must be a valid UUID');
}
if (!facilityId || !uuidRegex.test(facilityId)) {
  throw new BadRequestException('Facility ID is required and must be a valid UUID');
}

// Store in context
RequestContext.run({ tenantId, userId, userAgent }, () => {
  req.context = { tenantId, userId, facilityId, userRole, ipAddress, userAgent };
  next();
});
```

**Service Usage:** `backend/services/clinical/src/modules/patient/patient.service.ts`

```typescript
async registerPatient(dto: CreatePatientDto, context: RequestContext) {
  const patient = await this.prisma.patient.create({
    data: {
      // ... patient fields

      // Audit fields - automatically populated from context
      createdBy: context.userId,          // Guaranteed to be UUID
      createdAtFacility: context.facilityId, // Guaranteed to be UUID
    },
  });
  return patient;
}
```

## Testing with Postman

### Environment Variables

Set up these environment variables in Postman:

```
BASE_URL: http://localhost:3011/api/v1
TENANT_ID: 11111111-1111-1111-1111-111111111111
USER_ID: 550e8400-e29b-41d4-a716-446655440000
FACILITY_ID: 22222222-2222-2222-2222-222222222222
JWT_TOKEN: <your-actual-jwt-token>
```

### Pre-request Script

Add this to collection pre-request scripts:

```javascript
// Set headers automatically
pm.request.headers.add({
  key: 'x-tenant-id',
  value: pm.environment.get('TENANT_ID')
});
pm.request.headers.add({
  key: 'x-user-id',
  value: pm.environment.get('USER_ID')
});
pm.request.headers.add({
  key: 'x-facility-id',
  value: pm.environment.get('FACILITY_ID')
});
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('JWT_TOKEN')
});
```

## Security Considerations

### Why UUIDs are Required

1. **Type Safety** - Database columns are typed as UUID
2. **Referential Integrity** - Must match actual user/facility records
3. **Audit Trail** - Need to trace actions back to real users
4. **Compliance** - HIPAA/GDPR require identifying who accessed/modified data

### Multi-Tenant Isolation

- **Tenant ID** is automatically injected into all queries via Prisma middleware
- **Cross-tenant access** is prevented at the database layer
- **Row-Level Security** can be enabled for additional protection

### Audit Compliance

All database operations are tracked with:
- **Who**: `createdBy` / `updatedBy` (user UUID)
- **Where**: `createdAtFacility` / `updatedAtFacility` (facility UUID)
- **When**: `createdAt` / `updatedAt` (timestamp)
- **Which Tenant**: `tenantId` (automatic via middleware)

## Related Documentation

- [Multi-Tenancy Implementation](../multitenancy/TENANT-ISOLATION-IMPLEMENTATION.md)
- [Multi-Tenancy Quick Reference](../multitenancy/TENANT-ISOLATION-QUICK-REFERENCE.md)
- [API Documentation](./README.md)
- [Security & Compliance](../security/08-Security-&-Compliance.md)

---

**Last Updated**: 2025-10-24
**Applies To**: All API endpoints in Clinical, Foundation, and RCM services
