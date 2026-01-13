# Zeal Services - Ports & Health Endpoints

This document lists all microservices in the Zeal platform with their assigned ports and health check endpoints.

## Service Port Assignments

| Service       | Port | Health Endpoint      | Description                           |
|---------------|------|----------------------|---------------------------------------|
| Foundation    | 3010 | `/api/v1/health`     | Core tenant, user, facility management |
| Clinical      | 3020 | `/api/v1/health`     | Clinical operations, appointments, EMR |
| RCM           | 3030 | `/api/v1/health`     | Revenue Cycle Management, billing     |
| Analytics     | 3040 | `/api/v1/health`     | Reporting, dashboards, data insights  |

## Local Development URLs

- **Foundation**: http://localhost:3010
- **Clinical**: http://localhost:3020
- **RCM**: http://localhost:3030
- **Analytics**: http://localhost:3040

## Health Check Details

All services implement a standardized health check endpoint at `/api/v1/health` that returns:

```json
{
  "status": "ok",
  "service": "foundation|clinical|rcm|analytics",
  "version": "1.0.0",
  "timestamp": "2025-10-26T12:00:00.000Z",
  "dependencies": {
    "database": "connected",
    "cache": "connected"
  }
}
```

### Health Check Response Codes

- **200 OK**: Service is healthy and all dependencies are available
- **503 Service Unavailable**: Service is degraded or dependencies are failing

## Database Connections

Each service connects to its designated database(s):

| Service    | Database(s)                                    |
|------------|------------------------------------------------|
| Foundation | `foundation_db` (PostgreSQL)                   |
| Clinical   | `clinical_db` (PostgreSQL)                     |
| RCM        | `rcm_db` (PostgreSQL)                          |
| Analytics  | `analytics_db` (PostgreSQL, Read replicas)     |

## Environment Variables

Each service requires the following environment variables:

```bash
# Service-specific
PORT=<service-port>
NODE_ENV=development|staging|production

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis (if caching enabled)
REDIS_URL=redis://localhost:6379

# Inter-service communication
FOUNDATION_BASE_URL=http://localhost:3010
CLINICAL_BASE_URL=http://localhost:3020
RCM_BASE_URL=http://localhost:3030
ANALYTICS_BASE_URL=http://localhost:3040

# Authentication
JWT_SECRET=<secret>
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
```

## Running Services Locally

### Start Individual Service
```bash
# From backend directory
npm run dev --workspace=@zeal/foundation
npm run dev --workspace=@zeal/clinical
npm run dev --workspace=@zeal/rcm
npm run dev --workspace=@zeal/analytics
```

### Start All Services (requires Turbo)
```bash
# From root directory
npm run dev
```

### Build All Services
```bash
npm run build
```

## Kubernetes/Docker Port Mappings

When deploying to Kubernetes or Docker Compose, services use internal ports:

```yaml
# docker-compose.yml example
services:
  foundation:
    ports:
      - "3010:3010"

  clinical:
    ports:
      - "3020:3020"

  rcm:
    ports:
      - "3030:3030"

  analytics:
    ports:
      - "3040:3040"
```

## Service Dependencies

```
┌─────────────┐
│  Analytics  │ (Reads from all services)
└──────┬──────┘
       │
┌──────▼──────┐
│     RCM     │ (Depends on Clinical & Foundation)
└──────┬──────┘
       │
┌──────▼──────┐
│  Clinical   │ (Depends on Foundation)
└──────┬──────┘
       │
┌──────▼──────┐
│ Foundation  │ (Base layer - no dependencies)
└─────────────┘
```

## Monitoring & Observability

All services expose:

- **Health endpoint**: `/api/v1/health`
- **Metrics endpoint** (Prometheus): `/metrics` (when enabled)
- **OpenAPI docs**: `/api/docs` (Swagger UI)
- **API spec**: `/api/docs/json` (OpenAPI JSON)

## Load Balancer / Ingress Configuration

Production deployments typically use:

```nginx
# Nginx/Ingress routing example
location /api/v1/foundation {
    proxy_pass http://foundation:3010;
}

location /api/v1/clinical {
    proxy_pass http://clinical:3020;
}

location /api/v1/rcm {
    proxy_pass http://rcm:3030;
}

location /api/v1/analytics {
    proxy_pass http://analytics:3040;
}
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3010

# Kill process
kill -9 <PID>
```

### Database Connection Issues
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# Check if database exists
psql -U postgres -c "\l"
```

### Service Not Responding
```bash
# Check service health
curl http://localhost:3010/api/v1/health

# Check service logs
npm run dev --workspace=@zeal/foundation
```

## See Also

- [Architecture Overview](./ARCHITECTURE.md)
- [Configuration Management](./CONFIG-IMPLEMENTATION-SUMMARY.md)
- [Development Guide](./DEVELOPMENT.md)
