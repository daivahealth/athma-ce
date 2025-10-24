# API Documentation

This folder contains API documentation, Postman collections, and API-related guides.

## 📂 Folder Structure

### [postman/](./postman/)
Postman collections and API testing documentation:
- Postman collection files (JSON)
- API endpoint guides
- Testing scenarios and examples
- Authentication setup guides

## 📚 API Documentation

### Postman Collections

The Postman collections provide comprehensive API testing coverage for all services:

1. **Clinical Service APIs**
   - Patient management endpoints
   - Encounter and visit endpoints
   - Clinical data capture endpoints
   - Consent management endpoints

2. **Foundation Service APIs**
   - Facility hierarchy endpoints (see [postman/FACILITY-ENDPOINTS-GUIDE.md](./postman/FACILITY-ENDPOINTS-GUIDE.md))
   - User and staff management endpoints
   - Specialty management endpoints
   - Identity management endpoints
   - Scheduling endpoints

3. **RCM Service APIs**
   - Billing and invoicing endpoints
   - Claims management endpoints
   - Payment processing endpoints

4. **Analytics Service APIs**
   - Reporting endpoints
   - Dashboard data endpoints
   - Audit trail endpoints

### API Conventions

All APIs follow consistent patterns:

#### Authentication
```
Authorization: Bearer <jwt-token>
x-tenant-id: <tenant-uuid>
x-facility-id: <facility-uuid> (optional)
```

#### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-10-24T12:00:00Z"
}
```

#### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [ ... ]
  },
  "timestamp": "2025-10-24T12:00:00Z"
}
```

#### Pagination
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🔐 API Security

### Multi-Tenant Isolation

All APIs enforce tenant isolation:
- `x-tenant-id` header required on all requests (except health checks)
- Automatic tenant filtering at database layer
- Cross-tenant access prevented by middleware

See [Multi-Tenancy Documentation](../multitenancy/) for details.

### Authentication & Authorization

- **JWT-based authentication** for all API endpoints
- **Role-based access control** (RBAC) enforcement
- **API rate limiting** to prevent abuse
- **CORS configuration** for web clients

## 📝 API Endpoints

### Base URLs

- **Clinical Service**: `http://localhost:3011/api/v1`
- **Foundation Service**: `http://localhost:3001/api/v1`
- **RCM Service**: `http://localhost:3012/api/v1`
- **Analytics Service**: `http://localhost:3013/api/v1`

### Common Endpoints

#### Health Check
```
GET /health
Response: { "status": "ok", "timestamp": "..." }
```

#### API Version
```
GET /version
Response: { "version": "1.0.0", "build": "..." }
```

### Service-Specific Endpoints

Refer to individual service documentation:
- [Clinical APIs](../features/patient-management/)
- [Facility APIs](./postman/FACILITY-ENDPOINTS-GUIDE.md)
- [Specialty APIs](../features/specialty-management/)
- [User APIs](../features/user-management/)

## 🧪 Testing with Postman

### Setup

1. Import the Postman collection from `postman/`
2. Set up environment variables:
   - `BASE_URL` - Service base URL
   - `AUTH_TOKEN` - JWT authentication token
   - `TENANT_ID` - Your tenant UUID
   - `FACILITY_ID` - Your facility UUID (if needed)

3. Run collection tests

### Test Scenarios

Collections include tests for:
- ✅ Successful operations
- ❌ Validation errors
- 🔒 Authorization checks
- 🔄 CRUD operations
- 📊 Pagination and filtering
- 🔍 Search functionality

## 📊 API Metrics

### Performance Targets

- **Response Time**: P95 < 200ms, P99 < 500ms
- **Throughput**: 10,000+ requests/second
- **Availability**: 99.9% uptime
- **Error Rate**: < 0.1%

### Monitoring

All APIs are monitored for:
- Request rates and throughput
- Response times and latency
- Error rates by endpoint
- Authentication failures
- Rate limit violations

## 📖 Related Documentation

- [Multi-Tenancy](../multitenancy/) - Tenant isolation in APIs
- [Security](../security/) - API security and authentication
- [Backend Implementation](../implementation/backend/) - API implementation details
- [Features](../features/) - Feature-specific API documentation

## 🔗 Quick Links

- [Main README](../README.md)
- [Postman Collections](./postman/)
- [Facility API Guide](./postman/FACILITY-ENDPOINTS-GUIDE.md)
- [Multi-Tenancy API Design](../multitenancy/API-DESIGN-TENANT-VS-USER-OPERATIONS.md)
