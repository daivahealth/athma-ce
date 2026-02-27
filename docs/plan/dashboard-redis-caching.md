# Dashboard Metrics Redis Caching - Implementation Plan

## Overview

This document describes the implementation of Redis caching for dashboard metrics in the AI Gateway service. The caching layer eliminates repeated database and LLM queries for dashboard metrics, significantly improving load times.

**Performance Improvement:**
- **Before:** 10 separate API calls -> LLM query planning -> SQL execution (~5-10s load time)
- **After:** 1 API call -> Redis cache lookup (~50-100ms load time)

## Architecture

```
Frontend                    AI Gateway                         Redis
   |                              |                               |
   | GET /dashboard/metrics       |                               |
   |----------------------------->| Check cache                   |
   |                              |------------------------------>|
   |                              |<------------------------------| (hit: return)
   |<-----------------------------|                               |
   |                              |                               |
   |                         Scheduled Job (configurable)         |
   |                              | Warm cache for all tenants    |
   |                              |------------------------------>|
```

## Implementation Summary

### Files Created

| File | Purpose |
|------|---------|
| `backend/services/ai-gateway/src/shared/redis/redis.module.ts` | Global Redis module for dependency injection |
| `backend/services/ai-gateway/src/shared/redis/redis.service.ts` | Redis client wrapper with typed get/set operations |
| `backend/services/ai-gateway/src/shared/redis/index.ts` | Module exports |
| `backend/services/ai-gateway/src/modules/report-builder/types/dashboard-cache.types.ts` | TypeScript interfaces for cache data |
| `backend/services/ai-gateway/src/modules/report-builder/services/dashboard-cache.service.ts` | Core caching logic with direct SQL queries |
| `backend/services/ai-gateway/src/modules/report-builder/jobs/dashboard-cache.job.ts` | Scheduled cache warming job |

### Files Modified

| File | Change |
|------|--------|
| `backend/services/ai-gateway/package.json` | Added `ioredis` dependency |
| `backend/services/ai-gateway/src/app.module.ts` | Imported `RedisModule` |
| `backend/services/ai-gateway/src/modules/report-builder/report-builder.module.ts` | Registered `DashboardCacheService` and `DashboardCacheJob` |
| `backend/services/ai-gateway/src/modules/report-builder/controllers/report.controller.ts` | Added dashboard endpoints |
| `frontend/src/modules/reporting/hooks/use-dashboard-metrics.ts` | Refactored to use cached endpoint |
| `backend/services/ai-gateway/.env.local` | Added Redis and cache configuration |

## Technical Details

### Cache Key Strategy

```
dashboard:metrics:{tenantId}:{currency}
```

Example: `dashboard:metrics:550e8400-e29b-41d4-a716-446655440000:INR`

### Configuration Options

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `REDIS_URL` | - | Redis connection URL (required for caching) |
| `DASHBOARD_CACHE_TTL_MINUTES` | 30 | Cache TTL in minutes |
| `DASHBOARD_CACHE_WARMING_ENABLED` | true | Enable/disable scheduled cache warming |

### API Endpoints

#### GET /api/v1/reports/dashboard/metrics

Returns cached dashboard metrics for the current tenant.

**Query Parameters:**
- `currency` (optional): Currency code (default: INR)

**Response:**
```json
{
  "metrics": {
    "revenueMTD": 150000,
    "revenueLastMonth": 140000,
    "revenueGrowth": 7.14,
    "totalPatients": 1250,
    "newPatientsThisMonth": 45,
    "patientGrowth": 3.6,
    "appointmentsToday": 28,
    "completedAppointments": 15,
    "encountersToday": 22,
    "unpaidInvoices": 34,
    "unpaidAmount": 45000,
    "overdueInvoices": 8,
    "overdueAmount": 12000,
    "appointmentCompletionRate": 53.57,
    "utilizationRate": 110,
    "cachedAt": "2024-01-15T10:30:00.000Z",
    "currency": "INR"
  },
  "fromCache": true,
  "ttlSeconds": 1450
}
```

#### POST /api/v1/reports/dashboard/refresh

Manually refreshes the dashboard metrics cache.

**Query Parameters:**
- `currency` (optional): Currency code (default: INR)

**Response:**
```json
{
  "success": true,
  "message": "Dashboard metrics cache refreshed successfully",
  "refreshedAt": "2024-01-15T10:35:00.000Z"
}
```

### Metrics Cached

| Metric | Source DB | Query Description |
|--------|-----------|-------------------|
| `revenueMTD` | RCM | Sum of invoice net amounts for current month |
| `revenueLastMonth` | RCM | Sum of invoice net amounts for previous month |
| `totalPatients` | Clinical | Total patient count |
| `newPatientsThisMonth` | Clinical | Patients created this month |
| `appointmentsToday` | Clinical | Appointments scheduled for today |
| `appointmentsThisWeek` | Clinical | Appointments for current week |
| `completedAppointments` | Clinical | Completed appointments today |
| `cancelledAppointments` | Clinical | Cancelled appointments today |
| `noShowAppointments` | Clinical | No-show appointments today |
| `encountersToday` | Clinical | Encounters created today |
| `encountersThisWeek` | Clinical | Encounters for current week |
| `unpaidInvoices` | RCM | Count of unpaid/partial invoices |
| `unpaidAmount` | RCM | Total balance due on unpaid invoices |
| `overdueInvoices` | RCM | Invoices overdue > 30 days |
| `overdueAmount` | RCM | Total balance on overdue invoices |
| `activeFacilities` | Foundation | Active facility count |

### Calculated Metrics

| Metric | Formula |
|--------|---------|
| `revenueGrowth` | `((revenueMTD - revenueLastMonth) / revenueLastMonth) * 100` |
| `patientGrowth` | `(newPatientsThisMonth / totalPatients) * 100` |
| `appointmentCompletionRate` | `(completedAppointments / appointmentsToday) * 100` |
| `utilizationRate` | `(encountersToday / 20) * 100` (capped at 100%) |

### Fallback Strategy

1. **Cache hit:** Return cached data with TTL information
2. **Cache miss:** Execute SQL queries, cache results, return data
3. **Redis unavailable:** Execute SQL queries directly (no caching)
4. **Partial query failure:** Return available metrics, use defaults for failed ones

### Scheduled Cache Warming

The `DashboardCacheJob` runs at the configured interval (default: 30 minutes) and:

1. Fetches all active tenants from Foundation database
2. Processes tenants in batches of 5 to avoid database overload
3. Warms cache for each tenant using their configured default currency
4. Logs success/failure statistics

## Testing

### Prerequisites

1. Redis must be running:
   ```bash
   docker-compose up -d redis
   ```

2. Environment variables configured in `.env.local`

### Manual Testing

1. Start the AI Gateway service:
   ```bash
   cd backend/services/ai-gateway
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Load dashboard at http://localhost:3000/en/dashboard

4. Check Redis for cached key:
   ```bash
   redis-cli KEYS "dashboard:metrics:*"
   redis-cli GET "dashboard:metrics:{tenantId}:INR"
   ```

5. Monitor logs for cache hits/misses:
   ```bash
   # In AI Gateway logs, look for:
   # "Dashboard metrics served from cache" (cache hit)
   # "Dashboard metrics cache miss - fetching from database" (cache miss)
   ```

### Verify Cache Warming

1. Check logs for scheduled job execution:
   ```
   "Starting dashboard cache warming for all tenants"
   "Dashboard cache warming completed"
   ```

2. Trigger manual warming via code or direct API call

## Monitoring

### Key Metrics to Track

- Cache hit rate
- Cache miss rate
- Query execution time (on cache miss)
- Number of tenants cached
- Redis memory usage

### Log Events

| Event | Log Level | Meaning |
|-------|-----------|---------|
| `Dashboard metrics served from cache` | DEBUG | Cache hit |
| `Dashboard metrics cache miss` | INFO | Cache miss, fetching from DB |
| `Dashboard cache warmed` | INFO | Single tenant cache populated |
| `Dashboard cache warming completed` | INFO | Scheduled job finished |
| `Failed to fetch metric` | ERROR | Individual metric query failed |

## Future Improvements

1. **Granular cache invalidation:** Invalidate specific metrics when underlying data changes
2. **Real-time updates:** WebSocket push when metrics change significantly
3. **Per-tenant TTL:** Configure different cache durations per tenant
4. **Metric-level caching:** Cache individual metrics with different TTLs
5. **Cache compression:** Compress large cached objects to save Redis memory
