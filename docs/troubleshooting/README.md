# Troubleshooting Guide

This folder contains troubleshooting documentation, bug fix records, and common issues encountered during development.

## Contents

### Bug Fixes

Documentation of significant bugs and their resolutions:

- [Foundation Wards Endpoint Fix](./FOUNDATION-WARDS-ENDPOINT-FIX.md) - Ward board endpoint routing issues
- [Duplicate v1 Path Fix](./DUPLICATE-V1-PATH-FIX.md) - URL path duplication in PRM service

### Common Issues

- [Patient API Troubleshooting](./TROUBLESHOOTING-PATIENT-API.md) - Common patient API errors

## Quick Troubleshooting

### Database Issues

#### Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Ensure PostgreSQL is running:
```bash
docker-compose up -d postgres
```

#### Migration Failed
```
Error: P3009 migrate found failed migrations
```

**Solution**: Reset and re-run migrations:
```bash
npx prisma migrate reset --schema prisma/schema.prisma
```

### Service Issues

#### Port Already in Use
```
Error: listen EADDRINUSE :::3010
```

**Solution**: Kill the existing process:
```bash
lsof -ti:3010 | xargs kill -9
```

#### JWT Token Invalid
```
Error: JsonWebTokenError: invalid signature
```

**Solution**: Ensure JWT secrets match between services. Check `.env.local` files.

#### Tenant Not Found
```
Error: Tenant with ID 'xxx' not found
```

**Solution**: Verify tenant exists in database and `x-tenant-id` header is correct.

### Frontend Issues

#### Module Not Found
```
Module not found: Can't resolve '@/lib/api/client'
```

**Solution**: Check `tsconfig.json` paths and run:
```bash
npm install
```

#### Hydration Mismatch
```
Warning: Text content did not match.
```

**Solution**: Ensure server and client render the same content. Check for:
- Date formatting differences
- Browser-specific code in SSR
- Missing `use client` directive

### API Issues

#### 401 Unauthorized
Possible causes:
1. Token expired - Client should auto-refresh
2. Invalid token - Re-login required
3. Missing `Authorization` header

#### 403 Forbidden
Possible causes:
1. User lacks required permission
2. Wrong tenant context
3. Facility restriction

#### 404 Not Found
Possible causes:
1. Incorrect endpoint URL
2. Missing URL parameters
3. Resource deleted/archived

## Logging

### Backend Service Logs

View logs with debug level:
```bash
npm run dev:debug --workspace=@zeal/foundation
```

### Database Query Logs

Enable in Prisma schema:
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["tracing"]
}
```

### Frontend Console

Enable API logging in development:
```typescript
// In api/client.ts
if (process.env.NODE_ENV === 'development') {
  console.log('API Request:', config);
}
```

## Getting Help

1. Check this documentation first
2. Search existing issues in GitHub
3. Review relevant ADRs in `docs/adr/`
4. Check service-specific READMEs
5. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Relevant logs

## Contributing

When fixing a bug:

1. Document the issue and solution
2. Add to this troubleshooting guide
3. Update relevant tests
4. Consider adding to runbooks if operational
