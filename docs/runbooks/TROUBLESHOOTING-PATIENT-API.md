# Troubleshooting: Patient API Error

**Error:** "Error loading patients. Please try again."

## Quick Diagnosis

### Step 1: Check Debug Page

Navigate to: **http://localhost:3000/en/debug**

This page shows:
- ✅ Whether you have an access token
- ✅ What claims are in your JWT token
- ✅ Whether required fields (tenantId, userId, facilityId) are present

### Step 2: Check Browser Console

Open browser DevTools (F12) and look for:

```
API Request Headers: {
  url: "/patients",
  hasAuth: true/false,
  tenantId: "...",
  userId: "...",
  facilityId: "...",
  claims: { ... }
}
```

### Step 3: Check Network Tab

In DevTools Network tab, click on the failed `/patients` request and check:

1. **Request Headers** - Should have:
   ```
   Authorization: Bearer <token>
   x-tenant-id: <uuid>
   x-user-id: <uuid>
   x-facility-id: <uuid>
   ```

2. **Response** - Check the error message

## Common Issues & Solutions

### Issue 1: Not Logged In
**Symptoms:**
- `hasAuth: false` in console
- No access token in debug page

**Solution:**
1. Go to http://localhost:3000/en/login
2. Login with valid credentials
3. Return to patients page

### Issue 2: JWT Token Missing Required Claims
**Symptoms:**
- `hasAuth: true` but tenantId/userId/facilityId are undefined
- Error: "Tenant ID is required" or "User ID required"

**Solution:**
Backend needs to include these in JWT token when user logs in.

Check backend Foundation service `auth.service.ts`:
```typescript
// JWT payload should include:
{
  sub: user.id,           // OR userId
  userId: user.id,
  email: user.email,
  tenantId: user.tenantId,
  facilityId: user.defaultFacilityId, // or selected facility
  roles: user.roles
}
```

### Issue 3: Clinical Service Not Running
**Symptoms:**
- Error: "Network Error" or "ERR_CONNECTION_REFUSED"
- Can't reach http://localhost:3011

**Solution:**
```bash
cd backend/services/clinical
npm run dev
```

Verify it's running:
```bash
curl http://localhost:3011/api/v1/patients
# Should return: "Tenant ID is required" (400) - this is correct!
```

### Issue 4: CORS Error
**Symptoms:**
- Error: "CORS policy blocked"
- See CORS error in browser console

**Solution:**
Check Clinical service CORS configuration allows `http://localhost:3000`:

```typescript
// backend/services/clinical/src/main.ts
app.enableCors({
  origin: ['http://localhost:3000'],
  credentials: true,
});
```

## Testing the Full Flow

### 1. Test Login
```bash
curl -X POST http://localhost:3010/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@zeal.local",
    "password": "yourpassword",
    "mfaCode": null,
    "deviceId": "web-client",
    "rememberMe": true
  }'
```

**Check response includes:**
- `accessToken`
- Token should decode to include: `tenantId`, `userId`/`sub`, `facilityId`

### 2. Decode JWT Token
Use https://jwt.io to decode the token and verify it contains:
```json
{
  "sub": "<user-id-uuid>",
  "tenantId": "<tenant-id-uuid>",
  "facilityId": "<facility-id-uuid>",
  "email": "admin@zeal.local",
  ...
}
```

### 3. Test Patients API with Token
```bash
curl http://localhost:3011/api/v1/patients \
  -H "Authorization: Bearer <your-token>" \
  -H "x-tenant-id: <tenant-uuid>" \
  -H "x-user-id: <user-uuid>" \
  -H "x-facility-id: <facility-uuid>"
```

Should return list of patients (or empty array).

## Expected Backend Services

Make sure these are running:

| Service | Port | Check URL |
|---------|------|-----------|
| Foundation | 3010 | http://localhost:3010/api/v1/auth/login |
| Clinical | 3011 | http://localhost:3011/api/v1/patients |
| Frontend | 3000 | http://localhost:3000 |

## Quick Fix Checklist

- [ ] Foundation service running on port 3010
- [ ] Clinical service running on port 3011
- [ ] Frontend running on port 3000
- [ ] Database is running and migrated
- [ ] You are logged in (have access token)
- [ ] JWT token contains tenantId, userId, facilityId
- [ ] Browser console shows headers being sent
- [ ] No CORS errors in console

## Still Not Working?

1. **Clear browser cache and cookies**
2. **Logout and login again**
3. **Check backend logs** for errors
4. **Verify seed data** exists in database

---

**Need Help?**
- Check browser console for detailed error messages
- Check backend service logs
- Visit debug page: http://localhost:3000/en/debug
