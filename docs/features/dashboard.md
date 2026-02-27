# Dashboard Feature Documentation

## Overview

The HealthAI+ Dashboard provides real-time operational metrics for healthcare facilities. It displays key performance indicators (KPIs) across revenue, patients, appointments, encounters, and invoices domains.

## Dashboard Components

### AI Pulse Metrics

Three primary metric cards showing:

1. **Patient Growth** - New patient registrations and growth percentage
2. **Revenue Trend** - Month-to-date revenue with comparison to last month
3. **Clinical Load** - Today's encounters and utilization rate

### Operations Brief

Summary statistics including:

- **Completion Rate** - Percentage of completed appointments today
- **Encounters Today** - Number of clinical encounters
- **Revenue MTD** - Month-to-date revenue total

### Risk & Compliance Radar

Dynamic risk signals based on:

- Unpaid invoice count and amounts
- Overdue invoices (>30 days)
- Appointment completion rates

### Suggested AI Actions

AI-prioritized interventions based on current metrics, such as:

- Patient outreach suggestions
- Collections follow-up recommendations
- Capacity management alerts

### Quick Stats

Summary cards for:

- Total registered patients
- Unpaid invoice count
- Revenue month-to-date

## Data Sources

The dashboard aggregates data from two primary databases:

### Clinical Database
- Patient registration data
- Appointment schedules and status
- Encounter records

### RCM Database
- Invoice data
- Payment status
- Due date information

## Metrics Reference

### Revenue Metrics

| Metric | Description | Update Frequency |
|--------|-------------|------------------|
| Revenue MTD | Total net invoice amount for current month (excluding cancelled) | 30 min cache |
| Revenue Last Month | Total net invoice amount for previous month | 30 min cache |
| Revenue Growth | Percentage change from last month | Calculated |

### Patient Metrics

| Metric | Description | Update Frequency |
|--------|-------------|------------------|
| Total Patients | Count of all registered patients | 30 min cache |
| New Patients (Month) | Patients registered in current month | 30 min cache |
| Patient Growth | New patients as percentage of total | Calculated |

### Appointment Metrics

| Metric | Description | Update Frequency |
|--------|-------------|------------------|
| Appointments Today | All appointments scheduled for today | 30 min cache |
| Completed Today | Appointments with status 'completed' | 30 min cache |
| Cancelled Today | Appointments with status 'cancelled' | 30 min cache |
| No-Show Today | Appointments with status 'no_show' | 30 min cache |
| Completion Rate | Completed / Total today | Calculated |

### Encounter Metrics

| Metric | Description | Update Frequency |
|--------|-------------|------------------|
| Encounters Today | Encounters created today | 30 min cache |
| Encounters This Week | Encounters in current week | 30 min cache |
| Utilization Rate | Encounters / Expected capacity | Calculated |

### Invoice Metrics

| Metric | Description | Update Frequency |
|--------|-------------|------------------|
| Unpaid Invoices | Count of invoices with status 'unpaid' or 'partial' | 30 min cache |
| Unpaid Amount | Total balance due on unpaid invoices | 30 min cache |
| Overdue Invoices | Unpaid invoices with due_date > 30 days ago | 30 min cache |
| Overdue Amount | Total balance on overdue invoices | 30 min cache |

## Caching Architecture

The dashboard uses Redis caching to optimize performance:

### Cache Strategy

1. **Initial Load:** First request fetches from database and caches
2. **Subsequent Loads:** Serve from Redis cache (~50-100ms)
3. **Background Refresh:** Scheduled job warms cache every 30 minutes
4. **Manual Refresh:** Users can trigger refresh via UI button

### Cache Configuration

Configure via environment variables in AI Gateway service:

```bash
# Redis connection
REDIS_URL=redis://localhost:6379

# Cache duration (minutes)
DASHBOARD_CACHE_TTL_MINUTES=30

# Enable/disable background warming
DASHBOARD_CACHE_WARMING_ENABLED=true
```

### Cache Key Format

```
dashboard:metrics:{tenantId}:{currency}
```

Each tenant has separate cached metrics, scoped by currency.

## API Endpoints

### Get Dashboard Metrics

```http
GET /api/v1/reports/dashboard/metrics?currency=INR
```

**Headers:**
- `Authorization: Bearer {token}`
- `x-tenant-id: {tenantId}`
- `x-user-id: {userId}`
- `x-facility-id: {facilityId}`

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
    "appointmentCompletionRate": 53.57,
    "utilizationRate": 110,
    "cachedAt": "2024-01-15T10:30:00.000Z",
    "currency": "INR"
  },
  "fromCache": true,
  "ttlSeconds": 1450
}
```

### Refresh Dashboard Cache

```http
POST /api/v1/reports/dashboard/refresh?currency=INR
```

Forces a cache refresh for the current tenant.

## Frontend Integration

### Using the Hook

```typescript
import { useDashboardMetrics } from '@/modules/reporting/hooks/use-dashboard-metrics';

function Dashboard() {
  const { data: currency } = useResolveConfig('finance.currency');
  const { data, isLoading, refetch } = useDashboardMetrics(currency ?? 'INR');

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      <MetricCard
        title="Revenue MTD"
        value={formatCurrency(data.revenueMTD, currency)}
        trend={data.revenueGrowth}
      />
      {/* ... other metrics */}
    </div>
  );
}
```

### Available Data

The `useDashboardMetrics` hook returns:

```typescript
{
  data: DashboardMetrics;      // All metrics
  isLoading: boolean;          // Loading state
  isError: boolean;            // Error state
  isFetching: boolean;         // Background refetch
  fromCache: boolean;          // Whether data came from cache
  ttlSeconds: number;          // Remaining cache TTL
  refetch: () => Promise<void>; // Force refresh
}
```

## Currency Support

The dashboard supports multi-currency display:

1. Currency is resolved from tenant configuration (`finance.currency`)
2. Passed to the metrics endpoint as query parameter
3. Cached separately per currency per tenant

Supported currencies depend on tenant configuration.

## Troubleshooting

### Metrics Not Loading

1. Check AI Gateway service is running on port 3015
2. Verify Redis is running: `docker-compose up -d redis`
3. Check browser console for API errors
4. Verify tenant headers are being sent

### Stale Data

1. Click the refresh button to force cache update
2. Check Redis connection: `redis-cli PING`
3. Verify cache warming job is running in logs

### Cache Not Working

1. Check `REDIS_URL` is configured in `.env.local`
2. Verify Redis is accessible from AI Gateway
3. Check logs for "Redis not available" warnings

## Related Documentation

- [Dashboard Redis Caching Implementation](../plan/dashboard-redis-caching.md)
- [Frontend Architecture](../architecture/FRONTEND-ARCHITECTURE-RECOMMENDATION.md)
- [Multi-Tenancy](../multitenancy/TENANT-ISOLATION-IMPLEMENTATION.md)
